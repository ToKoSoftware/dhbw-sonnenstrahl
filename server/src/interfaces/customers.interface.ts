export interface InternalCustomer {
    userId: string | null;
    firstName: string;
    lastName: string;
    street: string;
    streetNumber: string;
    postcode: string;
    city: string;
    is_active: boolean
}
