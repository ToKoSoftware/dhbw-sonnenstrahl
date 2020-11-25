export interface IncomingUser {
    customerId: string|null;
    email: string;
    password: string;
    
}

export interface InternalUser {
    customerId: string|null;
    email: string;
    password: string;
    is_admin: boolean;
}