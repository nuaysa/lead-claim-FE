"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import Button from "@/components/Common/Button/Button";
import { useVerifyViewModel } from "../useRegisterVm";

export default function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();
  const { onVerify } = useVerifyViewModel();

  const pathname = usePathname();
  const token = pathname.split("/").pop() || "";

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
      <h1 className="text-center text-xl font-semibold text-neutral-900">Verifikasi Akun Anda dengan mengklik tombol di bawah</h1>

      <Button type="submit" text="Daftarkan" size="LARGE" className="w-1/4 mt-2" onClick={() => onVerify(token)} />
    </div>
  );
}
