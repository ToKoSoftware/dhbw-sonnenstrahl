import {User} from '../models/user.model';
import {Vars} from '../vars';
import jwt from 'jsonwebtoken';

//Generate JSON Web Token
export function jwtSign(user: User, expiration = 604800): string{
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            is_admin: user.is_admin
        },
        Vars.config.database.jwtSalt,
        {
            // standard expiration after 7d = 604800s
            expiresIn: expiration
        }
    );
    return token;
}