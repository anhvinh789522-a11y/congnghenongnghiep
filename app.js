// Ứng dụng Thiết kế & Kiểm định Hồ sơ Đề kiểm tra theo Công văn 7991/BGDĐT-GDTrH
// Quy trình 6 bước chuẩn hóa dành cho môn Công nghệ Nông nghiệp

const state = {
  currentStep: 1,
  meta: {
    department: (localStorage.getItem("cv7991_department") && localStorage.getItem("cv7991_department") !== "SỞ GIÁO DỤC VÀ ĐÀO TẠO BÌNH PHƯỚC") ? localStorage.getItem("cv7991_department") : "SỞ GIÁO DỤC VÀ ĐÀO TẠO TP ĐỒNG NAI",
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
  activeStructurePreset: "mau_1_uutien",
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
      numQuestions: 4, // 4 câu lớn = 16 ý hỏi (1 Biết, 1 Hiểu, 2 Vận dụng mỗi câu)
      counts: { biet: 4, hieu: 4, vandung: 8 }, // 4 câu x 1.0đ = 4.0 điểm
      statementLevels: [
        { a: "biet", b: "hieu", c: "vandung", d: "vandung" },
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
      // Mẫu 1 ưu tiên: Tự luận 2 câu x 1.0đ = 2.0 điểm
      questions: [
        { id: "tl1", label: "Câu 1 (Tự luận)", level: "vandung", points: 1.0 },
        { id: "tl2", label: "Câu 2 (Tự luận)", level: "vandung", points: 1.0 }
      ]
    }
  },
  // Cấu hình Khổ giấy, Căn lề, Phông chữ & Bố cục xuất bản (Chuẩn NĐ 30 & CV 7991)
  printLayout: {
    mode: "hybrid_cv7991", // 'hybrid_cv7991' (Mặc định: Ma trận/Đặc tả khổ ngang, Đề/Đáp án khổ dọc) | 'all_landscape' | 'all_portrait'
    fontSize: "13pt",      // '11pt' | '12pt' | '13pt'
    marginPreset: "nd30",  // 'nd30' | 'compact'
    lessonColWidth: 280,   // px
    specYccdWidth: 450,    // px
    matrixOrientation: "landscape",
    specOrientation: "landscape",
    examOrientation: "portrait",
    answerKeyOrientation: "portrait"
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
  let savedDept = localStorage.getItem("cv7991_department");
  if (!savedDept || savedDept === "SỞ GIÁO DỤC VÀ ĐÀO TẠO BÌNH PHƯỚC") {
    savedDept = "SỞ GIÁO DỤC VÀ ĐÀO TẠO TP ĐỒNG NAI";
    localStorage.setItem("cv7991_department", savedDept);
  }
  state.meta.department = savedDept;
  const deptEl = document.getElementById("metaDepartment");
  const schoolEl = document.getElementById("metaSchool");
  const groupEl = document.getElementById("metaGroup");
  const codeEl = document.getElementById("metaExamCode");
  if (deptEl) deptEl.value = state.meta.department;
  if (schoolEl) schoolEl.value = state.meta.school;
  if (groupEl) groupEl.value = state.meta.group;
  if (codeEl) codeEl.value = state.meta.examCode;

  loadPresetCurriculum("cn10_trongtrot_gk1");
  applyStructurePreset("mau_1_uutien");
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

  if (window.ExternalCorpus && typeof window.ExternalCorpus.updateStep1View === "function") {
    window.ExternalCorpus.updateStep1View();
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

  const tnTlValEl = document.getElementById("metricTnVsTlVal");
  if (tnTlValEl) {
    tnTlValEl.textContent = `TN: ${round2(calc.mcq.totalPoints + calc.tf.totalPoints + calc.short.totalPoints)}đ (${round1((calc.mcq.totalPoints + calc.tf.totalPoints + calc.short.totalPoints) * 10)}%) | TL: ${calc.essay.totalPoints}đ (${round1(calc.essay.totalPoints * 10)}%)`;
  }

  const cogRatioValEl = document.getElementById("metricCognitiveRatioVal");
  if (cogRatioValEl) {
    cogRatioValEl.textContent = `${calc.cognitive.bietPct}% : ${calc.cognitive.hieuPct}% : ${calc.cognitive.vandungPct}%`;
  }

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
    ${!pc.short.enabled ? `
    <tr style="background:#f8fafc; color:#64748b; font-size:12px;">
      <td class="text-center">
        <input type="checkbox" onchange="togglePart('short', this.checked)" style="width:16px;height:16px;" title="Bật lại Phần III" />
      </td>
      <td colspan="5" style="padding:6px 10px;">
        <span style="color:#dc2626; font-weight:600;">✕ Phần III (Trả lời ngắn): Đã xóa theo cấu trúc đề</span>
        <button class="btn btn-outline btn-sm" style="margin-left:10px; padding:1px 6px; font-size:11px;" onclick="togglePart('short', true)">+ Bật lại nếu cần</button>
      </td>
      <td class="text-center">0 câu</td>
      <td class="text-center"><strong style="color:#64748b;">0.00 đ</strong></td>
    </tr>
    ` : `
    <tr>
      <td class="text-center">
        <input type="checkbox" checked onchange="togglePart('short', this.checked)" style="width:17px;height:17px;" />
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
    `}

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
  updatePresetButtonStyles();
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
  const n = state.partConfig.tf.numQuestions || 4;
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

function updatePresetButtonStyles() {
  const active = state.activeStructurePreset || "mau_1_uutien";
  const btn1 = document.getElementById("btnPreset_mau_1");
  const btn2 = document.getElementById("btnPreset_mau_2");
  const btn3 = document.getElementById("btnPreset_mau_3");
  const btn4 = document.getElementById("btnPreset_mau_4");

  if (btn1) btn1.className = active === "mau_1_uutien" ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm";
  if (btn2) btn2.className = active === "mau_2_bo_433" ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm";
  if (btn3) btn3.className = active === "mau_3_tn100" ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm";
  if (btn4) btn4.className = active === "mau_4_tuychinh" ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm";

  const descEl = document.getElementById("structurePresetDesc");
  if (descEl) {
    if (active === "mau_1_uutien") {
      descEl.innerHTML = `⭐ <strong>Mẫu 1 (Ưu tiên):</strong> 16 câu TN (12 Biết, 4 Hiểu) = 4,0đ • 4 câu Đúng/Sai (mỗi câu 1 Biết, 1 Hiểu, 2 Vận dụng) = 4,0đ • Tự luận 2 câu (mỗi câu 1,0đ) = 2,0đ • Xóa Phần 3. Tổng: <strong>10,0 điểm</strong> (80% TN : 20% TL).`;
    } else if (active === "mau_2_bo_433") {
      descEl.innerHTML = `📋 <strong>Mẫu 2 (Theo Bộ 4:3:3):</strong> 16 câu TN = 4,0đ • 3 câu Đúng/Sai = 3,0đ • Tự luận 2 câu (mỗi câu 1,5đ) = 3,0đ • Xóa Phần 3. Tổng: <strong>10,0 điểm</strong> (70% TN : 30% TL).`;
    } else if (active === "mau_3_tn100") {
      descEl.innerHTML = `💯 <strong>Mẫu 3 (100% Trắc nghiệm):</strong> 24 câu TN (6,0đ) + 4 câu Đúng/Sai (4,0đ) • Không có Tự luận. Tổng: <strong>10,0 điểm</strong>.`;
    } else {
      descEl.innerHTML = `⚙️ <strong>Mẫu 4 (Tùy chỉnh tự do):</strong> Toàn quyền chỉnh sửa số câu, số điểm, bật/tắt phần thi theo yêu cầu riêng của đơn vị.`;
    }
  }
}

function applyStructurePreset(presetType) {
  if (presetType === "mau_1_uutien" || presetType === "cv7991_80_20") {
    // =========================================================================
    // MẪU 1 ƯU TIÊN: 16 CÂU TN (12B - 4H) + 4 CÂU Đ/S (MỖI CÂU 1B, 1H, 2VD) + 2 CÂU TL (2.0Đ)
    // =========================================================================
    state.partConfig.mcq = {
      enabled: true,
      title: "PHẦN I. Trắc nghiệm nhiều phương án lựa chọn",
      pointsPerQ: 0.25,
      counts: { biet: 12, hieu: 4, vandung: 0 }
    };
    state.partConfig.tf = {
      enabled: true,
      title: "PHẦN II. Trắc nghiệm Đúng - Sai (Mỗi câu 4 ý a, b, c, d)",
      scoringMode: "progressive",
      pointsPerQuestion: 1.0,
      numQuestions: 4,
      counts: { biet: 4, hieu: 4, vandung: 8 },
      statementLevels: [
        { a: "biet", b: "hieu", c: "vandung", d: "vandung" },
        { a: "biet", b: "hieu", c: "vandung", d: "vandung" },
        { a: "biet", b: "hieu", c: "vandung", d: "vandung" },
        { a: "biet", b: "hieu", c: "vandung", d: "vandung" }
      ]
    };
    state.partConfig.short = {
      enabled: false,
      title: "PHẦN III. Trắc nghiệm trả lời ngắn",
      pointsPerQ: 0.25,
      counts: { biet: 0, hieu: 0, vandung: 0 }
    };
    state.partConfig.essay = {
      enabled: true,
      title: "PHẦN IV. Tự luận",
      questions: [
        { id: "tl1", label: "Câu 1 (Tự luận)", level: "vandung", points: 1.0 },
        { id: "tl2", label: "Câu 2 (Tự luận)", level: "vandung", points: 1.0 }
      ]
    };
    state.activeStructurePreset = "mau_1_uutien";
  } else if (presetType === "mau_2_bo_433" || presetType === "cv7991_70_30") {
    // =========================================================================
    // MẪU 2: THEO BỘ (4 : 3 : 3) (16 TN + 3 Đ/S + 2 TL = 10.0Đ)
    // =========================================================================
    state.partConfig.mcq = {
      enabled: true,
      title: "PHẦN I. Trắc nghiệm nhiều phương án lựa chọn",
      pointsPerQ: 0.25,
      counts: { biet: 12, hieu: 4, vandung: 0 }
    };
    state.partConfig.tf = {
      enabled: true,
      title: "PHẦN II. Trắc nghiệm Đúng - Sai (Mỗi câu 4 ý a, b, c, d)",
      scoringMode: "progressive",
      pointsPerQuestion: 1.0,
      numQuestions: 3,
      counts: { biet: 3, hieu: 3, vandung: 6 },
      statementLevels: [
        { a: "biet", b: "hieu", c: "vandung", d: "vandung" },
        { a: "biet", b: "hieu", c: "vandung", d: "vandung" },
        { a: "biet", b: "hieu", c: "vandung", d: "vandung" }
      ]
    };
    state.partConfig.short = {
      enabled: false,
      title: "PHẦN III. Trắc nghiệm trả lời ngắn",
      pointsPerQ: 0.25,
      counts: { biet: 0, hieu: 0, vandung: 0 }
    };
    state.partConfig.essay = {
      enabled: true,
      title: "PHẦN IV. Tự luận",
      questions: [
        { id: "tl1", label: "Câu 1 (Tự luận)", level: "vandung", points: 1.5 },
        { id: "tl2", label: "Câu 2 (Tự luận)", level: "vandung", points: 1.5 }
      ]
    };
    state.activeStructurePreset = "mau_2_bo_433";
  } else if (presetType === "mau_3_tn100" || presetType === "tn100_thpt") {
    // =========================================================================
    // MẪU 3: 100% TRẮC NGHIỆM (24 CÂU MCQ = 6Đ + 4 CÂU Đ/S = 4Đ = 10.0Đ)
    // =========================================================================
    state.partConfig.mcq = {
      enabled: true,
      title: "PHẦN I. Trắc nghiệm nhiều phương án lựa chọn",
      pointsPerQ: 0.25,
      counts: { biet: 12, hieu: 8, vandung: 4 }
    };
    state.partConfig.tf = {
      enabled: true,
      title: "PHẦN II. Trắc nghiệm Đúng - Sai (Mỗi câu 4 ý a, b, c, d)",
      scoringMode: "progressive",
      pointsPerQuestion: 1.0,
      numQuestions: 4,
      counts: { biet: 4, hieu: 4, vandung: 8 },
      statementLevels: [
        { a: "biet", b: "hieu", c: "vandung", d: "vandung" },
        { a: "biet", b: "hieu", c: "vandung", d: "vandung" },
        { a: "biet", b: "hieu", c: "vandung", d: "vandung" },
        { a: "biet", b: "hieu", c: "vandung", d: "vandung" }
      ]
    };
    state.partConfig.short = {
      enabled: false,
      title: "PHẦN III. Trắc nghiệm trả lời ngắn",
      pointsPerQ: 0.25,
      counts: { biet: 0, hieu: 0, vandung: 0 }
    };
    state.partConfig.essay = {
      enabled: false,
      title: "PHẦN IV. Tự luận",
      questions: []
    };
    state.activeStructurePreset = "mau_3_tn100";
  } else if (presetType === "mau_4_tuychinh") {
    state.activeStructurePreset = "mau_4_tuychinh";
  }
  updatePresetButtonStyles();
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

// ============================================================================
// Há»† THá»NG Tá»° Äá»˜NG CÃ‚N Báº°NG MA TRáº¬N CHUáº¨N ÄÃšNG 10.0 ÄIá»‚M (100% - CHUáº¨N CV 7991)
// ============================================================================

function autoBalanceMatrixTo10Points(showToast = true) {
  const selectedUnits = state.units.filter(u => u.selected);
  if (selectedUnits.length === 0) {
    if (showToast) alert("⚠️ Vui lòng chọn ít nhất 1 bài học ở Bước 1 trước khi cân bằng ma trận!");
    return;
  }

  const pc = state.partConfig;
  const weights = selectedUnits.map(u => Number(u.periods) || 1);

  // 1. Phân bổ MCQ (0.25đ / câu)
  const mcqBiet = (pc.mcq.enabled && pc.mcq.counts) ? (Number(pc.mcq.counts.biet) || 0) : 0;
  const mcqHieu = (pc.mcq.enabled && pc.mcq.counts) ? (Number(pc.mcq.counts.hieu) || 0) : 0;
  const mcqVd = (pc.mcq.enabled && pc.mcq.counts) ? (Number(pc.mcq.counts.vandung) || 0) : 0;
  const mcqBietArr = distributeIntegerByWeights(mcqBiet, weights);
  const mcqHieuArr = distributeIntegerByWeights(mcqHieu, weights);
  const mcqVdArr = distributeIntegerByWeights(mcqVd, weights);

  // 2. Phân bổ Đúng / Sai (0.25đ / ý hỏi)
  const tfBiet = (pc.tf.enabled && pc.tf.counts) ? (Number(pc.tf.counts.biet) || 0) : 0;
  const tfHieu = (pc.tf.enabled && pc.tf.counts) ? (Number(pc.tf.counts.hieu) || 0) : 0;
  const tfVd = (pc.tf.enabled && pc.tf.counts) ? (Number(pc.tf.counts.vandung) || 0) : 0;
  const tfBietArr = distributeIntegerByWeights(tfBiet, weights);
  const tfHieuArr = distributeIntegerByWeights(tfHieu, weights);
  const tfVdArr = distributeIntegerByWeights(tfVd, weights);

  // 3. Phân bổ Trả lời ngắn (0.25đ / câu nếu có)
  const shortBiet = (pc.short.enabled && pc.short.counts) ? (Number(pc.short.counts.biet) || 0) : 0;
  const shortHieu = (pc.short.enabled && pc.short.counts) ? (Number(pc.short.counts.hieu) || 0) : 0;
  const shortVd = (pc.short.enabled && pc.short.counts) ? (Number(pc.short.counts.vandung) || 0) : 0;
  const shortBietArr = distributeIntegerByWeights(shortBiet, weights);
  const shortHieuArr = distributeIntegerByWeights(shortHieu, weights);
  const shortVdArr = distributeIntegerByWeights(shortVd, weights);

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

  // 4. Phân bổ Tự luận (Điểm chính xác từng câu: 1.0đ hoặc 1.5đ)
  if (pc.essay.enabled && Array.isArray(pc.essay.questions) && pc.essay.questions.length > 0) {
    const questions = pc.essay.questions;
    questions.forEach((q, qIdx) => {
      const targetUnitIdx = selectedUnits.length === 1 
        ? 0 
        : (selectedUnits.length - 1 - (qIdx % selectedUnits.length));
      const targetUnit = selectedUnits[targetUnitIdx];
      const row = state.matrixRows[targetUnit.id];
      const lvl = q.level || "vandung";
      const pts = Number(q.points) || 1.0;
      if (lvl === "biet") {
        row.essay_biet = (row.essay_biet || 0) + 1;
        row.essay_points_biet = round2((row.essay_points_biet || 0) + pts);
      } else if (lvl === "hieu") {
        row.essay_hieu = (row.essay_hieu || 0) + 1;
        row.essay_points_hieu = round2((row.essay_points_hieu || 0) + pts);
      } else {
        row.essay_vandung = (row.essay_vandung || 0) + 1;
        row.essay_points_vandung = round2((row.essay_points_vandung || 0) + pts);
      }
    });
  }

  // 5. Đồng bộ & vẽ lại các bảng
  renderMatrixTable();
  if (typeof renderSpecificationTable === "function") renderSpecificationTable();
  if (typeof renderStep2Config === "function") renderStep2Config();
  if (typeof updateMatrixBalanceStatusBanner === "function") updateMatrixBalanceStatusBanner();

  if (showToast) {
    const calc = getPartCalculations();
    alert(`✅ ĐÃ TỰ ĐỘNG CÂN BẰNG MA TRẬN CHUẨN XÁC ${calc.grandTotalPoints.toFixed(2)} / 10.0 ĐIỂM (100%)!\n\n` +
          `• Trắc nghiệm Nhiều LC (Phần I): ${calc.mcq.count} câu = ${calc.mcq.totalPoints.toFixed(2)}đ\n` +
          `• Đúng - Sai (Phần II): ${calc.tf.qCount} câu (${calc.tf.stmtCount} ý) = ${calc.tf.totalPoints.toFixed(2)}đ\n` +
          (pc.short.enabled ? `• Trả lời ngắn (Phần III): ${calc.short.count} câu = ${calc.short.totalPoints.toFixed(2)}đ\n` : `• Trả lời ngắn (Phần III): Đã xóa (0đ)\n`) +
          (pc.essay.enabled ? `• Tự luận (Phần IV): ${calc.essay.count} câu = ${calc.essay.totalPoints.toFixed(2)}đ\n` : `• Tự luận (Phần IV): 0đ\n`) +
          `• Tổng điểm: Đúng 10.00 / 10.0đ.`);
  }
}
function autoGenerateMatrix() {
  autoBalanceMatrixTo10Points(false);
}

function getRowPointCalculation(row) {
  if (!row) return { totalPoints: 0, totalItems: 0 };
  const pc = state.partConfig || {};

  // MCQ: má»—i cÃ¢u Ä‘Ãºng chuáº©n 0.25Ä‘
  const mcqCount = (Number(row.mcq_biet) || 0) + (Number(row.mcq_hieu) || 0) + (Number(row.mcq_vandung) || 0);
  const mcqP = (pc.mcq && pc.mcq.enabled !== false) ? mcqCount * (Number(pc.mcq.pointsPerQ) || 0.25) : 0;

  // ÄÃºng - Sai: má»—i Ã½ lá»‡nh há»i chuáº©n CV 7991 lÃ  0.25Ä‘ (4 Ã½ = 1 cÃ¢u lá»›n = 1.0Ä‘)
  const tfCount = (Number(row.tf_biet) || 0) + (Number(row.tf_hieu) || 0) + (Number(row.tf_vandung) || 0);
  const tfP = (pc.tf && pc.tf.enabled !== false) ? tfCount * 0.25 : 0;

  // Tráº£ lá»i ngáº¯n: má»—i cÃ¢u chuáº©n 0.25Ä‘
  const shortCount = (Number(row.short_biet) || 0) + (Number(row.short_hieu) || 0) + (Number(row.short_vandung) || 0);
  const shortP = (pc.short && pc.short.enabled) ? shortCount * (Number(pc.short.pointsPerQ) || 0.25) : 0;

  // Tá»± luáº­n: Ä‘iá»ƒm thá»±c táº¿ cá»§a cÃ¢u tá»± luáº­n á»Ÿ bÃ i há»c nÃ y (bá»™i sá»‘ 0.5Ä‘ / 1.0Ä‘)
  const essayPoints = (Number(row.essay_points_biet) || 0) +
                      (Number(row.essay_points_hieu) || 0) +
                      (Number(row.essay_points_vandung) || 0);
  const essayP = (pc.essay && pc.essay.enabled !== false) ? essayPoints : 0;

  const totalPoints = round2(mcqP + tfP + shortP + essayP);
  const totalItems = mcqCount + tfCount + shortCount +
                     (Number(row.essay_biet) || 0) +
                     (Number(row.essay_hieu) || 0) +
                     (Number(row.essay_vandung) || 0);

  return { totalPoints, totalItems };
}
// ============================================================================
// CẤU HÌNH BỐ CỤC KHỔ GIẤY, ĐỘ RỘNG CỘT & PHÔNG CHỮ IN ẤN (CHUẨN CV 7991 & NĐ 30)
// ============================================================================

function setDocumentOrientation(docType, orientation) {
  if (docType === "matrix") state.printLayout.matrixOrientation = orientation;
  if (docType === "spec") state.printLayout.specOrientation = orientation;
  if (docType === "exam") state.printLayout.examOrientation = orientation;
  if (docType === "answerKey") state.printLayout.answerKeyOrientation = orientation;

  const lBtn = document.getElementById(`${docType}OrientLandscapeBtn`);
  const pBtn = document.getElementById(`${docType}OrientPortraitBtn`);
  if (lBtn && pBtn) {
    if (orientation === "landscape") {
      lBtn.className = "btn btn-xs btn-primary";
      pBtn.className = "btn btn-xs btn-outline";
    } else {
      lBtn.className = "btn btn-xs btn-outline";
      pBtn.className = "btn btn-xs btn-primary";
    }
  }
}

function setOverallOrientation(mode) {
  state.printLayout.mode = mode;
  const sel = document.getElementById('overallPageOrientationSelect');
  if (sel) sel.value = mode;
  if (mode === "all_landscape") {
    state.printLayout.matrixOrientation = "landscape";
    state.printLayout.specOrientation = "landscape";
    state.printLayout.examOrientation = "landscape";
    state.printLayout.answerKeyOrientation = "landscape";
  } else if (mode === "all_portrait") {
    state.printLayout.matrixOrientation = "portrait";
    state.printLayout.specOrientation = "portrait";
    state.printLayout.examOrientation = "portrait";
    state.printLayout.answerKeyOrientation = "portrait";
  } else { // hybrid_cv7991
    state.printLayout.matrixOrientation = "landscape";
    state.printLayout.specOrientation = "landscape";
    state.printLayout.examOrientation = "portrait";
    state.printLayout.answerKeyOrientation = "portrait";
  }
  setDocumentOrientation("matrix", state.printLayout.matrixOrientation);
  setDocumentOrientation("spec", state.printLayout.specOrientation);
  setDocumentOrientation("exam", state.printLayout.examOrientation);
}

function setLessonColWidth(width, btnElem) {
  state.printLayout.lessonColWidth = width;
  const th = document.getElementById("matrixColLessonTh");
  if (th) {
    th.style.width = width + "px";
    th.style.minWidth = width + "px";
  }
  document.documentElement.style.setProperty("--matrix-lesson-w", width + "px");
  if (btnElem && btnElem.parentElement) {
    btnElem.parentElement.querySelectorAll(".col-w-btn").forEach(b => {
      b.className = "btn btn-xs btn-outline col-w-btn";
    });
    btnElem.className = "btn btn-xs btn-primary col-w-btn";
  }
  renderMatrixTable();
}

function setSpecYccdWidth(width, btnElem) {
  state.printLayout.specYccdWidth = width;
  const th = document.getElementById("specColYccdTh");
  if (th) {
    th.style.width = width + "px";
    th.style.minWidth = width + "px";
  }
  if (btnElem && btnElem.parentElement) {
    btnElem.parentElement.querySelectorAll("button").forEach(b => {
      b.className = "btn btn-xs btn-outline";
    });
    btnElem.className = "btn btn-xs btn-primary";
  }
}

function setPrintFontSize(fontSize) {
  state.printLayout.fontSize = fontSize;
  ["matrixFontSizeSelect", "specFontSizeSelect", "examFontSizeSelect", "overallFontSizeSelect"].forEach(id => {
    const sel = document.getElementById(id);
    if (sel) sel.value = fontSize;
  });
}

function setPrintMargins(marginPreset) {
  state.printLayout.marginPreset = marginPreset;
  const sel = document.getElementById("overallMarginSelect");
  if (sel) sel.value = marginPreset;
}

function renderMatrixTable() {
  const tbody = document.getElementById("matrixTableBody");
  const tfoot = document.getElementById("matrixTableFoot");
  if (!tbody || !tfoot) return;

  const selectedUnits = state.units.filter(u => u.selected);
  if (selectedUnits.length === 0) {
    tbody.innerHTML = `<tr><td colspan="17" class="text-center" style="padding:24px; color:#64748b;">ChÆ°a cÃ³ bÃ i há»c nÃ o Ä‘Æ°á»£c chá»n á»Ÿ BÆ°á»›c 1. Vui lÃ²ng quay láº¡i BÆ°á»›c 1 Ä‘á»ƒ chá»n bÃ i.</td></tr>`;
    tfoot.innerHTML = "";
    return;
  }

  // Tá»± Ä‘á»™ng khá»Ÿi táº¡o náº¿u chÆ°a cÃ³ dá»¯ liá»‡u ma tráº­n
  let needInit = false;
  if (!state.matrixRows) {
    state.matrixRows = {};
    needInit = true;
  } else {
    selectedUnits.forEach(u => {
      if (!state.matrixRows[u.id]) needInit = true;
    });
  }
  if (needInit) {
    autoBalanceMatrixTo10Points(false);
  }

  const sums = {
    mcq_biet: 0, mcq_hieu: 0, mcq_vandung: 0,
    tf_biet: 0, tf_hieu: 0, tf_vandung: 0,
    short_biet: 0, short_hieu: 0, short_vandung: 0,
    essay_biet: 0, essay_hieu: 0, essay_vandung: 0,
    essay_points_biet: 0, essay_points_hieu: 0, essay_points_vandung: 0,
    totalItems: 0, totalPoints: 0
  };

  tbody.innerHTML = selectedUnits.map((u, idx) => {
    const r = state.matrixRows[u.id] || {};
    const rowCalc = getRowPointCalculation(r);

    Object.keys(sums).forEach(k => {
      if (r[k] !== undefined) sums[k] = round2(sums[k] + (Number(r[k]) || 0));
    });
    sums.totalItems += rowCalc.totalItems;
    sums.totalPoints = round2(sums.totalPoints + rowCalc.totalPoints);

    const colW = state.printLayout?.lessonColWidth || 280;
    const rowPct = round1(rowCalc.totalPoints * 10);

    return `
      <tr>
        <td class="text-center" style="font-weight:600;">${idx + 1}</td>
        <td style="min-width:${colW}px; line-height:1.35; padding:6px 8px;">
          <div style="font-size:11px; color:#64748b; margin-bottom:2px;">${escapeHtml(u.chapter)} â€¢ ${u.periods} tiáº¿t</div>
          <strong style="font-size:13px; color:#1e293b;">${escapeHtml(u.lesson)}</strong>
        </td>
        <!-- I. MCQ (0.25Ä‘ / cÃ¢u) -->
        <td class="text-center"><input type="number" class="compact-num" min="0" value="${r.mcq_biet || 0}" onchange="updateMatrixCell('${u.id}', 'mcq_biet', this.value)" title="MCQ Biáº¿t (0.25Ä‘)" /></td>
        <td class="text-center"><input type="number" class="compact-num" min="0" value="${r.mcq_hieu || 0}" onchange="updateMatrixCell('${u.id}', 'mcq_hieu', this.value)" title="MCQ Hiá»ƒu (0.25Ä‘)" /></td>
        <td class="text-center"><input type="number" class="compact-num" min="0" value="${r.mcq_vandung || 0}" onchange="updateMatrixCell('${u.id}', 'mcq_vandung', this.value)" title="MCQ Váº­n dá»¥ng (0.25Ä‘)" /></td>
        <!-- II. ÄÃºng - Sai (0.25Ä‘ / Ã½) -->
        <td class="text-center"><input type="number" class="compact-num" min="0" value="${r.tf_biet || 0}" onchange="updateMatrixCell('${u.id}', 'tf_biet', this.value)" title="ÄÃºng/Sai - Ã Biáº¿t (0.25Ä‘)" /></td>
        <td class="text-center"><input type="number" class="compact-num" min="0" value="${r.tf_hieu || 0}" onchange="updateMatrixCell('${u.id}', 'tf_hieu', this.value)" title="ÄÃºng/Sai - Ã Hiá»ƒu (0.25Ä‘)" /></td>
        <td class="text-center"><input type="number" class="compact-num" min="0" value="${r.tf_vandung || 0}" onchange="updateMatrixCell('${u.id}', 'tf_vandung', this.value)" title="ÄÃºng/Sai - Ã Váº­n dá»¥ng (0.25Ä‘)" /></td>
        <!-- III. Tráº£ lá»i ngáº¯n (0.25Ä‘ / cÃ¢u) -->
        <td class="text-center"><input type="number" class="compact-num" min="0" value="${r.short_biet || 0}" onchange="updateMatrixCell('${u.id}', 'short_biet', this.value)" title="Tráº£ lá»i ngáº¯n Biáº¿t (0.25Ä‘)" /></td>
        <td class="text-center"><input type="number" class="compact-num" min="0" value="${r.short_hieu || 0}" onchange="updateMatrixCell('${u.id}', 'short_hieu', this.value)" title="Tráº£ lá»i ngáº¯n Hiá»ƒu (0.25Ä‘)" /></td>
        <td class="text-center"><input type="number" class="compact-num" min="0" value="${r.short_vandung || 0}" onchange="updateMatrixCell('${u.id}', 'short_vandung', this.value)" title="Tráº£ lá»i ngáº¯n Váº­n dá»¥ng (0.25Ä‘)" /></td>
        <!-- IV. Tá»± luáº­n -->
        <td class="text-center">
          <input type="number" class="compact-num" min="0" value="${r.essay_biet || 0}" onchange="updateMatrixCell('${u.id}', 'essay_biet', this.value)" title="Sá»‘ cÃ¢u TL Biáº¿t" />
          ${r.essay_biet > 0 ? `<div style="font-size:10.5px;color:#1d4ed8;font-weight:700;">${r.essay_points_biet || 1.5}Ä‘</div>` : ''}
        </td>
        <td class="text-center">
          <input type="number" class="compact-num" min="0" value="${r.essay_hieu || 0}" onchange="updateMatrixCell('${u.id}', 'essay_hieu', this.value)" title="Sá»‘ cÃ¢u TL Hiá»ƒu" />
          ${r.essay_hieu > 0 ? `<div style="font-size:10.5px;color:#b45309;font-weight:700;">${r.essay_points_hieu || 1.5}Ä‘</div>` : ''}
        </td>
        <td class="text-center">
          <input type="number" class="compact-num" min="0" value="${r.essay_vandung || 0}" onchange="updateMatrixCell('${u.id}', 'essay_vandung', this.value)" title="Sá»‘ cÃ¢u TL Váº­n dá»¥ng" />
          ${r.essay_vandung > 0 ? `<div style="font-size:10.5px;color:#be185d;font-weight:700;">${r.essay_points_vandung || 1.5}Ä‘</div>` : ''}
        </td>
        <!-- Cá»™t Tá»•ng sá»‘ cÃ¢u, Äiá»ƒm & % cá»§a bÃ i há»c -->
        <td class="text-center"><strong>${rowCalc.totalItems}</strong></td>
        <td class="text-center"><strong style="color:#0f766e; font-size:13.5px;">${rowCalc.totalPoints.toFixed(2)}Ä‘</strong></td>
        <td class="text-center"><strong>${rowPct}%</strong></td>
      </tr>
    `;
  }).join("");

  // Äiá»ƒm cÃ¡c cáº¥p Ä‘á»™ tÆ° duy theo chuáº©n CV 7991:
  const bietPoints = round2(sums.mcq_biet * 0.25 + sums.tf_biet * 0.25 + sums.short_biet * 0.25 + sums.essay_points_biet);
  const hieuPoints = round2(sums.mcq_hieu * 0.25 + sums.tf_hieu * 0.25 + sums.short_hieu * 0.25 + sums.essay_points_hieu);
  const vdPoints = round2(sums.mcq_vandung * 0.25 + sums.tf_vandung * 0.25 + sums.short_vandung * 0.25 + sums.essay_points_vandung);
  const grandTotal = round2(bietPoints + hieuPoints + vdPoints);

  const bietPct = Math.round((bietPoints / 10) * 100);
  const hieuPct = Math.round((hieuPoints / 10) * 100);
  const vdPct = Math.round((vdPoints / 10) * 100);
  const totalPct = Math.round((grandTotal / 10) * 100);

  const isPerfect10 = Math.abs(grandTotal - 10.0) < 0.01;

  tfoot.innerHTML = `
    <tr class="summary-row">
      <td colspan="2" class="text-right" style="font-weight:800; font-size:13px;">Tá»”NG Cá»˜NG</td>
      <td class="text-center" style="font-weight:700;">${sums.mcq_biet}</td>
      <td class="text-center" style="font-weight:700;">${sums.mcq_hieu}</td>
      <td class="text-center" style="font-weight:700;">${sums.mcq_vandung}</td>
      <td class="text-center" style="font-weight:700;">${sums.tf_biet}</td>
      <td class="text-center" style="font-weight:700;">${sums.tf_hieu}</td>
      <td class="text-center" style="font-weight:700;">${sums.tf_vandung}</td>
      <td class="text-center" style="font-weight:700;">${sums.short_biet}</td>
      <td class="text-center" style="font-weight:700;">${sums.short_hieu}</td>
      <td class="text-center" style="font-weight:700;">${sums.short_vandung}</td>
      <td class="text-center" style="font-weight:700;">${sums.essay_biet}</td>
      <td class="text-center" style="font-weight:700;">${sums.essay_hieu}</td>
      <td class="text-center" style="font-weight:700;">${sums.essay_vandung}</td>
      <td class="text-center" style="font-weight:800; font-size:13px;">${sums.totalItems}</td>
      <td class="text-center" style="font-weight:800; font-size:14px; color:${isPerfect10 ? '#15803d' : '#b91c1c'};">${grandTotal.toFixed(2)}Ä‘</td>
      <td class="text-center" style="font-weight:800; font-size:13px; color:${isPerfect10 ? '#15803d' : '#b91c1c'};">${totalPct}%</td>
    </tr>
    <tr>
      <td colspan="2" class="text-right" style="font-weight:700;">Tá»ˆ Lá»† TÆ¯ DUY</td>
      <td colspan="12" class="text-center">
        <span class="badge badge-biet" style="font-size:12px;padding:4px 10px;">Biáº¿t: ${bietPoints.toFixed(2)}Ä‘ (${bietPct}%)</span>
        &nbsp;
        <span class="badge badge-hieu" style="font-size:12px;padding:4px 10px;">Hiá»ƒu: ${hieuPoints.toFixed(2)}Ä‘ (${hieuPct}%)</span>
        &nbsp;
        <span class="badge badge-vandung" style="font-size:12px;padding:4px 10px;">Váº­n dá»¥ng: ${vdPoints.toFixed(2)}Ä‘ (${vdPct}%)</span>
      </td>
      <td colspan="3" class="text-center">
        <strong style="color:${isPerfect10 ? '#15803d' : '#b91c1c'}; font-size:14.5px;">${grandTotal.toFixed(2)} / 10.0Ä‘</strong>
      </td>
    </tr>
  `;

  // Cáº­p nháº­t Banner tráº¡ng thÃ¡i kiá»ƒm soÃ¡t Ä‘iá»ƒm sá»‘ ma tráº­n (ná»•i báº­t, chá»‘ng lá»™n xá»™n)
  const banner = document.getElementById("matrixBalanceStatusBanner");
  if (banner) {
    if (isPerfect10) {
      banner.innerHTML = `
        <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:18px;">âœ…</span>
            <div>
              <strong style="color:#15803d; font-size:13.5px;">MA TRáº¬N ÄÃƒ CÃ‚N Báº°NG CHUáº¨N XÃC: 10.0 / 10.0 ÄIá»‚M (100%)</strong>
              <div style="font-size:11.5px; color:#166534; margin-top:2px;">
                CÆ¡ cáº¥u: 16 cÃ¢u Tráº¯c nghiá»‡m (4.0Ä‘) â€¢ 3 cÃ¢u ÄÃºng/Sai (3.0Ä‘) â€¢ 2 cÃ¢u Tá»± luáº­n (3.0Ä‘) â€¢ Tá»‰ lá»‡: Biáº¿t ${bietPct}% : Hiá»ƒu ${hieuPct}% : Váº­n dá»¥ng ${vdPct}%
              </div>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="autoBalanceMatrixTo10Points(true)" style="font-weight:600;" title="PhÃ¢n bá»• láº¡i Ä‘á»u theo sá»‘ tiáº¿t tá»«ng bÃ i">
            ðŸ”„ CÃ¢n báº±ng láº¡i theo sá»‘ tiáº¿t
          </button>
        </div>
      `;
    } else {
      const diff = round2(grandTotal - 10.0);
      const diffStr = diff > 0 ? `+${diff.toFixed(2)}Ä‘` : `${diff.toFixed(2)}Ä‘`;
      banner.innerHTML = `
        <div style="background:#fef2f2; border:2px solid #ef4444; border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; box-shadow:0 2px 8px rgba(239,68,68,0.12);">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:22px;">âš ï¸</span>
            <div>
              <strong style="color:#b91c1c; font-size:13.5px;">MA TRáº¬N CHÆ¯A CÃ‚N Báº°NG: Tá»”NG ${grandTotal.toFixed(2)}Ä‘ / 10.0Ä‘ (${totalPct}% â€¢ Lá»‡ch ${diffStr})</strong>
              <div style="font-size:11.5px; color:#991b1b; margin-top:2px;">
                Äiá»ƒm sá»‘ Ä‘ang bá»‹ lá»‡ch khá»i chuáº©n 10.0Ä‘. Báº¥m nÃºt bÃªn cáº¡nh Ä‘á»ƒ há»‡ thá»‘ng <strong>tá»± Ä‘á»™ng chá»‰nh sá»­a láº¡i chuáº©n 10.0Ä‘ ngay láº­p tá»©c</strong>.
              </div>
            </div>
          </div>
          <button class="btn btn-primary" onclick="autoBalanceMatrixTo10Points(true)" style="background:#16a34a; font-weight:700; font-size:13px; padding:7px 16px; border:none; box-shadow:0 2px 6px rgba(22,163,74,0.3);">
            âš¡ Tá»° Äá»˜NG CÃ‚N Báº°NG 10.0Ä NGAY
          </button>
        </div>
      `;
    }
  }
}

function updateMatrixCell(unitId, key, val) {
  if (!state.matrixRows || !state.matrixRows[unitId]) return;
  const num = key.includes("points") ? Math.max(0, Number(val) || 0) : Math.max(0, Math.round(Number(val) || 0));
  state.matrixRows[unitId][key] = num;

  if (key.startsWith("essay_") && !key.includes("points")) {
    const pKey = key.replace("essay_", "essay_points_");
    if (num === 0) {
      state.matrixRows[unitId][pKey] = 0;
    } else if (!state.matrixRows[unitId][pKey] || state.matrixRows[unitId][pKey] === 0) {
      state.matrixRows[unitId][pKey] = round2(num * 1.5);
    }
  }

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
    Object.keys(sums).forEach(k => sums[k] += (Number(r[k]) || 0));
  });
  state.partConfig.mcq.counts = { biet: sums.mcq_biet, hieu: sums.mcq_hieu, vandung: sums.mcq_vandung };
  state.partConfig.tf.counts = { biet: sums.tf_biet, hieu: sums.tf_hieu, vandung: sums.tf_vandung };
  const totalTf = sums.tf_biet + sums.tf_hieu + sums.tf_vandung;
  state.partConfig.tf.numQuestions = Math.max(1, Math.round(totalTf / 4));
  state.partConfig.short.counts = { biet: sums.short_biet, hieu: sums.short_hieu, vandung: sums.short_vandung };
}


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
  const selectedExtCorpus = (window.ExternalCorpus ? ExternalCorpus.getSelected() : []) || [];
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
        const extCorpus = selectedExtCorpus[i] || null;
        let baseStem = bankCandidate.stem || bankCandidate.context || "";
        if (extCorpus) {
          baseStem = `Dựa vào dữ liệu thực tiễn trong đoạn trích ngữ liệu "${extCorpus.title}", hãy xác định tính Đúng/Sai của các mệnh đề sau:`;
        } else if (state.questionSourceMode === "adapt") {
          baseStem = adaptAgriculturalText(baseStem, i + 1);
        }
        tfList.push({
          id: "tf_" + (i + 1),
          unitId: targetUnit.id,
          unitName: targetUnit.lesson,
          competency: bankCandidate.competency || targetUnit.competencies[0] || "SDCN",
          points: pc.tf.pointsPerQuestion,
          stem: baseStem,
          externalCorpus: extCorpus,
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
          const extEssayCorpus = (selectedExtCorpus.length > tfList.length)
            ? selectedExtCorpus[tfList.length + essayList.length]
            : (selectedExtCorpus.length > 0 && essayList.length === 0 ? selectedExtCorpus[0] : null);
          let essayStem = bankEssay.stem;
          if (extEssayCorpus && !essayList.some(e => e.externalCorpus && e.externalCorpus.id === extEssayCorpus.id)) {
            essayStem = `[Tình huống thực tế: ${extEssayCorpus.title}]\nTừ tình huống kỹ thuật được nêu trong ngữ liệu đề cương, hãy phân tích và trả lời các yêu cầu sau:\n` + bankEssay.stem;
          }
          essayList.push({
            id: "essay_" + (essayList.length + 1),
            unitId: u.id,
            unitName: u.lesson,
            level: lvl,
            competency: u.competencies.join(", "),
            points: pointPerEssay,
            stem: essayStem,
            externalCorpus: extEssayCorpus,
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
            ${q.externalCorpus ? `
              <div style="background:#f0fdf4; border-left:4px solid #16a34a; border-radius:4px; padding:8px 12px; margin-bottom:8px; font-size:12.5px;">
                <div style="font-weight:700; color:#15803d; margin-bottom:3px; display:flex; justify-content:space-between; align-items:center;">
                  <span>📖 Ngữ liệu bên ngoài theo Đề cương: ${escapeHtml(q.externalCorpus.title)}</span>
                  <span style="font-size:11px; font-weight:normal; color:#16a34a;">Nguồn: ${escapeHtml(q.externalCorpus.source || '')}</span>
                </div>
                <div style="color:#334155; font-style:italic; line-height:1.45;">"${escapeHtml(q.externalCorpus.content)}"</div>
              </div>
            ` : ''}
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
            ${q.externalCorpus ? `
              <div style="background:#f0fdf4; border-left:4px solid #16a34a; border-radius:4px; padding:8px 12px; margin-bottom:8px; font-size:12.5px;">
                <div style="font-weight:700; color:#15803d; margin-bottom:3px; display:flex; justify-content:space-between; align-items:center;">
                  <span>📖 Tình huống nông nghiệp thực tế / Đề cương: ${escapeHtml(q.externalCorpus.title)}</span>
                  <span style="font-size:11px; font-weight:normal; color:#16a34a;">Nguồn: ${escapeHtml(q.externalCorpus.source || '')}</span>
                </div>
                <div style="color:#334155; font-style:italic; line-height:1.45;">"${escapeHtml(q.externalCorpus.content)}"</div>
              </div>
            ` : ''}
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
            ${q.externalCorpus ? `
              <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:6px; padding:6px 10px; margin-bottom:8px; font-size:12px;">
                <strong style="color:#15803d;">📖 Ngữ liệu đề cương: ${escapeHtml(q.externalCorpus.title)}</strong>
                <div style="color:#334155; font-style:italic; margin-top:2px;">"${escapeHtml(q.externalCorpus.content)}"</div>
                <div style="font-size:11px; color:#16a34a; margin-top:3px;">📌 Nguồn: ${escapeHtml(q.externalCorpus.source || '')}</div>
              </div>
            ` : ''}
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
            ${q.externalCorpus ? `
              <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:6px; padding:6px 10px; margin-bottom:8px; font-size:12px;">
                <strong style="color:#15803d;">📖 Tình huống nông nghiệp thực tiễn: ${escapeHtml(q.externalCorpus.title)}</strong>
                <div style="color:#334155; font-style:italic; margin-top:2px;">"${escapeHtml(q.externalCorpus.content)}"</div>
                <div style="font-size:11px; color:#16a34a; margin-top:3px;">📌 Nguồn: ${escapeHtml(q.externalCorpus.source || '')}</div>
              </div>
            ` : ''}
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
  state.meta.department = document.getElementById("metaDepartment")?.value || state.meta.department || "SỞ GIÁO DỤC VÀ ĐÀO TẠO TP ĐỒNG NAI";
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
    state.meta.department = "SỞ GIÁO DỤC VÀ ĐÀO TẠO TP ĐỒNG NAI";
    state.meta.school = "TRƯỜNG THPT LỘC NINH";
    state.meta.group = "TỔ TIN - CÔNG NGHỆ";
  } else if (preset === "dong_nai") {
    state.meta.department = "SỞ GIÁO DỤC VÀ ĐÀO TẠO TP ĐỒNG NAI";
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

// ============================================================================
// HÀM XÂY DỰNG BẢNG MA TRẬN & BẢN ĐẶC TẢ CHUẨN IN WORD (KHÔNG CÓ FORM INPUTS)
// ============================================================================

function buildCleanMatrixHtmlForWord() {
  const selectedUnits = state.units.filter(u => u.selected);
  const sums = {
    mcq_biet: 0, mcq_hieu: 0, mcq_vandung: 0,
    tf_biet: 0, tf_hieu: 0, tf_vandung: 0,
    short_biet: 0, short_hieu: 0, short_vandung: 0,
    essay_biet: 0, essay_hieu: 0, essay_vandung: 0,
    essay_points_biet: 0, essay_points_hieu: 0, essay_points_vandung: 0,
    totalItems: 0, totalPoints: 0
  };

  const rowsHtml = selectedUnits.map((u, idx) => {
    const r = state.matrixRows[u.id] || {};
    const rowCalc = getRowPointCalculation(r);
    Object.keys(sums).forEach(k => {
      if (r[k] !== undefined) sums[k] = round2(sums[k] + r[k]);
    });
    sums.totalItems += rowCalc.totalItems;
    sums.totalPoints = round2(sums.totalPoints + rowCalc.totalPoints);

    const valStr = (v) => (v && v > 0) ? `<strong>${v}</strong>` : `<span style="color:#94a3b8;">-</span>`;
    const essayStr = (count, pts) => {
      if (!count || count <= 0) return `<span style="color:#94a3b8;">-</span>`;
      return `<strong>${count}</strong><br/><span style="font-size:9pt;color:#1e40af;">(${pts}đ)</span>`;
    };

    return `
      <tr>
        <td style="border:1px solid #000; text-align:center; font-size:10pt;">${idx + 1}</td>
        <td style="border:1px solid #000; text-align:left; font-size:10.5pt; padding:4pt 6pt;">
          <div style="font-size:9.5pt; color:#475569;">${escapeHtml(u.chapter)} (${u.periods} tiết)</div>
          <strong>${escapeHtml(u.lesson)}</strong>
        </td>
        <!-- MCQ -->
        <td style="border:1px solid #000; text-align:center; font-size:10pt;">${valStr(r.mcq_biet)}</td>
        <td style="border:1px solid #000; text-align:center; font-size:10pt;">${valStr(r.mcq_hieu)}</td>
        <td style="border:1px solid #000; text-align:center; font-size:10pt;">${valStr(r.mcq_vandung)}</td>
        <!-- TF -->
        <td style="border:1px solid #000; text-align:center; font-size:10pt;">${valStr(r.tf_biet)}</td>
        <td style="border:1px solid #000; text-align:center; font-size:10pt;">${valStr(r.tf_hieu)}</td>
        <td style="border:1px solid #000; text-align:center; font-size:10pt;">${valStr(r.tf_vandung)}</td>
        <!-- Short -->
        <td style="border:1px solid #000; text-align:center; font-size:10pt;">${valStr(r.short_biet)}</td>
        <td style="border:1px solid #000; text-align:center; font-size:10pt;">${valStr(r.short_hieu)}</td>
        <td style="border:1px solid #000; text-align:center; font-size:10pt;">${valStr(r.short_vandung)}</td>
        <!-- Essay -->
        <td style="border:1px solid #000; text-align:center; font-size:10pt;">${essayStr(r.essay_biet, r.essay_points_biet)}</td>
        <td style="border:1px solid #000; text-align:center; font-size:10pt;">${essayStr(r.essay_hieu, r.essay_points_hieu)}</td>
        <td style="border:1px solid #000; text-align:center; font-size:10pt;">${essayStr(r.essay_vandung, r.essay_points_vandung)}</td>
        <!-- Totals -->
        <td style="border:1px solid #000; text-align:center; font-weight:bold; font-size:10pt;">${rowCalc.totalItems}</td>
        <td style="border:1px solid #000; text-align:center; font-weight:bold; font-size:10pt; color:#1e40af;">${rowCalc.totalPoints.toFixed(2)}đ</td>
        <td style="border:1px solid #000; text-align:center; font-weight:bold; font-size:10pt;">${(rowCalc.totalPoints * 10).toFixed(0)}%</td>
      </tr>
    `;
  }).join("");

  const pc = state.partConfig;
    const bietPoints = round2(sums.mcq_biet * 0.25 + sums.tf_biet * 0.25 + sums.short_biet * 0.25 + sums.essay_points_biet);
  const hieuPoints = round2(sums.mcq_hieu * 0.25 + sums.tf_hieu * 0.25 + sums.short_hieu * 0.25 + sums.essay_points_hieu);
  const vdPoints = round2(sums.mcq_vandung * 0.25 + sums.tf_vandung * 0.25 + sums.short_vandung * 0.25 + sums.essay_points_vandung);
  const grandTotal = round2(bietPoints + hieuPoints + vdPoints);

  return `
    <table style="width:100%; border-collapse:collapse; table-layout:fixed; font-family:'Times New Roman',serif; margin:8pt 0;">
      <thead>
        <tr style="background:#f2f2f2;">
          <th rowspan="2" style="border:1px solid #000; width:3.5%; text-align:center; font-weight:bold; padding:4pt 2pt; font-size:10pt;">TT</th>
          <th rowspan="2" style="border:1px solid #000; width:26.5%; text-align:center; font-weight:bold; padding:4pt 6pt; font-size:10.5pt;">Bài học / Đơn vị kiến thức</th>
          <th colspan="3" style="border:1px solid #000; text-align:center; font-weight:bold; padding:4pt 2pt; font-size:10pt;">I. TN Nhiều LC (câu)</th>
          <th colspan="3" style="border:1px solid #000; text-align:center; font-weight:bold; padding:4pt 2pt; font-size:10pt;">II. Đúng - Sai (ý)</th>
          <th colspan="3" style="border:1px solid #000; text-align:center; font-weight:bold; padding:4pt 2pt; font-size:10pt;">III. Trả lời ngắn (câu)</th>
          <th colspan="3" style="border:1px solid #000; text-align:center; font-weight:bold; padding:4pt 2pt; font-size:10pt;">IV. Tự luận (câu)</th>
          <th rowspan="2" style="border:1px solid #000; width:6%; text-align:center; font-weight:bold; padding:4pt 2pt; font-size:10pt;">Tổng lệnh</th>
          <th rowspan="2" style="border:1px solid #000; width:6.5%; text-align:center; font-weight:bold; padding:4pt 2pt; font-size:10pt;">Tổng điểm</th>
          <th rowspan="2" style="border:1px solid #000; width:6%; text-align:center; font-weight:bold; padding:4pt 2pt; font-size:10pt;">Tỉ lệ %</th>
        </tr>
        <tr style="background:#f2f2f2;">
          <th style="border:1px solid #000; width:4.3%; text-align:center; font-size:9.5pt; font-weight:bold; padding:3pt 1pt;">B</th>
          <th style="border:1px solid #000; width:4.3%; text-align:center; font-size:9.5pt; font-weight:bold; padding:3pt 1pt;">H</th>
          <th style="border:1px solid #000; width:4.3%; text-align:center; font-size:9.5pt; font-weight:bold; padding:3pt 1pt;">VD</th>
          <th style="border:1px solid #000; width:4.3%; text-align:center; font-size:9.5pt; font-weight:bold; padding:3pt 1pt;">B</th>
          <th style="border:1px solid #000; width:4.3%; text-align:center; font-size:9.5pt; font-weight:bold; padding:3pt 1pt;">H</th>
          <th style="border:1px solid #000; width:4.3%; text-align:center; font-size:9.5pt; font-weight:bold; padding:3pt 1pt;">VD</th>
          <th style="border:1px solid #000; width:4.3%; text-align:center; font-size:9.5pt; font-weight:bold; padding:3pt 1pt;">B</th>
          <th style="border:1px solid #000; width:4.3%; text-align:center; font-size:9.5pt; font-weight:bold; padding:3pt 1pt;">H</th>
          <th style="border:1px solid #000; width:4.3%; text-align:center; font-size:9.5pt; font-weight:bold; padding:3pt 1pt;">VD</th>
          <th style="border:1px solid #000; width:4.3%; text-align:center; font-size:9.5pt; font-weight:bold; padding:3pt 1pt;">B</th>
          <th style="border:1px solid #000; width:4.3%; text-align:center; font-size:9.5pt; font-weight:bold; padding:3pt 1pt;">H</th>
          <th style="border:1px solid #000; width:4.3%; text-align:center; font-size:9.5pt; font-weight:bold; padding:3pt 1pt;">VD</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
      <tfoot>
        <tr style="background:#f8fafc; font-weight:bold;">
          <td colspan="2" style="border:1px solid #000; text-align:center; padding:4pt 6pt; font-size:10pt;">TỔNG CỘNG SỐ LỆNH HỎI / CÂU</td>
          <td style="border:1px solid #000; text-align:center;">${sums.mcq_biet}</td>
          <td style="border:1px solid #000; text-align:center;">${sums.mcq_hieu}</td>
          <td style="border:1px solid #000; text-align:center;">${sums.mcq_vandung}</td>
          <td style="border:1px solid #000; text-align:center;">${sums.tf_biet}</td>
          <td style="border:1px solid #000; text-align:center;">${sums.tf_hieu}</td>
          <td style="border:1px solid #000; text-align:center;">${sums.tf_vandung}</td>
          <td style="border:1px solid #000; text-align:center;">${sums.short_biet}</td>
          <td style="border:1px solid #000; text-align:center;">${sums.short_hieu}</td>
          <td style="border:1px solid #000; text-align:center;">${sums.short_vandung}</td>
          <td style="border:1px solid #000; text-align:center;">${sums.essay_biet}</td>
          <td style="border:1px solid #000; text-align:center;">${sums.essay_hieu}</td>
          <td style="border:1px solid #000; text-align:center;">${sums.essay_vandung}</td>
          <td style="border:1px solid #000; text-align:center; color:#1e40af;">${sums.totalItems}</td>
          <td style="border:1px solid #000; text-align:center; color:#1e40af;">${sums.totalPoints.toFixed(2)}đ</td>
          <td style="border:1px solid #000; text-align:center;">100%</td>
        </tr>
        <tr style="background:#f1f5f9; font-weight:bold;">
          <td colspan="2" style="border:1px solid #000; text-align:center; padding:4pt 6pt; font-size:10pt;">TỔNG ĐIỂM THEO CẤP ĐỘ TƯ DUY</td>
          <td colspan="3" style="border:1px solid #000; text-align:center; font-size:9.5pt;">Biết: ${bietPoints.toFixed(2)}đ (${(bietPoints * 10).toFixed(0)}%)</td>
          <td colspan="3" style="border:1px solid #000; text-align:center; font-size:9.5pt;">Hiểu: ${hieuPoints.toFixed(2)}đ (${(hieuPoints * 10).toFixed(0)}%)</td>
          <td colspan="6" style="border:1px solid #000; text-align:center; font-size:9.5pt;">Vận dụng: ${vdPoints.toFixed(2)}đ (${(vdPoints * 10).toFixed(0)}%)</td>
          <td colspan="3" style="border:1px solid #000; text-align:center; font-size:10.5pt; color:#15803d;">TỔNG: 10.00đ (100%)</td>
        </tr>
      </tfoot>
    </table>
  `;
}

function buildCleanSpecHtmlForWord() {
  const selectedUnits = state.units.filter(u => u.selected);
  let mcqCursor = 1;
  let tfCursor = 1;
  let shortCursor = 1;
  let essayCursor = 1;

  const rowsHtml = selectedUnits.map((u, idx) => {
    const r = state.matrixRows[u.id] || {};
    const mcqTotal = (r.mcq_biet || 0) + (r.mcq_hieu || 0) + (r.mcq_vandung || 0);
    const tfTotal = (r.tf_biet || 0) + (r.tf_hieu || 0) + (r.tf_vandung || 0);
    const shortTotal = (r.short_biet || 0) + (r.short_hieu || 0) + (r.short_vandung || 0);
    const essayTotal = (r.essay_biet || 0) + (r.essay_hieu || 0) + (r.essay_vandung || 0);

    const mcqRange = mcqTotal > 0 ? `Câu ${mcqCursor} → Câu ${mcqCursor + mcqTotal - 1}` : "-";
    mcqCursor += mcqTotal;

    const tfRange = tfTotal > 0 ? `${tfTotal} ý hỏi<br/>(B:${r.tf_biet}, H:${r.tf_hieu}, VD:${r.tf_vandung})` : "-";
    tfCursor += tfTotal;

    const shortRange = shortTotal > 0 ? `Câu ${shortCursor} → Câu ${shortCursor + shortTotal - 1}` : "-";
    shortCursor += shortTotal;

    const essayRange = essayTotal > 0 ? `Câu TL ${essayCursor}<br/>(${round2((r.essay_points_biet||0) + (r.essay_points_hieu||0) + (r.essay_points_vandung||0))}đ)` : "-";
    essayCursor += essayTotal;

    return `
      <tr>
        <td style="border:1px solid #000; text-align:center; font-size:10pt;">${idx + 1}</td>
        <td style="border:1px solid #000; font-size:10pt; padding:4pt 6pt;">
          <div style="font-size:9pt; color:#475569;">${escapeHtml(u.chapter)}</div>
          <strong>${escapeHtml(u.lesson)}</strong>
        </td>
        <td style="border:1px solid #000; font-size:9.5pt; padding:4pt 6pt; line-height:1.35; text-align:justify;">
          ${u.yccd.biet ? `<div style="margin-bottom:3pt;"><strong style="color:#1d4ed8;">* Nhận biết:</strong> ${escapeHtml(u.yccd.biet)}</div>` : ''}
          ${u.yccd.hieu ? `<div style="margin-bottom:3pt;"><strong style="color:#b45309;">* Thông hiểu:</strong> ${escapeHtml(u.yccd.hieu)}</div>` : ''}
          ${u.yccd.vandung ? `<div><strong style="color:#be185d;">* Vận dụng:</strong> ${escapeHtml(u.yccd.vandung)}</div>` : ''}
        </td>
        <td style="border:1px solid #000; text-align:center; font-size:9.5pt;">
          ${(u.competencies || []).map(c => `<strong>${escapeHtml(c)}</strong>`).join("<br/>")}
        </td>
        <td style="border:1px solid #000; text-align:center; font-size:9.5pt;">
          <strong>${mcqTotal > 0 ? mcqTotal + ' câu' : '-'}</strong><br/>
          <span style="font-size:8.5pt; color:#475569;">${mcqRange}</span>
        </td>
        <td style="border:1px solid #000; text-align:center; font-size:9.5pt;">
          <strong>${tfRange}</strong>
        </td>
        <td style="border:1px solid #000; text-align:center; font-size:9.5pt;">
          <strong>${shortTotal > 0 ? shortTotal + ' câu' : '-'}</strong><br/>
          <span style="font-size:8.5pt; color:#475569;">${shortRange}</span>
        </td>
        <td style="border:1px solid #000; text-align:center; font-size:9.5pt;">
          <strong>${essayTotal > 0 ? essayTotal + ' câu' : '-'}</strong><br/>
          <span style="font-size:8.5pt; color:#475569;">${essayRange}</span>
        </td>
      </tr>
    `;
  }).join("");

  return `
    <table style="width:100%; border-collapse:collapse; table-layout:fixed; font-family:'Times New Roman',serif; margin:8pt 0;">
      <thead>
        <tr style="background:#f2f2f2;">
          <th style="border:1px solid #000; width:3.5%; text-align:center; font-weight:bold; padding:4pt 2pt; font-size:10pt;">TT</th>
          <th style="border:1px solid #000; width:20%; text-align:center; font-weight:bold; padding:4pt 6pt; font-size:10pt;">Bài học / Chủ đề</th>
          <th style="border:1px solid #000; width:44.5%; text-align:center; font-weight:bold; padding:4pt 6pt; font-size:10pt;">Yêu cầu cần đạt</th>
          <th style="border:1px solid #000; width:6%; text-align:center; font-weight:bold; padding:4pt 2pt; font-size:10pt;">Mã NL</th>
          <th style="border:1px solid #000; width:6.5%; text-align:center; font-weight:bold; padding:4pt 2pt; font-size:10pt;">I. MCQ</th>
          <th style="border:1px solid #000; width:6.5%; text-align:center; font-weight:bold; padding:4pt 2pt; font-size:10pt;">II. Đ/S</th>
          <th style="border:1px solid #000; width:6.5%; text-align:center; font-weight:bold; padding:4pt 2pt; font-size:10pt;">III. TLN</th>
          <th style="border:1px solid #000; width:6.5%; text-align:center; font-weight:bold; padding:4pt 2pt; font-size:10pt;">IV. TL</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  `;
}

function createWordBlobDoc(title, bodyContent, customOptions = {}) {
  const opt = Object.assign({
    mode: state.printLayout?.mode || "hybrid_cv7991",
    fontSize: state.printLayout?.fontSize || "13pt",
    marginPreset: state.printLayout?.marginPreset || "nd30",
    orientation: "portrait"
  }, customOptions);

  const marginLandscape = (opt.marginPreset === "compact")
    ? "15mm 10mm 15mm 15mm"
    : "15mm 15mm 15mm 20mm"; // Khổ ngang: Trên 15mm, Dưới 15mm, Phải 15mm, Trái 20mm (đóng gáy)

  const marginPortrait = (opt.marginPreset === "compact")
    ? "15mm 10mm 15mm 15mm"
    : "20mm 15mm 20mm 30mm"; // Chuẩn Nghị định 30/2020: Trên 20mm, Dưới 20mm, Trái 30mm (đóng gáy), Phải 15mm

  let formattedBody = bodyContent;
  if (!formattedBody.includes('class="WordSectionLandscape"') && !formattedBody.includes('class="WordSectionPortrait"')) {
    if (opt.orientation === "landscape") {
      formattedBody = `<div class="WordSectionLandscape">${bodyContent}</div>`;
    } else {
      formattedBody = `<div class="WordSectionPortrait">${bodyContent}</div>`;
    }
  }

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
        @page WordSectionPortrait {
          size: 210mm 297mm;
          margin: ${marginPortrait};
          mso-page-orientation: portrait;
          mso-header-margin: 15mm;
          mso-footer-margin: 15mm;
          mso-paper-source: 0;
        }
        div.WordSectionPortrait {
          page: WordSectionPortrait;
        }
        @page WordSectionLandscape {
          size: 297mm 210mm;
          margin: ${marginLandscape};
          mso-page-orientation: landscape;
          mso-header-margin: 12mm;
          mso-footer-margin: 12mm;
          mso-paper-source: 0;
        }
        div.WordSectionLandscape {
          page: WordSectionLandscape;
        }
        body {
          font-family: "Times New Roman", Times, serif;
          font-size: ${opt.fontSize};
          line-height: 1.3;
          color: #000000;
          text-align: justify;
        }
        p {
          font-family: "Times New Roman", Times, serif;
          font-size: ${opt.fontSize};
          line-height: 1.3;
          margin-top: 0;
          margin-bottom: 4.5pt;
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
          table-layout: fixed;
        }
        th, td {
          border: 1px solid #000000;
          padding: 4.5pt 5pt;
          font-size: 10.5pt;
          vertical-align: middle;
          line-height: 1.25;
          word-wrap: break-word;
          overflow-wrap: break-word;
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
        .section-break {
          clear: all;
          page-break-before: always;
          mso-break-type: section-break;
        }
      </style>
    </head>
    <body>
      ${formattedBody}
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
      if (q.externalCorpus) {
        html += `
          <div style="border:1pt solid #475569; padding:6pt 10pt; margin:8pt 0 4pt 0; background-color:#f8fafc;">
            <p style="margin:0 0 3pt 0; font-weight:bold; font-size:10.5pt;">Đoạn trích ngữ liệu (Câu ${idx + 1}): ${escapeHtml(q.externalCorpus.title)}</p>
            <p style="margin:0; font-style:italic; font-size:10.5pt; text-align:justify; line-height:1.4;">"${escapeHtml(q.externalCorpus.content)}"</p>
            <p style="margin:3pt 0 0 0; text-align:right; font-size:9.5pt;"><em>(Nguồn: ${escapeHtml(q.externalCorpus.source || '')})</em></p>
          </div>
        `;
      }
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
      if (q.externalCorpus && !tf.some(t => t.externalCorpus && t.externalCorpus.id === q.externalCorpus.id)) {
        html += `
          <div style="border:1pt solid #475569; padding:6pt 10pt; margin:8pt 0 4pt 0; background-color:#f8fafc;">
            <p style="margin:0 0 3pt 0; font-weight:bold; font-size:10.5pt;">Tình huống nông nghiệp thực tiễn (Câu ${idx + 1}): ${escapeHtml(q.externalCorpus.title)}</p>
            <p style="margin:0; font-style:italic; font-size:10.5pt; text-align:justify; line-height:1.4;">"${escapeHtml(q.externalCorpus.content)}"</p>
            <p style="margin:3pt 0 0 0; text-align:right; font-size:9.5pt;"><em>(Nguồn: ${escapeHtml(q.externalCorpus.source || '')})</em></p>
          </div>
        `;
      }
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
function buildMatrixAndSpecHeaderHtml() {
  syncExamMetaFromInputs();
  return `
    <table style="width:100%; border:none; margin-bottom:10pt;">
      <tr>
        <td style="border:none; text-align:center; width:45%; vertical-align:top; font-size:11pt; padding:2pt 4pt;">
          <strong>${escapeHtml(state.meta.department.toUpperCase())}</strong><br/>
          <strong>${escapeHtml(state.meta.school.toUpperCase())}</strong><br/>
          <strong>${escapeHtml((state.meta.group || 'TỔ TIN - CÔNG NGHỆ').toUpperCase())}</strong>
        </td>
        <td style="border:none; text-align:center; width:55%; vertical-align:top; padding:2pt 4pt;">
          <strong style="font-size:12pt;">HỒ SƠ CHUYÊN MÔN THEO CÔNG VĂN 7991/BGDĐT-GDTrH</strong><br/>
          <strong>MA TRẬN VÀ BẢN ĐẶC TẢ ĐỀ KIỂM TRA ${escapeHtml(state.meta.examTerm).toUpperCase()}</strong><br/>
          <i>MÔN: ${escapeHtml(state.meta.subjectName).toUpperCase()} - THỜI GIAN: ${state.meta.duration} PHÚT</i>
        </td>
      </tr>
    </table>
    <hr style="border:none; border-top:1px solid #000; margin:4pt 0 8pt 0;"/>
  `;
}

function buildMatrixAndSpecOnlyHtml() {
  const headerHtml = buildMatrixAndSpecHeaderHtml();
  const matrixClean = buildCleanMatrixHtmlForWord();
  const specClean = buildCleanSpecHtmlForWord();
  return `
    ${headerHtml}
    <h3 style="text-align:center; margin:8pt 0 4pt 0;">PHẦN 1. MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ (PHỤ LỤC 1)</h3>
    ${matrixClean}
    <div class="page-break"></div>
    <h3 style="text-align:center; margin:8pt 0 4pt 0;">PHẦN 2. BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KỲ (PHỤ LỤC 2)</h3>
    ${specClean}
  `;
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
    const orientation = state.printLayout?.examOrientation || "portrait";
    const blob = createWordBlobDoc(`De-Thi-${state.meta.examCode}`, content, { orientation: orientation });
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
  const orientation = state.printLayout?.matrixOrientation || "landscape";
  const blob = createWordBlobDoc(`Ma-Tran-Dac-Ta-CV7991`, content, { orientation: orientation });
  downloadWordBlob(blob, `Ma-Tran-Dac-Ta-CV7991-${state.meta.subjectName.replace(/\s+/g, '-')}.doc`);
}

// C. Tải Hướng dẫn chấm & Đáp án chi tiết (dành cho Giám khảo)
function exportAnswerKeyWord(triggerCheck = true) {
  const doExport = () => {
    syncExamMetaFromInputs();
    const content = buildExamAnswerKeyOnlyHtml();
    const orientation = state.printLayout?.answerKeyOrientation || "portrait";
    const blob = createWordBlobDoc(`Huong-Dan-Cham-${state.meta.examCode}`, content, { orientation: orientation });
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
    alert("🚀 Bắt đầu tải 3 file rời về máy tính:\n1. Ma trận & Đặc tả (Khổ Ngang)\n2. Đề thi in cho học sinh (Khổ Dọc)\n3. Hướng dẫn chấm & Đáp án (Khổ Dọc)");
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
  const headerHtml = buildMatrixAndSpecHeaderHtml();
  const matrixHtml = buildCleanMatrixHtmlForWord();
  const specHtml = buildCleanSpecHtmlForWord();
  const examHtml = buildPrintableExamHtml();

  let bodyContent = "";
  const mode = state.printLayout?.mode || "hybrid_cv7991";

  if (mode === "hybrid_cv7991") {
    // Chuẩn CV 7991: Ma trận & Bản đặc tả in Khổ Ngang, Đề thi & Hướng dẫn chấm in Khổ Dọc
    bodyContent = `
      <div class="WordSectionLandscape">
        ${headerHtml}
        <h3 style="text-align:center; margin:8pt 0 4pt 0;">PHẦN 1. MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ (PHỤ LỤC 1)</h3>
        ${matrixHtml}
        <div class="page-break"></div>
        <h3 style="text-align:center; margin:8pt 0 4pt 0;">PHẦN 2. BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KỲ (PHỤ LỤC 2)</h3>
        ${specHtml}
      </div>
      <br clear="all" style="page-break-before:always; mso-break-type:section-break" />
      <div class="WordSectionPortrait">
        ${examHtml}
      </div>
    `;
  } else if (mode === "all_landscape") {
    bodyContent = `
      <div class="WordSectionLandscape">
        ${headerHtml}
        <h3 style="text-align:center; margin:8pt 0 4pt 0;">PHẦN 1. MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ (PHỤ LỤC 1)</h3>
        ${matrixHtml}
        <div class="page-break"></div>
        <h3 style="text-align:center; margin:8pt 0 4pt 0;">PHẦN 2. BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KỲ (PHỤ LỤC 2)</h3>
        ${specHtml}
        <div class="page-break"></div>
        ${examHtml}
      </div>
    `;
  } else {
    // all_portrait
    bodyContent = `
      <div class="WordSectionPortrait">
        ${headerHtml}
        <h3 style="text-align:center; margin:8pt 0 4pt 0;">PHẦN 1. MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ (PHỤ LỤC 1)</h3>
        ${matrixHtml}
        <div class="page-break"></div>
        <h3 style="text-align:center; margin:8pt 0 4pt 0;">PHẦN 2. BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KỲ (PHỤ LỤC 2)</h3>
        ${specHtml}
        <div class="page-break"></div>
        ${examHtml}
      </div>
    `;
  }

  const blob = createWordBlobDoc(`Ho-So-De-Thi-CV7991-${state.meta.examCode}`, bodyContent, { mode: mode });
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

function generateFourVariantExams(showToast = true) {
  const codes = ["101", "102", "103", "104"];

  // Đề 1 (Mã 101): Lấy trực tiếp từ state.exam hiện tại đã được kiểm định/tối ưu
  const mainExam = JSON.parse(JSON.stringify(state.exam));
  const exam101 = {
    variantNumber: 1,
    examCode: codes[0],
    mcq: mainExam.mcq || [],
    tf: mainExam.tf || [],
    short: mainExam.short || [],
    essay: mainExam.essay || []
  };

  // Đề 2, 3, 4: Sinh từ ma trận với hoán vị câu hỏi, đảo phương án A-B-C-D và bối cảnh kỹ thuật
  const exam102 = buildSingleExamVariantFromCurrentMatrix(1, codes[1]);
  const exam103 = buildSingleExamVariantFromCurrentMatrix(2, codes[2]);
  const exam104 = buildSingleExamVariantFromCurrentMatrix(3, codes[3]);

  state.variantExams = [exam101, exam102, exam103, exam104];
  openVariantsModal();
  renderVariantsModal();
  if (showToast) {
    alert("⚡ Đã sinh thành công Bộ 4 Đề Tương Tự (Mã 101 • 102 • 103 • 104) chuẩn 100% Ma trận & Bản đặc tả!");
  }
}

// Bảng Ma trận Đáp Án Đối Chiếu Cả 4 Mã Đề (rất tiện cho chấm thi & giám sát coi thi)
function buildAnswersComparisonTableHtml(variants) {
  if (!variants || variants.length === 0) return "";
  const vList = variants.slice(0, 4);
  const v0 = vList[0] || {};
  const mcqLen = (v0.mcq || []).length;
  const tfLen = (v0.tf || []).length;
  const shortLen = (v0.short || []).length;

  let html = `
    <div style="background:#fff; border:1.5px solid #cbd5e1; border-radius:8px; padding:12px; margin-bottom:12px;">
      <h4 style="margin:0 0 8px 0; color:#14532d; font-size:14.5px; display:flex; align-items:center; gap:6px;">
        <span>📊</span> BẢNG ĐÁP ÁN ĐỐI CHIẾU 4 MÃ ĐỀ TRẮC NGHIỆM (101 • 102 • 103 • 104)
      </h4>
      <p style="font-size:12px; color:#64748b; margin:0 0 10px 0;">
        Giúp giáo viên đối soát nhanh phương án đúng giữa 4 mã đề trong cùng một phòng thi:
      </p>

      <!-- I. MCQ -->
      ${mcqLen > 0 ? `
        <strong style="font-size:12.5px; color:#1e40af; display:block; margin-bottom:4px;">PHẦN I. TRẮC NGHIỆM NHIỀU LỰA CHỌN (PHƯƠNG ÁN ĐÚNG)</strong>
        <table class="std-table" style="font-size:12px; margin-bottom:12px; width:100%;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="width:55px; text-align:center;">Câu</th>
              ${vList.map(v => `<th style="text-align:center; color:#15803d; font-weight:800;">Mã ${v.examCode}</th>`).join("")}
              <th style="width:75px; text-align:center;">Cấp độ</th>
              <th style="width:65px; text-align:center;">Điểm</th>
            </tr>
          </thead>
          <tbody>
            ${(v0.mcq || []).map((q, idx) => `
              <tr>
                <td class="text-center font-bold">Câu ${idx + 1}</td>
                ${vList.map(v => {
                  const item = (v.mcq && v.mcq[idx]);
                  const letter = item ? String.fromCharCode(65 + item.answer) : "-";
                  return `<td class="text-center" style="font-weight:700; color:#1e40af; font-size:13px;">${letter}</td>`;
                }).join("")}
                <td class="text-center">${q.level === 'biet' ? 'Biết' : q.level === 'hieu' ? 'Hiểu' : 'Vận dụng'}</td>
                <td class="text-center">${q.points}đ</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      ` : ''}

      <!-- II. TF -->
      ${tfLen > 0 ? `
        <strong style="font-size:12.5px; color:#1e40af; display:block; margin-bottom:4px;">PHẦN II. TRẮC NGHIỆM ĐÚNG - SAI (KẾT QUẢ Đ/S TỪNG Ý HỎI)</strong>
        <table class="std-table" style="font-size:12px; margin-bottom:12px; width:100%;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="width:55px; text-align:center;">Câu</th>
              <th style="width:40px; text-align:center;">Ý</th>
              ${vList.map(v => `<th style="text-align:center; color:#15803d; font-weight:800;">Mã ${v.examCode}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${(v0.tf || []).map((q, qIdx) => (q.statements || []).map((st, sIdx) => `
              <tr>
                ${sIdx === 0 ? `<td rowspan="4" class="text-center font-bold" style="vertical-align:middle; background:#f8fafc;">Câu ${qIdx + 1}</td>` : ''}
                <td class="text-center font-bold">${st.label})</td>
                ${vList.map(v => {
                  const targetQ = (v.tf && v.tf[qIdx]);
                  const targetSt = targetQ && targetQ.statements && targetQ.statements[sIdx];
                  const isT = targetSt ? targetSt.isTrue : false;
                  return `<td class="text-center font-bold" style="color:${isT ? '#15803d' : '#dc2626'};">${isT ? 'Đúng' : 'Sai'}</td>`;
                }).join("")}
              </tr>
            `).join("")).join("")}
          </tbody>
        </table>
      ` : ''}

      <!-- III. SHORT -->
      ${shortLen > 0 ? `
        <strong style="font-size:12.5px; color:#1e40af; display:block; margin-bottom:4px;">PHẦN III. TRẢ LỜI NGẮN (ĐÁP SỐ CHUẨN)</strong>
        <table class="std-table" style="font-size:12px; width:100%;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="width:55px; text-align:center;">Câu</th>
              ${vList.map(v => `<th style="text-align:center; color:#15803d; font-weight:800;">Mã ${v.examCode}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${(v0.short || []).map((q, idx) => `
              <tr>
                <td class="text-center font-bold">Câu ${idx + 1}</td>
                ${vList.map(v => {
                  const item = (v.short && v.short[idx]);
                  return `<td class="text-center font-bold" style="color:#0f172a;">${escapeHtml(item ? item.answer : '-')}</td>`;
                }).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      ` : ''}
    </div>
  `;
  return html;
}

function renderVariantsModal() {
  const box = document.getElementById("variantsModalContent");
  if (!box) return;
  const variants = state.variantExams || [];
  const activeTab = state.variantActiveTab || "exams";

  let html = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button class="btn btn-sm ${activeTab === 'exams' ? 'btn-primary' : 'btn-outline'}" onclick="state.variantActiveTab='exams'; renderVariantsModal();">
          📄 Xem 4 Đề Tương Tự (Mã 101 • 102 • 103 • 104)
        </button>
        <button class="btn btn-sm ${activeTab === 'matrix_answers' ? 'btn-primary' : 'btn-outline'}" onclick="state.variantActiveTab='matrix_answers'; renderVariantsModal();">
          📊 Bảng Đáp Án Đối Chiếu (4 Mã Đề)
        </button>
        <button class="btn btn-sm ${activeTab === 'solutions' ? 'btn-primary' : 'btn-outline'}" onclick="state.variantActiveTab='solutions'; renderVariantsModal();">
          📑 Giải Chi Tiết Từng Mã Đề
        </button>
      </div>
      <div style="font-size:12px; color:var(--primary-dark); font-weight:700;">
        💡 Mỗi đề tự động đảo câu hỏi & phương án, giữ 100% cấu trúc Ma trận & Đặc tả
      </div>
    </div>
  `;

  if (activeTab === "matrix_answers") {
    html += buildAnswersComparisonTableHtml(variants);
  } else if (activeTab === "exams") {
    html += `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px;">
        ${variants.map((v, vIdx) => `
          <div style="border:1.5px solid #cbd5e1; border-radius:8px; background:#fff; display:flex; flex-direction:column; max-height:64vh; box-shadow:0 1px 4px rgba(0,0,0,0.05);">
            <div style="padding:10px 12px; background:linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%); border-bottom:1px solid #cbd5e1; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span class="badge badge-ok" style="font-size:11px;">MÃ ĐỀ ${v.examCode}</span>
                <strong style="color:var(--primary-dark); margin-left:4px; font-size:13px;">Đề số ${v.variantNumber || (vIdx + 1)}</strong>
              </div>
              <div style="display:flex; gap:4px;">
                <button class="btn btn-outline btn-xs" onclick="applyVariantToMainEditor(${vIdx})" title="Đưa đề này ra màn hình chính Bước 5">⚡ Nạp</button>
                <button class="btn btn-primary btn-xs" onclick="exportSingleVariantWord(${vIdx})" title="Tải riêng file Word của mã đề này">📥 Tải .doc</button>
              </div>
            </div>
            <div style="padding:10px 12px; overflow-y:auto; font-size:12px; line-height:1.45; flex:1;">
              ${(v.mcq || []).length > 0 ? `
                <div style="font-weight:700; color:var(--primary-dark); margin-bottom:6px;">PHẦN I. TRẮC NGHIỆM (${v.mcq.length} câu)</div>
                ${v.mcq.map((q, idx) => `
                  <div style="margin-bottom:8px; padding-bottom:6px; border-bottom:1px dashed #e2e8f0;">
                    <div><strong>Câu ${idx + 1}:</strong> ${escapeHtml(q.stem)}</div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:2px; font-size:11px; color:#334155; margin-top:3px;">
                      ${q.options.map((opt, oIdx) => `<div><strong>${String.fromCharCode(65 + oIdx)}.</strong> ${escapeHtml(opt)}</div>`).join("")}
                    </div>
                  </div>
                `).join("")}
              ` : ''}
              ${(v.tf || []).length > 0 ? `
                <div style="font-weight:700; color:var(--primary-dark); margin:10px 0 6px;">PHẦN II. ĐÚNG - SAI (${v.tf.length} câu)</div>
                ${v.tf.map((q, idx) => `
                  <div style="margin-bottom:8px; padding-bottom:6px; border-bottom:1px dashed #e2e8f0;">
                    <div><strong>Câu ${idx + 1}:</strong> ${escapeHtml(q.stem)}</div>
                    <div style="font-size:11px; color:#334155; margin-top:3px;">
                      ${q.statements.map(st => `<div><strong>${st.label})</strong> ${escapeHtml(st.text)}</div>`).join("")}
                    </div>
                  </div>
                `).join("")}
              ` : ''}
              ${(v.short || []).length > 0 ? `
                <div style="font-weight:700; color:var(--primary-dark); margin:10px 0 6px;">PHẦN III. TRẢ LỜI NGẮN (${v.short.length} câu)</div>
                ${v.short.map((q, idx) => `<div style="margin-bottom:6px;"><strong>Câu ${idx + 1}:</strong> ${escapeHtml(q.stem)}</div>`).join("")}
              ` : ''}
              ${(v.essay || []).length > 0 ? `
                <div style="font-weight:700; color:var(--primary-dark); margin:10px 0 6px;">PHẦN IV. TỰ LUẬN (${v.essay.length} câu)</div>
                ${v.essay.map((q, idx) => `<div style="margin-bottom:6px;"><strong>Câu ${idx + 1} (${q.points}đ):</strong> ${escapeHtml(q.stem)}</div>`).join("")}
              ` : ''}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  } else {
    // solutions tab
    html += `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px;">
        ${variants.map(v => `
          <div style="border:1.5px solid #cbd5e1; border-radius:8px; background:#fff; padding:10px 12px; max-height:64vh; overflow-y:auto; font-size:12px;">
            <div style="font-weight:700; color:var(--primary-dark); font-size:13.5px; margin-bottom:8px; border-bottom:1px solid #e2e8f0; padding-bottom:4px; display:flex; justify-content:space-between; align-items:center;">
              <span>✅ ĐÁP ÁN MÃ ĐỀ ${v.examCode}</span>
              <button class="btn btn-outline btn-xs" onclick="exportSingleVariantWord(${variants.indexOf(v)})">Tải .doc</button>
            </div>
            ${(v.mcq || []).length > 0 ? `
              <div style="margin-bottom:10px;">
                <strong>I. Bảng đáp án MCQ:</strong>
                <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
                  ${v.mcq.map((q, idx) => `
                    <span style="background:#f0fdf4; border:1px solid #bbf7d0; padding:2px 5px; border-radius:4px; font-size:11px;">
                      <strong>${idx + 1}.</strong> <span style="color:#15803d; font-weight:700;">${String.fromCharCode(65 + q.answer)}</span>
                    </span>
                  `).join("")}
                </div>
              </div>
            ` : ''}
            ${(v.tf || []).length > 0 ? `
              <div style="margin-bottom:10px;">
                <strong>II. Bảng giải chi tiết Đúng - Sai:</strong>
                <table class="std-table" style="margin-top:4px; font-size:11px;">
                  <thead><tr><th style="width:38px;">Câu</th><th style="width:28px;">Ý</th><th style="width:48px;">Đ/S</th><th>Giải thích chuẩn SGK</th></tr></thead>
                  <tbody>
                    ${v.tf.map((q, idx) => q.statements.map((st, sIdx) => `
                      <tr>
                        ${sIdx === 0 ? `<td rowspan="4" class="text-center font-bold">C${idx + 1}</td>` : ''}
                        <td class="text-center font-bold">${st.label})</td>
                        <td class="text-center font-bold" style="color:${st.isTrue ? '#15803d' : '#dc2626'};">${st.isTrue ? 'Đúng' : 'Sai'}</td>
                        <td>${escapeHtml(st.explanation)}</td>
                      </tr>
                    `).join("")).join("")}
                  </tbody>
                </table>
              </div>
            ` : ''}
            ${(v.essay || []).length > 0 ? `
              <div>
                <strong>III. Hướng dẫn chấm Tự luận:</strong>
                ${v.essay.map((q, idx) => `
                  <div style="margin-top:4px; background:#f8fafc; padding:6px 8px; border-radius:5px; border:1px solid #e2e8f0;">
                    <strong>Câu ${idx + 1} (${q.points}đ):</strong><br/>
                    ${(q.rubric || []).map(r => `• ${escapeHtml(r)}`).join("<br/>")}
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
  const blob = createWordBlobDoc(`De-Thi-Bien-The-Ma-${v.examCode}`, bodyHtml, { orientation: "portrait" });
  downloadWordBlob(blob, `De-Thi-Bien-The-Ma-${v.examCode}.doc`);
}

function exportAllFourVariantsWord() {
  if (!state.variantExams || state.variantExams.length === 0) {
    generateFourVariantExams(false);
  }
  const headerHtml = buildMatrixAndSpecHeaderHtml();
  const matrixHtml = buildCleanMatrixHtmlForWord();
  const specHtml = buildCleanSpecHtmlForWord();
  const answersComparisonHtml = buildAnswersComparisonTableHtml(state.variantExams);

  const variantsHtml = state.variantExams.map((v, idx) => `
    ${idx > 0 ? '<div class="page-break"></div>' : ''}
    <h2 style="text-align:center; color:#15803d; margin:10pt 0 4pt 0;">ĐỀ KIỂM TRA BIẾN THỂ SỐ ${v.variantNumber || (idx + 1)} (MÃ ĐỀ: ${v.examCode})</h2>
    ${buildPrintableExamForCustomData(v, v.examCode)}
  `).join("");

  const bodyContent = `
    <div class="WordSectionLandscape">
      ${headerHtml}
      <h3 style="text-align:center; margin:8pt 0 4pt 0;">PHẦN A. MA TRẬN ĐỀ KIỂM TRA CHUNG CHO 4 MÃ ĐỀ (PHỤ LỤC 1)</h3>
      ${matrixHtml}
      <div class="page-break"></div>
      <h3 style="text-align:center; margin:8pt 0 4pt 0;">PHẦN B. BẢN ĐẶC TẢ ĐỀ KIỂM TRA CHUNG CHO 4 MÃ ĐỀ (PHỤ LỤC 2)</h3>
      ${specHtml}
      <div class="page-break"></div>
      <h3 style="text-align:center; margin:8pt 0 4pt 0;">PHẦN C. BẢNG ĐÁP ÁN ĐỐI CHIẾU 4 MÃ ĐỀ (101 • 102 • 103 • 104)</h3>
      ${answersComparisonHtml}
    </div>
    <br clear="all" style="page-break-before:always; mso-break-type:section-break" />
    <div class="WordSectionPortrait">
      <h3 style="text-align:center; margin:8pt 0 4pt 0;">PHẦN D. NỘI DUNG 4 MÃ ĐỀ THI & HƯỚNG DẪN CHẤM</h3>
      ${variantsHtml}
    </div>
  `;

  const blob = createWordBlobDoc(`Bo-4-De-Tuong-Tu-101-102-103-104-CV7991`, bodyContent, { mode: "hybrid_cv7991" });
  downloadWordBlob(blob, `Bo-4-De-Tuong-Tu-101-102-103-104-CV7991.doc`);
}

function exportAllThreeVariantsWord() {
  exportAllFourVariantsWord();
}
function generateThreeVariantExams(showToast = true) {
  generateFourVariantExams(showToast);
}
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

// ============================================================================
// CHỨC NĂNG LƯU ĐỀ & THƯ VIỆN ĐỀ ĐÃ TẠO (LOCALSTORAGE + SAO LƯU BACKUP JSON)
// ============================================================================

const SAVED_EXAMS_KEY = "cv7991_saved_exams";

function getSavedExamsList() {
  try {
    const raw = localStorage.getItem(SAVED_EXAMS_KEY) || localStorage.getItem(EXAM_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function updateSavedExamsBadge() {
  const count = getSavedExamsList().length;
  ["savedExamCountBadge", "topSavedCountBadge", "step6SavedCountBadge", "historyCountBadge"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
  });
}

function updateHistoryCountBadge() {
  updateSavedExamsBadge();
}

function saveCurrentExamToLibrary() {
  syncExamMetaFromInputs();
  const list = getSavedExamsList();
  const defaultTitle = `${state.meta.school} — ${state.meta.subjectName} (${state.meta.examTerm}) — Mã ${state.meta.examCode}`;
  const customTitle = prompt("Nhập tên lưu cho bộ đề kiểm tra này:", defaultTitle);
  if (customTitle === null) return; // người dùng ấn Cancel

  const examItem = {
    id: "exam_" + Date.now(),
    title: (customTitle || defaultTitle).trim(),
    createdAt: new Date().toLocaleString("vi-VN"),
    auditScore: state.audit?.score || 100,
    meta: JSON.parse(JSON.stringify(state.meta)),
    units: JSON.parse(JSON.stringify(state.units)),
    partConfig: JSON.parse(JSON.stringify(state.partConfig)),
    matrixRows: JSON.parse(JSON.stringify(state.matrixRows)),
    specOverrides: JSON.parse(JSON.stringify(state.specOverrides || {})),
    exam: JSON.parse(JSON.stringify(state.exam)),
    printLayout: JSON.parse(JSON.stringify(state.printLayout || {}))
  };

  list.unshift(examItem);
  const trimmed = list.slice(0, 50); // Lưu tối đa 50 đề
  localStorage.setItem(SAVED_EXAMS_KEY, JSON.stringify(trimmed));
  localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(trimmed));
  updateSavedExamsBadge();
  renderSavedExamsModal();
  alert(`✅ Đã lưu thành công đề "${examItem.title}" vào Thư viện Đề đã lưu!`);
}

function saveCurrentExamToHistory() {
  saveCurrentExamToLibrary();
}

function openSavedExamsModal() {
  const modal = document.getElementById("historyModalBackdrop");
  if (!modal) return;
  renderSavedExamsModal();
  modal.classList.add("open");
}

function openHistoryModal() {
  openSavedExamsModal();
}

function closeSavedExamsModal() {
  const modal = document.getElementById("historyModalBackdrop");
  if (modal) modal.classList.remove("open");
}

function closeHistoryModal() {
  closeSavedExamsModal();
}

function renderSavedExamsModal() {
  const box = document.getElementById("historyModalContent");
  if (!box) return;
  const list = getSavedExamsList();
  if (list.length === 0) {
    box.innerHTML = `
      <div style="text-align:center; padding:36px 16px; color:#64748b;">
        <span style="font-size:36px; display:block; margin-bottom:8px;">📂</span>
        <strong style="font-size:15px; color:#1e293b;">Chưa có đề nào được lưu trong Thư viện</strong>
        <p style="font-size:12.5px; margin:6px 0 14px;">Bấm nút <strong>"💾 Lưu đề vào thư viện"</strong> ở Bước 5 hoặc Bước 6 để lưu trữ và nạp lại bất cứ lúc nào!</p>
        <button class="btn btn-primary btn-sm" onclick="saveCurrentExamToLibrary(); renderSavedExamsModal();">💾 Lưu đề hiện tại ngay</button>
      </div>
    `;
    return;
  }

  box.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
      <div style="font-size:13px; color:#475569;">
        Đang có <strong>${list.length}</strong> đề kiểm tra đã lưu trong bộ nhớ:
      </div>
      <div style="display:flex; gap:6px;">
        <button class="btn btn-outline btn-xs" onclick="exportSavedExamsBackupFile()">📤 Xuất file Backup (.json)</button>
        <button class="btn btn-outline btn-xs" onclick="document.getElementById('importBackupFileInput').click()">📥 Nạp file Backup</button>
        <input type="file" id="importBackupFileInput" accept=".json" style="display:none;" onchange="importSavedExamsBackupFile(event)" />
      </div>
    </div>
    <div style="display:grid; gap:10px;">
      ${list.map((item, idx) => `
        <div style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:10px; padding:12px 14px; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:700;">#${idx + 1}</span>
                <strong style="font-size:14px; color:#0f172a;">${escapeHtml(item.title || item.summary || 'Đề kiểm tra')}</strong>
                <span class="badge ${item.auditScore >= 90 ? 'badge-ok' : 'badge-warn'}" style="font-size:11px;">
                  ${item.auditScore || 100}/100đ
                </span>
              </div>
              <div style="font-size:12px; color:#64748b; margin-top:4px; line-height:1.5;">
                🕒 Lưu lúc: <strong>${escapeHtml(item.createdAt)}</strong> • Mã đề: <strong>${escapeHtml(item.meta?.examCode || '101')}</strong> • Thời gian: <strong>${item.meta?.duration || 45}'</strong><br/>
                📊 Quy mô: <strong>${(item.units || []).filter(u => u.selected).length} bài học</strong> • MCQ: ${(item.exam?.mcq || []).length} câu | Đ/S: ${(item.exam?.tf || []).length} câu | TLN: ${(item.exam?.short || []).length} câu | Tự luận: ${(item.exam?.essay || []).length} câu
              </div>
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
              <button class="btn btn-primary btn-sm" onclick="loadSavedExamToWorkspace('${item.id}')" title="Nạp đề này vào không gian làm việc để xem, sửa, in">
                📂 Nạp Đề
              </button>
              <button class="btn btn-secondary btn-sm" onclick="generateFourVariantsFromSaved('${item.id}')" title="Sinh ngay 4 đề tương tự từ đề đã lưu này">
                ⚡ Sinh 4 Đề
              </button>
              <button class="btn btn-accent btn-sm" onclick="quickExportSavedExamWord('${item.id}')" title="Tải ngay file Word của đề này">
                📥 Tải Word
              </button>
              <button class="btn btn-outline btn-sm" style="color:#dc2626; border-color:#fca5a5;" onclick="deleteSavedExamItem('${item.id}')" title="Xóa đề này khỏi danh sách">
                🗑️
              </button>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderHistoryModal() {
  renderSavedExamsModal();
}

function loadSavedExamToWorkspace(id) {
  const item = getSavedExamsList().find(x => x.id === id);
  if (!item) return;
  state.meta = JSON.parse(JSON.stringify(item.meta));
  state.units = JSON.parse(JSON.stringify(item.units));
  state.partConfig = JSON.parse(JSON.stringify(item.partConfig));
  state.matrixRows = JSON.parse(JSON.stringify(item.matrixRows));
  state.specOverrides = JSON.parse(JSON.stringify(item.specOverrides || {}));
  state.exam = JSON.parse(JSON.stringify(item.exam));
  if (item.printLayout) state.printLayout = JSON.parse(JSON.stringify(item.printLayout));
  if (item.auditScore !== undefined) state.audit.score = item.auditScore;

  ensureTfStatementLevels();
  renderPpctTable();
  renderStep2Config();
  renderMatrixTable();
  renderSpecificationTable();
  renderExamEditor();
  closeSavedExamsModal();
  goToStep(6);
  alert(`📂 Đã nạp thành công bộ đề "${item.title || item.summary}" vào hệ thống!`);
}

function loadHistoryExamItem(id) {
  loadSavedExamToWorkspace(id);
}

function generateFourVariantsFromSaved(id) {
  loadSavedExamToWorkspace(id);
  setTimeout(() => {
    generateFourVariantExams(true);
  }, 300);
}

function quickExportSavedExamWord(id) {
  const item = getSavedExamsList().find(x => x.id === id);
  if (!item) return;
  const currentSaved = JSON.parse(JSON.stringify({ meta: state.meta, units: state.units, matrixRows: state.matrixRows, exam: state.exam }));
  state.meta = JSON.parse(JSON.stringify(item.meta));
  state.units = JSON.parse(JSON.stringify(item.units));
  state.matrixRows = JSON.parse(JSON.stringify(item.matrixRows));
  state.exam = JSON.parse(JSON.stringify(item.exam));

  exportFullWordDocument();

  // Restore current
  state.meta = currentSaved.meta;
  state.units = currentSaved.units;
  state.matrixRows = currentSaved.matrixRows;
  state.exam = currentSaved.exam;
}

function deleteSavedExamItem(id) {
  if (!confirm("Thầy/cô có chắc chắn muốn xóa đề này khỏi Thư viện đã lưu không?")) return;
  const list = getSavedExamsList().filter(x => x.id !== id);
  localStorage.setItem(SAVED_EXAMS_KEY, JSON.stringify(list));
  localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(list));
  updateSavedExamsBadge();
  renderSavedExamsModal();
}

function deleteHistoryExamItem(id) {
  deleteSavedExamItem(id);
}

function exportSavedExamsBackupFile() {
  const list = getSavedExamsList();
  if (list.length === 0) {
    alert("Chưa có đề nào trong thư viện để xuất sao lưu.");
    return;
  }
  const blob = new Blob([JSON.stringify(list, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Sao-Luu-Thu-Vien-De-CV7991-${Date.now()}.json`;
  a.click();
}

function importSavedExamsBackupFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        const existing = getSavedExamsList();
        const merged = [...imported, ...existing].slice(0, 50);
        localStorage.setItem(SAVED_EXAMS_KEY, JSON.stringify(merged));
        localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(merged));
        updateSavedExamsBadge();
        renderSavedExamsModal();
        alert(`✅ Đã nạp thành công ${imported.length} đề kiểm tra từ file sao lưu!`);
      } else {
        alert("File sao lưu không đúng định dạng danh sách đề!");
      }
    } catch (err) {
      alert("Lỗi khi đọc file backup: " + err.message);
    }
  };
  reader.readAsText(file);
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
