require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-viem");
require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

// Testnet contract addresses
const TESTNET_UBESWAP_ROUTER = "0x7D28570135A2B1930F331c507F65039D4937f66c";
const TESTNET_CELO = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9";
const TESTNET_cUSD = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Celo Mainnet
    celo: {
      url: "https://forno.celo.org",
      accounts: process.env.AGENT_PRIVATE_KEY ? [process.env.AGENT_PRIVATE_KEY] : [],
      chainId: 42220,
    },
    // Celo Sepolia Testnet
    sepolia: {
      url: "https://sepolia.celo.net",
      accounts: process.env.AGENT_PRIVATE_KEY ? [process.env.AGENT_PRIVATE_KEY] : [],
      chainId: 44787,
      verify: {
        etherscan: {
          apiUrl: 'https://api-sepolia.celoscan.io'
        }
      }
    },
  },
  etherscan: {
    apiKey: {
      celo: process.env.CELOSCAN_API_KEY || "api-key",
      alfajores: process.env.CELOSCAN_API_KEY || "api-key",
    },
    customChains: [
      {
        network: "alfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io",
        },
      },
    ],
  },
};