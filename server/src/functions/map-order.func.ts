import {IncomingOrder, InternalOrder} from '../interfaces/orders.interface';

export function mapOrder(incomingData: IncomingOrder): InternalOrder {
    return {
        city: incomingData.city,
        consumption: incomingData.consumption,
        firstName: incomingData.firstName,
        is_active: true,
        lastName: incomingData.lastName,
        planId: incomingData.rateId,
        postcode: incomingData.zipCode,
        referrer: incomingData.agent,
        street: incomingData.street,
        streetNumber: incomingData.streetNumber
    }
}
