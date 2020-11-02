export interface Response<T> {
  body: T;
  status: number;
}

export interface TenantUserRequest {
  limit: number;
  searchText: string;
}

export interface TenantUser {
  id: number;
  name: string;
}

export interface ErrorResponse {
  status?: number;
  message?: string;
  errors: Error[] | undefined;
}

export interface Error {
  code?: number;
  message: string;
  errorCode?: string;
  location?: string;
}
