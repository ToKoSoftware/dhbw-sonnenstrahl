import { Request, Response } from "express";
import { wrapResponse } from "../../../functions/response-wrapper";
import { User } from "../../../models/user.model";

export async function deleteUser(req: Request, res: Response) {
    await User.destroy(
        {
       		where: {
            id: req.params.id
        }}
    ).catch(error => {
        return res.status(404).send(wrapResponse(false, {error: 'Could not delete User with id ' + req.params.id}));
    });
    return res.send(wrapResponse(true));
}
