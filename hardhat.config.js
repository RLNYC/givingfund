require('dotenv').config();
require("@nomiclabs/hardhat-waffle");


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1313161555
    },
    // npx hardhat run scripts/deployContracts.js --network auroraTest
    auroraTest: {
      url: "https://testnet.aurora.dev",
      accounts: [process.env.PRIVATEKEY]
    }
  },
  solidity: "0.6.12",
  paths: {
    artifacts: './src/artifacts',
    cache: './src/cache',
  }
};
