import { getUserNotificationDetails } from "@/lib/notification";
import {
  sendStakingNotification,
  sendFailedTransactionNotification,
} from "@/lib/notification-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fid, action, amount, token = "DBRO", success = true } = body;

    if (!fid) {
      return NextResponse.json({ error: "Missing FID" }, { status: 400 });
    }

    // Get the user's notification details
    const notificationDetails = await getUserNotificationDetails(fid);

    if (!notificationDetails) {
      console.log(`No notification details found for FID ${fid}`);
      return NextResponse.json(
        { error: "User has not enabled notifications" },
        { status: 404 },
      );
    }

    console.log(`Sending ${action} notification to FID ${fid}`);

    let result;

    if (success) {
      // Send success notification
      result = await sendStakingNotification({
        action,
        amount,
        token,
        notificationDetails,
      });
    } else {
      // Send failure notification
      result = await sendFailedTransactionNotification({
        action,
        notificationDetails,
      });
    }

    if (result.state === "error") {
      console.error("Failed to send Farcaster notification:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    console.log(`Successfully sent ${action} notification to FID ${fid}`);
    return NextResponse.json({ success: true, fid }, { status: 200 });
  } catch (error) {
    console.error("Transaction notification error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
