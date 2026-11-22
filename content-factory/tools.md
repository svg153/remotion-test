# Tool selection and provenance

The factory owns routing, briefs, review gates, deterministic scripts and evidence. APM owns installed skills, not runtime tools.

| Component | Status | Role |
| --- | --- | --- |
| HyperFrames CLI 0.9.72 | Active, pinned | HTML/CSS or authored GSAP/3D, scenes, native check, snapshot, present, MP4 |
| Remotion 4.0.481 | Active, package-lock.json | React scenes, code demos, reusable compositions, multiple formats |
| FFmpeg / FFprobe | Active, system executable | local clip extraction, normalization, metadata inspection; versions recorded per run |
| microsoft/apm 0.37.0 | Active, SHA-pinned action | Install selected Agent Skills; audit and lock before updates |
| Whisper / HyperFrames transcribe | Optional, local | transcription before clip selection; verify model and language, keep input private |
| AutoClip | Evaluate separately | semantic selection and face reframe only after a benchmark; do not claim current factory supports those |
| Piper | Optional | licensed local voice models after approval; not bundled |
| web-demo-video | Pending upstream merge | actual browser capture; delegated route, see https://github.com/svg153/skills/pull/123 |

## Creative research (reference only; do not execute or vendor)

- [Bang Motion](https://github.com/bangtutorial/bang-motion/tree/c1aa65e921c970d858705fcb4a53a8294d1a4131) (MIT): one continuous visual world, camera moves between information, maximum two text hierarchies, avoid slide-like fade sequences. Adopt original scene ideas into our templates, not its autoplay/export runtime.
- [Video Shotcraft](https://github.com/Vincentwei1021/video-shotcraft/tree/59f3e9b9e936ff2bce0e18446226d770a3f2f61f) (Apache-2.0): shot cards, holds, product-native visual design, authentic screenshots, optional sound design. Large gallery and assets remain reference-only. Individual media licenses and Remotion terms still apply.
- [Claude Remotion Skill](https://github.com/haidrrrry/claude-remotion-skill): compare techniques with the official Remotion skill, no additional conflicting engine router.
- Anything2Explainer is noncommercial; do not import its implementation for commercial work. Paint MV depends on an unlicensed upstream engine; excluded. Hand-drawn explainers: style idea only pending provenance.
- [AutoClip](https://github.com/artbyjazi/autoclip) and [OpenMontage](https://github.com/OpenMontageInc/OpenMontage) are evaluation candidates, not hidden runtime dependencies.

The official Remotion skills pin may describe newer APIs than our locked 4.0.481 runtime. Confirm APIs against the installed version and never upgrade implicitly. HyperFrames skill revision matches the 0.9.72 tag. No cloud account, paid API, voice clone or publishing integration is required. No automated third-party script execution simply because a skill was installed. Review licenses for work use, assets and fonts; avoid automatic registry installs and network media.

## Motion language for authored work

The generic typography fallback is only a functional baseline. For final creative work use a hero object or persistent visual motif, visual cause and effect, 2-3 purposeful camera moves, one visual idea per scene, real screenshots or diagrams, rhythm and readable holds. Choose motion based on meaning rather than transition variety. For presentation slides, deliberate static holds and navigation are appropriate. Mark approved narration, music, sound effects and factual claims in the manifest. Export a short motion sample before advancing to a full editorial render. A silent demo is not a finished marketing asset.
