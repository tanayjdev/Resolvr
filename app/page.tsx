import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { PathwayVisualization } from "@/components/landing/pathway-visualization"
import { StatsSection } from "@/components/landing/stats-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"
import PageTransition from "@/components/common/PageTransition"

export default function Home() {
  return (
     <PageTransition>
    <main className="relative min-h-screen bg-background isolate">
      <Navbar />
      <HeroSection />
      <DashboardPreview />
      <PathwayVisualization />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </main>
    </PageTransition>
  )
}