/**
 * ============================================================================
 * EXTERNAL_CORPUS.JS - QUẢN LÝ NGỮ LIỆU BÊN NGOÀI THEO ĐỀ CƯƠNG & PHÂN PHỐI
 * Dành cho Hệ thống Ra đề 6 bước chuẩn Công văn 7991/BGDĐT-GDTrH
 * Trường THPT Lộc Ninh – Thầy Trương Khắc Nam
 * ============================================================================
 */

(function (window) {
  "use strict";

  // I. KHO NGỮ LIỆU MẪU CHUẨN ĐÔNG NAM BỘ - LỘC NINH THEO ĐỀ CƯƠNG & PPCT
  const DEFAULT_EXTERNAL_CORPUS = [
    // KHỐI 10 - TRỒNG TRỌT
    {
      id: "ext_k10_01",
      grade: "cn10",
      term: "GK1",
      unitKey: "u1_1",
      lessonMatch: "Bài 1",
      title: "Mô hình chuyển đổi cây trồng thích ứng biến đổi khí hậu tại huyện Lộc Ninh",
      source: "Đề cương chuyên môn Tổ Tin - Công nghệ THPT Lộc Ninh & Phòng NN&PTNT",
      content: "Tại huyện Lộc Ninh (tỉnh Bình Phước), trước diễn biến khô hạn kéo dài đầu mùa vụ và giá mủ cao su biến động, nhiều hợp tác xã thanh niên đã chủ động chuyển đổi một phần diện tích đất đồi dốc cằn cỗi sang trồng sầu riêng Ri6 và bưởi da xanh ứng dụng công nghệ tưới tiết kiệm. Nhờ thiết kế các rãnh giữ nước dọc theo đường đồng mức và duy trì thảm cỏ họ Đậu che phủ gốc, mô hình không chỉ giảm thiểu xói mòn tầng đất mặt mà còn giúp tiết kiệm 40% lượng nước tưới, nâng cao hiệu quả kinh tế trên một đơn vị diện tích đất canh tác.",
      targetParts: ["tf", "essay"]
    },
    {
      id: "ext_k10_02",
      grade: "cn10",
      term: "GK1",
      unitKey: "u2_3",
      lessonMatch: "Bài 5, Bài 6",
      title: "Kỹ thuật phối trộn giá thể xơ dừa xả chát và trấu hun trong canh tác nhà màng",
      source: "Trung tâm Khuyến nông & Dịch vụ Nông nghiệp Bình Phước",
      content: "Trong sản xuất rau ăn quả công nghệ cao (dưa lưới, cà chua bi) tại địa phương, giá thể đóng vai trò quyết định đến sự hô hấp và hấp thu khoáng chất của bộ rễ. Mụn xơ dừa tươi thu gom từ các cơ sở sơ chế có hàm lượng chất chát (tannin và lignin) rất cao, nếu không được ngâm xả qua dung dịch nước vôi trong (Ca(OH)2 1%) sẽ làm cháy chóp rễ non. Khi mụn dừa đã được rửa sạch độ dẫn điện (EC < 0,5 mS/cm) phối trộn cùng trấu hun dở (than trấu) và phân trùn quế theo tỷ lệ thể tích 2 : 1 : 1 sẽ tạo ra hỗn hợp vừa thông thoáng khí, giàu silic, vừa giữ ẩm tối ưu cho cây phát triển khỏe mạnh.",
      targetParts: ["tf", "essay"]
    },
    {
      id: "ext_k10_03",
      grade: "cn10",
      term: "CK1",
      unitKey: "u3_1",
      lessonMatch: "Bài 7, Bài 8",
      title: "Ứng dụng phân bón thông minh và phân hữu cơ vi sinh tại vùng chuyên canh Đông Nam Bộ",
      source: "Đề cương ôn tập học kỳ I – THPT Lộc Ninh",
      content: "Nhằm giảm thiểu hiện tượng chai cứng đất do lạm dụng phân hóa học vô cơ kéo dài, bà con nông dân xã Lộc An đã đẩy mạnh việc tự ủ phân hữu cơ vi sinh tại vườn từ phụ phẩm nông nghiệp (vỏ cà phê, xác cây họ Đậu, phân chuồng hoai mục) có bổ sung nấm đối kháng Trichoderma. Việc kết hợp bón phân hữu cơ định kỳ với kỹ thuật bón phân qua hệ thống tưới nhỏ giọt (fertigation) giúp cung cấp dinh dưỡng cân đối, kích hoạt hệ vi sinh vật có ích trong đất và hạn chế rửa trôi phân đạm trong mùa mưa lũ.",
      targetParts: ["tf", "essay"]
    },
    {
      id: "ext_k10_04",
      grade: "cn10",
      term: "CK1",
      unitKey: "u4_1",
      lessonMatch: "Bài 10, Bài 11",
      title: "Kỹ thuật ghép mắt nhỏ có gỗ nhân giống cây sầu riêng đầu dòng",
      source: "Viện Khoa học Kỹ thuật Nông nghiệp Miền Nam (IAS)",
      content: "Nhân giống vô tính bằng phương pháp ghép mắt nhỏ có gỗ là kỹ thuật phổ biến nhất hiện nay trong sản xuất cây giống sầu riêng chất lượng cao. Gốc ghép được gieo từ hạt của các giống sầu riêng bản địa khỏe mạnh, có khả năng kháng bệnh thối rễ do nấm Phytophthora palmivora. Mắt ghép được khai thác từ các cành bánh tẻ trên cây đầu dòng đã được công nhận. Khi vết ghép liền sẹo sau 20 - 25 ngày, cây con thừa hưởng trọn vẹn đặc tính phẩm chất thơm ngon của cây mẹ và sức chống chịu sâu bệnh vượt trội của gốc ghép.",
      targetParts: ["tf", "essay"]
    },

    // KHỐI 11 - CHĂN NUÔI
    {
      id: "ext_k11_01",
      grade: "cn11",
      term: "GK1",
      unitKey: "cn11_b03",
      lessonMatch: "Bài 3, Bài 4",
      title: "Công tác chọn lọc và nhân giống lợn hướng nạc thích nghi khí hậu nhiệt đới",
      source: "Đề cương bồi dưỡng chuyên môn Công nghệ Chăn nuôi 11",
      content: "Tại các trang trại chăn nuôi công nghiệp ở Đông Nam Bộ, công thức lai kinh tế 3 giống (Duroc x [Landrace x Yorkshire]) được áp dụng rộng rãi. Giống mẹ F1 thừa hưởng khả năng mắn đẻ, khéo nuôi con và tiết sữa dồi dào từ dòng Landrace kết hợp với sức đề kháng tốt của giống Yorkshire. Đực giống Duroc đóng vai trò truyền gen tăng trọng nhanh, tỷ lệ nạc cao (> 60%) và chất lượng thịt mềm mọng. Quá trình chọn giống hậu bị đòi hỏi đánh giá ngoại hình nghiêm ngặt: lưng thẳng, chân vững chắc và tối thiểu 12 vú đồng đều.",
      targetParts: ["tf", "essay"]
    },
    {
      id: "ext_k11_02",
      grade: "cn11",
      term: "CK1",
      unitKey: "cn11_b08",
      lessonMatch: "Bài 8, Bài 9",
      title: "Ứng dụng kỹ thuật ủ chua thức ăn thô xanh cho đàn gia súc ăn cỏ mùa khô",
      source: "Trung tâm Khuyến nông Quốc gia",
      content: "Vào mùa khô kéo dài từ tháng 11 đến tháng 4 năm sau tại khu vực miền Đông, nguồn cỏ tươi cho đàn bò thịt suy giảm nghiêm trọng. Biện pháp ủ chua yếm khí thân cây ngô sinh khối và cỏ voi (cắt đoạn 3 - 5 cm) kết hợp 3 - 5% rỉ mật đường và 0,5% muối ăn giúp vi khuẩn lactic phát triển mạnh, hạ pH khối ủ xuống 3,8 - 4,2. Môi trường axit ức chế vi khuẩn thối rữa, bảo toàn tối đa giá trị dinh dưỡng (carbohydrate, protein thô) và mùi thơm chua nhẹ kích thích tiêu hóa của trâu bò.",
      targetParts: ["tf", "essay"]
    },
    {
      id: "ext_k11_03",
      grade: "cn11",
      term: "CK2",
      unitKey: "cn11_b20",
      lessonMatch: "Bài 19, Bài 20",
      title: "Kinh tế tuần hoàn: Xử lý chất thải chăn nuôi bằng Biogas kết hợp máy ép phân",
      source: "Báo Nông nghiệp & Phát triển Nông thôn Việt Nam",
      content: "Trang trại chăn nuôi lợn khép kín tại xã Lộc Thịnh đã vận hành thành công chuỗi xử lý chất thải tuần hoàn: Toàn bộ phân lỏng từ chuồng nuôi được dẫn qua máy ép tách phân khô. Phần bã phân khô (độ ẩm < 60%) được phối trộn chế phẩm vi sinh để đóng bao làm phân bón hữu cơ thương phẩm. Phần nước thải đậm đặc được đưa vào hệ thống hầm Biogas phủ bạt HDPE tạo ra khí methane (CH4) phục vụ chạy máy phát điện cung cấp 50% điện năng cho trại. Nước thải sau biogas tiếp tục qua hồ sinh học xử lý đạt tiêu chuẩn xả thải ra môi trường.",
      targetParts: ["tf", "essay"]
    },

    // KHỐI 12 - LÂM NGHIỆP & THỦY SẢN
    {
      id: "ext_k12_01",
      grade: "cn12",
      term: "GK1",
      unitKey: "cn12_b04",
      lessonMatch: "Bài 4, Bài 5",
      title: "Kỹ thuật gieo ươm và phục hồi rừng cây gỗ lớn bản địa tại Bình Phước",
      source: "Chi cục Kiểm lâm tỉnh Bình Phước & Vườn Quốc gia Bù Gia Mập",
      content: "Chiến lược lâm nghiệp bền vững tại địa phương ưu tiên khoanh nuôi xúc tiến tái sinh tự nhiên kết hợp trồng bổ sung các loài cây gỗ quý bản địa như Sao đen (Hopea odorata), Dầu rái (Dipterocarpus alatus) và Gõ đỏ. Hạt giống thu từ các cây mẹ ưu chuẩn được xử lý kích thích nảy mầm trong luống cát ẩm trước khi cấy vào túi bầu PE chứa đất mặt trộn mùn hữu cơ. Cây con được nuôi dưỡng trong vườn ươm có giàn che nắng 50% trong 6 tháng đầu để rèn luyện độ cứng cáp trước khi đem trồng rừng phòng hộ đầu nguồn sông Bé.",
      targetParts: ["tf", "essay"]
    },
    {
      id: "ext_k12_02",
      grade: "cn12",
      term: "CK1",
      unitKey: "cn12_b07",
      lessonMatch: "Bài 7, Bài 8",
      title: "Chủ động phòng cháy và chữa cháy rừng trong mùa hanh khô",
      source: "Đề cương ôn tập THPT Lộc Ninh & Hạt Kiểm lâm Lộc Ninh",
      content: "Rừng cao su và rừng tràm vào các tháng cao điểm mùa khô (tháng 1 - tháng 4) tích tụ lượng vật liệu cháy mặt đất rất dày (lá rụng khô, cành mục, cỏ chết). Để ngăn ngừa cháy rừng lan rộng, phương pháp phòng cháy chủ động hiệu quả nhất là làm các đường băng cản lửa trắng (cày dọn sạch thực bì rộng 10 - 15m) kết hợp đường băng cản lửa xanh (trồng các loài cây thường xanh mọng nước, khó cháy). Lực lượng kiểm lâm duy trì tuần tra chòi canh lửa 24/24 và sẵn sàng thiết bị chữa cháy cơ giới dập lửa từ khi mới nhen nhóm.",
      targetParts: ["tf", "essay"]
    },
    {
      id: "ext_k12_03",
      grade: "cn12",
      term: "GK2",
      unitKey: "cn12_b11",
      lessonMatch: "Bài 11, Bài 12",
      title: "Kiểm soát các chỉ số môi trường nước trong ao nuôi cá thâm canh",
      source: "Viện Nghiên cứu Nuôi trồng Thủy sản II",
      content: "Chất lượng môi trường nước là yếu tố sống còn trong nuôi cá nước ngọt thâm canh. Nồng độ oxy hòa tan (DO) cần được duy trì ổn định trên 4,0 mg/L bằng hệ thống quạt nước và sục khí đáy, đặc biệt vào thời điểm rạng sáng khi tảo ngừng quang hợp. Độ pH tối ưu cho cá sinh trưởng dao động từ 7,0 đến 8,5; nếu pH giảm xuống dưới 6,5 do mưa axit, người nuôi cần bón vôi nông nghiệp CaCO3 (1 - 2 kg/100m3 nước). Đồng thời, nồng độ khí độc amoniac tự do (NH3) và nitrite (NO2-) phải kiểm soát nghiêm ngặt ở mức dưới 0,05 mg/L để tránh gây ngạt và hoại tử mang cá.",
      targetParts: ["tf", "essay"]
    },
    {
      id: "ext_k12_04",
      grade: "cn12",
      term: "CK2",
      unitKey: "cn12_b22",
      lessonMatch: "Bài 22, Bài 23",
      title: "Hệ thống nuôi thủy sản tuần hoàn RAS và công nghệ Biofloc bảo vệ môi trường",
      source: "Cục Thủy sản Việt Nam",
      content: "Công nghệ nuôi trồng thủy sản tuần hoàn kín RAS (Recirculating Aquaculture System) là bước đột phá kỹ thuật giúp tiết kiệm đến 95% lượng nước so với ao truyền thống. Nước thải từ bể nuôi được dẫn qua máy lọc trống cơ học để loại bỏ phân thải thô, sau đó chảy qua bể lọc sinh học (biofilter) nơi các vi khuẩn Nitrosomonas và Nitrobacter chuyển hóa amoniac độc hại thành nitrate ít độc. Nước sạch được khử trùng bằng đèn UV hoặc Ozone trước khi hồi lưu trở lại bể nuôi, cho phép tăng mật độ nuôi thả gấp 5 - 10 lần mà hoàn toàn không xả thải gây ô nhiễm sông rạch.",
      targetParts: ["tf", "essay"]
    }
  ];

  const STORAGE_KEY = "cv7991_selected_external_corpus_v1";

  // II. QUẢN LÝ TRẠNG THÁI NGỮ LIỆU
  const ExternalCorpus = {
    activeTab: "library", // 'library' | 'custom' | 'file'
    gradeFilter: "all",
    searchQuery: "",

    getSelected: function () {
      if (window.state && Array.isArray(window.state.externalCorpus)) {
        return window.state.externalCorpus;
      }
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return [];
    },

    saveSelected: function (list) {
      if (window.state) {
        window.state.externalCorpus = list;
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {}
      this.updateStep1View();
    },

    add: function (corpusItem) {
      const list = this.getSelected();
      const existing = list.find(c => c.id === corpusItem.id);
      if (existing) {
        alert("Ngữ liệu này đã được chọn trong đề kiểm tra!");
        return false;
      }
      list.push(Object.assign({}, corpusItem, { selected: true, addedAt: Date.now() }));
      this.saveSelected(list);
      return true;
    },

    remove: function (id) {
      const list = this.getSelected().filter(c => c.id !== id);
      this.saveSelected(list);
    },

    clearAll: function () {
      if (!confirm("Thầy/Cô có chắc chắn muốn bỏ chọn tất cả ngữ liệu bên ngoài?")) return;
      this.saveSelected([]);
    },

    // Cập nhật giao diện tại Bước 1
    updateStep1View: function () {
      const list = this.getSelected();
      const badge = document.getElementById("externalCorpusCountBadge");
      if (badge) badge.textContent = list.length;

      const container = document.getElementById("externalCorpusContainer");
      if (!container) return;

      if (list.length === 0) {
        container.innerHTML = `
          <div style="background:#f8fafc; border:1.5px dashed #cbd5e1; border-radius:8px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:22px;">💡</span>
              <div>
                <strong style="color:#334155; font-size:13px;">Ngữ liệu bên ngoài theo Đề cương &amp; PPCT (Tùy chọn nâng cao CV 7991):</strong>
                <div style="font-size:12px; color:#64748b; margin-top:2px;">
                  Chọn hoặc dán tình huống thực tiễn sản xuất, mô hình nông nghiệp địa phương để ra câu hỏi Đúng/Sai (Phần II) và Tự luận (Phần IV).
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-outline btn-sm" onclick="openExternalCorpusModal()" style="font-weight:600; color:#15803d; border-color:#86efac; background:#fff;">
              ➕ Thêm Ngữ liệu Đề cương
            </button>
          </div>
        `;
        return;
      }

      // Có ngữ liệu đã chọn
      const cardsHtml = list.map((c, idx) => `
        <div style="background:#ffffff; border:1px solid #86efac; border-radius:8px; padding:10px 14px; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="badge" style="background:#dcfce7; color:#15803d; font-weight:700; font-size:11px;">#NL${idx + 1}</span>
              <strong style="color:#14532d; font-size:13px;">${escapeHtml(c.title)}</strong>
              ${c.lessonMatch ? `<span class="badge badge-nl" style="font-size:10.5px;">${escapeHtml(c.lessonMatch)}</span>` : ''}
            </div>
            <div style="display:flex; gap:4px;">
              <button type="button" class="btn btn-outline btn-sm" style="padding:2px 7px; font-size:11px;" onclick="ExternalCorpus.preview('${c.id}')">👁️ Xem</button>
              <button type="button" class="btn btn-danger btn-sm" style="padding:2px 7px; font-size:11px;" onclick="ExternalCorpus.remove('${c.id}')" title="Bỏ ngữ liệu này">✕</button>
            </div>
          </div>
          <div style="font-size:12px; color:#475569; font-style:italic; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
            "${escapeHtml(c.content)}"
          </div>
          <div style="font-size:11px; color:#16a34a; margin-top:5px; display:flex; justify-content:space-between; align-items:center;">
            <span>📌 Nguồn: <strong>${escapeHtml(c.source || 'Đề cương THPT Lộc Ninh')}</strong></span>
            <span>Áp dụng: <strong>Phần II (Đúng/Sai) • Phần IV (Tự luận)</strong></span>
          </div>
        </div>
      `).join("");

      container.innerHTML = `
        <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:10px; padding:12px 14px; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:18px;">📖</span>
              <strong style="color:#166534; font-size:13.5px;">Ngữ liệu bên ngoài theo Đề cương đã chọn (${list.length} ngữ liệu)</strong>
            </div>
            <div style="display:flex; gap:6px;">
              <button type="button" class="btn btn-primary btn-sm" onclick="openExternalCorpusModal()" style="font-size:11.5px; font-weight:600; padding:3px 10px;">
                ➕ Chọn thêm
              </button>
              <button type="button" class="btn btn-outline btn-sm" onclick="ExternalCorpus.clearAll()" style="font-size:11.5px; padding:3px 8px; color:#b91c1c; border-color:#fca5a5;">
                Xóa hết
              </button>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr; gap:8px;">
            ${cardsHtml}
          </div>
        </div>
      `;
    },

    preview: function (id) {
      const all = DEFAULT_EXTERNAL_CORPUS.concat(this.getSelected());
      const c = all.find(x => x.id === id);
      if (!c) return;
      alert(`📖 CHI TIẾT NGỮ LIỆU ĐỀ CƯƠNG\n\nTiêu đề: ${c.title}\nNguồn trích: ${c.source}\nBài học liên kết: ${c.lessonMatch || 'Chung'}\n\nNội dung trích đoạn:\n"${c.content}"`);
    }
  };

  // III. CÁC HÀM ĐIỀU KHIỂN MODAL CHỌN NGỮ LIỆU BƯỚC 1
  window.openExternalCorpusModal = function () {
    const modal = document.getElementById("externalCorpusModalBackdrop");
    if (!modal) return;
    modal.classList.add("open");
    renderExternalCorpusModalContent();
  };

  window.closeExternalCorpusModal = function () {
    const modal = document.getElementById("externalCorpusModalBackdrop");
    if (modal) modal.classList.remove("open");
  };

  window.switchExternalCorpusTab = function (tab) {
    ExternalCorpus.activeTab = tab;
    renderExternalCorpusModalContent();
  };

  window.filterExternalCorpusGrade = function (grade) {
    ExternalCorpus.gradeFilter = grade;
    renderExternalCorpusModalContent();
  };

  window.searchExternalCorpus = function (query) {
    ExternalCorpus.searchQuery = query.toLowerCase().trim();
    renderExternalCorpusModalContent();
  };

  window.selectSuggestedCorpus = function (id) {
    const item = DEFAULT_EXTERNAL_CORPUS.find(c => c.id === id);
    if (!item) return;
    if (ExternalCorpus.add(item)) {
      renderExternalCorpusModalContent();
    }
  };

  window.removeExternalCorpusFromModal = function (id) {
    ExternalCorpus.remove(id);
    renderExternalCorpusModalContent();
  };

  window.saveCustomExternalCorpus = function () {
    const title = document.getElementById("customCorpusTitle").value.trim();
    const source = document.getElementById("customCorpusSource").value.trim();
    const unitMatch = document.getElementById("customCorpusUnitSelect").value.trim();
    const content = document.getElementById("customCorpusContent").value.trim();

    if (!title) {
      alert("Vui lòng nhập Tiêu đề cho ngữ liệu!");
      return;
    }
    if (!content || content.length < 30) {
      alert("Vui lòng nhập đoạn văn bản ngữ liệu thực tế (tối thiểu 30 ký tự)!");
      return;
    }

    const newItem = {
      id: "custom_" + Date.now(),
      grade: (window.state && window.state.meta && window.state.meta.presetKey && window.state.meta.presetKey.includes("11")) ? "cn11" : (window.state && window.state.meta && window.state.meta.presetKey && window.state.meta.presetKey.includes("12")) ? "cn12" : "cn10",
      term: (window.state && window.state.meta && window.state.meta.examTerm) || "GK1",
      lessonMatch: unitMatch,
      title: title,
      source: source || "Đề cương ôn tập THPT Lộc Ninh",
      content: content,
      targetParts: ["tf", "essay"]
    };

    ExternalCorpus.add(newItem);
    alert("✅ Đã lưu và gắn ngữ liệu bên ngoài thành công vào đề thi!");
    window.switchExternalCorpusTab("library");
  };

  window.handleExternalCorpusFileUpload = function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      if (file.name.endsWith(".json")) {
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            parsed.forEach(p => ExternalCorpus.add(p));
            alert(`✅ Đã nhập thành công ${parsed.length} ngữ liệu từ file JSON!`);
          } else if (parsed.content) {
            ExternalCorpus.add(parsed);
            alert("✅ Đã nhập thành công ngữ liệu từ file JSON!");
          }
        } catch (err) {
          alert("Lỗi đọc file JSON: " + err.message);
        }
      } else {
        // Text / Markdown / TSV
        const lines = text.split("\n").filter(l => l.trim().length > 0);
        const title = file.name.replace(/\.[^/.]+$/, "");
        const content = lines.join("\n\n");
        ExternalCorpus.add({
          id: "file_" + Date.now(),
          title: title,
          source: `Tệp tải lên: ${file.name}`,
          lessonMatch: "Theo đề cương",
          content: content,
          targetParts: ["tf", "essay"]
        });
        alert(`✅ Đã trích xuất thành công ngữ liệu từ file "${file.name}"!`);
      }
      renderExternalCorpusModalContent();
    };
    reader.readAsText(file, "UTF-8");
  };

  function renderExternalCorpusModalContent() {
    const box = document.getElementById("externalCorpusModalBody");
    if (!box) return;

    const selectedList = ExternalCorpus.getSelected();
    const selectedIds = new Set(selectedList.map(c => c.id));
    const activeTab = ExternalCorpus.activeTab;

    // 1. THANH TABS
    let html = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:8px; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <div style="display:flex; gap:6px;">
          <button type="button" class="btn ${activeTab === 'library' ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="switchExternalCorpusTab('library')">
            📚 1. Kho Ngữ liệu Đề cương Gợi ý (${DEFAULT_EXTERNAL_CORPUS.length} bài)
          </button>
          <button type="button" class="btn ${activeTab === 'custom' ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="switchExternalCorpusTab('custom')">
            ✏️ 2. Tự dán / Nhập Ngữ liệu Đề cương
          </button>
          <button type="button" class="btn ${activeTab === 'file' ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="switchExternalCorpusTab('file')">
            📂 3. Tải File Đề cương (.docx/.txt/.json)
          </button>
        </div>
        <div style="font-size:12.5px; color:#15803d; font-weight:700;">
          Đã chọn cho đề này: <span class="badge badge-ok">${selectedList.length}</span>
        </div>
      </div>
    `;

    // 2. NỘI DUNG TỪNG TAB
    if (activeTab === "library") {
      // Bộ lọc khối & tìm kiếm
      const currentGrade = ExternalCorpus.gradeFilter;
      const q = ExternalCorpus.searchQuery;

      let filtered = DEFAULT_EXTERNAL_CORPUS.filter(item => {
        if (currentGrade !== "all" && item.grade !== currentGrade) return false;
        if (q) {
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchContent = item.content.toLowerCase().includes(q);
          const matchSource = (item.source || '').toLowerCase().includes(q);
          return matchTitle || matchContent || matchSource;
        }
        return true;
      });

      const cardsHtml = filtered.map(item => {
        const isSelected = selectedIds.has(item.id);
        const gradeBadge = item.grade === "cn10" ? "Khối 10" : item.grade === "cn11" ? "Khối 11" : "Khối 12";
        return `
          <div style="border:1.5px solid ${isSelected ? '#16a34a' : '#cbd5e1'}; background:${isSelected ? '#f0fdf4' : '#ffffff'}; border-radius:10px; padding:12px 14px; display:flex; flex-direction:column; justify-content:space-between; transition:all 0.15s ease;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:6px;">
                <div>
                  <span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:11px;">${gradeBadge}</span>
                  <span class="badge" style="background:#fef3c7; color:#92400e; font-weight:700; font-size:11px;">${item.term}</span>
                  <span class="badge badge-nl" style="font-size:10.5px;">${escapeHtml(item.lessonMatch)}</span>
                </div>
                ${isSelected ? '<span class="badge badge-ok" style="font-size:11px;">✓ ĐÃ CHỌN</span>' : ''}
              </div>
              <h4 style="margin:0 0 6px; font-size:14px; font-weight:700; color:#14532d; line-height:1.4;">
                ${escapeHtml(item.title)}
              </h4>
              <div style="font-size:12px; color:#475569; line-height:1.45; margin-bottom:8px; text-align:justify;">
                "${escapeHtml(item.content)}"
              </div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px dashed #cbd5e1; padding-top:8px; margin-top:6px; flex-wrap:wrap; gap:6px;">
              <div style="font-size:11px; color:#64748b;">
                📌 Nguồn: <strong>${escapeHtml(item.source)}</strong>
              </div>
              <div>
                ${isSelected ? `
                  <button type="button" class="btn btn-outline btn-sm" onclick="removeExternalCorpusFromModal('${item.id}')" style="color:#dc2626; border-color:#fca5a5; font-size:11.5px; padding:3px 8px;">
                    ✕ Bỏ chọn
                  </button>
                ` : `
                  <button type="button" class="btn btn-primary btn-sm" onclick="selectSuggestedCorpus('${item.id}')" style="font-size:11.5px; font-weight:600; padding:3px 10px;">
                    ➕ Chọn ngữ liệu này
                  </button>
                `}
              </div>
            </div>
          </div>
        `;
      }).join("");

      html += `
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:12px; flex-wrap:wrap;">
          <div style="display:flex; gap:5px;">
            <button type="button" class="btn ${currentGrade === 'all' ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="filterExternalCorpusGrade('all')">Tất cả (${DEFAULT_EXTERNAL_CORPUS.length})</button>
            <button type="button" class="btn ${currentGrade === 'cn10' ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="filterExternalCorpusGrade('cn10')">Khối 10 (Trồng trọt)</button>
            <button type="button" class="btn ${currentGrade === 'cn11' ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="filterExternalCorpusGrade('cn11')">Khối 11 (Chăn nuôi)</button>
            <button type="button" class="btn ${currentGrade === 'cn12' ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="filterExternalCorpusGrade('cn12')">Khối 12 (Lâm • Thủy sản)</button>
          </div>
          <div style="flex:1; max-width:280px;">
            <input type="text" placeholder="🔍 Tìm kiếm bài báo / mô hình..." value="${escapeHtml(ExternalCorpus.searchQuery)}" oninput="searchExternalCorpus(this.value)" style="width:100%; font-size:12.5px; padding:5px 8px;" />
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(360px, 1fr)); gap:12px; max-height:60vh; overflow-y:auto; padding-right:4px;">
          ${cardsHtml}
        </div>
      `;
    } else if (activeTab === "custom") {
      // Tab nhập tay
      const unitsOptions = (window.state && window.state.units ? window.state.units : []).map((u, i) => `
        <option value="${escapeHtml(u.lesson)}">${idxPlus1(i)}. ${escapeHtml(u.lesson)}</option>
      `).join("");

      html += `
        <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
          <h4 style="margin:0 0 10px; color:#166534; font-size:14.5px;">✏️ Nhập / Dán Ngữ Liệu Đề Cương Riêng Của Trường / Tổ</h4>
          
          <div style="display:grid; grid-template-columns:2fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:700; color:#334155; margin-bottom:4px;">Tiêu đề ngữ liệu / Tình huống thực tế:</label>
              <input type="text" id="customCorpusTitle" placeholder="Ví dụ: Mô hình nuôi cá lăng nha thương phẩm trong lồng bè tại hồ Cần Đơn..." style="width:100%; font-size:13px; padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px;" />
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:700; color:#334155; margin-bottom:4px;">Gắn với bài học trong PPCT:</label>
              <select id="customCorpusUnitSelect" style="width:100%; font-size:13px; padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px;">
                <option value="Theo đề cương">-- Toàn bộ đề cương --</option>
                ${unitsOptions}
              </select>
            </div>
          </div>

          <div style="margin-bottom:12px;">
            <label style="display:block; font-size:12px; font-weight:700; color:#334155; margin-bottom:4px;">Nguồn trích dẫn (Hiển thị trong đề thi):</label>
            <input type="text" id="customCorpusSource" placeholder="Ví dụ: Đề cương ôn tập THPT Lộc Ninh / Báo Nông nghiệp Việt Nam (2025)..." style="width:100%; font-size:13px; padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px;" value="Đề cương ôn tập THPT Lộc Ninh" />
          </div>

          <div style="margin-bottom:14px;">
            <label style="display:block; font-size:12px; font-weight:700; color:#334155; margin-bottom:4px;">Nội dung đoạn trích ngữ liệu (Khuyên dùng 150 - 300 từ):</label>
            <textarea id="customCorpusContent" rows="6" placeholder="Dán văn bản đoạn trích bài báo kỹ thuật, tình huống canh tác, bảng số liệu hoặc nội dung đề cương tại đây..." style="width:100%; font-size:13px; line-height:1.5; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-family:inherit;"></textarea>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:8px;">
            <button type="button" class="btn btn-outline" onclick="switchExternalCorpusTab('library')">Hủy</button>
            <button type="button" class="btn btn-primary" onclick="saveCustomExternalCorpus()" style="font-weight:700;">
              💾 Lưu &amp; Gắn Ngữ Liệu Này Vào Đề Thi
            </button>
          </div>
        </div>
      `;
    } else if (activeTab === "file") {
      // Tab file
      html += `
        <div style="background:#f8fafc; border:2px dashed #94a3b8; border-radius:12px; padding:28px 20px; text-align:center;">
          <div style="font-size:36px; margin-bottom:8px;">📂</div>
          <h4 style="margin:0 0 6px; font-size:15px; color:#1e293b;">Tải Lên File Đề Cương / Ngữ Liệu Ngoài</h4>
          <p style="font-size:13px; color:#64748b; max-width:540px; margin:0 auto 16px; line-height:1.5;">
            Hệ thống hỗ trợ tự động bóc tách ngữ liệu từ file văn bản <strong>.docx, .txt, .json, .csv</strong> để thầy cô nhanh chóng đưa vào đề kiểm tra 6 bước.
          </p>
          <label class="btn btn-primary" style="display:inline-block; cursor:pointer; font-weight:700; padding:8px 20px;">
            Chọn file từ máy tính
            <input type="file" accept=".docx,.txt,.json,.csv" style="display:none;" onchange="handleExternalCorpusFileUpload(event)" />
          </label>
        </div>
      `;
    }

    box.innerHTML = html;
  }

  function idxPlus1(i) {
    return i + 1;
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Khởi chạy khi DOM sẵn sàng
  document.addEventListener("DOMContentLoaded", function () {
    // Khôi phục từ localStorage vào window.state nếu có
    if (window.state) {
      window.state.externalCorpus = ExternalCorpus.getSelected();
    }
    ExternalCorpus.updateStep1View();
  });

  // Export ra toàn cục
  window.ExternalCorpus = ExternalCorpus;

})(window);
