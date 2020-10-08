export interface Plan {
    id: string;
    postcode: string;
    plan: string;
    usage_min: number;
    usage_max: number;
    usage_n_min: number;
    usage_n_max: number;
    cost_var: number;
    cost_n_var: number;
    cost_fix: number;
}

export interface IncomingPlan {
    postcode: string;
    plan: string;
    usage_min: number;
    usage_max: number;
    usage_n_min: number;
    usage_n_max: number;
    cost_var: number;
    cost_n_var: number;
    cost_fix: number;
}
