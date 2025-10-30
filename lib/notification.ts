import { redis } from "./redis";

// FrameNotificationDetails type - matches the structure from Farcaster SDK
export interface FrameNotificationDetails {
  url: string;
  token: string;
}

const notificationServiceKey =
  process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME ?? "minikit";

function getUserNotificationDetailsKey(fid: number): string {
  return `${notificationServiceKey}:user:${fid}`;
}

function getUserFidKey(userAddress: string): string {
  return `${notificationServiceKey}:fid:${userAddress.toLowerCase()}`;
}

export async function getUserNotificationDetails(
  fid: number,
): Promise<FrameNotificationDetails | null> {
  if (!redis) {
    return null;
  }

  return await redis.get<FrameNotificationDetails>(
    getUserNotificationDetailsKey(fid),
  );
}

export async function setUserNotificationDetails(
  fid: number,
  notificationDetails: FrameNotificationDetails,
): Promise<void> {
  if (!redis) {
    return;
  }

  await redis.set(getUserNotificationDetailsKey(fid), notificationDetails);
}

export async function deleteUserNotificationDetails(
  fid: number,
): Promise<void> {
  if (!redis) {
    return;
  }

  await redis.del(getUserNotificationDetailsKey(fid));
}

// New functions to handle user FID mapping
export async function setUserFid(
  userAddress: string,
  fid: number,
): Promise<void> {
  if (!redis) {
    return;
  }

  await redis.set(getUserFidKey(userAddress), fid.toString());
}

export async function getUserFid(userAddress: string): Promise<number | null> {
  if (!redis) {
    return null;
  }

  const fidString = await redis.get<string>(getUserFidKey(userAddress));
  return fidString ? parseInt(fidString, 10) : null;
}

export async function deleteUserFid(userAddress: string): Promise<void> {
  if (!redis) {
    return;
  }

  await redis.del(getUserFidKey(userAddress));
}
