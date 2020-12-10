import { Request, Response } from 'express';
import { Order } from '../../../models/order.model';
import { wrapResponse } from '../../../functions/response-wrapper';
import { FindOptions } from 'sequelize';
import { buildQuery, customFilterValueResolver, QueryBuilderConfig } from '../../../functions/query-builder.func';
import { Customer } from '../../../models/customer.models';
import { currentUserIsAdminOrMatchesId } from '../../../functions/current-user-is-admin-or-matches-id.func';
import { Vars } from '../../../vars';

export async function getOrder(req: Request, res: Response) {
    let success = true;
    let orderData: Order | null = await Order.findOne(
        {
            where: {
                id: req.params.id
            }
        })
        .catch(error => {
            success = false;
            return null;
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (orderData === null) {
        return res.status(404).send(wrapResponse(false));
    }

    let customerData = await Customer.findOne(
        {
            where: {
                id: orderData.customerId
            }
        })
        .catch(error => {
            success = false;
            return null;
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (customerData !== null) {
        if (customerData.userId !== undefined) {
            if (!currentUserIsAdminOrMatchesId(customerData.userId)) {
                return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
            }
        } else if (!Vars.currentUser.is_admin) {
            return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
        }
    }

    return res.send(wrapResponse(true, { orderData, customerData }));
}

export async function getOrders(req: Request, res: Response) {
    let success = true;
    let query: FindOptions = {
        raw: true,
    };
    const allowedSearchFields = ['referrer'];
    const allowedFilterFields = ['customerId', 'planId', 'referrer', 'consumption'];
    const allowedOrderFields = ['customerId', 'planId', 'referrer', 'consumption'];
    let customResolver = new Map<string, customFilterValueResolver>();
    customResolver.set('is_active', (field: string, req: Request, value: string) => {
        return true;
    });
    if (!Vars.currentUser.is_admin) {
        let result: Customer[] = await Customer.findAll(
            {
                attributes: ['id'],
                where: {
                    userId: Vars.currentUser.id
                },
                raw: true
            })
            .catch(error => {
                success = false;
                return [];
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        let customerIds: string[] = [];
        result.forEach(el => {
            customerIds.push(el.id);
        });
        customResolver.set('customerId', (field: string, req: Request, value: string) => {
            return customerIds;
        });
    }
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
    await Order.findAll(query)
        .then((order) => orderdata = order)
        .catch(error => {
            success = false;
            orderdata = [];
        }
        );
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, orderdata));
}
