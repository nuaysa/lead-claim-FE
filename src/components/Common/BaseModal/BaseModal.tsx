"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { Delete, Edit2Icon, Plus, X } from "lucide-react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitText?: string;
  submitIcon?: React.ReactElement;
  cancelText?: string;
  editText?: string;
  isAction: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function BaseModal({ isOpen, onClose, title, children, onSubmit, submitText = "Simpan", cancelText, editText = "Ubah", submitIcon, isAction, onDelete, onEdit }: BaseModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isMounted || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <button type="button" aria-label="Close modal" onClick={onClose} className="absolute inset-0 bg-neutral-black/30" />
      <div className="bg-neutral-white z-50 rounded-md w-full max-w-lg h-full flex flex-col">
        <div className="relative px-7 pt-9">
          <button type="button" onClick={onClose} className="absolute right-2 top-2 text-neutral-black cursor-pointer">
            <X size={20} />
          </button>
          <div className="flex w-full justify-between items-center pb-5 border-b-2 border-neutral-gray2 ">
            <h2 className="text-xl font-bold text-neutral-black">{title}</h2>
            {isAction && (
              <span className="flex gap-2">
                {onDelete && <Button variant="PLAIN" onClick={onDelete} icon={<Delete className="text-semantic-red1 p-0.5" width={23} height={24} />} />}
                {onEdit && <Button variant="PLAIN" onClick={onEdit} text={editText} icon={<Edit2Icon width={23} height={21} />} className="font-bold text-primary-main p-4" />}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-3 text-sm">{children}</div>

        <div className="p-3 my-2 flex flex-col px-7 gap-3 w-full">
          {onSubmit && <Button text={submitText} icon={submitIcon ?? <Plus />} variant="PRIMARY" onClick={onSubmit} className="font-bold min-w-37.5" />}
          {cancelText && <Button text={cancelText} variant="PLAIN" onClick={onClose} className="font-bold min-w-37.5" />}
        </div>
      </div>
    </div>
  );
}
