export interface InternalPlan {
    id?: string;
    postcode: string;
    plan: string;
    cost_var: number;
    cost_fix: number;
}

export interface FileUploadPlan {
    PLZ: string;
    Tarifname: string;
    VariableKosten: number;
    Fixkosten: number;
}
