import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (!redis) {
      return NextResponse.json(
        { error: "Redis not configured" },
        { status: 500 },
      );
    }

    // Get all keys that might contain FID data
    const keys = await redis.keys("*");
    const fidData = [];

    for (const key of keys) {
      const value = await redis.get(key);
      fidData.push({
        key,
        value: typeof value === "string" ? value : JSON.stringify(value),
      });
    }

    return NextResponse.json({
      success: true,
      totalKeys: keys.length,
      keys: fidData,
      message: "All stored Redis keys",
    });
  } catch (error) {
    console.error("List stored FIDs error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
