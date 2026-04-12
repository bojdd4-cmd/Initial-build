import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  COMPOUNDS,
  getCompoundById,
  getRatingHex,
  getRatingColor,
  getEffectRatingLabel,
} from "@/data/compounds";
import type { EffectRatings, SideEffectRatings } from "@/data/compounds";

export function generateStaticParams() {
  return COMPOUNDS.map((c) => ({ id: c.id }));
}

const EFFECT_LABELS: Record<keyof EffectRatings, string> = {
  muscleProteinSynthesis: "Muscle Protein Synthesis",
  nitrogenRetention: "Nitrogen Retention",
  strengthGains: "Strength Gains",
  redBloodCellProduction: "Red Blood Cell Production",
  fatLoss: "Fat Loss",
  glycogenStorage: "Glycogen Storage",
  recoverySpeed: "Recovery Speed",
  collagenSynthesis: "Collagen Synthesis",
};

const SIDE_EFFECT_LABELS: Record<keyof SideEffectRatings, string> = {
  hormonalSuppression: "Hormonal Suppression",
  estrogenicEffects: "Estrogenic Effects",
  androgenicEffects: "Androgenic Effects",
  cardiovascularStrain: "Cardiovascular Strain",
  liverStress: "Liver Stress",
  insulinResistance: "Insulin Resistance",
  moodChanges: "Mood Changes",
  prostateRisk: "Prostate Risk",
};

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[var(--text-secondary)] w-48 shrink-0">{label}</span>
      <div className="rating-bar flex-1">
        <div
          className="rating-bar-fill"
          style={{ width: `${(value / 8) * 100}%`, background: getRatingHex(value) }}
        />
      </div>
      <span className={`text-sm font-mono font-semibold w-6 text-right ${getRatingColor(value)}`}>
        {value}
      </span>
      <span className="text-xs text-[var(--text-muted)] w-16">{getEffectRatingLabel(value)}</span>
    </div>
  );
}

export default async function CompoundDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const compound = getCompoundById(id);

  if (!compound) notFound();

  const effectEntries = Object.entries(compound.effectRatings) as [keyof EffectRatings, number][];
  const sideEffectEntries = Object.entries(compound.sideEffectRatings) as [
    keyof SideEffectRatings,
    number
  ][];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link
        href="/compounds"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[#22c55e] transition-colors mb-8"
      >
        ← Back to Compounds
      </Link>

      {/* Header */}
      <div className="card p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className={`badge ${compound.type === "injectable" ? "badge-blue" : "badge-orange"}`}
              >
                {compound.type}
              </span>
              <span className="badge badge-gray">{compound.category}</span>
            </div>

            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{compound.name}</h1>

            {compound.aliases.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-6">
                {compound.aliases.map((alias) => (
                  <span key={alias} className="badge badge-gray">
                    {alias}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold font-mono gradient-text">
                  {compound.anabolicRatio}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Anabolic Ratio</div>
              </div>
              <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold font-mono text-orange-400">
                  {compound.androgenicRatio}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Androgenic Ratio</div>
              </div>
              <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
                  {compound.halfLifeDays}d
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Half-Life</div>
              </div>
            </div>

            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              {compound.description}
            </p>

            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                Mechanism of Action
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {compound.mechanismOfAction}
              </p>
            </div>
          </div>

          {compound.moleculeImageUrl && (
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="bg-white rounded-xl p-3 w-48 h-48 flex items-center justify-center">
                <Image
                  src={compound.moleculeImageUrl}
                  alt={`${compound.name} molecule`}
                  width={180}
                  height={180}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-xs text-[var(--text-muted)]">Molecular structure</span>
            </div>
          )}
        </div>
      </div>

      {/* Typical Dose Table */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Typical Dosing</h2>
        <div className="grid grid-cols-3 gap-4">
          {(["low", "moderate", "high"] as const).map((level) => (
            <div key={level} className="bg-[var(--bg-secondary)] rounded-lg p-4 text-center">
              <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
                {compound.typicalDoseMgPerWeek[level]}
                <span className="text-sm font-normal text-[var(--text-muted)]"> mg</span>
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1 capitalize">{level} / week</div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Flags */}
      {compound.warningFlags.length > 0 && (
        <div className="mb-6 border border-red-500/30 bg-red-500/5 rounded-xl p-5">
          <h2 className="text-base font-semibold text-red-400 mb-3 flex items-center gap-2">
            ⚠ Warning Flags
          </h2>
          <ul className="space-y-1">
            {compound.warningFlags.map((flag) => (
              <li key={flag} className="text-sm text-red-300 flex items-start gap-2">
                <span className="mt-0.5 shrink-0">•</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Rating Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-5">Effect Profile</h2>
          <div className="space-y-4">
            {effectEntries.map(([key, value]) => (
              <RatingBar key={key} label={EFFECT_LABELS[key]} value={value} />
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-5">
            Side Effect Profile
          </h2>
          <div className="space-y-4">
            {sideEffectEntries.map(([key, value]) => (
              <RatingBar key={key} label={SIDE_EFFECT_LABELS[key]} value={value} />
            ))}
          </div>
        </div>
      </div>

      {/* Studies */}
      {compound.studies.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-5">
            Research Studies
          </h2>
          <div className="space-y-4">
            {compound.studies.map((study, i) => (
              <div
                key={i}
                className="border border-[var(--border-subtle)] rounded-lg p-4 bg-[var(--bg-secondary)]"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)] leading-snug">
                      {study.title}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {study.authors} · {study.year}
                    </p>
                  </div>
                  {study.pubmedId && (
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${study.pubmedId}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="badge badge-green shrink-0 hover:opacity-80 transition-opacity"
                    >
                      PubMed
                    </a>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {study.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
