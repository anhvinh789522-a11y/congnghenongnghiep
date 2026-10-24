// Bộ đồng bộ Giao diện Thời gian thực & Kiến trúc Mobile EdTech (Khan Academy • VietJack • OLM)
window.toggleSlimMenu = function() {
  const tabs = document.getElementById("slimNavTabs") || document.querySelector(".slim-nav-tabs");
  if (tabs) tabs.classList.toggle("open");
};

(function () {
  const STORAGE_KEY = "cnnn_ui_theme_v1";

  const DEFAULT_BRAND = {
    badge: "🌱 THPT LỘC NINH • CNNN 10•11•12",
    title: "CỔNG HỌC LIỆU & HỖ TRỢ SOẠN GIẢNG ĐIỆN TỬ (CV 5512)",
    slogan: "Đồng hành cùng giáo viên & học sinh THPT Lộc Ninh trên hành trình chuyển đổi số nông nghiệp",
    author: "Thầy Trương Khắc Nam – GV CNNN",
    zaloText: "Nhắn Zalo: 0978.405.879",
    zaloUrl: "https://zalo.me/0978405879"
  };

  function ensureMobileFirstBannerDom(cfg) {
    const brandEl = document.querySelector(".app-header .brand");
    if (!brandEl) return;

    const badgeText = (cfg && cfg.customBadge) || DEFAULT_BRAND.badge;
    const titleText = (cfg && cfg.customHeaderTitle) || DEFAULT_BRAND.title;
    const sloganText = (cfg && cfg.customHeaderSub) || DEFAULT_BRAND.slogan;
    const authorText = (cfg && cfg.customAuthor) || DEFAULT_BRAND.author;
    const zaloLabel = (cfg && cfg.customZaloText) || DEFAULT_BRAND.zaloText;
    const zaloHref = (cfg && cfg.customZaloUrl) || DEFAULT_BRAND.zaloUrl;

    const bEl = brandEl.querySelector(".brand-badge");
    if (bEl) bEl.textContent = badgeText;

    const titleWrap = brandEl.querySelector(".brand-title");
    if (titleWrap) {
      let h1 = titleWrap.querySelector("h1");
      if (!h1) {
        h1 = document.createElement("h1");
        titleWrap.prepend(h1);
      }
      h1.textContent = titleText;
      h1.removeAttribute("style");

      let pEl = titleWrap.querySelector("p");
      if (!pEl) {
        pEl = document.createElement("p");
        pEl.className = "brand-slogan";
        titleWrap.appendChild(pEl);
      }
      pEl.textContent = sloganText;

      let contactBar = titleWrap.querySelector(".header-contact-bar");
      if (!contactBar) {
        contactBar = document.createElement("div");
        contactBar.className = "header-contact-bar";
        titleWrap.appendChild(contactBar);
      }
      contactBar.innerHTML = `
        <div class="author-badge">👨‍🏫 <span>Tác giả: ${authorText}</span></div>
        <a href="${zaloHref}" target="_blank" rel="noopener noreferrer" class="zalo-cta-btn">
          💬 <span>${zaloLabel}</span>
        </a>
      `;
    }
  }

  // Đồng bộ cấu hình thông tin hiển thị trên Trang chủ (index.html)
  function ensureWelcomeHubDom(cfg) {
    if (!cfg || typeof cfg !== "object") return;

    const topTitle = document.getElementById("homeTopTitle");
    if (topTitle && cfg.homeTopTitle) topTitle.textContent = cfg.homeTopTitle;

    const topSub = document.getElementById("homeTopSub");
    if (topSub && cfg.homeTopSub) topSub.textContent = cfg.homeTopSub;

    const topAuthor = document.getElementById("homeTopAuthor");
    if (topAuthor && cfg.customAuthor) topAuthor.textContent = "👨‍🏫 " + cfg.customAuthor;

    const footerAuthor = document.getElementById("footerAuthorText");
    if (footerAuthor && cfg.customAuthor) footerAuthor.textContent = cfg.customAuthor;

    const footerZalo = document.getElementById("footerZaloText");
    if (footerZalo && cfg.customZaloText) footerZalo.textContent = "Nhắn Zalo: " + cfg.customZaloText;

    const footerBtn = document.getElementById("footerZaloBtn");
    if (footerBtn && cfg.customZaloUrl) footerBtn.href = cfg.customZaloUrl;

    const topZaloText = document.getElementById("homeTopZaloText");
    if (topZaloText && cfg.customZaloText) topZaloText.textContent = cfg.customZaloText;

    const topZaloBtn = document.getElementById("homeTopZaloBtn");
    if (topZaloBtn && cfg.customZaloUrl) topZaloBtn.href = cfg.customZaloUrl;

    const heroBadge = document.getElementById("homeHeroBadge");
    if (heroBadge && cfg.hubWelcomeBadge) heroBadge.textContent = cfg.hubWelcomeBadge;

    const heroTitle = document.getElementById("homeHeroTitle");
    if (heroTitle && cfg.hubWelcomeTitle) heroTitle.textContent = cfg.hubWelcomeTitle;

    const heroDesc = document.getElementById("homeHeroDesc");
    if (heroDesc && cfg.hubWelcomeSub) heroDesc.textContent = cfg.hubWelcomeSub;

    for (let i = 1; i <= 5; i++) {
      const tEl = document.getElementById("cardTitle" + i);
      if (tEl && cfg["card" + i + "Title"]) tEl.textContent = cfg["card" + i + "Title"];

      const dEl = document.getElementById("cardDesc" + i);
      if (dEl && cfg["card" + i + "Desc"]) dEl.textContent = cfg["card" + i + "Desc"];
    }
  }

  // Chuẩn hóa nhãn Thanh Đáy (Bottom Navigation Bar) gọn đẹp trên Mobile & đầy đủ trên PC
  function enhanceMobileBottomBarLabels() {
    const btns = document.querySelectorAll(".module-nav-bar .module-tab-btn");
    btns.forEach((btn) => {
      const strongEl = btn.querySelector(".module-tab-text strong");
      if (!strongEl) return;
      if (!strongEl.dataset.fullText) {
        strongEl.dataset.fullText = strongEl.textContent.trim();
      }
      if (window.innerWidth <= 768) {
        if (btn.id === "btnNavHub" || btn.classList.contains("hub-btn")) {
          strongEl.textContent = "Cổng Hub";
        } else if (strongEl.dataset.fullText.includes("PHẦN 1")) {
          strongEl.textContent = "Kiến thức";
        } else if (strongEl.dataset.fullText.includes("PHẦN 2")) {
          strongEl.textContent = "Hồ sơ/PPT";
        } else if (strongEl.dataset.fullText.includes("PHẦN 3")) {
          strongEl.textContent = "Soạn đề";
        } else if (strongEl.dataset.fullText.includes("PHẦN 4")) {
          strongEl.textContent = "Ôn THPT";
        }
      } else {
        strongEl.textContent = strongEl.dataset.fullText;
      }
    });
  }

  // Khởi tạo Ngăn kéo Chọn Bài Học trượt từ dưới lên (Lesson Syllabus Drawer chuẩn VietJack / Khan Academy)
  function initEdTechMobileLessonDrawer() {
    const splits = document.querySelectorAll(".portal-split-layout");
    if (!splits.length) return;

    let backdrop = document.querySelector(".edtech-drawer-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "edtech-drawer-backdrop";
      backdrop.addEventListener("click", () => {
        document.body.classList.remove("edtech-drawer-open");
      });
      document.body.appendChild(backdrop);
    }

    splits.forEach((split, idx) => {
      const sidebar = split.querySelector(".lesson-sidebar");
      if (!sidebar) return;

      // Thêm thanh tiêu đề + nút Đóng bên trong Drawer
      if (!sidebar.querySelector(".edtech-drawer-close-head")) {
        const closeHead = document.createElement("div");
        closeHead.className = "edtech-drawer-close-head";
        closeHead.innerHTML = `
          <strong>📚 Danh mục 77 Bài học (Khối 10•11•12)</strong>
          <button type="button" class="edtech-drawer-close-btn">✕ Đóng</button>
        `;
        closeHead.querySelector(".edtech-drawer-close-btn").addEventListener("click", () => {
          document.body.classList.remove("edtech-drawer-open");
        });
        sidebar.prepend(closeHead);
      }

      // Thêm thanh kích hoạt nổi phía trên khu vực nội dung bài học
      let triggerBar = split.parentElement.querySelector(`.edtech-mobile-drawer-bar[data-split="${idx}"]`);
      if (!triggerBar) {
        triggerBar = document.createElement("div");
        triggerBar.className = "edtech-mobile-drawer-bar";
        triggerBar.dataset.split = String(idx);
        triggerBar.innerHTML = `
          <div class="edtech-mobile-drawer-bar__left">
            <div class="edtech-mobile-drawer-bar__icon">📚</div>
            <div class="edtech-mobile-drawer-bar__text">
              <strong class="edtech-current-lesson-label">Danh mục Bài học SGK Công nghệ 10 • 11 • 12</strong>
              <span>Chạm vào đây để chuyển nhanh giữa 77 bài học</span>
            </div>
          </div>
          <div class="edtech-mobile-drawer-bar__btn">Đổi bài ▾</div>
        `;
        triggerBar.addEventListener("click", () => {
          document.body.classList.add("edtech-drawer-open");
        });
        split.parentElement.insertBefore(triggerBar, split);
      }

      // Tự động đóng Drawer và cập nhật tên bài học khi người dùng chạm chọn bài
      sidebar.addEventListener("click", (ev) => {
        const item = ev.target.closest(".lesson-nav-item, [onclick*='selectPortalLesson'], [onclick*='select5512Lesson']");
        if (item && window.innerWidth <= 1024) {
          const lessonTitle = item.textContent.replace(/\s+/g, " ").trim();
          const lbl = triggerBar.querySelector(".edtech-current-lesson-label");
          if (lbl && lessonTitle) lbl.textContent = lessonTitle;
          setTimeout(() => {
            document.body.classList.remove("edtech-drawer-open");
          }, 120);
        }
      });
    });
  }

  function applyCnnnUiTheme(cfg) {
    ensureMobileFirstBannerDom(cfg);
    ensureWelcomeHubDom(cfg);
    if (!cfg || typeof cfg !== "object") return;

    let styleEl = document.getElementById("cnnnDynamicThemeStyle");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "cnnnDynamicThemeStyle";
      document.head.appendChild(styleEl);
    }

    const p = cfg.primary || "#0f3d24";
    const pd = cfg.primaryDark || "#092616";
    const pl = cfg.primaryLight || "#dcfce7";
    const sec = cfg.secondary || "#15803d";
    const acc = cfg.accent || "#d97706";
    const bg = cfg.bg || "#f1f5f9";
    const cardBg = cfg.cardBg || "#ffffff";
    const txt = cfg.text || "#0f172a";
    const muted = cfg.textMuted || "#475569";
    const brd = cfg.border || "#cbd5e1";
    const font = cfg.fontFamily || "'Plus Jakarta Sans', 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif";
    const fSize = Number(cfg.fontSize) || 14.5;
    const lHeight = Number(cfg.lineHeight) || 1.55;
    const maxW = cfg.containerWidth || "1440px";
    const sideW = Number(cfg.sidebarWidth) || 310;
    const radius = Number(cfg.borderRadius ?? 10);
    const headerGrad = cfg.headerBg || `linear-gradient(145deg, ${pd} 0%, ${p} 58%, ${sec} 100%)`;

    styleEl.textContent = `
      :root {
        --primary: ${p} !important;
        --primary-dark: ${pd} !important;
        --primary-light: ${pl} !important;
        --secondary: ${sec} !important;
        --accent: ${acc} !important;
        --bg: ${bg} !important;
        --card-bg: ${cardBg} !important;
        --text: ${txt} !important;
        --text-muted: ${muted} !important;
        --border: ${brd} !important;
        --radius: ${radius}px !important;
      }
      body {
        font-family: ${font} !important;
        font-size: ${fSize}px !important;
        line-height: ${lHeight} !important;
        background-color: ${bg} !important;
        color: ${txt} !important;
      }
      .app-header {
        background: ${headerGrad} !important;
        ${cfg.compactHeader ? "padding: 10px 14px !important;" : ""}
      }
      .container, .header-inner, .module-nav-inner, .stepper-inner {
        max-width: ${maxW} !important;
      }
      @media (min-width: 1025px) {
        .portal-split-layout {
          grid-template-columns: ${sideW}px 1fr !important;
        }
      }
      .card, .q-card, .analyzer-card, .lesson-sidebar {
        background-color: ${cardBg} !important;
        border-radius: ${radius}px !important;
        border-color: ${brd} !important;
        ${cfg.shadowStyle === "none" ? "box-shadow: none !important;" : cfg.shadowStyle === "strong" ? "box-shadow: 0 10px 25px -5px rgba(0,0,0,0.12) !important;" : ""}
      }
      .btn {
        border-radius: ${Math.max(4, Math.min(radius, 12))}px !important;
      }
      ${cfg.hideTopNav ? ".module-nav-bar { display: none !important; }" : ""}
      ${cfg.hideHeaderActions ? ".header-actions { display: none !important; }" : ""}
      ${cfg.customCss || ""}
    `;
  }

  function loadAndApplySavedTheme() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        applyCnnnUiTheme(JSON.parse(raw));
      } else {
        ensureMobileFirstBannerDom(null);
        ensureWelcomeHubDom(null);
      }
    } catch (e) {
      console.warn("UI Theme sync error:", e);
      ensureMobileFirstBannerDom(null);
      ensureWelcomeHubDom(null);
    }
    enhanceMobileBottomBarLabels();
    initEdTechMobileLessonDrawer();
  }

  loadAndApplySavedTheme();
  document.addEventListener("DOMContentLoaded", loadAndApplySavedTheme);
  window.addEventListener("resize", enhanceMobileBottomBarLabels);

  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      if (e.newValue) {
        try { applyCnnnUiTheme(JSON.parse(e.newValue)); } catch (_) {}
      } else {
        const el = document.getElementById("cnnnDynamicThemeStyle");
        if (el) el.remove();
        window.location.reload();
      }
    }
  });

  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "CNNN_UI_THEME_UPDATE") {
      applyCnnnUiTheme(e.data.config);
    }
  });

  if (typeof BroadcastChannel !== "undefined") {
    try {
      const bc = new BroadcastChannel("cnnn_ui_channel");
      bc.onmessage = (ev) => {
        if (ev.data && ev.data.type === "CNNN_UI_THEME_UPDATE") {
          applyCnnnUiTheme(ev.data.config);
        } else if (ev.data && ev.data.type === "CNNN_UI_THEME_RESET") {
          const el = document.getElementById("cnnnDynamicThemeStyle");
          if (el) el.remove();
          window.location.reload();
        }
      };
    } catch (_) {}
  }

  window.applyCnnnUiTheme = applyCnnnUiTheme;
})();
