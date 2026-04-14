import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { COMPOUNDS } from "@/data/compounds";
import CommentSection from "./CommentSection";
import LikeButton from "./LikeButton";

function resolveCompoundName(id: string): string {
  const match = COMPOUNDS.find((c) => c.id === id);
  return match ? match.name : id;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function scoreClass(score: number | null): string {
  if (score == null) return "badge-gray";
  if (score >= 80) return "badge-green";
  if (score >= 60) return "badge-yellow";
  if (score >= 40) return "badge-orange";
  return "badge-red";
}

export default async function BoardPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const post = await prisma.boardPost.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, username: true } },
      stack: {
        include: {
          compounds: true,
        },
      },
      comments: {
        include: { user: { select: { username: true } } },
        orderBy: { createdAt: "asc" },
      },
      likes: { select: { userId: true } },
    },
  });

  if (!post) notFound();

  const currentUserId = session?.user?.id ?? null;
  const userLiked = currentUserId
    ? post.likes.some((l) => l.userId === currentUserId)
    : false;
  const likeCount = post.likes.length;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mainCompounds = post.stack.compounds.filter((c: any) => !c.isAncillary);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ancillaries = post.stack.compounds.filter((c: any) => c.isAncillary);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a
            href="/board"
            className="text-sm hover:underline"
            style={{ color: "var(--text-secondary)" }}
          >
            ← Back to Roid Board
          </a>
        </div>

        <div className="card mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1
                className="text-2xl font-bold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {post.title}
              </h1>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Posted by{" "}
                <span
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {post.user.username}
                </span>{" "}
                on {formatDate(post.createdAt)}
              </p>
            </div>
            <LikeButton
              postId={post.id}
              initialLiked={userLiked}
              initialCount={likeCount}
              isLoggedIn={!!currentUserId}
            />
          </div>

          {post.body && (
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}
            >
              {post.body}
            </p>
          )}
        </div>

        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Stack: {post.stack.name}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {post.stack.durationWeeks} weeks
              </span>
              {post.stack.overallScore != null && (
                <span className={`badge ${scoreClass(post.stack.overallScore)}`}>
                  Score: {Math.round(post.stack.overallScore)}
                </span>
              )}
            </div>
          </div>

          {mainCompounds.length > 0 && (
            <div className="mb-4">
              <h3
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Main Compounds
              </h3>
              <div className="flex flex-col gap-2">
                {mainCompounds.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between text-sm py-2 px-3 rounded-lg"
                    style={{ background: "var(--bg-secondary)" }}
                  >
                    <span style={{ color: "var(--text-primary)" }}>
                      {resolveCompoundName(c.compoundId)}
                    </span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {c.dosageMg}mg/{c.frequency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {ancillaries.length > 0 && (
            <div className="mb-4">
              <h3
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Ancillaries / PCT
              </h3>
              <div className="flex flex-col gap-2">
                {ancillaries.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between text-sm py-2 px-3 rounded-lg"
                    style={{ background: "var(--bg-secondary)" }}
                  >
                    <span style={{ color: "var(--text-primary)" }}>
                      {resolveCompoundName(c.compoundId)}
                    </span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {c.dosageMg}mg/{c.frequency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {post.stack.aiEvaluation && (
            <>
              <div className="divider" />
              <div>
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  AI Evaluation
                </h3>
                <pre
                  className="text-sm leading-relaxed whitespace-pre-wrap font-sans"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {post.stack.aiEvaluation}
                </pre>
              </div>
            </>
          )}
        </div>

        <CommentSection
          postId={post.id}
          initialComments={post.comments.map((c) => ({
            id: c.id,
            body: c.body,
            username: c.user.username,
            createdAt: c.createdAt.toISOString(),
          }))}
          isLoggedIn={!!currentUserId}
        />
      </div>
    </div>
  );
}
