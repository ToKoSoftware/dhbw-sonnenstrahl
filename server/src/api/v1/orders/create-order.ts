import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { IncomingOrder } from '../../../interfaces/orders.interface';
import { Order } from '../../../models/order.model';
import { mapOrder } from '../../../functions/map-order.func';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { Plan } from '../../../models/plan.model';
import { Customer } from '../../../models/customer.models';
import { mapCustomer } from '../../../functions/map-customer.func';

export async function createOrder(req: Request, res: Response) {
    const incomingData: IncomingOrder = req.body;
    const mappedCustomerData = mapCustomer(incomingData);


    // Check, if all required fields have been set
    let requiredIncomingOrderFields = requiredIncomingFields();

    if (!objectHasRequiredAndNotEmptyKeys(incomingData, requiredIncomingOrderFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
    }

    //Check, if Customer with given params already exists. If not create one.
    let success = true;

    // Try to find Plan with given planId
    let plan: Plan | null = await Plan.findOne(
        {
            where: {
                id: incomingData.rateId,
                is_active: true
            }
        })
        .catch((error) => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (plan === null) {
        return res.status(400).send(wrapResponse(false, { error: 'Given rateId does not match a plan' }));
    }


    // Postcode of plan and order must match
    if (plan.postcode != mappedCustomerData.postcode) {
        return res.status(400).send(wrapResponse(false, { error: 'Postcode of plan and order do not match!' }));
    }
    let customer: Customer | null = await Customer.findOne(
        {
            where: {
                firstName: mappedCustomerData.firstName,
                lastName: mappedCustomerData.lastName,
                street: mappedCustomerData.street,
                streetNumber: mappedCustomerData.streetNumber,
                postcode: mappedCustomerData.postcode,
                city: mappedCustomerData.city,
                is_active: mappedCustomerData.is_active
            }
        })
        .catch((error) => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (customer === null) {
        // Customer not found. Create new!
        customer = await Customer.create(mappedCustomerData).catch((error) => null);
    }
    if (customer === null) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    const mappedIncomingData = mapOrder(incomingData, customer.id);

    // Create order
    let data = await Order.create(mappedIncomingData)
        .catch(error => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (data === null) {
        return res.status(400).send(wrapResponse(false, { error: 'Could not create Order' }));
    }
    return res.send(wrapResponse(true, data));
}

function requiredIncomingFields(): Array<keyof IncomingOrder> {
    return [
        'firstName',
        'lastName',
        'street',
        'streetNumber',
        'zipCode',
        'city',
        'rateId',
        'consumption',
        'agent'
    ];
}