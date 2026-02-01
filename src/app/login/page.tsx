"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLoginViewModel } from "@/app/login/useLoginVm";
import { useAuthContext } from "@/contexts/AuthContext";
import Button from "@/components/Common/Button/Button";
import DynamicForm from "@/components/Common/Form/Form";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();
  const { form, loginFields, onSubmit } = useLoginViewModel();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // if (isLoading || isAuthenticated) {
  //   return (
  //     <div className="fixed inset-0 flex justify-center items-center bg-white">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col px-7 h-screen items-center justify-center bg-linear-to-br from-primary-surface to-white z-50">
 
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-neutral-white lg:m-0 shadow-md rounded-lg p-8 w-full max-w-md flex flex-col gap-6">
        <h1 className="text-center text-xl font-semibold text-neutral-900">Masuk ke Akun Anda</h1>
        <div className="w-full">
          <DynamicForm fields={loginFields} form={form} layout="col" />
        </div>
        <Button type="submit" text="Masuk" size="LARGE" className="w-full mt-2" isLoading={form.formState.isSubmitting} disabled={!form.formState.isValid || form.formState.isSubmitting} />
      </form>
    </div>
  );
}
