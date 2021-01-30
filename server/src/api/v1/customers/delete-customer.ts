import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Customer} from '../../../models/customer.models';
import {Order} from '../../../models/order.model';
import {Op} from 'sequelize';

/**
 * (Soft) deletes a customer with a given id from request
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function deleteCustomer(req: Request, res: Response): Promise<Response> {
    let success = true;

    // Can only set Customer to inactive, if none of his orders is active/not terminated
    const count = await Order.count(
        {
            where: {
                customerId: req.params.id,
                terminatedAt: {
                    [Op.ne]: null
                }
            }
        })
        .catch(() => {
            success = false;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (count > 0) {
        return res.status(400).send(wrapResponse(false, {error: 'You can not delete a customer with active orders'}));
    }
    // Set customer to inactive. Only soft deletion!
    const query = { is_active: false };
    const updateResult = await Customer.update(
        query,
        {
            where: {
                id: req.params.id
            },
            returning: true,
        })
        .catch(() => {
            success = false;
            return [];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (updateResult === [] || updateResult[0] == 0) {
        return res.status(400).send(wrapResponse(false, {error: 'No customer updated'}));
    }
    return res.status(200).send(wrapResponse(true, updateResult));
}
