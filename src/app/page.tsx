import Link from "next/link";
import Image from "next/image";
import { COMPOUNDS, ANCILLARIES } from "@/data/compounds";
import PhotoStrip from "@/components/PhotoStrip";

const totalStudies = COMPOUNDS.reduce((acc, c) => acc + c.studies.length, 0) +
  ANCILLARIES.reduce((acc, a) => acc + a.studies.length, 0);

const PHOTOS = [
  { src: "/images/physique1.jpg",   alt: "Lean physique" },
  { src: "/images/physique2.jpg",   alt: "Intense training" },
  { src: "/images/physique3.jpg",   alt: "Shredded conditioning" },
  { src: "/images/physique4.jpg",   alt: "Heavy training" },
  { src: "/images/physique5.webp",  alt: "Peak physique" },
  { src: "/images/physique6.jpg",   alt: "Locker room conditioning" },
  { src: "/images/physique7.jpg",   alt: "Classic physique" },
  { src: "/images/physique8.webp",  alt: "Home gym aesthetic" },
  { src: "/images/physique9.webp",  alt: "Mirror physique" },
  { src: "/images/physique10.jpg",  alt: "Golden hour athlete" },
  { src: "/images/physique11.webp", alt: "Outdoor conditioning" },
  { src: "/images/physique12.jpg",  alt: "Kevin Levrone" },
  { src: "/images/physique13.jpg",  alt: "Massive arms" },
  { src: "/images/physique14.jpg",  alt: "Gym physique" },
];

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">

      {/* ── DISCLAIMER BANNER ─────────────────────────────────────────────── */}
      <div className="bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-400 text-xs text-center py-2 px-4 font-medium tracking-wide">
        ⚠ FOR EDUCATIONAL &amp; HARM REDUCTION PURPOSES ONLY — Not medical advice. Anabolic steroids carry serious health risks.
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-start">

        {/* Background texture */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/physique2.jpg')] bg-center bg-cover opacity-[0.07]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/95 to-[#0a0a0f]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/40" />
          {/* Green light leak top-left */}
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[#22c55e]/8 rounded-full blur-[120px]" />
          {/* Subtle red tension top-right */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-900/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 w-full pt-6 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* ── LEFT: Copy ─────────────────────────────────────────────── */}
            <div>
              <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/5 text-[#22c55e] text-xs font-semibold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                Powered by RoidAI · AI-Graded Analysis
              </div>

              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black leading-[0.95] tracking-tighter mb-6">
                <span className="block text-white">STOP</span>
                <span className="block text-white">GUESSING.</span>
                <span className="block mt-2" style={{
                  background: "linear-gradient(135deg, #22c55e 0%, #86efac 50%, #16a34a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  BUILD SMART.
                </span>
              </h1>

              <p className="text-[#9999bb] text-lg leading-relaxed mb-8 max-w-xl">
                The only cycle planner backed by{" "}
                <span className="text-white font-semibold">{totalStudies}+ peer-reviewed studies</span>.
                Build your stack, get AI-graded risk analysis from{" "}
                <span className="text-[#22c55e] font-semibold">RoidAI</span>, and compare protocols
                with the community — all in one place.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href="/builder"
                  className="group relative inline-flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-black font-black px-8 py-4 rounded-xl text-base transition-all duration-200 overflow-hidden"
                  style={{ boxShadow: "0 0 32px rgba(34,197,94,0.35)" }}
                >
                  <span className="relative z-10">BUILD MY STACK</span>
                  <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/compounds"
                  className="inline-flex items-center gap-2 border border-[#2a2a3d] hover:border-[#22c55e]/40 text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 hover:bg-[#22c55e]/5"
                >
                  BROWSE {COMPOUNDS.length} COMPOUNDS
                </Link>
                <a
                  href="https://discord.gg/EzBEJJ5xKZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200"
                  style={{ boxShadow: "0 0 24px rgba(88,101,242,0.35)" }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.317 4.369A19.791 19.791 0 0 0 16.558 3.1a.074.074 0 0 0-.079.037 13.785 13.785 0 0 0-.608 1.25 18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 5.93 4.369a.07.07 0 0 0-.032.027C2.533 9.045 1.617 13.58 2.07 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.105 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .078-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .079.009c.12.099.245.197.372.293a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.106c.36.698.772 1.363 1.226 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.955 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.946 2.419-2.157 2.419z" />
                  </svg>
                  JOIN DISCORD
                </a>
              </div>

              {/* Inline stats */}
              <div className="flex flex-wrap gap-6">
                {[
                  { value: COMPOUNDS.length.toString(), label: "Compounds" },
                  { value: ANCILLARIES.length.toString(), label: "Ancillaries" },
                  { value: `${totalStudies}+`, label: "Studies" },
                  { value: "16", label: "Rating Dimensions" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-black text-[#22c55e] leading-none">{s.value}</div>
                    <div className="text-xs text-[#555577] font-medium mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Photo collage ────────────────────────────────────── */}
            <div className="hidden lg:grid grid-cols-2 gap-3 h-[580px] relative">
              {/* Tall left column */}
              <div className="flex flex-col gap-3">
                {/* Outdoor golden hour — very aesthetic */}
                <div className="relative flex-1 rounded-2xl overflow-hidden min-h-0 group">
                  <Image
                    src="/images/physique11.webp"
                    alt="Outdoor conditioning"
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="260px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/70 via-transparent to-transparent" />
                </div>
                {/* Mirror duo — dark background fits site perfectly */}
                <div className="relative h-[195px] rounded-2xl overflow-hidden group">
                  <Image
                    src="/images/physique9.webp"
                    alt="Mirror physique"
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="260px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-transparent" />
                </div>
              </div>

              {/* Right column — offset top */}
              <div className="flex flex-col gap-3 pt-10">
                {/* Kevin Levrone — iconic pro bodybuilder */}
                <div className="relative h-[230px] rounded-2xl overflow-hidden group">
                  <Image
                    src="/images/physique12.jpg"
                    alt="Kevin Levrone"
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="260px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/70 via-transparent to-transparent" />
                </div>
                {/* Home gym aesthetic */}
                <div className="relative flex-1 rounded-2xl overflow-hidden min-h-0 group">
                  <Image
                    src="/images/physique8.webp"
                    alt="Home gym aesthetic"
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="260px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/70 via-transparent to-transparent" />
                </div>
              </div>

              {/* Green glow behind collage */}
              <div className="absolute -right-10 top-1/4 w-80 h-80 bg-[#22c55e]/8 rounded-full blur-[100px] pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PHOTO STRIP ───────────────────────────────────────────────────── */}
      <div className="relative py-8 border-y border-[#1a1a2a] overflow-hidden bg-[#080810]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#080810] via-transparent to-[#080810] z-10 pointer-events-none" />
        <PhotoStrip photos={PHOTOS} />
      </div>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              value: COMPOUNDS.length,
              label: "Compounds Rated",
              sub: "Injectable & oral AAS",
              icon: "💉",
            },
            {
              value: `${totalStudies}+`,
              label: "Clinical Studies",
              sub: "PubMed referenced",
              icon: "📚",
            },
            {
              value: "16",
              label: "Rating Dimensions",
              sub: "8 effects + 8 side-effects",
              icon: "📊",
            },
            {
              value: ANCILLARIES.length,
              label: "Ancillaries",
              sub: "AI-recommended on-cycle",
              icon: "⚗️",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card p-5 group hover:border-[#22c55e]/30 transition-colors"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-black text-[#22c55e] mb-0.5 tabular-nums">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-white">{stat.label}</div>
              <div className="text-xs text-[#555577] mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURE CARDS ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] text-[#22c55e] font-bold uppercase mb-3">The Platform</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Everything you need to cycle{" "}
            <span style={{
              background: "linear-gradient(135deg, #22c55e, #86efac)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              with your brain
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: "🧬",
              title: "Compound Database",
              desc: `${COMPOUNDS.length} compounds rated 1–8 across 8 effect and 8 side-effect dimensions. Full androgenic/anabolic ratios, half-lives, PubMed citations. No broscience.`,
              href: "/compounds",
              cta: `Browse ${COMPOUNDS.length} Compounds →`,
              accent: "#22c55e",
            },
            {
              icon: "⚗️",
              title: "Stack Builder + RoidAI",
              desc: "Pick your compounds, set dose and duration. RoidAI grades your stack A–F, flags risks, calculates danger score, and recommends ancillaries in real-time.",
              href: "/builder",
              cta: "Build Your Stack →",
              accent: "#22c55e",
            },
            {
              icon: "🏆",
              title: "Roid Board",
              desc: "Post your stack publicly. Browse real user cycles with RoidAI scores. Comment, like, and learn from the community what actually works.",
              href: "/board",
              cta: "View Roid Board →",
              accent: "#22c55e",
            },
          ].map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="card p-6 flex flex-col group hover:border-[#22c55e]/30 transition-all duration-200 hover:no-underline"
            >
              <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center text-2xl mb-4 group-hover:bg-[#22c55e]/15 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
              <p className="text-[#9999bb] text-sm leading-relaxed flex-1">{f.desc}</p>
              <div className="mt-4 text-sm font-bold text-[#22c55e] group-hover:translate-x-1 transition-transform inline-block">
                {f.cta}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── ROIDS AI SECTION ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="relative rounded-2xl overflow-hidden border border-[#2a2a3d]">
          {/* Background image — Kevin Levrone mass */}
          <div className="absolute inset-0">
            <Image
              src="/images/physique12.jpg"
              alt="RoidAI background"
              fill
              className="object-cover object-center opacity-8"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/90 to-[#0a0a0f]/70" />
          </div>

          <div className="relative p-8 md:p-14 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 0 40px rgba(34,197,94,0.2)" }}>
                <Image
                  src="/images/roidai-mascot.png"
                  alt="RoidAI"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs tracking-[0.3em] text-[#22c55e] font-bold uppercase mb-2">AI-Powered Analysis</p>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                Meet <span style={{
                  background: "linear-gradient(135deg, #22c55e, #86efac)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>RoidAI</span>
              </h2>
              <p className="text-[#9999bb] leading-relaxed max-w-2xl">
                Trained on{" "}
                <span className="text-white font-semibold">{totalStudies}+ clinical studies</span>.
                RoidAI reads your stack like a pharmacologist — it calculates compound interactions,
                grades your overall risk A–F, flags cardiovascular and hepatic concerns,
                and prescribes ancillaries with clinical reasoning. Not vibes. Not forums.{" "}
                <span className="text-[#22c55e] font-semibold">Science.</span>
              </p>
            </div>
            <Link
              href="/builder"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-black font-black px-8 py-4 rounded-xl transition-all duration-200"
              style={{ boxShadow: "0 0 24px rgba(34,197,94,0.3)" }}
            >
              TRY ROIDAI
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
          <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
            ⚠ Important Disclaimer
          </h3>
          <p className="text-[#9999bb] text-sm leading-relaxed">
            BuildMyCycle.com is intended strictly for educational and harm reduction purposes.
            Anabolic steroids are controlled substances in many jurisdictions and carry serious
            health risks including cardiovascular disease, hormonal disruption, liver damage,
            psychiatric effects, and death. Nothing on this site constitutes medical advice.
            Always consult a qualified physician before using any substance. We do not encourage
            or condone illegal activity.
          </p>
        </div>
      </section>

    </div>
  );
}
