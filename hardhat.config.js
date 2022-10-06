/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

module.exports = {
  solidity: "0.8.1",

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },

  networks: {
    dev: {
      url: "http://localhost:7545",
      gasPrice: 20,
      accounts: {
        mnemonic: process.env.MNEMONIC,
        count: 10
      },
      saveDeployments: true
    },
    bsctest: {
      url: "https://data-seed-prebsc-2-s2.binance.org:8545",
      accounts: [process.env.PRIV_KEY],
      gasPrice: 10000000000,
      blockGasLimit: 1000000
    },
    bscmain: {
      url: "https://bsc-dataseed1.binance.org",
      accounts: [process.env.PRIV_KEY],
      gasPrice: 5100000000,
      blockGasLimit: 1000000
    },
    polygontest: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIV_KEY],
      gasPrice: 10000000000,
      blockGasLimit: 10000000
    },
    polygonmain: {
      url: "https://rpc-mainnet.maticvigil.com ",
      accounts: [process.env.PRIV_KEY],
      gasPrice: 10000000000,
      blockGasLimit: 10000000
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.API_KEY
  }
// npx hardhat verify --contract "contracts/VINIToken.sol:VINIToken" --network bsctest 0x7eD254Ccd31071a1c24Bdd947C3e5253c58AdDB3 

};
