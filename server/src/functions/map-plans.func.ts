import {IncomingPlan, Plan} from '../interfaces/plan.interface';
import {v4 as uuidv4} from 'uuid';

export function mapPlans(incomingPlan: IncomingPlan): Plan {
    return {
        id: uuidv4(),
        plan: incomingPlan.plan,
        postcode: incomingPlan.postcode,
        cost_fix: incomingPlan.cost_fix,
        cost_var: incomingPlan.cost_var,
        cost_n_var: incomingPlan.cost_n_var,
        usage_max: incomingPlan.usage_max,
        usage_min: incomingPlan.usage_min,
        usage_n_max: incomingPlan.usage_n_max,
        usage_n_min: incomingPlan.usage_n_min,
    };
}
