# Content Factory

Local-first production for GitHub Community, personal brand, technology news, product explainers, recorded talks and pitch presentations. No API key is required for the included workflows.

## Start

```bash
npm ci
# Install Microsoft APM 0.37.0 from its official release, then:
apm install --frozen --target agent-skills
apm audit
npm run factory -- help
npm run factory -- new news github-weekly
npm run factory -- plan workspace/github-weekly/project.json
npm run factory -- prepare workspace/github-weekly/project.json
```

The `workspace/` directory is ignored. Use Linux/macOS or WSL on Windows for the included CLI; `npx` and FFmpeg must be on PATH. Edit the project manifest there. The plan prints a SHA-256 approval digest binding the exact manifest; no execution or publication happens during plan. Prepare generates a deterministic preview project under `out/factory/<id>/<digest-prefix>/` without overwriting source files. It does not execute either renderer. For a video, inspect the prepared project in the native preview, create a small motion test and review the actual frames. For a final export, explicitly approve the digest shown by plan:

```bash
npm run factory -- render workspace/github-weekly/project.json --approve <digest>
```

Change any content and the digest changes. A final render also rejects unverified claims or unresolved asset rights, and accepts only public or explicitly authorized local data (never commit internal/private manifests to this public repo). Demo fixtures can render with a warning label but are never publication-approved. No publishing command. Each local render records the executable arguments, available engine/tool versions, output metadata and approval digest. Review the resulting media yourself; technical checks alone are not editorial clearance.

| Template | Execution |
| --- | --- |
| news | HyperFrames, verified news claim ledger with dates and source URLs |
| explainer | HyperFrames, or Remotion when selected |
| personal-brand | HyperFrames, or Remotion; original opinion and explicit claims |
| promo | HyperFrames, or Remotion; real assets in separately authored compositions |
| pitch | HyperFrames slideshow, presenter notes, keyboard navigation via native present |
| clip | FFmpeg precise local segment extraction from approved timestamps, aspect-preserving pad |
| web-demo | delegated to web-demo-video, actual recording rather than fabricated UI |

All four video templates start with a neutral skeleton to prove routing, not a finished creative direction. Use the authored mode below to escape the template. The agent must choose and implement a meaningful motion language after the storyboard gate; do not just swap copy into the baseline and call it cinematic. The generic scene renderer is text-only; external assets, sound, camera choreography, rich scenes and subtitle overlays belong in an authored HyperFrames project. No automatic transcribing, ranking, reframing or voice generation in v1.

## Video and deck preview

`prepare` prints the generated output directory. For HyperFrames video, use the pinned CLI with the generated directory:

```bash
npx --yes hyperframes@0.9.72 check <generated-dir>/hyperframes --json
npx --yes hyperframes@0.9.72 preview <generated-dir>/hyperframes
```

For Remotion use the generated `remotion-props.json` with the `FactoryVideo` composition and `--props` in CLI. The baseline is still available as ContentFactoryLandscape/Portrait. For a pitch:

```bash
npm run factory -- new pitch sample-pitch
npm run factory -- prepare workspace/sample-pitch/project.json
npm run factory -- present workspace/sample-pitch/project.json
```

The generated slide JSON island specifies slides and speaker notes. Present mode uses the HyperFrames runtime, not a proprietary slide renderer. Native playback, presenter notes, projector, remote control, fallback PDF and navigation must be checked before real events. Never pass a deck to `render`. If you need a video teaser, create a separate explainer manifest from the same approved source.

## Long video workflow

1. Save an authorized local recording outside Git. Obtain a local timecoded transcript (e.g. HyperFrames CLI transcribe/Whisper after verifying installed CLI help), identify 2-5 self-contained extracts, inspect surrounding context and document their purpose.
2. Create the clip template and edit source.path to an absolute or project-relative **local file**, source.rights and sensitivity, plus start/end seconds for each proposed clip. The CLI rejects URLs, unsafe IDs, invalid timecodes and out-of-bounds segments. Use one manifest per source.
3. Review the exact segments and approve the digest. Render local MP4 clips with FFmpeg, preserve aspect ratio by letterbox/pillarbox (not AI reframe), probe source and results. Keep source and results private/local as appropriate. Use `authorized-local` only for explicitly authorized recordings and a local environment; do not put internal footage, transcripts, manifests or evidence into the repository or CI artifacts. Use a private project if the policy requires it.
4. For speaker tracking, subtitles and fancy framing, run a separate reviewed AutoClip or authored overlay pilot; do not hallucinate features.
5. Review clips for context, sound, rights, caption accuracy and framing.

## Reproducibility

See [tools](tools.md), [comparison](comparison.md) and [templates](templates/). The original comparison fixture remains separate, with native keyframe evidence in PR #2. The APM v4 lockfile was generated by APM 0.37.0 in CI from the eight SHA-pinned dependencies; frozen installs are mandatory and CI checks the lock remains unchanged. Update manifest and lock together after explicit review. Do not run the upstream skill self-update or registry install commands from an unreviewed source. Keep render outputs in ignored directories. CI uses no API credentials, pinned tools and synthetic fixtures.

## Authored HyperFrames projects: beyond the template

The primary reusable production route for richer work is `mode: "authored"`. Use the installed HyperFrames skill, registry references, and [motion-language guidance](tools.md) to create an original composition in a **child directory of the local manifest**. The CLI does not overwrite authored code.

For a real starting point, copy [the continuous workflow demo](examples/cinematic-workflow/) into your ignored workspace. It retains a persistent visual rail and moving focus instead of rebuilding a card for each shot. Its project file is intentionally marked demo. Inspect it with:

```bash
npm run factory -- plan content-factory/examples/cinematic-workflow/project.json
npm run factory -- prepare content-factory/examples/cinematic-workflow/project.json
npx --yes hyperframes@0.9.72 check content-factory/examples/cinematic-workflow/composition --json
npx --yes hyperframes@0.9.72 preview content-factory/examples/cinematic-workflow/composition
```

To create an authored project from any video template, set:

```json
{
  "mode": "authored",
  "engine": "hyperframes",
  "source": { "project": "composition" },
  "assets": [
    { "path": "assets/voice.wav", "source": "Authorized original voice recording", "rights": "owned" }
  ]
}
```

This excerpt is merged into the existing complete manifest. Use local assets and include every file under assets/ and every media/font file in the rights ledger (owned, licensed, authorized). Pending/missing rights, missing files and external runtime resource references block final render. A source tree fingerprint covers all authored code and asset bytes; any edit invalidates the previous approval. Generated `.hyperframes/` and `renders/` caches are excluded. No symlinks, credentials, node_modules or Git metadata inside authored composition. Static checks are not a sandbox: review all HTML/JS and dependencies before running any code, never execute untrusted copied projects. Maintain the same duration/resolution as the manifest and verify native snapshots and actual playback. Remotion custom React compositions can still be developed in src/ with its official workflow; the generic manifest-driven React path remains separate.

## Pitch verification caveat

A bare HyperFrames check on a multi-root slideshow can report a clean first slide while never inspecting later slides. The factory therefore runs a structural storyboard audit (`scripts/pitch-audit.mjs`) and captures each referenced slide separately (`--composition <sceneId>`), requiring distinct images in CI. The native `present` command remains the interactive presenter path. This is not a substitute for checking keyboard navigation, presenter notes, projector and remote-control behavior on the target device. Exporting a deck root as MP4 is forbidden: use a separately authored video teaser.

Standalone per-slide previews are generated under `slide-preview/<sceneId>/`. They allow native HyperFrames checks and snapshots of every slide, since the CLI's generic video check cannot reliably seek beyond the first top-level slideshow root. These previews are testing artifacts, not additional presentation decks. The real deck remains `slideshow/index.html`, served through `hyperframes present`.
