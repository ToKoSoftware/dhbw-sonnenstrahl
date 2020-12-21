import {Request, Response} from 'express';
import {objectHasRequiredAndNotEmptyKeys} from '../../../functions/check-inputs.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {InternalPlan} from '../../../interfaces/plan.interface';
import {Plan} from '../../../models/plan.model';

export async function createPlan(req: Request, res: Response): Promise<Response> {
    const incomingData: InternalPlan = req.body;

    const requiredFields = Plan.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(incomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, {
            error: 'Not all required fields have been set'
        }));
    }

    const data = await Plan.create(incomingData)
        .catch(() => null);
    if (data === null) {
        return res.status(500).send(wrapResponse(false, {error: 'Could not create Plan'}));
    }

    return res.send(wrapResponse(true, data));
}
