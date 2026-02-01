"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import AuthLoading from "../AuthLoading";

export default function AdminGuard({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, isAdmin, isLoading } =
    useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!isAdmin) {
      router.replace("/");
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading || !isAuthenticated || !isAdmin) {
    return <AuthLoading/>;
}

  return <>{children}</>;
}
