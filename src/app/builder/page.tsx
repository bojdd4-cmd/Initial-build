"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { COMPOUNDS } from "@/data/compounds";
import type { Compound } from "@/data/compounds";
import NeedSourceButton from "@/components/NeedSourceButton";

interface StackEntry {
  compound: Compound;
  dosageMg: number;
  frequency: string;
}

interface AncillaryRec {
  name: string;
  dose: string;
  reason: string;
}

interface EvaluationResult {
  overallScore: number;
  grade: string;
  evaluation: string;
  risks: string[];
  recommendations: string[];
  ancillariesRecommended: AncillaryRec[];
}

const FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "eod", label: "Every Other Day" },
  { value: "twice_weekly", label: "Twice Weekly" },
  { value: "weekly", label: "Weekly" },
];

function gradeColor(grade: string) {
  if (grade === "A") return "badge-green";
  if (grade === "B") return "badge-blue";
  if (grade === "C") return "badge-yellow";
  if (grade === "D") return "badge-orange";
  return "badge-red";
}

function scoreColor(score: number) {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

export default function BuilderPage() {
  const { data: session } = useSession();

  const [stackName, setStackName] = useState("");
  const [stack, setStack] = useState<StackEntry[]>([]);
  const [durationWeeks, setDurationWeeks] = useState(12);
  const [goal, setGoal] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  // Premium toggle — default OFF. Only usable if the session user is premium.
  const [usePremium, setUsePremium] = useState(false);
  const isPremium = !!session?.user?.isPremium;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return COMPOUNDS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.aliases.some((a) => a.toLowerCase().includes(q))
    );
  }, [search]);

  function addCompound(compound: Compound) {
    if (stack.find((e) => e.compound.id === compound.id)) return;
    setStack((prev) => [
      ...prev,
      {
        compound,
        dosageMg: compound.typicalDoseMgPerWeek.moderate,
        frequency: "weekly",
      },
    ]);
    setResult(null);
    setSaved(false);
  }

  function removeCompound(id: string) {
    setStack((prev) => prev.filter((e) => e.compound.id !== id));
    setResult(null);
    setSaved(false);
  }

  function updateDosage(id: string, dosageMg: number) {
    setStack((prev) =>
      prev.map((e) => (e.compound.id === id ? { ...e, dosageMg } : e))
    );
    setResult(null);
    setSaved(false);
  }

  function updateFrequency(id: string, frequency: string) {
    setStack((prev) =>
      prev.map((e) => (e.compound.id === id ? { ...e, frequency } : e))
    );
    setResult(null);
    setSaved(false);
  }

  async function handleEvaluate() {
    if (stack.length === 0) {
      setError("Add at least one compound to your stack.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: stackName || "My Stack",
          compounds: stack.map((e) => ({
            compoundId: e.compound.id,
            dosageMg: e.dosageMg,
            frequency: e.frequency,
          })),
          durationWeeks,
          goal,
          premium: isPremium && usePremium,
        }),
      });
      if (!res.ok) throw new Error("Evaluation failed. Please try again.");
      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result) return;
    setSaving(true);
    try {
      const res = await fetch("/api/stacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: stackName || "My Stack",
          compounds: stack.map((e) => ({
            compoundId: e.compound.id,
            dosageMg: e.dosageMg,
            frequency: e.frequency,
            isAncillary: false,
          })),
          durationWeeks,
          goal,
          overallScore: result.overallScore,
          aiEvaluation: result.evaluation,
        }),
      });
      if (!res.ok) throw new Error("Failed to save stack.");
      setSaved(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Stack Builder
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Build your cycle, then let RoidAI evaluate it for safety and
            effectiveness.
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Stack Name
            </label>
            <input
              className="input w-full"
              placeholder="e.g. Test E + Deca Bulk"
              value={stackName}
              onChange={(e) => setStackName(e.target.value)}
            />
          </div>
          <div className="w-40">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Duration (weeks)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="input w-full"
              value={durationWeeks}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                if (raw !== "") setDurationWeeks(Number(raw));
              }}
              onBlur={() =>
                setDurationWeeks((v) => Math.min(24, Math.max(8, v || 8)))
              }
            />
          </div>
          <div className="flex-1">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Goal (optional)
            </label>
            <input
              className="input w-full"
              placeholder="e.g. Bulk, Cut, Recomp"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  Compounds
                </h2>
                <span className="badge badge-gray text-xs">
                  {COMPOUNDS.length} available
                </span>
              </div>
              <input
                className="input w-full mb-4"
                placeholder="Search compounds..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div
                className="space-y-2 overflow-y-auto pr-1"
                style={{ maxHeight: "520px" }}
              >
                {filtered.map((c) => {
                  const inStack = stack.some((e) => e.compound.id === c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => addCompound(c)}
                      disabled={inStack}
                      className="w-full text-left rounded-lg px-4 py-3 transition-all"
                      style={{
                        background: inStack
                          ? "rgba(34,197,94,0.08)"
                          : "var(--bg-secondary)",
                        border: `1px solid ${inStack ? "rgba(34,197,94,0.4)" : "var(--border)"}`,
                        cursor: inStack ? "default" : "pointer",
                        opacity: inStack ? 0.7 : 1,
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="font-medium truncate"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {c.name}
                            </span>
                            {inStack && (
                              <span className="badge badge-green text-xs flex-shrink-0">
                                Added
                              </span>
                            )}
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                            A:{c.anabolicRatio} / AR:{c.androgenicRatio}
                          </div>
                        </div>
                        <span
                          className={`badge flex-shrink-0 text-xs ${
                            c.type === "injectable"
                              ? "badge-blue"
                              : "badge-orange"
                          }`}
                        >
                          {c.type}
                        </span>
                      </div>
                    </button>
                  );
                })}
                {filtered.length === 0 && (
                  <p
                    className="text-center py-8"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    No compounds match your search.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="card">
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Your Stack
                {stack.length > 0 && (
                  <span className="ml-2 badge badge-gray text-xs">
                    {stack.length} compound{stack.length !== 1 ? "s" : ""}
                  </span>
                )}
              </h2>

              {stack.length === 0 ? (
                <div
                  className="text-center py-10 rounded-lg"
                  style={{
                    border: "1px dashed var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <div className="text-4xl mb-3">🧪</div>
                  <p>Your stack is empty.</p>
                  <p className="text-sm mt-1">
                    Select compounds from the left to add them.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stack.map((entry) => (
                    <div
                      key={entry.compound.id}
                      className="rounded-lg p-3"
                      style={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {entry.compound.name}
                          </span>
                          <span
                            className={`ml-2 badge text-xs ${
                              entry.compound.type === "injectable"
                                ? "badge-blue"
                                : "badge-orange"
                            }`}
                          >
                            {entry.compound.type}
                          </span>
                        </div>
                        <button
                          onClick={() => removeCompound(entry.compound.id)}
                          className="text-xs px-2 py-0.5 rounded transition-colors"
                          style={{
                            color: "#ef4444",
                            border: "1px solid rgba(239,68,68,0.3)",
                            background: "rgba(239,68,68,0.08)",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label
                            className="text-xs mb-1 block"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Dosage (mg/week)
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="input w-full text-sm"
                            value={entry.dosageMg}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, "");
                              if (raw !== "")
                                updateDosage(entry.compound.id, Number(raw));
                            }}
                            onBlur={() =>
                              updateDosage(
                                entry.compound.id,
                                Math.max(1, entry.dosageMg || 1)
                              )
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <label
                            className="text-xs mb-1 block"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Frequency
                          </label>
                          <select
                            className="input w-full text-sm"
                            value={entry.frequency}
                            onChange={(e) =>
                              updateFrequency(entry.compound.id, e.target.value)
                            }
                          >
                            {FREQUENCIES.map((f) => (
                              <option key={f.value} value={f.value}>
                                {f.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div
                  className="mt-4 rounded-lg px-4 py-3 text-sm"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#ef4444",
                  }}
                >
                  {error}
                </div>
              )}

              {/* RoidAI model toggle */}
              <div
                className="mt-4 rounded-lg p-3 flex items-center justify-between gap-3"
                style={{
                  background: usePremium && isPremium ? "rgba(34,197,94,0.08)" : "var(--bg-secondary)",
                  border: `1px solid ${usePremium && isPremium ? "rgba(34,197,94,0.35)" : "var(--border)"}`,
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                    RoidAI
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isPremium) return;
                      setUsePremium((v) => !v);
                    }}
                    disabled={!isPremium}
                    aria-pressed={usePremium && isPremium}
                    aria-label="Toggle RoidAI Premium"
                    className="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors"
                    style={{
                      background: usePremium && isPremium ? "#22c55e" : "#2a2a3d",
                      cursor: isPremium ? "pointer" : "not-allowed",
                      opacity: isPremium ? 1 : 0.6,
                    }}
                  >
                    <span
                      className="inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform"
                      style={{
                        transform: usePremium && isPremium ? "translateX(22px)" : "translateX(2px)",
                        marginTop: 2,
                      }}
                    />
                  </button>
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: usePremium && isPremium ? "#22c55e" : "var(--text-muted)",
                    }}
                  >
                    Premium
                  </span>
                </div>
                {!isPremium && (
                  <Link
                    href="/premium"
                    className="text-xs font-bold text-[#22c55e] hover:underline whitespace-nowrap"
                  >
                    Unlock →
                  </Link>
                )}
                {isPremium && (
                  <span className="text-xs whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                    {usePremium ? "Grok 4.2 reasoning" : "Grok 3 (default)"}
                  </span>
                )}
              </div>

              <button
                onClick={handleEvaluate}
                disabled={loading || stack.length === 0}
                className="btn btn-primary w-full mt-3"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent" />
                    RoidAI{usePremium && isPremium ? " Premium" : ""} is thinking...
                  </span>
                ) : (
                  `Evaluate with RoidAI${usePremium && isPremium ? " Premium" : ""}`
                )}
              </button>
            </div>

            {loading && (
              <div
                className="card text-center py-8"
                style={{ border: "1px solid rgba(34,197,94,0.3)" }}
              >
                <div className="flex justify-center gap-1 mb-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        background: "#22c55e",
                        animationDelay: `${i * 0.12}s`,
                      }}
                    />
                  ))}
                </div>
                <p
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  RoidAI is analyzing your cycle...
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Evaluating pharmacology, interactions, and risk profile
                </p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                <div
                  className="card"
                  style={{ border: "1px solid rgba(34,197,94,0.25)" }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                      style={{
                        background: `${scoreColor(result.overallScore)}22`,
                        border: `3px solid ${scoreColor(result.overallScore)}`,
                        color: scoreColor(result.overallScore),
                      }}
                    >
                      {result.overallScore}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`badge text-base font-bold px-3 py-1 ${gradeColor(result.grade)}`}
                        >
                          Grade {result.grade}
                        </span>
                      </div>
                      <p
                        className="text-sm mt-1"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Overall score out of 100 — higher is safer &amp; more
                        optimal
                      </p>
                    </div>
                  </div>

                  <div
                    className="rounded-lg p-4 mb-4 prose-sm"
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      lineHeight: "1.7",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {result.evaluation}
                  </div>

                  {result.risks.length > 0 && (
                    <div className="mb-4">
                      <h3
                        className="text-sm font-semibold mb-2"
                        style={{ color: "#ef4444" }}
                      >
                        Risks
                      </h3>
                      <ul className="space-y-1">
                        {result.risks.map((risk, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span style={{ color: "#ef4444" }}>⚠</span>
                            <span style={{ color: "var(--text-secondary)" }}>
                              {risk}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.recommendations.length > 0 && (
                    <div className="mb-4">
                      <h3
                        className="text-sm font-semibold mb-2"
                        style={{ color: "#22c55e" }}
                      >
                        Recommendations
                      </h3>
                      <ul className="space-y-1">
                        {result.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span style={{ color: "#22c55e" }}>✓</span>
                            <span style={{ color: "var(--text-secondary)" }}>
                              {rec}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.ancillariesRecommended.length > 0 && (
                    <div>
                      <h3
                        className="text-sm font-semibold mb-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Recommended Ancillaries
                      </h3>
                      <div className="space-y-2">
                        {result.ancillariesRecommended.map((anc, i) => (
                          <div
                            key={i}
                            className="rounded-lg px-3 py-2"
                            style={{
                              background: "var(--bg-secondary)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            <div className="flex flex-wrap items-center gap-2 mb-0.5">
                              <span
                                className="font-medium text-sm"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {anc.name}
                              </span>
                              <span className="badge badge-blue text-xs">
                                {anc.dose}
                              </span>
                              <NeedSourceButton compoundName={anc.name} size="sm" />
                            </div>
                            <p
                              className="text-xs"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {anc.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {session?.user && (
                  <button
                    onClick={handleSave}
                    disabled={saving || saved}
                    className={`btn w-full ${saved ? "btn-secondary" : "btn-primary"}`}
                  >
                    {saved
                      ? "Stack Saved ✓"
                      : saving
                      ? "Saving..."
                      : "Save Stack"}
                  </button>
                )}
              </div>
            )}

            <div
              className="rounded-lg px-4 py-3 text-xs"
              style={{
                background: "rgba(255,200,0,0.06)",
                border: "1px solid rgba(255,200,0,0.15)",
                color: "var(--text-secondary)",
              }}
            >
              <strong style={{ color: "#eab308" }}>Disclaimer:</strong> RoidAI
              is for educational and harm-reduction purposes only. This is not
              medical advice. Anabolic steroids are controlled substances in
              many jurisdictions. Consult a healthcare professional before
              making any decisions about your health.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
