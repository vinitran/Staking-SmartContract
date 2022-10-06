const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Stack Token", function () {
  let vini, vin, staking, deployer, addr1, addr2, addr3, addr4
  beforeEach(async function () {
    [deployer, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const VINI = await ethers.getContractFactory("VINIToken");
    const VIN = await ethers.getContractFactory("VINToken");
    const STAKING = await ethers.getContractFactory("Staking");

    vini = await VINI.deploy();
    vin = await VIN.deploy();
    staking = await STAKING.deploy(vini.address, vin.address);
  });

  describe("Deployment", function () {

    it("Should track name and symbol of token", async function () {

      const token1Name = "Vini"
      const token1Symbol = "VINI"
      expect(await vini.name()).to.equal(token1Name);
      expect(await vini.symbol()).to.equal(token1Symbol);

      const token2Name = "Vin"
      const token2Symbol = "VIN"
      expect(await vin.name()).to.equal(token2Name);
      expect(await vin.symbol()).to.equal(token2Symbol);
    });

    it("Check send and receive token", async function () {
      const initialVINIBalAddr1 = await vini.balanceOf(addr1.address);
      await vini.transfer(addr1.address, 1000);
      const finalVINIBalAddr1 = await vini.balanceOf(addr1.address);
      expect(+finalVINIBalAddr1).to.equal(+initialVINIBalAddr1 + 1000)

      const initialVINBalAddr1 = await vin.balanceOf(addr1.address);
      await vin.transfer(addr1.address, 1000);
      const finalVINBalAddr1 = await vin.balanceOf(addr1.address);
      expect(+finalVINBalAddr1).to.equal(+initialVINBalAddr1 + 1000)
    });

    it("Check Stake", async function () {
      await vin.connect(deployer).approve(staking.address, 1000000);
      await staking.connect(deployer).addPoolRewardStake(100000);
      await vini.transfer(addr1.address, 10000);
      await vini.connect(addr1).approve(staking.address, 100000);
      const initialVINIBalAddr1 = await vini.balanceOf(addr1.address);
      const initialVINIBalStaking = await vini.balanceOf(staking.address);
      await staking.connect(addr1).stakeToken(500);
      await ethers.provider.send("evm_increaseTime", [30*24*60*60]);
      await staking.connect(addr1).stakeToken(500);
      await ethers.provider.send("evm_increaseTime", [30*24*60*60]);
      await staking.connect(addr1).stakeToken(500);
      const finalVINIBalAddr1 = await vini.balanceOf(addr1.address);
      const finalVINIBalStaking = await vini.balanceOf(staking.address);
      expect(+initialVINIBalAddr1).to.equal(+finalVINIBalAddr1 + 1500);
      expect(+initialVINIBalStaking).to.equal(+finalVINIBalStaking - 1500);
      await ethers.provider.send("evm_increaseTime", [306*24*60*60]);
      await staking.connect(addr1).claimToken();
      console.log(await vin.balanceOf(addr1.address));
      expect(await vini.balanceOf(addr1.address)).to.equal(+initialVINIBalAddr1 - 1000);
      await ethers.provider.send("evm_increaseTime", [30*24*60*60]);
      await staking.connect(addr1).claimToken();
      console.log(await vin.balanceOf(addr1.address));
      expect(await vini.balanceOf(addr1.address)).to.equal(+initialVINIBalAddr1 - 500);
      await ethers.provider.send("evm_increaseTime", [30*24*60*60]);
      await staking.connect(addr1).claimToken();
      console.log(await vin.balanceOf(addr1.address));
      expect(await vini.balanceOf(addr1.address)).to.equal(+initialVINIBalAddr1);
    });
  });
});
