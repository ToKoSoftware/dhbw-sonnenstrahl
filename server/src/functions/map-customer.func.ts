import {InternalCustomer} from '../interfaces/customers.interface';

/**
 * Map incoming customer data into internal format
 * 
 * @param {InternalCustomer} incomingData
 * @returns {InternalCustomer}
 */
export function mapCustomer(incomingData: InternalCustomer): InternalCustomer {
    return {
        userId: incomingData.userId || null, //if userId is undefined from API call it is set to null (no linked user)
        firstName: incomingData.firstName,
        lastName: incomingData.lastName,
        street: incomingData.street,
        streetNumber: incomingData.streetNumber,
        postcode: incomingData.postcode,
        city: incomingData.city,
        is_active: true //A new created customer is always active
    };
}
