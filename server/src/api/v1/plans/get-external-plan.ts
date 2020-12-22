import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {ExternalPlanData} from '../../../interfaces/plan.interface';
import {Plan} from '../../../models/plan.model';

export async function getPlansInExternalFormat(req: Request, res: Response): Promise<Response> {
    const incomingZipCode = req.query.zipCode as string;
    const zipCodeAsNumber = parseInt(incomingZipCode);
    const incomingConsumption = parseInt(req.query.consumption as string);
    if( zipCodeAsNumber > 99999 || isNaN(zipCodeAsNumber) || incomingConsumption * zipCodeAsNumber <= 0 || isNaN(incomingConsumption)){
        return res.status(400).send(wrapResponse(false, {error: 'Not all required fields set or wrong data.'}));
    }
    const plans = await Plan.findAll({
        attributes: [
            'id', 
            'plan', 
            'postcode', 
            'cost_var', 
            'cost_fix'
        ],
        where: {
            postcode: incomingZipCode
        },
        raw: true
    });
    const outputData: ExternalPlanData[] = [];
    plans.forEach(element => {
        const calculatedCosts = Math.round((element.cost_var / 10000 * incomingConsumption + element.cost_fix / 10000 + Number.EPSILON) * 100) / 100;
        outputData.push({
            id: element.id,
            title: element.plan,
            zipCode: element.postcode,
            pricePerUnit: element.cost_var,
            basicPrice: element.cost_fix,
            consumption: incomingConsumption,
            calculatedPricePerYear: calculatedCosts
        });
    });
    outputData.sort(function(a, b){
        return a.calculatedPricePerYear - b.calculatedPricePerYear;
    });
    return res.send(wrapResponse(true, outputData));
}