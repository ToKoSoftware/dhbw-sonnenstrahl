import { Request, Response } from "express";
import { wrapResponse } from "../functions/response-wrapper";
import jwt from "jsonwebtoken";
import { Vars } from "../vars";
import { User } from "../models/user.model";

export async function userIsAuthorized(req: Request, res: Response, next: any):Promise<void> {
    const header = req.headers['authorization'];
    if (header !== undefined) {
        const [bearer, token] = header.split(' ');
        jwt.verify(token, Vars.config.database.jwtSalt, async (err: unknown) => {
            if (err) {
                res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
            } else {
                Vars.currentJWT = token;
                const userData: string | { [key: string]: any; } | null = jwt.decode(token);
                Vars.loggy.log(userData);
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

    } else {
        res.status(401).send(wrapResponse(false, { error: 'Unauthorized!' }));
    }
}