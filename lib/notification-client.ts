export interface NotificationDetails {
  url: string;
  token: string;
}

export interface StakingNotification {
  title: string;
  body: string;
  action?: "stake" | "unstake" | "claim" | "unwrap";
  amount?: string;
  token?: string;
  transactionHash?: string;
}

export async function sendFrameNotification({
  title,
  body,
  notificationDetails,
}: {
  title: string;
  body: string;
  notificationDetails?: NotificationDetails;
}) {
  if (!notificationDetails?.url || !notificationDetails?.token) {
    return { state: "error", error: "Missing notification details" };
  }

  try {
    const response = await fetch(notificationDetails.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: notificationDetails.token,
        title,
        body,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { state: "success", data: result };
  } catch (error) {
    console.error("Failed to send frame notification:", error);
    return {
      state: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Enhanced staking notification functions
export async function sendStakingNotification({
  action,
  amount,
  token = "DBRO",
  notificationDetails,
}: {
  action: "stake" | "unstake" | "claim" | "unwrap";
  amount?: string;
  token?: string;
  notificationDetails?: NotificationDetails;
}) {
  const actionTitles = {
    stake: "🎉 Staking Successful!",
    unstake: "💸 Unstaking Complete!",
    claim: "🎁 Rewards Claimed!",
    unwrap: "📦 NFT Unwrapped!",
  };

  const actionBodies = {
    stake: `Successfully staked ${amount} ${token}! Your tokens are now earning rewards.`,
    unstake: `Successfully unstaked ${amount} ${token}! Your tokens are back in your wallet.`,
    claim: `Claimed ${amount} ${token} rewards! A DBRO Hybrid NFT has been minted with your wrapped rewards.`,
    unwrap: `Unwrapped ${amount} ${token} from your DBRO Hybrid NFT! You can now stake more DBRO.`,
  };

  const title = actionTitles[action];
  const body = actionBodies[action];

  return sendFrameNotification({
    title,
    body,
    notificationDetails,
  });
}

// Notification for failed transactions
export async function sendFailedTransactionNotification({
  action,
  notificationDetails,
}: {
  action: "stake" | "unstake" | "claim" | "unwrap";
  notificationDetails?: NotificationDetails;
}) {
  const actionTitles = {
    stake: "❌ Staking Failed",
    unstake: "❌ Unstaking Failed",
    claim: "❌ Claim Failed",
    unwrap: "❌ Unwrap Failed",
  };

  const actionBodies = {
    stake: "Failed to stake DBRO. Please try again or check your balance.",
    unstake: "Failed to unstake DBRO. Please try again.",
    claim:
      "Failed to claim rewards. Make sure you have enough pending rewards (100K DBRO minimum).",
    unwrap: "Failed to unwrap NFT. Please try again.",
  };

  const title = actionTitles[action];
  const body = actionBodies[action];

  return sendFrameNotification({
    title,
    body,
    notificationDetails,
  });
}
