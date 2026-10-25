/**
 * ============================================================================
 * PORTAL_AUTH.JS - QUẢN LÝ THÔNG TIN HỌC SINH & PHIÊN HỌC TẬP THPT LỘC NINH
 * ============================================================================
 */

(function (window) {
  "use strict";

  const AUTH_KEY = "agro_student_profile";

  function getDefaultProfile() {
    return {
      name: "Học sinh THPT Lộc Ninh",
      grade: "12",
      classRoom: "12A1",
      rank: "Kỹ sư Tập sự",
      xp: 450,
      streak: 5,
      todayMinutes: 15,
      targetMinutes: 20,
      lastActiveDate: new Date().toDateString()
    };
  }

  const portalAuth = {
    getProfile: function () {
      try {
        const raw = localStorage.getItem(AUTH_KEY);
        if (!raw) {
          const init = getDefaultProfile();
          this.saveProfile(init);
          return init;
        }
        return JSON.parse(raw);
      } catch (e) {
        return getDefaultProfile();
      }
    },

    saveProfile: function (profile) {
      try {
        localStorage.setItem(AUTH_KEY, JSON.stringify(profile));
      } catch (e) {
        console.error("Lỗi lưu hồ sơ:", e);
      }
    },

    addXp: function (amount) {
      const p = this.getProfile();
      p.xp = (p.xp || 0) + Math.max(0, Math.round(amount));
      this.saveProfile(p);
      return p;
    }
  };

  window.portalAuth = portalAuth;
})(window);
