import { Request, Response } from "express";
import { wrapResponse } from "../../../functions/response-wrapper";
import { Order } from "../../../models/order.model";

export async function terminateOrder(req: Request, res: Response) {
    let success = true;
    let order: Order | null = await Order.findOne(
        {
            where: {
                id: req.params.id
            }
        })
        .catch(error => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (order === null) {
        return res.status(400).send(wrapResponse(false, { error: 'Count not find Order with id: ' + req.params.id }))
    } else if (order.terminatedAt !== null) {
        return res.status(400).send(wrapResponse(false, { error: 'Order already terminated' }));
    }
    let updatedOrder = await Order.update({ terminatedAt: Date.now() },
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
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (updatedOrder === null || updatedOrder[0] == 0) {
        return res.status(404).send(wrapResponse(false, { error: 'Could not terminate Order with id ' + req.params.id }));
    }

    return res.send(wrapResponse(true, updatedOrder[1]));
}