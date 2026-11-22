import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";

const root=resolve(process.argv[2]||"");
const ids=["hook","proof","cta"],frames=[];
for(const sceneId of ids){
  const dir=join(root,sceneId);
  const png=readdirSync(dir).filter(f=>f.toLowerCase().endsWith(".png"));
  assert.equal(png.length,1,sceneId+" must have exactly one native PNG snapshot");
  const file=join(dir,png[0]),bytes=readFileSync(file);
  assert.ok(statSync(file).size>3000,sceneId+" snapshot seems empty");
  frames.push({sceneId,bytes:bytes.length,sha256:createHash("sha256").update(bytes).digest("hex")});
}
assert.equal(new Set(frames.map(f=>f.sha256)).size,3,"Native snapshots did not select three distinct scenes");
console.log(JSON.stringify({checkedScenes:3,frames},null,2));
