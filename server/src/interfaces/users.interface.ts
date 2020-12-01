export interface IncomingUser {
    customerId: string
    email: string;
    password: string;
}

export interface InternalUser {
    customerId: string;
    email: string;
    password: string;
    is_admin: boolean;
}