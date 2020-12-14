import {InternalPlan, PlanFromFileUpload} from '../interfaces/plan.interface';

export function mapPlan(incomingPlan: PlanFromFileUpload): InternalPlan {
    return {
        plan: incomingPlan.Tarifname,
        postcode: incomingPlan.PLZ,
        cost_fix: incomingPlan.Fixkosten,
        cost_var: incomingPlan.VariableKosten,
    };
}
