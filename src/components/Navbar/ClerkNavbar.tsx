import React from "react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

function ClerkNavbar() {
  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: "w-full",
      userButtonPopoverCard: "bg-blue-100",
    },
  };

  return (
    <>
      <ClerkLoading>
        <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>
          <span className="cursor-pointer">
            <UserButton appearance={userButtonAppearance} afterSignOutUrl="/" />
          </span>
        </SignedIn>
        <SignedOut>
          <SignInButton
            mode="redirect"
            signUpFallbackRedirectUrl={"/expense"}
            signUpForceRedirectUrl={"/expense"}
            forceRedirectUrl={"/expense"}
            fallbackRedirectUrl={"/expense"}
          >
            <Button>Login</Button>
          </SignInButton>
        </SignedOut>
      </ClerkLoaded>
    </>
  );
}

export default ClerkNavbar;
