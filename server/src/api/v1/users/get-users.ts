import {Request, Response} from 'express';
import {User} from '../../../models/user.model';
import {wrapResponse} from '../../../functions/response-wrapper';
import {FindOptions} from 'sequelize';
import {buildQuery, QueryBuilderConfig} from '../../../functions/query-builder.func';
import {currentUserIsAdminOrMatchesId} from '../../../functions/current-user-is-admin-or-matches-id.func';

/**
 * Returns a single user with given id from request
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function getUser(req: Request, res: Response): Promise<Response> {
    let success = true;

    // User can only view his own user data. Admin can view all users
    if (!currentUserIsAdminOrMatchesId(req.params.id)) {
        return res.status(403).send(wrapResponse(false, {error: 'Unauthorized!'}));
    }

    // Return everything beside password
    const data = await User.findOne(
        {
            attributes: {exclude: ['password']},
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
    if (data === null) {
        return res.status(404).send(wrapResponse(false));
    }
    return res.send(wrapResponse(data != null, data));
}

/**
 * Returns all users
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function getUsers(req: Request, res: Response): Promise<Response> {
    // Build query with own QueryBuilder
    let query: FindOptions = {
        raw: true,
    };
    const allowedSearchFilterAndOrderFields = ['email'];
    const queryConfig: QueryBuilderConfig = {
        query: query,
        searchString: req.query.search as string || '',
        allowLimitAndOffset: true,
        allowedFilterFields: allowedSearchFilterAndOrderFields,
        allowedSearchFields: allowedSearchFilterAndOrderFields,
        allowedOrderFields: allowedSearchFilterAndOrderFields
    };
    query = buildQuery(queryConfig, req);
    // Hide password from api calls
    query.attributes = {
        exclude: ['password']
    };

    let success = true;
    // Find all users with built query
    const data = await User.findAll(query)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    return res.send(wrapResponse(true, data));
}
