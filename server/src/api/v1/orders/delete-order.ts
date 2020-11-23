import { Request, Response } from "express";
import { wrapResponse } from "../../../functions/response-wrapper";
import { Order } from "../../../models/order.model";

export async function deleteOrder(req: Request, res: Response) {
    await Order.destroy(
        {
       		where: {
            id: req.params.id
        }}
    ).
    catch(error => {
        return res.status(400).send(wrapResponse(false, {error: 'Could not delete Order with id ' + req.params.id}));
    });
    return res.send(wrapResponse(true));
}
