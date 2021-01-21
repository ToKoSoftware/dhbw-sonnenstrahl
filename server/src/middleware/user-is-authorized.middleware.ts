import {NextFunction, Request, Response} from 'express';
import {wrapResponse} from '../functions/response-wrapper';
import {verifyToken} from '../functions/verify-token.func';

/**
 * Middleware for protected routes. NextFunction will only be executed if user is authorized via token in header.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function userIsAuthorized(req: Request, res: Response, next: NextFunction): Promise<void> {
    const header = req.headers.authorization;
    if (header !== undefined) {
        const [bearer, token] = header.split(' ');
        verifyToken(res, token, next);
    } else {
        res.status(401).send(wrapResponse(false, {error: 'Unauthorized!'}));
    }
}
