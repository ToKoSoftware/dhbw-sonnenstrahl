export interface IncomingOrder {
    userId: string;
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

// Interface for Updating Order
export interface IncomingUpdateOrder {
    customerId: string;
    rateId: string;
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
    terminatedAt: Date | null;
}
