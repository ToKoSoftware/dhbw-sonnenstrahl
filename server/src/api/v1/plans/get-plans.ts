import {Plan} from '../../../models/plan.model';
import {Request, Response} from 'express';
import {FindOptions} from 'sequelize';
import {wrapResponse} from '../../../functions/response-wrapper';
import {buildQuery, customFilterValueResolver, QueryBuilderConfig} from '../../../functions/query-builder.func';

/**
 * Returns all plans
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function getPlans(req: Request, res: Response): Promise<Response> {
    let success = true;
    // Build query with own QueryBuilder
    let query: FindOptions = {
        raw: true,
    };
    const allowedSearchFields = ['plan', 'postcode'];
    const allowedOrderFields = ['postcode', 'plan', 'cost_var', 'cost_fix'];
    const allowedFilterFields = ['id', 'postcode', 'plan', 'is_active'];

    const customResolver = new Map<string, customFilterValueResolver>();
    customResolver.set('is_active', (field: string, requ: Request, value: string) => {
        if (req.query.is_active == null) {
            return true;
        } else {
            return req.query.is_active === 'all' ? '' : (req.query.is_active === 'true');
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
    };
    query = buildQuery(queryConfig, req);
    const data: Plan[] = await Plan.findAll(query).catch(() => {
        success = false;
        return [];
    });

    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    return res.send(wrapResponse(true, data));
}

/**
 * Returns a single plan with given id from request
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function getPlan(req: Request, res: Response): Promise<Response> {
    let success = true;
    // Find plan with given id
    const data = await Plan.findOne(
        {
            where: {
                id: req.params.id
            },
            raw: true
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    if (data === null) {
        return res.status(404).send(wrapResponse(false, {error: 'No plan with given id found'}));
    }

    return res.send(wrapResponse(true, data));
}
