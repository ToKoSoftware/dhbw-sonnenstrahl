import { Request, Response } from "express";
import { wrapResponse } from "../../../functions/response-wrapper";
import { Order } from "../../../models/order.model";

export async function deleteOrder(req: Request, res: Response) {
    let success = true
    let destroyedRows = await Order.destroy(
        {
            where: {
                id: req.params.id
            }
        })
        .catch(error => {
            success = false;
            return null;
        });

    if (destroyedRows == 0) {
        return res.status(400).send(wrapResponse(false, { error: 'There is no order to delete with this id' }));
    }
    return res.send(wrapResponse(true));
}
