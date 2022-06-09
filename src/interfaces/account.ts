export interface Account {
  id: number | string;
  name: string;
  type: string;
  type_id?: string | null;
  parent: string | number | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}
