// Script to deploy MedicineTracker to a test network (Local Hardhat or Sepolia)
const hre = require("hardhat");

async function main() {
  console.log("Deploying MedicineTracker smart contract to network:", hre.network.name);

  const MedicineTracker = await hre.ethers.getContractFactory("MedicineTracker");
  const tracker = await MedicineTracker.deploy();
  await tracker.waitForDeployment();

  const contractAddress = await tracker.getAddress();
  console.log(" MedicineTracker deployed successfully at address:", contractAddress);
  console.log("Save this address in your frontend configuration (src/services/blockchain.js)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
