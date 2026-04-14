"use client";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html>
      <body style={{ background: "#0a0a0f", color: "#f0f0ff", fontFamily: "monospace", padding: "2rem" }}>
        <h2 style={{ color: "#ef4444" }}>Global Error</h2>
        <pre style={{ background: "#111", border: "1px solid #ef4444", borderRadius: "8px", padding: "1rem", color: "#fca5a5", overflow: "auto", fontSize: "12px" }}>
          {error?.message}{"\n\n"}{error?.stack}
        </pre>
        <p style={{ color: "#555" }}>Digest: {error?.digest}</p>
      </body>
    </html>
  );
}
