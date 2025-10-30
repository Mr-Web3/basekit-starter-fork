#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Validate Farcaster manifest
 * This script checks if the manifest is properly configured and signed
 */

require("dotenv").config();

function validateManifest() {
  console.log("🔍 Validating Farcaster manifest...\n");

  const manifestPath = path.join(
    process.cwd(),
    "public",
    ".well-known",
    "farcaster.json",
  );

  if (!fs.existsSync(manifestPath)) {
    console.error("❌ Manifest file not found at:", manifestPath);
    console.log("💡 Run: npm run manifest:generate");
    return false;
  }

  try {
    const manifestContent = fs.readFileSync(manifestPath, "utf8");
    const manifest = JSON.parse(manifestContent);

    console.log("✅ Manifest file exists and is valid JSON");

    // Check required fields
    const requiredFields = [
      "miniapp.version",
      "miniapp.name",
      "miniapp.homeUrl",
      "miniapp.iconUrl",
    ];

    let allValid = true;

    for (const field of requiredFields) {
      const value = field.split(".").reduce((obj, key) => obj?.[key], manifest);
      if (!value) {
        console.error(`❌ Missing required field: ${field}`);
        allValid = false;
      } else {
        console.log(`✅ ${field}: ${value}`);
      }
    }

    // Check account association
    if (manifest.accountAssociation) {
      const { header, payload, signature } = manifest.accountAssociation;
      if (header && payload && signature) {
        console.log("✅ Account association is configured");
        console.log(`   Header: ${header.substring(0, 20)}...`);
        console.log(`   Payload: ${payload.substring(0, 20)}...`);
        console.log(`   Signature: ${signature.substring(0, 20)}...`);
      } else {
        console.log("⚠️  Account association is incomplete");
        console.log("💡 Run: npm run manifest:sign");
        allValid = false;
      }
    } else {
      console.log("⚠️  No account association found");
      console.log("💡 Run: npm run manifest:sign");
      allValid = false;
    }

    // Check environment variables
    console.log("\n🔧 Environment Variables:");
    const envVars = [
      "NEXT_PUBLIC_URL",
      "NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME",
      "NEXT_PUBLIC_ICON_URL",
      "NEXT_PUBLIC_ONCHAINKIT_API_KEY",
      "FARCASTER_HEADER",
      "FARCASTER_PAYLOAD",
      "FARCASTER_SIGNATURE",
      "NEXT_PUBLIC_APP_ICON",
      "NEXT_PUBLIC_APP_SUBTITLE",
      "NEXT_PUBLIC_APP_DESCRIPTION",
      "NEXT_PUBLIC_APP_SPLASH_IMAGE",
      "NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR",
      "NEXT_PUBLIC_APP_PRIMARY_CATEGORY",
      "NEXT_PUBLIC_APP_HERO_IMAGE",
      "NEXT_PUBLIC_APP_TAGLINE",
      "NEXT_PUBLIC_APP_OG_TITLE",
      "NEXT_PUBLIC_APP_OG_DESCRIPTION",
      "NEXT_PUBLIC_APP_OG_IMAGE",
      "REDIS_URL",
      "REDIS_TOKEN",
      "NEXT_PUBLIC_BASE_URL",
      "NEXT_PUBLIC_PAYMASTER_SERVICE_URL",
      "NEXT_PUBLIC_PAYMASTER_PROXY_SERVER_URL",
      "TALENT_PROTOCOL_API_KEY",
      "TALENT_WALLET",
    ];

    for (const envVar of envVars) {
      const value = process.env[envVar];
      if (value) {
        console.log(
          `✅ ${envVar}: ${envVar.includes("FARCASTER") ? value.substring(0, 20) + "..." : value}`,
        );
      } else {
        console.log(`❌ ${envVar}: Not set`);
        allValid = false;
      }
    }

    if (allValid) {
      console.log("\n🎉 Manifest validation passed!");
      console.log(
        `🌐 Your manifest is ready at: ${manifest.miniapp.homeUrl}/.well-known/farcaster.json`,
      );
    } else {
      console.log(
        "\n⚠️  Manifest validation failed. Please fix the issues above.",
      );
    }

    return allValid;
  } catch (error) {
    console.error("❌ Error reading manifest:", error.message);
    return false;
  }
}

function main() {
  const isValid = validateManifest();
  process.exit(isValid ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = { validateManifest };
