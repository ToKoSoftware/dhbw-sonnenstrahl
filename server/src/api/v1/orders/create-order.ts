import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {IncomingExternalOrder, InternalOrder} from '../../../interfaces/orders.interface';
import {Order} from '../../../models/order.model';
import {mapOrder} from '../../../functions/map-order.func';
import {objectHasRequiredAndNotEmptyKeys} from '../../../functions/check-inputs.func';
import {Plan} from '../../../models/plan.model';
import {Customer} from '../../../models/customer.models';
import {mapOrderDataOnCustomer} from '../../../functions/map-order-data-on-customer.func';

export async function createInternalOrder(req: Request, res: Response) {
    let success = true;
    const incomingData: InternalOrder = req.body;

    // Check, if all required fields have been set
    const requiredFields = Order.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(incomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, {error: 'Not all required fields have been set'}));
    }

    // Try to find Plan with given planId
    const plan: Plan | null = await Plan.findOne(
        {
            where: {
                id: incomingData.planId,
                is_active: true
            }
        })
        .catch((error) => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (plan === null) {
        return res.status(400).send(wrapResponse(false, {error: 'Given planId does not match a plan'}));
    }

    //Try to find Customer with given customerId
    const customer: Customer | null = await Customer.findOne(
        {
            where: {
                id: incomingData.customerId,
                is_active: true
            }
        })
        .catch((error) => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (customer === null) {
        return res.status(400).send(wrapResponse(false, {error: 'Given customerId does not match a customer'}));
    }

    // Postcode of plan and customer must match
    if (plan.postcode != customer.postcode) {
        return res.status(400).send(wrapResponse(false, {error: 'Postcode of plan and order do not match!'}));
    }

    const data = await Order.create(incomingData)
        .catch(error => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (data === null) {
        return res.status(400).send(wrapResponse(false, {error: 'Could not create Order'}));
    }
    return res.send(wrapResponse(true, data));
}

export async function createExternalOrder(req: Request, res: Response) {
    let success = true;
    const incomingData: IncomingExternalOrder = req.body;
    const mappedCustomerData = mapOrderDataOnCustomer(incomingData);


    // Check, if all required fields have been set
    const requiredIncomingOrderFields = requiredIncomingFields();

    if (!objectHasRequiredAndNotEmptyKeys(incomingData, requiredIncomingOrderFields)) {
        return res.status(400).send(wrapResponse(false, {error: 'Not all required fields have been set'}));
    }

    // Try to find Plan with given planId
    const plan: Plan | null = await Plan.findOne(
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
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (plan === null) {
        return res.status(400).send(wrapResponse(false, {error: 'Given rateId does not match a plan'}));
    }


    // Postcode of plan and order must match
    if (plan.postcode != mappedCustomerData.postcode) {
        return res.status(400).send(wrapResponse(false, {error: 'Postcode of plan and order do not match!'}));
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
                is_active: mappedCustomerData.is_active,
                userId: mappedCustomerData.userId
            }
        })
        .catch((error) => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (customer === null) {
        // Customer not found. Create new!
        customer = await Customer.create(mappedCustomerData).catch((error) => null);
    }
    if (customer === null) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    const mappedIncomingData = mapOrder(incomingData, customer.id);

    // Create order
    const data = await Order.create(mappedIncomingData)
        .catch(error => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (data === null) {
        return res.status(400).send(wrapResponse(false, {error: 'Could not create Order'}));
    }

    const calculatedCosts = Math.round((plan.cost_var / 10000 * incomingData.consumption + plan.cost_fix / 10000 + Number.EPSILON) * 100) / 100;

    return res.send(wrapResponse(true, {costs: calculatedCosts + '€'}));
}

function requiredIncomingFields(): Array<keyof IncomingExternalOrder> {
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
