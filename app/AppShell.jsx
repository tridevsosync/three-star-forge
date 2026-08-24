"use client";

import { usePathname } from "next/navigation";
import { SiteProvider } from "@/store/site-store";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export function AppShell({ children }) {
  const pathname = usePathname();
  const isAdmin = Boolean(pathname?.startsWith("/admin"));

  return (
    <SiteProvider>
      {isAdmin ? (
        <main>{children}</main>
      ) : (
        <>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </>
      )}
    </SiteProvider>
  );
}
