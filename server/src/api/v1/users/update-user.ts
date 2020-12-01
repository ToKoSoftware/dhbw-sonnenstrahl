import { Request, Response } from "express";
import isBlank from "is-blank";
import { checkKeysAreNotEmptyOrNotSet } from "../../../functions/check-inputs.func";
import { mapUser } from "../../../functions/map-users.func";
import { wrapResponse } from "../../../functions/response-wrapper";
import { IncomingUser, InternalUser } from "../../../interfaces/users.interface";
import { User } from "../../../models/user.model";
import { Customer } from "../../../models/customer.models";
import * as EmailValidator from 'email-validator';
import { Vars } from "../../../vars";

export async function updateUser(req: Request, res: Response) {
    let success = true;
    let user: User | null;
    let customer: Customer | null;
    let updateResult;
    const incomingData: IncomingUser = req.body;
    const mappedIncomingData: InternalUser = mapUser(incomingData);

    let requiredFields = User.requiredFields();

    let validEmail = EmailValidator.validate(mappedIncomingData.email) || isBlank(mappedIncomingData.email);

    


    if (isBlank(req.body) || req.params.id === null) {
        return res.send(wrapResponse(false, { error: "No body or valid param set." }));

    } else {
        user = await User.findOne(
            {
                where: {
                    id: req.params.id,
                
                }
            })
            .catch(error => {
                success = false;
                return null;
            });

        if (req.body.customerId !== undefined || req.body.customerId !== null ) {
            customer =  await Customer.findOne(
                {
                    where: {
                        id: req.body.customerId
                    }
                })
                .catch(error => {
                    success = false;
                    return null;
                });
        };
    
    }
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
  
    //User Objekt from database must not be null, id must not be changed and all set keys mut not be empty.
    if (user !== null && (customer !== null) && (req.body.id === undefined || req.params.id === req.body.id) && checkKeysAreNotEmptyOrNotSet(mappedIncomingData, requiredFields) !== false && validEmail !== false && (req.body.is_admin === undefined) ) {

        updateResult = await User.update(
            req.body,
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
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if (updateResult === null || updateResult[0] == 0) {
            return res.status(404).send(wrapResponse(false, { error: 'No order updated' }));
        }

    } else if (user === null) {
        return res.status(404).send(wrapResponse(false, { error: "No user with given id found" }));

    } else if (customer === null) {
        return res.status(404).send(wrapResponse(false, { error: "No customer with given id found" }));

    } else if (checkKeysAreNotEmptyOrNotSet(mappedIncomingData, requiredFields) === false) {
        return res.status(400).send(wrapResponse(false, { error: "Fields must not be empty" }));

    } else if (!(req.body.id === undefined || req.params.id === req.body.id)) {
        return res.status(400).send(wrapResponse(false, { error: "ID must not be changed" }));
        
    } else if (validEmail === false) {
        return res.status(400).send(wrapResponse(false, {error: 'E-mail is not valid'}));

    } else if (req.body.is_admin !== undefined) {
        return res.status(400).send(wrapResponse(false, {error: 'is_admin can not be changed'}));    
        
    }else {
        return res.status(400).send(wrapResponse(false));
    }


    

    return res.send(wrapResponse(true, updateResult[1]));

}