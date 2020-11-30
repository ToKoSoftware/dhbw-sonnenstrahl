import { Plan } from "../../../models/plan.model";
import { Request, Response } from "express";
import { FindOptions, Op } from "sequelize";
import { wrapResponse } from "../../../functions/response-wrapper";
import { buildQuery, customFilterValueResolver, QueryBuilderConfig } from "../../../functions/query-builder.func";

export async function getPlans(req: Request, res: Response) {
    let query: FindOptions = {
        raw: true,
    };
    // todo move this to the model
    const allowedSearchFields = ['plan', 'postcode'];
    const allowedOrderFields = ['postcode', 'plan', 'cost_var', 'cost_fix'];
    const allowedFilterFields = ['id', 'postcode', 'plan', 'is_active'];

    let customResolver = new Map<string, customFilterValueResolver>();
    customResolver.set('is_active', (field: string, requ: Request, value: string) => {
        if (req.query.is_active == null){
            return true;
        } else {
            // todo check if user is admin -> if not, return true
            return req.query.is_active === 'all'? '' : (req.query.is_active === 'true');
        }
    });
    const queryConfig: QueryBuilderConfig = {
        query: query,
        searchString: req.query.search as string || '',
        customFilterResolver: customResolver,
        allowLimitAndOffset: true,
        allowedFilterFields: allowedFilterFields,
        allowedSearchFields: allowedSearchFields,
        allowedOrderFields: allowedOrderFields
    }
    query = buildQuery(queryConfig, req);
    let data: unknown = [];
    await Plan.findAll(query).then(d => {
        data = d;
    });
    return res.send(wrapResponse(true, data));
}

export async function getPlan(req: Request, res: Response) {
    let data = null;
    let success: boolean = true;
    await Plan.findOne(
        {
            where: {
                id: req.params.id
            },
            raw: true
        })
        .then(
            d => {
                data = d;
            }
        )
        .catch(error => {
            success = false;
            return null
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    };

    if (data === null) {
        return res.status(404).send(wrapResponse(false));
    }

    return res.send(wrapResponse(true, data));
}
