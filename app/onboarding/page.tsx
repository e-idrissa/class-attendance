"use client";

import { useEffect } from "react";
import { Logo } from "@/components/global/logo";
import { api } from "@/convex/_generated/api";
import { OnboardingForm } from "@/features/onboarding/onboarding-form";
import { isOnboardingComplete } from "@/lib/profile";
import { systemRoles } from "@/lib/constants";
import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";

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

  const { user, profile } = data;
  const role = profile?.role[0] ?? systemRoles.student;

  return (
    <div className="flex flex-col gap-8 w-full max-w-lg mx-auto h-screen justify-center items-center px-4">
      <Logo size="sm" />
      <OnboardingForm id={user._id} role={role} />
    </div>
  );
};

export default OnboardingPage;
