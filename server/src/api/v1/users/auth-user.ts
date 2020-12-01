import { Request, Response } from "express";
import { wrapResponse } from "../../../functions/response-wrapper";
import { IncomingUser } from "../../../interfaces/users.interface";
import { User } from "../../../models/user.model";
import jwt from "jsonwebtoken";

export async function loginUser(req: Request, res: Response) {
    const incomingData: IncomingUser = req.body
    let success = true;
    const user = await User.findOne(
        {
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
    }
    const token = jwt.sign(incomingData, "unserKey");
    return res.send(wrapResponse(true, token));
}