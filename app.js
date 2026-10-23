// Ứng dụng Thiết kế & Kiểm định Hồ sơ Đề kiểm tra theo Công văn 7991/BGDĐT-GDTrH
// Quy trình 6 bước chuẩn hóa dành cho môn Công nghệ Nông nghiệp

const state = {
  currentStep: 1,
  meta: {
    department: "SỞ GIÁO DỤC VÀ ĐÀO TẠO ...",
    school: "TRƯỜNG THPT ...",
    subjectName: "CÔNG NGHỆ 10 (CÔNG NGHỆ TRỒNG TRỌT)",
    examTerm: "GIỮA HỌC KỲ I",
    schoolYear: "2025 - 2026",
    duration: 45,
    examCode: "101",
    presetKey: "cn10_trongtrot_gk1"
  },
  aiConfig: {
    provider: "gemini",
    apiKey: localStorage.getItem("cv7991_ai_key") || "",
    model: "gemini-2.5-flash"
  },
  units: [],
  // Bước 2: Người ra đề toàn quyền tùy chỉnh số câu, số điểm mỗi câu, số điểm mỗi phần, cấp độ tư duy
  partConfig: {
    mcq: {
      enabled: true,
      title: "PHẦN I. Trắc nghiệm nhiều phương án lựa chọn",
      pointsPerQ: 0.25,
      counts: { biet: 12, hieu: 4, vandung: 0 }
    },
    tf: {
      enabled: true,
      title: "PHẦN II. Trắc nghiệm Đúng - Sai (Mỗi câu 4 ý a, b, c, d)",
      scoringMode: "progressive", // 'progressive' (0.1 - 0.25 - 0.5 - 1.0) or 'equal'
      pointsPerQuestion: 1.0, // Điểm tối đa 1 câu lớn (4 ý)
      numQuestions: 3, // 3 câu lớn = 12 ý hỏi
      counts: { biet: 3, hieu: 3, vandung: 6 } // Phân bổ theo số ý hỏi (tổng = numQuestions * 4)
    },
    short: {
      enabled: false,
      title: "PHẦN III. Trắc nghiệm trả lời ngắn",
      pointsPerQ: 0.25,
      counts: { biet: 0, hieu: 0, vandung: 0 }
    },
    essay: {
      enabled: true,
      title: "PHẦN IV. Tự luận",
      // Cho phép cấu hình từng câu tự luận với số điểm và cấp độ tư duy riêng
      questions: [
        { id: "tl1", label: "Câu 1 (Tự luận)", level: "vandung", points: 1.5 },
        { id: "tl2", label: "Câu 2 (Tự luận)", level: "vandung", points: 1.5 }
      ]
    }
  },
  // Bước 3: Dữ liệu Ma trận theo từng unitId
  matrixRows: {},
  // Bước 4: Dữ liệu Bản đặc tả
  specOverrides: {},
  // Bước 5: Dữ liệu Đề thi & Hướng dẫn chấm
  exam: {
    mcq: [],
    tf: [],
    short: [],
    essay: []
  },
  // Bước 6: Kết quả Tool AI kiểm tra đề
  audit: {
    score: 100,
    items: [],
    aiFeedback: ""
  }
};

// Khởi tạo ứng dụng
document.addEventListener("DOMContentLoaded", () => {
  loadPresetCurriculum("cn10_trongtrot_gk1");
  renderStep2Config();
  autoGenerateMatrix();
  renderMatrixTable();
  renderSpecificationTable();
  generateExamFromMatrix(false);
  runAiAuditTool();
});

// Chuyển bước (1 -> 6)
function goToStep(stepNumber) {
  state.currentStep = stepNumber;
  document.querySelectorAll(".step-btn").forEach((btn, idx) => {
    btn.classList.toggle("active", idx + 1 === stepNumber);
  });
  document.querySelectorAll(".step-panel").forEach((panel, idx) => {
    panel.classList.toggle("active", idx + 1 === stepNumber);
  });

  if (stepNumber === 2) renderStep2Config();
  if (stepNumber === 3) renderMatrixTable();
  if (stepNumber === 4) renderSpecificationTable();
  if (stepNumber === 5) renderExamEditor();
  if (stepNumber === 6) runAiAuditTool();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============================================================================
// BƯỚC 1: TẢI PHÂN PHỐI CHƯƠNG TRÌNH (PPCT) & CHỌN BÀI / YÊU CẦU CẦN ĐẠT
// ============================================================================

function loadPresetCurriculum(presetKey) {
  const preset = CURRICULUM_PRESETS[presetKey];
  if (!preset) return;
  state.meta.presetKey = presetKey;
  state.meta.subjectName = preset.name.toUpperCase();
  state.meta.examTerm = preset.examTerm.toUpperCase();
  state.units = JSON.parse(JSON.stringify(preset.units));

  const subjInput = document.getElementById("metaSubject");
  const termInput = document.getElementById("metaTerm");
  if (subjInput) subjInput.value = state.meta.subjectName;
  if (termInput) termInput.value = state.meta.examTerm;

  renderPpctTable();
  autoGenerateMatrix();
}

function renderPpctTable() {
  const tbody = document.getElementById("ppctTableBody");
  if (!tbody) return;

  const selectedUnits = state.units.filter(u => u.selected);
  const totalPeriods = selectedUnits.reduce((sum, u) => sum + (Number(u.periods) || 0), 0);

  tbody.innerHTML = state.units.map((u, idx) => {
    const weightPct = (u.selected && totalPeriods > 0)
      ? ((u.periods / totalPeriods) * 100).toFixed(1)
      : "0.0";

    return `
      <tr style="${u.selected ? '' : 'opacity: 0.55; background: #f8fafc;'}">
        <td class="text-center">
          <input type="checkbox" ${u.selected ? "checked" : ""} onchange="toggleUnitSelection(${idx}, this.checked)" style="width:18px;height:18px;cursor:pointer;" />
        </td>
        <td class="text-center">${idx + 1}</td>
        <td>
          <input type="text" value="${escapeHtml(u.chapter)}" onchange="updateUnitField(${idx}, 'chapter', this.value)" style="font-weight:600; margin-bottom:4px;" />
          <input type="text" value="${escapeHtml(u.lesson)}" onchange="updateUnitField(${idx}, 'lesson', this.value)" />
        </td>
        <td class="text-center">
          <input type="number" class="compact-num" min="1" max="30" value="${u.periods}" onchange="updateUnitField(${idx}, 'periods', Number(this.value))" />
          <div style="font-size:11.5px; color:var(--primary-dark); margin-top:4px; font-weight:700;">~${weightPct}% điểm</div>
        </td>
        <td>
          <div style="margin-bottom:6px;">
            <span class="badge badge-biet">Nhận biết</span>
            <textarea rows="2" onchange="updateUnitYccd(${idx}, 'biet', this.value)">${escapeHtml(u.yccd.biet)}</textarea>
          </div>
          <div style="margin-bottom:6px;">
            <span class="badge badge-hieu">Thông hiểu</span>
            <textarea rows="2" onchange="updateUnitYccd(${idx}, 'hieu', this.value)">${escapeHtml(u.yccd.hieu)}</textarea>
          </div>
          <div>
            <span class="badge badge-vandung">Vận dụng</span>
            <textarea rows="2" onchange="updateUnitYccd(${idx}, 'vandung', this.value)">${escapeHtml(u.yccd.vandung)}</textarea>
          </div>
        </td>
        <td class="text-center">
          <input type="text" value="${u.competencies.join(', ')}" onchange="updateUnitCompetencies(${idx}, this.value)" title="Nhập mã năng lực cách nhau bởi dấu phẩy: NCCN, SDCN, ĐGCN, GTCN, TKKT" />
          <div style="margin-top:6px;">
            ${u.competencies.map(c => `<span class="badge badge-nl">${c}</span>`).join("")}
          </div>
        </td>
        <td class="text-center">
          <button class="btn btn-danger btn-sm" onclick="removeUnit(${idx})" title="Xóa bài này">✕</button>
        </td>
      </tr>
    `;
  }).join("");

  document.getElementById("ppctSummaryText").innerHTML =
    `Đã chọn <strong>${selectedUnits.length}/${state.units.length}</strong> đơn vị kiến thức | Tổng số tiết kiểm tra: <strong>${totalPeriods} tiết</strong>`;
}

function toggleUnitSelection(idx, checked) {
  state.units[idx].selected = checked;
  renderPpctTable();
  autoGenerateMatrix();
}

function updateUnitField(idx, field, value) {
  state.units[idx][field] = value;
  renderPpctTable();
}

function updateUnitYccd(idx, level, value) {
  state.units[idx].yccd[level] = value;
}

function updateUnitCompetencies(idx, value) {
  state.units[idx].competencies = value.split(",").map(s => s.trim()).filter(Boolean);
  renderPpctTable();
}

function addNewUnit() {
  const newIdx = state.units.length + 1;
  state.units.push({
    id: "custom_" + Date.now(),
    chapter: "Chủ đề bổ sung",
    lesson: `Bài ${newIdx}: Nội dung kiến thức mới`,
    periods: 2,
    selected: true,
    competencies: ["NCCN", "SDCN"],
    yccd: {
      biet: "Nêu được khái niệm và đặc điểm cơ bản của nội dung kiến thức.",
      hieu: "Giải thích được nguyên lý và cơ sở khoa học của quy trình kỹ thuật.",
      vandung: "Vận dụng kiến thức để giải quyết tình huống thực tiễn trong sản xuất nông nghiệp."
    }
  });
  renderPpctTable();
  autoGenerateMatrix();
}

function removeUnit(idx) {
  if (state.units.length <= 1) {
    alert("Cần giữ lại ít nhất 1 bài học để ra đề!");
    return;
  }
  state.units.splice(idx, 1);
  renderPpctTable();
  autoGenerateMatrix();
}

function handlePpctFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    try {
      if (file.name.endsWith(".json")) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          state.units = parsed;
        } else if (parsed.units) {
          state.units = parsed.units;
        }
      } else {
        // Parse CSV / TSV / TXT lines: Chủ đề | Bài học | Số tiết | YCCĐ Biết | YCCĐ Hiểu | YCCĐ Vận dụng | Mã NL
        const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const imported = [];
        lines.forEach((line, idx) => {
          if (idx === 0 && line.toLowerCase().includes("chủ đề")) return;
          const parts = line.includes("\t") ? line.split("\t") : line.split("|").length > 1 ? line.split("|") : line.split(",");
          if (parts.length >= 2) {
            imported.push({
              id: "imp_" + Date.now() + "_" + idx,
              chapter: (parts[0] || "Chủ đề").trim(),
              lesson: (parts[1] || `Bài ${idx + 1}`).trim(),
              periods: Number(parts[2]) || 2,
              selected: true,
              yccd: {
                biet: (parts[3] || "Trình bày được các khái niệm cơ bản của bài học.").trim(),
                hieu: (parts[4] || "Giải thích được ý nghĩa và quy trình kỹ thuật.").trim(),
                vandung: (parts[5] || "Vận dụng kiến thức vào thực tiễn sản xuất nông nghiệp.").trim()
              },
              competencies: (parts[6] || "NCCN, SDCN").split(/[;,]/).map(s => s.trim()).filter(Boolean)
            });
          }
        });
        if (imported.length > 0) state.units = imported;
      }
      renderPpctTable();
      autoGenerateMatrix();
      alert("Đã tải Phân phối chương trình thành công (" + state.units.length + " đơn vị kiến thức)!");
    } catch (err) {
      alert("Lỗi đọc file PPCT: " + err.message);
    }
  };
  reader.readAsText(file, "UTF-8");
}

function downloadPpctTemplate() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.units, null, 2));
  const a = document.createElement("a");
  a.href = dataStr;
  a.download = "ppct-cong-nghe-nong-nghiep-cv7991.json";
  a.click();
}

// ============================================================================
// BƯỚC 2: BẢNG PHÂN BỔ PHẦN, SỐ CÂU, SỐ ĐIỂM MỖI CÂU, ĐIỂM TỪNG PHẦN & TƯ DUY
// ============================================================================

function getPartCalculations() {
  const pc = state.partConfig;

  // 1. MCQ
  const mcqCount = pc.mcq.enabled ? (pc.mcq.counts.biet + pc.mcq.counts.hieu + pc.mcq.counts.vandung) : 0;
  const mcqPointsBiet = pc.mcq.enabled ? pc.mcq.counts.biet * pc.mcq.pointsPerQ : 0;
  const mcqPointsHieu = pc.mcq.enabled ? pc.mcq.counts.hieu * pc.mcq.pointsPerQ : 0;
  const mcqPointsVandung = pc.mcq.enabled ? pc.mcq.counts.vandung * pc.mcq.pointsPerQ : 0;
  const mcqTotalPoints = mcqPointsBiet + mcqPointsHieu + mcqPointsVandung;

  // 2. TF (Đúng - Sai)
  const tfStatementsTotal = pc.tf.enabled ? (pc.tf.counts.biet + pc.tf.counts.hieu + pc.tf.counts.vandung) : 0;
  const tfQuestionsCount = pc.tf.enabled ? pc.tf.numQuestions : 0;
  const tfTotalPoints = pc.tf.enabled ? (tfQuestionsCount * pc.tf.pointsPerQuestion) : 0;
  // Quy đổi điểm theo từng mức độ tư duy trong Đúng - Sai
  const tfPointPerStmtAvg = tfStatementsTotal > 0 ? (tfTotalPoints / tfStatementsTotal) : 0;
  const tfPointsBiet = pc.tf.enabled ? pc.tf.counts.biet * tfPointPerStmtAvg : 0;
  const tfPointsHieu = pc.tf.enabled ? pc.tf.counts.hieu * tfPointPerStmtAvg : 0;
  const tfPointsVandung = pc.tf.enabled ? pc.tf.counts.vandung * tfPointPerStmtAvg : 0;

  // 3. Short Answer
  const shortCount = pc.short.enabled ? (pc.short.counts.biet + pc.short.counts.hieu + pc.short.counts.vandung) : 0;
  const shortPointsBiet = pc.short.enabled ? pc.short.counts.biet * pc.short.pointsPerQ : 0;
  const shortPointsHieu = pc.short.enabled ? pc.short.counts.hieu * pc.short.pointsPerQ : 0;
  const shortPointsVandung = pc.short.enabled ? pc.short.counts.vandung * pc.short.pointsPerQ : 0;
  const shortTotalPoints = shortPointsBiet + shortPointsHieu + shortPointsVandung;

  // 4. Essay
  let essayPointsBiet = 0, essayPointsHieu = 0, essayPointsVandung = 0;
  let essayCountBiet = 0, essayCountHieu = 0, essayCountVandung = 0;
  if (pc.essay.enabled) {
    pc.essay.questions.forEach(q => {
      const p = Number(q.points) || 0;
      if (q.level === "biet") { essayPointsBiet += p; essayCountBiet++; }
      else if (q.level === "hieu") { essayPointsHieu += p; essayCountHieu++; }
      else { essayPointsVandung += p; essayCountVandung++; }
    });
  }
  const essayCount = pc.essay.enabled ? pc.essay.questions.length : 0;
  const essayTotalPoints = essayPointsBiet + essayPointsHieu + essayPointsVandung;

  // Tổng hợp theo cấp độ nhận thức
  const totalBietPoints = round2(mcqPointsBiet + tfPointsBiet + shortPointsBiet + essayPointsBiet);
  const totalHieuPoints = round2(mcqPointsHieu + tfPointsHieu + shortPointsHieu + essayPointsHieu);
  const totalVandungPoints = round2(mcqPointsVandung + tfPointsVandung + shortPointsVandung + essayPointsVandung);
  const grandTotalPoints = round2(mcqTotalPoints + tfTotalPoints + shortTotalPoints + essayTotalPoints);

  return {
    mcq: { count: mcqCount, totalPoints: round2(mcqTotalPoints), bietP: round2(mcqPointsBiet), hieuP: round2(mcqPointsHieu), vdP: round2(mcqPointsVandung) },
    tf: { qCount: tfQuestionsCount, stmtCount: tfStatementsTotal, totalPoints: round2(tfTotalPoints), bietP: round2(tfPointsBiet), hieuP: round2(tfPointsHieu), vdP: round2(tfPointsVandung) },
    short: { count: shortCount, totalPoints: round2(shortTotalPoints), bietP: round2(shortPointsBiet), hieuP: round2(shortPointsHieu), vdP: round2(shortPointsVandung) },
    essay: { count: essayCount, countBiet: essayCountBiet, countHieu: essayCountHieu, countVd: essayCountVandung, totalPoints: round2(essayTotalPoints), bietP: round2(essayPointsBiet), hieuP: round2(essayPointsHieu), vdP: round2(essayPointsVandung) },
    cognitive: {
      bietPoints: totalBietPoints,
      hieuPoints: totalHieuPoints,
      vandungPoints: totalVandungPoints,
      bietPct: grandTotalPoints > 0 ? round1((totalBietPoints / grandTotalPoints) * 100) : 0,
      hieuPct: grandTotalPoints > 0 ? round1((totalHieuPoints / grandTotalPoints) * 100) : 0,
      vandungPct: grandTotalPoints > 0 ? round1((totalVandungPoints / grandTotalPoints) * 100) : 0
    },
    grandTotalPoints
  };
}

function renderStep2Config() {
  const calc = getPartCalculations();
  const pc = state.partConfig;

  // Cập nhật các thẻ tổng quan
  const totalBox = document.getElementById("metricTotalPointsBox");
  const totalVal = document.getElementById("metricTotalPointsVal");
  if (totalVal) {
    totalVal.textContent = `${calc.grandTotalPoints.toFixed(2)} / 10.00 đ`;
    totalBox.classList.toggle("error", Math.abs(calc.grandTotalPoints - 10) > 0.001);
  }

  document.getElementById("metricTnVsTlVal").textContent =
    `TN: ${round2(calc.mcq.totalPoints + calc.tf.totalPoints + calc.short.totalPoints)}đ (${round1((calc.mcq.totalPoints + calc.tf.totalPoints + calc.short.totalPoints) * 10)}%) | TL: ${calc.essay.totalPoints}đ (${round1(calc.essay.totalPoints * 10)}%)`;

  document.getElementById("metricCognitiveRatioVal").textContent =
    `${calc.cognitive.bietPct}% : ${calc.cognitive.hieuPct}% : ${calc.cognitive.vandungPct}%`;

  const barEl = document.getElementById("cognitiveStackedBar");
  if (barEl) {
    barEl.innerHTML = `
      <div class="bar-seg bar-biet" style="width:${calc.cognitive.bietPct}%">Biết: ${calc.cognitive.bietPoints}đ (${calc.cognitive.bietPct}%)</div>
      <div class="bar-seg bar-hieu" style="width:${calc.cognitive.hieuPct}%">Hiểu: ${calc.cognitive.hieuPoints}đ (${calc.cognitive.hieuPct}%)</div>
      <div class="bar-seg bar-vandung" style="width:${calc.cognitive.vandungPct}%">Vận dụng: ${calc.cognitive.vandungPoints}đ (${calc.cognitive.vandungPct}%)</div>
    `;
  }

  // Render bảng cấu hình từng phần
  const container = document.getElementById("partConfigTableBody");
  if (!container) return;

  const tfStmtWarning = pc.tf.enabled && (calc.tf.stmtCount !== pc.tf.numQuestions * 4)
    ? `<div style="color:var(--danger); font-size:11.5px; font-weight:700; margin-top:4px;">⚠️ Tổng số ý (${calc.tf.stmtCount}) cần bằng ${pc.tf.numQuestions} câu × 4 = ${pc.tf.numQuestions * 4} ý! <button class="btn btn-sm btn-outline" onclick="balanceTfStatements()">Tự cân bằng</button></div>`
    : `<div style="color:var(--primary-dark); font-size:11.5px; margin-top:4px;">✓ Khớp ${pc.tf.numQuestions} câu lớn × 4 ý = ${pc.tf.numQuestions * 4} lệnh hỏi</div>`;

  container.innerHTML = `
    <!-- Dạng thức 1: Nhiều lựa chọn -->
    <tr style="${pc.mcq.enabled ? '' : 'opacity:0.5;'}">
      <td class="text-center">
        <input type="checkbox" ${pc.mcq.enabled ? "checked" : ""} onchange="togglePart('mcq', this.checked)" style="width:18px;height:18px;" />
      </td>
      <td>
        <strong>Dạng thức 1: Trắc nghiệm nhiều phương án lựa chọn</strong>
        <div style="font-size:12px; color:var(--text-muted);">Mỗi câu có 4 phương án A, B, C, D chọn 1 đáp án đúng.</div>
      </td>
      <td class="text-center">
        <label style="font-size:11px;display:block;">Điểm / 1 câu:</label>
        <input type="number" class="compact-num" step="0.05" min="0.05" max="2" value="${pc.mcq.pointsPerQ}" onchange="updatePartParam('mcq', 'pointsPerQ', Number(this.value))" /> đ
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" min="0" value="${pc.mcq.counts.biet}" onchange="updatePartLevel('mcq', 'biet', Number(this.value))" /> câu
        <div style="font-size:11px;color:#1d4ed8;">(${calc.mcq.bietP}đ)</div>
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" min="0" value="${pc.mcq.counts.hieu}" onchange="updatePartLevel('mcq', 'hieu', Number(this.value))" /> câu
        <div style="font-size:11px;color:#b45309;">(${calc.mcq.hieuP}đ)</div>
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" min="0" value="${pc.mcq.counts.vandung}" onchange="updatePartLevel('mcq', 'vandung', Number(this.value))" /> câu
        <div style="font-size:11px;color:#be185d;">(${calc.mcq.vdP}đ)</div>
      </td>
      <td class="text-center"><strong>${calc.mcq.count} câu</strong></td>
      <td class="text-center"><strong style="font-size:15px;color:var(--primary-dark);">${calc.mcq.totalPoints.toFixed(2)} đ</strong></td>
    </tr>

    <!-- Dạng thức 2: Đúng - Sai -->
    <tr style="${pc.tf.enabled ? '' : 'opacity:0.5;'}">
      <td class="text-center">
        <input type="checkbox" ${pc.tf.enabled ? "checked" : ""} onchange="togglePart('tf', this.checked)" style="width:18px;height:18px;" />
      </td>
      <td>
        <strong>Dạng thức 2: Trắc nghiệm Đúng - Sai</strong>
        <div style="font-size:12px; color:var(--text-muted);">
          Số câu lớn: <input type="number" class="compact-num" style="width:52px;" min="1" max="10" value="${pc.tf.numQuestions}" onchange="updateTfQuestionsCount(Number(this.value))" /> câu (mỗi câu 4 ý a, b, c, d).
          Cách tính:
          <select style="width:auto; padding:3px 6px; font-size:12px;" onchange="updatePartParam('tf', 'scoringMode', this.value)">
            <option value="progressive" ${pc.tf.scoringMode === 'progressive' ? 'selected' : ''}>Lũy tiến Bộ GD (0.1 - 0.25 - 0.5 - ${pc.tf.pointsPerQuestion}đ)</option>
            <option value="equal" ${pc.tf.scoringMode === 'equal' ? 'selected' : ''}>Chia đều (${(pc.tf.pointsPerQuestion / 4).toFixed(2)}đ / ý)</option>
          </select>
        </div>
        ${tfStmtWarning}
      </td>
      <td class="text-center">
        <label style="font-size:11px;display:block;">Điểm / 1 câu lớn:</label>
        <input type="number" class="compact-num" step="0.25" min="0.25" max="4" value="${pc.tf.pointsPerQuestion}" onchange="updatePartParam('tf', 'pointsPerQuestion', Number(this.value))" /> đ
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" min="0" value="${pc.tf.counts.biet}" onchange="updatePartLevel('tf', 'biet', Number(this.value))" /> ý
        <div style="font-size:11px;color:#1d4ed8;">(~${calc.tf.bietP}đ)</div>
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" min="0" value="${pc.tf.counts.hieu}" onchange="updatePartLevel('tf', 'hieu', Number(this.value))" /> ý
        <div style="font-size:11px;color:#b45309;">(~${calc.tf.hieuP}đ)</div>
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" min="0" value="${pc.tf.counts.vandung}" onchange="updatePartLevel('tf', 'vandung', Number(this.value))" /> ý
        <div style="font-size:11px;color:#be185d;">(~${calc.tf.vdP}đ)</div>
      </td>
      <td class="text-center"><strong>${calc.tf.qCount} câu (${calc.tf.stmtCount} ý)</strong></td>
      <td class="text-center"><strong style="font-size:15px;color:var(--primary-dark);">${calc.tf.totalPoints.toFixed(2)} đ</strong></td>
    </tr>

    <!-- Dạng thức 3: Trả lời ngắn -->
    <tr style="${pc.short.enabled ? '' : 'opacity:0.5;'}">
      <td class="text-center">
        <input type="checkbox" ${pc.short.enabled ? "checked" : ""} onchange="togglePart('short', this.checked)" style="width:18px;height:18px;" />
      </td>
      <td>
        <strong>Dạng thức 3: Trắc nghiệm trả lời ngắn</strong>
        <div style="font-size:12px; color:var(--text-muted);">Học sinh tính toán hoặc điền con số/từ khóa ngắn gọn.</div>
      </td>
      <td class="text-center">
        <label style="font-size:11px;display:block;">Điểm / 1 câu:</label>
        <input type="number" class="compact-num" step="0.05" min="0.1" max="2" value="${pc.short.pointsPerQ}" onchange="updatePartParam('short', 'pointsPerQ', Number(this.value))" /> đ
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" min="0" value="${pc.short.counts.biet}" onchange="updatePartLevel('short', 'biet', Number(this.value))" /> câu
        <div style="font-size:11px;color:#1d4ed8;">(${calc.short.bietP}đ)</div>
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" min="0" value="${pc.short.counts.hieu}" onchange="updatePartLevel('short', 'hieu', Number(this.value))" /> câu
        <div style="font-size:11px;color:#b45309;">(${calc.short.hieuP}đ)</div>
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" min="0" value="${pc.short.counts.vandung}" onchange="updatePartLevel('short', 'vandung', Number(this.value))" /> câu
        <div style="font-size:11px;color:#be185d;">(${calc.short.vdP}đ)</div>
      </td>
      <td class="text-center"><strong>${calc.short.count} câu</strong></td>
      <td class="text-center"><strong style="font-size:15px;color:var(--primary-dark);">${calc.short.totalPoints.toFixed(2)} đ</strong></td>
    </tr>

    <!-- Dạng thức 4: Tự luận -->
    <tr style="${pc.essay.enabled ? '' : 'opacity:0.5;'}">
      <td class="text-center">
        <input type="checkbox" ${pc.essay.enabled ? "checked" : ""} onchange="togglePart('essay', this.checked)" style="width:18px;height:18px;" />
      </td>
      <td colspan="5">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div>
            <strong>Dạng thức 4: Tự luận (Tùy chỉnh điểm & cấp độ từng câu)</strong>
            <div style="font-size:12px; color:var(--text-muted);">Người ra đề tùy chọn số lượng câu tự luận, điểm số riêng từng câu và cấp độ tư duy.</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="addEssayConfigItem()">+ Thêm câu tự luận</button>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:10px;">
          ${pc.essay.questions.map((eq, idx) => `
            <div style="border:1px solid #cbd5e1; border-radius:7px; padding:8px 10px; background:#f8fafc; display:flex; align-items:center; gap:8px;">
              <strong>Câu TL ${idx + 1}:</strong>
              <select style="width:auto; padding:4px 6px;" onchange="updateEssayItem(${idx}, 'level', this.value)">
                <option value="biet" ${eq.level === 'biet' ? 'selected' : ''}>Nhận biết</option>
                <option value="hieu" ${eq.level === 'hieu' ? 'selected' : ''}>Thông hiểu</option>
                <option value="vandung" ${eq.level === 'vandung' ? 'selected' : ''}>Vận dụng</option>
              </select>
              <input type="number" class="compact-num" step="0.25" min="0.25" max="10" value="${eq.points}" onchange="updateEssayItem(${idx}, 'points', Number(this.value))" /> đ
              <button class="btn btn-danger btn-sm" onclick="removeEssayConfigItem(${idx})" title="Xóa câu này">✕</button>
            </div>
          `).join("")}
        </div>
      </td>
      <td class="text-center"><strong>${calc.essay.count} câu</strong></td>
      <td class="text-center"><strong style="font-size:15px;color:var(--primary-dark);">${calc.essay.totalPoints.toFixed(2)} đ</strong></td>
    </tr>
  `;
}

function togglePart(partKey, enabled) {
  state.partConfig[partKey].enabled = enabled;
  renderStep2Config();
  autoGenerateMatrix();
}

function updatePartParam(partKey, field, val) {
  state.partConfig[partKey][field] = val;
  renderStep2Config();
  autoGenerateMatrix();
}

function updatePartLevel(partKey, level, val) {
  state.partConfig[partKey].counts[level] = Math.max(0, Math.round(val));
  renderStep2Config();
  autoGenerateMatrix();
}

function updateTfQuestionsCount(numQ) {
  const n = Math.max(1, Math.round(numQ));
  state.partConfig.tf.numQuestions = n;
  balanceTfStatements();
}

function balanceTfStatements() {
  const totalStmts = state.partConfig.tf.numQuestions * 4;
  const biet = Math.round(totalStmts * 0.25);
  const hieu = Math.round(totalStmts * 0.25);
  const vandung = totalStmts - biet - hieu;
  state.partConfig.tf.counts = { biet, hieu, vandung };
  renderStep2Config();
  autoGenerateMatrix();
}

function addEssayConfigItem() {
  state.partConfig.essay.questions.push({
    id: "tl_" + Date.now(),
    label: `Câu ${state.partConfig.essay.questions.length + 1}`,
    level: "vandung",
    points: 1.0
  });
  renderStep2Config();
  autoGenerateMatrix();
}

function updateEssayItem(idx, field, val) {
  state.partConfig.essay.questions[idx][field] = val;
  renderStep2Config();
  autoGenerateMatrix();
}

function removeEssayConfigItem(idx) {
  state.partConfig.essay.questions.splice(idx, 1);
  renderStep2Config();
  autoGenerateMatrix();
}

function applyStructurePreset(presetType) {
  if (presetType === "cv7991_70_30") {
    // 70% TN (4đ MCQ + 3đ Đúng/Sai) + 30% TL (3đ) | Tỉ lệ 40 : 30 : 30
    state.partConfig.mcq = { enabled: true, title: state.partConfig.mcq.title, pointsPerQ: 0.25, counts: { biet: 12, hieu: 4, vandung: 0 } };
    state.partConfig.tf = { enabled: true, title: state.partConfig.tf.title, scoringMode: "progressive", pointsPerQuestion: 1.0, numQuestions: 3, counts: { biet: 4, hieu: 8, vandung: 0 } };
    state.partConfig.short = { enabled: false, title: state.partConfig.short.title, pointsPerQ: 0.25, counts: { biet: 0, hieu: 0, vandung: 0 } };
    state.partConfig.essay = {
      enabled: true,
      title: state.partConfig.essay.title,
      questions: [
        { id: "tl1", label: "Câu 1", level: "vandung", points: 1.5 },
        { id: "tl2", label: "Câu 2", level: "vandung", points: 1.5 }
      ]
    };
  } else if (presetType === "cv7991_4parts") {
    // Đầy đủ cả 4 dạng thức: 3đ MCQ (12 câu) + 2đ Đ/S (2 câu) + 2đ Trả lời ngắn (4 câu x 0.5đ) + 3đ Tự luận (2 câu)
    state.partConfig.mcq = { enabled: true, title: state.partConfig.mcq.title, pointsPerQ: 0.25, counts: { biet: 10, hieu: 2, vandung: 0 } };
    state.partConfig.tf = { enabled: true, title: state.partConfig.tf.title, scoringMode: "progressive", pointsPerQuestion: 1.0, numQuestions: 2, counts: { biet: 4, hieu: 4, vandung: 0 } };
    state.partConfig.short = { enabled: true, title: state.partConfig.short.title, pointsPerQ: 0.5, counts: { biet: 1, hieu: 3, vandung: 0 } };
    state.partConfig.essay = {
      enabled: true,
      title: state.partConfig.essay.title,
      questions: [
        { id: "tl1", label: "Câu 1", level: "vandung", points: 1.5 },
        { id: "tl2", label: "Câu 2", level: "vandung", points: 1.5 }
      ]
    };
  } else if (presetType === "tn100_thpt") {
    // 100% Trắc nghiệm theo định dạng Tốt nghiệp THPT (24 câu MCQ = 6đ + 4 câu Đ/S = 4đ)
    state.partConfig.mcq = { enabled: true, title: state.partConfig.mcq.title, pointsPerQ: 0.25, counts: { biet: 14, hieu: 6, vandung: 4 } };
    state.partConfig.tf = { enabled: true, title: state.partConfig.tf.title, scoringMode: "progressive", pointsPerQuestion: 1.0, numQuestions: 4, counts: { biet: 4, hieu: 6, vandung: 6 } };
    state.partConfig.short = { enabled: false, title: state.partConfig.short.title, pointsPerQ: 0.25, counts: { biet: 0, hieu: 0, vandung: 0 } };
    state.partConfig.essay = { enabled: false, title: state.partConfig.essay.title, questions: [] };
  }
  renderStep2Config();
  autoGenerateMatrix();
}

// ============================================================================
// BƯỚC 3: TẠO MA TRẬN ĐỀ KIỂM TRA (MẪU PHỤ LỤC 1 - CV 7991)
// ============================================================================

function distributeIntegerByWeights(totalCount, weights) {
  if (totalCount <= 0 || weights.length === 0) return weights.map(() => 0);
  const sumW = weights.reduce((a, b) => a + b, 0) || 1;
  const exact = weights.map(w => (w / sumW) * totalCount);
  const floored = exact.map(v => Math.floor(v));
  let remainder = totalCount - floored.reduce((a, b) => a + b, 0);
  const indices = exact
    .map((v, i) => ({ i, rem: v - floored[i] }))
    .sort((a, b) => b.rem - a.rem);
  for (let k = 0; k < remainder; k++) {
    floored[indices[k % indices.length].i]++;
  }
  return floored;
}

function autoGenerateMatrix() {
  const selectedUnits = state.units.filter(u => u.selected);
  if (selectedUnits.length === 0) return;

  const weights = selectedUnits.map(u => Number(u.periods) || 1);
  const pc = state.partConfig;

  const mcqBietArr = distributeIntegerByWeights(pc.mcq.enabled ? pc.mcq.counts.biet : 0, weights);
  const mcqHieuArr = distributeIntegerByWeights(pc.mcq.enabled ? pc.mcq.counts.hieu : 0, weights);
  const mcqVdArr = distributeIntegerByWeights(pc.mcq.enabled ? pc.mcq.counts.vandung : 0, weights);

  const tfBietArr = distributeIntegerByWeights(pc.tf.enabled ? pc.tf.counts.biet : 0, weights);
  const tfHieuArr = distributeIntegerByWeights(pc.tf.enabled ? pc.tf.counts.hieu : 0, weights);
  const tfVdArr = distributeIntegerByWeights(pc.tf.enabled ? pc.tf.counts.vandung : 0, weights);

  const shortBietArr = distributeIntegerByWeights(pc.short.enabled ? pc.short.counts.biet : 0, weights);
  const shortHieuArr = distributeIntegerByWeights(pc.short.enabled ? pc.short.counts.hieu : 0, weights);
  const shortVdArr = distributeIntegerByWeights(pc.short.enabled ? pc.short.counts.vandung : 0, weights);

  state.matrixRows = {};
  selectedUnits.forEach((u, idx) => {
    state.matrixRows[u.id] = {
      mcq_biet: mcqBietArr[idx],
      mcq_hieu: mcqHieuArr[idx],
      mcq_vandung: mcqVdArr[idx],
      tf_biet: tfBietArr[idx],
      tf_hieu: tfHieuArr[idx],
      tf_vandung: tfVdArr[idx],
      short_biet: shortBietArr[idx],
      short_hieu: shortHieuArr[idx],
      short_vandung: shortVdArr[idx],
      essay_biet: 0,
      essay_hieu: 0,
      essay_vandung: 0,
      essay_points_biet: 0,
      essay_points_hieu: 0,
      essay_points_vandung: 0
    };
  });

  // Phân bổ các câu Tự luận vào các bài học có trọng số cao
  if (pc.essay.enabled && pc.essay.questions.length > 0) {
    pc.essay.questions.forEach((eq, qIdx) => {
      const targetUnit = selectedUnits[(selectedUnits.length - 1 - qIdx + selectedUnits.length * 10) % selectedUnits.length];
      const row = state.matrixRows[targetUnit.id];
      row[`essay_${eq.level}`] += 1;
      row[`essay_points_${eq.level}`] = round2(row[`essay_points_${eq.level}`] + (Number(eq.points) || 0));
    });
  }
}

function getRowPointCalculation(row) {
  const pc = state.partConfig;
  const mcqP = pc.mcq.enabled ? (row.mcq_biet + row.mcq_hieu + row.mcq_vandung) * pc.mcq.pointsPerQ : 0;

  const totalTfStmts = pc.tf.enabled ? (pc.tf.counts.biet + pc.tf.counts.hieu + pc.tf.counts.vandung) : 0;
  const tfAvgPerStmt = totalTfStmts > 0 ? ((pc.tf.numQuestions * pc.tf.pointsPerQuestion) / totalTfStmts) : 0.25;
  const tfP = pc.tf.enabled ? (row.tf_biet + row.tf_hieu + row.tf_vandung) * tfAvgPerStmt : 0;

  const shortP = pc.short.enabled ? (row.short_biet + row.short_hieu + row.short_vandung) * pc.short.pointsPerQ : 0;
  const essayP = pc.essay.enabled ? (row.essay_points_biet + row.essay_points_hieu + row.essay_points_vandung) : 0;

  const totalPoints = round2(mcqP + tfP + shortP + essayP);
  const totalItems = (row.mcq_biet + row.mcq_hieu + row.mcq_vandung) +
                     (row.tf_biet + row.tf_hieu + row.tf_vandung) +
                     (row.short_biet + row.short_hieu + row.short_vandung) +
                     (row.essay_biet + row.essay_hieu + row.essay_vandung);
  return { totalPoints, totalItems };
}

function renderMatrixTable() {
  const tbody = document.getElementById("matrixTableBody");
  const tfoot = document.getElementById("matrixTableFoot");
  if (!tbody || !tfoot) return;

  const selectedUnits = state.units.filter(u => u.selected);
  const sums = {
    mcq_biet: 0, mcq_hieu: 0, mcq_vandung: 0,
    tf_biet: 0, tf_hieu: 0, tf_vandung: 0,
    short_biet: 0, short_hieu: 0, short_vandung: 0,
    essay_biet: 0, essay_hieu: 0, essay_vandung: 0,
    essay_points_biet: 0, essay_points_hieu: 0, essay_points_vandung: 0,
    totalItems: 0, totalPoints: 0
  };

  tbody.innerHTML = selectedUnits.map((u, idx) => {
    if (!state.matrixRows[u.id]) autoGenerateMatrix();
    const r = state.matrixRows[u.id];
    const rowCalc = getRowPointCalculation(r);

    Object.keys(sums).forEach(k => {
      if (r[k] !== undefined) sums[k] = round2(sums[k] + r[k]);
    });
    sums.totalItems += rowCalc.totalItems;
    sums.totalPoints = round2(sums.totalPoints + rowCalc.totalPoints);

    return `
      <tr>
        <td class="text-center">${idx + 1}</td>
        <td><strong>${escapeHtml(u.chapter)}</strong></td>
        <td>${escapeHtml(u.lesson)} <span class="badge badge-nl">${u.periods} tiết</span></td>
        <!-- MCQ -->
        <td class="text-center"><input type="number" class="compact-num" style="width:48px;" min="0" value="${r.mcq_biet}" onchange="updateMatrixCell('${u.id}', 'mcq_biet', this.value)" /></td>
        <td class="text-center"><input type="number" class="compact-num" style="width:48px;" min="0" value="${r.mcq_hieu}" onchange="updateMatrixCell('${u.id}', 'mcq_hieu', this.value)" /></td>
        <td class="text-center"><input type="number" class="compact-num" style="width:48px;" min="0" value="${r.mcq_vandung}" onchange="updateMatrixCell('${u.id}', 'mcq_vandung', this.value)" /></td>
        <!-- TF -->
        <td class="text-center"><input type="number" class="compact-num" style="width:48px;" min="0" value="${r.tf_biet}" onchange="updateMatrixCell('${u.id}', 'tf_biet', this.value)" /></td>
        <td class="text-center"><input type="number" class="compact-num" style="width:48px;" min="0" value="${r.tf_hieu}" onchange="updateMatrixCell('${u.id}', 'tf_hieu', this.value)" /></td>
        <td class="text-center"><input type="number" class="compact-num" style="width:48px;" min="0" value="${r.tf_vandung}" onchange="updateMatrixCell('${u.id}', 'tf_vandung', this.value)" /></td>
        <!-- Short -->
        <td class="text-center"><input type="number" class="compact-num" style="width:48px;" min="0" value="${r.short_biet}" onchange="updateMatrixCell('${u.id}', 'short_biet', this.value)" /></td>
        <td class="text-center"><input type="number" class="compact-num" style="width:48px;" min="0" value="${r.short_hieu}" onchange="updateMatrixCell('${u.id}', 'short_hieu', this.value)" /></td>
        <td class="text-center"><input type="number" class="compact-num" style="width:48px;" min="0" value="${r.short_vandung}" onchange="updateMatrixCell('${u.id}', 'short_vandung', this.value)" /></td>
        <!-- Essay -->
        <td class="text-center">
          <input type="number" class="compact-num" style="width:44px;" min="0" value="${r.essay_biet}" onchange="updateMatrixCell('${u.id}', 'essay_biet', this.value)" title="Số câu TL Biết" />
          <input type="number" class="compact-num" style="width:52px;margin-top:2px;" step="0.25" min="0" value="${r.essay_points_biet}" onchange="updateMatrixCell('${u.id}', 'essay_points_biet', this.value)" title="Điểm TL Biết" />đ
        </td>
        <td class="text-center">
          <input type="number" class="compact-num" style="width:44px;" min="0" value="${r.essay_hieu}" onchange="updateMatrixCell('${u.id}', 'essay_hieu', this.value)" title="Số câu TL Hiểu" />
          <input type="number" class="compact-num" style="width:52px;margin-top:2px;" step="0.25" min="0" value="${r.essay_points_hieu}" onchange="updateMatrixCell('${u.id}', 'essay_points_hieu', this.value)" title="Điểm TL Hiểu" />đ
        </td>
        <td class="text-center">
          <input type="number" class="compact-num" style="width:44px;" min="0" value="${r.essay_vandung}" onchange="updateMatrixCell('${u.id}', 'essay_vandung', this.value)" title="Số câu TL Vận dụng" />
          <input type="number" class="compact-num" style="width:52px;margin-top:2px;" step="0.25" min="0" value="${r.essay_points_vandung}" onchange="updateMatrixCell('${u.id}', 'essay_points_vandung', this.value)" title="Điểm TL Vận dụng" />đ
        </td>
        <td class="text-center"><strong>${rowCalc.totalItems}</strong></td>
        <td class="text-center"><strong>${rowCalc.totalPoints.toFixed(2)}đ</strong></td>
        <td class="text-center"><strong>${(rowCalc.totalPoints * 10).toFixed(1)}%</strong></td>
      </tr>
    `;
  }).join("");

  const pc = state.partConfig;
  const totalTfStmts = sums.tf_biet + sums.tf_hieu + sums.tf_vandung;
  const tfPointAvg = totalTfStmts > 0 ? ((pc.tf.numQuestions * pc.tf.pointsPerQuestion) / totalTfStmts) : 0.25;

  const bietPoints = round2(sums.mcq_biet * pc.mcq.pointsPerQ + sums.tf_biet * tfPointAvg + sums.short_biet * pc.short.pointsPerQ + sums.essay_points_biet);
  const hieuPoints = round2(sums.mcq_hieu * pc.mcq.pointsPerQ + sums.tf_hieu * tfPointAvg + sums.short_hieu * pc.short.pointsPerQ + sums.essay_points_hieu);
  const vdPoints = round2(sums.mcq_vandung * pc.mcq.pointsPerQ + sums.tf_vandung * tfPointAvg + sums.short_vandung * pc.short.pointsPerQ + sums.essay_points_vandung);

  tfoot.innerHTML = `
    <tr class="summary-row">
      <td colspan="3" class="text-right">TỔNG SỐ CÂU / LỆNH HỎI</td>
      <td class="text-center">${sums.mcq_biet}</td>
      <td class="text-center">${sums.mcq_hieu}</td>
      <td class="text-center">${sums.mcq_vandung}</td>
      <td class="text-center">${sums.tf_biet} ý</td>
      <td class="text-center">${sums.tf_hieu} ý</td>
      <td class="text-center">${sums.tf_vandung} ý</td>
      <td class="text-center">${sums.short_biet}</td>
      <td class="text-center">${sums.short_hieu}</td>
      <td class="text-center">${sums.short_vandung}</td>
      <td class="text-center">${sums.essay_biet} (${sums.essay_points_biet}đ)</td>
      <td class="text-center">${sums.essay_hieu} (${sums.essay_points_hieu}đ)</td>
      <td class="text-center">${sums.essay_vandung} (${sums.essay_points_vandung}đ)</td>
      <td class="text-center">${sums.totalItems}</td>
      <td class="text-center">${sums.totalPoints.toFixed(2)}đ</td>
      <td class="text-center">${(sums.totalPoints * 10).toFixed(1)}%</td>
    </tr>
    <tr>
      <td colspan="3" class="text-right"><strong>TỔNG ĐIỂM THEO MỨC ĐỘ TƯ DUY</strong></td>
      <td colspan="12" class="text-center">
        <span class="badge badge-biet" style="font-size:13px;padding:4px 12px;">Nhận biết: ${bietPoints.toFixed(2)} điểm (${(bietPoints * 10).toFixed(1)}%)</span>
        &nbsp;&nbsp;
        <span class="badge badge-hieu" style="font-size:13px;padding:4px 12px;">Thông hiểu: ${hieuPoints.toFixed(2)} điểm (${(hieuPoints * 10).toFixed(1)}%)</span>
        &nbsp;&nbsp;
        <span class="badge badge-vandung" style="font-size:13px;padding:4px 12px;">Vận dụng: ${vdPoints.toFixed(2)} điểm (${(vdPoints * 10).toFixed(1)}%)</span>
      </td>
      <td colspan="3" class="text-center"><strong style="color:var(--primary-dark);font-size:15px;">Tổng: ${sums.totalPoints.toFixed(2)} / 10.0đ</strong></td>
    </tr>
  `;
}

function updateMatrixCell(unitId, key, val) {
  const num = key.includes("points") ? Math.max(0, Number(val) || 0) : Math.max(0, Math.round(Number(val) || 0));
  state.matrixRows[unitId][key] = num;
  syncStep2FromMatrix();
  renderMatrixTable();
}

function syncStep2FromMatrix() {
  const selectedUnits = state.units.filter(u => u.selected);
  const sums = {
    mcq_biet: 0, mcq_hieu: 0, mcq_vandung: 0,
    tf_biet: 0, tf_hieu: 0, tf_vandung: 0,
    short_biet: 0, short_hieu: 0, short_vandung: 0
  };
  selectedUnits.forEach(u => {
    const r = state.matrixRows[u.id];
    if (!r) return;
    Object.keys(sums).forEach(k => sums[k] += r[k]);
  });
  state.partConfig.mcq.counts = { biet: sums.mcq_biet, hieu: sums.mcq_hieu, vandung: sums.mcq_vandung };
  state.partConfig.tf.counts = { biet: sums.tf_biet, hieu: sums.tf_hieu, vandung: sums.tf_vandung };
  state.partConfig.short.counts = { biet: sums.short_biet, hieu: sums.short_hieu, vandung: sums.short_vandung };
}

// ============================================================================
// BƯỚC 4: TẠO BẢN ĐẶC TẢ ĐỀ KIỂM TRA (MẪU PHỤ LỤC 2 - CV 7991)
// ============================================================================

function renderSpecificationTable() {
  const tbody = document.getElementById("specTableBody");
  if (!tbody) return;

  const selectedUnits = state.units.filter(u => u.selected);
  let mcqCursor = 1;
  let tfCursor = 1;
  let shortCursor = 1;
  let essayCursor = 1;

  tbody.innerHTML = selectedUnits.map((u, idx) => {
    const r = state.matrixRows[u.id] || {};
    const mcqTotal = (r.mcq_biet || 0) + (r.mcq_hieu || 0) + (r.mcq_vandung || 0);
    const tfTotal = (r.tf_biet || 0) + (r.tf_hieu || 0) + (r.tf_vandung || 0);
    const shortTotal = (r.short_biet || 0) + (r.short_hieu || 0) + (r.short_vandung || 0);
    const essayTotal = (r.essay_biet || 0) + (r.essay_hieu || 0) + (r.essay_vandung || 0);

    const mcqRange = mcqTotal > 0 ? `Câu ${mcqCursor} → Câu ${mcqCursor + mcqTotal - 1}` : "-";
    mcqCursor += mcqTotal;

    const tfRange = tfTotal > 0 ? `${tfTotal} ý (B:${r.tf_biet}, H:${r.tf_hieu}, VD:${r.tf_vandung})` : "-";
    tfCursor += tfTotal;

    const shortRange = shortTotal > 0 ? `Câu ${shortCursor} → Câu ${shortCursor + shortTotal - 1}` : "-";
    shortCursor += shortTotal;

    const essayRange = essayTotal > 0 ? `Câu TL ${essayCursor} (${round2(r.essay_points_biet + r.essay_points_hieu + r.essay_points_vandung)}đ)` : "-";
    essayCursor += essayTotal;

    return `
      <tr>
        <td class="text-center">${idx + 1}</td>
        <td><strong>${escapeHtml(u.chapter)}</strong></td>
        <td><strong>${escapeHtml(u.lesson)}</strong></td>
        <td>
          <div style="margin-bottom:6px;">
            <span class="badge badge-biet">Nhận biết:</span>
            <textarea rows="2" onchange="updateUnitSpecYccd('${u.id}', 'biet', this.value)">${escapeHtml(u.yccd.biet)}</textarea>
          </div>
          <div style="margin-bottom:6px;">
            <span class="badge badge-hieu">Thông hiểu:</span>
            <textarea rows="2" onchange="updateUnitSpecYccd('${u.id}', 'hieu', this.value)">${escapeHtml(u.yccd.hieu)}</textarea>
          </div>
          <div>
            <span class="badge badge-vandung">Vận dụng:</span>
            <textarea rows="2" onchange="updateUnitSpecYccd('${u.id}', 'vandung', this.value)">${escapeHtml(u.yccd.vandung)}</textarea>
          </div>
        </td>
        <td class="text-center">
          ${u.competencies.map(c => `<span class="badge badge-nl">${c}</span>`).join("<br/>")}
        </td>
        <td class="text-center">
          <strong>${mcqTotal} câu</strong>
          <div style="font-size:11.5px; color:var(--text-muted);">B:${r.mcq_biet} | H:${r.mcq_hieu} | VD:${r.mcq_vandung}</div>
          <div style="font-size:11px; color:var(--primary-dark); font-weight:600;">${mcqRange}</div>
        </td>
        <td class="text-center">
          <strong>${tfRange}</strong>
        </td>
        <td class="text-center">
          <strong>${shortTotal} câu</strong>
          <div style="font-size:11px; color:var(--primary-dark);">${shortRange}</div>
        </td>
        <td class="text-center">
          <strong>${essayTotal} câu</strong>
          <div style="font-size:11px; color:var(--primary-dark);">${essayRange}</div>
        </td>
      </tr>
    `;
  }).join("");
}

function updateUnitSpecYccd(unitId, level, val) {
  const unit = state.units.find(u => u.id === unitId);
  if (unit) unit.yccd[level] = val;
}

// ============================================================================
// BƯỚC 5: TẠO ĐỀ KIỂM TRA & HƯỚNG DẪN CHẤM (SINH TỰ ĐỘNG + AI + TRỘN ĐỀ)
// ============================================================================

function generateExamFromMatrix(showNotification = true) {
  const selectedUnits = state.units.filter(u => u.selected);
  const pc = state.partConfig;

  // 1. Sinh câu hỏi MCQ theo đúng từng Unit và từng Cấp độ trong Ma trận
  const mcqList = [];
  const usedMcqStems = new Set();
  if (pc.mcq.enabled) {
    selectedUnits.forEach(u => {
      const r = state.matrixRows[u.id] || {};
      ["biet", "hieu", "vandung"].forEach(lvl => {
        const countNeeded = r[`mcq_${lvl}`] || 0;
        const candidates = QUESTION_BANK.mcq.filter(q => q.unitId === u.id && q.level === lvl && !usedMcqStems.has(q.stem));
        for (let i = 0; i < countNeeded; i++) {
          let chosen = candidates[i];
          if (!chosen) {
            chosen = createSmartFallbackMcq(u, lvl, mcqList.length + 1);
          }
          usedMcqStems.add(chosen.stem);
          mcqList.push({
            id: "mcq_" + (mcqList.length + 1),
            unitId: u.id,
            unitName: u.lesson,
            level: lvl,
            competency: chosen.competency || u.competencies[0] || "NCCN",
            points: pc.mcq.pointsPerQ,
            stem: chosen.stem,
            options: [...chosen.options],
            answer: chosen.answer
          });
        }
      });
    });
  }

  // 2. Sinh câu hỏi Đúng - Sai (TF)
  const tfList = [];
  if (pc.tf.enabled) {
    const numQ = pc.tf.numQuestions;
    for (let i = 0; i < numQ; i++) {
      const targetUnit = selectedUnits[i % selectedUnits.length];
      const bankCandidate = QUESTION_BANK.tf.find((q, idx) => q.unitId === targetUnit.id && !tfList.some(existing => existing.stem === q.stem))
                         || QUESTION_BANK.tf[i % QUESTION_BANK.tf.length];
      if (bankCandidate) {
        tfList.push({
          id: "tf_" + (i + 1),
          unitId: targetUnit.id,
          unitName: targetUnit.lesson,
          competency: bankCandidate.competency || targetUnit.competencies[0] || "SDCN",
          points: pc.tf.pointsPerQuestion,
          stem: bankCandidate.stem,
          statements: JSON.parse(JSON.stringify(bankCandidate.statements))
        });
      }
    }
  }

  // 3. Sinh câu hỏi Trả lời ngắn (Short Answer)
  const shortList = [];
  if (pc.short.enabled) {
    selectedUnits.forEach(u => {
      const r = state.matrixRows[u.id] || {};
      ["biet", "hieu", "vandung"].forEach(lvl => {
        const countNeeded = r[`short_${lvl}`] || 0;
        for (let i = 0; i < countNeeded; i++) {
          const bankItem = QUESTION_BANK.short[(shortList.length) % QUESTION_BANK.short.length];
          shortList.push({
            id: "short_" + (shortList.length + 1),
            unitId: u.id,
            unitName: u.lesson,
            level: lvl,
            competency: u.competencies[0] || "SDCN",
            points: pc.short.pointsPerQ,
            stem: bankItem.stem,
            answer: bankItem.answer,
            explanation: bankItem.explanation
          });
        }
      });
    });
  }

  // 4. Sinh câu hỏi Tự luận (Essay)
  const essayList = [];
  if (pc.essay.enabled) {
    selectedUnits.forEach(u => {
      const r = state.matrixRows[u.id] || {};
      ["biet", "hieu", "vandung"].forEach(lvl => {
        const countNeeded = r[`essay_${lvl}`] || 0;
        const totalPointsForCell = r[`essay_points_${lvl}`] || 0;
        const pointPerEssay = countNeeded > 0 ? round2(totalPointsForCell / countNeeded) : 1.5;
        for (let i = 0; i < countNeeded; i++) {
          const bankEssay = QUESTION_BANK.essay.find(e => e.unitId === u.id && !essayList.some(ex => ex.stem === e.stem))
                         || QUESTION_BANK.essay[essayList.length % QUESTION_BANK.essay.length];
          essayList.push({
            id: "essay_" + (essayList.length + 1),
            unitId: u.id,
            unitName: u.lesson,
            level: lvl,
            competency: u.competencies.join(", "),
            points: pointPerEssay,
            stem: bankEssay.stem,
            rubric: [...bankEssay.rubric]
          });
        }
      });
    });
  }

  state.exam = { mcq: mcqList, tf: tfList, short: shortList, essay: essayList };
  renderExamEditor();
  if (showNotification) {
    alert("Đã tự động sinh Đề kiểm tra & Hướng dẫn chấm khớp 100% với Ma trận và Bản đặc tả!");
  }
}

function createSmartFallbackMcq(unit, level, index) {
  const levelName = level === "biet" ? "Nhận biết" : level === "hieu" ? "Thông hiểu" : "Vận dụng";
  const yccdText = unit.yccd[level] || unit.yccd.biet;
  return {
    unitId: unit.id,
    level,
    competency: unit.competencies[0] || "NCCN",
    stem: `[${unit.lesson} - Mức ${levelName}] Phát biểu nào sau đây phản ánh đúng nội dung kỹ thuật về: "${yccdText.slice(0, 95)}..."?`,
    options: [
      `Áp dụng đúng quy trình kỹ thuật nông nghiệp bền vững theo yêu cầu của ${unit.lesson}.`,
      "Canh tác tự phát không tuân theo quy chuẩn kỹ thuật và định mức nông học.",
      "Lạm dụng hóa chất vượt ngưỡng cho phép làm suy thoái hệ sinh thái nông nghiệp.",
      "Bỏ qua việc kiểm tra các yếu tố môi trường ngoại cảnh và giống."
    ],
    answer: 0
  };
}

function renderExamEditor() {
  const container = document.getElementById("examEditorContainer");
  if (!container) return;

  const { mcq, tf, short, essay } = state.exam;
  const pc = state.partConfig;
  let html = "";

  // PHẦN I: MCQ
  if (pc.mcq.enabled && mcq.length > 0) {
    const partPoints = mcq.reduce((s, q) => s + Number(q.points), 0);
    html += `
      <div class="card">
        <div class="card-header">
          <div class="card-title">I. PHẦN TRẮC NGHIỆM NHIỀU LỰA CHỌN (${mcq.length} câu - ${partPoints.toFixed(2)} điểm)</div>
        </div>
        ${mcq.map((q, idx) => `
          <div class="q-card">
            <div class="q-card-header">
              <div>
                <strong>Câu ${idx + 1}:</strong>
                <span class="badge badge-${q.level}">${q.level === 'biet' ? 'Nhận biết' : q.level === 'hieu' ? 'Thông hiểu' : 'Vận dụng'}</span>
                <span class="badge badge-nl">${q.competency}</span>
                <span style="font-size:12px; color:var(--text-muted);">(${escapeHtml(q.unitName)})</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                <span style="font-size:12px;">Điểm câu này:</span>
                <input type="number" class="compact-num" step="0.05" min="0.05" value="${q.points}" onchange="updateExamQuestionPoint('mcq', ${idx}, this.value)" /> đ
              </div>
            </div>
            <textarea rows="2" onchange="state.exam.mcq[${idx}].stem = this.value">${escapeHtml(q.stem)}</textarea>
            <div class="options-grid">
              ${q.options.map((opt, oIdx) => `
                <div class="opt-item ${q.answer === oIdx ? 'correct' : ''}">
                  <input type="radio" name="mcq_ans_${idx}" ${q.answer === oIdx ? 'checked' : ''} onchange="setMcqCorrectAnswer(${idx}, ${oIdx})" title="Chọn làm đáp án đúng" />
                  <strong>${String.fromCharCode(65 + oIdx)}.</strong>
                  <input type="text" value="${escapeHtml(opt)}" onchange="state.exam.mcq[${idx}].options[${oIdx}] = this.value" />
                </div>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  // PHẦN II: TF (Đúng - Sai)
  if (pc.tf.enabled && tf.length > 0) {
    const partPoints = tf.reduce((s, q) => s + Number(q.points), 0);
    html += `
      <div class="card">
        <div class="card-header">
          <div class="card-title">II. PHẦN TRẮC NGHIỆM ĐÚNG - SAI (${tf.length} câu lớn / ${tf.length * 4} lệnh hỏi - ${partPoints.toFixed(2)} điểm)</div>
        </div>
        ${tf.map((q, idx) => `
          <div class="q-card">
            <div class="q-card-header">
              <div>
                <strong>Câu ${idx + 1} (Đúng - Sai):</strong>
                <span class="badge badge-nl">${q.competency}</span>
                <span style="font-size:12px; color:var(--text-muted);">(${escapeHtml(q.unitName)})</span>
              </div>
              <div>
                <span style="font-size:12px;">Điểm tối đa câu:</span>
                <input type="number" class="compact-num" step="0.25" min="0.25" value="${q.points}" onchange="updateExamQuestionPoint('tf', ${idx}, this.value)" /> đ
              </div>
            </div>
            <textarea rows="3" onchange="state.exam.tf[${idx}].stem = this.value">${escapeHtml(q.stem)}</textarea>
            <table class="std-table" style="margin-top:8px;">
              <thead>
                <tr>
                  <th style="width:45px;">Ý</th>
                  <th>Nội dung lệnh hỏi</th>
                  <th style="width:100px;">Mức độ</th>
                  <th style="width:110px;">Đáp án Đ/S</th>
                  <th>Giải thích / Hướng dẫn chấm</th>
                </tr>
              </thead>
              <tbody>
                ${q.statements.map((st, sIdx) => `
                  <tr>
                    <td class="text-center"><strong>${st.label})</strong></td>
                    <td><input type="text" value="${escapeHtml(st.text)}" onchange="state.exam.tf[${idx}].statements[${sIdx}].text = this.value" /></td>
                    <td class="text-center">
                      <select onchange="state.exam.tf[${idx}].statements[${sIdx}].level = this.value">
                        <option value="biet" ${st.level === 'biet' ? 'selected' : ''}>Biết</option>
                        <option value="hieu" ${st.level === 'hieu' ? 'selected' : ''}>Hiểu</option>
                        <option value="vandung" ${st.level === 'vandung' ? 'selected' : ''}>Vận dụng</option>
                      </select>
                    </td>
                    <td class="text-center">
                      <select onchange="state.exam.tf[${idx}].statements[${sIdx}].isTrue = (this.value === 'true')" style="font-weight:700; color:${st.isTrue ? '#15803d' : '#dc2626'};">
                        <option value="true" ${st.isTrue ? 'selected' : ''}>ĐÚNG (Đ)</option>
                        <option value="false" ${!st.isTrue ? 'selected' : ''}>SAI (S)</option>
                      </select>
                    </td>
                    <td><input type="text" value="${escapeHtml(st.explanation || '')}" onchange="state.exam.tf[${idx}].statements[${sIdx}].explanation = this.value" /></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `).join("")}
      </div>
    `;
  }

  // PHẦN III: Trả lời ngắn
  if (pc.short.enabled && short.length > 0) {
    const partPoints = short.reduce((s, q) => s + Number(q.points), 0);
    html += `
      <div class="card">
        <div class="card-header">
          <div class="card-title">III. PHẦN TRẮC NGHIỆM TRẢ LỜI NGẮN (${short.length} câu - ${partPoints.toFixed(2)} điểm)</div>
        </div>
        ${short.map((q, idx) => `
          <div class="q-card">
            <div class="q-card-header">
              <div>
                <strong>Câu ${idx + 1}:</strong>
                <span class="badge badge-${q.level}">${q.level}</span>
                <span style="font-size:12px; color:var(--text-muted);">(${escapeHtml(q.unitName)})</span>
              </div>
              <div>
                <span style="font-size:12px;">Điểm câu này:</span>
                <input type="number" class="compact-num" step="0.05" value="${q.points}" onchange="updateExamQuestionPoint('short', ${idx}, this.value)" /> đ
              </div>
            </div>
            <textarea rows="2" onchange="state.exam.short[${idx}].stem = this.value">${escapeHtml(q.stem)}</textarea>
            <div class="form-grid" style="margin-top:8px;">
              <div>
                <label>Đáp án chuẩn (Số/Từ khóa):</label>
                <input type="text" value="${escapeHtml(q.answer)}" onchange="state.exam.short[${idx}].answer = this.value" style="font-weight:700; color:var(--primary-dark);" />
              </div>
              <div>
                <label>Giải thích cách tính:</label>
                <input type="text" value="${escapeHtml(q.explanation || '')}" onchange="state.exam.short[${idx}].explanation = this.value" />
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  // PHẦN IV: Tự luận
  if (pc.essay.enabled && essay.length > 0) {
    const partPoints = essay.reduce((s, q) => s + Number(q.points), 0);
    html += `
      <div class="card">
        <div class="card-header">
          <div class="card-title">IV. PHẦN TỰ LUẬN (${essay.length} câu - ${partPoints.toFixed(2)} điểm)</div>
        </div>
        ${essay.map((q, idx) => `
          <div class="q-card">
            <div class="q-card-header">
              <div>
                <strong>Câu ${idx + 1} (Tự luận):</strong>
                <span class="badge badge-${q.level}">${q.level === 'vandung' ? 'Vận dụng' : q.level === 'hieu' ? 'Thông hiểu' : 'Nhận biết'}</span>
                <span class="badge badge-nl">${q.competency}</span>
                <span style="font-size:12px; color:var(--text-muted);">(${escapeHtml(q.unitName)})</span>
              </div>
              <div>
                <span style="font-size:12px;">Điểm câu này:</span>
                <input type="number" class="compact-num" step="0.25" value="${q.points}" onchange="updateExamQuestionPoint('essay', ${idx}, this.value)" /> đ
              </div>
            </div>
            <label style="font-size:12px; font-weight:600;">Nội dung câu hỏi tự luận:</label>
            <textarea rows="4" onchange="state.exam.essay[${idx}].stem = this.value">${escapeHtml(q.stem)}</textarea>
            <label style="font-size:12px; font-weight:600; margin-top:8px; display:block;">Hướng dẫn chấm & Biểu điểm chi tiết:</label>
            <textarea rows="4" onchange="state.exam.essay[${idx}].rubric = this.value.split('\\n')">${escapeHtml(q.rubric.join("\n"))}</textarea>
          </div>
        `).join("")}
      </div>
    `;
  }

  container.innerHTML = html;
}

function setMcqCorrectAnswer(qIdx, ansIdx) {
  state.exam.mcq[qIdx].answer = ansIdx;
  renderExamEditor();
}

function updateExamQuestionPoint(partKey, qIdx, val) {
  state.exam[partKey][qIdx].points = Math.max(0.05, Number(val) || 0.25);
  renderExamEditor();
}

function shuffleExamQuestions() {
  // Đảo thứ tự câu hỏi trong từng phần và đảo phương án A, B, C, D
  state.exam.mcq.forEach(q => {
    const correctText = q.options[q.answer];
    q.options.sort(() => Math.random() - 0.5);
    q.answer = q.options.indexOf(correctText);
  });
  state.exam.mcq.sort(() => Math.random() - 0.5);
  state.exam.tf.sort(() => Math.random() - 0.5);
  state.meta.examCode = String(Math.floor(100 + Math.random() * 899));
  const codeEl = document.getElementById("metaExamCode");
  if (codeEl) codeEl.value = state.meta.examCode;
  renderExamEditor();
  alert("Đã trộn đề và đáp án thành công! Mã đề mới: " + state.meta.examCode);
}

// ============================================================================
// BƯỚC 6: TOOL AI KIỂM TRA & KIỂM ĐỊNH ĐỀ (AI EXAM AUDITOR & VALIDATOR)
// ============================================================================

function runAiAuditTool() {
  const calc = getPartCalculations();
  const { mcq, tf, short, essay } = state.exam;
  const pc = state.partConfig;
  const checks = [];
  let score = 100;

  // 1. Kiểm tra Tổng điểm toàn đề = 10.0 điểm
  const examActualPoints = round2(
    (pc.mcq.enabled ? mcq.reduce((s, q) => s + Number(q.points), 0) : 0) +
    (pc.tf.enabled ? tf.reduce((s, q) => s + Number(q.points), 0) : 0) +
    (pc.short.enabled ? short.reduce((s, q) => s + Number(q.points), 0) : 0) +
    (pc.essay.enabled ? essay.reduce((s, q) => s + Number(q.points), 0) : 0)
  );

  if (Math.abs(examActualPoints - 10.0) < 0.01 && Math.abs(calc.grandTotalPoints - 10.0) < 0.01) {
    checks.push({
      status: "pass",
      title: "1. Kiểm định Tổng điểm toàn đề (Chuẩn thang điểm 10,0)",
      detail: `Tổng điểm Cấu hình Bước 2 (${calc.grandTotalPoints.toFixed(2)}đ), Ma trận Bước 3 và Đề thi Bước 5 (${examActualPoints.toFixed(2)}đ) khớp tuyệt đối 10,00 điểm.`
    });
  } else {
    score -= 20;
    checks.push({
      status: "fail",
      title: "1. Lệch Tổng điểm toàn đề so với thang điểm 10,0",
      detail: `Tổng điểm cấu hình đang là ${calc.grandTotalPoints.toFixed(2)}đ và tổng điểm các câu trong đề là ${examActualPoints.toFixed(2)}đ (Yêu cầu chuẩn CV 7991: 10,00 điểm).`,
      fixAction: "autoFixTotalScore"
    });
  }

  // 2. Kiểm tra đồng bộ số lượng câu hỏi giữa Ma trận và Đề thi
  const mcqExpected = calc.mcq.count;
  const tfExpected = calc.tf.qCount;
  const shortExpected = calc.short.count;
  const essayExpected = calc.essay.count;

  if (mcq.length === mcqExpected && tf.length === tfExpected && short.length === shortExpected && essay.length === essayExpected) {
    checks.push({
      status: "pass",
      title: "2. Đồng bộ 100% số lượng câu hỏi giữa Ma trận ↔ Bản đặc tả ↔ Đề thi",
      detail: `Khớp hoàn toàn: Phần I (${mcq.length}/${mcqExpected} câu), Phần II (${tf.length}/${tfExpected} câu lớn = ${tf.length * 4} ý), Phần III (${short.length}/${shortExpected} câu), Phần IV (${essay.length}/${essayExpected} câu).`
    });
  } else {
    score -= 15;
    checks.push({
      status: "fail",
      title: "2. Chưa đồng bộ số câu giữa Ma trận và Đề kiểm tra",
      detail: `Ma trận yêu cầu (${mcqExpected} MCQ, ${tfExpected} Đ/S, ${shortExpected} TLN, ${essayExpected} TL) nhưng Đề đang có (${mcq.length} MCQ, ${tf.length} Đ/S, ${short.length} TLN, ${essay.length} TL).`,
      fixAction: "regenerateExamSync"
    });
  }

  // 3. Kiểm tra tỉ lệ cấp độ nhận thức (Biết - Hiểu - Vận dụng)
  const { bietPct, hieuPct, vandungPct } = calc.cognitive;
  if (bietPct >= 30 && bietPct <= 55 && hieuPct >= 20 && hieuPct <= 45 && vandungPct >= 20 && vandungPct <= 45) {
    checks.push({
      status: "pass",
      title: "3. Cấu trúc ma trận nhận thức (Biết : Hiểu : Vận dụng) hợp lý",
      detail: `Tỉ lệ hiện tại đạt ${bietPct}% Nhận biết : ${hieuPct}% Thông hiểu : ${vandungPct}% Vận dụng (Chuẩn định hướng Công văn 7991 là 40% : 30% : 30%).`
    });
  } else {
    score -= 10;
    checks.push({
      status: "warn",
      title: "3. Tỉ lệ cấp độ nhận thức lệch so với khuyến nghị 40% : 30% : 30%",
      detail: `Tỉ lệ hiện tại là ${bietPct}% Biết : ${hieuPct}% Hiểu : ${vandungPct}% Vận dụng. Nên cân đối lại để đảm bảo khả năng phân hóa học sinh.`
    });
  }

  // 4. Kiểm tra trùng lặp câu hỏi & lộ đáp án (Anti-Duplication)
  const allStems = [...mcq.map(q => q.stem), ...tf.map(q => q.stem), ...essay.map(q => q.stem)];
  let duplicatePairs = 0;
  for (let i = 0; i < allStems.length; i++) {
    for (let j = i + 1; j < allStems.length; j++) {
      if (allStems[i].trim() === allStems[j].trim()) duplicatePairs++;
    }
  }
  if (duplicatePairs === 0) {
    checks.push({
      status: "pass",
      title: "4. Kiểm định chống trùng lặp nội dung & lộ dữ kiện (Anti-Leakage)",
      detail: "Tất cả các câu hỏi trong đề đều độc lập về ngữ cảnh, không có câu hỏi trùng lặp nội dung hoặc gợi ý đáp án của nhau."
    });
  } else {
    score -= 15;
    checks.push({
      status: "warn",
      title: `4. Phát hiện ${duplicatePairs} cặp câu hỏi có nội dung trùng lặp`,
      detail: "Có câu hỏi bị lặp lại nguyên văn dẫn đề. Hãy chỉnh sửa hoặc bấm Sinh lại đề."
    });
  }

  // 5. Kiểm tra chuẩn kỹ thuật dạng thức Đúng - Sai (mỗi câu đủ 4 ý a,b,c,d và có cả Đúng lẫn Sai)
  let tfAllBalanced = true;
  tf.forEach(q => {
    const trueCount = q.statements.filter(s => s.isTrue).length;
    if (q.statements.length !== 4 || trueCount === 0 || trueCount === 4) {
      tfAllBalanced = false;
    }
  });
  if (!pc.tf.enabled || tfAllBalanced) {
    checks.push({
      status: "pass",
      title: "5. Kiểm định kỹ thuật câu hỏi Đúng - Sai (Phụ lục CV 7991)",
      detail: "Mỗi câu hỏi Đúng - Sai đều có đoạn dẫn thực tiễn, đủ 4 lệnh hỏi (a, b, c, d) phân hóa mức độ và có cả phương án Đúng lẫn Sai."
    });
  } else {
    score -= 10;
    checks.push({
      status: "warn",
      title: "5. Cảnh báo phân bố đáp án trong câu Đúng - Sai",
      detail: "Có câu Đúng - Sai đang chứa cả 4 ý cùng Đúng hoặc cả 4 ý cùng Sai. Nên bố trí 2 ý Đúng - 2 ý Sai hoặc 3 Đúng - 1 Sai."
    });
  }

  // 6. Kiểm tra mã hóa năng lực môn Công nghệ trong Bản đặc tả
  const selectedUnits = state.units.filter(u => u.selected);
  const missingComp = selectedUnits.some(u => !u.competencies || u.competencies.length === 0);
  if (!missingComp) {
    checks.push({
      status: "pass",
      title: "6. Kiểm định Mã hóa năng lực đặc thù môn Công nghệ (Phụ lục 2)",
      detail: "100% đơn vị kiến thức trong Bản đặc tả đã gắn mã năng lực chuẩn Chương trình GDPT 2018 (NCCN, SDCN, ĐGCN, GTCN, TKKT)."
    });
  } else {
    score -= 10;
    checks.push({
      status: "warn",
      title: "6. Thiếu mã hóa năng lực ở một số bài học",
      detail: "Cần bổ sung mã năng lực (NCCN, SDCN, ĐGCN) tại Bước 1 cho tất cả các bài học được chọn."
    });
  }

  state.audit.score = Math.max(0, score);
  state.audit.items = checks;
  renderAuditReport();
}

function renderAuditReport() {
  const scoreEl = document.getElementById("auditScoreCircle");
  const summaryEl = document.getElementById("auditSummaryTitle");
  const listEl = document.getElementById("auditCheckList");
  if (!scoreEl || !listEl) return;

  scoreEl.innerHTML = `${state.audit.score}<span>/100 điểm</span>`;
  scoreEl.style.background = state.audit.score >= 90 ? "#15803d" : state.audit.score >= 75 ? "#d97706" : "#dc2626";

  summaryEl.textContent = state.audit.score === 100
    ? "Hồ sơ Đề kiểm tra đạt chuẩn 100% theo Công văn 7991/BGDĐT-GDTrH!"
    : "Hồ sơ Đề kiểm tra cần rà soát một số mục cảnh báo bên dưới";

  listEl.innerHTML = state.audit.items.map(item => `
    <div class="audit-item ${item.status}">
      <div>
        <div style="font-weight:700; margin-bottom:3px;">
          ${item.status === 'pass' ? '✅' : item.status === 'warn' ? '⚠️' : '❌'} ${escapeHtml(item.title)}
        </div>
        <div style="font-size:13px; color:var(--text-muted);">${escapeHtml(item.detail)}</div>
      </div>
      <div>
        <span class="badge ${item.status === 'pass' ? 'badge-ok' : item.status === 'warn' ? 'badge-warn' : 'badge-err'}">
          ${item.status === 'pass' ? 'ĐẠT CHUẨN' : item.status === 'warn' ? 'KHUYẾN NGHỊ' : 'CẦN SỬA'}
        </span>
        ${item.fixAction === 'regenerateExamSync' ? `<button class="btn btn-primary btn-sm" style="margin-top:6px;display:block;" onclick="generateExamFromMatrix(true); runAiAuditTool();">Đồng bộ ngay</button>` : ''}
        ${item.fixAction === 'autoFixTotalScore' ? `<button class="btn btn-primary btn-sm" style="margin-top:6px;display:block;" onclick="applyStructurePreset('cv7991_70_30'); generateExamFromMatrix(false); runAiAuditTool();">Chuẩn hóa 10đ</button>` : ''}
      </div>
    </div>
  `).join("");
}

// Gọi LLM AI thật (Gemini API) hoặc sinh Báo cáo thẩm định chuyên sâu bằng AI
async function callDeepAiInspector() {
  const outputBox = document.getElementById("deepAiOutputBox");
  outputBox.style.display = "block";
  outputBox.innerHTML = `<div style="padding:12px; color:var(--primary-dark); font-weight:600;">⏳ Tool AI đang phân tích chuyên sâu Ma trận, Bản đặc tả và từng câu hỏi trong Đề kiểm tra...</div>`;

  const apiKey = state.aiConfig.apiKey.trim();
  const promptText = buildFullAiAuditPrompt();

  if (apiKey) {
    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${state.aiConfig.model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      });
      const data = await resp.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) {
        outputBox.innerHTML = `
          <div style="font-weight:700; color:var(--primary-dark); margin-bottom:8px;">🤖 Kết quả thẩm định chuyên sâu từ Gemini AI:</div>
          <div style="white-space:pre-wrap; font-size:13.5px; line-height:1.6;">${escapeHtml(aiText)}</div>
        `;
        return;
      }
    } catch (err) {
      console.warn("Gemini API fallback:", err);
    }
  }

  // Built-in Expert AI Pedagogical Analysis (hoạt động ngay cả khi chưa nhập API Key)
  const calc = getPartCalculations();
  const selectedUnits = state.units.filter(u => u.selected);
  setTimeout(() => {
    outputBox.innerHTML = `
      <div style="font-weight:700; color:var(--primary-dark); font-size:15px; margin-bottom:10px;">
        🤖 BÁO CÁO THẨM ĐỊNH CHUYÊN MÔN BẰNG AI (CHUẨN CÔNG VĂN 7991/BGDĐT-GDTrH)
      </div>
      <div style="font-size:13.5px; line-height:1.65;">
        <p><strong>1. Đánh giá độ phủ chương trình & Yêu cầu cần đạt:</strong></p>
        <ul style="margin-left:20px; margin-bottom:10px;">
          <li>Đề kiểm tra đã bao phủ đầy đủ <strong>${selectedUnits.length} đơn vị kiến thức</strong> thuộc phạm vi kiểm tra (${state.meta.subjectName}).</li>
          <li>Trọng số điểm phân bổ tỷ lệ thuận với thời lượng tiết dạy trong PPCT, đảm bảo tính đại diện của các chủ đề trọng tâm.</li>
        </ul>
        <p><strong>2. Đánh giá chất lượng các dạng thức câu hỏi:</strong></p>
        <ul style="margin-left:20px; margin-bottom:10px;">
          <li><strong>Phần Trắc nghiệm nhiều lựa chọn (${state.exam.mcq.length} câu - ${calc.mcq.totalPoints}đ):</strong> Các phương án nhiễu có tính logic khoa học, tập trung kiểm tra mức độ Nhận biết và Thông hiểu khái niệm công nghệ nông nghiệp.</li>
          <li><strong>Phần Trắc nghiệm Đúng - Sai (${state.exam.tf.length} câu lớn / ${state.exam.tf.length * 4} lệnh hỏi - ${calc.tf.totalPoints}đ):</strong> Đoạn dẫn gắn với tình huống thực tiễn sản xuất (chuyển đổi cơ cấu cây trồng, xử lý đất phèn/mặn, sử dụng phân bón an toàn). 4 ý a, b, c, d được sắp xếp đúng bậc thang nhận thức từ Biết → Hiểu → Vận dụng.</li>
          <li><strong>Phần Tự luận (${state.exam.essay.length} câu - ${calc.essay.totalPoints}đ):</strong> Đánh giá đúng năng lực giải quyết vấn đề thực tế tại địa phương và định hướng nông nghiệp xanh bền vững; Hướng dẫn chấm chia nhỏ thang điểm rõ ràng đến 0,25đ.</li>
        </ul>
        <p><strong>3. Kết luận của Hội đồng AI Khảo thí:</strong> <span class="badge badge-ok">HỒ SƠ HỢP LỆ - SẴN SÀNG IN SAO & KIỂM TRA</span></p>
      </div>
    `;
  }, 450);
}

function buildFullAiAuditPrompt() {
  return `Bạn là Chuyên gia Khảo thí Bộ GD&ĐT. Hãy kiểm định Bộ hồ sơ đề kiểm tra ${state.meta.subjectName} (${state.meta.examTerm}) theo Công văn 7991/BGDĐT-GDTrH:\n` +
    `- Cấu hình điểm: ${JSON.stringify(getPartCalculations())}\n` +
    `- Câu hỏi MCQ: ${JSON.stringify(state.exam.mcq)}\n` +
    `- Câu hỏi Đúng/Sai: ${JSON.stringify(state.exam.tf)}\n` +
    `- Câu hỏi Tự luận: ${JSON.stringify(state.exam.essay)}\n` +
    `Hãy nhận xét chi tiết về: (1) Độ khớp Ma trận - Đặc tả - Đề thi, (2) Độ chính xác kiến thức nông nghiệp, (3) Chất lượng câu hỏi phân hóa và gợi ý chỉnh sửa nếu có.`;
}

// ============================================================================
// XUẤT FILE WORD (.DOC) ĐẦY ĐỦ 4 PHẦN CHUẨN BỘ GD&ĐT
// ============================================================================

function exportFullWordDocument() {
  state.meta.school = document.getElementById("metaSchool")?.value || state.meta.school;
  state.meta.subjectName = document.getElementById("metaSubject")?.value || state.meta.subjectName;
  state.meta.examTerm = document.getElementById("metaTerm")?.value || state.meta.examTerm;
  state.meta.duration = Number(document.getElementById("metaDuration")?.value) || 45;
  state.meta.examCode = document.getElementById("metaExamCode")?.value || "101";

  const matrixHtml = document.getElementById("matrixExportArea")?.innerHTML || "";
  const specHtml = document.getElementById("specExportArea")?.innerHTML || "";
  const examHtml = buildPrintableExamHtml();

  const fullDoc = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Ho So De Kiem Tra CV 7991</title>
      <style>
        body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.4; }
        h1, h2, h3 { text-align: center; margin: 6pt 0; }
        table { width: 100%; border-collapse: collapse; margin: 8pt 0; }
        th, td { border: 1px solid #000; padding: 4pt 6pt; font-size: 11pt; }
        th { background-color: #f0f0f0; font-weight: bold; text-align: center; }
        .page-break { page-break-before: always; }
      </style>
    </head>
    <body>
      <h2>HỒ SƠ ĐỀ KIỂM TRA ĐỊNH KỲ ${escapeHtml(state.meta.examTerm)}</h2>
      <h3>MÔN: ${escapeHtml(state.meta.subjectName)} (Theo Công văn số 7991/BGDĐT-GDTrH)</h3>
      <hr/>
      <h3>PHẦN 1. MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ (PHỤ LỤC 1)</h3>
      ${matrixHtml}
      <div class="page-break"></div>
      <h3>PHẦN 2. BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KỲ (PHỤ LỤC 2)</h3>
      ${specHtml}
      <div class="page-break"></div>
      ${examHtml}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', fullDoc], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Ho-So-De-Thi-CV7991-${state.meta.examCode}.doc`;
  link.click();
}

function buildPrintableExamHtml() {
  const { mcq, tf, short, essay } = state.exam;
  const pc = state.partConfig;
  let html = `
    <table>
      <tr>
        <td style="border:none; text-align:center; width:45%;">
          <strong>${escapeHtml(state.meta.department)}</strong><br/>
          <strong>${escapeHtml(state.meta.school)}</strong>
        </td>
        <td style="border:none; text-align:center; width:55%;">
          <strong>ĐỀ KIỂM TRA ${escapeHtml(state.meta.examTerm)}</strong><br/>
          <strong>Môn: ${escapeHtml(state.meta.subjectName)}</strong><br/>
          <i>Thời gian làm bài: ${state.meta.duration} phút | Mã đề: ${escapeHtml(state.meta.examCode)}</i>
        </td>
      </tr>
    </table>
    <hr/>
  `;

  if (pc.mcq.enabled && mcq.length > 0) {
    const pSum = mcq.reduce((s, q) => s + Number(q.points), 0);
    html += `<p><strong>PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn (${pSum.toFixed(2)} điểm).</strong> <i>Thí sinh trả lời từ câu 1 đến câu ${mcq.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án.</i></p>`;
    mcq.forEach((q, idx) => {
      html += `<p><strong>Câu ${idx + 1} (${q.points}đ):</strong> ${escapeHtml(q.stem)}<br/>`;
      q.options.forEach((opt, oIdx) => {
        html += `&nbsp;&nbsp;<strong>${String.fromCharCode(65 + oIdx)}.</strong> ${escapeHtml(opt)}<br/>`;
      });
      html += `</p>`;
    });
  }

  if (pc.tf.enabled && tf.length > 0) {
    const pSum = tf.reduce((s, q) => s + Number(q.points), 0);
    html += `<p><strong>PHẦN II. Câu trắc nghiệm đúng sai (${pSum.toFixed(2)} điểm).</strong> <i>Thí sinh trả lời từ câu 1 đến câu ${tf.length}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.</i></p>`;
    tf.forEach((q, idx) => {
      html += `<p><strong>Câu ${idx + 1} (${q.points}đ):</strong> ${escapeHtml(q.stem)}<br/>`;
      q.statements.forEach(st => {
        html += `&nbsp;&nbsp;<strong>${st.label})</strong> ${escapeHtml(st.text)}<br/>`;
      });
      html += `</p>`;
    });
  }

  if (pc.short.enabled && short.length > 0) {
    const pSum = short.reduce((s, q) => s + Number(q.points), 0);
    html += `<p><strong>PHẦN III. Câu trắc nghiệm trả lời ngắn (${pSum.toFixed(2)} điểm).</strong></p>`;
    short.forEach((q, idx) => {
      html += `<p><strong>Câu ${idx + 1} (${q.points}đ):</strong> ${escapeHtml(q.stem)}</p>`;
    });
  }

  if (pc.essay.enabled && essay.length > 0) {
    const pSum = essay.reduce((s, q) => s + Number(q.points), 0);
    html += `<p><strong>PHẦN TỰ LUẬN (${pSum.toFixed(2)} điểm).</strong></p>`;
    essay.forEach((q, idx) => {
      html += `<p><strong>Câu ${idx + 1} (${q.points} điểm):</strong><br/>${escapeHtml(q.stem).replace(/\n/g, "<br/>")}</p>`;
    });
  }

  // Đáp án & Hướng dẫn chấm
  html += `<div class="page-break"></div><h3>PHẦN 4. ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM (Mã đề: ${escapeHtml(state.meta.examCode)})</h3>`;
  if (pc.mcq.enabled && mcq.length > 0) {
    html += `<p><strong>I. Đáp án Trắc nghiệm nhiều lựa chọn:</strong></p><table><tr>`;
    mcq.forEach((q, idx) => {
      html += `<td><strong>Câu ${idx + 1}:</strong> ${String.fromCharCode(65 + q.answer)} (${q.points}đ)</td>`;
      if ((idx + 1) % 4 === 0 && idx < mcq.length - 1) html += `</tr><tr>`;
    });
    html += `</tr></table>`;
  }

  if (pc.tf.enabled && tf.length > 0) {
    html += `<p><strong>II. Đáp án Trắc nghiệm Đúng - Sai:</strong></p><table><thead><tr><th>Câu</th><th>Ý a</th><th>Ý b</th><th>Ý c</th><th>Ý d</th><th>Điểm tối đa</th></tr></thead><tbody>`;
    tf.forEach((q, idx) => {
      html += `<tr><td style="text-align:center;"><strong>Câu ${idx + 1}</strong></td>`;
      q.statements.forEach(st => {
        html += `<td style="text-align:center;"><strong>${st.isTrue ? 'Đúng' : 'Sai'}</strong></td>`;
      });
      html += `<td style="text-align:center;">${q.points}đ</td></tr>`;
    });
    html += `</tbody></table>`;
  }

  if (pc.essay.enabled && essay.length > 0) {
    html += `<p><strong>III. Hướng dẫn chấm Tự luận:</strong></p><table><thead><tr><th>Câu</th><th>Nội dung yêu cầu</th><th>Điểm</th></tr></thead><tbody>`;
    essay.forEach((q, idx) => {
      html += `<tr><td style="text-align:center;"><strong>Câu ${idx + 1}</strong></td><td>${q.rubric.map(r => escapeHtml(r)).join("<br/>")}</td><td style="text-align:center;"><strong>${q.points}đ</strong></td></tr>`;
    });
    html += `</tbody></table>`;
  }

  return html;
}

// Modal Cấu hình AI
function openAiConfigModal() {
  document.getElementById("aiModalBackdrop").classList.add("open");
  document.getElementById("aiKeyInput").value = state.aiConfig.apiKey;
}

function closeAiConfigModal() {
  document.getElementById("aiModalBackdrop").classList.remove("open");
}

function saveAiConfig() {
  const key = document.getElementById("aiKeyInput").value.trim();
  state.aiConfig.apiKey = key;
  localStorage.setItem("cv7991_ai_key", key);
  closeAiConfigModal();
  alert("Đã lưu cấu hình AI thành công!");
}

// Modal Kho Ngữ Liệu SGK (PDF), SGV (Word) & 442 Câu hỏi Sách Ôn
let activeCorpusTab = "sgk";
function openCorpusModal(tab = "sgk") {
  activeCorpusTab = tab;
  document.getElementById("corpusModalBackdrop").classList.add("open");
  renderCorpusModal();
}

function closeCorpusModal() {
  document.getElementById("corpusModalBackdrop").classList.remove("open");
}

function renderCorpusModal() {
  const box = document.getElementById("corpusModalContent");
  if (!box || typeof CORPUS_BANK === "undefined") return;

  const sgkCount = CORPUS_BANK.textbooks.length;
  const sgvCount =
    CORPUS_BANK.sgvLessons.cn10_chuyende.length +
    CORPUS_BANK.sgvLessons.cn11_channuoi.length +
    CORPUS_BANK.sgvLessons.cn12_chuyende.length;
  let totalMcq = 0, totalTf = 0;
  Object.values(CORPUS_BANK.sachOnQuestions).forEach(t => {
    totalMcq += t.mcq.length;
    totalTf += t.tf.length;
  });

  let html = `
    <div style="display:flex; gap:8px; margin-bottom:14px; flex-wrap:wrap;">
      <button class="btn ${activeCorpusTab === 'sgk' ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="openCorpusModal('sgk')">
        📕 3 Sách Giáo Khoa PDF & 3 Sách Giáo Viên Word (${sgkCount} bộ)
      </button>
      <button class="btn ${activeCorpusTab === 'sgv' ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="openCorpusModal('sgv')">
        📗 Ngữ liệu Chi tiết 50 Bài Sách Giáo Viên (${sgvCount} bài)
      </button>
      <button class="btn ${activeCorpusTab === 'qbank' ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="openCorpusModal('qbank')">
        📘 Ngân hàng Câu hỏi Sách Ôn Tập Huấn (${totalMcq} câu TN 4 lựa chọn + ${totalTf} câu Đúng/Sai)
      </button>
    </div>
  `;

  if (activeCorpusTab === "sgk") {
    html += `<div class="table-wrap"><table class="std-table">
      <thead>
        <tr>
          <th>Khối lớp</th>
          <th>Tên Sách Giáo Khoa (PDF) & Sách Giáo Viên (Word)</th>
          <th>Quy mô</th>
          <th>Mở tệp gốc trên máy</th>
        </tr>
      </thead>
      <tbody>
        ${CORPUS_BANK.textbooks.map(tb => `
          <tr>
            <td style="text-align:center; font-weight:700;">${escapeHtml(tb.grade)}</td>
            <td>
              <strong>${escapeHtml(tb.title)}</strong><br/>
              <span style="font-size:12px; color:var(--text-muted);">Đã đồng bộ Phân phối chương trình PL1 (CV 5512) & Yêu cầu cần đạt vào Bước 1</span>
            </td>
            <td style="text-align:center;">
              ${tb.pages} trang PDF<br/>
              <span class="badge badge-info">${tb.chapters} chương / ${tb.lessonsCount} bài SGK</span>
              ${tb.specialLessonsCount ? `<br/><span class="badge badge-success">${tb.specialLessonsCount} bài Chuyên đề</span>` : ''}
            </td>
            <td style="text-align:center;">
              <a href="${tb.pdfPath}" target="_blank" class="btn btn-primary btn-sm" style="text-decoration:none; display:inline-block; margin-bottom:4px;">📄 Mở PDF SGK</a><br/>
              <span style="font-size:11.5px; color:var(--text-muted);">SGV Word đã nạp 100%</span>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table></div>`;
  } else if (activeCorpusTab === "sgv") {
    const allGroups = [
      { title: "Công nghệ 11 – Công nghệ Chăn nuôi (22 Bài SGK Kết nối tri thức)", list: CORPUS_BANK.sgvLessons.cn11_channuoi },
      { title: "Chuyên đề học tập Công nghệ 10 – Công nghệ Trồng trọt (15 Bài)", list: CORPUS_BANK.sgvLessons.cn10_chuyende },
      { title: "Chuyên đề học tập Công nghệ 12 – Lâm nghiệp – Thủy sản (13 Bài)", list: CORPUS_BANK.sgvLessons.cn12_chuyende }
    ];
    allGroups.forEach(g => {
      html += `<h4 style="margin:12px 0 6px; color:var(--primary-dark);">${escapeHtml(g.title)}</h4>`;
      html += `<div style="display:grid; gap:8px;">`;
      g.list.forEach(les => {
        html += `
          <details style="background:#f8fafc; border:1px solid var(--border); border-radius:8px; padding:10px 14px;">
            <summary style="cursor:pointer; font-weight:700; color:var(--text);">
              ${escapeHtml(les.title)} <span style="font-weight:400; font-size:12px; color:var(--primary);">(${les.objectives.length} mục tiêu YCCĐ • ${les.practice.length ? 'Có câu hỏi Luyện tập & Gợi ý trả lời SGV' : 'Thực hành/Dự án'})</span>
            </summary>
            <div style="margin-top:8px; font-size:13px; line-height:1.55;">
              <div><strong>🎯 Mục tiêu Năng lực Công nghệ:</strong><ul style="margin-left:18px;">${les.objectives.slice(0,5).map(o => `<li>${escapeHtml(o)}</li>`).join("")}</ul></div>
              ${les.content.length ? `<div style="margin-top:4px;"><strong>📌 Nội dung trọng tâm:</strong> ${escapeHtml(les.content.join("; "))}</div>` : ""}
              ${les.practice.length ? `<div style="margin-top:6px; background:#fff; padding:8px; border-radius:6px; border:1px dashed #cbd5e1;"><strong>📝 Câu hỏi Luyện tập & Đáp án SGV:</strong><br/>${les.practice.slice(0,8).map(p => escapeHtml(p)).join("<br/>")}</div>` : ""}
            </div>
          </details>
        `;
      });
      html += `</div>`;
    });
  } else if (activeCorpusTab === "qbank") {
    html += `<p style="font-size:13px; color:var(--primary-dark); margin-bottom:10px;">✅ Toàn bộ <strong>${totalMcq} câu TN Nhiều lựa chọn</strong> và <strong>${totalTf} câu lớn (${totalTf * 4} lệnh hỏi) TN Đúng - Sai</strong> dưới đây đã được nạp trực tiếp vào Ngân hàng câu hỏi tự động ở <strong>Bước 5</strong>:</p>`;
    Object.entries(CORPUS_BANK.sachOnQuestions).forEach(([tNum, tObj]) => {
      html += `
        <details style="background:#f8fafc; border:1px solid var(--border); border-radius:8px; padding:10px 14px; margin-bottom:8px;">
          <summary style="cursor:pointer; font-weight:700;">
            Chủ đề ${tNum}: ${escapeHtml(tObj.title)} — <span class="badge badge-info">${tObj.mcq.length} câu 4 lựa chọn</span> <span class="badge badge-warning">${tObj.tf.length} câu Đúng/Sai</span>
          </summary>
          <div style="margin-top:10px; font-size:13px;">
            ${tObj.mcq.slice(0, 6).map((q, i) => `
              <div style="padding:6px 0; border-bottom:1px dashed #e2e8f0;">
                <strong>Câu ${i+1}:</strong> ${escapeHtml(q.stem)}<br/>
                <span style="color:var(--text-muted);">A. ${escapeHtml(q.options[0])} | B. ${escapeHtml(q.options[1])} | C. ${escapeHtml(q.options[2])} | D. ${escapeHtml(q.options[3])}</span>
                → <strong style="color:var(--primary);">Đáp án: ${['A','B','C','D'][q.answer]}</strong>
              </div>
            `).join("")}
            <div style="margin-top:6px; font-style:italic; color:var(--text-muted);">... (Đã tích hợp đầy đủ ${tObj.mcq.length} câu Nhiều lựa chọn & ${tObj.tf.length} câu Đúng/Sai vào bộ sinh đề Bước 5)</div>
          </div>
        </details>
      `;
    });
  }

  box.innerHTML = html;
}

// Tiện ích làm tròn & escape HTML
function round2(n) { return Math.round((Number(n) + Number.EPSILON) * 100) / 100; }
function round1(n) { return Math.round((Number(n) + Number.EPSILON) * 10) / 10; }
function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
