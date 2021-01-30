import {Request, Response} from 'express';
import {Sequelize} from 'sequelize-typescript';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Order} from '../../../models/order.model';

/**
 * Calculate monthly order stats grouped by referrer
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function getMonthlyOrderStatsByReferrer(req: Request, res: Response): Promise<Response> {
    let success = true;
    // Get all distinct referrers
    const referrer: Order[] | [] = await Order.findAll(
        {
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('referrer')), 'referrer']],
            raw: true
        })
        .catch(() => {
            success = false;
            return [];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    const result: MonthlyOrderStats[] = [];
    // Go through all referrers and count summed orders grouped by month
    for (const el of referrer) {
        const countData = await Order.count(
            {
                where: {
                    referrer: el.referrer
                },
                group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt'))]
            })
            .catch(() => {
                success = false;
                return 0;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
        }
        result.push({
            referrer: el.referrer,
            count: countData
        });
    }
    return res.send(wrapResponse(true, result));
}

interface MonthlyOrderStats {
    referrer: string,
    /** is never number but always string,
     * because of Sequelize.count() retuning count: '9' instead of count: 9
     */
    count: number | { [key: string]: string | number }
}
