import apiResolver from "@/api/apiResolver";
import { axios, axiosNoAuth } from "@/api/index";
import type { LoginParams, inputUserParams, ResetPassParams } from "../types/types";

export function login(param: LoginParams) {
  return apiResolver(() => axiosNoAuth.post("auth/login", param), {
    throwErrorObject: true,
  });
}

export function register(param: inputUserParams) {
  return apiResolver(() => axios.post("auth/register", param), {
    throwErrorObject: true,
  });
}

export function resetPassword(param: ResetPassParams) {
  return apiResolver(() => axios.patch("auth/reset-password", param), {
    throwErrorObject: true,
  });
}

export function deleteUser(id: string) {
  return apiResolver(() => axios.delete(`auth/delete/${id}`), {
    throwErrorObject: true,
  });
}

export function logoutAPI() {
  return apiResolver(() => axios.post("auth/logout"), {
    throwErrorObject: true,
  });
}

export function getProfile() {
  return apiResolver(() => axios.get(`auth/profile`), {
    throwErrorObject: true,
  });
}

export function editUser({ id, data }: { id: string; data: inputUserParams }) {
  return apiResolver(() => axios.patch(`Auth/edit/${id}`, data), {
    throwErrorObject: true,
  });
}
