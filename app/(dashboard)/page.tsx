"use client";

import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { isOnboardingComplete } from "@/lib/profile";
import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Home = () => {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const data = useQuery(
    api.fx.users.currentUserWithProfile,
    isAuthenticated ? {} : "skip",
  );

  useEffect(() => {
    if (data !== undefined && data !== null && !isOnboardingComplete(data.profile)) {
      router.replace("/onboarding");
    }
  }, [data, router]);

  return (
    <div>
      Welcome Back 
      <SignOutButton />
    </div>
  );
}

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  return (
    <>
      {isAuthenticated && (
        <Button
          className="bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          onClick={() =>
            void signOut().then(() => {
              router.push("/signin");
            })
          }
        >
          Sign out
        </Button>
      )}
    </>
  );
}

export default Home
