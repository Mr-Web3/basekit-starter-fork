"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { FaHome, FaChartBar, FaCoins } from "react-icons/fa";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: FaHome },
    { href: "/staking", label: "Staking", icon: FaCoins },
    { href: "/morpho", label: "Morpho", icon: FaChartBar },
  ];

  // Debug logging
  console.log("Header rendered, pathname:", pathname);
  console.log("Nav items count:", navItems.length);

  return (
    <div className="w-full mx-auto px-4">
      <header className="flex items-center justify-between gap-6 bg-none min-h-[56px] md:min-h-[64px]">
        {/* Logo - Fixed width on desktop for centering */}
        <div className="flex items-center gap-2 md:w-20">
          <Image
            src="/newLogoTwo.png"
            alt="Logo"
            width={100}
            height={100}
            className="h-12 w-12 rounded-md shadow-md"
            priority
          />
        </div>

        {/* Desktop Navigation - Perfectly centered */}
        <nav className="hidden md:flex items-center justify-center flex-1 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            console.log(
              `Rendering nav item: ${item.label}, isActive: ${isActive}`,
            );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-orbitron text-sm ${
                  isActive
                    ? "text-(--app-accent) bg-(--app-accent)/10 border border-(--app-accent)/30"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }`}
                style={{
                  minWidth: "80px",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Wallet - Fixed width on desktop for centering */}
        <div className="flex items-center md:w-20 justify-end">
          <Wallet className="z-10">
            <ConnectWallet className="">
              <Name className="text-inherit" />
            </ConnectWallet>
            <WalletDropdown className="">
              <Identity
                className="px-4 pt-3 pb-2 bg-transparent text-white"
                hasCopyAddressOnClick
              >
                <Avatar />
                <Name className="font-orbitron" />
                <Address className="font-orbitron" />
                <EthBalance className="font-orbitron" />
              </Identity>
              <WalletDropdownDisconnect className="bg-transparent hover:bg-transparent" />
            </WalletDropdown>
          </Wallet>
        </div>
      </header>
    </div>
  );
}
