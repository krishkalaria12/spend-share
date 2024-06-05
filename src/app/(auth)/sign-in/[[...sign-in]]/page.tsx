import React from "react";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="flex space-x-4 p-6 justify-center items-center">
      <div className="flex w-[50%] justify-center max-h-[80%] items-start mt-10">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: {
                fontSize: 16,
                textTransform: "none",
                backgroundColor: "#611BBD",
                "&:hover, &:focus, &:active": {
                  backgroundColor: "#49247A",
                },
                padding: "0.8rem",
              },
              alertText: {
                fontSize: 16,
              },
              formFieldLabel: {
                fontSize: 14,
              },
              footerActionText: {
                fontSize: 16,
              },
              footerActionLink: {
                fontSize: 16,
              },
              headerTitle: {
                fontSize: 24,
              },
              headerSubtitle: {
                fontSize: 18,
              },
              formFieldInput: {
                fontSize: 16,
              },
              socialButtonsBlockButtonText__google: {
                fontSize: 14,
              },
            },
          }}
        />
      </div>
      <div className="hidden h-screen w-[50%] bg-muted lg:block">
        <Image
          src="/photo-1546514714-df0ccc50d7bf.jpg"
          alt="Image"
          width={500}
          height={900}
          priority={true}
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
