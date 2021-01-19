import {NextFunction, Request, Response} from 'express';
import {wrapResponse} from '../functions/response-wrapper';
import {verifyToken} from '../functions/verify-token.func';

/**
 * Middleware for protected (only for registered users) routes. NextFunction will only be executed if user is authed
 * Token in header.
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
