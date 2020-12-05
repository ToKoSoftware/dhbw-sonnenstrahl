import { Request, Response } from "express";
import { FindOptions } from "sequelize";
import { currentUserIsAdminOrMatchesId } from "../../../functions/current-user-is-admin-or-matches-id.func";
import { buildQuery, customFilterValueResolver, QueryBuilderConfig } from "../../../functions/query-builder.func";
import { wrapResponse } from "../../../functions/response-wrapper";
import { Customer } from "../../../models/customer.models";
import { Vars } from "../../../vars";

export async function getCustomer(req: Request, res: Response) {
    let success = true;
    let customer: Customer | null = await Customer.findOne(
        {
            where: {
                id: req.params.id
            }
        })
        .catch(error => {
            success = false;
            return null
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (customer === null) {
        return res.status(404).send(wrapResponse(false));
    }
    //authorisation check
    if (customer.userId !== undefined) {
        if (!currentUserIsAdminOrMatchesId(customer.userId)) {
            return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
        }
    } else if (!Vars.currentUser.is_admin) {
        return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
    }
    return res.send(wrapResponse(true, customer));
}


export async function getCustomers(req: Request, res: Response) {
    let success = true;
    let query: FindOptions = {
        raw: true,
    };
    // todo move this to the model
    const allowedSearchAndOrderFields = ['firstName', 'lastName', 'postcode'];
    const allowedFilterFields = ['userId'];
    let customResolver = new Map<string, customFilterValueResolver>();
    customResolver.set('is_active', (field: string, req: Request, value: string) => {
        return true;
    });
    if (!Vars.currentUser.is_admin) {
        customResolver.set('userId', (field: string, req: Request, value: string) => {
            return Vars.currentUser.id;
        });
    }
    const queryConfig: QueryBuilderConfig = {
        query: query,
        searchString: req.query.search as string || '',
        customFilterResolver: customResolver,
        allowLimitAndOffset: true,
        allowedFilterFields: allowedFilterFields,
        allowedSearchFields: allowedSearchAndOrderFields,
        allowedOrderFields: allowedSearchAndOrderFields
    }
    query = buildQuery(queryConfig, req);
    let data: unknown = [];
    await Customer.findAll(query)
        .then(d => data = d)
        .catch(error => success = false);

    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    return res.send(wrapResponse(true, data));
}
