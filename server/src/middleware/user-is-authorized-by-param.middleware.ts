import {NextFunction, Request, Response} from 'express';
import {wrapResponse} from '../functions/response-wrapper';
import {verifyToken} from '../functions/verify-token.func';

/**
 * Middleware for protected (only for registered users) routes. NextFunction will only be executed if user is authenticated via Token in URL.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function userIsAuthorizedByParam(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.query.token?.toString();
    if (token !== '' && token !== undefined) {
        verifyToken(res, token, next);
    } else {
        res.status(401).send(wrapResponse(false, {error: 'Unauthorized!'}));
    }
}
