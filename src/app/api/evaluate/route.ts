import { NextRequest, NextResponse } from "next/server";
import { COMPOUNDS, ANCILLARIES } from "@/data/compounds";

interface CompoundInput {
  compoundId: string;
  dosageMg: number;
  frequency: string;
  isAncillary?: boolean;
}

interface EvaluateBody {
  name?: string;
  compounds: CompoundInput[];
  durationWeeks: number;
  goal?: string;
}

/* ────────────────────────────────────────────────────────────
   COMPOUND FAMILY CLASSIFICATION
   Based on the anabolic steroid family tree framework.
   ──────────────────────────────────────────────────────────── */

type SteroidFamily = "testosterone" | "dht" | "19nor" | "ancillary" | "unknown";

const FAMILY_MAP: Record<string, SteroidFamily> = {
  // Testosterone & derivatives
  "testosterone-enanthate": "testosterone",
  "testosterone-cypionate": "testosterone",
  "testosterone-propionate": "testosterone",
  "testosterone-suspension": "testosterone",
  "sustanon-250": "testosterone",
  "dianabol": "testosterone",
  "equipoise": "testosterone",
  "turinabol": "testosterone",
  "halotestin": "testosterone",
  // DHT derivatives
  "masteron": "dht",
  "primobolan": "dht",
  "anavar": "dht",
  "winstrol": "dht",
  "anadrol": "dht",
  "proviron": "dht",
  "superdrol": "dht",
  // 19-Nor derivatives
  "deca-durabolin": "19nor",
  "nandrolone-phenylpropionate": "19nor",
  "trenbolone-acetate": "19nor",
  "trenbolone-enanthate": "19nor",
  "trestolone": "19nor",
};

function getFamily(id: string): SteroidFamily {
  if (ANCILLARIES.find((a) => a.id === id)) return "ancillary";
  return FAMILY_MAP[id] ?? "unknown";
}

/* ────────────────────────────────────────────────────────────
   SMART MOCK EVALUATION
   Applies evidence-based principles from pharmacology research
   when the xAI API is unavailable.
   ──────────────────────────────────────────────────────────── */

function mockEvaluation(body: EvaluateBody) {
  const resolved = body.compounds
    .filter((c) => !c.isAncillary)
    .map((c) => ({
      ...c,
      compound: COMPOUNDS.find((x) => x.id === c.compoundId),
      family: getFamily(c.compoundId),
    }));

  const ancillaryInputs = body.compounds.filter((c) => c.isAncillary);

  const compoundNames = resolved
    .map((c) => c.compound?.name ?? c.compoundId)
    .join(", ");

  const families = new Set(resolved.map((r) => r.family));
  const hasTestBase = resolved.some((c) => c.family === "testosterone");
  const has19Nor = resolved.some((c) => c.family === "19nor");
  const hasTren = resolved.some(
    (c) => c.compoundId === "trenbolone-acetate" || c.compoundId === "trenbolone-enanthate"
  );
  const hasDHTDerivative = resolved.some((c) => c.family === "dht");
  const hasOral = resolved.some((c) => c.compound?.type === "oral");
  const hasMultipleOrals = resolved.filter((c) => c.compound?.type === "oral").length > 1;
  const hasBoldenone = resolved.some((c) => c.compoundId === "equipoise");
  const hasAnadrol = resolved.some((c) => c.compoundId === "anadrol");
  const hasWinstrol = resolved.some((c) => c.compoundId === "winstrol");
  const hasNandrolone = resolved.some(
    (c) => c.compoundId === "deca-durabolin" || c.compoundId === "nandrolone-phenylpropionate"
  );

  const testCompound = resolved.find((c) => c.family === "testosterone" && c.compound?.id?.startsWith("testosterone"));
  const testDosage = testCompound?.dosageMg ?? 0;

  const totalMgWeekly = resolved.reduce((sum, c) => sum + c.dosageMg, 0);
  const compoundCount = resolved.length;

  // ── SCORING ──────────────────────────────────────────────
  let score = 85;
  const risks: string[] = [];
  const recommendations: string[] = [];

  // No testosterone base — critical flaw
  if (!hasTestBase && compoundCount > 0) {
    score -= 25;
    risks.push(
      "No testosterone base detected — without a source of aromatizable androgen, estradiol levels will crash. " +
      "Estrogen is essential for neuroprotection, cardioprotection, libido, bone health, and IGF-1/growth factor signaling. " +
      "Running non-aromatizing compounds without a test base is one of the most common and dangerous mistakes."
    );
    recommendations.push(
      "Add a testosterone base at minimum TRT dose (100-200 mg/week) to maintain physiologic estradiol levels. " +
      "Testosterone is the bioidentical androgen your body knows how to aromatize and 5α-reduce at a balanced rate."
    );
  }

  // Excessive testosterone dosage
  if (testDosage > 500) {
    score -= 12;
    risks.push(
      `Testosterone dosage of ${testDosage} mg/week is very high. The average male produces only 42-70 mg/week naturally. ` +
      `At this dose (factoring out ester weight ≈ ${Math.round(testDosage * 0.7)} mg active hormone), you are running ` +
      `roughly ${Math.round((testDosage * 0.7) / 50)}x natural production. This will likely force the use of an aromatase inhibitor, ` +
      "which itself carries cardiovascular and neurological downsides."
    );
    recommendations.push(
      "Consider reducing testosterone to 300-400 mg/week and adding a tissue-selective DHT derivative (Primobolan, Masteron, or Anavar) " +
      "instead of pushing testosterone higher. The synergy between testosterone and DHT derivatives typically yields better results " +
      "mg-for-mg with fewer side effects than high-dose testosterone alone."
    );
  } else if (testDosage >= 300 && testDosage <= 500) {
    // Moderate — reasonable range
    score -= 3;
  }

  // 19-Nor compounds — most suppressive family
  if (has19Nor) {
    score -= 8;
    risks.push(
      "19-Nor compounds (Nandrolone/Trenbolone/Trestolone) are the most suppressive family of anabolic steroids. " +
      "Even a single injection of Nandrolone can keep the HPTA suppressed for months regardless of PCT. " +
      "19-Nors should be reserved for users committed to blast-and-cruise, as full HPTA recovery is unlikely."
    );
    if (!hasTestBase) {
      score -= 10;
      risks.push(
        "Running a 19-Nor without a testosterone base is particularly dangerous. Nandrolone does not aromatize sufficiently " +
        "into estradiol — it primarily converts to the weaker estrogen estrone. Clinical data shows nandrolone monotherapy is " +
        "neurotoxic and cardiotoxic at all dosages studied, likely because of insufficient estrogen to balance androgenicity."
      );
    }
  }

  // Trenbolone specifically
  if (hasTren) {
    score -= 10;
    const trenCompound = resolved.find(
      (c) => c.compoundId === "trenbolone-acetate" || c.compoundId === "trenbolone-enanthate"
    );
    risks.push(
      `Trenbolone (${trenCompound?.dosageMg ?? "?"}mg/week) is one of the harshest compounds available. ` +
      "While it excels at muscle sparing via glucocorticoid receptor antagonism (making it effective in a deficit), " +
      "it carries significant risks: insomnia, night sweats, cardiovascular strain, neurotoxicity, and severe HPTA suppression. " +
      "Trenbolone should only be considered for experienced users with specific goals that cannot be achieved with safer alternatives."
    );
    recommendations.push(
      "If your goal is mass building in the offseason, Nandrolone achieves nearly identical nitrogen retention with a far more " +
      "favorable side effect profile. Reserve Trenbolone for contest prep or cutting phases where its anti-catabolic properties " +
      "are uniquely beneficial."
    );
  }

  // Boldenone as base / estrogen concerns
  if (hasBoldenone) {
    score -= 5;
    const eqCompound = resolved.find((c) => c.compoundId === "equipoise");
    risks.push(
      `Boldenone (Equipoise) at ${eqCompound?.dosageMg ?? "?"}mg/week — contrary to popular belief, Boldenone does NOT ` +
      "aromatize into estradiol at 50% the rate of testosterone. High-sensitivity blood tests consistently show that Boldenone " +
      "crushes estradiol levels while spiking estrone (a much weaker estrogen). It competes with testosterone for aromatase, " +
      "preventing your test base from producing adequate estradiol."
    );
    if (hasBoldenone && testDosage < 400) {
      score -= 5;
      recommendations.push(
        "With Boldenone in the stack, your testosterone dose may need to be higher than usual to maintain adequate estradiol levels. " +
        "Monitor E2 via LC/MS-MS (sensitive assay) — NOT standard ECLIA, which cross-detects estrone and gives falsely elevated readings."
      );
    }
  }

  // Oral compounds — hepatotoxicity
  if (hasOral) {
    score -= 6;
    risks.push(
      "17-alpha-alkylated oral steroid(s) detected. These compounds are inherently hepatotoxic — " +
      "clinical data shows dose-dependent spikes in ALT/AST. In a study comparing 50mg vs 100mg Anadrol, " +
      "doubling the dose yielded only 27% more lean mass but caused 3.4x higher ALT and 2.7x higher AST elevation."
    );
    recommendations.push(
      "Keep oral cycles to 4-6 weeks maximum. Use the minimum effective dose — higher oral doses yield " +
      "dramatically diminishing returns relative to liver stress. Supplement with TUDCA (500mg/day) and NAC (1200mg/day) during oral use."
    );
  }
  if (hasMultipleOrals) {
    score -= 12;
    risks.push(
      "Running multiple oral steroids simultaneously multiplies hepatotoxic burden. This is rarely justified — " +
      "nitrogen retention between compounds is roughly equivalent, so stacking orals provides marginal " +
      "anabolic benefit for dramatically increased liver and lipid damage."
    );
  }

  // Anadrol specific
  if (hasAnadrol) {
    const anadrolComp = resolved.find((c) => c.compoundId === "anadrol");
    if (anadrolComp && anadrolComp.dosageMg > 50) {
      score -= 5;
      recommendations.push(
        `Anadrol at ${anadrolComp.dosageMg}mg/day is above the optimal dose. Clinical data shows 50mg/day produced ` +
        "3.3kg lean mass gain vs 4.2kg at 100mg/day — only 27% more muscle for dramatically worse liver values. " +
        "50mg/day (or even 25mg/day when stacked with testosterone) is the sweet spot for most users."
      );
    }
  }

  // Winstrol without test base — neurotoxic
  if (hasWinstrol && !hasTestBase) {
    score -= 10;
    risks.push(
      "Winstrol (Stanozolol) does not interact with aromatase at all. Without a testosterone base, " +
      "clinical data shows Winstrol is neurotoxic at every dosage evaluated. A source of estrogen " +
      "is absolutely necessary when using Winstrol."
    );
  }

  // Too many compounds
  if (compoundCount >= 4) {
    score -= 10;
    risks.push(
      "Running 4+ compounds simultaneously makes it impossible to identify which compound is causing " +
      "adverse reactions. All anabolic steroids achieve roughly the same nitrogen retention — clinical studies show " +
      "injectable 17β-esters and oral 17-alkyl derivatives both produce approximately 2-2.5g nitrogen/day. " +
      "Stacking more compounds doesn't produce proportionally more muscle."
    );
  } else if (compoundCount === 3) {
    score -= 5;
  }

  // Cycle too long
  if (body.durationWeeks > 20) {
    score -= 10;
    risks.push(
      `${body.durationWeeks}-week cycle is excessively long. Myostatin elevation will cause a plateau regardless of compounds used. ` +
      "Extended exposure increases cumulative cardiovascular damage, lipid disruption, and makes HPTA recovery harder."
    );
  } else if (body.durationWeeks > 16) {
    score -= 5;
    risks.push(
      "Cycle length exceeds 16 weeks. Myostatin will elevate proportionally to the androgen load, " +
      "causing diminishing returns. Consider going off-cycle to reset myostatin levels rather than extending further."
    );
  }

  // Total weekly mg assessment
  if (totalMgWeekly > 1500) {
    score -= 15;
    risks.push(
      `Total weekly AAS load of ${totalMgWeekly}mg is extreme. Once you exceed ~1g/week, diminishing returns are drastic — ` +
      "even tripling the dose beyond this point yields minimal additional muscle growth due to myostatin elevation, " +
      "while side effects scale linearly with dose."
    );
  } else if (totalMgWeekly > 1000) {
    score -= 8;
    risks.push(
      `Total weekly AAS load of ${totalMgWeekly}mg is high. Myostatin elevates proportionally to androgen load — ` +
      "research shows myostatin protein levels were 197-209% higher after 29 days of exogenous androgen administration. " +
      "More drugs = more myostatin = more growth inhibition."
    );
  }

  // ── UNIVERSAL RECOMMENDATIONS ──────────────────────────
  recommendations.push(
    "Run comprehensive bloodwork BEFORE starting: CBC, CMP, lipid panel, sensitive E2 (LC/MS-MS), LH, FSH, total/free testosterone, prolactin."
  );
  recommendations.push(
    "Monitor blood pressure weekly — androgens elevate hematocrit and can cause polycythemia. " +
    "Keep BP below 130/80 mmHg. If hematocrit exceeds 54%, consider therapeutic phlebotomy."
  );

  if (hasTestBase && testDosage <= 400) {
    recommendations.push(
      "Avoid prophylactic AI use. Only introduce an aromatase inhibitor if bloodwork confirms elevated estradiol " +
      "AND you have symptomatic side effects. Unnecessarily lowering estrogen impairs neuroprotection, cardioprotection, " +
      "lipid health, IGF-1 signaling, and muscle growth itself."
    );
  }

  if (body.durationWeeks > 12 || has19Nor) {
    recommendations.push(
      "Use HCG 250-500 IU twice weekly throughout the cycle to maintain intratesticular testosterone and " +
      "preserve testicular function, facilitating easier HPTA recovery."
    );
  }

  // PCT recommendations
  if (!has19Nor) {
    recommendations.push(
      "PCT protocol: Wait 2-3 weeks after last injection for ester clearance (or 3 days for acetate/propionate esters). " +
      "Nolvadex 20mg/day for 4-6 weeks is the gold standard. Clomid 25mg/day can be added for the first 2 weeks."
    );
  } else {
    recommendations.push(
      "With 19-Nor compounds in this stack, standard PCT is unlikely to restore full HPTA function. " +
      "Nandrolone metabolites can suppress the HPTA for 12-18 months. " +
      "Seriously consider whether blast-and-cruise is the more appropriate long-term strategy."
    );
  }

  // Plateau management
  recommendations.push(
    "When you plateau mid-cycle: (1) First, increase calorie intake by 100-200 cal/day. " +
    "(2) If still stalled, consider a modest dose increase. (3) Do NOT switch compounds — androgen receptors " +
    "upregulate in the presence of androgens, they don't downregulate. The plateau is caused by myostatin elevation, " +
    "which responds to total androgen load regardless of compound choice."
  );

  // ── ANCILLARY RECOMMENDATIONS ──────────────────────────
  const ancillariesRecommended: { name: string; dose: string; reason: string }[] = [];
  const hasAI = ancillaryInputs.some((a) =>
    ["anastrozole", "exemestane", "letrozole"].includes(a.compoundId)
  );
  const hasNolva = ancillaryInputs.some((a) => a.compoundId === "tamoxifen");
  const hasHCG = ancillaryInputs.some((a) => a.compoundId === "hcg");
  const hasTUDCA = ancillaryInputs.some((a) => a.compoundId === "tudca");

  if (!hasNolva && !has19Nor) {
    ancillariesRecommended.push({
      name: "Tamoxifen (Nolvadex)",
      dose: "20mg/day for 4-6 weeks (PCT)",
      reason:
        "SERM for post-cycle therapy. Blocks estrogen at the hypothalamus to restore LH/FSH production " +
        "and kickstart natural testosterone. Have this on hand BEFORE starting the cycle.",
    });
  }

  if (!hasHCG && (body.durationWeeks > 10 || has19Nor)) {
    ancillariesRecommended.push({
      name: "HCG (Human Chorionic Gonadotropin)",
      dose: "250-500 IU twice weekly (on-cycle)",
      reason:
        "Maintains intratesticular testosterone and prevents testicular atrophy during cycle. " +
        "Makes post-cycle recovery significantly easier. Essential for cycles over 12 weeks or those containing 19-Nors.",
    });
  }

  if (hasTestBase && testDosage >= 400 && !hasAI) {
    ancillariesRecommended.push({
      name: "Anastrozole (Arimidex)",
      dose: "0.25mg every other day (ONLY if needed based on bloodwork)",
      reason:
        "Keep on hand but do NOT use prophylactically. Only introduce if sensitive E2 blood test confirms elevation " +
        "AND you have symptoms (gyno, excessive water retention). Unnecessarily crashing estrogen causes more harm " +
        "than elevated estrogen in most cases — impairs neuroprotection, lipids, mood, libido, and muscle growth.",
    });
  }

  if (hasOral && !hasTUDCA) {
    ancillariesRecommended.push({
      name: "TUDCA",
      dose: "500mg/day during oral use",
      reason:
        "Hepatoprotectant that significantly reduces cholestatic liver stress from 17α-alkylated oral compounds. " +
        "Clinical data shows dramatic dose-dependent ALT/AST spikes from orals — TUDCA helps attenuate this.",
    });
  }

  if (hasNandrolone) {
    ancillariesRecommended.push({
      name: "Cabergoline or Pramipexole",
      dose: "0.25-0.5mg twice weekly (as needed)",
      reason:
        "Dopamine agonist to manage potential prolactin elevation from 19-Nor progestogenic activity. " +
        "Only use if blood tests confirm elevated prolactin — do not use prophylactically.",
    });
  }

  // ── BUILD EVALUATION TEXT ──────────────────────────────
  score = Math.max(15, Math.min(98, score));

  let grade = "A";
  if (score < 85) grade = "B";
  if (score < 70) grade = "C";
  if (score < 55) grade = "D";
  if (score < 40) grade = "F";

  let evaluation = `## Cycle Analysis: ${body.name || "Unnamed Stack"}\n\n`;
  evaluation += `**Stack:** ${compoundNames} | **Duration:** ${body.durationWeeks} weeks`;
  if (body.goal) evaluation += ` | **Goal:** ${body.goal}`;
  evaluation += `\n\n`;

  // Family composition analysis
  const familyList = [...families].filter((f) => f !== "unknown" && f !== "ancillary");
  if (familyList.length === 1 && familyList[0] === "testosterone") {
    evaluation += `This is a testosterone-only (or testosterone-family) cycle. `;
    if (compoundCount === 1) {
      evaluation +=
        "Single-compound testosterone cycles are the gold standard for first-time users and remain effective at all experience levels. " +
        "Testosterone is the bioidentical androgen your body naturally produces — it aromatizes into estradiol at a tightly regulated rate, " +
        "providing the neuroprotective, cardioprotective, and growth-factor benefits that non-aromatizing compounds cannot. " +
        "Running a solo blast simplifies side effect management and lets you identify your individual response before introducing other compounds.\n\n";
    } else {
      evaluation +=
        "Keeping the stack within the testosterone family is a reasonable approach, though stacking multiple aromatizing compounds " +
        "increases the likelihood of needing an aromatase inhibitor. Monitor estradiol closely via sensitive assay (LC/MS-MS).\n\n";
    }
  } else if (familyList.length >= 2) {
    evaluation +=
      `This stack spans ${familyList.length} steroid families (${familyList.join(", ")}). `;
    if (hasTestBase) {
      evaluation +=
        "Having a testosterone base is the correct foundation — it ensures adequate estradiol production for cardiovascular health, " +
        "neuroprotection, and IGF-1 signaling. ";
    }
    if (has19Nor && hasDHTDerivative) {
      evaluation +=
        "Combining 19-Nors with DHT derivatives adds complexity. DHT derivatives provide targeted contractile tissue growth and strength, " +
        "while 19-Nors contribute broader anabolic and progestogenic activity. This requires careful estrogen and prolactin management.\n\n";
    } else {
      evaluation += "\n\n";
    }
  }

  // Dosage philosophy
  if (totalMgWeekly <= 500) {
    evaluation +=
      "The total weekly dosage is conservative, which aligns with evidence-based practice. " +
      "The 'less is more' philosophy is backed by clinical data: higher doses yield diminishing returns in muscle growth " +
      "while side effects scale linearly. The long-term objective is netting maximum muscle accrual while staying healthy enough " +
      "to continue bodybuilding — and moderate dosages serve this goal far better than aggressive protocols.\n\n";
  } else if (totalMgWeekly <= 1000) {
    evaluation +=
      "The total weekly dosage is moderate-to-high. Remember that the average male only produces 42-70 mg of testosterone per week naturally. " +
      "Research shows that myostatin protein levels spike ~200% above baseline after 29 days of exogenous androgen administration, " +
      "regardless of the compound used. This means muscle growth will plateau even at this dose — the answer is not more drugs, " +
      "but strategic calorie increases and patience.\n\n";
  } else {
    evaluation +=
      "The total weekly dosage is aggressive. At these levels, diminishing returns are severe. " +
      "Clinical data on Anadrol (50mg vs 100mg) showed that doubling the dose produced only 27% more lean mass " +
      "but 3.4x more liver damage. This principle applies across all anabolic steroids. " +
      "Consider whether the marginal gains justify the accelerated health deterioration — " +
      "'the flame that burns twice as bright burns half as long.'\n\n";
  }

  // HPTA / PCT outlook
  if (has19Nor) {
    evaluation +=
      "**HPTA Recovery Warning:** 19-Nor metabolites (particularly 5α-reduced metabolites of nandrolone) can suppress the " +
      "hypothalamic-pituitary-gonadal axis for 12-18 months after last injection. Standard PCT is unlikely to fully restore " +
      "natural testosterone production. This cycle should only be run by someone committed to long-term TRT/blast-and-cruise.\n\n";
  } else if (body.durationWeeks <= 12) {
    evaluation +=
      "HPTA recovery outlook is favorable for a cycle of this length. Begin PCT 2-3 weeks after last injection " +
      "(adjust based on ester half-life). Nolvadex at 20mg/day for 4-6 weeks is the evidence-based standard.\n\n";
  } else {
    evaluation +=
      "At " + body.durationWeeks + " weeks, HPTA recovery will require a well-structured PCT and patience. " +
      "On-cycle HCG is strongly recommended to maintain testicular function and facilitate recovery.\n\n";
  }

  return {
    overallScore: score,
    grade,
    evaluation,
    risks,
    recommendations,
    ancillariesRecommended,
  };
}

/* ────────────────────────────────────────────────────────────
   RoidAI SYSTEM PROMPT
   Encodes pharmacological knowledge for the xAI API.
   ──────────────────────────────────────────────────────────── */

const ROIDAI_SYSTEM_PROMPT = `You are RoidAI, an evidence-based AI assistant specializing in anabolic steroid pharmacology, harm reduction, and cycle optimization. Your purpose is strictly educational. You evaluate steroid cycles with clinical accuracy, cite pharmacological mechanisms, and prioritize user health and longevity over short-term gains.

## CORE PRINCIPLES — "LESS IS MORE"

1. **Diminishing returns are real and drastic.** Clinical data (e.g., 50mg vs 100mg Anadrol study) shows doubling the dose yields only ~27% more lean mass but 3.4x more liver damage (ALT/AST). This principle applies across all AAS. The long-term objective is netting maximum lifetime muscle accrual while staying healthy enough to continue bodybuilding.

2. **Natural testosterone production is only 42-70 mg/week.** Even 250 mg/week is 5-7x natural production after accounting for ester weight (~30% is ester). 500 mg/week ("the newbie cycle") is actually a LOT of gear — roughly 7-10x natural production.

3. **Myostatin, not androgen receptor downregulation, causes plateaus.** Androgen receptors UPREGULATE in the presence of androgens (established since the 1980s). Myostatin protein levels spike ~200% above baseline after 29 days of exogenous androgen/trenbolone administration. Switching compounds mid-cycle does NOT circumvent this — myostatin responds to total androgen load regardless of which compound is used.

4. **All steroids do roughly the same thing.** Nitrogen retention studies show injectable 17β-esters and oral 17α-alkyl derivatives both produce approximately 2-2.5g nitrogen/day (12-15g protein / 60-75g lean mass daily). The differences between compounds are in their side effect profiles, tissue selectivity, and interaction with secondary receptors — NOT in their fundamental muscle-building capacity.

## THE ANABOLIC STEROID FAMILY TREE

### Testosterone & Derivatives (Test, Dianabol, Equipoise, Turinabol, Halotestin)
- Broad spectrum: anabolic, androgenic, estrogenic (except Tbol/Halo)
- Testosterone aromatizes into estradiol at a tightly regulated rate — this is WHY it is the base of most cycles
- Dianabol aromatizes into 17α-methylestradiol and is hepatotoxic
- **Boldenone (EQ) does NOT reliably aromatize into estradiol.** High-sensitivity (LC/MS-MS) blood tests consistently show crushed estradiol with spiked estrone. Standard ECLIA testing gives FALSE estradiol readings by cross-detecting estrone. Boldenone competes with testosterone for aromatase, preventing adequate estradiol production. It should NOT be used as a test base.
- Turinabol and Halotestin behave more like DHT derivatives (no aromatization, strength-focused)

### DHT Derivatives (Masteron, Primobolan, Anavar, Winstrol, Anadrol, Superdrol, Proviron)
- More tissue-selective, skewed toward contractile tissue growth and force production
- NOT substrates for aromatase (exception: Anadrol has direct ER agonism)
- "Dry" compounds — no water retention, no progestogenic sides
- Often perceived as "weak" because the lack of side effects (water, estrogen) is misinterpreted as weakness
- Excellent for adding on top of a testosterone base when the user can no longer increase test without needing an AI
- Primobolan has the best clinical safety data and tolerability among DHT derivatives

### 19-Nortestosterone (Nandrolone) Derivatives (Nandrolone/Deca/NPP, Trenbolone, Trestolone/MENT)
- Most suppressive family — even one injection can suppress HPTA for months
- Interact with progesterone receptors (progestogenic activity)
- Nandrolone: converts to DHN (weaker androgen), mildly estrogenic via ERα agonism, but does NOT aromatize sufficiently to provide adequate estradiol. Neurotoxic and cardiotoxic at all doses studied in monotherapy.
- Trenbolone: not a substrate for aromatase, antagonizes glucocorticoid receptors (excellent muscle sparing in a deficit), but extremely harsh — insomnia, cardiovascular strain, neurotoxicity. Should be reserved for contest prep, not offseason mass building.
- Trestolone (MENT): unique 19-Nor that DOES aromatize into 7α-methylestradiol, potential test base alternative but insufficient long-term data

## ESTROGEN IS CRITICAL — NOT THE ENEMY

- Estrogen provides neuroprotection, cardioprotection, supports the GH/IGF-1 axis, lipid modulation, libido, erection quality, vasodilation, and bone health
- In neurotoxicity studies: physiologic testosterone was neuroprotective, but this effect was COMPLETELY ELIMINATED when anastrozole (AI) was co-administered — proving estrogen (not testosterone) provides the neuroprotection
- Nandrolone and Winstrol were neurotoxic at ALL doses studied because they don't produce sufficient estrogen
- If you need an AI, your testosterone dose is likely too high, you're too fat, your diet is poor, or you're injecting too infrequently
- AI use should be based on bloodwork + symptoms, NEVER prophylactic
- Too much estrogen = gyno, cancer risk. Too little estrogen = cardiovascular disease, neuronal death. Balance is key.

## SCORING GUIDELINES (0-100)

Score based on health-consciousness, not "effectiveness":
- 85-100 (A): Conservative, well-structured cycle with test base, reasonable duration, minimal compounds
- 70-84 (B): Solid cycle with minor concerns (slightly high doses, could optimize)
- 55-69 (C): Notable risks present (missing ancillaries, aggressive dosing, questionable compound choices)
- 40-54 (D): Significant health concerns (no test base, multiple orals, extreme doses, dangerous combinations)
- Below 40 (F): Reckless protocol that poses serious health risk

## RESPONSE FORMAT

Return ONLY valid JSON with no markdown fencing:
{
  "overallScore": <integer 0-100>,
  "grade": <"A"|"B"|"C"|"D"|"F">,
  "evaluation": <2-4 paragraph markdown analysis citing specific mechanisms, dosage context, and pharmacological rationale>,
  "risks": <array of specific, detailed risk strings with clinical context>,
  "recommendations": <array of actionable optimization strings>,
  "ancillariesRecommended": <array of {"name": string, "dose": string, "reason": string}>
}

Be specific. Reference mechanisms (myostatin, aromatase, HPTA, glucocorticoid receptors). Cite dosage context (compare to natural production). Explain WHY something is good or bad, don't just list risks. Be honest — if a cycle is dangerous, say so directly. If it's well-designed, acknowledge that too.`;

/* ────────────────────────────────────────────────────────────
   API ROUTE
   ──────────────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body: EvaluateBody = await req.json();

    if (!body.compounds || body.compounds.length === 0) {
      return NextResponse.json(
        { error: "No compounds provided" },
        { status: 400 }
      );
    }

    const allCompounds = [...COMPOUNDS, ...ANCILLARIES];
    const resolvedCompounds = body.compounds
      .filter((c) => !c.isAncillary)
      .map((c) => {
        const compound = allCompounds.find((x) => x.id === c.compoundId);
        if (!compound) throw new Error(`Unknown compound: ${c.compoundId}`);
        return { ...c, compound };
      });

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(mockEvaluation(body));
    }

    // Build detailed compound info for the AI
    const compoundDetails = resolvedCompounds
      .map((c) => {
        const family = getFamily(c.compoundId);
        const er = "effectRatings" in c.compound ? (c.compound as typeof COMPOUNDS[number]).effectRatings : null;
        const sr = "sideEffectRatings" in c.compound ? (c.compound as typeof COMPOUNDS[number]).sideEffectRatings : null;
        let line =
          `- ${c.compound.name} [${family.toUpperCase()} family]: ${c.dosageMg}mg/${c.frequency}` +
          ` | Type: ${"type" in c.compound ? c.compound.type : "ancillary"} | Half-life: ${"halfLifeDays" in c.compound ? (c.compound as typeof COMPOUNDS[number]).halfLifeDays : "?"}d`;
        if ("anabolicRatio" in c.compound) {
          const comp = c.compound as typeof COMPOUNDS[number];
          line += ` | Anabolic:${comp.anabolicRatio} Androgenic:${comp.androgenicRatio}`;
        }
        if (er) {
          line +=
            ` | Effects: MPS:${er.muscleProteinSynthesis} NR:${er.nitrogenRetention} Str:${er.strengthGains} RBC:${er.redBloodCellProduction} Fat:${er.fatLoss} Glyc:${er.glycogenStorage} Rec:${er.recoverySpeed} Coll:${er.collagenSynthesis}`;
        }
        if (sr) {
          line +=
            ` | Side effects: Suppress:${sr.hormonalSuppression} Estro:${sr.estrogenicEffects} Andro:${sr.androgenicEffects} Cardio:${sr.cardiovascularStrain} Liver:${sr.liverStress} Insulin:${sr.insulinResistance} Mood:${sr.moodChanges} Prostate:${sr.prostateRisk}`;
        }
        return line;
      })
      .join("\n");

    // Include ancillaries in the prompt if present
    const ancillaryInputs = body.compounds.filter((c) => c.isAncillary);
    let ancillaryDetails = "";
    if (ancillaryInputs.length > 0) {
      ancillaryDetails =
        "\n\nAncillaries included by user:\n" +
        ancillaryInputs
          .map((a) => {
            const anc = ANCILLARIES.find((x) => x.id === a.compoundId);
            return `- ${anc?.name ?? a.compoundId}: ${a.dosageMg}mg/${a.frequency}`;
          })
          .join("\n");
    }

    const userPrompt = `Evaluate this steroid cycle:

Stack Name: ${body.name || "Unnamed"}
Duration: ${body.durationWeeks} weeks
Goal: ${body.goal || "Not specified"}
Total weekly AAS load: ${resolvedCompounds.reduce((s, c) => s + c.dosageMg, 0)}mg

Compounds:
${compoundDetails}${ancillaryDetails}

Apply all your knowledge about the steroid family tree, myostatin, estrogen management, diminishing returns, and harm reduction principles. Be specific and educational.`;

    const xaiRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4",
        messages: [
          { role: "system", content: ROIDAI_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!xaiRes.ok) {
      const errText = await xaiRes.text();
      console.error("xAI API error:", errText);
      return NextResponse.json(mockEvaluation(body));
    }

    const xaiData = await xaiRes.json();
    const rawContent: string =
      xaiData.choices?.[0]?.message?.content ?? "";

    let parsed;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
    } catch {
      console.error(
        "Failed to parse xAI response, falling back to mock. Raw:",
        rawContent.slice(0, 500)
      );
      return NextResponse.json(mockEvaluation(body));
    }

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error("Evaluate route error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
