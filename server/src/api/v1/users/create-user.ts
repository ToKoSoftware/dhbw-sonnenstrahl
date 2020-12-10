import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { InternalUser } from '../../../interfaces/users.interface';
import { User } from '../../../models/user.model';
import { mapUser } from '../../../functions/map-users.func';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import * as EmailValidator from 'email-validator';

export async function createUser(req: Request, res: Response) {
    const mappedIncomingData: InternalUser = mapUser(req.body);

    let requiredFields = User.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        res.send(wrapResponse(false, { error: 'Not all required fields have been set' }));
        return;
    }
    let validEmail = EmailValidator.validate(mappedIncomingData.email);

    if (validEmail === false) {
        return res.status(400).send(wrapResponse(false, { error: 'E-mail is not valid' }));
    } else {
        let success = true;
        let user = await User.findOne(
            {
                where: {
                    email: mappedIncomingData.email
                }
            })
            .catch((error) => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        
        if (user === null) {
            let createdData = await User.create(mappedIncomingData).then((res) => res).catch(error => null);
            if (createdData === null) {
                return res.status(500).send(wrapResponse(false, { error: 'Could not create User' }));
            }
            //return everything beside password
            let data = await User.findOne({
                attributes: { exclude: ['password'] },
                where: {
                    id: createdData.id
                }
            })
                .catch((error) => {
                    success = false;
                    return null;
                });
            if (!success) {
                return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
            }
            return res.send(wrapResponse(true, data));
        } else {
            return res.status(400).send(wrapResponse(false, { error: 'E-mail is already in use' }));
        }
    }
}
