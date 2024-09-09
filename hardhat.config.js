require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const PRIVATE_KEY = '2361a52935598dd82fcb3bd0f33fc2e5d42ff29b67d7d72bca956ea3d551df36';
const API_URL = "https://polygonzkevm-cardona.g.alchemy.com/v2/B9s0Pcddze9u9AwmQ7pUpmhLQFl_dgLj"

module.exports = {
    solidity: "0.8.18",
    defaultNetwork: "sepolia",
    networks: {
        hardhat: {
            chainId: 1337,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 1337,
        },
        sepolia: {
            // url: "https://eth-sepolia.g.alchemy.com/v2/B9s0Pcddze9u9AwmQ7pUpmhLQFl_dgLj",
            url: "https://eth-sepolia.g.alchemy.com/v2/B9s0Pcddze9u9AwmQ7pUpmhLQFl_dgLj",
            accounts: [`0x${PRIVATE_KEY}`],
            //accounts: []
        }
    }
};