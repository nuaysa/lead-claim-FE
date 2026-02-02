"use client";

import { useCallback, useEffect, useState } from "react";
import { claim, getUnclaimedLeads, getMyLeads, getSalesClaims } from "@/api/leads";
import { useToast } from "@/contexts/ToastContext";
import { Lead, Sales } from "@/types/Lead";
import { getSalesParams } from "@/api/types/types";

export function useDashboardViewModel() {
  const { showToast } = useToast();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [myLeads, setMyLeads] = useState<Lead[]>([]);
  const [salesStats, setSalesStats] = useState<Sales[]>([]);
  const [loading, setLoading] = useState(false);

  const [salesParams, setSalesParams] = useState<getSalesParams>({});

  const fetchAllLeads = async () => {
    try {
      setLoading(true);
      const res = await getUnclaimedLeads();
      setLeads(res.data ?? []);
    } catch (error: any) {
      setLeads([]);
      showToast(error.message, "ERROR");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyLeads = async () => {
    try {
      setLoading(true);
      const res = await getMyLeads();
      setMyLeads(res.data ?? []);
    } catch (error: any) {
      setMyLeads([]);
      showToast(error.message, "ERROR");
    } finally {
      setLoading(false);
    }
  };

 const claimLead = async (id: number, senderPhone?: string) => {
  setLoading(true);

  try {
    await claim(id);
    showToast("Lead berhasil diklaim", "SUCCESS");

    if (senderPhone) {
      window.open(
        `https://wa.me/${senderPhone.replace(/^0/, "62")}`,
        "_blank"
      );
    }
  } catch (error: any) {
    showToast(error.message, "ERROR");
    return;
  } finally {
    setLoading(false);
  }

  await Promise.allSettled([
    fetchAllLeads(),
    fetchMyLeads(),
  ]);
};

  const fetchSalesClaim = useCallback(
    async (params?: getSalesParams) => {
      try {
        setLoading(true);

        const res = await getSalesClaims(params ?? salesParams);

        const items = res.data ?? [];
        const withPercentage = items.map((s: any) => ({
          ...s,
          percentage: s.totalLead === 0 ? 0 : Math.round((s.totalClaimed / s.totalLead) * 100),
        }));

        setSalesStats(withPercentage);
      } catch (error: any) {
        showToast(error.message, "ERROR");
      } finally {
        setLoading(false);
      }
    },
    [salesParams, showToast],
  );

  const applySalesDateRange = (start?: string, end?: string) => {
    const params: getSalesParams = {};

    if (start) params.start = start;
    if (end) params.end = end;

    setSalesParams(params);
  };
  useEffect(() => {
    fetchAllLeads();
    fetchMyLeads();
  }, []);

  useEffect(() => {
    fetchSalesClaim();
  }, [salesParams]);

  const refetch = async () => {
  await Promise.allSettled([
    fetchAllLeads(),
    fetchMyLeads(),
    fetchSalesClaim(),
  ]);
};

  return {
    leads,
    myLeads,
    salesStats,
    loading,
    refetch,

    fetchAllLeads,
    fetchMyLeads,
    claimLead,

    applySalesDateRange,
  };
}
