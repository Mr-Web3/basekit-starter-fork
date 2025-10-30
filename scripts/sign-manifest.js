#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

/**
 * Interactive script to help sign the Farcaster manifest
 * This script guides you through the process of getting your account association
 */

require("dotenv").config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log("🔐 Farcaster Manifest Signing Helper");
  console.log("=====================================\n");

  const domain = process.env.NEXT_PUBLIC_URL;
  if (!domain) {
    console.error("❌ NEXT_PUBLIC_URL environment variable is required");
    process.exit(1);
  }

  console.log(`📋 Your domain: ${domain}`);
  console.log("\n📝 To sign your manifest with your Farcaster account:");
  console.log("   1. Visit: https://farcaster.xyz/~/developers/new");
  console.log("   2. Enter your domain exactly as shown above");
  console.log(
    "   3. Follow the instructions to generate your account association",
  );
  console.log(
    "\n🔑 After you get your account association, enter the values below:\n",
  );

  try {
    const header = await question("Enter FARCASTER_HEADER: ");
    const payload = await question("Enter FARCASTER_PAYLOAD: ");
    const signature = await question("Enter FARCASTER_SIGNATURE: ");

    if (!header || !payload || !signature) {
      console.log("\n❌ All fields are required. Exiting...");
      rl.close();
      return;
    }

    // Update .env file
    const envPath = path.join(process.cwd(), ".env.local");
    let envContent = "";

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8");
    }

    // Remove existing Farcaster variables
    envContent = envContent.replace(/^FARCASTER_HEADER=.*$/m, "");
    envContent = envContent.replace(/^FARCASTER_PAYLOAD=.*$/m, "");
    envContent = envContent.replace(/^FARCASTER_SIGNATURE=.*$/m, "");

    // Add new variables
    envContent += `\n# Farcaster Account Association\n`;
    envContent += `FARCASTER_HEADER=${header}\n`;
    envContent += `FARCASTER_PAYLOAD=${payload}\n`;
    envContent += `FARCASTER_SIGNATURE=${signature}\n`;

    fs.writeFileSync(envPath, envContent);

    console.log("\n✅ Account association saved to .env.local");
    console.log("🔄 Regenerating manifest with new signature...");

    // Regenerate manifest
    const { generateManifest } = require("./generate-manifest.js");
    const manifest = generateManifest();

    const wellKnownDir = path.join(process.cwd(), "public", ".well-known");
    const manifestPath = path.join(wellKnownDir, "farcaster.json");
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log("✅ Manifest updated with account association!");
    console.log(
      `🌐 Your signed manifest is ready at: ${domain}/.well-known/farcaster.json`,
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main();
}
