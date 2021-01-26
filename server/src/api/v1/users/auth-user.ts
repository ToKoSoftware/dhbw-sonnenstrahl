import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {InternalUser} from '../../../interfaces/users.interface';
import {mapUser} from '../../../functions/map-users.func';
import {User} from '../../../models/user.model';
import * as bcrypt from 'bcryptjs';
import {jwtSign} from '../../../functions/jwt-sign.func';

/**
 * Login user
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>} contains JSON Web Token
 */
export async function loginUser(req: Request, res: Response): Promise<Response> {

    const incomingData: InternalUser = req.body;
    // Map incoming user data
    const mappedIncomingData: InternalUser = await mapUser(incomingData);

    let success = true;

    // Find user with given email
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
        // Check if given password matches the (hashed) password in the database.
        const passwordMatches = await bcrypt.compare(incomingData.password, user.password)
            .catch(() => false);
        if (passwordMatches) {
            const token = jwtSign(user);
            return res.send(wrapResponse(true, token));
        }
        return res.status(403).send(wrapResponse(false, {error: 'Unauthorized!'}));
    }
}

