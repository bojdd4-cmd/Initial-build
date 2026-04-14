"use client";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h2 className="text-xl font-bold text-red-400 mb-4">Application Error</h2>
      <pre className="text-left text-xs bg-[#111] border border-red-500/30 rounded-xl p-4 text-red-300 overflow-auto">
        {error?.message || "Unknown error"}
        {"\n"}
        {error?.stack || ""}
      </pre>
      <p className="text-[var(--text-muted)] text-xs mt-4">Digest: {error?.digest}</p>
    </div>
  );
}
