"use client";

import { useState } from "react";

interface Comment {
  id: string;
  body: string;
  username: string;
  createdAt: string;
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommentSection({
  postId,
  initialComments,
  isLoggedIn,
}: {
  postId: string;
  initialComments: Comment[];
  isLoggedIn: boolean;
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/board/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to post comment");
        return;
      }
      const comment = await res.json();
      setComments((prev) => [
        ...prev,
        {
          id: comment.id,
          body: comment.body,
          username: comment.user.username,
          createdAt: comment.createdAt,
        },
      ]);
      setBody("");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2
        className="text-lg font-semibold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Comments ({comments.length})
      </h2>

      {comments.length === 0 && (
        <p
          className="text-sm mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          No comments yet. Be the first to comment.
        </p>
      )}

      <div className="flex flex-col gap-3 mb-6">
        {comments.map((c) => (
          <div
            key={c.id}
            className="rounded-lg p-3"
            style={{ background: "var(--bg-secondary)" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {c.username}
              </span>
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {timeAgo(c.createdAt)}
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {c.body}
            </p>
          </div>
        ))}
      </div>

      {isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <div className="divider mb-4" />
          {error && (
            <p className="text-sm text-red-400 mb-2">{error}</p>
          )}
          <textarea
            className="input w-full resize-none mb-3"
            rows={3}
            placeholder="Write a comment..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !body.trim()}
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          <a href="/auth" className="underline" style={{ color: "var(--accent)" }}>
            Sign in
          </a>{" "}
          to leave a comment.
        </p>
      )}
    </div>
  );
}
