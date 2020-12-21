import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {InternalUser} from '../../../interfaces/users.interface';
import {mapUser} from '../../../functions/map-users.func';
import {User} from '../../../models/user.model';
import jwt from 'jsonwebtoken';
import {Vars} from '../../../vars';
import * as bcrypt from 'bcryptjs';

export async function loginUser(req: Request, res: Response): Promise<Response> {

    const incomingData: InternalUser = req.body;
    const mappedIncomingData: InternalUser = await mapUser(incomingData);

    let success = true;
    const calculatedExpiresIn = 60 * 60; //expiration after 1h


    const user = await User.findOne(
        {
            where: {
                email: mappedIncomingData.email,
            }
        })
        .catch(() => {
            success = false;
            return null;
        });


    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (user === null) {
        return res.status(403).send(wrapResponse(false, {error: 'Unauthorized'}));
    } else {
        const passwordMatches = await bcrypt.compare(incomingData.password, user.password)
            .catch(() => {
                return false;
            });
        if (passwordMatches) {
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    is_admin: user.is_admin
                },
                Vars.config.database.jwtSalt,
                {
                    expiresIn: calculatedExpiresIn
                }
            );
            return res.send(wrapResponse(true, token));
        }
        return res.status(403).send(wrapResponse(false, {error: 'Unauthorized!'}));
    }
}

