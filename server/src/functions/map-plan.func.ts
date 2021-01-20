import {FileUploadPlan, InternalPlan} from '../interfaces/plan.interface';

/**
 * Map incoming plan data into internal format
 * @param incomingPlan
 */
export function mapPlan(incomingPlan: FileUploadPlan): InternalPlan {
    return {
        plan: incomingPlan.Tarifname,
        postcode: incomingPlan.PLZ,
        cost_fix: incomingPlan.Fixkosten,
        cost_var: incomingPlan.VariableKosten,
    };
}
