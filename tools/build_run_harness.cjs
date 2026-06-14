/* build_run_harness.cjs - Zentrale-DiggAi-Bank Knowledge Harness (Node, no deps)
 * Parses EVERY run-log across DiggAiHH source repos into ONE normalized schema.
 *   diggai-anamnese : 5-bullet "Lauf" (Aktion/Blocker/Fix/Ergebnis/Out)
 *   JoBetes         : Goal/Did/Result/Surprise/Next
 *   wanderwell      : "# Run NN" with ## sections (many Stiller-Tag skeletons)
 * Outputs into <out>: runs_all.json, runs_all.csv, HARNESS_INDEX.md,
 *   candidates_since_<DATE>.md, STATS.md
 * Usage: node build_run_harness.cjs --src <repos-parent> --out <dir> --since 2026-05-19
 */
const fs = require("fs");
const path = require("path");

const REPOS = ["diggai-anamnese", "JoBetes", "wanderwell"];
const DA_HEADER = /^\d{4}-\d{2}-\d{2}T[\d:]+.*\|\s*Lauf\b/i;
const PLACEHOLDER = /^(\[LEER.*\]|—|-|–|n\/?a)$/i;

const SIGNALS = {
  GOTCHA: [/OOM/i,/HYPERVISOR/i,/timeout/i,/\b50\d\b/,/\bESM\b/i,/does not provide an export/i,
    /CORS/i,/\bcache/i,/rate.?limit/i,/provenance/i,/\btier\b/i,/CAPTCHA/i,/HEIC/i,
    /passphrase/i,/\bSSH\b/i,/war rot/i,/boot.?loop/i,/konflikt/i,/kaputt/i,/brach\b/i,
    /broke/i,/quirk/i,/stolper/i,/deadlock/i,/race.?condition/i],
  FAILED: [/schlug fehl/i,/scheiter/i,/nie wieder/i,/vermeiden/i,/funktioniert nicht/i,
    /geht nicht/i,/abgelehnt/i,/verworfen/i,/fehlgeschlag/i,/\bfailed?\b/i,/kann nicht/i,/blockiert/i],
  WORKED: [/funktioniert\b/i,/bewährt/i,/bewaehrt/i,/\bpattern\b/i,/etabliert/i,/spart/i,
    /SUCCESS/i,/löst\b/i,/\bgrün\b/i,/\bgreen\b/i,/solide/i],
  METHOD: [/workflow/i,/\bDoD\b/,/\bloop\b/i,/pareto/i,/\bPRD\b/,/handoff/i,/protokoll/i,
    /recheck/i,/checklist/i,/\bgate\b/i],
};

const DA_MARK = [["action",/^[-*]\s*Aktion:\s*/gim],["blocker",/^[-*]\s*Blocker:\s*/gim],
  ["fix",/^[-*]\s*Fix:\s*/gim],["result",/^[-*]\s*Ergebnis:\s*/gim],["next",/^[-*]\s*Out:\s*/gim]];
const JB_MARK = [["topic",/\*\*Goal:?\*\*\s*/gi],["action",/\*\*Did:?\*\*\s*/gi],
  ["result",/\*\*Result:?\*\*\s*/gi],["surprise",/\*\*Surprise:?\*\*\s*/gi],["next",/\*\*Next:?\*\*\s*/gi]];
const WW_MARK = [["action",/^##\s*Erledigte Tasks.*$/gim],["commits",/^##\s*Commits heute.*$/gim],
  ["decisions",/^##\s*Wichtige Entscheidungen.*$/gim],["blocker",/^##\s*Offene Probleme.*$/gim],
  ["next",/^##\s*N.chste Schritte.*$/gim],["memory",/^##\s*Memory.*$/gim]];

function clean(v){ if(!v) return ""; v=v.trim(); return PLACEHOLDER.test(v)?"":v; }
function trunc(s,n){ s=(s||"").split(/\s+/).join(" ").trim(); return s.length<=n?s:s.slice(0,n-1)+"…"; }

// --- Anonymisierung (Hard-Rule: keine projekt-spezifischen Daten in zentrale Repos) ---
const SCRUB = [
  [/Klap?proth/gi, "{{USER}}"], [/Nasser/gi, "{{USER}}"], [/Laith/gi, "{{USER}}"],
  [/Kurt Mackey/gi, "{{USER}}"], [/\bMoin\b/g, "{{USER}}"], [/\bCK\b/g, "{{USER}}"],
  [/[\w.+-]+@[\w-]+\.[\w.-]+/g, "{{EMAIL}}"],
  [/C:\\Users\\[^\\\s"']+/gi, "C:\\\\Users\\\\{{USER}}"],
  [/\b(?:[0-9a-f]{1,4}::?){2,}[0-9a-f]{0,4}(?:\/\d+)?/gi, "{{IP6}}"],
  [/\b\d{1,3}(?:\.\d{1,3}){3}\b/g, "{{IP}}"],
  [/L00\dCAE\d+/gi, "{{REF}}"], [/arzt\/?arzt\d+/gi, "{{CRED}}"], [/ArztPass\w*/g, "{{CRED}}"],
];
function scrub(s){ if(!s) return s; let o=s; for(const [rx,rep] of SCRUB) o=o.replace(rx,rep); return o; }
function scrubAll(recs){
  const F=["topic","action","blocker","fix","result","surprise","next","decisions"];
  for(const r of recs){ for(const k of F) if(r[k]) r[k]=scrub(r[k]); }
}

function splitByMarkers(text, markers){
  const hits=[];
  for(const [key,rx] of markers){
    const g=new RegExp(rx.source, rx.flags.includes("g")?rx.flags:rx.flags+"g");
    let m;
    while((m=g.exec(text))!==null){
      hits.push([m.index, m.index+m[0].length, key]);
      if(m.index===g.lastIndex) g.lastIndex++;
    }
  }
  hits.sort((a,b)=>a[0]-b[0]);
  const out={};
  for(let i=0;i<hits.length;i++){
    const [,e,key]=hits[i];
    const end=i+1<hits.length?hits[i+1][0]:text.length;
    if(!(key in out)) out[key]=text.slice(e,end).trim();
  }
  return out;
}

function parseFilename(fn){
  const base=fn.toLowerCase().endsWith(".md")?fn.slice(0,-3):fn;
  const m=base.match(/^(\d{4}-\d{2}-\d{2})/);
  const date=m?m[1]:"";
  let rest=date?base.slice(date.length).replace(/^[_-]+/,""):base;
  const rm=rest.match(/(?:Run|run|-)(\d+)[a-z]?(?:_.*)?$/);
  const run=rm?rm[1]:"";
  const parts=rest.split("_");
  return {date, label:rest, agent:parts[0]||"", model:parts[1]||"", run};
}

function firstNonempty(text){
  for(const ln of text.split(/\r?\n/)){ if(ln.trim()) return ln.trim(); }
  return "";
}

function detectFormat(text, first){
  if(DA_HEADER.test(first)) return "DA";
  if(first.startsWith("# Run")) return "WW";
  const head=text.slice(0,400);
  if(head.includes("**Goal")||head.includes("**Did")||head.includes("**Result")) return "JB";
  return "UNKNOWN";
}

function parseRecord(text){
  const rec={format:"",topic:"",action:"",blocker:"",fix:"",result:"",surprise:"",
    next:"",decisions:"",quiet:false,parse_ok:true};
  const first=firstNonempty(text);
  const fmt=detectFormat(text,first);
  rec.format=fmt;
  if(fmt==="DA"){
    rec.topic=first.split("|").pop().trim();
    const d=splitByMarkers(text,DA_MARK);
    for(const k of ["action","blocker","fix","result","next"]) rec[k]=clean(d[k]);
  } else if(fmt==="JB"){
    const d=splitByMarkers(text,JB_MARK);
    rec.topic=clean(d.topic);
    for(const k of ["action","result","surprise","next"]) rec[k]=clean(d[k]);
    rec.blocker=rec.surprise;
  } else if(fmt==="WW"){
    rec.topic=first.replace(/^#+\s*/,"").trim();
    const d=splitByMarkers(text,WW_MARK);
    for(const k of ["action","blocker","next","decisions"]) rec[k]=clean(d[k]);
    if(/Stiller Tag/i.test(text)||/kein Code-Output/i.test(text)) rec.quiet=true;
  } else {
    rec.parse_ok=false; rec.topic=first.slice(0,160);
  }
  const blob=[rec.action,rec.blocker,rec.fix,rec.result,rec.surprise,rec.decisions].join(" ").trim();
  if(!rec.quiet && blob.length<25) rec.quiet=true;
  return rec;
}

function detectSignals(rec){
  const blob=[rec.blocker,rec.fix,rec.surprise,rec.result,rec.decisions,rec.action].join(" ");
  const cats=[], terms=new Set();
  for(const [cat,pats] of Object.entries(SIGNALS)){
    for(const rx of pats){ const m=blob.match(rx); if(m){ if(!cats.includes(cat))cats.push(cat); terms.add(m[0].trim()); } }
  }
  return {cats, terms:[...terms].sort()};
}

function walk(src, since){
  const records=[];
  for(const repo of REPOS){
    const rdir=path.join(src,repo,"memory","runs");
    if(!fs.existsSync(rdir)) continue;
    for(const fn of fs.readdirSync(rdir).sort()){
      if(!fn.toLowerCase().endsWith(".md")) continue;
      if(["INDEX.md","_TEMPLATE.md","README.md"].includes(fn)) continue;
      const fp=path.join(rdir,fn);
      let text="";
      try{ text=fs.readFileSync(fp,"utf-8"); }
      catch(ex){ records.push({repo,file:fn,parse_ok:false,error:String(ex)}); continue; }
      const f=parseFilename(fn);
      const rec=parseRecord(text);
      Object.assign(rec,{repo,file:fn,date:f.date,label:f.label,agent:f.agent,
        model:f.model,run:f.run,source:`${repo}/memory/runs/${fn}`,
        in_window:Boolean(f.date && f.date>=since)});
      const s=detectSignals(rec);
      rec.signal_cats=s.cats; rec.signal_terms=s.terms;
      rec.substantive=(!rec.quiet)&&Boolean(rec.blocker||rec.fix||rec.surprise||rec.action.length>40);
      records.push(rec);
    }
  }
  return records;
}

function writeJson(recs,out){ fs.writeFileSync(path.join(out,"runs_all.json"),JSON.stringify(recs,null,1)); }

function csvCell(v){ v=String(v==null?"":v); return '"'+v.replace(/"/g,'""')+'"'; }
function writeCsv(recs,out){
  const cols=["repo","date","agent","model","run","format","quiet","substantive",
    "in_window","signal_cats","topic","blocker","fix","source"];
  const lines=[cols.map(csvCell).join(",")];
  for(const r of recs){
    lines.push([r.repo,r.date,r.agent,r.model,r.run,r.format,r.quiet,r.substantive,
      r.in_window,(r.signal_cats||[]).join("|"),trunc(r.topic,120),trunc(r.blocker,200),
      trunc(r.fix,200),r.source].map(csvCell).join(","));
  }
  fs.writeFileSync(path.join(out,"runs_all.csv"),lines.join("\r\n"));
}

function writeIndex(recs,out,since){
  const L=["# RUN HARNESS INDEX","",
    "Normalisierte Wissens-Records fuer JEDEN Run-Log aus allen DiggAiHH-Quell-Repos.",
    "Auto-generiert von `tools/build_run_harness.cjs`. Fenster-Marker `since="+since+"`.",
    "Felder fehlen = im Original leer/Skelett.",""];
  for(const repo of REPOS){
    const rs=recs.filter(r=>r.repo===repo);
    if(!rs.length) continue;
    L.push("\n## "+repo+"  ("+rs.length+" Runs)\n");
    rs.sort((a,b)=>(a.date+a.run+a.file).localeCompare(b.date+b.run+b.file));
    for(const r of rs){
      const tag=r.in_window?" `WINDOW`":"";
      const q=r.quiet?" · QUIET":"";
      const sig=(r.signal_cats&&r.signal_cats.length)?" · sig: "+r.signal_cats.join(","):"";
      L.push("### "+r.date+" — "+trunc(r.topic||"(kein Topic)",110)+tag+q+sig);
      L.push("`"+r.source+"`");
      if(r.action)   L.push("- **Aktion:** "+trunc(r.action,400));
      if(r.blocker)  L.push("- **Blocker:** "+trunc(r.blocker,300));
      if(r.fix)      L.push("- **Fix:** "+trunc(r.fix,300));
      if(r.surprise) L.push("- **Surprise:** "+trunc(r.surprise,300));
      if(r.result)   L.push("- **Ergebnis:** "+trunc(r.result,220));
      if(r.next)     L.push("- **Next:** "+trunc(r.next,180));
      L.push("");
    }
  }
  fs.writeFileSync(path.join(out,"HARNESS_INDEX.md"),L.join("\n"));
}

function candidates(recs){
  return recs.filter(r=>r.in_window && !r.quiet &&
    ((r.signal_cats&&r.signal_cats.length)||r.blocker||r.fix||r.surprise));
}
function writeCandidates(recs,out,since){
  const cand=candidates(recs);
  const L=["# LEARNING CANDIDATES seit "+since,"",
    cand.length+" Kandidaten-Runs mit Blocker/Fix/Surprise oder Signal-Treffer. "+
    "Vorlage fuer Bank-Klassifikation (GOTCHA/FAILED/WORKED/METHOD).",""];
  cand.sort((a,b)=>(a.repo+a.date+a.run).localeCompare(b.repo+b.date+b.run));
  for(const r of cand){
    L.push("## ["+r.repo+"] "+r.date+" — "+trunc(r.topic,120));
    L.push("`"+r.source+"` · sig: "+((r.signal_cats||[]).join(",")||"-"));
    if(r.blocker)  L.push("- Blocker: "+trunc(r.blocker,500));
    if(r.fix)      L.push("- Fix: "+trunc(r.fix,500));
    if(r.surprise) L.push("- Surprise: "+trunc(r.surprise,500));
    L.push("");
  }
  fs.writeFileSync(path.join(out,"candidates_since_"+since+".md"),L.join("\n"));
  return cand;
}

function writeStats(recs,out,since,cand){
  const inWin=recs.filter(r=>r.in_window).length;
  const L=["# HARNESS STATS","",
    "- Runs total: "+recs.length,
    "- In window (>= "+since+"): "+inWin,
    "- Quiet/skeleton: "+recs.filter(r=>r.quiet).length,
    "- Substantive: "+recs.filter(r=>r.substantive).length,
    "- Candidates (window, signal/blocker): "+cand.length];
  for(const repo of REPOS){
    const rs=recs.filter(r=>r.repo===repo);
    L.push("  - "+repo+": "+rs.length+" total, "+rs.filter(r=>r.in_window).length+
      " window, "+rs.filter(r=>r.quiet).length+" quiet");
  }
  const sig={};
  for(const r of recs) for(const c of (r.signal_cats||[])) sig[c]=(sig[c]||0)+1;
  L.push("- Signal hits: "+Object.keys(sig).sort().map(k=>k+"="+sig[k]).join(", "));
  fs.writeFileSync(path.join(out,"STATS.md"),L.join("\n"));
  return L;
}

function arg(name,def){ const i=process.argv.indexOf(name); return i>=0?process.argv[i+1]:def; }

function main(){
  const src=arg("--src"), out=arg("--out"), since=arg("--since","2026-05-19");
  if(!src||!out){ console.error("need --src and --out"); process.exit(1); }
  fs.mkdirSync(out,{recursive:true});
  const recs=walk(src,since);
  if(process.argv.indexOf("--raw")<0) scrubAll(recs);
  writeJson(recs,out); writeCsv(recs,out); writeIndex(recs,out,since);
  const cand=writeCandidates(recs,out,since);
  const L=writeStats(recs,out,since,cand);
  let digest=L.join("\n")+"\n\n===CANDIDATE DIGEST===\n";
  for(const r of cand){
    digest+="\n* ["+r.repo+" "+r.date+"] "+trunc(r.topic,100)+
      "\n  src: "+r.source+" | sig: "+((r.signal_cats||[]).join(",")||"-")+"\n";
    if(r.blocker)  digest+="  B: "+trunc(r.blocker,260)+"\n";
    if(r.fix)      digest+="  F: "+trunc(r.fix,260)+"\n";
    if(r.surprise) digest+="  S: "+trunc(r.surprise,260)+"\n";
  }
  fs.writeFileSync(path.join(out,"_digest.txt"),digest);
  console.log("HARNESS OK: "+recs.length+" runs, "+cand.length+" candidates -> "+out);
}
main();
