"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { PoolData, Alert, AlertType } from "@/types/pool"

interface TestControlsProps {
  poolData: PoolData
  onAlert: (alert: Alert) => void
  onPoolUpdate: (data: PoolData) => void
}

const fakeAlerts: Record<AlertType, Omit<Alert, "summary"> & { tvlMultiplier?: number }> = {
  "tvl-drop": {
    severity: "CRITICAL",
    message: "TVL dropped 25.3%",
    metrics: { tvlChange: -25.3 },
    tvlMultiplier: 0.747,
  },
  "tvl-drop-high": {
    severity: "HIGH",
    message: "TVL dropped 12.7%",
    metrics: { tvlChange: -12.7 },
    tvlMultiplier: 0.873,
  },
  imbalance: {
    severity: "HIGH",
    message: "Reserve imbalance: 35.8% deviation",
    metrics: { reserveImbalance: 35.8 },
  },
  spike: {
    severity: "MEDIUM",
    message: "Unusual activity: 18.4% change in 1 min",
    metrics: { tvlChange: 18.4 },
    tvlMultiplier: 1.184,
  },
  whale: {
    severity: "CRITICAL",
    message: "Large whale transaction detected: $500K liquidity removed",
    metrics: { tvlChange: -45.2 },
    tvlMultiplier: 0.548,
  },
}

export function TestControls({ poolData, onAlert, onPoolUpdate }: TestControlsProps) {
  const triggerAlert = (type: AlertType) => {
    const alertData = fakeAlerts[type]
    const summary = `${alertData.severity} Alert: ${alertData.message}. Current TVL is $${poolData.tvl.toFixed(2)} with CELO/cUSD ratio ${poolData.ratio.toFixed(2)}. Monitor the pool and consider reviewing your position.`

    onAlert({
      ...alertData,
      summary,
    })

    if (alertData.tvlMultiplier) {
      onPoolUpdate({
        ...poolData,
        tvl: poolData.tvl * alertData.tvlMultiplier,
      })
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold">Test Alert System</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => triggerAlert("tvl-drop")} variant="destructive" className="flex-1 min-w-[200px]">
          TVL Drop (Critical)
        </Button>
        <Button
          onClick={() => triggerAlert("tvl-drop-high")}
          className="flex-1 min-w-[200px] bg-orange-600 hover:bg-orange-700 text-white"
        >
          TVL Drop (High)
        </Button>
        <Button
          onClick={() => triggerAlert("imbalance")}
          className="flex-1 min-w-[200px] bg-orange-600 hover:bg-orange-700 text-white"
        >
          Reserve Imbalance
        </Button>
        <Button
          onClick={() => triggerAlert("spike")}
          className="flex-1 min-w-[200px] bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          Sudden Spike
        </Button>
        <Button onClick={() => triggerAlert("whale")} variant="destructive" className="flex-1 min-w-[200px]">
          Whale Transaction
        </Button>
      </div>
    </Card>
  )
}
