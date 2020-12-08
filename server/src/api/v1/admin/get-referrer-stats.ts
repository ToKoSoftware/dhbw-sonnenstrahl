import { Request, Response } from "express";
import { wrap } from "module";
import { Sequelize } from "sequelize-typescript";
import { wrapResponse } from "../../../functions/response-wrapper";
import { Order } from "../../../models/order.model";

export async function getReferrerStats(req: Request, res: Response) {
    let success = true;
    let result = await Order.findAll(
        {
            attributes: ['referrer', [Sequelize.fn('COUNT', Sequelize.col('referrer')), 'count']],
            group: 'referrer',
        })
        .catch(error => {
            success = false;
            return [];
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (result === []) {
        return res.status(404).send(wrapResponse(false, { error: 'No refferrer found' }));
    }

    res.send(wrapResponse(true, result));
}