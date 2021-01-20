import {InternalCustomer} from '../interfaces/customers.interface';
import {IncomingExternalOrder} from '../interfaces/orders.interface';

/**
 * Map incoming external order data into internal customer format
 * @param incomingData
 */
export function mapOrderDataOnCustomer(incomingData: IncomingExternalOrder): InternalCustomer {
    return {
        userId: null,
        firstName: incomingData.firstName,
        lastName: incomingData.lastName,
        street: incomingData.street,
        streetNumber: incomingData.streetNumber,
        postcode: incomingData.zipCode,
        city: incomingData.city,
        is_active: true
    };
}
