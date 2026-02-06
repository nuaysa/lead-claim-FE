"use client";

import { useEffect, useState } from "react";
import { claim, getUnclaimedLeads, getMyLeads } from "@/api/leads";
import { useToast } from "@/contexts/ToastContext";
import { Lead } from "@/types/Lead";

export function useDashboardViewModel() {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [myLeads, setMyLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const PAGE_SIZE = 5;

  const [leadsPage, setLeadsPage] = useState<number>(1);
  const [myLeadsPage, setMyLeadsPage] = useState<number>(1);

  const [leadsTotalPages, setLeadsTotalPages] = useState<number>(1);
  const [myLeadsTotalPages, setMyLeadsTotalPages] = useState<number>(1);

  const fetchAllLeads = async (page = 1) => {
    try {
      setLoading(true);

      const res = await getUnclaimedLeads({
        page,
        limit: PAGE_SIZE,
      });
      setLeads(res.data ?? []);
      setLeadsPage(res.pagination.page);
      setLeadsTotalPages(res.pagination.totalPages);
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
        page,
        limit: PAGE_SIZE,
      });

      setMyLeads(res.data ?? []);
      setMyLeadsPage(res.pagination.page);
      setMyLeadsTotalPages(res.pagination.totalPages);
    } catch (error: any) {
      showToast(error.message, "ERROR");
    } finally {
      setLoading(false);
    }
  };

  const claimLead = async (id: number, senderPhone?: string) => {
    if (!senderPhone) return;

    setLoading(true);

    try {
      const res = await claim(id);

      if (res?.status === 201) {
        showToast(res.message ?? "Lead berhasil diklaim", "SUCCESS");

        const waUrl = `https://wa.me/${senderPhone.replace(/^0/, "62")}`;
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error: any) {
      showToast(error?.message ?? "Lead sudah diklaim oleh sales lain", "ERROR");
      return;
    } finally {
      await Promise.allSettled([fetchAllLeads(leadsPage), fetchMyLeads(myLeadsPage)]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLeads(leadsPage);
    fetchMyLeads(myLeadsPage);
  }, []);

  const refetch = async () => {
    await Promise.allSettled([fetchAllLeads(leadsPage), fetchMyLeads(myLeadsPage)]);
  };

  return {
    leads,
    myLeads,
    loading,

    fetchAllLeads,
    fetchMyLeads,
    claimLead,
    refetch,
    leadsPage,
    myLeadsPage,
    leadsTotalPages,
    myLeadsTotalPages,
  };
}
