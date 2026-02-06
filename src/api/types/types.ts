export interface getSalesParams {
  start?: string;
  end?: string;
  page?: number;
  limit?: number;
}

export type LoginParams = {
  data: string;
  password: string;
};

export type inputUserParams = {
  email?: string;
  name?: string;
  role?: string;
  password?: string;
};

export type ResetPassParams = {
  password: string;
  confirmPassword: string;
};

export type LogoutParam = {
  token: string;
};

export type profileParam = {
  id: string;
};

export type debt = {
  id: string;
  remainingAmount: string;
  totalAmount: string;
  createdAt: string;
};

export type settingsParam = {
  name: string;
};
