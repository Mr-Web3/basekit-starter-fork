import { getUserFid, getUserNotificationDetails } from "@/lib/notification";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get("userAddress");

    if (!userAddress) {
      return NextResponse.json(
        { error: "Missing user address" },
        { status: 400 },
      );
    }

    // Get the user's FID from their wallet address
    const fid = await getUserFid(userAddress);

    if (!fid) {
      return NextResponse.json(
        {
          error: "User not found in Farcaster system",
          userAddress,
          fid: null,
          notificationDetails: null,
        },
        { status: 404 },
      );
    }

    // Get the user's notification details
    const notificationDetails = await getUserNotificationDetails(fid);

    if (!notificationDetails) {
      return NextResponse.json(
        {
          error: "User has not enabled notifications",
          userAddress,
          fid,
          notificationDetails: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      userAddress,
      fid,
      notificationDetails,
      message: "User is properly set up for Farcaster notifications",
    });
  } catch (error) {
    console.error("Debug notification error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
