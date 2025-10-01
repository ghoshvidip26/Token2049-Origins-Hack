import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-12 sm:p-16 lg:p-20">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="relative mx-auto max-w-2xl text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary-foreground text-balance">
              Ready to Monitor Your Pools?
            </h2>
            <p className="text-xl text-primary-foreground/90 text-pretty">
              Join hundreds of liquidity providers who trust PoolWatch for real-time monitoring and intelligent alerts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/monitor">
                <Button size="lg" variant="secondary" className="gap-2 text-base px-8">
                  Launch Monitor
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
