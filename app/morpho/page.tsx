"use client";
import React, { useState } from "react";
import {
  FaChartBar,
  FaCoins,
  FaShieldAlt,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";
import {
  Earn,
  EarnDeposit,
  EarnWithdraw,
  EarnDetails,
  DepositBalance,
  DepositAmountInput,
  DepositButton,
  WithdrawBalance,
  WithdrawAmountInput,
  WithdrawButton,
} from "@coinbase/onchainkit/earn";

const Morpho = () => {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-5 pb-32 md:pb-6 md:py-10">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="flex items-center justify-center text-3xl md:text-4xl font-bold mb-4 py-5 text-(--app-foreground) gap-3">
          <FaChartBar style={{ color: "#1bf696" }} className="text-4xl" />
          <span className="font-orbitron">Morpho</span>
        </h1>
        <p className="text-(--app-foreground-muted) text-lg max-w-2xl mx-auto">
          Earn yield on your assets with Decentral Bros Morpho Vault -
          <span className="text-(--app-accent) font-semibold">
            {" "}
            Gas fees sponsored by Coinbase
          </span>
        </p>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center">
        <Earn
          vaultAddress="0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A"
          className="border-gray-800 p-4"
        >
          <div className="w-full max-w-md">
            {/* Vault Title */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-(--app-foreground) mb-2 font-orbitron mt-2">
                Decentral Bros Morpho Vault
              </h2>
              <div className="flex items-center justify-center gap-4 text-sm text-(--app-foreground-muted)">
                <div className="flex items-center gap-1">
                  <FaCoins className="text-(--app-accent)" />
                  <span>High Yield</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaShieldAlt className="text-(--app-accent)" />
                  <span>Secure</span>
                </div>
              </div>
            </div>

            {/* Main Card with Toggle */}
            <div className="bg-transparent p-2 shadow-lg backdrop-blur-sm">
              {/* Toggle Buttons */}
              <div className="flex bg-(--app-gray) rounded-lg p-1 mb-6">
                <button
                  onClick={() => setActiveTab("deposit")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all duration-200 font-orbitron font-semibold ${
                    activeTab === "deposit"
                      ? "bg-(--app-accent) text-[#111111] shadow-lg"
                      : "text-(--app-foreground-muted) hover:text-(--app-foreground)"
                  }`}
                >
                  <FaArrowDown />
                  <span>Deposit</span>
                </button>
                <button
                  onClick={() => setActiveTab("withdraw")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all duration-200 font-orbitron font-semibold ${
                    activeTab === "withdraw"
                      ? "bg-(--app-accent) text-[#111111] shadow-lg"
                      : "text-(--app-foreground-muted) hover:text-(--app-foreground)"
                  }`}
                >
                  <FaArrowUp />
                  <span>Withdraw</span>
                </button>
              </div>

              {/* Content based on active tab */}
              {activeTab === "deposit" ? (
                <EarnDeposit className="bg-transparent border-none p-0">
                  <EarnDetails />
                  <DepositBalance />
                  <DepositAmountInput />
                  <DepositButton />
                </EarnDeposit>
              ) : (
                <EarnWithdraw className="bg-transparent border-none p-0">
                  <EarnDetails />
                  <WithdrawBalance />
                  <WithdrawAmountInput />
                  <WithdrawButton />
                </EarnWithdraw>
              )}
            </div>

            {/* Footer Info */}
            <div className="text-center mt-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-(--app-accent)/10 border border-gray-800 rounded-lg text-(--app-accent) text-sm font-semibold mb-3">
                <FaShieldAlt />
                <span>Network fees paid by DBRO Team</span>
              </div>
            </div>
          </div>
        </Earn>
      </div>
    </div>
  );
};

export default Morpho;
