import {InternalCustomer} from '../interfaces/customers.interface';
import {IncomingExternalOrder} from '../interfaces/orders.interface';

/**
 * Map incoming external order data into internal customer format
 * @param incomingData
 * @returns {InternalCustomer}
 */
export function mapOrderDataOnCustomer(incomingData: IncomingExternalOrder): InternalCustomer {
    return {
        userId: null, // An external order has always no linked user
        firstName: incomingData.firstName,
        lastName: incomingData.lastName,
        street: incomingData.street,
        streetNumber: incomingData.streetNumber,
        postcode: incomingData.zipCode,
        city: incomingData.city,
        is_active: true // An external order is always active
    };
}
