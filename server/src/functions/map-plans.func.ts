import {IncomingPlan, InternalPlan} from '../interfaces/plan.interface';
import {v4 as uuidv4} from 'uuid';

export function mapPlans(incomingPlan: IncomingPlan): InternalPlan {
    return {
        plan: incomingPlan.Tarifname,
        postcode: incomingPlan.PLZ,
        cost_fix: Math.floor(incomingPlan.Fixkosten * 10000),
        cost_var: Math.floor(incomingPlan.VariableKosten * 10000),
    };
}
