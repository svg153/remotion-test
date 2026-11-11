// Creative sample only. Replace this with an approved storyboard before publishing.
export type Shot = {
  id: string;
  role: "hook" | "value" | "proof" | "cta";
  eyebrow: string;
  headline: string;
  detail: string;
  accent: string;
  durationFrames: number;
};

export const storyShots: readonly Shot[] = [
  {
    id: "hook",
    role: "hook",
    eyebrow: "COMMUNITY / MOTION TEST",
    headline: "¿Otro evento de tecnología?",
    detail: "Hagamos que merezca la pena.",
    accent: "#79c0ff",
    durationFrames: 90,
  },
  {
    id: "value",
    role: "value",
    eyebrow: "UNA IDEA",
    headline: "Aprender juntos",
    detail: "Ideas, demos y conversaciones reales.",
    accent: "#d2a8ff",
    durationFrames: 90,
  },
  {
    id: "proof",
    role: "proof",
    eyebrow: "LO QUE IMPORTA",
    headline: "Código. Comunidad. Aprendizaje.",
    detail: "Conocimiento técnico para compartir.",
    accent: "#7ee787",
    durationFrames: 90,
  },
  {
    id: "cta",
    role: "cta",
    eyebrow: "TU PRÓXIMA HISTORIA",
    headline: "Build. Share. Repeat.",
    detail: "Demo creativa. Sustituye los textos y valida los datos antes de publicar.",
    accent: "#ffa657",
    durationFrames: 90,
  },
];

export const storyDurationFrames = storyShots.reduce((total, shot) => {
  if (!Number.isInteger(shot.durationFrames) || shot.durationFrames <= 0) {
    throw new Error(`Invalid duration for shot ${shot.id}`);
  }
  return total + shot.durationFrames;
}, 0);
