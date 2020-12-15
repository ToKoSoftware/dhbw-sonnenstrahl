import { InternalUser } from '../interfaces/users.interface';
import * as bcrypt from 'bcryptjs';

export async function mapUser(incomingData: InternalUser): Promise<InternalUser> {

    const SALT_FACTOR = 10;
    const hashedPassword =  await bcrypt.hash(incomingData.password, SALT_FACTOR);

    return {
        email: incomingData.email,
        password: hashedPassword,
        is_admin: false,
    };
}
