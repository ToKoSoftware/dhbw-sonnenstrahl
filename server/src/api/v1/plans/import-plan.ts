import {IncomingPlan, InternalPlan} from '../../../interfaces/plan.interface';
import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import isBlank from 'is-blank';
import {mapPlan} from '../../../functions/map-plan.func';
import {UploadedFile} from 'express-fileupload';
import {Plan} from '../../../models/plan.model';

export async function importPlan(req: Request, res: Response) {
    try {
        if (isBlank(req.files) || req.files === undefined || req.files.file == null) {
            throw 'No file uploaded';
        }
        // flatten
        const file: UploadedFile = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;
        const splittedFileName = file.name.split('.');
        const fileExtension = splittedFileName[splittedFileName.length - 1];
        if (fileExtension !== "csv") {
            throw 'Wrong File Extension, expected csv - got ' + fileExtension;
        }
        const incomingData = await loadCSV(file);
        const targetData: InternalPlan[] = incomingData.map(mapPlan);
        await deactivatePlans();
        targetData.forEach(createPlanEntry);
        res.send(wrapResponse(true, targetData));
    } catch (e) {
        res.status(400).send(wrapResponse(false, {error: e}));
        return;
    }
}

async function loadCSV(file: UploadedFile): Promise<IncomingPlan[]> {
    const csv = require('csvtojson');
    return csv({
            delimiter: ';',
            colParser: {
                Fixkosten: transformEuroToCents,
                VariableKosten: transformEuroToCents
            }
        }
    ).fromFile(file.tempFilePath);
}

function deactivatePlans(): Promise<any> {
    return Plan.update(
        {
            is_active: false
        },
        {
            where: {
                is_active: true
            }
        }
    );
}

function createPlanEntry(data: InternalPlan) {
    Plan.create({
        plan: data.plan,
        postcode: data.postcode,
        cost_fix: data.cost_fix,
        cost_var: data.cost_var
    });
}

function transformEuroToCents(eur: string): number {
    return Math.floor(Number(eur.replace(',', '.')) * 10000);
}
