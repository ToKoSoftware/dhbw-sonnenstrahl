import {IncomingPlan} from '../../interfaces/plan.interface';
import {Request, Response} from 'express';
import {wrapResponse} from '../../functions/response-wrapper';
import isBlank from 'is-blank';
import {mapPlans} from '../../functions/map-plans.func';
import {UploadedFile} from 'express-fileupload';

export async function importData(req: Request, res: Response) {
    try {
        if (isBlank(req.files) || req.files === undefined || req.files.file == null) {
            throw 'No file uploaded';
        }
        // flatten
        const file = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;
        const incomingData = await loadCSV(file);
        const targetData = incomingData.map(mapPlans);
        res.send(wrapResponse(true, targetData));
    } catch (e) {
        res.send(wrapResponse(false, {error: e}));
        return;
    }
}

async function loadCSV(file: UploadedFile): Promise<IncomingPlan[]> {
    const csv = require('csvtojson');
    return csv({delimiter: ";"}).fromFile(file.tempFilePath);
}
