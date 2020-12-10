import { Request, Response } from "express";
import { wrapResponse } from "../../../functions/response-wrapper";
import { IncomingUser } from "../../../interfaces/users.interface";
import { User } from "../../../models/user.model";
import jwt from "jsonwebtoken";
import { Vars } from "../../../vars";
import * as bcrypt from 'bcryptjs';

export async function loginUser(req: Request, res: Response) {
   
    const incomingData: IncomingUser = req.body;

    let success = true;
    let calculatedExpiresIn =  60*60; //expiration after 1h


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
        res.status(403).send(wrapResponse(false, { error: 'Email is not available' }));
    } else {
        await bcrypt.compare(req.body.password, user.password).then((isMatch: any) => {if (!isMatch) return res.status(400).send(wrapResponse(false, { error: 'Unauthorized!' }))})
        .catch(error => {
            success = false;
            return null;
        });

        const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin}, Vars.config.database.jwtSalt, { expiresIn: calculatedExpiresIn });
            return res.send(wrapResponse(true, token))
        };
    }

