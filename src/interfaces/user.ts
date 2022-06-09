export interface User {
  fullname: string;
  username: string;
  email: string;
  password: string;
  user_group_id: number;
  group?: UserGroup;
  status: number;
}
export interface UserRequest {
  fullname: string;
  username: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  user_group_id: number;
  group?: UserGroup;
  status: number;
}

export interface UserGroup {
  id: number;
  name: string;
  abilities: string;
}
export interface UserGroupRequest {
  name: string;
  abilities: string;
}
export interface UserData {
  accessToken: string;
  abilities: string;
}
