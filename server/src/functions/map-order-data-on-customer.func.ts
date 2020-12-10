import { InternalCustomer } from "../interfaces/customers.interface";
import { IncomingOrder } from "../interfaces/orders.interface";

export function mapOrderDataOnCustomer(incomingData: IncomingOrder): InternalCustomer {
    return {
        userId: incomingData.userId,
        firstName: incomingData.firstName,
        lastName: incomingData.lastName,
        street: incomingData.street,
        streetNumber: incomingData.streetNumber,
        postcode: incomingData.zipCode,
        city: incomingData.city,
        is_active: true
    }
}