import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { Ripple } from "@/components/Ripple";
import { CLUB_NAME, SITE_TITLE } from "@/lib/site";
import "./globals.css";

// Brand.pdf header font. The body font (Helvetica Now) is set in globals.css.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${SITE_TITLE} · ${CLUB_NAME}`,
  description:
    "Companion site for the UP Mindanao Astro General Assembly: five regions of space science, one slide at a time.",
};

export const viewport: Viewport = {
  themeColor: "#0d0a20",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} antialiased`}>
      <body>
        {children}
        <Ripple />
      </body>
    </html>
  );
}
