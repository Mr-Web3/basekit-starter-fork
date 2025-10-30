#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Generate Farcaster manifest JSON file
 * This script creates a static manifest file that can be served at /.well-known/farcaster.json
 */

// Load environment variables
require("dotenv").config();

function withValidProperties(properties) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return !!value;
    }),
  );
}

function generateManifest() {
  const URL = process.env.NEXT_PUBLIC_URL;

  if (!URL) {
    console.error("❌ NEXT_PUBLIC_URL environment variable is required");
    process.exit(1);
  }

  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    miniapp: withValidProperties({
      version: "1",
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "DBRO Mini Temp",
      subtitle:
        process.env.NEXT_PUBLIC_APP_SUBTITLE ||
        "Stake your Mini Temp earn BIG!",
      description:
        process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
        "Stake a max of 5M DBRO tokens, earn passively, high APY and access to exclusive utilities",
      screenshotUrls: [
        `${URL}/screenshot.png`,
        `${URL}/staking-2.png`,
        `${URL}/staking-3.png`,
      ],
      iconUrl:
        process.env.NEXT_PUBLIC_APP_ICON ||
        process.env.NEXT_PUBLIC_ICON_URL ||
        `${URL}/newIcon.jpg`,
      splashImageUrl:
        process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE || `${URL}/newSplash.png`,
      splashBackgroundColor:
        process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#000000",
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory:
        process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY || "utility",
      tags: ["staking", "dbro", "rewards", "apy", "utilities"],
      heroImageUrl:
        process.env.NEXT_PUBLIC_APP_HERO_IMAGE || `${URL}/newHero.png`,
      tagline: process.env.NEXT_PUBLIC_APP_TAGLINE || "Mini Temp for the Bros",
      ogTitle:
        process.env.NEXT_PUBLIC_APP_OG_TITLE || "DBRO Mini Temp Passive Income",
      ogDescription:
        process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION ||
        "Passive income starts with staking DBRO, Turn idle DBRO into daily rewards",
      ogImageUrl: process.env.NEXT_PUBLIC_APP_OG_IMAGE || `${URL}/newHero.png`,
      noindex: "true",
    }),
    baseBuilder: {
      allowedAddresses: ["0x1d0b2cfebabb59b3af59ff77def5397ce4be9e77"],
    },
  };

  return manifest;
}

function main() {
  console.log("🚀 Generating Farcaster manifest...");

  try {
    const manifest = generateManifest();

    // Create .well-known directory if it doesn't exist
    const wellKnownDir = path.join(process.cwd(), "public", ".well-known");
    if (!fs.existsSync(wellKnownDir)) {
      fs.mkdirSync(wellKnownDir, { recursive: true });
      console.log("📁 Created .well-known directory");
    }

    // Write manifest file
    const manifestPath = path.join(wellKnownDir, "farcaster.json");
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log("✅ Manifest generated successfully!");
    console.log(`📄 Manifest saved to: ${manifestPath}`);
    console.log(
      `🌐 Will be served at: ${process.env.NEXT_PUBLIC_URL}/.well-known/farcaster.json`,
    );

    // Validate required fields
    const missingFields = [];
    if (!manifest.accountAssociation.header)
      missingFields.push("FARCASTER_HEADER");
    if (!manifest.accountAssociation.payload)
      missingFields.push("FARCASTER_PAYLOAD");
    if (!manifest.accountAssociation.signature)
      missingFields.push("FARCASTER_SIGNATURE");

    if (missingFields.length > 0) {
      console.log("\n⚠️  Warning: Missing account association fields:");
      missingFields.forEach((field) => console.log(`   - ${field}`));
      console.log("\n📝 To sign your manifest:");
      console.log("   1. Visit: https://farcaster.xyz/~/developers/new");
      console.log("   2. Enter your domain:", process.env.NEXT_PUBLIC_URL);
      console.log(
        "   3. Copy the generated accountAssociation values to your .env file",
      );
      console.log("   4. Run: npm run manifest:sign");
    } else {
      console.log("\n✅ Account association is configured!");
    }
  } catch (error) {
    console.error("❌ Error generating manifest:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateManifest };
