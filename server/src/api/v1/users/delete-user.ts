import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { User } from '../../../models/user.model';

export async function deleteUser(req: Request, res: Response) {
    let success = true;
    const destroyedRows = await User.destroy(
        {
            where: {
                id: req.params.id
            }
        })
        .catch(error => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (destroyedRows == 0) {
        return res.status(400).send(wrapResponse(false, { error: 'There is no user to delete with this id' }));
    }
    return res.send(wrapResponse(true));
}
