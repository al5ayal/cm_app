export interface TableColumn {
  name: string;
  label: string | ((val: string | unknown | Record<string, unknown>) => string);
  field?: ((val: Record<string, unknown> | unknown) => string) | string;
  sortable?: boolean;
  align: string;
  required?: boolean;
  format?: (val: unknown | Record<string, unknown>) => string;
  sort?: (val1: number, val2: number) => number;
}
