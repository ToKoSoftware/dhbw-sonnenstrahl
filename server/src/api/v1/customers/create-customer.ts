import { Request, Response } from "express";
import { objectHasRequiredAndNotEmptyKeys } from "../../../functions/check-inputs.func";
import { mapCustomer } from "../../../functions/map-customer.func";
import { wrapResponse } from "../../../functions/response-wrapper";
import { IncomingCustomer, InternalCustomer } from "../../../interfaces/customers.interface";
import { Customer } from "../../../models/customer.models";

export async function createCustomer(req: Request, res: Response) {
    const incomingData: IncomingCustomer = req.body;
    const mappedIncomingData: InternalCustomer = mapCustomer(incomingData);

    const requiredFields = Customer.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, {
            error: 'Not all required fields have been set'
        }));
    }

    let data = await Customer.create(mappedIncomingData).catch(error => null);
    if (data === null) {
        return res.status(500).send(wrapResponse(false, {error: 'Could not create Customer'}));
    }

    return res.send(wrapResponse(true, data));
}
