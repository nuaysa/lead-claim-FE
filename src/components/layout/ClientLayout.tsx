
"use client";

import { usePathname } from "next/navigation";
import Layout from "@/components/layout";
import ToastProvider from "@/contexts/ToastContext";
import AuthContextProvider from "@/contexts/AuthContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const isAuthPage = pathname === "/login" || pathname === "/verify";

  return (
    <ToastProvider position={"top-center"}>
      <AuthContextProvider>
        {isAuthPage ? children : <Layout>{children}</Layout>}
      </AuthContextProvider>
    </ToastProvider>
  );
}