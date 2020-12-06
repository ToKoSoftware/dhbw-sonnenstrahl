import { IncomingCustomer, InternalCustomer } from "../interfaces/customers.interface";
import { Vars } from "../vars";

export function mapCustomer(incomingData: IncomingCustomer): InternalCustomer {
    return {
        userId: Vars.currentUser.id,
        firstName: incomingData.firstName,
        lastName: incomingData.lastName,
        street: incomingData.street,
        streetNumber: incomingData.streetNumber,
        postcode: incomingData.zipCode,
        city: incomingData.city,
        is_active: true
    }
}