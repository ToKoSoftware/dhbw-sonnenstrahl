import { Request, Response } from "express";
import { wrapResponse } from "../../../functions/response-wrapper";
import { Customer } from "../../../models/customer.models";
import { Order } from "../../../models/order.model";
import { Plan } from "../../../models/plan.model";
import { User } from "../../../models/user.model";
import { Vars } from "../../../vars";

export async function getStats(req: Request, res: Response) {
    const usersCount = await countTotalEntities(User);

    const activePlansCount = await countTotalEntities(Plan, true);

    const inactivePlansCount = await countTotalEntities(Plan, false);

    const activeCustomersCount = await countTotalEntities(Customer, true);

    const inactiveCustomersCount = await countTotalEntities(Customer, false,);

    const activeOrdersCount = await countTotalEntities(Order, true);

    const inactiveOrdersCount = await countTotalEntities(Order, false);


    const data = {
        "users": usersCount,
        "activePlans": activePlansCount,
        "inactivePlans": inactivePlansCount,
        "activeCustomers": activeCustomersCount,
        "inactiveCustomers": inactiveCustomersCount,
        "activeOrders": activeOrdersCount,
        "inactiveOrder": inactiveOrdersCount
    };

    return res.send(wrapResponse(true, data))
}

async function countTotalEntities(model: typeof User | typeof Customer | typeof Plan | typeof Order, is_active: boolean = true): Promise<number> {
    let count;
    if (model !== User) {
        count = await model.count(
            {
                where: {
                    is_active: is_active
                }
            })
            .catch(error => {
                return 0;
            });
    } else {
        count = await model.count()
            .catch(error => {
                return 0;
            });

    }
    return count;
}