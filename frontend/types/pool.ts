export interface PoolData {
  reserve0: number
  reserve1: number
  tvl: number
  ratio: number
}

export type AlertSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"

export type AlertType = "tvl-drop" | "tvl-drop-high" | "imbalance" | "spike" | "whale"

export interface Alert {
  severity: AlertSeverity
  message: string
  summary: string
  metrics: {
    tvlChange?: number
    reserveImbalance?: number
  }
}
