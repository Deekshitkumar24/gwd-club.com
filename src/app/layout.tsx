import type { Metadata } from "next";
import "./globals.css";
import PublicShell from "@/components/PublicShell";
import { CmsProvider } from "@/context/CmsContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "GWD — Get Work Done | Student Technology & Creative Collective",
  description:
    "A student collective that turns ideas into shipped work — tech, design, and everything between. Operating across 10 countries from Hyderabad to the world.",
  keywords: [
    "GWD",
    "Get Work Done",
    "student collective",
    "technology",
    "design",
    "events",
    "projects",
    "sports OS",
    "Hyderabad",
    "VJIT",
  ],
  openGraph: {
    title: "GWD — Get Work Done",
    description:
      "A student collective that turns ideas into shipped work — tech, design, and everything between.",
    type: "website",
  },
  icons: {
    icon: "/brand/gwd-logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CmsProvider>
          <PublicShell>{children}</PublicShell>
        </CmsProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
