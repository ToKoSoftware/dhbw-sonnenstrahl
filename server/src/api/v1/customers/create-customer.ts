import {Request, Response} from 'express';
import {objectHasRequiredAndNotEmptyKeys} from '../../../functions/check-inputs.func';
import {mapCustomer} from '../../../functions/map-customer.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {InternalCustomer} from '../../../interfaces/customers.interface';
import {Customer} from '../../../models/customer.models';
import {User} from '../../../models/user.model';

/**
 * Creates a customer
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function createCustomer(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: InternalCustomer = req.body;
    // Mapping of incomming format/data on internal format/data
    const mappedIncomingData: InternalCustomer = mapCustomer(incomingData);

    // Check if all required fields for this model are set
    const requiredFields = Customer.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(incomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, {
            error: 'Not all required fields have been set'
        }));
    }

    // If the new customer should belong to a existing user, check if the user exists
    if (mappedIncomingData.userId !== null) {
        const user = await User.findOne(
            {
                where: {
                    id: mappedIncomingData.userId
                }
            }
        )
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
        }
        if (user === null) {
            return res.status(404).send(wrapResponse(false, {error: 'No user with given userId found!'}));
        }
    }

    // Create customer from given mapped data
    const data = await Customer.create(mappedIncomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (data === null) {
        return res.status(400).send(wrapResponse(false, {error: 'Could not create Customer'}));
    }

    return res.status(201).send(wrapResponse(true, data));
}
