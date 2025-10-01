const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  console.log("\n🚀 Deploying RiskAgentHedge Contract...\n");

  const [deployer] = await hre.ethers.getSigners();
  
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 Deployer:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "CELO");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // AI Agent address (your backend wallet)
  const AI_AGENT_ADDRESS = process.env.AGENT_WALLET_ADDRESS || deployer.address;
  console.log("🤖 AI Agent Address:", AI_AGENT_ADDRESS);

  if (Number(balance) < Number(hre.ethers.parseEther("0.1"))) {
    console.error("\n❌ Insufficient balance!");
    console.error("   You need at least 0.1 CELO to deploy");
    console.error("   Get testnet CELO from: https://faucet.celo.org\n");
    process.exit(1);
  }

  console.log("\n📦 Deploying contract...");
  
  // Deploy
  const RiskAgentHedge = await hre.ethers.getContractFactory("RiskAgentHedge");
  const contract = await RiskAgentHedge.deploy(AI_AGENT_ADDRESS);

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("\n✅ Contract deployed successfully!");
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📍 Contract Address:", contractAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("📋 Add to your .env file:");
  console.log(`HEDGE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`AGENT_WALLET_ADDRESS=${AI_AGENT_ADDRESS}\n`);

  // Get network name
  const network = await hre.ethers.provider.getNetwork();
  const explorer = network.chainId === 44787n 
    ? "https://alfajores.celoscan.io" 
    : "https://celoscan.io";

  console.log("🔗 View on Explorer:");
  console.log(`${explorer}/address/${contractAddress}\n`);

  console.log("⏳ Waiting for confirmations...");
  await contract.deploymentTransaction()?.wait(3);

  console.log("\n🎉 Deployment Complete!\n");
  console.log("Next steps:");
  console.log("1. Copy contract address to .env");
  console.log("2. Test with: npx hardhat run scripts/test-contract.ts --network alfajores");
  console.log("3. Run integrated monitor: npm run dev:integrated\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });