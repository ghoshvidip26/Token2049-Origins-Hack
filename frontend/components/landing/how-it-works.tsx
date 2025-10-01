import { Card } from "@/components/ui/card"

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect Your Pool",
      description: "Simply enter your CELO/cUSD pool address or select from popular pools to start monitoring.",
    },
    {
      number: "02",
      title: "Configure Alerts",
      description: "Set custom thresholds for TVL changes, reserve imbalances, and other critical metrics.",
    },
    {
      number: "03",
      title: "Monitor in Real-time",
      description: "Watch your pool metrics update live with smooth animations and instant alert notifications.",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">Get Started in Minutes</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            No complex setup required. Start monitoring your liquidity pools in three simple steps.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-border -translate-x-1/2" />
              )}
              <Card className="p-8 space-y-4 relative">
                <div className="text-6xl font-bold text-primary/20 font-mono">{step.number}</div>
                <h3 className="text-2xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
