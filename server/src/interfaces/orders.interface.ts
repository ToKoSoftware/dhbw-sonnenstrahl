export interface IncomingInternalOrder {
    customerId: string;
    planId: string;
    consumption: number;
    agent: string;
}

export interface InternalOrder {
    id?: string;
    customerId: string;
    planId: string;
    referrer: string;
    consumption: number;
    is_active: boolean;
    terminatedAt?: Date | null;
}

export interface IncomingExternalOrder {
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
