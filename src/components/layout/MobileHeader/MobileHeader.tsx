"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { cn } from "@/utils/helpers";
import { LogOut, Menu, X, Users, Settings, FileText, ChevronRight, ZapIcon, KeyRound } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { userProfile, logout } = useAuthContext();
  const pathname = usePathname();

  const profile = userProfile?.name.toUpperCase().charAt(0);
  const userName = userProfile?.name;
  const userRole = userProfile?.role;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    {
      name: "Reset Password",
      href: "/reset-password",
      icon: KeyRound,
    }
  ];

  if (userRole === "ADMIN") {
    navItems.push({
      name: "Daftarkan akun",
      href: "/register",
      icon: Users,
    });
  }

  return (
    <header className="sticky top-0 w-full bg-white border-b border-neutral-gray2 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <ZapIcon color="white" className="bg-linear-to-r from-primary-main to-primary-hover shadow-2xs h-10 w-10 p-2 rounded-xl" size={25} />
          </div>
          <p className="text-sm font-bold text-black">Powersurya CRM</p>
        </Link>

        <div className="flex items-center gap-3">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg hover:bg-neutral-gray4 transition-colors" aria-label="Toggle menu">
            {isMenuOpen ? <X className="w-5 h-5 text-neutral-black" /> : <Menu className="w-5 h-5 text-neutral-black" />}
          </button>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="hidden sm:flex items-center justify-center">
            <div className="bg-linear-to-br from-primary-main to-primary-dark text-white text-sm font-bold rounded-full h-9 w-9 flex items-center justify-center shadow-sm">{profile ?? "U"}</div>
          </button>
        </div>
      </div>

      <div ref={menuRef} className={cn("fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out", isMenuOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="p-6 border-b border-neutral-gray2">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-linear-to-br from-primary-main to-primary-dark text-white text-xl font-bold rounded-full h-14 w-14 flex items-center justify-center shadow-lg">{profile ?? "U"}</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-neutral-black">{userName}</h3>
              <p className="text-sm text-neutral-gray1">{userRole}</p>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-neutral-gray4 rounded-full transition-colors">
              <X className="w-5 h-5 text-neutral-gray1" />
            </button>
          </div>
        </div>

        <div className="p-4 h-full flex flex-col">
          <h4 className="text-xs font-semibold text-neutral-gray1 uppercase tracking-wider mb-3 px-2">Menu Utama</h4>

          <nav className="space-y-1 mb-6">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn("flex items-center justify-between p-3 rounded-xl transition-all duration-200", isActive ? "bg-primary-main text-white" : "hover:bg-neutral-gray4 text-neutral-black")}

                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-neutral-gray1")} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <ChevronRight className={cn("w-4 h-4", isActive ? "text-white" : "text-neutral-gray2")} />
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => {
              setIsMenuOpen(false);
              setTimeout(() => logout(), 300);
            }}
            className="flex items-center justify-center gap-3 w-full p-3 bg-semantic-red3 text-semantic-red1 rounded-xl font-medium hover:bg-semantic-red1 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>

          <div className="mt-8 pt-4 items-end border-t border-neutral-gray2 text-center">
            <p className="text-xs text-primary-main">
              Developed by <Link href={"https://aysa.bim.web.id/"}> A </Link> • Powersurya CRM
            </p>
          </div>
        </div>
      </div>

      {isMenuOpen && <div className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />}
    </header>
  );
}
