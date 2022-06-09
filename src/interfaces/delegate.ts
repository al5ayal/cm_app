export interface Delegate {
  id: number;
  name: string;
  phone: string;
  email: string;
  commission_type: string;
  commission_amount: number;
  address?: string;
  created_at?: Date;
  updated_at?: Date;
  orders?: Array<Record<string, unknown>>;
}
