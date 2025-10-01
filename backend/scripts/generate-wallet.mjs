import { ethers } from "hardhat";

async function main() {
  console.log("\n🔑 Generating New Wallet...\n");
  
  const wallet = ethers.Wallet.createRandom();
  
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 Address:", wallet.address);
  console.log("🔐 Private Key:", wallet.privateKey);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  console.log("⚠️  IMPORTANT: Save these securely!");
  console.log("\nAdd to your .env file:");
  console.log(`AGENT_PRIVATE_KEY=${wallet.privateKey}`);
  console.log(`AGENT_WALLET_ADDRESS=${wallet.address}\n`);
  
  console.log("Next steps:");
  console.log("1. Add private key to .env");
  console.log("2. Get testnet CELO from: https://faucet.celo.org");
  console.log(`3. Send to: ${wallet.address}\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });