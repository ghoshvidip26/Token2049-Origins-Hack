import { useState, useEffect, useCallback } from "react";
import { WalletState } from "../../lib/types";

// Contract addresses (these would come from environment or config)
const RISK_AGENT_HEDGE_ADDRESS = "0x..."; // Deploy contract and add address
const CELO_CHAIN_ID = 42220; // Celo Mainnet
const ALFAJORES_CHAIN_ID = 44787; // Celo Alfajores Testnet

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
  });
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if wallet is already connected on load
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"],
          });

          setWallet({
            connected: true,
            address: accounts[0],
            chainId: parseInt(chainId, 16),
            balance: (parseInt(balance, 16) / 1e18).toFixed(4), // Convert wei to CELO
          });
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask or another Web3 wallet");
      return;
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Get chain ID
      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      // Get balance
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });

      setWallet({
        connected: true,
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        balance: (parseInt(balance, 16) / 1e18).toFixed(4),
      });

      // Switch to Celo if not already on it
      const currentChainId = parseInt(chainId, 16);
      if (
        currentChainId !== CELO_CHAIN_ID &&
        currentChainId !== ALFAJORES_CHAIN_ID
      ) {
        await switchToCelo();
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        alert("Please approve the connection request");
      } else {
        alert("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToCelo = async () => {
    if (!window.ethereum) return;

    try {
      // Try to switch to Celo Mainnet
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${CELO_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // If chain is not added, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${CELO_CHAIN_ID.toString(16)}`,
                chainName: "Celo Mainnet",
                nativeCurrency: {
                  name: "CELO",
                  symbol: "CELO",
                  decimals: 18,
                },
                rpcUrls: ["https://forno.celo.org"],
                blockExplorerUrls: ["https://explorer.celo.org"],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding Celo network:", addError);
          alert("Failed to add Celo network. Please add it manually.");
        }
      } else {
        console.error("Error switching to Celo:", switchError);
      }
    }
  };

  const switchToAlfajores = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${ALFAJORES_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${ALFAJORES_CHAIN_ID.toString(16)}`,
                chainName: "Celo Alfajores Testnet",
                nativeCurrency: {
                  name: "CELO",
                  symbol: "CELO",
                  decimals: 18,
                },
                rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
                blockExplorerUrls: [
                  "https://alfajores-blockscout.celo-testnet.org",
                ],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding Alfajores network:", addError);
        }
      }
    }
  };

  const disconnectWallet = () => {
    setWallet({ connected: false });
  };

  // Listen for account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          checkConnection();
        }
      };

      const handleChainChanged = () => {
        checkConnection();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  const isOnCelo = wallet.chainId === CELO_CHAIN_ID;
  const isOnAlfajores = wallet.chainId === ALFAJORES_CHAIN_ID;
  const isOnSupportedNetwork = isOnCelo || isOnAlfajores;

  return {
    wallet,
    isConnecting,
    connectWallet,
    disconnectWallet,
    switchToCelo,
    switchToAlfajores,
    isOnCelo,
    isOnAlfajores,
    isOnSupportedNetwork,
  };
}

// Hook for interacting with the RiskAgentHedge contract
export function useRiskContract() {
  const { wallet, isOnSupportedNetwork } = useWallet();

  const enableAutoHedge = useCallback(
    async (maxSlippage: number, minValue: string, preferredStable: string) => {
      if (!wallet.connected || !isOnSupportedNetwork || !window.ethereum) {
        throw new Error("Wallet not connected or on wrong network");
      }

      try {
        // Convert minValue to wei (assuming it's in dollars, you'd need oracle price)
        const minValueWei = BigInt(parseFloat(minValue) * 1e18).toString(16);

        const transactionParameters = {
          to: RISK_AGENT_HEDGE_ADDRESS,
          from: wallet.address,
          data: `0x...`, // Encoded contract call to enableAutoHedge
        };

        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });

        return txHash;
      } catch (error) {
        console.error("Error enabling auto-hedge:", error);
        throw error;
      }
    },
    [wallet, isOnSupportedNetwork]
  );

  const disableAutoHedge = useCallback(async () => {
    if (!wallet.connected || !isOnSupportedNetwork || !window.ethereum) {
      throw new Error("Wallet not connected or on wrong network");
    }

    try {
      const transactionParameters = {
        to: RISK_AGENT_HEDGE_ADDRESS,
        from: wallet.address,
        data: `0x...`, // Encoded contract call to disableAutoHedge
      };

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      return txHash;
    } catch (error) {
      console.error("Error disabling auto-hedge:", error);
      throw error;
    }
  }, [wallet, isOnSupportedNetwork]);

  const getUserConfig = useCallback(async () => {
    if (!wallet.connected || !wallet.address) {
      return null;
    }

    try {
      // This would make a contract call to getUserConfig
      // For now, return mock data
      return {
        autoHedgeEnabled: false,
        maxSlippagePercent: 5,
        minValueUSD: "100",
        preferredStable: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
        gasLimit: "500000",
      };
    } catch (error) {
      console.error("Error getting user config:", error);
      return null;
    }
  }, [wallet]);

  return {
    enableAutoHedge,
    disableAutoHedge,
    getUserConfig,
    isReady: wallet.connected && isOnSupportedNetwork,
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
