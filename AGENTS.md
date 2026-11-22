# Content Factory

Read [the factory manual](content-factory/factory.md) and the installed motion-content-production skill in .agents/skills first. The project manifest is apm.yml; do not use npx skills add or self-update upstream skills. Use APM pinned dependencies (apm install --frozen after initial lock creation). See content-factory/tools.md for engine versions and provenance. Never bypass APM security findings or run scripts from creative reference repos without a separate review.

- Requests: classify as news, explainer, personal-brand, promo, clip, pitch or web-demo. Use npm run factory -- plan <project.json> to show routing and the approval hash.
- For videos: default to HyperFrames; use Remotion when existing React components, its ecosystem, or comparative evidence justify it. Read the matching official skill and relevant references. Use local CLI version in content-factory/tools.json, not floating installs or plugin auto-update. Disable optional telemetry and paid/cloud paths unless authorized.
- News: primary sources and verified claims before final rendering. No customer, personal or private material in this public repository. Workspaces and outputs are ignored; do not publish automatically.
- For clips: transcribe authorized local material, propose timecodes with context, approve selection, then use FFmpeg extraction. No automatic claims of semantic quality or speaker tracking.
- For decks: use the official slideshow contract and present mode. Never render the deck root to MP4; choose a separate film.
- For actual web UI demos: use the reviewed web-demo-video capability when available, not invented screenshots. Do not install the unmerged PR as a default dependency.
- A successful lint or static HTML build is not proof of visual quality. Check native snapshots, inspect actual playback, record evidence and rights before any delivery.
- Keep original MyComp and comparison fixture working. WIP=1; validate each increment before starting another. Never commit private footage, generated media, dependencies or credentials.
