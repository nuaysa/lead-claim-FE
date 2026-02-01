export interface ErrorResponseData {
  error?: string;
  message?: string;
  status?: number;
  errorCode?: string;
  data?: Object | Object[];
}

export interface ErrorResponse {
  error: string;
  message: string;
  status: number;
}

export interface APIResponse<T> {
  data: T;
  status: number;
  message?: string | null;
}
