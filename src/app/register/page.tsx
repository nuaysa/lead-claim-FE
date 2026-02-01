"use client";

import { useregisterViewModel } from "@/app/register/useRegisterVm";
import AdminGuard from "@/components/Common/AdminGuard/AdminGuard";
import Button from "@/components/Common/Button/Button";
import DynamicForm from "@/components/Common/Form/Form";

export default function RegisterPage() {
  const { form, registerFields, onSubmit } = useregisterViewModel();

  return (
    <AdminGuard>
    <div className="flex flex-col px-7 h-screen items-center justify-center bg-linear-to-br from-primary-surface to-white z-50">
 
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-neutral-white lg:m-0 shadow-md rounded-lg p-8 w-full max-w-md flex flex-col gap-6">
        <h1 className="text-center text-xl font-semibold text-neutral-900">Daftarkan Akun</h1>
        <div className="w-full">
          <DynamicForm fields={registerFields} form={form} layout="col" />
        </div>
        <Button type="submit" text="Daftarkan" size="LARGE" className="w-full mt-2" isLoading={form.formState.isSubmitting} disabled={!form.formState.isValid || form.formState.isSubmitting} />
      </form>
    </div>
</AdminGuard>
  );
}
