import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { htmlEscape } from "./build-hyperframes.mjs";

function attr(tag,name){
  const pattern=new RegExp("(?:^|\\s)"+name+'="([^"]*)"');
  return tag.match(pattern)?.[1];
}
export function auditPitch(project,html){
  assert.equal(project.kind,"pitch","Pitch manifest expected");
  assert.equal(project.engine,"hyperframes","Pitch must use HyperFrames");
  assert.ok(Array.isArray(project.shots)&&project.shots.length>=2,"Need multiple slides");
  const manifest=html.match(/<script\s+type="application\/hyperframes-slideshow\+json">([\s\S]*?)<\/script>/i);
  assert.ok(manifest,"Missing HyperFrames slideshow JSON island");
  const island=JSON.parse(manifest[1]);
  assert.equal(island.slides.length,project.shots.length,"Mismatch between slide count and shots");
  const sections=[...html.matchAll(/<section\b[^>]*>/g)].map(x=>x[0]);
  assert.equal(sections.length,project.shots.length,"Missing or extra slide compositions");
  const ids=new Set();let time=0;
  for(let i=0;i<project.shots.length;i++){
    const shot=project.shots[i],section=sections[i],ref=island.slides[i];
    assert.ok(!ids.has(shot.id),"Duplicate scene id");ids.add(shot.id);
    assert.equal(ref.sceneId,shot.id,"Slide reference does not point to its scene");
    assert.equal(ref.notes,shot.notes,"Missing/different presenter notes");
    assert.ok(typeof ref.notes==="string"&&ref.notes.trim(),"Empty presenter notes");
    assert.equal(attr(section,"id"),shot.id,"Invalid section id");
    assert.equal(attr(section,"data-composition-id"),shot.id,"Invalid native composition id");
    assert.equal(attr(section,"data-label"),htmlEscape(shot.headline),"Missing native slide label");
    assert.equal(Number(attr(section,"data-start")),time/30,"Incorrect slide start");
    assert.equal(Number(attr(section,"data-duration")),shot.durationFrames/30,"Incorrect slide duration");
    assert.equal(Number(attr(section,"data-width")),1280,"Incorrect slide width");
    assert.equal(Number(attr(section,"data-height")),720,"Incorrect slide height");
    assert.ok(html.includes("<h1>"+htmlEscape(shot.headline)+"</h1>"),"Headline does not match manifest");
    time+=shot.durationFrames;
  }
  return {checkedSlides:sections.length,sceneIds:[...ids],durationSeconds:time/30,hasNotes:true,mode:"structural-only"};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{
    const [manifest,htmlFile]=process.argv.slice(2);
    if(!manifest||!htmlFile)throw new Error("Usage: pitch-audit.mjs <project.json> <slideshow/index.html>");
    console.log(JSON.stringify(auditPitch(JSON.parse(readFileSync(manifest,"utf8")),readFileSync(htmlFile,"utf8")),null,2));
  }catch(e){console.error(e.message);process.exitCode=1;}
}
