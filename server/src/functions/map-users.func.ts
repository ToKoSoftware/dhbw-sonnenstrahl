import {IncomingUser, InternalUser} from '../interfaces/users.interface';

export function mapUser(incomingData: IncomingUser): InternalUser {
    return {
    firstName: incomingData.firstName,
    lastName: incomingData.lastName,
    email: incomingData.email,
    password: incomingData.password,
    is_admin: false,
    }
}