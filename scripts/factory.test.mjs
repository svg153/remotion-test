import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { validate, makePlan, prepare, requireApproval } from "./factory.mjs";
const fixture=k=>JSON.parse(readFileSync(new URL("../content-factory/templates/"+k+".json",import.meta.url),"utf8"));
test("all templates valid; expected routing",()=>{for(const k of ["news","explainer","personal-brand","promo","pitch","clip","web-demo"])assert.equal(validate(fixture(k)).kind,k);});
test("approval binds exact text; non-demo news requires verified claims",()=>{
  const p=fixture("news");p.demo=false;const a=makePlan(p);assert.equal(a.blockers.length,1);
  p.claims[0]={id:"claim-1",text:"Verified example",source:"https://example.com/primary",date:"2026-11-22",status:"verified"};
  const b=makePlan(p);assert.equal(b.blockers.length,0);assert.notEqual(a.approval,b.approval);
  assert.throws(()=>requireApproval(b,a.approval),/approval/);assert.doesNotThrow(()=>requireApproval(b,b.approval));
  p.title="Changed";assert.notEqual(b.approval,makePlan(p).approval);
});
test("validation rejects unsafe ids, remote video and unsupported assets",()=>{
  const p=fixture("clip");p.source.path="https://example.com/video.mp4";assert.throws(()=>validate(p),/local/);
  const q=fixture("promo");q.id="../outside";assert.throws(()=>validate(q),/invalid/i);q.id="safe";q.assets.push({path:"logo.png"});assert.throws(()=>validate(q),/text-only/);
});
test("prepared video variants and live deck are separate",()=>{
  const tmp=mkdtempSync(join(tmpdir(),"factory-test-"));
  try{
    const p=fixture("explainer");p.format="9:16";const a=prepare(p,"project.json",tmp);
    const html=readFileSync(join(a.dir,"hyperframes/index.html"),"utf8");assert.match(html,/data-width="1080" data-height="1920"/);
    const scene=readFileSync(join(a.dir,"hyperframes/compositions/scene-hook.html"),"utf8");assert.match(scene,/data-height="1920"/);
    p.engine="remotion";const b=prepare(p,"project.json",tmp);assert.equal(JSON.parse(readFileSync(join(b.dir,"remotion-props.json"))).height,1920);
    const d=fixture("pitch"),c=prepare(d,"project.json",tmp);
    assert.match(readFileSync(join(c.dir,"slideshow/index.html"),"utf8"),/application\/hyperframes-slideshow\+json/);
    assert.throws(()=>requireApproval(c.plan,c.plan.approval),/interactive/);
    assert.ok(!existsSync(join(c.dir,"hyperframes/index.html")));
  }finally{rmSync(tmp,{recursive:true,force:true});}
});
test("clip approval binds file bytes and authorized local source",()=>{
  const tmp=mkdtempSync(join(tmpdir(),"factory-clip-"));
  try{
    const p=fixture("clip");p.source={path:"recording.mp4",rights:"owned"};p.sensitivity="authorized-local";
    const file=join(tmp,"recording.mp4");writeFileSync(file,"first");
    const a=makePlan(p,join(tmp,"project.json"));assert.equal(a.blockers.length,0);
    writeFileSync(file,"changed");const b=makePlan(p,join(tmp,"project.json"));assert.notEqual(a.approval,b.approval);
    assert.throws(()=>requireApproval(b,a.approval),/approval/);
  }finally{rmSync(tmp,{recursive:true,force:true});}
});
