import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {InternalUser} from '../../../interfaces/users.interface';
import {User} from '../../../models/user.model';
import {mapUser} from '../../../functions/map-users.func';
import {objectHasRequiredAndNotEmptyKeys} from '../../../functions/check-inputs.func';
import * as EmailValidator from 'email-validator';

/**
 * Creates an user
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function createUser(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: InternalUser = req.body;
    // Mapping of user data including hashing password
    const mappedIncomingData: InternalUser = await mapUser(incomingData);

    // All required fields defined in the model have to be set
    const requiredFields = User.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, {error: 'Not all required fields have been set'}));
    }
    const validEmail = EmailValidator.validate(mappedIncomingData.email);

    if (!validEmail) {
        return res.status(400).send(wrapResponse(false, {error: 'E-mail is not valid'}));
    }

    // Check if there exists already an user with the email
    const user = await User.findOne(
        {
            where: {
                email: mappedIncomingData.email
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    // If no user with given email is found, create new.
    if (user === null) {

        const createdData = await User.create(mappedIncomingData)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success || createdData === null) {
            return res.status(500).send(wrapResponse(false, {error: 'Could not create User'}));
        }
        // Return everything beside password
        const user = await User.findOne({
            attributes: {exclude: ['password']},
            where: {
                id: createdData.id
            }
        })
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
        }
        return res.status(201).send(wrapResponse(true, user));
    } else {
        return res.status(400).send(wrapResponse(false, {error: 'Email is already in use'}));
    }

}
