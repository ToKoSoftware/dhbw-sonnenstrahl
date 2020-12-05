import { Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import { wrapResponse } from "../../../functions/response-wrapper";
import { Customer } from "../../../models/customer.models";
import { Order } from "../../../models/order.model";
import { Plan } from "../../../models/plan.model";
import { User } from "../../../models/user.model";

export async function getMonthlyStats(req: Request, res: Response) {
    const customerCount = await countMonthlyEntities(Customer);
    const userCount = await countMonthlyEntities(User);
    const planCount = await countMonthlyEntities(Plan);
    const orderCount = await countMonthlyEntities(Order);

    const data = {
        "customers": customerCount,
        "users": userCount,
        "plans": planCount,
        "orders": orderCount
    }
    res.send(wrapResponse(true, data));
}

async function countMonthlyEntities(model: typeof User | typeof Customer | typeof Plan | typeof Order) {
    let success = true;
    let count = await model.count(
        {
            group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt'))]
        })
        .catch(error => {
            success = false;
            return 0;
        });

    return count;
}