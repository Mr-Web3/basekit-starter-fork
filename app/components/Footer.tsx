"use client";

import { FaGithub, FaGlobe } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiFarcaster } from "react-icons/si";
import Image from "next/image";
import { useOpenUrl } from "@coinbase/onchainkit/minikit";

export default function Footer() {
  const openUrl = useOpenUrl();

  const socialLinks = [
    {
      name: "Website",
      icon: FaGlobe,
      url: "https://https://justin.dbro.dev/",
      color: "text-blue-400",
      hoverColor: "hover:text-blue-300",
    },
    {
      name: "Farcaster",
      icon: SiFarcaster,
      url: "https://farcaster.xyz/decentralbros",
      color: "text-purple-400",
      hoverColor: "hover:text-purple-300",
    },
    {
      name: "GitHub",
      icon: FaGithub,
      url: "https://github.com/Mr-Web3",
      color: "text-gray-400",
      hoverColor: "hover:text-gray-300",
    },
    {
      name: "X (Twitter)",
      icon: FaXTwitter,
      url: "https://x.com/DecentralBros_",
      color: "text-[#1bf696]",
      hoverColor: "hover:text-[#1bf696]/80",
    },
  ];

  return (
    <footer className="w-full bg-linear-to-r from-(--app-background) to-(--app-gray) backdrop-blur-sm border-t border-gray-700/50">
      <div className="w-full mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 min-h-[80px] py-6">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Image
              src="/newLogo.png"
              alt="DBRO Logo"
              width={100}
              height={100}
              className="h-16 w-16 rounded-md shadow-lg"
              priority
            />
            {/* <div className="flex flex-col">
            <span className="text-lg font-bold text-white font-orbitron">DBRO</span>
            <span className="text-xs text-gray-400 font-orbitron">Decentral Bros</span>
          </div> */}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 font-orbitron hidden md:block">
              Connect with us:
            </span>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <button
                    key={social.name}
                    onClick={() => openUrl(social.url)}
                    className={`flex items-center justify-center w-10 h-10 bg-gray-800/50 ${social.color} ${social.hoverColor} rounded-lg border border-gray-600/50 hover:border-gray-500 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl group`}
                    title={social.name}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <span className="text-xs text-gray-500 font-orbitron">
              © 2024 Decentral Bros
            </span>
            <span className="text-xs text-gray-600 font-orbitron">
              Built on Base
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
