/* Chrome Messenger — Dev server */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3007;
const MIME = {
  '.html':'text/html','.css':'text/css','.js':'application/javascript',
  '.json':'application/json','.svg':'image/svg+xml','.png':'image/png',
};

http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';
  if (url.endsWith('/')) url += 'index.html';
  let fp = path.join(__dirname, url);
  if (!path.extname(fp)) {
    try { if (fs.statSync(fp).isDirectory()) fp = path.join(fp, 'index.html'); } catch(e){}
  }
  const ext = path.extname(fp);
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Chrome Messenger -> http://localhost:${PORT}`));
