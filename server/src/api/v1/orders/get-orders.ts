import {Request, Response} from 'express';
import {Order} from '../../../models/order.model';
import {wrapResponse} from '../../../functions/response-wrapper';
import {FindOptions} from 'sequelize';
import {buildQuery, customFilterValueResolver, QueryBuilderConfig} from '../../../functions/query-builder.func';
import {Customer} from '../../../models/customer.models';
import {currentUserIsAdminOrMatchesId} from '../../../functions/current-user-is-admin-or-matches-id.func';
import {Vars} from '../../../vars';

/**
 * Returns a single order with given id from request
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function getOrder(req: Request, res: Response): Promise<Response> {
    let success = true;
    // Find order with given id
    const orderData: Order | null = await Order.findOne(
        {
            where: {
                id: req.params.id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (orderData === null) {
        return res.status(404).send(wrapResponse(false));
    }

    // Find the customer belonging to this order to have the userId
    const customerData = await Customer.findOne(
        {
            where: {
                id: orderData.customerId
            }
        })
        .catch(() => {
            success = false;
            return null;
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    // Authorisation check
    if (customerData !== null) {
        if (customerData.userId !== undefined) {
            if (!currentUserIsAdminOrMatchesId(customerData.userId)) {
                return res.status(403).send(wrapResponse(false, {error: 'Unauthorized!'}));
            }
        } else if (!Vars.currentUser.is_admin) {
            return res.status(403).send(wrapResponse(false, {error: 'Unauthorized!'}));
        }
    }

    return res.send(wrapResponse(true, orderData));
}

/**
 * Returns all orders
 *  - for admin: every order
 *  - for non-admin: every order belonging to the user (with matching userId)
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function getOrders(req: Request, res: Response): Promise<Response> {
    let success = true;
    // Build query with own QueryBuilder
    let query: FindOptions = {
        raw: true,
    };
    const allowedSearchFields = ['referrer'];
    const allowedFilterFields = ['customerId', 'planId', 'referrer', 'consumption'];
    const allowedOrderFields = ['customerId', 'planId', 'referrer', 'consumption', 'createdAt', 'terminatedAt'];
    const customResolver = new Map<string, customFilterValueResolver>();
    customResolver.set('is_active', (field: string, req: Request, value: string) => {
        return true;
    });
    if (!Vars.currentUser.is_admin) {
        // Find customers from current logged in user
        const result: Customer[] = await Customer.findAll(
            {
                attributes: ['id'],
                where: {
                    userId: Vars.currentUser.id
                },
                raw: true
            })
            .catch(() => {
                success = false;
                return [];
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
        }
        const customerIds = result.map(el => el.id);
        // Add customerIds to query
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
    };
    query = buildQuery(queryConfig, req);

    // Find all oders with built query
    const orderdata = await Order.findAll(query)
        .catch(() => {
            success = false;
            return [];
        }
        );
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    return res.send(wrapResponse(true, orderdata));
}
