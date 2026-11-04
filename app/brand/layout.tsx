import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { CLUB_NAME, SITE_TITLE } from "@/lib/site";
import "./brand.css";

// Brand.pdf header font. Helvetica Now (body) isn't on Google Fonts, so
// brand.css names it first and falls back to Helvetica/Arial.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${SITE_TITLE} (brand preview) · ${CLUB_NAME}`,
  robots: { index: false, follow: false },
};

// Same page as "/", restyled: every override lives under .brand.
export default function BrandLayout({ children }: LayoutProps<"/brand">) {
  return <div className={`brand ${montserrat.variable}`}>{children}</div>;
}
