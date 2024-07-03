import { cn } from "@/lib/utils";
import { CSSProperties, FC, ReactNode } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";

interface AnimatedShinyTextProps {
  children: ReactNode;
  className?: string;
  shimmerWidth?: number;
}

const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
}) => {
  return (
    <p
      style={
        {
          "--shimmer-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "mx-auto max-w-md text-neutral-600/50 dark:text-neutral-400/50 ",

        // Shimmer effect
        "animate-shimmer bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shimmer gradient
        "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent  dark:via-white/80",

        className,
      )}
    >
      {children}
    </p>
  );
};

export async function AnimatedShinyTextDemo() {
    return (
      <div className="z-10 flex items-center justify-center">
        <div
          className={cn(
            "group rounded-full border border-indigo-500/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-pink-900 dark:hover:bg-pink-800",
          )}
        >
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 text-gray-200 transition ease-out hover:text-gray-300 hover:duration-300 hover:dark:text-gray-300">
            <span className="dark:text-gray-200 text-gray-800">✨ Introducing Spend Share</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out dark:text-gray-400 text-black group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
      </div>
    );
  }