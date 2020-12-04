export interface InternalCustomer {
    firstName: string;
    lastName: string;
    street: string;
    streetNumber: string;
    postcode: string;
    city: string;
    is_active: boolean
}

export interface IncomingCustomer {
    firstName: string;
    lastName: string;
    street: string;
    streetNumber: string;
    zipCode: string;
    city: string;
}