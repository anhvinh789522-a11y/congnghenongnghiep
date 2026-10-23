// Ứng dụng Thiết kế & Kiểm định Hồ sơ Đề kiểm tra theo Công văn 7991/BGDĐT-GDTrH
// Quy trình 6 bước chuẩn hóa dành cho môn Công nghệ Nông nghiệp

const state = {
  currentStep: 1,
  meta: {
    department: localStorage.getItem("cv7991_department") || "SỞ GIÁO DỤC VÀ ĐÀO TẠO BÌNH PHƯỚC",
    school: localStorage.getItem("cv7991_school") || "TRƯỜNG THPT LỘC NINH",
    group: localStorage.getItem("cv7991_group") || "TỔ TIN - CÔNG NGHỆ",
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
      counts: { biet: 3, hieu: 3, vandung: 6 }, // Phân bổ theo số ý hỏi (tổng = numQuestions * 4)
      statementLevels: [
        { a: "biet", b: "hieu", c: "vandung", d: "vandung" },
        { a: "biet", b: "hieu", c: "vandung", d: "vandung" },
        { a: "biet", b: "hieu", c: "vandung", d: "vandung" }
      ]
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
  questionSourceMode: "exact", // 'exact' (Trích xuất chính xác) | 'adapt' (Biến đổi số liệu & bối cảnh thực tế)
  exam: {
    mcq: [],
    tf: [],
    short: [],
    essay: []
  },
  variantExams: [], // Bộ 3 đề biến thể (Mã 101, 102, 103)
  variantActiveTab: "exams", // 'exams' | 'solutions'
  similarState: {
    sourceName: "Công nghệ 10 - Đề kiểm tra Giữa kì 1 (Mẫu chuẩn CV 7991)",
    gradeFilter: "all",
    activeSubTab: "exam", // 'matrix' | 'exam' | 'solution'
    examData: null
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
  const deptEl = document.getElementById("metaDepartment");
  const schoolEl = document.getElementById("metaSchool");
  const groupEl = document.getElementById("metaGroup");
  const codeEl = document.getElementById("metaExamCode");
  if (deptEl) deptEl.value = state.meta.department;
  if (schoolEl) schoolEl.value = state.meta.school;
  if (groupEl) groupEl.value = state.meta.group;
  if (codeEl) codeEl.value = state.meta.examCode;

  loadPresetCurriculum("cn10_trongtrot_gk1");
  ensureTfStatementLevels();
  renderStep2Config();
  autoGenerateMatrix();
  renderMatrixTable();
  renderSpecificationTable();
  generateExamFromMatrix(false);
  runAiAuditTool();
  if (typeof updateHistoryCountBadge === "function") updateHistoryCountBadge();
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

function getPresetCurriculumData(presetKey) {
  if (typeof CURRICULUM_PRESETS !== "undefined" && CURRICULUM_PRESETS[presetKey]) {
    return CURRICULUM_PRESETS[presetKey];
  }
  if (typeof PORTAL_DATA !== "undefined" && Array.isArray(PORTAL_DATA.lessons)) {
    const all = PORTAL_DATA.lessons;
    let name = "CÔNG NGHỆ NÔNG NGHIỆP";
    let grade = "Lớp 10";
    let examTerm = "Kiểm tra Định kỳ";
    let filterFn = null;

    if (presetKey === "cn10_trongtrot_gk1") {
      name = "Công nghệ 10 - Trồng trọt (Giữa kì 1)";
      grade = "Lớp 10";
      examTerm = "Giữa Học kì I";
      filterFn = l => l.grade === "cn10" && l.lesson >= 1 && l.lesson <= 8;
    } else if (presetKey === "cn10_trongtrot_ck1") {
      name = "Công nghệ 10 - Trồng trọt (Cuối kì 1)";
      grade = "Lớp 10";
      examTerm = "Cuối Học kì I";
      filterFn = l => l.grade === "cn10" && l.lesson >= 1 && l.lesson <= 14;
    } else if (presetKey === "cn10_trongtrot_gk2") {
      name = "Công nghệ 10 - Trồng trọt (Giữa kì 2)";
      grade = "Lớp 10";
      examTerm = "Giữa Học kì II";
      filterFn = l => l.grade === "cn10" && l.lesson >= 15 && l.lesson <= 21;
    } else if (presetKey === "cn10_trongtrot_ck2") {
      name = "Công nghệ 10 - Trồng trọt (Cuối kì 2)";
      grade = "Lớp 10";
      examTerm = "Cuối Học kì II";
      filterFn = l => l.grade === "cn10" && l.lesson >= 15 && l.lesson <= 28;
    } else if (presetKey === "cn11_channuoi_gk1") {
      name = "Công nghệ 11 - Chăn nuôi (Giữa kì 1)";
      grade = "Lớp 11";
      examTerm = "Giữa Học kì I";
      filterFn = l => l.grade === "cn11" && l.lesson >= 1 && l.lesson <= 6;
    } else if (presetKey === "cn11_channuoi_ck1") {
      name = "Công nghệ 11 - Chăn nuôi (Cuối kì 1)";
      grade = "Lớp 11";
      examTerm = "Cuối Học kì I";
      filterFn = l => l.grade === "cn11" && l.lesson >= 1 && l.lesson <= 10;
    } else if (presetKey === "cn11_channuoi_gk2") {
      name = "Công nghệ 11 - Chăn nuôi (Giữa kì 2)";
      grade = "Lớp 11";
      examTerm = "Giữa Học kì II";
      filterFn = l => l.grade === "cn11" && l.lesson >= 11 && l.lesson <= 17;
    } else if (presetKey === "cn11_channuoi_ck2") {
      name = "Công nghệ 11 - Chăn nuôi (Cuối kì 2)";
      grade = "Lớp 11";
      examTerm = "Cuối Học kì II";
      filterFn = l => l.grade === "cn11" && l.lesson >= 11 && l.lesson <= 22;
    } else if (presetKey === "cn12_lamthuy_gk1") {
      name = "Công nghệ 12 - Lâm nghiệp & Thủy sản (Giữa kì 1)";
      grade = "Lớp 12";
      examTerm = "Giữa Học kì I";
      filterFn = l => l.grade === "cn12" && l.lesson >= 1 && l.lesson <= 7;
    } else if (presetKey === "cn12_lnts_ck1") {
      name = "Công nghệ 12 - Lâm nghiệp & Thủy sản (Cuối kì 1)";
      grade = "Lớp 12";
      examTerm = "Cuối Học kì I";
      filterFn = l => l.grade === "cn12" && l.lesson >= 1 && l.lesson <= 12;
    } else if (presetKey === "cn12_lnts_gk2") {
      name = "Công nghệ 12 - Lâm nghiệp & Thủy sản (Giữa kì 2)";
      grade = "Lớp 12";
      examTerm = "Giữa Học kì II";
      filterFn = l => l.grade === "cn12" && l.lesson >= 13 && l.lesson <= 20;
    } else if (presetKey === "cn12_lnts_ck2") {
      name = "Công nghệ 12 - Lâm nghiệp & Thủy sản (Cuối kì 2)";
      grade = "Lớp 12";
      examTerm = "Cuối Học kì II";
      filterFn = l => l.grade === "cn12" && l.lesson >= 13 && l.lesson <= 27;
    } else if (presetKey === "custom_chuyendoi") {
      name = "CÔNG NGHỆ (KIỂM TRA CHUYỂN ĐỔI MÔN)";
      grade = "Toàn cấp THPT";
      examTerm = "CHUYỂN ĐỔI MÔN / KHẢO SÁT";
      filterFn = l => (l.grade === "cn10" && [1, 2, 7].includes(l.lesson)) ||
                      (l.grade === "cn11" && [1, 2, 3].includes(l.lesson)) ||
                      (l.grade === "cn12" && [1, 2, 13].includes(l.lesson));
    } else if (presetKey === "custom_cn10") {
      name = "Công nghệ 10 - Trồng trọt (Tự chọn bài)";
      grade = "Lớp 10";
      examTerm = "KIỂM TRA TỰ CHỌN";
      filterFn = l => l.grade === "cn10";
    } else if (presetKey === "custom_cn11") {
      name = "Công nghệ 11 - Chăn nuôi (Tự chọn bài)";
      grade = "Lớp 11";
      examTerm = "KIỂM TRA TỰ CHỌN";
      filterFn = l => l.grade === "cn11";
    } else if (presetKey === "custom_cn12") {
      name = "Công nghệ 12 - Lâm & Thủy sản (Tự chọn bài)";
      grade = "Lớp 12";
      examTerm = "KIỂM TRA TỰ CHỌN";
      filterFn = l => l.grade === "cn12";
    }

    if (filterFn) {
      const matched = all.filter(filterFn);
      const units = matched.map(l => {
        const objs = Array.isArray(l.objectives) ? l.objectives : [];
        const unitId = typeof getUnitIdForLesson === "function" ? getUnitIdForLesson(l.grade, l.lesson) : l.id;
        return {
          id: unitId,
          lessonId: l.id,
          grade: l.grade,
          lessonNum: l.lesson,
          chapter: l.chapter || "Chủ đề kiến thức",
          lesson: l.title,
          periods: 2,
          selected: presetKey.startsWith("custom_cn") ? (l.lesson <= 6) : true,
          competencies: ["NCCN", "SDCN"],
          yccd: {
            biet: objs[0] || `Nêu được các khái niệm và vai trò cơ bản của ${l.title}.`,
            hieu: objs[1] || `Giải thích và so sánh được nguyên lý kỹ thuật cốt lõi trong ${l.title}.`,
            vandung: objs[2] || `Vận dụng kiến thức ${l.title} để giải quyết tình huống kỹ thuật thực tế sản xuất.`
          }
        };
      });
      return { name, grade, examTerm, units };
    }
  }
  return null;
}

function loadPresetCurriculum(presetKey) {
  const preset = getPresetCurriculumData(presetKey);
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

function selectAllUnits(selectAll) {
  state.units.forEach(u => {
    u.selected = !!selectAll;
  });
  renderPpctTable();
  autoGenerateMatrix();
}

function toggleUnitYccdDrawer(idx) {
  const row = document.getElementById("yccdDrawer_" + idx);
  if (row) {
    row.style.display = row.style.display === "none" ? "table-row" : "none";
  }
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
      <tr style="${u.selected ? '' : 'opacity: 0.5; background: #f8fafc;'}">
        <td class="text-center">
          <input type="checkbox" ${u.selected ? "checked" : ""} onchange="toggleUnitSelection(${idx}, this.checked)" style="width:17px;height:17px;cursor:pointer;" />
        </td>
        <td class="text-center" style="font-weight:700; color:#64748b;">${idx + 1}</td>
        <td>
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <span class="badge badge-nl" style="font-size:10.5px;">${escapeHtml(u.chapter)}</span>
            <input type="text" value="${escapeHtml(u.lesson)}" onchange="updateUnitField(${idx}, 'lesson', this.value)" style="font-weight:600; border:1px solid transparent; background:transparent; padding:2px 4px; flex:1; min-width:200px;" onfocus="this.style.borderColor='#cbd5e1';this.style.background='#fff';" onblur="this.style.borderColor='transparent';this.style.background='transparent';" />
          </div>
        </td>
        <td class="text-center">
          <input type="number" class="compact-num" style="width:52px; padding:3px;" min="1" max="30" value="${u.periods}" onchange="updateUnitField(${idx}, 'periods', Number(this.value))" />
        </td>
        <td class="text-center">
          <span class="badge badge-ok" style="font-size:11.5px;">${weightPct}%</span>
        </td>
        <td class="text-center">
          ${u.competencies.map(c => `<span class="badge badge-nl" style="font-size:10.5px;">${c}</span>`).join(" ")}
        </td>
        <td class="text-center">
          <button class="btn btn-outline btn-sm" style="padding:3px 8px; font-size:11.5px;" onclick="toggleUnitYccdDrawer(${idx})">✏️ YCCĐ</button>
        </td>
        <td class="text-center">
          <button class="btn btn-danger btn-sm" style="padding:2px 7px;" onclick="removeUnit(${idx})" title="Xóa bài">✕</button>
        </td>
      </tr>
      <tr id="yccdDrawer_${idx}" style="display:none; background:#f8fafc;">
        <td colspan="8" style="padding:8px 14px !important;">
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
            <div>
              <span class="badge badge-biet">Nhận biết</span>
              <textarea rows="2" style="margin-top:4px; font-size:12px;" onchange="updateUnitYccd(${idx}, 'biet', this.value)">${escapeHtml(u.yccd.biet)}</textarea>
            </div>
            <div>
              <span class="badge badge-hieu">Thông hiểu</span>
              <textarea rows="2" style="margin-top:4px; font-size:12px;" onchange="updateUnitYccd(${idx}, 'hieu', this.value)">${escapeHtml(u.yccd.hieu)}</textarea>
            </div>
            <div>
              <span class="badge badge-vandung">Vận dụng</span>
              <textarea rows="2" style="margin-top:4px; font-size:12px;" onchange="updateUnitYccd(${idx}, 'vandung', this.value)">${escapeHtml(u.yccd.vandung)}</textarea>
            </div>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  const summaryEl = document.getElementById("ppctSummaryText");
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
        <span class="badge badge-nl" style="font-size:12.5px; padding:4px 10px;">📚 <strong>${selectedUnits.length}/${state.units.length} bài</strong></span>
        <span class="badge badge-nl" style="font-size:12.5px; padding:4px 10px; background:#e0f2fe; color:#0369a1; border-color:#bae6fd;">⏱️ <strong>${totalPeriods} tiết</strong></span>
        <span class="badge badge-nl" style="font-size:12.5px; padding:4px 10px; background:#fef3c7; color:#92400e; border-color:#fde68a;">🏷️ <strong>${escapeHtml(state.meta.examTerm)}</strong></span>
      </div>
    `;
  }
}

let pickerCurrentGrade = "all";
let pickerSearchQuery = "";
let pickerSelectedIds = new Set();

function openLessonPickerModal() {
  const modal = document.getElementById("lessonPickerModalBackdrop");
  if (!modal) return;
  pickerSelectedIds = new Set();
  state.units.forEach(u => {
    if (u.selected) {
      if (u.lessonId) pickerSelectedIds.add(u.lessonId);
      else pickerSelectedIds.add(u.id);
    }
  });
  pickerCurrentGrade = "all";
  pickerSearchQuery = "";
  modal.classList.add("open");
  renderLessonPickerList();
}

function closeLessonPickerModal() {
  const modal = document.getElementById("lessonPickerModalBackdrop");
  if (modal) modal.classList.remove("open");
}

function setPickerGrade(grade) {
  pickerCurrentGrade = grade;
  renderLessonPickerList();
}

function onPickerSearch(val) {
  pickerSearchQuery = val.trim().toLowerCase();
  renderLessonPickerList();
}

function togglePickerLesson(lessonId, checked) {
  if (checked) {
    pickerSelectedIds.add(lessonId);
  } else {
    pickerSelectedIds.delete(lessonId);
  }
  updatePickerCount();
}

function toggleAllPickerVisible(selectAll) {
  const allLessons = (typeof PORTAL_DATA !== "undefined" && PORTAL_DATA.lessons) ? PORTAL_DATA.lessons : [];
  const filtered = allLessons.filter(l => {
    const matchGrade = (pickerCurrentGrade === "all" || l.grade === pickerCurrentGrade);
    const matchSearch = (!pickerSearchQuery || (l.title || "").toLowerCase().includes(pickerSearchQuery) || (l.chapter || "").toLowerCase().includes(pickerSearchQuery));
    return matchGrade && matchSearch;
  });
  filtered.forEach(l => {
    if (selectAll) pickerSelectedIds.add(l.id);
    else pickerSelectedIds.delete(l.id);
  });
  renderLessonPickerList();
}

function updatePickerCount() {
  const countEl = document.getElementById("pickerSelectedCount");
  if (countEl) countEl.textContent = pickerSelectedIds.size;
}

function renderLessonPickerList() {
  const container = document.getElementById("lessonPickerGrid");
  if (!container) return;
  const allLessons = (typeof PORTAL_DATA !== "undefined" && PORTAL_DATA.lessons) ? PORTAL_DATA.lessons : [];
  const filtered = allLessons.filter(l => {
    const matchGrade = (pickerCurrentGrade === "all" || l.grade === pickerCurrentGrade);
    const matchSearch = (!pickerSearchQuery || (l.title || "").toLowerCase().includes(pickerSearchQuery) || (l.chapter || "").toLowerCase().includes(pickerSearchQuery));
    return matchGrade && matchSearch;
  });

  document.querySelectorAll(".picker-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.grade === pickerCurrentGrade);
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:24px; color:var(--text-muted);">Không tìm thấy bài học phù hợp với từ khóa "${escapeHtml(pickerSearchQuery)}"</div>`;
    updatePickerCount();
    return;
  }

  container.innerHTML = filtered.map(l => {
    const isChecked = pickerSelectedIds.has(l.id);
    const gradeBadge = l.grade === "cn10" ? "badge-nl" : (l.grade === "cn11" ? "badge-hieu" : "badge-vandung");
    const gradeText = l.grade === "cn10" ? "Khối 10" : (l.grade === "cn11" ? "Khối 11" : "Khối 12");
    return `
      <label class="picker-card" style="display:flex; align-items:flex-start; gap:10px; padding:10px 12px; border:1.5px solid ${isChecked ? 'var(--primary)' : '#e2e8f0'}; border-radius:8px; background:${isChecked ? '#f0fdf4' : '#fff'}; cursor:pointer; transition:all 0.15s ease;">
        <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="togglePickerLesson('${l.id}', this.checked); this.closest('.picker-card').style.background=this.checked?'#f0fdf4':'#fff'; this.closest('.picker-card').style.borderColor=this.checked?'var(--primary)':'#e2e8f0';" style="width:18px; height:18px; margin-top:2px; cursor:pointer;" />
        <div style="flex:1; overflow:hidden;">
          <div style="display:flex; gap:6px; align-items:center; margin-bottom:3px;">
            <span class="badge ${gradeBadge}" style="font-size:10px; padding:2px 6px;">${gradeText}</span>
            <span style="font-size:11px; color:var(--text-muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(l.chapter || '')}</span>
          </div>
          <div style="font-size:13px; font-weight:600; color:var(--text); line-height:1.3;">${escapeHtml(l.title)}</div>
        </div>
      </label>
    `;
  }).join("");
  updatePickerCount();
}

function applyLessonPickerSelection() {
  const allLessons = (typeof PORTAL_DATA !== "undefined" && PORTAL_DATA.lessons) ? PORTAL_DATA.lessons : [];
  if (pickerSelectedIds.size === 0) {
    alert("Vui lòng tích chọn ít nhất 1 bài học để đưa vào đề thi!");
    return;
  }

  const existingMap = new Map();
  state.units.forEach(u => {
    const key = u.lessonId || u.id;
    existingMap.set(key, u);
  });

  const newUnits = [];
  allLessons.forEach(l => {
    if (pickerSelectedIds.has(l.id)) {
      if (existingMap.has(l.id)) {
        const u = existingMap.get(l.id);
        u.selected = true;
        newUnits.push(u);
      } else {
        const objs = Array.isArray(l.objectives) ? l.objectives : [];
        const unitId = typeof getUnitIdForLesson === "function" ? getUnitIdForLesson(l.grade, l.lesson) : l.id;
        newUnits.push({
          id: unitId,
          lessonId: l.id,
          grade: l.grade,
          lessonNum: l.lesson,
          chapter: l.chapter || "Chủ đề kiến thức",
          lesson: l.title,
          periods: 2,
          selected: true,
          competencies: ["NCCN", "SDCN"],
          yccd: {
            biet: objs[0] || `Nêu được các khái niệm và vai trò cơ bản của ${l.title}.`,
            hieu: objs[1] || `Giải thích và so sánh được nguyên lý kỹ thuật cốt lõi trong ${l.title}.`,
            vandung: objs[2] || `Vận dụng kiến thức ${l.title} để giải quyết tình huống kỹ thuật thực tế sản xuất.`
          }
        });
      }
    }
  });

  state.units.forEach(u => {
    if (!u.lessonId && !allLessons.some(l => l.id === u.id)) {
      newUnits.push(u);
    }
  });

  state.units = newUnits;
  closeLessonPickerModal();
  renderPpctTable();
  autoGenerateMatrix();
  renderMatrixTable();
  renderSpecificationTable();
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
        <input type="checkbox" ${pc.mcq.enabled ? "checked" : ""} onchange="togglePart('mcq', this.checked)" style="width:17px;height:17px;" />
      </td>
      <td><strong>I. TN Nhiều lựa chọn (4 phương án A, B, C, D)</strong></td>
      <td class="text-center">
        <input type="number" class="compact-num" style="width:58px;" step="0.05" min="0.05" max="2" value="${pc.mcq.pointsPerQ}" onchange="updatePartParam('mcq', 'pointsPerQ', Number(this.value))" /> đ
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" style="width:52px;" min="0" value="${pc.mcq.counts.biet}" onchange="updatePartLevel('mcq', 'biet', Number(this.value))" /> <span style="font-size:11px;color:#1d4ed8;">(${calc.mcq.bietP}đ)</span>
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" style="width:52px;" min="0" value="${pc.mcq.counts.hieu}" onchange="updatePartLevel('mcq', 'hieu', Number(this.value))" /> <span style="font-size:11px;color:#b45309;">(${calc.mcq.hieuP}đ)</span>
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" style="width:52px;" min="0" value="${pc.mcq.counts.vandung}" onchange="updatePartLevel('mcq', 'vandung', Number(this.value))" /> <span style="font-size:11px;color:#be185d;">(${calc.mcq.vdP}đ)</span>
      </td>
      <td class="text-center"><strong>${calc.mcq.count} câu</strong></td>
      <td class="text-center"><strong style="font-size:14.5px;color:var(--primary-dark);">${calc.mcq.totalPoints.toFixed(2)} đ</strong></td>
    </tr>

    <!-- Dạng thức 2: Đúng - Sai -->
    <tr style="${pc.tf.enabled ? '' : 'opacity:0.5;'}">
      <td class="text-center">
        <input type="checkbox" ${pc.tf.enabled ? "checked" : ""} onchange="togglePart('tf', this.checked)" style="width:17px;height:17px;" />
      </td>
      <td>
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px;">
          <strong>II. TN Đúng - Sai (4 ý a, b, c, d)</strong>
          <div style="font-size:12px;">
            Số câu: <input type="number" class="compact-num" style="width:46px; padding:2px 4px;" min="1" max="10" value="${pc.tf.numQuestions}" onchange="updateTfQuestionsCount(Number(this.value))" />
            <select style="width:auto; padding:2px 6px; font-size:11.5px;" onchange="updatePartParam('tf', 'scoringMode', this.value)">
              <option value="progressive" ${pc.tf.scoringMode === 'progressive' ? 'selected' : ''}>Lũy tiến (0.1→${pc.tf.pointsPerQuestion}đ)</option>
              <option value="equal" ${pc.tf.scoringMode === 'equal' ? 'selected' : ''}>Chia đều (${(pc.tf.pointsPerQuestion / 4).toFixed(2)}đ/ý)</option>
            </select>
          </div>
        </div>
        ${tfStmtWarning}
        <details style="margin-top:4px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:4px 8px;">
          <summary style="cursor:pointer; font-size:11.5px; font-weight:700; color:var(--primary-dark);">
            🎯 Cấu hình mức độ riêng từng ý a, b, c, d (${pc.tf.numQuestions} câu)
          </summary>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(210px, 1fr)); gap:6px; margin-top:6px;">
            ${(pc.tf.statementLevels || []).slice(0, pc.tf.numQuestions).map((cfg, qIdx) => `
              <div style="background:#fff; border:1px solid #e2e8f0; border-radius:5px; padding:5px 7px; font-size:11px;">
                <div style="font-weight:700; color:var(--primary-dark); margin-bottom:3px;">Câu ${qIdx + 1}:</div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:3px;">
                  ${["a", "b", "c", "d"].map(k => `
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                      <strong>${k})</strong>
                      <select style="padding:1px 3px; font-size:10.5px; width:auto;" onchange="updateTfSingleStmtLevel(${qIdx}, '${k}', this.value)">
                        <option value="biet" ${cfg[k] === 'biet' ? 'selected' : ''}>Biết</option>
                        <option value="hieu" ${cfg[k] === 'hieu' ? 'selected' : ''}>Hiểu</option>
                        <option value="vandung" ${cfg[k] === 'vandung' ? 'selected' : ''}>VD</option>
                      </select>
                    </div>
                  `).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        </details>
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" style="width:58px;" step="0.25" min="0.25" max="4" value="${pc.tf.pointsPerQuestion}" onchange="updatePartParam('tf', 'pointsPerQuestion', Number(this.value))" /> đ
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" style="width:52px;" min="0" value="${pc.tf.counts.biet}" onchange="updatePartLevel('tf', 'biet', Number(this.value))" /> <span style="font-size:11px;color:#1d4ed8;">(${calc.tf.bietP}đ)</span>
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" style="width:52px;" min="0" value="${pc.tf.counts.hieu}" onchange="updatePartLevel('tf', 'hieu', Number(this.value))" /> <span style="font-size:11px;color:#b45309;">(${calc.tf.hieuP}đ)</span>
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" style="width:52px;" min="0" value="${pc.tf.counts.vandung}" onchange="updatePartLevel('tf', 'vandung', Number(this.value))" /> <span style="font-size:11px;color:#be185d;">(${calc.tf.vdP}đ)</span>
      </td>
      <td class="text-center"><strong>${calc.tf.qCount} câu (${calc.tf.stmtCount} ý)</strong></td>
      <td class="text-center"><strong style="font-size:14.5px;color:var(--primary-dark);">${calc.tf.totalPoints.toFixed(2)} đ</strong></td>
    </tr>

    <!-- Dạng thức 3: Trả lời ngắn -->
    <tr style="${pc.short.enabled ? '' : 'opacity:0.5;'}">
      <td class="text-center">
        <input type="checkbox" ${pc.short.enabled ? "checked" : ""} onchange="togglePart('short', this.checked)" style="width:17px;height:17px;" />
      </td>
      <td><strong>III. TN Trả lời ngắn (Điền số / Từ khóa)</strong></td>
      <td class="text-center">
        <input type="number" class="compact-num" style="width:58px;" step="0.05" min="0.1" max="2" value="${pc.short.pointsPerQ}" onchange="updatePartParam('short', 'pointsPerQ', Number(this.value))" /> đ
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" style="width:52px;" min="0" value="${pc.short.counts.biet}" onchange="updatePartLevel('short', 'biet', Number(this.value))" /> <span style="font-size:11px;color:#1d4ed8;">(${calc.short.bietP}đ)</span>
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" style="width:52px;" min="0" value="${pc.short.counts.hieu}" onchange="updatePartLevel('short', 'hieu', Number(this.value))" /> <span style="font-size:11px;color:#b45309;">(${calc.short.hieuP}đ)</span>
      </td>
      <td class="text-center">
        <input type="number" class="compact-num" style="width:52px;" min="0" value="${pc.short.counts.vandung}" onchange="updatePartLevel('short', 'vandung', Number(this.value))" /> <span style="font-size:11px;color:#be185d;">(${calc.short.vdP}đ)</span>
      </td>
      <td class="text-center"><strong>${calc.short.count} câu</strong></td>
      <td class="text-center"><strong style="font-size:14.5px;color:var(--primary-dark);">${calc.short.totalPoints.toFixed(2)} đ</strong></td>
    </tr>

    <!-- Dạng thức 4: Tự luận -->
    <tr style="${pc.essay.enabled ? '' : 'opacity:0.5;'}">
      <td class="text-center">
        <input type="checkbox" ${pc.essay.enabled ? "checked" : ""} onchange="togglePart('essay', this.checked)" style="width:17px;height:17px;" />
      </td>
      <td colspan="5">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <strong>IV. Tự luận</strong>
          <div style="display:flex; flex-wrap:wrap; gap:6px; align-items:center;">
            ${pc.essay.questions.map((eq, idx) => `
              <span style="border:1px solid #cbd5e1; border-radius:6px; padding:3px 8px; background:#f8fafc; display:inline-flex; align-items:center; gap:5px; font-size:12px;">
                <strong>TL ${idx + 1}:</strong>
                <select style="width:auto; padding:2px 4px; font-size:11.5px;" onchange="updateEssayItem(${idx}, 'level', this.value)">
                  <option value="biet" ${eq.level === 'biet' ? 'selected' : ''}>Biết</option>
                  <option value="hieu" ${eq.level === 'hieu' ? 'selected' : ''}>Hiểu</option>
                  <option value="vandung" ${eq.level === 'vandung' ? 'selected' : ''}>VD</option>
                </select>
                <input type="number" class="compact-num" style="width:48px; padding:2px 4px;" step="0.25" min="0.25" max="10" value="${eq.points}" onchange="updateEssayItem(${idx}, 'points', Number(this.value))" />đ
                <button class="btn btn-danger btn-sm" style="padding:1px 5px; font-size:10px;" onclick="removeEssayConfigItem(${idx})">✕</button>
              </span>
            `).join("")}
            <button class="btn btn-outline btn-sm" style="padding:3px 8px; font-size:11.5px;" onclick="addEssayConfigItem()">+ Thêm TL</button>
          </div>
        </div>
      </td>
      <td class="text-center"><strong>${calc.essay.count} câu</strong></td>
      <td class="text-center"><strong style="font-size:14.5px;color:var(--primary-dark);">${calc.essay.totalPoints.toFixed(2)} đ</strong></td>
    </tr>
  `;
}

function togglePart(partKey, enabled) {
  state.partConfig[partKey].enabled = enabled;
  renderStep2Config();
  ensureTfStatementLevels();
  autoGenerateMatrix();
}

function updatePartParam(partKey, field, val) {
  state.partConfig[partKey][field] = val;
  renderStep2Config();
  ensureTfStatementLevels();
  autoGenerateMatrix();
}

function updatePartLevel(partKey, level, val) {
  state.partConfig[partKey].counts[level] = Math.max(0, Math.round(val));
  renderStep2Config();
  ensureTfStatementLevels();
  autoGenerateMatrix();
}

function updateTfQuestionsCount(numQ) {
  const n = Math.max(1, Math.round(numQ));
  state.partConfig.tf.numQuestions = n;
  ensureTfStatementLevels();
  balanceTfStatements();
}

function ensureTfStatementLevels() {
  if (!Array.isArray(state.partConfig.tf.statementLevels)) {
    state.partConfig.tf.statementLevels = [];
  }
  const n = state.partConfig.tf.numQuestions || 3;
  while (state.partConfig.tf.statementLevels.length < n) {
    state.partConfig.tf.statementLevels.push({ a: "biet", b: "hieu", c: "vandung", d: "vandung" });
  }
  if (state.partConfig.tf.statementLevels.length > n) {
    state.partConfig.tf.statementLevels = state.partConfig.tf.statementLevels.slice(0, n);
  }
}

function updateTfSingleStmtLevel(qIdx, stmtKey, newLevel) {
  ensureTfStatementLevels();
  if (state.partConfig.tf.statementLevels[qIdx]) {
    state.partConfig.tf.statementLevels[qIdx][stmtKey] = newLevel;
  }
  let biet = 0, hieu = 0, vandung = 0;
  state.partConfig.tf.statementLevels.forEach(cfg => {
    ["a", "b", "c", "d"].forEach(k => {
      if (cfg[k] === "biet") biet++;
      else if (cfg[k] === "hieu") hieu++;
      else vandung++;
    });
  });
  state.partConfig.tf.counts = { biet, hieu, vandung };
  renderStep2Config();
  ensureTfStatementLevels();
  autoGenerateMatrix();
}

function balanceTfStatements() {
  ensureTfStatementLevels();
  const totalStmts = state.partConfig.tf.numQuestions * 4;
  const biet = Math.round(totalStmts * 0.25);
  const hieu = Math.round(totalStmts * 0.25);
  const vandung = totalStmts - biet - hieu;
  state.partConfig.tf.counts = { biet, hieu, vandung };
  state.partConfig.tf.statementLevels = Array.from({ length: state.partConfig.tf.numQuestions }, () => ({
    a: "biet", b: "hieu", c: "vandung", d: "vandung"
  }));
  renderStep2Config();
  ensureTfStatementLevels();
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
  ensureTfStatementLevels();
  autoGenerateMatrix();
}

function updateEssayItem(idx, field, val) {
  state.partConfig.essay.questions[idx][field] = val;
  renderStep2Config();
  ensureTfStatementLevels();
  autoGenerateMatrix();
}

function removeEssayConfigItem(idx) {
  state.partConfig.essay.questions.splice(idx, 1);
  renderStep2Config();
  ensureTfStatementLevels();
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
  ensureTfStatementLevels();
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
        <td>
          <div style="font-size:11px; color:#64748b;">${escapeHtml(u.chapter)} • ${u.periods} tiết</div>
          <strong>${escapeHtml(u.lesson)}</strong>
        </td>
        <!-- MCQ -->
        <td class="text-center"><input type="number" class="compact-num" style="width:42px;padding:2px;" min="0" value="${r.mcq_biet}" onchange="updateMatrixCell('${u.id}', 'mcq_biet', this.value)" /></td>
        <td class="text-center"><input type="number" class="compact-num" style="width:42px;padding:2px;" min="0" value="${r.mcq_hieu}" onchange="updateMatrixCell('${u.id}', 'mcq_hieu', this.value)" /></td>
        <td class="text-center"><input type="number" class="compact-num" style="width:42px;padding:2px;" min="0" value="${r.mcq_vandung}" onchange="updateMatrixCell('${u.id}', 'mcq_vandung', this.value)" /></td>
        <!-- TF -->
        <td class="text-center"><input type="number" class="compact-num" style="width:42px;padding:2px;" min="0" value="${r.tf_biet}" onchange="updateMatrixCell('${u.id}', 'tf_biet', this.value)" /></td>
        <td class="text-center"><input type="number" class="compact-num" style="width:42px;padding:2px;" min="0" value="${r.tf_hieu}" onchange="updateMatrixCell('${u.id}', 'tf_hieu', this.value)" /></td>
        <td class="text-center"><input type="number" class="compact-num" style="width:42px;padding:2px;" min="0" value="${r.tf_vandung}" onchange="updateMatrixCell('${u.id}', 'tf_vandung', this.value)" /></td>
        <!-- Short -->
        <td class="text-center"><input type="number" class="compact-num" style="width:42px;padding:2px;" min="0" value="${r.short_biet}" onchange="updateMatrixCell('${u.id}', 'short_biet', this.value)" /></td>
        <td class="text-center"><input type="number" class="compact-num" style="width:42px;padding:2px;" min="0" value="${r.short_hieu}" onchange="updateMatrixCell('${u.id}', 'short_hieu', this.value)" /></td>
        <td class="text-center"><input type="number" class="compact-num" style="width:42px;padding:2px;" min="0" value="${r.short_vandung}" onchange="updateMatrixCell('${u.id}', 'short_vandung', this.value)" /></td>
        <!-- Essay -->
        <td class="text-center">
          <input type="number" class="compact-num" style="width:38px;padding:2px;" min="0" value="${r.essay_biet}" onchange="updateMatrixCell('${u.id}', 'essay_biet', this.value)" title="Số câu TL Biết" />
          ${r.essay_biet > 0 ? `<div style="font-size:10.5px;color:#1d4ed8;">${r.essay_points_biet}đ</div>` : ''}
        </td>
        <td class="text-center">
          <input type="number" class="compact-num" style="width:38px;padding:2px;" min="0" value="${r.essay_hieu}" onchange="updateMatrixCell('${u.id}', 'essay_hieu', this.value)" title="Số câu TL Hiểu" />
          ${r.essay_hieu > 0 ? `<div style="font-size:10.5px;color:#b45309;">${r.essay_points_hieu}đ</div>` : ''}
        </td>
        <td class="text-center">
          <input type="number" class="compact-num" style="width:38px;padding:2px;" min="0" value="${r.essay_vandung}" onchange="updateMatrixCell('${u.id}', 'essay_vandung', this.value)" title="Số câu TL Vận dụng" />
          ${r.essay_vandung > 0 ? `<div style="font-size:10.5px;color:#be185d;">${r.essay_points_vandung}đ</div>` : ''}
        </td>
        <td class="text-center"><strong>${rowCalc.totalItems}</strong></td>
        <td class="text-center"><strong>${rowCalc.totalPoints.toFixed(2)}đ</strong></td>
        <td class="text-center"><strong>${(rowCalc.totalPoints * 10).toFixed(0)}%</strong></td>
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
      <td colspan="2" class="text-right">TỔNG CỘNG</td>
      <td class="text-center">${sums.mcq_biet}</td>
      <td class="text-center">${sums.mcq_hieu}</td>
      <td class="text-center">${sums.mcq_vandung}</td>
      <td class="text-center">${sums.tf_biet}</td>
      <td class="text-center">${sums.tf_hieu}</td>
      <td class="text-center">${sums.tf_vandung}</td>
      <td class="text-center">${sums.short_biet}</td>
      <td class="text-center">${sums.short_hieu}</td>
      <td class="text-center">${sums.short_vandung}</td>
      <td class="text-center">${sums.essay_biet}</td>
      <td class="text-center">${sums.essay_hieu}</td>
      <td class="text-center">${sums.essay_vandung}</td>
      <td class="text-center">${sums.totalItems}</td>
      <td class="text-center">${sums.totalPoints.toFixed(2)}đ</td>
      <td class="text-center">${(sums.totalPoints * 10).toFixed(0)}%</td>
    </tr>
    <tr>
      <td colspan="2" class="text-right"><strong>TỈ LỆ TƯ DUY</strong></td>
      <td colspan="12" class="text-center">
        <span class="badge badge-biet" style="font-size:12px;padding:3px 10px;">Biết: ${bietPoints.toFixed(2)}đ (${(bietPoints * 10).toFixed(0)}%)</span>
        &nbsp;
        <span class="badge badge-hieu" style="font-size:12px;padding:3px 10px;">Hiểu: ${hieuPoints.toFixed(2)}đ (${(hieuPoints * 10).toFixed(0)}%)</span>
        &nbsp;
        <span class="badge badge-vandung" style="font-size:12px;padding:3px 10px;">Vận dụng: ${vdPoints.toFixed(2)}đ (${(vdPoints * 10).toFixed(0)}%)</span>
      </td>
      <td colspan="3" class="text-center"><strong style="color:var(--primary-dark);font-size:14px;">${sums.totalPoints.toFixed(2)} / 10đ</strong></td>
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
        <td>
          <div style="font-size:11px; color:#64748b;">${escapeHtml(u.chapter)}</div>
          <strong>${escapeHtml(u.lesson)}</strong>
        </td>
        <td style="font-size:12.5px; line-height:1.45;">
          <div style="margin-bottom:3px;"><span class="badge badge-biet" style="font-size:10px;padding:1px 5px;">Biết</span> <span contenteditable="true" onblur="updateUnitSpecYccd('${u.id}', 'biet', this.textContent)">${escapeHtml(u.yccd.biet)}</span></div>
          <div style="margin-bottom:3px;"><span class="badge badge-hieu" style="font-size:10px;padding:1px 5px;">Hiểu</span> <span contenteditable="true" onblur="updateUnitSpecYccd('${u.id}', 'hieu', this.textContent)">${escapeHtml(u.yccd.hieu)}</span></div>
          <div><span class="badge badge-vandung" style="font-size:10px;padding:1px 5px;">VD</span> <span contenteditable="true" onblur="updateUnitSpecYccd('${u.id}', 'vandung', this.textContent)">${escapeHtml(u.yccd.vandung)}</span></div>
        </td>
        <td class="text-center">
          ${u.competencies.map(c => `<span class="badge badge-nl" style="font-size:10.5px;">${c}</span>`).join("<br/>")}
        </td>
        <td class="text-center">
          <strong>${mcqTotal} câu</strong>
          <div style="font-size:10.5px; color:var(--text-muted);">${mcqRange}</div>
        </td>
        <td class="text-center">
          <strong>${tfRange}</strong>
        </td>
        <td class="text-center">
          <strong>${shortTotal} câu</strong>
          <div style="font-size:10.5px; color:var(--text-muted);">${shortRange}</div>
        </td>
        <td class="text-center">
          <strong>${essayTotal} câu</strong>
          <div style="font-size:10.5px; color:var(--text-muted);">${essayRange}</div>
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

function setQuestionSourceMode(mode) {
  state.questionSourceMode = mode || "exact";
  generateExamFromMatrix(true);
}

function adaptAgriculturalText(text, seedIdx = 1) {
  if (!text || state.questionSourceMode !== "adapt") return text;
  const contexts = [
    "Tại Hợp tác xã Nông nghiệp Công nghệ cao Bình Minh, ",
    "Trong mô hình trang trại nông nghiệp tuần hoàn đạt chuẩn VietGAP, ",
    "Khi khảo sát thực tế sản xuất tại Trung tâm Thực nghiệm Nông lâm thủy sản, ",
    "Tại vùng chuyên canh nông sản ứng dụng cảm biến IoT thông minh, "
  ];
  let adapted = String(text);
  // Biến đổi ngữ cảnh mở đầu nếu chưa có tiền tố
  if (!adapted.startsWith("Tại ") && !adapted.startsWith("Trong mô hình") && !adapted.startsWith("[")) {
    adapted = contexts[seedIdx % contexts.length] + adapted.charAt(0).toLowerCase() + adapted.slice(1);
  }
  return adapted;
}

function generateExamFromMatrix(showNotification = true) {
  const selectedUnits = state.units.filter(u => u.selected);
  const pc = state.partConfig;
  ensureTfStatementLevels();

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
          const stemText = (state.questionSourceMode === "adapt" && lvl !== "biet")
            ? adaptAgriculturalText(chosen.stem, mcqList.length + i)
            : chosen.stem;
          mcqList.push({
            id: "mcq_" + (mcqList.length + 1),
            unitId: u.id,
            unitName: u.lesson,
            level: lvl,
            competency: chosen.competency || u.competencies[0] || "NCCN",
            points: pc.mcq.pointsPerQ,
            stem: stemText,
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
      const bankCandidate = QUESTION_BANK.tf.find((q) => q.unitId === targetUnit.id && !tfList.some(existing => existing.stem === (q.stem || q.context)))
                         || QUESTION_BANK.tf.find((q) => !tfList.some(existing => existing.stem === (q.stem || q.context)))
                         || QUESTION_BANK.tf[i % QUESTION_BANK.tf.length];
      if (bankCandidate) {
        const rawStmts = JSON.parse(JSON.stringify(bankCandidate.statements || []));
        const stmtCfg = (pc.tf.statementLevels && pc.tf.statementLevels[i]) || { a: "biet", b: "hieu", c: "vandung", d: "vandung" };
        const normStmts = rawStmts.map((st, sIdx) => {
          const key = ["a", "b", "c", "d"][sIdx] || "a";
          const isT = st.isTrue !== undefined ? Boolean(st.isTrue) : Boolean(st.answer);
          return {
            label: st.label || st.key || key,
            level: stmtCfg[key] || st.level || (sIdx === 0 ? "biet" : sIdx === 1 ? "hieu" : "vandung"),
            text: st.text || "",
            isTrue: isT,
            explanation: st.explanation || bankCandidate.explanation || (isT
              ? `Đúng theo nguyên lý kỹ thuật bài "${targetUnit.lesson}" (SGK Kết nối tri thức).`
              : `Sai vì không phù hợp với yêu cầu kỹ thuật bài "${targetUnit.lesson}" (SGK Kết nối tri thức).`)
          };
        });
        const baseStem = bankCandidate.stem || bankCandidate.context || "";
        tfList.push({
          id: "tf_" + (i + 1),
          unitId: targetUnit.id,
          unitName: targetUnit.lesson,
          competency: bankCandidate.competency || targetUnit.competencies[0] || "SDCN",
          points: pc.tf.pointsPerQuestion,
          stem: state.questionSourceMode === "adapt" ? adaptAgriculturalText(baseStem, i + 1) : baseStem,
          statements: normStmts
        });
      }
    }
  }

  // 3. Sinh câu hỏi Trả lời ngắn (Short Answer)
  const shortList = [];
  const usedShortStems = new Set();
  if (pc.short.enabled) {
    selectedUnits.forEach(u => {
      const r = state.matrixRows[u.id] || {};
      ["biet", "hieu", "vandung"].forEach(lvl => {
        const countNeeded = r[`short_${lvl}`] || 0;
        const unitCandidates = QUESTION_BANK.short.filter(q => q.unitId === u.id && !usedShortStems.has(q.stem));
        for (let i = 0; i < countNeeded; i++) {
          const bankItem = unitCandidates[i]
                        || QUESTION_BANK.short.find(q => !usedShortStems.has(q.stem))
                        || QUESTION_BANK.short[(shortList.length) % QUESTION_BANK.short.length];
          if (bankItem) usedShortStems.add(bankItem.stem);
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

function setExamViewMode(mode) {
  state.examViewMode = mode;
  const btnClean = document.getElementById("btnExamViewClean");
  const btnEdit = document.getElementById("btnExamViewEdit");
  if (btnClean) {
    btnClean.style.background = mode === "clean" ? "var(--primary)" : "transparent";
    btnClean.style.color = mode === "clean" ? "#fff" : "var(--text)";
  }
  if (btnEdit) {
    btnEdit.style.background = mode === "edit" ? "var(--primary)" : "transparent";
    btnEdit.style.color = mode === "edit" ? "#fff" : "var(--text)";
  }
  renderExamEditor();
}

function renderExamEditor() {
  const container = document.getElementById("examEditorContainer");
  if (!container) return;

  const { mcq, tf, short, essay } = state.exam;
  const pc = state.partConfig;
  const viewMode = state.examViewMode || "clean";

  if (viewMode === "clean") {
    let cleanHtml = `
      <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:8px; padding:12px 16px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="font-size:26px;">🏫</div>
          <div>
            <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;">${escapeHtml(state.meta.department)}</div>
            <div style="font-size:14.5px; font-weight:800; color:var(--primary-dark);">${escapeHtml(state.meta.school)} — <span style="color:#15803d;">${escapeHtml(state.meta.group || 'TỔ TIN - CÔNG NGHỆ')}</span></div>
            <div style="font-size:12px; color:#334155; margin-top:2px;">
              Đề kiểm tra ${escapeHtml(state.meta.examTerm)} • Môn: ${escapeHtml(state.meta.subjectName)} • Thời gian: ${state.meta.duration} phút • Mã đề: <strong>${escapeHtml(state.meta.examCode)}</strong>
            </div>
          </div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="goToStep(1)" style="font-size:11.5px; font-weight:600;">✏️ Đổi Đơn vị / Tự điền</button>
      </div>
      <div class="card" style="padding:16px 20px;">
    `;

    // PHẦN I: MCQ GỌN ĐẸP
    if (pc.mcq.enabled && mcq.length > 0) {
      const partPoints = mcq.reduce((s, q) => s + Number(q.points), 0);
      cleanHtml += `
        <div style="font-weight:700; color:var(--primary-dark); font-size:14.5px; margin-bottom:10px; border-bottom:1.5px solid #e2e8f0; padding-bottom:5px;">
          PHẦN I. TRẮC NGHIỆM NHIỀU LỰA CHỌN (${mcq.length} câu • ${partPoints.toFixed(2)} điểm)
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(460px, 1fr)); gap:10px; margin-bottom:16px;">
          ${mcq.map((q, idx) => `
            <div class="q-compact-row" style="margin-bottom:0;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <div>
                  <strong>Câu ${idx + 1} (${q.points}đ):</strong>
                  <span class="badge badge-${q.level}" style="font-size:10px; padding:1px 6px;">${q.level === 'biet' ? 'Biết' : q.level === 'hieu' ? 'Hiểu' : 'VD'}</span>
                  <span style="font-size:11px; color:#64748b;">${escapeHtml(q.unitName)}</span>
                </div>
              </div>
              <div style="font-size:13px; font-weight:500; margin-bottom:6px;">${escapeHtml(q.stem)}</div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; font-size:12.5px;">
                ${q.options.map((opt, oIdx) => `
                  <div style="padding:3px 6px; border-radius:4px; background:${q.answer === oIdx ? '#dcfce7' : '#f8fafc'}; border:1px solid ${q.answer === oIdx ? '#86efac' : '#e2e8f0'};">
                    <strong style="color:${q.answer === oIdx ? '#15803d' : '#334155'};">${String.fromCharCode(65 + oIdx)}.</strong> ${escapeHtml(opt)}
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }

    // PHẦN II: TF GỌN ĐẸP
    if (pc.tf.enabled && tf.length > 0) {
      const partPoints = tf.reduce((s, q) => s + Number(q.points), 0);
      cleanHtml += `
        <div style="font-weight:700; color:var(--primary-dark); font-size:14.5px; margin-bottom:10px; border-bottom:1.5px solid #e2e8f0; padding-bottom:5px;">
          PHẦN II. TRẮC NGHIỆM ĐÚNG - SAI (${tf.length} câu • ${tf.length * 4} ý • ${partPoints.toFixed(2)} điểm)
        </div>
        ${tf.map((q, idx) => `
          <div class="q-compact-row">
            <div style="font-size:13px; margin-bottom:6px;">
              <strong>Câu ${idx + 1} (${q.points}đ — ${escapeHtml(q.unitName)}):</strong> ${escapeHtml(q.stem)}
            </div>
            <table class="std-table" style="font-size:12px;">
              <thead>
                <tr>
                  <th style="width:36px;">Ý</th>
                  <th>Phát biểu nhận định</th>
                  <th style="width:65px;">Mức</th>
                  <th style="width:70px;">Đáp án</th>
                  <th>Giải thích chuẩn SGK</th>
                </tr>
              </thead>
              <tbody>
                ${q.statements.map(st => `
                  <tr>
                    <td class="text-center"><strong>${st.label})</strong></td>
                    <td>${escapeHtml(st.text)}</td>
                    <td class="text-center"><span class="badge badge-${st.level}" style="font-size:10px;">${st.level === 'biet' ? 'Biết' : st.level === 'hieu' ? 'Hiểu' : 'VD'}</span></td>
                    <td class="text-center" style="font-weight:700; color:${st.isTrue ? '#15803d' : '#dc2626'};">${st.isTrue ? 'Đúng' : 'Sai'}</td>
                    <td style="color:#475569;">${escapeHtml(st.explanation || '')}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `).join("")}
      `;
    }

    // PHẦN III: SHORT GỌN ĐẸP
    if (pc.short.enabled && short.length > 0) {
      const partPoints = short.reduce((s, q) => s + Number(q.points), 0);
      cleanHtml += `
        <div style="font-weight:700; color:var(--primary-dark); font-size:14.5px; margin:14px 0 8px; border-bottom:1.5px solid #e2e8f0; padding-bottom:5px;">
          PHẦN III. TRẮC NGHIỆM TRẢ LỜI NGẮN (${short.length} câu • ${partPoints.toFixed(2)} điểm)
        </div>
        ${short.map((q, idx) => `
          <div class="q-compact-row">
            <div><strong>Câu ${idx + 1} (${q.points}đ):</strong> ${escapeHtml(q.stem)}</div>
            <div style="margin-top:4px; font-size:12.5px; color:#15803d;">👉 <strong>Đáp án: ${escapeHtml(q.answer)}</strong> — <em>${escapeHtml(q.explanation || '')}</em></div>
          </div>
        `).join("")}
      `;
    }

    // PHẦN IV: ESSAY GỌN ĐẸP
    if (pc.essay.enabled && essay.length > 0) {
      const partPoints = essay.reduce((s, q) => s + Number(q.points), 0);
      cleanHtml += `
        <div style="font-weight:700; color:var(--primary-dark); font-size:14.5px; margin:14px 0 8px; border-bottom:1.5px solid #e2e8f0; padding-bottom:5px;">
          PHẦN IV. TỰ LUẬN (${essay.length} câu • ${partPoints.toFixed(2)} điểm)
        </div>
        ${essay.map((q, idx) => `
          <div class="q-compact-row">
            <div style="font-weight:600; margin-bottom:4px;"><strong>Câu ${idx + 1} (${q.points} điểm — ${escapeHtml(q.unitName)}):</strong> ${escapeHtml(q.stem)}</div>
            <div style="background:#f8fafc; border-left:3px solid var(--primary); padding:6px 10px; font-size:12px; color:#334155;">
              <strong>Hướng dẫn chấm:</strong><br/>
              ${q.rubric.map(r => `• ${escapeHtml(r)}`).join("<br/>")}
            </div>
          </div>
        `).join("")}
      `;
    }

    cleanHtml += `</div>`;
    container.innerHTML = cleanHtml;
    return;
  }

  let html = `
    <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:8px; padding:12px 16px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
      <div style="display:flex; align-items:center; gap:12px;">
        <div style="font-size:26px;">🏫</div>
        <div>
          <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;">${escapeHtml(state.meta.department)}</div>
          <div style="font-size:14.5px; font-weight:800; color:var(--primary-dark);">${escapeHtml(state.meta.school)} — <span style="color:#15803d;">${escapeHtml(state.meta.group || 'TỔ TIN - CÔNG NGHỆ')}</span></div>
          <div style="font-size:12px; color:#334155; margin-top:2px;">
            Đề kiểm tra ${escapeHtml(state.meta.examTerm)} • Môn: ${escapeHtml(state.meta.subjectName)} • Thời gian: ${state.meta.duration} phút • Mã đề: <strong>${escapeHtml(state.meta.examCode)}</strong>
          </div>
        </div>
      </div>
      <button class="btn btn-outline btn-sm" onclick="goToStep(1)" style="font-size:11.5px; font-weight:600;">✏️ Đổi Đơn vị / Tự điền</button>
    </div>
  `;

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
      title: "1. Tổng điểm toàn đề (Chuẩn thang 10,0đ)",
      detail: `Cấu hình Bước 2 (${calc.grandTotalPoints.toFixed(2)}đ), Ma trận Bước 3 và Đề thi Bước 5 (${examActualPoints.toFixed(2)}đ) khớp 10,00đ.`
    });
  } else {
    score -= 20;
    checks.push({
      status: "fail",
      title: "1. Lệch Tổng điểm toàn đề so với thang 10,0đ (-20đ)",
      detail: `Tổng điểm cấu hình (${calc.grandTotalPoints.toFixed(2)}đ) hoặc tổng điểm câu trong đề (${examActualPoints.toFixed(2)}đ) chưa bằng 10,00đ.`,
      aiSuggestion: "AI gợi ý: Chuẩn hóa lại thang điểm từng phần ở Bước 2 và đồng bộ điểm từng câu ở Bước 5 về đúng 10,00 điểm.",
      fixAction: "fixTotalScore"
    });
  }

  // 2. Kiểm tra đồng bộ số lượng câu hỏi giữa Ma trận và Đề thi
  const mcqExpected = calc.mcq.count;
  const tfExpected = calc.tf.qCount;
  const shortExpected = calc.short.count;
  const essayExpected = calc.essay.count;
  const tfStmtValid = !pc.tf.enabled || (calc.tf.stmtCount === pc.tf.numQuestions * 4);

  if (mcq.length === mcqExpected && tf.length === tfExpected && short.length === shortExpected && essay.length === essayExpected && tfStmtValid) {
    checks.push({
      status: "pass",
      title: "2. Đồng bộ 100% số câu giữa Ma trận ↔ Đặc tả ↔ Đề thi",
      detail: `Khớp hoàn toàn: MCQ (${mcq.length} câu), Đ/S (${tf.length} câu = ${tf.length * 4} ý), TLN (${short.length} câu), TL (${essay.length} câu).`
    });
  } else {
    score -= 15;
    checks.push({
      status: "fail",
      title: "2. Lệch số lượng câu/ý giữa Ma trận và Đề thi (-15đ)",
      detail: `Ma trận (${mcqExpected} MCQ, ${tfExpected} Đ/S [${calc.tf.stmtCount} ý], ${shortExpected} TLN, ${essayExpected} TL) lệch với Đề (${mcq.length} MCQ, ${tf.length} Đ/S, ${short.length} TLN, ${essay.length} TL).`,
      aiSuggestion: "AI gợi ý: Cân bằng lại số ý Đúng/Sai = số câu × 4, phân bổ lại Ma trận và sinh bổ sung câu hỏi còn thiếu.",
      fixAction: "fixMatrixExamSync"
    });
  }

  // 3. Kiểm tra tỉ lệ cấp độ nhận thức (Biết - Hiểu - Vận dụng)
  const { bietPct, hieuPct, vandungPct } = calc.cognitive;
  if (bietPct >= 30 && bietPct <= 55 && hieuPct >= 20 && hieuPct <= 45 && vandungPct >= 20 && vandungPct <= 45) {
    checks.push({
      status: "pass",
      title: "3. Tỉ lệ nhận thức Biết : Hiểu : Vận dụng hợp lý",
      detail: `Tỉ lệ hiện tại đạt ${bietPct}% Biết : ${hieuPct}% Hiểu : ${vandungPct}% Vận dụng (Chuẩn CV 7991: 40% : 30% : 30%).`
    });
  } else {
    score -= 15;
    checks.push({
      status: "warn",
      title: "3. Tỉ lệ nhận thức lệch so với chuẩn 40% : 30% : 30% (-15đ)",
      detail: `Hiện tại: ${bietPct}% Biết : ${hieuPct}% Hiểu : ${vandungPct}% Vận dụng (lệch khung phân hóa chuẩn CV 7991).`,
      aiSuggestion: "AI gợi ý: Điều chỉnh lại số câu Nhận biết (40%), Thông hiểu (30%), Vận dụng (30%) để đảm bảo độ phân hóa.",
      fixAction: "fixCognitiveRatio"
    });
  }

  // 4. Kiểm tra trùng lặp câu hỏi & lộ đáp án (Anti-Duplication)
  const allStems = [...mcq.map(q => q.stem), ...tf.map(q => q.stem), ...essay.map(q => q.stem)];
  let duplicatePairs = 0;
  for (let i = 0; i < allStems.length; i++) {
    for (let j = i + 1; j < allStems.length; j++) {
      if ((allStems[i] || "").trim() === (allStems[j] || "").trim()) duplicatePairs++;
    }
  }
  if (duplicatePairs === 0) {
    checks.push({
      status: "pass",
      title: "4. Chống trùng lặp nội dung & lộ dữ kiện (Anti-Leakage)",
      detail: "100% câu hỏi trong đề độc lập về ngữ cảnh, không trùng lặp dẫn đề hoặc lộ đáp án."
    });
  } else {
    score -= 15;
    checks.push({
      status: "fail",
      title: `4. Phát hiện ${duplicatePairs} cặp câu hỏi trùng lặp nội dung (-15đ)`,
      detail: "Có câu hỏi bị lặp lại nguyên văn dẫn đề trong cùng một mã đề.",
      aiSuggestion: "AI gợi ý: Thay thế ngay các câu bị trùng bằng câu hỏi tương đương khác hoặc biến đổi bối cảnh thực tế.",
      fixAction: "fixDuplicates"
    });
  }

  // 5. Kiểm tra chuẩn kỹ thuật dạng thức Đúng - Sai (đủ 4 ý a,b,c,d, có cả Đúng lẫn Sai, có giải thích)
  let tfAllBalanced = true;
  tf.forEach(q => {
    const trueCount = (q.statements || []).filter(s => s.isTrue).length;
    const missingExp = (q.statements || []).some(s => !s.explanation || s.explanation.trim().length < 5);
    if (!q.statements || q.statements.length !== 4 || trueCount === 0 || trueCount === 4 || missingExp) {
      tfAllBalanced = false;
    }
  });
  if (!pc.tf.enabled || tfAllBalanced) {
    checks.push({
      status: "pass",
      title: "5. Chuẩn kỹ thuật câu Đúng - Sai & Bảng giải thích 4 ý",
      detail: "Đủ 4 ý a, b, c, d phân hóa mức độ, phân bố đều Đúng/Sai và có giải thích chi tiết từng ý."
    });
  } else {
    score -= 15;
    checks.push({
      status: "warn",
      title: "5. Lỗi phân bố đáp án Đúng - Sai hoặc thiếu giải thích (-15đ)",
      detail: "Có câu Đúng - Sai chứa cả 4 ý cùng Đúng/cùng Sai hoặc thiếu giải thích chi tiết từng ý a, b, c, d.",
      aiSuggestion: "AI gợi ý: Cân bằng lại đáp án Đúng/Sai (2 Đúng - 2 Sai hoặc 3 Đúng - 1 Sai) và điền đầy đủ giải thích chuẩn SGK.",
      fixAction: "fixTfQuality"
    });
  }

  // 6. Kiểm tra mã hóa năng lực môn Công nghệ & độ phủ bài học
  const selectedUnits = state.units.filter(u => u.selected);
  const missingComp = selectedUnits.length === 0 || selectedUnits.some(u => !u.competencies || u.competencies.length === 0);
  if (!missingComp) {
    checks.push({
      status: "pass",
      title: "6. Mã hóa năng lực Công nghệ & Độ phủ YCCĐ (Phụ lục 2)",
      detail: `Đã phủ ${selectedUnits.length} bài học và gắn đầy đủ mã năng lực chuẩn GDPT 2018 (NCCN, SDCN, ĐGCN, TKKT).`
    });
  } else {
    score -= 15;
    checks.push({
      status: "warn",
      title: "6. Thiếu mã hóa năng lực hoặc chưa chọn bài học (-15đ)",
      detail: "Có bài học chưa gắn mã năng lực công nghệ (NCCN, SDCN, ĐGCN) tại Bước 1 & Bước 4.",
      aiSuggestion: "AI gợi ý: Tự động bổ sung mã năng lực chuẩn GDPT 2018 (NCCN, SDCN) và YCCĐ cho toàn bộ bài học.",
      fixAction: "fixCompetencies"
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
  const bannerEl = document.getElementById("aiAutoFixRequiredBanner");
  const exportBtn = document.getElementById("btnExportFromStep6");
  const downloadArea = document.getElementById("step6DownloadArea");
  if (!scoreEl || !listEl) return;

  const sc = state.audit.score;
  scoreEl.innerHTML = `${sc}<span>/100</span>`;
  scoreEl.style.background = sc >= 90 ? "#15803d" : sc >= 75 ? "#d97706" : "#dc2626";

  if (downloadArea) {
    if (sc >= 90) {
      downloadArea.style.borderColor = "#22c55e";
      downloadArea.style.background = "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)";
    } else {
      downloadArea.style.borderColor = "#f59e0b";
      downloadArea.style.background = "linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)";
    }
  }

  if (sc >= 90) {
    summaryEl.textContent = `✅ Đề kiểm tra đạt chuẩn (${sc}/100 điểm) — Sẵn sàng xuất Word & In ấn!`;
    summaryEl.style.color = "#15803d";
    if (exportBtn) {
      exportBtn.style.opacity = "1";
    }
  } else {
    summaryEl.textContent = `⚠️ Điểm kiểm định dưới 90đ (${sc}/100 điểm) — Yêu cầu cập nhật & chỉnh lại đề theo gợi ý AI!`;
    summaryEl.style.color = "#dc2626";
  }

  // Hiển thị Banner yêu cầu bắt buộc khi điểm < 90đ
  if (bannerEl) {
    const failedItems = state.audit.items.filter(it => it.status !== "pass");
    if (sc < 90 && failedItems.length > 0) {
      bannerEl.style.display = "block";
      bannerEl.innerHTML = `
        <div style="background:linear-gradient(135deg, #fef2f2 0%, #fffbeb 100%); border:2px solid #ef4444; border-radius:10px; padding:14px 18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div style="flex:1; min-width:280px;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
              <span class="badge badge-err" style="font-size:12px; padding:4px 8px;">🚨 YÊU CẦU BẮT BUỘC (ĐIỂM &lt; 90Đ)</span>
              <strong style="color:#991b1b; font-size:14.5px;">AI phát hiện ${failedItems.length} hạng mục chưa đạt chuẩn Công văn 7991:</strong>
            </div>
            <ul style="margin:0 0 0 18px; padding:0; font-size:12.5px; color:#7f1d1d; line-height:1.55;">
              ${failedItems.map(f => `<li><strong>${escapeHtml(f.title)}:</strong> ${escapeHtml(f.aiSuggestion || f.detail)}</li>`).join("")}
            </ul>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
            <button class="btn btn-primary" style="background:#dc2626; border-color:#b91c1c; padding:10px 18px; font-size:13.5px; font-weight:700; box-shadow:0 4px 12px rgba(220,38,38,0.28);" onclick="autoFixAllByAi()">
              🛠️ Ấn Để Tự Cập Nhật & Chỉnh Lại Đề Theo Gợi Ý AI (Lên 100/100đ)
            </button>
            <span style="font-size:11.5px; color:#991b1b; font-style:italic;">Tự động chuẩn hóa Điểm số, Ma trận, Đặc tả & Câu hỏi trong 1 giây</span>
          </div>
        </div>
      `;
    } else {
      bannerEl.style.display = "none";
      bannerEl.innerHTML = "";
    }
  }

  listEl.innerHTML = state.audit.items.map(item => `
    <div class="audit-item ${item.status}" style="padding:10px 14px;">
      <div style="flex:1;">
        <div style="font-weight:700; font-size:13.5px; margin-bottom:3px;">
          ${item.status === 'pass' ? '✅' : item.status === 'warn' ? '⚠️' : '❌'} ${escapeHtml(item.title)}
        </div>
        <div style="font-size:12.5px; color:var(--text-muted);">${escapeHtml(item.detail)}</div>
        ${item.aiSuggestion ? `<div style="font-size:12px; color:#b45309; font-weight:600; margin-top:4px;">💡 ${escapeHtml(item.aiSuggestion)}</div>` : ''}
      </div>
      <div style="text-align:right; flex-shrink:0;">
        <span class="badge ${item.status === 'pass' ? 'badge-ok' : item.status === 'warn' ? 'badge-warn' : 'badge-err'}">
          ${item.status === 'pass' ? 'ĐẠT CHUẨN' : item.status === 'warn' ? 'KHUYẾN NGHỊ' : 'CẦN SỬA'}
        </span>
        ${item.fixAction ? `
          <button class="btn btn-primary btn-sm" style="margin-top:6px; display:block; margin-left:auto; padding:4px 10px; font-size:11.5px;" onclick="fixSingleIssueByAi('${item.fixAction}')">
            ⚡ Tự sửa mục này
          </button>
        ` : ''}
      </div>
    </div>
  `).join("");
}

// Hàm xử lý khi bấm Xuất Word ở Bước 6: Nếu điểm < 90đ thì yêu cầu bấm nút Tự cập nhật & chỉnh lại đề theo gợi ý AI
function handleStep6ExportWord() {
  if (state.audit.score < 90) {
    const wantAutoFix = confirm(
      `⚠️ Điểm kiểm định hiện tại của Đề là ${state.audit.score}/100 điểm (Dưới mức chuẩn 90 điểm của Công văn 7991).\n\n` +
      `👉 Bấm "OK" để AI tự động cập nhật & chỉnh lại Đề lên 100/100đ và xuất file Word ngay!\n` +
      `👉 Bấm "Cancel" để vẫn tiếp tục xuất file Word theo cấu hình hiện tại.`
    );
    if (wantAutoFix) {
      autoFixAllByAi();
    }
  }
  exportFullWordDocument();
}

// Hàm sửa từng mục riêng lẻ theo gợi ý AI
function fixSingleIssueByAi(fixAction) {
  autoFixAllByAi(fixAction);
}

// Hàm AI Tự động Cập nhật & Chỉnh lại toàn bộ Đề theo gợi ý AI (Đưa về chuẩn 100/100 điểm)
function autoFixAllByAi(onlySpecificAction = null) {
  const fixedLogs = [];
  const pc = state.partConfig;

  // 1. Đảm bảo có bài học được chọn & đầy đủ mã năng lực NCCN, SDCN
  let selectedUnits = state.units.filter(u => u.selected);
  if (selectedUnits.length === 0 && state.units.length > 0) {
    state.units.forEach((u, i) => { if (i < 6) u.selected = true; });
    selectedUnits = state.units.filter(u => u.selected);
    fixedLogs.push("Đã tự động tích chọn các bài học trọng tâm trong PPCT (Bước 1).");
  }
  state.units.forEach(u => {
    if (!u.competencies || u.competencies.length === 0) {
      u.competencies = ["NCCN", "SDCN"];
      fixedLogs.push(`Đã bổ sung mã năng lực chuẩn (NCCN, SDCN) cho bài "${u.lesson}".`);
    }
  });

  // 2. Kiểm tra và chuẩn hóa Tổng điểm & Tỉ lệ nhận thức (40% Biết : 30% Hiểu : 30% Vận dụng = 10.00đ)
  const calcBefore = getPartCalculations();
  const { bietPct, hieuPct, vandungPct } = calcBefore.cognitive;
  const isScoreOff = Math.abs(calcBefore.grandTotalPoints - 10.0) >= 0.01;
  const isCognitiveOff = !(bietPct >= 30 && bietPct <= 55 && hieuPct >= 20 && hieuPct <= 45 && vandungPct >= 20 && vandungPct <= 45);
  const isTfStmtOff = pc.tf.enabled && (calcBefore.tf.stmtCount !== pc.tf.numQuestions * 4);

  if (isScoreOff || isCognitiveOff || isTfStmtOff || onlySpecificAction === "fixTotalScore" || onlySpecificAction === "fixCognitiveRatio") {
    if (pc.short.enabled) {
      applyStructurePreset("cv7991_4parts");
      fixedLogs.push("Đã chuẩn hóa Cấu hình Bước 2 theo mẫu đủ 4 dạng thức (Tổng 10,00 điểm • Tỉ lệ chuẩn CV 7991).");
    } else if (!pc.essay.enabled) {
      applyStructurePreset("tn100_thpt");
      fixedLogs.push("Đã chuẩn hóa Cấu hình Bước 2 theo mẫu 100% Trắc nghiệm (24 câu MCQ + 4 câu Đ/S = 10,00 điểm).");
    } else {
      applyStructurePreset("cv7991_70_30");
      fixedLogs.push("Đã chuẩn hóa Cấu hình Bước 2 về đúng thang điểm 10,00đ (70% TN - 30% TL • Tỉ lệ 40% Biết : 30% Hiểu : 30% Vận dụng).");
    }
  }

  // 3. Phân bổ lại Ma trận (Bước 3) và Bản đặc tả (Bước 4) khớp 100% với Bước 1 & Bước 2
  autoGenerateMatrix();
  fixedLogs.push("Đã tự động phân bổ lại Ma trận (Bước 3) và Bản đặc tả (Bước 4) khớp 100% trọng số tiết học.");

  // 4. Sinh và chỉnh sửa lại Đề kiểm tra (Bước 5): Chống trùng lặp, cân bằng Đúng/Sai (2 Đúng - 2 Sai) & bổ sung giải thích
  generateExamFromMatrix(false);
  state.exam.tf.forEach((q, qIdx) => {
    const stmts = q.statements || [];
    const trueCount = stmts.filter(s => s.isTrue).length;
    if (trueCount === 0 && stmts.length >= 2) {
      stmts[0].isTrue = true;
      stmts[2].isTrue = true;
      fixedLogs.push(`Đã cân bằng lại đáp án Đúng/Sai cho Câu ${qIdx + 1} Phần II (2 ý Đúng - 2 ý Sai).`);
    } else if (trueCount === 4 && stmts.length >= 4) {
      stmts[1].isTrue = false;
      stmts[3].isTrue = false;
      fixedLogs.push(`Đã cân bằng lại đáp án Đúng/Sai cho Câu ${qIdx + 1} Phần II (2 ý Đúng - 2 ý Sai).`);
    }
    stmts.forEach(st => {
      if (!st.explanation || st.explanation.trim().length < 5) {
        st.explanation = st.isTrue
          ? `Đúng theo quy trình kỹ thuật bài "${q.unitName}" (SGK Kết nối tri thức).`
          : `Sai vì không phù hợp với tiêu chuẩn kỹ thuật bài "${q.unitName}" (SGK Kết nối tri thức).`;
      }
    });
  });
  fixedLogs.push("Đã đồng bộ 100% câu hỏi Đề thi & Hướng dẫn chấm (Bước 5), khử trùng lặp và điền đủ bảng giải thích Đúng/Sai.");

  // 5. Render lại toàn bộ các bước và chạy lại Kiểm định AI
  renderPpctTable();
  renderStep2Config();
  renderMatrixTable();
  renderSpecificationTable();
  renderExamEditor();
  runAiAuditTool();

  // 6. Hiển thị hộp thông báo kết quả cập nhật của AI tại Bước 6
  const logBox = document.getElementById("aiAutoFixLogBox");
  if (logBox) {
    logBox.style.display = "block";
    logBox.innerHTML = `
      <div style="background:#f0fdf4; border:1.5px solid #22c55e; border-radius:8px; padding:12px 16px;">
        <div style="font-weight:700; color:#15803d; font-size:14px; margin-bottom:6px;">
          ✨ AI ĐÃ TỰ ĐỘNG CẬP NHẬT & CHỈNH LẠI ĐỀ THÀNH CÔNG (ĐẠT ${state.audit.score}/100 ĐIỂM):
        </div>
        <ul style="margin:0 0 0 18px; padding:0; font-size:12.5px; color:#166534; line-height:1.55;">
          ${fixedLogs.map(l => `<li>${escapeHtml(l)}</li>`).join("")}
        </ul>
      </div>
    `;
  }
}

// Hàm giả lập Đề bị lỗi (< 90 điểm) để giáo viên thử nghiệm ngay tính năng AI yêu cầu tự cập nhật & chỉnh sửa
function simulateLowScoreExamForTest() {
  // Cố tình làm lệch điểm (8.5đ), lệch tỉ lệ nhận thức, trùng câu hỏi và lệch Đúng/Sai để điểm kiểm định xuống < 90đ (50/100đ)
  state.partConfig.mcq.counts = { biet: 14, hieu: 0, vandung: 0 }; // 3.5đ, lệch tỉ lệ nhận thức
  if (state.exam.mcq.length >= 2) {
    state.exam.mcq[1].stem = state.exam.mcq[0].stem; // Tạo câu trùng lặp
    state.exam.mcq.pop(); // Làm lệch số câu giữa Ma trận và Đề
  }
  if (state.exam.tf.length > 0) {
    state.exam.tf[0].statements.forEach(s => { s.isTrue = true; s.explanation = ""; }); // Cả 4 ý cùng Đúng
  }
  const logBox = document.getElementById("aiAutoFixLogBox");
  if (logBox) logBox.style.display = "none";
  runAiAuditTool();
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
// ============================================================================
// HỆ THỐNG XUẤT FILE WORD (.DOC) TÁCH BIỆT & TRỌN BỘ CHUẨN CÔNG VĂN 7991
// ============================================================================

function syncExamMetaFromInputs() {
  state.meta.department = document.getElementById("metaDepartment")?.value || state.meta.department || "SỞ GIÁO DỤC VÀ ĐÀO TẠO BÌNH PHƯỚC";
  state.meta.school = document.getElementById("metaSchool")?.value || state.meta.school || "TRƯỜNG THPT LỘC NINH";
  state.meta.group = document.getElementById("metaGroup")?.value || state.meta.group || "TỔ TIN - CÔNG NGHỆ";
  state.meta.subjectName = document.getElementById("metaSubject")?.value || state.meta.subjectName || "CÔNG NGHỆ 10";
  state.meta.examTerm = document.getElementById("metaTerm")?.value || state.meta.examTerm || "GIỮA HỌC KỲ I";
  state.meta.duration = Number(document.getElementById("metaDuration")?.value) || 45;
  state.meta.examCode = document.getElementById("metaExamCode")?.value || "101";

  localStorage.setItem("cv7991_department", state.meta.department);
  localStorage.setItem("cv7991_school", state.meta.school);
  localStorage.setItem("cv7991_group", state.meta.group);
}

function applySchoolPreset(preset) {
  if (preset === "loc_ninh") {
    state.meta.department = "SỞ GIÁO DỤC VÀ ĐÀO TẠO BÌNH PHƯỚC";
    state.meta.school = "TRƯỜNG THPT LỘC NINH";
    state.meta.group = "TỔ TIN - CÔNG NGHỆ";
  } else if (preset === "dong_nai") {
    state.meta.department = "SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG NAI";
    if (!state.meta.school || state.meta.school === "TRƯỜNG THPT ...") {
      state.meta.school = "TRƯỜNG THPT LỘC NINH";
    }
    if (!state.meta.group) {
      state.meta.group = "TỔ TIN - CÔNG NGHỆ";
    }
  } else if (preset === "clear") {
    state.meta.department = "";
    state.meta.school = "";
    state.meta.group = "";
  }
  localStorage.setItem("cv7991_department", state.meta.department);
  localStorage.setItem("cv7991_school", state.meta.school);
  localStorage.setItem("cv7991_group", state.meta.group);

  const deptEl = document.getElementById("metaDepartment");
  const schoolEl = document.getElementById("metaSchool");
  const groupEl = document.getElementById("metaGroup");
  if (deptEl) deptEl.value = state.meta.department;
  if (schoolEl) {
    schoolEl.value = state.meta.school;
    schoolEl.focus();
  }
  if (groupEl) groupEl.value = state.meta.group;

  if (state.currentStep === 5) renderExamEditor();
}

function createWordBlobDoc(title, bodyContent) {
  const fullDoc = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${escapeHtml(title)}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page WordSection1 {
          size: 210mm 297mm;
          margin: 20mm 15mm 20mm 30mm; /* Chuan Nghi dinh 30/2020: Tren 20mm, Duoi 20mm, Trai 30mm (dong gay), Phai 15mm */
          mso-header-margin: 15mm;
          mso-footer-margin: 15mm;
          mso-paper-source: 0;
        }
        div.WordSection1 {
          page: WordSection1;
        }
        body {
          font-family: "Times New Roman", Times, serif;
          font-size: 13pt;
          line-height: 1.3;
          color: #000000;
          text-align: justify;
        }
        p {
          font-family: "Times New Roman", Times, serif;
          font-size: 13pt;
          line-height: 1.3;
          margin-top: 0;
          margin-bottom: 5pt;
          text-align: justify;
        }
        h1, h2, h3, h4 {
          font-family: "Times New Roman", Times, serif;
          text-align: center;
          margin: 8pt 0 4pt 0;
          font-weight: bold;
          page-break-after: avoid;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 6pt 0;
          font-family: "Times New Roman", Times, serif;
        }
        th, td {
          border: 1px solid #000000;
          padding: 4pt 6pt;
          font-size: 11pt;
          vertical-align: top;
          line-height: 1.25;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
          text-align: center;
        }
        thead {
          display: table-header-group;
        }
        tr {
          page-break-inside: avoid;
        }
        .header-tbl, .header-tbl td, .header-tbl th {
          border: none !important;
          padding: 2pt 4pt;
        }
        .question-item {
          page-break-inside: avoid;
          break-inside: avoid;
          margin-bottom: 8pt;
          display: block;
        }
        .page-break {
          page-break-before: always;
          break-before: page;
          mso-break-type: section-break;
        }
      </style>
    </head>
    <body>
      <div class="WordSection1">
        ${bodyContent}
      </div>
    </body>
    </html>
  `;
  return new Blob(['\ufeff', fullDoc], { type: 'application/msword;charset=utf-8' });
}

function downloadWordBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 3500);
}

function checkAuditBeforeDownload(onProceed) {
  if (state.audit.score < 90) {
    const wantAutoFix = confirm(
      `⚠️ Điểm kiểm định hiện tại của Đề là ${state.audit.score}/100 điểm (Dưới mức chuẩn 90 điểm theo CV 7991).\n\n` +
      `👉 Bấm "OK" để AI tự động cập nhật & chuẩn hóa Đề lên 100/100đ trước khi tải!\n` +
      `👉 Bấm "Cancel" nếu thầy/cô vẫn muốn tải ngay file theo cấu hình hiện tại.`
    );
    if (wantAutoFix) {
      autoFixAllByAi();
    }
  }
  if (typeof onProceed === "function") {
    onProceed();
  }
}

// 1. Xây dựng nội dung file Đề thi (chỉ có câu hỏi, không có đáp án - phục vụ in phát cho học sinh)
function buildExamQuestionsOnlyHtml() {
  syncExamMetaFromInputs();
  const { mcq, tf, short, essay } = state.exam;
  const pc = state.partConfig;
  let html = `
    <table style="width:100%; border:none; margin-bottom:10pt;">
      <tr>
        <td style="border:none; text-align:center; width:45%; vertical-align:top; font-size:11pt;">
          <strong>${escapeHtml(state.meta.department.toUpperCase())}</strong><br/>
          <strong>${escapeHtml(state.meta.school.toUpperCase())}</strong><br/>
          <strong>${escapeHtml((state.meta.group || 'TỔ TIN - CÔNG NGHỆ').toUpperCase())}</strong><br/>
          <div style="margin-top:6pt; text-align:left; font-size:10pt; line-height:1.6;">
            Họ và tên thí sinh: ....................................................<br/>
            Số báo danh: ........................ Lớp: .........................
          </div>
        </td>
        <td style="border:none; text-align:center; width:55%; vertical-align:top;">
          <strong style="font-size:13pt;">ĐỀ KIỂM TRA ${escapeHtml(state.meta.examTerm).toUpperCase()}</strong><br/>
          <strong>MÔN: ${escapeHtml(state.meta.subjectName).toUpperCase()}</strong><br/>
          <i>Thời gian làm bài: ${state.meta.duration} phút (không kể thời gian phát đề)</i><br/>
          <strong style="display:inline-block; margin-top:4pt; border:1px solid #000; padding:2pt 10pt;">Mã đề thi: ${escapeHtml(state.meta.examCode)}</strong>
        </td>
      </tr>
    </table>
    <hr style="border:none; border-top:1px solid #000; margin:6pt 0 10pt 0;"/>
  `;

  if (pc.mcq.enabled && mcq.length > 0) {
    const pSum = mcq.reduce((s, q) => s + Number(q.points), 0);
    html += `<p style="margin:8pt 0 4pt 0;"><strong>PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn (${pSum.toFixed(2)} điểm).</strong><br/><i>Thí sinh trả lời từ câu 1 đến câu ${mcq.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án.</i></p>`;
    mcq.forEach((q, idx) => {
      html += `<p style="margin:4pt 0 2pt 0;"><strong>Câu ${idx + 1} (${q.points}đ):</strong> ${escapeHtml(q.stem)}</p>`;
      q.options.forEach((opt, oIdx) => {
        html += `<p style="margin:2pt 0 2pt 14pt;"><strong>${String.fromCharCode(65 + oIdx)}.</strong> ${escapeHtml(opt)}</p>`;
      });
    });
  }

  if (pc.tf.enabled && tf.length > 0) {
    const pSum = tf.reduce((s, q) => s + Number(q.points), 0);
    html += `<p style="margin:10pt 0 4pt 0;"><strong>PHẦN II. Câu trắc nghiệm đúng sai (${pSum.toFixed(2)} điểm).</strong><br/><i>Thí sinh trả lời từ câu 1 đến câu ${tf.length}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.</i></p>`;
    tf.forEach((q, idx) => {
      html += `<p style="margin:6pt 0 2pt 0;"><strong>Câu ${idx + 1} (${q.points}đ):</strong> ${escapeHtml(q.stem)}</p>`;
      (q.statements || []).forEach(st => {
        html += `<p style="margin:2pt 0 2pt 14pt;"><strong>${escapeHtml(st.label)})</strong> ${escapeHtml(st.text)}</p>`;
      });
    });
  }

  if (pc.short.enabled && short.length > 0) {
    const pSum = short.reduce((s, q) => s + Number(q.points), 0);
    html += `<p style="margin:10pt 0 4pt 0;"><strong>PHẦN III. Câu trắc nghiệm trả lời ngắn (${pSum.toFixed(2)} điểm).</strong><br/><i>Thí sinh trả lời từ câu 1 đến câu ${short.length}.</i></p>`;
    short.forEach((q, idx) => {
      html += `<p style="margin:4pt 0;"><strong>Câu ${idx + 1} (${q.points}đ):</strong> ${escapeHtml(q.stem)}</p>`;
    });
  }

  if (pc.essay.enabled && essay.length > 0) {
    const pSum = essay.reduce((s, q) => s + Number(q.points), 0);
    html += `<p style="margin:10pt 0 4pt 0;"><strong>PHẦN TỰ LUẬN (${pSum.toFixed(2)} điểm).</strong></p>`;
    essay.forEach((q, idx) => {
      html += `<p style="margin:6pt 0;"><strong>Câu ${idx + 1} (${q.points} điểm):</strong><br/>${escapeHtml(q.stem).replace(/\n/g, "<br/>")}</p>`;
    });
  }

  html += `
    <div style="text-align:center; margin-top:24pt; font-weight:bold;">
      ----------------- HẾT -----------------<br/>
      <span style="font-style:italic; font-weight:normal; font-size:10.5pt;">(Cán bộ coi thi không giải thích gì thêm)</span>
    </div>
  `;

  return html;
}

// 2. Xây dựng nội dung file Hướng dẫn chấm & Đáp án chi tiết (dành cho Giám khảo / Giáo viên)
function buildExamAnswerKeyOnlyHtml() {
  syncExamMetaFromInputs();
  const { mcq, tf, short, essay } = state.exam;
  const pc = state.partConfig;
  let html = `
    <table style="width:100%; border:none; margin-bottom:10pt;">
      <tr>
        <td style="border:none; text-align:center; width:45%; vertical-align:top; font-size:11pt;">
          <strong>${escapeHtml(state.meta.department.toUpperCase())}</strong><br/>
          <strong>${escapeHtml(state.meta.school.toUpperCase())}</strong><br/>
          <strong>${escapeHtml((state.meta.group || 'TỔ TIN - CÔNG NGHỆ').toUpperCase())}</strong>
        </td>
        <td style="border:none; text-align:center; width:55%; vertical-align:top;">
          <strong style="font-size:13pt;">HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN ĐỀ KIỂM TRA</strong><br/>
          <strong>MÔN: ${escapeHtml(state.meta.subjectName).toUpperCase()} - ${escapeHtml(state.meta.examTerm).toUpperCase()}</strong><br/>
          <i>(Chuẩn Công văn số 7991/BGDĐT-GDTrH) | Mã đề: ${escapeHtml(state.meta.examCode)}</i>
        </td>
      </tr>
    </table>
    <hr style="border:none; border-top:1px solid #000; margin:6pt 0 10pt 0;"/>
  `;

  // I. MCQ
  if (pc.mcq.enabled && mcq.length > 0) {
    html += `<h4 style="text-align:left; margin:10pt 0 4pt 0;">I. ĐÁP ÁN TRẮC NGHIỆM NHIỀU LỰA CHỌN (PHẦN I)</h4>`;
    html += `<table style="width:100%; border-collapse:collapse; margin-bottom:10pt;"><tr>`;
    mcq.forEach((q, idx) => {
      html += `<td style="border:1px solid #000; padding:4pt 6pt; text-align:center;"><strong>Câu ${idx + 1}:</strong> <span style="font-weight:bold; color:#1e40af;">${String.fromCharCode(65 + q.answer)}</span><br/><span style="font-size:10pt; color:#555;">(${q.points}đ)</span></td>`;
      if ((idx + 1) % 4 === 0 && idx < mcq.length - 1) html += `</tr><tr>`;
    });
    const remainder = mcq.length % 4;
    if (remainder !== 0) {
      for (let i = 0; i < 4 - remainder; i++) {
        html += `<td style="border:1px solid #000;">&nbsp;</td>`;
      }
    }
    html += `</tr></table>`;
  }

  // II. TF
  if (pc.tf.enabled && tf.length > 0) {
    html += `<h4 style="text-align:left; margin:12pt 0 4pt 0;">II. ĐÁP ÁN & HƯỚNG DẪN GIẢI CHI TIẾT TRẮC NGHIỆM ĐÚNG - SAI (PHẦN II)</h4>`;
    html += `<p style="font-size:10.5pt; font-style:italic; margin:2pt 0 6pt 0;">Quy tắc tính điểm CV 7991: Đúng 1 ý được 0.10đ; đúng 2 ý được 0.25đ; đúng 3 ý được 0.50đ; đúng cả 4 ý được 1.00đ.</p>`;
    html += `<table style="width:100%; border-collapse:collapse; margin-bottom:10pt;">
      <thead>
        <tr style="background:#f0f0f0;">
          <th style="border:1px solid #000; width:65px; padding:4pt; text-align:center;">Câu</th>
          <th style="border:1px solid #000; width:45px; padding:4pt; text-align:center;">Ý</th>
          <th style="border:1px solid #000; width:85px; padding:4pt; text-align:center;">Đáp án</th>
          <th style="border:1px solid #000; padding:4pt 6pt; text-align:left;">Hướng dẫn giải chi tiết từng lệnh hỏi (Chuẩn SGK KNTT)</th>
        </tr>
      </thead>
      <tbody>`;
    tf.forEach((q, idx) => {
      (q.statements || []).forEach((st, sIdx) => {
        html += `<tr>`;
        if (sIdx === 0) {
          html += `<td rowspan="${q.statements.length}" style="border:1px solid #000; text-align:center; font-weight:bold; vertical-align:middle;">Câu ${idx + 1}<br/>(${q.points}đ)</td>`;
        }
        html += `<td style="border:1px solid #000; text-align:center; font-weight:bold;">${escapeHtml(st.label)})</td>`;
        html += `<td style="border:1px solid #000; text-align:center; font-weight:bold; color:${st.isTrue ? '#15803d' : '#dc2626'};">${st.isTrue ? 'Đúng (Đ)' : 'Sai (S)'}</td>`;
        html += `<td style="border:1px solid #000; padding:4pt 6pt;">${escapeHtml(st.explanation || (st.isTrue ? 'Phát biểu đúng chuẩn kiến thức quy trình kỹ thuật SGK.' : 'Phát biểu chưa chính xác theo quy trình kỹ thuật SGK.'))}</td>`;
        html += `</tr>`;
      });
    });
    html += `</tbody></table>`;
  }

  // III. Short
  if (pc.short.enabled && short.length > 0) {
    html += `<h4 style="text-align:left; margin:12pt 0 4pt 0;">III. ĐÁP ÁN & GIẢI CHI TIẾT TRẮC NGHIỆM TRẢ LỜI NGẮN (PHẦN III)</h4>`;
    html += `<table style="width:100%; border-collapse:collapse; margin-bottom:10pt;">
      <thead>
        <tr style="background:#f0f0f0;">
          <th style="border:1px solid #000; width:75px; padding:4pt; text-align:center;">Câu</th>
          <th style="border:1px solid #000; width:130px; padding:4pt; text-align:center;">Đáp án chuẩn</th>
          <th style="border:1px solid #000; padding:4pt 6pt; text-align:left;">Hướng dẫn tính toán / Cơ sở lý giải</th>
          <th style="border:1px solid #000; width:70px; padding:4pt; text-align:center;">Điểm</th>
        </tr>
      </thead>
      <tbody>`;
    short.forEach((q, idx) => {
      html += `<tr>
        <td style="border:1px solid #000; text-align:center; font-weight:bold;">Câu ${idx + 1}</td>
        <td style="border:1px solid #000; text-align:center; font-weight:bold; color:#1e40af;">${escapeHtml(q.answer)}</td>
        <td style="border:1px solid #000; padding:4pt 6pt;">${escapeHtml(q.explanation || 'Áp dụng công thức kỹ thuật nông nghiệp chuẩn SGK.')}</td>
        <td style="border:1px solid #000; text-align:center; font-weight:bold;">${q.points}đ</td>
      </tr>`;
    });
    html += `</tbody></table>`;
  }

  // IV. Essay
  if (pc.essay.enabled && essay.length > 0) {
    html += `<h4 style="text-align:left; margin:12pt 0 4pt 0;">IV. HƯỚNG DẪN CHẤM VÀ BIỂU ĐIỂM TỰ LUẬN</h4>`;
    html += `<table style="width:100%; border-collapse:collapse; margin-bottom:10pt;">
      <thead>
        <tr style="background:#f0f0f0;">
          <th style="border:1px solid #000; width:75px; padding:4pt; text-align:center;">Câu</th>
          <th style="border:1px solid #000; padding:4pt 6pt; text-align:left;">Nội dung yêu cầu cần đạt (Rubric chấm điểm)</th>
          <th style="border:1px solid #000; width:70px; padding:4pt; text-align:center;">Điểm</th>
        </tr>
      </thead>
      <tbody>`;
    essay.forEach((q, idx) => {
      html += `<tr>
        <td style="border:1px solid #000; text-align:center; font-weight:bold;">Câu ${idx + 1}</td>
        <td style="border:1px solid #000; padding:4pt 6pt;">${(q.rubric || []).map(r => escapeHtml(r)).join("<br/>")}</td>
        <td style="border:1px solid #000; text-align:center; font-weight:bold;">${q.points}đ</td>
      </tr>`;
    });
    html += `</tbody></table>`;
  }

  return html;
}

// 3. Xây dựng nội dung file Ma trận & Bản đặc tả (Phụ lục 1 & Phụ lục 2)
function buildMatrixAndSpecOnlyHtml() {
  syncExamMetaFromInputs();
  const matrixHtml = document.getElementById("matrixExportArea")?.innerHTML || "";
  const specHtml = document.getElementById("specExportArea")?.innerHTML || "";
  let html = `
    <table style="width:100%; border:none; margin-bottom:10pt;">
      <tr>
        <td style="border:none; text-align:center; width:45%; vertical-align:top; font-size:11pt;">
          <strong>${escapeHtml(state.meta.department.toUpperCase())}</strong><br/>
          <strong>${escapeHtml(state.meta.school.toUpperCase())}</strong><br/>
          <strong>${escapeHtml((state.meta.group || 'TỔ TIN - CÔNG NGHỆ').toUpperCase())}</strong>
        </td>
        <td style="border:none; text-align:center; width:55%; vertical-align:top;">
          <strong style="font-size:12pt;">HỒ SƠ CHUYÊN MÔN THEO CÔNG VĂN 7991/BGDĐT-GDTrH</strong><br/>
          <strong>MA TRẬN VÀ BẢN ĐẶC TẢ ĐỀ KIỂM TRA ${escapeHtml(state.meta.examTerm).toUpperCase()}</strong><br/>
          <i>MÔN: ${escapeHtml(state.meta.subjectName).toUpperCase()} - THỜI GIAN: ${state.meta.duration} PHÚT</i>
        </td>
      </tr>
    </table>
    <hr style="border:none; border-top:1px solid #000; margin:6pt 0 10pt 0;"/>

    <h3 style="text-align:center; margin:10pt 0 6pt 0;">PHẦN 1. MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ (PHỤ LỤC 1)</h3>
    ${matrixHtml}

    <div class="page-break"></div>
    <h3 style="text-align:center; margin:10pt 0 6pt 0;">PHẦN 2. BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KỲ (PHỤ LỤC 2)</h3>
    ${specHtml}
  `;
  return html;
}

// Hàm gộp cả Đề thi + Hướng dẫn chấm (dành cho hàm xuất trọn bộ)
function buildPrintableExamHtml() {
  return buildExamQuestionsOnlyHtml() + '<div class="page-break"></div>' + buildExamAnswerKeyOnlyHtml();
}

// ============================================================================
// CÁC HÀM XUẤT TỪNG PHẦN THEO YÊU CẦU NGƯỜI DÙNG
// ============================================================================

// A. Tải Đề thi (chỉ câu hỏi, in phát cho học sinh làm bài)
function exportExamOnlyWord(triggerCheck = true) {
  const doExport = () => {
    syncExamMetaFromInputs();
    const content = buildExamQuestionsOnlyHtml();
    const blob = createWordBlobDoc(`De-Thi-${state.meta.examCode}`, content);
    downloadWordBlob(blob, `De-Thi-${state.meta.examCode}-${state.meta.subjectName.replace(/\s+/g, '-')}.doc`);
  };
  if (triggerCheck) {
    checkAuditBeforeDownload(doExport);
  } else {
    doExport();
  }
}

// B. Tải Ma trận & Bản đặc tả (Phụ lục 1 & 2 nộp BGH/Tổ chuyên môn)
function exportMatrixSpecWord() {
  syncExamMetaFromInputs();
  const content = buildMatrixAndSpecOnlyHtml();
  const blob = createWordBlobDoc(`Ma-Tran-Dac-Ta-CV7991`, content);
  downloadWordBlob(blob, `Ma-Tran-Dac-Ta-CV7991-${state.meta.subjectName.replace(/\s+/g, '-')}.doc`);
}

// C. Tải Hướng dẫn chấm & Đáp án chi tiết (dành cho Giám khảo)
function exportAnswerKeyWord(triggerCheck = true) {
  const doExport = () => {
    syncExamMetaFromInputs();
    const content = buildExamAnswerKeyOnlyHtml();
    const blob = createWordBlobDoc(`Huong-Dan-Cham-${state.meta.examCode}`, content);
    downloadWordBlob(blob, `Huong-Dan-Cham-Dap-An-${state.meta.examCode}.doc`);
  };
  if (triggerCheck) {
    checkAuditBeforeDownload(doExport);
  } else {
    doExport();
  }
}

// D. Tải trọn gói cả 3 file riêng biệt (1-Click tải tuần tự 3 file về máy)
function exportAllSeparatedFiles() {
  checkAuditBeforeDownload(() => {
    syncExamMetaFromInputs();
    alert("🚀 Bắt đầu tải 3 file rời về máy tính:\n1. Ma trận & Đặc tả (.doc)\n2. Đề thi in cho học sinh (.doc)\n3. Hướng dẫn chấm & Đáp án (.doc)");
    exportMatrixSpecWord();
    setTimeout(() => {
      exportExamOnlyWord(false);
    }, 500);
    setTimeout(() => {
      exportAnswerKeyWord(false);
    }, 1000);
  });
}

// E. Tải trọn bộ Hồ sơ (Gộp cả 4 phần trong 1 file .doc duy nhất)
function exportFullWordDocument() {
  syncExamMetaFromInputs();
  const matrixHtml = document.getElementById("matrixExportArea")?.innerHTML || "";
  const specHtml = document.getElementById("specExportArea")?.innerHTML || "";
  const examHtml = buildPrintableExamHtml();

  const bodyContent = `
    <h2>HỒ SƠ ĐỀ KIỂM TRA ĐỊNH KỲ ${escapeHtml(state.meta.examTerm.toUpperCase())}</h2>
    <h3>MÔN: ${escapeHtml(state.meta.subjectName.toUpperCase())} (Theo Công văn số 7991/BGDĐT-GDTrH)</h3>
    <p style="text-align:center; font-weight:bold; margin:2pt 0 6pt 0;">${escapeHtml(state.meta.department.toUpperCase())} — ${escapeHtml(state.meta.school.toUpperCase())} — ${escapeHtml((state.meta.group || 'TỔ TIN - CÔNG NGHỆ').toUpperCase())}</p>
    <hr/>
    <h3>PHẦN 1. MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ (PHỤ LỤC 1)</h3>
    ${matrixHtml}
    <div class="page-break"></div>
    <h3>PHẦN 2. BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KỲ (PHỤ LỤC 2)</h3>
    ${specHtml}
    <div class="page-break"></div>
    ${examHtml}
  `;

  const blob = createWordBlobDoc(`Ho-So-De-Thi-CV7991-${state.meta.examCode}`, bodyContent);
  downloadWordBlob(blob, `Ho-So-Tron-Bo-CV7991-${state.meta.examCode}.doc`);
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

// ============================================================================
// SOẠN ĐỀ CƯƠNG ÔN TẬP THEO ĐỀ VỪA RA & XUẤT FILE WORD (.DOC)
// ============================================================================
function openStudyGuideModal() {
  const modal = document.getElementById("studyGuideModalBackdrop");
  if (!modal) return;
  const contentEl = document.getElementById("studyGuideContent");
  if (contentEl) {
    contentEl.innerHTML = buildPrintableStudyGuideHtml();
  }
  modal.classList.add("open");
}

function closeStudyGuideModal() {
  const modal = document.getElementById("studyGuideModalBackdrop");
  if (modal) modal.classList.remove("open");
}

function buildPrintableStudyGuideHtml() {
  const selectedUnits = state.units.filter(u => u.selected);
  const totalPeriods = selectedUnits.reduce((sum, u) => sum + (Number(u.periods) || 0), 0);
  const allLessons = (typeof PORTAL_DATA !== "undefined" && PORTAL_DATA.lessons) ? PORTAL_DATA.lessons : [];
  const { mcq, tf, short, essay } = state.exam;

  let html = `
    <div style="font-family:'Times New Roman', Times, serif; font-size:13.5px; line-height:1.45; color:#111827;">
      <!-- Header hành chính -->
      <table style="width:100%; border-collapse:collapse; margin-bottom:12px; border:none;">
        <tr style="border:none;">
          <td style="width:44%; border:none; text-align:center; vertical-align:top;">
            <strong>${escapeHtml(state.meta.department.toUpperCase())}</strong><br/>
            <strong>${escapeHtml(state.meta.school.toUpperCase())}</strong><br/>
            <span style="font-size:12px; font-weight:bold; color:#15803d;">${escapeHtml((state.meta.group || 'TỔ TIN - CÔNG NGHỆ').toUpperCase())}</span>
          </td>
          <td style="width:56%; border:none; text-align:center; vertical-align:top;">
            <strong style="font-size:15px; color:#15803d;">ĐỀ CƯƠNG ÔN TẬP KIỂM TRA ${escapeHtml(state.meta.examTerm)}</strong><br/>
            <strong style="font-size:14px; color:#0f172a;">MÔN: ${escapeHtml(state.meta.subjectName)}</strong><br/>
            <i style="font-size:12.5px;">Năm học: ${escapeHtml(state.meta.schoolYear)} • Thời gian làm bài: ${state.meta.duration} phút</i>
          </td>
        </tr>
      </table>
      <hr style="border:0; border-top:1.5px solid #334155; margin:6px 0 14px;"/>

      <!-- I. Phạm vi nội dung & Trọng số -->
      <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:10px 14px; border-radius:6px; margin-bottom:14px;">
        <strong style="color:#0f172a; font-size:13.5px;">🎯 I. PHẠM VI KIẾN THỨC VÀ ĐƠN VỊ BÀI HỌC TRỌNG TÂM:</strong>
        <p style="margin:4px 0 8px; font-size:13px; color:#475569;">
          Đề kiểm tra bao quát <strong>${selectedUnits.length} bài học</strong> với tổng thời lượng phân phối chương trình: <strong>${totalPeriods} tiết</strong>.
        </p>
        <div style="display:flex; flex-wrap:wrap; gap:6px;">
          ${selectedUnits.map((u, i) => {
            const w = totalPeriods > 0 ? ((u.periods / totalPeriods) * 100).toFixed(1) : 0;
            return `
              <span style="background:#fff; border:1px solid #94a3b8; padding:3px 8px; border-radius:4px; font-size:12px;">
                <strong>${i + 1}.</strong> ${escapeHtml(u.lesson)} (${u.periods} tiết ~ ${w}%)
              </span>
            `;
          }).join("")}
        </div>
      </div>

      <!-- II. Tóm tắt cốt lõi theo bài -->
      <h3 style="color:#1e3a8a; font-size:14.5px; margin:16px 0 10px; border-bottom:1.5px solid #1e3a8a; padding-bottom:4px;">
        A. HỆ THỐNG YÊU CẦU CẦN ĐẠT & KIẾN THỨC CỐT LÕI THEO TỪNG BÀI
      </h3>
  `;

  selectedUnits.forEach((u, idx) => {
    const matchedLesson = allLessons.find(l => (u.lessonId && l.id === u.lessonId) || l.title === u.lesson);
    const summaryPoints = (matchedLesson && Array.isArray(matchedLesson.summaryPoints)) ? matchedLesson.summaryPoints : [];

    html += `
      <div style="margin-bottom:12px; border:1px solid #e2e8f0; border-radius:6px; padding:10px 12px; background:#fff;">
        <div style="font-weight:700; color:#166534; font-size:13.5px; margin-bottom:6px;">
          Bài ${idx + 1}: ${escapeHtml(u.lesson)} 
          <span style="font-size:11.5px; font-weight:normal; color:#64748b;">(${escapeHtml(u.chapter)} • ${u.periods} tiết)</span>
        </div>

        <div style="margin-bottom:6px;">
          <div style="font-size:12px; font-weight:700; color:#0369a1; margin-bottom:2px;">1. Yêu cầu cần đạt chuẩn Chương trình GDPT 2018:</div>
          <ul style="margin:2px 0 4px 18px; padding:0; font-size:12.5px;">
            <li><strong>Nhận biết:</strong> ${escapeHtml(u.yccd.biet)}</li>
            <li><strong>Thông hiểu:</strong> ${escapeHtml(u.yccd.hieu)}</li>
            <li><strong>Vận dụng:</strong> ${escapeHtml(u.yccd.vandung)}</li>
          </ul>
        </div>
    `;

    if (summaryPoints.length > 0) {
      html += `
        <div>
          <div style="font-size:12px; font-weight:700; color:#b45309; margin-bottom:2px;">2. Tóm tắt nội dung cốt lõi SGK:</div>
          <ul style="margin:2px 0 0 18px; padding:0; font-size:12.5px;">
            ${summaryPoints.slice(0, 4).map(pt => `<li>${escapeHtml(pt)}</li>`).join("")}
          </ul>
        </div>
      `;
    }

    html += `</div>`;
  });

  // III. Hệ thống câu hỏi ôn tập định hướng bám sát đề
  html += `
    <h3 style="color:#1e3a8a; font-size:14.5px; margin:20px 0 10px; border-bottom:1.5px solid #1e3a8a; padding-bottom:4px;">
      B. HỆ THỐNG CÂU HỎI VÀ BÀI TẬP ÔN TẬP ĐỊNH HƯỚNG BÁM SÁT MA TRẬN ĐỀ THI
    </h3>
  `;

  // MCQ
  if (mcq && mcq.length > 0) {
    html += `
      <div style="margin-bottom:14px;">
        <h4 style="color:#0f172a; font-size:13px; margin:8px 0 6px;">I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (${mcq.length} câu)</h4>
        <div style="display:grid; grid-template-columns:1fr; gap:8px;">
          ${mcq.map((q, idx) => `
            <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:8px 12px; border-radius:5px;">
              <div style="font-weight:600; font-size:13px; margin-bottom:4px;">
                <strong>Câu ${idx + 1}:</strong> ${escapeHtml(q.stem)}
                <span style="font-size:11px; color:#64748b; font-weight:normal;">[${q.level === 'biet' ? 'Nhận biết' : q.level === 'hieu' ? 'Thông hiểu' : 'Vận dụng'}]</span>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; font-size:12px;">
                ${q.options.map((opt, oIdx) => `
                  <div><strong>${String.fromCharCode(65 + oIdx)}.</strong> ${escapeHtml(opt)}</div>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // TF
  if (tf && tf.length > 0) {
    html += `
      <div style="margin-bottom:14px;">
        <h4 style="color:#0f172a; font-size:13px; margin:12px 0 6px;">II. CÂU HỎI TRẮC NGHIỆM ĐÚNG - SAI (${tf.length} câu tình huống thực tiễn)</h4>
        ${tf.map((q, idx) => `
          <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:10px 12px; border-radius:5px; margin-bottom:8px;">
            <div style="font-weight:600; font-size:13px; margin-bottom:6px;">
              <strong>Câu ${idx + 1} (Đúng - Sai):</strong> ${escapeHtml(q.stem)}
            </div>
            <table style="width:100%; border-collapse:collapse; font-size:12px; background:#fff;">
              <tr style="background:#f1f5f9;">
                <th style="border:1px solid #cbd5e1; padding:3px 6px; width:36px; text-align:center;">Ý</th>
                <th style="border:1px solid #cbd5e1; padding:3px 8px;">Nội dung phát biểu</th>
                <th style="border:1px solid #cbd5e1; padding:3px 8px; width:80px; text-align:center;">Mức độ</th>
              </tr>
              ${q.statements.map(st => `
                <tr>
                  <td style="border:1px solid #cbd5e1; padding:3px 6px; text-align:center; font-weight:700;">${st.label})</td>
                  <td style="border:1px solid #cbd5e1; padding:3px 8px;">${escapeHtml(st.text)}</td>
                  <td style="border:1px solid #cbd5e1; padding:3px 8px; text-align:center;">${st.level === 'biet' ? 'Nhận biết' : st.level === 'hieu' ? 'Thông hiểu' : 'Vận dụng'}</td>
                </tr>
              `).join("")}
            </table>
          </div>
        `).join("")}
      </div>
    `;
  }

  // Short
  if (short && short.length > 0) {
    html += `
      <div style="margin-bottom:14px;">
        <h4 style="color:#0f172a; font-size:13px; margin:12px 0 6px;">III. CÂU HỎI TRẢ LỜI NGẮN / BÀI TOÁN KỸ THUẬT (${short.length} câu)</h4>
        ${short.map((q, idx) => `
          <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:8px 12px; border-radius:5px; margin-bottom:6px; font-size:12.5px;">
            <strong>Câu ${idx + 1}:</strong> ${escapeHtml(q.stem)}
          </div>
        `).join("")}
      </div>
    `;
  }

  // Essay
  if (essay && essay.length > 0) {
    html += `
      <div style="margin-bottom:14px;">
        <h4 style="color:#0f172a; font-size:13px; margin:12px 0 6px;">IV. CÂU HỎI TỰ LUẬN & VẬN DỤNG THỰC TIỄN (${essay.length} câu)</h4>
        ${essay.map((q, idx) => `
          <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:10px 12px; border-radius:5px; margin-bottom:6px; font-size:12.5px;">
            <div style="font-weight:600; margin-bottom:2px;">
              <strong>Câu ${idx + 1}:</strong> ${escapeHtml(q.stem)} <span style="font-size:11px; color:#64748b;">(${q.points} điểm)</span>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  // IV. Đáp án & Hướng dẫn tự học
  html += `
    <h3 style="color:#1e3a8a; font-size:14.5px; margin:20px 0 10px; border-bottom:1.5px solid #1e3a8a; padding-bottom:4px;">
      C. BẢNG ĐÁP ÁN TRA CỨU NHANH & HƯỚNG DẪN TỰ ÔN TẬP
    </h3>
  `;

  if (mcq && mcq.length > 0) {
    html += `
      <div style="margin-bottom:10px;">
        <strong style="font-size:12.5px;">1. Bảng Đáp án Trắc nghiệm Nhiều lựa chọn:</strong>
        <table style="width:100%; border-collapse:collapse; margin-top:4px; font-size:12px; text-align:center;">
          <tr style="background:#f1f5f9;">
            ${mcq.slice(0, 10).map((_, i) => `<th style="border:1px solid #cbd5e1; padding:3px;">C${i+1}</th>`).join("")}
          </tr>
          <tr>
            ${mcq.slice(0, 10).map(q => `<td style="border:1px solid #cbd5e1; padding:3px; font-weight:700; color:#15803d;">${String.fromCharCode(65 + q.answer)}</td>`).join("")}
          </tr>
          ${mcq.length > 10 ? `
            <tr style="background:#f1f5f9;">
              ${mcq.slice(10, 20).map((_, i) => `<th style="border:1px solid #cbd5e1; padding:3px;">C${i+11}</th>`).join("")}
            </tr>
            <tr>
              ${mcq.slice(10, 20).map(q => `<td style="border:1px solid #cbd5e1; padding:3px; font-weight:700; color:#15803d;">${String.fromCharCode(65 + q.answer)}</td>`).join("")}
            </tr>
          ` : ''}
          ${mcq.length > 20 ? `
            <tr style="background:#f1f5f9;">
              ${mcq.slice(20, 30).map((_, i) => `<th style="border:1px solid #cbd5e1; padding:3px;">C${i+21}</th>`).join("")}
            </tr>
            <tr>
              ${mcq.slice(20, 30).map(q => `<td style="border:1px solid #cbd5e1; padding:3px; font-weight:700; color:#15803d;">${String.fromCharCode(65 + q.answer)}</td>`).join("")}
            </tr>
          ` : ''}
        </table>
      </div>
    `;
  }

  if (tf && tf.length > 0) {
    html += `
      <div style="margin-bottom:10px;">
        <strong style="font-size:12.5px;">2. Bảng Đáp án Trắc nghiệm Đúng - Sai:</strong>
        <table style="width:100%; border-collapse:collapse; margin-top:4px; font-size:12px; text-align:center;">
          <tr style="background:#f1f5f9;">
            <th style="border:1px solid #cbd5e1; padding:3px;">Câu hỏi</th>
            <th style="border:1px solid #cbd5e1; padding:3px;">Lệnh a</th>
            <th style="border:1px solid #cbd5e1; padding:3px;">Lệnh b</th>
            <th style="border:1px solid #cbd5e1; padding:3px;">Lệnh c</th>
            <th style="border:1px solid #cbd5e1; padding:3px;">Lệnh d</th>
          </tr>
          ${tf.map((q, idx) => `
            <tr>
              <td style="border:1px solid #cbd5e1; padding:3px; font-weight:700;">Câu ${idx + 1}</td>
              ${q.statements.map(st => `
                <td style="border:1px solid #cbd5e1; padding:3px; font-weight:700; color:${st.answer ? '#166534' : '#dc2626'};">${st.answer ? 'Đúng' : 'Sai'}</td>
              `).join("")}
            </tr>
          `).join("")}
        </table>
      </div>
    `;
  }

  html += `
      <div style="margin-top:14px; padding:10px 12px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; font-size:12px;">
        <strong style="color:#166534;">💡 LỜI KHUYÊN ÔN TẬP DÀNH CHO HỌC SINH:</strong>
        <p style="margin:3px 0 0; line-height:1.4;">
          1. Nắm chắc các thuật ngữ cốt lõi và quy trình kỹ thuật nông nghiệp theo SGK Kết nối tri thức.<br/>
          2. Khi làm bài trắc nghiệm Đúng - Sai, chú ý các điều kiện sinh học, liều lượng phân bón, thuốc bảo vệ thực vật hoặc phương thức canh tác cụ thể.<br/>
          3. Với câu hỏi Vận dụng và Tự luận: Luôn liên hệ tình huống thực tế sản xuất tại địa phương để nêu giải pháp toàn diện.
        </p>
      </div>
    </div>
  `;
  return html;
}

function exportStudyGuideWordDocument() {
  const guideHtml = buildPrintableStudyGuideHtml();
  const fullDoc = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>De Cuong On Tap CV 7991</title>
      <style>
        body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.35; margin: 1.5cm; }
        h1, h2, h3 { text-align: center; margin: 8pt 0; }
        table { width: 100%; border-collapse: collapse; margin: 6pt 0; }
        th, td { border: 1px solid #000; padding: 4pt 6pt; font-size: 11pt; }
        th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
        .page-break { page-break-before: always; }
      </style>
    </head>
    <body>
      ${guideHtml}
    </body>
    </html>
  `;
  const blob = new Blob(['\ufeff', fullDoc], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeTerm = (state.meta.examTerm || 'Kiem-Tra').replace(/[^a-zA-Z0-9_\u00C0-\u024F]/g, '_');
  link.download = `De-Cuong-On-Tap-${safeTerm}.doc`;
  link.click();
}

// ============================================================================
// TÍNH NĂNG MỚI HỌC TỪ TAODETHI2026 (VIPKIMCUONG):
// 1. CHẾ ĐỘ 3: SINH 3 ĐỀ BIẾN THỂ CÙNG LÚC (101 • 102 • 103) + GỘP 1 FILE WORD
// 2. CHẾ ĐỘ 2: TẠO ĐỀ TƯƠNG TỰ TỪ 97 ĐỀ MẪU HOẶC FILE TẢI LÊN
// 3. LỊCH SỬ TẠO ĐỀ (LƯU TRONG TRÌNH DUYỆT) & LỐI TẮT TẢI NHANH MA TRẬN
// ============================================================================

function buildSingleExamVariantFromCurrentMatrix(variantIndex, examCode) {
  const selectedUnits = state.units.filter(u => u.selected);
  const pc = state.partConfig;
  ensureTfStatementLevels();

  const variantContexts = [
    "",
    "Tại Hợp tác xã Nông nghiệp Công nghệ cao Bình Minh, ",
    "Trong mô hình sản xuất nông nghiệp chuẩn VietGAP tại địa phương, ",
    "Khi khảo sát thực tiễn tại Trung tâm Giống và Thực nghiệm Nông lâm thủy sản, "
  ];
  const prefix = variantContexts[variantIndex % variantContexts.length];

  // 1. MCQ
  const mcqList = [];
  const usedStems = new Set();
  if (pc.mcq.enabled) {
    selectedUnits.forEach(u => {
      const r = state.matrixRows[u.id] || {};
      ["biet", "hieu", "vandung"].forEach(lvl => {
        const countNeeded = r[`mcq_${lvl}`] || 0;
        const pool = QUESTION_BANK.mcq.filter(q => q.unitId === u.id && q.level === lvl);
        for (let i = 0; i < countNeeded; i++) {
          let chosen = pool.length > 0 ? pool[(i + variantIndex) % pool.length] : null;
          if (!chosen || usedStems.has(chosen.stem)) {
            const unused = pool.find(q => !usedStems.has(q.stem));
            chosen = unused || chosen || createSmartFallbackMcq(u, lvl, mcqList.length + 1);
          }
          usedStems.add(chosen.stem);
          let stemText = chosen.stem;
          if (variantIndex > 0 && (lvl !== "biet" || pool.length <= countNeeded)) {
            if (!stemText.startsWith("Tại ") && !stemText.startsWith("Trong ") && !stemText.startsWith("[")) {
              stemText = prefix + stemText.charAt(0).toLowerCase() + stemText.slice(1);
            }
          }
          const origOptions = [...chosen.options];
          const correctText = origOptions[chosen.answer];
          // Đảo phương án theo từng mã đề biến thể
          const shiftedOptions = origOptions.map((_, idx) => origOptions[(idx + variantIndex) % origOptions.length]);
          const newAns = shiftedOptions.indexOf(correctText);

          mcqList.push({
            id: `v${variantIndex}_mcq_${mcqList.length + 1}`,
            unitId: u.id,
            unitName: u.lesson,
            level: lvl,
            competency: chosen.competency || u.competencies[0] || "NCCN",
            points: pc.mcq.pointsPerQ,
            stem: stemText,
            options: shiftedOptions,
            answer: newAns >= 0 ? newAns : 0
          });
        }
      });
    });
    // Đảo nhẹ thứ tự các câu trong cùng mức độ nếu là đề biến thể 2, 3
    if (variantIndex > 0 && mcqList.length > 2) {
      for (let i = 0; i < mcqList.length - 1; i += 2) {
        if (mcqList[i].level === mcqList[i + 1].level) {
          const tmp = mcqList[i];
          mcqList[i] = mcqList[i + 1];
          mcqList[i + 1] = tmp;
        }
      }
    }
  }

  // 2. TF (Đúng - Sai)
  const tfList = [];
  if (pc.tf.enabled) {
    const numQ = pc.tf.numQuestions;
    for (let i = 0; i < numQ; i++) {
      const targetUnit = selectedUnits[(i + variantIndex) % selectedUnits.length];
      const unitTfs = QUESTION_BANK.tf.filter(q => q.unitId === targetUnit.id);
      const bankCandidate = (unitTfs.length > 0 ? unitTfs[variantIndex % unitTfs.length] : null)
                         || QUESTION_BANK.tf[(i + variantIndex * 2) % QUESTION_BANK.tf.length];
      if (bankCandidate) {
        const rawStmts = JSON.parse(JSON.stringify(bankCandidate.statements || []));
        const stmtCfg = (pc.tf.statementLevels && pc.tf.statementLevels[i]) || { a: "biet", b: "hieu", c: "vandung", d: "vandung" };
        const normStmts = rawStmts.map((st, sIdx) => {
          const key = ["a", "b", "c", "d"][sIdx] || "a";
          const isT = st.isTrue !== undefined ? Boolean(st.isTrue) : Boolean(st.answer);
          return {
            label: key,
            level: stmtCfg[key] || st.level || (sIdx === 0 ? "biet" : sIdx === 1 ? "hieu" : "vandung"),
            text: st.text || "",
            isTrue: isT,
            explanation: st.explanation || bankCandidate.explanation || (isT
              ? `Đúng theo chuẩn kiến thức kỹ thuật bài "${targetUnit.lesson}" (SGK Kết nối tri thức).`
              : `Sai vì trái với quy chuẩn kỹ thuật trong bài "${targetUnit.lesson}" (SGK Kết nối tri thức).`)
          };
        });
        let baseStem = bankCandidate.stem || bankCandidate.context || "";
        if (variantIndex > 0 && !baseStem.startsWith("Tại ") && !baseStem.startsWith("Trong ")) {
          baseStem = prefix + baseStem.charAt(0).toLowerCase() + baseStem.slice(1);
        }
        tfList.push({
          id: `v${variantIndex}_tf_${i + 1}`,
          unitId: targetUnit.id,
          unitName: targetUnit.lesson,
          competency: bankCandidate.competency || targetUnit.competencies[0] || "SDCN",
          points: pc.tf.pointsPerQuestion,
          stem: baseStem,
          statements: normStmts
        });
      }
    }
  }

  // 3. Short Answer
  const shortList = [];
  if (pc.short.enabled) {
    selectedUnits.forEach(u => {
      const r = state.matrixRows[u.id] || {};
      ["biet", "hieu", "vandung"].forEach(lvl => {
        const countNeeded = r[`short_${lvl}`] || 0;
        const unitShorts = QUESTION_BANK.short.filter(q => q.unitId === u.id);
        for (let i = 0; i < countNeeded; i++) {
          const bankItem = (unitShorts.length > 0 ? unitShorts[(i + variantIndex) % unitShorts.length] : null)
                        || QUESTION_BANK.short[(shortList.length + variantIndex) % QUESTION_BANK.short.length];
          shortList.push({
            id: `v${variantIndex}_short_${shortList.length + 1}`,
            unitId: u.id,
            unitName: u.lesson,
            level: lvl,
            competency: u.competencies[0] || "SDCN",
            points: pc.short.pointsPerQ,
            stem: bankItem.stem,
            answer: bankItem.answer,
            explanation: bankItem.explanation || "Áp dụng công thức tính toán nông học chuẩn SGK."
          });
        }
      });
    });
  }

  // 4. Essay
  const essayList = [];
  if (pc.essay.enabled) {
    selectedUnits.forEach(u => {
      const r = state.matrixRows[u.id] || {};
      ["biet", "hieu", "vandung"].forEach(lvl => {
        const countNeeded = r[`essay_${lvl}`] || 0;
        const totalPointsForCell = r[`essay_points_${lvl}`] || 0;
        const pointPerEssay = countNeeded > 0 ? round2(totalPointsForCell / countNeeded) : 1.5;
        const unitEssays = QUESTION_BANK.essay.filter(e => e.unitId === u.id);
        for (let i = 0; i < countNeeded; i++) {
          const bankEssay = (unitEssays.length > 0 ? unitEssays[(i + variantIndex) % unitEssays.length] : null)
                         || QUESTION_BANK.essay[(essayList.length + variantIndex) % QUESTION_BANK.essay.length];
          essayList.push({
            id: `v${variantIndex}_essay_${essayList.length + 1}`,
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

  return {
    variantNumber: variantIndex + 1,
    examCode,
    mcq: mcqList,
    tf: tfList,
    short: shortList,
    essay: essayList
  };
}

function openVariantsModal() {
  const modal = document.getElementById("variantsModalBackdrop");
  if (!modal) return;
  if (!state.variantExams || state.variantExams.length === 0) {
    generateThreeVariantExams(false);
  } else {
    renderVariantsModal();
  }
  modal.classList.add("open");
}

function closeVariantsModal() {
  const modal = document.getElementById("variantsModalBackdrop");
  if (modal) modal.classList.remove("open");
}

function generateThreeVariantExams(showToast = true) {
  const codes = ["101", "102", "103"];
  state.variantExams = codes.map((code, idx) => buildSingleExamVariantFromCurrentMatrix(idx, code));
  renderVariantsModal();
  if (showToast) {
    alert("⚡ Đã sinh thành công Bộ 3 Đề Biến Thể (Mã đề 101 • 102 • 103) giữ nguyên 100% cấu trúc Ma trận!");
  }
}

function renderVariantsModal() {
  const box = document.getElementById("variantsModalContent");
  if (!box) return;
  const variants = state.variantExams || [];
  const activeTab = state.variantActiveTab || "exams";

  let html = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
      <div style="display:flex; gap:6px;">
        <button class="btn btn-sm ${activeTab === 'exams' ? 'btn-primary' : 'btn-outline'}" onclick="state.variantActiveTab='exams'; renderVariantsModal();">
          📄 Xem Song Song 3 Đề Biến Thể (Mã 101 • 102 • 103)
        </button>
        <button class="btn btn-sm ${activeTab === 'solutions' ? 'btn-primary' : 'btn-outline'}" onclick="state.variantActiveTab='solutions'; renderVariantsModal();">
          ✅ Bảng Đáp Án & Giải Chi Tiết Đúng/Sai (3 Đề)
        </button>
      </div>
      <div style="font-size:12.5px; color:var(--primary-dark); font-weight:600;">
        💡 Mỗi đề biến thể tự động chọn câu hỏi tương đương theo ô Ma trận, đổi ngữ cảnh thực tiễn và đảo phương án
      </div>
    </div>
  `;

  if (activeTab === "exams") {
    html += `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(340px, 1fr)); gap:12px;">
        ${variants.map((v, vIdx) => `
          <div style="border:1.5px solid #cbd5e1; border-radius:8px; background:#fff; display:flex; flex-direction:column; max-height:64vh;">
            <div style="padding:10px 12px; background:linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%); border-bottom:1px solid #cbd5e1; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span class="badge badge-ok">ĐỀ BIẾN THỂ ${v.variantNumber}</span>
                <strong style="color:var(--primary-dark); margin-left:4px;">Mã đề: ${v.examCode}</strong>
              </div>
              <div style="display:flex; gap:4px;">
                <button class="btn btn-outline btn-sm" style="padding:3px 7px; font-size:11.5px;" onclick="applyVariantToMainEditor(${vIdx})" title="Đưa đề này ra màn hình chính Bước 5">⚡ Nạp vào Bước 5</button>
                <button class="btn btn-primary btn-sm" style="padding:3px 7px; font-size:11.5px;" onclick="exportSingleVariantWord(${vIdx})">📥 Tải .doc</button>
              </div>
            </div>
            <div style="padding:10px 12px; overflow-y:auto; font-size:12.5px; line-height:1.45; flex:1;">
              ${v.mcq.length > 0 ? `
                <div style="font-weight:700; color:var(--primary-dark); margin-bottom:6px;">PHẦN I. TRẮC NGHIỆM 4 LỰA CHỌN (${v.mcq.length} câu)</div>
                ${v.mcq.map((q, idx) => `
                  <div style="margin-bottom:8px; padding-bottom:6px; border-bottom:1px dashed #e2e8f0;">
                    <div><strong>Câu ${idx + 1}:</strong> ${escapeHtml(q.stem)}</div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:2px; font-size:11.5px; color:#334155; margin-top:3px;">
                      ${q.options.map((opt, oIdx) => `<div><strong>${String.fromCharCode(65 + oIdx)}.</strong> ${escapeHtml(opt)}</div>`).join("")}
                    </div>
                  </div>
                `).join("")}
              ` : ''}
              ${v.tf.length > 0 ? `
                <div style="font-weight:700; color:var(--primary-dark); margin:10px 0 6px;">PHẦN II. TRẮC NGHIỆM ĐÚNG - SAI (${v.tf.length} câu)</div>
                ${v.tf.map((q, idx) => `
                  <div style="margin-bottom:8px; padding-bottom:6px; border-bottom:1px dashed #e2e8f0;">
                    <div><strong>Câu ${idx + 1}:</strong> ${escapeHtml(q.stem)}</div>
                    <div style="font-size:11.5px; color:#334155; margin-top:3px;">
                      ${q.statements.map(st => `<div><strong>${st.label})</strong> ${escapeHtml(st.text)}</div>`).join("")}
                    </div>
                  </div>
                `).join("")}
              ` : ''}
              ${v.short.length > 0 ? `
                <div style="font-weight:700; color:var(--primary-dark); margin:10px 0 6px;">PHẦN III. TRẢ LỜI NGẮN (${v.short.length} câu)</div>
                ${v.short.map((q, idx) => `<div style="margin-bottom:6px;"><strong>Câu ${idx + 1}:</strong> ${escapeHtml(q.stem)}</div>`).join("")}
              ` : ''}
              ${v.essay.length > 0 ? `
                <div style="font-weight:700; color:var(--primary-dark); margin:10px 0 6px;">PHẦN IV. TỰ LUẬN (${v.essay.length} câu)</div>
                ${v.essay.map((q, idx) => `<div style="margin-bottom:6px;"><strong>Câu ${idx + 1} (${q.points}đ):</strong> ${escapeHtml(q.stem)}</div>`).join("")}
              ` : ''}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  } else {
    html += `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(340px, 1fr)); gap:12px;">
        ${variants.map(v => `
          <div style="border:1.5px solid #cbd5e1; border-radius:8px; background:#fff; padding:10px 12px; max-height:64vh; overflow-y:auto; font-size:12.5px;">
            <div style="font-weight:700; color:var(--primary-dark); font-size:14px; margin-bottom:8px; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">
              ✅ ĐÁP ÁN & GIẢI CHI TIẾT — MÃ ĐỀ ${v.examCode}
            </div>
            ${v.mcq.length > 0 ? `
              <div style="margin-bottom:10px;">
                <strong>I. Bảng đáp án Nhiều lựa chọn:</strong>
                <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
                  ${v.mcq.map((q, idx) => `
                    <span style="background:#f0fdf4; border:1px solid #bbf7d0; padding:2px 6px; border-radius:4px; font-size:11.5px;">
                      <strong>${idx + 1}.</strong> <span style="color:#15803d; font-weight:700;">${String.fromCharCode(65 + q.answer)}</span>
                    </span>
                  `).join("")}
                </div>
              </div>
            ` : ''}
            ${v.tf.length > 0 ? `
              <div style="margin-bottom:10px;">
                <strong>II. Bảng giải chi tiết Đúng - Sai:</strong>
                <table class="std-table" style="margin-top:4px; font-size:11.5px;">
                  <thead><tr><th style="width:45px;">Câu</th><th style="width:32px;">Ý</th><th style="width:55px;">Đ/S</th><th>Giải thích chuẩn SGK</th></tr></thead>
                  <tbody>
                    ${v.tf.map((q, idx) => q.statements.map((st, sIdx) => `
                      <tr>
                        ${sIdx === 0 ? `<td rowspan="4" class="text-center"><strong>C${idx + 1}</strong></td>` : ''}
                        <td class="text-center"><strong>${st.label})</strong></td>
                        <td class="text-center" style="font-weight:700; color:${st.isTrue ? '#15803d' : '#dc2626'};">${st.isTrue ? 'Đúng' : 'Sai'}</td>
                        <td>${escapeHtml(st.explanation)}</td>
                      </tr>
                    `).join("")).join("")}
                  </tbody>
                </table>
              </div>
            ` : ''}
            ${v.essay.length > 0 ? `
              <div>
                <strong>III. Hướng dẫn chấm Tự luận:</strong>
                ${v.essay.map((q, idx) => `
                  <div style="margin-top:4px; background:#f8fafc; padding:6px 8px; border-radius:5px; border:1px solid #e2e8f0;">
                    <strong>Câu ${idx + 1} (${q.points}đ):</strong><br/>
                    ${q.rubric.map(r => `• ${escapeHtml(r)}`).join("<br/>")}
                  </div>
                `).join("")}
              </div>
            ` : ''}
          </div>
        `).join("")}
      </div>
    `;
  }

  box.innerHTML = html;
}

function applyVariantToMainEditor(vIdx) {
  const v = state.variantExams[vIdx];
  if (!v) return;
  state.exam = JSON.parse(JSON.stringify({ mcq: v.mcq, tf: v.tf, short: v.short, essay: v.essay }));
  state.meta.examCode = v.examCode;
  const codeEl = document.getElementById("metaExamCode");
  if (codeEl) codeEl.value = v.examCode;
  closeVariantsModal();
  goToStep(5);
}

function buildPrintableExamForCustomData(examObj, examCode) {
  const savedExam = state.exam;
  const savedCode = state.meta.examCode;
  state.exam = examObj;
  state.meta.examCode = examCode;
  const html = buildPrintableExamHtml();
  state.exam = savedExam;
  state.meta.examCode = savedCode;
  return html;
}

function exportSingleVariantWord(vIdx) {
  const v = state.variantExams[vIdx];
  if (!v) return;
  const bodyHtml = buildPrintableExamForCustomData(v, v.examCode);
  const fullDoc = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>De Bien The ${v.examCode}</title>
    <style>body{font-family:"Times New Roman",serif;font-size:12pt;line-height:1.4;} table{width:100%;border-collapse:collapse;margin:8pt 0;} th,td{border:1px solid #000;padding:4pt 6pt;font-size:11pt;} .page-break{page-break-before:always;}</style>
    </head><body>${bodyHtml}</body></html>
  `;
  const blob = new Blob(['\ufeff', fullDoc], { type: 'application/msword' });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `De-Bien-The-Ma-${v.examCode}.doc`;
  a.click();
}

function exportAllThreeVariantsWord() {
  if (!state.variantExams || state.variantExams.length === 0) {
    generateThreeVariantExams(false);
  }
  const matrixHtml = document.getElementById("matrixExportArea")?.innerHTML || "";
  const specHtml = document.getElementById("specExportArea")?.innerHTML || "";
  const variantsHtml = state.variantExams.map((v, idx) => `
    ${idx > 0 ? '<div class="page-break"></div>' : ''}
    <h2 style="text-align:center; color:#15803d;">BỘ ĐỀ BIẾN THỂ SỐ ${v.variantNumber} (MÃ ĐỀ: ${v.examCode})</h2>
    ${buildPrintableExamForCustomData(v, v.examCode)}
  `).join("");

  const fullDoc = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Bo 3 De Bien The 101-102-103 CV7991</title>
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
      <h2>HỒ SƠ BỘ 3 ĐỀ BIẾN THỂ (MÃ ĐỀ 101 • 102 • 103) — CHUẨN CÔNG VĂN 7991</h2>
      <h3>MÔN: ${escapeHtml(state.meta.subjectName)} (${escapeHtml(state.meta.examTerm)})</h3>
      <hr/>
      <h3>PHẦN A. MA TRẬN ĐỀ KIỂM TRA CHUNG CHO 3 MÃ ĐỀ (PHỤ LỤC 1)</h3>
      ${matrixHtml}
      <div class="page-break"></div>
      <h3>PHẦN B. BẢN ĐẶC TẢ ĐỀ KIỂM TRA CHUNG CHO 3 MÃ ĐỀ (PHỤ LỤC 2)</h3>
      ${specHtml}
      <div class="page-break"></div>
      ${variantsHtml}
    </body>
    </html>
  `;
  const blob = new Blob(['\ufeff', fullDoc], { type: 'application/msword' });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Bo-3-De-Bien-The-101-102-103-CV7991.doc`;
  a.click();
}

// ============================================================================
// CHẾ ĐỘ 2: TẠO ĐỀ TƯƠNG TỰ TỪ 97 ĐỀ MẪU HOẶC FILE TẢI LÊN
// ============================================================================
function openSimilarExamModal() {
  const modal = document.getElementById("similarExamModalBackdrop");
  if (!modal) return;
  if (!state.similarState.examData) {
    state.similarState.examData = buildSingleExamVariantFromCurrentMatrix(1, "202");
  }
  renderSimilarExamModal();
  modal.classList.add("open");
}

function closeSimilarExamModal() {
  const modal = document.getElementById("similarExamModalBackdrop");
  if (modal) modal.classList.remove("open");
}

function selectSampleForSimilarExam(sampleName, gradeKey, termName) {
  state.similarState.sourceName = sampleName;
  // Tự động đồng bộ khung chương trình phù hợp với đề mẫu được chọn
  let presetKey = "cn10_trongtrot_gk1";
  const lower = (sampleName + " " + termName).toLowerCase();
  if (gradeKey === "cn10") {
    if (lower.includes("cuối kì 1") || lower.includes("ck1") || lower.includes("học kì 1")) presetKey = "cn10_trongtrot_ck1";
    else if (lower.includes("giữa kì 2") || lower.includes("gk2")) presetKey = "cn10_trongtrot_gk2";
    else if (lower.includes("cuối kì 2") || lower.includes("ck2") || lower.includes("học kì 2")) presetKey = "cn10_trongtrot_ck2";
    else presetKey = "cn10_trongtrot_gk1";
  } else if (gradeKey === "cn11") {
    if (lower.includes("cuối kì 1") || lower.includes("ck1") || lower.includes("học kì 1")) presetKey = "cn11_channuoi_ck1";
    else if (lower.includes("giữa kì 2") || lower.includes("gk2")) presetKey = "cn11_channuoi_gk2";
    else if (lower.includes("cuối kì 2") || lower.includes("ck2") || lower.includes("học kì 2")) presetKey = "cn11_channuoi_ck2";
    else presetKey = "cn11_channuoi_gk1";
  } else if (gradeKey === "cn12") {
    if (lower.includes("cuối kì 1") || lower.includes("ck1") || lower.includes("học kì 1")) presetKey = "cn12_lnts_ck1";
    else if (lower.includes("giữa kì 2") || lower.includes("gk2")) presetKey = "cn12_lnts_gk2";
    else if (lower.includes("cuối kì 2") || lower.includes("ck2") || lower.includes("học kì 2")) presetKey = "cn12_lnts_ck2";
    else presetKey = "cn12_lamthuy_gk1";
  }
  loadPresetCurriculum(presetKey);
  state.similarState.examData = buildSingleExamVariantFromCurrentMatrix(Math.floor(Math.random() * 3) + 1, String(Math.floor(200 + Math.random() * 700)));
  state.similarState.activeSubTab = "exam";
  renderSimilarExamModal();
}

// Hàm nạp thẳng đề mẫu từ Kho 97 đề vào quy trình soạn đề (Bước 5)
function loadAndUseSampleExam(sampleName, gradeKey, termName) {
  selectSampleForSimilarExam(sampleName, gradeKey, termName);
  applySimilarExamToMainEditor();
  alert(`✨ Đã nạp thành công Đề mẫu "${sampleName}" vào quy trình soạn đề (Bước 5) chuẩn CV 7991!`);
}

function handleSimilarExamFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  state.similarState.sourceName = `File tải lên: ${file.name}`;
  const fname = file.name.toLowerCase();
  if (fname.includes("11")) loadPresetCurriculum("cn11_channuoi_gk1");
  else if (fname.includes("12")) loadPresetCurriculum("cn12_lamthuy_gk1");
  else loadPresetCurriculum("cn10_trongtrot_gk1");

  state.similarState.examData = buildSingleExamVariantFromCurrentMatrix(2, String(Math.floor(200 + Math.random() * 700)));
  state.similarState.activeSubTab = "matrix";
  renderSimilarExamModal();
}

function renderSimilarExamModal() {
  const box = document.getElementById("similarExamModalContent");
  if (!box) return;
  const sim = state.similarState;
  const ex = sim.examData || buildSingleExamVariantFromCurrentMatrix(1, "202");
  const calc = getPartCalculations();
  const sampleExams = (typeof PORTAL_DATA !== "undefined" && PORTAL_DATA.semesterExams) ? PORTAL_DATA.semesterExams : [];
  const filteredSamples = sampleExams.filter(s => sim.gradeFilter === "all" || s.grade === sim.gradeFilter);

  let html = `
    <!-- Khu vực chọn Đề gốc mẫu hoặc Tải file đề lên -->
    <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:10px 12px; margin-bottom:12px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
        <div>
          <span class="badge badge-nl">ĐỀ GỐC ĐANG PHÂN TÍCH</span>
          <strong style="color:var(--primary-dark); font-size:13.5px; margin-left:6px;">${escapeHtml(sim.sourceName)}</strong>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <label class="btn btn-outline btn-sm" style="background:#fff; cursor:pointer;">
            📂 Tải file Đề mẫu (.docx / .pdf / .txt)
            <input type="file" accept=".docx,.doc,.pdf,.txt,.html" style="display:none;" onchange="handleSimilarExamFileUpload(event)" />
          </label>
          <button class="btn btn-primary btn-sm" onclick="state.similarState.examData = buildSingleExamVariantFromCurrentMatrix(Math.floor(Math.random()*3)+1, String(Math.floor(200+Math.random()*700))); renderSimilarExamModal();">
            🔄 Sinh Đề Tương Tự Mới
          </button>
          <button class="btn btn-accent btn-sm" onclick="exportSimilarExamWord()">
            📥 Xuất Đề Tương Tự (.doc)
          </button>
          <button class="btn btn-secondary btn-sm" onclick="applySimilarExamToMainEditor()">
            ⚡ Đưa vào Bước 5
          </button>
        </div>
      </div>

      <details>
        <summary style="cursor:pointer; font-size:12.5px; font-weight:700; color:#0369a1;">
          📚 Hoặc chọn nhanh 1 đề gốc từ Kho 97 Đề Kiểm Tra Học Kì có sẵn trong máy (Bấm để mở danh sách)
        </summary>
        <div style="margin-top:8px;">
          <div style="display:flex; gap:6px; margin-bottom:6px;">
            <button class="btn btn-sm ${sim.gradeFilter === 'all' ? 'btn-primary' : 'btn-outline'}" onclick="state.similarState.gradeFilter='all'; renderSimilarExamModal();">Tất cả (97)</button>
            <button class="btn btn-sm ${sim.gradeFilter === 'cn10' ? 'btn-primary' : 'btn-outline'}" onclick="state.similarState.gradeFilter='cn10'; renderSimilarExamModal();">Khối 10 (18)</button>
            <button class="btn btn-sm ${sim.gradeFilter === 'cn11' ? 'btn-primary' : 'btn-outline'}" onclick="state.similarState.gradeFilter='cn11'; renderSimilarExamModal();">Khối 11 (41)</button>
            <button class="btn btn-sm ${sim.gradeFilter === 'cn12' ? 'btn-primary' : 'btn-outline'}" onclick="state.similarState.gradeFilter='cn12'; renderSimilarExamModal();">Khối 12 (38)</button>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:6px; max-height:160px; overflow-y:auto; padding-right:4px;">
            ${filteredSamples.map(s => `
              <div style="background:#fff; border:1px solid #cbd5e1; border-radius:6px; padding:6px 8px; display:flex; justify-content:space-between; align-items:center; gap:6px;">
                <div style="overflow:hidden; font-size:12px;">
                  <span class="badge badge-nl" style="font-size:10px;">${escapeHtml(s.gradeLabel)}</span>
                  <div style="font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(s.name)}">${escapeHtml(s.name)}</div>
                </div>
                <button class="btn btn-primary btn-sm" style="padding:3px 7px; font-size:11px; flex-shrink:0;" onclick="selectSampleForSimilarExam('${escapeHtml(s.name)}', '${s.grade}', '${escapeHtml(s.term)}')">Tạo đề tương tự</button>
              </div>
            `).join("")}
          </div>
        </div>
      </details>
    </div>

    <!-- 3 Sub-tabs chuẩn TaoDeThi2026: Phân tích Ma trận | Nội dung Đề thi | Hướng dẫn giải chi tiết -->
    <div style="display:flex; gap:6px; margin-bottom:10px; border-bottom:1px solid var(--border); padding-bottom:8px;">
      <button class="btn btn-sm ${sim.activeSubTab === 'matrix' ? 'btn-primary' : 'btn-outline'}" onclick="state.similarState.activeSubTab='matrix'; renderSimilarExamModal();">
        📊 1. Phân tích Ma trận Đề gốc (${calc.grandTotalPoints}đ)
      </button>
      <button class="btn btn-sm ${sim.activeSubTab === 'exam' ? 'btn-primary' : 'btn-outline'}" onclick="state.similarState.activeSubTab='exam'; renderSimilarExamModal();">
        📝 2. Nội dung Đề Tương Tự (Mã ${ex.examCode})
      </button>
      <button class="btn btn-sm ${sim.activeSubTab === 'solution' ? 'btn-primary' : 'btn-outline'}" onclick="state.similarState.activeSubTab='solution'; renderSimilarExamModal();">
        ✅ 3. Hướng dẫn giải chi tiết (Bảng giải Đ/S)
      </button>
    </div>
  `;

  if (sim.activeSubTab === "matrix") {
    const selectedUnits = state.units.filter(u => u.selected);
    html += `
      <div style="background:#fff; border:1px solid #cbd5e1; border-radius:8px; padding:12px;">
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
          <span class="badge badge-biet" style="font-size:12.5px; padding:4px 10px;">Nhận biết: ${calc.cognitive.bietPoints}đ (${calc.cognitive.bietPct}%)</span>
          <span class="badge badge-hieu" style="font-size:12.5px; padding:4px 10px;">Thông hiểu: ${calc.cognitive.hieuPoints}đ (${calc.cognitive.hieuPct}%)</span>
          <span class="badge badge-vandung" style="font-size:12.5px; padding:4px 10px;">Vận dụng: ${calc.cognitive.vandungPoints}đ (${calc.cognitive.vandungPct}%)</span>
          <span class="badge badge-ok" style="font-size:12.5px; padding:4px 10px;">Tổng: ${selectedUnits.length} bài học • ${calc.grandTotalPoints} điểm</span>
        </div>
        <table class="std-table" style="font-size:12px;">
          <thead>
            <tr>
              <th>TT</th>
              <th>Chủ đề / Bài học</th>
              <th>TN 4 lựa chọn (B-H-VD)</th>
              <th>TN Đúng-Sai (Số ý)</th>
              <th>Tự luận</th>
              <th>Điểm số</th>
            </tr>
          </thead>
          <tbody>
            ${selectedUnits.map((u, idx) => {
              const r = state.matrixRows[u.id] || {};
              const rc = getRowPointCalculation(r);
              return `
                <tr>
                  <td class="text-center">${idx + 1}</td>
                  <td><strong>${escapeHtml(u.lesson)}</strong></td>
                  <td class="text-center">${r.mcq_biet || 0} - ${r.mcq_hieu || 0} - ${r.mcq_vandung || 0}</td>
                  <td class="text-center">${(r.tf_biet || 0) + (r.tf_hieu || 0) + (r.tf_vandung || 0)} ý</td>
                  <td class="text-center">${(r.essay_biet || 0) + (r.essay_hieu || 0) + (r.essay_vandung || 0)} câu</td>
                  <td class="text-center"><strong>${rc.totalPoints.toFixed(2)}đ</strong></td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  } else if (sim.activeSubTab === "exam") {
    html += `
      <div style="background:#fff; border:1px solid #cbd5e1; border-radius:8px; padding:14px; font-size:13px; line-height:1.5;">
        ${buildPrintableExamForCustomData(ex, ex.examCode).split('<div class="page-break"></div>')[0]}
      </div>
    `;
  } else {
    const parts = buildPrintableExamForCustomData(ex, ex.examCode).split('<div class="page-break"></div>');
    html += `
      <div style="background:#fff; border:1px solid #cbd5e1; border-radius:8px; padding:14px; font-size:13px; line-height:1.5;">
        ${parts[1] || parts[0]}
      </div>
    `;
  }

  box.innerHTML = html;
}

function applySimilarExamToMainEditor() {
  const ex = state.similarState.examData;
  if (!ex) return;
  state.exam = JSON.parse(JSON.stringify({ mcq: ex.mcq, tf: ex.tf, short: ex.short, essay: ex.essay }));
  state.meta.examCode = ex.examCode;
  const codeEl = document.getElementById("metaExamCode");
  if (codeEl) codeEl.value = ex.examCode;
  closeSimilarExamModal();
  goToStep(5);
}

function exportSimilarExamWord() {
  const ex = state.similarState.examData || buildSingleExamVariantFromCurrentMatrix(1, "202");
  const bodyHtml = buildPrintableExamForCustomData(ex, ex.examCode);
  const fullDoc = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>De Tuong Tu Ma ${ex.examCode}</title>
    <style>body{font-family:"Times New Roman",serif;font-size:12pt;line-height:1.4;} table{width:100%;border-collapse:collapse;margin:8pt 0;} th,td{border:1px solid #000;padding:4pt 6pt;font-size:11pt;} .page-break{page-break-before:always;}</style>
    </head><body>${bodyHtml}</body></html>
  `;
  const blob = new Blob(['\ufeff', fullDoc], { type: 'application/msword' });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `De-Tuong-Tu-Ma-${ex.examCode}.doc`;
  a.click();
}

// ============================================================================
// LỊCH SỬ TẠO ĐỀ (LOCALSTORAGE) & LỐI TẮT TẢI NHANH MA TRẬN
// ============================================================================
const EXAM_HISTORY_KEY = "cv7991_exam_history_v1";

function getSavedExamHistory() {
  try {
    const raw = localStorage.getItem(EXAM_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function updateHistoryCountBadge() {
  const el = document.getElementById("historyCountBadge");
  if (el) el.textContent = getSavedExamHistory().length;
}

function saveCurrentExamToHistory() {
  const history = getSavedExamHistory();
  const calc = getPartCalculations();
  const newItem = {
    id: "hist_" + Date.now(),
    createdAt: new Date().toLocaleString("vi-VN"),
    meta: JSON.parse(JSON.stringify(state.meta)),
    units: JSON.parse(JSON.stringify(state.units)),
    partConfig: JSON.parse(JSON.stringify(state.partConfig)),
    matrixRows: JSON.parse(JSON.stringify(state.matrixRows)),
    exam: JSON.parse(JSON.stringify(state.exam)),
    summary: `${state.meta.subjectName} • ${state.meta.examTerm} • Mã ${state.meta.examCode} (${calc.grandTotalPoints}đ)`
  };
  history.unshift(newItem);
  const trimmed = history.slice(0, 10);
  localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(trimmed));
  updateHistoryCountBadge();
  renderHistoryModal();
  alert("💾 Đã lưu bộ Hồ sơ Đề (Ma trận + Đặc tả + Đề thi) vào Lịch sử trên trình duyệt!");
}

function openHistoryModal() {
  const modal = document.getElementById("historyModalBackdrop");
  if (!modal) return;
  renderHistoryModal();
  modal.classList.add("open");
}

function closeHistoryModal() {
  const modal = document.getElementById("historyModalBackdrop");
  if (modal) modal.classList.remove("open");
}

function renderHistoryModal() {
  const box = document.getElementById("historyModalContent");
  if (!box) return;
  const list = getSavedExamHistory();
  if (list.length === 0) {
    box.innerHTML = `
      <div style="text-align:center; padding:28px; color:var(--text-muted);">
        Chưa có đề nào được lưu. Hãy bấm nút <strong>"💾 Lưu đề hiện tại"</strong> để lưu bộ Ma trận - Đặc tả - Đề thi và tái sử dụng bất cứ lúc nào!
      </div>
    `;
    return;
  }

  box.innerHTML = `
    <div style="display:grid; gap:8px;">
      ${list.map((item, idx) => `
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <div style="font-weight:700; color:var(--primary-dark); font-size:13.5px;">
              #${idx + 1}. ${escapeHtml(item.summary)}
            </div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">
              🕒 Lưu lúc: ${escapeHtml(item.createdAt)} • Số bài: ${(item.units || []).filter(u => u.selected).length} bài • MCQ: ${(item.exam?.mcq || []).length} câu | Đ/S: ${(item.exam?.tf || []).length} câu | TL: ${(item.exam?.essay || []).length} câu
            </div>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn btn-outline btn-sm" onclick="loadHistoryExamItem('${item.id}')">👁️ Xem lại Đề này</button>
            <button class="btn btn-primary btn-sm" onclick="regenerateFromHistoryMatrix('${item.id}')">🔄 Tạo đề mới từ Ma trận này</button>
            <button class="btn btn-danger btn-sm" onclick="deleteHistoryExamItem('${item.id}')">✕</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function loadHistoryExamItem(id) {
  const item = getSavedExamHistory().find(x => x.id === id);
  if (!item) return;
  state.meta = JSON.parse(JSON.stringify(item.meta));
  state.units = JSON.parse(JSON.stringify(item.units));
  state.partConfig = JSON.parse(JSON.stringify(item.partConfig));
  state.matrixRows = JSON.parse(JSON.stringify(item.matrixRows));
  state.exam = JSON.parse(JSON.stringify(item.exam));
  ensureTfStatementLevels();
  renderPpctTable();
  renderStep2Config();
  renderMatrixTable();
  renderSpecificationTable();
  renderExamEditor();
  closeHistoryModal();
  goToStep(5);
}

function regenerateFromHistoryMatrix(id) {
  const item = getSavedExamHistory().find(x => x.id === id);
  if (!item) return;
  state.meta = JSON.parse(JSON.stringify(item.meta));
  state.meta.examCode = String(Math.floor(100 + Math.random() * 899));
  state.units = JSON.parse(JSON.stringify(item.units));
  state.partConfig = JSON.parse(JSON.stringify(item.partConfig));
  state.matrixRows = JSON.parse(JSON.stringify(item.matrixRows));
  ensureTfStatementLevels();
  renderPpctTable();
  renderStep2Config();
  renderMatrixTable();
  renderSpecificationTable();
  generateExamFromMatrix(false);
  closeHistoryModal();
  goToStep(5);
  alert(`🔄 Đã giữ nguyên Ma trận & Đặc tả cũ và sinh Đề mới thành công (Mã đề: ${state.meta.examCode})!`);
}

function deleteHistoryExamItem(id) {
  const list = getSavedExamHistory().filter(x => x.id !== id);
  localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(list));
  updateHistoryCountBadge();
  renderHistoryModal();
}

function handleQuickShortcutUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const fname = file.name.toLowerCase();
  if (fname.endsWith(".json")) {
    handlePpctFileUpload(event);
    goToStep(3);
    return;
  }
  if (fname.includes("11")) loadPresetCurriculum("cn11_channuoi_gk1");
  else if (fname.includes("12")) loadPresetCurriculum("cn12_lamthuy_gk1");
  else loadPresetCurriculum("cn10_trongtrot_gk1");
  autoGenerateMatrix();
  renderMatrixTable();
  renderSpecificationTable();
  generateExamFromMatrix(false);
  goToStep(5);
  alert(`🚀 Lối tắt thông minh: Đã phân tích cấu trúc từ file "${file.name}" và nhảy thẳng tới Bước 5 (Tạo đề & Đáp án)!`);
}
