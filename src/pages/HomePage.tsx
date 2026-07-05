import { HeroSection } from "@/features/hero/HeroSection";
import { TerminalSection } from "@/features/terminal/TerminalSection";
import { AboutSection } from "@/features/about/AboutSection";
import { ProjectsSection } from "@/features/projects/ProjectsSection";
import { PlayroomSection } from "@/features/playroom/PlayroomSection";
import { SkillsSection } from "@/features/skills/SkillsSection";
import { GithubSection } from "@/features/github/GithubSection";
import { JourneySection } from "@/features/journey/JourneySection";
import { CertificatesSection } from "@/features/certificates/CertificatesSection";
import { FutureLabSection } from "@/features/futureLab/FutureLabSection";
import { AnalyticsSection } from "@/features/analytics/AnalyticsSection";
import { CurrentlyBuildingSection } from "@/features/currentlyBuilding/CurrentlyBuildingSection";
import { ContactSection } from "@/features/contact/ContactSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <TerminalSection />
      <AboutSection />
      <ProjectsSection />
      <PlayroomSection />
      <SkillsSection />
      <GithubSection />
      <JourneySection />
      <CertificatesSection />
      <FutureLabSection />
      <AnalyticsSection />
      <CurrentlyBuildingSection />
      <ContactSection />
    </>
  );
}
