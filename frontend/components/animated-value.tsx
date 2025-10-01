"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedValueProps {
  value: number
  decimals?: number
  duration?: number
}

export function AnimatedValue({ value, decimals = 2, duration = 500 }: AnimatedValueProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const startValueRef = useRef(value)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    startValueRef.current = displayValue
    startTimeRef.current = null

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime
      }

      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      const easeOutQuad = 1 - (1 - progress) * (1 - progress)
      const currentValue = startValueRef.current + (value - startValueRef.current) * easeOutQuad

      setDisplayValue(currentValue)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [value, duration])

  return <>{displayValue.toFixed(decimals)}</>
}
