import { Request, Response } from "express";
import isBlank from "is-blank";
import { checkKeysAreNotEmptyOrNotSet } from "../../../functions/check-inputs.func";
import { mapUpdateOrder } from "../../../functions/map-order.func";
import { wrapResponse } from "../../../functions/response-wrapper";
import { IncomingUpdateOrder, InternalOrder } from "../../../interfaces/orders.interface";
import { Order } from "../../../models/order.model";

export async function updateOrder(req: Request, res: Response) {
    let d;
    const incomingData: IncomingUpdateOrder = req.body;
    const mappedIncomingData: InternalOrder = mapUpdateOrder(incomingData);
    
    let requiredFields = Order.requiredFields();

    if (isBlank(req.body) || req.params.id === null) {
        return res.send(wrapResponse(false, { error: "No body or valid param set." }));

    } else {
        d = await Order.findOne(
            {
                where: {
                    id: req.params.id
                }
            })
            .catch(error => {
                d = null;
            });
    }

    //Order Objekt from database must not be null, to change it.
    if (d !== null && (req.body.id === undefined || req.params.id === req.body.id) &&  checkKeysAreNotEmptyOrNotSet(mappedIncomingData, requiredFields) !== false){
       
        d = await Order.update(
            req.body, 
            {
                where: {
                    id: req.params.id
                }
            })
            .catch(error => {
                return res.send(wrapResponse(false, { error: "Update failed." }));
            });

    } else if (d === null) {
        return res.send(wrapResponse(false, { error: "No order with given id found" }));

    } else if(checkKeysAreNotEmptyOrNotSet(mappedIncomingData, requiredFields) === false) {
        return res.send(wrapResponse(false, { error: "Fields must not be empty" }));

    } else if(req.body.id !== undefined || req.params.id !== req.body.id) {
        return res.send(wrapResponse(false, { error: "ID must not be changed" }));
    } else {
        return res.send(wrapResponse(false));
    }

    let success = true;
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
