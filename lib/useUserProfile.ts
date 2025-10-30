"use client";

import { useAccount } from "wagmi";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useState, useEffect } from "react";

export interface UserProfile {
  address: string;
  ensName?: string;
  baseName?: string;
  displayName?: string;
  username?: string;
  profilePicture?: string;
  fid?: number;
  isConnected: boolean;
}

export function useUserProfile() {
  const { address, isConnected } = useAccount();
  const { context } = useMiniKit();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Farcaster profile comes from MiniKit context; no on-chain read needed

  useEffect(() => {
    if (!isConnected || !address) {
      setProfile(null);
      return;
    }

    // Extract profile data from MiniKit context - using context.user like your working app
    const user = context?.user;

    const userProfile: UserProfile = {
      address,
      isConnected,
      fid: user?.fid as number | undefined,
      username: user?.username as string | undefined,
      displayName: user?.displayName as string | undefined,
      profilePicture: user?.pfpUrl as string | undefined,
      ensName: undefined,
      baseName: undefined,
    };

    console.log("🔍 User Profile Created:", userProfile);
    setProfile(userProfile);
  }, [address, isConnected, context]);

  return {
    profile,
    isLoading: isConnected && !profile,
    error: null,
  };
}
