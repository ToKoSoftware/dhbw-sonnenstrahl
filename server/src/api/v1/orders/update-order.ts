import { Request, Response } from "express";
import isBlank from "is-blank";
import { mapPlan } from "../../../functions/map-plan.func";
import { wrapResponse } from "../../../functions/response-wrapper";
import { InternalOrder } from "../../../interfaces/orders.interface";
import { InternalPlan } from "../../../interfaces/plan.interface";
import { Order } from "../../../models/order.model";

export async function updateOrder(req: Request, res: Response) {
    let success = true;
    let data;
    try {
        if (isBlank(req.body) || req.params.id === null) {
            throw 'No body or valid param set.';
        }
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
                }
            );
    } catch (e) {
        res.send(wrapResponse(success, {error: e}));
        return;
    }
    //Order Objekt from database must not be null, to change it.
    if(data !== null){
        //TODO: params finden, die gesetzt sind, params neu setzen, neuen Datensatz zurückgeben.
    }else{
        success = false;
    }

    return res.send(wrapResponse(success, {data: data}));
}