import { Card } from "@/components/ui/card"
import { Bell, TrendingUp, Shield, Zap, BarChart3, Clock } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Bell,
      title: "Smart Alert System",
      description:
        "Get instant notifications for TVL drops, reserve imbalances, and unusual activity with severity-based prioritization.",
    },
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description:
        "Monitor pool metrics with live updates every 5 seconds. Track TVL, ratios, and reserves with precision.",
    },
    {
      icon: Shield,
      title: "Risk Management",
      description:
        "Identify potential risks before they impact your position with intelligent pattern detection and whale tracking.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built for speed with optimized data fetching and smooth animations. No lag, just instant insights.",
    },
    {
      icon: BarChart3,
      title: "Comprehensive Metrics",
      description: "Track all essential pool data including reserves, ratios, and total value locked in one dashboard.",
    },
    {
      icon: Clock,
      title: "Historical Data",
      description: "Access historical trends and patterns to make informed decisions about your liquidity positions.",
    },
  ]

  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
            Everything You Need to Monitor Your Pools
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Powerful features designed for DeFi liquidity providers who demand real-time insights and proactive risk
            management.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
