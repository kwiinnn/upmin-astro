import { ClusterSection } from "@/components/ClusterSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MiniMap } from "@/components/MiniMap";
import { SkyProvider } from "@/components/Sky";
import { StarField } from "@/components/StarField";
import { CLUSTERS } from "@/lib/clusters";

export default function Home() {
  return (
    <>
      <StarField />
      <main className="relative z-10">
        <SkyProvider>
          <Hero />
          {CLUSTERS.map((c, i) => (
            <ClusterSection key={c.id} c={c} index={i} />
          ))}
          <MiniMap />
        </SkyProvider>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
