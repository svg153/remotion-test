import { createHash } from "node:crypto";
import { existsSync, lstatSync, readdirSync, openSync, readSync, closeSync, readFileSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";

const rights = new Set(["owned","licensed","authorized"]);
const ignored = new Set([".hyperframes","renders"]);
const media = /\.(?:mp4|mov|mkv|webm|avi|mp3|wav|ogg|m4a|aac|flac|png|jpe?g|webp|gif|avif|woff2?|ttf|otf|pdf|lottie)$/i;
const slash = (x) => typeof x === "string" && x.length>0 && x.length<400 && !x.includes("\\") && !x.includes(":") && !x.includes("\0") && !x.startsWith("/") && x.split("/").every(p=>p&&p!=="."&&p!=="..");
const fail = message => { throw new Error(message); };
function fileHash(path){
  const hash=createHash("sha256"),buffer=Buffer.alloc(1024*1024),fd=openSync(path,"r");
  try{let n;while((n=readSync(fd,buffer,0,buffer.length,null))>0)hash.update(buffer.subarray(0,n));}finally{closeSync(fd);}
  return hash.digest("hex");
}
export function validateAuthored(p){
  if(p.engine!=="hyperframes"||!["news","explainer","personal-brand","promo"].includes(p.kind))fail("Authored mode is available for HyperFrames video projects only");
  if(!p.source || !slash(p.source.project))fail("Authored source.project must be a child directory of the manifest, not an absolute or traversal path");
  const seen=new Set();
  for(const a of p.assets){
    if(!a||!slash(a.path)||seen.has(a.path)||typeof a.source!=="string"||!a.source.trim()||!["pending",...rights].includes(a.rights))fail("Invalid authored asset ledger entry");
    seen.add(a.path);
  }
}
export function snapshotAuthored(p,manifestPath){
  validateAuthored(p);
  const base=dirname(resolve(manifestPath)), projectDir=resolve(base,...p.source.project.split("/"));
  if(!projectDir.startsWith(base+sep))fail("Authored project escapes manifest directory");
  let current=base;
  for(const component of p.source.project.split("/")){
    current=resolve(current,component);
    if(!existsSync(current))return {projectDir,projectHash:null,files:[],blockers:["Authored project directory has not been created"]};
    const stat=lstatSync(current);if(stat.isSymbolicLink()||!stat.isDirectory())fail("Authored project may not contain symlink directory components");
  }
  const files=[],blockers=[];
  function walk(dir,prefix=""){
    for(const entry of readdirSync(dir).sort()){
      if(!prefix&&ignored.has(entry))continue;
      const relative=prefix?prefix+"/"+entry:entry, path=resolve(dir,entry);
      if(!slash(relative))fail("Invalid authored source path: "+relative);
      const stat=lstatSync(path);
      if(stat.isSymbolicLink())fail("Symlinks in authored project are forbidden: "+relative);
      if([".git","node_modules",".env"].includes(entry)||entry.startsWith(".env."))fail("Do not put dependencies, repository metadata, or credentials inside the composition: "+relative);
      if(stat.isDirectory()){walk(path,relative);continue;}
      if(!stat.isFile())fail("Unsupported source file: "+relative);
      if(files.length>=5000)fail("Authored project exceeds 5000 files; review and reduce its scope");
      if(/\.(?:html|css|js|mjs|svg)$/i.test(relative)){
        // Conservative review guard, not a sandbox: never execute untrusted authored code.
        if(stat.size>20*1024*1024)fail("Source file too large for review: "+relative);
        const markup=readFileSync(path,"utf8");
        if(/(?:\b(?:src|href)\s*=\s*["']|url\(\s*["']?)(?:https?:)?\/\//i.test(markup))blockers.push("External runtime resource: "+relative);
      }
      files.push({path:relative,bytes:stat.size,sha256:fileHash(path)});
    }
  }
  walk(projectDir);
  if(!files.some(f=>f.path==="index.html"))blockers.push("Authored project requires index.html");
  const ledger=new Map(p.assets.map(a=>[a.path,a]));
  for(const file of files){
    if(file.path.startsWith("assets/")||media.test(file.path)){
      const record=ledger.get(file.path);
      if(!record)blockers.push("Missing rights ledger for "+file.path);
      else if(!rights.has(record.rights))blockers.push("Unresolved rights for "+file.path);
    }
  }
  for(const a of p.assets){
    if(!files.some(f=>f.path===a.path))blockers.push("Declared asset missing: "+a.path);
    if(!rights.has(a.rights))blockers.push("Unresolved rights: "+a.path);
  }
  const projectHash=createHash("sha256").update(JSON.stringify(files)).digest("hex");
  return {projectDir,projectHash,files,blockers:[...new Set(blockers)]};
}
