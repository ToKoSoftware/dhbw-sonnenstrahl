import { Request, Response } from "express";
import { objectHasRequiredAndNotEmptyKeys } from "../../../functions/checkInputs.func";
import { wrapResponse } from "../../../functions/response-wrapper";
import { IncomingPlan, InternalPlan } from "../../../interfaces/plan.interface";
import { Plan } from "../../../models/plan.model";
import { mapPlan } from '../../../functions/map-plan.func';

export async function createPlan(req: Request, res: Response) {
    const incomingData: IncomingPlan = req.body;
    const mappedIncomingData: InternalPlan = mapPlan(incomingData);
    
    const requiredFields = Plan.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        return res.send(wrapResponse(false, {
            error: 'Not all required fields have been set'
        }))
    }

    let data = await Plan.create(mappedIncomingData)
    .catch(error => null);
    if (data === null) {
        return res.send(wrapResponse(false, {error: 'Could not create Plan'}));
    }

    return res.send(wrapResponse(true, data));
}
