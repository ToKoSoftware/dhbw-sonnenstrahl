import { IncomingCustomer, InternalCustomer } from "../interfaces/customers.interface";

export function mapCustomer(incomingData: IncomingCustomer): InternalCustomer {
    return {
        firstName: incomingData.firstName,
        lastName: incomingData.lastName,
        street: incomingData.street,
        streetNumber: incomingData.streetNumber,
        postcode: incomingData.zipCode,
        city: incomingData.city
    }
}