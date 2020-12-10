import { IncomingUser, InternalUser } from '../interfaces/users.interface';
import * as bcrypt from 'bcryptjs';

export async function mapUser(incomingData: IncomingUser): Promise<InternalUser> {

    const SALT_FACTOR = 10;
    const hashedPassword =  await bcrypt.hash(incomingData.password, SALT_FACTOR);
    incomingData.password = hashedPassword;

    return {
        email: incomingData.email,
        password: incomingData.password,
        is_admin: false,
    }
}