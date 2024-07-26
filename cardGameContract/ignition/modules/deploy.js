// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  const TradingCardGame = await hre.ethers.getContractFactory(
    "TradingCardGame"
  );

  const cardContractAddress = "0xB90A3E75e6128ab85cbae3985B348dbab7144a37"; // Replace with your actual contract address
  const computerAddress = "0xb5B908F8214f122f34ACe62528D8d0AF8BD96828"; // Replace with the computer's address (can be the deployer's address)

  const tradingCardGame = await TradingCardGame.deploy(
    cardContractAddress,
    computerAddress
  );

  console.log("TradingCardGame deployed to:", tradingCardGame.target); // Log the contract address directly
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
