"use client";

import React from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useUserProfile } from "../../lib/useUserProfile";

interface UserProfileCardProps {
  className?: string;
}

const shortenAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  className = "",
}) => {
  const { address: userAddress } = useAccount();
  const { profile, isLoading: profileLoading } = useUserProfile();

  // Don't render anything if no wallet is connected
  if (!userAddress) {
    return null;
  }

  return (
    <div
      className={`bg-gray-900/30 rounded-lg border border-gray-700 p-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white font-mono">
          Connected Profile
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-(--app-accent) font-mono">Connected</span>
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex items-center space-x-3">
        {profileLoading ? (
          <>
            <div className="w-12 h-12 rounded-full bg-gray-700 animate-pulse"></div>
            <div className="flex-1">
              <div className="w-24 h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="w-20 h-3 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </>
        ) : profile ? (
          <>
            {profile.profilePicture ? (
              <div className="relative">
                <Image
                  src={profile.profilePicture}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-[#1bf696]/40"
                  width={48}
                  height={48}
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#1bf696]/20 to-[#1bf696]/40 border-2 border-[#1bf696]/40 flex items-center justify-center">
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
                  shortenAddress(userAddress)}
              </div>
              {profile.username ? (
                <div className="text-xs text-(--app-accent) font-mono">
                  @{profile.username}
                </div>
              ) : (
                <div className="text-xs text-gray-400 font-mono">
                  Wallet Connected
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#1bf696]/20 to-[#1bf696]/40 border-2 border-[#1bf696]/40 flex items-center justify-center">
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
          </>
        )}
      </div>

      {/* Wallet Address */}
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-mono">
            Wallet Address
          </span>
          <span className="text-xs text-gray-300 font-mono">
            {shortenAddress(userAddress)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
