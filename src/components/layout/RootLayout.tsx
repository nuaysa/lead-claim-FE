"use client";
import type { ReactNode } from "react";
import Header from "./Header";
import MobileHeader from "./MobileHeader";
import { useIsMobile } from "../hooks/useIsMobile";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen h-full bg-neutral-gray4">
        <MobileHeader />
        <div className="w-full">{children}</div>
      </div>
    );
    
  } else {
    return (
      <div className="flex flex-col min-h-screen h-full bg-neutral-gray4">
        <Header />
        <div className="w-full pt-18">{children}</div>
      </div>
    );
  }
}
