import {Request, Response} from 'express';
import {Order} from '../../../models/order.model';
import {wrapResponse} from '../../../functions/response-wrapper';
import {FindOptions} from 'sequelize';
import {buildQuery, customFilterValueResolver, QueryBuilderConfig} from '../../../functions/query-builder.func';

export async function getOrder(req: Request, res: Response) {
    let data = null;
    let success: boolean = true;
    await Order.findOne(
        {
            where: {
                id: req.params.id
            }
        })
        .then((order) => data = order)
        .catch(error => {
                success = false;
            }
        );

    if(!success){
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }    
    if (data === null) {
        return res.status(404).send(wrapResponse(false));
    }
    return res.send(wrapResponse(true, data));
}

export async function getOrders(req: Request, res: Response) {
    let query: FindOptions = {
        raw: true,
    };
    const allowedSearchFields = ['customerId'];
    const allowedFilterFields = ['customerId', 'planId', 'referrer', 'consumption'];
    const allowedOrderFields = ['customerId', 'planId', 'referrer', 'consumption'];
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

    let orderdata;
    let success = true;
    await Order.findAll(query)
        .then((order) => orderdata = order)
        .catch(error => {
                success = false;
                orderdata = [];
            }
        );
    if (!success) {
        res.status(500);
    }

    //TODO: Fraglich, ob customerId ausgeben oder Customer Infos mit ausgeben
    return res.send(wrapResponse(success, orderdata));
}
