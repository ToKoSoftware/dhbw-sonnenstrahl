import {IncomingPlan, InternalPlan} from '../interfaces/plan.interface';
import {v4 as uuidv4} from 'uuid';

export function mapPlan(incomingPlan: IncomingPlan): InternalPlan {
    return {
        plan: incomingPlan.Tarifname,
        postcode: incomingPlan.PLZ,
        cost_fix: incomingPlan.Fixkosten,
        cost_var: incomingPlan.VariableKosten,
    };
}
