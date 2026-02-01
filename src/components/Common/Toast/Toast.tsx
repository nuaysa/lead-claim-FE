import { cva } from "class-variance-authority";
import { getIconColor, cn } from "@/utils/helpers";
import { toastTypes } from "@/components/type";
import { CheckCircle2, InfoIcon, X, XCircle } from "lucide-react";

interface ToastProps {
  message?: string;
  type?: toastTypes;
  className?: string;
  onClose: () => void;
}

const toastVariants = cva(
  "flex items-center justify-between rounded-full font-medium transition-colors cursor-pointer py-3 min-w-[300px] lg:w-[400px] my-1",
  {
    variants: {
      type: {
        INFO: "bg-primary-surface text-primary-main",
        SUCCESS:
          "bg-semantic-green3 text-semantic-green2",
        ERROR: "bg-semantic-red2 text-semantic-red1",
      },
    },
    defaultVariants: {
      type: "INFO",
    },
  }
);

export default function Toast({
  message,
  type,
  className,
  onClose,
}: ToastProps) {
  let IconComponent: React.ComponentType<{ className?: string }>;
  if (type === "SUCCESS") IconComponent = CheckCircle2;
  else if (type === "ERROR") IconComponent = XCircle;
  else IconComponent = InfoIcon;

  return (
    <div className={toastVariants({ type, className })}>
      <div className="flex justify-between w-full gap-2">
        <div className="flex items-center gap-3 px-4">
          <div className="w-4 h-4 flex items-center justify-center shrink-0">
            <IconComponent className={cn("w-4 h-4", getIconColor(type))} />
          </div>
          <p className="text-sm font-semibold">{message}</p>
        </div>

        <button type="button" onClick={onClose} className="cursor-pointer">
          <X className="w-4 h-4 mx-2 font-bold text-neutral-black" />
        </button>
      </div>
    </div>
  );
}
