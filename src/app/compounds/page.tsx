import Link from "next/link";
import { COMPOUNDS, ANCILLARIES, getRatingHex } from "@/data/compounds";
import type { Compound, Ancillary, EffectRatings } from "@/data/compounds";

const EFFECT_LABELS: Record<keyof EffectRatings, string> = {
  muscleProteinSynthesis: "MPS",
  nitrogenRetention: "N-Ret",
  strengthGains: "Strength",
  redBloodCellProduction: "RBC",
  fatLoss: "Fat Loss",
  glycogenStorage: "Glycogen",
  recoverySpeed: "Recovery",
  collagenSynthesis: "Collagen",
};

function CompoundCard({ compound }: { compound: Compound }) {
  const effectEntries = Object.entries(compound.effectRatings) as [
    keyof EffectRatings,
    number
  ][];

  return (
    <Link href={`/compounds/${compound.id}`} className="card p-5 block hover:no-underline group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)] text-base group-hover:text-[#22c55e] transition-colors">
            {compound.name}
          </h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {compound.aliases.map((alias) => (
              <span
                key={alias}
                className="badge badge-gray"
              >
                {alias}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end shrink-0">
          <span className={`badge ${compound.type === "injectable" ? "badge-blue" : "badge-orange"}`}>
            {compound.type}
          </span>
          <span className="badge badge-gray">{compound.category}</span>
        </div>
      </div>

      <div className="flex gap-4 text-xs text-[var(--text-secondary)] mb-3">
        <span>
          <span className="text-[var(--text-muted)]">A:A </span>
          <span className="text-[var(--text-primary)] font-mono font-medium">
            {compound.anabolicRatio}:{compound.androgenicRatio}
          </span>
        </span>
        <span>
          <span className="text-[var(--text-muted)]">t½ </span>
          <span className="text-[var(--text-primary)] font-mono font-medium">
            {compound.halfLifeDays}d
          </span>
        </span>
      </div>

      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-2">
        {compound.description}
      </p>

      <div className="space-y-1.5">
        {effectEntries.map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--text-muted)] w-14 shrink-0">
              {EFFECT_LABELS[key]}
            </span>
            <div className="rating-bar flex-1">
              <div
                className="rating-bar-fill"
                style={{ width: `${(value / 8) * 100}%`, background: getRatingHex(value) }}
              />
            </div>
            <span className="text-[10px] text-[var(--text-muted)] w-4 text-right">{value}</span>
          </div>
        ))}
      </div>

      {compound.warningFlags.length > 0 && (
        <div className="mt-3 pt-2 border-t border-[var(--border-subtle)]">
          <span className="badge badge-red text-[9px]">⚠ {compound.warningFlags.length} warning{compound.warningFlags.length > 1 ? "s" : ""} — click to view</span>
        </div>
      )}
    </Link>
  );
}

function AncillaryCard({ ancillary }: { ancillary: Ancillary }) {
  const categoryColorMap: Record<Ancillary["category"], string> = {
    "aromatase-inhibitor": "badge-blue",
    serm: "badge-green",
    "prolactin-control": "badge-yellow",
    "liver-support": "badge-orange",
    hcg: "badge-gray",
    other: "badge-gray",
  };

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-[var(--text-primary)] text-sm">{ancillary.name}</h3>
        <span className={`badge ${categoryColorMap[ancillary.category]} shrink-0`}>
          {ancillary.category}
        </span>
      </div>
      {ancillary.aliases.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {ancillary.aliases.map((alias) => (
            <span key={alias} className="badge badge-gray">
              {alias}
            </span>
          ))}
        </div>
      )}
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
        {ancillary.description}
      </p>
      <div className="text-xs">
        <span className="text-[var(--text-muted)]">Typical dose: </span>
        <span className="text-[var(--text-primary)] font-medium">{ancillary.typicalDose}</span>
      </div>
      {ancillary.usedFor.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {ancillary.usedFor.map((use) => (
            <span key={use} className="badge badge-gray text-[9px]">
              {use}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CompoundsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3">
          <span className="gradient-text">Compound Database</span>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-2xl">
          Evidence-based ratings for anabolic compounds and ancillaries. Each compound is scored
          across 8 effect dimensions and 8 side-effect dimensions using peer-reviewed research.
        </p>
      </div>

      <section className="mb-14">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
          Anabolic Compounds
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          {COMPOUNDS.length} compounds — click any card for full detail
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {COMPOUNDS.map((compound) => (
            <CompoundCard key={compound.id} compound={compound} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-1">Ancillaries</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          {ANCILLARIES.length} ancillaries — aromatase inhibitors, SERMs, liver support, and more
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {ANCILLARIES.map((ancillary) => (
            <AncillaryCard key={ancillary.id} ancillary={ancillary} />
          ))}
        </div>
      </section>
    </div>
  );
}
