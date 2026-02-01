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

  const claimLead = async (id: number) => {
    try {
      setLoading(true);
      await claim(id);
      showToast("Lead berhasil diklaim", "SUCCESS");

      await Promise.all([fetchAllLeads(), fetchMyLeads()]);
    } catch (error: any) {
      showToast(error.message, "ERROR");
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesClaim = useCallback(
  async (params?: getSalesParams) => {
    try {
      setLoading(true);

      const res = await getSalesClaims(
        params ?? salesParams
      );

      const items = res.data ?? [];

      const totalClaimed = items.reduce(
        (sum: number, s: any) => sum + s.totalClaimed,
        0
      );

      const withPercentage = items.map((s: any) => ({
        ...s,
        percentage:
          totalClaimed === 0
            ? 0
            : Math.round(
                (s.totalClaimed / totalClaimed) * 100
              ),
      }));

      setSalesStats(withPercentage);
    } catch (error: any) {
      showToast(error.message, "ERROR");
    } finally {
      setLoading(false);
    }
  },
  [salesParams, showToast]
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

  return {
    leads,
    myLeads,
    salesStats,
    loading,

    fetchAllLeads,
    fetchMyLeads,
    claimLead,

    applySalesDateRange,
  };
}
