import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {IncomingUser} from '../../../interfaces/users.interface';
import {User} from '../../../models/user.model';
import {objectHasRequiredAndNotEmptyKeys} from '../../../functions/checkInputs.func';

export async function createUser(req: Request, res: Response) {
    const incomingData: IncomingUser = req.body;

    let requiredFields = User.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(incomingData, requiredFields)) {
        res.send(wrapResponse(false, {error: 'Not all required fields have been set'}));
        return;
    let data = await User.create(incomingData).then((res) => res).catch(error => null);
    if (data === null) {
        return res.send(wrapResponse(false, {error: 'Could not create User'}));
        }
    return res.send(wrapResponse(true, data));
    }}