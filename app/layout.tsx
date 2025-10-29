import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ErrorBoundary } from "@/components/error-boundary";
import { ToastProvider } from "@/components/toast";
import { MuiThemeProvider } from "@/components/mui-theme-provider";
import { MobileNav } from "@/components/mobile-nav";

export const metadata: Metadata = {
  title: "CooksAssistant",
  description: "Your personal recipe and meal planning assistant",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <MuiThemeProvider>
            <ErrorBoundary>
              <ToastProvider>
                {children}
                <MobileNav />
              </ToastProvider>
            </ErrorBoundary>
          </MuiThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
