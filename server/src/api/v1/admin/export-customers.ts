import {Request, Response} from 'express';
import {convertObjectArrayToCsv} from '../../../functions/convert-object-array-to-csv.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Customer} from '../../../models/customer.models';

/**
 * Create a CSV export for all Customer data (of active customers)
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function exportCustomers(req: Request, res: Response): Promise<Response> {
    let success = true;
    // Select all active Customers
    const customers: Customer[] = await Customer.findAll(
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
    // No customer was found! Return error message
    if (customers === []) {
        return res.status(404).send(wrapResponse(false, {error: 'No customer found'}));
    }

    // Customer data was found. Create CSV from array of objects
    const csvData = convertObjectArrayToCsv(customers);
    const date = new Date().toISOString();
    // Add attachment header to response
    res.set({'Content-Disposition': `attachment; filename="${date}_Customers.csv"`});

    // Send response
    return res.send(csvData);
}
