import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function scoreColor(score: number | null) {
  if (score == null) return "badge-gray";
  if (score >= 80) return "badge-green";
  if (score >= 60) return "badge-yellow";
  if (score >= 40) return "badge-orange";
  return "badge-red";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const stacks = await prisma.stack.findMany({
    where: { userId: session.user.id },
    include: { compounds: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-bold gradient-text mb-1"
            >
              My Account
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Welcome back,{" "}
              <span style={{ color: "var(--text-primary)" }}>
                {session.user.username || session.user.email}
              </span>
            </p>
          </div>
          <Link href="/builder" className="btn btn-primary">
            New Stack
          </Link>
        </div>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Saved Stacks
            </h2>
            <span className="badge badge-gray">{stacks.length}</span>
          </div>

          {stacks.length === 0 ? (
            <div
              className="card text-center py-16"
              style={{ border: "1px dashed var(--border)" }}
            >
              <div className="text-5xl mb-4">🧪</div>
              <p
                className="text-lg font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                No stacks saved yet
              </p>
              <p
                className="mb-6"
                style={{ color: "var(--text-secondary)" }}
              >
                Build and evaluate your first cycle to get started.
              </p>
              <Link href="/builder" className="btn btn-primary">
                Open Stack Builder
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stacks.map((stack) => {
                const mainCompounds = stack.compounds.filter(
                  (c) => !c.isAncillary
                );
                return (
                  <div
                    key={stack.id}
                    className="card flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-lg truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {stack.name}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {formatDate(stack.createdAt)}
                        </p>
                      </div>
                      {stack.overallScore != null && (
                        <span
                          className={`badge text-sm font-semibold flex-shrink-0 ${scoreColor(stack.overallScore)}`}
                        >
                          {Math.round(stack.overallScore)}/100
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="badge badge-blue">
                        {stack.durationWeeks} weeks
                      </span>
                      <span className="badge badge-gray">
                        {mainCompounds.length} compound
                        {mainCompounds.length !== 1 ? "s" : ""}
                      </span>
                      {stack.goal && (
                        <span className="badge badge-yellow">{stack.goal}</span>
                      )}
                    </div>

                    {stack.aiEvaluation && (
                      <p
                        className="text-sm line-clamp-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {stack.aiEvaluation.replace(/[#*`]/g, "").slice(0, 120)}
                        ...
                      </p>
                    )}

                    <div className="flex gap-2 mt-auto pt-1">
                      <Link
                        href="/builder"
                        className="btn btn-secondary text-sm flex-1 text-center"
                      >
                        Re-evaluate
                      </Link>
                      <Link
                        href={`/board/publish/${stack.id}`}
                        className="btn btn-primary text-sm flex-1 text-center"
                      >
                        Publish to Board
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
