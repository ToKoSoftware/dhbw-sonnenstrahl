import { IncomingUser, InternalUser } from '../interfaces/users.interface';

export function mapUser(incomingData: IncomingUser): InternalUser {
    return {
        customerId: incomingData.customerId,
        email: incomingData.email,
        password: incomingData.password,
        is_admin: false,
    }
}