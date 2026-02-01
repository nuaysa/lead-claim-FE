import apiResolver from "@/api/apiResolver";
import { axios } from "@/api/index";
import { getSalesParams } from "../types/types";
import { createURLParams } from "@/utils/helpers";

export function getMyLeads() {
  return apiResolver(() => axios.get("leads/myLeads"), {
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

export function getUnclaimedLeads() {
  return apiResolver(() => axios.get("leads/"), {
    throwErrorObject: true,
  });
}

export function claim(id: number) {
  return apiResolver(() => axios.patch(`leads/claim/${id}`), {
    throwErrorObject: true,
  });
}
