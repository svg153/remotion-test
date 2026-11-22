import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { prepare } from "./factory.mjs";
import { auditPitch } from "./pitch-audit.mjs";

test("all generated pitch slides, timings and speaker notes are consistent",()=>{
  const dir=mkdtempSync(join(tmpdir(),"pitch-audit-"));
  try{
    const p=JSON.parse(readFileSync(new URL("../content-factory/templates/pitch.json",import.meta.url)));
    const prepared=prepare(p,"project.json",dir);
    const html=readFileSync(join(prepared.dir,"slideshow/index.html"),"utf8");
    const result=auditPitch(p,html);
    assert.equal(result.checkedSlides,p.shots.length);
    assert.equal(result.durationSeconds,p.shots.reduce((n,s)=>n+s.durationFrames,0)/30);
    assert.throws(()=>auditPitch(p,html.replace('data-composition-id="cta"','data-composition-id="other"')),/native composition id/);
    assert.throws(()=>auditPitch(p,html.replace('"notes":"', '"notesBROKEN":"')),/presenter notes/);
  }finally{rmSync(dir,{force:true,recursive:true});}
});
