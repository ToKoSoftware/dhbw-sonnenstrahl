import {Request, Response} from 'express';
import {Order} from '../../../models/order.model';
import {wrapResponse} from '../../../functions/response-wrapper';
import {FindOptions} from 'sequelize';
import {buildQuery, customFilterValueResolver, QueryBuilderConfig} from '../../../functions/query-builder.func';

export async function getOrder(req: Request, res: Response) {
    let data;
    await Order.findOne(
        {
            where: {
                id: req.params.id
            }
        })
        .then((order) => data = order)
        .catch(error => {
                data = null;
            }
        );
    // todo trow 404
    return res.send(wrapResponse(data != null, data));
}

export async function getOrders(req: Request, res: Response) {
    let query: FindOptions = {
        raw: true,
    };
    const allowedSearchFields = ['lastName', 'street', 'city'];
    const allowedFilterFields = ['firstName', 'lastName', 'street', 'streetNumber','postcode', 'city', 'planId', 'referrer', 'consumption'];
    const allowedOrderFields = ['firstName', 'lastName', 'street', 'streetNumber','postcode', 'city', 'planId', 'referrer', 'consumption'];
    let customResolver = new Map<string, customFilterValueResolver>();
    customResolver.set('is_active', (field: string, req: Request, value: string) => {
        return true;
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

    let data;
    let success = true;
    await Order.findAll(query)
        .then((order) => data = order)
        .catch(error => {
                success = false;
                data = [];
            }
        );

    return res.send(wrapResponse(success, data));
}
