import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Order} from '../../../models/order.model';
import {Plan} from '../../../models/plan.model';

export async function deletePlan(req: Request, res: Response): Promise<Response> {
    let success = true;

    const activeOrders: Order | null = await Order.findOne(
        {
            where: {
                planId: req.params.id,
                terminatedAt: null
            }
        })
        .catch(error => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (activeOrders !== null) {
        return res.status(400).send(wrapResponse(false, {error: 'The given planId has active Orders and can not be deleted'}));
    }

    const updateResult = await Plan.update(
        {
            is_active: false
        },
        {
            where: {
                id: req.params.id
            },
            returning: true,
        })
        .catch(error => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (updateResult === null || updateResult[0] == 0) {
        return res.status(404).send(wrapResponse(false, {error: 'No plan updated'}));
    }
    return res.send(wrapResponse(true));
}
