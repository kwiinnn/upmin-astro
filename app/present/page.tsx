import type { Metadata } from "next";
import { PresentView } from "@/components/PresentView";
import { StarField } from "@/components/StarField";

export const metadata: Metadata = { title: "Present · Mission Briefing", robots: { index: false } };

export default function PresentPage() {
  return (
    <div className="cinematic">
      <StarField cinematic />
      <PresentView />
    </div>
  );
}
