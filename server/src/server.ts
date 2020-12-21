import express from 'express';
import cors from 'cors';
import {Vars} from './vars';
import {wrapResponse} from './functions/response-wrapper';
import fileUpload from 'express-fileupload';
import tempDirectory from 'temp-dir';
import {importPlan} from './api/v1/plans/import-plan';
import {getPlan, getPlans, getPlansInExternalFormat} from './api/v1/plans/get-plans';
import {getOrder, getOrders} from './api/v1/orders/get-orders';
import bodyParser from 'body-parser';
import {createExternalOrder, createInternalOrder} from './api/v1/orders/create-order';
import {updateOrder} from './api/v1/orders/update-order';
import {createPlan} from './api/v1/plans/create-plan';
import {deleteOrder} from './api/v1/orders/delete-order';
import {getUser, getUsers} from './api/v1/users/get-users';
import {createUser} from './api/v1/users/create-user';
import {deleteUser} from './api/v1/users/delete-user';
import {updateUser} from './api/v1/users/update-user';
import {terminateOrder} from './api/v1/orders/terminate-order';
import {createCustomer} from './api/v1/customers/create-customer';
import {getCustomer, getCustomers} from './api/v1/customers/get-customer';
import {updateCustomer} from './api/v1/customers/update-customer';
import {deleteCustomer} from './api/v1/customers/delete-customer';
import {loginUser} from './api/v1/users/auth-user';
import {updatePlan} from './api/v1/plans/update-plan';
import {deletePlan} from './api/v1/plans/delete-plan';
import {userIsAuthorized} from './middleware/user-is-authorized.middleware';
import {userIsAdmin} from './middleware/user-is-admin.middleware';
import {exportOrders} from './api/v1/admin/export-order';
import {userIsAuthorizedByParam} from './middleware/user-is-authorized-by-param.middleware';
import {exportUsers} from './api/v1/admin/export-users';
import {getStats} from './api/v1/admin/get-stats';
import {getMonthlyStats} from './api/v1/admin/get-monthly-stats';
import {getReferrerStats} from './api/v1/admin/get-referrer-stats';
import {getMonthlOrderStatsByReferrer} from './api/v1/admin/get-monthly-order-stats-by-referrer';

export default function startServer(): void {

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
     * Authing
     */
    app.post('/api/v1/login', (req, res) => loginUser(req, res));

    /**
     * Plans
     */
    app.get('/api/v1/plans', (req, res) => getPlans(req, res));
    app.get('/api/v1/plans/:id', (req, res) => getPlan(req, res));
    // get route for external usage
    app.get('/rates', (req, res) => getPlansInExternalFormat(req, res));
    app.put('/api/v1/plans', userIsAuthorized, userIsAdmin, (req, res) => importPlan(req, res));
    app.post('/api/v1/plans', userIsAuthorized, userIsAdmin, (req, res) => createPlan(req, res));
    app.put('/api/v1/plans/:id', userIsAuthorized, userIsAdmin, (req, res) => updatePlan(req, res));
    app.delete('/api/v1/plans/:id', userIsAuthorized, userIsAdmin, (req, res) => deletePlan(req, res));

    /**
     * Order
     */
    app.get('/api/v1/orders', userIsAuthorized, (req, res) => getOrders(req, res));
    app.get('/api/v1/orders/:id', userIsAuthorized, (req, res) => getOrder(req, res));
    app.post('/api/v1/orders', userIsAuthorized, (req, res) => createInternalOrder(req, res));
    // route for external orders
    app.post('/orders', (req, res) => createExternalOrder(req, res));
    // following route just to update the order itself. not terminating it (to set is_active = false, use /api/v1/orders/:id/terminate)
    app.put('/api/v1/orders/:id', userIsAuthorized, (req, res) => updateOrder(req, res));
    app.put('/api/v1/orders/:id/terminate', userIsAuthorized, (req, res) => terminateOrder(req, res));
    app.delete('/api/v1/orders/:id', userIsAuthorized, userIsAdmin, (req, res) => deleteOrder(req, res));

    /**
     * User
     */
    app.get('/api/v1/users', userIsAuthorized, userIsAdmin, (req, res) => getUsers(req, res));
    app.get('/api/v1/users/:id', userIsAuthorized, (req, res) => getUser(req, res));
    app.post('/api/v1/users', (req, res) => createUser(req, res));
    app.put('/api/v1/users/:id', userIsAuthorized, (req, res) => updateUser(req, res));
    app.delete('/api/v1/users/:id', userIsAuthorized, userIsAdmin, (req, res) => deleteUser(req, res));

    /**
     * Customer
     */
    app.get('/api/v1/customers', userIsAuthorized, (req, res) => getCustomers(req, res));
    app.get('/api/v1/customers/:id', userIsAuthorized, (req, res) => getCustomer(req, res));
    app.post('/api/v1/customers', (req, res) => createCustomer(req, res));
    app.put('/api/v1/customers/:id', userIsAuthorized, (req, res) => updateCustomer(req, res));
    app.delete('/api/v1/customers/:id', userIsAuthorized, userIsAdmin, (req, res) => deleteCustomer(req, res));

    /**
     * Admin
     */
    app.get('/api/v1/admin/stats', userIsAuthorized, userIsAdmin, (req, res) => getStats(req, res));
    app.get('/api/v1/admin/stats/monthly', userIsAuthorized, userIsAdmin, (req, res) => getMonthlyStats(req, res));
    app.get('/api/v1/admin/stats/referrer', userIsAuthorized, userIsAdmin, (req, res) => getReferrerStats(req, res));
    app.get('/api/v1/admin/stats/orders/monthly', userIsAuthorized, userIsAdmin, (req, res) => getMonthlOrderStatsByReferrer(req, res));
    //following two routes only via frontend/browser functionable with download
    app.get('/api/v1/admin/export/orders', userIsAuthorizedByParam, userIsAdmin, (req, res) => exportOrders(req, res));
    app.get('/api/v1/admin/export/users', userIsAuthorizedByParam, userIsAdmin, (req, res) => exportUsers(req, res));


    app.use((req, res) => {
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
