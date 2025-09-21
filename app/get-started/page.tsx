"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GetStartedPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }

    // Role-based onboarding redirection
    switch (user?.role) {
      case "supplier":
        router.push("/inventory");
        break;
      case "certifier":
        router.push("/certification");
        break;
      case "auditor":
        router.push("/tracking");
        break;
      case "consumer":
        router.push("/tracking");
        break;
      default:
        router.push("/");
    }
  }, [isAuthenticated, user, router]);

  return (
    <main className="container mx-auto px-4 py-8">
      <p>Redirecting to your onboarding flow...</p>
    </main>
  );
}
