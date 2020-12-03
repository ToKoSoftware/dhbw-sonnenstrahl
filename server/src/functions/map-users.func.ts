import { IncomingUser, InternalUser } from '../interfaces/users.interface';

export function mapUser(incomingData: IncomingUser): InternalUser {
    return {
        email: incomingData.email,
        password: incomingData.password,
        is_admin: false,
    }
}