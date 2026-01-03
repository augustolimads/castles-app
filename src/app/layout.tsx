import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/modules/manager/ui/app-sidebar";

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
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <AppSidebar />
          <main className="relative w-full max-w-6xl">
            <div className="fixed">
              <SidebarTrigger />
            </div>
            <div className="p-4 pt-0 md:p-10 md:pt-0">
              {children}
            </div>
          </main>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
