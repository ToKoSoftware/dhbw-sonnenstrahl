import {Request, Response} from 'express';
import isBlank from 'is-blank';
import {checkKeysAreNotEmptyOrNotSet} from '../../../functions/check-inputs.func';
import {mapUser} from '../../../functions/map-users.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {InternalUser} from '../../../interfaces/users.interface';
import {User} from '../../../models/user.model';
import * as EmailValidator from 'email-validator';
import {currentUserIsAdminOrMatchesId} from '../../../functions/current-user-is-admin-or-matches-id.func';

export async function updateUser(req: Request, res: Response) {
    let success = true;
    let updateResult: [number, User[]] | null;
    let APIuser: User | null;
    const incomingData: IncomingUser = req.body;
    const mappedIncomingData: InternalUser = await mapUser(incomingData);

    const requiredFields = User.requiredFields();

    const validEmail = EmailValidator.validate(mappedIncomingData.email) || isBlank(mappedIncomingData.email);

    if (isBlank(req.body) || req.params.id === null) {
        return res.status(400).send(wrapResponse(false, {error: 'No body or valid param set.'}));
    }

   if (!currentUserIsAdminOrMatchesId(req.params.id)) {
        return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
    }

    const user: User | null = await User.findOne(
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
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    //User object from database must not be null, id must not be changed and all set keys mut not be empty.
    if (
        user !== null
        && (req.body.id === undefined || req.params.id === req.body.id)
        && checkKeysAreNotEmptyOrNotSet(mappedIncomingData, requiredFields) !== false
        && validEmail
        && (req.body.is_admin === undefined)
    ) {

        const differentUser = await User.findOne(
            {
                where: {
                    email: mappedIncomingData.email
                }
            })
            .catch(error => {
                success = false;
                return null;
            });

        if (!success) {
            return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
        }
        if (differentUser !== null) {
            return res.status(400).send(wrapResponse(false, {error: 'Email already in use'}));
        }

        updateResult = await User.update(
            mappedIncomingData,
            { 
                where: {
                    id: req.params.id
                },
                returning: true,
            })
            .catch(error => {
                success = false;
                return null;
            });
      
        if (!success) {
            return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
        }
        if (updateResult === null || updateResult[0] == 0) {
            return res.status(404).send(wrapResponse(false, {error: 'No order updated'}));
        }

    } else if (user === null) {
        return res.status(404).send(wrapResponse(false, {error: 'No user with given id found'}));

    } else if (checkKeysAreNotEmptyOrNotSet(mappedIncomingData, requiredFields) === false) {
        return res.status(400).send(wrapResponse(false, {error: 'Fields must not be empty'}));

    } else if (!(req.body.id === undefined || req.params.id === req.body.id)) {
        return res.status(400).send(wrapResponse(false, {error: 'ID must not be changed'}));

    } else if (validEmail === false) {
        return res.status(400).send(wrapResponse(false, {error: 'E-mail is not valid'}));

    } else if (req.body.is_admin !== undefined) {
        return res.status(400).send(wrapResponse(false, {error: 'is_admin can not be changed'}));

    } else {
        return res.status(400).send(wrapResponse(false));
    } 
    
    //return everything beside password
    APIuser = await User.findOne(
        {
            attributes: { exclude: ['password'] },
            where: {
                id: req.params.id
            }
        })
        .catch(error => {
            success = false;
            return null
        });
 
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, APIuser));

}
