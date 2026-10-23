const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const APP_DIR = __dirname;
const DL_DIR = 'c:\\Users\\66666666666666666666\\Downloads';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const PDF_MAP = {
  '/pdfs/sgk10.pdf': path.join(DL_DIR, '10-sgk-cong-nghe-10-cong-nghe-trong-trot.pdf'),
  '/pdfs/sgk11.pdf': path.join(DL_DIR, '11-sgk-cong-nghe-11-cong-nghe-chan-nuoi.pdf'),
  '/pdfs/sgk12.pdf': path.join(DL_DIR, '12-sgk-cong-nghe-12-lam-nghiep-thuy-san.pdf')
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);

  if (PDF_MAP[urlPath] && fs.existsSync(PDF_MAP[urlPath])) {
    res.writeHead(200, { 'Content-Type': 'application/pdf' });
    fs.createReadStream(PDF_MAP[urlPath]).pipe(res);
    return;
  }

  let filePath = path.join(APP_DIR, urlPath === '/' ? 'index.html' : urlPath);
  if (!filePath.startsWith(APP_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
