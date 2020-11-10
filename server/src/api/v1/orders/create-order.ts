import {Request, Response} from 'express';
import {Vars} from '../../../vars';
import {wrapResponse} from '../../../functions/response-wrapper';
import {IncomingOrder} from '../../../interfaces/orders.interface';
import {Order} from '../../../models/order.model';

export async function createOrder(req: Request, res: Response) {
    let incomingData: IncomingOrder = req.body;

    Order.create()
    // 1. Daten entgegennehmen
    // 2. Daten speichern
    // 3. Ausgabe machen
    return res.send(wrapResponse(true));
}
