"use client";
import Button from "@/components/Common/Button/Button";
import Card from "@/components/Common/Card";
import { Sales } from "@/types/Lead";
import { Edit, Trash2, User2 } from "lucide-react";

export default function UserCard({ user, onDelete, onEdit }: { user: Sales; onDelete?: () => void; onEdit?: () => void }) {
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

      <span className="flex justify-center gap-3 items-center">
        {onDelete && <Button icon={<Trash2 size={20} />} variant="DANGER" className="w-10 h-10" onClick={onDelete} />}
        {onEdit && <Button icon={<Edit size={20} />} variant="BLACK" className="w-10 h-10" onClick={onEdit} />}
      </span>
    </Card>
  );
}
