import {Request, Response} from 'express';
import {Sequelize} from 'sequelize-typescript';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Order} from '../../../models/order.model';
import { Vars } from '../../../vars';

export async function getMonthlOrderStatsByReferrer(req: Request, res:Response): Promise<Response> {
    let success = true;
    const referrer = await Order.findAll(
        {
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('referrer')) ,'referrer']],
            raw: true
        })
        .catch(() => {
            success = false;
            return [];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    const result: monthlyOrderStats[] = [];
    referrer.forEach(async el => {
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
    });
    
    return res.send(wrapResponse(true, result));
}
interface monthlyOrderStats{
    referrer: string,
    count: number | {[key: string]: number}
}