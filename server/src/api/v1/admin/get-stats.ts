import { Request, Response } from "express";
import { wrapResponse } from "../../../functions/response-wrapper";
import { Customer } from "../../../models/customer.models";
import { Order } from "../../../models/order.model";
import { Plan } from "../../../models/plan.model";
import { User } from "../../../models/user.model";
import { Vars } from "../../../vars";

export async function getStats(req: Request, res: Response) {
    const usersCount = await countEntities(User);

    const activePlansCount = await countEntities(Plan, true);

    const inactivePlansCount = await countEntities(Plan, false);

    const activeCustomersCount = await countEntities(Customer, true);

    const inactiveCustomersCount = await countEntities(Customer, false,);

    const activeOrdersCount = await countEntities(Order, true);

    const inactiveOrdersCount = await countEntities(Order, false);


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

async function countEntities(model: typeof User | typeof Customer | typeof Plan | typeof Order, is_active: boolean = true): Promise<number> {
    let success = true;
    let count;
    if (model !== User) {
        count = await model.count(
            {
                where: {
                    is_active: is_active
                }
            })
            .catch(error => {
                success = false;
                return 0;
            });
    } else {
        count = await model.count()
            .catch(error => {
                success = false;
                return 0;
            });

    }
    return count;
}