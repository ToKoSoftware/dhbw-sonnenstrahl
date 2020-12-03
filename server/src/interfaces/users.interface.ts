export interface IncomingUser {
    email: string;
    password: string;
}

export interface InternalUser {
    email: string;
    password: string;
    is_admin: boolean;
}