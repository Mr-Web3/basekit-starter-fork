import React from "react";
import {
  FaCoins,
  FaLock,
  FaGift,
  FaCrown,
  FaRocket,
  FaStore,
  FaChalkboardTeacher,
  FaTools,
  FaLeaf,
  FaComments,
  FaCode,
  FaMusic,
  FaCloud,
  FaBoxOpen,
} from "react-icons/fa";
import { IoBuildOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { useOpenUrl } from "@coinbase/onchainkit/minikit";

const ACCENT = "#1bf696";

const benefits = [
  {
    icon: <FaLeaf size={32} style={{ color: ACCENT }} />, // Lawn & Landscaping
    title: "Lawn & Landscaping",
    requires: "1 NFT",
    description:
      "Save on landscaping and seasonal lawn care this summer and fall in Colorado!",
    tag: "IRL",
    tagType: "success" as const,
  },
  {
    icon: <FaCode size={32} style={{ color: ACCENT }} />, // Buildathon
    title: "DBRO Live Buildathon",
    requires: "2 NFTs",
    description:
      "Access our DBRO live buildathon. Build your own Base dApp from scratch!",
    tag: "IRL",
    tagType: "success" as const,
  },
  {
    icon: <FaStore size={32} style={{ color: ACCENT }} />,
    title: "DBRO Store",
    requires: "2 NFTs",
    description:
      "Save money at checkout in our DBRO Store: tech, gear, miners, servers, and more!",
    tag: "Savings",
    tagType: "info" as const,
  },
  {
    icon: <FaComments size={32} style={{ color: ACCENT }} />,
    title: "DBRO Mentorship",
    requires: "2 NFTs",
    description:
      "Access our DBRO social app: chat, share projects, get feedback, and more.",
    tag: "Social",
    tagType: "success" as const,
  },
  {
    icon: <FaTools size={32} style={{ color: ACCENT }} />,
    title: "Web3 Dev Kits",
    requires: "4 NFTs",
    description:
      "Access premium dev scaffolds, token sites, bots, mobile apps, and smart contracts.",
    tag: "Building",
    tagType: "info" as const,
  },
  {
    icon: <FaChalkboardTeacher size={32} style={{ color: ACCENT }} />,
    title: "Web3 Workshops",
    requires: "6 NFTs",
    description:
      "Coding workshops, video tutorials, and in-depth guides for web3 & ArcBlock.",
    tag: "Learning",
    tagType: "info" as const,
  },
  {
    icon: <FaCode size={32} style={{ color: ACCENT }} />,
    title: "DBRO Development",
    requires: "15 NFTs",
    description:
      "Discounted rates on DBRO dev services, including smart contracts.",
    tag: "Live",
    tagType: "success" as const,
  },
  {
    icon: <FaMusic size={32} style={{ color: ACCENT }} />,
    title: "DOM NFT Wrapping",
    requires: "50K DBRO",
    description:
      "Wrap your DOM NFTs with 50,000 DBRO tokens & enjoy wrapping-exclusive music.",
    tag: "Live",
    tagType: "success" as const,
  },
  {
    icon: <FaCloud size={32} style={{ color: ACCENT }} />,
    title: "DBRO IPFS | IPNS Gateway",
    requires: "10 NFTs",
    description:
      "Access DBRO IPFS & IPNS services: store files, images, videos, and more.",
    tag: "Dec 2025",
    tagType: "info" as const,
  },
];

type TagType = "success" | "info";
const tagColors: Record<TagType, string> = {
  success: "bg-green-900 text-green-300 border-green-400",
  info: "bg-blue-900 text-blue-300 border-blue-400",
};

const StakingHome: React.FC = () => {
  const openUrl = useOpenUrl();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-(--app-foreground) animate-fade-in">
      {/* Hero Section */}
      <section className="w-full max-w-3xl text-center py-0 px-4 font-orbitron">
        <h1 className="text-4xl md:text-4xl font-extrabold mb-4 text-white">
          Earn More With Your <a className="text-(--app-accent)">$DBRO</a>
        </h1>
        <p className="text-lg md:text-xl text-(--app-foreground-muted) mb-8">
          Stake your <a className="text-(--app-accent)">$DBRO</a> tokens to earn high
          rewards, unlock exclusive NFT utilities, and join the next wave of
          Web3 innovation.
        </p>
        <Link href="/staking">
          <button className="bg-[#111] text-white font-bold px-6 py-2 border border-(--app-accent) rounded-xl text-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto mb-8">
            Start Staking <FaCoins className="text-(--app-accent)" />
          </button>
        </Link>
      </section>

      {/* Why Stake Section */}
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 px-4 font-orbitron">
        <div className="bg-none border border-(--app-card-border) rounded-xl p-6 flex flex-col items-center text-center shadow-lg">
          <FaCoins size={40} style={{ color: ACCENT }} className="mb-3" />
          <h2 className="font-bold text-xl mb-2">Earn Rewards</h2>
          <p className="text-(--app-foreground-muted)">
            Get up to{" "}
            <span className="font-bold" style={{ color: ACCENT }}>
              30% APY
            </span>{" "}
            by staking your <a className="text-(--app-accent)">$DBRO</a> tokens.
          </p>
        </div>
        <div className="bg-none border border-(--app-card-border) rounded-xl p-6 flex flex-col items-center text-center shadow-lg">
          <FaGift size={40} style={{ color: ACCENT }} className="mb-3" />
          <h2 className="font-bold text-xl mb-2">Unlock NFT Utilities</h2>
          <p className="text-(--app-foreground-muted)">
            Stake to mint utility NFTs and access exclusive merchandise,
            workshops, and more.
          </p>
        </div>
        <div className="bg-none border border-(--app-card-border) rounded-xl p-6 flex flex-col items-center text-center shadow-lg">
          <FaLock size={40} style={{ color: ACCENT }} className="mb-3" />
          <h2 className="font-bold text-xl mb-2">Low Fees & Secure</h2>
          <p className="text-(--app-foreground-muted)">
            Enjoy low fees on Base network and robust smart contract security.
          </p>
        </div>
      </section>

      {/* Staking/Earning Image Section */}
      <div className="w-full flex justify-center mb-12 px-4">
        <Image
          src="/staking-2.png"
          alt="Staking and Earning"
          className="rounded-xl shadow-lg object-cover border border-(--app-card-border)"
          width={500}
          height={500}
        />
      </div>

      {/* How It Works Section */}
      <section className="w-full max-w-4xl mb-16 px-4 font-orbitron">
        <h2 className="text-2xl font-bold mb-6 text-center animate-pulse text-white">
          How <a className="text-(--app-accent)">$DBRO</a> Staking Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center">
            <FaRocket size={36} style={{ color: ACCENT }} className="mb-2" />
            <span className="font-semibold mb-1">1. Connect Wallet</span>
            <span className="text-(--app-foreground-muted)">
              Connect your wallet to get started.
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaCrown size={36} style={{ color: ACCENT }} className="mb-2" />
            <span className="font-semibold mb-1">
              2. Stake <a className="text-(--app-accent)">$DBRO</a>
            </span>
            <span className="text-(--app-foreground-muted)">
              Choose how much <a className="text-(--app-accent)">$DBRO</a> to stake and
              confirm the transaction.
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaGift size={36} style={{ color: ACCENT }} className="mb-2" />
            <span className="font-semibold mb-1">3. Claim Rewards</span>
            <span className="text-(--app-foreground-muted)">
              When you reach <a className="text-(--app-accent)">100K $DBRO</a> rewards,
              claim them to mint a <a className="text-(--app-accent)">$DBRO</a> Hybrid
              NFT with wrapped rewards.
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaBoxOpen size={36} style={{ color: ACCENT }} className="mb-2" />
            <span className="font-semibold mb-1">4. Use Your NFTs</span>
            <span className="text-(--app-foreground-muted)">
              Stack NFTs for tiered utilities or unwrap to stake more{" "}
              <a className="text-(--app-accent)">$DBRO</a> (Stake up to{" "}
              <a className="text-(--app-accent)">5M</a> max).
            </span>
          </div>
        </div>
      </section>

      {/* Benefits/Utilities Section as grid of cards */}
      <section className="w-full max-w-6xl mb-20 px-4 font-orbitron">
        <h2 className="text-2xl font-bold mb-6 text-center animate-pulse text-white">
          Staking Benefits & Utilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="bg-none border border-(--app-card-border) rounded-xl p-6 flex flex-col shadow-lg relative"
            >
              <div className="flex items-center gap-3 mb-2">
                {b.icon}
                <span className="font-bold text-lg">{b.title}</span>
                <span
                  className={`ml-auto px-2 py-0.5 rounded-full text-xs text-center border min-w-[80px] whitespace-nowrap flex items-center justify-center ${tagColors[b.tagType ?? "info"]}`}
                >
                  {b.tag}
                </span>
              </div>
              <div className="text-sm text-(--app-foreground-muted) mb-1">
                Requires{" "}
                <span className="font-semibold" style={{ color: ACCENT }}>
                  {b.requires}
                </span>
              </div>
              <div className="text-(--app-foreground) text-base mb-2">
                {b.description}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => openUrl("https://www.decentralbros.dev")}
            className="bg-[#111] text-white font-bold px-6 py-2 border border-(--app-accent) rounded-xl text-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
          >
            View All Utilities <IoBuildOutline className="text-primary" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default StakingHome;
