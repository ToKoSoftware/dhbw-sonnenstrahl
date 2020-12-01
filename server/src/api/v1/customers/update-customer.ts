import { Request, Response } from "express";
import isBlank from "is-blank";
import { checkKeysAreNotEmptyOrNotSet } from "../../../functions/check-inputs.func";
import { currentUserIsAdminOrMatchesId } from "../../../functions/current-user-is-admin-or-matches-id.func";
import { mapCustomer } from "../../../functions/map-customer.func";
import { wrapResponse } from "../../../functions/response-wrapper";
import { IncomingCustomer, InternalCustomer } from "../../../interfaces/customers.interface";
import { Customer } from "../../../models/customer.models";
import { User } from "../../../models/user.model";
import { Vars } from "../../../vars";

export async function updateCustomer(req: Request, res: Response) {
    let success = true;
    let customer: Customer | null;
    let updateResult;
    const incomingData: IncomingCustomer = req.body;
    const mappedIncomingData: InternalCustomer = mapCustomer(incomingData);

    let requiredFields = Customer.requiredFields();

    if (isBlank(req.body) || req.params.id === null) {
        return res.send(wrapResponse(false, { error: "No body or valid param set." }));

    }
    customer = await Customer.findOne(
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
    if (customer === null) {
        return res.status(404).send(wrapResponse(false, { error: "No customer with given id found" }));
    }

    let user: User | null = await User.findOne(
        {
            where: {
                customerId: customer.id
            }
        }).catch(error => {
            success = false;
            return null;
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (user !== null) {
        if (!currentUserIsAdminOrMatchesId(user.id)) {
            return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
        }
    } else if (!Vars.currentUser.is_admin) {
        return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
    }

    //id must not be changed and all set keys must not be empty.
    if ((req.body.id === undefined || req.params.id === req.body.id) && checkKeysAreNotEmptyOrNotSet(mappedIncomingData, requiredFields) !== false) {

        updateResult = await Customer.update(
            req.body,
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

    } else if (checkKeysAreNotEmptyOrNotSet(mappedIncomingData, requiredFields) === false) {
        return res.status(400).send(wrapResponse(false, { error: "Fields must not be empty" }));

    } else if (!(req.body.id === undefined || req.params.id === req.body.id)) {
        return res.status(400).send(wrapResponse(false, { error: "ID must not be changed" }));

    } else {
        return res.status(400).send(wrapResponse(false));
    }

    return res.send(wrapResponse(true, updateResult[1]));

}
