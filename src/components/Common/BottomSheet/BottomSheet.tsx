"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Delete, Edit2Icon, Plus, X } from "lucide-react";
import { cn } from "@/utils/helpers";
import Button from "../Button/Button";

interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string |React.ReactNode;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitText?: string;
  submitIcon?: React.ReactElement;
  cancelText?: string;
  editText?: string;
  isAction?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function BottomSheetModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = "Simpan",
  cancelText,
  editText = "Ubah",
  submitIcon,
  isAction,
  onDelete,
  onEdit,
}: BottomSheetModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isMounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end">
      <button
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-neutral-black/40"
      />

      <div
        className={cn(
          "relative w-full bg-neutral-white rounded-t-2xl z-50 flex flex-col",
          "max-h-[90vh] animate-slide-up"
        )}
      >
       <div className="flex justify-center pt-3">
          <span className="h-1 w-12 rounded-full bg-neutral-gray2" />
        </div>

        <div className="relative px-6 pt-4 pb-4 border-b border-neutral-gray2">
          <h2 className="text-lg font-bold text-neutral-black">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-neutral-black"
          >
            <X size={22} />
          </button>

          {isAction && (
            <div className="flex gap-2 mt-3">
              {onDelete && (
                <Button
                  variant="PLAIN"
                  onClick={onDelete}
                  icon={<Delete className="text-semantic-red1" />}
                />
              )}
              {onEdit && (
                <Button
                  variant="PLAIN"
                  onClick={onEdit}
                  text={editText}
                  icon={<Edit2Icon />}
                  className="font-bold text-primary-main"
                />
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 text-sm">
          {children}
        </div>

        <div className="px-6 py-4 border-t border-neutral-gray2 flex flex-col gap-3">
          {onSubmit && (
            <Button
              text={submitText}
              icon={submitIcon ?? <Plus />}
              variant="PRIMARY"
              onClick={onSubmit}
              className="font-bold"
            />
          )}
          {cancelText && (
            <Button
              text={cancelText}
              variant="PLAIN"
              onClick={onClose}
              className="font-bold"
            />
          )}
        </div>
      </div>
    </div>
  );
}
