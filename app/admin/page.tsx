import type { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";
import { StarField } from "@/components/StarField";

export const metadata: Metadata = { title: "Admin · Mission Briefing", robots: { index: false } };

export default function AdminPage() {
  return (
    <>
      <StarField />
      <main className="relative z-10">
        <AdminPanel />
      </main>
    </>
  );
}
