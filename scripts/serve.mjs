import { createServer } from 'node:http';
import { readFile, stat, readdir } from 'node:fs/promises';
import { resolve, relative, extname, sep } from 'node:path';
const root = resolve(import.meta.dirname, '..', process.argv[2] || 'demo');
const port = Number(process.argv[3] || 4173);
const escape = value => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const types = { '.html':'text/html; charset=utf-8', '.json':'application/json; charset=utf-8', '.md':'text/plain; charset=utf-8', '.png':'image/png', '.css':'text/css', '.js':'text/javascript', '.ttf':'font/ttf', '.svg':'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = resolve(root, `.${path}`);
    const rel = relative(root, file);
    if (rel === '..' || rel.startsWith(`..${sep}`) || resolve(root, rel) !== file) { res.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) {
      const entries = await readdir(file, { withFileTypes:true });
      if (entries.some(e => e.name === 'index.html')) file = resolve(file, 'index.html');
      else {
        const base = path.endsWith('/') ? path : `${path}/`;
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.end(`<html lang="zh-Hant"><meta charset="utf-8"><title>Design Harness reports</title><h1>Design Harness reports</h1><ul>${entries.map(e => `<li><a href="${escape(base + encodeURIComponent(e.name) + (e.isDirectory()?'/':''))}">${escape(e.name)}</a></li>`).join('')}</ul></html>`);
        return;
      }
    }
    res.writeHead(200, {'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store'});
    res.end(await readFile(file));
  } catch (error) { res.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Not available'); }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Design Harness: http://127.0.0.1:${port}/`));
