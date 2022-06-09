import { Order } from './orders';

export interface StudentsTableColumn {
  name: string;
  phone: string;
  email: string;
  age?: string;
  address?: string;
}

export interface StudentRequest {
  name: string;
  phone: string;
  nid?: number;
  email: string;
  age?: number;
  address?: string;
  active: boolean;
}

export interface Student {
  id?: number;
  name: string;
  phone: string;
  email: string;
  age?: string;
  address?: string;
  created_at?: Date;
  orders?: Array<Order>;
  //all possible needed data
}
