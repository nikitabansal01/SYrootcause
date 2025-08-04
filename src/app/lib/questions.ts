// lib/questions.ts
export const quizQuestions: Question[] = [
  {
    id: "q1",
    question: "🪤 What's your period vibe like?",
    type: "checkbox" as const,
    options: [
      { label: "✅ It shows up on time every month like clockwork", value: "regular_periods" },
      { label: "⏰ Skips months or plays hide-and-seek", value: "irregular_periods" },
      { label: "⚡ Super heavy or painful", value: "heavy_periods" },
      { label: "😔 Lasts forever or ends super quickly", value: "short_or_long_cycles" },
      { label: "😞 Cramps + poop problems or bladder weirdness", value: "pain_with_pooping" },
    ]
  },
  {
    id: "q2",
    question: "🤓 Has a doctor ever told you that you have any of these?",
    type: "checkbox" as const,
    options: [
      { label: "🌿 PCOS", value: "pcos" },
      { label: "🌺 Endometriosis", value: "endometriosis" },
      { label: "🌻 Thyroid issues (hypo or hyper)", value: "thyroid_issues" },
      { label: "🧃 Blood sugar issues / Insulin resistance", value: "insulin_resistance" },
      { label: "❓ I'm suspicious something's up but haven't been diagnosed", value: "suspected_issues" },
      { label: "✉️ Nope, all clear (I think)", value: "no_known_conditions" },
    ]
  },
  {
    id: "q3",
    question: "🧠 Pick your weird body stuff (no judgment!):",
    type: "checkbox" as const,
    options: [
      { label: "😴 Always tired, even after a full night's sleep", value: "morning_fatigue" },
      { label: "🍌 Crave sugar or get super sleepy after eating", value: "sugar_crashes" },
      { label: "😡 Jawline acne, chin hair, or oily skin", value: "chin_acne" },
      { label: "😭 Big mood swings or anxiety", value: "anxiety" },
      { label: "🐺 Puffy, bloated, or sore boobs before your period", value: "sore_boobs" },
      { label: "❄️ Cold hands/feet, dry skin, hair falling out", value: "cold_sensitivity" },
      { label: "😱 Painful poops, peeing, or sex around your period", value: "pain_with_sex" },
    ]
  },
  {
    id: "q4",
    question: "🌞 What's your energy like during the day?",
    type: "radio" as const,
    options: [
      { label: "☕️ Tired in the morning no matter what", value: "morning_fatigue" },
      { label: "⏱ Fine during the day, but wired at night", value: "wired_at_night" },
      { label: "💤 Just straight-up exhausted all the time", value: "chronic_fatigue" },
      { label: "💪 I feel pretty good, actually!", value: "good_energy" },
    ]
  },
  {
    id: "q5",
    question: "📅 Do you ever track your period or ovulation?",
    type: "radio" as const,
    options: [
      { label: "🔢 I know exactly when I ovulate and when my period's coming", value: "tracks_ovulation" },
      { label: "❓ I track a bit, but ovulation is confusing", value: "tracks_some" },
      { label: "🚫 I don't think I ovulate (or don't get signs)", value: "no_ovulation_signs" },
      { label: "🧰 Never tracked it / No idea", value: "never_tracked" },
    ]
  },
  {
    id: "q6",
    question: "🧬 Which of these have happened to you?",
    type: "checkbox" as const,
    conditional: "pcos",
    options: [
      { label: "😅 Hair in places I don't want it (chin, chest, belly)", value: "facial_hair" },
      { label: "🌵 Periods that go MIA for months", value: "long_cycles" },
      { label: "🤔 Blood test said my testosterone is high", value: "high_testosterone" },
      { label: "🥔 My doc said I don't ovulate much", value: "low_ovulation" },
      { label: "🛂 My symptoms started after quitting the pill", value: "pcos_post_pill_onset" },
    ]
  },
  {
    id: "q7",
    question: "🌺 Do you deal with these?",
    type: "checkbox" as const,
    conditional: "endometriosis",
    options: [
      { label: "💩 Pain with pooping or peeing around your period", value: "pain_with_pooping" },
      { label: "🛋️ Pain with deep sex", value: "pain_with_sex" },
      { label: "😢 Cramps so bad you miss school or cry", value: "severe_cramps" },
      { label: "💕 Period makes your belly huge and bloated", value: "endo_bloating" },
      { label: "⚡ Major fatigue around your period", value: "endo_fatigue" },
    ]
  },
  {
    id: "q8",
    question: "💬 Want to share anything else about your body or period?",
    type: "text" as const,
    optional: true
  }
];

// Type definitions for the questions
export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  question: string;
  type: "radio" | "checkbox" | "text";
  options?: QuestionOption[];
  conditional?: string;
  optional?: boolean;
}

export interface QuizResponse {
  [key: string]: string | string[];
} 