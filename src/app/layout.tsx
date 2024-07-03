import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { ProgressProviders } from "@/components/progress-bar";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";

import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";

import { ViewTransitions } from "next-view-transitions";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Spend Share",
  description:
    "The Spend Share is designed to streamline expense tracking within groups. It enables users to create groups, record transactions, and manage shared costs efficiently. Key features include user authentication for secure access, group creation and management, transaction recording with detailed descriptions, and comprehensive expense reports. With intuitive navigation and robust functionality, the Group Expenses Tracker simplifies group financial management, making it easier for users to track expenses and settle balances effortlessly.",
    metadataBase: new URL("https://spendshare.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "hsl(263.4, 70%, 50.4%)",
        },
      }}
    >
      <ViewTransitions>
        <ReactQueryClientProvider>
          <html className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800" lang="en">
            <head>
              <meta name="google-site-verification" content="Q0eRtTv86xU2BnuVOPSsbdUkF8zzinma_5_Bg97SRqk" />
            </head>
            <body
              suppressHydrationWarning
              className={cn(
                "min-h-screen bg-background font-sans antialiased",
                fontSans.variable
              )}
            >
              <ProgressProviders>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <SpeedInsights/>
                  <Analytics/>
                  <Navbar />
                  <Toaster />
                  {children}
                </ThemeProvider>
              </ProgressProviders>
            </body>
          </html>
        </ReactQueryClientProvider>
      </ViewTransitions>
    </ClerkProvider>
  );
}
