import {Plan} from '../../../models/plan.model';
import {Request, Response} from 'express';
import {FindOptions} from 'sequelize';
import {wrapResponse} from '../../../functions/response-wrapper';
import {buildQuery, customFilterValueResolver, QueryBuilderConfig} from '../../../functions/query-builder.func';

export async function getPlans(req: Request, res: Response): Promise<Response> {
    let query: FindOptions = {
        raw: true,
    };
    // todo move this to the model
    const allowedSearchFields = ['plan', 'postcode'];
    const allowedOrderFields = ['postcode', 'plan', 'cost_var', 'cost_fix'];
    const allowedFilterFields = ['id', 'postcode', 'plan', 'is_active'];

    const customResolver = new Map<string, customFilterValueResolver>();
    customResolver.set('is_active', (field: string, requ: Request, value: string) => {
        if (req.query.is_active == null) {
            return true;
        } else {
            // todo check if user is admin -> if not, return true
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
    const data: Plan[] = await Plan.findAll(query);
    return res.send(wrapResponse(true, data));
}

export async function getPlansInExternalFormat(req: Request, res: Response): Promise<Response> {
    let query: FindOptions = {
        raw: true,
    };
    // todo move this to the model
    const allowedSearchFields = ['plan', 'postcode'];
    const allowedOrderFields = ['postcode', 'plan', 'cost_var', 'cost_fix'];
    const allowedFilterFields = ['id', 'postcode', 'plan', 'is_active'];

    const customResolver = new Map<string, customFilterValueResolver>();
    customResolver.set('is_active', (field: string, requ: Request, value: string) => {
        return true;
    });
    const inputSearchString = req.query.search as string || '';
    const queryConfig: QueryBuilderConfig = {
        query: query,
        searchString: inputSearchString.replace('zipCode', 'postcode'),
        customFilterResolver: customResolver,
        allowLimitAndOffset: true,
        allowedFilterFields: allowedFilterFields,
        allowedSearchFields: allowedSearchFields,
        allowedOrderFields: allowedOrderFields
    };
    query = buildQuery(queryConfig, req);
    const data: Plan[] = await Plan.findAll(query);
    //TODO formatting of output
    return res.send(wrapResponse(true, data));
}

export async function getPlan(req: Request, res: Response): Promise<Response> {
    let success = true;
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
