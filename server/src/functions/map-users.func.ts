import {InternalUser} from '../interfaces/users.interface';
import * as bcrypt from 'bcryptjs';

/**
 * Map incoming user data into internal format and hash new password
 * @param incomingData
 */
export async function mapUser(incomingData: InternalUser): Promise<InternalUser> {

    const SALT_FACTOR = 10;
    const hashedPassword = incomingData.password !== undefined ? await bcrypt.hash(incomingData.password, SALT_FACTOR) : incomingData.password;

    //mapping of password on hashed password and is_admin on false: Admin-Accounts can only be added via database!
    return {
        email: incomingData.email,
        password: hashedPassword,
        is_admin: false,
    };
}
