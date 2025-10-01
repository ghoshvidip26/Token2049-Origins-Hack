"use client"

import { useState, useEffect } from "react"
import { PoolMetrics } from "@/components/pool-metrics"
import { AlertPanel } from "@/components/alert-panel"
import { TestControls } from "@/components/test-controls"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { PoolData, Alert } from "@/types/pool"

export default function PoolMonitor() {
  const [poolData, setPoolData] = useState<PoolData>({
    reserve0: 1.0,
    reserve1: 0.5,
    tvl: 1200.5,
    ratio: 2.0,
  })

  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setPoolData((prev) => ({
        reserve0: prev.reserve0 * (0.98 + Math.random() * 0.04),
        reserve1: prev.reserve1 * (0.98 + Math.random() * 0.04),
        tvl: prev.tvl * (0.98 + Math.random() * 0.04),
        ratio: prev.ratio * (0.98 + Math.random() * 0.04),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-balance">CELO/cUSD Pool Monitor</h1>
            <p className="text-muted-foreground text-lg">Real-time liquidity pool monitoring and alert system</p>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <PoolMetrics data={poolData} />
          <AlertPanel alert={currentAlert} />
        </div>

        <TestControls poolData={poolData} onAlert={setCurrentAlert} onPoolUpdate={setPoolData} />
      </div>
    </main>
  )
}
