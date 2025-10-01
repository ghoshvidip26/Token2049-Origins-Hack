import { createPublicClient, http, formatEther, formatUnits } from "viem";
import { celo } from "viem/chains";
import dotenv from "dotenv";

dotenv.config();

// ✅ Create a public client
const client = createPublicClient({
  chain: celo,
  transport: http(process.env.CELO_RPC || "https://forno.celo.org"),
});

async function main() {
  console.log("🚀 Testing Celo Integration...\n");

  // 1️⃣ Get latest block
  const blockNumber = await client.getBlockNumber();
  console.log("📦 Latest Block:", blockNumber.toString());

  // 2️⃣ Check CELO balance of a sample address
  const address = "0x471EcE3750Da237f93B8E339c536989b8978a438"; // CELO token contract
  const balance = await client.getBalance({ address });
  console.log("💰 Balance:", formatEther(balance), "CELO");

  // 3️⃣ Read reserves from Ubeswap CELO/cUSD pool
  const poolAddress = "0x1E593F1FE7B61C53874B54EC0C59FD0D5EB8621E";
  const PAIR_ABI = [
    {
      inputs: [],
      name: "getReserves",
      outputs: [
        { name: "reserve0", type: "uint112" },
        { name: "reserve1", type: "uint112" },
        { name: "blockTimestampLast", type: "uint32" },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const [reserve0, reserve1] = await client.readContract({
    address: poolAddress,
    abi: PAIR_ABI,
    functionName: "getReserves",
  });

  console.log(
    "💧 Pool Reserves:",
    "\n- Reserve0 (CELO):",
    formatUnits(reserve0, 18),
    "\n- Reserve1 (cUSD):",
    formatUnits(reserve1, 18)
  );
}

main().catch(console.error);
