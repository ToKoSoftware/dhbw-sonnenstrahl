import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Plan} from '../../../models/plan.model';

/**
 * (Soft) deletes a plan with a given id from request
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function deletePlan(req: Request, res: Response): Promise<Response> {
    let success = true;

    // A plan can always be set to inactive, even if it has active orders
    const updateResult = await Plan.update(
        {
            is_active: false
        },
        {
            where: {
                id: req.params.id
            },
            returning: true,
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (updateResult === null || updateResult[0] == 0) {
        return res.status(400).send(wrapResponse(false, {error: 'No plan updated'}));
    }
    return res.status(204).send(wrapResponse(true));
}
