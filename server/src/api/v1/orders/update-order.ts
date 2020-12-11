import { Request, Response } from 'express';
import isBlank from 'is-blank';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { currentUserIsAdminOrMatchesId } from '../../../functions/current-user-is-admin-or-matches-id.func';
import { mapInternalOrder } from '../../../functions/map-order.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { IncomingInternalOrder, InternalOrder } from '../../../interfaces/orders.interface';
import { Customer } from '../../../models/customer.models';
import { Order } from '../../../models/order.model';
import { Plan } from '../../../models/plan.model';
import { Vars } from '../../../vars';

export async function updateOrder(req: Request, res: Response) {
    let success = true;
    let updateResult;
    const incomingData: IncomingInternalOrder = req.body;

    const requiredFields = Order.requiredFields();

    if (isBlank(req.body) || req.params.id === null) {
        return res.send(wrapResponse(false, { error: 'No body or valid param set.' }));
    }

    const order: Order | null = await Order.findOne(
        {
            where: {
                id: req.params.id
            }
        })
        .catch(error => {
            success = false;
            return null;
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (order === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No order with given id found' }));
    }

    const customerData = await Customer.findOne(
        {
            where: {
                id: order.customerId
            }
        })
        .catch(error => {
            success = false;
            return null;
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    //authorisation check
    if (customerData !== null) {
        if (customerData.userId !== undefined) {
            if (!currentUserIsAdminOrMatchesId(customerData.userId)) {
                return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
            }
        } else if (!Vars.currentUser.is_admin) {
            return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
        }
    }

    //id must not be changed and all set keys mut not be empty.
    if ((req.body.id === undefined || req.params.id === req.body.id) && checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields) !== false) {

        const plan: Plan | null = await Plan.findOne(
            {
                where: {
                    id: incomingData.planId,
                    is_active: true
                }
            }
        ).catch((error) => {
            return null;
        });
        if (plan === null) {
            return res.status(400).send(wrapResponse(false, { error: 'Plan cannot be changed to given planId' }));
        }
        updateResult = await Order.update(
            incomingData,
            {
                where: {
                    id: req.params.id
                },
                returning: true,
            })
            .catch(error => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if (updateResult === null || updateResult[0] == 0) {
            return res.status(404).send(wrapResponse(false, { error: 'No order updated' }));
        }

    } else if (checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields) === false) {
        return res.status(400).send(wrapResponse(false, { error: 'Fields must not be empty' }));

    } else if (!(req.body.id === undefined || req.params.id === req.body.id)) {
        return res.status(400).send(wrapResponse(false, { error: 'ID must not be changed' }));

    } else {
        return res.status(400).send(wrapResponse(false));
    }

    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    return res.send(wrapResponse(true, updateResult[1]));
}
