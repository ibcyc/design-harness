import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
const query=process.argv[2];
if(!query) { console.error('Usage: npm run design:research -- "community maker workshop event"'); process.exit(1); }
const script=resolve(import.meta.dirname,'../vendor/skills/ui-ux-pro-max/scripts/search.py');
for(const [command,prefix] of [['python',[]],['python3',[]],['py',['-3']]]) {
 const result=spawnSync(command,[...prefix,script,query,'--design-system','-f','markdown'],{stdio:'inherit',shell:false,env:{...process.env,PYTHONDONTWRITEBYTECODE:'1'}});
 if(result.error?.code==='ENOENT') continue;
 if(result.error) console.error(result.error.message);
 process.exit(result.status??1);
}
console.error('Install Python 3 to use the design database. The other design skills still work.');process.exit(1);
