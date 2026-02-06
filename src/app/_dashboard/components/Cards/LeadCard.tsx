"use client"
import Button from "@/components/Common/Button/Button";
import Card from "@/components/Common/Card";
import { Lead } from "@/types/Lead";
import { InfoIcon, User2 } from "lucide-react";
import { useState } from "react";

export default function LeadCard({ lead, onClaim }: { lead: Lead; onClaim?: () => void }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Card className="w-full hover:border hover:border-primary-red px-2 md:px-5 rounded-3xl">
      <div className="flex flex-col gap-4">
        <div className=" flex  items-center justify-between">
          <span className="flex gap-5 justify-between items-center">
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
          <span className="flex justify-center items-center">
            <Button size="ICON" variant="OUTLINE" icon={<InfoIcon />} className="mr-3" onClick={() => isOpen === false ? setIsOpen(true) : setIsOpen(false)} />
            {onClaim && <Button text="KLAIM" variant="BLACK" className="max-w-30" onClick={onClaim} />}
          </span>
        </div>
        {isOpen && (
          <div className="bg-primary-surface rounded-2xl text-primary-main p-3">
            <p className="font-semibold text-md">Message:</p>
            <p className="px-2">{lead.message}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
