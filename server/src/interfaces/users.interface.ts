export interface IncomingUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    
}

export interface InternalUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    is_admin: boolean;
}