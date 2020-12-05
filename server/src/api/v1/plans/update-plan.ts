import { Request, Response } from "express";
import isBlank from "is-blank";
import { checkKeysAreNotEmptyOrNotSet } from "../../../functions/check-inputs.func";
import { mapPlan } from "../../../functions/map-plan.func";
import { wrapResponse } from "../../../functions/response-wrapper";
import { IncomingPlan, InternalPlan } from "../../../interfaces/plan.interface";
import { Order } from "../../../models/order.model";
import { Plan } from "../../../models/plan.model";

export async function updatePlan(req: Request, res: Response) {
    let success = true;
    let plan: Plan | null;
    let updateResult;
    const incomingData: IncomingPlan = req.body;
    const mappedIncomingData: InternalPlan = mapPlan(incomingData);

    let requiredFields = Plan.requiredFields();

    if (isBlank(req.body) || req.params.id === null) {
        return res.status(400).send(wrapResponse(false, { error: "No body or valid param set." }));

    } else {
        // Check if a plan exists with given id
        plan = await Plan.findOne(
            {
                where: {
                    id: req.params.id
                }
            })
            .catch(error => {
                success = false;
                return null;
            });
    }
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    if (plan === null) {
        return res.status(404).send(wrapResponse(false, { error: 'No plan with given id found' }));
    } else {
        // check if the postcode should be changed. If it should, ther must not be an active order with the given planId
        if (!(plan.postcode === mappedIncomingData.postcode || mappedIncomingData.postcode === undefined)) {
            let activeOrders: Order | null = await Order.findOne(
                {
                    where: {
                        planId: req.params.id,
                        terminatedAt: null
                    }
                })
                .catch(error => {
                    success = false;
                    return null;
                });
            if (!success) {
                return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
            }
            if (activeOrders !== null) {
                return res.status(400).send(wrapResponse(false, { error: 'The given planId has active Orders. You can not change the field postcode/zipCode' }))
            }
        }

        if ((req.body.id === undefined || req.params.id === req.body.id) && checkKeysAreNotEmptyOrNotSet(mappedIncomingData, requiredFields) !== false) {

            updateResult = await Plan.update(
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
                return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
            }
            if (updateResult === null || updateResult[0] == 0) {
                return res.status(404).send(wrapResponse(false, { error: 'No plan updated' }));
            }

        } else if (checkKeysAreNotEmptyOrNotSet(mappedIncomingData, requiredFields) === false) {
            return res.status(400).send(wrapResponse(false, { error: "Fields must not be empty" }));

        } else if (!(req.body.id === undefined || req.params.id === req.body.id)) {
            return res.status(400).send(wrapResponse(false, { error: "ID must not be changed" }));
        } else {
            return res.status(400).send(wrapResponse(false));
        }

        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
    }
    return res.send(wrapResponse(success, updateResult[1]));

}