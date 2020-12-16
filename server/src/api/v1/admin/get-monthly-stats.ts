import {Request, Response} from 'express';
import {Sequelize} from 'sequelize-typescript';
import {wrapResponse} from '../../../functions/response-wrapper';
import {statEntityTypes} from '../../../interfaces/stats.interface';
import {Customer} from '../../../models/customer.models';
import {Order} from '../../../models/order.model';
import {Plan} from '../../../models/plan.model';
import {User} from '../../../models/user.model';

export async function getMonthlyStats(req: Request, res: Response): Promise<Response>  {
    const customerCount = await countMonthlyEntities(Customer);
    const userCount = await countMonthlyEntities(User);
    const planCount = await countMonthlyEntities(Plan);
    const orderCount = await countMonthlyEntities(Order);

    const data = {
        'customers': customerCount,
        'users': userCount,
        'plans': planCount,
        'orders': orderCount
    };
    return res.send(wrapResponse(true, data));
}

async function countMonthlyEntities(model: statEntityTypes) {
    const count = await model.count(
        {
            group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt'))]
        })
        .catch(error => {
            return 0;
        });

    return count;
}

