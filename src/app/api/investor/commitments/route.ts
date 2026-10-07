import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { InvestmentCommitment } from "@/types";

let inMemoryCommitments: InvestmentCommitment[] = [];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const investorEmail = searchParams.get("email");
    const projectId = searchParams.get("projectId");

    try {
      const { db } = await connectToDatabase();
      const col = db.collection<InvestmentCommitment>("commitments");

      let query: any = {};
      if (investorEmail) query.investorEmail = investorEmail;
      if (projectId) query.projectId = projectId;

      const commitments = await col.find(query).sort({ createdAt: -1 }).toArray();
      return NextResponse.json({
        success: true,
        commitments,
        count: commitments.length,
        source: "mongodb",
      });
    } catch (dbErr) {
      // Return memory fallback
      let list = [...inMemoryCommitments];
      if (investorEmail) list = list.filter((c) => c.investorEmail === investorEmail);
      if (projectId) list = list.filter((c) => c.projectId === projectId);

      return NextResponse.json({
        success: true,
        commitments: list,
        count: list.length,
        source: "in-memory-fallback",
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch commitments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const commitment: InvestmentCommitment = {
      id: body.id || `cmt-${Date.now()}`,
      projectId: body.projectId || "general",
      projectName: body.projectName || "Startup Venture",
      projectDomain: body.projectDomain || "Technology",
      founderName: body.founderName || "Founder",
      founderEmail: body.founderEmail || "founder@startupgen.ai",
      investorName: body.investorName || "Anonymous Investor",
      investorEmail: body.investorEmail || "investor@venturefund.com",
      investorFirm: body.investorFirm || "Independent Angel",
      checkSize: body.checkSize || "$50,000",
      instrument: body.instrument || "SAFE Note",
      valuationCap: body.valuationCap || "$5,000,000",
      stage: body.stage || "Screening",
      notes: body.notes || "",
      createdAt: body.createdAt || new Date().toISOString(),
    };

    inMemoryCommitments = [commitment, ...inMemoryCommitments.filter((c) => c.id !== commitment.id)];

    try {
      const { db } = await connectToDatabase();
      const col = db.collection<InvestmentCommitment>("commitments");
      await col.replaceOne({ id: commitment.id }, commitment, { upsert: true });

      return NextResponse.json({
        success: true,
        message: "Commitment persisted to MongoDB",
        commitment,
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        message: "Commitment saved to local memory session",
        commitment,
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to record commitment" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing commitment id" }, { status: 400 });
    }

    inMemoryCommitments = inMemoryCommitments.filter((c) => c.id !== id);

    try {
      const { db } = await connectToDatabase();
      const col = db.collection("commitments");
      await col.deleteOne({ id });
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true, message: "Commitment removed" });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
