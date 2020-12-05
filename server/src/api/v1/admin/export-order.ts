import { Request, Response } from "express";
import { convertObjectArrayToCsv } from "../../../functions/convert-object-array-to-csv.func";
import { wrapResponse } from "../../../functions/response-wrapper";
import { Order } from "../../../models/order.model";

export async function exportOrders(req: Request, res: Response) {
    let success = true;
    let orders: Order[] = await Order.findAll(
        {
            where: {
                terminatedAt: null
            },
            raw: true
        })
        .catch(error => {
            success = false;
            return [];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (orders === []) {
        return res.status(404).send(wrapResponse(false, { error: 'No active order found' }));
    }

    let csvData = convertObjectArrayToCsv(orders);
    const date = new Date().toISOString();
    res.set({"Content-Disposition":`attachment; filename="${date}_Orders.csv"`});

    res.send(csvData);
}
