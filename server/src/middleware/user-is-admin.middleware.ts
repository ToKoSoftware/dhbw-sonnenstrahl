import { Request, Response } from "express";
import { wrapResponse } from "../functions/response-wrapper";
import { Vars } from "../vars";

export function userIsAdmin(req: Request, res: Response, next: any) {
    if (Vars.currentUser.is_admin) {
        next();
    } else {
        return res.status(403).send(wrapResponse(false, { error: 'Permission denied!' }));
    }
}