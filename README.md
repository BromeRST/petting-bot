# Aavegotchi Petting Bot

A script that automatically interacts with your Aavegotchi NFTs every 12 hours to increase their kinship through the "petting" mechanism. This increases your Gotchis' kinship score, which provides in-game benefits.

## What This Bot Does

- Calls the `interact()` function on the Aavegotchi Diamond contract
- Automatically runs immediately when started and then every 12 hours (at 00:00 and 12:00)
- Handles transaction failures with automatic retries (up to 5 times)
- Optimizes gas costs by adding 10% to current gas prices to ensure transaction processing

## Requirements

- Node.js (v16 or newer)
- npm or yarn
- A wallet with a small amount of MATIC for gas fees
- Aavegotchi NFTs that you own or are authorized to interact with

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:

   ```
   PRIVATE_KEY=your_private_key_here
   RPC_URL=https://polygon-rpc.com
   ```

   Replace `your_private_key_here` with your Ethereum/Polygon private key.

4. Edit the `TOKEN_IDS` array in `src/index.ts` to include your Aavegotchi token IDs

5. Build the project:
   ```bash
   npm run build
   ```

## Security Recommendation: Lending Your Gotchis to Bot Wallet

For enhanced security, we recommend using the Aavegotchi lending system to lend your Gotchis from your main wallet to the bot wallet:

1. Visit the official [Aavegotchi website](https://www.aavegotchi.com/)
2. Connect your main wallet containing your valuable Aavegotchis
3. Go to the lending activity in user profile:
   - Click on Whitelists to set a new whitelist
   - Add your bot wallet address to the whitelist
   - Go back to main wallet inventory and lend each Gotchi to the bot wallet whitelist
   - Go to the aavegotchi lending page from tools and borrow them using your bot wallet
4. This way, your valuable Gotchis stay safely linked to your main wallet, while the bot wallet only needs minimal MATIC for gas

## Usage

### Start the bot

```bash
npm start
```

The bot will:

- Immediately interact with your Aavegotchis
- Schedule automatic interactions every 12 hours (at 00:00 and 12:00)
- Automatically retry on failures (up to 5 times)

### Run in development mode

```bash
npm run dev
```

## Configuration

You can modify the following properties in `src/index.ts`:

- `TOKEN_IDS`: The array of Aavegotchi token IDs to interact with
- `MAX_RETRIES`: Maximum number of retry attempts (default: 5)
- `RETRY_DELAY_MS`: Delay between retries in milliseconds (default: 30000 ms / 30 seconds)

## Running in Production

For continuous operation, consider using a process manager like PM2:

```bash
npm install -g pm2
pm2 start npm --name "aavegotchi-petting" -- start
```

## ⚠️ Security Warnings

### Private Key Security

- **NEVER commit your .env file to Git** (the .gitignore is set up to prevent this)
- **Use a dedicated wallet** with minimal funds (just enough MATIC for gas)
- This script is designed to run on your local machine in a secure environment
- Private keys stored in plaintext files are inherently vulnerable - use this approach only for accounts with minimal value
- For higher security, consider using a hardware wallet integration instead

### Smart Contract Interaction

This bot interacts with the following contract on Polygon:

- Address: `0x86935F11C86623deC8a25696E1C19a8659CbF95d` (Aavegotchi Diamond)
- Function: `interact(uint256[] calldata _tokenIds)`

Always verify you are authorized to interact with the provided token IDs through:

- Direct ownership
- Being an approved operator
- Having pet operator permissions
