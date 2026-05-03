import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { SyncScheduler } from "@/hooks/use-sync-scheduler";
import { AuthProvider } from "@/modules/auth/use-auth";
import { StorageMigration } from "@/modules/fichas/StorageMigration";
import { AppSidebar } from "@/modules/manager/ui/app-sidebar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Castles & Crusades APP",
  description: "Geradores para o sistema Castles & Crusades",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <StorageMigration />
        <AuthProvider>
          <SyncScheduler />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <AppSidebar />
              <main className="relative w-full">
                <div className="p-4 pt-0 md:p-10 md:pt-0">
                  {children}
                </div>
              </main>
            </SidebarProvider>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
