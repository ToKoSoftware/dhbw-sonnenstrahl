import {Request, Response} from 'express';
import isBlank from 'is-blank';
import {checkKeysAreNotEmptyOrNotSet} from '../../../functions/check-inputs.func';
import {currentUserIsAdminOrMatchesId} from '../../../functions/current-user-is-admin-or-matches-id.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {InternalCustomer} from '../../../interfaces/customers.interface';
import {Customer} from '../../../models/customer.models';
import {User} from '../../../models/user.model';
import {Vars} from '../../../vars';

/**
 * Update a customer with given id from request
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function updateCustomer(req: Request, res: Response): Promise<Response> {
    let success = true;
    let updateResult: [number, Customer[]] | [];
    const incomingData: InternalCustomer = req.body;

    const requiredFields = Customer.requiredFields();

    // Check if request is not empty
    if (isBlank(req.body) || req.params.id === null) {
        return res.status(400).send(wrapResponse(false, {error: 'No body or valid param set.'}));
    }
    // Find customer with given id
    const customer: Customer | null = await Customer.findOne(
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
    // Authorisation check
    if (customer !== null) {
        if (customer.userId !== undefined) {
            if (!currentUserIsAdminOrMatchesId(customer.userId)) {
                if (!Vars.currentUser.is_admin) {
                    return res.status(403).send(wrapResponse(false, {error: 'Unauthorized!'}));
                }
            }
        }
    } else {
        return res.status(404).send(wrapResponse(false, {error: 'No customer with given id found!'}));
    }

    // Check if there is a user belonging to the userId, if it is set in the request
    if (incomingData.userId !== undefined && incomingData.userId !== null) {
        const user: User | null = await User.findOne(
            {
                where: {
                    id: incomingData.userId
                }
            })
            .catch(() => {
                success = false;
                return null;
            });

        if (!success) {
            return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
        }

        if (user === null) {
            return res.status(404).send(wrapResponse(false, {error: 'No user with given id found'}));
        }
    }

    // Id must not be changed and all set keys mut not be empty.
    if ((req.body.id === undefined || req.params.id === req.body.id)
        && checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields) !== false
    ) {
        // Update customer with given params
        updateResult = await Customer.update(
            incomingData,
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
            return res.status(400).send(wrapResponse(false, {error: 'No order updated'}));
        }

    } else if (checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields) === false) {
        return res.status(400).send(wrapResponse(false, {error: 'Fields must not be empty'}));

    } else if (!(req.body.id === undefined || req.params.id === req.body.id)) {
        return res.status(400).send(wrapResponse(false, {error: 'ID must not be changed'}));

    } else {
        return res.status(400).send(wrapResponse(false));
    }

    return res.send(wrapResponse(true, updateResult[1]));

}
