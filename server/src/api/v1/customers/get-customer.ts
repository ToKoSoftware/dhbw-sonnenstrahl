import { Request, Response } from "express";
import { FindOptions } from "sequelize";
import { buildQuery, customFilterValueResolver, QueryBuilderConfig } from "../../../functions/query-builder.func";
import { wrapResponse } from "../../../functions/response-wrapper";
import { Customer } from "../../../models/customer.models";

export async function getCustomer(req: Request, res: Response) {
    let data = null;
    let success = true;
    await Customer.findOne(
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then((customer) => data = customer)
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


export async function getCustomers(req: Request, res: Response){
    let query: FindOptions = {
        raw: true,
    };
    // todo move this to the model
    const allowedSearchFilterAndOrderFields = ['firstName', 'lastName', 'postcode'];

    let customResolver = new Map<string, customFilterValueResolver>();
    customResolver.set('is_active', (field: string, req: Request, value: string) => {
        return true;
    });
    const queryConfig: QueryBuilderConfig = {
        query: query,
        searchString: req.query.search as string || '',
        customFilterResolver: customResolver,
        allowLimitAndOffset: true,
        allowedFilterFields: allowedSearchFilterAndOrderFields,
        allowedSearchFields: allowedSearchFilterAndOrderFields,
        allowedOrderFields: allowedSearchFilterAndOrderFields
    }
    query = buildQuery(queryConfig, req);
    let data: unknown = [];
    await Customer.findAll(query).then(d => {
        data = d;
    });
    return res.send(wrapResponse(true, data));
}
