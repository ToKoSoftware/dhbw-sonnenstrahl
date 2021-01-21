import {Request, Response} from 'express';
import {convertObjectArrayToCsv} from '../../../functions/convert-object-array-to-csv.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {User} from '../../../models/user.model';

/**
 * Create a CSV export for all User data
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function exportUsers(req: Request, res: Response): Promise<Response> {
    let success = true;
    //Select all Users
    const users: User[] = await User.findAll(
        {
            raw: true
        })
        .catch(() => {
            success = false;
            return [];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    //No customer was found! Return error message
    if (users === []) {
        return res.status(404).send(wrapResponse(false, {error: 'No user found'}));
    }

    //Customer data was found. Create CSV from array of objects
    const csvData = convertObjectArrayToCsv(users);
    const date = new Date().toISOString();
    //Set attachment to response
    res.set({'Content-Disposition': `attachment; filename="${date}_Users.csv"`});

    //Send response
    return res.send(csvData);
}
