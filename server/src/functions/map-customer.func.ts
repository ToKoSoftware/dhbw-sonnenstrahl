import {InternalCustomer} from '../interfaces/customers.interface';

export function mapCustomer(incomingData: InternalCustomer): InternalCustomer {
    return {
        userId: incomingData.userId !== undefined ? incomingData.userId : null,
        firstName: incomingData.firstName,
        lastName: incomingData.lastName,
        street: incomingData.street,
        streetNumber: incomingData.streetNumber,
        postcode: incomingData.postcode,
        city: incomingData.city,
        is_active: true
    };
}