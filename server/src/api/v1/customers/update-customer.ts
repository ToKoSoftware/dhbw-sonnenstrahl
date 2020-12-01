import { Request, Response } from "express";
import isBlank from "is-blank";
import { checkKeysAreNotEmptyOrNotSet } from "../../../functions/check-inputs.func";
import { mapCustomer } from "../../../functions/map-customer.func";
import { wrapResponse } from "../../../functions/response-wrapper";
import { IncomingCustomer, InternalCustomer } from "../../../interfaces/customers.interface";
import { Customer } from "../../../models/customer.models";

export async function updateCustomer(req: Request, res: Response) {
    let success = true;
    let customer: Customer | null;
    let updateResult;
    const incomingData: IncomingCustomer = req.body;
    const mappedIncomingData: InternalCustomer = mapCustomer(incomingData);

    let requiredFields = Customer.requiredFields();

    if (isBlank(req.body) || req.params.id === null) {
        return res.send(wrapResponse(false, { error: "No body or valid param set." }));

    } else {
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
    }
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    //Customer Objekt from database must not be null, id must not be changed and all set keys mut not be empty.
    if (customer !== null && (req.body.id === undefined || req.params.id === req.body.id) && checkKeysAreNotEmptyOrNotSet(mappedIncomingData, requiredFields) !== false) {

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

    } else if (customer === null) {
        return res.status(404).send(wrapResponse(false, { error: "No customer with given id found" }));

    } else if (checkKeysAreNotEmptyOrNotSet(mappedIncomingData, requiredFields) === false) {
        return res.status(400).send(wrapResponse(false, { error: "Fields must not be empty" }));

    } else if(!(req.body.id === undefined || req.params.id === req.body.id)) {
        return res.status(400).send(wrapResponse(false, { error: "ID must not be changed" }));
        
    } else {
        return res.status(400).send(wrapResponse(false));
    }

    return res.send(wrapResponse(true, updateResult[1]));

}
