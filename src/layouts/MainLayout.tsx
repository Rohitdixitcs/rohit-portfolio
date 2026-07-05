import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NoiseOverlay } from "@/components/shared/NoiseOverlay";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { CustomCursor } from "@/components/shared/CustomCursor";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { BackToTop } from "@/components/shared/BackToTop";
import { useLenis } from "@/hooks/useLenis";
import { useScrollDepthTracking } from "@/hooks/useScrollDepthTracking";
import { initGA, recordVisit } from "@/lib/analytics";
import { initVisitorInsights } from "@/lib/visitorInsights";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  useLenis();
  useScrollDepthTracking();

  useEffect(() => {
    initGA();
    recordVisit();
    initVisitorInsights();
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased">
      <LoadingScreen />
      <CustomCursor />
      <CommandPalette />
      <NoiseOverlay />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
