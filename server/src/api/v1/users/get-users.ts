import { Request, Response } from 'express';
import { User } from '../../../models/user.model';
import { wrapResponse } from '../../../functions/response-wrapper';
import { FindOptions } from 'sequelize';
import { buildQuery, customFilterValueResolver, QueryBuilderConfig } from '../../../functions/query-builder.func';

export async function getUser(req: Request, res: Response) {
    let data;
    await User.findOne(
        {
            where: {
                id: req.params.id
            }
        })
        .then((user) => data = user)
        .catch(error => { data = null });
    // TODO throw 500 in catch case and 404 in case nothing was found
    return res.send(wrapResponse(data != null, data));
}

export async function getUsers(req: Request, res: Response) {
    let query: FindOptions = {
        raw: true,
    };
    const allowedSearchFilterAndOrderFields = ['email'];
    let customResolver = new Map<string, customFilterValueResolver>();
    const queryConfig: QueryBuilderConfig = {
        query: query,
        searchString: req.query.search as string || '',
        allowLimitAndOffset: true,
        allowedFilterFields: allowedSearchFilterAndOrderFields,
        allowedSearchFields: allowedSearchFilterAndOrderFields,
        allowedOrderFields: allowedSearchFilterAndOrderFields
    }
    query = buildQuery(queryConfig, req);

    let data;
    let success = true;
    await User.findAll(query)
        .then((user) => data = user)
        .catch(error => {
            success = false;
            data = [];
        });

    return res.send(wrapResponse(success, data));
}
