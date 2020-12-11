import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { Vars } from '../vars';
import { wrapResponse } from './response-wrapper';

export function verifyToken(res: Response, token: string, next: any) {
    jwt.verify(token, Vars.config.database.jwtSalt, async (err: unknown) => {
        if (err) {
            res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
        } else {
            Vars.currentJWT = token;
            const userData: string | { [key: string]: any; } | null = jwt.decode(token);
            if (!(userData instanceof Object) || userData === null) {
                res.status(403).send(wrapResponse(false, { error: 'Error occured during authorization!' }));
                return;
            }
            const user = await User.findOne({
                where: {
                    id: userData.id
                }
            });

            if (user === null) {
                res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
                return;
            }
            Vars.currentUser = user;
            next();
        }
    });
}