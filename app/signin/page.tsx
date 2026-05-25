import { SignInForm } from "@/features/sign-in/sign-in-form";
import { Logo } from "@/components/global/logo";

const SignInPage = () => {
  return (
    <div className="flex flex-col gap-8 w-full max-w-lg h-fit lg:h-screen mx-auto justify-center items-center px-4">
      <Logo size="sm" />
      <SignInForm />
      <p className="w-3/4 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our Terms of Service and Privacy
        Policy.
      </p>
    </div>
  );
};

export default SignInPage;
