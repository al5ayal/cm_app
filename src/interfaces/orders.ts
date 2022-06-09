import { Student } from './students';

export interface OrderRequest {
  student_id: number;
  type: string;
  rel: string;
  delegate_id?: number | null;
  tax: number;
  total_amount: number;
  due_date?: string;
  details?: Array<Record<string, unknown>>;
}

export interface Order {
  id: number;
  student_id: number;
  type: string;
  rel: string;
  delegate_id?: number | null;
  paid_amount?: number;
  total_amount: number;
  tax?: number | string;
  delegate_commission?: number;
  paid_commission?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  due_date: Date | string;
  inv_date: '2022-05-16';
  details?: Array<OrderDetails>;
  student?: Student;
  qrCode?: string | null;
}

export interface OrderPayRequest {
  account_id: number;
  amount: number;
  order_id: number | undefined;
  note: string;
  paymentType: number | undefined;
}

export interface OrderDetails {
  id: number;
  order_id: number;
  cohort_id: string;
  price: number;
  discount?: number;
  created_at?: Date;
  updated_at?: Date;
  cohort?: Cohort;
}

export interface Cohort {
  id: number;
  name: string;
  description: string;
  price: number;
  course_id: number;
  start_date: Date;
  end_date: Date;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
  course?: Course;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}
