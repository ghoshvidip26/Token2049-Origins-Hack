"use client"
import { Card } from "@/components/ui/card"
import { AnimatedValue } from "@/components/animated-value"
import type { PoolData } from "@/types/pool"

interface PoolMetricsProps {
  data: PoolData
}

export function PoolMetrics({ data }: PoolMetricsProps) {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold">Pool Status</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <MetricCard label="Total Value Locked" value={data.tvl} prefix="$" decimals={2} trend="neutral" />
        <MetricCard label="CELO/cUSD Ratio" value={data.ratio} decimals={3} trend="neutral" />
        <MetricCard label="Reserve CELO" value={data.reserve0} decimals={4} suffix=" CELO" trend="neutral" />
        <MetricCard label="Reserve cUSD" value={data.reserve1} decimals={4} suffix=" cUSD" trend="neutral" />
      </div>
    </Card>
  )
}

interface MetricCardProps {
  label: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  trend?: "up" | "down" | "neutral"
}

function MetricCard({ label, value, prefix = "", suffix = "", decimals = 2, trend = "neutral" }: MetricCardProps) {
  return (
    <div className="space-y-2 rounded-lg bg-secondary/50 p-4 border border-border/50">
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono tabular-nums">
          {prefix}
          <AnimatedValue value={value} decimals={decimals} />
          {suffix}
        </span>
      </div>
    </div>
  )
}
