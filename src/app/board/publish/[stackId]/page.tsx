"use client";

import { useState, useEffect, use, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface StackCompound {
  id: string;
  compoundId: string;
  dosageMg: number;
  frequency: string;
  isAncillary: boolean;
}

interface Stack {
  id: string;
  name: string;
  durationWeeks: number;
  overallScore: number | null;
  compounds: StackCompound[];
}

export default function PublishStackPage({
  params,
}: {
  params: Promise<{ stackId: string }>;
}) {
  const { stackId } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stack, setStack] = useState<Stack | null>(null);
  const [loadingStack, setLoadingStack] = useState(true);
  const [stackError, setStackError] = useState("");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch(`/api/stacks/${stackId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Stack not found");
        return res.json();
      })
      .then((data) => {
        setStack(data);
        setTitle(data.name);
      })
      .catch((err) => setStackError(err.message ?? "Failed to load stack"))
      .finally(() => setLoadingStack(false));
  }, [stackId, status]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image must be under 10MB.");
      return;
    }
    setUploadError("");
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        setUploading(true);
        const fd = new FormData();
        fd.append("file", imageFile);
        const upRes = await fetch("/api/upload", { method: "POST", body: fd });
        setUploading(false);
        if (!upRes.ok) {
          const upData = await upRes.json();
          setSubmitError(upData.error ?? "Image upload failed");
          setSubmitting(false);
          return;
        }
        const upData = await upRes.json();
        imageUrl = upData.url;
      }

      const res = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stackId: stackId,
          title: title.trim(),
          body: body.trim() || undefined,
          imageUrl,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error ?? "Failed to publish post");
        return;
      }
      router.push("/board");
    } catch {
      setSubmitError("Something went wrong");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  }

  if (status === "loading" || loadingStack) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-primary)" }}
      >
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      </div>
    );
  }

  if (stackError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-primary)" }}
      >
        <div className="card text-center">
          <p className="text-red-400 mb-4">{stackError}</p>
          <a href="/account" className="btn btn-secondary">
            Back to Account
          </a>
        </div>
      </div>
    );
  }

  const isBusy = submitting || uploading;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a
            href="/account"
            className="text-sm hover:underline"
            style={{ color: "var(--text-secondary)" }}
          >
            ← Back to Account
          </a>
        </div>

        <h1 className="text-3xl font-bold gradient-text mb-2">
          Share Your Stack
        </h1>
        <p className="mb-8 text-sm" style={{ color: "var(--text-secondary)" }}>
          Publish your cycle to the Roid Board for the community to see.
        </p>

        {stack && (
          <div
            className="rounded-lg p-4 mb-6 border"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-xs uppercase tracking-wider font-semibold mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Publishing stack
            </p>
            <p
              className="font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {stack.name}
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {stack.durationWeeks} weeks ·{" "}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {stack.compounds.filter((c: any) => !c.isAncillary).length} compounds
              {stack.overallScore != null &&
                ` · Score: ${Math.round(stack.overallScore)}`}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card">
          {submitError && (
            <p className="text-sm text-red-400 mb-4">{submitError}</p>
          )}

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="input w-full"
              placeholder="e.g. My first test-e bulk cycle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isBusy}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              Description{" "}
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                (optional)
              </span>
            </label>
            <textarea
              className="input w-full resize-none"
              rows={5}
              placeholder="Share your goals, experience level, context about this cycle..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={isBusy}
            />
          </div>

          {/* Image upload */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              Photo{" "}
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                (optional · max 10MB)
              </span>
            </label>

            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden" style={{ maxHeight: 300 }}>
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={600}
                  height={300}
                  className="w-full object-cover rounded-lg"
                  style={{ maxHeight: 300 }}
                  unoptimized
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm transition-colors"
                  disabled={isBusy}
                >
                  ✕
                </button>
              </div>
            ) : (
              <label
                className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed cursor-pointer transition-colors py-8 px-4"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-sm">Click to upload a photo</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isBusy}
                />
              </label>
            )}

            {uploadError && (
              <p className="text-xs text-red-400 mt-1">{uploadError}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isBusy || !title.trim()}
            >
              {uploading ? "Uploading image..." : submitting ? "Publishing..." : "Publish to Board"}
            </button>
            <a href="/account" className="btn btn-secondary">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
