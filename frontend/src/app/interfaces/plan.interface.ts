export interface PlanData extends PlanDataPreview {
  id?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanDataPreview {
  cost_var: number;
  cost_fix: number;
  postcode: string;
  plan: string;
}
