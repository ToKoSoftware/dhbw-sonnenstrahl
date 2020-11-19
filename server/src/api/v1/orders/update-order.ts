import { Request, Response } from "express";
import isBlank from "is-blank";
import { checkRequestKeysAreNotEmpty } from "../../../functions/checkInputs.func";
import { mapOrder } from "../../../functions/map-order.func";
import { wrapResponse } from "../../../functions/response-wrapper";
import { IncomingOrder, InternalOrder } from "../../../interfaces/orders.interface";
import { Order } from "../../../models/order.model";

export async function updateOrder(req: Request, res: Response) {
    let success = true;
    let d;
    const incomingData: IncomingOrder = req.body;
    const mappedIncomingData: InternalOrder = mapOrder(incomingData);
    
    let requiredFields = Order.requiredFields();

    if (isBlank(req.body) || req.params.id === null) {
        return res.send(wrapResponse(success, { error: "No body or valid param set." }));

    } else {
        d = await Order.findOne(
            {
                where: {
                    id: req.params.id
                }
            })
            .catch(error => {
                success = false;
                d = null;
            });
    }

    //Order Objekt from database must not be null, to change it.
    if (d !== null && (req.body.id === undefined || req.params.id === req.body.id) &&  checkRequestKeysAreNotEmpty(mappedIncomingData, requiredFields) !== false){
        d = await Order.update(
            req.body, 
            {
                where: {
                    id: req.params.id
                }
            })
            .catch(error => {
                success = false;
                return res.send(wrapResponse(success, { error: "Update failed." }));
            });

    }else if (d === null){
        success = false;
        return res.send(wrapResponse(success, { error: "No order with given id found" }));

    } else if(checkRequestKeysAreNotEmpty(mappedIncomingData, requiredFields) === false) { //TODO NOT WORKING!
        success = false;
        return res.send(wrapResponse(success, { error: "Fields must not be empty" }));

    } else if(req.body.id !== undefined || req.params.id !== req.body.id) {
        success = false;
        return res.send(wrapResponse(success, { error: "ID must not be changed" }));
    } else {
        success = false;
        return res.send(wrapResponse(success));
    }

    d = await Order.findOne(
        {
            where: {
                id: req.params.id
            }
        })
        .catch(error => {
            success = false;
            d = null;
        });

    return res.send(wrapResponse(success, { data: d }));
}