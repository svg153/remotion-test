import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync, statSync, openSync, readSync, closeSync } from "node:fs";
import { dirname, resolve, isAbsolute, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { validateStory, buildRoot, buildScene, stylesheet, htmlEscape } from "./build-hyperframes.mjs";
import { validateAuthored, snapshotAuthored } from "./factory-authored.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(readFileSync(resolve(root,"content-factory/tools.json"),"utf8"));
const kinds = ["news","explainer","personal-brand","promo","pitch","clip","web-demo"];
const slug = /^[a-z][a-z0-9-]{0,63}$/;
const videoKinds = ["news","explainer","personal-brand","promo"];
const rights = ["owned","licensed","authorized"];
const str = (x) => typeof x === "string" && x.trim().length > 0;
const fail = (message) => { throw new Error(message); };
const writeJson = (path, value) => { mkdirSync(dirname(path),{recursive:true}); writeFileSync(path,JSON.stringify(value,null,2)+"\n"); };
const readJson = (path) => JSON.parse(readFileSync(path,"utf8"));
const digest = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

export function validate(p) {
  if (!p || p.schemaVersion !== 1 || !slug.test(p.id || "") || !kinds.includes(p.kind)) fail("Invalid project schema, id or kind");
  if (![p.title,p.audience,p.objective].every(str) || typeof p.demo !== "boolean") fail("Title, audience, objective and demo flag are required");
  if (!["public","authorized-local"].includes(p.sensitivity)) fail("Use public or explicitly authorized local content only");
  if (!Object.hasOwn(config.presets,p.format) || p.fps!==30) fail("Unsupported format or fps");
  if (!Array.isArray(p.claims) || !Array.isArray(p.assets)) fail("Claims and assets must be arrays");
  const ids=new Set();
  for(const c of p.claims){
    if(!c || !slug.test(c.id||"") || ids.has(c.id) || !str(c.text) || !["draft","verified"].includes(c.status)) fail("Invalid claim");
    ids.add(c.id);
  }
  if (p.mode!==undefined && !["template","authored"].includes(p.mode)) fail("Invalid mode");
  if (p.mode==="authored") validateAuthored(p);
  else if (p.assets.length) fail("Generic factory is text-only; use authored mode for reviewed media assets");
  if(videoKinds.includes(p.kind) || p.kind==="pitch"){
    if(!["remotion","hyperframes"].includes(p.engine)) fail("Invalid motion engine");
    if(p.kind==="pitch"&&(p.engine!=="hyperframes"||p.format!=="16:9")) fail("Pitch requires HyperFrames 16:9");
    validateStory({schemaVersion:1,fps:p.fps,shots:p.shots});
    if(p.kind==="pitch"&&p.shots.some(s=>!str(s.notes)))fail("Each slide requires speaker notes");
  } else if(p.kind==="clip"){
    if(p.engine!=="ffmpeg"||!p.source||typeof p.source.path!=="string"||!Array.isArray(p.clips)||p.clips.length===0)fail("Clip requires source + segments and FFmpeg");
    if(p.source.path&&(/^[a-z][a-z0-9+.-]*:\/\//i.test(p.source.path)||p.source.path.startsWith("\\\\")||p.source.path.startsWith("//")||p.source.path.includes("\0")))fail("Only local recording paths are supported");
    const ids=new Set();
    for(const c of p.clips){
      if(!c||!slug.test(c.id||"")||ids.has(c.id)||!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.start<0||c.end<=c.start||c.end-c.start>3600||!str(c.reason))fail("Invalid clip segment");
      ids.add(c.id);
    }
  } else if(p.engine!=="web-demo-video"||!p.source)fail("Invalid web-demo route");
  return p;
}

function localMedia(p, manifestPath){
  if(p.kind!=="clip"||!p.source.path)return null;
  const path=isAbsolute(p.source.path)?resolve(p.source.path):resolve(dirname(manifestPath),p.source.path);
  if(!existsSync(path)||!statSync(path).isFile())return null;
  return path;
}
function hashFile(path){
  const hash=createHash("sha256"),buffer=Buffer.alloc(1024*1024),fd=openSync(path,"r");
  try{let n;while((n=readSync(fd,buffer,0,buffer.length,null))>0)hash.update(buffer.subarray(0,n));}finally{closeSync(fd);}
  return hash.digest("hex");
}
function claimVerified(c){
  try{const url=new URL(c.source);return c.status==="verified"&&url.protocol==="https:"&&/^\d{4}-\d{2}-\d{2}$/.test(c.date||"")&&!Number.isNaN(Date.parse(c.date));}
  catch{return false;}
}
export function makePlan(p, manifestPath="project.json"){
  validate(p);
  const file=localMedia(p,manifestPath);
  const sourceHash=file?hashFile(file):null;
  const authored=p.mode==="authored"?snapshotAuthored(p,manifestPath):null;
  const blockers=authored?[...authored.blockers]:[];
  if(!p.demo || p.kind==="clip"){
    for(const c of p.claims)if(!claimVerified(c))blockers.push("Unverified claim: "+c.id);
    if(p.kind==="news"&&p.claims.length===0)blockers.push("News requires sourced claims");
  }
  if(p.kind==="clip"){
    if(!file)blockers.push("Local recording is missing");
    if(!rights.includes(p.source.rights))blockers.push("Recording rights require approval");
  }
  if(p.kind==="web-demo")blockers.push("Delegated to web-demo-video; not executable here");
  const approval=digest({project:p,sourceHash,authoredHash:authored?.projectHash||null});
  const dimensions=config.presets[p.format];
  const durationFrames=p.shots?.reduce((sum,s)=>sum+s.durationFrames,0)||null;
  return {id:p.id,kind:p.kind,engine:p.engine,format:p.format,dimensions,fps:p.fps,durationFrames,approval,sourceHash,authored,blockers,demo:p.demo,classification:p.sensitivity};
}
function styleFor(width,height){
  if(width===1280&&height===720)return stylesheet;
  if(height>width)return stylesheet+"\n#root{padding:180px 110px 200px}.top{flex-direction:column;align-items:flex-start;gap:15px}.top strong{font-size:27px}.top span{font-size:24px}.middle{max-width:860px}h1{font-size:88px;line-height:1.1}p{font-size:42px;max-width:860px}.bottom{font-size:21px;gap:20px}.orbit{right:32px;top:360px;opacity:.22}";
  return stylesheet+"\n#root{padding:110px}.middle{max-width:860px}h1{font-size:76px}p{font-size:34px;max-width:860px}.top strong{font-size:20px}.top span{font-size:18px}";
}
function deckHtml(p,width,height){
  let t=0;
  const slides=p.shots.map(s=>({sceneId:s.id,notes:s.notes}));
  const island=JSON.stringify({slides}).replace(/</g,"\\u003c");
  const body=p.shots.map(s=>{
    const start=t,secs=s.durationFrames/p.fps;t+=secs;
    return '<section class="clip slide" id="'+s.id+'" data-composition-id="'+s.id+'" data-label="'+htmlEscape(s.headline)+'" data-start="'+start+'" data-duration="'+secs+'" data-width="'+width+'" data-height="'+height+'" data-no-timeline="true" style="--accent:'+s.accent+'"><p class="kicker">'+htmlEscape(s.eyebrow)+'</p><h1>'+htmlEscape(s.headline)+'</h1><div class="bar"></div><p class="detail">'+htmlEscape(s.detail)+'</p><p class="notice">PREVIEW / REVISAR ANTES DE COMPARTIR</p></section>';
  }).join("\n");
  return '<!doctype html>\n<html lang="es"><head><meta charset="utf-8"><title>'+htmlEscape(p.title)+'</title><style>*{box-sizing:border-box}html,body{margin:0;background:#0d1117;color:#f0f6fc;font-family:Inter,Arial,sans-serif}.slide{position:absolute;inset:0;width:'+width+'px;height:'+height+'px;padding:85px 130px;background:#0d1117;display:flex;flex-direction:column;justify-content:center}.kicker{font-size:27px;color:var(--accent);font-weight:700;letter-spacing:3px}h1{font-size:82px;line-height:1.07;margin:20px 0;max-width:1020px}.bar{height:8px;background:var(--accent);width:180px;margin:20px 0}.detail{font-size:38px;color:#b0b8c3;line-height:1.35;max-width:1020px}.notice{position:absolute;bottom:62px;left:130px;font-size:20px;color:#9da7b2}</style></head><body><script type="application/hyperframes-slideshow+json">'+island+'</script>\n'+body+'\n</body></html>\n';
}
export function prepare(p, manifestPath, outputBase=resolve(root,"out/factory")){
  const plan=makePlan(p,manifestPath);
  const dir=resolve(outputBase,p.id,plan.approval.slice(0,16));
  mkdirSync(dir,{recursive:true});
  writeJson(resolve(dir,"plan.json"),plan);
  if(videoKinds.includes(p.kind)){
    const {width,height}=plan.dimensions;
    const story={schemaVersion:1,fps:p.fps,shots:p.shots};
    if(p.mode==="authored"){
      writeJson(resolve(dir,"authored-source.json"),{projectDir:plan.authored.projectDir,projectHash:plan.authored.projectHash,files:plan.authored.files});
    }else if(p.engine==="hyperframes"){
      const dest=resolve(dir,"hyperframes");
      mkdirSync(resolve(dest,"compositions"),{recursive:true});
      writeFileSync(resolve(dest,"index.html"),buildRoot(story,width,height));
      p.shots.forEach((s,i)=>writeFileSync(resolve(dest,"compositions","scene-"+s.id+".html"),buildScene(s,i,p.shots.length,p.fps,styleFor(width,height),width,height)));
    }else writeJson(resolve(dir,"remotion-props.json"),{shots:p.shots.map(({id,role,eyebrow,headline,detail,accent,durationFrames})=>({id,role,eyebrow,headline,detail,accent,durationFrames})),width,height,fps:p.fps});
  }else if(p.kind==="pitch"){
    const dest=resolve(dir,"slideshow");
    mkdirSync(dest,{recursive:true});
    writeFileSync(resolve(dest,"index.html"),deckHtml(p,plan.dimensions.width,plan.dimensions.height));
  }else if(p.kind==="web-demo"){
    writeJson(resolve(dir,"handoff.json"),{route:"web-demo-video",upstream:"https://github.com/svg153/skills/pull/123",status:"pending-reviewed-plugin",objective:p.objective,title:p.title});
  }else{
    writeJson(resolve(dir,"clip-plan.json"),{sourceDigest:plan.sourceHash,segments:p.clips,format:p.format,rights:p.source.rights});
  }
  return {dir,plan};
}
const env={...process.env,HYPERFRAMES_NO_TELEMETRY:"1",HYPERFRAMES_NO_UPDATE_CHECK:"1",HYPERFRAMES_SKIP_SKILLS:"1",DO_NOT_TRACK:"1",npm_config_ignore_scripts:"true"};
function exec(bin,args,options={}){
  const r=spawnSync(bin,args,{cwd:root,env,encoding:"utf8",maxBuffer:16*1024*1024,stdio:options.capture?["ignore","pipe","pipe"]:"inherit"});
  if(r.error||r.status!==0)fail(bin+" failed: "+(r.error?.message||r.stderr||r.status));
  return r.stdout||"";
}
function hf(...args){return exec("npx",["--yes","hyperframes@"+config.hyperframes,...args]);}
function probe(path){
  return JSON.parse(exec("ffprobe",["-v","error","-show_entries","format=duration:stream=codec_type,width,height,r_frame_rate","-of","json",path],{capture:true}));
}
function verifyOutput(path,dimensions,secs){
  const p=probe(path),v=p.streams.find(x=>x.codec_type==="video");
  if(!v||v.width!==dimensions.width||v.height!==dimensions.height||Math.abs(Number(p.format.duration)-secs)>0.2)fail("Unexpected output dimensions/duration: "+basename(path));
  const [n,d]=v.r_frame_rate.split("/").map(Number);
  if(Math.abs(n/d-30)>0.01)fail("Unexpected output frame rate");
  return p;
}
function safeNewOutput(path){if(existsSync(path))fail("Output already exists: "+path+" (review or move it before re-rendering)");}
export function requireApproval(plan,approval){
  if(approval!==plan.approval)fail("Explicit approval of the plan digest is required");
  if(plan.blockers.length)fail("Blocked: "+plan.blockers.join("; "));
  if(plan.kind==="pitch")fail("A deck is interactive: use present, not render");
}
function render(p,path,approval){
  const plan=makePlan(p,path);
  requireApproval(plan,approval);
  const {dir}=prepare(p,path);
  const evidence={approval:plan.approval,engine:p.engine,demo:p.demo,commands:[],outputs:[],verification:"technical-only",publicationApproved:false};
  const run=(bin,args)=>{evidence.commands.push({bin,args});exec(bin,args);};
  const {width,height}=plan.dimensions;
  if(p.kind==="clip"){
    const input=localMedia(p,path), source=probe(input), duration=Number(source.format.duration);
    evidence.source=source; evidence.sourceHash=plan.sourceHash;
    if(!source.streams.some(s=>s.codec_type==="video")||!Number.isFinite(duration))fail("No valid local video stream");
    if(p.clips.some(c=>c.end>duration+0.02))fail("Clip extends beyond source duration");
    for(const c of p.clips){
      const out=resolve(dir,c.id+".mp4");safeNewOutput(out);
      run("ffmpeg",["-hide_banner","-loglevel","error","-n","-ss",String(c.start),"-i",input,"-t",String(c.end-c.start),"-map","0:v:0","-map","0:a:0?","-vf","scale="+width+":"+height+":force_original_aspect_ratio=decrease,pad="+width+":"+height+":(ow-iw)/2:(oh-ih)/2,setsar=1","-r","30","-c:v","libx264","-pix_fmt","yuv420p","-c:a","aac","-movflags","+faststart",out]);
      evidence.outputs.push({file:basename(out),metadata:verifyOutput(out,plan.dimensions,c.end-c.start)});
    }
  }else if(videoKinds.includes(p.kind)){
    const out=resolve(dir,"video.mp4");safeNewOutput(out);
    if(p.engine==="hyperframes"){
      const project=p.mode==="authored"?plan.authored.projectDir:resolve(dir,"hyperframes");
      run("npx",["--yes","hyperframes@"+config.hyperframes,"check",project,"--json"]);
      run("npx",["--yes","hyperframes@"+config.hyperframes,"render",project,"--output",out,"--fps","30","--format","mp4"]);
    }else run("npx",["--no-install","remotion","render","src/index.ts","FactoryVideo",out,"--props="+resolve(dir,"remotion-props.json"),"--codec=h264","--pixel-format=yuv420p"]);
    evidence.outputs.push({file:"video.mp4",metadata:verifyOutput(out,plan.dimensions,plan.durationFrames/p.fps)});
  }else fail("No renderer for "+p.kind);
  if(p.mode==="authored")evidence.authoredSourceHash=plan.authored.projectHash;
  evidence.ffprobe=exec("ffprobe",["-version"],{capture:true}).split("\n")[0];
  evidence.ffmpeg=exec("ffmpeg",["-version"],{capture:true}).split("\n")[0];
  evidence.toolVersions={hyperframes:config.hyperframes,remotion:config.remotion,node:process.version};
  writeJson(resolve(dir,"evidence.json"),evidence);
  return {dir,evidence};
}
function main(){
  const [command,arg,id,...extra]=process.argv.slice(2);
  if(!command||command==="help"){console.log("factory new <news|explainer|personal-brand|promo|pitch|clip|web-demo> <id>\nfactory plan|prepare|present <project.json>\nfactory render <project.json> --approve <SHA-256>\nNo publishing. Local-only inputs. See content-factory/factory.md.");return;}
  if(command==="new"){
    if(!kinds.includes(arg)||!slug.test(id||"")||extra.length)fail("Invalid kind or id");
    const p=readJson(resolve(root,"content-factory/templates",arg+".json"));p.id=id;
    const dest=resolve(root,"workspace",id,"project.json");safeNewOutput(dest);writeJson(dest,p);console.log(dest);return;
  }
  if(!arg)fail("Provide project.json");
  const path=resolve(arg),p=readJson(path);
  if(command==="plan"){console.log(JSON.stringify(makePlan(p,path),null,2));return;}
  if(command==="prepare"){console.log(JSON.stringify(prepare(p,path),null,2));return;}
  if(command==="present"){
    if(p.kind!=="pitch")fail("Only pitch projects use interactive present");
    const {dir}=prepare(p,path);hf("present",resolve(dir,"slideshow"));return;
  }
  if(command==="render"&&id==="--approve"&&extra.length===1){console.log(JSON.stringify(render(p,path,extra[0]),null,2));return;}
  fail("Unknown command or invalid arguments. Use factory help.");
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{main();}catch(e){console.error(e.message);process.exitCode=1;}
}
