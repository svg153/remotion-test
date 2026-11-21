import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const story = JSON.parse(readFileSync(resolve(root, "content-factory/story.json"), "utf8"));
const html = readFileSync(resolve(root, "hyperframes/index.html"), "utf8");

test("one storyboard: 4 scenes, 30 fps and 12s", () => {
  assert.equal(story.schemaVersion, 1);
  assert.equal(story.fps, 30);
  assert.equal(story.shots.length, 4);
  assert.equal(new Set(story.shots.map(s => s.id)).size, 4);
  assert.equal(story.shots.reduce((n,s) => n+s.durationFrames, 0), 360);
});

test("generated HyperFrames matches canonical JSON", () => {
  const result = spawnSync(process.execPath,
    [resolve(root,"scripts/build-hyperframes.mjs"), "--check"], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("same timing and no externally fetched assets", () => {
  let offset=0;
  for (const shot of story.shots) {
    assert.ok(html.includes('id="scene-' + shot.id + '"'));
    assert.ok(html.includes('data-start="' + offset/story.fps + '" data-duration="' + shot.durationFrames/story.fps + '"'));
    offset+=shot.durationFrames;
  }
  assert.ok(html.includes('data-duration="12" data-width="1280" data-height="720"'));
  assert.ok(html.includes("NO PUBLICAR SIN REVISIÓN"));
  assert.doesNotMatch(html, /https?:\/\/|<script[^>]+src=|<audio|<video/);
});
