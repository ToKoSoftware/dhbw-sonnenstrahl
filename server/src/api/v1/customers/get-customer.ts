import {Request, Response} from 'express';
import {FindOptions} from 'sequelize';
import {currentUserIsAdminOrMatchesId} from '../../../functions/current-user-is-admin-or-matches-id.func';
import {buildQuery, customFilterValueResolver, QueryBuilderConfig} from '../../../functions/query-builder.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Customer} from '../../../models/customer.models';
import {Vars} from '../../../vars';

/**
 * Returns a single customer with given id from request
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function getCustomer(req: Request, res: Response): Promise<Response> {
    let success = true;
    // Find customer with given id
    const customer: Customer | null = await Customer.findOne(
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
    if (customer === null) {
        return res.status(404).send(wrapResponse(false, {error: 'No customer with given id found'}));
    }
    // Authorisation check
    if (customer.userId !== undefined) {
        if (!currentUserIsAdminOrMatchesId(customer.userId)) {
            if (!Vars.currentUser.is_admin) {
                return res.status(403).send(wrapResponse(false, {error: 'Unauthorized!'}));
            }
        }
    }
    return res.send(wrapResponse(true, customer));
}

/**
 * Returns all customers
 *  - for admin: every customer
 *  - for non-admin: every customer belonging to the user (with matching userId)
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function getCustomers(req: Request, res: Response): Promise<Response> {
    let success = true;
    // Build query with own QueryBuilder
    let query: FindOptions = {
        raw: true,
    };
    const allowedSearchAndOrderFields = ['firstName', 'lastName', 'postcode'];
    const allowedFilterFields = ['id', 'userId', 'city', 'lastName', 'postcode', 'is_active'];
    const customResolver = new Map<string, customFilterValueResolver>();
    customResolver.set('is_active', (field: string, req: Request, value: string) => {
        return true;
    });
    // Add userId to query, if user.is_admin is false
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
    };
    query = buildQuery(queryConfig, req);

    // Find all Customers with built query
    const customer: Customer[] = await Customer.findAll(query)
        .catch(() => {
            success = false;
            return [];
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    return res.send(wrapResponse(true, customer));
}
