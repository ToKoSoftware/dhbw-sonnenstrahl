export interface IncomingUser {
    customerId: string|null;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    
}

export interface InternalUser {
    customerId: string|null;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    is_admin: boolean;
}