import apiResolver from "@/api/apiResolver";
import { axios } from "@/api/index";
import { getSalesParams } from "../types/types";
import { createURLParams } from "@/utils/helpers";

export function getMyLeads(params?: { page?: number; limit?: number }) {
  const queryParams = createURLParams({
    page: params?.page,
    limit: params?.limit ?? 5,
  });

  return apiResolver(() => axios.get(`leads/myLeads${queryParams}`), {
    throwErrorObject: true,
  });
}

export function getSalesClaims(params: getSalesParams) {
  const { start, end } = params;

  const queryParams = createURLParams({
    start,
    end,
  });

  return apiResolver(() => axios.get(`leads/sales${queryParams}`), {
    throwErrorObject: true,
  });
}

export function getUnclaimedLeads(params?: {
  page?: number;
  limit?: number;
}) {
  const queryParams = createURLParams({
    page: params?.page,
    limit: params?.limit ?? 5,
  });

  return apiResolver(() => axios.get(`leads/${queryParams}`), {
    throwErrorObject: true,
  });
}

export function claim(id: number) {
  return apiResolver(() => axios.patch(`leads/claim/${id}`), {
    throwErrorObject: true,
  });
}
