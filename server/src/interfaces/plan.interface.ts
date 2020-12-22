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

export interface ExternalPlanData {
    id: string,
    title: string,
    zipCode: string,
    pricePerUnit: number,
    basicPrice: number,
    consumption: number,
    calculatedPricePerYear: number
}
