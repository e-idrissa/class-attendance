"use client";

import { useEffect } from "react";
import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { isOnboardingComplete } from "@/lib/profile";
import { systemRoles } from "@/lib/constants";

import { Logo } from "@/components/global/logo";
import { OnboardingForm } from "@/features/onboarding/onboarding-form";
import { Spinner } from "@/components/ui/spinner";

const OnboardingPage = () => {
  const router = useRouter();
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const data = useQuery(
    api.fx.users.currentUserWithProfile,
    isAuthenticated ? {} : "skip",
  );

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace("/signin");
      return;
    }
    if (data !== undefined && data !== null && isOnboardingComplete(data.profile)) {
      router.replace("/");
    }
  }, [authLoading, isAuthenticated, data, router]);

  if (authLoading || (isAuthenticated && data === undefined)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated || data === null || data === undefined || isOnboardingComplete(data.profile)) {
    return null;
  }

  const { profile } = data;
  const role = profile?.role[0] ?? systemRoles[0];

  return (
    <div className="flex flex-col gap-8 w-full max-w-lg mx-auto h-screen justify-center items-center px-4">
      <Logo size="sm" />
      <OnboardingForm role={role} />
    </div>
  );
};

export default OnboardingPage;
