import { NextRequest, NextResponse } from "next/server";
import { COMPOUNDS } from "@/data/compounds";

interface CompoundInput {
  compoundId: string;
  dosageMg: number;
  frequency: string;
}

interface EvaluateBody {
  name?: string;
  compounds: CompoundInput[];
  durationWeeks: number;
  goal?: string;
}

function mockEvaluation(body: EvaluateBody) {
  const compoundNames = body.compounds
    .map((c) => {
      const compound = COMPOUNDS.find((x) => x.id === c.compoundId);
      return compound ? compound.name : c.compoundId;
    })
    .join(", ");

  const hasOral = body.compounds.some((c) => {
    const compound = COMPOUNDS.find((x) => x.id === c.compoundId);
    return compound?.type === "oral";
  });

  const compoundCount = body.compounds.length;
  const score = Math.max(
    40,
    Math.min(92, 85 - (compoundCount - 1) * 5 - (hasOral ? 8 : 0))
  );

  let grade = "A";
  if (score < 80) grade = "B";
  if (score < 65) grade = "C";
  if (score < 50) grade = "D";
  if (score < 40) grade = "F";

  const evaluation = `## Cycle Analysis: ${body.name || "Unnamed Stack"}

**Stack:** ${compoundNames} | **Duration:** ${body.durationWeeks} weeks${body.goal ? ` | **Goal:** ${body.goal}` : ""}

This cycle demonstrates a ${compoundCount === 1 ? "straightforward single-compound" : compoundCount === 2 ? "classic two-compound" : "multi-compound"} approach${body.goal ? ` targeting ${body.goal.toLowerCase()}` : ""}. ${compoundCount === 1 ? "Running a solo blast simplifies PCT planning and reduces the complexity of managing multiple hormonal pathways simultaneously." : "The synergy between the selected compounds provides complementary anabolic pathways, though this increases the complexity of managing potential side effects."} ${hasOral ? "The inclusion of an oral compound necessitates close attention to hepatic biomarkers — ALT/AST monitoring every 4 weeks is strongly advisable." : "The all-injectable profile is favorable from a hepatotoxicity standpoint."}

From a hormonal suppression standpoint, ${body.durationWeeks <= 12 ? "the cycle length is within a reasonable range for recovery, supporting a standard PCT protocol commencing 2–3 weeks post-cycle." : body.durationWeeks <= 16 ? "the cycle length is moderate — recovery of the HPTA will require a structured PCT and may take 8–12 weeks." : "the extended duration warrants serious consideration of HCG use throughout the cycle to maintain testicular function, followed by a full PCT protocol."} Bloodwork before, during (at the midpoint), and after PCT is non-negotiable for responsible use.`;

  const risks: string[] = [
    "HPTA suppression requiring structured post-cycle therapy",
    "Potential cardiovascular strain — monitor blood pressure and lipid panels",
  ];
  if (hasOral) {
    risks.push("Hepatotoxicity risk from oral 17-alpha-alkylated compound(s) — limit oral duration and supplement with TUDCA/NAC");
  }
  if (body.durationWeeks > 16) {
    risks.push("Extended cycle duration increases risk of prolonged HPTA suppression and fertility impairment");
  }
  if (compoundCount >= 3) {
    risks.push("Multi-compound stacks increase difficulty of identifying the source of adverse reactions");
  }
  risks.push("Androgenic side effects (acne, hair loss in predisposed individuals, virilization in females)");

  const recommendations: string[] = [
    "Run comprehensive bloodwork (CBC, CMP, lipid panel, hormone panel) before starting",
    "Have an aromatase inhibitor on hand and adjust dose based on estrogen bloodwork, not prophylactically",
    "Plan and obtain PCT medications (Nolvadex/Clomid) before cycle begins",
    "Monitor blood pressure weekly — maintain below 135/85 mmHg",
  ];
  if (body.durationWeeks > 12) {
    recommendations.push("Consider HCG 500 IU twice weekly throughout the cycle to preserve testicular function");
  }
  if (compoundCount === 1) {
    recommendations.push("Single-compound cycles are optimal for identifying your individual response to each compound");
  }

  const ancillariesRecommended = [
    {
      name: "Anastrozole",
      dose: "0.25–0.5mg EOD (as needed)",
      reason: "Aromatase inhibitor to control estrogen conversion and prevent estrogenic side effects. Dose based on bloodwork.",
    },
    {
      name: "Tamoxifen (Nolvadex)",
      dose: "20mg/day for 4 weeks (PCT)",
      reason: "SERM for post-cycle therapy to restore natural testosterone production by blocking hypothalamic estrogen receptors.",
    },
  ];
  if (body.durationWeeks > 12) {
    ancillariesRecommended.push({
      name: "HCG",
      dose: "500 IU twice weekly (on-cycle)",
      reason: "Prevents testicular atrophy and maintains intratesticular testosterone, facilitating easier HPTA recovery post-cycle.",
    });
  }
  if (hasOral) {
    ancillariesRecommended.push({
      name: "TUDCA",
      dose: "500mg/day (during oral use)",
      reason: "Hepatoprotectant that reduces cholestatic liver stress from 17-alpha-alkylated oral steroids.",
    });
  }

  return { overallScore: score, grade, evaluation, risks, recommendations, ancillariesRecommended };
}

export async function POST(req: NextRequest) {
  try {
    const body: EvaluateBody = await req.json();

    if (!body.compounds || body.compounds.length === 0) {
      return NextResponse.json({ error: "No compounds provided" }, { status: 400 });
    }

    const resolvedCompounds = body.compounds.map((c) => {
      const compound = COMPOUNDS.find((x) => x.id === c.compoundId);
      if (!compound) throw new Error(`Unknown compound: ${c.compoundId}`);
      return { ...c, compound };
    });

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(mockEvaluation(body));
    }

    const compoundDetails = resolvedCompounds
      .map((c) => {
        const er = c.compound.effectRatings;
        const sr = c.compound.sideEffectRatings;
        return (
          `- ${c.compound.name}: ${c.dosageMg}mg/week (${c.frequency})` +
          ` | Anabolic:${c.compound.anabolicRatio} Androgenic:${c.compound.androgenicRatio}` +
          ` | Effects: MPS:${er.muscleProteinSynthesis} NR:${er.nitrogenRetention} Str:${er.strengthGains} RBC:${er.redBloodCellProduction} Fat:${er.fatLoss} Rec:${er.recoverySpeed}` +
          ` | Side effects: Suppress:${sr.hormonalSuppression} Estro:${sr.estrogenicEffects} Andro:${sr.androgenicEffects} Cardio:${sr.cardiovascularStrain} Liver:${sr.liverStress} Mood:${sr.moodChanges}`
        );
      })
      .join("\n");

    const prompt = `You are RoidAI, an evidence-based AI assistant specializing in anabolic steroid pharmacology. Your purpose is educational and harm-reduction. Evaluate this steroid cycle with clinical accuracy. Be honest about risks.

Stack: ${body.name || "Unnamed"}
Duration: ${body.durationWeeks} weeks
Goal: ${body.goal || "Not specified"}

Compounds:
${compoundDetails}

Return ONLY valid JSON with no markdown fencing, no preamble:
{
  "overallScore": <integer 0-100, higher = safer and more optimal>,
  "grade": <"A"|"B"|"C"|"D"|"F">,
  "evaluation": <2-3 paragraph markdown string with clinical analysis>,
  "risks": <array of concise risk strings>,
  "recommendations": <array of actionable optimization strings>,
  "ancillariesRecommended": <array of {"name": string, "dose": string, "reason": string}>
}`;

    const xaiRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    if (!xaiRes.ok) {
      const errText = await xaiRes.text();
      console.error("xAI API error:", errText);
      return NextResponse.json(mockEvaluation(body));
    }

    const xaiData = await xaiRes.json();
    const rawContent: string = xaiData.choices?.[0]?.message?.content ?? "";

    let parsed;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
    } catch {
      console.error("Failed to parse xAI response, falling back to mock");
      return NextResponse.json(mockEvaluation(body));
    }

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error("Evaluate route error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
