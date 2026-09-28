import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "GWD — Get Work Done",
  description: "A student collective that turns ideas into shipped work — tech, design, and everything between.",
  keywords: ["GWD", "Get Work Done", "student collective", "technology", "design", "events", "projects"],
  openGraph: {
    title: "GWD — Get Work Done",
    description: "A student collective that turns ideas into shipped work — tech, design, and everything between.",
    type: "website",
  },
  icons: {
    icon: '/brand/gwd-logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
