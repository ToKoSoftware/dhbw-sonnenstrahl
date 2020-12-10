import { Request, Response } from "express";
import { objectHasRequiredAndNotEmptyKeys } from "../../../functions/check-inputs.func";
import { wrapResponse } from "../../../functions/response-wrapper";
import { InternalCustomer } from "../../../interfaces/customers.interface";
import { Customer } from "../../../models/customer.models";

export async function createCustomer(req: Request, res: Response) {
    const incomingData: InternalCustomer = req.body;

    const requiredFields = Customer.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(incomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, {
            error: 'Not all required fields have been set'
        }));
    }

    let data = await Customer.create(incomingData).catch(error => null);
    if (data === null) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not create Customer' }));
    }

    return res.send(wrapResponse(true, data));
}
