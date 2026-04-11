"use client";

import { useState } from "react";

export default function LikeButton({
  postId,
  initialLiked,
  initialCount,
  isLoggedIn,
}: {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  isLoggedIn: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (!isLoggedIn) {
      window.location.href = "/auth";
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/board/${postId}/like`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setCount(data.count);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium border"
      style={{
        background: liked ? "rgba(34,197,94,0.12)" : "var(--bg-secondary)",
        borderColor: liked ? "#22c55e" : "var(--border)",
        color: liked ? "#22c55e" : "var(--text-secondary)",
        cursor: loading ? "default" : "pointer",
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      {count}
    </button>
  );
}
