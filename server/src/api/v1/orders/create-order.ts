import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {IncomingOrder, InternalOrder} from '../../../interfaces/orders.interface';
import {Order} from '../../../models/order.model';
import {mapOrder} from '../../../functions/map-order.func';
import {objectHasRequiredAndNotEmptyKeys} from '../../../functions/check-inputs.func';
import {Plan} from '../../../models/plan.model';
import {Vars} from '../../../vars';

export async function createOrder(req: Request, res: Response) {
    const incomingData: IncomingOrder = req.body;
    const mappedIncomingData: InternalOrder = mapOrder(incomingData);
    
    let requiredFields = Order.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        res.status(400).send(wrapResponse(false, {error: 'Not all required fields have been set'}));
        return;
    }
    let plan: Plan | null = await Plan.findOne(
        {
            where: {
                id: mappedIncomingData.planId,
                is_active: true
            }
        }
    ).catch((error) => {
        Vars.loggy.warn("An Error occured:", error);
        return null;
    });
    if (plan === null) {
        res.status(404).send(wrapResponse(false, {error: 'Plan cannot be found'}));
        return;
    }

    let data = await Order.create(mappedIncomingData).then((res) => res).catch(error => null);
    if (data === null) {
        return res.status(500).send(wrapResponse(false, {error: 'Could not create Order'}));
    }
    return res.send(wrapResponse(true, data));
}
