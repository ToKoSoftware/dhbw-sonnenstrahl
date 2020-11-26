import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {IncomingOrder, InternalOrder} from '../../../interfaces/orders.interface';
import {Order} from '../../../models/order.model';
import {mapOrder} from '../../../functions/map-order.func';
import {objectHasRequiredAndNotEmptyKeys} from '../../../functions/check-inputs.func';
import {Plan} from '../../../models/plan.model';
import {Vars} from '../../../vars';
import { Customer } from '../../../models/customer.models';
import { mapCustomer } from '../../../functions/map-customer.func';

export async function createOrder(req: Request, res: Response) {
    const incomingData: IncomingOrder = req.body;
    const mappedCustomerData = mapCustomer(incomingData);
    
    //Check, if Customer with given params already exists. If not create one.
    let customerId = "";
    let err = false;

    // Try to find Plan with given planId
    let plan: Plan | null = await Plan.findOne(
        {
            where: {
                id: incomingData.rateId,
                is_active: true
            }
        }
    ).catch((error) => {
        return null;
    });
    if (plan === null) {
        return res.status(404).send(wrapResponse(false, {error: 'Plan cannot be found'}));
    }


    // Postcode of plan and order must match
    if(plan.postcode != mappedCustomerData.postcode){
        return res.status(400).send(wrapResponse(false, {error: 'Postcode of plan and order do not match!'}));
    }
    let customer: Customer | null = await Customer.findOne(
        {
            where: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                street: req.body.street,
                streetNumber: req.body.streetNumber,
                postcode: req.body.zipCode,
                city: req.body.city
            }
        }
    )
    .catch((error) => {
        err = true;
        return null;
    });
    if(err){
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if(customer === null){
        // Customer not found. Create new!
        customer = await Customer.create(mappedCustomerData).catch((error) => {err = true; return null;});
    }
    if(err || customer === null){
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
        
    const mappedIncomingData = mapOrder(incomingData, customer.id);
    // Check, if all required fields have been set
    let requiredFields = Order.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, {error: 'Not all required fields have been set'}));
    }

    // Create order
    let data = await Order.create(mappedIncomingData).then((res) => res).catch(error => null);
    if (data === null) {
        return res.status(500).send(wrapResponse(false, {error: 'Could not create Order'}));
    }
    return res.send(wrapResponse(true, data));
}
