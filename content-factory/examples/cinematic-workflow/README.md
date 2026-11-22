# Continuous workflow creative demo

Original 12s, 1280x720, 30fps HyperFrames source. Four nodes remain visible while the focus and connecting path move through a continuous scene. This demonstrates the authored route and a persistent visual metaphor; it is not a finished audiovisual production or official branded material.

The manifest is the approval and rights contract, not an auto-generated representation of this HTML. If you change scene timing, text, source, assets or resolution, update project.json where appropriate and re-plan. No music, narration or external media. Inspect native playback and snapshots before publishing.

```bash
node scripts/factory.mjs plan content-factory/examples/cinematic-workflow/project.json
node scripts/factory.mjs prepare content-factory/examples/cinematic-workflow/project.json
npx --yes hyperframes@0.9.72 check content-factory/examples/cinematic-workflow/composition --json
npx --yes hyperframes@0.9.72 preview content-factory/examples/cinematic-workflow/composition
```
