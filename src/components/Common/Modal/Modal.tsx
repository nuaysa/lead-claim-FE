import { MailWarningIcon, Trash2, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { modalIconVariants } from "./variants";
import Button from "../Button/Button";

export type ModalVariant = "danger" | "warning";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: ModalVariant;
  title: string;
  description?: string | React.ReactNode;
  cancelText?: string;
  onConfirm: () => void;
  confirmText?: string;
  children?: React.ReactNode;
}

export default function ConfirmationModal({ isOpen, onClose, variant = "warning", title, description, cancelText = "Cancel", confirmText = "Ya",onConfirm, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      buttonVariant: "DANGER" as const,
      icon: <Trash2 size={30} className={modalIconVariants({ variant })} />,
    },
    warning: {
      buttonVariant: "PRIMARY" as const,
      icon: <MailWarningIcon size={30} className={modalIconVariants({ variant })} />,
    },
  };

  const currentVariant = variantStyles[variant];


  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-neutral-black/30 flex items-center justify-center z-30 p-4">
      <div ref={modalRef} className="relative bg-neutral-white rounded-lg max-w-1/2 mx-auto flex flex-col justify-center items-center px-6 py-8">
        <button type="button" onClick={onClose} className="absolute right-3 top-3 text-neutral-black cursor-pointer">
          <X width={24} height={24} />
        </button>
        <span>{currentVariant.icon}</span>
        <h2 className="text-xl font-bold text-neutral-black mb-1">{title}</h2>
        <p className="text-neutral-black mb-4 text-sm">{description}</p>

        {children && <div className="mb-6">{children}</div>}

        <div className="flex w-full gap-5 justify-between">
          <Button text={cancelText} variant="PLAIN" onClick={onClose} size="LARGE" className="w-full" />
          <Button text={confirmText} variant={currentVariant.buttonVariant} onClick={handleConfirm} size="LARGE" className="w-full" />
        </div>
      </div>
    </div>
  );
}
