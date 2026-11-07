import { readFile, mkdir, writeFile, readdir } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { createHash } from 'node:crypto';
const root = resolve(import.meta.dirname, '..');
const verifyOnly = process.argv.includes('--verify');
const hash = data => createHash('sha256').update(data).digest('hex');
const statePath = resolve(root,'.harness/installed.json');
let previous = {};
try { previous = JSON.parse(await readFile(statePath,'utf8')); } catch(error) { if(error.code !== 'ENOENT') throw error; }
const lock = JSON.parse(await readFile(resolve(root,'skills.lock.json'),'utf8'));
const walk = async dir => {
 const files=[];
 for(const entry of await readdir(dir,{withFileTypes:true})) {
  if(entry.name==='__pycache__' || entry.name.endsWith('.pyc')) continue;
  const path=resolve(dir,entry.name);
  if(entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${path}`);
  if(entry.isDirectory()) files.push(...await walk(path)); else files.push(path);
 }
 return files;
};
const tasks=[];
for(const agent of ['.claude','.agents']) {
 tasks.push({source:resolve(root,'skill/SKILL.md'),target:resolve(root,agent,'skills/design-harness/SKILL.md')});
 for(const skill of lock.skills) {
  if(!/^[a-z0-9-]+$/.test(skill.name)) throw new Error('Invalid skill name');
  const sourceRoot=resolve(root,'vendor/skills',skill.name);
  for(const source of await walk(sourceRoot)) {
   const key=relative(sourceRoot,source).replaceAll('\\','/');
   if(hash(await readFile(source))!==skill.files[key]) throw new Error(`Vendor integrity mismatch: ${skill.name}/${key}`);
   tasks.push({source,target:resolve(root,agent,'skills',skill.name,key)});
  }
  if(Object.keys(skill.files).length!==(await walk(sourceRoot)).length) throw new Error(`Vendor files missing: ${skill.name}`);
 }
}
for(const file of ['gsap.min.js','ScrollTrigger.min.js']) tasks.push({source:resolve(root,'node_modules/gsap/dist',file),target:resolve(root,'demo/assets/motion',file)});
tasks.push({source:resolve(root,'node_modules/gsap/README.md'),target:resolve(root,'demo/assets/motion/GSAP-README.md')});
const next={...previous};
for(const task of tasks) {
 task.bytes=await readFile(task.source);
 task.key=relative(root,task.target).replaceAll('\\','/');
 task.digest=hash(task.bytes);
 let existing;
 try { existing=await readFile(task.target); } catch(error) { if(error.code!=='ENOENT') throw error; }
 if(verifyOnly && (!existing || hash(existing)!==task.digest)) throw new Error(`Missing or different installed file: ${task.key}. Run npm run setup or merge changes.`);
 if(existing && hash(existing)!==task.digest && hash(existing)!==previous[task.key]) throw new Error(`Local edit detected: ${task.key}. Merge it before setup; no files were overwritten.`);
 next[task.key]=task.digest;
}
if(!verifyOnly) {
 for(const task of tasks) { await mkdir(dirname(task.target),{recursive:true}); await writeFile(task.target,task.bytes); }
 await mkdir(dirname(statePath),{recursive:true}); await writeFile(statePath,JSON.stringify(next,null,2)+'\n');
}
console.log(`${verifyOnly?'Verified':'Installed'} design-harness + ${lock.skills.map(s=>s.name).join(' + ')} for Claude and Codex (${tasks.length} managed files).`);
