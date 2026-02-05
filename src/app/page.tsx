"use client";

import { useState } from "react";
import Button from "@/components/Common/Button/Button";
import Card from "@/components/Common/Card";
import { Calendar, CheckCircle, Database, Flame, InfoIcon, RefreshCcw, Trash2, User2 } from "lucide-react";
import { useDashboardViewModel } from "./_dashboard/useDashboardVm";
import CustomDatePicker from "@/components/Common/DatePicker";
import { EmptyState } from "@/components/Common/EmptyState";
import { useAuthContext } from "@/contexts/AuthContext";

export default function Home() {
  const vm = useDashboardViewModel();

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
        <SummaryCard icon={<Database />} title="Total Lead Masuk" value={(vm.leads.length + vm.myLeads.length).toString()} color="primary" />
        <SummaryCard icon={<Flame />} title="Siap Diklaim" value={vm.leads.length.toString()} color="yellow" />
        <SummaryCard icon={<CheckCircle />} title="Berhasil Klaim" value={vm.myLeads.length.toString()} color="green" />
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex flex-col w-full lg:w-2/3 gap-3">
          <div className="flex justify-between items-center border-b border-neutral-gray3">
            <div className="flex gap-2">
              <TabButton active={activeTab === "UNCLAIMED"} onClick={() => setActiveTab("UNCLAIMED")} label="Antrean Customer Baru" />
              <TabButton active={activeTab === "CLAIMED"} onClick={() => setActiveTab("CLAIMED")} label="Sudah Diklaim" />
              {isAdmin ? <TabButton active={activeTab === "USERS"} onClick={() => setActiveTab("USERS")} label="Dafter Users" /> : null}
            </div>

            <Button
              icon={<RefreshCcw />}
              variant="OUTLINE"
              isLoading={vm.loading}
              onClick={() => {
                if (activeTab === "UNCLAIMED") {
                  vm.fetchAllLeads(vm.leadsPage);
                } else {
                  vm.fetchMyLeads(vm.myLeadsPage);
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

              <div className="flex justify-center items-center gap-3 mt-4">
                <Button text="Prev" variant="OUTLINE" disabled={vm.leadsPage === 1} onClick={() => vm.fetchAllLeads(vm.leadsPage - 1)} />

                <span className="text-sm font-bold text-primary-hover">
                  Page {vm.leads.length === 0 ? 0 : vm.leadsPage} / {vm.leadsTotalPages}
                </span>

                <Button text="Next" variant="OUTLINE" disabled={vm.leadsPage >= vm.leadsTotalPages} onClick={() => vm.fetchAllLeads(vm.leadsPage + 1)} />
              </div>
            </>
          )}

          {activeTab === "CLAIMED" && (
            <>
              {vm.myLeads.length === 0 ? <EmptyState title="Belum ada customer" description="Kamu belum mengklaim customer." /> : vm.myLeads.map((lead) => <LeadCard key={lead.id} lead={lead} />)}
              <div className="flex justify-center items-center gap-3 mt-4">
                <Button text="Prev" variant="OUTLINE" disabled={vm.myLeadsPage === 1} onClick={() => vm.fetchMyLeads(vm.myLeadsPage - 1)} />

                <span className="text-sm font-bold text-primary-hover">
                  Page {vm.leads.length === 0 ? 0 : vm.myLeadsPage} / {vm.myLeadsTotalPages}
                </span>

                <Button text="Next" variant="OUTLINE" disabled={vm.myLeadsPage >= vm.myLeadsTotalPages} onClick={() => vm.fetchMyLeads(vm.myLeadsPage + 1)} />
              </div>
            </>
          )}

          {userRole === "ADMIN" && activeTab === "USERS" && (
            <>
              {vm.salesStats.length === 0 ? (
                <EmptyState title="Belum ada user" description="User belum tersedia, silahkan tambah user melalui menu pada profile." />
              ) : (
                vm.salesStats.map((user) => <UserCard key={user.id} user={user} onDelete={() => vm.deleteUserfunc(user.id.toString())} />)
              )}
              <div className="flex justify-center items-center gap-3 mt-4"></div>
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

                  vm.applySalesDateRange(value.start.toString().slice(0, 10), value.end.toString().slice(0, 10));
                }
              }}
            />

            {vm.salesStats.length === 0 ? (
              <EmptyState title="Belum ada data" description="Tidak ada klaim pada rentang tanggal ini." />
            ) : (
              vm.salesStats.map((sales) => (
                <div key={sales.id} className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-primary-main">{sales.name}</span>
                    <span className="text-semantic-red1">{sales.percentage ?? 0}%</span>
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
    </div>
  );
}

function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-bold text-sm border-b-2 transition
        ${active ? "border-primary-main text-primary-main" : "border-transparent text-neutral-gray1"}`}
    >
      {label}
    </button>
  );
}

function LeadCard({ lead, onClaim }: { lead: any; onClaim?: () => void }) {
  return (
    <Card className="w-full hover:border hover:border-primary-red px-5 flex items-center justify-between rounded-3xl">
      <span className="flex gap-5">
        <div className="bg-neutral-gray4 h-15 w-15 rounded-2xl flex justify-center items-center text-xl text-neutral-gray1">
          <User2 />
        </div>

        <div className="flex flex-col gap-1 font-bold">
          <h1 className="text-lg text-neutral-black">{lead.name ?? "Unknown Lead"}</h1>
          <span className="flex gap-4 text-xs">
            <p className="text-neutral-gray1">{lead.phone}</p>
            <p className="text-semantic-red3">{new Date(lead.requestDate).toLocaleTimeString("id-ID")}</p>
          </span>
        </div>
      </span>

      {onClaim && <Button text="KLAIM" variant="BLACK" className="w-30" onClick={onClaim} />}
    </Card>
  );
}

function UserCard({ user, onDelete }: { user: any; onDelete?: () => void }) {
  return (
    <Card className="w-full hover:border hover:border-primary-red px-5 flex items-center justify-between rounded-3xl">
      <span className="flex gap-5">
        <div className="bg-neutral-gray4 h-15 w-15 rounded-2xl flex justify-center items-center text-xl text-neutral-gray1">
          <User2 />
        </div>

        <div className="flex flex-col gap-1 font-bold">
          <h1 className="text-lg text-neutral-black">{user.name ?? "Unknown user"}</h1>
          <span className="flex gap-4 text-xs">
            <p className="text-neutral-gray1">{user.email}</p>
          </span>
        </div>
      </span>

      {onDelete && <Button icon={<Trash2/>} variant="DANGER" className="w-30" onClick={onDelete} />}
    </Card>
  );
}

function SummaryCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: "primary" | "yellow" | "green" }) {
  const bg = color === "primary" ? "bg-primary-surface text-primary-main" : color === "yellow" ? "bg-semantic-yellow3 text-semantic-yellow1" : "bg-semantic-green3 text-semantic-green1";

  return (
    <Card className="w-full lg:w-1/3 py-6 px-5">
      <div className="flex gap-3">
        <div className={`${bg} h-15 w-15 rounded-2xl flex justify-center items-center text-xl`}>{icon}</div>
        <div className="flex flex-col gap-1 font-bold">
          <h1 className="text-sm text-neutral-gray1 uppercase">{title}</h1>
          <p className="text-2xl font-extrabold text-neutral-black">{value}</p>
        </div>
      </div>
    </Card>
  );
}
