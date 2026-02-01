// components/loading/AuthLoading.tsx
"use client";

export default function AuthLoading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-linear-to-br from-primary-surface to-white z-50">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary-main/20 border-t-primary-main rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-primary-main/10 rounded-full"></div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold text-primary-main mb-2">
      LeadClaim. </h2>
        <p className="text-neutral-gray1 animate-pulse">Memuat sistem...</p>
      </div>
    </div>
  );
}