export interface IncomingOrder {
    firstName: string;
    lastName: string;
    street: string;
    streetNumber: string;
    zipCode: string;
    city: string;
    rateId: string;
    consumption: number;
    agent: string;
}

export interface InternalOrder {
    id?: string;
    firstName: string;
    lastName: string;
    street: string;
    streetNumber: string;
    postcode: string;
    city: string;
    referrer: string;
    planId: string;
    consumption: number;
    is_active: boolean;
}
