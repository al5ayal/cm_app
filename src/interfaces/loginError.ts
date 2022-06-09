export interface LoginError {
  message?: string;
  errors: {
    email?: Array<string> | undefined;
    password?: Array<string> | undefined;
  };
}
