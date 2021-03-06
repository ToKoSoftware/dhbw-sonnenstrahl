import {Request, Response} from 'express';
import {currentUserIsAdminOrMatchesId} from '../../../functions/current-user-is-admin-or-matches-id.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Customer} from '../../../models/customer.models';
import {Order} from '../../../models/order.model';
import {Vars} from '../../../vars';

/**
 * (Soft) deletes/cancels/terminates an order with a given id from request
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function terminateOrder(req: Request, res: Response): Promise<Response> {
    let success = true;

    // Try to find an order with the given id
    const order: Order | null = await Order.findOne(
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
    if (order === null) {
        return res.status(404).send(wrapResponse(false, {error: 'Count not find Order with id: ' + req.params.id}));
    }

    // Get the customer belonging to this order
    const customerData = await Customer.findOne(
        {
            where: {
                id: order.customerId
            }
        })
        .catch(() => {
            success = false;
            return null;
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    //authorisation check
    if (customerData !== null) {
        if (customerData.userId !== undefined) {
            if (!currentUserIsAdminOrMatchesId(customerData.userId)) {
                return res.status(403).send(wrapResponse(false, {error: 'Unauthorized!'}));
            }
        } else if (!Vars.currentUser.is_admin) {
            return res.status(403).send(wrapResponse(false, {error: 'Unauthorized!'}));
        }
    }
    // Check if order was already terminated
    if (order.terminatedAt !== null) {
        return res.status(400).send(wrapResponse(false, {error: 'Order already terminated'}));
    }
    //Update order. Set terminatedAt to current time and set is_active to false
    const updatedOrder = await Order.update(
        {
            terminatedAt: Date.now(),
            is_active: false
        },
        {
            where: {
                id: req.params.id
            },
            returning: true,
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (updatedOrder === null || updatedOrder[0] == 0) {
        return res.status(400).send(wrapResponse(false, {error: 'Could not terminate Order with id ' + req.params.id}));
    }

    return res.send(wrapResponse(true, updatedOrder[1]));
}
