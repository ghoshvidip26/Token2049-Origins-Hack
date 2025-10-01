"use client"

import { ReactNode, useMemo } from "react"
import { WagmiProvider } from "wagmi"
import { celo, celoAlfajores } from "viem/chains"
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { http } from "viem"
import "@rainbow-me/rainbowkit/styles.css"

type WalletProviderProps = {
  children: ReactNode
}

const queryClient = new QueryClient()

export function WalletProvider({ children }: WalletProviderProps) {
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

  const config = useMemo(() => {
    // Always provide a config, even if projectId is missing
    // This ensures WagmiProvider is always rendered
    return getDefaultConfig({
      appName: "PoolWatch",
      projectId: projectId || "fallback-project-id",
      chains: [celo, celoAlfajores],
      transports: {
        [celo.id]: http(),
        [celoAlfajores.id]: http(),
      },
      ssr: true,
    })
  }, [projectId])

  // Show warning if projectId is missing but still render providers
  if (!projectId && typeof window !== "undefined") {
    console.warn(
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Wallet connection may not work properly."
    )
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({ accentColor: "#35D07F", accentColorForeground: "#0A0B0D" })}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}


