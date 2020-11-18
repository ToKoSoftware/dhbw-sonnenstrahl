import { Request, Response } from "express";
import isBlank from "is-blank";
import { checkRequestKeysAreNotEmpty } from "../../../functions/checkInputs.func";
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
    if (data !== null && req.body.id === null && checkRequestKeysAreNotEmpty(req)) {
        await Order.update(
            req.body, 
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
    } else if(checkRequestKeysAreNotEmpty(req) === false) {
        success = false;
        return res.send(wrapResponse(success, { error: "Fields must not be empty" }));
    } else if(req.body.id != null) {
        success = false;
        return res.send(wrapResponse(success, { error: "ID must not be changed" }));
    } else {
        success = false;
        return res.send(wrapResponse(success, { error: "No order with given id found" }));
    }

    return res.send(wrapResponse(success, { data: data }));
}