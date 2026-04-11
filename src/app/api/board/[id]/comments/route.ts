import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { body: commentBody } = body;

    if (!commentBody || typeof commentBody !== "string" || commentBody.trim().length === 0) {
      return NextResponse.json({ error: "Comment body is required" }, { status: 400 });
    }

    const post = await prisma.boardPost.findUnique({ where: { id: params.id } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        body: commentBody.trim(),
        userId: session.user.id,
        postId: params.id,
      },
      include: { user: { select: { username: true } } },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (err: unknown) {
    console.error("Create comment error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
