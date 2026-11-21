# HyperFrames 16:9 comparison

This is a **video composition**, not a HyperFrames interactive slideshow.

The [generated index.html](index.html) uses the exact four scenes from the [canonical storyboard](../content-factory/story.json) consumed by the Remotion `ContentFactoryLandscape` composition. It contains no stock assets, music, external CDN, voice or private screens.

```bash
node scripts/build-hyperframes.mjs
node scripts/build-hyperframes.mjs --check
node --test scripts/content-factory.test.mjs
npx hyperframes check ./hyperframes --json
npx hyperframes preview ./hyperframes
```

The HyperFrames CLI must be installed and pinned before reproducibility benchmarking. Run a first native check and inspect rendered frames before claiming that this HTML is a production-ready video. **Demo only; not approved for publication.**

See the [paired evaluation protocol](../content-factory/comparison.md).
