export interface Receipt {
  id: number;
  account_id: number;
  entry_type: string;
  amount: number;
  order_id: number;
  changer: number;
  note: string;
  created_at: Date | string;
  updated_at: Date | string;
  changed: Array<Record<string, unknown | Record<string, unknown>>>;
}
