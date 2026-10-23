const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function extractZipEntries(zipBuf) {
  let eocd = zipBuf.length - 22;
  while (eocd >= 0 && zipBuf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  const count = zipBuf.readUInt16LE(eocd + 10);
  let cd = bufOffset = zipBuf.readUInt32LE(eocd + 16);
  const entries = {};
  for (let i = 0; i < count; i++) {
    const method = zipBuf.readUInt16LE(cd + 10);
    const compSize = zipBuf.readUInt32LE(cd + 20);
    const nLen = zipBuf.readUInt16LE(cd + 28);
    const eLen = zipBuf.readUInt16LE(cd + 30);
    const cLen = zipBuf.readUInt16LE(cd + 32);
    const localOff = zipBuf.readUInt32LE(cd + 42);
    const name = zipBuf.slice(cd + 46, cd + 46 + nLen).toString('utf8');
    const lNameLen = zipBuf.readUInt16LE(localOff + 26);
    const lExtraLen = zipBuf.readUInt16LE(localOff + 28);
    const dataStart = localOff + 30 + lNameLen + lExtraLen;
    const raw = zipBuf.slice(dataStart, dataStart + compSize);
    if (compSize > 0) {
      entries[name] = method === 8 ? zlib.inflateRawSync(raw) : raw;
    }
    cd += 46 + nLen + eLen + cLen;
  }
  return entries;
}

// Also preserve table rows (<w:tr>) with tab/pipe separators so tables are super clear!
function docxBufToText(buf) {
  const entries = extractZipEntries(buf);
  const xml = entries['word/document.xml'].toString('utf8');
  const lines = [];

  // Parse paragraphs and table rows in document order
  const blockRegex = /<w:tr\b[^>]*>([\s\S]*?)<\/w:tr>|<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
  let m;
  while ((m = blockRegex.exec(xml)) !== null) {
    if (m[1] !== undefined) {
      // Table row
      const trXml = m[1];
      const cells = [];
      const tcRegex = /<w:tc\b[^>]*>([\s\S]*?)<\/w:tc>/g;
      let tcMatch;
      while ((tcMatch = tcRegex.exec(trXml)) !== null) {
        const tcXml = tcMatch[1];
        const cellParas = [];
        const pRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
        let pm;
        while ((pm = pRegex.exec(tcXml)) !== null) {
          const tRegex = /<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g;
          let tm, pText = '';
          while ((tm = tRegex.exec(pm[1])) !== null) pText += tm[1];
          pText = pText.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
          if (pText) cellParas.push(pText);
        }
        cells.push(cellParas.join(' ; '));
      }
      if (cells.some(c => c.length > 0)) {
        lines.push('| ' + cells.join(' | ') + ' |');
      }
    } else if (m[2] !== undefined) {
      const pXml = m[2];
      const tRegex = /<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g;
      let tm, line = '';
      while ((tm = tRegex.exec(pXml)) !== null) line += tm[1];
      line = line.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
      if (line) lines.push(line);
    }
  }
  return lines;
}

const outDir = 'C:\\Users\\66666666666666666666\\.gemini\\antigravity\\scratch\\cong-nghe-nong-nghiep-cv7991\\corpus';
fs.mkdirSync(outDir, { recursive: true });
const dl = 'c:\\Users\\66666666666666666666\\Downloads';

// 1. Extract SGV Word files with table support
const sgvDir = path.join(dl, 'SÁCH GV-WORD-CNNN');
for (const f of fs.readdirSync(sgvDir)) {
  if (f.endsWith('.docx') && !f.startsWith('~$')) {
    const lines = docxBufToText(fs.readFileSync(path.join(sgvDir, f)));
    const base = path.basename(f, '.docx');
    fs.writeFileSync(path.join(outDir, base + '.txt'), lines.join('\n'), 'utf8');
    console.log('SGV extracted:', base, '->', lines.length, 'lines');
  }
}

// 2. Extract PPCT zip
const ppctZipPath = path.join(dl, '2026 2027 phân phối gửi chi xuân-20261023T081333Z-1-001.zip');
if (fs.existsSync(ppctZipPath)) {
  const ppctZip = extractZipEntries(fs.readFileSync(ppctZipPath));
  for (const [name, buf] of Object.entries(ppctZip)) {
    if (name.endsWith('.docx')) {
      const base = path.basename(name, '.docx');
      const lines = docxBufToText(buf);
      fs.writeFileSync(path.join(outDir, base + '.txt'), lines.join('\n'), 'utf8');
      console.log('PPCT extracted:', base, '->', lines.length, 'lines');
    }
  }
}

// 3. Extract DỀ VÀ MA TRẬN TẬP HUÂN
const tapHuanDir = path.join(dl, 'DỀ VÀ MA TRẬN TẬP HUÂN');
if (fs.existsSync(tapHuanDir)) {
  for (const f of fs.readdirSync(tapHuanDir)) {
    if (f.endsWith('.docx') && !f.startsWith('~$')) {
      const lines = docxBufToText(fs.readFileSync(path.join(tapHuanDir, f)));
      const base = path.basename(f, '.docx');
      fs.writeFileSync(path.join(outDir, base + '.txt'), lines.join('\n'), 'utf8');
      console.log('TapHuan extracted:', base, '->', lines.length, 'lines');
    }
  }
}
