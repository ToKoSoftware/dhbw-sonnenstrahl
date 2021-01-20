import {NextFunction, Request, Response} from 'express';
import {wrapResponse} from '../functions/response-wrapper';
import {Vars} from '../vars';

/**
 * Middleware for admin-routes. NextFunction will only be executed if authorized user is admin
 * @param req
 * @param res
 * @param next
 */
export function userIsAdmin(req: Request, res: Response, next: NextFunction): void {
    if (Vars.currentUser.is_admin) {
        next();
    } else {
        res.status(403).send(wrapResponse(false, {error: 'Permission denied!'}));
        return;
    }
}
