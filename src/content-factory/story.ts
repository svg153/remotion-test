import storyboard from "../../content-factory/story.json";

export type Shot = {
  id: string;
  role: "hook" | "value" | "proof" | "cta";
  eyebrow: string;
  headline: string;
  detail: string;
  accent: string;
  durationFrames: number;
};

const roles = new Set<Shot["role"]>(["hook", "value", "proof", "cta"]);
const ids = new Set<string>();

if (storyboard.schemaVersion !== 1 || storyboard.fps !== 30) {
  throw new Error("Unsupported storyboard schema or fps");
}

export const storyShots: readonly Shot[] = storyboard.shots.map((shot): Shot => {
  if (
    !/^[a-z][a-z0-9-]*$/.test(shot.id) ||
    ids.has(shot.id) ||
    !roles.has(shot.role as Shot["role"]) ||
    !/^#[0-9a-fA-F]{6}$/.test(shot.accent) ||
    !Number.isInteger(shot.durationFrames) ||
    shot.durationFrames < 30
  ) throw new Error(`Invalid storyboard scene: ${shot.id}`);
  ids.add(shot.id);
  return { id: shot.id, role: shot.role as Shot["role"], eyebrow: shot.eyebrow,
    headline: shot.headline, detail: shot.detail, accent: shot.accent,
    durationFrames: shot.durationFrames };
});

export const storyDurationFrames = storyShots.reduce(
  (total, shot) => total + shot.durationFrames, 0
);
