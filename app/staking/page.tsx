"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { useNotification, useMiniKit } from "@coinbase/onchainkit/minikit";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { useUserProfile } from "../../lib/useUserProfile";

import deployedContracts from "../../contracts/deployedContracts";
import {
  FaCoins,
  FaGift,
  FaLock,
  FaArrowUp,
  FaCrown,
  FaRocket,
  FaChartLine,
  FaShieldAlt,
  FaGem,
  FaFire,
  FaUnlock,
  FaTimes,
  FaStore,
  FaChalkboardTeacher,
  FaTools,
  FaLeaf,
  FaComments,
  FaCode,
  FaMusic,
  FaCloud,
} from "react-icons/fa";
// import { IoHomeOutline } from "react-icons/io5";
// import Link from "next/link";
import Toast from "../components/Toast";
import DBROPriceConverter from "../components/DBROPriceConvertor";
// import BuyComponents from "../components/Buy";
import Image from "next/image";

const formatNumberWithCommas = (value: string): string => {
  const parts = value.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts[0]; // Only return the whole number part, no decimals
};

const shortenAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const ACCENT = "#1bf696";

const TREASURY_ADDRESS = "0xE31b8Ebc6b9Ae3622cF1e3bFf4c129A15b8d548c";
const CONTRACT = "0x6a4e0F83D7882BcACFF89aaF6f60D24E13191E9F";
const erc20ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
] as const;

const RYFT_ADDRESS = "0x7aBe92aA0b6da4AeEf832F5Ce540dc49EAAd2dCA";
const DBRO_CONTRACT = "0x6a4e0F83D7882BcACFF89aaF6f60D24E13191E9F";
const erc20_RYFT_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "operator", type: "address" },
      { name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const Staking: React.FC = () => {
  const { address: userAddress } = useAccount();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const [stakeAmount, setStakeAmount] = useState<number>();
  const [unwrapQuantity, setUnwrapQuantity] = useState<number>();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isNFTApproved, setIsNFTApproved] = useState<boolean>(false);
  const [currentTransactionHash, setCurrentTransactionHash] = useState<
    `0x${string}` | undefined
  >(undefined);
  const [isTransactionPending, setIsTransactionPending] =
    useState<boolean>(false);
  const [lastTransactionAction, setLastTransactionAction] = useState<
    "stake" | "unstake" | "claim" | "unwrap" | null
  >(null);
  const [lastTransactionAmount, setLastTransactionAmount] = useState<
    string | undefined
  >(undefined);

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "loading";
    transactionType?: "approve" | "stake" | "unstake" | "claim" | "unwrap";
  } | null>(null);

  // Perks modal state
  const [showPerksModal, setShowPerksModal] = useState<boolean>(false);

  const sendNotification = useNotification();
  const { context } = useMiniKit();
  const { writeContract, data: transactionHash } = useWriteContract();

  // Use base chain (8453) for deployed contracts
  const contractConfig = deployedContracts[8453].DBROWrappedStaking;
  const contractDBRO = deployedContracts[8453].DecentralBros;
  const contractRYFT = deployedContracts[8453].RYFT;

  // Read contract data (only if userAddress is present)
  const { data: stakeInfo, refetch: refetchStakeInfo } = useReadContract(
    userAddress
      ? {
          address: contractConfig.address as `0x${string}`,
          abi: contractConfig.abi,
          functionName: "getStakeInfoAndPendingRewards",
          args: [userAddress as `0x${string}`],
        }
      : undefined,
  );

  // Function to send Farcaster notifications
  const sendFarcasterNotification = useCallback(
    async (
      userAddress: string,
      action: "stake" | "unstake" | "claim" | "unwrap",
      amount?: string,
      success: boolean = true,
    ) => {
      try {
        // First, get the user's FID
        const fidResponse = await fetch(
          `/api/get-user-fid?userAddress=${userAddress}`,
        );

        if (!fidResponse.ok) {
          console.log(`❌ Could not get FID for user ${userAddress}`);
          return;
        }

        const fidData = await fidResponse.json();
        const fid = fidData.fid;

        if (!fid) {
          console.log(`❌ No FID found for user ${userAddress}`);
          return;
        }

        // Send notification using FID
        const response = await fetch("/api/transaction-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fid,
            action,
            amount,
            success,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Farcaster notification sent to FID ${result.fid}`);
        } else {
          const error = await response.json();
          console.log(`❌ Farcaster notification failed:`, error.error);
        }
      } catch (error) {
        console.error("Failed to send Farcaster notification:", error);
      }
    },
    [],
  );

  // Check approval status
  const { data: currentAllowance, refetch: refetchCurrentAllowance } =
    useReadContract(
      userAddress && stakeAmount
        ? {
            address: contractDBRO.address as `0x${string}`,
            abi: erc20ABI,
            functionName: "allowance",
            args: [
              userAddress as `0x${string}`,
              contractConfig.address as `0x${string}`,
            ],
          }
        : undefined,
    );

  // Update approval status when allowance or stake amount changes
  useEffect(() => {
    if (stakeAmount && currentAllowance) {
      const amountInWei = parseUnits(String(stakeAmount), 8);
      setIsApproved(currentAllowance >= amountInWei);
    }
  }, [stakeAmount, currentAllowance]);

  // Monitor transaction receipt
  const { data: transactionReceipt } = useWaitForTransactionReceipt({
    hash: currentTransactionHash,
    confirmations: 2,
  });

  // Update transaction hash when writeContract is called
  useEffect(() => {
    if (transactionHash) {
      setCurrentTransactionHash(transactionHash);
      setIsTransactionPending(true);
      console.log(`🔗 Transaction hash:`, transactionHash);
    }
  }, [transactionHash]);

  // Direct contract call functions
  const handleApprove = useCallback(async () => {
    if (!stakeAmount || !userAddress) return;

    const amountInWei = parseUnits(String(stakeAmount), 8);

    try {
      console.log(`🚀 Approving ${stakeAmount} DBRO...`);

      // Show loading toast
      setToast({
        message: `Approving ${stakeAmount} DBRO...`,
        type: "loading",
        transactionType: "approve",
      });

      // Set transaction tracking
      setLastTransactionAction("stake");
      setLastTransactionAmount(stakeAmount?.toString());

      await writeContract({
        address: contractDBRO.address as `0x${string}`,
        abi: contractDBRO.abi,
        functionName: "approve",
        args: [contractConfig.address, amountInWei],
      });
    } catch (error) {
      console.error(`❌ Approval failed:`, error);
      setIsTransactionPending(false);

      // Show error toast
      setToast({
        message: "Approval failed. Please try again.",
        type: "error",
        transactionType: "approve",
      });

      // Send Farcaster notification for failed approval
      if (userAddress) {
        sendFarcasterNotification(
          userAddress,
          "stake",
          stakeAmount?.toString(),
          false,
        );
      }

      if (context?.client?.added) {
        sendNotification({
          title: "❌ Approval Failed",
          body: "Failed to approve DBRO. Please try again.",
        });
      }
    }
  }, [
    stakeAmount,
    userAddress,
    writeContract,
    contractDBRO,
    contractConfig,
    context,
    sendNotification,
    sendFarcasterNotification,
  ]);

  const handleStake = useCallback(async () => {
    if (!stakeAmount || !userAddress) return;

    const amountInWei = parseUnits(String(stakeAmount), 8);

    try {
      console.log(`🚀 Staking ${stakeAmount} DBRO...`);

      // Show loading toast
      setToast({
        message: `Staking ${stakeAmount} DBRO...`,
        type: "loading",
        transactionType: "stake",
      });

      // Set transaction tracking
      setLastTransactionAction("stake");
      setLastTransactionAmount(stakeAmount?.toString());

      await writeContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: "stake",
        args: [amountInWei],
      });

      setStakeAmount(undefined);
    } catch (error) {
      console.error(`❌ Staking failed:`, error);
      setIsTransactionPending(false);

      // Show error toast
      setToast({
        message: "Staking failed. Please try again.",
        type: "error",
        transactionType: "stake",
      });

      // Send Farcaster notification for failed staking
      if (userAddress) {
        sendFarcasterNotification(
          userAddress,
          "stake",
          stakeAmount?.toString(),
          false,
        );
      }

      if (context?.client?.added) {
        sendNotification({
          title: "❌ Staking Failed",
          body: "Failed to stake DBRO. Please try again or check your balance.",
        });
      }
    }
  }, [
    stakeAmount,
    userAddress,
    writeContract,
    contractConfig,
    context,
    sendNotification,
    sendFarcasterNotification,
  ]);

  const handleUnstake = useCallback(async () => {
    if (!userAddress) return;

    try {
      console.log(`🚀 Unstaking DBRO...`);

      // Show loading toast
      setToast({
        message: "Unstaking DBRO...",
        type: "loading",
        transactionType: "unstake",
      });

      // Set transaction tracking
      setLastTransactionAction("unstake");
      setLastTransactionAmount(undefined);

      await writeContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: "unstake",
        args: [],
      });
    } catch (error) {
      console.error(`❌ Unstaking failed:`, error);
      setIsTransactionPending(false);

      // Show error toast
      setToast({
        message: "Unstaking failed. Please try again.",
        type: "error",
        transactionType: "unstake",
      });

      // Send Farcaster notification for failed unstaking
      if (userAddress) {
        sendFarcasterNotification(userAddress, "unstake", undefined, false);
      }

      if (context?.client?.added) {
        sendNotification({
          title: "❌ Unstaking Failed",
          body: "Failed to unstake DBRO. Please try again.",
        });
      }
    }
  }, [
    userAddress,
    writeContract,
    contractConfig,
    context,
    sendNotification,
    sendFarcasterNotification,
  ]);

  const handleClaimRewards = useCallback(async () => {
    if (!userAddress) return;

    try {
      console.log(`🚀 Claiming rewards...`);

      // Show loading toast
      setToast({
        message: "Claiming rewards...",
        type: "loading",
        transactionType: "claim",
      });

      // Set transaction tracking
      setLastTransactionAction("claim");
      setLastTransactionAmount(undefined);

      await writeContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: "claimReward",
        args: [],
      });
    } catch (error) {
      console.error(`❌ Claim failed:`, error);
      setIsTransactionPending(false);

      // Show error toast
      setToast({
        message: "Claim failed. Please try again.",
        type: "error",
        transactionType: "claim",
      });

      // Send Farcaster notification for failed claim
      if (userAddress) {
        sendFarcasterNotification(userAddress, "claim", undefined, false);
      }

      if (context?.client?.added) {
        sendNotification({
          title: "❌ Claim Failed",
          body: "Failed to claim rewards. Make sure you have enough pending rewards (100K DBRO minimum).",
        });
      }
    }
  }, [
    userAddress,
    writeContract,
    contractConfig,
    context,
    sendNotification,
    sendFarcasterNotification,
  ]);

  const handleApproveNFTs = useCallback(async () => {
    if (!userAddress) return;

    try {
      console.log(`🚀 Approving NFTs for contract...`);

      // Show loading toast
      setToast({
        message: "Approving NFTs...",
        type: "loading",
        transactionType: "approve",
      });

      await writeContract({
        address: contractRYFT.address as `0x${string}`,
        abi: erc20_RYFT_ABI,
        functionName: "setApprovalForAll",
        args: [contractConfig.address as `0x${string}`, true],
      });
    } catch (error) {
      console.error(`❌ NFT Approval failed:`, error);
      setIsTransactionPending(false);

      // Show error toast
      setToast({
        message: "NFT Approval failed. Please try again.",
        type: "error",
        transactionType: "approve",
      });

      if (context?.client?.added) {
        sendNotification({
          title: "❌ NFT Approval Failed",
          body: "Failed to approve NFTs. Please try again.",
        });
      }
    }
  }, [
    userAddress,
    writeContract,
    contractRYFT,
    contractConfig,
    context,
    sendNotification,
  ]);

  const { data: nftBalance, refetch: refetchNFTBalance } = useReadContract({
    address: contractRYFT.address as `0x${string}`,
    abi: contractRYFT.abi,
    functionName: "balanceOf",
    args: [
      userAddress ? userAddress : "0x0000000000000000000000000000000000000000",
      BigInt(0),
    ],
  });

  // Check NFT approval status
  const { data: isApprovedForAll } = useReadContract(
    userAddress
      ? {
          address: contractRYFT.address as `0x${string}`,
          abi: erc20_RYFT_ABI,
          functionName: "isApprovedForAll",
          args: [
            userAddress as `0x${string}`,
            contractConfig.address as `0x${string}`,
          ],
        }
      : undefined,
  );

  // Update NFT approval status
  useEffect(() => {
    if (isApprovedForAll !== undefined) {
      setIsNFTApproved(Boolean(isApprovedForAll));
    }
  }, [isApprovedForAll]);

  const handleUnwrapNFT = useCallback(async () => {
    if (!unwrapQuantity || !userAddress) return;

    try {
      console.log(`🚀 Unwrapping ${unwrapQuantity} NFTs...`);
      console.log(
        `📊 User has ${nftBalance} NFTs, trying to unwrap ${unwrapQuantity}`,
      );
      console.log(`🔐 NFT Approved: ${isNFTApproved}`);

      // Validate user has NFTs
      if (
        !nftBalance ||
        typeof nftBalance !== "bigint" ||
        nftBalance === BigInt(0)
      ) {
        throw new Error("You don't have any NFTs to unwrap.");
      }

      // Validate quantity
      if (BigInt(unwrapQuantity) > nftBalance) {
        throw new Error(
          `Cannot unwrap ${unwrapQuantity} NFTs. You only have ${nftBalance} NFTs.`,
        );
      }

      if (unwrapQuantity <= 0) {
        throw new Error("Quantity must be greater than 0.");
      }

      // Check if NFTs are approved
      if (!isNFTApproved) {
        throw new Error(
          "NFTs must be approved before unwrapping. Please approve NFTs first.",
        );
      }

      // Show loading toast
      setToast({
        message: `Unwrapping ${unwrapQuantity} NFTs...`,
        type: "loading",
        transactionType: "unwrap",
      });

      // Set transaction tracking
      setLastTransactionAction("unwrap");
      setLastTransactionAmount(unwrapQuantity?.toString());

      // Debug contract info
      console.log(`📋 Contract address: ${contractConfig.address}`);
      console.log(`📋 Function: unwrapNFT`);
      console.log(`📋 Args: [${BigInt(unwrapQuantity)}]`);

      // Use the correct contract and function without explicit gas
      await writeContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: "unwrapNFT",
        args: [BigInt(unwrapQuantity)],
      });

      setUnwrapQuantity(undefined);
    } catch (error) {
      console.error(`❌ Unwrap failed:`, error);
      setIsTransactionPending(false);

      // Show error toast with more specific error message
      setToast({
        message: `Unwrap failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        type: "error",
        transactionType: "unwrap",
      });

      // Send Farcaster notification for failed unwrap
      if (userAddress) {
        sendFarcasterNotification(
          userAddress,
          "unwrap",
          unwrapQuantity?.toString(),
          false,
        );
      }

      if (context?.client?.added) {
        sendNotification({
          title: "❌ Unwrap Failed",
          body: "Failed to unwrap NFT. Please check your gas settings and try again.",
        });
      }
    }
  }, [
    unwrapQuantity,
    userAddress,
    writeContract,
    contractConfig,
    context,
    sendNotification,
    sendFarcasterNotification,
    nftBalance,
    isNFTApproved,
  ]);

  const { data: requiredDBRO, refetch: refetchRequiredDBRO } = useReadContract({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    functionName: "REQUIRED_DBRO",
  });

  const { data: unwrapFEE, refetch: refetchUnwrapFEE } = useReadContract({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    functionName: "UNWRAP_FEE_PERCENT",
  });

  const { data: rewardRate, refetch: refetchRewardRate } = useReadContract({
    address: contractConfig.address as `0x${string}`,
    abi: contractConfig.abi,
    functionName: "getAnnualRewardRate",
  });

  const { data: contractTokens, refetch: refetchContractTokens } =
    useReadContract({
      address: contractConfig.address as `0x${string}`,
      abi: contractConfig.abi,
      functionName: "totalRewardTokens",
    });

  // Additional balances
  const { data: totalNFTSupply, refetch: refetchTotalNFTSupply } =
    useReadContract({
      address: contractRYFT.address as `0x${string}`,
      abi: contractRYFT.abi,
      functionName: "totalSupply",
      args: [BigInt(0)],
    });

  const { data: dbroBalance, refetch: refetchDbroBalance } = useReadContract({
    abi: erc20_RYFT_ABI,
    address: DBRO_CONTRACT,
    functionName: "balanceOf",
    args: [RYFT_ADDRESS],
  });

  const { data: treasuryBalance, refetch: refetchTreasuryBalance } =
    useReadContract({
      abi: erc20ABI,
      address: CONTRACT,
      functionName: "balanceOf",
      args: [TREASURY_ADDRESS],
    });

  // User's DBRO token balance
  const { data: userDBROBalance, refetch: refetchUserDBROBalance } =
    useReadContract(
      userAddress
        ? {
            abi: erc20ABI,
            address: CONTRACT,
            functionName: "balanceOf",
            args: [userAddress as `0x${string}`],
          }
        : undefined,
    );

  // Function to refresh all contract data
  const refreshAllData = useCallback(() => {
    console.log("🔄 Refreshing all contract data...");

    // Refetch all contract data
    if (refetchStakeInfo) refetchStakeInfo();
    if (refetchRequiredDBRO) refetchRequiredDBRO();
    if (refetchUnwrapFEE) refetchUnwrapFEE();
    if (refetchRewardRate) refetchRewardRate();
    if (refetchContractTokens) refetchContractTokens();
    if (refetchTotalNFTSupply) refetchTotalNFTSupply();
    if (refetchNFTBalance) refetchNFTBalance();
    if (refetchDbroBalance) refetchDbroBalance();
    if (refetchTreasuryBalance) refetchTreasuryBalance();
    if (refetchUserDBROBalance) refetchUserDBROBalance();
    if (refetchCurrentAllowance) refetchCurrentAllowance();

    // Reset transaction states
    setCurrentTransactionHash(undefined);
    setIsTransactionPending(false);

    console.log("✅ All contract data refreshed");
  }, [
    refetchStakeInfo,
    refetchRequiredDBRO,
    refetchUnwrapFEE,
    refetchRewardRate,
    refetchContractTokens,
    refetchTotalNFTSupply,
    refetchNFTBalance,
    refetchDbroBalance,
    refetchTreasuryBalance,
    refetchUserDBROBalance,
    refetchCurrentAllowance,
  ]);

  // Handle transaction completion
  useEffect(() => {
    if (transactionReceipt && currentTransactionHash) {
      console.log(`✅ Transaction confirmed:`, transactionReceipt);

      // Show success toast
      setToast({
        message: "Transaction confirmed successfully!",
        type: "success",
        transactionType: "stake", // This will be overridden by specific handlers
      });

      // Send success notification
      if (context?.client?.added) {
        sendNotification({
          title: "🎉 Transaction Successful!",
          body: "Your transaction has been confirmed on-chain!",
        });
      }

      // Send Farcaster notification if user is connected
      if (userAddress && lastTransactionAction) {
        sendFarcasterNotification(
          userAddress,
          lastTransactionAction,
          lastTransactionAmount,
          true,
        );
        // Reset tracking
        setLastTransactionAction(null);
        setLastTransactionAmount(undefined);
      }

      // Force UI refresh - refresh all contract data
      setTimeout(() => {
        refreshAllData();
        setCurrentTransactionHash(undefined);
        setIsTransactionPending(false);

        // Clear toast after showing
        setTimeout(() => setToast(null), 4000);
      }, 2000);
    }
  }, [
    transactionReceipt,
    currentTransactionHash,
    context,
    sendNotification,
    refetchStakeInfo,
    userAddress,
    stakeAmount,
    lastTransactionAction,
    lastTransactionAmount,
    refreshAllData,
    sendFarcasterNotification,
  ]);

  // UI rendering
  if (!userAddress) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-6">
          {/* Hero Section */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaCrown
                className="text-2xl md:text-3xl"
                style={{ color: ACCENT }}
              />
              <h1 className="text-xl md:text-2xl font-bold text-white">
                $DBRO Hybrid Staking
              </h1>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Connect your wallet to start staking and earning rewards
            </p>
            <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-xl p-4 mb-6">
              <div className="flex justify-center items-center gap-2 mb-2">
                <FaGift className="text-yellow-400 text-sm" />
                <span className="text-sm font-semibold text-yellow-400">
                  Connect Wallet Required
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Please connect your wallet to access staking features and view
                your portfolio.
              </p>

              {/* Wallet Connection */}
              <div className="flex justify-center">
                <Wallet className="z-10">
                  <ConnectWallet className="font-orbitron bg-(--app-accent) text-black py-2 px-4 rounded-lg hover:bg-(--app-accent-hover)/90 transition-all duration-300">
                    <Name className="text-inherit" />
                  </ConnectWallet>
                  <WalletDropdown className="z-50 mt-1">
                    <Identity
                      className="px-4 pt-3 pb-2 bg-transparent text-white"
                      hasCopyAddressOnClick
                    >
                      <Avatar />
                      <Name className="font-orbitron text-white" />
                      <Address className="font-orbitron text-white" />
                      <EthBalance className="font-orbitron text-white" />
                    </Identity>
                    <WalletDropdownDisconnect className="bg-transparent text-red-500 hover:bg-transparent" />
                  </WalletDropdown>
                </Wallet>
              </div>
            </div>
          </div>

          {/* Pool Stats - Mobile Optimized */}
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 mb-6">
            <h2 className="text-lg font-bold mb-4 flex items-center justify-center gap-2">
              <FaCoins className="text-(--app-accent)" />
              Pool Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-(--app-accent)">
                  {contractTokens && typeof contractTokens === "bigint"
                    ? formatNumberWithCommas(formatUnits(contractTokens, 8))
                    : "0"}
                </div>
                <div className="text-xs text-gray-400 mb-1">Total Staked</div>
                {contractTokens && typeof contractTokens === "bigint" && (
                  <div className="flex justify-center">
                    <DBROPriceConverter
                      amount={Number(formatUnits(contractTokens, 8)).toString()}
                      className="text-xs text-gray-500"
                    />
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: ACCENT }}>
                  {rewardRate ? `${rewardRate}%` : "0%"}
                </div>
                <div className="text-xs text-gray-400">APY Rate</div>
              </div>
            </div>
          </div>

          {/* Additional Pool Info */}
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
            <h2 className="text-lg font-bold mb-4 flex items-center justify-center gap-2">
              <FaLock className="text-(--app-accent)" />
              Staking Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <FaCoins className="text-(--app-accent)" />
                  Reward Claim Threshold
                </span>
                <div className="text-right">
                  <div className="font-bold text-(--app-accent)">
                    {requiredDBRO && typeof requiredDBRO === "bigint"
                      ? formatNumberWithCommas(formatUnits(requiredDBRO, 8))
                      : "Loading..."}
                  </div>
                  {requiredDBRO && typeof requiredDBRO === "bigint" && (
                    <div className="flex justify-end">
                      <DBROPriceConverter
                        amount={Number(formatUnits(requiredDBRO, 8)).toString()}
                        className="text-xs text-gray-500"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <FaArrowUp className="text-(--app-accent)" />
                  Unwrap Fee
                </span>
                <span className="font-bold" style={{ color: ACCENT }}>
                  {unwrapFEE ? `${unwrapFEE}%` : "Loading..."}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <FaCrown className="text-(--app-accent)" />
                  Reward Pool
                </span>
                <div className="text-right">
                  <div className="font-bold" style={{ color: ACCENT }}>
                    {treasuryBalance && typeof treasuryBalance === "bigint"
                      ? formatNumberWithCommas(formatUnits(treasuryBalance, 8))
                      : "0"}
                  </div>
                  {treasuryBalance && typeof treasuryBalance === "bigint" && (
                    <div className="flex justify-end">
                      <DBROPriceConverter
                        amount={Number(
                          formatUnits(treasuryBalance, 8),
                        ).toString()}
                        className="text-xs text-gray-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans text-(--app-foreground) mini-app-theme from-(--app-background) to-(--app-gray)">
      <div className="w-full mx-auto px-4 py-8">
        <main className="flex-1 text-center">
          {/* Main Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              $DBRO HYBRID STAKING ECOSYSTEM
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Stake your $DBRO tokens, earn wrapped rewards and unlock exclusive
              utilities!
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 md:p-6">
              <h3 className="text-base md:text-xl text-center font-semibold text-[#1bf696] mb-3 flex items-center justify-center gap-2">
                <FaCoins className="text-[#1bf696]" />
                <span className="hidden sm:inline">Reward Pool</span>
                <span className="sm:hidden">Pool</span>
              </h3>
              <div className="flex flex-col items-center space-y-1">
                <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-2 space-y-1 sm:space-y-0">
                  <span className="text-white font-bold text-lg md:text-xl">
                    {treasuryBalance && typeof treasuryBalance === "bigint"
                      ? formatNumberWithCommas(formatUnits(treasuryBalance, 8))
                      : "0"}
                  </span>
                  <span className="bg-[#1bf696]/10 text-[#1bf696] px-2 py-1 rounded text-xs">
                    $DBRO
                  </span>
                </div>
                {treasuryBalance && typeof treasuryBalance === "bigint" && (
                  <div className="w-full flex justify-center md:justify-center">
                    <DBROPriceConverter
                      amount={Number(formatUnits(treasuryBalance, 8)).toString()}
                      className="text-gray-400 text-xs"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 md:p-6">
              <h3 className="text-base md:text-xl text-center font-semibold text-[#1bf696] mb-3 flex items-center justify-center gap-2">
                <FaGift className="text-[#1bf696]" />
                <span className="hidden sm:inline">Wrapped $DBRO</span>
                <span className="sm:hidden">Wrapped</span>
              </h3>
              <div className="flex flex-col items-center space-y-1">
                <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-2 space-y-1 sm:space-y-0">
                  <span className="text-white font-bold text-lg md:text-xl">
                    {dbroBalance && typeof dbroBalance === "bigint"
                      ? formatNumberWithCommas(formatUnits(dbroBalance, 8))
                      : "0"}
                  </span>
                  <span className="bg-[#1bf696]/10 text-[#1bf696] px-2 py-1 rounded text-xs">
                    $DBRO
                  </span>
                </div>
                {dbroBalance && typeof dbroBalance === "bigint" && (
                  <div className="w-full flex justify-center md:justify-center">
                    <DBROPriceConverter
                      amount={Number(formatUnits(dbroBalance, 8)).toString()}
                      className="text-gray-400 text-xs"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 md:p-6">
              <h3 className="text-base md:text-xl text-center font-semibold text-[#1bf696] mb-3 flex items-center justify-center gap-2">
                <FaChartLine className="text-[#1bf696]" />
                APY Rate
              </h3>
              <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-2 space-y-1 sm:space-y-0">
                <span className="text-white font-bold text-lg md:text-xl">
                  {rewardRate 
                    ? typeof rewardRate === "bigint" 
                      ? `${Number(rewardRate)}%` 
                      : `${rewardRate}%`
                    : "Loading..."}
                </span>
                <span className="bg-[#1bf696]/10 text-[#1bf696] px-2 py-1 rounded text-xs">
                  Annual
                </span>
              </div>
            </div>
          </div>

          {/* DBRO Staking Info */}
          <div className="bg-gray-900/30 border border-gray-600 rounded-lg p-4 md:p-8 max-w-3xl mx-auto mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              <FaShieldAlt className="text-[#1bf696]" />
              Staking Contract Stats
            </h2>
            <div className="space-y-3 md:space-y-4">
              {/* Pool Size */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 md:p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="text-sm md:text-base text-[#1bf696] font-bold">
                    Pool Size:
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-base md:text-lg text-white font-bold">
                      {contractTokens && typeof contractTokens === "bigint"
                        ? formatNumberWithCommas(formatUnits(contractTokens, 8))
                        : "Loading..."}{" "}
                      $DBRO
                    </div>
                    {contractTokens && typeof contractTokens === "bigint" && (
                      <div className="w-full flex justify-center md:justify-end">
                        <DBROPriceConverter
                          amount={Number(formatUnits(contractTokens, 8)).toString()}
                          className="text-gray-400 text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reward Claim Threshold */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 md:p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="text-sm md:text-base text-[#1bf696] font-bold">
                    Reward Claim Threshold:
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-base md:text-lg text-white font-bold">
                      {requiredDBRO && typeof requiredDBRO === "bigint"
                        ? formatNumberWithCommas(formatUnits(requiredDBRO, 8))
                        : "Loading..."}{" "}
                      $DBRO
                    </div>
                    {requiredDBRO && typeof requiredDBRO === "bigint" && (
                      <div className="w-full flex justify-center md:justify-end">
                        <DBROPriceConverter
                          amount={Number(formatUnits(requiredDBRO, 8)).toString()}
                          className="text-gray-400 text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Unwrap Fee */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 md:p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="text-sm md:text-base text-[#1bf696] font-bold">
                    Unwrap Fee:
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-base md:text-lg text-white font-bold">
                      {unwrapFEE ? `${unwrapFEE}%` : "Loading..."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="max-w-4xl mx-auto space-y-6">
            {/* User Stats Dashboard */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FaShieldAlt className="text-[#1bf696] text-lg" />
                  <h3 className="text-lg font-bold text-white">
                    Your Portfolio
                  </h3>
                </div>

                {/* Connected Status Indicator */}
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-mono">
                    Connected
                  </span>
                </div>
              </div>

              {/* User Profile Info - Enhanced Layout */}
              <div className="mb-4">
                {profileLoading ? (
                  <div className="flex items-center space-x-3 p-3 bg-gray-900/30 rounded-lg border border-gray-700">
                    <div className="w-12 h-12 rounded-full bg-gray-700 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="w-24 h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
                      <div className="w-20 h-3 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                ) : profile ? (
                  <div className="flex items-center space-x-3 p-3 bg-gray-900/30 rounded-lg border border-gray-700">
                    {profile.profilePicture ? (
                      <div className="relative">
                        <Image
                          src={profile.profilePicture}
                          alt="Profile"
                          className="w-12 h-12 rounded-full border-2 border-(--app-accent)/40"
                          width={48}
                          height={48}
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-(--app-accent)/20 to-(--app-accent)/40 border-2 border-(--app-accent)/40 flex items-center justify-center">
                          <span className="text-(--app-accent) font-bold text-lg">
                            {(
                              profile.displayName ||
                              profile.username ||
                              userAddress ||
                              "A"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white font-mono">
                        {profile.displayName ||
                          profile.username ||
                          shortenAddress(userAddress || "")}
                      </div>
                      {profile.username ? (
                        <div className="text-xs text-(--app-accent) font-mono">
                          @{profile.username}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 font-mono">
                          {userAddress ? "Wallet Connected" : "Not Connected"}
                        </div>
                      )}
                    </div>
                  </div>
                ) : userAddress ? (
                  <div className="flex items-center space-x-3 p-3 bg-gray-900/30 rounded-lg border border-gray-700">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-(--app-accent)/20 to-(--app-accent)/40 border-2 border-(--app-accent)/40 flex items-center justify-center">
                        <span className="text-(--app-accent) font-bold text-lg">
                          {userAddress.charAt(2).toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white font-mono">
                        {shortenAddress(userAddress)}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        Wallet Connected
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Stats Grid - Back to original simple layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <FaLock className="text-(--app-accent) text-sm" />
                    <div className="text-xl font-bold text-(--app-accent) font-mono">
                      {Array.isArray(stakeInfo) &&
                      stakeInfo[0] &&
                      typeof stakeInfo[0].amountStaked === "bigint"
                        ? formatNumberWithCommas(
                            formatUnits(stakeInfo[0].amountStaked, 8),
                          )
                        : "0"}
                    </div>
                  </div>
                  <div className="text-gray-400 font-mono text-xs mb-1">
                    Staked $DBRO
                  </div>
                  {Array.isArray(stakeInfo) &&
                    stakeInfo[0] &&
                    typeof stakeInfo[0].amountStaked === "bigint" && (
                      <div className="flex justify-center">
                        <DBROPriceConverter
                          amount={Number(
                            formatUnits(stakeInfo[0].amountStaked, 8),
                          ).toString()}
                          className="text-gray-400 font-mono text-xs"
                        />
                      </div>
                    )}
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <FaCoins className="text-(--app-accent) text-sm" />
                    <div className="text-xl font-bold text-(--app-accent) font-mono">
                      {Array.isArray(stakeInfo) &&
                      stakeInfo[1] &&
                      typeof stakeInfo[1] === "bigint"
                        ? formatNumberWithCommas(formatUnits(stakeInfo[1], 8))
                        : "0"}
                    </div>
                  </div>
                  <div className="text-gray-400 font-mono text-xs mb-1">
                    Pending $DBRO Rewards
                  </div>
                  {Array.isArray(stakeInfo) &&
                    stakeInfo[1] &&
                    typeof stakeInfo[1] === "bigint" && (
                      <div className="flex justify-center">
                        <DBROPriceConverter
                          amount={Number(
                            formatUnits(stakeInfo[1], 8),
                          ).toString()}
                          className="text-gray-400 font-mono text-xs"
                        />
                      </div>
                    )}
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <FaGem className="text-(--app-accent) text-sm" />
                    <div className="text-xl font-bold text-(--app-accent) font-mono">
                      {nftBalance && typeof nftBalance === "bigint"
                        ? String(nftBalance)
                        : "0"}
                    </div>
                  </div>
                  <div className="text-gray-400 font-mono text-xs">
                    Wrapped $DBRO NFTs
                  </div>
                </div>
              </div>
            </div>

            {/* Buy DBRO Section - Centered */}
            {/* <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <FaCoins className="text-[#1bf696] text-lg" />
                <h3 className="text-lg font-bold text-white">Buy $DBRO</h3>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-gray-300 text-sm mb-3 text-center">
                  Need more $DBRO to stake? Buy directly with fiat!
                </p>
                <BuyComponents />
              </div>
            </div> */}

            {/* Staking and NFT Stats - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Staking Interface */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FaRocket className="text-(--app-accent) text-lg" />
                  <h3 className="text-lg font-bold text-white">Stake $DBRO</h3>
                </div>
                {userDBROBalance && (
                  <div className="mb-4">
                    <p className="text-gray-300 font-mono text-xs">
                      Your $DBRO Balance:{" "}
                      <a className="text-(--app-accent)">
                        {formatNumberWithCommas(
                          formatUnits(userDBROBalance, 8),
                        )}
                      </a>{" "}
                      $DBRO
                    </p>
                    <DBROPriceConverter
                      amount={Number(
                        formatUnits(userDBROBalance, 8),
                      ).toString()}
                      className="text-gray-400 font-mono text-xs mt-1"
                    />
                  </div>
                )}

                {/* Quick Percentage Selector */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {[
                    { label: "25%", percentage: 0.25 },
                    { label: "50%", percentage: 0.5 },
                    { label: "75%", percentage: 0.75 },
                    { label: "100%", percentage: 1.0 },
                  ].map((option) => (
                    <button
                      key={option.percentage}
                      onClick={() => {
                        if (
                          userDBROBalance &&
                          typeof userDBROBalance === "bigint"
                        ) {
                          const balance = Number(
                            formatUnits(userDBROBalance, 8),
                          );
                          const amount = Math.floor(
                            balance * option.percentage,
                          );
                          setStakeAmount(amount);
                        }
                      }}
                      className={`p-2 rounded-lg font-bold text-sm transition-all duration-300 font-mono ${
                        userDBROBalance &&
                        typeof userDBROBalance === "bigint" &&
                        stakeAmount ===
                          Math.floor(
                            Number(formatUnits(userDBROBalance, 8)) *
                              option.percentage,
                          )
                          ? "bg-(--app-accent) text-black shadow-lg"
                          : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                      }`}
                      disabled={!userDBROBalance}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-white mb-2 font-mono">
                    Custom Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Enter amount to stake"
                      value={stakeAmount || ""}
                      onChange={(e) => setStakeAmount(Number(e.target.value))}
                      className="w-full bg-gray-800 border border-gray-700 text-white placeholder:text-gray-400 h-8 text-sm rounded-lg focus:border-(--app-accent) focus:ring-0 font-mono pr-16 pl-3"
                      style={{
                        color: "white",
                        backgroundColor: "#1f2937",
                        borderColor: "#374151",
                      }}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-mono">
                      $DBRO
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Approval Button */}
                  {stakeAmount && !isApproved && (
                    <button
                      onClick={handleApprove}
                      disabled={
                        !stakeAmount || !userDBROBalance || isTransactionPending
                      }
                      className={`w-full bg-(--app-accent) text-black px-4 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-mono hover:bg-(--app-accent-hover)/90 text-sm ${
                        isTransactionPending
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isTransactionPending ? "Approving..." : "Approve DBRO"}
                    </button>
                  )}

                  {/* Staking Button */}
                  {stakeAmount && isApproved && (
                    <button
                      onClick={handleStake}
                      disabled={
                        !stakeAmount ||
                        !userDBROBalance ||
                        !isApproved ||
                        isTransactionPending
                      }
                      className={`w-full bg-(--app-accent) text-black px-4 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-mono hover:bg-(--app-accent-hover)/90 text-sm ${
                        isTransactionPending
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isTransactionPending ? (
                        "Staking..."
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <FaRocket className="text-sm" />
                          <span>STAKE $DBRO</span>
                        </div>
                      )}
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleUnstake}
                      disabled={!userAddress || isTransactionPending}
                      className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-gray-700 font-mono text-sm"
                    >
                      {isTransactionPending ? (
                        "Unstaking..."
                      ) : (
                        <div className="flex items-center justify-center space-x-1">
                          <FaUnlock className="text-xs" />
                          <span>Unstake</span>
                        </div>
                      )}
                    </button>

                    <button
                      onClick={handleClaimRewards}
                      disabled={
                        !userAddress ||
                        !Array.isArray(stakeInfo) ||
                        !stakeInfo[1] ||
                        typeof stakeInfo[1] !== "bigint" ||
                        !requiredDBRO ||
                        typeof requiredDBRO !== "bigint" ||
                        stakeInfo[1] < requiredDBRO ||
                        isTransactionPending
                      }
                      className="bg-(--app-accent) text-black px-3 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-mono hover:bg-(--app-accent-hover)/90 text-sm"
                    >
                      {isTransactionPending ? (
                        "Claiming..."
                      ) : (
                        <div className="flex items-center justify-center space-x-1">
                          <FaGift className="text-xs" />
                          <span>Claim & Wrap</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {/* NFT Stats */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FaCrown className="text-[#1bf696] text-lg" />
                    <h3 className="text-lg font-bold text-white">
                      NFT Statistics
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowPerksModal(true)}
                    className="bg-[#1bf696] text-black px-3 py-1 rounded text-xs font-bold hover:bg-[#1bf696]/90 transition-all duration-300 flex items-center space-x-1"
                  >
                    <FaFire className="text-xs" />
                    <span>PERKS</span>
                  </button>
                </div>

                <div className="space-y-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-mono text-xs">
                      Your NFTs
                    </span>
                    <span className="text-sm font-bold text-(--app-accent) font-mono">
                      {nftBalance && typeof nftBalance === "bigint"
                        ? String(nftBalance)
                        : "0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-mono text-xs">
                      Total Minted
                    </span>
                    <span className="text-sm font-bold text-(--app-accent) font-mono">
                      {totalNFTSupply && typeof totalNFTSupply === "bigint"
                        ? String(totalNFTSupply)
                        : "Loading..."}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-mono text-xs">
                        Your Wrapped $DBRO
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-bold text-(--app-accent) font-mono">
                          {nftBalance && typeof nftBalance === "bigint"
                            ? formatNumberWithCommas(
                                formatUnits(nftBalance * BigInt(9700000), 8),
                              )
                            : "0"}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          $DBRO
                        </div>
                      </div>
                    </div>
                    {nftBalance && typeof nftBalance === "bigint" && (
                      <div className="flex justify-end">
                        <DBROPriceConverter
                          amount={Number(
                            formatUnits(nftBalance * BigInt(9700000), 8),
                          ).toString()}
                          className="text-gray-400 font-mono text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {nftBalance &&
                  typeof nftBalance === "bigint" &&
                  nftBalance > BigInt(0) && (
                    <div className="border-t border-gray-700 pt-3">
                      <div className="flex items-center space-x-2 mb-3">
                        <FaUnlock className="text-(--app-accent) text-sm" />
                        <h4 className="text-sm font-bold text-white font-mono">
                          Unwrap NFTs
                        </h4>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="number"
                          min={1}
                          max={nftBalance ? Number(nftBalance) : 1}
                          value={unwrapQuantity || ""}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (e.target.value === "") {
                              setUnwrapQuantity(undefined);
                            } else if (!isNaN(value)) {
                              setUnwrapQuantity(
                                Math.max(
                                  1,
                                  Math.min(Number(nftBalance), value),
                                ),
                              );
                            }
                          }}
                          className="w-full bg-gray-800 border border-gray-700 text-white px-2 py-1 rounded focus:outline-none focus:ring-0 focus:border-(--app-accent) text-xs font-mono"
                          style={{
                            color: "white",
                            backgroundColor: "#1f2937",
                          }}
                          placeholder="Quantity to unwrap"
                        />

                        {/* NFT Approval Button */}
                        {!isNFTApproved && (
                          <button
                            onClick={handleApproveNFTs}
                            disabled={!userAddress || isTransactionPending}
                            className="w-full bg-(--app-accent) text-black px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-mono text-xs font-bold"
                          >
                            {isTransactionPending
                              ? "Approving..."
                              : "Approve NFTs"}
                          </button>
                        )}

                        {/* Unwrap Button */}
                        <button
                          onClick={handleUnwrapNFT}
                          disabled={
                            !unwrapQuantity ||
                            !userAddress ||
                            !isNFTApproved ||
                            isTransactionPending
                          }
                          className="w-full bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-gray-700 font-mono text-xs"
                        >
                          {isTransactionPending ? (
                            "Unwrapping..."
                          ) : (
                            <div className="flex items-center justify-center space-x-1">
                              <FaUnlock className="text-xs" />
                              <span>Unwrap NFTs</span>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          transactionType={toast.transactionType}
          onClose={() => setToast(null)}
        />
      )}

      {/* Perks Modal */}
      {showPerksModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <FaFire className="text-(--app-accent) text-xl" />
                <h2 className="text-2xl font-bold text-white font-mono">
                  Wrapped NFT Perks
                </h2>
              </div>
              <button
                onClick={() => setShowPerksModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <FaLeaf className="text-(--app-accent) text-2xl" />
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-sm">
                        Lawn & Landscaping
                      </h3>
                      <div className="text-xs text-gray-400 mb-2">
                        Requires 1 NFT
                      </div>
                      <p className="text-gray-300 text-xs">
                        Save on landscaping and seasonal lawn care this summer
                        and fall in Colorado!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <FaCode className="text-(--app-accent) text-2xl" />
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-sm">
                        DBRO Live Buildathon
                      </h3>
                      <div className="text-xs text-gray-400 mb-2">
                        Requires 2 NFTs
                      </div>
                      <p className="text-gray-300 text-xs">
                        Access our DBRO live buildathon. Build your own Base
                        dApp from scratch!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <FaStore className="text-(--app-accent) text-2xl" />
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-sm">
                        DBRO Store
                      </h3>
                      <div className="text-xs text-gray-400 mb-2">
                        Requires 2 NFTs
                      </div>
                      <p className="text-gray-300 text-xs">
                        Save money at checkout in our DBRO Store: tech, gear,
                        miners, servers, and more!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <FaComments className="text-(--app-accent) text-2xl" />
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-sm">
                        DBRO Mentorship
                      </h3>
                      <div className="text-xs text-gray-400 mb-2">
                        Requires 2 NFTs
                      </div>
                      <p className="text-gray-300 text-xs">
                        Access our DBRO social app: chat, share projects, get
                        feedback, and more.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <FaTools className="text-(--app-accent) text-2xl" />
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-sm">
                        Web3 Dev Kits
                      </h3>
                      <div className="text-xs text-gray-400 mb-2">
                        Requires 4 NFTs
                      </div>
                      <p className="text-gray-300 text-xs">
                        Access premium dev scaffolds, token sites, bots, mobile
                        apps, and smart contracts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <FaChalkboardTeacher className="text-(--app-accent) text-2xl" />
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-sm">
                        Web3 Workshops
                      </h3>
                      <div className="text-xs text-gray-400 mb-2">
                        Requires 6 NFTs
                      </div>
                      <p className="text-gray-300 text-xs">
                        Coding workshops, video tutorials, and in-depth guides
                        for web3 & ArcBlock.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <FaCode className="text-(--app-accent) text-2xl" />
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-sm">
                        DBRO Development
                      </h3>
                      <div className="text-xs text-gray-400 mb-2">
                        Requires 15 NFTs
                      </div>
                      <p className="text-gray-300 text-xs">
                        Discounted rates on DBRO dev services, including smart
                        contracts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <FaMusic className="text-(--app-accent) text-2xl" />
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-sm">
                        DOM NFT Wrapping
                      </h3>
                      <div className="text-xs text-gray-400 mb-2">
                        Requires 50K DBRO
                      </div>
                      <p className="text-gray-300 text-xs">
                        Wrap your DOM NFTs with 50,000 DBRO tokens & enjoy
                        wrapping-exclusive music.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <FaCloud className="text-(--app-accent) text-2xl" />
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-sm">
                        DBRO IPFS | IPNS Gateway
                      </h3>
                      <div className="text-xs text-gray-400 mb-2">
                        Requires 10 NFTs
                      </div>
                      <p className="text-gray-300 text-xs">
                        Access DBRO IPFS & IPNS services: store files, images,
                        videos, and more.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Info */}
              <div className="mt-6 p-4 bg-gray-900/30 rounded-xl border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <FaCrown className="text-(--app-accent) text-sm" />
                  <span className="text-sm font-bold text-white">
                    How to Unlock Perks
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Stake your $DBRO tokens to earn rewards. When you reach 100K
                  $DBRO rewards, claim them to mint a $DBRO Hybrid NFT. Stack
                  multiple NFTs to unlock higher-tier utilities and exclusive
                  benefits!
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
    </div>
  );
};

export default Staking;
