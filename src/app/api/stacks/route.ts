import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stacks = await prisma.stack.findMany({
    where: { userId: session.user.id },
    include: { compounds: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(stacks);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, compounds, durationWeeks, goal, notes, overallScore, aiEvaluation } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Stack name is required" }, { status: 400 });
    }
    if (!compounds || !Array.isArray(compounds) || compounds.length === 0) {
      return NextResponse.json({ error: "At least one compound is required" }, { status: 400 });
    }

    const stack = await prisma.stack.create({
      data: {
        name: name.trim(),
        userId: session.user.id,
        durationWeeks: Number(durationWeeks) || 12,
        goal: goal?.trim() || null,
        notes: notes?.trim() || null,
        overallScore: overallScore != null ? Number(overallScore) : null,
        aiEvaluation: aiEvaluation ?? null,
        compounds: {
          create: compounds.map(
            (c: {
              compoundId: string;
              dosageMg: number;
              frequency: string;
              isAncillary?: boolean;
            }) => ({
              compoundId: c.compoundId,
              dosageMg: Number(c.dosageMg),
              frequency: c.frequency || "weekly",
              isAncillary: c.isAncillary ?? false,
            })
          ),
        },
      },
      include: { compounds: true },
    });

    return NextResponse.json(stack, { status: 201 });
  } catch (err: unknown) {
    console.error("Create stack error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
