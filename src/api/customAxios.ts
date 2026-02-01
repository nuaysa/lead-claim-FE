import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { deleteCookie } from "cookies-next";

import type { APIResponse, ErrorResponseData } from "./types/axios";
import { PATHS, STORAGE_KEYS } from "@/utils/constant";

type ConfigOptions = {
  isAuth?: boolean;
  ignoreHeader?: boolean;
  includeXSource?: boolean;
  includeSource?: boolean;
  includeDeviceId?: boolean;
  includePlatform?: boolean;
  includeSmsSource?: boolean;
  customXSource?: string;
  includeCustToken?: boolean;
  isFormData?: boolean;
  includeOTPClient?: boolean;
};

type AxiosConfigParams = {
  baseURL: string;
  config?: ConfigOptions;
};

export const createErrorResponse = (err: AxiosError<ErrorResponseData>) => {
  const message = err?.response?.data?.message || err?.message || "Error Exception API";

  return {
    data: err?.response?.data,
    message,
    status: err?.response?.data?.status || err?.response?.status || 500,
  };
};

async function requestHandler(request: AxiosRequestConfig, config?: ConfigOptions) {
  if (!request.headers) request.headers = {};

  if (config?.ignoreHeader) return request;

  if (!config?.isFormData && request.responseType !== "blob") {
    request.headers["Content-Type"] = "application/json";
  }

  if (config?.isAuth) {
    const token = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.TOKEN) : null;
    if (token) request.headers["Authorization"] = `Bearer ${token}`;
  }

  return request;
}

const responseHandler = (response: AxiosResponse<APIResponse<null>>) => {
  const errorMessage = response.data?.message || "Error Exception API";
  const contentType = response.headers["content-type"];

  if (response.request?.responseType === "blob" || response.request?.responseType === "arraybuffer" || contentType?.includes("application/pdf") || contentType?.includes("image")) {
    return response;
  }

  if ((Object.keys(response.data).includes("status") && !`${response.data.status}`.startsWith("2")) || !`${response.status}`.startsWith("2")) {
    throw {
      error: errorMessage,
      response,
    };
  }

  if (!Object.keys(response.data).includes("status")) {
    return { ...response, data: { ...response.data, status: response.status } };
  }

  return response;
};
const errorHandler = (error: AxiosError<ErrorResponseData>) => {
  const status = error.response?.status ?? 0;

  const message = error.response?.data?.message || error.message || "Terjadi kesalahan. Silakan coba lagi.";

  if (status === 401 || status === 403) {
    if (typeof window !== "undefined") {
      localStorage.clear();
      deleteCookie(STORAGE_KEYS.TOKEN);
      window.location.href = PATHS.login;
    }

    return Promise.reject({ message, status });
  }

  if (status >= 400 && status < 500) {
    return Promise.reject({
      message,
      status,
      data: error.response?.data,
    });
  }

  if (status >= 500) {
    return Promise.reject({
      message: "Server sedang bermasalah. Silakan coba beberapa saat lagi.",
      status,
    });
  }

  return Promise.reject({ message, status });
};

const getCustomAxios = ({ baseURL, config }: AxiosConfigParams) => {
  const customAxios = axios.create({
    baseURL,
  });

  customAxios.interceptors.response.use(responseHandler, errorHandler);

  customAxios.interceptors.request.use((request) => {
    const updatedRequest = requestHandler(request, config);
    return updatedRequest as unknown as InternalAxiosRequestConfig;
  }, errorHandler);

  return customAxios;
};

export default getCustomAxios;
