import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function AlertShowcase() {
  const alerts = [
    {
      severity: "CRITICAL",
      title: "TVL Drop Detected",
      description: "Total Value Locked decreased by 25.3% in the last hour",
      color: "destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/50",
    },
    {
      severity: "HIGH",
      title: "Reserve Imbalance",
      description: "Reserve ratio deviation of 35.8% detected",
      color: "warning",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/50",
    },
    {
      severity: "MEDIUM",
      title: "Unusual Activity",
      description: "18.4% change in pool metrics within 1 minute",
      color: "secondary",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/50",
    },
  ]

  return (
    <section id="alerts" className="py-24 sm:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
            Stay Informed With Intelligent Alerts
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Our multi-level alert system ensures you never miss critical events affecting your liquidity positions.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {alerts.map((alert) => (
            <Card key={alert.title} className={`p-6 space-y-4 border-2 ${alert.bgColor} ${alert.borderColor}`}>
              <Badge variant={alert.color as any} className="w-fit">
                {alert.severity}
              </Badge>
              <h3 className="text-xl font-semibold">{alert.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{alert.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Alerts are categorized by severity: <span className="font-semibold text-destructive">CRITICAL</span>,{" "}
            <span className="font-semibold text-orange-500">HIGH</span>,{" "}
            <span className="font-semibold text-yellow-600">MEDIUM</span>, and{" "}
            <span className="font-semibold text-success">LOW</span>
          </p>
        </div>
      </div>
    </section>
  )
}
