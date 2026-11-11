import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { storyShots, type Shot } from "./content-factory/story";

const BG = "#0d1117";
const TEXT = "#f0f6fc";
const SECONDARY = "#9da7b2";

const easeIn = (frame: number) =>
  interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const ShotScene: React.FC<{ shot: Shot; sceneIndex: number }> = ({
  shot,
  sceneIndex,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  const side = portrait ? 90 : 120;
  const reveal = easeIn(frame);
  const leave = interpolate(frame, [shot.durationFrames - 12, shot.durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translate = interpolate(frame, [0, 24], [55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = reveal * leave;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 75% 18%, ${shot.accent}25, transparent 46%), ${BG}`,
        fontFamily: "Inter, Segoe UI, Arial, sans-serif",
        color: TEXT,
        padding: `${portrait ? 150 : 70}px ${side}px`,
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.16,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(to right, #ffffff22 1px, transparent 1px), linear-gradient(to bottom, #ffffff22 1px, transparent 1px)",
          backgroundSize: portrait ? "85px 85px" : "70px 70px",
        }}
      />
      <div style={{ zIndex: 1, fontSize: portrait ? 27 : 22, letterSpacing: 4, fontWeight: 700, color: shot.accent }}>
        {shot.eyebrow}
      </div>
      <div
        style={{
          zIndex: 1,
          opacity,
          transform: `translateY(${translate}px)`,
          maxWidth: portrait ? 880 : 1030,
        }}
      >
        <div style={{ fontSize: portrait ? 28 : 22, color: SECONDARY, marginBottom: 22 }}>
          0{sceneIndex + 1} / 0{storyShots.length} · {shot.role.toUpperCase()}
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: portrait ? 102 : 86,
            fontWeight: 850,
            letterSpacing: -3.2,
            lineHeight: 1.08,
            overflowWrap: "break-word",
          }}
        >
          {shot.headline}
        </h1>
        <div style={{ width: portrait ? 140 : 170, height: 8, background: shot.accent, marginTop: 38, borderRadius: 6 }} />
        <p
          style={{
            fontSize: portrait ? 41 : 35,
            maxWidth: 920,
            lineHeight: 1.35,
            color: SECONDARY,
            marginTop: 35,
          }}
        >
          {shot.detail}
        </p>
      </div>
      <div style={{ zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
        <span style={{ color: SECONDARY, fontSize: portrait ? 22 : 17 }}>CREATIVE PROOF OF CONCEPT · NO PUBLICAR SIN REVISIÓN</span>
        <span style={{ background: shot.accent, width: 66, height: 6, borderRadius: 6 }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: `${(frame / shot.durationFrames) * 100}%`,
          background: shot.accent,
          height: 8,
        }}
      />
    </AbsoluteFill>
  );
};

export const ContentFactory: React.FC = () => {
  let start = 0;
  return (
    <AbsoluteFill style={{ background: BG }}>
      {storyShots.map((shot, index) => {
        const from = start;
        start += shot.durationFrames;
        return (
          <Sequence key={shot.id} from={from} durationInFrames={shot.durationFrames}>
            <ShotScene shot={shot} sceneIndex={index} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// The animation is cyclic by construction: sin(0) == sin(2π).
export const BlogLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const cycle = (frame / durationInFrames) * Math.PI * 2;
  const pulse = 1 + Math.sin(cycle) * 0.06;
  const drift = Math.sin(cycle) * 12;

  return (
    <AbsoluteFill
      style={{
        background: BG,
        color: TEXT,
        fontFamily: "Inter, Segoe UI, Arial, sans-serif",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 640,
          height: 640,
          border: "2px solid #58a6ff60",
          borderRadius: "50%",
          transform: `scale(${pulse})`,
          boxShadow: "0 0 180px #58a6ff18",
        }}
      />
      <div style={{ transform: `translateY(${drift}px)`, textAlign: "center", zIndex: 1 }}>
        <div style={{ fontSize: 28, letterSpacing: 5, color: "#79c0ff", marginBottom: 30 }}>COMMUNITY MOTION LOOP</div>
        <h1 style={{ fontSize: 91, fontWeight: 850, lineHeight: 1.14, margin: 0, letterSpacing: -3 }}>
          BUILD.<br />SHARE.<br />REPEAT.
        </h1>
      </div>
      <p style={{ position: "absolute", bottom: 85, fontSize: 24, color: SECONDARY }}>
        Editable demo · not an event announcement
      </p>
    </AbsoluteFill>
  );
};
