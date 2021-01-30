import {Request, Response} from 'express';
import {Sequelize} from 'sequelize-typescript';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Order} from '../../../models/order.model';

/**
 * Get referrer stats(count)
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function getReferrerStats(req: Request, res: Response): Promise<Response> {
    let success = true;
    // Select and count all Orders grouped by referrer
    const result = await Order.findAll(
        {
            attributes: ['referrer', [Sequelize.fn('COUNT', Sequelize.col('referrer')), 'count']],
            group: 'referrer',
        })
        .catch(() => {
            success = false;
            return [];
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    return res.send(wrapResponse(true, result));
}
