import { AuroraBackground } from "./components/AuroraBackground";
import { HeroContent } from "./components/HeroContent";
import { FloatingParticles } from "./components/FloatingParticles";
import { ScrollIndicator } from "./components/ScrollIndicator";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero — Introduction"
    >
      <AuroraBackground />
      <FloatingParticles count={50} />
      <HeroContent />
      <ScrollIndicator />
    </section>
  );
}
