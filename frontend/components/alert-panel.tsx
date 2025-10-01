"use client"

import { Card } from "@/components/ui/card"
import type { Alert } from "@/types/pool"

interface AlertPanelProps {
  alert: Alert | null
}

const severityConfig = {
  CRITICAL: {
    bg: "bg-destructive/10",
    border: "border-destructive/50",
    text: "text-destructive",
    icon: "🚨",
  },
  HIGH: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/50",
    text: "text-orange-500",
    icon: "⚠️",
  },
  MEDIUM: {
    bg: "bg-warning/10",
    border: "border-warning/50",
    text: "text-warning",
    icon: "⚡",
  },
  LOW: {
    bg: "bg-success/10",
    border: "border-success/50",
    text: "text-success",
    icon: "✓",
  },
}

export function AlertPanel({ alert }: AlertPanelProps) {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold">Latest Alert</h2>
      </div>

      <div className="min-h-[200px] flex items-center justify-center">
        {alert ? (
          <div
            className={`w-full rounded-lg border-2 p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 ${
              severityConfig[alert.severity].bg
            } ${severityConfig[alert.severity].border}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{severityConfig[alert.severity].icon}</span>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold uppercase tracking-wider ${severityConfig[alert.severity].text}`}>
                    {alert.severity} Alert
                  </span>
                </div>
                <p className="text-foreground font-medium text-lg">{alert.message}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{alert.summary}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="mx-auto h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
              <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground">No alerts detected. Pool operating normally.</p>
          </div>
        )}
      </div>
    </Card>
  )
}
