"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("schemeconnect_token");
    const storedUser = localStorage.getItem("schemeconnect_user");

    if (!token || !storedUser) {
      router.replace("/auth");
      return;
    }

    try {
      const user = JSON.parse(storedUser) as { role?: string };
      router.replace(user.role === "admin" ? "/admin" : "/eligibility");
    } catch {
      router.replace("/auth");
    }
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--gov-paper)] px-4">
      <div className="gov-card w-full max-w-2xl rounded-[2rem] p-10 text-center">
        <div className="gov-tricolor-stripe mb-6 rounded-full" />
        <div className="gov-section-label">SchemeConnect Access</div>
        <h1 className="mt-5 font-serif text-4xl font-bold text-[var(--gov-navy)]">
          Opening your citizen portal
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Please wait while we route you to login or your saved dashboard flow.
        </p>
      </div>
    </main>
  );
}
