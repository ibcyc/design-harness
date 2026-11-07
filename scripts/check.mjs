import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
let configName = 'harness.config.json', overrideUrl;
for (let i = 0; i < args.length; i++) {
  if (!['--config', '--url'].includes(args[i]) || !args[i+1] || args[i+1].startsWith('--')) throw new Error('Usage: npm run check -- [--config file.json] [--url http://localhost:3000]');
  if (args[i] === '--config') configName = args[++i]; else overrideUrl = args[++i];
}
const config = JSON.parse(await readFile(resolve(root, configName), 'utf8'));
const url = overrideUrl || config.url;
if (!['http:', 'https:'].includes(new URL(url).protocol)) throw new Error('Use an http(s) URL.');
if (!Array.isArray(config.viewports) || !config.viewports.length) throw new Error('Configure at least one viewport.');
const names = new Set();
for (const v of config.viewports) {
  if (!/^[a-z0-9-]+$/.test(v.name) || names.has(v.name) || !Number.isInteger(v.width) || !Number.isInteger(v.height) || v.width < 100 || v.height < 100) throw new Error('Viewport names must be unique safe filenames and dimensions must be integers >= 100.');
  names.add(v.name);
}
const runId = `${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}`;
const dir = resolve(root, 'reports', runId);
await mkdir(dir, { recursive:true });
const report = { runId, url, startedAt:new Date().toISOString(), config, visualReview:'pending', status:'running', results:[] };
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let browser;
try {
  browser = await chromium.launch({ headless:true });
  for (const viewport of config.viewports) {
    const context = await browser.newContext({ viewport:{ width:viewport.width, height:viewport.height }, reducedMotion:'reduce' });
    const page = await context.newPage();
    page.setDefaultTimeout(config.timeoutMs || 10000);
    page.setDefaultNavigationTimeout(config.timeoutMs || 10000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const result = { viewport, checks:[], screenshots:[], accessibility:[] };
    report.results.push(result);
    const check = async (name, fn) => {
      try { const detail = await fn(); result.checks.push({ name, pass:true, detail:detail ?? '' }); return true; }
      catch (error) { result.checks.push({ name, pass:false, detail:error.message }); return false; }
    };
    const screenshot = async suffix => {
      const name = `${viewport.name}${suffix}.png`;
      if (await check(`screenshot${suffix}`, () => page.screenshot({path:resolve(dir,name),fullPage:true,animations:'disabled'}).then(() => name))) result.screenshots.push(name);
    };
    const layout = async () => {
      const info = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        const scroll = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
        const offenders = [...document.querySelectorAll('body *')].filter(el => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > width + 1 || r.left < -1);
        }).slice(0, 8).map(el => ({tag:el.tagName,id:el.id,className:String(el.className)}));
        return {width,scroll,offenders};
      });
      if (info.scroll > info.width + 1) throw new Error(JSON.stringify(info));
      return info;
    };
    const axe = async stage => {
      await page.addScriptTag({ path:require.resolve('axe-core/axe.min.js') });
      const scan = await page.evaluate(async () => window.axe.run(document, { resultTypes:['violations','incomplete'] }));
      result.accessibility.push({stage, violations:scan.violations.map(v => ({id:v.id,impact:v.impact,description:v.description,helpUrl:v.helpUrl,nodes:v.nodes.map(n => ({target:n.target,failureSummary:n.failureSummary}))})), incomplete:scan.incomplete.map(v => ({id:v.id,impact:v.impact,helpUrl:v.helpUrl,targets:v.nodes.map(n=>n.target)}))});
      const blockers = scan.violations.filter(v => ['serious','critical'].includes(v.impact));
      if (blockers.length) throw new Error(blockers.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(',')).join('; ')}`).join('\n'));
      return `${scan.violations.length} violations total; no serious/critical blockers. Review incomplete results manually.`;
    };
    try {
      const loaded = await check('page-load', async () => {
        const response = await page.goto(url, { waitUntil:'load' });
        if (!response || !response.ok()) throw new Error(`HTTP ${response?.status() ?? 'no response'}`);
        await page.evaluate(() => document.fonts.ready);
        return `HTTP ${response.status()}`;
      });
      if (loaded) {
        for (const text of config.requiredText || []) await check(`text: ${text}`, () => page.getByText(text, {exact:false}).filter({visible:true}).first().waitFor({state:'visible'}));
        await screenshot('');
        await check('layout: initial', layout);
        await check('accessibility: initial', () => axe('initial'));
        for (const [flowIndex, flow] of (config.flows || []).entries()) {
          await check(`flow: ${flow.name}`, async () => {
            for (const step of flow.steps) {
              const locator = page.locator(step.selector);
              switch (step.action) {
                case 'fill': await locator.fill(step.value); break;
                case 'click': await locator.click(); break;
                case 'press': await locator.press(step.value); break;
                case 'expectVisible': await locator.waitFor({state:'visible'}); break;
                case 'expectFocused':
                  await page.waitForFunction(selector => document.activeElement === document.querySelector(selector), step.selector);
                  break;
                case 'expectText':
                  await locator.waitFor({state:'visible'});
                  await page.waitForFunction(({selector,value}) => document.querySelector(selector)?.textContent.includes(value), {selector:step.selector,value:step.value});
                  break;
                default: throw new Error(`Unknown action: ${step.action}`);
              }
            }
            return `${flow.steps.length} steps completed`;
          });
          await screenshot(`-flow-${flowIndex+1}`);
        }
        await screenshot('-after');
        await check('layout: after-flows', layout);
        await check('accessibility: after-flows', () => axe('after-flows'));
      }
      await check('javascript-errors', () => { if (errors.length) throw new Error(errors.join('\n')); return 'No pageerror events observed'; });
    } finally { await context.close(); }
  }
} catch (error) {
  report.fatalError = error.stack || error.message;
} finally {
  if (browser) await browser.close().catch(error => { report.fatalError ||= error.message; });
}
const failed = report.results.flatMap(r => r.checks.filter(c => !c.pass).map(c => `${r.viewport.name} / ${c.name}: ${c.detail}`));
report.status = report.fatalError || failed.length ? 'fail' : 'pass';
report.finishedAt = new Date().toISOString();
await writeFile(resolve(dir,'report.json'), JSON.stringify(report,null,2));
const summary = `# ${runId}\n\nURL: ${url}\n\nAutomated checks: **${report.status.toUpperCase()}**\n\nVisual review: **PENDING** — open screenshots and complete review.md.\n\n${report.fatalError || ''}\n${failed.length ? failed.map(f=>`- ${f}`).join('\n') : report.status === 'pass' ? 'All configured automatic checks passed.' : ''}\n`;
await writeFile(resolve(dir,'summary.md'),summary);
await writeFile(resolve(dir,'review.md'),`# Visual review — ${runId}\n\nReviewer: UNASSIGNED\nVerdict: PENDING\n\nOpen the actual before/after screenshots. Record pass/fail and concrete visible evidence for each criterion:\n\n| Criterion | Pass / fail / blocked | Visible evidence |\n|---|---|---|\n| Primary task and hierarchy | pending | |\n| Readability and contrast | pending | |\n| Spacing and alignment | pending | |\n| Brief-specific visual identity | pending | |\n| Mobile fit and usable controls | pending | |\n| Error/success state feedback | pending | |\n\nRemaining defects:\n\nFinal verdict: accepted / needs-work / blocked. Do not claim acceptance without inspecting the images.\n`);
await writeFile(resolve(dir,'report.html'),`<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Design Harness ${esc(runId)}</title><style>body{font:16px/1.6 system-ui;margin:32px auto;padding:0 24px;max-width:1100px;background:#f4f3ee;color:#172f29}h1{font-size:36px}img{max-width:100%;border:1px solid #bbb}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:white;padding:16px}section{margin:40px 0}a{color:#14533d}</style><h1>Design Harness · ${esc(report.status.toUpperCase())}</h1><p>Visual review: PENDING · ${esc(url)}</p><p><a href="report.json">完整 JSON</a> · <a href="review.md">視覺審查表</a> · <a href="summary.md">摘要</a></p><pre>${esc(summary)}</pre>${report.results.map(r=>`<section><h2>${esc(r.viewport.name)} · ${r.viewport.width} × ${r.viewport.height}</h2><ul>${r.checks.map(c=>`<li>${c.pass?'PASS':'FAIL'} ${esc(c.name)}<pre>${esc(typeof c.detail === 'string'?c.detail:JSON.stringify(c.detail))}</pre></li>`).join('')}</ul>${r.screenshots.map(s=>`<h3>${esc(s)}</h3><img alt="${esc(s)}" src="${esc(s)}">`).join('')}</section>`).join('')}</html>`);
console.log(`Automated checks: ${report.status.toUpperCase()} | Visual review: PENDING\nReports: ${dir}`);
if (failed.length) console.log(failed.join('\n'));
if (report.fatalError) console.error(report.fatalError);
process.exitCode = report.status === 'pass' ? 0 : 1;
