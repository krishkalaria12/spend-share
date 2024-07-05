"use client";

import { useState, useEffect } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export default function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render nothing on the server and until the theme is mounted
    return null;
  }

  return (
    <div className={className || "border-2 padding-2"}>
      <Button
        variant="ghost"
        className="hover:bg-inherit transition-all border-zinc-100 bg-inherit dark:border-zinc-900 dark:bg-[#0c0c0d]"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <SunIcon
          className={`w-5 h-5 transition-transform ${
            theme === "dark" ? "-rotate-90 scale-0" : "rotate-0 scale-100"
          }`}
        />
        <MoonIcon
          className={`w-5 h-5 absolute transition-transform ${
            theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
          }`}
        />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
