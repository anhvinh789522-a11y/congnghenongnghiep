// ============================================================================
// HỆ THỐNG QUẢN LÝ HỒ SƠ CV 5512, SOẠN GIÁO ÁN & KHO BÀI GIẢNG PPT GẮN DRIVE
// Dành cho môn Công nghệ Nông nghiệp 10, 11, 12 (Bộ sách Kết nối tri thức)
// Trường THPT Lộc Ninh - Sở GD&ĐT Đồng Nai
// ============================================================================

const state5512 = {
  currentSubTab: 1, // 1: 3 Phụ lục 5512, 2: Soạn Giáo án 5512, 3: Kho PPT gắn Drive
  currentGrade: 'cn10', // cn10, cn11, cn12
  currentPl: 1, // 1: PL1 (Tổ CM), 2: PL2 (Hoạt động GD / STEAM), 3: PL3 (GV cá nhân)
  searchQuery: '',
  termFilter: 'all', // all, hk1, hk2
  
  // Trạng thái cấu hình tích hợp năng lực
  integrations: {
    nls: true,       // Khung Năng lực số Bộ GD&ĐT
    ai: true,        // Giáo dục AI theo Khung QĐ 2422/QĐ-BGDĐT
    steam: true,     // Tích hợp giáo dục STEAM
    env: true,       // Bảo vệ môi trường & PT bền vững
    tech: true       // Ứng dụng công nghệ 4.0
  },

  // Cấu hình thông tin hồ sơ trường
  metaConfig: {
    school: "TRƯỜNG THPT LỘC NINH",
    department: "TỔ CÔNG NGHỆ - TIN",
    province: "ĐỒNG NAI",
    schoolYear: "2026 - 2027",
    teacherName: "Võ Thị Thanh Thuý",
    teacherSub: "Trương Khắc Nam",
    headName: "Phạm Thanh Xuân",
    principalName: "Ban Giám Hiệu"
  },

  // Trạng thái Soạn Giáo án (Kế hoạch bài dạy)
  editor: {
    grade: 'cn10',
    lessonId: 1,
    templateId: 'nls_ai', // basic, nls_ai, steam
    title: '',
    periods: 2,
    week: 'Tuần 1, Tiết 1-2',
    yccd: '',
    nlsGoal: '',
    aiGoal: '',
    qualities: 'Chăm chỉ, trung thực, có trách nhiệm với công việc chung và ý thức bảo vệ môi trường, ứng dụng công nghệ hiệu quả.',
    teacherEq: '- SGK, máy tính xách tay, Smart Tivi kết nối Internet.\n- Bài giảng trình chiếu PowerPoint, phiếu học tập số, video minh họa.\n- Bộ công cụ tương tác: Plickers, Canva, trợ lý AI.',
    studentEq: '- SGK Công nghệ, vở ghi chép, đồ dùng học tập.\n- Điện thoại thông minh tra cứu tài liệu theo nhóm (hoặc dùng thẻ Plickers).\n- Phiếu học tập nhóm.',
    act1: {
      name: 'HOẠT ĐỘNG 1: KHỞI ĐỘNG (MỞ ĐẦU)',
      goal: 'Tạo tâm thế hứng thú, kích hoạt kiến thức nền tảng và dẫn dắt học sinh vào nội dung bài học mới.',
      content: 'Học sinh tham gia trò chơi tương tác / quan sát tình huống thực tế nông nghiệp và trả lời câu hỏi dẫn dắt của giáo viên.',
      product: 'Câu trả lời nhanh của học sinh qua thẻ Plickers / Quizizz / bảng nhóm; từ khóa định hướng bài mới.',
      step1: 'Giáo viên phổ biến thể lệ, trình chiếu câu hỏi khởi động hoặc video tình huống thực tế nông nghiệp.',
      step2: 'Học sinh làm việc cá nhân hoặc thảo luận nhanh theo cặp (1-2 phút) để tìm phương án trả lời.',
      step3: 'Giáo viên gọi đại diện học sinh trả lời hoặc dùng camera quét kết quả thẻ Plickers cả lớp.',
      step4: 'Giáo viên nhận xét, khen ngợi và dẫn dắt khéo léo vào bài học mới.'
    },
    act2: {
      name: 'HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI',
      goal: 'Chiếm lĩnh kiến thức trọng tâm của bài học và phát triển năng lực công nghệ, năng lực số.',
      content: 'Học sinh đọc SGK, quan sát sơ đồ/video, thảo luận nhóm hoàn thành Phiếu học tập và tra cứu thông tin số.',
      product: 'Phiếu học tập của các nhóm đã hoàn thành; sơ đồ tư duy tóm tắt kiến thức; bảng phân loại/so sánh.',
      step1: 'Giáo viên chia lớp thành các nhóm, chuyển giao nhiệm vụ qua Phiếu học tập số và gợi ý từ khóa tra cứu.',
      step2: 'Các nhóm nghiên cứu SGK, phân công nhiệm vụ tra cứu thông tin, thảo luận và ghi chép kết quả.',
      step3: 'Đại diện một nhóm báo cáo sản phẩm; các nhóm khác đối chiếu, nhận xét, bổ sung câu hỏi phản biện.',
      step4: 'Giáo viên chuẩn hóa kiến thức trọng tâm, giải thích cơ sở khoa học và đánh giá sự hợp tác của các nhóm.'
    },
    act3: {
      name: 'HOẠT ĐỘNG 3: LUYỆN TẬP',
      goal: 'Khắc sâu kiến thức, rèn luyện kỹ năng giải quyết bài tập và đánh giá mức độ đạt yêu cầu cần đạt.',
      content: 'Học sinh giải quyết hệ thống câu hỏi trắc nghiệm, bài tập tình huống hoặc tham gia trò chơi củng cố.',
      product: 'Đáp án bài tập luyện tập của học sinh; bảng điểm xếp hạng trò chơi củng cố kiến thức.',
      step1: 'Giáo viên giao bộ câu hỏi luyện tập (trắc nghiệm 4 lựa chọn, đúng/sai hoặc bài tập tính toán).',
      step2: 'Học sinh vận dụng kiến thức vừa học để độc lập suy nghĩ hoặc thảo luận cặp đôi hoàn thành bài tập.',
      step3: 'Giáo viên tổ chức sửa bài: gọi học sinh giải thích phương án chọn hoặc phân tích các phương án nhiễu.',
      step4: 'Giáo viên chốt đáp án đúng, phân tích lỗi sai thường gặp và tổng kết điểm thi đua của học sinh.'
    },
    act4: {
      name: 'HOẠT ĐỘNG 4: VẬN DỤNG & MỞ RỘNG',
      goal: 'Vận dụng kiến thức vào giải quyết vấn đề thực tiễn sản xuất nông nghiệp tại gia đình, địa phương và phát triển tư duy sáng tạo.',
      content: 'Học sinh thực hiện nhiệm vụ tìm hiểu mô hình thực tế, áp dụng biện pháp kỹ thuật tại vườn nhà hoặc sử dụng AI để mở rộng hiểu biết.',
      product: 'Bản báo cáo ngắn, video hoặc hình ảnh ghi lại hoạt động vận dụng thực tế tại gia đình/địa phương.',
      step1: 'Giáo viên giao nhiệm vụ vận dụng thực tế gắn với nông nghiệp địa phương Đồng Nai / Nam Bộ.',
      step2: 'Học sinh thực hiện nhiệm vụ ở nhà: khảo sát thực tế, phỏng vấn người trồng trọt/chăn nuôi hoặc dùng trợ lý AI tra cứu.',
      step3: 'Học sinh nộp sản phẩm lên Padlet lớp học hoặc chia sẻ ngắn vào đầu tiết học tiếp theo.',
      step4: 'Giáo viên đánh giá, nhận xét sản phẩm vận dụng và cộng điểm khuyến khích cho học sinh sáng tạo.'
    }
  },

  // Mẫu giáo án tùy chỉnh thêm bởi người dùng
  customTemplates: [],

  // Link Drive cá nhân do người dùng nhập (lưu trong localStorage)
  customDriveLinks: {},
  gradeFolderLinks: {
    cn10: "https://drive.google.com/drive/folders/1CN10-TrongTrot-KNTT-THPTLocNinh",
    cn11: "https://drive.google.com/drive/folders/1CN11-ChanNuoi-KNTT-THPTLocNinh",
    cn12: "https://drive.google.com/drive/folders/1CN12-LamThuySan-KNTT-THPTLocNinh"
  }
};

// Khởi chạy khi load trang
function init5512Module() {
  load5512SavedData();
  const urlParams = new URLSearchParams(window.location.search);
  const subParam = urlParams.get('sub') || urlParams.get('tieumuc');
  if (subParam && (subParam === '1' || subParam === '2' || subParam === '3')) {
    state5512.currentSubTab = parseInt(subParam);
  }
  render5512MainContainer();
}

// Load data từ LocalStorage
function load5512SavedData() {
  try {
    const savedLinks = localStorage.getItem("cnnn_5512_custom_links");
    if (savedLinks) state5512.customDriveLinks = JSON.parse(savedLinks);

    const savedFolders = localStorage.getItem("cnnn_5512_grade_folders");
    if (savedFolders) state5512.gradeFolderLinks = Object.assign(state5512.gradeFolderLinks, JSON.parse(savedFolders));

    const savedMeta = localStorage.getItem("cnnn_5512_meta_config");
    if (savedMeta) {
      const parsed = JSON.parse(savedMeta);
      if (parsed.headName === "Trần Thị Xuân") parsed.headName = "Phạm Thanh Xuân";
      if (parsed.teacherName === "Trần Thị Thúy") parsed.teacherName = "Võ Thị Thanh Thuý";
      state5512.metaConfig = Object.assign(state5512.metaConfig, parsed);
    }

    const savedInteg = localStorage.getItem("cnnn_5512_integrations");
    if (savedInteg) state5512.integrations = Object.assign(state5512.integrations, JSON.parse(savedInteg));

    const savedTemplates = localStorage.getItem("cnnn_5512_custom_templates");
    if (savedTemplates) state5512.customTemplates = JSON.parse(savedTemplates);
  } catch (e) {
    console.error("Error loading 5512 saved data", e);
  }
}

// Lưu dữ liệu vào LocalStorage
function save5512Data() {
  try {
    localStorage.setItem("cnnn_5512_custom_links", JSON.stringify(state5512.customDriveLinks));
    localStorage.setItem("cnnn_5512_grade_folders", JSON.stringify(state5512.gradeFolderLinks));
    localStorage.setItem("cnnn_5512_meta_config", JSON.stringify(state5512.metaConfig));
    localStorage.setItem("cnnn_5512_integrations", JSON.stringify(state5512.integrations));
    localStorage.setItem("cnnn_5512_custom_templates", JSON.stringify(state5512.customTemplates));
  } catch (e) {
    console.error("Error saving 5512 data", e);
  }
}

// ============================================================================
// CÁC HÀM XỬ LÝ CHỌN GIÁO VIÊN & TỔ TRƯỞNG CHUYÊN MÔN
// ============================================================================

// Sinh HTML các thẻ <option> cho danh sách Giáo viên
function getTeacherSelectOptionsHtml() {
  const cur = state5512.metaConfig.teacherName || "Võ Thị Thanh Thuý";
  const standard = ["Võ Thị Thanh Thuý", "Trương Khắc Nam"];
  const isCustom = !standard.includes(cur);

  let html = '';
  html += `<option value="Võ Thị Thanh Thuý" ${cur === 'Võ Thị Thanh Thuý' ? 'selected' : ''}>Võ Thị Thanh Thuý</option>`;
  html += `<option value="Trương Khắc Nam" ${cur === 'Trương Khắc Nam' ? 'selected' : ''}>Trương Khắc Nam</option>`;
  if (isCustom) {
    html += `<option value="${escapeHtml(cur)}" selected>👤 ${escapeHtml(cur)} (Tự điền)</option>`;
  }
  html += `<option value="custom">✏️ Tự điền tên khác...</option>`;
  return html;
}

// Sinh HTML các thẻ <option> cho danh sách Tổ trưởng
function getHeadSelectOptionsHtml() {
  const cur = state5512.metaConfig.headName || "Phạm Thanh Xuân";
  const standard = ["Phạm Thanh Xuân"];
  const isCustom = !standard.includes(cur);

  let html = '';
  html += `<option value="Phạm Thanh Xuân" ${cur === 'Phạm Thanh Xuân' ? 'selected' : ''}>Phạm Thanh Xuân (Tổ trưởng)</option>`;
  if (isCustom) {
    html += `<option value="${escapeHtml(cur)}" selected>⭐ ${escapeHtml(cur)} (Tự điền)</option>`;
  }
  html += `<option value="custom">✏️ Tự điền tên khác...</option>`;
  return html;
}

// Khi người dùng đổi Giáo viên ở Dropdown
function onTeacherSelectChange(val) {
  if (val === "custom") {
    const customName = prompt("Nhập họ và tên giáo viên giảng dạy:", state5512.metaConfig.teacherName || "");
    if (customName && customName.trim()) {
      state5512.metaConfig.teacherName = customName.trim();
    } else {
      render5512CurrentView();
      return;
    }
  } else {
    state5512.metaConfig.teacherName = val;
  }
  save5512Data();
  render5512CurrentView();
  show5512Toast("Đã cập nhật Giáo viên: " + state5512.metaConfig.teacherName);
}

// Khi người dùng đổi Tổ trưởng ở Dropdown
function onHeadSelectChange(val) {
  if (val === "custom") {
    const customName = prompt("Nhập họ và tên Tổ trưởng chuyên môn:", state5512.metaConfig.headName || "");
    if (customName && customName.trim()) {
      state5512.metaConfig.headName = customName.trim();
    } else {
      render5512CurrentView();
      return;
    }
  } else {
    state5512.metaConfig.headName = val;
  }
  save5512Data();
  render5512CurrentView();
  show5512Toast("Đã cập nhật Tổ trưởng: " + state5512.metaConfig.headName);
}

// Re-render màn hình hiện tại để đồng bộ toàn diện
function render5512CurrentView() {
  if (state5512.currentSubTab === 1) {
    render5512SubModule1();
  } else if (state5512.currentSubTab === 2) {
    render5512SubModule2();
  } else if (state5512.currentSubTab === 3) {
    render5512SubModule3();
  }
}

// Hiển thị thông báo Toast nổi
function show5512Toast(msg) {
  const existing = document.getElementById("toast5512Notice");
  if (existing) existing.remove();
  const banner = document.createElement("div");
  banner.id = "toast5512Notice";
  banner.style.cssText = "position:fixed; bottom:24px; right:24px; background:#1e293b; color:#fff; padding:12px 18px; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.25); z-index:99999; font-size:13.5px; display:flex; align-items:center; gap:8px; border-left:4px solid #22c55e;";
  banner.innerHTML = "<span>✅</span> <span>" + escapeHtml(msg) + "</span>";
  document.body.appendChild(banner);
  setTimeout(() => { if (banner.parentNode) banner.remove(); }, 3200);
}

// Render Khung chính của Module 2 (Phần 2)
function render5512MainContainer() {
  const container = document.getElementById("moduleView2");
  if (!container) return;

  container.innerHTML = `
    <!-- THANH CHUYỂN 3 TIỂU MỤC CỦA PHẦN 2 -->
    <div class="sub-nav-bar">
      <button class="sub-nav-btn ${state5512.currentSubTab === 1 ? 'active' : ''}" onclick="switchMod2SubTab(1)">
        <span style="font-size:16px;">📑</span>
        <span>Hồ sơ</span>
      </button>
      <button class="sub-nav-btn ${state5512.currentSubTab === 2 ? 'active' : ''}" onclick="switchMod2SubTab(2)">
        <span style="font-size:16px;">📝</span>
        <span>Giáo án</span>
      </button>
      <button class="sub-nav-btn ${state5512.currentSubTab === 3 ? 'active' : ''}" onclick="switchMod2SubTab(3)">
        <span style="font-size:16px;">🖥️</span>
        <span>Bài giảng</span>
      </button>
    </div>

    <!-- KHU VỰC NỘI DUNG 3 TIỂU MỤC -->
    <div id="subTabContentArea"></div>

    <!-- MODAL TÙY BIẾN NĂNG LỰC & THÔNG TIN TRƯỜNG -->
    <div id="modal5512Backdrop" class="modal-backdrop" style="display:none;"></div>
  `;

  renderCurrentSubTab();
}

// Chuyển tiểu mục
function switchMod2SubTab(tabNum) {
  state5512.currentSubTab = tabNum;
  document.querySelectorAll(".sub-nav-btn").forEach((btn, idx) => {
    btn.className = `sub-nav-btn ${idx + 1 === tabNum ? 'active' : ''}`;
  });
  renderCurrentSubTab();
  window.scrollTo({ top: 120, behavior: "smooth" });
}

function renderCurrentSubTab() {
  if (state5512.currentSubTab === 1) render5512SubModule1();
  else if (state5512.currentSubTab === 2) render5512SubModule2();
  else if (state5512.currentSubTab === 3) render5512SubModule3();
}

// ============================================================================
// TIỂU MỤC 2.1: HỒ SƠ 3 PHỤ LỤC CV 5512 NỘP TỔ TRƯỞNG & ĐỒNG BỘ NĂNG LỰC
// ============================================================================

function render5512SubModule1() {
  const container = document.getElementById("subTabContentArea");
  if (!container || typeof DATA_5512 === "undefined") return;

  const g = state5512.currentGrade;
  const pl = state5512.currentPl;

  container.innerHTML = `
    <!-- KHUNG ĐIỀU KHIỂN ĐỒNG BỘ 3 PHỤ LỤC (TOOLBAR 3 HÀNG GỌN GÀNG) -->
    <div class="card" style="margin-bottom:14px; padding:10px 16px; border:1px solid var(--border); box-shadow:0 1px 4px rgba(0,0,0,0.04);">
      
      <!-- HÀNG 1: THÔNG TIN & XUẤT FILE -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; padding-bottom:8px; border-bottom:1px solid #f1f5f9;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-size:13px; color:var(--text);">
          <span style="white-space:nowrap;">Năm học: <strong>${escapeHtml(state5512.metaConfig.schoolYear)}</strong></span>
          <span style="color:#cbd5e1;">|</span>
          
          <!-- Dropdown chọn Giáo viên -->
          <span style="display:inline-flex; align-items:center; gap:4px; background:#fff; padding:2px 8px; border-radius:6px; border:1px solid #cbd5e1; white-space:nowrap;">
            <span style="font-weight:700; color:var(--primary-dark); white-space:nowrap;">👤 GV:</span>
            <select id="selTeacherBanner" onchange="onTeacherSelectChange(this.value)" style="border:none; background:transparent; font-weight:700; color:#0f766e; outline:none; cursor:pointer; font-size:13px; white-space:nowrap;">
              ${getTeacherSelectOptionsHtml()}
            </select>
          </span>

          <!-- Dropdown chọn Tổ trưởng -->
          <span style="display:inline-flex; align-items:center; gap:4px; background:#fff; padding:2px 8px; border-radius:6px; border:1px solid #cbd5e1; white-space:nowrap;">
            <span style="font-weight:700; color:var(--primary-dark); white-space:nowrap;">⭐ TTCM:</span>
            <select id="selHeadBanner" onchange="onHeadSelectChange(this.value)" style="border:none; background:transparent; font-weight:700; color:#b45309; outline:none; cursor:pointer; font-size:13px; white-space:nowrap;">
              ${getHeadSelectOptionsHtml()}
            </select>
          </span>

          <span class="badge" style="background:#22c55e; color:#fff; font-size:11px; padding:3px 8px; border-radius:12px; font-weight:700; white-space:nowrap;">✓ Đã đồng bộ 3 PL</span>
        </div>

        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button class="btn btn-outline btn-sm" style="padding:4px 9px; font-size:12.5px; white-space:nowrap;" onclick="openIntegrationsModal()">
            ⚙️ Cấu hình nộp
          </button>
          <button class="btn btn-primary btn-sm" style="padding:4px 9px; font-size:12.5px; white-space:nowrap;" onclick="sync3PhuLuc()">
            ⚡ Đồng bộ 3 PL
          </button>
          <button class="btn btn-outline btn-sm" style="padding:4px 9px; font-size:12.5px; white-space:nowrap;" onclick="exportPhuLucWord(${pl})">
            📄 Xuất PL${pl} (.doc)
          </button>
          <button class="btn btn-accent btn-sm" style="padding:4px 9px; font-size:12.5px; font-weight:700; white-space:nowrap;" onclick="exportFull3PhuLucWord()">
            📦 Xuất Trọn Bộ 3 PL (.doc)
          </button>
        </div>
      </div>

      <!-- HÀNG 2: CHỌN KHỐI & TÌM KIẾM -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; padding:8px 0; border-bottom:1px solid #f1f5f9;">
        <!-- Chọn Khối -->
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span style="font-weight:700; color:var(--primary-dark); font-size:13px; white-space:nowrap;">📚 Chọn Khối:</span>
          <button class="btn btn-sm ${g === 'cn10' ? 'btn-primary' : 'btn-outline'}" style="padding:3px 10px; font-size:12.5px; white-space:nowrap;" onclick="select5512Grade('cn10')">Khối 10 (Trồng trọt)</button>
          <button class="btn btn-sm ${g === 'cn11' ? 'btn-primary' : 'btn-outline'}" style="padding:3px 10px; font-size:12.5px; white-space:nowrap;" onclick="select5512Grade('cn11')">Khối 11 (Chăn nuôi)</button>
          <button class="btn btn-sm ${g === 'cn12' ? 'btn-primary' : 'btn-outline'}" style="padding:3px 10px; font-size:12.5px; white-space:nowrap;" onclick="select5512Grade('cn12')">Khối 12 (Lâm - Thủy sản)</button>
        </div>

        <!-- Tìm kiếm & Lọc học kì -->
        <div style="display:flex; align-items:center; gap:6px;">
          <select style="padding:4px 8px; border-radius:6px; border:1px solid var(--border); font-size:12.5px;" onchange="state5512.termFilter=this.value; render5512PlTable();">
            <option value="all">Cả năm</option>
            <option value="hk1">Học kì I</option>
            <option value="hk2">Học kì II</option>
          </select>
          <input type="text" placeholder="🔍 Tìm kiếm bài học..." style="padding:4px 10px; border-radius:6px; border:1px solid var(--border); font-size:12.5px; width:180px;" oninput="state5512.searchQuery=this.value; render5512PlTable();" />
        </div>
      </div>

      <!-- HÀNG 3: CHUYỂN ĐỔI 3 PHỤ LỤC -->
      <div style="display:flex; gap:6px; padding-top:8px; flex-wrap:wrap;">
        <button class="btn btn-sm ${pl === 1 ? 'btn-primary' : 'btn-outline'}" style="font-weight:700; font-size:12.5px; padding:4px 12px; white-space:nowrap;" onclick="select5512Pl(1)">
          📋 Phụ lục 1: Kế hoạch Tổ chuyên môn
        </button>
        <button class="btn btn-sm ${pl === 2 ? 'btn-primary' : 'btn-outline'}" style="font-weight:700; font-size:12.5px; padding:4px 12px; white-space:nowrap;" onclick="select5512Pl(2)">
          🎯 Phụ lục 2: Hoạt động giáo dục
        </button>
        <button class="btn btn-sm ${pl === 3 ? 'btn-primary' : 'btn-outline'}" style="font-weight:700; font-size:12.5px; padding:4px 12px; white-space:nowrap;" onclick="select5512Pl(3)">
          👤 Phụ lục 3: Kế hoạch cá nhân GV
        </button>
      </div>

    </div>

    <!-- KHU VỰC HIỂN THỊ NỘI DUNG BẢNG PHỤ LỤC ĐANG CHỌN -->
    <div id="plTableDisplayArea"></div>
  `;

  render5512PlTable();
}


function select5512Grade(grade) {
  state5512.currentGrade = grade;
  render5512SubModule1();
}

function select5512Pl(plNum) {
  state5512.currentPl = plNum;
  render5512SubModule1();
}

// Render chi tiết bảng phụ lục theo PL1, PL2, PL3
function render5512PlTable() {
  const container = document.getElementById("plTableDisplayArea");
  if (!container || typeof DATA_5512 === "undefined") return;

  const g = state5512.currentGrade;
  const pl = state5512.currentPl;

  if (pl === 1) renderPl1Table(container, g);
  else if (pl === 2) renderPl2Table(container, g);
  else if (pl === 3) renderPl3Table(container, g);
}

// Bảng Phụ lục 1: Kế hoạch dạy học của Tổ chuyên môn
function renderPl1Table(container, g) {
  const curriculum = (DATA_5512.curriculum && DATA_5512.curriculum[g]) || [];
  const equipment = (DATA_5512.equipment && DATA_5512.equipment[g]) || [];
  const rooms = (DATA_5512.rooms && DATA_5512.rooms[g]) || [];

  // Lọc theo search & term
  const q = state5512.searchQuery.toLowerCase().trim();
  const term = state5512.termFilter;
  const filtered = curriculum.filter(item => {
    const matchTerm = term === 'all' || (term === 'hk1' && item.term === 'Học kì I') || (term === 'hk2' && item.term === 'Học kì II');
    const matchQ = !q || item.title.toLowerCase().includes(q) || (item.yccd || '').toLowerCase().includes(q) || (item.chapter || '').toLowerCase().includes(q);
    return matchTerm && matchQ;
  });

  const gradeName = g === "cn10" ? "10 (Công nghệ Trồng trọt)" : g === "cn11" ? "11 (Công nghệ Chăn nuôi)" : "12 (Công nghệ Lâm nghiệp - Thủy sản)";

  container.innerHTML = `
    <div class="card">
      <div style="text-align:center; margin-bottom:20px; border-bottom:2px solid var(--primary); padding-bottom:12px;">
        <h2 style="color:var(--primary-dark); font-size:18px; margin-bottom:4px; text-transform:uppercase;">
          PHỤ LỤC I: KHUNG KẾ HOẠCH DẠY HỌC MÔN HỌC CỦA TỔ CHUYÊN MÔN
        </h2>
        <div style="font-size:13px; color:var(--text-muted); font-style:italic;">
          (Kèm theo Công văn số 5512/BGDĐT-GDTrH ngày 18 tháng 12 năm 2020 của Bộ GD&ĐT)
        </div>
        <div style="font-weight:700; color:var(--text); font-size:15px; margin-top:8px;">
          MÔN CÔNG NGHỆ, KHỐI LỚP ${gradeName} • BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
        </div>
        <div style="font-size:13px; color:var(--text-muted);">
          Năm học ${escapeHtml(state5512.metaConfig.schoolYear)} • ${escapeHtml(state5512.metaConfig.school)}
        </div>
      </div>

      <!-- I. ĐẶC ĐIỂM TÌNH HÌNH -->
      <h3 style="color:var(--primary-dark); margin:16px 0 8px 0; font-size:15px;">I. Đặc điểm tình hình</h3>
      <div style="background:#f8fafc; padding:12px 16px; border-radius:8px; border:1px solid var(--border); font-size:13.5px; margin-bottom:14px; line-height:1.7;">
        <div>1. Số lớp: <strong>04 lớp</strong>; Số học sinh: <strong>172 học sinh</strong>.</div>
        <div>2. Tình hình đội ngũ: Số giáo viên bộ môn: <strong>02 giáo viên</strong> (100% đạt chuẩn Đại học trở lên, đã hoàn thành bồi dưỡng CT GDPT 2018 và Khung Năng lực số - AI).</div>
        <div>3. Thiết bị dạy học và Phòng học bộ môn: Đáp ứng 100% bài thực hành và bài dạy có ứng dụng công nghệ thông tin.</div>
      </div>

      <!-- DANH MỤC THIẾT BỊ DẠY HỌC -->
      <h4 style="font-size:14px; color:var(--primary); margin-bottom:6px;">Danh mục Thiết bị dạy học (Trích hồ sơ tổ):</h4>
      <div style="overflow-x:auto; margin-bottom:16px;">
        <table class="table" style="width:100%; font-size:13px;">
          <thead>
            <tr style="background:#f1f5f9; color:var(--primary-dark);">
              <th style="width:50px; text-align:center;">STT</th>
              <th>Thiết bị dạy học / Học liệu số</th>
              <th style="width:90px; text-align:center;">Số lượng</th>
              <th>Sử dụng cho các bài thí nghiệm / thực hành</th>
              <th style="width:130px;">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            ${equipment.map(e => `
              <tr>
                <td style="text-align:center; font-weight:700;">${e.stt}</td>
                <td style="font-weight:600;">${escapeHtml(e.name)}</td>
                <td style="text-align:center;">${escapeHtml(e.qty)}</td>
                <td>${escapeHtml(e.useFor)}</td>
                <td style="color:var(--text-muted); font-size:12px;">${escapeHtml(e.note)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <!-- II. KẾ HOẠCH DẠY HỌC (PHÂN PHỐI CHƯƠNG TRÌNH) -->
      <h3 style="color:var(--primary-dark); margin:20px 0 8px 0; font-size:15px;">II. Kế hoạch dạy học (Phân phối chương trình & Tích hợp Năng lực)</h3>
      <div style="font-size:12.5px; color:var(--text-muted); margin-bottom:10px;">
        💡 Bảng đã tích hợp đồng bộ: <strong>YCCĐ chuẩn CT 2018</strong>, <strong>Khung Năng lực số (NLS)</strong> và <strong>Giáo dục Trí tuệ nhân tạo (AI) theo QĐ 2422/QĐ-BGDĐT</strong>.
      </div>

      <div style="overflow-x:auto;">
        <table class="table" style="width:100%; font-size:13px; line-height:1.5;">
          <thead>
            <tr style="background:#15803d; color:#fff;">
              <th style="width:45px; text-align:center;">STT</th>
              <th style="min-width:210px;">Bài học / Nội dung dạy học</th>
              <th style="width:60px; text-align:center;">Số tiết</th>
              <th style="min-width:240px;">Yêu cầu cần đạt (YCCĐ CT 2018)</th>
              ${state5512.integrations.nls ? '<th style="min-width:190px;">Năng lực số phát triển (NLS)</th>' : ''}
              ${state5512.integrations.ai ? '<th style="min-width:210px;">Giáo dục AI (Khung QĐ 2422)</th>' : ''}
              <th style="min-width:150px;">Thiết bị & Học liệu</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(item => {
              const isExam = item.isExam;
              const bgRow = isExam ? "background:#fef3c7;" : item.isSteam ? "background:#f0fdf4;" : "";
              return `
                <tr style="${bgRow}">
                  <td style="text-align:center; font-weight:700;">${item.stt}</td>
                  <td>
                    <div style="font-weight:700; color:var(--primary-dark);">${escapeHtml(item.title)}</div>
                    <div style="font-size:12.5px; color:#64748b; margin-top:2px;">${escapeHtml(item.chapter || '')}</div>
                    ${item.isSteam ? '<span class="badge" style="background:#16a34a; color:#fff; font-size:11.5px; font-weight:700;">Tích hợp STEAM</span>' : ''}
                    ${isExam ? '<span class="badge" style="background:#d97706; color:#fff; font-size:11.5px; font-weight:700;">Kiểm tra / Đánh giá</span>' : ''}
                  </td>
                  <td style="text-align:center; font-weight:700;">${item.periods}</td>
                  <td style="white-space:pre-line;">${escapeHtml(item.yccd || '–')}</td>
                  ${state5512.integrations.nls ? `<td style="color:#0f766e; font-size:12px;">${escapeHtml(item.nls || '–')}</td>` : ''}
                  ${state5512.integrations.ai ? `<td style="color:#4338ca; font-size:12px;">${escapeHtml(item.ai || '–')}</td>` : ''}
                  <td style="font-size:13px; color:#475569; line-height:1.55;">${escapeHtml(item.equipment || 'Laptop, Tivi, SGK')}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Bảng Phụ lục 2: Kế hoạch các hoạt động giáo dục (STEAM / Chuyên đề / Ngoại khóa / HSG)
function renderPl2Table(container, g) {
  const steams = DATA_5512.steamProjects || [];
  const cdList = DATA_5512.curriculum.cn12_cd || [];

  container.innerHTML = `
    <div class="card">
      <div style="text-align:center; margin-bottom:20px; border-bottom:2px solid var(--secondary); padding-bottom:12px;">
        <h2 style="color:var(--secondary); font-size:18px; margin-bottom:4px; text-transform:uppercase;">
          PHỤ LỤC II: KẾ HOẠCH TỔ CHỨC CÁC HOẠT ĐỘNG GIÁO DỤC CỦA TỔ CHUYÊN MÔN
        </h2>
        <div style="font-size:13px; color:var(--text-muted); font-style:italic;">
          (Kèm theo Công văn số 5512/BGDĐT-GDTrH ngày 18 tháng 12 năm 2020 của Bộ GD&ĐT)
        </div>
        <div style="font-weight:700; color:var(--text); font-size:15px; margin-top:8px;">
          TÍCH HỢP CHUYÊN ĐỀ LỰA CHỌN, CÁC DỰ ÁN STEAM NÔNG NGHIỆP & BỒI DƯỠNG HỌC SINH GIỎI
        </div>
      </div>

      <!-- 1. KẾ HOẠCH DỰ ÁN STEAM NÔNG NGHIỆP ĐÃ TÍCH HỢP -->
      <h3 style="color:var(--primary-dark); margin:16px 0 8px 0; font-size:15px;">
        1. Kế hoạch Dạy học Dự án STEAM Nông nghiệp Tích hợp (Chuẩn S - T - E - A - M)
      </h3>
      <div style="font-size:12.5px; color:var(--text-muted); margin-bottom:10px;">
        Gắn liền với các bài học thực hành trọng tâm của cả 3 khối, khuyến khích học sinh ứng dụng công nghệ số và giải quyết vấn đề nông nghiệp địa phương.
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(420px, 1fr)); gap:14px; margin-bottom:24px;">
        ${steams.map(s => `
          <div style="background:#f8fafc; border:1.5px solid var(--border); border-radius:10px; padding:14px 16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="badge" style="background:#15803d; color:#fff; font-size:11px; font-weight:700;">${escapeHtml(s.grade)}</span>
              <span style="font-size:13px; color:#475569; line-height:1.55; font-weight:600;">${escapeHtml(s.week)}</span>
            </div>
            <h4 style="color:var(--primary-dark); font-size:14.5px; margin-bottom:6px;">${escapeHtml(s.lesson)}</h4>
            <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:6px; padding:8px 12px; margin-bottom:10px; font-size:13px; color:#065f46;">
              🎯 <strong>Sản phẩm STEAM:</strong> ${escapeHtml(s.product)}
            </div>
            <div style="font-size:12.5px; line-height:1.6; display:flex; flex-direction:column; gap:4px;">
              <div><strong style="color:#2563eb;">S (Science):</strong> ${escapeHtml(s.s)}</div>
              <div><strong style="color:#0891b2;">T (Technology):</strong> ${escapeHtml(s.t)}</div>
              <div><strong style="color:#d97706;">E (Engineering):</strong> ${escapeHtml(s.e)}</div>
              <div><strong style="color:#db2777;">A (Art):</strong> ${escapeHtml(s.a)}</div>
              <div><strong style="color:#7c3aed;">M (Math):</strong> ${escapeHtml(s.m)}</div>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- 2. KẾ HOẠCH CHUYÊN ĐỀ LỰA CHỌN (KHỐI 12: 35 TIẾT) -->
      <h3 style="color:var(--primary-dark); margin:20px 0 8px 0; font-size:15px;">
        2. Kế hoạch Chuyên đề học tập lựa chọn (Khối 12: Chuyên đề Lâm nghiệp - Thủy sản, 35 tiết)
      </h3>
      <div style="overflow-x:auto; margin-bottom:24px;">
        <table class="table" style="width:100%; font-size:13px;">
          <thead>
            <tr style="background:#0f766e; color:#fff;">
              <th style="width:45px; text-align:center;">STT</th>
              <th style="min-width:200px;">Tên Chuyên đề / Bài học</th>
              <th style="width:60px; text-align:center;">Số tiết</th>
              <th style="width:90px; text-align:center;">Thời điểm</th>
              <th>Yêu cầu cần đạt</th>
              <th>Năng lực số (NLS)</th>
              <th>Giáo dục AI (QĐ 2422)</th>
            </tr>
          </thead>
          <tbody>
            ${cdList.map(c => `
              <tr>
                <td style="text-align:center; font-weight:700;">${c.stt}</td>
                <td style="font-weight:700; color:var(--primary-dark);">${escapeHtml(c.title)}</td>
                <td style="text-align:center; font-weight:700;">${c.periods}</td>
                <td style="text-align:center; font-size:13px; color:#475569; line-height:1.55;">${escapeHtml(c.week)}</td>
                <td style="font-size:12.5px;">${escapeHtml(c.yccd)}</td>
                <td style="font-size:13px; color:#0f766e; line-height:1.55;">${escapeHtml(c.nls)}</td>
                <td style="font-size:13px; color:#4338ca; line-height:1.55;">${escapeHtml(c.ai)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <!-- 3. KẾ HOẠCH BỒI DƯỠNG HỌC SINH GIỎI & HOẠT ĐỘNG TRẢI NGHIỆM -->
      <h3 style="color:var(--primary-dark); margin:20px 0 8px 0; font-size:15px;">
        3. Kế hoạch Hoạt động Trải nghiệm Ngoại khóa & Bồi dưỡng Học sinh Giỏi
      </h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:14px;">
        <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:14px;">
          <h4 style="color:#b45309; font-size:14px; margin-bottom:8px;">🏆 Kế hoạch Bồi dưỡng Học sinh giỏi (HSG) Cấp Tỉnh</h4>
          <ul style="font-size:13px; line-height:1.7; padding-left:18px; color:#92400e;">
            <li><strong>Thời gian:</strong> Chiều thứ Năm & thứ Bảy hàng tuần (Tháng 9/2026 - Tháng 3/2027).</li>
            <li><strong>Nội dung:</strong> Chuyên đề nâng cao Sinh thái học cây trồng, Kỹ thuật chăn nuôi VietGAP, Công nghệ gen và Thủy sản tuần hoàn RAS.</li>
            <li><strong>Chỉ tiêu:</strong> Ít nhất 02 học sinh đạt giải Ba học sinh giỏi cấp tỉnh.</li>
          </ul>
        </div>
        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:14px;">
          <h4 style="color:#1d4ed8; font-size:14px; margin-bottom:8px;">🌾 Hoạt động Trải nghiệm & Tham quan Hướng nghiệp CNC</h4>
          <ul style="font-size:13px; line-height:1.7; padding-left:18px; color:#1e40af;">
            <li><strong>Thời gian:</strong> Tháng 12/2026 (Học kì I) và Tháng 4/2027 (Học kì II).</li>
            <li><strong>Địa điểm:</strong> Trang trại Trồng dưa lưới công nghệ cao & Trại nuôi tôm thẻ chân trắng siêu thâm canh tại địa phương.</li>
            <li><strong>Hình thức:</strong> Học sinh trải nghiệm vận hành hệ thống tưới nhỏ giọt tự động, đo pH đất/nước thực tế và viết báo cáo thu hoạch nhóm.</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

// Bảng Phụ lục 3: Kế hoạch giáo dục của giáo viên
function renderPl3Table(container, g) {
  const curriculum = (DATA_5512.curriculum && DATA_5512.curriculum[g]) || [];
  const duties = DATA_5512.teacherDuties || {};

  const q = state5512.searchQuery.toLowerCase().trim();
  const term = state5512.termFilter;
  const filtered = curriculum.filter(item => {
    const matchTerm = term === 'all' || (term === 'hk1' && item.term === 'Học kì I') || (term === 'hk2' && item.term === 'Học kì II');
    const matchQ = !q || item.title.toLowerCase().includes(q) || (item.week || '').toLowerCase().includes(q);
    return matchTerm && matchQ;
  });

  const gradeName = g === "cn10" ? "Lớp 10 (Trồng trọt)" : g === "cn11" ? "Lớp 11 (Chăn nuôi)" : "Lớp 12 (Lâm - Thủy sản)";

  container.innerHTML = `
    <div class="card">
      <div style="text-align:center; margin-bottom:20px; border-bottom:2px solid var(--primary-dark); padding-bottom:12px;">
        <h2 style="color:var(--primary-dark); font-size:18px; margin-bottom:4px; text-transform:uppercase;">
          PHỤ LỤC III: KẾ HOẠCH GIÁO DỤC CỦA GIÁO VIÊN
        </h2>
        <div style="font-size:13px; color:var(--text-muted); font-style:italic;">
          (Kèm theo Công văn số 5512/BGDĐT-GDTrH ngày 18 tháng 12 năm 2020 của Bộ GD&ĐT)
        </div>
        <div style="font-weight:700; color:var(--text); font-size:15px; margin-top:8px;">
          GIÁO VIÊN: ${escapeHtml(state5512.metaConfig.teacherName).toUpperCase()} • ${escapeHtml(state5512.metaConfig.department)}
        </div>
        <div style="font-size:13px; color:var(--text-muted);">
          Năm học ${escapeHtml(state5512.metaConfig.schoolYear)} • ${escapeHtml(state5512.metaConfig.school)}
        </div>
      </div>

      <!-- I. KẾ HOẠCH DẠY HỌC CÁ NHÂN -->
      <h3 style="color:var(--primary-dark); margin:16px 0 8px 0; font-size:15px;">
        I. Kế hoạch dạy học theo Tuần và Tiết phân phối (${gradeName})
      </h3>
      <div style="font-size:12.5px; color:var(--text-muted); margin-bottom:10px;">
        ✅ Đã đồng bộ hoàn toàn với Phụ lục I của Tổ chuyên môn về số tiết, tiến độ tuần, thiết bị và yêu cầu năng lực.
      </div>

      <div style="overflow-x:auto; margin-bottom:24px;">
        <table class="table" style="width:100%; font-size:13px; line-height:1.5;">
          <thead>
            <tr style="background:#166534; color:#fff;">
              <th style="width:45px; text-align:center;">STT</th>
              <th style="min-width:200px;">Bài học / Nội dung</th>
              <th style="width:55px; text-align:center;">Số tiết</th>
              <th style="width:110px; text-align:center;">Thời điểm (Tuần/Tiết)</th>
              <th style="min-width:180px;">Thiết bị dạy học</th>
              <th style="width:100px; text-align:center;">Địa điểm dạy</th>
              ${state5512.integrations.nls ? '<th style="min-width:170px;">Năng lực số phát triển</th>' : ''}
              ${state5512.integrations.ai ? '<th style="min-width:180px;">YCCĐ Giáo dục AI (QĐ 2422)</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${filtered.map(item => `
              <tr style="${item.isExam ? 'background:#fef3c7;' : ''}">
                <td style="text-align:center; font-weight:700;">${item.stt}</td>
                <td>
                  <strong style="color:var(--primary-dark);">${escapeHtml(item.title)}</strong>
                  <div style="font-size:11px; color:var(--text-muted);">${escapeHtml(item.chapter || '')}</div>
                </td>
                <td style="text-align:center; font-weight:700;">${item.periods}</td>
                <td style="text-align:center; font-weight:600; color:var(--primary); font-size:12.5px;">${escapeHtml(item.week || '–')}</td>
                <td style="font-size:12px;">${escapeHtml(item.equipment || '–')}</td>
                <td style="text-align:center; font-size:12px;">${escapeHtml(item.room || 'Lớp học')}</td>
                ${state5512.integrations.nls ? `<td style="font-size:13px; color:#0f766e; line-height:1.55;">${escapeHtml(item.nls || '–')}</td>` : ''}
                ${state5512.integrations.ai ? `<td style="font-size:13px; color:#4338ca; line-height:1.55;">${escapeHtml(item.ai || '–')}</td>` : ''}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <!-- II. KẾ HOẠCH CÁC NHIỆM VỤ KHÁC -->
      <h3 style="color:var(--primary-dark); margin:20px 0 8px 0; font-size:15px;">
        II. Kế hoạch các nhiệm vụ giáo dục khác trong năm học
      </h3>
      <div style="overflow-x:auto;">
        <table class="table" style="width:100%; font-size:13px;">
          <thead>
            <tr style="background:#f1f5f9; color:var(--primary-dark);">
              <th style="width:50px; text-align:center;">STT</th>
              <th style="min-width:220px;">Nhiệm vụ được phân công</th>
              <th style="width:180px;">Thời gian thực hiện</th>
              <th>Yêu cầu / Kết quả dự kiến đạt được</th>
              <th style="width:140px;">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            ${(duties.otherTasks || []).map(t => `
              <tr>
                <td style="text-align:center; font-weight:700;">${t.stt}</td>
                <td style="font-weight:600; color:var(--primary-dark);">${escapeHtml(t.task)}</td>
                <td style="font-size:12.5px; color:var(--text-muted);">${escapeHtml(t.time)}</td>
                <td style="font-size:12.5px;">${escapeHtml(t.expected)}</td>
                <td style="font-size:13px; color:#475569; line-height:1.55;">${escapeHtml(t.note)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Đồng bộ 3 Phụ lục
function sync3PhuLuc() {
  save5512Data();
  render5512PlTable();

  // Hiển thị thông báo Toast đẹp
  const banner = document.createElement("div");
  banner.style.cssText = "position:fixed; bottom:24px; right:24px; background:#15803d; color:#fff; padding:14px 20px; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.2); z-index:9999; font-size:14px; display:flex; align-items:center; gap:10px;";
  banner.innerHTML = "<span>✅</span> <strong>Đã đồng bộ thành công cả 3 Phụ lục (PL1, PL2, PL3) theo Công văn 5512!</strong>";
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 3500);
}

// Modal Cấu hình Tích hợp & Thông tin nộp
function openIntegrationsModal() {
  const modal = document.getElementById("modal5512Backdrop");
  if (!modal) return;

  modal.style.display = "flex";
  modal.innerHTML = `
    <div class="modal-box" style="max-width:680px; width:92%; max-height:88vh; overflow-y:auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid var(--border); padding-bottom:10px;">
        <h3 style="color:var(--primary-dark); margin:0;">⚙️ Cấu hình Tích hợp Năng lực & Thông tin Hồ sơ nộp Tổ</h3>
        <button class="btn btn-outline btn-sm" onclick="closeIntegrationsModal()">✕</button>
      </div>

      <div style="margin-bottom:16px;">
        <h4 style="font-size:14px; color:var(--primary); margin-bottom:8px;">1. Bật/Tắt các Cột Năng lực & Yêu cầu tích hợp vào 3 Phụ lục:</h4>
        <div style="display:flex; flex-direction:column; gap:8px; background:#f8fafc; padding:12px; border-radius:8px; border:1px solid var(--border);">
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="checkbox" id="chkNls" ${state5512.integrations.nls ? 'checked' : ''} />
            <span><strong>Khung Năng lực số (NLS)</strong> — Tích hợp mã hoá 1.1.NC1b, 1.3.NC1a, 3.1.NC1a...</span>
          </label>
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="checkbox" id="chkAi" ${state5512.integrations.ai ? 'checked' : ''} />
            <span><strong>Giáo dục Trí tuệ nhân tạo (AI)</strong> — Tích hợp chuẩn Khung QĐ 2422/QĐ-BGDĐT</span>
          </label>
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="checkbox" id="chkSteam" ${state5512.integrations.steam ? 'checked' : ''} />
            <span><strong>Giáo dục STEAM Nông nghiệp</strong> — Tích hợp 6 dự án nông nghiệp công nghệ cao</span>
          </label>
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="checkbox" id="chkEnv" ${state5512.integrations.env ? 'checked' : ''} />
            <span><strong>Bảo vệ môi trường & Giảm phát thải</strong> — Tiêu chuẩn VietGAP và nông nghiệp bền vững</span>
          </label>
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <h4 style="font-size:14px; color:var(--primary); margin-bottom:8px;">2. Thông tin Thể thức Đơn vị & Ký duyệt:</h4>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div>
            <label style="font-size:12.5px; font-weight:600;">Tên Trường THPT:</label>
            <input type="text" id="cfgSchool" class="input" value="${escapeHtml(state5512.metaConfig.school)}" />
          </div>
          <div>
            <label style="font-size:12.5px; font-weight:600;">Tổ chuyên môn:</label>
            <input type="text" id="cfgDept" class="input" value="${escapeHtml(state5512.metaConfig.department)}" />
          </div>
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
              <label style="font-size:12.5px; font-weight:600;">Họ tên Giáo viên giảng dạy:</label>
              <select style="font-size:11.5px; padding:1px 6px; border-radius:4px; border:1px solid #cbd5e1; background:#f1f5f9; cursor:pointer;" onchange="if(this.value!=='custom'){document.getElementById('cfgTeacher').value=this.value;}else{document.getElementById('cfgTeacher').value=''; document.getElementById('cfgTeacher').focus();}">
                <option value="Võ Thị Thanh Thuý" ${state5512.metaConfig.teacherName === 'Võ Thị Thanh Thuý' ? 'selected' : ''}>Võ Thị Thanh Thuý</option>
                <option value="Trương Khắc Nam" ${state5512.metaConfig.teacherName === 'Trương Khắc Nam' ? 'selected' : ''}>Trương Khắc Nam</option>
                <option value="custom" ${state5512.metaConfig.teacherName !== 'Võ Thị Thanh Thuý' && state5512.metaConfig.teacherName !== 'Trương Khắc Nam' ? 'selected' : ''}>Tự điền...</option>
              </select>
            </div>
            <input type="text" id="cfgTeacher" class="input" value="${escapeHtml(state5512.metaConfig.teacherName)}" placeholder="Nhập họ và tên giáo viên..." />
          </div>
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
              <label style="font-size:12.5px; font-weight:600;">Họ tên Tổ trưởng chuyên môn:</label>
              <select style="font-size:11.5px; padding:1px 6px; border-radius:4px; border:1px solid #cbd5e1; background:#f1f5f9; cursor:pointer;" onchange="if(this.value!=='custom'){document.getElementById('cfgHead').value=this.value;}else{document.getElementById('cfgHead').value=''; document.getElementById('cfgHead').focus();}">
                <option value="Phạm Thanh Xuân" ${state5512.metaConfig.headName === 'Phạm Thanh Xuân' ? 'selected' : ''}>Phạm Thanh Xuân</option>
                <option value="custom" ${state5512.metaConfig.headName !== 'Phạm Thanh Xuân' ? 'selected' : ''}>Tự điền...</option>
              </select>
            </div>
            <input type="text" id="cfgHead" class="input" value="${escapeHtml(state5512.metaConfig.headName)}" placeholder="Nhập họ và tên tổ trưởng..." />
          </div>
          <div>
            <label style="font-size:12.5px; font-weight:600;">Năm học:</label>
            <input type="text" id="cfgYear" class="input" value="${escapeHtml(state5512.metaConfig.schoolYear)}" />
          </div>
          <div>
            <label style="font-size:12.5px; font-weight:600;">Tỉnh / Thành phố:</label>
            <input type="text" id="cfgProvince" class="input" value="${escapeHtml(state5512.metaConfig.province)}" />
          </div>
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px solid var(--border); padding-top:12px;">
        <button class="btn btn-outline" onclick="closeIntegrationsModal()">Đóng</button>
        <button class="btn btn-primary" onclick="saveIntegrationsModal()">Lưu & Cập nhật Hồ sơ</button>
      </div>
    </div>
  `;
}

function closeIntegrationsModal() {
  const modal = document.getElementById("modal5512Backdrop");
  if (modal) modal.style.display = "none";
}

function saveIntegrationsModal() {
  state5512.integrations.nls = document.getElementById("chkNls")?.checked ?? true;
  state5512.integrations.ai = document.getElementById("chkAi")?.checked ?? true;
  state5512.integrations.steam = document.getElementById("chkSteam")?.checked ?? true;
  state5512.integrations.env = document.getElementById("chkEnv")?.checked ?? true;

  state5512.metaConfig.school = document.getElementById("cfgSchool")?.value || state5512.metaConfig.school;
  state5512.metaConfig.department = document.getElementById("cfgDept")?.value || state5512.metaConfig.department;
  state5512.metaConfig.teacherName = document.getElementById("cfgTeacher")?.value || state5512.metaConfig.teacherName;
  state5512.metaConfig.headName = document.getElementById("cfgHead")?.value || state5512.metaConfig.headName;
  state5512.metaConfig.schoolYear = document.getElementById("cfgYear")?.value || state5512.metaConfig.schoolYear;
  state5512.metaConfig.province = document.getElementById("cfgProvince")?.value || state5512.metaConfig.province;

  save5512Data();
  closeIntegrationsModal();
  render5512CurrentView();
  show5512Toast("Đã lưu thành công cấu hình hồ sơ & thể thức nộp!");
}
// ============================================================================
// TIỂU MỤC 2.2: CÔNG CỤ SOẠN GIÁO ÁN CHUẨN CV 5512 & MẪU / TRÒ CHƠI / CÔNG NGHỆ
// ============================================================================
// KHO GIÁO ÁN MẪU MỰC HOÀN CHỈNH CHI TIẾT (CHUẨN CV 5512 / BGDĐT-GDTrH)
// Được biên soạn công phu, chuẩn 100% SGK Công nghệ 10 (Bộ sách Kết nối tri thức)
// ============================================================================

const STANDARD_LESSON_PLANS = {
  "cn10_1": {
    grade: "cn10",
    lessonId: 1,
    title: "Bài 1. Giới thiệu chung về trồng trọt",
    periods: 2,
    week: "Tuần 1 (Tiết 1 - 2)",
    yccd: `1. Trình bày được vai trò quan trọng của trồng trọt đối với đời sống con người, sự phát triển kinh tế - xã hội và bảo vệ môi trường sinh thái.
2. Phân tích được triển vọng phát triển của ngành trồng trọt Việt Nam trong bối cảnh cuộc Cách mạng công nghiệp 4.0 (nông nghiệp công nghệ cao, nông nghiệp hữu cơ tuần hoàn, chuỗi giá trị và giảm phát thải Net Zero).
3. Nêu và phân tích được một số thành tựu nổi bật của việc ứng dụng công nghệ cao trong trồng trọt (nhà kính thông minh, hệ thống tưới nhỏ giọt Fertigation, canh tác không dùng đất, thiết bị bay không người lái Drone, trí tuệ nhân tạo AI).
4. Trình bày được đặc điểm của một số ngành nghề phổ biến trong trồng trọt (Kỹ sư nông học, bảo vệ thực vật, chọn giống, chuyên viên nông nghiệp công nghệ cao) và những yêu cầu cơ bản đối với người lao động trong thời đại mới.`,
    nlsGoal: `1.1.NC1b: Tra cứu, đánh giá và chọn lọc thông tin số — Nhóm sử dụng từ khóa định hướng, tra cứu trên Internet ít nhất hai số liệu hoặc thành tựu công nghệ cao trong trồng trọt thực tế, ghi vào phiếu học tập kèm địa chỉ nguồn trích dẫn.
3.1.NC1a: Sử dụng công cụ số (ứng dụng ghi chú, Google Docs/Canva) để tổng hợp sản phẩm nhóm và trình bày báo cáo.`,
    aiGoal: `10.C2.2: Ứng dụng AI trong học tập và cuộc sống — Liệt kê và giải thích được chức năng của một số ứng dụng AI trong trồng trọt thời 4.0 (nhận diện sâu bệnh hại qua ảnh lá trên smartphone, dự báo thời tiết đồng ruộng, tưới biến thiên thông minh, robot thu hoạch nông sản).
10.A3c: Nghề nghiệp tương lai cùng AI — Phân tích được sự thay đổi trong yêu cầu năng lực đối với người lao động ngành trồng trọt khi AI và tự động hóa được ứng dụng phổ biến, từ đó định hướng rèn luyện các kỹ năng số và tư duy sáng tạo.`,
    qualities: `Chăm chỉ tìm tòi kiến thức ngoài SGK; có trách nhiệm với nhiệm vụ chung của nhóm; trung thực trong báo cáo số liệu; có tình yêu thiên nhiên, say mê nông nghiệp và ý thức bảo vệ môi trường, sử dụng thực phẩm an toàn.`,
    teacherEq: `- Máy tính xách tay (Laptop), Smart Tivi hoặc máy chiếu độ phân giải cao kết nối Internet ổn định.
- Bài giảng điện tử trình chiếu PowerPoint trực quan, video phóng sự ngắn (2-3 phút) về nông nghiệp công nghệ cao Việt Nam.
- Bộ câu hỏi tương tác phần mềm Plickers; bộ thẻ trắc nghiệm Plickers in sẵn phát cho học sinh cả lớp.
- Phiếu học tập số 1 (Vai trò, triển vọng và thành tựu trồng trọt) và Phiếu học tập số 2 (Ngành nghề và yêu cầu lao động thời 4.0).
- Bảng tiêu chí đánh giá hoạt động nhóm (Rubric).`,
    studentEq: `- Sách giáo khoa Công nghệ 10 (Bộ sách Kết nối tri thức với cuộc sống), vở ghi chép, bút màu, giấy A3 thảo luận nhóm.
- Điện thoại thông minh hoặc máy tính bảng kết nối Wifi (1 máy/nhóm) để tra cứu dữ liệu số và quét mã QR tài liệu.
- Thẻ Plickers cá nhân phục vụ tương tác trên lớp.`,
    act1: {
      name: "HOẠT ĐỘNG 1: KHỞI ĐỘNG (MỞ ĐẦU) — TƯƠNG TÁC THẺ SỐ PLICKERS",
      goal: "Kích hoạt kiến thức nền tảng của học sinh về vai trò của nông nghiệp; tạo mâu thuẫn nhận thức giữa nông nghiệp truyền thống và nông nghiệp hiện đại 4.0; tạo tâm thế hào hứng bước vào bài học mới.",
      content: `Học sinh theo dõi 2 bức tranh đối lập trên màn hình (Bức tranh 1: Cảnh "con trâu đi trước, cái cày theo sau" lam lũ; Bức tranh 2: Cánh đồng thông minh với máy bay không người lái, hệ thống cảm biến và nhà kính tự động), sau đó tham gia trò chơi tương tác nhanh qua thẻ Plickers gồm 3 câu hỏi trắc nghiệm thực tế:
- Câu 1: Mặt hàng nông sản xuất khẩu nào của Việt Nam hiện đứng top đầu thế giới về sản lượng và giá trị? (A. Lúa gạo; B. Cà phê Robusta; C. Hạt điều; D. Cả 3 mặt hàng trên).
- Câu 2: Trong sản xuất nông nghiệp công nghệ cao hiện nay, người ta có thể trồng rau mà không cần đất thông qua phương pháp nào? (A. Thủy canh; B. Khí canh; C. Trồng trên giá thể; D. Cả A, B, C).
- Câu 3: Thiết bị nào sau đây đang được người nông dân 4.0 sử dụng để phun thuốc trừ sâu trên diện tích hàng chục héc-ta chỉ trong vài phút? (A. Bình xịt tay; B. Máy bay không người lái Drone; C. Xe tưới đẩy; D. Máy bơm nước).`,
      product: "Kết quả bình chọn và câu trả lời của học sinh hiển thị trực tiếp trên màn hình Tivi qua ứng dụng Plickers; học sinh nhận ra sự chuyển mình ngoạn mục của nông nghiệp Việt Nam từ thủ công sang công nghệ cao.",
      step1: `Giáo viên trình chiếu 2 bức tranh đối lập và nêu câu hỏi dẫn dắt: "Nhìn vào 2 hình ảnh trên, các em thấy nền nông nghiệp nước ta đã và đang thay đổi như thế nào? Liệu làm nông nghiệp hôm nay có còn là công việc chân lấm tay bùn vất vả nữa không?". Giáo viên yêu cầu học sinh chuẩn bị sẵn thẻ Plickers để trả lời 3 câu hỏi nhanh.`,
      step2: "Học sinh quan sát, suy nghĩ độc lập trong 1 phút, sau đó giơ thẻ Plickers theo các hướng A, B, C, D để lựa chọn phương án mình cho là đúng.",
      step3: "Giáo viên dùng camera điện thoại quét thẻ cả lớp trong 10 giây; biểu đồ đáp án hiện tức thì trên màn hình. Giáo viên mời 1-2 học sinh giải thích nhanh sự lựa chọn của mình.",
      step4: "Giáo viên biểu dương tinh thần tham gia của cả lớp, chốt đáp án đúng và dẫn dắt khéo léo vào bài mới: Trồng trọt không chỉ nuôi sống con người mà đang bước vào kỷ nguyên công nghệ cao, tự động hóa và AI. Để hiểu rõ vai trò to lớn, những bước chuyển mình kỳ diệu và cơ hội nghề nghiệp trong tương lai, chúng ta cùng nghiên cứu: Bài 1. Giới thiệu chung về trồng trọt."
    },
    act2: {
      name: "HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI — KHAI THÁC HỌC LIỆU SỐ & AI",
      goal: `1. Nêu và phân tích được 5 vai trò cơ bản và 4 triển vọng lớn của trồng trọt thời đại 4.0.
2. Khám phá và giải thích được 5 thành tựu công nghệ cao tiêu biểu (Smart greenhouse, Fertigation, Drone, Trồng cây không đất, Trí tuệ nhân tạo AI).
3. Phân biệt được đặc trưng của 4 ngành nghề phổ biến trong trồng trọt và xác định được các phẩm chất, năng lực cần rèn luyện của bản thân.`,
      content: `Lớp chia thành 4 nhóm chuyên gia, nghiên cứu SGK kết hợp tra cứu Internet qua điện thoại theo từ khóa định hướng, hoàn thành Phiếu học tập số 1 và số 2:
- Nhiệm vụ 1 (Nhóm 1): Tìm hiểu Vai trò của trồng trọt (Cung cấp lương thực/thực phẩm; Cung cấp thức ăn chăn nuôi; Cung cấp nguyên liệu chế biến công nghiệp; Nguồn hàng xuất khẩu giá trị cao; Tạo cảnh quan và bảo vệ môi trường).
- Nhiệm vụ 2 (Nhóm 2): Tìm hiểu Triển vọng của trồng trọt Việt Nam thời 4.0 (Hiện đại hóa trang thiết bị; Ứng dụng IoT và cảm biến thông minh; Phát triển nông nghiệp sinh thái tuần hoàn, giảm phát thải khí nhà kính; Xây dựng chuỗi liên kết giá trị nông sản).
- Nhiệm vụ 3 (Nhóm 3): Khám phá Các thành tựu công nghệ cao trong trồng trọt (Nhà kính thông minh điều khiển vi khí hậu; Hệ thống tưới nhỏ giọt tự động Fertigation; Trồng cây không dùng đất thủy canh/khí canh; Ứng dụng thiết bị Drone viễn thám; Ứng dụng AI chẩn đoán sâu bệnh và robot thu hoạch).
- Nhiệm vụ 4 (Nhóm 4): Khám phá Các ngành nghề phổ biến (Kỹ sư nông học, Kỹ sư bảo vệ thực vật, Kỹ sư chọn giống, Chuyên gia nông nghiệp công nghệ cao) và Những yêu cầu cốt lõi đối với người lao động trong thời đại số & AI.`,
      product: "Bản sản phẩm Phiếu học tập số 1 và số 2 của 4 nhóm đã hoàn thiện đầy đủ nội dung, có trích dẫn số liệu thực tế kèm nguồn tin cậy (Mã NLS 1.1.NC1b); Sơ đồ tư duy chuẩn hóa kiến thức trên slide PowerPoint của giáo viên.",
      step1: "Giáo viên chia lớp thành 4 nhóm (8-10 HS/nhóm), cử nhóm trưởng và thư ký. Chiếu mã QR để các nhóm tải Phiếu học tập số hoặc phát phiếu in sẵn trên giấy A3. Hướng dẫn từ khóa tra cứu minh chứng số: 'Thành tựu nông nghiệp công nghệ cao Việt Nam', 'Ứng dụng Drone trong nông nghiệp', 'Ứng dụng AI chẩn đoán bệnh cây trồng'. Thời gian thảo luận nhóm: 15 phút.",
      step2: "Các nhóm tiến hành thảo luận sôi nổi, phân công: thành viên đọc SGK, thành viên dùng điện thoại tra cứu số liệu (kim ngạch xuất khẩu nông sản Việt Nam năm gần nhất), thư ký ghi chép tổng hợp vào phiếu học tập. Giáo viên di chuyển quan sát, hướng dẫn nhóm gặp khó khăn, nhắc nhở cách chọn lọc nguồn tin chính thống (Cổng thông tin Bộ NN&PTNT).",
      step3: "Đại diện Nhóm 1 và Nhóm 2 trình bày (mỗi nhóm 4 phút) về Vai trò và Triển vọng. Nhóm 3 và Nhóm 4 đặt câu hỏi chất vấn: 'Tại sao nói trồng trọt cung cấp nguyên liệu cho công nghiệp chế biến? Cho ví dụ cụ thể ở tỉnh Đồng Nai?'. Sau đó Nhóm 3 và Nhóm 4 trình bày về Thành tựu công nghệ cao và Ngành nghề - Yêu cầu lao động. Nhóm 1 và 2 phản biện: 'AI có thể thay thế hoàn toàn kỹ sư nông nghiệp trong tương lai hay không?'.",
      step4: "Giáo viên nhận xét tinh thần hợp tác và chất lượng sản phẩm của từng nhóm; phân tích các câu hỏi phản biện hay; trình chiếu sơ đồ tư duy chuẩn hóa toàn bộ kiến thức bài học (Vai trò, Triển vọng, Thành tựu 4.0, Nghề nghiệp và Yêu cầu năng lực mới)."
    },
    act3: {
      name: "HOẠT ĐỘNG 3: LUYỆN TẬP — HỆ THỐNG CÂU HỎI TRẮC NGHIỆM CHUẨN CV 7991",
      goal: "Củng cố, khắc sâu toàn bộ kiến thức bài học; rèn luyện năng lực tư duy logic, phân tích câu hỏi trắc nghiệm nhiều lựa chọn và trắc nghiệm Đúng/Sai đa ý chuẩn cấu trúc định dạng đề thi mới theo Công văn số 7991/BGDĐT-GDTrH.",
      content: `Học sinh làm việc cá nhân hoàn thành Phiếu bài tập luyện tập gồm 4 câu trắc nghiệm nhiều phương án lựa chọn và 1 câu trắc nghiệm Đúng/Sai (gồm 4 lệnh hỏi a, b, c, d):
- Câu 1: Nhóm cây trồng nào sau đây cung cấp nguyên liệu chính cho ngành công nghiệp chế biến đường ăn?
  A. Lúa gạo.   B. Mía.   C. Cao su.   D. Cà phê. (Đáp án: B)
- Câu 2: Biện pháp kỹ thuật nào sau đây là ứng dụng công nghệ cao trong trồng trọt nhằm tiết kiệm nước và tối ưu hóa lượng phân bón?
  A. Tưới tràn rãnh.   B. Tưới nhỏ giọt kết hợp châm phân bón tự động Fertigation.   C. Đào mương dẫn nước.   D. Chờ nước mưa tự nhiên. (Đáp án: B)
- Câu 3: Thiết bị bay không người lái (Drone) được ứng dụng hiệu quả nhất trong khâu nào sau đây của trồng trọt quy mô lớn?
  A. Thu hoạch củ ngầm.   B. Phun thuốc bảo vệ thực vật và giám sát sức khỏe cây trồng bằng ảnh phổ viễn thám.   C. Làm đất cày sâu.   D. Vận chuyển nông sản đường dài. (Đáp án: B)
- Câu 4: Yêu cầu nào sau đây KHÔNG PHẢI là yêu cầu bắt buộc đối với người lao động làm việc trong các trang trại nông nghiệp công nghệ cao?
  A. Có hiểu biết về quy trình kỹ thuật canh tác an toàn.   B. Có khả năng vận hành thiết bị số và máy móc tự động.   C. Phải có sức khỏe cơ bắp vượt trội để làm việc nặng nhọc thủ công cả ngày.   D. Có ý thức tuân thủ kỷ luật lao động và bảo vệ môi trường sinh thái. (Đáp án: C)
- Câu 5 (Trắc nghiệm Đúng/Sai chuẩn CV 7991): Khi thảo luận về xu hướng ứng dụng Trí tuệ nhân tạo (AI) trong ngành trồng trọt hiện đại, các bạn học sinh đưa ra các nhận định sau:
  a) AI có thể giúp phân tích dữ liệu thời tiết và độ ẩm đất từ cảm biến để đưa ra quyết định tưới nước chính xác cho từng gốc cây. (Đúng)
  b) Ứng dụng AI cài trên điện thoại thông minh có thể nhận diện sớm mầm bệnh hại trên lá qua hình ảnh chụp và gợi ý biện pháp xử lý an toàn. (Đúng)
  c) Nhờ có AI và robot tự động hóa, người lao động nông nghiệp trong tương lai không cần phải trang bị kiến thức sinh học và kỹ năng công nghệ nữa. (Sai)
  d) Việc ứng dụng AI vào trồng trọt góp phần giảm thiểu lượng thuốc BVTV hóa học lãng phí ra môi trường, hướng tới phát triển nông nghiệp bền vững. (Đúng)`,
      product: "Phiếu trả lời bài tập của học sinh; lời giải thích rõ ràng cơ sở lý thuyết cho từng phương án lựa chọn; bảng điểm đánh giá mức độ đạt yêu cầu cần đạt của bài học.",
      step1: "Giáo viên trình chiếu hệ thống câu hỏi lên Smart Tivi hoặc phát phiếu bài tập trắc nghiệm nhanh, yêu cầu học sinh làm độc lập trong 5 phút.",
      step2: "Học sinh suy nghĩ, đối chiếu kiến thức vừa học để chọn đáp án và ghi ngắn gọn lý do vì sao chọn vào phiếu học tập.",
      step3: "Giáo viên gọi học sinh trả lời từng câu, yêu cầu phân tích tại sao các phương án khác sai. Với câu hỏi Đúng/Sai, giáo viên tổ chức tranh luận nhanh ở ý c và d.",
      step4: "Giáo viên chốt đáp án đúng, khen ngợi học sinh nắm chắc bài, nhấn mạnh lại: AI là công cụ đắc lực hỗ trợ con người nâng cao năng suất, giải phóng sức lao động nhưng năng lực tư duy, sáng tạo và đạo đức nghề nghiệp của con người mới là yếu tố quyết định."
    },
    act4: {
      name: "HOẠT ĐỘNG 4: VẬN DỤNG & MỞ RỘNG — TRẢI NGHIỆM AI & NÔNG NGHIỆP THỰC TẾ",
      goal: "Vận dụng kiến thức đã học vào thực tế đời sống nông nghiệp tại địa phương (Đồng Nai / Nam Bộ); phát triển năng lực số và năng lực trải nghiệm công cụ AI trong học tập suốt đời.",
      content: `Học sinh thực hiện một trong hai nhiệm vụ sau tại nhà (làm theo nhóm hoặc cá nhân):
- Nhiệm vụ 1 (Khảo sát thực tế nông nghiệp địa phương): Tìm hiểu một mô hình trồng trọt thực tế tại địa phương em (Ví dụ: Vườn bưởi Tân Triều, vườn sầu riêng Long Khánh, vườn tiêu Cẩm Mỹ, hoặc mô hình trồng nấm, trồng rau thủy canh tại gia đình). Ghi lại: Loại cây trồng, phương thức canh tác, các công nghệ đang áp dụng và những khó khăn bà con nông dân đang gặp phải.
- Nhiệm vụ 2 (Trải nghiệm ứng dụng AI trong đời sống): Dùng điện thoại chụp ảnh một chiếc lá cây có dấu hiệu bất thường trong vườn nhà/trường học, sử dụng công cụ AI (Google Lens, Plantix hoặc hỏi Trợ lý AI Gemini/ChatGPT) với câu lệnh mẫu: "Hãy nhận diện đây là cây gì, có dấu hiệu bệnh gì và gợi ý biện pháp chăm sóc an toàn sinh học?". Nhận xét về độ chính xác và tính hữu ích của câu trả lời từ AI.`,
      product: "Một bài báo cáo ngắn dạng infographic (trên Canva) hoặc một trang ghi chú kèm 2 - 3 bức ảnh thực tế, nộp lên không gian lớp học số (Padlet / Google Classroom / Zalo nhóm lớp) trước buổi học tuần sau.",
      step1: "Giáo viên hướng dẫn thể lệ, tiêu chí đánh giá sản phẩm (tính chân thực, sáng tạo, ứng dụng công nghệ), chia sẻ mã QR và đường link Padlet nộp bài.",
      step2: "Học sinh tiếp nhận nhiệm vụ, ghi chép yêu cầu vào vở và lưu mã QR Padlet lớp học.",
      step3: "Học sinh thực hiện nhiệm vụ ở nhà trong tuần, nộp sản phẩm đúng hạn lên Padlet.",
      step4: "Đầu tiết học tuần kế tiếp, giáo viên dành 3 phút đầu giờ chiếu 2 sản phẩm xuất sắc nhất để biểu dương, nhận xét và cộng điểm thưởng thường xuyên."
    },
    attachments: {
      worksheet1: `PHIẾU HỌC TẬP SỐ 1: VAI TRÒ, TRIỂN VỌNG & THÀNH TỰU CÔNG NGHỆ CAO
Nhóm: ....................................... Lớp: 10A..... Ngày: ....................
Nhiệm vụ 1: Hoàn thành bảng phân tích 5 vai trò của trồng trọt:
1. Đối với con người: Cung cấp lương thực, thực phẩm thiết yếu (lúa gạo, ngô, rau, củ, quả tươi...).
2. Đối với chăn nuôi: Cung cấp nguồn thức ăn thô, tinh và thức ăn ủ chua (ngô, đậu tương, cỏ...).
3. Đối với công nghiệp chế biến: Cung cấp nguyên liệu đầu vào (mía đường, cao su, cà phê, chè, dược liệu...).
4. Đối với xuất khẩu: Mang lại nguồn ngoại tệ lớn cho đất nước (gạo, cà phê, hạt điều, tiêu, sầu riêng...).
5. Đối với môi trường: Tạo việc làm, cải tạo cảnh quan xanh và cân bằng hệ sinh thái.

Nhiệm vụ 2: Tra cứu Internet và điền ví dụ thực tế về 3 thành tựu công nghệ cao:
- Thành tựu 1 (Nhà kính thông minh): Mô hình trồng dâu tây/rau hoa công nghệ cao tại Đà Lạt.
- Thành tựu 2 (Hệ thống tưới tự động): Công nghệ tưới nhỏ giọt kết hợp châm phân Fertigation tại các trang trại chuối, dưa lưới.
- Thành tựu 3 (Thiết bị bay Drone / AI): Ứng dụng Drone phun thuốc bảo vệ thực vật tại đồng bằng sông Cửu Long và Đồng Nai.
Nguồn trích dẫn: Báo Nông nghiệp Việt Nam (nongnghiep.vn), Cổng thông tin Bộ NN&PTNT.`,

      worksheet2: `PHIẾU HỌC TẬP SỐ 2: NGÀNH NGHỀ & NĂNG LỰC NGƯỜI LAO ĐỘNG THỜI 4.0
Nhóm: ....................................... Lớp: 10A..... Ngày: ....................
1. Phân biệt các ngành nghề phổ biến trong trồng trọt:
- Kỹ sư nông học (Agronomist): Nghiên cứu quy trình canh tác, quản lý dinh dưỡng cây trồng.
- Kỹ sư bảo vệ thực vật (Plant Protectionist): Chẩn đoán và phòng trừ dịch hại an toàn sinh học.
- Kỹ sư chọn giống (Plant Breeder): Lai tạo, chọn lọc và nhân giống cây trồng năng suất cao.
- Chuyên gia nông nghiệp công nghệ cao: Vận hành hệ thống IoT, nhà kính tự động, thiết bị Drone.

2. Xác định 3 nhóm yêu cầu cốt lõi đối với người lao động:
- Về kiến thức: Nắm vững đặc tính sinh học cây trồng, quy trình VietGAP và công nghệ 4.0.
- Về kỹ năng: Vận hành thành thạo máy móc công nghệ cao, có kỹ năng số và giải quyết vấn đề.
- Về phẩm chất: Yêu nghề, trung thực, có trách nhiệm bảo vệ môi trường và sức khỏe cộng đồng.`,

      rubric: `BẢNG TIÊU CHÍ RUBRIC ĐÁNH GIÁ NĂNG LỰC HỢP TÁC NHÓM
- Tiêu chí 1: Sự hợp tác và tinh thần trách nhiệm của các thành viên (Mức 1: Rời rạc -> Mức 4: 100% thành viên tích cực, phân công rõ ràng).
- Tiêu chí 2: Chất lượng nội dung và độ chính xác của số liệu tra cứu (Mức 1: Sơ sài -> Mức 4: Đầy đủ, sâu sắc, có số liệu minh chứng và trích dẫn nguồn tin cậy).
- Tiêu chí 3: Kỹ năng trình bày, phản biện và ứng dụng công cụ số (Mức 1: Thụ động -> Mức 4: Tự tin, lưu loát, phản biện sắc bén, slide/sản phẩm trình chiếu trực quan đẹp mắt).`
    }
  }
};

// ============================================================================
// TIỂU MỤC 2.2: CÔNG CỤ SOẠN GIÁO ÁN CHUẨN CV 5512 & MẪU / TRÒ CHƠI / CÔNG NGHỆ
// ============================================================================

function render5512SubModule2() {
  const container = document.getElementById("subTabContentArea");
  if (!container || typeof DATA_5512 === "undefined") return;

  const g = state5512.editor.grade;
  const curriculum = (DATA_5512.curriculum && DATA_5512.curriculum[g]) || [];
  const lessonsOnly = curriculum.filter(item => !item.isExam);

  // Nếu chưa có bài chọn, chọn bài đầu tiên
  if (!state5512.editor.title && lessonsOnly.length > 0) {
    loadLessonIntoEditor(g, lessonsOnly[0].stt);
  }

  container.innerHTML = `
    <!-- HEADER SOẠN GIÁO ÁN -->
    <div class="cv5512-card" style="margin-bottom:16px; background:#eff6ff; border-left:4px solid var(--info);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <h3 style="color:var(--info); font-size:16px; margin:0 0 4px 0; font-weight:800;">
            📝 CÔNG CỤ SOẠN GIÁO ÁN (KẾ HOẠCH BÀI DẠY) CHUẨN CÔNG VĂN 5512/BGDĐT-GDTrH
          </h3>
          <p style="font-size:13.5px; color:#475569; margin:0;">
            Tự động nạp Năng lực & Yêu cầu từ <strong>Phụ lục 1, 2, 3</strong> • Giáo án chi tiết hoàn chỉnh 100% • Tích hợp Trò chơi, Năng lực số, AI & Xuất Word nộp VnEdu
          </p>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" onclick="loadLessonIntoEditor('cn10', 1); render5512SubModule2();">
            🌟 Mẫu Mực Bài 1 (Chi Tiết 100%)
          </button>
          <button class="btn btn-outline btn-sm" onclick="smartAiAutoFillLessonPlan()">
            ✨ Tự động điền hoàn chỉnh (AI Smart Fill)
          </button>
          <button class="btn btn-accent btn-sm" onclick="exportLessonPlanWord()">
            📥 Xuất Giáo Án Word (.doc) Nộp VnEdu
          </button>
        </div>
      </div>
    </div>

    <!-- THANH ĐIỀU KHIỂN: CHỌN KHỐI, BÀI HỌC & CHỌN MẪU -->
    <div class="cv5512-card" style="margin-bottom:16px; padding:14px 18px;">
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:14px; align-items:center;">
        <!-- Chọn Khối -->
        <div>
          <label class="cv5512-label">1. Khối lớp:</label>
          <select id="editorGradeSelect" class="cv5512-input" onchange="onEditorGradeChange(this.value)">
            <option value="cn10" ${g === 'cn10' ? 'selected' : ''}>Khối 10 — Công nghệ Trồng trọt (28 Bài)</option>
            <option value="cn11" ${g === 'cn11' ? 'selected' : ''}>Khối 11 — Công nghệ Chăn nuôi (22 Bài)</option>
            <option value="cn12" ${g === 'cn12' ? 'selected' : ''}>Khối 12 — Lâm nghiệp & Thủy sản (27 Bài)</option>
          </select>
        </div>

        <!-- Chọn Bài học -->
        <div>
          <label class="cv5512-label">2. Bài học SGK (Kết nối tri thức):</label>
          <select id="editorLessonSelect" class="cv5512-input" onchange="loadLessonIntoEditor(state5512.editor.grade, this.value)">
            ${lessonsOnly.map(l => `
              <option value="${l.stt}" ${l.stt == state5512.editor.lessonId ? 'selected' : ''}>
                ${escapeHtml(l.title)} (${l.periods} tiết - ${escapeHtml(l.week || '')}) ${l.stt === 1 && g === 'cn10' ? '⭐ [BÀI MẪU CHI TIẾT]' : ''}
              </option>
            `).join("")}
          </select>
        </div>

        <!-- Chọn Mẫu Giáo án -->
        <div>
          <label class="cv5512-label">3. Chọn Mẫu Giáo án CV 5512:</label>
          <div style="display:flex; gap:6px;">
            <select id="editorTemplateSelect" class="cv5512-input" style="flex:1;" onchange="onEditorTemplateChange(this.value)">
              <option value="nls_ai" ${state5512.editor.templateId === 'nls_ai' ? 'selected' : ''}>Mẫu 5512 Tích hợp Năng lực số & AI (Chuẩn Sở GD&ĐT)</option>
              <option value="basic" ${state5512.editor.templateId === 'basic' ? 'selected' : ''}>Mẫu Chuẩn CV 5512 Cơ bản (Bộ GD&ĐT)</option>
              <option value="steam" ${state5512.editor.templateId === 'steam' ? 'selected' : ''}>Mẫu Dạy học Dự án / STEAM Nông nghiệp (5E)</option>
              ${state5512.customTemplates.map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join("")}
            </select>
            <button class="btn btn-outline btn-sm" title="Thêm mẫu giáo án tùy chỉnh" onclick="openAddTemplateModal()">+ Mẫu</button>
          </div>
        </div>
      </div>

      <!-- THANH CHÈN YÊU CẦU KHÁC (1-CLICK INSERTION TOOLBAR) -->
      <div style="margin-top:14px; border-top:1px solid #e2e8f0; padding-top:12px;">
        <div style="font-size:13.5px; font-weight:700; color:#1e293b; margin-bottom:8px;">
          ⚡ Bộ Công cụ Chèn Nhanh Yêu Cầu Khác vào Giáo án (1-Click Insertion):
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-outline btn-sm" style="color:#d97706; border-color:#f59e0b;" onclick="openInsertGameModal()">
            🎮 Chèn Trò chơi (Plickers, Kahoot, Quizizz, Rung chuông vàng...)
          </button>
          <button class="btn btn-outline btn-sm" style="color:#2563eb; border-color:#60a5fa;" onclick="openInsertTechModal()">
            💻 Chèn Công nghệ số (Canva, Padlet, Mentimeter, Thí nghiệm ảo, AI...)
          </button>
          <button class="btn btn-outline btn-sm" style="color:#15803d; border-color:#4ade80;" onclick="insertLocalFarmingContext()">
            🌾 Chèn Nông nghiệp Thực tiễn Đồng Nai & Môi trường
          </button>
          <button class="btn btn-outline btn-sm" style="color:#7c3aed; border-color:#c084fc;" onclick="insertRubricEvaluation()">
            📊 Chèn Tiêu chí Rubric Đánh giá Nhóm
          </button>
        </div>
      </div>
    </div>

    <!-- KHU VỰC SOẠN THẢO CHI TIẾT KẾ HOẠCH BÀI DẠY (CHỈNH SỬA TRỰC TIẾP) -->
    <div id="lessonPlanEditorBox"></div>
  `;

  renderLessonPlanEditorForm();
}

function onEditorGradeChange(g) {
  state5512.editor.grade = g;
  const curriculum = (DATA_5512.curriculum && DATA_5512.curriculum[g]) || [];
  const lessonsOnly = curriculum.filter(item => !item.isExam);
  if (lessonsOnly.length > 0) {
    loadLessonIntoEditor(g, lessonsOnly[0].stt);
  }
  render5512SubModule2();
}

function onEditorTemplateChange(tmplId) {
  state5512.editor.templateId = tmplId;
  applyTemplateToEditor(tmplId);
  renderLessonPlanEditorForm();
}

// Nạp tự động dữ liệu từ Phụ lục 1, 2, 3 và Kho Giáo án mẫu mực vào Editor
function loadLessonIntoEditor(grade, stt) {
  const stdKey = grade + "_" + stt;
  
  // Nếu là bài có giáo án mẫu mực hoàn chỉnh (như Bài 1 Khối 10)
  if (STANDARD_LESSON_PLANS[stdKey]) {
    const std = STANDARD_LESSON_PLANS[stdKey];
    state5512.editor.lessonId = std.lessonId;
    state5512.editor.title = std.title;
    state5512.editor.periods = std.periods;
    state5512.editor.week = std.week;
    state5512.editor.yccd = std.yccd;
    state5512.editor.nlsGoal = std.nlsGoal;
    state5512.editor.aiGoal = std.aiGoal;
    state5512.editor.qualities = std.qualities;
    state5512.editor.teacherEq = std.teacherEq;
    state5512.editor.studentEq = std.studentEq;
    state5512.editor.act1 = Object.assign({}, std.act1);
    state5512.editor.act2 = Object.assign({}, std.act2);
    state5512.editor.act3 = Object.assign({}, std.act3);
    state5512.editor.act4 = Object.assign({}, std.act4);
    state5512.editor.attachments = Object.assign({}, std.attachments);
  } else {
    // Với các bài khác, nạp từ curriculum và sinh khung hoạt động
    const curriculum = (DATA_5512.curriculum && DATA_5512.curriculum[grade]) || [];
    const found = curriculum.find(item => item.stt == stt);
    if (!found) return;

    state5512.editor.lessonId = found.stt;
    state5512.editor.title = found.title;
    state5512.editor.periods = found.periods;
    state5512.editor.week = found.week || "Tuần 1";
    state5512.editor.yccd = found.yccd || "";
    state5512.editor.nlsGoal = found.nls || "";
    state5512.editor.aiGoal = found.ai || "";
    state5512.editor.qualities = "Chăm chỉ, trung thực, có trách nhiệm với công việc chung và ý thức bảo vệ môi trường, ứng dụng công nghệ hiệu quả.";
    
    if (found.equipment) {
      state5512.editor.teacherEq = found.equipment + "\\n- Laptop, Smart Tivi kết nối Internet, bài giảng PPT.";
    } else {
      state5512.editor.teacherEq = "- SGK, máy tính xách tay, Smart Tivi kết nối Internet.\\n- Bài giảng trình chiếu PowerPoint, phiếu học tập số, video minh họa.";
    }
    state5512.editor.studentEq = "- SGK Công nghệ, vở ghi chép, đồ dùng học tập.\\n- Điện thoại thông minh tra cứu tài liệu theo nhóm (hoặc dùng thẻ Plickers).\\n- Phiếu học tập nhóm.";

    smartGenerateActivities(found);
    state5512.editor.attachments = null;
  }

  // Re-render form nếu đang ở subtab 2
  const formBox = document.getElementById("lessonPlanEditorBox");
  if (formBox) renderLessonPlanEditorForm();
}

// Sinh nội dung 4 hoạt động thông minh bám sát bài học
function smartGenerateActivities(lesson) {
  const t = lesson.title;
  
  // Hoạt động 1: Khởi động
  state5512.editor.act1 = {
    name: "HOẠT ĐỘNG 1: KHỞI ĐỘNG (MỞ ĐẦU) — TƯƠNG TÁC THẺ SỐ PLICKERS",
    goal: `Tạo tâm thế học tập tích cực, khơi dậy sự tò mò và hứng thú của học sinh đối với nội dung "${t}".`,
    content: `Tham gia trò chơi trả lời trắc nghiệm nhanh qua thẻ Plickers / Quizizz gồm 4 câu hỏi liên hệ thực tế liên quan đến ${t}.`,
    product: `Kết quả lựa chọn đáp án của học sinh hiển thị trực tiếp trên màn hình Tivi; phát hiện mâu thuẫn nhận thức để vào bài.`,
    step1: `Giáo viên trình chiếu câu hỏi khởi động, yêu cầu học sinh quan sát hình ảnh/video thực tế và giơ thẻ Plickers chọn đáp án.`,
    step2: `Học sinh suy nghĩ độc lập, quan sát câu hỏi và giơ thẻ trả lời trong vòng 30 giây.`,
    step3: `Giáo viên dùng điện thoại quét thẻ Plickers của cả lớp, màn hình tự động hiển thị biểu đồ phân bổ đáp án của học sinh.`,
    step4: `Giáo viên nhận xét, khen ngợi tinh thần học sinh và dẫn dắt vào bài mới: "${t}".`
  };

  // Hoạt động 2: Hình thành kiến thức
  state5512.editor.act2 = {
    name: "HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI — KHAI THÁC HỌC LIỆU SỐ & AI",
    goal: `Đạt được các Yêu cầu cần đạt: ${lesson.yccd ? lesson.yccd.replace(/\\n/g, ' ') : t}; phát triển năng lực công nghệ và năng lực số.`,
    content: `Học sinh nghiên cứu SGK theo nhóm, sử dụng điện thoại thông minh tra cứu tài liệu theo từ khóa giáo viên hướng dẫn, thảo luận hoàn thành Phiếu học tập số.`,
    product: `Bản sản phẩm Phiếu học tập của các nhóm (trên giấy A0 hoặc tải lên Padlet lớp học); bảng tổng hợp kiến thức trọng tâm.`,
    step1: `Giáo viên chia lớp thành 4 nhóm, giao nhiệm vụ tìm hiểu từng phần kiến thức của ${t} và hướng dẫn quét mã QR lấy Phiếu học tập.`,
    step2: `Các nhóm tiến hành thảo luận, đọc SGK kết hợp tra cứu Internet (theo khung NLS: ${lesson.nls || 'tra cứu chọn lọc'}), tổng hợp câu trả lời vào phiếu.`,
    step3: `Đại diện nhóm 1 và nhóm 3 lên bảng báo cáo; nhóm 2 và nhóm 4 theo dõi, đặt câu hỏi phản biện và chấm điểm chéo theo Rubric.`,
    step4: `Giáo viên nhận xét, chuẩn hóa kiến thức bằng sơ đồ tư duy trên PowerPoint và giảng giải sâu các điểm khó.`
  };

  // Hoạt động 3: Luyện tập
  state5512.editor.act3 = {
    name: "HOẠT ĐỘNG 3: LUYỆN TẬP — HỆ THỐNG CÂU HỎI TRẮC NGHIỆM CHUẨN CV 7991",
    goal: `Củng cố, khắc sâu kiến thức trọng tâm vừa học và rèn luyện kỹ năng giải quyết câu hỏi trắc nghiệm, bài tập tình huống.`,
    content: `Học sinh làm việc cá nhân hoàn thành 4 câu hỏi trắc nghiệm khách quan 4 lựa chọn và 1 câu hỏi đúng/sai đa ý trích từ Ngân hàng câu hỏi chuẩn CV 7991.`,
    product: `Phiếu trả lời bài tập của học sinh; lời giải thích rõ ràng cơ sở lý thuyết cho từng phương án lựa chọn.`,
    step1: `Giáo viên phát phiếu bài tập trắc nghiệm hoặc trình chiếu câu hỏi luyện tập trên Smart Tivi.`,
    step2: `Học sinh độc lập tư duy, giải quyết bài tập vào vở hoặc phiếu học tập cá nhân trong 5-7 phút.`,
    step3: `Giáo viên gọi ngẫu nhiên một số học sinh đọc kết quả và giải thích vì sao chọn/không chọn các phương án còn lại.`,
    step4: `Giáo viên nhận định, phân tích phương án đúng/sai, chốt kiến thức cốt lõi cần nhớ.`
  };

  // Hoạt động 4: Vận dụng
  state5512.editor.act4 = {
    name: "HOẠT ĐỘNG 4: VẬN DỤNG & TÌM TÒI MỞ RỘNG — TRẢI NGHIỆM AI & NÔNG NGHIỆP THỰC TẾ",
    goal: `Vận dụng sáng tạo kiến thức vào thực tiễn gia đình/địa phương và khai thác ứng dụng AI trong học tập suốt đời.`,
    content: `Thực hiện bài tập khảo sát thực tế tại gia đình/địa phương hoặc sử dụng công cụ AI (Gemini/ChatGPT) để tìm hiểu thêm giải pháp công nghệ cao cho nội dung bài học.`,
    product: `Hình ảnh, video ngắn hoặc bài báo cáo tóm tắt trên ứng dụng ghi chú điện thoại nộp lên Padlet trước buổi học tuần sau.`,
    step1: `Giáo viên nêu nhiệm vụ vận dụng thực tế gắn với nông nghiệp địa phương Đồng Nai / Nam Bộ kèm tiêu chí chấm điểm.`,
    step2: `Học sinh lập kế hoạch, quan sát thực tế tại vườn nhà hoặc sử dụng trợ lý AI hỗ trợ giải quyết vấn đề.`,
    step3: `Học sinh nộp sản phẩm lên Padlet / Zalo nhóm lớp, chia sẻ trải nghiệm trong 2 phút đầu tiết học tiếp theo.`,
    step4: `Giáo viên đánh giá, tuyên dương sản phẩm sáng tạo và ghi điểm thưởng thường xuyên.`
  };
}

// Render Form Soạn Giáo án chi tiết (Typography & Layout thống nhất 100%)
function renderLessonPlanEditorForm() {
  const container = document.getElementById("lessonPlanEditorBox");
  if (!container) return;

  const ed = state5512.editor;
  const isNlsAi = ed.templateId === "nls_ai";
  const isSteam = ed.templateId === "steam";
  const isLesson1 = ed.grade === "cn10" && ed.lessonId == 1;

  container.innerHTML = `
    <div class="cv5512-card" style="line-height:1.65;">
      <!-- KHUNG THÔNG TIN HÀNH CHÍNH GIÁO ÁN -->
      <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:16px 20px; margin-bottom:18px;">
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px; margin-bottom:10px; align-items:center;">
          <div style="font-size:13.5px;"><strong>Trường:</strong> ${escapeHtml(state5512.metaConfig.school)}</div>
          <div style="font-size:13.5px;"><strong>Tổ chuyên môn:</strong> ${escapeHtml(state5512.metaConfig.department)}</div>
          <div style="display:flex; align-items:center; gap:6px; font-size:13.5px;">
            <strong style="white-space:nowrap;">👤 Họ và tên giáo viên:</strong>
            <select onchange="onTeacherSelectChange(this.value)" style="padding:3px 8px; border-radius:5px; border:1px solid #cbd5e1; font-weight:700; color:#0f766e; background:#fff; font-size:13.5px; cursor:pointer;">
              ${getTeacherSelectOptionsHtml()}
            </select>
          </div>
          <div style="display:flex; align-items:center; gap:6px; font-size:13.5px;">
            <strong style="white-space:nowrap;">⭐ Tổ trưởng duyệt:</strong>
            <select onchange="onHeadSelectChange(this.value)" style="padding:3px 8px; border-radius:5px; border:1px solid #cbd5e1; font-weight:700; color:#b45309; background:#fff; font-size:13.5px; cursor:pointer;">
              ${getHeadSelectOptionsHtml()}
            </select>
          </div>
        </div>
        <div style="border-top:1px dashed #cbd5e1; padding-top:10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <div style="font-size:16.5px; font-weight:800; color:#166534;">
              KẾ HOẠCH BÀI DẠY: ${escapeHtml(ed.title).toUpperCase()}
            </div>
            ${isLesson1 ? '<span class="badge" style="background:#15803d; color:#fff; font-size:11.5px; font-weight:700; margin-top:3px; display:inline-block;">BÀI DẠY MẪU MỰC KIỂU MẪU — ĐÃ HOÀN THIỆN 100% CHI TIẾT</span>' : ''}
          </div>
          <div style="font-size:13.5px; color:#475569;">
            Thời gian thực hiện: <strong>${ed.periods} tiết</strong> (${escapeHtml(ed.week)}) • Năm học: <strong>${escapeHtml(state5512.metaConfig.schoolYear)}</strong>
          </div>
        </div>
      </div>

      <!-- I. MỤC TIÊU DẠY HỌC -->
      <div style="margin-bottom:20px;">
        <h3 class="cv5512-section-heading">
          <span>🎯</span> I. MỤC TIÊU DẠY HỌC
        </h3>

        <!-- 1. Kiến thức -->
        <div class="cv5512-form-group">
          <label class="cv5512-label">
            1. Kiến thức (Yêu cầu cần đạt chuẩn CT GDPT 2018):
          </label>
          <textarea id="edYccd" class="cv5512-textarea" style="min-height:95px;" oninput="state5512.editor.yccd=this.value">${escapeHtml(ed.yccd)}</textarea>
        </div>

        <!-- 2. Năng lực -->
        <div class="cv5512-form-group">
          <label class="cv5512-label">
            2. Năng lực:
          </label>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:10px;">
            <div style="background:#f8fafc; padding:12px; border-radius:6px; border:1px solid #cbd5e1;">
              <strong style="color:#15803d; font-size:13.5px; display:block; margin-bottom:4px;">a) Năng lực chung:</strong>
              <div style="font-size:13px; color:#475569; line-height:1.6;">
                • <em>Tự chủ và tự học:</em> Tự giác tìm tòi thông tin SGK, khai thác tài liệu số và hoàn thành nhiệm vụ.<br/>
                • <em>Giao tiếp và hợp tác:</em> Thảo luận nhóm hiệu quả, phân công rõ ràng, tự tin báo cáo và phản biện.<br/>
                • <em>Giải quyết vấn đề và sáng tạo:</em> Phân tích thực tiễn và đề xuất giải pháp kỹ thuật nông nghiệp thích ứng.
              </div>
            </div>
            <div style="background:#f8fafc; padding:12px; border-radius:6px; border:1px solid #cbd5e1;">
              <strong style="color:#0f766e; font-size:13.5px; display:block; margin-bottom:4px;">b) Năng lực đặc thù môn Công nghệ (Trồng trọt):</strong>
              <div style="font-size:13px; color:#475569; line-height:1.6;">
                • <em>Nhận thức công nghệ:</em> Trình bày được khái niệm, cơ sở khoa học và quy trình kỹ thuật.<br/>
                • <em>Sử dụng công nghệ:</em> Vận dụng đúng quy trình kỹ thuật, đảm bảo an toàn lao động và vệ sinh sinh thái.<br/>
                • <em>Đánh giá công nghệ:</em> Nhận xét khách quan ưu, nhược điểm của các phương thức sản xuất công nghệ cao.
              </div>
            </div>
          </div>

          <!-- Năng lực số & AI (Nếu chọn mẫu NLS_AI) -->
          ${isNlsAi ? `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:10px;">
              <div>
                <label class="cv5512-label-sub" style="color:#0f766e;">
                  c) Năng lực số (Khung NLS Bộ GD&ĐT):
                </label>
                <textarea id="edNls" class="cv5512-textarea" style="min-height:75px; color:#0f766e;" oninput="state5512.editor.nlsGoal=this.value">${escapeHtml(ed.nlsGoal || '–')}</textarea>
              </div>
              <div>
                <label class="cv5512-label-sub" style="color:#4338ca;">
                  d) Giáo dục AI (Khung QĐ 2422/QĐ-BGDĐT):
                </label>
                <textarea id="edAi" class="cv5512-textarea" style="min-height:75px; color:#4338ca;" oninput="state5512.editor.aiGoal=this.value">${escapeHtml(ed.aiGoal || '–')}</textarea>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- 3. Phẩm chất -->
        <div class="cv5512-form-group">
          <label class="cv5512-label">
            3. Phẩm chất:
          </label>
          <input type="text" id="edQualities" class="cv5512-input" value="${escapeHtml(ed.qualities)}" oninput="state5512.editor.qualities=this.value" />
        </div>
      </div>

      <!-- II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU -->
      <div style="margin-bottom:20px;">
        <h3 class="cv5512-section-heading">
          <span>📦</span> II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU SỐ
        </h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div>
            <label class="cv5512-label">
              1. Đối với Giáo viên:
            </label>
            <textarea id="edTeacherEq" class="cv5512-textarea" style="min-height:90px;" oninput="state5512.editor.teacherEq=this.value">${escapeHtml(ed.teacherEq)}</textarea>
          </div>
          <div>
            <label class="cv5512-label">
              2. Đối với Học sinh:
            </label>
            <textarea id="edStudentEq" class="cv5512-textarea" style="min-height:90px;" oninput="state5512.editor.studentEq=this.value">${escapeHtml(ed.studentEq)}</textarea>
          </div>
        </div>
      </div>

      <!-- III. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG CHUẨN 5512) -->
      <div style="margin-bottom:24px;">
        <h3 class="cv5512-section-heading">
          <span>🚀</span> III. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG SƯ PHẠM CHUẨN CV 5512)
        </h3>

        <!-- 4 HOẠT ĐỘNG -->
        ${[1, 2, 3, 4].map(idx => {
          const act = ed['act' + idx];
          const colors = ['#d97706', '#15803d', '#2563eb', '#7c3aed'];
          const c = colors[idx - 1];
          return `
            <div class="cv5512-activity-card" style="border-top:3.5px solid ${c};">
              <div class="cv5512-activity-header">
                <h4 style="color:${c}; font-size:14.5px; margin:0; font-weight:800;">${escapeHtml(act.name)}</h4>
                <span class="cv5512-badge" style="background:${c}; color:#fff;">Hoạt động ${idx}/4</span>
              </div>

              <!-- Mục tiêu & Nội dung & Sản phẩm -->
              <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:12px;">
                <div>
                  <label class="cv5512-label-sub">a) Mục tiêu:</label>
                  <textarea class="cv5512-textarea" style="min-height:85px;" oninput="state5512.editor.act${idx}.goal=this.value">${escapeHtml(act.goal)}</textarea>
                </div>
                <div>
                  <label class="cv5512-label-sub">b) Nội dung:</label>
                  <textarea class="cv5512-textarea" style="min-height:85px;" oninput="state5512.editor.act${idx}.content=this.value">${escapeHtml(act.content)}</textarea>
                </div>
                <div>
                  <label class="cv5512-label-sub">c) Sản phẩm:</label>
                  <textarea class="cv5512-textarea" style="min-height:85px;" oninput="state5512.editor.act${idx}.product=this.value">${escapeHtml(act.product)}</textarea>
                </div>
              </div>

              <!-- d) Tổ chức thực hiện (4 bước) -->
              <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:12px 14px;">
                <strong style="font-size:13.5px; color:#1e293b; display:block; margin-bottom:8px;">d) Tổ chức thực hiện (Tiến trình 4 bước):</strong>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div>
                    <label class="cv5512-label-sub" style="color:#166534;">Bước 1: Chuyển giao nhiệm vụ:</label>
                    <textarea class="cv5512-textarea" style="min-height:75px;" oninput="state5512.editor.act${idx}.step1=this.value">${escapeHtml(act.step1)}</textarea>
                  </div>
                  <div>
                    <label class="cv5512-label-sub" style="color:#166534;">Bước 2: Thực hiện nhiệm vụ:</label>
                    <textarea class="cv5512-textarea" style="min-height:75px;" oninput="state5512.editor.act${idx}.step2=this.value">${escapeHtml(act.step2)}</textarea>
                  </div>
                  <div>
                    <label class="cv5512-label-sub" style="color:#166534;">Bước 3: Báo cáo, thảo luận:</label>
                    <textarea class="cv5512-textarea" style="min-height:75px;" oninput="state5512.editor.act${idx}.step3=this.value">${escapeHtml(act.step3)}</textarea>
                  </div>
                  <div>
                    <label class="cv5512-label-sub" style="color:#166534;">Bước 4: Kết luận, nhận định:</label>
                    <textarea class="cv5512-textarea" style="min-height:75px;" oninput="state5512.editor.act${idx}.step4=this.value">${escapeHtml(act.step4)}</textarea>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>

      <!-- IV. HỒ SƠ DẠY HỌC & ĐÁNH GIÁ ĐÍNH KÈM (PHIẾU HỌC TẬP & RUBRIC) -->
      ${ed.attachments ? `
        <div style="margin-top:20px; border-top:2px solid #e2e8f0; padding-top:16px;">
          <h3 class="cv5512-section-heading">
            <span>📋</span> IV. HỒ SƠ DẠY HỌC & ĐÁNH GIÁ ĐÍNH KÈM (PHIẾU HỌC TẬP & RUBRIC)
          </h3>
          <div style="font-size:13.5px; color:#475569; margin-bottom:12px;">
            Được thiết kế sẵn và đính kèm trực tiếp vào Kế hoạch bài dạy để in ấn hoặc đưa lên Padlet lớp học.
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px;">
            <!-- Phiếu học tập số 1 -->
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:12px 14px;">
              <strong style="color:#15803d; font-size:13.5px; display:block; margin-bottom:6px;">📄 Phiếu học tập số 1 (Vai trò & Thành tựu):</strong>
              <textarea class="cv5512-textarea" style="min-height:140px; font-size:12.5px; font-family:monospace;" readonly>${escapeHtml(ed.attachments.worksheet1)}</textarea>
            </div>

            <!-- Phiếu học tập số 2 -->
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:12px 14px;">
              <strong style="color:#0f766e; font-size:13.5px; display:block; margin-bottom:6px;">📄 Phiếu học tập số 2 (Ngành nghề & Yêu cầu 4.0):</strong>
              <textarea class="cv5512-textarea" style="min-height:140px; font-size:12.5px; font-family:monospace;" readonly>${escapeHtml(ed.attachments.worksheet2)}</textarea>
            </div>
          </div>

          <!-- Rubric Đánh giá -->
          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:12px 14px;">
            <strong style="color:#7c3aed; font-size:13.5px; display:block; margin-bottom:6px;">📊 Bảng tiêu chí Rubric đánh giá làm việc nhóm:</strong>
            <textarea class="cv5512-textarea" style="min-height:90px; font-size:12.5px; font-family:monospace;" readonly>${escapeHtml(ed.attachments.rubric)}</textarea>
          </div>
        </div>
      ` : ''}

      <!-- NÚT THAO TÁC CUỐI GIÁO ÁN -->
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; border-top:1px solid #e2e8f0; padding-top:14px;">
        <button class="btn btn-outline" onclick="loadLessonIntoEditor(state5512.editor.grade, state5512.editor.lessonId)">
          🔄 Khôi phục ban đầu
        </button>
        <button class="btn btn-primary" onclick="exportLessonPlanWord()">
          📥 Xuất Giáo Án Word (.doc) Nộp VnEdu
        </button>
      </div>
    </div>
  `;
}


function smartAiAutoFillLessonPlan() {
  const g = state5512.editor.grade;
  const curriculum = (DATA_5512.curriculum && DATA_5512.curriculum[g]) || [];
  const found = curriculum.find(item => item.stt == state5512.editor.lessonId) || curriculum[0];
  if (!found) return;

  loadLessonIntoEditor(g, found.stt);
  
  const toast = document.createElement("div");
  toast.style.cssText = "position:fixed; bottom:24px; right:24px; background:#2563eb; color:#fff; padding:14px 20px; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.2); z-index:9999; font-size:14px;";
  toast.innerHTML = "✨ <strong>Đã tự động hoàn thiện Kế hoạch bài dạy chuẩn 5512!</strong>";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Áp dụng template
function applyTemplateToEditor(tmplId) {
  if (tmplId === "basic") {
    state5512.editor.act1.name = "HOẠT ĐỘNG 1: KHỞI ĐỘNG";
    state5512.editor.act2.name = "HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC";
    state5512.editor.act3.name = "HOẠT ĐỘNG 3: LUYỆN TẬP";
    state5512.editor.act4.name = "HOẠT ĐỘNG 4: VẬN DỤNG";
  } else if (tmplId === "steam") {
    state5512.editor.act1.name = "HOẠT ĐỘNG 1: GẮN KẾT (ENGAGE) — XÁC ĐỊNH VẤN ĐỀ STEAM";
    state5512.editor.act2.name = "HOẠT ĐỘNG 2: KHÁM PHÁ & GIẢI THÍCH (EXPLORE & EXPLAIN) — NGHIÊN CỨU KIẾN THỨC NỀN";
    state5512.editor.act3.name = "HOẠT ĐỘNG 3: ÁP DỤNG & THIẾT KẾ (ELABORATE) — CHẾ TẠO / THỬ NGHIỆM MÔ HÌNH";
    state5512.editor.act4.name = "HOẠT ĐỘNG 4: ĐÁNH GIÁ (EVALUATE) — BÁO CÁO SẢN PHẨM & CẢI TIẾN";
  } else {
    // nls_ai
    state5512.editor.act1.name = "HOẠT ĐỘNG 1: KHỞI ĐỘNG (MỞ ĐẦU) — TƯƠNG TÁC SỐ";
    state5512.editor.act2.name = "HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI — KHAI THÁC HỌC LIỆU SỐ & AI";
    state5512.editor.act3.name = "HOẠT ĐỘNG 3: LUYỆN TẬP — HỆ THỐNG CÂU HỎI TRẮC NGHIỆM ĐIỆN TỬ";
    state5512.editor.act4.name = "HOẠT ĐỘNG 4: VẬN DỤNG & MỞ RỘNG — ỨNG DỤNG AI NÔNG NGHIỆP THỰC TẾ";
  }
}
// ============================================================================
// BỘ CÔNG CỤ CHÈN YÊU CẦU KHÁC: TRÒ CHƠI, CÔNG NGHỆ, RUBRIC, THỰC TIỄN
// ============================================================================

// 1. Chèn Trò chơi học tập
function openInsertGameModal() {
  const modal = document.getElementById("modal5512Backdrop");
  if (!modal) return;

  modal.style.display = "flex";
  modal.innerHTML = `
    <div class="modal-box" style="max-width:720px; width:92%; max-height:88vh; overflow-y:auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid var(--border); padding-bottom:10px;">
        <h3 style="color:#d97706; margin:0;">🎮 Chọn & Chèn Trò Chơi Học Tập vào Giáo Án</h3>
        <button class="btn btn-outline btn-sm" onclick="closeIntegrationsModal()">✕</button>
      </div>

      <div style="margin-bottom:14px;">
        <label style="font-weight:700; font-size:13px;">Chọn Hoạt động để chèn:</label>
        <select id="gameTargetAct" class="input" style="padding:6px 10px; margin-top:4px;">
          <option value="act1">Hoạt động 1: Khởi động (Mở đầu)</option>
          <option value="act3" selected>Hoạt động 3: Luyện tập (Củng cố)</option>
        </select>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px;">
        <!-- Plickers -->
        <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:12px;">
          <h4 style="color:#b45309; font-size:14px; margin-bottom:4px;">📱 1. Trò chơi Thẻ Plickers (Quét không cần điện thoại HS)</h4>
          <p style="font-size:13px; color:#475569; line-height:1.55; margin-bottom:8px;">Học sinh giơ thẻ giấy mã hóa A/B/C/D, giáo viên dùng smartphone quét trong 15s để lấy kết quả tức thì.</p>
          <button class="btn btn-outline btn-sm" style="color:#b45309; border-color:#f59e0b;" onclick="doInsertGame('plickers')">+ Chèn Kịch bản Plickers</button>
        </div>

        <!-- Kahoot -->
        <div style="background:#f5f3ff; border:1px solid #ddd6fe; border-radius:8px; padding:12px;">
          <h4 style="color:#6d28d9; font-size:14px; margin-bottom:4px;">⚡ 2. Đấu trường Kahoot Nông Nghiệp</h4>
          <p style="font-size:13px; color:#475569; line-height:1.55; margin-bottom:8px;">Thi đấu trả lời trắc nghiệm trực tuyến có đếm ngược thời gian, nhạc nền kịch tính và bảng xếp hạng vinh danh.</p>
          <button class="btn btn-outline btn-sm" style="color:#6d28d9; border-color:#8b5cf6;" onclick="doInsertGame('kahoot')">+ Chèn Kịch bản Kahoot</button>
        </div>

        <!-- Quizizz -->
        <div style="background:#fdf2f8; border:1px solid #fbcfe8; border-radius:8px; padding:12px;">
          <h4 style="color:#be185d; font-size:14px; margin-bottom:4px;">🎯 3. Thử thách Quizizz Tự hành</h4>
          <p style="font-size:13px; color:#475569; line-height:1.55; margin-bottom:8px;">Học sinh làm bài theo nhịp độ cá nhân, tự xem lại lời giải thích chi tiết và nhận vật phẩm số.</p>
          <button class="btn btn-outline btn-sm" style="color:#be185d; border-color:#ec4899;" onclick="doInsertGame('quizizz')">+ Chèn Kịch bản Quizizz</button>
        </div>

        <!-- Rung chuông vàng -->
        <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:8px; padding:12px;">
          <h4 style="color:#047857; font-size:14px; margin-bottom:4px;">🔔 4. Rung Chuông Vàng Nông Học</h4>
          <p style="font-size:13px; color:#475569; line-height:1.55; margin-bottom:8px;">Đấu loại trực tiếp qua các câu hỏi kiến thức tăng dần cấp độ từ Biết đến Vận dụng cao.</p>
          <button class="btn btn-outline btn-sm" style="color:#047857; border-color:#10b981;" onclick="doInsertGame('bell')">+ Chèn Rung Chuông Vàng</button>
        </div>

        <!-- Hộp quà bí mật -->
        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:12px;">
          <h4 style="color:#1d4ed8; font-size:14px; margin-bottom:4px;">🎁 5. Hộp Quà Bí Mật Nông Nghiệp</h4>
          <p style="font-size:13px; color:#475569; line-height:1.55; margin-bottom:8px;">4 hộp quà may mắn ẩn chứa câu hỏi thực tế nông nghiệp và phần thưởng học tập.</p>
          <button class="btn btn-outline btn-sm" style="color:#1d4ed8; border-color:#3b82f6;" onclick="doInsertGame('box')">+ Chèn Hộp Quà Bí Mật</button>
        </div>

        <!-- Vòng quay may mắn -->
        <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:12px;">
          <h4 style="color:#b91c1c; font-size:14px; margin-bottom:4px;">🎡 6. Vòng Quay May Mắn (Wheel of Names)</h4>
          <p style="font-size:13px; color:#475569; line-height:1.55; margin-bottom:8px;">Quay ngẫu nhiên chọn học sinh hoặc nhóm trả lời câu hỏi phản biện, tạo sự bất ngờ trong lớp.</p>
          <button class="btn btn-outline btn-sm" style="color:#b91c1c; border-color:#ef4444;" onclick="doInsertGame('wheel')">+ Chèn Vòng Quay May Mắn</button>
        </div>
      </div>
    </div>
  `;
}

function doInsertGame(gameType) {
  const targetActKey = document.getElementById("gameTargetAct")?.value || "act3";
  const act = state5512.editor[targetActKey];
  const t = state5512.editor.title;

  let snippet = "";
  if (gameType === "plickers") {
    snippet = `\n- [TÍCH HỢP TRÒ CHƠI THẺ PLICKERS]: Giáo viên chuẩn bị bộ 4 câu hỏi trắc nghiệm kiểm tra nhanh kiến thức về "${t}". Học sinh giơ thẻ Plickers xoay hướng đáp án (A, B, C, D). Giáo viên dùng camera smartphone quét toàn bộ lớp trong 15 giây, hệ thống tự động tổng hợp tỉ lệ đúng/sai trên màn hình Tivi.`;
  } else if (gameType === "kahoot") {
    snippet = `\n- [TÍCH HỢP ĐẤU TRƯỜNG KAHOOT]: Giáo viên cấp mã PIN phòng thi đấu Kahoot: "Chinh phục kiến thức ${t}". Học sinh dùng điện thoại/máy tính truy cập kahoot.it, thi đua trả lời nhanh và chính xác 5 câu hỏi trong 20s/câu để tranh ngôi vị Top 3 vinh danh.`;
  } else if (gameType === "quizizz") {
    snippet = `\n- [TÍCH HỢP TRÒ CHƠI QUIZIZZ TỰ HÀNH]: Giáo viên chia sẻ đường dẫn joinmyquiz.com cho bài học "${t}". Học sinh trả lời độc lập theo tốc độ cá nhân, xem giải thích chi tiết cho từng phương án và hoàn thành trước khi hết giờ.`;
  } else if (gameType === "bell") {
    snippet = `\n- [TÍCH HỢP TRÒ CHƠI RUNG CHUÔNG VÀNG NÔNG HỌC]: Cả lớp cùng tham gia trả lời nhanh trên bảng phụ cá nhân qua 5 câu hỏi tăng dần độ khó về "${t}". Học sinh trả lời sai tự giác hạ bảng, em cuối cùng trên sàn đấu nhận điểm thưởng chuyên cần.`;
  } else if (gameType === "box") {
    snippet = `\n- [TÍCH HỢP TRÒ CHƠI HỘP QUÀ BÍ MẬT]: Giáo viên chiếu 4 chiếc hộp màu sắc tương ứng 4 câu hỏi tình huống thực tế nông nghiệp của "${t}". Học sinh chọn hộp trả lời đúng sẽ nhận tràng pháo tay và phần quà học tập ngẫu nhiên.`;
  } else {
    snippet = `\n- [TÍCH HỢP VÒNG QUAY MAY MẮN (WHEEL OF NAMES)]: Giáo viên sử dụng vòng quay kỹ thuật số để chọn ngẫu nhiên học sinh đại diện nhóm lên bảng thuyết minh và trả lời câu hỏi chất vấn từ các nhóm bạn.`;
  }

  act.content += snippet;
  act.step1 += `\n* Giáo viên điều hành trò chơi tương tác, phổ biến luật chơi và thời gian.`;
  act.step3 += `\n* Hệ thống hiển thị bảng điểm xếp hạng và học sinh xuất sắc nhất.`;

  closeIntegrationsModal();
  renderLessonPlanEditorForm();

  alert(`Đã chèn kịch bản trò chơi vào ${act.name}!`);
}

// 2. Chèn Công nghệ số & Học liệu số
function openInsertTechModal() {
  const modal = document.getElementById("modal5512Backdrop");
  if (!modal) return;

  modal.style.display = "flex";
  modal.innerHTML = `
    <div class="modal-box" style="max-width:720px; width:92%; max-height:88vh; overflow-y:auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid var(--border); padding-bottom:10px;">
        <h3 style="color:#2563eb; margin:0;">💻 Chọn & Chèn Ứng Dụng Công Nghệ Số / AI vào Giáo Án</h3>
        <button class="btn btn-outline btn-sm" onclick="closeIntegrationsModal()">✕</button>
      </div>

      <div style="margin-bottom:14px;">
        <label style="font-weight:700; font-size:13px;">Chọn Hoạt động để chèn:</label>
        <select id="techTargetAct" class="input" style="padding:6px 10px; margin-top:4px;">
          <option value="act2" selected>Hoạt động 2: Hình thành kiến thức mới</option>
          <option value="act4">Hoạt động 4: Vận dụng & Tìm tòi mở rộng</option>
        </select>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px;">
        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:12px;">
          <h4 style="color:#1d4ed8; font-size:14px; margin-bottom:4px;">🎨 1. Canva Education (Thiết kế Infographic / Poster)</h4>
          <p style="font-size:13px; color:#475569; line-height:1.55; margin-bottom:8px;">Học sinh dùng Canva thiết kế áp phích tuyên truyền hoặc sơ đồ tư duy tóm tắt bài học.</p>
          <button class="btn btn-outline btn-sm" style="color:#1d4ed8; border-color:#3b82f6;" onclick="doInsertTech('canva')">+ Chèn Ứng dụng Canva</button>
        </div>

        <div style="background:#fdf2f8; border:1px solid #fbcfe8; border-radius:8px; padding:12px;">
          <h4 style="color:#be185d; font-size:14px; margin-bottom:4px;">📌 2. Padlet Tường Ảo (Cộng tác nhóm trực tuyến)</h4>
          <p style="font-size:13px; color:#475569; line-height:1.55; margin-bottom:8px;">Các nhóm đăng tải ảnh chụp sản phẩm thảo luận lên cùng một bảng tường số để cả lớp xem và bình luận.</p>
          <button class="btn btn-outline btn-sm" style="color:#be185d; border-color:#ec4899;" onclick="doInsertTech('padlet')">+ Chèn Tường ảo Padlet</button>
        </div>

        <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:8px; padding:12px;">
          <h4 style="color:#047857; font-size:14px; margin-bottom:4px;">🤖 3. Trợ lý Trí tuệ Nhân tạo (Gemini AI / AI Chatbot)</h4>
          <p style="font-size:13px; color:#475569; line-height:1.55; margin-bottom:8px;">Học sinh đóng vai kỹ sư nông nghiệp, nhập prompt hỏi AI về giải pháp kỹ thuật và đối chiếu với SGK.</p>
          <button class="btn btn-outline btn-sm" style="color:#047857; border-color:#10b981;" onclick="doInsertTech('ai')">+ Chèn Hoạt động Trợ lý AI</button>
        </div>

        <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:12px;">
          <h4 style="color:#b45309; font-size:14px; margin-bottom:4px;">🧪 4. Thí nghiệm Mô phỏng Ảo (Virtual Simulation)</h4>
          <p style="font-size:13px; color:#475569; line-height:1.55; margin-bottom:8px;">Mô phỏng đo độ chua/mặn, pha dung dịch dinh dưỡng hoặc quan sát chu trình khép kín trên máy tính.</p>
          <button class="btn btn-outline btn-sm" style="color:#b45309; border-color:#f59e0b;" onclick="doInsertTech('sim')">+ Chèn Thí nghiệm Ảo</button>
        </div>

        <div style="background:#f5f3ff; border:1px solid #ddd6fe; border-radius:8px; padding:12px;">
          <h4 style="color:#6d28d9; font-size:14px; margin-bottom:4px;">📲 5. Quét Mã QR Học Liệu Số & Video Thực Tế</h4>
          <p style="font-size:13px; color:#475569; line-height:1.55; margin-bottom:8px;">Giáo viên chèn mã QR vào góc bài giảng để học sinh quét xem video quy trình kỹ thuật 3D.</p>
          <button class="btn btn-outline btn-sm" style="color:#6d28d9; border-color:#8b5cf6;" onclick="doInsertTech('qr')">+ Chèn Mã QR Học Liệu</button>
        </div>

        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:12px;">
          <h4 style="color:#334155; font-size:14px; margin-bottom:4px;">📊 6. Mentimeter (Khảo sát Ý kiến & Word Cloud)</h4>
          <p style="font-size:13px; color:#475569; line-height:1.55; margin-bottom:8px;">Tạo đám mây từ khóa trực tiếp phản ánh nhận thức hoặc cảm nghĩ của học sinh sau bài học.</p>
          <button class="btn btn-outline btn-sm" style="color:#334155; border-color:#64748b;" onclick="doInsertTech('menti')">+ Chèn Mentimeter</button>
        </div>
      </div>
    </div>
  `;
}

function doInsertTech(techType) {
  const targetActKey = document.getElementById("techTargetAct")?.value || "act2";
  const act = state5512.editor[targetActKey];
  const t = state5512.editor.title;

  let snippet = "";
  if (techType === "canva") {
    snippet = `\n- [ỨNG DỤNG CANVA EDU]: Các nhóm sử dụng tài khoản Canva Education trên máy tính/điện thoại để thiết kế infographic (áp phích số) tóm tắt quy trình kỹ thuật của "${t}", tích hợp hình ảnh thực tế và xuất file PDF/ảnh nộp cho giáo viên.`;
  } else if (techType === "padlet") {
    snippet = `\n- [ỨNG DỤNG BẢNG TƯỜNG SỐ PADLET]: Giáo viên cung cấp mã QR đường link Padlet của lớp. Sau khi thảo luận nhóm xong, đại diện nhóm chụp ảnh sản phẩm giấy A0 hoặc bài viết và đăng tải lên Padlet, kèm tên thành viên nhóm để cả lớp bình chọn và góp ý.`;
  } else if (techType === "ai") {
    snippet = `\n- [TÍCH HỢP TRỢ LÝ TRÍ TUỆ NHÂN TẠO AI THEO QĐ 2422]: Học sinh trải nghiệm đặt câu hỏi cho trợ lý AI (Gemini/ChatGPT): "Gợi ý 3 biện pháp kỹ thuật công nghệ cao áp dụng cho ${t} phù hợp điều kiện thời tiết miền Đông Nam Bộ". Học sinh đối chiếu câu trả lời của AI với kiến thức SGK, đánh giá độ tin cậy và ghi nhận xét vào phiếu.`;
  } else if (techType === "sim") {
    snippet = `\n- [ỨNG DỤNG THÍ NGHIỆM MÔ PHỎNG ẢO]: Học sinh truy cập phần mềm mô phỏng nông nghiệp số để quan sát sự thay đổi chỉ số dinh dưỡng/môi trường trong điều kiện giả lập trước khi tiến hành thực hành thực tế.`;
  } else if (techType === "qr") {
    snippet = `\n- [ỨNG DỤNG QUÉT MÃ QR CODE]: Học sinh dùng camera điện thoại quét mã QR giáo viên chiếu trên slide để mở video tư liệu dài 3 phút quay tại trang trại nông nghiệp công nghệ cao, tự ghi chú lại 2 điểm ấn tượng nhất vào vở.`;
  } else {
    snippet = `\n- [ỨNG DỤNG MENTIMETER]: Học sinh truy cập menti.com nhập mã code để biểu quyết 1 từ khóa tâm đắc nhất về "${t}". Màn hình Tivi lập tức tổng hợp Đám mây từ khóa (Word Cloud) thể hiện cảm nhận chung của cả lớp.`;
  }

  act.content += snippet;
  act.step2 += `\n* Học sinh thao tác sử dụng công cụ số theo hướng dẫn, hoàn thành sản phẩm số của nhóm.`;

  closeIntegrationsModal();
  renderLessonPlanEditorForm();

  alert(`Đã chèn giải pháp công nghệ số vào ${act.name}!`);
}

// 3. Chèn Thực tiễn Nông nghiệp Địa phương & Môi trường
function insertLocalFarmingContext() {
  const t = state5512.editor.title;
  const snippet = `\n- [LIÊN HỆ THỰC TIỄN NÔNG NGHIỆP ĐỊA PHƯƠNG ĐỒNG NAI]: Học sinh tìm hiểu và liên hệ nội dung "${t}" với các mô hình kinh tế nông nghiệp thực tế tại huyện Lộc Ninh và tỉnh Đồng Nai (ví dụ: mô hình trồng sầu riêng VietGAP, chuối cấy mô xuất khẩu, chăn nuôi gia súc công nghiệp khép kín hoặc nuôi thủy sản nước ngọt/mặn), từ đó đề xuất giải pháp bảo vệ nguồn nước và giảm thiểu ô nhiễm môi trường đất.`;
  state5512.editor.act4.content += snippet;
  renderLessonPlanEditorForm();
  alert("Đã chèn nội dung Thực tiễn Nông nghiệp Địa phương vào Hoạt động 4: Vận dụng!");
}

// 4. Chèn Bảng Rubric Đánh giá Năng lực
function insertRubricEvaluation() {
  const snippet = `\n\n* BẢNG TIÊU CHÍ RUBRIC ĐÁNH GIÁ SẢN PHẨM / NĂNG LỰC HỌC SINH:
- Mức 1 (Chưa đạt): Chưa hoàn thành đầy đủ nhiệm vụ phiếu học tập; thông tin tra cứu chưa có chọn lọc.
- Mức 2 (Đạt): Trình bày đúng các kiến thức cơ bản trong SGK; biết dùng thiết bị số tra cứu thông tin theo từ khóa gợi ý.
- Mức 3 (Khá): Trình bày rõ ràng, mạch lạc; phân tích được mối quan hệ bản chất; sản phẩm nhóm trực quan, sạch đẹp.
- Mức 4 (Tốt): Sản phẩm sáng tạo (infographic/video); giải thích sâu sắc cơ sở khoa học; biết liên hệ thực tế địa phương và phản biện thuyết phục.`;
  
  state5512.editor.act2.step4 += snippet;
  renderLessonPlanEditorForm();
  alert("Đã chèn Bảng Tiêu chí Rubric Đánh giá Năng lực vào Hoạt động 2!");
}

// 5. Thêm Mẫu Giáo Án Tùy Chỉnh
function openAddTemplateModal() {
  const modal = document.getElementById("modal5512Backdrop");
  if (!modal) return;

  modal.style.display = "flex";
  modal.innerHTML = `
    <div class="modal-box" style="max-width:540px; width:90%;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid var(--border); padding-bottom:10px;">
        <h3 style="color:var(--primary-dark); margin:0;">+ Thêm Mẫu Giáo Án Tùy Chỉnh Của Trường / Cá Nhân</h3>
        <button class="btn btn-outline btn-sm" onclick="closeIntegrationsModal()">✕</button>
      </div>

      <div style="margin-bottom:12px;">
        <label style="font-size:13px; font-weight:700;">Tên mẫu giáo án:</label>
        <input type="text" id="newTmplName" class="input" placeholder="Ví dụ: Mẫu 5512 Rút gọn / Mẫu Dạy học STEM..." style="width:100%; margin-top:4px;" />
      </div>

      <div style="margin-bottom:14px;">
        <label style="font-size:13px; font-weight:700;">Đặc điểm / Ghi chú mẫu:</label>
        <textarea id="newTmplDesc" class="input" style="width:100%; min-height:80px; margin-top:4px;" placeholder="Ghi chú các yêu cầu riêng của tổ chuyên môn hoặc phòng GD&ĐT..."></textarea>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:8px;">
        <button class="btn btn-outline" onclick="closeIntegrationsModal()">Hủy</button>
        <button class="btn btn-primary" onclick="saveNewCustomTemplate()">Lưu Mẫu</button>
      </div>
    </div>
  `;
}

function saveNewCustomTemplate() {
  const name = document.getElementById("newTmplName")?.value.trim();
  const desc = document.getElementById("newTmplDesc")?.value.trim();
  if (!name) { alert("Vui lòng nhập tên mẫu giáo án!"); return; }

  const newId = "custom_" + Date.now();
  state5512.customTemplates.push({ id: newId, name: name, desc: desc });
  save5512Data();
  closeIntegrationsModal();
  render5512SubModule2();
  alert(`Đã thêm mẫu "${name}" thành công!`);
}
// ============================================================================
// TIỂU MỤC 2.3: HỌC LIỆU CHO GV (77 BÀI GẮN LINK DRIVE THAM KHẢO & TRÌNH CHIẾU)
// ============================================================================

function render5512SubModule3() {
  const container = document.getElementById("subTabContentArea");
  if (!container || typeof DATA_5512 === "undefined" || typeof PORTAL_DATA === "undefined") return;

  const g = state5512.currentGrade;
  const lessons = (PORTAL_DATA.lessons || []).filter(l => l.grade === g);
  const qSearch = (state5512.searchQuery || "").toLowerCase().trim();
  const filtered = lessons.filter(l => !qSearch || l.title.toLowerCase().includes(qSearch) || (l.chapter || "").toLowerCase().includes(qSearch));

  const folderLink = state5512.gradeFolderLinks[g] || "";
  const gradeLabel = g === "cn10" ? "Khối 10 — Công nghệ Trồng trọt (28 Bài)" :
                     g === "cn11" ? "Khối 11 — Công nghệ Chăn nuôi (22 Bài)" :
                     "Khối 12 — Lâm nghiệp & Thủy sản (27 Bài)";

  container.innerHTML = `
    <!-- HEADER KHO PPT & DRIVE -->
    <div class="card" style="margin-bottom:16px; background:#f0fdfa; border-left:4px solid var(--secondary);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <h3 style="color:var(--secondary); font-size:16px; margin:0 0 4px 0;">
            🖥️ KHO HỌC LIỆU CHO GV (77 BÀI GẮN LINK GOOGLE DRIVE THAM KHẢO & TRÌNH CHIẾU WEB)
          </h3>
          <p style="font-size:13px; color:var(--text-muted); margin:0;">
            Tập hợp trọn bộ 77 bài học liệu số cho Giáo viên cả 3 khối • Gắn link Google Drive cá nhân & mở trực tiếp • Trình chiếu tương tác không cần cài Office
          </p>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <a href="${escapeHtml(folderLink)}" target="_blank" class="btn btn-primary btn-sm" style="text-decoration:none;">
            ☁️ Mở Thư Mục Google Drive Cả Khối
          </a>
        </div>
      </div>
    </div>

    <!-- KHUNG ĐIỀU KHIỂN & GẮN LINK THƯ MỤC DRIVE CẢ KHỐI -->
    <div class="card" style="margin-bottom:16px; padding:14px 18px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:12px;">
        <!-- Chọn Khối -->
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span style="font-weight:700; color:var(--primary-dark); font-size:13px;">📚 Chọn Khối học liệu:</span>
          <button class="btn btn-sm ${g === 'cn10' ? 'btn-primary' : 'btn-outline'}" onclick="select5512Grade('cn10')">Học liệu Khối 10 (28 Bài)</button>
          <button class="btn btn-sm ${g === 'cn11' ? 'btn-primary' : 'btn-outline'}" onclick="select5512Grade('cn11')">Học liệu Khối 11 (22 Bài)</button>
          <button class="btn btn-sm ${g === 'cn12' ? 'btn-primary' : 'btn-outline'}" onclick="select5512Grade('cn12')">Học liệu Khối 12 (27 Bài)</button>
        </div>

        <!-- Tìm kiếm -->
        <div>
          <input type="text" placeholder="🔍 Tìm học liệu bài học..." style="padding:6px 12px; border-radius:6px; border:1px solid var(--border); font-size:13px; width:220px;" oninput="state5512.searchQuery=this.value; render5512SubModule3();" />
        </div>
      </div>

      <!-- Ô gắn link thư mục Google Drive cả khối -->
      <div style="background:#f8fafc; border:1px solid var(--border); border-radius:8px; padding:10px 14px; display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <span style="font-size:13px; font-weight:700; color:var(--text);">📂 Link Thư mục Google Drive của Thầy/Cô (${gradeLabel}):</span>
        <input type="text" id="gradeFolderInput" class="input" style="flex:1; min-width:260px; font-size:13px; padding:6px 10px;" value="${escapeHtml(folderLink)}" placeholder="https://drive.google.com/drive/folders/..." />
        <button class="btn btn-outline btn-sm" onclick="saveGradeFolderLink('${g}')">💾 Lưu Link Thư Mục</button>
      </div>
    </div>

    <!-- BẢNG DANH MỤC 77 BÀI GIẢNG GẮN LINK DRIVE & TRÌNH CHIẾU -->
    <div class="card">
      <div style="overflow-x:auto;">
        <table class="table" style="width:100%; font-size:13px; line-height:1.5;">
          <thead>
            <tr style="background:#0f766e; color:#fff;">
              <th style="width:50px; text-align:center;">Bài</th>
              <th style="min-width:220px;">Tên Bài học & Học liệu số</th>
              <th style="width:100px; text-align:center;">Số slide gốc</th>
              <th style="min-width:180px;">Link Google Drive tham khảo</th>
              <th style="min-width:240px;">Gắn Link Drive riêng của Thầy/Cô</th>
              <th style="width:170px; text-align:center;">Trình chiếu & File gốc</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(l => {
              const customKey = `${l.grade}_${l.id}`;
              const customUrl = state5512.customDriveLinks[customKey] || "";
              const refDriveUrl = `https://drive.google.com/drive/search?q=${encodeURIComponent(l.title)}`;

              return `
                <tr>
                  <td style="text-align:center; font-weight:700; font-size:14px; color:var(--primary);">${l.lesson || '–'}</td>
                  <td>
                    <div style="font-weight:700; color:var(--primary-dark); font-size:13.5px;">${escapeHtml(l.title)}</div>
                    <div style="font-size:12.5px; color:#64748b; margin-top:2px;">${escapeHtml(l.chapter || '')}</div>
                  </td>
                  <td style="text-align:center; font-weight:600; color:#0f766e;">📊 ${l.slideCount} slides</td>
                  
                  <!-- Link Drive tham khảo -->
                  <td>
                    <div style="display:flex; align-items:center; gap:6px;">
                      <a href="${refDriveUrl}" target="_blank" class="btn btn-outline btn-sm" style="font-size:11.5px; padding:3px 8px; text-decoration:none; color:#2563eb; border-color:#93c5fd;">
                        🔗 Mở Drive
                      </a>
                      <button class="btn btn-outline btn-sm" style="font-size:11.5px; padding:3px 8px;" onclick="copyToClipboard('${refDriveUrl}')">
                        📋 Copy
                      </button>
                    </div>
                  </td>

                  <!-- Link Drive cá nhân -->
                  <td>
                    <div style="display:flex; align-items:center; gap:6px;">
                      <input type="text" id="input_link_${customKey}" class="input" style="padding:4px 8px; font-size:12px; width:150px;" placeholder="Dán link Drive..." value="${escapeHtml(customUrl)}" />
                      <button class="btn btn-outline btn-sm" style="font-size:11.5px; padding:4px 8px;" onclick="saveCustomDriveLink('${customKey}')">
                        💾 Lưu
                      </button>
                      ${customUrl ? `<a href="${customUrl}" target="_blank" title="Mở link đã lưu" style="font-size:14px; text-decoration:none;">🚀</a>` : ''}
                    </div>
                  </td>

                  <!-- Trình chiếu & Tải gốc -->
                  <td style="text-align:center;">
                    <div style="display:flex; justify-content:center; gap:6px;">
                      <button class="btn btn-primary btn-sm" style="font-size:11.5px; padding:4px 8px;" onclick="openPptPresenterModal('${l.id}')">
                        👁️ Chiếu Web
                      </button>
                      <a href="file:///${l.fullPath ? l.fullPath.replace(/\\/g, '/') : ''}" class="btn btn-outline btn-sm" style="font-size:11.5px; padding:4px 8px; text-decoration:none;" title="Tải file PPTX gốc">
                        💾 Tải PPTX
                      </a>
                    </div>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function saveGradeFolderLink(g) {
  const input = document.getElementById("gradeFolderInput");
  if (!input) return;
  const val = input.value.trim();
  state5512.gradeFolderLinks[g] = val;
  save5512Data();
  alert("Đã lưu Link Thư mục Google Drive thành công!");
}

function saveCustomDriveLink(key) {
  const input = document.getElementById("input_link_" + key);
  if (!input) return;
  const val = input.value.trim();
  state5512.customDriveLinks[key] = val;
  save5512Data();
  render5512SubModule3();
  
  const toast = document.createElement("div");
  toast.style.cssText = "position:fixed; bottom:24px; right:24px; background:#0f766e; color:#fff; padding:12px 18px; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.2); z-index:9999; font-size:13.5px;";
  toast.innerHTML = "💾 <strong>Đã lưu link Google Drive học liệu của bài!</strong>";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Đã sao chép link vào bộ nhớ tạm:\n" + text);
  }).catch(() => {
    prompt("Sao chép link bên dưới:", text);
  });
}

// Modal Trình chiếu Slide PowerPoint trực quan trên Web
let currentModalSlideIdx = 0;
let modalTimerInterval = null;
let modalTimerSec = 0;

function openPptPresenterModal(lessonId) {
  const les = (PORTAL_DATA.lessons || []).find(l => l.id === lessonId);
  if (!les) return;

  currentModalSlideIdx = 0;
  clearInterval(modalTimerInterval);
  modalTimerSec = 0;

  const modal = document.getElementById("modal5512Backdrop");
  if (!modal) return;

  modal.style.display = "flex";
  renderPptModalContent(les);
}

function renderPptModalContent(les) {
  const modal = document.getElementById("modal5512Backdrop");
  if (!modal) return;

  const slides = les.slides || [];
  const sIdx = Math.min(currentModalSlideIdx, Math.max(0, slides.length - 1));
  const curSlide = slides[sIdx] || { num: 1, type: "cover", title: les.title, subtitle: les.chapter, bullets: [] };

  const bullets = curSlide.bullets || [];
  const quizLines = bullets.filter(b => b.startsWith("? ") || b.startsWith("[?] ") || b.startsWith("[!] ") || b.startsWith("Đáp án"));
  const normalBullets = bullets.filter(b => !quizLines.includes(b));
  const answerLines = bullets.filter(b => b.startsWith("Đáp án") || b.startsWith("=>") || b.startsWith("[!] "));

  modal.innerHTML = `
    <div class="modal-box" style="max-width:960px; width:95%; max-height:92vh; background:#0f172a; color:#fff; padding:20px; border-radius:12px; display:flex; flex-direction:column;">
      <!-- TOP BAR -->
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #334155; padding-bottom:10px; margin-bottom:12px;">
        <div>
          <span class="badge" style="background:#22c55e; color:#fff; font-size:11px; margin-right:8px;">HỌC LIỆU CHO GV</span>
          <strong style="color:#38bdf8; font-size:15px;">${escapeHtml(les.title)}</strong>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <!-- Bộ đếm giờ thảo luận -->
          <div id="modalTimerDisplay" style="background:#1e293b; padding:4px 10px; border-radius:6px; font-size:13px; color:#fde047; font-weight:700;">
            ⏱️ Đếm giờ: 00:00
          </div>
          <button class="btn btn-sm btn-outline" style="color:#fff; border-color:#475569;" onclick="startModalTimer(60)">1p</button>
          <button class="btn btn-sm btn-outline" style="color:#fff; border-color:#475569;" onclick="startModalTimer(120)">2p</button>
          <button class="btn btn-sm btn-outline" style="color:#fff; border-color:#475569;" onclick="startModalTimer(180)">3p</button>
          <button class="btn btn-sm btn-outline" style="color:#fff; border-color:#475569;" onclick="stopModalTimer()">Dừng</button>
          <button class="btn btn-sm btn-outline" style="color:#fff; border-color:#ef4444;" onclick="closeIntegrationsModal(); stopModalTimer();">✕ Đóng</button>
        </div>
      </div>

      <!-- SLIDE STAGE -->
      <div style="flex:1; background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border:1px solid #334155; border-radius:8px; padding:24px 30px; display:flex; flex-direction:column; justify-content:space-between; min-height:420px; overflow-y:auto;">
        <div>
          <div style="display:flex; justify-content:space-between; font-size:12px; color:#94a3b8; margin-bottom:8px;">
            <span>${escapeHtml(les.chapter || '')}</span>
            <span style="font-weight:700; color:#38bdf8;">SLIDE ${sIdx + 1} / ${slides.length}</span>
          </div>

          <h2 style="color:#f8fafc; font-size:20px; margin-bottom:16px; border-bottom:2px solid #22c55e; padding-bottom:8px;">
            ${escapeHtml(curSlide.title || les.title)}
          </h2>

          <div style="display:flex; flex-direction:column; gap:10px;">
            ${normalBullets.map(b => `
              <div style="display:flex; gap:10px; font-size:15px; color:#e2e8f0; line-height:1.6;">
                <span style="color:#4ade80;">✔</span>
                <div>${escapeHtml(b)}</div>
              </div>
            `).join("")}
          </div>

          <!-- PHẦN CÂU HỎI & ĐÁP ÁN TƯƠNG TÁC -->
          ${quizLines.length > 0 ? `
            <div style="margin-top:16px; background:rgba(30, 41, 59, 0.7); border:1px dashed #38bdf8; border-radius:8px; padding:12px 16px;">
              <div style="color:#38bdf8; font-weight:700; margin-bottom:6px;">❓ CÂU HỎI TƯƠNG TÁC TRÊN LỚP:</div>
              ${quizLines.filter(q => !q.startsWith("Đáp án")).map(q => `
                <div style="color:#f1f5f9; font-size:14.5px; margin-bottom:4px;">${escapeHtml(q)}</div>
              `).join("")}

              <div style="margin-top:10px;">
                <button class="btn btn-sm btn-accent" id="btnRevealAnswer" onclick="toggleModalAnswer()">
                  🎉 Bấm Hiện Đáp Án & Giải Thích
                </button>
                <div id="modalAnswerBox" style="display:none; margin-top:8px; padding:10px 14px; background:rgba(34, 197, 94, 0.2); border:1px solid #4ade80; border-radius:6px; color:#86efac; font-size:14.5px; font-weight:700;">
                  ${answerLines.map(a => `<div>${escapeHtml(a)}</div>`).join("")}
                </div>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- FOOTER ĐIỀU KHIỂN SLIDE -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #334155; padding-top:14px; margin-top:16px;">
          <button class="btn btn-outline" style="background:#1e293b; color:#fff; border-color:#475569;" onclick="changeModalSlide(-1, '${les.id}')" ${sIdx === 0 ? 'disabled' : ''}>
            ← Slide Trước
          </button>
          <div style="color:#94a3b8; font-size:12.5px;">
            💡 Thầy/Cô có thể dùng phím mũi tên <strong>←</strong> / <strong>→</strong> trên bàn phím để chuyển slide
          </div>
          <button class="btn btn-primary" onclick="changeModalSlide(1, '${les.id}')" ${sIdx === slides.length - 1 ? 'disabled' : ''}>
            Slide Kế Tiếp →
          </button>
        </div>
      </div>
    </div>
  `;
}

function changeModalSlide(delta, lessonId) {
  const les = (PORTAL_DATA.lessons || []).find(l => l.id === lessonId);
  if (!les || !les.slides) return;
  currentModalSlideIdx = Math.max(0, Math.min(les.slides.length - 1, currentModalSlideIdx + delta));
  renderPptModalContent(les);
}

function toggleModalAnswer() {
  const box = document.getElementById("modalAnswerBox");
  const btn = document.getElementById("btnRevealAnswer");
  if (!box || !btn) return;
  if (box.style.display === "none") {
    box.style.display = "block";
    btn.textContent = "🙈 Ẩn Đáp Án";
  } else {
    box.style.display = "none";
    btn.textContent = "🎉 Bấm Hiện Đáp Án & Giải Thích";
  }
}

function startModalTimer(sec) {
  clearInterval(modalTimerInterval);
  modalTimerSec = sec;
  updateModalTimerDisplay();
  modalTimerInterval = setInterval(() => {
    modalTimerSec--;
    updateModalTimerDisplay();
    if (modalTimerSec <= 0) {
      clearInterval(modalTimerInterval);
      alert("⏰ Hết thời gian thảo luận nhóm!");
    }
  }, 1000);
}

function stopModalTimer() {
  clearInterval(modalTimerInterval);
  const el = document.getElementById("modalTimerDisplay");
  if (el) el.textContent = "⏱️ Đếm giờ: Đã dừng";
}

function updateModalTimerDisplay() {
  const el = document.getElementById("modalTimerDisplay");
  if (!el) return;
  const m = String(Math.floor(modalTimerSec / 60)).padStart(2, "0");
  const s = String(modalTimerSec % 60).padStart(2, "0");
  el.textContent = `⏱️ Đang thảo luận: ${m}:${s}`;
}


// ============================================================================
// CÁC HÀM XUẤT FILE WORD (.DOC) CHUẨN QUY CÁCH CV 5512
// ============================================================================

// 1. Xuất từng Phụ lục
function exportPhuLucWord(plNum) {
  const g = state5512.currentGrade;
  const cfg = state5512.metaConfig;
  const gradeLabel = g === "cn10" ? "Lớp 10 (Trồng trọt)" : g === "cn11" ? "Lớp 11 (Chăn nuôi)" : "Lớp 12 (Lâm - Thủy sản)";
  const plTitle = plNum === 1 ? "PHỤ LỤC I - KẾ HOẠCH DẠY HỌC TỔ CHUYÊN MÔN" :
                  plNum === 2 ? "PHỤ LỤC II - KẾ HOẠCH HOẠT ĐỘNG GIÁO DỤC" :
                  "PHỤ LỤC III - KẾ HOẠCH GIÁO DỤC CÁ NHÂN GIÁO VIÊN";

  const tableArea = document.getElementById("plTableDisplayArea")?.innerHTML || "";

  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${plTitle} - ${gradeLabel}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.4; color: #000; }
        table { border-collapse: collapse; width: 100%; margin-top: 10px; }
        th, td { border: 1px solid #000; padding: 6px 8px; vertical-align: top; }
        th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
        .header-tbl { border: none !important; margin-bottom: 20px; }
        .header-tbl td { border: none !important; padding: 2px 0; }
        .text-center { text-align: center; }
        .text-bold { font-weight: bold; }
        .title { font-size: 15pt; font-weight: bold; text-align: center; margin: 15px 0 5px 0; text-transform: uppercase; }
        .subtitle { font-size: 12pt; font-style: italic; text-align: center; margin-bottom: 15px; }
      </style>
    </head>
    <body>
      <div class="WordSection1">
      <table class="header-tbl" style="width:100%;">
        <tr>
          <td style="width:45%; text-align:center;">
            <strong>${escapeHtml(cfg.school.toUpperCase())}</strong><br/>
            <strong>${escapeHtml(cfg.department.toUpperCase())}</strong><br/>
            --------------------
          </td>
          <td style="width:55%; text-align:center;">
            <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br/>
            <strong>Độc lập - Tự do - Hạnh phúc</strong><br/>
            --------------------
          </td>
        </tr>
      </table>

      ${tableArea}

      <table class="header-tbl" style="width:100%; margin-top:40px;">
        <tr>
          <td style="width:50%; text-align:center;">
            <strong>TỔ TRƯỞNG CHUYÊN MÔN</strong><br/>
            <em>(Ký và ghi rõ họ tên)</em><br/><br/><br/><br/>
            <strong>${escapeHtml(cfg.headName)}</strong>
          </td>
          <td style="width:50%; text-align:center;">
            <em>${escapeHtml(cfg.province)}, ngày 20 tháng 8 năm 2026</em><br/>
            <strong>GIÁO VIÊN BỘ MÔN</strong><br/>
            <em>(Ký và ghi rõ họ tên)</em><br/><br/><br/><br/>
            <strong>${escapeHtml(cfg.teacherName)}</strong>
          </td>
        </tr>
      </table>
          </div>
    </body>
    </html>
  `;

  downloadDocFile(docHtml, `PL${plNum}_${g}_CV5512_THPT_LocNinh.doc`);
}

// 2. Xuất Trọn bộ 3 Phụ lục (PL1 + PL2 + PL3) nộp Tổ trưởng
function exportFull3PhuLucWord() {
  const g = state5512.currentGrade;
  const cfg = state5512.metaConfig;
  const gradeLabel = g === "cn10" ? "Khối 10 (Công nghệ Trồng trọt)" : g === "cn11" ? "Khối 11 (Công nghệ Chăn nuôi)" : "Khối 12 (Lâm - Thủy sản)";

  // Tạm render 3 phụ lục để lấy HTML
  const dummy = document.createElement("div");
  renderPl1Table(dummy, g);
  const pl1Html = dummy.innerHTML;
  renderPl2Table(dummy, g);
  const pl2Html = dummy.innerHTML;
  renderPl3Table(dummy, g);
  const pl3Html = dummy.innerHTML;

  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>HO_SO_3_PHU_LUC_5512_${g.toUpperCase()}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.4; color: #000; }
        table { border-collapse: collapse; width: 100%; margin-top: 10px; }
        th, td { border: 1px solid #000; padding: 6px 8px; vertical-align: top; }
        th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
        .header-tbl { border: none !important; margin-bottom: 20px; }
        .header-tbl td { border: none !important; padding: 2px 0; }
        .page-break { page-break-before: always; }
      </style>
    </head>
    <body>
      <!-- TRANG BÌA HỒ SƠ -->
      <div style="text-align:center; padding-top:100px; padding-bottom:120px;">
        <div style="font-size:14pt; font-weight:bold;">SỞ GIÁO DỤC VÀ ĐÀO TẠO ${escapeHtml(cfg.province.toUpperCase())}</div>
        <div style="font-size:16pt; font-weight:bold;">${escapeHtml(cfg.school.toUpperCase())}</div>
        <div style="font-size:13pt; margin-top:10px;">${escapeHtml(cfg.department.toUpperCase())}</div>
        <div style="margin:40px auto; width:150px; border-bottom:2px solid #000;"></div>
        
        <h1 style="font-size:24pt; font-weight:bold; margin-top:60px; line-height:1.4;">
          HỒ SƠ KẾ HOẠCH DẠY HỌC & GIÁO DỤC<br/>
          (TRỌN BỘ PHỤ LỤC 1, 2, 3 THEO CÔNG VĂN 5512/BGDĐT-GDTrH)
        </h1>
        <div style="font-size:15pt; font-weight:bold; margin-top:20px; color:#15803d;">
          MÔN CÔNG NGHỆ NÔNG NGHIỆP — ${gradeLabel.toUpperCase()}
        </div>
        <div style="font-size:13pt; font-style:italic; margin-top:10px;">
          (Tích hợp Khung Năng lực số Bộ GD&ĐT & Khung Giáo dục AI theo QĐ 2422/QĐ-BGDĐT)
        </div>

        <div style="margin-top:120px; font-size:14pt; line-height:2;">
          <strong>Giáo viên thực hiện:</strong> ${escapeHtml(cfg.teacherName)}<br/>
          <strong>Tổ trưởng chuyên môn:</strong> ${escapeHtml(cfg.headName)}<br/>
          <strong>Năm học:</strong> ${escapeHtml(cfg.schoolYear)}
        </div>
      </div>

      <!-- PHỤ LỤC 1 -->
      <div class="page-break"></div>
      ${pl1Html}

      <!-- PHỤ LỤC 2 -->
      <div class="page-break"></div>
      ${pl2Html}

      <!-- PHỤ LỤC 3 -->
      <div class="page-break"></div>
      ${pl3Html}

      <!-- CHỮ KÝ PHÊ DUYỆT -->
      <table class="header-tbl" style="width:100%; margin-top:50px;">
        <tr>
          <td style="width:33%; text-align:center;">
            <strong>GIÁO VIÊN BỘ MÔN</strong><br/>
            <em>(Ký và ghi rõ họ tên)</em><br/><br/><br/><br/>
            <strong>${escapeHtml(cfg.teacherName)}</strong>
          </td>
          <td style="width:33%; text-align:center;">
            <strong>TỔ TRƯỞNG CHUYÊN MÔN</strong><br/>
            <em>(Ký và ghi rõ họ tên)</em><br/><br/><br/><br/>
            <strong>${escapeHtml(cfg.headName)}</strong>
          </td>
          <td style="width:34%; text-align:center;">
            <em>${escapeHtml(cfg.province)}, ngày 25 tháng 8 năm 2026</em><br/>
            <strong>HIỆU TRƯỞNG DUYỆT</strong><br/>
            <em>(Ký, đóng dấu và ghi rõ họ tên)</em><br/><br/><br/><br/>
            <strong>${escapeHtml(cfg.principalName)}</strong>
          </td>
        </tr>
      </table>
          </div>
    </body>
    </html>
  `;

  downloadDocFile(docHtml, `TRON_BO_3_PHU_LUC_5512_${g.toUpperCase()}_THPT_LOC_NINH.doc`);
}

// 3. Xuất Giáo Án (Kế hoạch bài dạy) Chuẩn 5512
function exportLessonPlanWord() {
  const ed = state5512.editor;
  const cfg = state5512.metaConfig;

  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>GIAO_AN_5512_${escapeHtml(ed.title)}</title>
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
        div.WordSection1 { page: WordSection1; }
        body { font-family: 'Times New Roman', Times, serif; font-size: 13pt; line-height: 1.3; color: #000; text-align: justify; }
        p { font-family: 'Times New Roman', Times, serif; font-size: 13pt; line-height: 1.3; margin: 0 0 5pt 0; text-align: justify; }
        table { border-collapse: collapse; width: 100%; margin-top: 8pt; margin-bottom: 8pt; font-family: 'Times New Roman', Times, serif; }
        th, td { border: 1px solid #000; padding: 5pt 7pt; vertical-align: top; font-size: 12pt; line-height: 1.25; }
        th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
        thead { display: table-header-group; }
        tr { page-break-inside: avoid; }
        .header-tbl { border: none !important; margin-bottom: 15px; }
        .header-tbl td { border: none !important; padding: 2px 0; font-size: 12pt; }
        .title { font-size: 14pt; font-weight: bold; text-align: center; margin: 14pt 0 4pt 0; text-transform: uppercase; }
        .sec-title { font-size: 13.5pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt; color: #000; text-transform: uppercase; page-break-after: avoid; }
        .act-box { border: 1px solid #000; padding: 10pt; margin-top: 10pt; margin-bottom: 10pt; page-break-inside: avoid; }
        .page-break { page-break-before: always; mso-break-type: section-break; }
      </style>
    </head>
    <body>
      <div class="WordSection1">
      <table class="header-tbl" style="width:100%;">
        <tr>
          <td style="width:45%; text-align:center;">
            <strong>${escapeHtml(cfg.school.toUpperCase())}</strong><br/>
            <strong>${escapeHtml(cfg.department.toUpperCase())}</strong><br/>
            --------------------
          </td>
          <td style="width:55%; text-align:center;">
            <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br/>
            <strong>Độc lập - Tự do - Hạnh phúc</strong><br/>
            --------------------
          </td>
        </tr>
      </table>

      <div style="font-size:12pt; text-align:right; margin-bottom:10px;">
        <em>Họ và tên giáo viên:</em> <strong>${escapeHtml(cfg.teacherName)}</strong>
      </div>

      <div class="title">KẾ HOẠCH BÀI DẠY (GIÁO ÁN)</div>
      <div style="text-align:center; font-size:14pt; font-weight:bold; margin-bottom:4px;">
        ${escapeHtml(ed.title).toUpperCase()}
      </div>
      <div style="text-align:center; font-size:12pt; font-style:italic; margin-bottom:20px;">
        Thời gian thực hiện: ${ed.periods} tiết (${escapeHtml(ed.week)}) • Chuẩn Công văn 5512/BGDĐT-GDTrH
      </div>

      <div class="sec-title">I. MỤC TIÊU DẠY HỌC</div>
      <p><strong>1. Kiến thức:</strong></p>
      <div style="padding-left:15px; white-space:pre-line;">${escapeHtml(ed.yccd)}</div>

      <p style="margin-top:8px;"><strong>2. Năng lực:</strong></p>
      <div style="padding-left:15px;">
        <p><strong>a) Năng lực chung:</strong><br/>
        - Tự chủ và tự học: Tự giác tìm tòi, khai thác thông tin từ SGK và tài liệu số, hoàn thành đúng hạn nhiệm vụ học tập.<br/>
        - Giao tiếp và hợp tác: Làm việc nhóm hiệu quả, lắng nghe, phản biện mang tính xây dựng và tự tin báo cáo.<br/>
        - Giải quyết vấn đề và sáng tạo: Phân tích thực tế nông nghiệp và đề xuất các giải pháp kỹ thuật thích ứng.</p>
        
        <p><strong>b) Năng lực đặc thù môn Công nghệ (Trồng trọt):</strong><br/>
        - Nhận thức công nghệ: Trình bày được bản chất khoa học và quy trình kỹ thuật nông nghiệp hiện đại.<br/>
        - Sử dụng công nghệ: Vận dụng đúng quy trình, thực hiện an toàn lao động và bảo vệ môi trường.<br/>
        - Đánh giá công nghệ: Nhận diện khách quan ưu nhược điểm của các giải pháp công nghệ cao.</p>

        ${ed.nlsGoal ? `<p><strong>c) Năng lực số (NLS):</strong><br/>${escapeHtml(ed.nlsGoal)}</p>` : ''}
        ${ed.aiGoal ? `<p><strong>d) Giáo dục AI (Khung QĐ 2422/QĐ-BGDĐT):</strong><br/>${escapeHtml(ed.aiGoal)}</p>` : ''}
      </div>

      <p style="margin-top:8px;"><strong>3. Phẩm chất:</strong></p>
      <div style="padding-left:15px;">${escapeHtml(ed.qualities)}</div>

      <div class="sec-title">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU SỐ</div>
      <p><strong>1. Đối với Giáo viên:</strong></p>
      <div style="padding-left:15px; white-space:pre-line;">${escapeHtml(ed.teacherEq)}</div>
      <p style="margin-top:6px;"><strong>2. Đối với Học sinh:</strong></p>
      <div style="padding-left:15px; white-space:pre-line;">${escapeHtml(ed.studentEq)}</div>

      <div class="sec-title">III. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG SƯ PHẠM)</div>

      ${[1, 2, 3, 4].map(idx => {
        const act = ed['act' + idx];
        return `
          <div class="act-box">
            <div style="font-weight:bold; font-size:13pt; margin-bottom:8px;">${escapeHtml(act.name)}</div>
            <p><strong>a) Mục tiêu:</strong> ${escapeHtml(act.goal)}</p>
            <p><strong>b) Nội dung:</strong> ${escapeHtml(act.content)}</p>
            <p><strong>c) Sản phẩm:</strong> ${escapeHtml(act.product)}</p>
            <p><strong>d) Tổ chức thực hiện:</strong></p>
            <div style="padding-left:15px;">
              <p><strong>- Bước 1: Chuyển giao nhiệm vụ:</strong> ${escapeHtml(act.step1)}</p>
              <p><strong>- Bước 2: Thực hiện nhiệm vụ:</strong> ${escapeHtml(act.step2)}</p>
              <p><strong>- Bước 3: Báo cáo, thảo luận:</strong> ${escapeHtml(act.step3)}</p>
              <p><strong>- Bước 4: Kết luận, nhận định:</strong> ${escapeHtml(act.step4)}</p>
            </div>
          </div>
        `;
      }).join("")}

      ${ed.attachments ? `
        <div style="page-break-before:always;"></div>
        <div class="sec-title">IV. HỒ SƠ DẠY HỌC & ĐÁNH GIÁ ĐÍNH KÈM</div>
        <div style="border:1px solid #000; padding:10px; margin-top:10px;">
          <div style="font-weight:bold; margin-bottom:4px;">1. PHIẾU HỌC TẬP SỐ 1:</div>
          <div style="white-space:pre-line; font-size:12pt; padding-left:10px;">${escapeHtml(ed.attachments.worksheet1)}</div>
        </div>
        <div style="border:1px solid #000; padding:10px; margin-top:10px;">
          <div style="font-weight:bold; margin-bottom:4px;">2. PHIẾU HỌC TẬP SỐ 2:</div>
          <div style="white-space:pre-line; font-size:12pt; padding-left:10px;">${escapeHtml(ed.attachments.worksheet2)}</div>
        </div>
        <div style="border:1px solid #000; padding:10px; margin-top:10px;">
          <div style="font-weight:bold; margin-bottom:4px;">3. BẢNG TIÊU CHÍ RUBRIC ĐÁNH GIÁ HOẠT ĐỘNG NHÓM:</div>
          <div style="white-space:pre-line; font-size:12pt; padding-left:10px;">${escapeHtml(ed.attachments.rubric)}</div>
        </div>
      ` : ''}

      <table class="header-tbl" style="width:100%; margin-top:40px;">
        <tr>
          <td style="width:50%; text-align:center;">
            <strong>TỔ TRƯỞNG CHUYÊN MÔN DUYỆT</strong><br/>
            <em>(Ký và ghi rõ họ tên)</em><br/><br/><br/><br/>
            <strong>${escapeHtml(cfg.headName)}</strong>
          </td>
          <td style="width:50%; text-align:center;">
            <em>${escapeHtml(cfg.province)}, ngày 20 tháng 8 năm 2026</em><br/>
            <strong>GIÁO VIÊN SOẠN BÀI</strong><br/>
            <em>(Ký và ghi rõ họ tên)</em><br/><br/><br/><br/>
            <strong>${escapeHtml(cfg.teacherName)}</strong>
          </td>
        </tr>
      </table>
          </div>
    </body>
    </html>
  `;

  downloadDocFile(docHtml, `GIAO_AN_5512_${escapeHtml(ed.title.replace(/[\s\.\:\/\\]+/g, '_'))}.doc`);
}


function downloadDocFile(htmlContent, fileName) {
  const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
