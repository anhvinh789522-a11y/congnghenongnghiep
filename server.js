const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const APP_DIR = __dirname;
const SGK_BASE_DIR = 'D:\\01_DẠY HỌC\\001_TRƯỜNG\\SÁCH GIAO KHOA 12 NĂM';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc': 'application/msword',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const PDF_MAP = {
  '/pdfs/sgk10.pdf': path.join(SGK_BASE_DIR, 'PDF SGK Lớp 10 2026-2027', '10-sgk-cong-nghe-10-cong-nghe-trong-trot.pdf'),
  '/pdfs/sgk11.pdf': path.join(SGK_BASE_DIR, 'PDF SGK Lớp 11 2026-2027', '11-sgk-cong-nghe-11-cong-nghe-chan-nuoi.pdf'),
  '/pdfs/sgk12.pdf': path.join(SGK_BASE_DIR, 'PDF SGK Lớp 12 2026-2027', '12-sgk-cong-nghe-12-lam-nghiep-thuy-san.pdf')
};

const PPT_BASE_DIRS = {
  'cn10': 'D:\\01_DẠY HỌC\\001_TRƯỜNG\\DAY HOC\\POWERPOINT  3 KHỐI\\POWER POINT CNNN 10',
  'cn11': 'D:\\01_DẠY HỌC\\001_TRƯỜNG\\DAY HOC\\POWERPOINT  3 KHỐI\\POWER POINT CNNN 11',
  'cn12': 'D:\\01_DẠY HỌC\\001_TRƯỜNG\\DAY HOC\\POWERPOINT  3 KHỐI\\POWER POINT CNNN 12\\POWER POINT CNNN 12'
};

const EXAM_BASE_DIRS = {
  'cn10': path.join(APP_DIR, 'corpus', 'extracted_lessons', 'NN_10_ĐỀ THI', 'NN_10_ĐỀ THI'),
  'cn11': path.join(APP_DIR, 'corpus', 'extracted_lessons', 'CN11_NN_ĐỀ_THI_KNTT', 'CN11_NN_ĐỀ_THI_KNTT'),
  'cn12': path.join(APP_DIR, 'corpus', 'extracted_lessons', 'CN12_NN_ĐỀ_THI_KNTT', 'CN12_NN_ĐỀ_THI_KNTT')
};

const CHUYENDE_BASE_DIRS = {
  'cn10': 'D:\\01_DẠY HỌC\\001_TRƯỜNG\\GA CĐCNNN\\CĐ CNNN 10 KNTT',
  'cn11': 'D:\\01_DẠY HỌC\\001_TRƯỜNG\\GA CĐCNNN\\CĐ CNNN111 KNTT',
  'cn12': 'D:\\01_DẠY HỌC\\001_TRƯỜNG\\GA CĐCNNN\\CĐ CNNN 12 KNTT'
};

const MINISTRY_EXAM_DIR = 'D:\\01_DẠY HỌC\\001_TRƯỜNG\\DAY HOC\\ĐỀ ÔN THI TỐT NGHIỆP CNNN\\000 ĐỀ THI CHÍNH THỨC BỘ 2026';

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);

  if (PDF_MAP[urlPath] && fs.existsSync(PDF_MAP[urlPath])) {
    res.writeHead(200, { 'Content-Type': 'application/pdf' });
    fs.createReadStream(PDF_MAP[urlPath]).pipe(res);
    return;
  }

  // Phục vụ trực tiếp 77 file PowerPoint bài giảng (_GVG.pptx)
  const pptMatch = urlPath.match(/^\/ppts\/(cn10|cn11|cn12)\/(.+)$/);
  if (pptMatch && PPT_BASE_DIRS[pptMatch[1]]) {
    const targetPpt = path.join(PPT_BASE_DIRS[pptMatch[1]], path.basename(pptMatch[2]));
    if (fs.existsSync(targetPpt)) {
      res.writeHead(200, { 'Content-Type': MIME_TYPES['.pptx'] });
      fs.createReadStream(targetPpt).pipe(res);
      return;
    }
  }

  // Phục vụ trực tiếp 97 file Đề thi Học kì (.docx)
  const examMatch = urlPath.match(/^\/exams\/(cn10|cn11|cn12)\/(.+)$/);
  if (examMatch && EXAM_BASE_DIRS[examMatch[1]]) {
    const targetExam = path.join(EXAM_BASE_DIRS[examMatch[1]], path.basename(examMatch[2]));
    if (fs.existsSync(targetExam)) {
      res.writeHead(200, { 'Content-Type': MIME_TYPES['.docx'] });
      fs.createReadStream(targetExam).pipe(res);
      return;
    }
  }

  // Phục vụ trực tiếp 48 đề chính thức Bộ GD&ĐT (.pdf)
  const minMatch = urlPath.match(/^\/ministry_exams\/(.+)$/);
  if (minMatch) {
    const targetMin = path.join(MINISTRY_EXAM_DIR, path.basename(minMatch[1]));
    if (fs.existsSync(targetMin)) {
      res.writeHead(200, { 'Content-Type': 'application/pdf' });
      fs.createReadStream(targetMin).pipe(res);
      return;
    }
  }

  // Phục vụ trực tiếp 42 bài Chuyên đề học tập (.docx)
  const cdMatch = urlPath.match(/^\/chuyende\/(cn10|cn11|cn12)\/(.+)$/);
  if (cdMatch && CHUYENDE_BASE_DIRS[cdMatch[1]]) {
    const targetCd = path.join(CHUYENDE_BASE_DIRS[cdMatch[1]], path.basename(cdMatch[2]));
    if (fs.existsSync(targetCd)) {
      res.writeHead(200, { 'Content-Type': MIME_TYPES['.docx'] });
      fs.createReadStream(targetCd).pipe(res);
      return;
    }
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
