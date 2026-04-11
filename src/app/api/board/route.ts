import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.boardPost.findMany({
    include: {
      user: { select: { username: true } },
      stack: {
        select: {
          name: true,
          durationWeeks: true,
          overallScore: true,
          compounds: {
            select: { compoundId: true, dosageMg: true, isAncillary: true },
          },
        },
      },
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { stackId, title, body: postBody } = body;

    if (!stackId || typeof stackId !== "string") {
      return NextResponse.json({ error: "stackId is required" }, { status: 400 });
    }
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const stack = await prisma.stack.findUnique({ where: { id: stackId } });
    if (!stack || stack.userId !== session.user.id) {
      return NextResponse.json({ error: "Stack not found" }, { status: 404 });
    }

    const existing = await prisma.boardPost.findUnique({
      where: { stackId },
    });
    if (existing) {
      return NextResponse.json(
        { error: "This stack has already been published" },
        { status: 409 }
      );
    }

    const post = await prisma.boardPost.create({
      data: {
        title: title.trim(),
        body: postBody?.trim() || null,
        userId: session.user.id,
        stackId,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err: unknown) {
    console.error("Create board post error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
