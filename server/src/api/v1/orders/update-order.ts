import { Request, Response } from "express";
import isBlank from "is-blank";
import { wrapResponse } from "../../../functions/response-wrapper";
import { Order } from "../../../models/order.model";

export async function updateOrder(req: Request, res: Response) {
    let success = true;
    let data;

    if (isBlank(req.body) || req.params.id === null) {
        return res.send(wrapResponse(success, { error: "No body or valid param set." }));

    } else {
        await Order.findOne(
            {
                where: {
                    id: req.params.id
                }
            })
            .then((foundOrder) => data = foundOrder)
            .catch(error => {
                success = false;
                data = null;
            });
    }

    //Order Objekt from database must not be null, to change it.
    if (data !== null) {
        await Order.update(
            { 
                req.body //TODO: Wie is hier die richtige syntax? Laut Bespiel isses genau so machbar mit .update().
            }, 
            {
                where: {
                    id: req.params.id
                }
            })
            .then((updatedOrder) => data = updatedOrder)
            .catch(error => {
                success = false;
                return res.send(wrapResponse(success, { error: "Update failed." }));
            });
    } else {
        success = false;
        return res.send(wrapResponse(success, { error: "No order with given id found" }));
    }

    return res.send(wrapResponse(success, { data: data }));
}