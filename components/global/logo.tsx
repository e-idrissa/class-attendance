import { cn } from "@/lib/utils";
import { BookOpen02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ size = "md" }: LogoProps) => {
  const iconSize = size === "sm" ? 24 : size === "md" ? 36 : 40;
  return (
    <div
      className={cn(
        "bg-primary text-white",
        size === "sm" && "p-3 rounded-md",
        size === "md" && "p-4 rounded-lg",
        size === "lg" && "p-6 rounded-xl",
      )}
    >
      <HugeiconsIcon icon={BookOpen02Icon} size={iconSize} strokeWidth={2} />
    </div>
  );
};

export const LogoText = () => {
  return (
    <span>
      A<span className="text-primary">S</span>ys
    </span>
  );
};
