# DBRO Hybrid Staking Ecosystem

A Mini App built on Base that enables users to stake $DBRO tokens, earn rewards, and unlock exclusive utilities through wrapped NFTs. Built using OnchainKit, Wagmi, and the Farcaster SDK.

## Features

- **Token Staking**: Stake $DBRO tokens and earn annual rewards
- **Reward System**: Claim and wrap rewards as NFTs when you reach 100K $DBRO
- **NFT Utilities**: Unwrap NFTs to access exclusive perks and utilities
- **Sponsored Transactions**: Gas fees sponsored by Decentral Bros through Coinbase Developer Platform
- **Farcaster Integration**: Receive transaction notifications through Farcaster
- **Portfolio Tracking**: Real-time staking stats, balances, and reward tracking

## Prerequisites

Before getting started, make sure you have:

* Base app account
* A [Farcaster](https://farcaster.xyz/) account
* [Vercel](https://vercel.com/) account for hosting the application
* [Coinbase Developer Platform](https://portal.cdp.coinbase.com/) API Key
* CDP Paymaster configured for sponsored gas transactions

## Getting Started

### 1. Clone this repository 

```bash
git clone https://github.com/Mr-Web3/basekit-starter-fork
cd basekit-starter-improved
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory and add your environment variables:

```bash
# App Configuration
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_ONCHAINKIT_API_KEY=<your-cdp-api-key>
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=DBRO Mini App
NEXT_PUBLIC_ONCHAINKIT_PROJECT_ID=<your-project-id>

# Icon For Base Wallet
NEXT_PUBLIC_ICON_URL=http://localhost:3000/newLogoTwo.png

# Template Fork Link (optional)
NEXT_PUBLIC_REPO_FORK_URL=

# Paymaster Sponsored Gas Transactions Config
NEXT_PUBLIC_DBRO_TOKEN_ADDRESS=0x6a4e0F83D7882BcACFF89aaF6f60D24E13191E9F
NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT=<your-paymaster-endpoint>

# RPC Configuration (optional)
NEXT_PUBLIC_BASE_URL=<base-rpc-url>
```

**Note**: Copy `env.template` to `.env.local` and fill in your values.

### 4. Run locally:

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app.

## Project Structure

- `/app` - Next.js app directory with pages and API routes
- `/app/staking` - Main staking interface page
- `/app/api` - API routes for Farcaster notifications and webhooks
- `/app/components` - Reusable React components
- `/contracts` - Deployed contract addresses and ABIs
- `/lib` - Utility functions and hooks
- `/scripts` - Manifest generation and validation scripts

## Customization

### Update Manifest Configuration

The `minikit.config.ts` file configures your manifest located at `app/.well-known/farcaster.json`.

To personalize your app, update the `miniapp` object with your app details:
- `name`: Your app name
- `subtitle`: Short description
- `description`: Full description
- `iconUrl`: Path to your app icon
- `splashImageUrl`: Splash screen image
- `heroImageUrl`: Hero banner image
- `tags`: Array of relevant tags

**Note**: The `accountAssociation` object should already be configured. Only update it if you're changing domains or need to re-sign.

## Deployment

### 1. Deploy to Vercel

```bash
vercel --prod
```

You should have a URL deployed to a domain similar to: `https://your-vercel-project-name.vercel.app/`

### 2. Update Environment Variables

Update your `.env.local` file with production URLs:

```bash
NEXT_PUBLIC_URL=https://your-vercel-project-name.vercel.app/
NEXT_PUBLIC_ICON_URL=https://your-vercel-project-name.vercel.app/newLogoTwo.png
```

### Upload environment variables to Vercel

Add all environment variables to your production environment:

```bash
vercel env add NEXT_PUBLIC_URL production
vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY production
vercel env add NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME production
vercel env add NEXT_PUBLIC_ONCHAINKIT_PROJECT_ID production
vercel env add NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT production
# ... add all other required variables
```

Or set them directly in the Vercel dashboard under Settings → Environment Variables.

## Contract Addresses

The app uses the following contracts on Base (Chain ID: 8453):

- **DBROWrappedStaking**: Main staking contract
- **DecentralBros (DBRO)**: ERC-20 token contract
- **RYFT**: NFT contract for wrapped rewards

Contract addresses are configured in `/contracts/deployedContracts.ts`.

## Sponsored Gas Transactions

Gas fees are sponsored through the Coinbase Developer Platform paymaster service. This works with:

- ✅ Coinbase Smart Wallet
- ✅ Coinbase Wallet (smart account)
- ✅ Other wallets with account abstraction support

**Note**: Traditional EOA wallets (MetaMask, Phantom) will not have sponsored transactions unless they're using account abstraction features.

## Account Association

The manifest is already configured with account association. If you need to re-sign or change the domain:

### 1. Sign Your Manifest

1. Navigate to [Farcaster Manifest tool](https://farcaster.xyz/~/developers/mini-apps/manifest)
2. Paste your production domain (ex: your-vercel-project-name.vercel.app)
3. Click the `Generate account association` button
4. Follow the on-screen instructions to sign with your Farcaster wallet
5. Copy the `accountAssociation` object

### 2. Update Configuration

Update your `minikit.config.ts` file with the new `accountAssociation` object:

```ts
export const minikitConfig = {
    accountAssociation: {
        "header": "your-header-here",
        "payload": "your-payload-here",
        "signature": "your-signature-here"
    },
    // ... rest of config
}
```

### 3. Deploy Updates

```bash
vercel --prod
```

## Testing and Publishing

### 1. Preview Your App

Go to [base.dev/preview](https://base.dev/preview) to validate your app:

1. Add your app URL to view the embeds and click the launch button to verify the app launches as expected
2. Use the "Account association" tab to verify the association credentials were created correctly
3. Use the "Metadata" tab to see the metadata added from the manifest and identify any missing fields

### 2. Test Staking Features

1. Connect your wallet (preferably Coinbase Smart Wallet for sponsored gas)
2. Ensure you have $DBRO tokens in your wallet
3. Test staking, unstaking, and claiming rewards
4. Verify Farcaster notifications are received after transactions

### 3. Publish to Base App

To publish your app, create a post in the Base app with your app's URL.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run manifest:generate` - Generate Farcaster manifest
- `npm run manifest:sign` - Sign manifest for account association
- `npm run manifest:validate` - Validate manifest configuration

## Learn More

- [Base Mini Apps Documentation](https://docs.base.org/docs/mini-apps/quickstart/create-new-miniapp/)
- [OnchainKit Documentation](https://onchainkit.xyz/)
- [Farcaster Mini Apps](https://miniapps.farcaster.xyz/)
- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)

## License

Private project - All rights reserved
