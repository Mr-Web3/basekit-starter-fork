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

    // For now, we'll return a mock FID
    // In a real implementation, you'd need to:
    // 1. Get the user's FID from their Farcaster session
    // 2. Or store FID mappings when users connect their wallet

    // For testing, let's use a mock FID
    const mockFid = 12345; // Replace with actual FID lookup logic

    return NextResponse.json({
      success: true,
      userAddress,
      fid: mockFid,
      message: "Mock FID returned for testing",
    });
  } catch (error) {
    console.error("Get user FID error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
