import {Request, Response} from 'express';
import {User} from '../../../models/user.model';
import {wrapResponse} from '../../../functions/response-wrapper';
import {FindOptions} from 'sequelize';
import {buildQuery, customFilterValueResolver, QueryBuilderConfig} from '../../../functions/query-builder.func';

export async function getUser(req: Request, res: Response) {
    let data;
    await User.findOne(
        {
            where: {
                id: req.params.id
            }
        })
        .then((user) => data = user)
        .catch(error => {
                data = null;
            }
        );
    // todo trow 404
    return res.send(wrapResponse(data != null, data));
}

export async function getUsers(req: Request, res: Response) {
    let query: FindOptions = {
        raw: true,
    };
    const allowedSearchFields = ['lastName', 'email'];
    const allowedFilterFields = ['firstName', 'lastName', 'email'];
    const allowedOrderFields = ['firstName', 'lastName'];
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
    await User.findAll(query)
        .then((user) => data = user)
        .catch(error => {
                success = false;
                data = [];
            }
        );

    return res.send(wrapResponse(success, data));
}