// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const path = require('path');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');

// Fetch mnemonic and RPC URL from .env file
const mnemonic = process.env.MNEMONIC || "adjust immune couch beyond kiwi waste icon suspect crouch style spatial write"; // Fallback mnemonic
const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:7545"; // Fallback RPC URL (Ganache local blockchain)

// Validate environment variables
if (!mnemonic || !rpcUrl) {
    console.error("Error: MNEMONIC and RPC_URL must be set in the .env file.");
    process.exit(1); // Exit if essential config is missing
}

// Configure HDWalletProvider
const provider = new HDWalletProvider({
    mnemonic: { phrase: mnemonic },
    providerOrUrl: rpcUrl,
    derivationPath: "m/44'/60'/0'/0/", // Default derivation path for Ethereum wallets
    numberOfAddresses: 10, // Number of accounts to manage
});

// Initialize Web3 instance using HDWalletProvider
const web3 = new Web3(provider);

// Initialize Express application
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(morgan('combined')); // Logging HTTP requests
app.use(cors()); // Enable cross-origin requests
app.use(helmet()); // Security headers
app.use(express.json()); // Parse incoming requests with JSON payloads
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Rate limiting to prevent abuse (e.g., DDoS attacks)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Basic route for the home page
app.get('/', (req, res) => {
    res.send('Welcome to the Item Storage DApp!');
});

// Health check route
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Input validation example
app.post('/api/some-endpoint', [
    body('fieldName').isString().notEmpty(), // Input validation using express-validator
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Process valid request
    res.status(200).json({ message: 'Input is valid!' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'An internal error occurred!' });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log("Shutting down server gracefully...");
    provider.engine.stop(); // Close the provider connection gracefully
    process.exit(0);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Export Web3 instance and provider for use in other modules
module.exports = { web3, provider };
