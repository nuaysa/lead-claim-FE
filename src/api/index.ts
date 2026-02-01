import getCustomAxios from "./customAxios";

export const axios = getCustomAxios({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}`,
  config: { isAuth: true },
});

export const axiosNoAuth = getCustomAxios({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}`,
});

export const axiosFormData = getCustomAxios({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}`,
  config: { isFormData: true, isAuth: true },
});
