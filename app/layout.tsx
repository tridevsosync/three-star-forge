import "@/styles.css";
import { AppShell } from "./AppShell";

export const metadata = {
  title: "Three Star Enterprises — Engineering Ideas Into Industrial Reality",
  description:
    "Design engineering, turnkey manufacturing, NPI and product management for global OEMs. Induction hardening machines, conveyors, automation and material handling equipment from Pune.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
