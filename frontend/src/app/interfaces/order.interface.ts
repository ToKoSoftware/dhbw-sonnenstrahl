export interface OrderData {
  id: string;
  referrer: string;
  customerId: string;
  planId: string;
  consumption: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  terminatedAt: string | null;
}
