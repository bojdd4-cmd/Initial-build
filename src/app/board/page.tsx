import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { COMPOUNDS } from "@/data/compounds";

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function scoreClass(score: number | null): string {
  if (score == null) return "badge-gray";
  if (score >= 80) return "badge-green";
  if (score >= 60) return "badge-yellow";
  if (score >= 40) return "badge-orange";
  return "badge-red";
}

function resolveCompoundName(id: string): string {
  const match = COMPOUNDS.find((c) => c.id === id);
  return match ? match.name : id;
}

export default async function BoardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let posts: any[] = [];

  try {
    posts = await prisma.boardPost.findMany({
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
  } catch (e) {
    console.error("Board DB error:", e);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Roid Board</h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Community-shared steroid cycles and stack evaluations
            </p>
          </div>
          <Link href="/account" className="btn btn-primary whitespace-nowrap">
            Share Your Stack
          </Link>
        </div>

        {posts.length === 0 && (
          <div
            className="card text-center py-16"
            style={{ color: "var(--text-secondary)" }}
          >
            <p className="text-lg mb-2">No posts yet</p>
            <p className="text-sm">Be the first to share your stack with the community.</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {posts.map((post) => {
            const mainCompounds = post.stack.compounds.filter(
              (c) => !c.isAncillary
            );
            const compoundNames = mainCompounds
              .slice(0, 4)
              .map((c) => resolveCompoundName(c.compoundId));
            const extra = mainCompounds.length - compoundNames.length;

            return (
              <Link key={post.id} href={`/board/${post.id}`} className="block">
                <div
                  className="card hover:border-[var(--accent)] transition-colors cursor-pointer"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2
                        className="text-lg font-semibold mb-1 truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {post.title}
                      </h2>
                      <div
                        className="text-sm mb-3"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span
                          className="font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {post.user.username}
                        </span>
                        {" · "}
                        {timeAgo(post.createdAt)}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {post.stack.name}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {post.stack.durationWeeks}wk
                        </span>
                        {post.stack.overallScore != null && (
                          <span
                            className={`badge ${scoreClass(post.stack.overallScore)}`}
                          >
                            Score: {Math.round(post.stack.overallScore)}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {compoundNames.map((name) => (
                          <span key={name} className="badge badge-blue text-xs">
                            {name}
                          </span>
                        ))}
                        {extra > 0 && (
                          <span className="badge badge-gray text-xs">
                            +{extra} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className="flex flex-col items-end gap-2 shrink-0"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          {post._count.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          {post._count.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
