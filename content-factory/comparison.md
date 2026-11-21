# Pilot A: Remotion vs HyperFrames

**State:** implemented as a static, reviewable comparison. Real HyperFrames lint, rendered MP4s, motion review and benchmark are **not yet verified**.

## Controlled baseline

- Canonical story: [story.json](story.json), four creative demo scenes. Change this file once, never duplicate scenes manually.
- Same content, scene order, colours and timecodes in both engines.
- 1280 x 720, 30 fps, 360 frames, 12 seconds, no audio.
- Remotion: `ContentFactoryLandscape` from the existing PR.
- HyperFrames: [index.html](../hyperframes/index.html), generated from the same JSON.
- Original 28s tutorial `MyComp` remains untouched and is not used as the comparable baseline.

## Commands

Requirements: Node.js 22+, FFmpeg/FFprobe and Chrome/Chromium. Install Remotion dependencies with `npm ci`. Independently install and **pin a reviewed version** of the official HyperFrames CLI. Run `hyperframes --help` to verify the flags of that version.

```bash
node scripts/build-hyperframes.mjs --check
node --test scripts/content-factory.test.mjs
npm run lint
mkdir -p out/compare
npx remotion render src/index.ts ContentFactoryLandscape out/compare/remotion.mp4 --codec=h264 --pixel-format=yuv420p
npx hyperframes check ./hyperframes --json
npx hyperframes snapshot ./hyperframes --at 1.16 --output out/compare/hyperframes-hook.png
npx hyperframes render ./hyperframes --output out/compare/hyperframes.mp4 --fps 30
ffprobe -v error -show_entries format=duration -show_entries stream=width,height,r_frame_rate -of json out/compare/remotion.mp4
ffprobe -v error -show_entries format=duration -show_entries stream=width,height,r_frame_rate -of json out/compare/hyperframes.mp4
```

Do not assume `npx hyperframes` is version-pinned unless the CLI was installed locally in the project. The use of a floating version or runtime downloads invalidates a reproducibility claim. Do not commit generated MP4s unless explicitly approved.

## Paired review protocol

| Check | Remotion | HyperFrames |
| --- | --- | --- |
| Typecheck / static checks | Pending | Generated HTML checks implemented |
| Native engine lint | Pending | Pending |
| Keyframes at 1.16s, 4.16s, 7.16s, 10.16s | Pending | Pending |
| Full playback (12s, cuts and fades) | Pending | Pending |
| Text clipping / title-safe / visual clarity | Pending | Pending |
| Repeated render determinism | Pending | Pending |
| Render wall time, peak CPU/RAM and output bytes | Pending | Pending |
| Licensing and publishing rights | Must review | Must review |

Compare identical scene keyframes and two complete exports on the **same machine**. A generator consistency check does not prove correct rendered motion. No scores or winner until the rendered files are verified.

## Boundaries

- A HyperFrames slideshow is a **different interactive presentation output**. Its `present` mode is not a complete MP4 export; rendering the deck root can silently output only the first slide.
- Clip extraction from long videos belongs to a transcription and editorial selection pipeline, not this text-animation pilot.
- Real web demos are covered separately in [svg153/skills PR #123](https://github.com/svg153/skills/pull/123).
- The production governance skill already exists in [svg153/skills](https://github.com/svg153/skills/tree/main/skills/motion-content-production). This repo is a technical testbed, not a competing skills catalog.

No third-party source code was copied. References: [official format](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/references/format.md), [CLI](https://hyperframes.app/docs/5-packages/cli), [slideshow](https://github.com/heygen-com/hyperframes/blob/main/docs/guides/slideshow.mdx).
