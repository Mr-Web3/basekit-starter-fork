"use client";

import { useOpenUrl } from "@coinbase/onchainkit/minikit";
import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect } from "react";
import {
  FaRocket,
  FaLink,
  FaBook,
  FaCode,
  FaGithub,
  FaComments,
  FaTools,
  FaQuestionCircle,
  FaExternalLinkAlt,
  FaCodeBranch,
} from "react-icons/fa";
import UserProfileCard from "./components/UserProfileCard";
import BuyComponents from "./components/Buy";

export default function App() {
  const openUrl = useOpenUrl();

  // Initialize the miniapp
  useEffect(() => {
    sdk.actions.ready().catch(() => {});
  }, []);

  return (
      <div className="flex flex-col min-h-screen font-sans text-(--app-foreground) mini-app-theme from-(--app-background) to-(--app-gray)">
        <div className="w-full mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Base Mini App by Justin
                <span className="text-(--app-accent) block">Starter Template</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                A complete starter template for building Base mini apps with
                Farcaster integration. Connect your wallet and explore the
                features, then customize for your own project.
              </p>

              {/* One-click Fork Button */}
              <div className="mb-10 flex items-center justify-center">
                <button
                  onClick={() =>
                    openUrl(
                      process.env.NEXT_PUBLIC_REPO_FORK_URL ||
                        "https://github.com/Mr-Web3/basekit-starter-fork",
                    )
                  }
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-(--app-accent) text-black font-semibold shadow-lg hover:opacity-90 transition-opacity border border-[#10d67f]"
                >
                  <FaCodeBranch className="text-black" />
                  <span>Start building today — Fork this repo</span>
                </button>
              </div>

              {/* User Profile Card - Only shows when wallet is connected */}
              <div className="max-w-md mx-auto mb-8">
                <UserProfileCard />
              </div>

              {/* Buy DBRO - moved from Staking to isolate issues */}
              <div className="max-w-xl mx-auto mb-10">
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <FaRocket className="text-(--app-accent) text-lg" />
                    <h3 className="text-lg font-bold text-white">Buy $DBRO</h3>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-(--app-accent) text-sm mb-3 text-center">
                      Network Fees Paid By $DBRO Team Sponsored by Coinbase
                    </p>
                    <p className="text-gray-300 text-sm mb-3 text-center">
                      Buy $DBRO directly with fiat or swap in-app.
                    </p>
                    <BuyComponents />
                  </div>
                </div>
              </div>

              {/* Template Features */}
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl text-center font-semibold text-(--app-accent) mb-3 flex items-center justify-center gap-2">
                    <FaRocket className="text-(--app-accent)" />
                    Ready to Use
                  </h3>
                  <p className="text-gray-300">
                    Complete Next.js setup with TypeScript, Tailwind CSS, and all
                    necessary dependencies for building mini apps.
                  </p>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl text-center font-semibold text-(--app-accent) mb-3 flex items-center justify-center gap-2">
                    <FaLink className="text-(--app-accent)" />
                    Farcaster Integration
                  </h3>
                  <p className="text-gray-300">
                    Built-in Farcaster integration with notifications, user
                    profiles, and frame support using Mini Kit.
                  </p>
                </div>
              </div>

              {/* Getting Started */}
              <div className="bg-gray-900/30 border border-gray-600 rounded-lg p-8 max-w-3xl mx-auto mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Getting Started
                </h2>
                <div className="text-left space-y-4 text-gray-300">
                  <div className="flex items-start gap-3">
                    <span className="text-(--app-accent) font-bold">1.</span>
                    <p>Connect your wallet using the button in the header</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-(--app-accent) font-bold">2.</span>
                    <p>
                      Your profile information will appear above when connected
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-(--app-accent) font-bold">3.</span>
                    <p>
                      Navigate to the Morpho page to see DeFi integration examples
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-(--app-accent) font-bold">4.</span>
                    <p>Customize this content and add your own features</p>
                  </div>
                </div>
              </div>

              {/* Documentation Links */}
              <div className="bg-gray-900/30 border border-gray-600 rounded-lg p-8 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Developer Resources
                </h2>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-(--app-accent) mb-3">
                    Farcaster & Base Mini Kit Docs
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <button
                        onClick={() =>
                          openUrl(
                            "https://docs.base.org/mini-apps/quickstart/create-new-miniapp",
                          )
                        }
                        className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg transition-colors flex items-start gap-3"
                      >
                        <FaBook className="text-(--app-accent) mt-1 shrink-0" />
                        <div>
                          <div className="font-medium text-white">
                            Mini Kit Documentation
                          </div>
                          <div className="text-sm text-gray-400">
                            Complete guide to building mini apps
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => openUrl("https://docs.base.org")}
                        className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg transition-colors flex items-start gap-3"
                      >
                        <FaBook className="text-(--app-accent) mt-1 shrink-0" />
                        <div>
                          <div className="font-medium text-white">
                            Base Documentation
                          </div>
                          <div className="text-sm text-gray-400">
                            Base blockchain and developer resources
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() =>
                          openUrl("https://portal.cdp.coinbase.com/")
                        }
                        className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg transition-colors flex items-start gap-3"
                      >
                        <FaTools className="text-(--app-accent) mt-1 shrink-0" />
                        <div>
                          <div className="font-medium text-white">
                            Coinbase Developer Platform
                          </div>
                          <div className="text-sm text-gray-400">
                            Get API keys and manage your app
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() =>
                          openUrl(
                            "https://docs.base.org/base-chain/tools/network-faucets",
                          )
                        }
                        className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg transition-colors flex items-start gap-3"
                      >
                        <FaCode className="text-(--app-accent) mt-1 shrink-0" />
                        <div>
                          <div className="font-medium text-white">
                            Base Network Faucets
                          </div>
                          <div className="text-sm text-gray-400">
                            Get test Sepolia ETH for development
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() =>
                          openUrl(
                            "https://docs.base.org/base-account/improve-ux/sub-accounts",
                          )
                        }
                        className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg transition-colors flex items-start gap-3"
                      >
                        <FaLink className="text-(--app-accent) mt-1 shrink-0" />
                        <div>
                          <div className="font-medium text-white">
                            Sub Accounts
                          </div>
                          <div className="text-sm text-gray-400">
                            Improve UX with Base account abstraction
                          </div>
                        </div>
                      </button>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={() =>
                          openUrl("https://docs.base.org/onchainkit/buy/buy")
                        }
                        className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg transition-colors flex items-start gap-3"
                      >
                        <FaRocket className="text-(--app-accent) mt-1 shrink-0" />
                        <div>
                          <div className="font-medium text-white">
                            Sponsored Gas Transactions
                          </div>
                          <div className="text-sm text-gray-400">
                            Implement gasless transactions with OnchainKit
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => openUrl("https://docs.farcaster.xyz/")}
                        className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg transition-colors cursor-pointer flex items-start gap-3"
                      >
                        <FaBook className="text-(--app-accent) mt-1 shrink-0" />
                        <div>
                          <div className="font-medium text-white">
                            Farcaster Documentation
                          </div>
                          <div className="text-sm text-gray-400">
                            Build on the Farcaster protocol
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() =>
                          openUrl("https://warpcast.com/~/channel/base")
                        }
                        className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg transition-colors cursor-pointer flex items-start gap-3"
                      >
                        <FaComments className="text-(--app-accent) mt-1 shrink-0" />
                        <div>
                          <div className="font-medium text-white">
                            Base Channel
                          </div>
                          <div className="text-sm text-gray-400">
                            Join the Base community on Farcaster
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => openUrl("https://github.com/base")}
                        className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg transition-colors cursor-pointer flex items-start gap-3"
                      >
                        <FaGithub className="text-(--app-accent) mt-1 shrink-0" />
                        <div>
                          <div className="font-medium text-white">
                            Base GitHub
                          </div>
                          <div className="text-sm text-gray-400">
                            Open source tools and examples
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Resources */}
                <div className="mt-6 pt-6 border-t border-gray-600">
                  <h3 className="text-lg font-semibold text-(--app-accent) mb-3">
                    Additional Resources
                  </h3>
                  <div className="grid md:grid-cols-4 gap-3">
                    <button
                      onClick={() => openUrl("https://www.dbro.dev")}
                      className="p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <FaExternalLinkAlt className="text-(--app-accent) shrink-0" />
                      <div className="font-medium text-white text-sm">
                        DBRO Production App
                      </div>
                    </button>
                    <button
                      onClick={() => openUrl("https://github.com/base/demos")}
                      className="p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <FaCode className="text-(--app-accent) shrink-0" />
                      <div className="font-medium text-white text-sm">
                        Mini Kit Examples
                      </div>
                    </button>
                    <button
                      onClick={() =>
                        openUrl(
                          "https://docs.base.org/base-chain/tools/onchain-registry-api",
                        )
                      }
                      className="p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <FaBook className="text-(--app-accent) shrink-0" />
                      <div className="font-medium text-white text-sm">
                        API Reference
                      </div>
                    </button>
                    <button
                      onClick={() =>
                        openUrl(
                          "https://docs.base.org/mini-apps/troubleshooting/common-issues",
                        )
                      }
                      className="p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <FaQuestionCircle className="text-(--app-accent) shrink-0" />
                      <div className="font-medium text-white text-sm">
                        Troubleshooting
                      </div>
            </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
  );
}