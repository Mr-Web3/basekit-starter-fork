import {
  sendFrameNotification,
  sendStakingNotification,
} from "@/lib/notification-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { notification, stakingAction } = body;

    // Handle staking-specific notifications
    if (stakingAction) {
      const { action, amount, token = "DBRO" } = stakingAction;

      const result = await sendStakingNotification({
        action,
        amount,
        token,
        notificationDetails: notification.notificationDetails,
      });

      if (result.state === "error") {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Handle regular notifications
    const result = await sendFrameNotification({
      title: notification.title,
      body: notification.body,
      notificationDetails: notification.notificationDetails,
    });

    if (result.state === "error") {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
