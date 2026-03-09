"use client";

import { useState } from "react";
import Button from "@/components/Common/Button/Button";
import Card from "@/components/Common/Card";
import { Calendar, CheckCircle, Database, Flame, InfoIcon, PlusCircle, RefreshCcw } from "lucide-react";
import { useDashboardViewModel } from "./_dashboard/viewmodels/useDashboardVm";
import CustomDatePicker from "@/components/Common/DatePicker";
import { EmptyState } from "@/components/Common/EmptyState";
import { useAuthContext } from "@/contexts/AuthContext";
import ConfirmationModal from "@/components/Common/Modal";
import { LeadCard, SummaryCard, UserCard } from "./_dashboard/components/Cards";
import TabButton from "./_dashboard/components/TabButton";
import Pagination from "./_dashboard/components/Pagination";
import { useUserVM } from "./_dashboard/viewmodels/useUserVm";
import UsersCreateModal from "./_dashboard/components/Users/UsersModal";

export default function Home() {
  const vm = useDashboardViewModel();
  const userVm = useUserVM();

  const { userProfile } = useAuthContext();
  const userRole = userProfile?.role;
  const isAdmin = userRole === "ADMIN";
  const [activeTab, setActiveTab] = useState<"UNCLAIMED" | "CLAIMED" | "USERS">("UNCLAIMED");
  const [dateRange, setDateRange] = useState<{
    start?: string;
    end?: string;
  }>({});

  return (
    <div className="flex flex-col gap-8 py-4 px-4 sm:px-6 lg:px-10 bg-neutral-gray4">
      <div className="flex flex-col lg:flex-row w-full gap-2 lg:gap-6">
        <SummaryCard icon={<Database />} title="Total Lead Masuk" value={vm.stats.totalLeads.toString()} color="primary" />
        <SummaryCard icon={<Flame />} title="Siap Diklaim" value={vm.stats.totalUnclaimed.toString()} color="yellow" />
        <SummaryCard icon={<CheckCircle />} title="Klaim Anda/Total" value={`${vm.myLeads.length}/${vm.stats.totalClaimed}`} color="green" />
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex flex-col w-full lg:w-2/3 gap-3">
          <div className="flex justify-between items-center border-b border-neutral-gray3">
            <div className="flex gap-2">
              <TabButton active={activeTab === "UNCLAIMED"} onClick={() => setActiveTab("UNCLAIMED")} label="Antrean Customer Baru" />
              <TabButton active={activeTab === "CLAIMED"} onClick={() => setActiveTab("CLAIMED")} label="Sudah Diklaim" />
              {isAdmin ? <TabButton active={activeTab === "USERS"} onClick={() => setActiveTab("USERS")} label="Daftar Users" /> : null}
            </div>

            <Button
              icon={<RefreshCcw width={20} />}
              variant="OUTLINE"
              isLoading={vm.loading}
              className="my-1"
              onClick={() => {
                if (activeTab === "UNCLAIMED") {
                  vm.fetchAllLeads(vm.leadsPage);
                } else {
                  vm.fetchMyLeads(vm.leadsPage);
                }
              }}
            />
          </div>

          {activeTab === "UNCLAIMED" && (
            <>
              {vm.leads.length === 0 ? (
                <EmptyState title="Belum ada antrean" description="Semua customer sudah diklaim." />
              ) : (
                vm.leads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onClaim={() => {
                      vm.claimLead(lead.id, lead.phone);
                      setActiveTab("CLAIMED");
                    }}
                  />
                ))
              )}
              <Pagination currentPage={vm.leadsPage} totalPage={vm.leadsTotalPages} data={vm.leads} NextPage={(page) => vm.fetchAllLeads(page)} />
            </>
          )}

          {activeTab === "CLAIMED" && (
            <>
              {vm.myLeads.length === 0 ? <EmptyState title="Belum ada customer" description="Kamu belum mengklaim customer." /> : vm.myLeads.map((lead) => <LeadCard key={lead.id} lead={lead} />)}

              <Pagination currentPage={vm.myLeadsPage} totalPage={vm.myLeadsTotalPages} data={vm.myLeads} NextPage={(page) => vm.fetchMyLeads(page)} />
            </>
          )}

          {userRole === "ADMIN" && activeTab === "USERS" && (
            <>
              {userVm.salesStats.length === 0 ? (
                <EmptyState title="Belum ada user" description="User belum tersedia, silahkan tambah user melalui Button di bawah ini" />
              ) : (
                userVm.salesStats.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onDelete={() => {
                      userVm.setIsCreateModalOpen(false);
                      userVm.setSelectedItem(user);
                      userVm.setIsModalOpen(true);
                    }}
                    onEdit={() => {
                      userVm.handleOpenEditModal(user);
                    }}
                  />
                ))
              )}
              <Button
                className="w-full"
                icon={<PlusCircle />}
                text="Tambah User"
                onClick={() => {
                  userVm.handleOpenCreateModal();
                }}
              />
              <Pagination currentPage={userVm.salesPage} totalPage={userVm.salesTotalPages} data={userVm.salesStats} NextPage={(page) => userVm.fetchSalesClaim({ page: page })} />
            </>
          )}
        </div>

        <div className="flex flex-col w-full lg:w-1/3 gap-4 mt-4">
          <h1 className="font-bold text-xl text-black">Performa Sales</h1>

          <Card className="flex flex-col gap-4 p-7">
            <CustomDatePicker
              isFutureDisabled={false}
              isFilter
              placeholder="Choose Date Range"
              icon={<Calendar className="text-primary-main " />}
              mode="range"
              className="text-primary-main border-primary-hover rounded-xl bg-primary-surface "
              onChange={(value) => {
                if (value?.start && value?.end) {
                  setDateRange({
                    start: value.start,
                    end: value.end,
                  });

                  userVm.applySalesDateRange(value.start.toString().slice(0, 10), value.end.toString().slice(0, 10));
                }
              }}
            />

            {userVm.salesStats.length === 0 ? (
              <EmptyState title="Belum ada data" description="Tidak ada klaim pada rentang tanggal ini." />
            ) : (
              userVm.salesStats.map((sales) => (
                <div key={sales.id} className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-primary-main">{sales.name}</span>
                    <span className="text-semantic-red1">{sales.totalClaimed} tiket/{sales.percentage ?? 0}%</span>
                  </div>

                  <div className="w-full h-2 bg-neutral-gray3 rounded-full">
                    <div
                      className="h-2 bg-primary-main rounded-full transition-all"
                      style={{
                        width: `${sales.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </Card>

          <Card className="flex flex-col gap-2 bg-linear-to-l from-primary-main to-primary-hover p-8 rounded-4xl">
            <InfoIcon size={40} className="text-neutral-gray4/60" />
            <h2 className="text-white text-xl font-bold">Aturan Klaim</h2>
            <p className="text-neutral-gray4/60 text-sm">Data customer hanya bisa diklaim satu kali. Siapa cepat dia dapat!</p>
          </Card>
        </div>
      </div>

      <UsersCreateModal isOpen={userVm.isCreateModalOpen} onClose={() => userVm.setIsCreateModalOpen(false)} vm={userVm} />

      <ConfirmationModal
        isOpen={userVm.isModalOpen}
        onClose={() => userVm.setIsModalOpen(false)}
        variant="danger"
        title="Hapus User?"
        description={<>Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.</>}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={() => {
          userVm.handleDelete(userVm.selectedItem!.id.toString());
        }}
      />
    </div>
  );
}
