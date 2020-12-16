import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Customer} from '../../../models/customer.models';
import {Order} from '../../../models/order.model';
import {Op} from 'sequelize';


export async function deleteCustomer(req: Request, res: Response): Promise<Response> {
    let success = true;
    // Can only set Customer to inactive, if none of his orders is active/not terminated

    const count = await Order.count({
        where: {
            customerId: req.params.id,
            terminatedAt: {
                [Op.ne]: null
            }
        }
    });
    if (count > 0) {
        return res.status(400).send(wrapResponse(false, {error: 'You can not delete a customer with active orders'}));
    }
    await Customer.update(
        {
            is_active: false,
        },
        {
            where: {
                id: req.params.id
            }
        })
        .catch(error => {
            success = false;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Could not delete Order with id ' + req.params.id}));
    }
    return res.send(wrapResponse(true));
}
