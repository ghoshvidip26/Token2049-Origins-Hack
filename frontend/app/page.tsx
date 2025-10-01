import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { AlertShowcase } from "@/components/landing/alert-showcase"
import { Stats } from "@/components/landing/stats"
import { CTA } from "@/components/landing/cta"
import { Navigation } from "@/components/landing/navigation"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Stats />
      <Features />
      <AlertShowcase />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  )
}
