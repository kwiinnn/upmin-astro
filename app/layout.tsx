import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { Ripple } from "@/components/Ripple";
import { CLUB_NAME, SITE_TITLE } from "@/lib/site";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-display",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const sans = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${SITE_TITLE} · ${CLUB_NAME}`,
  description:
    "Companion site for the UP Mindanao Astro General Assembly: five regions of space science, one slide at a time.",
};

export const viewport: Viewport = {
  themeColor: "#060a18",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} antialiased`}>
      <body>
        {children}
        <Ripple />
      </body>
    </html>
  );
}
