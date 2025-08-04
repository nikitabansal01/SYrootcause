/**
 * Results Summary Types
 * Centralized TypeScript interfaces for analysis results
 */

export interface AnalysisResult {
  primaryImbalance: string | null;
  secondaryImbalances: string[];
  confidenceLevel: 'low' | 'medium' | 'high';
  explanations: string[];
  scores: Record<string, number>; // Generic scores object
  totalScore: number;
  cyclePhase: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'lifestyle' | 'medical' | 'diet' | 'supplement';
}

export interface ResultsSummary {
  analysis: AnalysisResult;
  recommendations: Recommendation[];
  cyclePhase: string;
  confidenceLevel: 'low' | 'medium' | 'high';
  disclaimer: string;
} 