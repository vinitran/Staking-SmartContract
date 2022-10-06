const { ethers } = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contracts here:
  const VINI = await ethers.getContractFactory("VINIToken");
  const VIN = await ethers.getContractFactory("VINToken");
  const STAKING = await ethers.getContractFactory("Staking");

  const vini = await VINI.deploy();
  const vin = await VIN.deploy();
  const staking = await STAKING.deploy(vini.address, vin.address);

  console.log("VINI contract address:", vini.address);
  console.log("VIN contract address:", vin.address);
  console.log("Stake contract address:", staking.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
