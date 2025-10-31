"use client";

import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

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
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Farcaster profile comes from MiniKit context; no on-chain read needed

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!isConnected || !address) {
        if (!cancelled) setProfile(null);
        return;
      }

      try {
        const inMini = await sdk.isInMiniApp();
        const ctx = inMini ? await sdk.context : undefined;
        const user = ctx?.user;

        const userProfile: UserProfile = {
          address,
          isConnected,
          fid: user?.fid,
          username: user?.username,
          displayName: user?.displayName,
          profilePicture: user?.pfpUrl,
          ensName: undefined,
          baseName: undefined,
        };
        if (!cancelled) setProfile(userProfile);
      } catch {
        if (!cancelled) {
          setProfile({ address, isConnected, ensName: undefined, baseName: undefined });
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [address, isConnected]);

  return {
    profile,
    isLoading: isConnected && !profile,
    error: null,
  };
}
