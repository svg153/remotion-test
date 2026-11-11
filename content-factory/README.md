# Review-gated motion content factory (starter)

This repository contains a working GitHub tutorial and **separate demo compositions** to reuse for event promos, technical explainers, personal-brand reels, and blog loops. No unpublished event, sponsorship, or vendor endorsement is implied by the sample texts.

The data-driven demo is intentionally simple: it proves aspect ratios, editable scene copy, frame-accurate timing, and repeatable MP4/GIF export. It is **not** a complete AI video editor or an autonomous publishing workflow.

## Approval gates

| Gate | Input | Reviewable output | Next action |
| --- | --- | --- | --- |
| 1: Story | Topic, audience, desired CTA | 2-3 narratives and timed outline | Approve a direction |
| 2: Storyboard | Approved narrative | Shot list + static keyframes | Approve design/claims |
| 3: Motion | Approved visuals, audio direction | 5-8s sample render | Approve pacing |
| 4: Delivery | Approved sample or explicit final request | MP4 and optional loop/GIF | Verify before posting |

Track scene IDs, brand/assets, public/privacy classification, approval status, rights, sources and modifications in your storyboard. The example is in [storyboard.md](storyboard.md). For a repeatable editorial contract see [svg153/skills motion-content-production](https://github.com/svg153/skills/tree/main/skills/motion-content-production) after its PR is merged.

## Editing the demo

1. Install: `npm ci`.
2. Edit scene content and frame counts in `src/content-factory/story.ts`.
3. Edit visuals/transitions in `src/ContentFactory.tsx`; both aspect ratios reuse the same scene data.
4. Preview: `npm run dev`. Select one of:
   - `MyComp`: the original tutorial
   - `ContentFactoryLandscape`: 1280x720
   - `ContentFactoryPortrait`: 1080x1920
   - `BlogLoop`: 1080x1080 / 4-second seamless animation
5. Before exporting verify: `npm run lint`.

Do not add unseeded `Math.random()` or wall-clock based behavior to a Remotion frame render. Keep animations reproducible across stills and full exports.

## Static storyboard review

```bash
npx remotion still src/index.ts ContentFactoryLandscape out/shot-hook.png --frame=35
npx remotion still src/index.ts ContentFactoryLandscape out/shot-value.png --frame=125
npx remotion still src/index.ts ContentFactoryLandscape out/shot-proof.png --frame=215
npx remotion still src/index.ts ContentFactoryLandscape out/shot-cta.png --frame=305
```

Review actual rendered frames before spending time on sound or a full render. Use portrait composition stills too, especially to catch overflow and safe-area problems.

## 6-second motion sample

```bash
npx remotion render src/index.ts ContentFactoryLandscape out/sample.mp4 --frames=0-179 --codec=h264 --pixel-format=yuv420p
```

## Full renders and GIF loop

```bash
npx remotion render src/index.ts ContentFactoryLandscape out/video-landscape.mp4 --codec=h264 --pixel-format=yuv420p
npx remotion render src/index.ts ContentFactoryPortrait out/video-portrait.mp4 --codec=h264 --pixel-format=yuv420p
npx remotion render src/index.ts BlogLoop out/blog-loop.mp4 --codec=h264 --pixel-format=yuv420p
ffmpeg -i out/blog-loop.mp4 -vf "fps=12,scale=640:-1:flags=lanczos,palettegen" out/palette.png
ffmpeg -i out/blog-loop.mp4 -i out/palette.png -lavfi "fps=12,scale=640:-1:flags=lanczos[x];[x][1:v]paletteuse" out/blog-loop.gif
```

GIF is silent and typically larger than a comparable MP4/WebM. Prefer MP4/WebM for social and web embeddings when supported. Add authorized audio/voice and proper captions only after storyboard approval; this demo ships **without audio**.

## Publication safety

Check that each displayed name, brand, date, project status, event detail and endorsement claim is backed by an allowed public source. Do not use private repository screens, customer identifiers or unreleased commercial material. Confirm permissions for personal photos, voice cloning, music and logos. Verify render artifacts open and play; code review alone is not playback QA.
