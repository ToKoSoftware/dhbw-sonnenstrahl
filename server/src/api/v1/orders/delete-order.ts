import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Order} from '../../../models/order.model';

/**
 *
 * @param req
 * @param res
 */
export async function deleteOrder(req: Request, res: Response): Promise<Response> {
    let success = true;
    const destroyedRows = await Order.destroy(
        {
            where: {
                id: req.params.id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (destroyedRows == 0) {
        return res.status(404).send(wrapResponse(false, {error: 'There is no order to delete with this id'}));
    }
    return res.status(204).send(wrapResponse(true));
}
