require('dotenv').config();  // Load environment variables from .env file
const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

// Fetch mnemonic and RPC URL from .env file, with fallback defaults if not set
const mnemonic = process.env.MNEMONIC || "adjust immune couch beyond kiwi waste icon suspect crouch style spatial write";  // Fallback mnemonic for development
const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:7545";  // Fallback RPC URL for local Ganache

if (!mnemonic || !rpcUrl) {
    console.error("Error: MNEMONIC and RPC_URL must be set in the .env file.");
    process.exit(1);  // Exit if essential config is missing
}

// Configure HDWalletProvider with the mnemonic and RPC URL
const provider = new HDWalletProvider({
    mnemonic: {
        phrase: mnemonic,  // HD wallet mnemonic phrase
    },
    providerOrUrl: rpcUrl,   // The RPC URL (e.g., Ganache local node)
    derivationPath: "m/44'/60'/0'/0/",  // Standard HD path for Ethereum wallets
    numberOfAddresses: 10,  // Pre-load 10 addresses (adjust as needed)
});

// Initialize Web3 instance
const web3 = new Web3(provider);

// Export Truffle configuration
module.exports = {
    contracts_build_directory: path.join(__dirname, "public/contracts"),  // Where Truffle will place compiled contracts
    networks: {
        development: {
            host: "127.0.0.1",  // Localhost for Ganache
            port: 7545,         // Ganache's default port
            network_id: "*",    // Match any network id (useful for development)
            gas: 6721975,       // Gas limit for transactions
            gasPrice: 20000000000,  // Gas price in wei (20 Gwei)
        },
        // Other networks can be added here for different environments
    },
    compilers: {
        solc: {
            version: "0.8.0",  // Solidity compiler version (can be changed as needed)
            settings: {
                optimizer: {
                    enabled: true,  // Enable optimizer for more efficient contracts
                    runs: 200,      // Optimization level (200 is a good balance)
                },
            },
        },
    },
    afterDeploy: async () => {
        // Clean up provider after deployment to prevent memory leaks
        provider.engine.stop();
    },
};
