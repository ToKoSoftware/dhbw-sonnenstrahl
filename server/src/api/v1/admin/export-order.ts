import {Request, Response} from 'express';
import {convertObjectArrayToCsv} from '../../../functions/convert-object-array-to-csv.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Order} from '../../../models/order.model';

/**
 * Create a CSV export for all Order data (of not terminated orders)
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function exportOrders(req: Request, res: Response): Promise<Response> {
    let success = true;
    // Select all not terminated, active Orders
    const orders: Order[] = await Order.findAll(
        {
            where: {
                terminatedAt: null
            },
            raw: true
        })
        .catch(() => {
            success = false;
            return [];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    // No order was found! Return error message
    if (orders === []) {
        return res.status(404).send(wrapResponse(false, {error: 'No active order found'}));
    }

    // Order data was found. Create CSV from array of objects
    const csvData = convertObjectArrayToCsv(orders);
    const date = new Date().toISOString();
    // Set attachment to response
    res.set({'Content-Disposition': `attachment; filename="${date}_Orders.csv"`});

    // Send response
    return res.send(csvData);
}
