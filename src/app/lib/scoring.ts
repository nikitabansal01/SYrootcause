export const hormoneFlags = {
  estrogen_dominance: ["heavy_periods", "sore_boobs", "endo_bloating"],
  low_progesterone: ["short_or_long_cycles", "low_ovulation", "anxiety"],
  high_androgens: ["chin_acne", "facial_hair", "high_testosterone"],
  high_cortisol: ["wired_at_night"],
  low_cortisol: ["morning_fatigue", "chronic_fatigue"],
  insulin_resistance: ["sugar_crashes", "irregular_periods", "insulin_resistance"],
  thyroid: ["cold_sensitivity", "thyroid_issues"],
  inflammation: ["pain_with_pooping", "pain_with_sex", "endo_bloating", "endo_fatigue"],
  balanced_hormones: ["regular_periods", "good_energy"]
};

export const pcosTypes = {
  insulin_resistant: ["sugar_crashes", "irregular_periods", "insulin_resistance"],
  adrenal: ["high_testosterone", "chin_acne", "facial_hair", "wired_at_night"],
  post_pill: ["pcos_post_pill_onset"],
  inflammatory: ["pcos", "pain_with_pooping", "endo_bloating", "endo_fatigue", "sore_boobs"]
};

export const endoTypes = {
  deep_or_ovarian: ["pain_with_sex", "pain_with_pooping", "endo_fatigue"],
  superficial: ["severe_cramps", "endo_bloating"]
};

export function calculateHormoneScores(selectedValues: string[]) {
  const scores: Record<string, number> = {};

  for (const [hormone, flags] of Object.entries(hormoneFlags)) {
    const matched = selectedValues.filter((val) => flags.includes(val));
    if (matched.length > 1) {
      scores[hormone] = 1; // primary imbalance
    } else if (matched.length === 1) {
      scores[hormone] = 0.5; // secondary
    }
  }

  return scores;
}

export function detectPcosType(selectedValues: string[]) {
  for (const [type, symptoms] of Object.entries(pcosTypes)) {
    const matches = symptoms.filter((s) => selectedValues.includes(s));
    if (matches.length >= 2) return type;
  }
  return null;
}

export function detectEndoType(selectedValues: string[]) {
  for (const [type, symptoms] of Object.entries(endoTypes)) {
    const matches = symptoms.filter((s) => selectedValues.includes(s));
    if (matches.length >= 2) return type;
  }
  return null;
}

export function calculateConfidence(scoreObject: Record<string, number>): "Low" | "Medium" | "High" {
  const primary = Object.values(scoreObject).filter((v) => v === 1).length;
  const secondary = Object.values(scoreObject).filter((v) => v === 0.5).length;

  if (primary + secondary < 2) return "Low";
  if (primary >= 4) return "High";
  return "Medium";
}

// Main analysis function that combines all scoring logic
export function analyzeQuizResponses(responses: Record<string, string | string[]>) {
  try {
    // Flatten all selected values into a single array
    const selectedValues: string[] = [];
    
    Object.values(responses).forEach(value => {
      if (Array.isArray(value)) {
        selectedValues.push(...value);
      } else if (typeof value === 'string' && value.trim()) {
        selectedValues.push(value);
      }
    });

    console.log('Selected values:', selectedValues);

    // Calculate hormone scores
    const hormoneScores = calculateHormoneScores(selectedValues);
    console.log('Hormone scores:', hormoneScores);
    
    // Detect conditions
    const pcosType = detectPcosType(selectedValues);
    const endoType = detectEndoType(selectedValues);
    
    // Calculate confidence
    const confidence = calculateConfidence(hormoneScores);
    
    // Determine primary and secondary imbalances
    const primaryImbalances = Object.entries(hormoneScores)
      .filter(([_, score]) => score === 1)
      .map(([hormone, _]) => hormone);
      
    const secondaryImbalances = Object.entries(hormoneScores)
      .filter(([_, score]) => score === 0.5)
      .map(([hormone, _]) => hormone);

    // Generate explanations
    const explanations = generateExplanations(hormoneScores, pcosType, endoType, selectedValues);

    // Ensure we always have some analysis, even if no specific symptoms detected
    let finalPrimaryImbalance = primaryImbalances[0] || null;
    let finalConfidence = confidence.toLowerCase() as 'low' | 'medium' | 'high';
    
    // If no specific imbalances detected, provide general insights
    if (Object.keys(hormoneScores).length === 0) {
      if (selectedValues.includes('regular_periods') && selectedValues.includes('good_energy')) {
        finalPrimaryImbalance = 'balanced_hormones';
        finalConfidence = 'medium';
        explanations.push("Your responses suggest good overall hormonal balance.");
      } else if (selectedValues.length > 0) {
        finalPrimaryImbalance = 'general_symptoms';
        finalConfidence = 'low';
        explanations.push("Some symptoms were reported, but more specific patterns are needed for detailed analysis.");
      } else {
        // Fallback for completely empty responses
        finalPrimaryImbalance = 'general_symptoms';
        finalConfidence = 'low';
        explanations.push("Please complete the assessment to receive personalized insights.");
      }
    }

    const result = {
      scores: hormoneScores,
      primaryImbalance: finalPrimaryImbalance,
      secondaryImbalances,
      confidenceLevel: finalConfidence,
      pcosType,
      endoType,
      explanations,
      totalScore: Object.values(hormoneScores).reduce((sum, score) => sum + score, 0)
    };

    console.log('Analysis result:', result);
    return result;
  } catch (error) {
    console.error('Error in analyzeQuizResponses:', error);
    // Return a safe fallback result
    return {
      scores: {},
      primaryImbalance: 'general_symptoms',
      secondaryImbalances: [],
      confidenceLevel: 'low' as const,
      pcosType: null,
      endoType: null,
      explanations: ["There was an issue analyzing your responses. Please try again."],
      totalScore: 0
    };
  }
}

// Helper function to generate explanations
function generateExplanations(
  scores: Record<string, number>, 
  pcosType: string | null, 
  endoType: string | null,
  selectedValues: string[]
): string[] {
  const explanations: string[] = [];

  // Hormone imbalance explanations
  Object.entries(scores).forEach(([hormone, score]) => {
    if (score === 1) {
      explanations.push(`Strong indicators of ${hormone.replace(/_/g, ' ')} imbalance detected.`);
    } else if (score === 0.5) {
      explanations.push(`Some signs of ${hormone.replace(/_/g, ' ')} imbalance present.`);
    }
  });

  // PCOS type explanations
  if (pcosType) {
    explanations.push(`PCOS pattern suggests ${pcosType.replace(/_/g, ' ')} type.`);
  }

  // Endometriosis type explanations
  if (endoType) {
    explanations.push(`Endometriosis pattern suggests ${endoType.replace(/_/g, ' ')} involvement.`);
  }

  // General health insights
  if (selectedValues.includes('regular_periods')) {
    explanations.push("Regular periods suggest good overall hormonal balance.");
  }

  if (selectedValues.includes('good_energy')) {
    explanations.push("Good energy levels indicate healthy cortisol and thyroid function.");
  }

  return explanations;
} 