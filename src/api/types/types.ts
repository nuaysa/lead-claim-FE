export interface getSalesParams {
start?: string;
  end?: string;
}

export type LoginParams = {
  data: string;
  password: string;
};

export type RegisterParams = {
  email: string;
  name: string;
  role: string;
  password: string;
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
