import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

// Contract details
const CONTRACT_ADDRESS = "0x86935F11C86623deC8a25696E1C19a8659CbF95d";

// Change this to the token IDs you want to interact with
const TOKEN_IDS = [
  15515, 21615, 11662, 16102, 23022, 23482, 10579, 18793, 24007, 4160,
];

// ABI for the interact function (partial ABI)
const ABI = [
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_tokenIds",
        type: "uint256[]",
      },
    ],
    name: "interact",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Configuration
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 30000; // 30 seconds
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL || "https://polygon-rpc.com"
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

/**
 * Interacts with Aavegotchis
 */
async function interactWithGotchis(retries = 0): Promise<void> {
  try {
    console.log(
      `[${new Date().toISOString()}] Attempting to interact with Aavegotchis...`
    );

    // Get current gas price and add 10% to ensure transaction goes through
    const gasPrice = await provider.getFeeData();
    const maxFeePerGas = gasPrice.maxFeePerGas
      ? (gasPrice.maxFeePerGas * BigInt(110)) / BigInt(100)
      : undefined;

    // Call the interact function
    const tx = await contract.interact(TOKEN_IDS, {
      maxFeePerGas,
      maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas,
    });

    console.log(
      `[${new Date().toISOString()}] Transaction sent! Hash: ${tx.hash}`
    );

    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log(
      `[${new Date().toISOString()}] Transaction confirmed! Block number: ${
        receipt?.blockNumber
      }`
    );

    console.log(
      `[${new Date().toISOString()}] Successfully interacted with ${
        TOKEN_IDS.length
      } Aavegotchis`
    );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error interacting with Aavegotchis:`,
      error
    );

    // Implement retry logic
    if (retries < MAX_RETRIES) {
      const nextRetry = retries + 1;
      console.log(
        `[${new Date().toISOString()}] Retrying in ${
          RETRY_DELAY_MS / 1000
        } seconds... (Attempt ${nextRetry}/${MAX_RETRIES})`
      );

      setTimeout(() => {
        interactWithGotchis(nextRetry).catch(console.error);
      }, RETRY_DELAY_MS);
    } else {
      console.error(
        `[${new Date().toISOString()}] Maximum retry attempts reached. Please check your configuration.`
      );
    }
  }
}

// Function to execute the interaction immediately
async function runInteraction(): Promise<void> {
  try {
    console.log(
      `[${new Date().toISOString()}] Starting Aavegotchi interaction...`
    );
    await interactWithGotchis();

    // Schedule the next run in 12 hours
    const nextRunDate = new Date(Date.now() + TWELVE_HOURS_MS);
    console.log(
      `[${new Date().toISOString()}] Next interaction scheduled for ${nextRunDate.toISOString()}`
    );

    setTimeout(() => {
      runInteraction().catch(console.error);
    }, TWELVE_HOURS_MS);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error in main execution:`,
      error
    );

    // If there was an error, try again in 5 minutes
    console.log(
      `[${new Date().toISOString()}] Will retry in 5 minutes due to error`
    );

    setTimeout(() => {
      runInteraction().catch(console.error);
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
  }
}

// Main execution
console.log(`[${new Date().toISOString()}] Aavegotchi Petting Bot started`);
console.log(
  `[${new Date().toISOString()}] Set to interact with ${
    TOKEN_IDS.length
  } Aavegotchis every 12 hours`
);

// Run on startup
runInteraction();

// Keep the process running
process.on("SIGINT", () => {
  console.log(`[${new Date().toISOString()}] Bot stopped by user`);
  process.exit(0);
});
