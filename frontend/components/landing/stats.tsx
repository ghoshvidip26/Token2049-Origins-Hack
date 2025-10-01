export function Stats() {
  const stats = [
    { label: "Total Value Monitored", value: "$2.4B+", change: "+12.5%" },
    { label: "Active Monitors", value: "1,247", change: "+8.2%" },
    { label: "Alerts Sent", value: "45K+", change: "+23.1%" },
    { label: "Uptime", value: "99.9%", change: "Reliable" },
  ]

  return (
    <section className="border-y border-border/40 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-bold font-mono tabular-nums">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-xs text-success font-medium">{stat.change}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
