import { Request, Response } from "express";
import { wrapResponse } from "../../../functions/response-wrapper";

export async function updateOrder(req: Request, res: Response) {
    

    return res.send(wrapResponse(true));
}