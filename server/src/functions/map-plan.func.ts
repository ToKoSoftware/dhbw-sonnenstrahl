import {InternalPlan, FileUploadPlan} from '../interfaces/plan.interface';

export function mapPlan(incomingPlan: FileUploadPlan): InternalPlan {
    return {
        plan: incomingPlan.Tarifname,
        postcode: incomingPlan.PLZ,
        cost_fix: incomingPlan.Fixkosten,
        cost_var: incomingPlan.VariableKosten,
    };
}
