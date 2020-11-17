import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {IncomingOrder, InternalOrder} from '../../../interfaces/orders.interface';
import {Order} from '../../../models/order.model';
import {mapOrder} from '../../../functions/map-order.func';
import {objectHasRequiredAndNotEmptyKeys} from '../../../functions/checkInputs.func';
import {Plan} from '../../../models/plan.model';
import {Vars} from '../../../vars';

export async function createOrder(req: Request, res: Response) {
    const incomingData: IncomingOrder = req.body;

    let requiredFields = Order.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(incomingData, requiredFields)) {
        res.send(wrapResponse(false, {error: 'Not all required fields have been set'}));
        return;
    }
    const mappedIncomingData: InternalOrder = mapOrder(incomingData);
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
        res.send(wrapResponse(false, {error: 'Plan cannot be found2'}));
        return;
    }

    let data = await Order.create(mappedIncomingData).then((res) => res).catch(error => null);
    if (data === null) {
        return res.send(wrapResponse(false, {error: 'Could not create Order'}));
    }
    return res.send(wrapResponse(true, data));
}
