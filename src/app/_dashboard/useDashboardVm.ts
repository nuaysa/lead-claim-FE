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

  const PAGE_SIZE = 10;

  const [leadsPage, setLeadsPage] = useState(1);
  const [myLeadsPage, setMyLeadsPage] = useState(1);

  const [leadsTotalPages, setLeadsTotalPages] = useState(1);
  const [myLeadsTotalPages, setMyLeadsTotalPages] = useState(1);

  const [salesParams, setSalesParams] = useState<getSalesParams>({});
  const fetchAllLeads = async (page = 1) => {
    try {
      setLoading(true);

      const res = await getUnclaimedLeads({
        cursor: page.toString(),
        limit: PAGE_SIZE,
      });

      setLeads(res.data ?? []);
      setLeadsPage(page);
      setLeadsTotalPages(res.totalPages ?? 1);
    } catch (error: any) {
      showToast(error.message, "ERROR");
    } finally {
      setLoading(false);
    }
  };
  const fetchMyLeads = async (page = 1) => {
    try {
      setLoading(true);

      const res = await getMyLeads({
        cursor: page.toString(),
        limit: PAGE_SIZE,
      });

      setMyLeads(res.data ?? []);
      setMyLeadsPage(page);
      setMyLeadsTotalPages(res.totalPages ?? 1);
    } catch (error: any) {
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
     
      if (!senderPhone) return;

      const waUrl = `https://wa.me/${senderPhone.replace(/^0/, "62")}`;

      window.open(waUrl, "_blank");
    } catch (error: any) {
      showToast(error.message, "ERROR");
    } finally {
      setLoading(false);
    }

    await Promise.allSettled([fetchAllLeads(), fetchMyLeads()]);
  };

  const fetchSalesClaim = useCallback(
    async (params?: getSalesParams) => {
      try {
        setLoading(true);

        const res = await getSalesClaims(params ?? salesParams);

        const items = res.data ?? [];

        setSalesStats(items);
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
    fetchAllLeads(1);
    fetchMyLeads(1);
  }, []);

  useEffect(() => {
    fetchSalesClaim();
  }, [salesParams]);

  const refetch = async () => {
    await Promise.allSettled([fetchAllLeads(), fetchMyLeads(), fetchSalesClaim()]);
  };

  return {
    leads,
    myLeads,
    salesStats,
    loading,

    fetchAllLeads,
    fetchMyLeads,
    claimLead,

    applySalesDateRange,
    refetch,
    leadsPage,
    myLeadsPage,
    leadsTotalPages,
    myLeadsTotalPages,
  };
}
