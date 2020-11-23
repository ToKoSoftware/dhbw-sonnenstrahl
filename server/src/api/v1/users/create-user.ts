import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {IncomingUser, InternalUser} from '../../../interfaces/users.interface';
import {User} from '../../../models/user.model';
import {mapUser} from '../../../functions/map-users.func';
import {objectHasRequiredAndNotEmptyKeys} from '../../../functions/checkInputs.func';
import { Vars } from '../../../vars';

export async function createUser(req: Request, res: Response) {
    const incomingData: IncomingUser = req.body;
    const mappedIncomingData: InternalUser = mapUser(incomingData);

    let requiredFields = User.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        res.send(wrapResponse(false, {error: 'Not all required fields have been set'}));
        return;
    }

    let user = await User.findOne(
        {
            where: {
                email: mappedIncomingData.email
            }
        }
    ).catch((error) => {
        return null;
    });

    if (user === null){
        let data = await User.create(mappedIncomingData).then((res) => res).catch(error => null);
        if (data === null) {
            return res.send(wrapResponse(false, {error: 'Could not create User'}));
        }
        return res.send(wrapResponse(true, data));
    } else {
        return res.send(wrapResponse(false, {error: 'E-mail is already in use'}));
    }
}