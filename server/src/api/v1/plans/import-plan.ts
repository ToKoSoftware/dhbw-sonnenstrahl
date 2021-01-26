import {FileUploadPlan, InternalPlan} from '../../../interfaces/plan.interface';
import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import isBlank from 'is-blank';
import {mapPlan} from '../../../functions/map-plan.func';
import {UploadedFile} from 'express-fileupload';
import {Plan} from '../../../models/plan.model';
import csv from 'csvtojson';

/**
 * Import plans from csv data
 * 
 * @param {Request} req
 * @param {Reponse} res
 * @returns {Promise<Response>}
 */
export async function importPlan(req: Request, res: Response): Promise<Response> {
    try {
        if (isBlank(req.files) || req.files === undefined || req.files.file == null) {
            throw 'No file uploaded';
        }
        // flatten
        const file: UploadedFile = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;
        const splittedFileName = file.name.split('.');
        const fileExtension = splittedFileName[splittedFileName.length - 1];
        if (fileExtension !== 'csv') {
            throw 'Wrong File Extension, expected csv - got ' + fileExtension;
        }
        const incomingData = await loadCSV(file);
        const targetData: InternalPlan[] = incomingData.map(mapPlan);
        // set all current plans to is_active = false.
        deactivatePlans();
        // create new plan data in database
        targetData.forEach(createPlanEntry);
        return res.status(201).send(wrapResponse(true, targetData));
    } catch (e) {
        return res.status(400).send(wrapResponse(false, {error: e}));
    }
}

/**
 * Parse csv data from file
 * 
 * @param {UploadedFile} file 
 * @returns {Promise<FileUploadPlan[]>}
 */
async function loadCSV(file: UploadedFile): Promise<FileUploadPlan[]> {
    return csv(
        {
            delimiter: ';',
            colParser: {
                Fixkosten: transformFloatStringToInteger,
                VariableKosten: transformFloatStringToInteger
            }
        }
    ).fromFile(file.tempFilePath);
}

/**
 * Set all active plans to inactive
 */
function deactivatePlans() {
    Plan.update(
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

/**
 * Create single plan from data
 * 
 * @param {InternalPlan} data
 */
function createPlanEntry(data: InternalPlan) {
    Plan.create({
        plan: data.plan,
        postcode: data.postcode,
        cost_fix: data.cost_fix,
        cost_var: data.cost_var
    });
}

/**
 * Converts float string to integers
 * 
 * @param {string} floatString
 * @returns {number}
 */
function transformFloatStringToInteger(floatString: string): number {
    return Math.floor(Number(floatString.replace(',', '.')) * 10000);
}
