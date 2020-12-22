import {Plan} from '../../../models/plan.model';
import {Request, Response} from 'express';
import {FindOptions} from 'sequelize';
import {wrapResponse} from '../../../functions/response-wrapper';
import {buildQuery, customFilterValueResolver, QueryBuilderConfig} from '../../../functions/query-builder.func';
import {ExternalPlanData} from '../../../interfaces/plan.interface';

export async function getPlans(req: Request, res: Response): Promise<Response> {
    let query: FindOptions = {
        raw: true,
    };
    // todo move this to the model
    const allowedSearchFields = ['plan', 'postcode'];
    const allowedOrderFields = ['postcode', 'plan', 'cost_var', 'cost_fix'];
    const allowedFilterFields = ['id', 'postcode', 'plan', 'is_active'];

    const customResolver = new Map<string, customFilterValueResolver>();
    customResolver.set('is_active', (field: string, requ: Request, value: string) => {
        if (req.query.is_active == null) {
            return true;
        } else {
            // todo check if user is admin -> if not, return true
            return req.query.is_active === 'all' ? '' : (req.query.is_active === 'true');
        }
    });
    const queryConfig: QueryBuilderConfig = {
        query: query,
        searchString: req.query.search as string || '',
        customFilterResolver: customResolver,
        allowLimitAndOffset: true,
        allowedFilterFields: allowedFilterFields,
        allowedSearchFields: allowedSearchFields,
        allowedOrderFields: allowedOrderFields
    };
    query = buildQuery(queryConfig, req);
    const data: Plan[] = await Plan.findAll(query);
    return res.send(wrapResponse(true, data));
}

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

export async function getPlan(req: Request, res: Response): Promise<Response> {
    let success = true;
    const data = await Plan.findOne(
        {
            where: {
                id: req.params.id
            },
            raw: true
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    if (data === null) {
        return res.status(404).send(wrapResponse(false, {error: 'No plan with given id found'}));
    }

    return res.send(wrapResponse(true, data));
}