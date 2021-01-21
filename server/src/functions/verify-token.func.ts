import {NextFunction, Response} from 'express';
import jwt from 'jsonwebtoken';
import {User} from '../models/user.model';
import {Vars} from '../vars';
import {wrapResponse} from './response-wrapper';

/**
 * Verify JSON Web Tokens and call next middleware function if valid
 * @param {Response} res
 * @param {string} token
 * @param {NextFunction} next
 */
export function verifyToken(res: Response, token: string, next: NextFunction): void {
    jwt.verify(token, Vars.config.database.jwtSalt, async (err: unknown) => {
        if (err) {
            res.status(403).send(wrapResponse(false, {error: 'Unauthorized!'}));
        } else {
            // Set token to global stored data
            Vars.currentJWT = token;
            // Decode token
            const userData: string | { [key: string]: any; } | null = jwt.decode(token);
            if (!(userData instanceof Object) || userData === null) {
                return res.status(403).send(wrapResponse(false, {error: 'Error occured during authorization!'}));
            }
            // Find user with the data from decoded token
            const user = await User.findOne({
                where: {
                    id: userData.id
                }
            });

            if (user === null) {
                return res.status(403).send(wrapResponse(false, {error: 'Unauthorized!'}));
            }
            // Set user to global stored data
            Vars.currentUser = user;
            // Call NextFunction
            next();
        }
    });
}
