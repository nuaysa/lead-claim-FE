"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { cn } from "@/utils/helpers";
import { KeyRound, LogOut, Plus, ZapIcon } from "lucide-react";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { userProfile, logout } = useAuthContext();

  const profile = userProfile?.name.toUpperCase().charAt(0);
  const userRole = userProfile?.role;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full fixed top-0 flex items-center justify-between bg-neutral-white border-b px-8 h-20 z-40">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex cursor-pointer items-center mx-4 text-white">
          <ZapIcon color="white" className="bg-linear-to-r from-primary-main to-primary-hover shadow-2xs h-10 w-10 p-2 rounded-xl" size={25} />
          <p className="text-lg text-neutral-black font-bold leading-tight mx-3">Powersurya CRM</p>
        </Link>
      </div>

      <div className="flex items-center gap-4 py-3">
        <div ref={dropdownRef} className="relative px-2">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn("flex items-center gap-2 text-sm py-2 px-3 rounded-lg text-neutral-black transition-colors cursor-pointer hover:bg-neutral-gray4", isDropdownOpen ? "bg-neutral-gray3" : "")}
          >
            <div className="flex items-center gap-2">
              <div className="bg-primary-surface border border-primary-surface p-2 text-primary-main text-sm font-bold rounded-full h-10 w-10 flex items-center justify-center">{profile}</div>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg border border-neutral-gray2 py-3 px-4 shadow-lg z-50 min-w-50">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-neutral-gray2">
                <div className="bg-primary-surface border border-primary-surface p-2 text-primary-main text-base font-bold rounded-full h-10 w-10 flex items-center justify-center">{profile ?? "A"}</div>
                <div>
                  <p className="text-sm text-black font-semibold">{userProfile?.name}</p>
                  <p className="text-xs text-neutral-gray1">Admin</p>
                </div>
              </div>
                <button
                  type="button"
                  onClick={() => {
                    router.push("/register");
                  }}
                  className="flex items-center gap-2 text-sm text-black hover:bg-neutral-gray1 w-full px-2 py-2 rounded transition-colors cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  Reset Password
                </button>
              {userRole === "ADMIN" && (
                <button
                  type="button"
                  onClick={() => {
                    router.push("/register");
                  }}
                  className="flex items-center gap-2 text-sm text-black hover:bg-neutral-gray1 w-full px-2 py-2 rounded transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Tambah User
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
                }}
                className="flex items-center gap-2 text-sm text-semantic-red1 hover:bg-semantic-red3 w-full px-2 py-2 rounded transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
