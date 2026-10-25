/**
 * ============================================================================
 * PORTAL_PET.JS - HỆ THỐNG THÚ CƯNG NÔNG NGHIỆP & ĐỒNG BỘ ĐIỂM THƯỞNG (SAO ⭐)
 * Công nghệ Nông nghiệp THPT Lộc Ninh - Thầy Trương Khắc Nam
 * Đồng bộ điểm thưởng xuyên suốt giữa: Làm bài tập, Thi thử, Sổ tay lỗi sai & Kho trò chơi
 * ============================================================================
 */

(function (window) {
  "use strict";

  const STORAGE_KEY = "agro_pet_data";
  const STARS_STORAGE_KEY = "agro_stars";

  // Danh mục 5 thú cưng nông nghiệp thuần khiết
  const PET_PROFILES = {
    trau_vang: {
      id: "trau_vang",
      name: "Bé Trâu Vàng",
      emoji: "🐃",
      icon: "🌾",
      desc: "Biểu tượng cần cù, trung dũng, sức kéo bền bỉ của nền văn minh lúa nước và nhà nông Lộc Ninh.",
      favFood: "Cỏ Voi & Ngô Sinh Khối",
      buffText: "+15% Sao khi ôn bài Trồng trọt"
    },
    ga_dong_tao: {
      id: "ga_dong_tao",
      name: "Bé Gà Đông Tảo",
      emoji: "🐓",
      icon: "🥚",
      desc: "Giống vật nuôi đặc sản quý hiếm của Việt Nam với đôi chân vảy rồng dũng mãnh, kiêu hãnh.",
      favFood: "Thóc Vàng & Giun Quế",
      buffText: "+15% Sao khi ôn bài Chăn nuôi"
    },
    cun_nong_trai: {
      id: "cun_nong_trai",
      name: "Bé Cún Vàng",
      emoji: "🐶",
      icon: "🏡",
      desc: "Người bạn trung thành nhất luôn canh giữ vườn tược, chuồng trại và chào đón bạn mỗi ngày.",
      favFood: "Xương Gặm & Thịt Nạc",
      buffText: "+10% Sao trên tất cả bài học"
    },
    meo_muop: {
      id: "meo_muop",
      name: "Bé Mèo Mướp",
      emoji: "🐱",
      icon: "🐟",
      desc: "Chiến thần diệt chuột bảo vệ kho thóc giống và nông sản sau thu hoạch.",
      favFood: "Pate Cá & Tép Khô",
      buffText: "+20% Sao khi xóa nợ Sổ tay lỗi sai"
    },
    ca_koi: {
      id: "ca_koi",
      name: "Bé Cá Koi Nông Thôn",
      emoji: "🐟",
      icon: "💧",
      desc: "Đại diện cho hệ thống thủy sản tuần hoàn RAS công nghệ cao và biểu tượng may mắn, tài lộc.",
      favFood: "Viên Thức Ăn Thủy Sản",
      buffText: "+15% Sao khi ôn bài Thủy sản"
    }
  };

  // Các cấp bậc tiến hóa của thú cưng
  const PET_LEVEL_TITLES = [
    { level: 1, minExp: 0, title: "Trứng Thần Nông", badge: "🥚 Mầm Xanh" },
    { level: 2, minExp: 100, title: "Bé Thú Sơ Sinh", badge: "🌱 Bé Nhỏ" },
    { level: 3, minExp: 300, title: "Học Viên Nông Trại", badge: "🌿 Chăm Chỉ" },
    { level: 4, minExp: 650, title: "Dũng Sĩ Nhà Nông", badge: "🌾 Kiên Trì" },
    { level: 5, minExp: 1100, title: "Kỹ Sư Nông Nghiệp", badge: "⭐ Tinh Anh" },
    { level: 6, minExp: 1700, title: "Thủ Lĩnh Nông Trại", badge: "👑 Cao Thủ" },
    { level: 7, minExp: 2500, title: "Thần Thú Nông Nghiệp Lộc Ninh", badge: "🏆 Huyền Thoại" }
  ];

  function getDefaultPetData() {
    return {
      petType: "trau_vang",
      petName: "Bé Nghé Vàng",
      level: 1,
      exp: 0,
      stars: 100, // Điểm sao khởi đầu tặng học sinh
      lifetimeStars: 100,
      hunger: 80, // 0 - 100 (No bụng)
      happiness: 85, // 0 - 100 (Hạnh phúc)
      energy: 90, // 0 - 100 (Năng lượng)
      cleanliness: 90, // 0 - 100 (Sạch sẽ)
      lastUpdated: Date.now(),
      freePetCountToday: 0,
      lastPetDate: new Date().toDateString(),
      history: [
        { time: Date.now(), desc: "Quà tân thủ: Nhận nuôi thú cưng & kích hoạt Nông trại", stars: 100 }
      ]
    };
  }

  const portalPet = {
    // 1. LẤY DỮ LIỆU THÚ CƯNG
    getPetData: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          const init = getDefaultPetData();
          this.savePetData(init);
          return init;
        }
        const data = JSON.parse(raw);
        // Kiểm tra reset số lần vuốt ve mỗi ngày
        const todayStr = new Date().toDateString();
        if (data.lastPetDate !== todayStr) {
          data.freePetCountToday = 0;
          data.lastPetDate = todayStr;
        }
        return data;
      } catch (e) {
        console.error("Lỗi đọc dữ liệu thú cưng:", e);
        return getDefaultPetData();
      }
    },

    // 2. LƯU DỮ LIỆU THÚ CƯNG VÀ ĐỒNG BỘ
    savePetData: function (data) {
      try {
        data.lastUpdated = Date.now();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        // Đồng bộ biến agro_stars dùng chung
        localStorage.setItem(STARS_STORAGE_KEY, String(data.stars || 0));
        this.updateAllOnPageCounters(data);
      } catch (e) {
        console.error("Lỗi lưu dữ liệu thú cưng:", e);
      }
    },

    // 3. THƯỞNG SAO KHI LÀM BÀI TẬP HOẶC CHƠI GAME
    awardFarmPoints: function (amount, reason) {
      return this.awardStars(amount, reason);
    },

    awardStars: function (amount, reason) {
      const pts = Math.max(1, Math.round(Number(amount) || 0));
      const data = this.getPetData();

      data.stars = (data.stars || 0) + pts;
      data.lifetimeStars = (data.lifetimeStars || 0) + pts;

      // Cộng thêm kinh nghiệm (EXP) cho thú cưng
      const expGain = Math.round(pts * 0.5);
      data.exp = (data.exp || 0) + expGain;

      // Tăng nhẹ độ vui vẻ
      data.happiness = Math.min(100, (data.happiness || 80) + Math.min(15, Math.round(pts / 5)));

      // Kiểm tra thăng cấp thú cưng
      let leveledUp = false;
      const currentLevelObj = this.getLevelInfo(data.exp);
      if (currentLevelObj.level > (data.level || 1)) {
        data.level = currentLevelObj.level;
        leveledUp = true;
      }

      // Lưu lịch sử
      if (!Array.isArray(data.history)) data.history = [];
      data.history.unshift({
        time: Date.now(),
        desc: reason || "Hoàn thành nhiệm vụ học tập",
        stars: pts
      });
      if (data.history.length > 50) data.history.pop();

      this.savePetData(data);

      // Hiển thị thông báo Toast đẹp mắt
      this.showStarAwardToast(pts, reason, leveledUp ? currentLevelObj.title : null);

      return data;
    },

    // 4. LẤY THÔNG TIN LEVEL
    getLevelInfo: function (exp) {
      let current = PET_LEVEL_TITLES[0];
      let next = PET_LEVEL_TITLES[1];
      for (let i = 0; i < PET_LEVEL_TITLES.length; i++) {
        if (exp >= PET_LEVEL_TITLES[i].minExp) {
          current = PET_LEVEL_TITLES[i];
          next = PET_LEVEL_TITLES[i + 1] || null;
        }
      }
      const expNeeded = next ? (next.minExp - current.minExp) : 1000;
      const expProgress = next ? (exp - current.minExp) : expNeeded;
      const pct = next ? Math.min(100, Math.round((expProgress / expNeeded) * 100)) : 100;

      return {
        level: current.level,
        title: current.title,
        badge: current.badge,
        pct: pct,
        nextExp: next ? next.minExp : null
      };
    },

    // 5. CÁC HÀNH ĐỘNG CHĂM SÓC THÚ CƯNG
    feedPet: function (cost, hungerGain, happyGain, expGain, foodName) {
      const data = this.getPetData();
      if ((data.stars || 0) < cost) {
        alert(`⚠️ Bạn cần tối thiểu ${cost} ⭐ Sao Nông Nghiệp để mua ${foodName}!\n\nHãy làm bài tập củng cố hoặc chơi mini-game để tích thêm sao nhé!`);
        return false;
      }
      data.stars -= cost;
      data.hunger = Math.min(100, (data.hunger || 50) + hungerGain);
      data.happiness = Math.min(100, (data.happiness || 50) + happyGain);
      data.exp = (data.exp || 0) + expGain;

      const lvlInfo = this.getLevelInfo(data.exp);
      if (lvlInfo.level > (data.level || 1)) data.level = lvlInfo.level;

      data.history.unshift({
        time: Date.now(),
        desc: `Cho bé ăn ${foodName}`,
        stars: -cost
      });
      this.savePetData(data);
      this.renderPetFarmModalContent();
      this.triggerPetReaction("😋", `Bé vừa được ăn ${foodName}! Cảm ơn bạn nhiều! (+${expGain} XP)`);
      return true;
    },

    waterPet: function () {
      const cost = 10;
      const data = this.getPetData();
      if ((data.stars || 0) < cost) {
        alert("⚠️ Bạn cần 10 ⭐ Sao để lấy nước khoáng tinh khiết cho bé!");
        return false;
      }
      data.stars -= cost;
      data.energy = Math.min(100, (data.energy || 50) + 25);
      data.happiness = Math.min(100, (data.happiness || 50) + 10);
      data.exp = (data.exp || 0) + 10;

      this.savePetData(data);
      this.renderPetFarmModalContent();
      this.triggerPetReaction("💧", "Bé đã uống nước no nê, năng lượng tràn đầy! (+10 XP)");
      return true;
    },

    cleanPet: function () {
      const cost = 10;
      const data = this.getPetData();
      if ((data.stars || 0) < cost) {
        alert("⚠️ Bạn cần 10 ⭐ Sao để vệ sinh chuồng trại và tắm cho bé!");
        return false;
      }
      data.stars -= cost;
      data.cleanliness = Math.min(100, (data.cleanliness || 50) + 35);
      data.happiness = Math.min(100, (data.happiness || 50) + 15);
      data.exp = (data.exp || 0) + 10;

      this.savePetData(data);
      this.renderPetFarmModalContent();
      this.triggerPetReaction("✨", "Bé thơm tho sạch sẽ, chuồng trại thông thoáng phòng trừ dịch bệnh! (+10 XP)");
      return true;
    },

    petPet: function () {
      const data = this.getPetData();
      data.freePetCountToday = (data.freePetCountToday || 0) + 1;
      data.happiness = Math.min(100, (data.happiness || 50) + 15);
      data.exp = (data.exp || 0) + 5;

      this.savePetData(data);
      this.renderPetFarmModalContent();
      this.triggerPetReaction("❤️", `Bé dụi đầu vào tay bạn reo lên thích thú! (Đã vuốt ve ${data.freePetCountToday} lần hôm nay)`);
      return true;
    },

    changePetType: function (typeId) {
      if (!PET_PROFILES[typeId]) return;
      const data = this.getPetData();
      data.petType = typeId;
      data.petName = PET_PROFILES[typeId].name;
      this.savePetData(data);
      this.renderPetFarmModalContent();
      this.triggerPetReaction(PET_PROFILES[typeId].emoji, `Đã chọn người bạn đồng hành mới: ${PET_PROFILES[typeId].name}!`);
    },

    // 6. CẬP NHẬT HIỂN THỊ TRÊN TẤT CẢ TRANG
    updateAllOnPageCounters: function (data) {
      const currentData = data || this.getPetData();
      const stars = currentData.stars || 0;

      // Cập nhật thẻ hero trang trò chơi
      const heroStar = document.getElementById("gameHeroStarDisplay");
      if (heroStar) heroStar.textContent = stars.toLocaleString("vi-VN");

      // Cập nhật tất cả element có class pet-stars-display
      document.querySelectorAll(".pet-stars-display").forEach(el => {
        el.textContent = stars.toLocaleString("vi-VN");
      });

      // Cập nhật widget thú cưng mini nếu có
      const miniEmoji = document.getElementById("miniPetWidgetEmoji");
      if (miniEmoji && PET_PROFILES[currentData.petType]) {
        miniEmoji.textContent = PET_PROFILES[currentData.petType].emoji;
      }
      const miniStars = document.getElementById("miniPetWidgetStars");
      if (miniStars) {
        miniStars.textContent = stars.toLocaleString("vi-VN") + " ⭐";
      }
    },

    // 7. TOAST THÔNG BÁO NHẬN SAO
    showStarAwardToast: function (amount, reason, levelUpTitle) {
      let toast = document.getElementById("agroPetAwardToast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "agroPetAwardToast";
        toast.style.cssText = `
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 99999;
          background: #ffffff;
          border: 2px solid #10b981;
          border-radius: 16px;
          padding: 14px 20px;
          box-shadow: 0 12px 36px rgba(16, 185, 129, 0.28);
          display: flex;
          align-items: center;
          gap: 14px;
          transform: translateY(120%);
          opacity: 0;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          max-width: 380px;
          font-family: 'Be Vietnam Pro', -apple-system, sans-serif;
        `;
        document.body.appendChild(toast);
      }

      const petData = this.getPetData();
      const pet = PET_PROFILES[petData.petType] || PET_PROFILES.trau_vang;

      toast.innerHTML = `
        <div style="font-size:36px; animation: bounceEmoji 1s infinite alternate;">${pet.emoji}</div>
        <div style="flex:1;">
          <div style="font-size:14.5px; font-weight:800; color:#065f46; display:flex; align-items:center; gap:6px;">
            <span>+${amount} ⭐ Sao Nông Nghiệp!</span>
            ${levelUpTitle ? '<span style="font-size:11px; background:#fef08a; color:#854d0e; padding:2px 6px; border-radius:10px;">LÊN CẤP!</span>' : ''}
          </div>
          <div style="font-size:12px; color:#475569; margin-top:2px; line-height:1.4;">
            ${escapeHtml(reason || 'Hoàn thành xuất sắc bài tập')}
          </div>
        </div>
        <button type="button" onclick="portalPet.openPetFarmModal()" style="background:#10b981; color:#fff; border:none; padding:6px 12px; border-radius:8px; font-weight:700; font-size:12px; cursor:pointer; white-space:nowrap;">
          Nuôi thú 🐾
        </button>
      `;

      // Hiện toast
      setTimeout(() => {
        toast.style.transform = "translateY(0)";
        toast.style.opacity = "1";
      }, 50);

      // Tự ẩn sau 5 giây
      if (this._toastTimer) clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toast.style.transform = "translateY(120%)";
        toast.style.opacity = "0";
      }, 5200);
    },

    triggerPetReaction: function (emoji, text) {
      const bubble = document.getElementById("petFarmSpeechBubble");
      if (bubble) {
        bubble.innerHTML = `<span style="font-size:18px;">${emoji}</span> <strong>${escapeHtml(text)}</strong>`;
        bubble.style.transform = "scale(1.05)";
        setTimeout(() => { bubble.style.transform = "scale(1)"; }, 300);
      }
    },

    // 8. MODAL NÔNG TRẠI THÚ CƯNG TƯƠNG TÁC
    openPetFarmModal: function () {
      let backdrop = document.getElementById("agroPetFarmModalBackdrop");
      if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.id = "agroPetFarmModalBackdrop";
        backdrop.className = "modal-backdrop";
        backdrop.style.cssText = `
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(5px);
          z-index: 99998;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          opacity: 0;
          pointer-events: none;
          transition: all 0.25s ease;
        `;
        backdrop.innerHTML = `
          <div class="modal-box" style="background:#ffffff; width:100%; max-width:820px; max-height:92vh; border-radius:24px; box-shadow:0 24px 60px rgba(0,0,0,0.25); display:flex; flex-direction:column; overflow:hidden; border:2px solid #a7f3d0; font-family:'Be Vietnam Pro', -apple-system, sans-serif;">
            <div style="background:linear-gradient(135deg, #065f46 0%, #047857 50%, #10b981 100%); padding:18px 24px; color:#ffffff; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:28px;">🐾</span>
                <div>
                  <h3 style="margin:0; font-size:18px; font-weight:800; color:#fff;">Nông Trại Thú Cưng Học Tập</h3>
                  <div style="font-size:12px; color:#a7f3d0;">Làm bài tập &amp; Ôn đề nhận sao ⭐ nuôi bé cưng khôn lớn</div>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:12px;">
                <div style="background:rgba(255,255,255,0.2); backdrop-filter:blur(4px); padding:5px 14px; border-radius:20px; font-weight:800; font-size:14px; border:1px solid rgba(255,255,255,0.3);">
                  ⭐ <span class="pet-stars-display">0</span> Sao
                </div>
                <button type="button" onclick="portalPet.closePetFarmModal()" style="background:rgba(255,255,255,0.2); border:none; color:#fff; width:32px; height:32px; border-radius:50%; font-size:16px; font-weight:800; cursor:pointer;">✕</button>
              </div>
            </div>
            <div id="agroPetFarmModalContent" style="flex:1; overflow-y:auto; padding:20px 24px;"></div>
          </div>
        `;
        document.body.appendChild(backdrop);
      }

      backdrop.style.opacity = "1";
      backdrop.style.pointerEvents = "auto";
      this.activeTab = this.activeTab || "farm";
      this.renderPetFarmModalContent();
    },

    closePetFarmModal: function () {
      const backdrop = document.getElementById("agroPetFarmModalBackdrop");
      if (backdrop) {
        backdrop.style.opacity = "0";
        backdrop.style.pointerEvents = "none";
      }
    },

    setModalTab: function (tab) {
      this.activeTab = tab;
      this.renderPetFarmModalContent();
    },

    renderPetFarmModalContent: function () {
      const container = document.getElementById("agroPetFarmModalContent");
      if (!container) return;

      const data = this.getPetData();
      const pet = PET_PROFILES[data.petType] || PET_PROFILES.trau_vang;
      const lvlInfo = this.getLevelInfo(data.exp || 0);
      const tab = this.activeTab || "farm";

      this.updateAllOnPageCounters(data);

      let html = `
        <!-- THANH TABS -->
        <div style="display:flex; gap:8px; border-bottom:2px solid #e2e8f0; padding-bottom:12px; margin-bottom:18px; flex-wrap:wrap;">
          <button type="button" onclick="portalPet.setModalTab('farm')" class="btn btn-sm ${tab === 'farm' ? 'btn-primary' : 'btn-outline'}" style="font-weight:700;">
            🏡 Nông Trại Của Bé
          </button>
          <button type="button" onclick="portalPet.setModalTab('pets')" class="btn btn-sm ${tab === 'pets' ? 'btn-primary' : 'btn-outline'}" style="font-weight:700;">
            🐾 Đổi Bạn Đồng Hành (${Object.keys(PET_PROFILES).length})
          </button>
          <button type="button" onclick="portalPet.setModalTab('missions')" class="btn btn-sm ${tab === 'missions' ? 'btn-primary' : 'btn-outline'}" style="font-weight:700;">
            🎯 Sứ Mệnh Kiếm Sao
          </button>
          <button type="button" onclick="portalPet.setModalTab('history')" class="btn btn-sm ${tab === 'history' ? 'btn-primary' : 'btn-outline'}" style="font-weight:700;">
            📜 Nhật Ký Nông Trại
          </button>
        </div>
      `;

      if (tab === "farm") {
        html += `
          <!-- KHUNG CHÍNH: KHU VƯỜN THÚ CƯNG -->
          <div style="display:grid; grid-template-columns: 1fr 1.1fr; gap:20px; align-items:start;">
            
            <!-- CỘT TRÁI: HÌNH ẢNH & CHỈ SỐ -->
            <div style="background:linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%); border:2px solid #86efac; border-radius:20px; padding:20px; text-align:center; position:relative; overflow:hidden;">
              
              <!-- HUY HIỆU CẤP BẬC -->
              <div style="display:inline-block; padding:4px 12px; background:#065f46; color:#ffffff; font-size:12px; font-weight:800; border-radius:20px; margin-bottom:12px;">
                Cấp ${lvlInfo.level}: ${lvlInfo.title}
              </div>

              <!-- LỜI THOẠI CỦA BÉ -->
              <div id="petFarmSpeechBubble" style="background:#ffffff; border:1.5px solid #a7f3d0; border-radius:12px; padding:10px 14px; font-size:13px; color:#1e293b; margin-bottom:14px; box-shadow:0 4px 12px rgba(0,0,0,0.04); min-height:42px; display:flex; align-items:center; justify-content:center; gap:6px; transition:transform 0.2s ease;">
                <span>✨</span> <strong>Chào bạn! Hãy học bài thật tốt để cùng mình thăng cấp nhé!</strong>
              </div>

              <!-- AVATAR BÉ THÚ NHẢY NHÓT -->
              <div style="font-size:92px; margin:8px 0; filter:drop-shadow(0 10px 14px rgba(6,95,70,0.18)); cursor:pointer;" onclick="portalPet.petPet()" title="Bấm vào để vuốt ve bé!">
                ${pet.emoji}
              </div>

              <div style="font-size:17px; font-weight:800; color:#065f46; margin-bottom:2px;">
                ${escapeHtml(data.petName || pet.name)}
              </div>
              <div style="font-size:12px; color:#047857; margin-bottom:14px;">
                ${pet.buffText}
              </div>

              <!-- THANH TIẾN ĐỘ LEVEL (EXP) -->
              <div style="text-align:left; margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; font-size:11.5px; font-weight:700; color:#475569; margin-bottom:4px;">
                  <span>Tiến độ tiến hóa (EXP):</span>
                  <span>${data.exp || 0} / ${lvlInfo.nextExp || (data.exp + 100)} XP (${lvlInfo.pct}%)</span>
                </div>
                <div style="background:#e2e8f0; height:9px; border-radius:10px; overflow:hidden;">
                  <div style="background:linear-gradient(90deg, #10b981, #059669); height:100%; width:${lvlInfo.pct}%; transition:width 0.4s ease;"></div>
                </div>
              </div>

              <!-- 4 CHỈ SỐ SỨC KHỎE CỦA BÉ -->
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; text-align:left; font-size:11.5px;">
                <div style="background:#fff; padding:6px 10px; border-radius:8px; border:1px solid #bbf7d0;">
                  <div style="display:flex; justify-content:space-between; font-weight:700; color:#166534;">
                    <span>🥕 No bụng:</span>
                    <span>${data.hunger || 80}%</span>
                  </div>
                  <div style="background:#fee2e2; height:5px; border-radius:4px; overflow:hidden; margin-top:3px;">
                    <div style="background:#ef4444; height:100%; width:${data.hunger || 80}%;"></div>
                  </div>
                </div>

                <div style="background:#fff; padding:6px 10px; border-radius:8px; border:1px solid #bbf7d0;">
                  <div style="display:flex; justify-content:space-between; font-weight:700; color:#166534;">
                    <span>💖 Hạnh phúc:</span>
                    <span>${data.happiness || 85}%</span>
                  </div>
                  <div style="background:#fce7f3; height:5px; border-radius:4px; overflow:hidden; margin-top:3px;">
                    <div style="background:#ec4899; height:100%; width:${data.happiness || 85}%;"></div>
                  </div>
                </div>

                <div style="background:#fff; padding:6px 10px; border-radius:8px; border:1px solid #bbf7d0;">
                  <div style="display:flex; justify-content:space-between; font-weight:700; color:#166534;">
                    <span>⚡ Năng lượng:</span>
                    <span>${data.energy || 90}%</span>
                  </div>
                  <div style="background:#fef3c7; height:5px; border-radius:4px; overflow:hidden; margin-top:3px;">
                    <div style="background:#f59e0b; height:100%; width:${data.energy || 90}%;"></div>
                  </div>
                </div>

                <div style="background:#fff; padding:6px 10px; border-radius:8px; border:1px solid #bbf7d0;">
                  <div style="display:flex; justify-content:space-between; font-weight:700; color:#166534;">
                    <span>🧼 Sạch sẽ:</span>
                    <span>${data.cleanliness || 90}%</span>
                  </div>
                  <div style="background:#e0f2fe; height:5px; border-radius:4px; overflow:hidden; margin-top:3px;">
                    <div style="background:#0284c7; height:100%; width:${data.cleanliness || 90}%;"></div>
                  </div>
                </div>
              </div>

            </div>

            <!-- CỘT PHẢI: BẢNG HÀNH ĐỘNG CHĂM SÓC -->
            <div>
              <h4 style="margin:0 0 10px; color:#0f172a; font-size:15px; font-weight:800;">
                🍲 Cửa Hàng Chăm Sóc &amp; Bồi Dưỡng Bé Cưng
              </h4>
              <p style="font-size:12.5px; color:#64748b; margin:0 0 14px; line-height:1.5;">
                Dùng <strong>⭐ Sao Nông Nghiệp</strong> tích lũy từ làm bài tập và chơi game để nuôi dưỡng bé. Bé càng lớn, bạn càng nhận nhiều danh hiệu vinh danh!
              </p>

              <div style="display:flex; flex-direction:column; gap:10px;">
                <!-- ĂN CÀ RỐT / CỎ NGÔ -->
                <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:12px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:26px;">🥕</span>
                    <div>
                      <strong style="font-size:13px; color:#1e293b;">Bữa Phụ: Cà rốt hữu cơ</strong>
                      <div style="font-size:11.5px; color:#10b981;">+20 No • +10 Vui • +15 XP</div>
                    </div>
                  </div>
                  <button type="button" class="btn btn-sm btn-primary" onclick="portalPet.feedPet(15, 20, 10, 15, 'Cà rốt hữu cơ')" style="background:#10b981; font-weight:700; font-size:12px; padding:6px 12px;">
                    Cho ăn (-15 ⭐)
                  </button>
                </div>

                <!-- BỮA CHÍNH ĐẠC BIỆT -->
                <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:12px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:26px;">🌽</span>
                    <div>
                      <strong style="font-size:13px; color:#1e293b;">Bữa Chính: Bắp ngô &amp; Thóc vàng</strong>
                      <div style="font-size:11.5px; color:#10b981;">+45 No • +20 Vui • +30 XP</div>
                    </div>
                  </div>
                  <button type="button" class="btn btn-sm btn-primary" onclick="portalPet.feedPet(30, 45, 20, 30, 'Bắp ngô & Thóc vàng')" style="background:#059669; font-weight:700; font-size:12px; padding:6px 12px;">
                    Cho ăn (-30 ⭐)
                  </button>
                </div>

                <!-- UỐNG NƯỚC TINH KHIẾT -->
                <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:12px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:26px;">💧</span>
                    <div>
                      <strong style="font-size:13px; color:#1e293b;">Nước khoáng tinh khiết</strong>
                      <div style="font-size:11.5px; color:#0284c7;">+25 Năng lượng • +10 XP</div>
                    </div>
                  </div>
                  <button type="button" class="btn btn-sm btn-outline" onclick="portalPet.waterPet()" style="font-weight:700; font-size:12px; padding:6px 12px; color:#0284c7; border-color:#bae6fd;">
                    Cho uống (-10 ⭐)
                  </button>
                </div>

                <!-- TẮM RỬA & DỌN CHUỒNG -->
                <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:12px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:26px;">🧼</span>
                    <div>
                      <strong style="font-size:13px; color:#1e293b;">Tắm rửa &amp; Vệ sinh chuồng</strong>
                      <div style="font-size:11.5px; color:#0284c7;">+35 Sạch sẽ • Chống sâu bệnh • +10 XP</div>
                    </div>
                  </div>
                  <button type="button" class="btn btn-sm btn-outline" onclick="portalPet.cleanPet()" style="font-weight:700; font-size:12px; padding:6px 12px; color:#0284c7; border-color:#bae6fd;">
                    Tắm rửa (-10 ⭐)
                  </button>
                </div>

                <!-- VUỐT VE MIỄN PHÍ -->
                <div style="background:#fdf2f8; border:1.5px solid #fbcfe8; border-radius:12px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:26px;">❤️</span>
                    <div>
                      <strong style="font-size:13px; color:#9d174d;">Vuốt ve &amp; Vỗ về bé</strong>
                      <div style="font-size:11.5px; color:#be185d;">Miễn phí • +15 Hạnh phúc • +5 XP</div>
                    </div>
                  </div>
                  <button type="button" class="btn btn-sm btn-outline" onclick="portalPet.petPet()" style="font-weight:700; font-size:12px; padding:6px 12px; color:#db2777; border-color:#f472b6; background:#fff;">
                    Vuốt ve (Free)
                  </button>
                </div>
              </div>

              <!-- LỐI TẮT NHANH SANG CÁC PHẦN HỌC ĐỂ KIẾM SAO -->
              <div style="margin-top:16px; padding:12px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; font-size:12.5px;">
                <div style="font-weight:800; color:#334155; margin-bottom:6px;">🚀 Cần thêm Sao ⭐ để chăm sóc bé?</div>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                  <a href="trochoi.html" class="btn btn-sm btn-primary" style="font-size:11.5px; padding:4px 10px; background:#10b981; text-decoration:none;">🎮 Vào Trò Chơi (+150 ⭐)</a>
                  <a href="phan1.html" class="btn btn-sm btn-outline" style="font-size:11.5px; padding:4px 10px; text-decoration:none;">📚 Làm Bài Tập (+200 ⭐)</a>
                  <a href="phan5.html" class="btn btn-sm btn-outline" style="font-size:11.5px; padding:4px 10px; text-decoration:none;">🎯 Luyện Đề Bộ (+400 ⭐)</a>
                </div>
              </div>

            </div>
          </div>
        `;
      } else if (tab === "pets") {
        html += `
          <div>
            <h4 style="margin:0 0 6px; font-size:16px; color:#0f172a; font-weight:800;">
              🐾 Chọn Thú Cưng Nông Nghiệp Đồng Hành Cùng Bạn
            </h4>
            <p style="font-size:13px; color:#64748b; margin:0 0 16px;">
              Mỗi bé thú cưng đại diện cho một thế mạnh nông học và mang lại hiệu ứng buff sao thưởng đặc thù!
            </p>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(230px, 1fr)); gap:14px;">
              ${Object.values(PET_PROFILES).map(p => `
                <div style="background:#ffffff; border:2px solid ${data.petType === p.id ? '#10b981' : '#e2e8f0'}; border-radius:16px; padding:16px; display:flex; flex-direction:column; justify-content:space-between; ${data.petType === p.id ? 'box-shadow:0 8px 20px rgba(16,185,129,0.18); background:#f0fdf4;' : ''}">
                  <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                      <span style="font-size:42px;">${p.emoji}</span>
                      ${data.petType === p.id ? '<span class="badge" style="background:#10b981; color:#fff; font-weight:800; font-size:11px;">ĐANG ĐỒNG HÀNH</span>' : ''}
                    </div>
                    <h4 style="margin:0 0 4px; font-size:15px; color:#0f172a; font-weight:800;">${p.name}</h4>
                    <p style="font-size:12px; color:#475569; line-height:1.45; margin:0 0 8px;">${p.desc}</p>
                    <div style="font-size:11.5px; color:#15803d; font-weight:700; background:#dcfce7; padding:4px 8px; border-radius:6px; margin-bottom:10px;">
                      ✨ ${p.buffText}
                    </div>
                  </div>
                  <div>
                    <button type="button" class="btn btn-sm ${data.petType === p.id ? 'btn-outline' : 'btn-primary'}" onclick="portalPet.changePetType('${p.id}')" style="width:100%; font-weight:700; font-size:12.5px;">
                      ${data.petType === p.id ? '✓ Đang nuôi bé này' : '🐾 Chọn nuôi bé này'}
                    </button>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      } else if (tab === "missions") {
        html += `
          <div>
            <h4 style="margin:0 0 6px; font-size:16px; color:#0f172a; font-weight:800;">
              🎯 Sứ Mệnh Kiếm Sao Nông Nghiệp Hằng Ngày
            </h4>
            <p style="font-size:13px; color:#64748b; margin:0 0 16px;">
              Hoàn thành các hoạt động học tập bên dưới để tự động nhận cơn mưa Sao thưởng ⭐ nuôi thú:
            </p>

            <div style="display:flex; flex-direction:column; gap:10px;">
              <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:12px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <strong style="color:#0f172a; font-size:14px;">1. Hoàn thành 1 Đề Củng Cố CV 7991 (Phần 1: Bài học)</strong>
                  <div style="font-size:12px; color:#64748b; margin-top:2px;">Thưởng tự động dựa trên điểm số (Lên tới +200 ⭐)</div>
                </div>
                <a href="phan1.html" class="btn btn-sm btn-primary" style="font-weight:700; text-decoration:none;">Vào làm →</a>
              </div>

              <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:12px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <strong style="color:#0f172a; font-size:14px;">2. Thử sức 1 Đề Thi Thử Tốt Nghiệp THPT (Phần 5: 28 câu chuẩn Bộ)</strong>
                  <div style="font-size:12px; color:#64748b; margin-top:2px;">Thưởng x40 lần điểm số (Đạt 10 điểm = +400 ⭐)</div>
                </div>
                <a href="phan5.html" class="btn btn-sm btn-primary" style="font-weight:700; text-decoration:none;">Vào thi thử →</a>
              </div>

              <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:12px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <strong style="color:#0f172a; font-size:14px;">3. Xóa nợ câu sai trong Sổ tay lỗi sai</strong>
                  <div style="font-size:12px; color:#64748b; margin-top:2px;">Mỗi câu sửa đúng được thưởng ngay +15 ⭐</div>
                </div>
                <a href="sotayloi.html" class="btn btn-sm btn-primary" style="font-weight:700; text-decoration:none;">Sửa lỗi →</a>
              </div>

              <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:12px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <strong style="color:#0f172a; font-size:14px;">4. Chơi 1 ván Mini-Game tại Kho trò chơi</strong>
                  <div style="font-size:12px; color:#64748b; margin-top:2px;">Phản xạ nhanh, Ghép cặp, Bác sĩ nông nghiệp nhận từ +30 đến +150 ⭐</div>
                </div>
                <a href="trochoi.html" class="btn btn-sm btn-primary" style="font-weight:700; text-decoration:none;">Chơi game →</a>
              </div>
            </div>
          </div>
        `;
      } else if (tab === "history") {
        const hist = data.history || [];
        html += `
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <h4 style="margin:0; font-size:16px; color:#0f172a; font-weight:800;">
                📜 Nhật Ký Biến Động Sao &amp; Chăm Sóc Nông Trại
              </h4>
              <span style="font-size:12px; color:#64748b;">Tổng sao đã tích lũy trọn đời: <strong>${(data.lifetimeStars || 0).toLocaleString('vi-VN')} ⭐</strong></span>
            </div>

            <div style="border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
              <table class="std-table" style="font-size:12.5px; margin:0;">
                <thead>
                  <tr style="background:#f8fafc;">
                    <th style="width:120px;">Thời gian</th>
                    <th>Nội dung sự kiện / Bài học / Game</th>
                    <th style="width:100px; text-align:right;">Biến động Sao</th>
                  </tr>
                </thead>
                <tbody>
                  ${hist.length === 0 ? '<tr><td colspan="3" style="text-align:center; padding:20px; color:#94a3b8;">Chưa có lịch sử biến động sao.</td></tr>' : hist.map(h => {
                    const d = new Date(h.time);
                    const timeStr = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')} ${d.getDate()}/${d.getMonth()+1}`;
                    const isPlus = (h.stars > 0);
                    return `
                      <tr>
                        <td style="color:#64748b;">${timeStr}</td>
                        <td style="font-weight:600; color:#1e293b;">${escapeHtml(h.desc)}</td>
                        <td style="text-align:right; font-weight:800; color:${isPlus ? '#15803d' : '#dc2626'};">
                          ${isPlus ? '+' : ''}${h.stars} ⭐
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

      container.innerHTML = html;
    }
  };

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Lắng nghe sự kiện storage để đồng bộ real-time giữa các tab/cửa sổ trình duyệt
  window.addEventListener("storage", function (e) {
    if (e.key === STORAGE_KEY || e.key === STARS_STORAGE_KEY) {
      portalPet.updateAllOnPageCounters();
      const modalBackdrop = document.getElementById("agroPetFarmModalBackdrop");
      if (modalBackdrop && modalBackdrop.style.opacity === "1") {
        portalPet.renderPetFarmModalContent();
      }
    }
  });

  // Khởi chạy khi DOM sẵn sàng
  document.addEventListener("DOMContentLoaded", function () {
    portalPet.updateAllOnPageCounters();
  });

  // Export toàn cục
  window.portalPet = portalPet;

})(window);
