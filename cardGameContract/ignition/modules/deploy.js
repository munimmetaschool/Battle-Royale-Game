// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  const TradingCardGame = await hre.ethers.getContractFactory(
    "TradingCardGame"
  );

  const cardContractAddress = "0x238d43c23CFc5d5dE4d691fFd881492E14Bcfa4A"; // Replace with your actual contract address
  const computerAddress = "0x0f82b919Fa748fbCFA82cdd970550e09cc9aaBe2"; // Replace with the computer's address (can be the deployer's address)

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
