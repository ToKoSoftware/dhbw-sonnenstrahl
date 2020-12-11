import { InternalUser } from '../interfaces/users.interface';

export function mapUser(incomingData: InternalUser): InternalUser {
    return {
        email: incomingData.email,
        password: incomingData.password,
        is_admin: false,
    };
}