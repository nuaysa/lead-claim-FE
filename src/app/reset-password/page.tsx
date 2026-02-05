"use client";

import Button from "@/components/Common/Button/Button";
import DynamicForm from "@/components/Common/Form/Form";
import { useResetPasswordViewModel } from "./useResetPasswordVm";

export default function LoginPage() {
  const { form, ResetPasswordFields, onSubmit } = useResetPasswordViewModel();


  return (
    <div className="flex flex-col px-7 h-screen items-center justify-center bg-linear-to-br from-primary-surface to-white z-50">
 
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-neutral-white lg:m-0 shadow-md rounded-lg p-8 w-full max-w-md flex flex-col gap-6">
        <h1 className="text-center text-xl font-semibold text-neutral-900">Ubah kata sandi anda</h1>
        <div className="w-full">
          <DynamicForm fields={ResetPasswordFields} form={form} layout="col" />
        </div>
        <Button type="submit" text="Simpan" size="LARGE" className="w-full mt-2" isLoading={form.formState.isSubmitting} disabled={!form.formState.isValid || form.formState.isSubmitting} />
      </form>
    </div>
  );
}
