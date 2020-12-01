import { Request, Response } from "express";
import { wrapResponse } from "../../../functions/response-wrapper";
import { IncomingUser } from "../../../interfaces/users.interface";
import { User } from "../../../models/user.model";
import jwt from "jsonwebtoken";

export async function loginUser(req: Request, res: Response) {
    const incomingData: IncomingUser = req.body
    let success = true;
    let calculatedExpiresIn = 24* 60 * 60; //expiration after 24h

    const user = await User.findOne(
        {
            attributes: ['id', 'email', 'is_admin'],
            where: {
                email: incomingData.email,
                password: incomingData.password
            }
        })
        .catch(error => {
            success = false;
            return null;
        });


    if (!success) {
        res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    if (user === null) {
        res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
    } else {
        const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin}, 'JWT_HASH', { expiresIn: calculatedExpiresIn }); //TODO .env import
        return res.send(wrapResponse(true, token));
    }

}