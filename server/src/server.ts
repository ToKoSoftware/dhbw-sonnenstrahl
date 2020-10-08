import express from 'express';
import cors from 'cors';
import {Vars} from './vars';
import {wrapResponse} from './functions/response-wrapper';
import fileUpload from 'express-fileupload';
import tempDirectory from 'temp-dir';
import {importData} from './api/v1/import-data';

export default function startServer() {

    /**
     * Setup
     */
    const app = express();
    app.use(cors());
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
    app.get('/api/v1', (req, res) => {
        res.send(wrapResponse(true));
    });


    app.get('/api/v1/plans', (req, res) => {

    });

    app.get('/api/v1/plan/:id', (req, res) => {

    });

    app.put('/api/v1/plans', (req, res) => importData(req, res));


    app.post('/api/v1/order-plan', (req, res) => {

    });

    app.post('/api/v1/update-plans', (req, res) => {

    });

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
