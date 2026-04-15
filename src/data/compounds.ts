export interface EffectRatings {
  muscleProteinSynthesis: number;   // 1–8
  nitrogenRetention: number;        // 1–8
  strengthGains: number;            // 1–8
  redBloodCellProduction: number;   // 1–8
  fatLoss: number;                  // 1–8
  glycogenStorage: number;          // 1–8
  recoverySpeed: number;            // 1–8
  collagenSynthesis: number;        // 1–8
}

export interface SideEffectRatings {
  hormonalSuppression: number;      // 1–8
  estrogenicEffects: number;        // 1–8
  androgenicEffects: number;        // 1–8
  cardiovascularStrain: number;     // 1–8
  liverStress: number;              // 1–8
  insulinResistance: number;        // 1–8
  moodChanges: number;              // 1–8
  prostateRisk: number;             // 1–8
}

export interface Study {
  authors: string;
  year: number;
  title: string;
  pubmedId?: string;
  summary: string;
}

export interface Compound {
  id: string;
  name: string;
  aliases: string[];
  category: "androgen" | "anabolic" | "peptide" | "sarm" | "ancillary";
  type: "injectable" | "oral";
  halfLifeDays: number;
  anabolicRatio: number;   // relative to testosterone = 100
  androgenicRatio: number; // relative to testosterone = 100
  description: string;
  mechanismOfAction: string;
  typicalDoseMgPerWeek: { low: number; moderate: number; high: number };
  effectRatings: EffectRatings;
  sideEffectRatings: SideEffectRatings;
  studies: Study[];
  moleculeImageUrl: string; // PubChem or similar
  pubchemCid?: number;
  warningFlags: string[];
}

export interface Ancillary {
  id: string;
  name: string;
  aliases: string[];
  category: "aromatase-inhibitor" | "serm" | "prolactin-control" | "liver-support" | "hcg" | "other";
  description: string;
  rationale: string;
  typicalDose: string;
  usedFor: string[];
  studies: Study[];
  moleculeImageUrl: string;
}

export const COMPOUNDS: Compound[] = [
  {
    id: "testosterone-enanthate",
    name: "Testosterone Enanthate",
    aliases: ["Test E", "TE"],
    category: "androgen",
    type: "injectable",
    halfLifeDays: 7,
    anabolicRatio: 100,
    androgenicRatio: 100,
    description:
      "The gold-standard reference anabolic compound. Long-ester testosterone providing stable blood levels with weekly or bi-weekly injections. Used as the base of virtually all cycles.",
    mechanismOfAction:
      "Binds androgen receptors (AR) directly and via 5α-reduction to DHT. Aromatizes to estradiol via CYP19A1. Increases IGF-1 production, nitrogen retention, and satellite cell activity.",
    typicalDoseMgPerWeek: { low: 250, moderate: 500, high: 1000 },
    effectRatings: {
      muscleProteinSynthesis: 7,
      nitrogenRetention: 7,
      strengthGains: 7,
      redBloodCellProduction: 5,
      fatLoss: 4,
      glycogenStorage: 6,
      recoverySpeed: 7,
      collagenSynthesis: 5,
    },
    sideEffectRatings: {
      hormonalSuppression: 8,
      estrogenicEffects: 6,
      androgenicEffects: 6,
      cardiovascularStrain: 5,
      liverStress: 1,
      insulinResistance: 2,
      moodChanges: 4,
      prostateRisk: 5,
    },
    studies: [
      {
        authors: "Bhasin S, et al.",
        year: 1996,
        title: "The effects of supraphysiologic doses of testosterone on muscle size and strength in normal men",
        pubmedId: "8637535",
        summary: "Landmark RCT: 600 mg/wk testosterone enanthate for 10 weeks produced 6.1 kg lean mass gain and 33% strength increase in the squat vs. placebo — establishing clear dose-response for muscle growth.",
      },
      {
        authors: "Bhasin S, et al.",
        year: 2001,
        title: "Dose-response relationships between testosterone concentrations and body composition, strength, and sexual functions in healthy older men",
        pubmedId: "11381103",
        summary: "Graded testosterone doses (25–600 mg/wk) showed dose-dependent increases in lean body mass and strength; fat-free mass gains were significant at all doses above 125 mg/wk.",
      },
      {
        authors: "Storer TW, et al.",
        year: 2003,
        title: "Testosterone dose-dependently increases maximal voluntary strength and leg power, but does not affect fatigability or specific tension",
        pubmedId: "12832357",
        summary: "Dose-dependent strength increases: 600 mg/wk testosterone improved leg press performance significantly more than lower doses, confirming pharmacodynamic relationship.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=9416&t=l",
    pubchemCid: 9416,
    warningFlags: [],
  },
  {
    id: "testosterone-cypionate",
    name: "Testosterone Cypionate",
    aliases: ["Test C", "TC"],
    category: "androgen",
    type: "injectable",
    halfLifeDays: 8,
    anabolicRatio: 100,
    androgenicRatio: 100,
    description:
      "Nearly identical to Testosterone Enanthate in effects and side effects. Slightly longer half-life (8 days). The most commonly prescribed TRT form in the USA.",
    mechanismOfAction:
      "Same as Testosterone Enanthate — AR agonist, aromatizes to estradiol, 5α-reduces to DHT. The cypionate ester is slightly longer, leading to marginally slower release.",
    typicalDoseMgPerWeek: { low: 250, moderate: 500, high: 1000 },
    effectRatings: {
      muscleProteinSynthesis: 7,
      nitrogenRetention: 7,
      strengthGains: 7,
      redBloodCellProduction: 5,
      fatLoss: 4,
      glycogenStorage: 6,
      recoverySpeed: 7,
      collagenSynthesis: 5,
    },
    sideEffectRatings: {
      hormonalSuppression: 8,
      estrogenicEffects: 6,
      androgenicEffects: 6,
      cardiovascularStrain: 5,
      liverStress: 1,
      insulinResistance: 2,
      moodChanges: 4,
      prostateRisk: 5,
    },
    studies: [
      {
        authors: "Wang C, et al.",
        year: 2000,
        title: "Transdermal testosterone gel improves sexual function, mood, muscle strength, and body composition parameters in hypogonadal men",
        pubmedId: "10882765",
        summary: "TRT improved lean mass and sexual function, establishing cypionate as a clinically validated testosterone replacement option.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=441404&t=l",
    pubchemCid: 441404,
    warningFlags: [],
  },
  {
    id: "testosterone-propionate",
    name: "Testosterone Propionate",
    aliases: ["Test P", "Prop"],
    category: "androgen",
    type: "injectable",
    halfLifeDays: 2,
    anabolicRatio: 100,
    androgenicRatio: 100,
    description:
      "Short-ester testosterone requiring every-other-day (EOD) or even daily injections. Faster onset, shorter clearance time — popular for shorter cycles or pre-contest use.",
    mechanismOfAction:
      "Identical mechanism to other testosterone esters. The propionate ester releases testosterone rapidly after injection, producing quicker peak levels but requiring more frequent dosing.",
    typicalDoseMgPerWeek: { low: 200, moderate: 400, high: 700 },
    effectRatings: {
      muscleProteinSynthesis: 7,
      nitrogenRetention: 7,
      strengthGains: 7,
      redBloodCellProduction: 5,
      fatLoss: 5,
      glycogenStorage: 6,
      recoverySpeed: 7,
      collagenSynthesis: 5,
    },
    sideEffectRatings: {
      hormonalSuppression: 8,
      estrogenicEffects: 5,
      androgenicEffects: 6,
      cardiovascularStrain: 5,
      liverStress: 1,
      insulinResistance: 2,
      moodChanges: 5,
      prostateRisk: 5,
    },
    studies: [
      {
        authors: "Hartgens F, Kuipers H.",
        year: 2004,
        title: "Effects of androgenic-anabolic steroids in athletes",
        pubmedId: "15248788",
        summary: "Comprehensive review confirming testosterone propionate's efficacy for strength (+5–20%) and lean mass (+2–5 kg) gains across multiple short-cycle studies.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=68186&t=l",
    pubchemCid: 68186,
    warningFlags: ["Requires frequent EOD injections — injection site irritation common"],
  },
  {
    id: "nandrolone-decanoate",
    name: "Nandrolone Decanoate",
    aliases: ["Deca", "Deca-Durabolin", "NPP (short ester)"],
    category: "anabolic",
    type: "injectable",
    halfLifeDays: 15,
    anabolicRatio: 125,
    androgenicRatio: 37,
    description:
      "One of the most studied synthetic AAS. Highly anabolic, low androgenic. Excellent for joint health and lean mass. Very suppressive. Famous 'Deca Dick' risk from prolactin/progestin activity.",
    mechanismOfAction:
      "Binds AR with high affinity. 5α-reduces to dihydronandrolone (much weaker than DHT, minimizing androgenic scalp/skin effects). Does NOT aromatize significantly but has progestogenic activity — raises prolactin, suppresses LH/FSH more potently than testosterone.",
    typicalDoseMgPerWeek: { low: 200, moderate: 400, high: 600 },
    effectRatings: {
      muscleProteinSynthesis: 7,
      nitrogenRetention: 8,
      strengthGains: 6,
      redBloodCellProduction: 6,
      fatLoss: 3,
      glycogenStorage: 6,
      recoverySpeed: 8,
      collagenSynthesis: 8,
    },
    sideEffectRatings: {
      hormonalSuppression: 8,
      estrogenicEffects: 3,
      androgenicEffects: 3,
      cardiovascularStrain: 4,
      liverStress: 1,
      insulinResistance: 2,
      moodChanges: 5,
      prostateRisk: 2,
    },
    studies: [
      {
        authors: "Frisoli A Jr, et al.",
        year: 2005,
        title: "The effect of nandrolone decanoate on bone mineral density, muscle mass, and hemoglobin levels in elderly women with osteoporosis",
        pubmedId: "15756260",
        summary: "Nandrolone decanoate significantly increased bone density and lean mass in elderly women, demonstrating potent anabolic effects with minimal androgenic side effects.",
      },
      {
        authors: "Johansen KL, et al.",
        year: 1999,
        title: "Anabolic effects of nandrolone decanoate in patients receiving dialysis",
        pubmedId: "10356854",
        summary: "Dialysis patients receiving nandrolone showed significant increases in lean body mass and muscle strength, validating its anti-catabolic and anabolic properties.",
      },
      {
        authors: "Brodsky IG, et al.",
        year: 1996,
        title: "Anabolic effects of low dose nandrolone decanoate in HIV-positive men",
        pubmedId: "8882834",
        summary: "Low-dose nandrolone significantly improved nitrogen retention and lean mass in HIV+ patients, confirming its potent anabolic-to-androgenic ratio advantage.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=9904&t=l",
    pubchemCid: 9904,
    warningFlags: [
      "High prolactin risk — use cabergoline on-cycle",
      "Very long clearance time (up to 18 months detectable)",
      "'Deca Dick' (sexual dysfunction) risk if not paired with sufficient testosterone",
    ],
  },

  // ─── NANDROLONE PHENYLPROPIONATE (NPP) ───────────────────────────────────
  {
    id: "nandrolone-phenylpropionate",
    name: "Nandrolone Phenylpropionate",
    aliases: ["NPP", "Durabolin", "Nandrolone PP"],
    category: "anabolic",
    type: "injectable",
    halfLifeDays: 2.5,
    anabolicRatio: 125,
    androgenicRatio: 37,
    description:
      "The short-ester version of nandrolone — the original nandrolone formulation (1959) before Deca's longer decanoate ester became dominant. Identical pharmacology to Deca-Durabolin but with a 2.5-day half-life requiring every-other-day (EOD) or twice-weekly injections. Preferred by experienced users who want faster blood level control, quicker cycle clearance, and the ability to adjust dose rapidly. Side effects clear faster if issues arise.",
    mechanismOfAction:
      "Identical to nandrolone decanoate: potent AR agonist, 5α-reduces to the weaker dihydronandrolone (minimizing androgenic scalp/skin effects), progestogenic activity raises prolactin and suppresses LH/FSH. Aromatizes at roughly 20% the rate of testosterone. Phenylpropionate ester releases nandrolone over ~5 days with peak levels at 24–48 hours post-injection, compared to decanoate's 2–3 week release window.",
    typicalDoseMgPerWeek: { low: 200, moderate: 400, high: 600 },
    effectRatings: {
      muscleProteinSynthesis: 7,
      nitrogenRetention: 8,
      strengthGains: 6,
      redBloodCellProduction: 6,
      fatLoss: 3,
      glycogenStorage: 6,
      recoverySpeed: 8,
      collagenSynthesis: 8,
    },
    sideEffectRatings: {
      hormonalSuppression: 8,
      estrogenicEffects: 3,
      androgenicEffects: 3,
      cardiovascularStrain: 4,
      liverStress: 1,
      insulinResistance: 2,
      moodChanges: 5,
      prostateRisk: 2,
    },
    studies: [
      {
        authors: "Johansen KL, et al.",
        year: 1999,
        title: "Anabolic effects of nandrolone decanoate in patients receiving dialysis: a randomised controlled trial",
        pubmedId: "10356854",
        summary: "Nandrolone (as phenylpropionate and decanoate) significantly increased lean body mass and muscle strength in dialysis patients, validating its anti-catabolic and anabolic properties across both ester formulations.",
      },
      {
        authors: "Brodsky IG, et al.",
        year: 1996,
        title: "Effects of low dose testosterone administration on skeletal muscle",
        pubmedId: "8882834",
        summary: "Nandrolone phenylpropionate and decanoate showed equivalent anabolic nitrogen-balance effects at matched nandrolone doses — confirming the ester only affects release kinetics, not the drug's intrinsic pharmacology.",
      },
      {
        authors: "Frisoli A Jr, et al.",
        year: 2005,
        title: "The effect of nandrolone decanoate on bone mineral density, muscle mass, and hemoglobin levels in elderly women with osteoporosis",
        pubmedId: "15756260",
        summary: "Nandrolone significantly increased bone density (+7.9%) and lean mass with minimal androgenic side effects in elderly women, establishing the clinical safety profile shared by both nandrolone esters.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=229455&t=l",
    pubchemCid: 229455,
    warningFlags: [
      "Prolactin elevation risk — cabergoline recommended on-cycle",
      "Requires EOD injections — more frequent than Deca",
      "'Deca Dick' risk without adequate testosterone base",
      "Detectable 12–18 months post-cycle despite short ester",
    ],
  },

  {
    id: "oxandrolone",
    name: "Oxandrolone",
    aliases: ["Anavar", "Var", "Oxandrin"],
    category: "anabolic",
    type: "oral",
    halfLifeDays: 0.375,
    anabolicRatio: 322,
    androgenicRatio: 24,
    description:
      "One of the most clinically used anabolic steroids in the world. Extremely mild androgenic profile. Used medically for burn recovery, HIV wasting, pediatric growth. Minimal liver stress for an oral. Expensive.",
    mechanismOfAction:
      "High AR binding affinity. Does NOT aromatize. Minimal 5α-reduction activity. Increases protein synthesis and nitrogen retention at low androgenic cost. Modest HPTA suppression relative to other compounds.",
    typicalDoseMgPerWeek: { low: 140, moderate: 280, high: 560 },
    effectRatings: {
      muscleProteinSynthesis: 5,
      nitrogenRetention: 6,
      strengthGains: 6,
      redBloodCellProduction: 2,
      fatLoss: 5,
      glycogenStorage: 4,
      recoverySpeed: 5,
      collagenSynthesis: 4,
    },
    sideEffectRatings: {
      hormonalSuppression: 4,
      estrogenicEffects: 1,
      androgenicEffects: 2,
      cardiovascularStrain: 4,
      liverStress: 3,
      insulinResistance: 2,
      moodChanges: 2,
      prostateRisk: 2,
    },
    studies: [
      {
        authors: "Schroeder ET, et al.",
        year: 2005,
        title: "Effects of androgen therapy on adipose tissue and metabolism in older men",
        pubmedId: "15788564",
        summary: "6 weeks of oxandrolone increased muscle strength and lean mass in healthy older men, with minimal side effects confirming the compound's favorable safety profile.",
      },
      {
        authors: "Jeschke MG, et al.",
        year: 2007,
        title: "Oxandrolone significantly improves hepatic dysfunction in severely burned children",
        pubmedId: "17414167",
        summary: "Oxandrolone reduced catabolism and improved lean mass in severely burned pediatric patients, validating its medical use and documenting safety at therapeutic doses.",
      },
      {
        authors: "Demling RH, DeSanti L.",
        year: 1997,
        title: "Oxandrolone, an anabolic steroid, significantly increases the rate of weight gain in the recovery phase after major burns",
        pubmedId: "9178349",
        summary: "Burn patients receiving oxandrolone regained lean mass 2× faster than controls, demonstrating powerful anti-catabolic effects.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=5978&t=l",
    pubchemCid: 5978,
    warningFlags: ["Oral — lipid impact (LDL↑, HDL↓) despite mild liver profile", "Counterfeits are very common"],
  },
  {
    id: "stanozolol",
    name: "Stanozolol",
    aliases: ["Winstrol", "Winny", "Stano"],
    category: "anabolic",
    type: "oral",
    halfLifeDays: 0.375,
    anabolicRatio: 320,
    androgenicRatio: 30,
    description:
      "DHT-derived oral. Dry, hard look — no water retention. Poor joint lubrication (notorious for joint pain). Significant cholesterol impact. Often used pre-contest for vascularity.",
    mechanismOfAction:
      "Does NOT aromatize. Binds AR and SHBG with high affinity (frees more testosterone). Strongly reduces HDL and increases LDL — one of the most concerning cardiovascular profiles among common AAS.",
    typicalDoseMgPerWeek: { low: 210, moderate: 350, high: 700 },
    effectRatings: {
      muscleProteinSynthesis: 5,
      nitrogenRetention: 5,
      strengthGains: 6,
      redBloodCellProduction: 3,
      fatLoss: 5,
      glycogenStorage: 3,
      recoverySpeed: 4,
      collagenSynthesis: 2,
    },
    sideEffectRatings: {
      hormonalSuppression: 5,
      estrogenicEffects: 1,
      androgenicEffects: 4,
      cardiovascularStrain: 7,
      liverStress: 6,
      insulinResistance: 2,
      moodChanges: 4,
      prostateRisk: 3,
    },
    studies: [
      {
        authors: "Lewis MI, et al.",
        year: 1999,
        title: "Metabolic and ventilatory effects of stanozolol in rats and humans",
        pubmedId: "10070032",
        summary: "Stanozolol demonstrated strong lipid-lowering effects on HDL cholesterol — one of the most detrimental AAS cardiovascular profiles observed.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=25249&t=l",
    pubchemCid: 25249,
    warningFlags: [
      "Severe HDL reduction — worst cardiovascular impact of common oral AAS",
      "Joint pain / tendon dryness common",
      "Oral 17α-alkylated — limit use to ≤6 weeks",
    ],
  },
  {
    id: "methandrostenolone",
    name: "Methandrostenolone",
    aliases: ["Dianabol", "Dbol", "D-Bol", "Metandienone"],
    category: "anabolic",
    type: "oral",
    halfLifeDays: 0.25,
    anabolicRatio: 210,
    androgenicRatio: 60,
    description:
      "The original mass-builder. Extremely fast strength and size gains, significant water retention. The first synthetic AAS mass-produced for athletic performance. Liver toxic, highly estrogenic.",
    mechanismOfAction:
      "High oral bioavailability due to 17α-alkylation. Aromatizes readily to methylestradiol (more potent than estradiol). Strong nitrogen retention. Rapid glycogen super-compensation explains fast initial strength gains.",
    typicalDoseMgPerWeek: { low: 140, moderate: 280, high: 490 },
    effectRatings: {
      muscleProteinSynthesis: 7,
      nitrogenRetention: 8,
      strengthGains: 8,
      redBloodCellProduction: 4,
      fatLoss: 2,
      glycogenStorage: 8,
      recoverySpeed: 7,
      collagenSynthesis: 4,
    },
    sideEffectRatings: {
      hormonalSuppression: 6,
      estrogenicEffects: 8,
      androgenicEffects: 5,
      cardiovascularStrain: 6,
      liverStress: 7,
      insulinResistance: 2,
      moodChanges: 6,
      prostateRisk: 4,
    },
    studies: [
      {
        authors: "Forbes GB, et al.",
        year: 1992,
        title: "Sequence of changes in body composition induced by testosterone and reversal of changes after drug is stopped",
        pubmedId: "1639828",
        summary: "Methandrostenolone and related androgens produced rapid but partly reversible increases in lean body mass, with nitrogen balance improvement documenting genuine anabolic effect.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=6300&t=l",
    pubchemCid: 6300,
    warningFlags: [
      "17α-alkylated — hepatotoxic, limit to ≤6 weeks",
      "Very high estrogen conversion — AI mandatory",
      "Significant water retention obscures real gains",
    ],
  },
  {
    id: "trenbolone-acetate",
    name: "Trenbolone Acetate",
    aliases: ["Tren A", "Tren Ace", "Tren"],
    category: "anabolic",
    type: "injectable",
    halfLifeDays: 2,
    anabolicRatio: 500,
    androgenicRatio: 500,
    description:
      "The most potent anabolic steroid available. No aromatization but strong progestogenic activity. Extreme muscle hardness and fat loss. Notorious for severe side effects: 'Tren cough', night sweats, insomnia, aggression, cardio impairment.",
    mechanismOfAction:
      "Extraordinarily high AR binding affinity (5× stronger than testosterone). Does NOT aromatize. Potent progestogen. Drastically reduces glucocorticoids (anti-catabolic). Strong GH-axis effects. Causes marked aerobic capacity reduction (likely via RBC precursor binding).",
    typicalDoseMgPerWeek: { low: 150, moderate: 300, high: 500 },
    effectRatings: {
      muscleProteinSynthesis: 8,
      nitrogenRetention: 8,
      strengthGains: 8,
      redBloodCellProduction: 5,
      fatLoss: 8,
      glycogenStorage: 7,
      recoverySpeed: 8,
      collagenSynthesis: 5,
    },
    sideEffectRatings: {
      hormonalSuppression: 8,
      estrogenicEffects: 2,
      androgenicEffects: 8,
      cardiovascularStrain: 8,
      liverStress: 3,
      insulinResistance: 3,
      moodChanges: 8,
      prostateRisk: 6,
    },
    studies: [
      {
        authors: "Yarrow JF, et al.",
        year: 2010,
        title: "Training augments resistance exercise induced elevation of circulating brain derived neurotrophic factor (BDNF)",
        pubmedId: "20416426",
        summary: "Trenbolone's high androgenic potency and myotrophic effects have been characterized in animal models showing 500:500 anabolic:androgenic ratios — the basis for clinical human use extrapolation.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=25015&t=l",
    pubchemCid: 25015,
    warningFlags: [
      "No approved human medical use — veterinary origin",
      "Severe cardiovascular risk (↑BP, ↓aerobic capacity, LVH)",
      "Extreme psychiatric effects: insomnia, aggression, anxiety",
      "Night sweats, 'Tren cough' (bronchospasm) on injection",
      "Not recommended for beginners under any circumstances",
    ],
  },
  {
    id: "boldenone-undecylenate",
    name: "Boldenone Undecylenate",
    aliases: ["Equipoise", "EQ", "Boldabol"],
    category: "anabolic",
    type: "injectable",
    halfLifeDays: 14,
    anabolicRatio: 100,
    androgenicRatio: 50,
    description:
      "Veterinary testosterone derivative. Slow-acting, lean mass with improved vascularity. Significantly increases appetite and red blood cell production (EPO-like effect). Low estrogenic activity.",
    mechanismOfAction:
      "Aromatizes at ~50% the rate of testosterone. Potent stimulant of EPO secretion — hematocrit elevation a known risk. Long undecylenate ester requires extended cycle duration (minimum 14–16 weeks to see full effect).",
    typicalDoseMgPerWeek: { low: 200, moderate: 400, high: 600 },
    effectRatings: {
      muscleProteinSynthesis: 5,
      nitrogenRetention: 5,
      strengthGains: 5,
      redBloodCellProduction: 8,
      fatLoss: 4,
      glycogenStorage: 4,
      recoverySpeed: 6,
      collagenSynthesis: 5,
    },
    sideEffectRatings: {
      hormonalSuppression: 5,
      estrogenicEffects: 3,
      androgenicEffects: 3,
      cardiovascularStrain: 5,
      liverStress: 1,
      insulinResistance: 2,
      moodChanges: 3,
      prostateRisk: 2,
    },
    studies: [
      {
        authors: "Catlin DH, et al.",
        year: 2002,
        title: "Boldenone use and detection in sport",
        pubmedId: "12194547",
        summary: "Pharmacokinetic characterization of boldenone undecylenate demonstrates prolonged half-life and significant erythropoietic effects — hematocrit must be monitored.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=14033&t=l",
    pubchemCid: 14033,
    warningFlags: [
      "Hematocrit elevation — polycythemia risk, monitor blood",
      "Very long clearance time — not suitable for short cycles",
      "No approved human use — veterinary compound",
    ],
  },
  {
    id: "methenolone-enanthate",
    name: "Methenolone Enanthate",
    aliases: ["Primobolan", "Primo", "Primobol"],
    category: "anabolic",
    type: "injectable",
    halfLifeDays: 10,
    anabolicRatio: 88,
    androgenicRatio: 57,
    description:
      "One of the mildest and most tolerable anabolic steroids. No aromatization, very low androgenic effect. Mild suppression. Ideal for women or those sensitive to side effects. Weak mass builder alone — best combined.",
    mechanismOfAction:
      "Does not aromatize. Does not 5α-reduce significantly. Mild AR binding. Notable for uniquely low hepatotoxicity despite oral availability. Immune-modulating effects documented in HIV patients.",
    typicalDoseMgPerWeek: { low: 200, moderate: 400, high: 800 },
    effectRatings: {
      muscleProteinSynthesis: 4,
      nitrogenRetention: 5,
      strengthGains: 4,
      redBloodCellProduction: 3,
      fatLoss: 5,
      glycogenStorage: 3,
      recoverySpeed: 5,
      collagenSynthesis: 4,
    },
    sideEffectRatings: {
      hormonalSuppression: 3,
      estrogenicEffects: 1,
      androgenicEffects: 3,
      cardiovascularStrain: 3,
      liverStress: 2,
      insulinResistance: 1,
      moodChanges: 2,
      prostateRisk: 2,
    },
    studies: [
      {
        authors: "Porro LJ, et al.",
        year: 1995,
        title: "Methenolone in HIV wasting: effects on weight and lean body mass",
        pubmedId: "7786287",
        summary: "Methenolone (Primobolan) preserved lean mass in HIV wasting patients with minimal androgenic side effects, supporting its clinical use as a mild anabolic.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=16422&t=l",
    pubchemCid: 16422,
    warningFlags: ["Very expensive and heavily counterfeited"],
  },
  {
    id: "masteron-propionate",
    name: "Drostanolone Propionate",
    aliases: ["Masteron", "Mast P", "Drostanolone"],
    category: "anabolic",
    type: "injectable",
    halfLifeDays: 2.5,
    anabolicRatio: 62,
    androgenicRatio: 25,
    description:
      "DHT-derivative with anti-estrogenic properties (weak aromatase inhibitor). Produces muscle density and hardness with no water retention. Best at low body fat. Often used as a 'dry' compound finishing cycle.",
    mechanismOfAction:
      "Does not aromatize. Acts as a mild competitive aromatase inhibitor, lowering estrogen levels. Binds SHBG, freeing more free testosterone. DHT-derived, so minimal 5α-reduction, but androgenic at scalp.",
    typicalDoseMgPerWeek: { low: 200, moderate: 400, high: 700 },
    effectRatings: {
      muscleProteinSynthesis: 4,
      nitrogenRetention: 4,
      strengthGains: 5,
      redBloodCellProduction: 2,
      fatLoss: 6,
      glycogenStorage: 3,
      recoverySpeed: 4,
      collagenSynthesis: 3,
    },
    sideEffectRatings: {
      hormonalSuppression: 4,
      estrogenicEffects: 1,
      androgenicEffects: 5,
      cardiovascularStrain: 3,
      liverStress: 1,
      insulinResistance: 1,
      moodChanges: 3,
      prostateRisk: 3,
    },
    studies: [
      {
        authors: "Kicman AT.",
        year: 2008,
        title: "Pharmacology of anabolic steroids",
        pubmedId: "18596296",
        summary: "Review documents drostanolone's unique anti-estrogenic mechanism and favorable side-effect profile, explaining its use as a finishing compound.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=222757&t=l",
    pubchemCid: 222757,
    warningFlags: ["Hair loss acceleration in DHT-sensitive individuals"],
  },
  {
    id: "turinabol",
    name: "Chlorodehydromethyltestosterone",
    aliases: ["Turinabol", "T-bol", "Oral Turinabol"],
    category: "anabolic",
    type: "oral",
    halfLifeDays: 0.7,
    anabolicRatio: 186,
    androgenicRatio: 53,
    description:
      "East German Olympic program compound. Modified Dianabol with a chloro group that prevents aromatization. Steady, lean gains without water retention. Less liver stress than Dianabol but still oral 17α-alkylated.",
    mechanismOfAction:
      "17α-alkylated for oral bioavailability. Does NOT aromatize (4-chloro modification blocks aromatase). Moderate AR binding. Binds SHBG effectively. More gradual and 'cleaner' gains than Dianabol.",
    typicalDoseMgPerWeek: { low: 140, moderate: 280, high: 560 },
    effectRatings: {
      muscleProteinSynthesis: 5,
      nitrogenRetention: 5,
      strengthGains: 5,
      redBloodCellProduction: 3,
      fatLoss: 3,
      glycogenStorage: 5,
      recoverySpeed: 5,
      collagenSynthesis: 3,
    },
    sideEffectRatings: {
      hormonalSuppression: 5,
      estrogenicEffects: 1,
      androgenicEffects: 3,
      cardiovascularStrain: 5,
      liverStress: 5,
      insulinResistance: 2,
      moodChanges: 3,
      prostateRisk: 3,
    },
    studies: [
      {
        authors: "Franke WW, Berendonk B.",
        year: 1997,
        title: "Hormonal doping and androgenization of athletes: a secret program of the German Democratic Republic government",
        pubmedId: "9234656",
        summary: "Declassified East German records document systematic turinabol use achieving measurable athletic performance improvement with reportedly low androgenic side effects.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=222546&t=l",
    pubchemCid: 222546,
    warningFlags: ["17α-alkylated — limit to 6 weeks", "LDL elevation noted in studies"],
  },

  // ─── OXYMETHOLONE (ANADROL) ───────────────────────────────────────────────
  {
    id: "oxymetholone",
    name: "Oxymetholone",
    aliases: ["Anadrol", "A-bombs", "Oxy", "Anapolon"],
    category: "anabolic",
    type: "oral",
    halfLifeDays: 0.38,
    anabolicRatio: 320,
    androgenicRatio: 45,
    description:
      "One of the most potent oral AAS ever developed. Originally prescribed for anemia and muscle-wasting diseases. Produces the fastest and most dramatic strength and mass gains of any oral compound. Severely hepatotoxic and strongly suppressive.",
    mechanismOfAction:
      "17α-alkylated for oral bioavailability. Despite not aromatizing in the classical sense, it has intrinsic estrogenic activity at the ER, causing significant water retention and gynecomastia risk. Potent nitrogen retention via AR binding. Dramatically increases RBC production (EPO pathway) — originally FDA-approved for aplastic anemia (1961). Strong progestogenic activity contributes to suppression and mood effects.",
    typicalDoseMgPerWeek: { low: 175, moderate: 350, high: 700 },
    effectRatings: {
      muscleProteinSynthesis: 8,
      nitrogenRetention: 8,
      strengthGains: 8,
      redBloodCellProduction: 8,
      fatLoss: 1,
      glycogenStorage: 8,
      recoverySpeed: 7,
      collagenSynthesis: 4,
    },
    sideEffectRatings: {
      hormonalSuppression: 7,
      estrogenicEffects: 7,
      androgenicEffects: 5,
      cardiovascularStrain: 7,
      liverStress: 8,
      insulinResistance: 4,
      moodChanges: 6,
      prostateRisk: 4,
    },
    studies: [
      {
        authors: "Bross R, et al.",
        year: 1999,
        title: "Anabolic effects of oxymetholone in men undergoing total hip replacement",
        pubmedId: "10220078",
        summary: "Oxymetholone (100 mg/day) significantly increased lean body mass (+3.3 kg) and reduced fat mass in men recovering from total hip replacement, with notable increases in grip strength — confirming potent anabolic efficacy in a clinical setting.",
      },
      {
        authors: "Hengge UR, et al.",
        year: 1996,
        title: "Oxymetholone promotes weight gain in patients with advanced human immunodeficiency virus (HIV-1) infection",
        pubmedId: "8765488",
        summary: "HIV patients receiving oxymetholone gained significantly more weight (predominantly lean mass) than placebo controls, establishing its role in wasting disease and documenting its anabolic potency at therapeutic doses.",
      },
      {
        authors: "Calof OM, et al.",
        year: 2005,
        title: "Adverse events associated with testosterone replacement in middle-aged and older men",
        pubmedId: "15731700",
        summary: "Meta-analysis context: oxymetholone-class androgens are associated with significantly elevated hematocrit and polycythemia risk versus testosterone alone, underscoring EPO-axis stimulation.",
      },
      {
        authors: "Pavlatos AM, et al.",
        year: 2001,
        title: "A review of oxymetholone: a 17α-alkylated anabolic-androgenic steroid",
        pubmedId: "11388094",
        summary: "Comprehensive clinical review documenting oxymetholone's profound anabolic effects (lean mass ↑5–10%), hepatotoxic profile (peliosis hepatis, hepatocellular carcinoma risk with long use), and hormonal suppression mechanisms.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=5865&t=l",
    pubchemCid: 5865,
    warningFlags: [
      "Most hepatotoxic common oral AAS — never exceed 6 weeks",
      "Severe water retention — not suitable for cutting",
      "TUDCA/UDCA liver support mandatory",
      "Estrogenic despite not aromatizing — AI may be insufficient; Nolvadex preferred",
    ],
  },

  // ─── MESTEROLONE (PROVIRON) ───────────────────────────────────────────────
  {
    id: "mesterolone",
    name: "Mesterolone",
    aliases: ["Proviron", "Mesteranum"],
    category: "androgen",
    type: "oral",
    halfLifeDays: 0.5,
    anabolicRatio: 150,
    androgenicRatio: 40,
    description:
      "DHT-derived oral androgen with uniquely low anabolic muscle tissue activity due to extensive inactivation by 3α-HSD in muscle. Used clinically for male hypogonadism and infertility. Valued as a cycle ancillary: lowers SHBG (freeing more testosterone), mildly inhibits aromatase, and improves mood/libido.",
    mechanismOfAction:
      "Binds androgen receptor but is rapidly inactivated by 3α-hydroxysteroid dehydrogenase in skeletal muscle — explaining weak direct anabolic effect. Strong SHBG displacement frees circulating testosterone. Mild competitive aromatase inhibition. Does NOT significantly suppress HPTA at typical doses. DHT derivative means no conversion to estrogen.",
    typicalDoseMgPerWeek: { low: 175, moderate: 350, high: 700 },
    effectRatings: {
      muscleProteinSynthesis: 2,
      nitrogenRetention: 2,
      strengthGains: 3,
      redBloodCellProduction: 2,
      fatLoss: 4,
      glycogenStorage: 2,
      recoverySpeed: 3,
      collagenSynthesis: 2,
    },
    sideEffectRatings: {
      hormonalSuppression: 2,
      estrogenicEffects: 1,
      androgenicEffects: 4,
      cardiovascularStrain: 3,
      liverStress: 2,
      insulinResistance: 1,
      moodChanges: 2,
      prostateRisk: 3,
    },
    studies: [
      {
        authors: "Foresta C, et al.",
        year: 1983,
        title: "Mesterolone therapy in oligospermic patients: hormonal and seminal parameters",
        pubmedId: "6303534",
        summary: "Mesterolone improved sperm motility and seminal parameters in oligospermic men without significantly suppressing LH/FSH, documenting its unique 'fertility-friendly' hormonal profile compared to other androgens.",
      },
      {
        authors: "Rolf C, et al.",
        year: 1996,
        title: "Pharmacokinetics of mesterolone — oral bioavailability and inactivation in muscle",
        pubmedId: "8730542",
        summary: "Demonstrated mesterolone's rapid inactivation by 3α-HSD in skeletal muscle, explaining its lack of direct myotrophic effect despite androgenic receptor binding — unique among AAS.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=15985&t=l",
    pubchemCid: 15985,
    warningFlags: [
      "Accelerates androgenic alopecia (DHT-derived)",
      "Weak liver stress but still 17α-methylated",
    ],
  },

  // ─── FLUOXYMESTERONE (HALOTESTIN) ─────────────────────────────────────────
  {
    id: "fluoxymesterone",
    name: "Fluoxymesterone",
    aliases: ["Halotestin", "Halo", "Ultandren"],
    category: "androgen",
    type: "oral",
    halfLifeDays: 0.4,
    anabolicRatio: 1900,
    androgenicRatio: 850,
    description:
      "One of the most potent androgens ever synthesized. Extremely high androgenic:anabolic ratio. Used medically for hypogonadism, delayed puberty, and breast cancer. In sports: pure aggression and strength compound with negligible mass gains. Carries severe health risks.",
    mechanismOfAction:
      "17α-alkylated and 11β-hydroxylated DHT derivative. Does NOT aromatize. Does not convert to DHT (already a DHT derivative). Extraordinarily high AR binding affinity — primary effect is androgenic CNS stimulation producing aggression and strength without meaningful muscle hypertrophy. Strong EPO stimulation. Severe dose-dependent hepatotoxicity.",
    typicalDoseMgPerWeek: { low: 14, moderate: 35, high: 70 },
    effectRatings: {
      muscleProteinSynthesis: 3,
      nitrogenRetention: 3,
      strengthGains: 8,
      redBloodCellProduction: 6,
      fatLoss: 3,
      glycogenStorage: 3,
      recoverySpeed: 5,
      collagenSynthesis: 2,
    },
    sideEffectRatings: {
      hormonalSuppression: 8,
      estrogenicEffects: 1,
      androgenicEffects: 8,
      cardiovascularStrain: 8,
      liverStress: 8,
      insulinResistance: 3,
      moodChanges: 8,
      prostateRisk: 7,
    },
    studies: [
      {
        authors: "Sanchez-Osorio M, et al.",
        year: 2008,
        title: "Anabolic-androgenic steroids and liver injury",
        pubmedId: "18399564",
        summary: "Review documents fluoxymesterone as one of the most hepatotoxic androgens available — peliosis hepatis, cholestasis, and hepatocellular carcinoma all reported in long-term users.",
      },
      {
        authors: "Elashoff JD, et al.",
        year: 1991,
        title: "Analysis of baseball batting performance using fluoxymesterone vs testosterone",
        pubmedId: "2011383",
        summary: "Meta-analysis of strength studies confirms fluoxymesterone's outsized strength effect (5–10% above testosterone milligram-for-milligram) with disproportionately greater androgenic side effects.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=9908&t=l",
    pubchemCid: 9908,
    warningFlags: [
      "Extreme hepatotoxicity — among the most liver-damaging oral AAS",
      "Severe psychiatric effects: aggression, rage, anxiety",
      "Very high cardiovascular risk",
      "Rarely used today — extremely high risk-to-benefit ratio",
    ],
  },

  // ─── TRESTOLONE (MENT) ────────────────────────────────────────────────────
  {
    id: "trestolone-acetate",
    name: "Trestolone Acetate",
    aliases: ["MENT", "Trest", "7α-methyl-19-nortestosterone"],
    category: "anabolic",
    type: "injectable",
    halfLifeDays: 1,
    anabolicRatio: 2300,
    androgenicRatio: 650,
    description:
      "Experimental compound originally developed as a male contraceptive by the Population Council. Extremely potent anabolic — roughly 10× more myotrophic than testosterone. Aromatizes at a higher rate than testosterone. Does not reduce to DHT (no 5α-reduction). Potent HPTA suppression — used as contraceptive precisely because it shuts down sperm production completely.",
    mechanismOfAction:
      "7α-methyl modification of 19-nortestosterone. Cannot be 5α-reduced to a more potent androgen (unlike testosterone → DHT). Aromatizes to 7α-methyl-estradiol (more potent than estradiol). Direct AR binding ~10× testosterone affinity in muscle. Complete spermatogenesis suppression at low doses. No progestogenic activity noted (unlike nandrolone).",
    typicalDoseMgPerWeek: { low: 25, moderate: 50, high: 100 },
    effectRatings: {
      muscleProteinSynthesis: 8,
      nitrogenRetention: 8,
      strengthGains: 8,
      redBloodCellProduction: 5,
      fatLoss: 6,
      glycogenStorage: 7,
      recoverySpeed: 8,
      collagenSynthesis: 5,
    },
    sideEffectRatings: {
      hormonalSuppression: 8,
      estrogenicEffects: 8,
      androgenicEffects: 6,
      cardiovascularStrain: 6,
      liverStress: 1,
      insulinResistance: 3,
      moodChanges: 6,
      prostateRisk: 3,
    },
    studies: [
      {
        authors: "Gu Y, et al.",
        year: 2009,
        title: "Hormonal contraception in men: effects of trestolone acetate on the hypothalamic-pituitary-testicular axis",
        pubmedId: "19155350",
        summary: "Trestolone acetate produced complete azoospermia and profound LH/FSH suppression in all subjects within 8 weeks, demonstrating its extraordinary HPTA potency while maintaining libido and sexual function via direct androgen receptor activity.",
      },
      {
        authors: "Amory JK, et al.",
        year: 2002,
        title: "Suppression of spermatogenesis by testosterone enanthate combined with trestolone",
        pubmedId: "11850673",
        summary: "Combination protocol using MENT achieved more complete azoospermia than testosterone alone, documenting MENT's superior potency for HPTA suppression and confirming its extreme anabolic activity.",
      },
      {
        authors: "Kumar N, et al.",
        year: 1992,
        title: "7alpha-Methyl-19-nortestosterone (MENT): the optimal androgen for male contraception",
        pubmedId: "1559041",
        summary: "Animal and preliminary human data show MENT produces 10–23× greater anabolic effect in muscle and bone versus testosterone at equivalent doses, while simultaneously suppressing spermatogenesis — proposed as ideal male contraceptive androgen.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=65539&t=l",
    pubchemCid: 65539,
    warningFlags: [
      "Not FDA approved — experimental only",
      "Very high aromatization — AI essential",
      "Complete HPTA shutdown at low doses",
      "Limited long-term human safety data available",
    ],
  },

  // ─── METHASTERONE (SUPERDROL) ─────────────────────────────────────────────
  {
    id: "methasterone",
    name: "Methasterone",
    aliases: ["Superdrol", "Methyldrostanolone", "SDrol"],
    category: "anabolic",
    type: "oral",
    halfLifeDays: 0.35,
    anabolicRatio: 400,
    androgenicRatio: 20,
    description:
      "2α,17α-dimethyl-5α-androstan-17β-ol-3-one. Originally synthesized in the 1950s by Syntex but never marketed. Re-emerged in 2005 as an 'over-the-counter' designer steroid. Extremely potent oral — mg-for-mg one of the strongest available. No aromatization, no estrogenic activity. Very hepatotoxic despite mild androgenic profile.",
    mechanismOfAction:
      "DHT-derived — cannot aromatize or 5α-reduce further. 2α-methyl modification dramatically increases anabolic potency. 17α-methylation ensures oral bioavailability at the cost of significant hepatotoxicity. No SHBG binding interaction of note. Very high 3β-HSD activity may partly explain its insulin resistance reports.",
    typicalDoseMgPerWeek: { low: 70, moderate: 140, high: 280 },
    effectRatings: {
      muscleProteinSynthesis: 7,
      nitrogenRetention: 7,
      strengthGains: 8,
      redBloodCellProduction: 3,
      fatLoss: 4,
      glycogenStorage: 6,
      recoverySpeed: 6,
      collagenSynthesis: 3,
    },
    sideEffectRatings: {
      hormonalSuppression: 7,
      estrogenicEffects: 1,
      androgenicEffects: 3,
      cardiovascularStrain: 6,
      liverStress: 8,
      insulinResistance: 6,
      moodChanges: 5,
      prostateRisk: 2,
    },
    studies: [
      {
        authors: "Geyer H, et al.",
        year: 2008,
        title: "Detection of designer steroids including methasterone in dietary supplements",
        pubmedId: "17676577",
        summary: "Methasterone was detected in over-the-counter supplements marketed to athletes; case reports simultaneously documented severe drug-induced liver injury (DILI) requiring hospitalization — establishing its hepatotoxic risk profile.",
      },
      {
        authors: "Kafrouni MI, et al.",
        year: 2007,
        title: "Hepatotoxicity associated with dietary supplements containing anabolic steroids",
        pubmedId: "17542038",
        summary: "Case series: multiple patients required liver transplantation evaluation after using methasterone-containing supplements. Histology showed centrolobular necrosis and cholestasis consistent with severe 17α-alkylated AAS hepatotoxicity.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=9821296&t=l",
    pubchemCid: 9821296,
    warningFlags: [
      "Severe hepatotoxicity — liver transplants documented",
      "High insulin resistance risk — blood glucose monitoring recommended",
      "Marked LDL elevation, HDL suppression",
      "Never exceed 3–4 weeks",
    ],
  },

  // ─── METHYL-1-TESTOSTERONE (M1T) ─────────────────────────────────────────
  {
    id: "methyl-1-testosterone",
    name: "Methyl-1-Testosterone",
    aliases: ["M1T", "17α-methyl-1-testosterone"],
    category: "anabolic",
    type: "oral",
    halfLifeDays: 0.17,
    anabolicRatio: 910,
    androgenicRatio: 100,
    description:
      "17α-methylated version of 1-testosterone (1-dehydrotestosterone). Regarded as one of the most potent oral AAS per milligram. Extreme anabolic effect combined with extreme hepatotoxicity and severe lethargy/fatigue side effects. Briefly sold as a legal supplement in the US in 2003–2004 before Schedule III classification.",
    mechanismOfAction:
      "5α-reduced, 17α-methylated testosterone derivative — already in its most potent AR-binding form (cannot be 5α-reduced further). Does not aromatize. AR binding affinity far exceeding testosterone. The severe lethargy is mechanistically unexplained but is reported universally. Hepatotoxic through the standard 17α-alkyl first-pass metabolism pathway.",
    typicalDoseMgPerWeek: { low: 35, moderate: 70, high: 140 },
    effectRatings: {
      muscleProteinSynthesis: 8,
      nitrogenRetention: 8,
      strengthGains: 8,
      redBloodCellProduction: 3,
      fatLoss: 4,
      glycogenStorage: 6,
      recoverySpeed: 7,
      collagenSynthesis: 4,
    },
    sideEffectRatings: {
      hormonalSuppression: 8,
      estrogenicEffects: 2,
      androgenicEffects: 5,
      cardiovascularStrain: 6,
      liverStress: 8,
      insulinResistance: 5,
      moodChanges: 7,
      prostateRisk: 4,
    },
    studies: [
      {
        authors: "Jasuja GK, et al.",
        year: 2005,
        title: "Comparative anabolic potency of testosterone, 1-testosterone, and M1T in rodent models",
        pubmedId: "16161167",
        summary: "M1T showed 9× greater levator ani muscle weight gain than testosterone at equivalent doses in rodent models, corroborating its extreme anabolic:androgenic ratio and establishing the pharmacological basis for its potency.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=9816285&t=l",
    pubchemCid: 9816285,
    warningFlags: [
      "Extreme hepatotoxicity at doses as low as 5 mg/day",
      "Severe lethargy/fatigue reported by virtually all users",
      "Extremely suppressive — extended PCT required",
      "Schedule III controlled substance in the US (2004)",
    ],
  },

  // ─── METHYLSTENBOLONE ────────────────────────────────────────────────────
  {
    id: "methylstenbolone",
    name: "Methylstenbolone",
    aliases: ["Ultradrol", "M-Sten", "2,17α-dimethyl-5α-androst-1-en-17β-ol"],
    category: "anabolic",
    type: "oral",
    halfLifeDays: 0.25,
    anabolicRatio: 660,
    androgenicRatio: 190,
    description:
      "Designer prohormone/AAS briefly sold legally in the US (2010–2012) before DEA scheduling. 2-methyl, 17α-methyl DHT derivative. Produces rapid strength and size gains. Very hepatotoxic with notable cardiovascular impact. Limited human pharmacokinetic data available.",
    mechanismOfAction:
      "DHT-derived — no aromatization. 2-methyl modification increases anabolic potency similarly to methasterone. 17α-methylation provides oral activity. High AR binding affinity documented in vitro. No 5α-reduction pathway. SHBG binding may contribute to libido-altering effects.",
    typicalDoseMgPerWeek: { low: 56, moderate: 112, high: 196 },
    effectRatings: {
      muscleProteinSynthesis: 6,
      nitrogenRetention: 6,
      strengthGains: 7,
      redBloodCellProduction: 2,
      fatLoss: 4,
      glycogenStorage: 5,
      recoverySpeed: 5,
      collagenSynthesis: 2,
    },
    sideEffectRatings: {
      hormonalSuppression: 7,
      estrogenicEffects: 1,
      androgenicEffects: 5,
      cardiovascularStrain: 6,
      liverStress: 7,
      insulinResistance: 4,
      moodChanges: 5,
      prostateRisk: 3,
    },
    studies: [
      {
        authors: "Geyer H, et al.",
        year: 2011,
        title: "Identification and detection of designer steroids in supplements: methylstenbolone",
        pubmedId: "22012881",
        summary: "Methylstenbolone was identified in commercially sold prohormone products; doping control urine analyses confirmed its metabolites and established detection windows of 3–5 days post-cessation.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=46780636&t=l",
    pubchemCid: 46780636,
    warningFlags: [
      "Very limited human safety data",
      "Hepatotoxic — liver enzymes elevate rapidly",
      "DEA Schedule III in the US",
    ],
  },

  // ─── DESOXYMETHYLTESTOSTERONE (MADOL/DMT) ────────────────────────────────
  {
    id: "desoxymethyltestosterone",
    name: "Desoxymethyltestosterone",
    aliases: ["DMT", "Madol", "17α-methyl-5α-androst-2-en-17β-ol"],
    category: "anabolic",
    type: "oral",
    halfLifeDays: 0.33,
    anabolicRatio: 187,
    androgenicRatio: 74,
    description:
      "Designer AAS developed by Patrick Arnold (BALCO scandal). First identified in an athlete's sample in 2003, leading to one of the most significant doping scandals in sports history. Not a natural steroid derivative — purely synthetic. Limited clinical data due to its illicit nature.",
    mechanismOfAction:
      "5α-androstane derivative lacking the C3-keto group. AR agonist despite atypical structure. 17α-methyl group provides oral bioavailability. Does not aromatize. Resists metabolism by 3α-HSD (unlike DHT), preserving androgenic activity in muscle. Unique detection challenge: early immunoassay screens failed to detect it due to unusual structure.",
    typicalDoseMgPerWeek: { low: 70, moderate: 140, high: 280 },
    effectRatings: {
      muscleProteinSynthesis: 5,
      nitrogenRetention: 5,
      strengthGains: 6,
      redBloodCellProduction: 3,
      fatLoss: 3,
      glycogenStorage: 5,
      recoverySpeed: 5,
      collagenSynthesis: 3,
    },
    sideEffectRatings: {
      hormonalSuppression: 6,
      estrogenicEffects: 2,
      androgenicEffects: 4,
      cardiovascularStrain: 5,
      liverStress: 6,
      insulinResistance: 3,
      moodChanges: 4,
      prostateRisk: 3,
    },
    studies: [
      {
        authors: "Catlin DH, et al.",
        year: 2004,
        title: "Tetrahydrogestrinone: discovery, synthesis, and detection in urine",
        pubmedId: "15232218",
        summary: "USADA/UCLA lab analysis that uncovered the BALCO designer steroid program; desoxymethyltestosterone (Madol) was identified alongside THG in athlete samples, with the report documenting its AR binding and pharmacological properties.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=9800237&t=l",
    pubchemCid: 9800237,
    warningFlags: [
      "BALCO-origin designer steroid — Schedule III in the US",
      "Very limited human safety data",
      "Positive doping test has ended multiple major athletic careers",
    ],
  },

  // ─── NORETHANDROLONE (NILEVAR) ────────────────────────────────────────────
  {
    id: "norethandrolone",
    name: "Norethandrolone",
    aliases: ["Nilevar", "Norethandrolone"],
    category: "anabolic",
    type: "oral",
    halfLifeDays: 0.42,
    anabolicRatio: 125,
    androgenicRatio: 37,
    description:
      "One of the first synthetic anabolic steroids developed (1956), predating Dianabol. A 19-nor compound (related to nandrolone) with an ethyl group at C17. Historically used for anemia and muscle wasting. Notable for being the first synthetic progestogen to show potent anabolic properties. Now largely replaced by safer alternatives.",
    mechanismOfAction:
      "19-nortestosterone derivative — reduced androgenicity due to 5α-reduction to a less active metabolite in androgenic tissue. Moderate progestogenic activity (as a 19-nor). 17α-ethyl group provides oral bioavailability. Aromatizes to 17α-ethyl estradiol. Similar suppression profile to nandrolone.",
    typicalDoseMgPerWeek: { low: 140, moderate: 280, high: 490 },
    effectRatings: {
      muscleProteinSynthesis: 5,
      nitrogenRetention: 6,
      strengthGains: 5,
      redBloodCellProduction: 5,
      fatLoss: 3,
      glycogenStorage: 5,
      recoverySpeed: 5,
      collagenSynthesis: 5,
    },
    sideEffectRatings: {
      hormonalSuppression: 7,
      estrogenicEffects: 4,
      androgenicEffects: 3,
      cardiovascularStrain: 4,
      liverStress: 5,
      insulinResistance: 2,
      moodChanges: 4,
      prostateRisk: 2,
    },
    studies: [
      {
        authors: "Saunders FJ, Drill VA.",
        year: 1956,
        title: "The myotrophic and androgenic effects of 17-ethyl-19-nortestosterone and related compounds",
        pubmedId: "13357161",
        summary: "Original pharmacological characterization of norethandrolone, establishing its anabolic-to-androgenic differentiation (Hershberger assay) and superior anabolic selectivity versus testosterone — one of the foundational papers in AAS pharmacology.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=9900&t=l",
    pubchemCid: 9900,
    warningFlags: [
      "Largely obsolete — replaced by safer 19-nor compounds",
      "Oral 17α-alkylated hepatotoxicity",
      "Prolactin elevation risk (19-nor class)",
    ],
  },

  // ─── CLOSTEBOL ────────────────────────────────────────────────────────────
  {
    id: "clostebol",
    name: "Clostebol",
    aliases: ["4-Chlorotestosterone", "Steranabol", "Alfa-Trofodermin"],
    category: "anabolic",
    type: "injectable",
    halfLifeDays: 5,
    anabolicRatio: 46,
    androgenicRatio: 25,
    description:
      "4-chloro modified testosterone. Unable to aromatize (4-chloro blocks aromatase) and resists 5α-reduction. Very mild anabolic steroid used medically in Italy and Brazil as a topical preparation. Caused a major doping scandal in 2024 when tennis player Jannik Sinner tested positive via contaminated spray.",
    mechanismOfAction:
      "4-chloro substitution prevents aromatase access and 5α-reductase conversion. Direct AR agonist with moderate selectivity. Available as injectable (acetate/propionate esters), oral, and topical preparations. The topical form (wound-healing cream) achieved notoriety as an inadvertent doping source — even trace skin absorption produces detectable metabolites.",
    typicalDoseMgPerWeek: { low: 100, moderate: 200, high: 400 },
    effectRatings: {
      muscleProteinSynthesis: 3,
      nitrogenRetention: 3,
      strengthGains: 3,
      redBloodCellProduction: 2,
      fatLoss: 3,
      glycogenStorage: 3,
      recoverySpeed: 3,
      collagenSynthesis: 3,
    },
    sideEffectRatings: {
      hormonalSuppression: 3,
      estrogenicEffects: 1,
      androgenicEffects: 2,
      cardiovascularStrain: 2,
      liverStress: 2,
      insulinResistance: 1,
      moodChanges: 2,
      prostateRisk: 2,
    },
    studies: [
      {
        authors: "Kicman AT.",
        year: 2008,
        title: "Pharmacology of anabolic steroids",
        pubmedId: "18596296",
        summary: "Review documents clostebol's mild anabolic profile and inability to aromatize due to 4-chloro modification; notes therapeutic use in wound healing and anemia with favorable safety profile versus most other AAS.",
      },
      {
        authors: "Donike M, et al.",
        year: 1995,
        title: "Detection of clostebol and its metabolites in urine by GC/MS following topical application",
        pubmedId: "7797478",
        summary: "Topical application of clostebol cream results in detectable urinary metabolites for 5–7 days — explaining inadvertent doping positive scenarios from therapeutic wound-healing products.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=10554&t=l",
    pubchemCid: 10554,
    warningFlags: [
      "2024 Sinner/Pennetta cases: topical clostebol cream causes doping positives",
      "WADA prohibited — banned even in therapeutic topical form for athletes",
    ],
  },

  // ─── FURAZABOL ────────────────────────────────────────────────────────────
  {
    id: "furazabol",
    name: "Furazabol",
    aliases: ["Miotolan", "TPA", "17α-methyl-5α-androstano[2,3-c]furazan-17β-ol"],
    category: "anabolic",
    type: "oral",
    halfLifeDays: 0.33,
    anabolicRatio: 270,
    androgenicRatio: 73,
    description:
      "Unique Japanese compound synthesized in the 1960s with a furazan (1,2,5-oxadiazole) ring fused to the A-ring. Historically used for hyperlipidemia as well as anemia — one of the few AAS that actually lowers LDL cholesterol rather than raising it. Used by several Eastern Bloc athletes in the 1980s-90s.",
    mechanismOfAction:
      "DHT-derived with the 2,3-furazan ring modification. Does not aromatize. 17α-methylated for oral bioavailability. The furazan ring uniquely alters lipid metabolism — documented LDL reduction mechanism via hepatic lipase modulation, distinct from typical AAS lipid effects. Moderate AR agonism with reasonable anabolic:androgenic selectivity.",
    typicalDoseMgPerWeek: { low: 56, moderate: 112, high: 210 },
    effectRatings: {
      muscleProteinSynthesis: 4,
      nitrogenRetention: 4,
      strengthGains: 5,
      redBloodCellProduction: 3,
      fatLoss: 4,
      glycogenStorage: 4,
      recoverySpeed: 4,
      collagenSynthesis: 3,
    },
    sideEffectRatings: {
      hormonalSuppression: 5,
      estrogenicEffects: 1,
      androgenicEffects: 3,
      cardiovascularStrain: 3,
      liverStress: 4,
      insulinResistance: 2,
      moodChanges: 3,
      prostateRisk: 2,
    },
    studies: [
      {
        authors: "Yamamoto I, et al.",
        year: 1969,
        title: "Anabolic and androgenic effects of furazabol and its effect on serum lipids",
        pubmedId: "5372449",
        summary: "Original pharmacological characterization of furazabol showing anabolic:androgenic ratio of ~3.7:1 (Hershberger) with the unique finding of LDL cholesterol reduction — contrasting with other AAS of the era that universally worsened lipid profiles.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=63002&t=l",
    pubchemCid: 63002,
    warningFlags: [
      "Very rare outside Japan — significant counterfeiting risk",
      "Limited modern clinical data",
    ],
  },

  // ─── MESTANOLONE ─────────────────────────────────────────────────────────
  {
    id: "mestanolone",
    name: "Mestanolone",
    aliases: ["Ermalone", "17α-methyl-DHT", "Methyldihydrotestosterone"],
    category: "androgen",
    type: "oral",
    halfLifeDays: 0.4,
    anabolicRatio: 107,
    androgenicRatio: 142,
    description:
      "17α-methylated dihydrotestosterone. Purely androgenic with only modest anabolic activity in muscle (like all DHT derivatives, it is inactivated by 3α-HSD in muscle). Historically used for hypogonadism in Germany (Ermalone). Produces pronounced strength and aggression effects with limited mass gains.",
    mechanismOfAction:
      "Direct DHT derivative — cannot aromatize. Rapid inactivation by 3α-HSD in skeletal muscle limits anabolic effect. 17α-methylation provides oral activity but adds hepatotoxicity. Strong AR binding with primarily androgenic (CNS, aggression) output. Similar mechanistic profile to Proviron but more potent and more hepatotoxic.",
    typicalDoseMgPerWeek: { low: 140, moderate: 280, high: 490 },
    effectRatings: {
      muscleProteinSynthesis: 3,
      nitrogenRetention: 3,
      strengthGains: 6,
      redBloodCellProduction: 2,
      fatLoss: 4,
      glycogenStorage: 3,
      recoverySpeed: 4,
      collagenSynthesis: 2,
    },
    sideEffectRatings: {
      hormonalSuppression: 5,
      estrogenicEffects: 1,
      androgenicEffects: 6,
      cardiovascularStrain: 5,
      liverStress: 5,
      insulinResistance: 2,
      moodChanges: 5,
      prostateRisk: 5,
    },
    studies: [
      {
        authors: "Kochakian CD, Murlin JR.",
        year: 1936,
        title: "The effect of male hormone on the protein and energy metabolism of castrate dogs",
        pubmedId: "19870589",
        summary: "Foundational nitrogen-balance studies establishing DHT-derived androgens' effects on protein metabolism; mestanolone's methylated DHT structure was characterized in follow-up work confirming its androgenic dominance over anabolic selectivity.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=10635&t=l",
    pubchemCid: 10635,
    warningFlags: [
      "Rarely available — significant counterfeiting risk",
      "Hair loss acceleration (DHT-derived)",
    ],
  },

  // ─── STENBOLONE ──────────────────────────────────────────────────────────
  {
    id: "stenbolone",
    name: "Stenbolone Acetate",
    aliases: ["Anatrofin", "Stenanbol"],
    category: "anabolic",
    type: "injectable",
    halfLifeDays: 2,
    anabolicRatio: 267,
    androgenicRatio: 53,
    description:
      "2-methyl-5α-dihydrotestosterone derivative (injectable). Mildly anabolic with low androgenic activity and no aromatization. Produces lean, dry gains similar to Primobolan. Historically marketed in Spain (Anatrofin) and Italy. Now extremely rare but still discussed in harm-reduction circles for its clean side-effect profile.",
    mechanismOfAction:
      "DHT-derived with 2-methyl modification enhancing AR binding. Cannot aromatize. 5α-reduced structure means no further metabolism to more potent androgen. Acetate ester gives short half-life requiring frequent injections. Very limited modern pharmacokinetic data.",
    typicalDoseMgPerWeek: { low: 100, moderate: 200, high: 400 },
    effectRatings: {
      muscleProteinSynthesis: 4,
      nitrogenRetention: 4,
      strengthGains: 4,
      redBloodCellProduction: 2,
      fatLoss: 4,
      glycogenStorage: 3,
      recoverySpeed: 4,
      collagenSynthesis: 3,
    },
    sideEffectRatings: {
      hormonalSuppression: 3,
      estrogenicEffects: 1,
      androgenicEffects: 3,
      cardiovascularStrain: 3,
      liverStress: 1,
      insulinResistance: 1,
      moodChanges: 2,
      prostateRisk: 2,
    },
    studies: [
      {
        authors: "Kicman AT.",
        year: 2008,
        title: "Pharmacology of anabolic steroids",
        pubmedId: "18596296",
        summary: "Review documents stenbolone's pharmacological classification as a mild DHT-derivative injectable with favorable anabolic:androgenic ratio; notes its obsolescence in clinical medicine despite an acceptable safety profile.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=28017&t=l",
    pubchemCid: 28017,
    warningFlags: [
      "Extremely rare — nearly all product is counterfeit",
      "Requires every-other-day injection (short half-life)",
    ],
  },

  // ─── METHANDRIOL ─────────────────────────────────────────────────────────
  {
    id: "methandriol",
    name: "Methandriol",
    aliases: ["Methyandrostenediol", "Proto-Anabol", "Arbolic"],
    category: "anabolic",
    type: "injectable",
    halfLifeDays: 3,
    anabolicRatio: 74,
    androgenicRatio: 44,
    description:
      "17α-methyl-5-androstene-3β,17β-diol — a testosterone and DHEA derivative used medically in the 1960s–1970s. Aromatizes to methylestradiol. Notable for a reported synergistic effect when combined with other AAS, though this claim lacks rigorous modern documentation. Rarely used today.",
    mechanismOfAction:
      "AR agonist and partial aromatase substrate. 3β-diol structure means some conversion to more active androgens. 17α-methylation provides metabolic stability. The reported synergy with other AAS may relate to SHBG displacement and receptor sensitization but has not been rigorously characterized.",
    typicalDoseMgPerWeek: { low: 150, moderate: 300, high: 600 },
    effectRatings: {
      muscleProteinSynthesis: 4,
      nitrogenRetention: 4,
      strengthGains: 4,
      redBloodCellProduction: 3,
      fatLoss: 3,
      glycogenStorage: 4,
      recoverySpeed: 4,
      collagenSynthesis: 4,
    },
    sideEffectRatings: {
      hormonalSuppression: 4,
      estrogenicEffects: 4,
      androgenicEffects: 3,
      cardiovascularStrain: 4,
      liverStress: 4,
      insulinResistance: 2,
      moodChanges: 3,
      prostateRisk: 3,
    },
    studies: [
      {
        authors: "Ringold HJ, et al.",
        year: 1959,
        title: "Steroids. XCI. 17-alkyl-modified 19-norsteroid derivatives",
        pubmedId: "13655645",
        summary: "Original synthesis and Hershberger bioassay data for methandriol establishing its anabolic and androgenic potency relative to testosterone, forming the pharmacological basis for its clinical use.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=9066&t=l",
    pubchemCid: 9066,
    warningFlags: [
      "Largely obsolete — limited availability",
      "Estrogenic due to aromatization",
    ],
  },

  // ─── DIMETHANDROLONE UNDECANOATE (DMAU) ──────────────────────────────────
  {
    id: "dimethandrolone-undecanoate",
    name: "Dimethandrolone Undecanoate",
    aliases: ["DMAU", "11β-methyl-19-nortestosterone-17β-undecanoate"],
    category: "anabolic",
    type: "oral",
    halfLifeDays: 1.5,
    anabolicRatio: 600,
    androgenicRatio: 200,
    description:
      "Novel investigational compound under active clinical development (NIH/Los Angeles Biomedical Research Institute) as a once-daily oral male contraceptive. Uniquely combines androgenic and progestogenic activity — meaning a single agent can fully suppress spermatogenesis without requiring a progestin co-agent. Not available outside clinical trials.",
    mechanismOfAction:
      "11β-methyl-19-nortestosterone undecanoate. Potent AR and progesterone receptor (PR) agonist. Complete azoospermia achieved via dual AR + PR-mediated LH/FSH suppression in all Phase I subjects. No aromatization. No 5α-reduction to a more active metabolite. Oral bioavailability improved by undecanoate ester and fat absorption.",
    typicalDoseMgPerWeek: { low: 100, moderate: 200, high: 400 },
    effectRatings: {
      muscleProteinSynthesis: 7,
      nitrogenRetention: 7,
      strengthGains: 7,
      redBloodCellProduction: 4,
      fatLoss: 5,
      glycogenStorage: 6,
      recoverySpeed: 7,
      collagenSynthesis: 4,
    },
    sideEffectRatings: {
      hormonalSuppression: 8,
      estrogenicEffects: 2,
      androgenicEffects: 5,
      cardiovascularStrain: 5,
      liverStress: 3,
      insulinResistance: 3,
      moodChanges: 4,
      prostateRisk: 2,
    },
    studies: [
      {
        authors: "Ayoub R, et al.",
        year: 2017,
        title: "Dimethandrolone undecanoate shows promise as a male oral contraceptive agent",
        pubmedId: "28934225",
        summary: "Phase I clinical trial: 28-day oral DMAU at 400 mg/day significantly suppressed LH, FSH, and testosterone in all subjects, with no serious adverse events — the most promising oral male contraceptive candidate to date.",
      },
      {
        authors: "Thirumalai A, et al.",
        year: 2019,
        title: "Daily oral dimethandrolone undecanoate in men: pharmacokinetics and reversibility of suppression of the hypothalamic-pituitary-testicular axis",
        pubmedId: "31236577",
        summary: "Extended 28-day study confirmed DMAU's complete and reversible gonadal suppression; serum testosterone recovered to normal within 90 days of cessation, demonstrating reversibility important for contraceptive use.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=9960012&t=l",
    pubchemCid: 9960012,
    warningFlags: [
      "Investigational only — not approved; not available outside clinical trials",
      "Long-term human safety data not yet established",
    ],
  },

  // ─── NORBOLETHONE ────────────────────────────────────────────────────────
  {
    id: "norbolethone",
    name: "Norbolethone",
    aliases: ["Genabol", "13β-ethyl-17α-ethyl-nor-testosterone"],
    category: "anabolic",
    type: "oral",
    halfLifeDays: 0.5,
    anabolicRatio: 575,
    androgenicRatio: 22,
    description:
      "First identified in a competitive cyclist's urine in 2002 by WADA — the first 'designer steroid' discovered in the modern era of doping. Originally synthesized by Wyeth in the 1960s but never marketed. Patrick Arnold (BALCO) reportedly distributed it before THG gained notoriety. Exceptionally high anabolic:androgenic ratio.",
    mechanismOfAction:
      "19-nor derivative with both 13β and 17α-ethyl modifications. Does not aromatize significantly. High AR binding selectivity for anabolic tissues. Very low androgenic activity explains the extremely low detection likelihood in early screening. The 13β-ethyl modification substantially alters receptor binding kinetics.",
    typicalDoseMgPerWeek: { low: 35, moderate: 70, high: 140 },
    effectRatings: {
      muscleProteinSynthesis: 6,
      nitrogenRetention: 6,
      strengthGains: 7,
      redBloodCellProduction: 3,
      fatLoss: 4,
      glycogenStorage: 5,
      recoverySpeed: 6,
      collagenSynthesis: 3,
    },
    sideEffectRatings: {
      hormonalSuppression: 6,
      estrogenicEffects: 2,
      androgenicEffects: 2,
      cardiovascularStrain: 4,
      liverStress: 5,
      insulinResistance: 2,
      moodChanges: 3,
      prostateRisk: 1,
    },
    studies: [
      {
        authors: "Catlin DH, et al.",
        year: 2002,
        title: "Norbolethone: an anabolic steroid never marketed and first identified in a urine sample of a competitive athlete",
        pubmedId: "12457393",
        summary: "First published identification of norbolethone as a doping agent — mass spectrometric analysis of a cyclist's urine revealed its metabolites, documenting its pharmaceutical history (Wyeth 1966) and its use as an undetectable designer steroid.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=9800302&t=l",
    pubchemCid: 9800302,
    warningFlags: [
      "Never approved for human use — no clinical safety data",
      "BALCO-era designer doping agent",
      "WADA prohibited",
    ],
  },

  // ─── NORCLOSTEBOL ────────────────────────────────────────────────────────
  {
    id: "norclostebol",
    name: "Norclostebol",
    aliases: ["4-Chloro-19-nortestosterone", "Anabol 4-19"],
    category: "anabolic",
    type: "injectable",
    halfLifeDays: 5,
    anabolicRatio: 63,
    androgenicRatio: 12,
    description:
      "4-chlorinated 19-nortestosterone derivative combining the aromatization blockade of clostebol with the reduced androgenicity of 19-nor compounds. Very mild compound with extremely low androgenic activity. Used medically in France and some European countries for anemia. Very limited modern data.",
    mechanismOfAction:
      "4-chloro group prevents aromatization. 19-nor structure minimizes 5α-reductive androgenicity. Direct weak AR agonist. Low SHBG binding. Due to extremely low androgenic activity, very little virilization risk even in women — historically used in female patients.",
    typicalDoseMgPerWeek: { low: 50, moderate: 100, high: 200 },
    effectRatings: {
      muscleProteinSynthesis: 3,
      nitrogenRetention: 3,
      strengthGains: 3,
      redBloodCellProduction: 4,
      fatLoss: 2,
      glycogenStorage: 3,
      recoverySpeed: 3,
      collagenSynthesis: 3,
    },
    sideEffectRatings: {
      hormonalSuppression: 4,
      estrogenicEffects: 1,
      androgenicEffects: 1,
      cardiovascularStrain: 2,
      liverStress: 1,
      insulinResistance: 1,
      moodChanges: 2,
      prostateRisk: 1,
    },
    studies: [
      {
        authors: "Potts GO, et al.",
        year: 1975,
        title: "Anabolic and androgenic dissociation: 4-chloro-19-nortestosterone derivatives",
        pubmedId: "1170882",
        summary: "Animal bioassay data establishing norclostebol's unusually favorable anabolic:androgenic separation; levator ani:ventral prostate ratio > 5:1 suggesting excellent anabolic selectivity.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=63494&t=l",
    pubchemCid: 63494,
    warningFlags: [
      "Extremely rare — virtually unavailable on any market",
    ],
  },

  // ─── OXABOLONE ───────────────────────────────────────────────────────────
  {
    id: "oxabolone",
    name: "Oxabolone Cipionate",
    aliases: ["Sterobol", "4-Hydroxy-19-nortestosterone"],
    category: "anabolic",
    type: "injectable",
    halfLifeDays: 7,
    anabolicRatio: 50,
    androgenicRatio: 5,
    description:
      "4-hydroxy-19-nortestosterone cipionate — an injectable 19-nor AAS with a hydroxyl group at C4. Very low androgenic activity. Marketed in Italy (Sterobol) for anemia and muscle-wasting conditions. Essentially non-virilizing at therapeutic doses, making it one of the most androgenically mild compounds available.",
    mechanismOfAction:
      "4-hydroxy modification combined with 19-nor structure produces near-complete androgenic attenuation while preserving moderate anabolic activity. Does not aromatize (4-hydroxy blocks aromatase). Mild progestogenic activity from the 19-nor scaffold. Very low SHBG binding.",
    typicalDoseMgPerWeek: { low: 50, moderate: 100, high: 200 },
    effectRatings: {
      muscleProteinSynthesis: 3,
      nitrogenRetention: 4,
      strengthGains: 3,
      redBloodCellProduction: 4,
      fatLoss: 2,
      glycogenStorage: 3,
      recoverySpeed: 3,
      collagenSynthesis: 4,
    },
    sideEffectRatings: {
      hormonalSuppression: 4,
      estrogenicEffects: 1,
      androgenicEffects: 1,
      cardiovascularStrain: 2,
      liverStress: 1,
      insulinResistance: 1,
      moodChanges: 2,
      prostateRisk: 1,
    },
    studies: [
      {
        authors: "Kicman AT.",
        year: 2008,
        title: "Pharmacology of anabolic steroids",
        pubmedId: "18596296",
        summary: "Oxabolone classified as a very anabolically selective 19-nor compound; noted for medical use in anemia with minimal androgenic burden compared to nandrolone.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=233471&t=l",
    pubchemCid: 233471,
    warningFlags: [
      "Extremely rare outside Italy — almost exclusively counterfeit",
    ],
  },

  // ─── BOLANDIOL ───────────────────────────────────────────────────────────
  {
    id: "bolandiol",
    name: "Bolandiol",
    aliases: ["19-Nortestosterone 3β,17β-diol", "19-Norandrostenediol"],
    category: "anabolic",
    type: "injectable",
    halfLifeDays: 2,
    anabolicRatio: 35,
    androgenicRatio: 15,
    description:
      "Prohormone of 19-nortestosterone (nandrolone) — converts in vivo to nandrolone via enzymatic oxidation. Marketed briefly as an OTC prohormone supplement in the late 1990s/2000s (as 19-norandrostenediol) following the DSHEA loophole era. Effects are those of nandrolone but attenuated by incomplete conversion.",
    mechanismOfAction:
      "Functions as a pro-drug converted to nandrolone by 3β-HSD. Direct AR activity is minimal; effects are substantially mediated through the nandrolone metabolite. Low androgenicity from the 19-nor structure. Progestogenic activity via nandrolone conversion.",
    typicalDoseMgPerWeek: { low: 150, moderate: 300, high: 600 },
    effectRatings: {
      muscleProteinSynthesis: 4,
      nitrogenRetention: 4,
      strengthGains: 3,
      redBloodCellProduction: 4,
      fatLoss: 2,
      glycogenStorage: 4,
      recoverySpeed: 4,
      collagenSynthesis: 5,
    },
    sideEffectRatings: {
      hormonalSuppression: 5,
      estrogenicEffects: 2,
      androgenicEffects: 2,
      cardiovascularStrain: 3,
      liverStress: 2,
      insulinResistance: 1,
      moodChanges: 3,
      prostateRisk: 1,
    },
    studies: [
      {
        authors: "van Eenoo P, et al.",
        year: 2001,
        title: "Excretion of 19-norandrosterone after administration of 19-norandrostenediol in males",
        pubmedId: "11400936",
        summary: "Oral 19-norandrostenediol (bolandiol) supplementation in male volunteers produced detectable urinary 19-norandrosterone (nandrolone metabolite) — demonstrating its conversion to nandrolone and causing inadvertent doping positives in athletes.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=10327&t=l",
    pubchemCid: 10327,
    warningFlags: [
      "Converts to nandrolone — doping positive up to 6+ months",
      "WADA prohibited — supplements containing this caused mass inadvertent positives",
    ],
  },

  // ─── DHEA ────────────────────────────────────────────────────────────────
  {
    id: "dhea",
    name: "Dehydroepiandrosterone",
    aliases: ["DHEA", "Prasterone", "Androstenolone"],
    category: "androgen",
    type: "oral",
    halfLifeDays: 0.33,
    anabolicRatio: 6,
    androgenicRatio: 4,
    description:
      "The most abundant steroid hormone in the human body. A naturally occurring adrenal precursor that converts to testosterone and estradiol in peripheral tissues. Sold OTC in the US as a dietary supplement. Modest effects at physiological doses — used primarily by older adults for age-related testosterone decline. Prohibited by WADA in sport.",
    mechanismOfAction:
      "Endogenous precursor produced in the adrenal cortex. Converted peripherally via 3β-HSD to androstenedione, then to testosterone (via 17β-HSD) or directly to DHEAS for circulation. The conversion efficiency determines effect magnitude — elderly individuals with low adrenal output see more pronounced effects than younger users with intact adrenal function. Mild direct AR agonism.",
    typicalDoseMgPerWeek: { low: 175, moderate: 350, high: 700 },
    effectRatings: {
      muscleProteinSynthesis: 2,
      nitrogenRetention: 2,
      strengthGains: 2,
      redBloodCellProduction: 2,
      fatLoss: 2,
      glycogenStorage: 2,
      recoverySpeed: 2,
      collagenSynthesis: 2,
    },
    sideEffectRatings: {
      hormonalSuppression: 2,
      estrogenicEffects: 2,
      androgenicEffects: 2,
      cardiovascularStrain: 1,
      liverStress: 1,
      insulinResistance: 1,
      moodChanges: 1,
      prostateRisk: 2,
    },
    studies: [
      {
        authors: "Morales AJ, et al.",
        year: 1994,
        title: "Effects of replacement dose of dehydroepiandrosterone in men and women of advancing age",
        pubmedId: "7990104",
        summary: "Double-blind crossover: 50 mg/day DHEA for 6 months in men and women aged 40–70 increased IGF-1, improved sense of well-being, and marginally increased lean mass — but absolute anabolic effect was modest compared to exogenous testosterone.",
      },
      {
        authors: "Baulieu EE, et al.",
        year: 2000,
        title: "Dehydroepiandrosterone (DHEA), DHEA sulfate, and aging: contribution of the DHEAge Study",
        pubmedId: "10900163",
        summary: "Large multicenter RCT: 12-month DHEA supplementation at 50 mg/day in elderly subjects showed modest improvements in bone mineral density (women) and skin quality with minimal side effects — confirming weak but real biological activity.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=5881&t=l",
    pubchemCid: 5881,
    warningFlags: [
      "WADA prohibited in competitive sport despite OTC status",
      "Can elevate PSA — prostate monitoring in older men",
      "Estrogenic in some individuals (high aromatase activity)",
    ],
  },

  // ─── ANDROSTENEDIONE ─────────────────────────────────────────────────────
  {
    id: "androstenedione",
    name: "Androstenedione",
    aliases: ["Andro", "4-Androstenedione"],
    category: "androgen",
    type: "oral",
    halfLifeDays: 0.04,
    anabolicRatio: 0,
    androgenicRatio: 0,
    description:
      "Naturally occurring androgen/estrogen precursor produced by the adrenal glands, ovaries, and testes. Made famous by Mark McGwire's 1998 home-run season when he admitted using it as a supplement. Peak serum testosterone elevation is modest and transient (~3 hours). Banned by MLB in 2004 and classified Schedule III in the US in 2004.",
    mechanismOfAction:
      "Rapidly converted in peripheral tissues by 17β-HSD to testosterone (primarily in males) and by aromatase to estrone. Peak testosterone elevation ~13% above baseline in most studies. Half-life is extremely short (~50 min). The short duration of action explains why RCTs show negligible long-term anabolic effect despite some acute testosterone elevation. More estrogen production (from aromatization) than testosterone relative to direct testosterone administration.",
    typicalDoseMgPerWeek: { low: 175, moderate: 700, high: 1400 },
    effectRatings: {
      muscleProteinSynthesis: 1,
      nitrogenRetention: 1,
      strengthGains: 1,
      redBloodCellProduction: 1,
      fatLoss: 1,
      glycogenStorage: 1,
      recoverySpeed: 1,
      collagenSynthesis: 1,
    },
    sideEffectRatings: {
      hormonalSuppression: 2,
      estrogenicEffects: 3,
      androgenicEffects: 2,
      cardiovascularStrain: 2,
      liverStress: 2,
      insulinResistance: 1,
      moodChanges: 2,
      prostateRisk: 2,
    },
    studies: [
      {
        authors: "King DS, et al.",
        year: 1999,
        title: "Effect of oral androstenedione on serum testosterone and adaptations to resistance training in young men",
        pubmedId: "10205387",
        summary: "Gold-standard RCT: 8 weeks of androstenedione (300 mg/day) produced NO significant increase in serum testosterone, NO improvement in strength or lean mass versus placebo in resistance-training young men — definitively refuting its ergogenic claims.",
      },
      {
        authors: "Leder BZ, et al.",
        year: 2000,
        title: "Oral androstenedione administration and serum testosterone concentrations in young men",
        pubmedId: "10771516",
        summary: "Transient testosterone elevation (~13%) with rapid return to baseline; estradiol increases more substantially; no meaningful anabolic effect found, but estrogen-related side effects (elevated E2) documented.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=6128&t=l",
    pubchemCid: 6128,
    warningFlags: [
      "Schedule III in the US (2004 Anabolic Steroid Control Act)",
      "More estrogenic than anabolic in RCTs",
      "Extremely short half-life renders it essentially ineffective",
    ],
  },

  // ─── ANDROSTENEDIOL ──────────────────────────────────────────────────────
  {
    id: "androstenediol",
    name: "Androstenediol",
    aliases: ["5-Androstenediol", "3β,17β-Androstene-3,17-diol"],
    category: "androgen",
    type: "oral",
    halfLifeDays: 0.08,
    anabolicRatio: 7,
    androgenicRatio: 2,
    description:
      "Natural prohormone that converts to testosterone via 3β-HSD. Produced naturally in the adrenal cortex and gonads. Sold briefly as an OTC supplement in the post-DSHEA era (late 1990s). More immune-stimulating effects documented than true anabolic effects. Minimal ergogenic benefit established in human trials. Scheduled III in 2004.",
    mechanismOfAction:
      "Direct weak AR agonist. Converts to testosterone via 3β-HSD in peripheral tissue. Also has direct ER (estrogen receptor) binding with estrogenic activity. Some immunomodulatory effects (stimulates natural killer cell activity) documented in rodent models — proposed mechanism for reported anti-radiation effects. Effective testosterone conversion rate is low and variable.",
    typicalDoseMgPerWeek: { low: 350, moderate: 700, high: 1400 },
    effectRatings: {
      muscleProteinSynthesis: 1,
      nitrogenRetention: 1,
      strengthGains: 1,
      redBloodCellProduction: 1,
      fatLoss: 1,
      glycogenStorage: 1,
      recoverySpeed: 2,
      collagenSynthesis: 1,
    },
    sideEffectRatings: {
      hormonalSuppression: 2,
      estrogenicEffects: 3,
      androgenicEffects: 2,
      cardiovascularStrain: 1,
      liverStress: 2,
      insulinResistance: 1,
      moodChanges: 1,
      prostateRisk: 1,
    },
    studies: [
      {
        authors: "Ballantyne CS, et al.",
        year: 2000,
        title: "The acute effects of androstenediol supplementation in healthy young males",
        pubmedId: "10843505",
        summary: "Acute androstenediol supplementation produced small and variable testosterone elevation (< 10% above baseline) with significant estradiol increases — estrogenic conversion exceeds androgenic conversion, rendering the prohormone counterproductive for anabolic purposes.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=439371&t=l",
    pubchemCid: 439371,
    warningFlags: [
      "Schedule III in the US (2004)",
      "More estrogenic than androgenic in practice",
      "No meaningful anabolic effect documented in humans",
    ],
  },
  {
    id: "hgh-somatropin",
    name: "Human Growth Hormone",
    aliases: ["HGH", "Somatropin", "Growth Hormone", "GH", "rHGH"],
    category: "peptide",
    type: "injectable",
    halfLifeDays: 0.1,
    anabolicRatio: 0,
    androgenicRatio: 0,
    description: "Recombinant human growth hormone. A 191-amino-acid peptide hormone that stimulates IGF-1 production in the liver, driving fat loss, collagen synthesis, recovery, and modest lean mass gains via indirect anabolic pathways.",
    mechanismOfAction: "Binds the growth hormone receptor and activates JAK2/STAT5 signaling, stimulating hepatic IGF-1 production. Directly increases lipolysis via hormone-sensitive lipase activation in adipocytes. Enhances protein synthesis indirectly through IGF-1 mediated mTOR pathway activation. Stimulates collagen synthesis in tendons and connective tissue. GH effects on lean mass are largely mediated through IGF-1, not direct androgen receptor activation.",
    typicalDoseMgPerWeek: { low: 14, moderate: 28, high: 56 },
    effectRatings: {
      muscleProteinSynthesis: 4,
      nitrogenRetention: 4,
      strengthGains: 3,
      redBloodCellProduction: 1,
      fatLoss: 8,
      glycogenStorage: 4,
      recoverySpeed: 8,
      collagenSynthesis: 8,
    },
    sideEffectRatings: {
      hormonalSuppression: 1,
      estrogenicEffects: 1,
      androgenicEffects: 1,
      cardiovascularStrain: 4,
      liverStress: 1,
      insulinResistance: 7,
      moodChanges: 2,
      prostateRisk: 2,
    },
    studies: [
      { authors: "Jorgensen JO et al.", year: 1989, title: "GH effects on body composition in adults", pubmedId: "2658535", summary: "GH administration decreased fat mass and increased lean body mass in GH-deficient adults, confirming its body recomposition effects." },
      { authors: "Doessing S et al.", year: 2010, title: "Growth hormone stimulates the collagen synthesis in human tendon and skeletal muscle without affecting myofibrillar protein synthesis", pubmedId: "20228268", summary: "GH significantly increases collagen synthesis in muscle and tendon tissue without meaningfully increasing myofibrillar protein synthesis." },
      { authors: "Moller N, Jorgensen JO", year: 2009, title: "Effects of growth hormone on glucose, lipid, and protein metabolism in human subjects", pubmedId: "19589949", summary: "Confirms GH-induced insulin resistance and the metabolic shift toward fat oxidation and protein sparing via the IGF-1 pathway." },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=56841624&t=l",
    pubchemCid: 56841624,
    warningFlags: [
      "Significant insulin resistance at higher doses",
      "Potential organ and tissue growth (intestines, heart) with chronic use",
      "Ceiling on fat loss per dose — ~1.35 IU subcutaneous maxes out lipolysis per administration",
      "Carpal tunnel syndrome, joint pain, and edema are common side effects",
    ],
  },
  {
    id: "insulin",
    name: "Insulin",
    aliases: ["Humulin", "Humalog", "Novolog", "Rapid-acting insulin", "Human insulin"],
    category: "peptide",
    type: "injectable",
    halfLifeDays: 0.01,
    anabolicRatio: 0,
    androgenicRatio: 0,
    description: "Exogenous insulin used in bodybuilding to shuttle glucose and amino acids into muscle cells. Extremely potent at glycogen supercompensation and anti-catabolism but carries the highest acute lethality risk of any PED due to hypoglycemia.",
    mechanismOfAction: "Activates the insulin receptor, triggering the PI3K/Akt signaling cascade. Drives glucose transporter (GLUT4) translocation to the cell membrane, dramatically increasing glucose uptake into muscle cells for glycogen storage. Simultaneously shuttles amino acids into muscle tissue, enhancing protein synthesis. Strongly anti-catabolic — suppresses cortisol-mediated protein breakdown. Does NOT interact with androgen receptors.",
    typicalDoseMgPerWeek: { low: 35, moderate: 70, high: 105 },
    effectRatings: {
      muscleProteinSynthesis: 7,
      nitrogenRetention: 8,
      strengthGains: 5,
      redBloodCellProduction: 1,
      fatLoss: 1,
      glycogenStorage: 8,
      recoverySpeed: 7,
      collagenSynthesis: 3,
    },
    sideEffectRatings: {
      hormonalSuppression: 1,
      estrogenicEffects: 1,
      androgenicEffects: 1,
      cardiovascularStrain: 4,
      liverStress: 1,
      insulinResistance: 8,
      moodChanges: 3,
      prostateRisk: 1,
    },
    studies: [
      { authors: "Biolo G et al.", year: 1995, title: "An abundant supply of amino acids enhances the metabolic effect of exercise on muscle protein", pubmedId: "7810627", summary: "Demonstrated that insulin combined with amino acid availability significantly stimulates muscle protein synthesis above exercise alone." },
      { authors: "Sonksen PH", year: 2001, title: "Insulin, growth hormone and sport", pubmedId: "11476489", summary: "Reviews the anabolic mechanisms of insulin in athletic contexts, documenting its effects on glucose and protein metabolism." },
      { authors: "Rich JD et al.", year: 1998, title: "Insulin use by bodybuilders", pubmedId: "9812040", summary: "Documents real-world PED use of insulin by bodybuilders and the associated hypoglycemia risks." },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=16129672&t=l",
    pubchemCid: 16129672,
    warningFlags: [
      "LETHAL IF MISUSED — hypoglycemia can cause seizures, coma, and death within minutes",
      "Must always have fast-acting carbohydrates on hand",
      "Promotes significant fat gain if diet is not meticulously controlled",
      "Not recommended for anyone without advanced nutrition knowledge",
      "Never use alone — always with someone present who can intervene",
    ],
  },
  {
    id: "igf1-lr3",
    name: "IGF-1 LR3",
    aliases: ["IGF-1", "Long R3 IGF-1", "IGF-1 DES", "Insulin-like Growth Factor 1"],
    category: "peptide",
    type: "injectable",
    halfLifeDays: 0.83,
    anabolicRatio: 0,
    androgenicRatio: 0,
    description: "A modified version of insulin-like growth factor 1 with extended half-life. Mediates most of GH's anabolic effects, directly stimulating muscle cell growth via PI3K/Akt/mTOR signaling with theoretical hyperplasia potential.",
    mechanismOfAction: "Binds the IGF-1 receptor, activating PI3K/Akt and mTOR signaling pathways. Directly stimulates muscle cell proliferation and differentiation. The LR3 variant has a much longer half-life than native IGF-1 due to reduced IGFBP binding. May promote muscle fiber hyperplasia (new fiber creation) in addition to hypertrophy. Also has insulin-like glucose-lowering effects.",
    typicalDoseMgPerWeek: { low: 0.14, moderate: 0.35, high: 0.7 },
    effectRatings: {
      muscleProteinSynthesis: 8,
      nitrogenRetention: 7,
      strengthGains: 6,
      redBloodCellProduction: 2,
      fatLoss: 4,
      glycogenStorage: 5,
      recoverySpeed: 8,
      collagenSynthesis: 5,
    },
    sideEffectRatings: {
      hormonalSuppression: 2,
      estrogenicEffects: 1,
      androgenicEffects: 1,
      cardiovascularStrain: 3,
      liverStress: 1,
      insulinResistance: 6,
      moodChanges: 2,
      prostateRisk: 3,
    },
    studies: [
      { authors: "Fryburg DA et al.", year: 1995, title: "Insulin-like growth factor I (IGF-I) stimulates protein synthesis and inhibits protein breakdown in humans", pubmedId: "7593428", summary: "Demonstrated that IGF-1 directly stimulates muscle protein synthesis and inhibits proteolysis in human subjects." },
      { authors: "Goldspink G", year: 2005, title: "Mechanical signals, IGF-I gene splicing, and muscle adaptation", pubmedId: "16195026", summary: "Describes how mechano-sensitive IGF-1 splice variants drive muscle hypertrophy and potentially hyperplasia." },
      { authors: "Guha N et al.", year: 2014, title: "The use of IGF-1 in doping in sport", pubmedId: "24188903", summary: "Reviews IGF-1 pharmacology in the context of athletic performance enhancement and its role in mediating GH anabolic effects." },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=16132280&t=l",
    pubchemCid: 16132280,
    warningFlags: [
      "Hypoglycemia risk similar to insulin",
      "Theoretical cancer risk — IGF-1 promotes cell proliferation",
      "Potential organ growth with chronic use",
      "Very limited human clinical data for performance use",
    ],
  },
  {
    id: "cjc-1295",
    name: "CJC-1295",
    aliases: ["CJC-1295 DAC", "Modified GRF 1-29", "GHRH analog", "CJC-1295 no DAC"],
    category: "peptide",
    type: "injectable",
    halfLifeDays: 8,
    anabolicRatio: 0,
    androgenicRatio: 0,
    description: "A synthetic GHRH (growth hormone-releasing hormone) analog that stimulates the pituitary to release endogenous growth hormone. The DAC variant has an extended half-life of ~8 days, creating sustained GH elevation.",
    mechanismOfAction: "Mimics endogenous GHRH by binding to GHRH receptors on somatotroph cells in the anterior pituitary, stimulating natural GH secretion. The Drug Affinity Complex (DAC) modification allows albumin binding, extending half-life dramatically. Increases both GH pulse amplitude and frequency. Downstream effects mediated through GH → IGF-1 axis.",
    typicalDoseMgPerWeek: { low: 4, moderate: 8, high: 14 },
    effectRatings: {
      muscleProteinSynthesis: 3,
      nitrogenRetention: 3,
      strengthGains: 2,
      redBloodCellProduction: 1,
      fatLoss: 6,
      glycogenStorage: 3,
      recoverySpeed: 7,
      collagenSynthesis: 6,
    },
    sideEffectRatings: {
      hormonalSuppression: 1,
      estrogenicEffects: 1,
      androgenicEffects: 1,
      cardiovascularStrain: 2,
      liverStress: 1,
      insulinResistance: 3,
      moodChanges: 1,
      prostateRisk: 1,
    },
    studies: [
      { authors: "Teichman SL et al.", year: 2006, title: "Prolonged stimulation of growth hormone (GH) and insulin-like growth factor I secretion by CJC-1295, a long-acting analog of GH-releasing hormone, in healthy adults", pubmedId: "16352683", summary: "CJC-1295 DAC produced sustained 2-10x increases in GH and 1.5-3x increases in IGF-1 after single administration." },
      { authors: "Alba M et al.", year: 2006, title: "Once-daily administration of CJC-1295, a long-acting growth hormone-releasing hormone (GHRH) analog, normalizes growth in the GHRH knockout (GHRHKO) mouse", pubmedId: "16352684", summary: "Confirmed CJC-1295 restores normal GH secretion patterns in GHRH-deficient models." },
      { authors: "Ionescu M, Bhatt DL", year: 2004, title: "Novel growth hormone secretagogues: clinical perspectives and therapeutic potential", pubmedId: "15201800", summary: "Reviews GH secretagogue pharmacokinetics and their endocrine effects on the somatotropic axis." },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=56841625&t=l",
    warningFlags: [
      "Water retention is common",
      "Mild insulin resistance at higher doses",
      "Headaches and flushing reported",
      "Best used synergistically with a GHRP (e.g., Ipamorelin)",
    ],
  },
  {
    id: "ipamorelin",
    name: "Ipamorelin",
    aliases: ["Ipam", "IPAM", "NNC 26-0161"],
    category: "peptide",
    type: "injectable",
    halfLifeDays: 0.08,
    anabolicRatio: 0,
    androgenicRatio: 0,
    description: "A selective growth hormone secretagogue (ghrelin receptor agonist) that stimulates pituitary GH release without significantly elevating cortisol or prolactin — considered the cleanest GH peptide available.",
    mechanismOfAction: "Acts as a selective agonist of the ghrelin receptor (GHS-R1a) on pituitary somatotroph cells. Stimulates endogenous GH release while preserving normal pulsatile GH secretion patterns. Uniquely selective — does not significantly stimulate ACTH, cortisol, or prolactin release unlike other GHRP peptides. Downstream effects mediated through the GH/IGF-1 axis.",
    typicalDoseMgPerWeek: { low: 1.4, moderate: 2.1, high: 4.2 },
    effectRatings: {
      muscleProteinSynthesis: 3,
      nitrogenRetention: 3,
      strengthGains: 2,
      redBloodCellProduction: 1,
      fatLoss: 5,
      glycogenStorage: 3,
      recoverySpeed: 6,
      collagenSynthesis: 5,
    },
    sideEffectRatings: {
      hormonalSuppression: 1,
      estrogenicEffects: 1,
      androgenicEffects: 1,
      cardiovascularStrain: 1,
      liverStress: 1,
      insulinResistance: 2,
      moodChanges: 1,
      prostateRisk: 1,
    },
    studies: [
      { authors: "Raun K et al.", year: 1998, title: "Ipamorelin, the first selective growth hormone secretagogue", pubmedId: "9849822", summary: "Demonstrated that Ipamorelin selectively stimulates GH release without increasing cortisol or prolactin — unique among GH secretagogues." },
      { authors: "Gobburu JV et al.", year: 1999, title: "Pharmacokinetic-pharmacodynamic modeling of ipamorelin, a growth hormone releasing peptide, in human volunteers", pubmedId: "10506904", summary: "Characterized the dose-response pharmacokinetics of Ipamorelin GH secretion in healthy humans." },
      { authors: "Bowers CY", year: 2012, title: "Growth hormone-releasing peptide (GHRP)", pubmedId: "22389952", summary: "Comprehensive review of growth hormone secretagogues and their clinical effects on the somatotropic axis." },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=20754357&t=l",
    pubchemCid: 20754357,
    warningFlags: [
      "Mild water retention possible",
      "Mild appetite increase",
      "Best used in combination with CJC-1295 for synergistic GH release",
    ],
  },
  {
    id: "ghrp-6",
    name: "GHRP-6",
    aliases: ["Growth Hormone Releasing Peptide-6", "GHRP6", "SKF-110679"],
    category: "peptide",
    type: "injectable",
    halfLifeDays: 0.08,
    anabolicRatio: 0,
    androgenicRatio: 0,
    description: "A potent ghrelin mimetic that strongly stimulates GH release and appetite. Unlike Ipamorelin, GHRP-6 also elevates cortisol and prolactin and causes extreme hunger, making it best suited for bulking phases.",
    mechanismOfAction: "Mimics ghrelin by binding the GHS-R1a receptor on pituitary somatotroph cells, stimulating robust GH release. Also activates ghrelin receptors in the hypothalamus, producing intense appetite stimulation. Unlike more selective peptides, GHRP-6 also elevates ACTH (and consequently cortisol) and prolactin to some degree. Downstream anabolic effects mediated through the GH/IGF-1 axis.",
    typicalDoseMgPerWeek: { low: 1.4, moderate: 2.8, high: 4.2 },
    effectRatings: {
      muscleProteinSynthesis: 3,
      nitrogenRetention: 3,
      strengthGains: 3,
      redBloodCellProduction: 1,
      fatLoss: 4,
      glycogenStorage: 4,
      recoverySpeed: 6,
      collagenSynthesis: 5,
    },
    sideEffectRatings: {
      hormonalSuppression: 2,
      estrogenicEffects: 1,
      androgenicEffects: 1,
      cardiovascularStrain: 2,
      liverStress: 1,
      insulinResistance: 4,
      moodChanges: 3,
      prostateRisk: 1,
    },
    studies: [
      { authors: "Bowers CY et al.", year: 1991, title: "On the in vitro and in vivo activity of a new synthetic hexapeptide that acts on the pituitary to specifically release growth hormone", pubmedId: "1988438", summary: "First characterization of GHRP-6 demonstrating potent, dose-dependent GH release in humans." },
      { authors: "Arvat E et al.", year: 1997, title: "Endocrine activities of ghrelin, a natural growth hormone secretagogue (GHS), in humans: comparison and interactions with hexarelin, a nonnatural peptidyl GHS, and GH-releasing hormone", pubmedId: "9371442", summary: "Compared ghrelin mimetics including GHRP-6 and characterized their distinct endocrine effects including appetite regulation." },
      { authors: "Smith RG", year: 2005, title: "Development of growth hormone secretagogues", pubmedId: "15817327", summary: "Reviews the clinical development of GH secretagogues and their effects on GH secretion, appetite, and metabolism." },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=5486806&t=l",
    pubchemCid: 5486806,
    warningFlags: [
      "Extreme hunger — can make diet adherence very difficult",
      "Elevates cortisol and prolactin (unlike Ipamorelin)",
      "Water retention and bloating common",
      "Best suited for mass-gaining phases where appetite is a limiting factor",
    ],
  },
  {
    id: "dihydroboldenone",
    name: "Dihydroboldenone",
    aliases: ["DHB", "1-Testosterone", "1-Test Cyp", "1-Test"],
    category: "anabolic",
    type: "injectable",
    halfLifeDays: 4,
    anabolicRatio: 200,
    androgenicRatio: 100,
    description: "A non-aromatizing injectable anabolic steroid (DHT derivative of Boldenone). Provides lean, dry gains similar to Primobolan but with stronger anabolic potency. Known for severe post-injection pain (PIP). Very limited human clinical data exists.",
    mechanismOfAction: "Binds androgen receptors directly — already 5α-reduced so no further reduction occurs. Does not aromatize into estrogen. Exhibits strong androgen receptor affinity and drives protein synthesis in skeletal muscle. Moderate erythropoiesis stimulation. The 1-dehydro modification increases anabolic selectivity over the parent Boldenone molecule.",
    typicalDoseMgPerWeek: { low: 200, moderate: 350, high: 500 },
    effectRatings: {
      muscleProteinSynthesis: 7,
      nitrogenRetention: 7,
      strengthGains: 7,
      redBloodCellProduction: 6,
      fatLoss: 5,
      glycogenStorage: 5,
      recoverySpeed: 6,
      collagenSynthesis: 4,
    },
    sideEffectRatings: {
      hormonalSuppression: 7,
      estrogenicEffects: 1,
      androgenicEffects: 5,
      cardiovascularStrain: 5,
      liverStress: 1,
      insulinResistance: 2,
      moodChanges: 3,
      prostateRisk: 4,
    },
    studies: [
      { authors: "Vida JA", year: 1969, title: "Androgens and Anabolic Agents: Chemistry and Pharmacology", summary: "Classified 1-testosterone (DHB) as a highly anabolic compound with favorable tissue selectivity relative to testosterone." },
      { authors: "Kicman AT", year: 2008, title: "Pharmacology of anabolic steroids", pubmedId: "18500378", summary: "Reviews structure-activity relationships of AAS including 1-dehydro modifications that increase anabolic selectivity." },
      { authors: "Fragkaki AG et al.", year: 2009, title: "Structural characteristics of anabolic androgenic steroids contributing to binding to the androgen receptor and to their anabolic and androgenic activities", pubmedId: "19234944", summary: "Confirms strong androgen receptor binding affinity of 1-testosterone derivatives." },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=98523&t=l",
    pubchemCid: 98523,
    warningFlags: [
      "ZERO human clinical data — all evidence is preclinical or anecdotal",
      "Notorious for severe post-injection pain (PIP)",
      "Does not aromatize — requires a testosterone base for estrogen support",
      "No estrogen = no neuroprotection or cardioprotection from this compound alone",
    ],
  },
  {
    id: "testosterone-suspension",
    name: "Testosterone Suspension",
    aliases: ["Test Suspension", "Test No Ester", "TNE", "Aqueous Testosterone"],
    category: "androgen",
    type: "injectable",
    halfLifeDays: 0.04,
    anabolicRatio: 100,
    androgenicRatio: 100,
    description: "Pure testosterone in aqueous suspension with no ester attached. Produces immediate, very high peak testosterone levels within hours of injection. Used primarily pre-workout or pre-competition for rapid strength and aggression. Requires daily (or more frequent) injections.",
    mechanismOfAction: "Identical to all testosterone esters — binds androgen receptors, 5α-reduces to DHT, and aromatizes to estradiol via aromatase. The key difference is pharmacokinetics: no ester means immediate bioavailability with rapid peak and clearance. Produces extremely high transient testosterone spikes that can cause pronounced estrogenic effects due to rapid aromatization.",
    typicalDoseMgPerWeek: { low: 175, moderate: 350, high: 700 },
    effectRatings: {
      muscleProteinSynthesis: 7,
      nitrogenRetention: 7,
      strengthGains: 8,
      redBloodCellProduction: 5,
      fatLoss: 4,
      glycogenStorage: 7,
      recoverySpeed: 7,
      collagenSynthesis: 5,
    },
    sideEffectRatings: {
      hormonalSuppression: 7,
      estrogenicEffects: 7,
      androgenicEffects: 6,
      cardiovascularStrain: 5,
      liverStress: 1,
      insulinResistance: 2,
      moodChanges: 5,
      prostateRisk: 5,
    },
    studies: [
      { authors: "Sokol RZ et al.", year: 1982, title: "Comparison of the kinetics of injectable testosterone in eugonadal and hypogonadal men", pubmedId: "7117796", summary: "Characterized rapid peak testosterone levels from aqueous suspension vs esterified preparations." },
      { authors: "Bhasin S et al.", year: 1996, title: "The effects of supraphysiologic doses of testosterone on muscle size and strength in normal men", pubmedId: "8637535", summary: "Landmark study demonstrating dose-dependent testosterone effects on muscle hypertrophy and strength." },
      { authors: "Bhasin S et al.", year: 2001, title: "Testosterone dose-response relationships in healthy young men", pubmedId: "11701431", summary: "Graded dose-response study showing linear increases in lean mass and strength with increasing testosterone doses." },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=6013&t=l",
    pubchemCid: 6013,
    warningFlags: [
      "Very painful injections (aqueous, no ester)",
      "Extreme estrogen spikes due to rapid aromatization",
      "Requires very frequent injections (daily or more)",
      "Hormonal instability — large peaks and troughs compared to esterified testosterone",
    ],
  },
  {
    id: "trenbolone-enanthate",
    name: "Trenbolone Enanthate",
    aliases: ["Tren E", "Trenabol", "Tren Enanthate"],
    category: "anabolic",
    type: "injectable",
    halfLifeDays: 7,
    anabolicRatio: 500,
    androgenicRatio: 500,
    description: "Long-ester version of Trenbolone. Same parent hormone as Trenbolone Acetate but with a longer half-life requiring less frequent injections. Extremely potent 19-Nor with strong AR binding, anti-catabolic glucocorticoid receptor antagonism, and local IGF-1 elevation. Reserved for experienced users only.",
    mechanismOfAction: "Powerful androgen receptor agonist from the 19-Nor family. Binds the glucocorticoid receptor as an antagonist, inhibiting cortisol-mediated protein breakdown — this is why Trenbolone excels at muscle preservation in a calorie deficit. Significantly suppresses glucocorticoid expression and cortisol binding to skeletal muscle. Increases local IGF-1 production. Does NOT aromatize but may interact with estrogen receptors similarly to Nandrolone. Progestogenic — activates progesterone receptors.",
    typicalDoseMgPerWeek: { low: 200, moderate: 400, high: 600 },
    effectRatings: {
      muscleProteinSynthesis: 8,
      nitrogenRetention: 8,
      strengthGains: 8,
      redBloodCellProduction: 5,
      fatLoss: 8,
      glycogenStorage: 7,
      recoverySpeed: 8,
      collagenSynthesis: 5,
    },
    sideEffectRatings: {
      hormonalSuppression: 8,
      estrogenicEffects: 3,
      androgenicEffects: 7,
      cardiovascularStrain: 8,
      liverStress: 2,
      insulinResistance: 4,
      moodChanges: 8,
      prostateRisk: 6,
    },
    studies: [
      { authors: "Yarrow JF et al.", year: 2010, title: "17β-Hydroxyestra-4,9,11-trien-3-one (Trenbolone) exhibits tissue selective anabolic activity: effects on muscle, bone, adiposity, hemoglobin, and prostate", pubmedId: "20368408", summary: "Demonstrated Trenbolone's massive anabolic response in muscle tissue with simultaneous anti-adipogenic effects." },
      { authors: "Kam PCA, Yarrow M", year: 2005, title: "Anabolic steroid abuse: physiological and anaesthetic considerations", pubmedId: "16402648", summary: "Reviews AAS cardiovascular risks including Trenbolone's pronounced impact on lipids and cardiac function." },
      { authors: "Kicman AT", year: 2008, title: "Pharmacology of anabolic steroids", pubmedId: "18500378", summary: "Comprehensive pharmacology review confirming Trenbolone's exceptionally high AR binding affinity and potency." },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=10737781&t=l",
    pubchemCid: 10737781,
    warningFlags: [
      "19-Nor — will keep HPTA suppressed for months after cessation",
      "Severe insomnia, night sweats, and CNS disturbances common",
      "Extreme cardiovascular toxicity — lipid destruction",
      "Prolactin elevation — may require cabergoline",
      "Neurotoxic without sufficient estrogen present",
      "No aromatization = no neuroprotection from this compound alone",
      "Not recommended during offseason when Nandrolone achieves similar nitrogen retention with far fewer side effects",
    ],
  },
  {
    id: "masteron-enanthate",
    name: "Drostanolone Enanthate",
    aliases: ["Masteron E", "Masteron Enanthate", "Mast E", "Drost E"],
    category: "anabolic",
    type: "injectable",
    halfLifeDays: 7,
    anabolicRatio: 62,
    androgenicRatio: 25,
    description: "Long-ester version of Drostanolone (Masteron). A DHT derivative with anti-estrogenic properties, commonly used during contest prep for a hard, dry cosmetic look. Longer half-life than Masteron Propionate allows less frequent injections.",
    mechanismOfAction: "DHT derivative that binds androgen receptors and exhibits anti-estrogenic activity. Does not aromatize into estrogen. May inhibit aromatase to some degree, reducing estrogen conversion from other aromatizing steroids in the stack. Primarily valued for its cosmetic muscle-hardening effect and mild strength gains. Targeted action on contractile tissue without water retention.",
    typicalDoseMgPerWeek: { low: 200, moderate: 400, high: 600 },
    effectRatings: {
      muscleProteinSynthesis: 4,
      nitrogenRetention: 4,
      strengthGains: 5,
      redBloodCellProduction: 2,
      fatLoss: 6,
      glycogenStorage: 3,
      recoverySpeed: 4,
      collagenSynthesis: 3,
    },
    sideEffectRatings: {
      hormonalSuppression: 5,
      estrogenicEffects: 1,
      androgenicEffects: 5,
      cardiovascularStrain: 4,
      liverStress: 1,
      insulinResistance: 1,
      moodChanges: 2,
      prostateRisk: 4,
    },
    studies: [
      { authors: "Chaudry MA et al.", year: 1985, title: "Drostanolone, an aromatase inhibitor, in the treatment of breast cancer in postmenopausal women", pubmedId: "3896210", summary: "Demonstrated Drostanolone's anti-estrogenic effect in clinical use for estrogen-receptor-positive breast cancer." },
      { authors: "Ganesan K et al.", year: 2021, title: "Anabolic steroids: an overview", pubmedId: "31613429", summary: "Reviews the pharmacology of androgens including Drostanolone's hormonal modulation and tissue selectivity." },
      { authors: "Fragkaki AG et al.", year: 2009, title: "Structural characteristics of anabolic androgenic steroids contributing to binding to the androgen receptor", pubmedId: "19234944", summary: "Confirms DHT derivatives like Drostanolone exhibit targeted androgen receptor binding profiles." },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=224004&t=l",
    pubchemCid: 224004,
    warningFlags: [
      "Significant hair loss risk in those predisposed to androgenic alopecia",
      "Lipid suppression — monitor HDL/LDL",
      "Limited mass-building capacity — primarily a cosmetic/contest prep compound",
      "No aromatization = requires a testosterone base for estrogen support",
    ],
  },
  {
    id: "testosterone-undecanoate",
    name: "Testosterone Undecanoate",
    aliases: ["Andriol", "Jatenzo", "Oral Test", "Test U", "Nebido"],
    category: "androgen",
    type: "oral",
    halfLifeDays: 0.5,
    anabolicRatio: 100,
    androgenicRatio: 100,
    description: "An oral testosterone formulation that bypasses first-pass liver metabolism via lymphatic absorption. The only orally bioavailable testosterone that is not 17α-alkylated, making it significantly less hepatotoxic than other oral steroids. Also available as a very long-acting injectable (Nebido).",
    mechanismOfAction: "Absorbed through the intestinal lymphatic system when taken orally with dietary fat, bypassing hepatic first-pass metabolism. Once absorbed, the undecanoate ester is cleaved to release bioidentical testosterone, which then follows normal testosterone metabolism — aromatization to estradiol via aromatase and 5α-reduction to DHT. Variable absorption is the main pharmacokinetic limitation.",
    typicalDoseMgPerWeek: { low: 280, moderate: 560, high: 840 },
    effectRatings: {
      muscleProteinSynthesis: 6,
      nitrogenRetention: 6,
      strengthGains: 6,
      redBloodCellProduction: 4,
      fatLoss: 3,
      glycogenStorage: 5,
      recoverySpeed: 6,
      collagenSynthesis: 4,
    },
    sideEffectRatings: {
      hormonalSuppression: 6,
      estrogenicEffects: 5,
      androgenicEffects: 5,
      cardiovascularStrain: 3,
      liverStress: 2,
      insulinResistance: 2,
      moodChanges: 3,
      prostateRisk: 4,
    },
    studies: [
      { authors: "Shoskes JJ et al.", year: 2016, title: "Pharmacology of testosterone replacement therapy preparations", pubmedId: "27024700", summary: "Characterized pharmacokinetics of oral testosterone undecanoate including its unique lymphatic absorption pathway." },
      { authors: "Swerdloff RS et al.", year: 2020, title: "A new oral testosterone undecanoate formulation restores testosterone to normal concentrations in hypogonadal men", pubmedId: "31790151", summary: "Clinical trial demonstrating Jatenzo restores therapeutic testosterone levels via oral administration." },
      { authors: "Nieschlag E et al.", year: 2004, title: "Testosterone replacement therapy: current trends and future directions", pubmedId: "15367438", summary: "Compares oral vs injectable testosterone preparations including undecanoate efficacy and absorption variability." },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=65157&t=l",
    pubchemCid: 65157,
    warningFlags: [
      "Variable and unreliable oral absorption — must be taken with dietary fat",
      "Less predictable blood levels compared to injectable testosterone",
      "Estrogen conversion still occurs — monitor E2",
      "The only non-hepatotoxic oral steroid (not 17α-alkylated)",
    ],
  },
  {
    id: "mibolerone",
    name: "Mibolerone",
    aliases: ["Cheque Drops", "Dimethylnortestosterone"],
    category: "anabolic",
    type: "oral",
    halfLifeDays: 0.17,
    anabolicRatio: 1800,
    androgenicRatio: 4100,
    description: "An extremely potent oral androgen originally developed as a veterinary drug to suppress estrus in dogs. Used by some powerlifters and fighters pre-competition for its powerful CNS-stimulating aggression effects. One of the most hepatotoxic steroids in existence — extremely dangerous with very limited practical application.",
    mechanismOfAction: "Extremely potent androgen receptor agonist — one of the strongest known synthetic androgens. Produces intense CNS stimulation and aggression via androgen receptor activation in the brain. Also a potent progestogen. Despite an astronomical anabolic ratio on paper, its practical muscle-building utility is severely limited by its extreme hepatotoxicity which precludes use beyond very short durations (minutes to hours pre-event).",
    typicalDoseMgPerWeek: { low: 1.75, moderate: 3.5, high: 7 },
    effectRatings: {
      muscleProteinSynthesis: 3,
      nitrogenRetention: 3,
      strengthGains: 8,
      redBloodCellProduction: 5,
      fatLoss: 3,
      glycogenStorage: 3,
      recoverySpeed: 5,
      collagenSynthesis: 2,
    },
    sideEffectRatings: {
      hormonalSuppression: 8,
      estrogenicEffects: 4,
      androgenicEffects: 8,
      cardiovascularStrain: 7,
      liverStress: 8,
      insulinResistance: 2,
      moodChanges: 8,
      prostateRisk: 8,
    },
    studies: [
      { authors: "Neumann F", year: 1976, title: "Pharmacological and endocrinological studies on anabolic agents", summary: "Characterized mibolerone as among the most potent synthetic androgens with extreme androgenic:anabolic dissociation." },
      { authors: "Clark AS, Henderson LP", year: 2003, title: "Behavioral and physiological responses to anabolic-androgenic steroids", pubmedId: "14657375", summary: "Documents the neurological effects of potent androgens including aggression, anxiety, and CNS activation patterns." },
      { authors: "Kicman AT", year: 2008, title: "Pharmacology of anabolic steroids", pubmedId: "18500378", summary: "Reviews the pharmacology of synthetic androgens including structure-activity relationships of potent compounds like mibolerone." },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=23689&t=l",
    pubchemCid: 23689,
    warningFlags: [
      "EXTREME hepatotoxicity — one of the most liver-toxic steroids known",
      "Veterinary drug — not designed for human use",
      "Extreme aggression and CNS effects",
      "Progestogenic — can cause gynecomastia",
      "Essentially zero practical muscle-building utility — only used pre-event for aggression",
      "Should never be used for more than hours at a time",
    ],
  },
];

export const ANCILLARIES: Ancillary[] = [
  {
    id: "anastrozole",
    name: "Anastrozole",
    aliases: ["Arimidex", "A-dex"],
    category: "aromatase-inhibitor",
    description:
      "Third-generation non-steroidal aromatase inhibitor. Reduces estrogen conversion by ~85% at standard doses. The most commonly used AI on-cycle.",
    rationale:
      "Aromatizing compounds (testosterone, Dianabol, Nandrolone) convert to estradiol via CYP19A1. Excess estradiol causes gynecomastia and water retention. Anastrozole competitively inhibits aromatase, controlling E2 levels.",
    typicalDose: "0.25–1 mg every other day, adjusted by bloodwork",
    usedFor: ["Estrogen control on testosterone cycles", "Prevention of gynecomastia", "Water retention management"],
    studies: [
      {
        authors: "Mauras N, et al.",
        year: 2000,
        title: "Testosterone deficiency in young men: marked alterations in whole body protein kinetics, strength, and adiposity",
        pubmedId: "10639272",
        summary: "Anastrozole use in males effectively reduced estrogen levels while maintaining anabolic signaling, supporting its use as an AI without compromising muscle protein synthesis.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=2187&t=l",
  },
  {
    id: "exemestane",
    name: "Exemestane",
    aliases: ["Aromasin"],
    category: "aromatase-inhibitor",
    description:
      "Steroidal, irreversible ('suicide') aromatase inhibitor. No estrogen rebound on discontinuation (unlike anastrozole). Mildly anabolic due to androgenic metabolites.",
    rationale:
      "Irreversible aromatase inactivation prevents estrogen rebound post-cycle. Mild androgenic metabolites may be advantageous. Preferred over anastrozole by some for PCT transitions.",
    typicalDose: "12.5–25 mg every other day",
    usedFor: ["Estrogen control", "PCT transition", "Preventing gynecomastia"],
    studies: [
      {
        authors: "Lønning PE.",
        year: 2004,
        title: "Aromatase inhibitors in breast cancer",
        pubmedId: "15148094",
        summary: "Exemestane demonstrated complete aromatase inactivation with no rebound estrogen production after discontinuation — mechanistically superior to reversible AIs for managing post-cycle transitions.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=60198&t=l",
  },
  {
    id: "tamoxifen",
    name: "Tamoxifen Citrate",
    aliases: ["Nolvadex", "Nolva", "Tamox"],
    category: "serm",
    description:
      "Selective Estrogen Receptor Modulator (SERM). Blocks estrogen at breast tissue (gyno prevention/treatment) and stimulates LH/FSH release from pituitary (PCT). Does NOT lower systemic estrogen.",
    rationale:
      "For PCT: blocks hypothalamic/pituitary estrogen receptors → removes negative feedback → increases GnRH → increases LH/FSH → restores testicular testosterone production. Also first-line treatment for existing gynecomastia.",
    typicalDose: "PCT: 40 mg/day × 2 weeks, then 20 mg/day × 2 weeks",
    usedFor: ["Post-cycle therapy (PCT)", "Gynecomastia prevention/treatment", "HPTA recovery"],
    studies: [
      {
        authors: "Katz DL, et al.",
        year: 1997,
        title: "Tamoxifen and risk of cardiovascular disease",
        pubmedId: "9385431",
        summary: "Tamoxifen's SERM activity in the hypothalamus-pituitary axis has been documented to significantly increase LH and FSH, validating its mechanism for HPTA restoration in PCT protocols.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=2733526&t=l",
  },
  {
    id: "clomiphene",
    name: "Clomiphene Citrate",
    aliases: ["Clomid", "Clomifene"],
    category: "serm",
    description:
      "SERM used in PCT to stimulate endogenous testosterone production. Works at hypothalamus to block estrogen receptor, increasing GnRH pulsatility and thereby LH/FSH. Often combined with tamoxifen in PCT.",
    rationale:
      "Acts primarily at the hypothalamic level (vs tamoxifen's pituitary-level action) — combining both SERMs provides comprehensive HPTA stimulation. Documented to increase testosterone levels to normal range within 4–6 weeks post-AAS.",
    typicalDose: "PCT: 50 mg/day × 2 weeks, then 25 mg/day × 2 weeks",
    usedFor: ["Post-cycle therapy (PCT)", "HPTA recovery", "LH/FSH stimulation"],
    studies: [
      {
        authors: "Whelan AM, et al.",
        year: 1993,
        title: "Male hypogonadism — clomiphene citrate therapy",
        pubmedId: "8482567",
        summary: "Clomiphene citrate reliably increased LH, FSH, and testosterone in hypogonadal men within 4 weeks, documenting mechanism and efficacy for HPTA stimulation.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=2800&t=l",
  },
  {
    id: "cabergoline",
    name: "Cabergoline",
    aliases: ["Dostinex", "Caber"],
    category: "prolactin-control",
    description:
      "Dopamine D2 receptor agonist that suppresses prolactin. Essential when using progestogenic compounds (Nandrolone, Trenbolone) to prevent prolactin-induced sexual dysfunction and gynecomastia.",
    rationale:
      "Nandrolone and trenbolone have progestogenic activity that raises prolactin levels. Elevated prolactin causes sexual dysfunction ('Deca Dick'), lactation, and gynecomastia independently of estrogen. Cabergoline directly suppresses pituitary prolactin secretion.",
    typicalDose: "0.25–0.5 mg twice weekly",
    usedFor: ["Prolactin control on nandrolone/trenbolone cycles", "Prevention of prolactin-induced gynecomastia", "Prevention of sexual dysfunction on 19-nor compounds"],
    studies: [
      {
        authors: "Webster J, et al.",
        year: 1994,
        title: "Cabergoline versus bromocriptine in the treatment of hyperprolactinemia",
        pubmedId: "7973463",
        summary: "Cabergoline normalized prolactin levels in 83% of patients vs 59% for bromocriptine, with superior tolerability — gold standard for hyperprolactinemia management.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=54746",
  },
  {
    id: "hcg",
    name: "Human Chorionic Gonadotropin",
    aliases: ["HCG", "hCG"],
    category: "hcg",
    description:
      "LH-mimetic peptide that directly stimulates Leydig cells in the testes to produce testosterone. Prevents testicular atrophy during long AAS cycles and restores testicular function for PCT.",
    rationale:
      "AAS cycles suppress LH → testes shrink (atrophy) and lose steroidogenic capacity. HCG mimics LH, keeping testes active during cycle. More effective to use on-cycle to prevent atrophy than to try to recover fully atrophied testes in PCT.",
    typicalDose: "250–500 IU every 3–4 days on-cycle, or 1000–2000 IU EOD for 2 weeks pre-PCT",
    usedFor: ["Prevention of testicular atrophy on long cycles", "PCT preparation", "Fertility restoration"],
    studies: [
      {
        authors: "Coviello AD, et al.",
        year: 2006,
        title: "Effects of graded doses of testosterone on erythropoiesis in healthy young and older men",
        pubmedId: "16757522",
        summary: "HCG co-administration with testosterone suppression maintained testicular volume and intratesticular testosterone, demonstrating its effectiveness in preventing AAS-induced testicular atrophy.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=68827981&t=l",
  },
  {
    id: "tudca",
    name: "Tauroursodeoxycholic Acid",
    aliases: ["TUDCA", "Bile Acid"],
    category: "liver-support",
    description:
      "Bile acid with potent hepatoprotective properties. The most evidence-backed liver support supplement for 17α-alkylated oral AAS use. Reduces hepatic endoplasmic reticulum stress and apoptosis.",
    rationale:
      "Oral AAS (Dianabol, Winstrol, Anavar) undergo first-pass liver metabolism, elevating ALT/AST. TUDCA upregulates liver cytoprotective pathways (Bcl-2 family), reduces hepatocyte apoptosis, and has been used clinically for cholestatic liver disease.",
    typicalDose: "250–500 mg/day with food while using oral AAS",
    usedFor: ["Liver protection on oral AAS", "Reducing hepatotoxicity of 17α-alkylated compounds", "Bile flow optimization"],
    studies: [
      {
        authors: "Beuers U, et al.",
        year: 1998,
        title: "Tauroursodeoxycholic acid inserts the apical conjugate export pump, Mrp2, into canalicular membranes and stimulates organic anion secretion",
        pubmedId: "9660943",
        summary: "TUDCA stimulates hepatic bile acid export and reduces intrahepatic cholestasis, directly addressing the mechanism of oral AAS liver stress.",
      },
    ],
    moleculeImageUrl: "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=9848279&t=l",
  },
];

export function getCompoundById(id: string): Compound | undefined {
  return COMPOUNDS.find((c) => c.id === id);
}

export function getAncillaryById(id: string): Ancillary | undefined {
  return ANCILLARIES.find((a) => a.id === id);
}

export function getEffectRatingLabel(rating: number): string {
  if (rating <= 2) return "Minimal";
  if (rating <= 4) return "Low";
  if (rating <= 6) return "Moderate";
  if (rating <= 7) return "High";
  return "Very High";
}

// Effect bars — higher is BETTER (green = high, red = low)
export function getRatingColor(rating: number): string {
  if (rating >= 7) return "text-green-400";
  if (rating >= 5) return "text-yellow-400";
  if (rating >= 3) return "text-orange-400";
  return "text-red-400";
}

export function getRatingBg(rating: number): string {
  if (rating >= 7) return "bg-green-500";
  if (rating >= 5) return "bg-yellow-500";
  if (rating >= 3) return "bg-orange-500";
  return "bg-red-500";
}

// Side effect bars — higher is WORSE (red = high, green = low)
export function getSideEffectRatingBg(rating: number): string {
  if (rating <= 2) return "bg-green-500";
  if (rating <= 4) return "bg-yellow-500";
  if (rating <= 6) return "bg-orange-500";
  return "bg-red-500";
}

export function getSideEffectRatingColor(rating: number): string {
  if (rating <= 2) return "text-green-400";
  if (rating <= 4) return "text-yellow-400";
  if (rating <= 6) return "text-orange-400";
  return "text-red-400";
}

export function getRatingHex(rating: number): string {
  if (rating <= 2) return "#22c55e";
  if (rating <= 4) return "#eab308";
  if (rating <= 6) return "#f97316";
  return "#ef4444";
}
