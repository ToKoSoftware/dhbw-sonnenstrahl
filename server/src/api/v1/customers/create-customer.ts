import {Request, Response} from 'express';
import {objectHasRequiredAndNotEmptyKeys} from '../../../functions/check-inputs.func';
import { mapCustomer } from '../../../functions/map-customer.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {InternalCustomer} from '../../../interfaces/customers.interface';
import {Customer} from '../../../models/customer.models';
import { User } from '../../../models/user.model';

export async function createCustomer(req: Request, res: Response) {
    let success = true;
    const incomingData: InternalCustomer = req.body;
    const mappedIncomingData: InternalCustomer = mapCustomer(incomingData);

    const requiredFields = Customer.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(incomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, {
            error: 'Not all required fields have been set'
        }));
    }

    if(mappedIncomingData.userId !== null){
        let user = await User.findOne(
            {
                where: {
                    id: mappedIncomingData.userId
                }
            }
        )
        .catch(error => {
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

    const data = await Customer.create(mappedIncomingData)
        .catch(error => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (data === null) {
        return res.status(500).send(wrapResponse(false, {error: 'Could not create Customer'}));
    }

    return res.send(wrapResponse(true, data));
}
