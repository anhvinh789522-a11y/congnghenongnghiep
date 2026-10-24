// ============================================================================
// HỆ THỐNG PHÒNG THI TRỰC TUYẾN LỚP HỌC (CLASSROOM ONLINE EXAM ROOM)
// Cho phép Giáo viên Tạo phòng thi, Xem trước toàn bộ đề & Barem chấm
// Cả lớp làm chung một đề • Đồng bộ kết quả thời gian thực • Phân tích phổ điểm
// ============================================================================

(function(window) {
  "use strict";

  // Helper escapeHtml
  function esc(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Khởi tạo BroadcastChannel để đồng bộ đa tab/đa cửa sổ thời gian thực
  var syncChannel = null;
  try {
    if (typeof window.BroadcastChannel === "function") {
      syncChannel = new window.BroadcastChannel("cnn_classroom_sync");
    }
  } catch (e) {
    syncChannel = null;
  }

  // Trạng thái Phòng thi
  var CLASSROOM_STATE = {
    currentRole: "teacher", // 'teacher' | 'student'
    activeRoomId: null,
    // Dữ liệu học sinh làm bài
    studentInfo: {
      name: "",
      className: "",
      sbd: ""
    },
    studentAnswers: {
      mcq: {}, // { qIdx: optionIdx }
      tfChoice: {}, // { qIdx: { a: bool, b: bool, c: bool, d: bool } }
      tfExplain: {}, // { qIdx: { a: str, ... } }
      essayText: {} // { essayIdx: str }
    },
    studentTimerSeconds: 0,
    studentTimerRunning: false,
    studentTimerInterval: null,
    studentSubmitted: false,
    studentResult: null,

    // Chế độ Xem trước của Giáo viên
    previewModalOpen: false,
    previewExamSnapshot: null,
    previewActiveTab: "all", // 'all' | 'part1' | 'part2' | 'part3' | 'rubric'

    // Modal xem bài làm chi tiết của 1 học sinh
    detailStudentModal: null, // student object

    // Bộ lọc danh sách phòng
    roomListFilter: "all"
  };

  // --------------------------------------------------------------------------
  // 1. QUẢN LÝ DỮ LIỆU LƯU TRỮ (LOCALSTORAGE)
  // --------------------------------------------------------------------------
  var STORAGE_KEY_ROOMS = "CNN_CLASSROOM_ROOMS";
  var STORAGE_KEY_ACTIVE_ROOM = "CNN_ACTIVE_ROOM_ID";

  function getStoredRooms() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY_ROOMS);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (e) {
      console.warn("Lỗi đọc phòng thi từ localStorage:", e);
      return {};
    }
  }

  function saveStoredRooms(rooms) {
    try {
      localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
      // Phát tín hiệu broadcast
      if (syncChannel) {
        syncChannel.postMessage({ type: "ROOMS_UPDATED", timestamp: Date.now() });
      }
    } catch (e) {
      console.error("Lỗi lưu phòng thi vào localStorage:", e);
    }
  }

  function getRoomById(roomId) {
    if (!roomId) return null;
    var rooms = getStoredRooms();
    return rooms[roomId] || null;
  }

  function saveRoom(room) {
    if (!room || !room.id) return;
    var rooms = getStoredRooms();
    rooms[room.id] = room;
    saveStoredRooms(rooms);
  }

  function deleteRoom(roomId) {
    if (!confirm("Thầy/Cô có chắc chắn muốn xóa phòng thi này không? Tất cả bài làm của học sinh trong phòng sẽ bị xóa hoàn toàn.")) return;
    var rooms = getStoredRooms();
    delete rooms[roomId];
    saveStoredRooms(rooms);
    if (CLASSROOM_STATE.activeRoomId === roomId) {
      CLASSROOM_STATE.activeRoomId = null;
    }
    renderClassroomHub();
  }

  // Tạo mã PIN phòng thi ngẫu nhiên (dễ đọc, dễ nhập trên điện thoại)
  function generateRoomPin() {
    var prefix = "CNN";
    var num = Math.floor(1000 + Math.random() * 9000);
    return prefix + "-" + num;
  }

  // --------------------------------------------------------------------------
  // 2. PHÂN GIẢI VÀ TẠO BẢN SAO ĐỀ THI (EXAM RESOLVER)
  // --------------------------------------------------------------------------
  function resolveExamById(examId) {
    // 1. Kiểm tra trong HSG_PROVINCIAL_EXAMS
    if (typeof HSG_PROVINCIAL_EXAMS !== "undefined" && HSG_PROVINCIAL_EXAMS[examId]) {
      var src = HSG_PROVINCIAL_EXAMS[examId];
      return JSON.parse(JSON.stringify(src));
    }

    // 2. Kiểm tra nếu là đề tự sinh HSG
    if (examId === "dn_auto" && typeof generateAutoProvincialExam === "function") {
      var autoExam = generateAutoProvincialExam("all");
      return JSON.parse(JSON.stringify(autoExam));
    }

    // 3. Kiểm tra đề Tốt nghiệp Bộ GD&ĐT từ QUESTION_BANK
    if (typeof QUESTION_BANK !== "undefined") {
      var cn12Mcqs = (QUESTION_BANK.mcq || []).filter(function(q) {
        return q.grade === "cn12" || (q.unitId && q.unitId.indexOf("cn12") === 0);
      });
      var cn12Tfs = (QUESTION_BANK.tf || []).filter(function(q) {
        return q.grade === "cn12" || (q.unitId && q.unitId.indexOf("cn12") === 0);
      });
      if (cn12Mcqs.length < 24) cn12Mcqs = QUESTION_BANK.mcq || [];
      if (cn12Tfs.length < 4) cn12Tfs = QUESTION_BANK.tf || [];

      var title = "Đề Thi Khảo Sát Tốt Nghiệp THPT — Bộ GD&ĐT";
      var sub = "Chuẩn Cấu Trúc Bộ GD&ĐT • 24 Câu MCQ (6,0đ) + 4 Câu Đúng/Sai (4,0đ)";
      var selMcqs = [];
      var selTfs = [];

      if (examId === "bo_2025_sample") {
        title = "Đề Tham Khảo Tốt Nghiệp THPT 2025 — Bộ GD&ĐT (Mẫu chuẩn công bố)";
        selMcqs = cn12Mcqs.slice(0, 24);
        selTfs = cn12Tfs.slice(0, 4);
      } else if (examId === "bo_2026_0701") {
        title = "Đề Thi Chính Thức Bộ GD&ĐT 2026 — Mã Đề 0701";
        selMcqs = cn12Mcqs.slice(24, 48);
        selTfs = cn12Tfs.slice(4, 8);
      } else if (examId === "bo_2026_0702") {
        title = "Đề Thi Chính Thức Bộ GD&ĐT 2026 — Mã Đề 0702";
        selMcqs = cn12Mcqs.slice(48, 72);
        selTfs = cn12Tfs.slice(8, 12);
      } else {
        title = "Đề Luyện Thi Mô Phỏng Chuẩn Ma Trận Bộ GD&ĐT";
        selMcqs = cn12Mcqs.slice(0, 24);
        selTfs = cn12Tfs.slice(0, 4);
      }

      return {
        id: examId,
        code: "BỘ GD&ĐT",
        title: title,
        subTitle: sub,
        levelBadge: "🏛️ ĐỀ THI TỐT NGHIỆP THPT",
        durationMinutes: 50,
        maxScore: 10.0,
        source: "Bộ Giáo Dục & Đào Tạo",
        mcqs: JSON.parse(JSON.stringify(selMcqs)),
        tfs: JSON.parse(JSON.stringify(selTfs)),
        essays: [] // Tốt nghiệp không có tự luận
      };
    }

    return null;
  }

  // Danh mục tất cả các đề có sẵn để giáo viên chọn tạo phòng
  function getAvailableExamList() {
    var list = [];

    // Nhóm 1: HSG Cấp độ 1
    list.push({ id: "dn_easy_01", group: "🟢 HSG Cấp độ 1: Dễ / Khởi động", name: "ĐỒNG NAI — CẤP ĐỘ 1 (ĐỀ 01 - KHỞI ĐỘNG)", dur: 180, score: 20 });
    list.push({ id: "dn_easy_02", group: "🟢 HSG Cấp độ 1: Dễ / Khởi động", name: "ĐỒNG NAI — CẤP ĐỘ 1 (ĐỀ 02 - NỀN TẢNG SGK)", dur: 180, score: 20 });

    // Nhóm 2: HSG Cấp độ 2
    list.push({ id: "dn_01", group: "🟡 HSG Cấp độ 2: Vừa / Tăng tốc", name: "ĐỒNG NAI — ĐỀ SỐ 01 (CHUẨN BẢNG B ĐỒNG NAI)", dur: 180, score: 20 });
    list.push({ id: "dn_03", group: "🟡 HSG Cấp độ 2: Vừa / Tăng tốc", name: "ĐỒNG NAI — ĐỀ SỐ 03 (BÀ RỊA VŨNG TÀU & BẮC GIANG)", dur: 180, score: 20 });

    // Nhóm 3: HSG Cấp độ 3
    list.push({ id: "dn_02", group: "🔴 HSG Cấp độ 3: Khó / Về đích", name: "ĐỒNG NAI — ĐỀ SỐ 02 (CHUYÊN SÂU HUẾ 7011 - BẢNG A)", dur: 180, score: 20 });
    list.push({ id: "dn_hard_02", group: "🔴 HSG Cấp độ 3: Khó / Về đích", name: "ĐỒNG NAI — CẤP ĐỘ 3 (ĐỀ 02 - ĐỈNH CAO VDC BẢNG A)", dur: 180, score: 20 });

    // Nhóm 4: HSG Tự sinh
    list.push({ id: "dn_auto", group: "🎲 HSG Đề Tự Sinh", name: "ĐỀ THI HSG TỰ SINH THEO MA TRẬN 14 TIÊU CHÍ", dur: 180, score: 20 });

    // Nhóm 5: Thi Tốt nghiệp THPT Bộ GD&ĐT
    list.push({ id: "bo_2025_sample", group: "🏛️ Thi Tốt NghiỆp THPT (Bộ GD&ĐT)", name: "ĐỀ THAM KHẢO TỐT NGHIỆP THPT 2025 — BỘ GD&ĐT", dur: 50, score: 10 });
    list.push({ id: "bo_2026_0701", group: "🏛️ Thi Tốt Nghiệp THPT (Bộ GD&ĐT)", name: "ĐỀ THI TỐT NGHIỆP CHÍNH THỨC 2026 — MÃ ĐỀ 0701", dur: 50, score: 10 });
    list.push({ id: "bo_2026_0702", group: "🏛️ Thi Tốt Nghiệp THPT (Bộ GD&ĐT)", name: "ĐỀ THI TỐT NGHIỆP CHÍNH THỨC 2026 — MÃ ĐỀ 0702", dur: 50, score: 10 });

    return list;
  }

  // --------------------------------------------------------------------------
  // 3. TÍNH NĂNG KIỂM DUYỆT & XEM TRƯỚC ĐỀ CỦA GIÁO VIÊN (TEACHER PREVIEW & APPROVAL MODAL)
  // --------------------------------------------------------------------------
  function openTeacherExamPreview(examId, customExamObj, roomId) {
    var exam = customExamObj || resolveExamById(examId);
    if (!exam) {
      alert("Không tìm thấy dữ liệu đề thi để xem trước!");
      return;
    }
    CLASSROOM_STATE.previewExamSnapshot = exam;
    CLASSROOM_STATE.previewRoomId = roomId || null;
    CLASSROOM_STATE.previewModalOpen = true;
    CLASSROOM_STATE.previewActiveTab = "all";
    CLASSROOM_STATE.previewViewMode = "teacher"; // 'teacher' | 'student'
    CLASSROOM_STATE.previewAuditReport = null;
    renderTeacherPreviewModal();
  }

  function closeTeacherExamPreview() {
    CLASSROOM_STATE.previewModalOpen = false;
    CLASSROOM_STATE.previewExamSnapshot = null;
    CLASSROOM_STATE.previewRoomId = null;
    CLASSROOM_STATE.previewAuditReport = null;
    var modal = document.getElementById("classroomTeacherPreviewModal");
    if (modal) modal.remove();
  }

  function auditPreviewExam() {
    var exam = CLASSROOM_STATE.previewExamSnapshot;
    if (!exam) return;
    var mcqs = exam.mcqs || [];
    var tfs = exam.tfs || [];
    var essays = exam.essays || [];

    // Kiểm tra câu trùng hoặc thiếu
    var mcqStems = {};
    var duplicates = 0;
    var missingFields = 0;

    mcqs.forEach(function(q, i) {
      if (!q.stem || !q.options || q.options.length < 4 || typeof q.answer === "undefined") {
        missingFields++;
      }
      var cleanStem = (q.stem || "").trim().toLowerCase();
      if (cleanStem) {
        if (mcqStems[cleanStem]) duplicates++;
        else mcqStems[cleanStem] = true;
      }
    });

    tfs.forEach(function(q, i) {
      if (!q.stem && !q.context) missingFields++;
    });

    var mcqPts = (mcqs.length * 0.25).toFixed(2);
    var tfPts = tfs.length > 0 ? (exam.maxScore > 10 ? (tfs.length * 1.5).toFixed(2) : "4.00") : "0.00";
    var essayPts = essays.reduce(function(acc, e) { return acc + (Number(e.points) || 3.5); }, 0).toFixed(2);
    var calcTotal = (parseFloat(mcqPts) + parseFloat(tfPts) + parseFloat(essayPts)).toFixed(1);

    CLASSROOM_STATE.previewAuditReport = {
      mcqCount: mcqs.length,
      mcqPts: mcqPts,
      tfCount: tfs.length,
      tfStatementsCount: tfs.length * 4,
      tfPts: tfPts,
      essayCount: essays.length,
      essayPts: essayPts,
      totalScore: calcTotal,
      duplicates: duplicates,
      missingFields: missingFields,
      isValid: duplicates === 0 && missingFields === 0
    };

    renderTeacherPreviewModal();
  }

  function replaceExamQuestion(idx, type) {
    var exam = CLASSROOM_STATE.previewExamSnapshot;
    if (!exam || typeof QUESTION_BANK === "undefined") return;

    if (type === "mcq") {
      var pool = (QUESTION_BANK.mcq || []).filter(function(q) {
        return !exam.mcqs.some(function(existing) { return existing.stem === q.stem; });
      });
      if (pool.length === 0) {
        alert("Ngân hàng câu hỏi không còn câu MCQ mới để thay thế!");
        return;
      }
      var rand = pool[Math.floor(Math.random() * pool.length)];
      exam.mcqs[idx] = JSON.parse(JSON.stringify(rand));
      if (CLASSROOM_STATE.previewAuditReport) auditPreviewExam();
      else renderTeacherPreviewModal();
      alert("🔄 Đã thay đổi Câu " + (idx + 1) + " thành công từ Ngân hàng chuẩn!");
    } else if (type === "tf") {
      var tfPool = (QUESTION_BANK.tf || []).filter(function(q) {
        return !exam.tfs.some(function(existing) { return existing.stem === q.stem; });
      });
      if (tfPool.length === 0) {
        alert("Ngân hàng câu hỏi không còn câu Đúng/Sai mới để thay thế!");
        return;
      }
      var randTf = tfPool[Math.floor(Math.random() * tfPool.length)];
      exam.tfs[idx] = JSON.parse(JSON.stringify(randTf));
      if (CLASSROOM_STATE.previewAuditReport) auditPreviewExam();
      else renderTeacherPreviewModal();
      alert("🔄 Đã thay đổi Câu Đúng/Sai " + (idx + 1) + " thành công!");
    }
  }

  function regeneratePreviewExam() {
    var exam = CLASSROOM_STATE.previewExamSnapshot;
    if (!exam) return;
    if (!confirm("Thầy/Cô có chắc chắn muốn bốc ngẫu nhiên lại toàn bộ đề thi mới?")) return;
    var newSnapshot = resolveExamById(exam.id) || (typeof generateAutoProvincialExam === "function" ? generateAutoProvincialExam("all") : null);
    if (newSnapshot) {
      CLASSROOM_STATE.previewExamSnapshot = newSnapshot;
      if (CLASSROOM_STATE.previewRoomId) {
        var r = getRoomById(CLASSROOM_STATE.previewRoomId);
        if (r) {
          r.examSnapshot = newSnapshot;
          r.status = "draft"; // Làm mất hiệu lực duyệt cũ nếu vừa tạo lại đề
          r.approvedAt = null;
          r.approvedBy = null;
          saveRoom(r);
          renderClassroomHub();
        }
      }
      if (CLASSROOM_STATE.previewAuditReport) auditPreviewExam();
      else renderTeacherPreviewModal();
      alert("🎲 Đã sinh ngẫu nhiên toàn bộ đề thi mới chuẩn cấu trúc!");
    }
  }

  function renderTeacherPreviewModal() {
    var old = document.getElementById("classroomTeacherPreviewModal");
    if (old) old.remove();

    var exam = CLASSROOM_STATE.previewExamSnapshot;
    if (!exam) return;
    var isStudentMode = CLASSROOM_STATE.previewViewMode === "student";
    var audit = CLASSROOM_STATE.previewAuditReport;

    var modalHtml = `
      <div id="classroomTeacherPreviewModal" class="modal-backdrop" style="display:flex; z-index:99999; background:rgba(15,23,42,0.8); backdrop-filter:blur(4px); position:fixed; inset:0; align-items:center; justify-content:center; padding:16px;">
        <div class="modal-box" style="max-width:1160px; width:100%; max-height:94vh; display:flex; flex-direction:column; background:#fff; border-radius:14px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.3); overflow:hidden; border:2px solid ${isStudentMode ? '#22c55e' : '#3b82f6'};">
          
          <!-- Header Xem trước & Kiểm duyệt -->
          <div style="background:${isStudentMode ? 'linear-gradient(135deg, #15803d 0%, #166534 100%)' : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'}; color:#fff; padding:16px 20px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
                <span style="background:${isStudentMode ? '#dcfce7' : '#fbbf24'}; color:${isStudentMode ? '#166534' : '#0f172a'}; font-weight:800; font-size:11px; padding:3px 8px; border-radius:4px; text-transform:uppercase;">
                  ${isStudentMode ? '👨‍🎓 ĐANG XEM NHƯ HỌC SINH (KHÔNG HIỆN ĐÁP ÁN)' : '⚖️ ĐANG XEM BAREM ĐÁP ÁN & HƯỚNG DẪN CHẤM (GV)'}
                </span>
                <span style="background:rgba(255,255,255,0.2); font-size:12px; padding:2px 8px; border-radius:4px;">
                  ⏱️ ${exam.durationMinutes || 180} Phút • 🎯 Thang ${exam.maxScore || 20.0} điểm
                </span>
                ${CLASSROOM_STATE.previewRoomId ? `
                  <span style="background:#fef08a; color:#854d0e; font-size:11.5px; padding:2px 8px; border-radius:4px; font-weight:700;">
                    🏫 Phòng: ${CLASSROOM_STATE.previewRoomId}
                  </span>
                ` : ''}
              </div>
              <h3 style="margin:0; font-size:18px; color:#fff;">${esc(exam.title)}</h3>
              <p style="margin:2px 0 0; font-size:12.5px; color:#cbd5e1;">${esc(exam.subTitle || "")}</p>
            </div>
            <button class="btn btn-sm btn-outline" onclick="window.closeTeacherExamPreview()" style="color:#fff; border-color:rgba(255,255,255,0.4); font-size:14px; padding:4px 10px;">
              ✕ Đóng
            </button>
          </div>

          <!-- Thanh điều hướng Tab Xem trước & Công cụ Kiểm duyệt -->
          <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border-bottom:1px solid #e2e8f0; padding:10px 20px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button class="btn btn-sm ${CLASSROOM_STATE.previewActiveTab === 'all' ? 'btn-primary' : 'btn-outline'}" onclick="window.switchPreviewTab('all')">
                📑 Toàn Bộ Đề
              </button>
              <button class="btn btn-sm ${CLASSROOM_STATE.previewActiveTab === 'part1' ? 'btn-primary' : 'btn-outline'}" onclick="window.switchPreviewTab('part1')">
                1️⃣ Phần I: MCQ (${exam.mcqs ? exam.mcqs.length : 0})
              </button>
              <button class="btn btn-sm ${CLASSROOM_STATE.previewActiveTab === 'part2' ? 'btn-primary' : 'btn-outline'}" onclick="window.switchPreviewTab('part2')">
                2️⃣ Phần II: Đúng/Sai (${exam.tfs ? exam.tfs.length : 0} câu)
              </button>
              ${exam.essays && exam.essays.length > 0 ? `
                <button class="btn btn-sm ${CLASSROOM_STATE.previewActiveTab === 'part3' ? 'btn-primary' : 'btn-outline'}" onclick="window.switchPreviewTab('part3')">
                  3️⃣ Phần III: Tự Luận (${exam.essays.length} câu)
                </button>
              ` : ''}
            </div>

            <!-- Công cụ Kiểm định & Đổi chế độ Xem -->
            <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
              <div class="btn-group" style="display:inline-flex; border:1px solid #cbd5e1; border-radius:6px; overflow:hidden;">
                <button type="button" class="btn btn-xs ${isStudentMode ? 'btn-primary' : 'btn-outline'}" onclick="window.setTeacherPreviewViewMode('student')" style="border:none; padding:5px 9px;">
                  👨‍🎓 Học sinh
                </button>
                <button type="button" class="btn btn-xs ${!isStudentMode ? 'btn-primary' : 'btn-outline'}" onclick="window.setTeacherPreviewViewMode('teacher')" style="border:none; padding:5px 9px;">
                  ⚖️ Giáo viên
                </button>
              </div>

              <button class="btn btn-sm btn-outline" onclick="window.auditPreviewExam()" style="color:#0f766e; border-color:#0f766e; font-weight:700;">
                🔍 Kiểm tra đề
              </button>
              <button class="btn btn-sm btn-outline" onclick="window.regeneratePreviewExam()" style="color:#7c3aed; border-color:#7c3aed; font-weight:700;">
                🎲 Sinh đề mới
              </button>
              <button class="btn btn-sm btn-primary" onclick="window.confirmAndApplyPreviewedExam()" style="background:#16a34a; border-color:#16a34a; font-weight:700;">
                ✅ Duyệt Đề &amp; Mở Phòng
              </button>
            </div>
          </div>

          <!-- Báo cáo Kiểm tra đề nếu vừa bấm Kiểm tra -->
          ${audit ? `
            <div style="background:${audit.isValid ? '#f0fdf4' : '#fff1f2'}; border-bottom:1.5px solid ${audit.isValid ? '#86efac' : '#fecdd3'}; padding:12px 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div>
                <strong style="color:${audit.isValid ? '#166534' : '#991b1b'}; font-size:13.5px;">
                  ${audit.isValid ? '✅ KẾT QUẢ KIỂM ĐỊNH: ĐỀ THI ĐẠT CHUẨN 100%' : '⚠️ PHÁT HIỆN LỖI CẤU TRÚC ĐỀ THI'}
                </strong>
                <div style="font-size:12.5px; color:#475569; margin-top:3px;">
                  • <strong>Phần I (MCQ):</strong> ${audit.mcqCount} câu (${audit.mcqPts}đ) &nbsp;|&nbsp;
                  • <strong>Phần II (Đúng/Sai):</strong> ${audit.tfCount} câu / ${audit.tfStatementsCount} lệnh (${audit.tfPts}đ) &nbsp;|&nbsp;
                  • <strong>Phần III (Tự luận):</strong> ${audit.essayCount} câu (${audit.essayPts}đ) &nbsp;|&nbsp;
                  • <strong>Tổng điểm:</strong> <strong>${audit.totalScore} / ${exam.maxScore || 20.0} điểm</strong>
                </div>
              </div>
              <span class="badge ${audit.isValid ? 'badge-ok' : 'badge-vandung'}" style="font-size:12px; padding:5px 10px;">
                ${audit.isValid ? '✓ Không có câu trùng, đủ 100% đáp án' : 'Cần sửa đổi'}
              </span>
            </div>
          ` : ''}

          <!-- Nội dung chi tiết xem trước cuộn được -->
          <div style="flex:1; overflow-y:auto; padding:20px; background:#f1f5f9;">
            ${renderPreviewContent(exam, CLASSROOM_STATE.previewActiveTab, isStudentMode)}
          </div>

          <!-- Footer xem trước -->
          <div style="background:#fff; border-top:1px solid #e2e8f0; padding:12px 20px; display:flex; justify-content:space-between; align-items:center; font-size:13px; color:#64748b; flex-wrap:wrap; gap:8px;">
            <span>💡 <em>${isStudentMode ? 'Giao diện hiển thị đúng chuẩn câu hỏi và các lựa chọn mà học sinh sẽ nhìn thấy khi làm bài thi.' : 'Chế độ giáo viên: Bấm nút "🔄 Đổi câu này" bên cạnh mỗi câu để bốc câu khác từ Ngân hàng.'}</em></span>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-outline btn-sm" onclick="window.closeTeacherExamPreview()">
                Đóng
              </button>
              <button class="btn btn-primary btn-sm" onclick="window.confirmAndApplyPreviewedExam()" style="background:#16a34a; border-color:#16a34a; font-weight:700;">
                ✅ Duyệt đề &amp; Mở phòng thi
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }

  function renderPreviewContent(exam, tab, isStudentMode) {
    var html = "";

    // 1. PHẦN I: MCQ
    if (tab === "all" || tab === "part1") {
      html += `
        <div style="background:#fff; border-radius:10px; padding:16px 20px; margin-bottom:18px; border:1px solid #cbd5e1; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #e2e8f0; padding-bottom:8px; margin-bottom:14px;">
            <h4 style="color:#1e3a8a; margin:0; font-size:16px;">
              PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (${(exam.mcqs || []).length} CÂU • ${((exam.mcqs || []).length * 0.25).toFixed(1)} ĐIỂM)
            </h4>
            <span class="badge badge-ok">Mỗi câu đúng 0,25 điểm</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:16px;">
            ${(exam.mcqs || []).map(function(q, idx) {
              var correctIdx = Number(q.answer);
              return `
                <div style="padding:12px; background:#f8fafc; border-radius:8px; border-left:4px solid #3b82f6;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:8px;">
                    <div style="font-weight:700; color:#1e293b; line-height:1.5; flex:1;">
                      <span style="color:#2563eb;">Câu ${idx + 1}:</span> ${esc(q.stem)}
                    </div>
                    ${!isStudentMode ? `
                      <button type="button" class="btn btn-outline btn-xs" onclick="window.replaceExamQuestion(${idx}, 'mcq')" title="Bốc ngẫu nhiên câu khác từ Ngân hàng câu hỏi" style="font-size:11px; color:#0f766e; border-color:#99f6e4; background:#f0fdfa; white-space:nowrap;">
                        🔄 Đổi câu này
                      </button>
                    ` : ''}
                  </div>
                  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:6px; margin-bottom:8px;">
                    ${(q.options || []).map(function(opt, optIdx) {
                      var isCorrect = optIdx === correctIdx;
                      if (isStudentMode) {
                        return `
                          <div style="padding:8px 12px; border-radius:6px; font-size:13px; border:1px solid #cbd5e1; background:#fff; color:#334155; display:flex; align-items:center; gap:8px;">
                            <span style="display:inline-block; width:18px; height:18px; border-radius:50%; border:1.5px solid #94a3b8; text-align:center; line-height:16px; font-size:10px; font-weight:bold;">${String.fromCharCode(65 + optIdx)}</span>
                            <span style="flex:1;">${esc(opt)}</span>
                          </div>
                        `;
                      } else {
                        return `
                          <div style="padding:6px 10px; border-radius:6px; font-size:13px; border:1px solid ${isCorrect ? '#86efac' : '#e2e8f0'}; background:${isCorrect ? '#f0fdf4' : '#fff'}; color:${isCorrect ? '#166534' : '#334155'}; font-weight:${isCorrect ? '700' : 'normal'}; display:flex; align-items:center; gap:6px;">
                            <span>${String.fromCharCode(65 + optIdx)}.</span>
                            <span style="flex:1;">${esc(opt)}</span>
                            ${isCorrect ? `<span style="color:#16a34a; font-weight:800;">✓ (ĐÁP ÁN)</span>` : ''}
                          </div>
                        `;
                      }
                    }).join("")}
                  </div>
                  ${!isStudentMode && q.explanation ? `
                    <div style="background:#ecfdf5; border:1px dashed #86efac; border-radius:6px; padding:6px 10px; font-size:12.5px; color:#166534; margin-top:6px;">
                      <strong>💡 Giải thích khoa học:</strong> ${esc(q.explanation)}
                    </div>
                  ` : ''}
                  ${!isStudentMode && q.recallHint ? `
                    <div style="background:#eff6ff; border:1px dashed #93c5fd; border-radius:6px; padding:6px 10px; font-size:12px; color:#1e40af; margin-top:4px;">
                      <strong>📖 Điểm tựa ghi nhớ SGK:</strong> ${esc(q.recallHint)}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }

    // 2. PHẦN II: ĐÚNG / SAI
    if (tab === "all" || tab === "part2") {
      html += `
        <div style="background:#fff; border-radius:10px; padding:16px 20px; margin-bottom:18px; border:1px solid #cbd5e1; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #e2e8f0; padding-bottom:8px; margin-bottom:14px;">
            <h4 style="color:#1e3a8a; margin:0; font-size:16px;">
              PHẦN II. CÂU HỎI ĐÚNG / SAI ${(exam.tfs || []).length} CÂU (${(exam.tfs || []).length * 4} Ý)
            </h4>
            <span class="badge badge-vandung">Bảng B: 0,25đ Đúng + 0,125đ GT • Chuẩn Bộ: 0.1 - 0.25 - 0.5 - 1.0đ</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:16px;">
            ${(exam.tfs || []).map(function(q, qIdx) {
              return `
                <div style="padding:14px; background:#f8fafc; border-radius:8px; border-left:4px solid #f59e0b;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:6px;">
                    <div style="font-weight:700; color:#1e293b; font-size:14.5px; flex:1;">
                      <span style="color:#d97706;">Câu ${qIdx + 1}:</span> ${esc(q.title || ("Chủ đề: " + (q.topic || "")))}
                    </div>
                    ${!isStudentMode ? `
                      <button type="button" class="btn btn-outline btn-xs" onclick="window.replaceExamQuestion(${qIdx}, 'tf')" title="Bốc ngẫu nhiên câu Đúng/Sai khác" style="font-size:11px; color:#b45309; border-color:#fde68a; background:#fffbeb; white-space:nowrap;">
                        🔄 Đổi câu này
                      </button>
                    ` : ''}
                  </div>
                  <div style="font-size:13.5px; color:#475569; margin-bottom:12px; line-height:1.5;">
                    ${esc(q.stem || q.context || "")}
                  </div>
                  <div style="display:flex; flex-direction:column; gap:8px;">
                    ${['a', 'b', 'c', 'd'].map(function(sub) {
                      var stmt = q.statements ? q.statements[sub] : "";
                      var ans = q.answers ? q.answers[sub] : null;
                      var isTrue = ans === true || ans === "Đ" || ans === "Đúng";
                      var exp = q.explanations ? q.explanations[sub] : "";

                      if (isStudentMode) {
                        return `
                          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:6px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; gap:10px;">
                            <div style="font-size:13px; color:#1e293b; line-height:1.5; flex:1;">
                              <strong>${sub})</strong> ${esc(stmt)}
                            </div>
                            <div style="display:flex; gap:10px; font-size:12.5px; color:#475569;">
                              <label style="display:flex; align-items:center; gap:4px; cursor:pointer;"><input type="radio" name="preview_tf_${qIdx}_${sub}" disabled /> Đúng</label>
                              <label style="display:flex; align-items:center; gap:4px; cursor:pointer;"><input type="radio" name="preview_tf_${qIdx}_${sub}" disabled /> Sai</label>
                            </div>
                          </div>
                        `;
                      } else {
                        return `
                          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:6px; padding:10px 12px;">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                              <div style="font-size:13px; color:#1e293b; line-height:1.5;">
                                <strong>${sub})</strong> ${esc(stmt)}
                              </div>
                              <span style="padding:2px 8px; border-radius:4px; font-size:12px; font-weight:800; color:#fff; background:${isTrue ? '#16a34a' : '#dc2626'}; white-space:nowrap;">
                                ${isTrue ? '✓ ĐÚNG' : '✗ SAI'}
                              </span>
                            </div>
                            ${exp ? `
                              <div style="background:#f0fdf4; border:1px dashed #86efac; border-radius:4px; padding:6px 10px; font-size:12px; color:#166534; margin-top:6px;">
                                <strong>⚖️ Cơ sở khoa học / Lời giải thích chuẩn:</strong> ${esc(exp)}
                              </div>
                            ` : ''}
                          </div>
                        `;
                      }
                    }).join("")}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }

    // 3. PHẦN III: TỰ LUẬN
    if ((tab === "all" || tab === "part3") && exam.essays && exam.essays.length > 0) {
      html += `
        <div style="background:#fff; border-radius:10px; padding:16px 20px; margin-bottom:18px; border:1px solid #cbd5e1; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #e2e8f0; padding-bottom:8px; margin-bottom:14px;">
            <h4 style="color:#1e3a8a; margin:0; font-size:16px;">
              PHẦN III. TỰ LUẬN KỸ THUẬT &amp; NÔNG NGHIỆP THỰC TIỄN (${exam.essays.length} CÂU • 8,0 ĐIỂM)
            </h4>
            <span class="badge badge-nl">Lâm nghiệp 3,5đ • Thủy sản 3,5đ • VDC 1,0đ</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:16px;">
            ${(exam.essays || []).map(function(essay, eIdx) {
              return `
                <div style="padding:14px; background:#f8fafc; border-radius:8px; border-left:4px solid #7c3aed;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <h5 style="color:#6d28d9; margin:0; font-size:15px;">
                      ${esc(essay.title || ("Câu Tự Luận " + (eIdx + 1)))}
                    </h5>
                    <span class="badge" style="background:#ede9fe; color:#6d28d9; font-weight:800;">
                      ${essay.points || 3.5} Điểm
                    </span>
                  </div>
                  <div style="font-size:13.5px; color:#1e293b; line-height:1.6; white-space:pre-line; margin-bottom:12px; background:#fff; padding:12px; border-radius:6px; border:1px solid #e2e8f0;">
                    ${esc(essay.problem)}
                  </div>
                  ${isStudentMode ? `
                    <div style="border:1.5px dashed #cbd5e1; background:#f8fafc; border-radius:6px; padding:16px; font-size:13px; color:#94a3b8; font-style:italic;">
                      📝 Khu vực học sinh viết bài luận và phương án kỹ thuật nông nghiệp...
                    </div>
                  ` : `
                    <div style="background:#faf5ff; border:1.5px solid #d8b4fe; border-radius:6px; padding:12px;">
                      <div style="font-size:13px; font-weight:700; color:#6d28d9; margin-bottom:6px;">
                        ⚖️ BAREM ĐÁP ÁN &amp; HƯỚNG DẪN CHẤM CHI TIẾT (RUBRIC):
                      </div>
                      ${(essay.rubric || []).map(function(step, sIdx) {
                        return `
                          <div style="font-size:12.5px; color:#4c1d95; line-height:1.5; margin-bottom:4px; padding-left:10px; border-left:2px solid #a855f7;">
                            • ${esc(step)}
                          </div>
                        `;
                      }).join("")}
                    </div>
                  `}
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }

    return html;
  }

  // --------------------------------------------------------------------------
  // 4. QUẢN LÝ TẠO PHÒNG & THIẾT LẬP PHÒNG
  // --------------------------------------------------------------------------
  function createNewClassroomRoom(formData) {
    var examId = formData.examId || "dn_easy_01";
    var examSnapshot = resolveExamById(examId);
    if (!examSnapshot) {
      alert("Không thể phân giải đề thi được chọn!");
      return null;
    }

    var roomId = generateRoomPin();
    var newRoom = {
      id: roomId,
      title: formData.title || ("Phòng thi môn Công nghệ Nông nghiệp - Lớp " + (formData.className || "12A1")),
      teacherName: formData.teacherName || "Thầy Trương Khắc Nam",
      className: formData.className || "12A1",
      createdAt: Date.now(),
      status: "active", // 'active' | 'paused' | 'closed'
      examId: examId,
      examSnapshot: examSnapshot,
      config: {
        durationMinutes: Number(formData.durationMinutes) || examSnapshot.durationMinutes || 180,
        tableMode: formData.tableMode || "A", // 'A' | 'B'
        allowRecallHints: formData.allowRecallHints !== false,
        showScoreOnSubmit: formData.showScoreOnSubmit !== false,
        shuffleQuestions: formData.shuffleQuestions === true,
        previewApproved: true
      },
      students: []
    };

    saveRoom(newRoom);
    CLASSROOM_STATE.activeRoomId = roomId;
    CLASSROOM_STATE.currentRole = "teacher";
    renderClassroomHub();

    alert("🎉 Đã tạo thành công Phòng thi: " + roomId + "\n\nThầy/Cô hãy gửi Mã phòng " + roomId + " hoặc Link tham gia cho học sinh cả lớp!");
    return newRoom;
  }

  // Chuyển trạng thái phòng: 'active' | 'paused' | 'closed'
  function setRoomStatus(roomId, newStatus) {
    var room = getRoomById(roomId);
    if (!room) return;
    room.status = newStatus;
    saveRoom(room);
    renderClassroomHub();
  }

  // --------------------------------------------------------------------------
  // 5. GIAO DIỆN HỌC SINH THAM GIA & LÀM BÀI CHUNG ĐỀ
  // --------------------------------------------------------------------------
  function studentJoinRoom(roomId, studentName, studentClass, studentSbd) {
    var room = getRoomById(roomId);
    if (!room) {
      alert("Mã phòng thi '" + roomId + "' không tồn tại hoặc đã bị xóa!");
      return false;
    }
    if (room.status === "closed") {
      alert("Phòng thi này đã đóng! Giáo viên đã kết thúc buổi thi.");
      return false;
    }
    if (room.status === "draft") {
      alert("⚠️ Phòng thi đang ở chế độ xem trước/biên soạn. Giáo viên chưa phê duyệt mở phòng thi cho học sinh!");
      return false;
    }

    // Kiểm tra xem học sinh đã có trong danh sách chưa
    var existingStudent = null;
    (room.students || []).forEach(function(s) {
      if (s.name.trim().toLowerCase() === studentName.trim().toLowerCase() && s.className.trim().toLowerCase() === studentClass.trim().toLowerCase()) {
        existingStudent = s;
      }
    });

    if (!existingStudent) {
      var studentId = "st_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
      existingStudent = {
        id: studentId,
        name: studentName.trim(),
        className: studentClass.trim(),
        sbd: (studentSbd || "").trim(),
        joinedAt: Date.now(),
        submittedAt: null,
        status: "in_progress",
        timeTakenSeconds: 0,
        mcqAnswers: {},
        tfChoices: {},
        tfExplains: {},
        essayAnswers: {},
        score: null
      };
      if (!room.students) room.students = [];
      room.students.push(existingStudent);
      saveRoom(room);
    }

    CLASSROOM_STATE.activeRoomId = roomId;
    CLASSROOM_STATE.currentRole = "student";
    CLASSROOM_STATE.studentInfo = {
      id: existingStudent.id,
      name: existingStudent.name,
      className: existingStudent.className,
      sbd: existingStudent.sbd
    };
    CLASSROOM_STATE.studentTimerSeconds = (room.config.durationMinutes || 180) * 60;
    CLASSROOM_STATE.studentSubmitted = existingStudent.status === "submitted";
    CLASSROOM_STATE.studentResult = existingStudent.score || null;

    renderClassroomHub();
    return true;
  }

  // Học sinh nộp bài
  function submitStudentExam() {
    var room = getRoomById(CLASSROOM_STATE.activeRoomId);
    if (!room) return;

    if (!confirm("Em có chắc chắn muốn nộp bài thi vào phòng của Thầy/Cô không? Sau khi nộp sẽ không thể sửa đổi câu trả lời.")) return;

    var exam = room.examSnapshot;
    var userMcq = CLASSROOM_STATE.studentAnswers.mcq || {};
    var userTf = CLASSROOM_STATE.studentAnswers.tfChoice || {};
    var userTfExp = CLASSROOM_STATE.studentAnswers.tfExplain || {};
    var userEssay = CLASSROOM_STATE.studentAnswers.essayText || {};

    // Chấm Phần I (MCQ)
    var mcqCorrectCount = 0;
    (exam.mcqs || []).forEach(function(q, idx) {
      if (userMcq[idx] === Number(q.answer)) {
        mcqCorrectCount++;
      }
    });
    var mcqScore = mcqCorrectCount * 0.25;

    // Chấm Phần II (Đúng/Sai)
    var isTableA = room.config.tableMode === "A";
    var correctPts = isTableA ? 0.125 : 0.25;
    var explainPts = isTableA ? 0.25 : 0.125;
    var tfScore = 0;
    var tfCorrectCount = 0;

    (exam.tfs || []).forEach(function(q, qIdx) {
      ['a', 'b', 'c', 'd'].forEach(function(sub) {
        var userChoice = userTf[qIdx] ? userTf[qIdx][sub] : undefined;
        var expText = userTfExp[qIdx] ? (userTfExp[qIdx][sub] || "").trim() : "";
        var officialAns = q.answers ? q.answers[sub] : null;
        var isAnsTrue = officialAns === true || officialAns === "Đ" || officialAns === "Đúng";

        if (userChoice !== undefined && userChoice === isAnsTrue) {
          tfScore += correctPts;
          tfCorrectCount++;
          if (expText.length >= 10) {
            tfScore += explainPts;
          }
        }
      });
    });

    // Chấm Phần III (Tự luận): Mặc định tạm chấm theo rubric
    var essayScore = 0;
    (exam.essays || []).forEach(function(es, eIdx) {
      var text = (userEssay[eIdx] || "").trim();
      if (text.length > 200) {
        essayScore += (es.points || 3.5) * 0.85; // học sinh làm bài đầy đủ
      } else if (text.length > 50) {
        essayScore += (es.points || 3.5) * 0.50;
      }
    });

    var totalScore = Math.min(exam.maxScore || 20.0, mcqScore + tfScore + essayScore);
    var grade = totalScore >= 16 ? "Giỏi" : totalScore >= 13 ? "Khá" : totalScore >= 10 ? "Trung bình" : "Yếu";

    var result = {
      mcqCorrectCount: mcqCorrectCount,
      mcqScore: Number(mcqScore.toFixed(2)),
      tfCorrectCount: tfCorrectCount,
      tfScore: Number(tfScore.toFixed(3)),
      essayScore: Number(essayScore.toFixed(2)),
      totalScore: Number(totalScore.toFixed(2)),
      maxScore: exam.maxScore || 20.0,
      grade: grade
    };

    // Cập nhật vào danh sách học sinh của phòng
    var studentFound = false;
    (room.students || []).forEach(function(s) {
      if (s.id === CLASSROOM_STATE.studentInfo.id || (s.name === CLASSROOM_STATE.studentInfo.name && s.className === CLASSROOM_STATE.studentInfo.className)) {
        s.submittedAt = Date.now();
        s.status = "submitted";
        s.mcqAnswers = JSON.parse(JSON.stringify(userMcq));
        s.tfChoices = JSON.parse(JSON.stringify(userTf));
        s.tfExplains = JSON.parse(JSON.stringify(userTfExp));
        s.essayAnswers = JSON.parse(JSON.stringify(userEssay));
        s.score = result;
        studentFound = true;
      }
    });

    saveRoom(room);

    CLASSROOM_STATE.studentSubmitted = true;
    CLASSROOM_STATE.studentResult = result;
    renderClassroomHub();

    alert("🎉 Nộp bài thành công!\n\nKết quả bài làm đã được lưu vào hệ thống phòng thi của Thầy/Cô.");
  }

  // --------------------------------------------------------------------------
  // 6. DỮ LIỆU MẪU MÔ PHỎNG (DEMO DATA SIMULATION)
  // --------------------------------------------------------------------------
  function addDemoStudentsToRoom(roomId) {
    var room = getRoomById(roomId);
    if (!room) return;

    var demoNames = [
      "Nguyễn Văn An", "Trần Thị Mai", "Lê Hoàng Long", "Phạm Quỳnh Anh",
      "Vũ Minh Đức", "Đặng Thùy Dương", "Bùi Quốc Bảo", "Đỗ Hải Yến"
    ];

    if (!room.students) room.students = [];

    demoNames.forEach(function(name, i) {
      var already = room.students.some(function(s) { return s.name === name; });
      if (already) return;

      var mcqScore = Number((4.5 + Math.random() * 1.5).toFixed(2));
      var tfScore = Number((3.5 + Math.random() * 2.5).toFixed(3));
      var essayScore = Number((5.0 + Math.random() * 2.8).toFixed(2));
      var total = Number(Math.min(room.examSnapshot.maxScore || 20.0, mcqScore + tfScore + essayScore).toFixed(2));
      var grade = total >= 16 ? "Giỏi" : total >= 13 ? "Khá" : total >= 10 ? "Trung bình" : "Yếu";

      room.students.push({
        id: "st_demo_" + i,
        name: name,
        className: room.className || "12A1",
        sbd: "120" + (i + 1),
        joinedAt: Date.now() - (3600 * 1000) + (i * 120000),
        submittedAt: Date.now() - (1800 * 1000) + (i * 240000),
        status: "submitted",
        timeTakenSeconds: 3200 + i * 150,
        mcqAnswers: {},
        tfChoices: {},
        tfExplains: {},
        essayAnswers: {},
        score: {
          mcqCorrectCount: Math.round(mcqScore / 0.25),
          mcqScore: mcqScore,
          tfCorrectCount: Math.round(tfScore / 0.375),
          tfScore: tfScore,
          essayScore: essayScore,
          totalScore: total,
          maxScore: room.examSnapshot.maxScore || 20.0,
          grade: grade
        }
      });
    });

    saveRoom(room);
    renderClassroomHub();
    alert("✅ Đã thêm 8 học sinh mẫu làm bài thi thử vào phòng để Thầy/Cô quan sát bảng điểm và phổ điểm lớp học!");
  }

  // --------------------------------------------------------------------------
  // 7. XUẤT BẢNG ĐIỂM (EXCEL CSV & WORD)
  // --------------------------------------------------------------------------
  function exportClassroomResultsCsv(roomId) {
    var room = getRoomById(roomId);
    if (!room) return;

    var csvRows = [];
    csvRows.push(["STT", "Họ và Tên", "Lớp", "SBD", "Trạng Thái", "Điểm Trắc Nghiệm (Phần I)", "Điểm Đúng/Sai (Phần II)", "Điểm Tự Luận (Phần III)", "Tổng Điểm", "Xếp Loại", "Thời Gian Nộp"]);

    (room.students || []).forEach(function(s, idx) {
      var sc = s.score || {};
      var submitTimeStr = s.submittedAt ? new Date(s.submittedAt).toLocaleTimeString("vi-VN") + " " + new Date(s.submittedAt).toLocaleDateString("vi-VN") : "Chưa nộp";
      csvRows.push([
        idx + 1,
        '"' + s.name + '"',
        '"' + s.className + '"',
        '"' + (s.sbd || "") + '"',
        s.status === "submitted" ? "Đã nộp" : "Đang làm",
        sc.mcqScore !== undefined ? sc.mcqScore : "",
        sc.tfScore !== undefined ? sc.tfScore : "",
        sc.essayScore !== undefined ? sc.essayScore : "",
        sc.totalScore !== undefined ? sc.totalScore : "",
        sc.grade || "",
        '"' + submitTimeStr + '"'
      ]);
    });

    var csvContent = "\uFEFF" + csvRows.map(function(e) { return e.join(","); }).join("\r\n");
    var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "Bang_Diem_Phong_" + room.id + "_" + (room.className || "Lop") + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // --------------------------------------------------------------------------
  // 8. RENDER CHÍNH (CLASSROOM HUB VIEW)
  // --------------------------------------------------------------------------
  function renderClassroomHub(containerId) {
    var targetId = containerId || "classroomHubContainer";
    var container = document.getElementById(targetId);
    if (!container) {
      var mod4 = document.getElementById("mod4MainContainer");
      if (mod4 && typeof portalState !== "undefined" && portalState.mod4MainSection === "classroom") {
        mod4.innerHTML = `<div id="classroomHubContainer"></div>`;
        container = document.getElementById("classroomHubContainer");
      } else {
        return;
      }
    }

    var activeRoom = getRoomById(CLASSROOM_STATE.activeRoomId);

    // Header chung của Phòng Thi Lớp Học
    var html = `
      <div class="card" style="margin-bottom:20px; border-top:4px solid #2563eb;">
        <!-- Top Bar điều hướng vai trò -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; border-bottom:1.5px solid #e2e8f0; padding-bottom:14px; margin-bottom:18px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="badge" style="background:#dbeafe; color:#1e40af; font-size:12px; font-weight:800;">
                🏫 PHÂN HỆ PHÒNG THI LỚP HỌC TRỰC TUYẾN
              </span>
              <span class="badge badge-ok">ĐỒNG BỘ THỜI GIAN THỰC</span>
            </div>
            <h2 style="color:#0f172a; font-size:22px; margin:6px 0 2px;">
              Phòng Làm Đề Chung Cho Cả Lớp • Giáo Viên Kiểm Duyệt &amp; Giám Sát
            </h2>
            <p style="font-size:13.5px; color:#64748b; margin:0;">
              Thầy/Cô tạo phòng thi, <strong>xem trước toàn bộ đề &amp; barem chấm</strong>, cấp mã PIN cho cả lớp làm chung một đề và theo dõi kết quả nộp bài trực tiếp.
            </p>
          </div>

          <div style="display:flex; gap:8px; align-items:center;">
            <button class="btn btn-sm ${CLASSROOM_STATE.currentRole === 'teacher' ? 'btn-primary' : 'btn-outline'}" onclick="window.switchClassroomRole('teacher')">
              👨‍🏫 Bàn Làm Việc Giáo Viên
            </button>
            <button class="btn btn-sm ${CLASSROOM_STATE.currentRole === 'student' ? 'btn-primary' : 'btn-outline'}" onclick="window.switchClassroomRole('student')">
              🎒 Cổng Tham Gia Của Học Sinh
            </button>
          </div>
        </div>
    `;

    // Phân nhánh hiển thị theo Role
    if (CLASSROOM_STATE.currentRole === "student") {
      html += renderStudentView(activeRoom);
    } else {
      // Role Giáo viên
      if (activeRoom) {
        html += renderTeacherDashboard(activeRoom);
      } else {
        html += renderTeacherLanding();
      }
    }

    html += `</div>`;
    container.innerHTML = html;
  }

  // --------------------------------------------------------------------------
  // 9. GIAO DIỆN GIÁO VIÊN: TRANG CHỦ & TẠO PHÒNG MỚI
  // --------------------------------------------------------------------------
  function renderTeacherLanding() {
    var rooms = getStoredRooms();
    var roomList = Object.values(rooms).sort(function(a, b) { return b.createdAt - a.createdAt; });
    var availableExams = getAvailableExamList();

    var html = `
      <div style="display:grid; grid-template-columns:1fr 1.2fr; gap:24px; align-items:start;">
        
        <!-- Cột Trái: Form Tạo Phòng Mới -->
        <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:12px; padding:20px;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
            <span style="font-size:20px;">➕</span>
            <h3 style="margin:0; font-size:17px; color:#1e293b;">Tạo Phòng Thi Mới Cho Lớp</h3>
          </div>
          <p style="font-size:13px; color:#64748b; margin:0 0 16px;">
            Chọn đề thi từ Ngân hàng chuẩn, thiết lập thời gian và <strong>xem trước đề thi</strong> trước khi mở phòng.
          </p>

          <form id="createClassroomRoomForm" onsubmit="event.preventDefault(); window.handleCreateRoomSubmit();">
            <div class="form-group" style="margin-bottom:12px;">
              <label style="font-weight:700; font-size:13px; color:#334155;">Tên Kỳ Thi / Tiêu Đề Phòng:</label>
              <input type="text" id="cr_title" class="form-control" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #cbd5e1;" placeholder="VD: Khảo sát HSG Nông nghiệp Lớp 12A1" required />
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
              <div class="form-group">
                <label style="font-weight:700; font-size:13px; color:#334155;">Lớp áp dụng:</label>
                <input type="text" id="cr_class" class="form-control" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #cbd5e1;" placeholder="VD: 12A1" required />
              </div>
              <div class="form-group">
                <label style="font-weight:700; font-size:13px; color:#334155;">Giáo viên phụ trách:</label>
                <input type="text" id="cr_teacher" class="form-control" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #cbd5e1;" value="Thầy Trương Khắc Nam" required />
              </div>
            </div>

            <div class="form-group" style="margin-bottom:14px;">
              <label style="font-weight:700; font-size:13px; color:#334155;">Chọn Đề Thi Cho Cả Lớp Làm Chung:</label>
              <select id="cr_examId" class="form-control" style="width:100%; padding:8px 12px; border-radius:6px; border:1.5px solid #3b82f6; font-size:13px; background:#fff;" onchange="window.handleExamSelectChange(this.value)">
                ${availableExams.map(function(ex) {
                  return `<option value="${ex.id}">${ex.group} • ${ex.name} (${ex.dur}p)</option>`;
                }).join("")}
              </select>
            </div>

            <!-- Nút bấm XEM TRƯỚC ĐỀ THI ngay tại form tạo phòng -->
            <div style="background:#eff6ff; border:1.5px dashed #60a5fa; border-radius:8px; padding:12px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong style="color:#1d4ed8; font-size:13px; display:block;">👁️ Kiểm duyệt trước khi mở phòng:</strong>
                <span style="font-size:12px; color:#3b82f6;">Xem chi tiết 24 MCQ, Đúng/Sai, Tự Luận &amp; Barem chấm</span>
              </div>
              <button type="button" class="btn btn-sm btn-outline" style="background:#fff; color:#1d4ed8; border-color:#3b82f6; font-weight:700;" onclick="window.previewCurrentSelectedExam()">
                🔍 Xem trước đề thi
              </button>
            </div>

            <!-- Tùy chọn cấu hình phòng thi -->
            <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:16px;">
              <div style="font-size:12.5px; font-weight:700; color:#475569; margin-bottom:8px; text-transform:uppercase;">
                ⚙️ Cấu hình phòng thi:
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
                <div>
                  <label style="font-size:12px; color:#64748b; display:block; margin-bottom:4px;">Thời gian thi (phút):</label>
                  <input type="number" id="cr_duration" value="180" min="15" max="300" style="width:100%; padding:6px 10px; border-radius:4px; border:1px solid #cbd5e1;" />
                </div>
                <div>
                  <label style="font-size:12px; color:#64748b; display:block; margin-bottom:4px;">Bảng chấm Đúng/Sai:</label>
                  <select id="cr_tableMode" style="width:100%; padding:6px 10px; border-radius:4px; border:1px solid #cbd5e1;">
                    <option value="A">Bảng A (Chuyên: 0.125đ + 0.25đ GT)</option>
                    <option value="B">Bảng B (Đại trà: 0.25đ + 0.125đ GT)</option>
                  </select>
                </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:6px; font-size:13px;">
                <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="checkbox" id="cr_recallHints" checked />
                  <span>Cho phép học sinh xem 💡 <em>Điểm tựa ghi nhớ SGK</em></span>
                </label>
                <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="checkbox" id="cr_showScore" checked />
                  <span>Hiển thị điểm số ngay sau khi học sinh nộp bài</span>
                </label>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; padding:10px; font-size:15px; font-weight:800; border-radius:8px;">
              🚀 Kích Hoạt &amp; Mở Phòng Thi Cho Cả Lớp
            </button>
          </form>
        </div>

        <!-- Cột Phải: Danh Sách Các Phòng Thi Đã Tạo -->
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h3 style="margin:0; font-size:17px; color:#1e293b;">📚 Danh Sách Phòng Thi Của Thầy/Cô (${roomList.length})</h3>
            <span style="font-size:12px; color:#64748b;">Lưu trữ tự động trên trình duyệt</span>
          </div>

          ${roomList.length === 0 ? `
            <div style="text-align:center; padding:40px 20px; background:#f8fafc; border:2px dashed #cbd5e1; border-radius:12px;">
              <span style="font-size:36px; display:block; margin-bottom:8px;">🏫</span>
              <h4 style="color:#475569; margin:0 0 6px;">Chưa có phòng thi nào được tạo</h4>
              <p style="font-size:13px; color:#94a3b8; margin:0;">
                Hãy điền thông tin bên cột trái để tạo phòng thi đầu tiên cho học sinh của Thầy/Cô.
              </p>
            </div>
          ` : `
            <div style="display:flex; flex-direction:column; gap:12px;">
              ${roomList.map(function(r) {
                var isAct = r.status === "active";
                var studentCount = r.students ? r.students.length : 0;
                var submitCount = r.students ? r.students.filter(function(s) { return s.status === "submitted"; }).length : 0;
                return `
                  <div style="background:#fff; border:1.5px solid ${isAct ? '#86efac' : '#cbd5e1'}; border-radius:10px; padding:14px 16px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:6px;">
                      <div>
                        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                          <span class="badge" style="background:#0f172a; color:#38bdf8; font-family:monospace; font-size:13px; font-weight:800;">
                            PIN: ${r.id}
                          </span>
                          <span class="badge ${isAct ? 'badge-ok' : 'badge-vandung'}" style="font-size:11px;">
                            ${isAct ? '🟢 ĐANG MỞ' : '🔴 ĐÃ ĐÓNG'}
                          </span>
                          <span class="badge" style="background:#f1f5f9; color:#475569; font-size:11px;">
                            Lớp ${esc(r.className)}
                          </span>
                        </div>
                        <h4 style="margin:4px 0 2px; font-size:15px; color:#0f172a;">${esc(r.title)}</h4>
                        <p style="margin:0; font-size:12px; color:#64748b;">
                          Đề: <strong>${esc(r.examSnapshot.title)}</strong> (${r.config.durationMinutes}p)
                        </p>
                      </div>
                      <div style="text-align:right;">
                        <span style="font-size:18px; font-weight:800; color:#16a34a;">${submitCount}/${studentCount}</span>
                        <span style="font-size:11px; color:#64748b; display:block;">Đã nộp bài</span>
                      </div>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px dashed #e2e8f0; padding-top:10px; margin-top:8px;">
                      <div style="font-size:12px; color:#64748b;">
                        Tạo lúc: ${new Date(r.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                      <div style="display:flex; gap:6px;">
                        <button class="btn btn-sm btn-outline" style="font-size:12px; padding:3px 8px;" onclick="window.openTeacherExamPreview(null, getStoredRooms()['${r.id}'].examSnapshot)">
                          👁️ Xem đề
                        </button>
                        <button class="btn btn-sm btn-primary" style="font-size:12px; padding:3px 10px;" onclick="window.enterRoomDashboard('${r.id}')">
                          📊 Vào Quản Lý &amp; Giám Sát
                        </button>
                        <button class="btn btn-sm btn-outline" style="color:#ef4444; border-color:#fca5a5; font-size:12px; padding:3px 8px;" onclick="window.deleteRoomById('${r.id}')" title="Xóa phòng này">
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          `}
        </div>

      </div>
    `;

    return html;
  }

  // --------------------------------------------------------------------------
  // 10. GIAO DIỆN GIÁO VIÊN: DASHBOARD GIÁM SÁT THỜI GIAN THỰC
  // --------------------------------------------------------------------------
  function renderTeacherDashboard(room) {
    var studentList = room.students || [];
    var submittedStudents = studentList.filter(function(s) { return s.status === "submitted"; });

    // Tính điểm trung bình, max, min
    var totalScoreSum = 0;
    var maxScore = 0;
    var minScore = 20;
    submittedStudents.forEach(function(s) {
      var sc = s.score ? s.score.totalScore : 0;
      totalScoreSum += sc;
      if (sc > maxScore) maxScore = sc;
      if (sc < minScore) minScore = sc;
    });
    var avgScore = submittedStudents.length > 0 ? (totalScoreSum / submittedStudents.length).toFixed(2) : "0.00";
    if (submittedStudents.length === 0) minScore = 0;

    var shareUrl = window.location.origin + window.location.pathname + "?room=" + room.id;

    // Sắp xếp học sinh theo tổng điểm giảm dần
    var sortedStudents = [].concat(studentList).sort(function(a, b) {
      var scA = (a.score && a.score.totalScore) || 0;
      var scB = (b.score && b.score.totalScore) || 0;
      return scB - scA;
    });

    var studentRowsHtml = sortedStudents.map(function(s, sIdx) {
      var isSubmitted = s.status === "submitted";
      var sc = s.score || {};
      var rankBadge = sIdx === 0 ? "🥇" : sIdx === 1 ? "🥈" : sIdx === 2 ? "🥉" : (sIdx + 1);

      return `
        <tr style="border-bottom:1px solid #e2e8f0; background:${sIdx % 2 === 0 ? '#fff' : '#f8fafc'};">
          <td style="padding:10px 14px; text-align:center; font-weight:700;">${rankBadge}</td>
          <td style="padding:10px 14px; font-weight:600; color:#0f172a;">
            ${esc(s.name)}
          </td>
          <td style="padding:10px 14px; color:#64748b;">${esc(s.className)}</td>
          <td style="padding:10px 14px; font-family:monospace; color:#475569;">${esc(s.sbd || "-")}</td>
          <td style="padding:10px 14px;">
            <span class="badge ${isSubmitted ? 'badge-ok' : 'badge-vandung'}" style="font-size:11px;">
              ${isSubmitted ? '✓ Đã Nộp' : '⏳ Đang Làm'}
            </span>
          </td>
          <td style="padding:10px 14px; text-align:center; font-weight:600; color:#2563eb;">
            ${isSubmitted ? sc.mcqScore : '-'}
          </td>
          <td style="padding:10px 14px; text-align:center; font-weight:600; color:#d97706;">
            ${isSubmitted ? sc.tfScore : '-'}
          </td>
          <td style="padding:10px 14px; text-align:center; font-weight:600; color:#7c3aed;">
            ${isSubmitted ? sc.essayScore : '-'}
          </td>
          <td style="padding:10px 14px; text-align:center;">
            <span style="font-size:15px; font-weight:800; color:${sc.totalScore >= 16 ? '#16a34a' : sc.totalScore >= 12 ? '#2563eb' : '#dc2626'};">
              ${isSubmitted ? sc.totalScore : '-'}
            </span>
          </td>
          <td style="padding:10px 14px; text-align:center;">
            <span class="badge" style="background:#f1f5f9; color:#334155; font-size:11px;">
              ${sc.grade || "-"}
            </span>
          </td>
          <td style="padding:10px 14px; text-align:center;">
            <button class="btn btn-sm btn-outline" style="font-size:11px; padding:2px 8px;" onclick="window.viewStudentExamDetail('${room.id}', '${s.id}')">
              🔍 Xem Bài
            </button>
          </td>
        </tr>
      `;
    }).join("");

    var html = `
      <div>
        <!-- Thanh trạng thái phòng thi dính trên cùng -->
        <div style="background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#fff; border-radius:12px; padding:16px 20px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <button class="btn btn-sm" style="background:#334155; color:#fff; font-size:11px; padding:2px 8px;" onclick="window.exitRoomDashboard()">
                ⬅️ Danh Sách Phòng
              </button>
              <span class="badge ${room.status === 'active' ? 'badge-ok' : 'badge-vandung'}">
                ${room.status === 'active' ? '🟢 PHÒNG THI ĐANG MỞ' : '🔴 ĐÃ KHÓA PHÒNG'}
              </span>
              <span class="badge" style="background:#38bdf8; color:#0f172a; font-weight:800;">
                LỚP: ${esc(room.className)}
              </span>
            </div>
            <h3 style="margin:2px 0; color:#fff; font-size:20px;">${esc(room.title)}</h3>
            <div style="font-size:13px; color:#94a3b8; display:flex; gap:12px; flex-wrap:wrap; margin-top:2px;">
              <span>Đề: <strong>${esc(room.examSnapshot.title)}</strong></span>
              <span>•</span>
              <span>Thời gian: <strong>${room.config.durationMinutes} phút</strong></span>
              <span>•</span>
              <span>Bảng chấm: <strong>Bảng ${room.config.tableMode}</strong></span>
            </div>
          </div>

          <!-- Mã PIN & Link chia sẻ -->
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.1); padding:6px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.2);">
              <span style="font-size:12px; color:#cbd5e1;">MÃ PHÒNG (PIN):</span>
              <span style="font-family:monospace; font-size:22px; font-weight:800; color:#4ade80; letter-spacing:1px;">
                ${room.id}
              </span>
              <button class="btn btn-sm btn-accent" style="font-size:11px; padding:3px 8px;" onclick="window.copyToClipboard('${room.id}', 'Đã sao chép mã phòng!')" title="Sao chép mã PIN">
                📋 Sao chép
              </button>
            </div>
            
            <div style="display:flex; gap:6px;">
              <button class="btn btn-sm btn-outline" style="color:#38bdf8; border-color:#38bdf8; font-size:12px; background:transparent;" onclick="window.copyToClipboard('${shareUrl}', 'Đã sao chép đường link phòng thi cho cả lớp!')">
                🔗 Sao Chép Link Gửi Lớp
              </button>
              <button class="btn btn-sm btn-outline" style="color:#fff; border-color:#94a3b8; font-size:12px; background:transparent;" onclick="window.openTeacherExamPreview(null, getStoredRooms()['${room.id}'].examSnapshot)">
                👁️ Xem Trước Đề Thi
              </button>
            </div>
          </div>
        </div>

        <!-- 4 Thẻ KPI Thống Kê Nhanh -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:14px; margin-bottom:20px;">
          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:14px 16px; border-left:4px solid #3b82f6;">
            <span style="font-size:12px; color:#64748b; font-weight:700;">👥 SỐ HỌC SINH VÀO PHÒNG</span>
            <div style="font-size:24px; font-weight:800; color:#1e293b; margin-top:4px;">${studentList.length}</div>
            <span style="font-size:12px; color:#3b82f6;">${submittedStudents.length} em đã nộp bài (${studentList.length > 0 ? Math.round((submittedStudents.length / studentList.length) * 100) : 0}%)</span>
          </div>

          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:14px 16px; border-left:4px solid #16a34a;">
            <span style="font-size:12px; color:#64748b; font-weight:700;">📊 ĐIỂM TRUNG BÌNH LỚP</span>
            <div style="font-size:24px; font-weight:800; color:#16a34a; margin-top:4px;">${avgScore} <span style="font-size:14px; font-weight:400; color:#64748b;">/${room.examSnapshot.maxScore || 20}</span></div>
            <span style="font-size:12px; color:#16a34a;">Dựa trên ${submittedStudents.length} bài đã nộp</span>
          </div>

          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:14px 16px; border-left:4px solid #eab308;">
            <span style="font-size:12px; color:#64748b; font-weight:700;">🥇 ĐIỂM CAO NHẤT LỚP</span>
            <div style="font-size:24px; font-weight:800; color:#ca8a04; margin-top:4px;">${maxScore.toFixed(2)}</div>
            <span style="font-size:12px; color:#ca8a04;">Thủ khoa tạm thời</span>
          </div>

          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:14px 16px; border-left:4px solid #8b5cf6;">
            <span style="font-size:12px; color:#64748b; font-weight:700;">⚙️ ĐIỀU KHIỂN PHÒNG</span>
            <div style="display:flex; gap:6px; margin-top:8px;">
              ${room.status === 'active' ? `
                <button class="btn btn-sm btn-outline" style="color:#ef4444; border-color:#fca5a5; font-size:12px; padding:4px 8px;" onclick="window.setClassroomRoomStatus('${room.id}', 'closed')">
                  🔒 Đóng Phòng Thi
                </button>
              ` : `
                <button class="btn btn-sm btn-primary" style="font-size:12px; padding:4px 8px;" onclick="window.setClassroomRoomStatus('${room.id}', 'active')">
                  🔓 Mở Lại Phòng
                </button>
              `}
              <button class="btn btn-sm btn-outline" style="font-size:12px; padding:4px 8px;" onclick="window.addSimulationStudents('${room.id}')" title="Thêm học sinh mẫu để kiểm tra bảng điểm">
                👥 Thêm 8 HS Thử
              </button>
            </div>
          </div>
        </div>

        <!-- Thanh công cụ Bảng điểm -->
        <div style="background:#fff; border:1px solid #cbd5e1; border-radius:10px; padding:14px 18px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <h4 style="margin:0; font-size:16px; color:#1e293b;">
              📝 Bảng Điểm &amp; Danh Sách Nộp Bài Của Lớp (${submittedStudents.length}/${studentList.length})
            </h4>
            <span class="badge badge-ok">Tự động làm mới</span>
          </div>

          <div style="display:flex; gap:8px;">
            <button class="btn btn-sm btn-accent" onclick="window.exportClassroomResultsCsv('${room.id}')">
              📥 Xuất File Excel / CSV
            </button>
            <button class="btn btn-sm btn-outline" onclick="window.print()">
              🖨️ In Bảng Điểm
            </button>
          </div>
        </div>

        <!-- Bảng danh sách học sinh & điểm số chi tiết -->
        <div style="background:#fff; border:1px solid #cbd5e1; border-radius:10px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          ${studentList.length === 0 ? `
            <div style="text-align:center; padding:50px 20px;">
              <span style="font-size:40px; display:block; margin-bottom:10px;">⏳</span>
              <h4 style="color:#475569; margin:0 0 6px;">Đang đợi học sinh vào phòng thi...</h4>
              <p style="font-size:13.5px; color:#94a3b8; max-width:480px; margin:0 auto 16px;">
                Thầy/Cô hãy gửi Mã phòng <strong>${room.id}</strong> hoặc đường link cho học sinh để các em bắt đầu làm bài.
              </p>
              <button class="btn btn-primary btn-sm" onclick="window.addSimulationStudents('${room.id}')">
                👥 Bấm vào đây để Nạp 8 Học Sinh Mẫu Làm Thử Ngay
              </button>
            </div>
          ` : `
            <div style="overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; font-size:13.5px; text-align:left;">
                <thead>
                  <tr style="background:#f1f5f9; color:#334155; border-bottom:1.5px solid #cbd5e1;">
                    <th style="padding:10px 14px; width:45px; text-align:center;">Hạng</th>
                    <th style="padding:10px 14px;">Họ và Tên Học Sinh</th>
                    <th style="padding:10px 14px; width:80px;">Lớp</th>
                    <th style="padding:10px 14px; width:80px;">SBD</th>
                    <th style="padding:10px 14px; width:120px;">Trạng Thái</th>
                    <th style="padding:10px 14px; width:100px; text-align:center;">Phần I (MCQ)</th>
                    <th style="padding:10px 14px; width:100px; text-align:center;">Phần II (Đ/S)</th>
                    <th style="padding:10px 14px; width:100px; text-align:center;">Phần III (TL)</th>
                    <th style="padding:10px 14px; width:110px; text-align:center;">TỔNG ĐIỂM</th>
                    <th style="padding:10px 14px; width:90px; text-align:center;">Xếp Loại</th>
                    <th style="padding:10px 14px; width:110px; text-align:center;">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  ${studentRowsHtml}
                </tbody>
              </table>
            </div>
          `}
        </div>

      </div>
    `;

    return html;
  }

  // --------------------------------------------------------------------------
  // 11. GIAO DIỆN HỌC SINH: CỔNG THAM GIA HOẶC LÀM BÀI TRỰC TUYẾN
  // --------------------------------------------------------------------------
  function renderStudentView(activeRoom) {
    if (!activeRoom || !CLASSROOM_STATE.studentInfo.name) {
      // Form điểm danh vào phòng
      return `
        <div style="max-width:540px; margin:20px auto; background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:12px; padding:24px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
          <div style="text-align:center; margin-bottom:18px;">
            <span style="font-size:36px; display:block; margin-bottom:6px;">🎒</span>
            <h3 style="margin:0; font-size:19px; color:#0f172a;">Cổng Tham Gia Phòng Thi Trực Tuyến</h3>
            <p style="font-size:13px; color:#64748b; margin:4px 0 0;">
              Nhập mã phòng do Thầy/Cô cung cấp để vào làm chung đề với cả lớp
            </p>
          </div>

          <form onsubmit="event.preventDefault(); window.handleStudentJoinSubmit();">
            <div class="form-group" style="margin-bottom:12px;">
              <label style="font-weight:700; font-size:13px; color:#334155;">Mã Phòng Thi (PIN):</label>
              <input type="text" id="st_join_room" class="form-control" style="width:100%; padding:10px 14px; border-radius:6px; border:1.5px solid #3b82f6; font-family:monospace; font-size:16px; font-weight:800; text-transform:uppercase;" placeholder="VD: CNN-8942" value="${esc(CLASSROOM_STATE.activeRoomId || '')}" required />
            </div>

            <div class="form-group" style="margin-bottom:12px;">
              <label style="font-weight:700; font-size:13px; color:#334155;">Họ và Tên Học Sinh:</label>
              <input type="text" id="st_join_name" class="form-control" style="width:100%; padding:9px 12px; border-radius:6px; border:1px solid #cbd5e1;" placeholder="VD: Nguyễn Văn An" required />
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:18px;">
              <div class="form-group">
                <label style="font-weight:700; font-size:13px; color:#334155;">Lớp:</label>
                <input type="text" id="st_join_class" class="form-control" style="width:100%; padding:9px 12px; border-radius:6px; border:1px solid #cbd5e1;" placeholder="VD: 12A1" required />
              </div>
              <div class="form-group">
                <label style="font-weight:700; font-size:13px; color:#334155;">Số Báo Danh (tùy chọn):</label>
                <input type="text" id="st_join_sbd" class="form-control" style="width:100%; padding:9px 12px; border-radius:6px; border:1px solid #cbd5e1;" placeholder="VD: 1205" />
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; padding:12px; font-size:15px; font-weight:800; border-radius:8px;">
              🚀 Vào Phòng Thi &amp; Bắt Đầu Làm Bài
            </button>
          </form>
        </div>
      `;
    }

    // Nếu học sinh đã vào phòng -> Hiển thị Giao diện làm bài
    var exam = activeRoom.examSnapshot;
    var isSubmitted = CLASSROOM_STATE.studentSubmitted;

    var html = `
      <div>
        <!-- Sticky Banner thông tin học sinh & Đồng hồ phòng thi -->
        <div style="background:#0f172a; color:#fff; border-radius:10px; padding:12px 18px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <div style="font-size:12px; color:#94a3b8; display:flex; gap:8px; align-items:center;">
              <span>PHÒNG: <strong style="color:#4ade80;">${activeRoom.id}</strong></span>
              <span>•</span>
              <span>LỚP: <strong>${esc(activeRoom.className)}</strong></span>
            </div>
            <div style="font-size:16px; font-weight:800; color:#fff;">
              👤 Học sinh: ${esc(CLASSROOM_STATE.studentInfo.name)} (SBD: ${esc(CLASSROOM_STATE.studentInfo.sbd || "-")})
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:12px;">
            ${isSubmitted ? `
              <div style="background:#16a34a; color:#fff; padding:6px 14px; border-radius:6px; font-weight:800; font-size:14px;">
                ✓ ĐÃ NỘP BÀI THÀNH CÔNG
              </div>
            ` : `
              <div style="background:#1e293b; color:#4ade80; padding:6px 14px; border-radius:6px; font-family:monospace; font-weight:800; font-size:16px; border:1px solid #334155;">
                ⏱️ Đồng bộ lớp: ${activeRoom.config.durationMinutes} Phút
              </div>
              <button class="btn btn-primary btn-sm" onclick="window.submitStudentClassroomExam()" style="font-weight:700;">
                ✅ Nộp Bài Thi Cho Giáo Viên
              </button>
            `}
          </div>
        </div>

        ${isSubmitted && CLASSROOM_STATE.studentResult ? `
          <!-- Banner Kết Quả Sau Khi Nộp -->
          <div style="background:#f0fdf4; border:2px solid #86efac; border-radius:10px; padding:16px 20px; margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div>
                <h3 style="color:#166534; margin:0 0 4px; font-size:18px;">
                  🎉 Chúc mừng em ${esc(CLASSROOM_STATE.studentInfo.name)} đã hoàn thành bài thi!
                </h3>
                <p style="margin:0; font-size:13px; color:#15803d;">
                  Bài thi của em đã được ghi nhận tự động vào bảng điểm của Thầy/Cô.
                </p>
              </div>
              <div style="text-align:right;">
                <span style="font-size:26px; font-weight:900; color:#16a34a;">
                  ${CLASSROOM_STATE.studentResult.totalScore}
                </span>
                <span style="font-size:14px; color:#166534;"> / ${CLASSROOM_STATE.studentResult.maxScore} Điểm (${CLASSROOM_STATE.studentResult.grade})</span>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Nội dung đề thi học sinh làm bài -->
        <div style="background:#fff; border:1px solid #cbd5e1; border-radius:10px; padding:18px;">
          <h3 style="color:#1e3a8a; margin:0 0 6px; font-size:18px;">${esc(exam.title)}</h3>
          <p style="font-size:13px; color:#64748b; margin:0 0 16px;">${esc(exam.subTitle || "")}</p>

          <!-- PHẦN I: 24 MCQ -->
          <div style="margin-bottom:24px;">
            <h4 style="color:#1e3a8a; border-bottom:1.5px solid #e2e8f0; padding-bottom:6px; margin-bottom:14px; font-size:15px;">
              PHẦN I. TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (24 CÂU • 6,0 ĐIỂM)
            </h4>
            <div style="display:flex; flex-direction:column; gap:16px;">
              ${(exam.mcqs || []).map(function(q, idx) {
                var selectedOpt = CLASSROOM_STATE.studentAnswers.mcq[idx];
                return `
                  <div style="padding:12px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
                    <div style="font-weight:700; color:#1e293b; margin-bottom:8px;">
                      <span style="color:#2563eb;">Câu ${idx + 1}:</span> ${esc(q.stem)}
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:6px;">
                      ${(q.options || []).map(function(opt, optIdx) {
                        var checked = selectedOpt === optIdx;
                        return `
                          <label style="padding:8px 10px; border-radius:6px; font-size:13px; border:1.5px solid ${checked ? '#2563eb' : '#cbd5e1'}; background:${checked ? '#eff6ff' : '#fff'}; cursor:${isSubmitted ? 'default' : 'pointer'}; display:flex; align-items:center; gap:8px;">
                            <input type="radio" name="st_mcq_${idx}" value="${optIdx}" ${checked ? 'checked' : ''} ${isSubmitted ? 'disabled' : ''} onchange="window.saveStudentMcq(${idx}, ${optIdx})" />
                            <span><strong>${String.fromCharCode(65 + optIdx)}.</strong> ${esc(opt)}</span>
                          </label>
                        `;
                      }).join("")}
                    </div>
                    ${activeRoom.config.allowRecallHints && q.recallHint ? `
                      <div style="margin-top:8px; font-size:12px; color:#1e40af; background:#eff6ff; padding:6px 10px; border-radius:4px; border-left:3px solid #3b82f6;">
                        💡 <strong>Gợi ý nhớ SGK:</strong> ${esc(q.recallHint)}
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- PHẦN II: 4 CÂU ĐÚNG/SAI -->
          <div style="margin-bottom:24px;">
            <h4 style="color:#1e3a8a; border-bottom:1.5px solid #e2e8f0; padding-bottom:6px; margin-bottom:14px; font-size:15px;">
              PHẦN II. CÂU HỎI ĐÚNG / SAI CÓ GIẢI THÍCH (4 CÂU • 16 Ý • 6,0 ĐIỂM)
            </h4>
            <div style="display:flex; flex-direction:column; gap:16px;">
              ${(exam.tfs || []).map(function(q, qIdx) {
                return `
                  <div style="padding:14px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
                    <div style="font-weight:700; color:#1e293b; margin-bottom:6px;">
                      <span style="color:#d97706;">Câu ${qIdx + 1}:</span> ${esc(q.title || ("Chủ đề: " + (q.topic || "")))}
                    </div>
                    <div style="font-size:13.5px; color:#475569; margin-bottom:12px;">
                      ${esc(q.stem || q.context || "")}
                    </div>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                      ${['a', 'b', 'c', 'd'].map(function(sub) {
                        var stmt = q.statements ? q.statements[sub] : "";
                        var userVal = CLASSROOM_STATE.studentAnswers.tfChoice[qIdx] ? CLASSROOM_STATE.studentAnswers.tfChoice[qIdx][sub] : undefined;
                        var userExp = CLASSROOM_STATE.studentAnswers.tfExplain[qIdx] ? (CLASSROOM_STATE.studentAnswers.tfExplain[qIdx][sub] || "") : "";
                        return `
                          <div style="background:#fff; border:1px solid #cbd5e1; border-radius:6px; padding:10px 12px;">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:6px;">
                              <div style="font-size:13px; color:#1e293b; line-height:1.5;">
                                <strong>${sub})</strong> ${esc(stmt)}
                              </div>
                              <div style="display:flex; gap:6px;">
                                <label style="padding:2px 8px; border-radius:4px; border:1px solid ${userVal === true ? '#16a34a' : '#cbd5e1'}; background:${userVal === true ? '#dcfce7' : '#fff'}; cursor:pointer; font-size:12px; font-weight:700;">
                                  <input type="radio" name="st_tf_${qIdx}_${sub}" value="true" ${userVal === true ? 'checked' : ''} ${isSubmitted ? 'disabled' : ''} onchange="window.saveStudentTfChoice(${qIdx}, '${sub}', true)" /> Đúng
                                </label>
                                <label style="padding:2px 8px; border-radius:4px; border:1px solid ${userVal === false ? '#dc2626' : '#cbd5e1'}; background:${userVal === false ? '#fee2e2' : '#fff'}; cursor:pointer; font-size:12px; font-weight:700;">
                                  <input type="radio" name="st_tf_${qIdx}_${sub}" value="false" ${userVal === false ? 'checked' : ''} ${isSubmitted ? 'disabled' : ''} onchange="window.saveStudentTfChoice(${qIdx}, '${sub}', false)" /> Sai
                                </label>
                              </div>
                            </div>
                            <input type="text" placeholder="Nhập tóm tắt cơ sở khoa học / giải thích..." value="${esc(userExp)}" ${isSubmitted ? 'disabled' : ''} oninput="window.saveStudentTfExplain(${qIdx}, '${sub}', this.value)" style="width:100%; padding:6px 10px; border-radius:4px; border:1px solid #e2e8f0; font-size:12px;" />
                          </div>
                        `;
                      }).join("")}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- PHẦN III: TỰ LUẬN NẾU CÓ -->
          ${exam.essays && exam.essays.length > 0 ? `
            <div style="margin-bottom:24px;">
              <h4 style="color:#1e3a8a; border-bottom:1.5px solid #e2e8f0; padding-bottom:6px; margin-bottom:14px; font-size:15px;">
                PHẦN III. TỰ LUẬN KỸ THUẬT &amp; NÔNG NGHIỆP THỰC TIỄN (${exam.essays.length} CÂU • 8,0 ĐIỂM)
              </h4>
              <div style="display:flex; flex-direction:column; gap:16px;">
                ${exam.essays.map(function(essay, eIdx) {
                  var userText = CLASSROOM_STATE.studentAnswers.essayText[eIdx] || "";
                  return `
                    <div style="padding:14px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
                      <div style="font-weight:700; color:#6d28d9; margin-bottom:6px;">
                        ${esc(essay.title || ("Câu Tự Luận " + (eIdx + 1)))} (${essay.points || 3.5} Điểm)
                      </div>
                      <div style="font-size:13px; color:#1e293b; line-height:1.6; white-space:pre-line; margin-bottom:10px; background:#fff; padding:10px; border-radius:6px; border:1px solid #e2e8f0;">
                        ${esc(essay.problem)}
                      </div>
                      <textarea rows="6" placeholder="Nhập bài làm tự luận của em vào đây..." ${isSubmitted ? 'disabled' : ''} oninput="window.saveStudentEssay(${eIdx}, this.value)" style="width:100%; padding:10px 12px; border-radius:6px; border:1px solid #cbd5e1; font-size:13px; font-family:inherit;">${esc(userText)}</textarea>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          ` : ''}

          ${!isSubmitted ? `
            <div style="text-align:center; padding:20px 0;">
              <button class="btn btn-primary" style="padding:12px 36px; font-size:16px; font-weight:800; border-radius:8px;" onclick="window.submitStudentClassroomExam()">
                ✅ NỘP BÀI THI CHO GIÁO VIÊN
              </button>
            </div>
          ` : ''}

        </div>

      </div>
    `;

    return html;
  }

  // --------------------------------------------------------------------------
  // 12. MODAL XEM CHI TIẾT BÀI LÀM CỦA 1 HỌC SINH (TEACHER VIEW STUDENT WORK)
  // --------------------------------------------------------------------------
  function viewStudentExamDetail(roomId, studentId) {
    var room = getRoomById(roomId);
    if (!room) return;
    var student = (room.students || []).find(function(s) { return s.id === studentId; });
    if (!student) return;

    var exam = room.examSnapshot;
    var sc = student.score || {};

    var modalHtml = `
      <div id="classroomStudentDetailModal" class="modal-backdrop" style="display:flex; z-index:99999; background:rgba(15,23,42,0.8); backdrop-filter:blur(4px); position:fixed; inset:0; align-items:center; justify-content:center; padding:16px;">
        <div class="modal-box" style="max-width:960px; width:100%; max-height:90vh; display:flex; flex-direction:column; background:#fff; border-radius:12px; overflow:hidden; border:2px solid #3b82f6;">
          
          <div style="background:#1e3a8a; color:#fff; padding:14px 20px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h3 style="margin:0; font-size:17px; color:#fff;">
                👤 Bài Làm Của Thí Sinh: ${esc(student.name)} (Lớp: ${esc(student.className)})
              </h3>
              <p style="margin:2px 0 0; font-size:12.5px; color:#cbd5e1;">
                Phòng thi: <strong>${room.id}</strong> • SBD: ${esc(student.sbd || "-")} • Nộp lúc: ${student.submittedAt ? new Date(student.submittedAt).toLocaleTimeString("vi-VN") : "Chưa nộp"}
              </p>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <span style="background:#16a34a; color:#fff; padding:4px 12px; border-radius:6px; font-size:16px; font-weight:800;">
                ${sc.totalScore || 0} / ${exam.maxScore || 20} Điểm
              </span>
              <button class="btn btn-sm btn-outline" onclick="document.getElementById('classroomStudentDetailModal').remove()" style="color:#fff; border-color:rgba(255,255,255,0.4);">
                ✕ Đóng
              </button>
            </div>
          </div>

          <div style="flex:1; overflow-y:auto; padding:20px; background:#f8fafc;">
            <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:14px;">
              <div style="font-weight:700; color:#1e3a8a; margin-bottom:6px;">📊 Tổng kết điểm số 3 phần:</div>
              <div style="display:flex; gap:16px; font-size:13.5px;">
                <span>Phần I (MCQ): <strong>${sc.mcqScore || 0} đ</strong> (${sc.mcqCorrectCount || 0}/24 câu đúng)</span>
                <span>•</span>
                <span>Phần II (Đúng/Sai): <strong>${sc.tfScore || 0} đ</strong></span>
                <span>•</span>
                <span>Phần III (Tự luận): <strong>${sc.essayScore || 0} đ</strong></span>
              </div>
            </div>

            <!-- Xem bài tự luận của học sinh -->
            ${exam.essays && exam.essays.length > 0 ? `
              <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:14px;">
                <div style="font-weight:700; color:#6d28d9; margin-bottom:8px;">📝 Nội dung bài làm tự luận của học sinh:</div>
                ${exam.essays.map(function(es, eIdx) {
                  var txt = (student.essayAnswers && student.essayAnswers[eIdx]) || "<em>(Học sinh không nhập nội dung câu này)</em>";
                  return `
                    <div style="margin-bottom:12px; padding:10px; background:#faf5ff; border-radius:6px; border-left:3px solid #7c3aed;">
                      <strong>${esc(es.title)}:</strong>
                      <div style="font-size:13px; color:#1e293b; margin-top:4px; white-space:pre-line;">${esc(txt)}</div>
                    </div>
                  `;
                }).join("")}
              </div>
            ` : ''}
          </div>

          <div style="background:#fff; border-top:1px solid #e2e8f0; padding:10px 20px; display:flex; justify-content:flex-end;">
            <button class="btn btn-primary btn-sm" onclick="document.getElementById('classroomStudentDetailModal').remove()">
              Đóng cửa sổ
            </button>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }

  // --------------------------------------------------------------------------
  // 13. GLOBAL WINDOW HANDLERS
  // --------------------------------------------------------------------------
  window.switchClassroomRole = function(role) {
    CLASSROOM_STATE.currentRole = role;
    renderClassroomHub();
  };

  window.handleExamSelectChange = function(examId) {
    // Tự động điều chỉnh thời gian theo đề
    var durInput = document.getElementById("cr_duration");
    if (durInput) {
      if (examId.indexOf("bo_") === 0) durInput.value = 50;
      else durInput.value = 180;
    }
  };

  window.previewCurrentSelectedExam = function() {
    var sel = document.getElementById("cr_examId");
    var examId = sel ? sel.value : "dn_easy_01";
    openTeacherExamPreview(examId);
  };

  window.openTeacherExamPreview = openTeacherExamPreview;
  window.closeTeacherExamPreview = closeTeacherExamPreview;
  window.replaceExamQuestion = replaceExamQuestion;
  window.auditPreviewExam = auditPreviewExam;
  window.regeneratePreviewExam = regeneratePreviewExam;
  window.setTeacherPreviewViewMode = setTeacherPreviewViewMode;

  window.switchPreviewTab = function(tab) {
    CLASSROOM_STATE.previewActiveTab = tab;
    renderTeacherPreviewModal();
  };

  window.confirmAndApplyPreviewedExam = function() {
    var exam = CLASSROOM_STATE.previewExamSnapshot;
    var roomId = CLASSROOM_STATE.previewRoomId;
    if (roomId) {
      var room = getRoomById(roomId);
      if (room) {
        room.status = "active";
        room.examSnapshot = exam;
        if (!room.config) room.config = {};
        room.config.previewApproved = true;
        saveRoom(room);
      }
    }
    closeTeacherExamPreview();
    if (typeof renderClassroomHub === "function") renderClassroomHub();
    alert("✅ Đề thi đã được Thầy/Cô phê duyệt thành công!\n\nPhòng thi hiện đã ở trạng thái HOẠT ĐỘNG, học sinh có thể vào làm bài ngay.");
  };

  window.handleCreateRoomSubmit = function() {
    var title = document.getElementById("cr_title").value;
    var className = document.getElementById("cr_class").value;
    var teacherName = document.getElementById("cr_teacher").value;
    var examId = document.getElementById("cr_examId").value;
    var durationMinutes = document.getElementById("cr_duration").value;
    var tableMode = document.getElementById("cr_tableMode").value;
    var allowRecallHints = document.getElementById("cr_recallHints").checked;
    var showScoreOnSubmit = document.getElementById("cr_showScore").checked;

    createNewClassroomRoom({
      title: title,
      className: className,
      teacherName: teacherName,
      examId: examId,
      durationMinutes: durationMinutes,
      tableMode: tableMode,
      allowRecallHints: allowRecallHints,
      showScoreOnSubmit: showScoreOnSubmit
    });
  };

  window.enterRoomDashboard = function(roomId) {
    CLASSROOM_STATE.activeRoomId = roomId;
    CLASSROOM_STATE.currentRole = "teacher";
    renderClassroomHub();
  };

  window.exitRoomDashboard = function() {
    CLASSROOM_STATE.activeRoomId = null;
    renderClassroomHub();
  };

  window.setClassroomRoomStatus = function(roomId, status) {
    setRoomStatus(roomId, status);
  };

  window.addSimulationStudents = function(roomId) {
    addDemoStudentsToRoom(roomId);
  };

  window.exportClassroomResultsCsv = exportClassroomResultsCsv;
  window.deleteRoomById = deleteRoom;
  window.viewStudentExamDetail = viewStudentExamDetail;

  window.handleStudentJoinSubmit = function() {
    var roomId = document.getElementById("st_join_room").value.trim().toUpperCase();
    var name = document.getElementById("st_join_name").value.trim();
    var className = document.getElementById("st_join_class").value.trim();
    var sbd = document.getElementById("st_join_sbd").value.trim();
    studentJoinRoom(roomId, name, className, sbd);
  };

  window.saveStudentMcq = function(qIdx, optIdx) {
    CLASSROOM_STATE.studentAnswers.mcq[qIdx] = Number(optIdx);
  };

  window.saveStudentTfChoice = function(qIdx, sub, val) {
    if (!CLASSROOM_STATE.studentAnswers.tfChoice[qIdx]) CLASSROOM_STATE.studentAnswers.tfChoice[qIdx] = {};
    CLASSROOM_STATE.studentAnswers.tfChoice[qIdx][sub] = (val === true || val === "true");
  };

  window.saveStudentTfExplain = function(qIdx, sub, text) {
    if (!CLASSROOM_STATE.studentAnswers.tfExplain[qIdx]) CLASSROOM_STATE.studentAnswers.tfExplain[qIdx] = {};
    CLASSROOM_STATE.studentAnswers.tfExplain[qIdx][sub] = text;
  };

  window.saveStudentEssay = function(eIdx, text) {
    CLASSROOM_STATE.studentAnswers.essayText[eIdx] = text;
  };

  window.submitStudentClassroomExam = submitStudentExam;

  window.copyToClipboard = function(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        alert(successMsg || "Đã sao chép vào bộ nhớ tạm!");
      }).catch(function() {
        prompt("Hãy nhấn Ctrl+C để sao chép:", text);
      });
    } else {
      prompt("Hãy nhấn Ctrl+C để sao chép:", text);
    }
  };

  // Lắng nghe đồng bộ đa tab qua BroadcastChannel
  if (syncChannel) {
    syncChannel.onmessage = function(ev) {
      if (ev.data && ev.data.type === "ROOMS_UPDATED") {
        var container = document.getElementById("classroomHubContainer");
        if (container) {
          renderClassroomHub();
        }
      }
    };
  }

  // Tự động kiểm tra URL tham gia phòng: ?room=CNN-8942
  function checkUrlRoomParam() {
    var params = new URLSearchParams(window.location.search);
    var roomPin = params.get("room") || params.get("join") || params.get("phong");
    if (roomPin) {
      CLASSROOM_STATE.activeRoomId = roomPin.trim().toUpperCase();
      CLASSROOM_STATE.currentRole = "student";
      if (typeof portalState !== "undefined") {
        portalState.mod4MainSection = "classroom";
      }
    }
  }

  // Export module ra window
  window.renderClassroomHub = renderClassroomHub;
  window.CLASSROOM_STATE = CLASSROOM_STATE;
  window.checkUrlRoomParam = checkUrlRoomParam;
  window.resolveExamById = resolveExamById;
  window.getStoredRooms = getStoredRooms;
  window.studentJoinRoom = studentJoinRoom;
  window.addDemoStudentsToRoom = addDemoStudentsToRoom;
  window.createNewClassroomRoom = createNewClassroomRoom;

  // Khởi động khi DOM sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkUrlRoomParam);
  } else {
    checkUrlRoomParam();
  }

})(window);
