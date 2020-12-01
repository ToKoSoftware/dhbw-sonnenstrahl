import { IncomingPlan, InternalPlan } from '../interfaces/plan.interface';

export function mapPlan(incomingPlan: IncomingPlan): InternalPlan {
    return {
        plan: incomingPlan.Tarifname,
        postcode: incomingPlan.PLZ,
        cost_fix: incomingPlan.Fixkosten,
        cost_var: incomingPlan.VariableKosten,
    };
}
