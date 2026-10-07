import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { FounderNotification } from "@/types";

let inMemoryNotifications: FounderNotification[] = [];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const founderUsername = searchParams.get("founderUsername");
    const founderEmail = searchParams.get("founderEmail");
    const projectId = searchParams.get("projectId");

    try {
      const { db } = await connectToDatabase();
      const col = db.collection<FounderNotification>("notifications");

      let query: any = {};
      if (founderUsername) {
        query.$or = [
          { founderUsername: founderUsername },
          { founderUsername: "Founder" },
          { founderUsername: { $exists: false } },
        ];
      }
      if (founderEmail) {
        query.founderEmail = founderEmail;
      }
      if (projectId) {
        query.projectId = projectId;
      }

      const notifications = await col.find(query).sort({ createdAt: -1 }).toArray();
      return NextResponse.json({
        success: true,
        notifications,
        count: notifications.length,
        source: "mongodb",
      });
    } catch (dbErr) {
      // Memory fallback
      let list = [...inMemoryNotifications];
      if (founderUsername) {
        const u = founderUsername.toLowerCase();
        list = list.filter(
          (n) =>
            !n.founderUsername ||
            n.founderUsername.toLowerCase() === u ||
            n.founderUsername.toLowerCase() === "founder"
        );
      }
      if (founderEmail) {
        const e = founderEmail.toLowerCase();
        list = list.filter((n) => n.founderEmail?.toLowerCase() === e);
      }
      if (projectId) {
        list = list.filter((n) => n.projectId === projectId);
      }

      return NextResponse.json({
        success: true,
        notifications: list,
        count: list.length,
        source: "in-memory-fallback",
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const notification: FounderNotification = {
      id: body.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: "investor_interest",
      projectId: body.projectId || "general",
      projectName: body.projectName || "Startup Venture",
      projectDomain: body.projectDomain || "Technology",
      founderUsername: body.founderUsername || "Guruprasad",
      founderEmail: body.founderEmail || "founder@startupgen.ai",
      investorName: body.investorName || "Accredited Investor",
      investorEmail: body.investorEmail || "investor@venturefund.com",
      investorFirm: body.investorFirm || "Angel Syndicate",
      checkSize: body.checkSize || "$50,000",
      instrument: body.instrument || "SAFE Note",
      valuationCap: body.valuationCap || "$5,000,000",
      notes: body.notes || "Interested in scheduling an introductory diligence call.",
      createdAt: body.createdAt || new Date().toISOString(),
      read: body.read ?? false,
    };

    inMemoryNotifications = [
      notification,
      ...inMemoryNotifications.filter((n) => n.id !== notification.id),
    ];

    try {
      const { db } = await connectToDatabase();
      const col = db.collection<FounderNotification>("notifications");
      await col.replaceOne({ id: notification.id }, notification, { upsert: true });

      return NextResponse.json({
        success: true,
        message: "Notification persisted to database",
        notification,
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        message: "Notification stored in memory fallback",
        notification,
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to save notification" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json().catch(() => ({}));
    const action = body.action || "mark-read";

    if (action === "mark-all-read") {
      inMemoryNotifications = inMemoryNotifications.map((n) => ({ ...n, read: true }));
      try {
        const { db } = await connectToDatabase();
        const col = db.collection<FounderNotification>("notifications");
        await col.updateMany({}, { $set: { read: true } });
      } catch (e) {}

      return NextResponse.json({ success: true, message: "All marked as read" });
    }

    const targetId = id || body.id;
    if (!targetId) {
      return NextResponse.json({ success: false, error: "Missing notification id" }, { status: 400 });
    }

    inMemoryNotifications = inMemoryNotifications.map((n) =>
      n.id === targetId ? { ...n, read: true } : n
    );

    try {
      const { db } = await connectToDatabase();
      const col = db.collection<FounderNotification>("notifications");
      await col.updateOne({ id: targetId }, { $set: { read: true } });
    } catch (e) {}

    return NextResponse.json({ success: true, message: "Notification marked as read" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to update notification" },
      { status: 500 }
    );
  }
}
