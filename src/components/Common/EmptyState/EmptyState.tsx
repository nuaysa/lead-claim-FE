import { Inbox } from "lucide-react";

export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-gray1">
      <Inbox size={48} className="mb-4 opacity-40" />
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm mt-1 max-w-xs">{description}</p>
    </div>
  );
}
