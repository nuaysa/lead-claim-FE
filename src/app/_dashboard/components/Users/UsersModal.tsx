"use client";
import { Plus, Save } from "lucide-react";
import { useEffect } from "react";
import  fields  from "./UsersColumns";
import { useIsMobile } from "@/components/hooks/useIsMobile";
import BottomSheetModal from "@/components/Common/BottomSheet";
import BaseModal from "@/components/Common/BaseModal";
import DynamicForm from "@/components/Common/Form/Form";
import { useUserVM } from "../../viewmodels/useUserVm";

interface UsersCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  vm: ReturnType<typeof useUserVM>;
}

export default function UsersCreateModal({ isOpen, onClose, vm }: UsersCreateModalProps) {
  const { UserForm, onSubmit,  mode, selectedItem } = vm;
  const { handleSubmit, reset } = UserForm;
  const isMobile = useIsMobile();

 useEffect(() => {
  if (mode === "edit" && selectedItem) {
    UserForm.reset({
      name: selectedItem.name,
      role: selectedItem.role,
      email: selectedItem.email,
      password: "",
    });
  }

  if (mode === "create") {
    UserForm.reset();
  }
}, [mode, selectedItem]);

  const getModalConfig = () => {

    if (mode === "create") {
      return {
        title: `Tambah User`,
        submitText: `Tambah User`,
        submitIcon: <Plus size={18} />,
      };
    } else {
      return {
        title: `Edit User`,
        submitText: `Simpan Perubahan`,
        submitIcon: <Save size={18} />,
      };
    }
  };

  const modalConfig = getModalConfig();

  const ModalComponent = isMobile ? BottomSheetModal : BaseModal;

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      cancelText="Batal"
      submitText={modalConfig.submitText}
      submitIcon={modalConfig.submitIcon}
      onSubmit={handleSubmit(onSubmit)}
      title={modalConfig.title}
      isAction={false}
    >
      <DynamicForm fields={fields} form={UserForm} />
    </ModalComponent>
  );
}
