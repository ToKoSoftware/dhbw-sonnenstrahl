import {Request, Response} from 'express';
import {convertObjectArrayToCsv} from '../../../functions/convert-object-array-to-csv.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Customer} from '../../../models/customer.models';

export async function exportCustomers(req: Request, res: Response): Promise<Response>  {
    let success = true;
    const users: Customer[] = await Customer.findAll(
        {
            where: {
                is_active: true
            },
            raw: true
        })
        .catch(() => {
            success = false;
            return [];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (users === []) {
        return res.status(404).send(wrapResponse(false, {error: 'No user found'}));
    }

    const csvData = convertObjectArrayToCsv(users);
    const date = new Date().toISOString();
    res.set({'Content-Disposition': `attachment; filename="${date}_Customers.csv"`});

    return res.send(csvData);
}
