import express from 'express';
import cors from 'cors';
import {Vars} from './vars';
import {wrapResponse} from './functions/response-wrapper';
import fileUpload from 'express-fileupload';
import tempDirectory from 'temp-dir';
import {importPlan} from './api/v1/plans/import-plan';
import {getPlan, getPlans} from "./api/v1/plans/get-plans";
import {getOrder, getOrders} from './api/v1/orders/get-orders';
import bodyParser from 'body-parser';
import {createOrder} from './api/v1/orders/create-order';
import {updateOrder} from './api/v1/orders/update-order';
import { createPlan } from './api/v1/plans/create-plan';
import { deleteOrder } from './api/v1/orders/delete-order';
import { getUser, getUsers } from './api/v1/users/get-users';
import {createUser} from './api/v1/users/create-user';

export default function startServer() {

    /**
     * Setup
     */
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    const PORT: string | number = process.env.PORT || 5000;
    const router = express.Router();
    app.use(router);

    /**
     * File uploads
     */
    app.use(fileUpload({
        useTempFiles: true,
        tempFileDir: tempDirectory
    }));

    /**
     * Routes
     */
    app.get('/api/v1', (req, res) => res.send(wrapResponse(true)));

    /**
     * Plans
     */
    app.get('/api/v1/plans', (req, res) => getPlans(req, res));
    app.put('/api/v1/plans', (req, res) => importPlan(req, res));
    app.get('/api/v1/plans/:id', (req, res) => getPlan(req,res));
    app.post('/api/v1/plans', (req, res) => createPlan(req, res)); 


    /**
     * Order
     */
    app.get('/api/v1/orders', (req, res) => getOrders(req, res));
    app.get('/api/v1/orders/:id', (req, res) => getOrder(req, res));
    app.post('/api/v1/orders', (req, res) => createOrder(req, res));
    app.post('/orders', (req, res) => createOrder(req, res));
    app.put('/api/v1/orders/:id', (req, res) => updateOrder(req, res));
    app.delete('/api/v1/orders/:id', (req, res) => deleteOrder(req, res));

     /**
     * User
     */
    app.get('/api/v1/users', (req, res) => getUsers(req, res));
    app.get('/api/v1/users/:id', (req, res) => getUser(req, res));
    app.post('/api/v1/users', (req, res) => createUser(req, res));
    app.post('/users', (req, res) => createUser(req, res));


    app.use((req, res, next) => {
        res.status(404).send(wrapResponse(false, {
            error: 'Unable to find the requested resource!'
        }));
        Vars.loggy.error('[Router] Error 404: Request: ', {
            url: req.url,
            query: req.query,
            statusCode: req.statusCode,
            method: req.method,
            protocol: req.protocol,
            headers: {
                userAgent: req.headers['user-agent']
            }
        });
    });

   
    /**
     * Server
     */
    app.listen(PORT, () => Vars.loggy.log(`[Server] Starting on http://localhost:${PORT}`));
}
