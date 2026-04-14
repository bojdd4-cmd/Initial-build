import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { COMPOUNDS, ANCILLARIES, getRatingBg, getRatingColor, getSideEffectRatingBg, getSideEffectRatingColor, type Compound } from "@/data/compounds";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).format(new Date(date));
}

function scoreColor(score: number | null) {
  if (score == null) return "badge-gray";
  if (score >= 80) return "badge-green";
  if (score >= 60) return "badge-yellow";
  if (score >= 40) return "badge-orange";
  return "badge-red";
}

function resolveCompound(id: string): Compound | null {
  return (COMPOUNDS.find((c) => c.id === id) ?? null) as Compound | null;
}

function resolveAny(id: string) {
  return COMPOUNDS.find((c) => c.id === id) ?? ANCILLARIES.find((c) => c.id === id) ?? null;
}

const EFFECT_LABELS: Record<string, string> = {
  muscleProteinSynthesis: "Muscle Protein Synthesis",
  nitrogenRetention: "Nitrogen Retention",
  strengthGains: "Strength Gains",
  redBloodCellProduction: "Red Blood Cell Production",
  fatLoss: "Fat Loss",
  glycogenStorage: "Glycogen Storage",
  recoverySpeed: "Recovery Speed",
  collagenSynthesis: "Collagen Synthesis",
};

const SIDE_EFFECT_LABELS: Record<string, string> = {
  hormonalSuppression: "Hormonal Suppression",
  estrogenicEffects: "Estrogenic Effects",
  androgenicEffects: "Androgenic Effects",
  cardiovascularStrain: "Cardiovascular Strain",
  liverStress: "Liver Stress",
  insulinResistance: "Insulin Resistance",
  moodChanges: "Mood Changes",
  prostateRisk: "Prostate Risk",
};

export default async function StackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth");

  const stack = await prisma.stack.findUnique({
    where: { id },
    include: { compounds: true },
  });

  if (!stack || stack.userId !== session.user.id) notFound();

  const mainCompounds = stack.compounds.filter((c) => !c.isAncillary);
  const ancillaries = stack.compounds.filter((c) => c.isAncillary);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/account" className="text-sm hover:underline" style={{ color: "var(--text-secondary)" }}>
            ← Back to Account
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-1">{stack.name}</h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Created {formatDate(stack.createdAt)} · {stack.durationWeeks} weeks
              {stack.goal && ` · ${stack.goal}`}
            </p>
          </div>
          {stack.overallScore != null && (
            <span className={`badge text-lg font-bold flex-shrink-0 ${scoreColor(stack.overallScore)}`}>
              {Math.round(stack.overallScore)}/100
            </span>
          )}
        </div>

        {/* AI Evaluation */}
        {stack.aiEvaluation && (
          <div className="card mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--accent)" }}>
              RoidAI Evaluation
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>
              {stack.aiEvaluation.replace(/[#*`]/g, "")}
            </p>
          </div>
        )}

        {/* Notes */}
        {stack.notes && (
          <div className="card mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>
              Notes
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>
              {stack.notes}
            </p>
          </div>
        )}

        {/* Main Compounds */}
        {mainCompounds.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              Compounds
            </h2>
            <div className="flex flex-col gap-4">
              {mainCompounds.map((sc) => {
                const compound = resolveCompound(sc.compoundId);
                return (
                  <div key={sc.id} className="card">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
                          {compound?.name ?? sc.compoundId}
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                          {sc.dosageMg}mg / {sc.frequency}
                          {compound && ` · Half-life: ${compound.halfLifeDays}d`}
                          {compound && ` · Anabolic: ${compound.anabolicRatio} / Androgenic: ${compound.androgenicRatio}`}
                        </p>
                      </div>
                      {compound && (
                        <Link href={`/compounds/${compound.id}`} className="btn btn-secondary text-xs whitespace-nowrap">
                          View Profile
                        </Link>
                      )}
                    </div>

                    {compound && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--accent)" }}>
                            Effects
                          </p>
                          {Object.entries(compound.effectRatings).map(([key, val]) => (
                            <div key={key} className="flex items-center gap-2 mb-1">
                              <span className="text-xs w-36 shrink-0" style={{ color: "var(--text-secondary)" }}>
                                {EFFECT_LABELS[key] ?? key}
                              </span>
                              <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                                <div
                                  className={`h-1.5 rounded-full ${getRatingBg(val as number)}`}
                                  style={{ width: `${((val as number) / 8) * 100}%` }}
                                />
                              </div>
                              <span className={`text-xs w-4 text-right ${getRatingColor(val as number)}`}>{val as number}</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-red-400">
                            Side Effects
                          </p>
                          {Object.entries(compound.sideEffectRatings).map(([key, val]) => (
                            <div key={key} className="flex items-center gap-2 mb-1">
                              <span className="text-xs w-36 shrink-0" style={{ color: "var(--text-secondary)" }}>
                                {SIDE_EFFECT_LABELS[key] ?? key}
                              </span>
                              <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                                <div
                                  className={`h-1.5 rounded-full ${getSideEffectRatingBg(val as number)}`}
                                  style={{ width: `${((val as number) / 8) * 100}%` }}
                                />
                              </div>
                              <span className={`text-xs w-4 text-right ${getSideEffectRatingColor(val as number)}`}>{val as number}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ancillaries */}
        {ancillaries.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              Ancillaries / PCT
            </h2>
            <div className="flex flex-col gap-2">
              {ancillaries.map((sc) => {
                const compound = resolveAny(sc.compoundId);
                return (
                  <div key={sc.id} className="card flex items-center justify-between gap-3 py-3">
                    <div>
                      <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                        {compound?.name ?? sc.compoundId}
                      </span>
                      <span className="text-xs ml-2" style={{ color: "var(--text-secondary)" }}>
                        {sc.dosageMg}mg / {sc.frequency}
                      </span>
                    </div>
                    {compound && (
                      <Link href={`/compounds/${compound.id}`} className="btn btn-secondary text-xs">
                        View Profile
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <Link href="/builder" className="btn btn-secondary">
            Re-evaluate in Builder
          </Link>
          <Link href={`/board/publish/${stack.id}`} className="btn btn-primary">
            Publish to Board
          </Link>
        </div>
      </div>
    </div>
  );
}
