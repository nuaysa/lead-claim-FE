import type { ReactNode } from "react";
import { cn } from "@/utils/helpers";

export interface CardProps {
  children: ReactNode;
  field?: ReactNode;
  onDownload?: () => void;
  className: string;
}

export default function Card({ children, className }: CardProps) {
  return <div className={cn("rounded-3xl border bg-white shadow-sm border-none my-1 p-3", className)}>{children}</div>;
}
