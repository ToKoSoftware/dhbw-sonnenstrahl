import { Request, Response } from "express";
import { convertObjectArrayToCsv } from "../../../functions/convert-object-array-to-csv.func";
import { wrapResponse } from "../../../functions/response-wrapper";
import { User } from "../../../models/user.model";

export async function exportUsers(req: Request, res: Response) {
    let success = true;
    let users: User[] = await User.findAll(
        {
            where: {
                terminatedAt: null
            },
            raw: true
        })
        .catch(error => {
            success = false;
            return [];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (users === []) {
        return res.status(404).send(wrapResponse(false, { error: 'No active order found' }));
    }

    let csvData = convertObjectArrayToCsv(users);
    const date = new Date().toISOString();
    res.set({"Content-Disposition":`attachment; filename="${date}_Users.csv"`});

    res.send(csvData);
    
}