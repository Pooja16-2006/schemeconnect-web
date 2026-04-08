"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

type CitizenAuthGuardProps = {
  children: ReactNode;
};

export function CitizenAuthGuard({ children }: CitizenAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("schemeconnect_token");
    const storedUser = localStorage.getItem("schemeconnect_user");

    if (!token || !storedUser) {
      router.replace("/auth");
      return;
    }

    try {
      const user = JSON.parse(storedUser) as { role?: string };

      if (user.role !== "citizen") {
        router.replace(user.role === "admin" ? "/admin" : "/auth");
        return;
      }

      setIsAllowed(true);
    } catch {
      router.replace("/auth");
      return;
    } finally {
      setIsChecking(false);
    }
  }, [pathname, router]);

  if (isChecking || !isAllowed) {
    return (
      <div className="mx-auto flex min-h-[40vh] w-full max-w-3xl items-center justify-center px-4 py-16">
        <div className="gov-card w-full max-w-xl rounded-[2rem] p-8 text-center">
          <div className="gov-section-label">Citizen Access Check</div>
          <h2 className="mt-4 font-serif text-3xl font-bold text-[var(--gov-navy)]">
            Verifying your login
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Redirecting you to the correct citizen access page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
