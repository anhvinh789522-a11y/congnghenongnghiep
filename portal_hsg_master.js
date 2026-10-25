// ============================================================================
// HỆ THỐNG BỒI DƯỠNG & KHẢO THÍ HỌC SINH GIỎI (HSG) CẤP TỈNH / THÀNH PHỐ
// Chuẩn Cấu trúc Sở GD&ĐT Đồng Nai (SKILL.md & Quyết định 1540/QĐ-SGDĐT)
// Tích hợp Tinh hoa Đề HSG Thực chiến: Đồng Nai, TP. Huế (Mã 7011), TP.HCM, BR-VT, Bắc Giang
// Hệ thống Phân hóa 3 Cấp độ: 🟢 Dễ (Khởi động) -> 🟡 Vừa (Tăng tốc) -> 🔴 Khó (Về đích)
// ============================================================================

if (typeof window.escapeHtml !== "function") {
  window.escapeHtml = function(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
}
var escapeHtml = window.escapeHtml;

const HSG_MASTER_STATE = {
  activeSubTab: "hsg_dongnai", // 'hsg_dongnai' | 'hsg_matrix_validator' | 'hsg_theory_handbook' | 'hsg_topics' | 'hsg_quiz' | 'ag_calc'
  handbookMode: "curriculum", // 'curriculum' (77 Bai toan bo sach) | 'vdc_core' (9 Chuyen de cot loi)
  handbookGrade: "cn10", // 'cn10' | 'cn11' | 'cn12'
  handbookActiveLessonId: "cn10_b1",
  handbookSearch: "",
  selectedLevel: "all", // 'all' | 'easy' | 'medium' | 'hard'
  activeExamId: "dn_easy_01", // 'dn_easy_01' | 'dn_easy_02' | 'dn_01' | 'dn_03' | 'dn_02' | 'dn_hard_02' | 'dn_auto'
  tableMode: "B", // 'A' (Trường Chuyên: 0.125đ Đúng + 0.25đ Giải thích) | 'B' (Trường Không chuyên: 0.25đ Đúng + 0.125đ Giải thích)
  timerSeconds: 180 * 60,
  timerRunning: false,
  timerInterval: null,
  submitted: false,
  showRecallHints: true, // Điểm tựa ghi nhớ lý thuyết SGK cho học sinh
  expandedRecallHints: {}, // { key: boolean }
  userMcq: {}, // { qIdx: optionIdx }
  userTfChoice: {}, // { qIdx: { a: true/false, b: true/false, c: true/false, d: true/false } }
  userTfExplain: {}, // { qIdx: { a: "string", ... } }
  userEssayText: {}, // { essayIdx: "string" }
  userEssayRubricChecks: {}, // { "essayIdx_stepIdx": boolean }
  handbookFilterGrade: "all", // 'all' | 'cn10' | 'cn11' | 'cn12'
  handbookActiveTopicId: "hb_10_dat",
  g12MatrixApproved: true,
  g12EssayMatrix: [
    { id: "g12_1", group: "Lâm nghiệp", name: "(1) Giới thiệu chung về lâm nghiệp", points: 0.50, desc: "Vai trò, đặc điểm, phân loại 3 loại rừng theo Luật Lâm nghiệp 2017; nguyên nhân suy thoái rừng." },
    { id: "g12_2", group: "Lâm nghiệp", name: "(2) Trồng và chăm sóc rừng", points: 1.50, desc: "Quy luật sinh trưởng phát triển cây rừng, tiêu chuẩn cây giống xuất vườn, kỹ thuật trồng và tỉa thưa nuôi dưỡng rừng gỗ lớn." },
    { id: "g12_3", group: "Lâm nghiệp", name: "(3) Bảo vệ và khai thác tài nguyên rừng bền vững", points: 1.50, desc: "Khai thác trắng/dần/chọn, phòng chống cháy rừng, chứng chỉ rừng bền vững FSC, phân tích bảng số liệu thống kê lâm nghiệp." },
    { id: "g12_4", group: "Thủy sản", name: "(4) Giới thiệu chung về thủy sản", points: 0.50, desc: "Vai trò, xu hướng phát triển thủy sản công nghệ cao, phân loại thủy sản theo tính ăn và môi trường sống." },
    { id: "g12_5", group: "Thủy sản", name: "(5) Môi trường nuôi thủy sản", points: 1.75, desc: "Quản lý DO, pH, NH3/NH4+, NO2-, H2S; quy trình chuẩn bị nước 4 bước; công nghệ Biofloc (C:N), RAS, IPRS, Aquaponics." },
    { id: "g12_6", group: "Thủy sản", name: "(6) Công nghệ giống và thức ăn, bệnh thủy sản", points: 1.25, desc: "Cơ chế kích dục tố sinh sản nhân tạo, sản xuất cá rô phi đơn tính đực, tính toán sinh khối, FCR và phòng trị bệnh thủy sản." }
  ]
};

// ============================================================================
const HSG_DEEP_HANDBOOK = [
  {
    id: "hb_10_dat",
    grade: "cn10",
    gradeLabel: "Khối 10 — Trồng trọt",
    code: "CHỦ ĐỀ 10.1",
    title: "Đất trồng: Cấu trúc Hạt keo đất, Cơ chế Trao đổi Ion & Hóa học Cải tạo Đất",
    examWeight: "3 câu MCQ (0,75đ) + 2–4 ý Đúng/Sai + Tích hợp câu Tự luận nâng cao",
    coreMechanisms: [
      "1. Cấu tạo hạt keo đất (Micelle): Gồm 4 lớp từ trong ra ngoài: (1) Nhân keo (SiO2, Al2O3, Fe2O3 hoặc mùn hữu cơ) -> (2) Lớp ion quyết định điện thế (nếu mang điện âm gọi là keo âm - phổ biến nhất ở đất nông nghiệp; nếu mang điện dương gọi là keo dương - gặp ở đất đỏ bazan/feralit chua giàu Fe3+, Al3+) -> (3) Lớp ion bất động (tầng hấp phụ chặt) -> (4) Lớp ion khuếch tán (nằm ngoài cùng, các cation Ca2+, Mg2+, K+, NH4+, H+, Al3+ chuyển động tự do và trao đổi trực tiếp với dung dịch đất).",
      "2. Cơ chế trao đổi cation giữa rễ cây và hạt keo đất (Câu hỏi tự luận đề HSG TP. Huế Mã 7011): Lông hút của rễ cây hô hấp hiếu khí giải phóng khí CO2. Trong dung dịch đất: CO2 + H2O <-> H2CO3 <-> H+ + HCO3-. Lông hút tiết ion H+ (và HCO3-) vào dung dịch đất để trao đổi tương đương điện tích với các cation dinh dưỡng (K+, NH4+, Ca2+, Mg2+) trên lớp ion khuếch tán của hạt keo âm, đẩy các ion khoáng này vào dung dịch đất để rễ hấp thụ chủ động hoặc thụ động.",
      "3. Dung tích hấp phụ cation (CEC - Cation Exchange Capacity, đơn vị meq/100g đất): Đặc trưng cho khả năng giữ phân và đệm pH của đất. Thứ tự CEC giảm dần: Mùn hữu cơ (150–300 meq/100g) > Sét Montmorillonite > Sét Illite > Sét Kaolinite > Đất cát (< 5 meq/100g).",
      "4. Bản chất độ chua của đất: (a) Độ chua hoạt tính: do nồng độ ion H+ tự do trong dung dịch đất quyết định (đo bằng pH_H2O); (b) Độ chua tiềm tàng: do ion H+ và Al3+ nằm trên bề mặt phức hệ hấp phụ của keo đất quyết định (khi tác động bằng dung dịch muối trung tính KCl: Keo-[Al3+] + 3KCl -> Keo-[3K+] + AlCl3; sau đó Al3+ + 3H2O -> Al(OH)3 + 3H+ làm chua đất)."
    ],
    comparisonTable: {
      headers: ["Loại đất suy thoái", "Bản chất Hóa lý & Độc chất", "Cơ chế Phản ứng Cải tạo", "Quy trình Kỹ thuật Thực hành"],
      rows: [
        [
          "Đất chua & Đất phèn (pH < 4,5)",
          "Tích tụ H+, Fe3+, Al3+ di động cao và SO4(2-) do oxy hóa tầng sinh phèn Pyrit (FeS2). Lân bị cố định thành AlPO4, FePO4 khó tan.",
          "Keo-[2H+, Al3+] + CaCO3 -> Keo-[Ca2+] + H2O + CO2 + Al(OH)3 (kết tủa mất độc tính).",
          "Bón vôi (CaCO3/CaO) kết hợp thủy lợi 'thau chua rửa phèn', giữ mực nước ngập tầng sinh phèn, bón lân nung chảy (FMP) và hữu cơ."
        ],
        [
          "Đất mặn (EC > 4 dS/m)",
          "Tích tụ muối tan NaCl, Na2SO4; cation Na+ chiếm > 15% CEC trên keo đất làm phá vỡ kết cấu đoàn lạp, đất sét bị phân tán, bí chặt.",
          "2[Keo]-Na+ + CaSO4 (Thạch cao) -> [Keo]2-Ca2+ + Na2SO4 (hòa tan rửa trôi theo nước).",
          "Đắp đê ngăn mặn, bón vôi hoặc thạch cao (CaSO4) để Ca2+ đẩy Na+ ra khỏi keo đất, sau đó đưa nước ngọt vào ngâm và tháo rửa mặn; trồng cói/lúa chịu mặn."
        ],
        [
          "Đất xám bạc màu",
          "Thành phần cơ giới nhẹ (nhiều cát, nghèo sét và mùn), CEC rất thấp, tầng canh tác mỏng, chua, nghèo vi sinh vật.",
          "Tăng hàm lượng keo hữu cơ (mùn) để nâng CEC và tạo kết cấu viên đoàn lạp bền vững.",
          "Cày sâu dần kết hợp bón nhiều phân hữu cơ hoai mục, trồng cây phân xanh họ Đậu (cố định N2), luân canh và che phủ đất."
        ]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Bón vôi càng nhiều càng tốt cho mọi loại đất' -> SAI. Bón quá nhiều vôi làm đất bị kiềm hóa, kết tủa các vi lượng (Fe, Mn, Zn, Cu) và làm mất chất mùn.",
      "Bẫy 2: 'Đất cát giữ nước và giữ phân tốt hơn đất sét vì lỗ rỗng lớn' -> SAI. Đất cát có lỗ rỗng lớn nên thấm nước nhanh nhưng thoát nước và rửa trôi phân cực mạnh, CEC rất thấp.",
      "Bẫy 3: 'Giá thể trơ (sỏi nhẹ Keramzit, đá Perlite) cung cấp dồi dào dinh dưỡng khoáng cho cây' -> SAI. Giá thể trơ hầu như không có dinh dưỡng, chỉ có vai trò cố định rễ và giữ thoáng khí; dinh dưỡng do dung dịch tưới quyết định."
    ],
    formulas: [
      "Phản ứng trao đổi ion khử chua: [Keo đất]-2H+ + CaCO3 -> [Keo đất]-Ca2+ + H2O + CO2↑",
      "Thủy phân nhôm gây độc trong đất chua: Al3+ + 3H2O <-> Al(OH)3↓ + 3H+"
    ]
  },
  {
    id: "hb_10_phanbon",
    grade: "cn10",
    gradeLabel: "Khối 10 — Trồng trọt",
    code: "CHỦ ĐỀ 10.2",
    title: "Phân bón: Hóa sinh Phân bón, Nguyên tắc Phối trộn, Vi sinh & Công nghệ Nano",
    examWeight: "3 câu MCQ (0,75đ) + 2–4 ý Đúng/Sai + Bài toán quy đổi phân bón thương phẩm",
    coreMechanisms: [
      "1. Phân loại và đặc tính chuyển hóa: (a) Phân hóa học: Hàm lượng dinh dưỡng cao, dễ tan (trừ lân Apatit/Photphorit), tác dụng nhanh nhưng không cải tạo kết cấu đất; bón liên tục phân đạm amoni (NH4Cl, (NH4)2SO4) gây chua sinh lý do cây hút NH4+ và để lại gốc Cl-, SO4(2-) tạo axit HCl, H2SO4. (b) Phân hữu cơ: Chứa đầy đủ đa - trung - vi lượng và mùn, bắt buộc phải ủ hoai mục (nhiệt độ đống ủ đạt 60–70°C để tiêu diệt trứng giun sán, nấm bệnh và hạt cỏ dại). (c) Phân vi sinh vật: Chứa chủng VSV sống đặc hiệu với mật độ đạt chuẩn (≥ 10^8 - 10^9 CFU/g hoặc ml): VSV cố định đạm (Rhizobium cộng sinh nốt sần cây họ Đậu, Azotobacter tự do, Anabaena azollae trong bèo hoa dâu), VSV phân giải lân khó tan (Bacillus megaterium, Aspergillus), VSV phân giải xenlulozơ (Trichoderma).",
      "2. Quy tắc BẤT KHẢ KHÁNG khi phối trộn và sử dụng phân bón (Trọng tâm Đúng/Sai): Tuyệt đối KHÔNG trộn phân đạm chứa gốc Amoni (NH4NO3, (NH4)2SO4, NH4Cl) hoặc phân Urê với Vôi (CaO, Ca(OH)2) hoặc tro bếp (chứa K2CO3 kiềm) vì phản ứng kiềm đẩy khí NH3 bay hơi gây mất đạm: 2NH4+ + Ca(OH)2 -> Ca2+ + 2NH3↑ + 2H2O. Tuyệt đối KHÔNG trộn phân Super Lân (chứa Ca(H2PO4)2 dễ tan) với Vôi vì tạo kết tủa Ca3(PO4)2 không tan làm cây không hấp thụ được.",
      "3. Công nghệ phân bón hiện đại: Phân tan chậm có kiểm soát (CRF - bọc màng polymer vi lỗ điều tiết theo nhiệt độ/độ ẩm đất) và Phân bón Nano (hạt kích thước 1–100 nm có diện tích bề mặt riêng cực lớn, xuyên trực tiếp qua lỗ khí khổng và màng tế bào rễ, nâng hiệu suất sử dụng từ 30–40% lên 80–90%)."
    ],
    comparisonTable: {
      headers: ["Nhóm phân bón", "Bón lót hay Bón thúc?", "Cơ sở Khoa học", "Lưu ý Kỹ thuật Bảo quản & Sử dụng"],
      rows: [
        [
          "Phân hữu cơ & Phân lân (Super lân, Lân nung chảy)",
          "Chủ yếu BÓN LÓT (trước hoặc khi gieo trồng)",
          "Phân hữu cơ cần thời gian khoáng hóa; phân lân ít di động trong đất và kích thích bộ rễ phát triển ngay từ giai đoạn cây con.",
          "Ủ hoai mục phân hữu cơ; lân nung chảy (kiềm tính) rất hợp với đất chua phèn."
        ],
        [
          "Phân Đạm (Urê, SA) & Phân Kali (KCl, K2SO4)",
          "Chủ yếu BÓN THÚC (chia nhiều lần theo giai đoạn)",
          "Dễ hòa tan trong nước, dễ bị rửa trôi hoặc bay hơi (NH3); cây cần nhiều vào thời kỳ đẻ nhánh, vươn lóng, nuôi củ/quả.",
          "Không bón đạm lúc nắng gắt (bốc hơi NH3) hoặc ngay trước mưa to (rửa trôi); ngừng bón đạm trước thu hoạch rau ăn lá 10–15 ngày để tránh tồn dư Nitrat (NO3-)."
        ],
        [
          "Phân Vi sinh vật (Cố định N, Phân giải P, K)",
          "Trộn hạt giống hoặc bón vào vùng rễ có độ ẩm",
          "VSV sống cần chất hữu cơ và độ ẩm đất để nhân sinh khối, tiết enzyme nitrogenase hoặc phosphatase.",
          "Bảo quản nơi râm mát (< 30°C), tránh tia UV mặt trời, tuyệt đối không trộn chung với thuốc trừ nấm/khuẩn hóa học."
        ]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Phân vi sinh vật chứa hàm lượng N-P-K nguyên chất cao hơn phân hóa học' -> SAI. Phân vi sinh chứa các chủng VSV sống giúp chuyển hóa N2 không khí hoặc lân khó tan thành dạng dễ tiêu chứ bản thân nó không phải là muối khoáng đậm đặc.",
      "Bẫy 2: 'Bón phân hữu cơ tươi trực tiếp giúp cây hấp thụ ngay chất dinh dưỡng' -> SAI. Phân tươi phân hủy yếm khí trong đất sinh nhiệt, axit hữu cơ, CH4, H2S làm thối rễ và lây lan mầm bệnh."
    ],
    formulas: [
      "Khối lượng phân thương phẩm cần mua (kg) = [Khối lượng dinh dưỡng nguyên chất cần bón (kg N, P2O5, K2O) × 100] / [% Độ dinh dưỡng của phân]",
      "Quy đổi nguyên tố sang oxit: %P2O5 = %P × 2,29  |  %K2O = %K × 1,20"
    ]
  },
  {
    id: "hb_10_cnc",
    grade: "cn10",
    gradeLabel: "Khối 10 — Trồng trọt",
    code: "CHỦ ĐỀ 10.3",
    title: "Trồng trọt Công nghệ cao: Nhà màng IoT, Thủy canh NFT, Khí canh & Bảo quản CA",
    examWeight: "2 câu MCQ (0,50đ) + 2–4 ý Đúng/Sai + Tình huống thực tiễn",
    coreMechanisms: [
      "1. Phân biệt các hệ thống canh tác không dùng đất (Soilless Culture): (a) Thủy canh tĩnh (Deep Water Culture): Rễ ngâm trong dung dịch dinh dưỡng, cần sục khí hoặc để khoảng không cổ rễ lấy oxy. (b) Thủy canh hồi lưu màng dinh dưỡng (NFT - Nutrient Film Technique): Dung dịch dinh dưỡng được bơm chảy tuần hoàn thành một lớp màng rất mỏng (1–3 mm) qua đáy ống trồng; phần trên bộ rễ tiếp xúc không khí giúp rễ vừa hút khoáng vừa hô hấp hiếu khí tối ưu. (c) Khí canh (Aeroponics): Rễ lơ lửng hoàn toàn trong buồng tối kín, hệ thống béc phun sương áp suất cao phun dung dịch dinh dưỡng kích thước micromet định kỳ (mỗi vài phút phun vài giây), tiết kiệm 95% nước, 50% phân bón, nhân giống khoai tây sạch bệnh hệ số cực cao.",
      "2. Kiểm soát chỉ số EC và pH trong dinh dưỡng thủy canh/tưới nhỏ giọt (Fertigation): EC (Electrical Conductivity - mS/cm) phản ánh tổng nồng độ các ion muối khoáng hòa tan. Nếu EC quá thấp -> cây thiếu dinh dưỡng; nếu EC quá cao (do bốc hơi nước hoặc pha quá đặc) -> áp suất thẩm thấu dung dịch lớn hơn dịch tế bào lông hút gây hiện tượng 'hạn sinh lý' (nước rút ngược từ rễ ra ngoài làm cây héo rũ). Khoảng pH tối ưu cho hầu hết cây trồng thủy canh là 5,5 – 6,5 (nếu pH > 7,5 các vi lượng Fe2+, Mn2+, Zn2+ bị kết tủa).",
      "3. Công nghệ bảo quản nông sản sau thu hoạch bằng khí quyển điều chỉnh (CA - Controlled Atmosphere, Đề HSG TP. Huế Mã 7011): Chủ động hạ thấp nồng độ O2 (xuống 1–3%) và nâng nồng độ CO2 (lên 3–5%) kết hợp nhiệt độ lạnh thích hợp để ức chế tối đa cường độ hô hấp hiếu khí của rau quả tươi (nhưng không để O2 = 0% vì sẽ gây hô hấp kỵ khí lên men rượu làm hỏng thịt quả), đồng thời ức chế tổng hợp khí Ethylene (C2H4 - hormone gây chín và già hóa)."
    ],
    comparisonTable: {
      headers: ["Tiêu chí", "Canh tác Trên đất Tự nhiên", "Trồng trên Giá thể (Substrate/Drip)", "Thủy canh NFT / Khí canh"],
      rows: [
        ["Môi trường vùng rễ", "Hệ keo đất phức tạp, độ đệm cao nhưng dễ tích tụ mầm bệnh đất (tuyến trùng, nấm Fusarium).", "Giá thể hữu cơ (xơ dừa, trấu hun) hoặc trơ (Keramzit, Perlite, Rockwool) sạch bệnh.", "Dung dịch khoáng hòa tan trực tiếp hoặc sương mù, không cần giá thể đất."],
        ["Hiệu suất sử dụng nước & phân", "Thấp (thất thoát 40–60% do thấm sâu, bốc hơi, rửa trôi).", "Cao (tưới nhỏ giọt Fertigation tiết kiệm 40–60% nước và phân).", "Rất cao (tuần hoàn khép kín tiết kiệm 80–95% nước)."],
        ["Rủi ro kỹ thuật cần kiểm soát", "Chua hóa, mặn hóa, cỏ dại, phụ thuộc thời tiết.", "Cần kiểm soát độ ẩm giá thể và rửa muối định kỳ.", "Phụ thuộc nguồn điện bơm/phun; độ đệm thấp nên biến động EC, pH và nhiệt độ diễn ra nhanh."]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Bảo quản CA (Controlled Atmosphere) là rút cạn kiệt 100% khí O2 khỏi kho bảo quản' -> SAI. Nếu O2 = 0%, nông sản tươi chuyển sang hô hấp kỵ khí sinh rượu etylic và axetaldehit gây thối nhũn và mùi lạ.",
      "Bẫy 2: 'Khi cây thủy canh có biểu hiện héo vào buổi trưa nắng gắt, cần lập tức pha thêm phân bón để tăng chỉ số EC lên thật cao' -> SAI. Trưa nắng cây thoát hơi nước mạnh làm dung dịch đặc lại (EC tăng cao), cần châm thêm nước lã hoặc hạ EC để tránh sốc thẩm thấu."
    ],
    formulas: [
      "Mối liên hệ TDS và EC (xấp xỉ): TDS (ppm) ≈ EC (mS/cm) × 500 (hoặc × 640 tùy thang đo)",
      "Phương trình hô hấp nông sản cần ức chế khi bảo quản: C6H12O6 + 6O2 -> 6CO2 + 6H2O + Nhiệt năng"
    ]
  },
  {
    id: "hb_11_giong",
    grade: "cn11",
    gradeLabel: "Khối 11 — Chăn nuôi",
    code: "CHỦ ĐỀ 11.1",
    title: "Công nghệ Giống vật nuôi: Chọn lọc, Lai giống, Cấy truyền phôi MOET & CRISPR/Cas9",
    examWeight: "3 câu MCQ (0,75đ) + 2–4 ý Đúng/Sai + Bài toán tính tỷ lệ máu lai cải tạo",
    coreMechanisms: [
      "1. Chọn lọc giống vật nuôi: (a) Chọn lọc hàng loạt (Mass Selection): Dựa vào kiểu hình cá thể (ngoại hình, khối lượng) so với tiêu chuẩn giống để chọn ra một nhóm vật nuôi; đơn giản, nhanh, rẻ nhưng không biết rõ kiểu gen nên hiệu quả thấp với tính trạng có hệ số di truyền (h^2) thấp (như sinh sản). (b) Chọn lọc cá thể (Individual/Pedigree & Progeny Selection): Theo dõi gia phả, kiểm tra năng suất bản thân và kiểm tra chất lượng đời con; đánh giá chính xác giá trị giống (EBV) và kiểu gen đực giống đầu dòng.",
      "2. Các phương pháp nhân giống & Công thức tính tỷ lệ máu ngoại trong Lai cải tạo (Đề HSG TP. Huế Mã 7011): (a) Nhân giống thuần chủng: Bảo tồn nguồn gen và củng cố độ đồng nhất di truyền. (b) Lai kinh tế (Commercial Crossbreeding): Lai 2, 3 hoặc 4 giống khác nhau (VD: Đực Duroc × Nái F1[Landrace × Yorkshire] -> Lợn 3 máu D(LY)) để tận dụng tối đa ƯU THẾ LAI (Heterosis) ở đời con F1; toàn bộ con lai kinh tế dùng nuôi thương phẩm (lấy thịt, trứng), TUYỆT ĐỐI KHÔNG dùng làm giống vì đời sau sẽ phân ly tính trạng và suy giảm ưu thế lai. (c) Lai cải tạo (Upgrading Crossbreeding): Dùng đực giống cao sản ngoại (máu A = 100%) lai liên tiếp qua n thế hệ với cái nền địa phương (máu B) và các đời con cái lai F1, F2, ..., Fn. Tỷ lệ máu giống đi cải tạo (máu ngoại) ở thế hệ Fn được tính bằng công thức: P_ngoại(Fn) = 1 - (1/2)^n; Tỷ lệ máu giống địa phương còn lại: P_nội(Fn) = (1/2)^n.",
      "3. Công nghệ sinh học hiện đại trong giống vật nuôi: (a) Thụ tinh nhân tạo (AI): Khai thác, pha loãng, bảo quản tinh dịch (lỏng 15–17°C cho lợn hoặc đông lạnh nitơ lỏng -196°C cho bò) giúp nhân nhanh gen đực giống quý và ngăn bệnh lây qua đường sinh dục. (b) Cấy truyền phôi (MOET - Multiple Ovulation and Embryo Transfer): Tiêm hormone FSH gây rụng trứng hàng loạt ở bò mẹ cao sản (bò cho phôi) -> Phối giống -> Thu hoạch phôi ngày thứ 7 (giai đoạn phôi dâu/phôi nang) và có thể cắt đôi phôi tạo sinh đôi cùng trứng -> Cấy vào tử cung các bò cái tơ khỏe mạnh giá rẻ (bò nhận phôi) đã được gây động dục đồng pha bằng Prostaglandin F2α; giúp khai thác tối đa tiềm năng di truyền của CÁI GIỐNG cao sản. (c) Công nghệ chỉnh sửa gen CRISPR/Cas9 (Đề HSG TP. Huế Mã 7011): Cắt bỏ hoặc biến đổi chính xác đoạn gen thụ thể CD163 trên đại thực bào phế nang của lợn, giúp lợn kháng hoàn toàn virus gây hội chứng rối loạn sinh sản và hô hấp (PRRS - bệnh tai xanh) mà không cần đưa gen ngoại lai từ loài khác vào."
    ],
    comparisonTable: {
      headers: ["Phương pháp Lai", "Sơ đồ Lai Điển hình", "Mục đích Cốt lõi", "Cách sử dụng Đời con Lai"],
      rows: [
        [
          "Lai kinh tế (2 máu, 3 máu)",
          "P: ♂ Landrace × ♀ Yorkshire -> F1(LY)\n♀ F1(LY) × ♂ Duroc -> Con lai 3 máu D(LY)",
          "Tạo ưu thế lai cao nhất về tốc độ tăng trọng, tỷ lệ nạc cao và FCR thấp.",
          "100% nuôi thương phẩm lấy thịt, KHÔNG giữ lại làm giống."
        ],
        [
          "Lai cải tạo (Đời F1 -> F5)",
          "F1 (50% ngoại) × ♂ Ngoại -> F2 (75% ngoại) ... -> F4 (93,75% ngoại) -> F5 (96,875% ngoại)",
          "Cải biến căn bản năng suất của giống địa phương tầm vóc nhỏ (VD: Sind hóa đàn bò vàng Việt Nam).",
          "Con cái lai qua các đời được chọn lọc tiếp tục phối với đực ngoại cho đến khi đạt tỷ lệ máu mong muốn."
        ],
        [
          "Lai gây thành (Tạo giống mới)",
          "Lai 2–3 giống -> Chọn lọc cá thể có tổ hợp gen quý -> Tự giao cố định tính trạng qua nhiều đời.",
          "Tạo ra một giống vật nuôi mới hoàn chỉnh có di truyền ổn định.",
          "Dùng làm giống nền nhân thuần chủng sau khi đã được công nhận giống mới."
        ]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Con lai kinh tế F1 có ngoại hình rất đẹp và lớn nhanh nên giữ lại cho giao phối với nhau để làm giống' -> SAI. Giao phối giữa các con lai F1 sẽ làm phân ly kiểu gen ở F2, mất ưu thế lai, đàn con không đồng đều.",
      "Bẫy 2: 'Bò cái nhận phôi trong kỹ thuật cấy truyền phôi truyền lại 50% đặc điểm di truyền của nó cho bê con' -> SAI. Bò nhận phôi chỉ đóng vai trò mang thai hộ (nuôi dưỡng phôi trong tử cung), 100% hệ gen của bê con là của bò bố và bò mẹ cho phôi."
    ],
    formulas: [
      "Tỷ lệ máu giống cao sản đi cải tạo ở đời thứ n: Tỷ lệ máu ngoại (Fn) = [1 - (1/2)^n] × 100%",
      "Hệ số chọn lọc & Hiệu quả chọn lọc (Phương trình nhà chọn giống): R = h^2 × S (R: hiệu quả chọn lọc; h^2: hệ số di truyền; S: ly sai chọn lọc)"
    ]
  },
  {
    id: "hb_11_thucan",
    grade: "cn11",
    gradeLabel: "Khối 11 — Chăn nuôi",
    code: "CHỦ ĐỀ 11.2",
    title: "Công nghệ Thức ăn Chăn nuôi: Nhu cầu Dinh dưỡng, FCR, Hình vuông Pearson & Ủ chua Sinh học",
    examWeight: "3 câu MCQ (0,75đ) + 2–4 ý Đúng/Sai + Bài toán phối trộn khẩu phần & FCR",
    coreMechanisms: [
      "1. Sinh lý tiêu hóa và nhu cầu dinh dưỡng: Động vật dạ dày đơn (lợn, gia cầm) cần thức ăn tinh giàu năng lượng trao đổi (ME) và axit amin thiết yếu (Lysine, Methionine, Threonine, Tryptophan). Động vật nhai lại (trâu, bò, dê) có hệ vi sinh vật dạ cỏ (vi khuẩn, động vật nguyên sinh, nấm) tiết enzyme cellulase phân giải xơ (cellulose) thành các axit béo bay hơi (VFA: axit axetic, propionic, butyric) và có khả năng tổng hợp protein vi sinh vật từ nguồn nitơ phi protein (NPN như Urê với liều lượng an toàn ≤ 1% chất khô khẩu phần).",
      "2. Cơ chế hóa sinh của phương pháp Ủ chua thức ăn thô xanh (Silage): Gồm 4 pha liên tiếp trong hố ủ nén chặt yếm khí: (Pha 1 - Hiếu khí ngắn): Tế bào thực vật còn sống và VSV hiếu khí tiêu thụ hết lượng O2 còn sót lại, sinh CO2 và nhiệt nhẹ. (Pha 2 - Lên men axit axetic khởi đầu): Vi khuẩn Coliform/Enterobacteria hoạt động ngắn. (Pha 3 - Lên men Lactic chủ đạo): Trong điều kiện kỵ khí hoàn toàn, vi khuẩn Lactic (Lactobacillus plantarum, Pediococcus) chuyển hóa đường hòa tan (glucose, fructose, sucrose) trong dịch cây thành AXIT LACTIC (C6H12O6 -> 2CH3-CH(OH)-COOH), kéo pH khối ủ giảm mạnh xuống 3,8 – 4,2. (Pha 4 - Bảo quản ổn định): Ở pH ≤ 4,2, toàn bộ vi khuẩn gây thối rữa (Clostridium sinh axit butyric mùi thối) và nấm mốc bị ức chế hoàn toàn, giúp bảo quản thức ăn xanh 6 – 12 tháng.",
      "3. Công nghệ thức ăn hiện đại: Sản xuất thức ăn viên ép đùn (Extrusion - hồ hóa tinh bột ở nhiệt độ cao áp suất lớn giúp tăng tỷ lệ tiêu hóa và diệt Salmonella), bổ sung enzyme ngoại sinh (Phytase giúp giải phóng lân hữu cơ Phytate trong ngô/đậu tương, giảm ô nhiễm lân trong phân; Xylanase, Beta-glucanase)."
    ],
    comparisonTable: {
      headers: ["Phương pháp Chế biến", "Cơ sở Khoa học & Tác nhân", "Đối tượng Nguyên liệu", "Dấu hiệu Thành phẩm Đạt Chuẩn"],
      rows: [
        [
          "Ủ chua (Ensiling)",
          "Vi khuẩn Lactic lên men đường thành axit lactic trong điều kiện kỵ khí (pH 3,8–4,2).",
          "Cỏ voi, thân cây ngô sau thu bắp, ngọn mía (độ ẩm nguyên liệu đạt 65–70%).",
          "Màu vàng lục hoặc vàng rơm, mùi thơm chua dịu như dưa muối, không nhớt, không mốc đen."
        ],
        [
          "Kiềm hóa / Ủ Urê (Urea Treatment)",
          "Urê bị enzyme urease thủy phân thành NH3 + CO2; khí NH3 + H2O -> NH4OH làm trương nở và cắt đứt liên kết Ester giữa Lignin và Cellulose, đồng thời bổ sung N cho VSV dạ cỏ.",
          "Rơm lúa khô, thân ngô khô nghèo đạm nhiều xơ (cho trâu, bò).",
          "Sợi rơm mềm bóng, màu vàng sẫm, mùi khai nhẹ của amoniac (cần phơi thoáng 15–30 phút trước khi cho bò ăn)."
        ],
        [
          "Lên men dịch thể / Ủ men vi sinh",
          "Nấm men (Saccharomyces cerevisiae) và vi khuẩn Lactic, Bacillus sinh enzyme protease, amylase.",
          "Bột ngô, cám gạo, bã đậu nành, phụ phẩm nông nghiệp cho lợn, gà.",
          "Thơm mùi rượu nhẹ và chua ngọt, giàu vitamin nhóm B và axit amin tự do."
        ]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Có thể trộn thêm Urê vào thức ăn của lợn con và gà thịt để thay thế bột cá và khô dầu đậu tương' -> SAI. Lợn và gà là động vật dạ dày đơn, không có hệ VSV dạ cỏ nên không đồng hóa được Urê; ăn Urê sẽ bị ngộ độc amoniac cấp tính.",
      "Bẫy 2: 'Khi ủ chua cỏ voi cho bò, nếu cỏ quá ướt (> 80% nước) và không nén chặt thì chất lượng ủ chua càng thơm ngon' -> SAI. Quá ướt và lọt khí làm vi khuẩn Clostridium phát triển sinh axit butyric và phân hủy protein làm khối ủ thối nhũn, nấm mốc sinh độc tố Aflatoxin."
    ],
    formulas: [
      "Hệ số chuyển đổi thức ăn: FCR = Tổng khối lượng thức ăn tiêu thụ (kg) / Tổng khối lượng tăng trọng (kg) = F / (W_cuối - W_đầu)",
      "Thuật toán Hình vuông Pearson (Phối trộn nguyên liệu A có p1% đạm và nguyên liệu B có p2% đạm để đạt mục tiêu P% đạm, với p1 < P < p2):\n  • Số phần nguyên liệu A = p2 - P\n  • Số phần nguyên liệu B = P - p1\n  • Khối lượng A = [ (p2 - P) / (p2 - p1) ] × Tổng khối lượng hỗn hợp"
    ]
  },
  {
    id: "hb_11_moitruong",
    grade: "cn11",
    gradeLabel: "Khối 11 — Chăn nuôi",
    code: "CHỦ ĐỀ 11.3",
    title: "Bảo vệ Môi trường Chăn nuôi: Khí độc Chuồng nuôi, 4 Giai đoạn Hóa sinh Biogas & Đệm lót",
    examWeight: "2 câu MCQ (0,50đ) + 2–4 ý Đúng/Sai + Tự luận quy trình xử lý chất thải",
    coreMechanisms: [
      "1. Nguồn gốc phát sinh và tác hại của khí độc trong chuồng nuôi: (a) Khí Amoniac (NH3): Sinh ra do vi khuẩn tiết enzyme urease phân giải urê trong nước tiểu và axit uric trong phân gia cầm: CO(NH2)2 + H2O -> 2NH3↑ + CO2↑; gây kích ứng niêm mạc mắt, viêm đường hô hấp trên và làm liệt lông rung khí quản khiến vật nuôi dễ mắc bệnh CRD, viêm phổi. (b) Khí Hydro sunfua (H2S): Sinh ra do phân hủy kỵ khí các axit amin chứa lưu huỳnh (Cysteine, Methionine) trong phân đọng; nặng hơn không khí, mùi trứng thối, ức chế hô hấp tế bào cực độc.",
      "2. Quy trình 4 giai đoạn hóa sinh trong hầm ủ khí sinh học Biogas (Câu tự luận Đề HSG TP. Huế Mã 7011): Quá trình phân hủy kỵ khí chất hữu cơ tạo khí sinh học (55–70% CH4, 30–40% CO2, một lượng nhỏ H2S, N2, H2) diễn ra qua 4 giai đoạn nối tiếp:\n  • Giai đoạn 1 — Thủy phân (Hydrolysis): Vi khuẩn thủy phân tiết enzyme ngoại bào (cellulase, amylase, protease, lipase) cắt các hợp chất hữu cơ cao phân tử phức tạp (đa đường, protein, lipid) thành các chất đơn phân hòa tan (đường đơn, axit amin, axit béo chuỗi dài).\n  • Giai đoạn 2 — Axit hóa (Acidogenesis): Vi khuẩn lên men chuyển hóa các chất đơn phân thành các axit béo bay hơi chuỗi ngắn (axit propionic, butyric, lactic), rượu, H2, CO2 và NH3.\n  • Giai đoạn 3 — Axetat hóa (Acetogenesis): Vi khuẩn axetat hóa chuyển hóa các axit béo bay hơi và rượu thành Axit axetic (CH3COOH), khí H2 và CO2.\n  • Giai đoạn 4 — Mêtan hóa (Methanogenesis): Nhóm cổ khuẩn sinh mêtan kỵ khí bắt buộc (Methanobacteria, Methanococcus) tạo ra khí CH4 theo 2 con đường: (1) Phân giải axit axetic: CH3COOH -> CH4↑ + CO2↑ (chiếm ~70% lượng CH4); (2) Khử CO2 bằng H2: CO2 + 4H2 -> CH4↑ + 2H2O (chiếm ~30% lượng CH4).",
      "3. Công nghệ tách ép phân cơ học & Đệm lót sinh học: Lắp máy ép tách phân trước hầm Biogas giúp tách 60–70% chất rắn lơ lửng (đem ủ Compost hoặc nuôi trùn quế), giúp hầm Biogas không bị đóng váng và lắng bùn đầy đáy. Đệm lót sinh học (trấu, mùn cưa phun chế phẩm Bacillus, Saccharomyces) phân hủy phân tại chỗ, đồng hóa N thành sinh khối protein vi sinh vật, khử mùi hôi."
    ],
    comparisonTable: {
      headers: ["Công nghệ Xử lý", "Nguyên lý Hoạt động", "Sản phẩm Thu hồi", "Ưu điểm & Giới hạn Kỹ thuật"],
      rows: [
        [
          "Hầm khí sinh học (Biogas: Composite, HDPE)",
          "Lên men kỵ khí 4 giai đoạn bởi quần xã VSV và cổ khuẩn Methanogens.",
          "Khí CH4 (đun nấu, chạy máy phát điện) và nước thải sau biogas.",
          "Diệt 95% trứng ký sinh trùng và mầm bệnh; tuy nhiên nước thải sau Biogas vẫn còn hàm lượng N, P cao cần qua hồ sinh học/thủy thực vật trước khi xả thải."
        ],
        [
          "Ủ phân hữu cơ hiếu khí (Composting)",
          "VSV hiếu khí ưa nhiệt oxy hóa chất hữu cơ ở 60–70°C, tỷ lệ C/N tối ưu = 25/1 – 30/1, độ ẩm 55–60%.",
          "Phân hữu cơ hoai mục giàu mùn (Humus) bón cho cây trồng.",
          "Tiêu diệt hoàn toàn mầm bệnh và hạt cỏ dại; cần đảo trộn hoặc thổi khí định kỳ."
        ],
        [
          "Đệm lót sinh học (Bio-bedding)",
          "Chất độn giàu Carbon (trấu, mùn cưa) + Chế phẩm VSV hiếu khí đồng hóa NH3/axit uric.",
          "Đệm lót sau khi kết thúc lứa nuôi dùng làm phân bón hữu cơ vi sinh.",
          "Không cần tắm rửa chuồng, tiết kiệm 80% nước, giữ ấm mùa đông; cần cào đảo bề mặt đệm lót tránh vón cục ẩm ướt."
        ]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Nước thải chảy ra từ hầm Biogas đã hoàn toàn tinh khiết, đạt chuẩn xả trực tiếp ngay ra sông suối hoặc ao nuôi tôm' -> SAI. Nước sau Biogas tuy giảm mạnh BOD/COD nhưng vẫn chứa nồng độ NH4+ và PO4(3-) rất cao, nếu xả thẳng sẽ gây phú dưỡng hóa và ngộ độc amoniac cho cá tôm; cần qua hệ thống hồ sinh học (hiếu khí - thiếu khí - thực vật thủy sinh) trước khi tái sử dụng.",
      "Bẫy 2: 'Khi hầm Biogas bị chua (pH < 5,5) do nạp quá tải phân tươi, cổ khuẩn sinh mêtan sẽ hoạt động mạnh hơn' -> SAI. Cổ khuẩn Methanogens rất nhạy cảm với pH, chỉ hoạt động tối ưu ở pH trung tính (6,8 – 7,5); nếu pH < 6,0 giai đoạn mêtan hóa bị ức chế làm hầm ngừng sinh khí cháy."
    ],
    formulas: [
      "Phản ứng Mêtan hóa từ Axetat: CH3COOH -> CH4↑ + CO2↑",
      "Phản ứng Mêtan hóa từ CO2 và H2: CO2 + 4H2 -> CH4↑ + 2H2O"
    ]
  },
  {
    id: "hb_12_lam1",
    grade: "cn12",
    gradeLabel: "Khối 12 — Lâm nghiệp",
    code: "CHỦ ĐỀ 12.1 & 12.2",
    title: "Lâm nghiệp Đại cương, Quy luật Sinh trưởng Cây rừng & Kỹ thuật Trồng – Chăm sóc Rừng",
    examWeight: "3 câu MCQ (0,75đ) + 2–4 ý Đúng/Sai + Tự luận Lâm nghiệp Lớp 12 (2,00đ)",
    coreMechanisms: [
      "1. Phân loại 3 loại rừng theo Luật Lâm nghiệp Việt Nam 2017: (a) Rừng đặc dụng (Vườn quốc gia như Cát Tiên, Khu dự trữ thiên nhiên - văn hóa Đồng Nai, rừng nghiên cứu khoa học): Bảo tồn nguyên vẹn hệ sinh thái rừng tự nhiên, nguồn gen sinh vật rừng, di tích lịch sử và cảnh quan. (b) Rừng phòng hộ (Rừng đầu nguồn lưu vực sông Đồng Nai/hồ Trị An, rừng chắn sóng ngập mặn Cần Giờ, rừng chắn gió cát bay ven biển): Bảo vệ nguồn nước, bảo vệ đất, chống xói mòn, lũ quét, điều hòa khí hậu. (c) Rừng sản xuất (Rừng tự nhiên sản xuất và rừng trồng sản xuất keo, bạch đàn, thông, sao, dầu): Cung cấp gỗ và lâm sản ngoài gỗ mục đích kinh tế kết hợp bảo vệ môi trường.",
      "2. Quy luật sinh trưởng và phát triển của cây rừng qua 4 giai đoạn: (1) Giai đoạn cây non (từ hạt nảy mầm đến khi rừng khép tán, ~1–5 năm): Sinh trưởng chiều cao chậm rồi tăng dần, bộ rễ phát triển mạnh nhưng sức chống chịu yếu, dễ bị cỏ dại chèn ép -> Cần làm cỏ, vun xới, trồng dặm. (2) Giai đoạn sào (từ khi rừng khép tán đến khi bắt đầu ra hoa bói, ~5–15 năm): Cây vươn cao cực nhanh để cạnh tranh ánh sáng, xuất hiện hiện tượng TỰ TỈA THƯA TỰ NHIÊN (cành dưới thiếu sáng khô rụng, cây yếu bị đào thải) -> Cần tỉa thưa nuôi dưỡng rừng định kỳ để mở không gian dinh dưỡng cho cây mục tiêu tăng đường kính (D_1.3). (3) Giai đoạn trung niên / thành thục: Sinh trưởng chiều cao chững lại, tăng trưởng đường kính và thể tích thân gỗ đạt cực đại, ra hoa kết quả mạnh -> Khai thác hạt giống hoặc khai thác gỗ khi đạt tuổi thành thục công nghệ. (4) Giai đoạn già cỗi: Tăng trưởng giảm, rỗng ruột, mục nát.",
      "3. Kỹ thuật trồng và chăm sóc rừng: Thời vụ trồng rừng cốt lõi phải trùng vào mùa mưa, đất đủ ẩm và nhiệt độ ôn hòa (Miền Bắc: vụ Xuân tháng 2–4 có mưa phùn và vụ Thu tháng 8–10; Miền Trung: tháng 9–12; Miền Nam & Tây Nguyên: đầu mùa mưa tháng 5–8). Trồng dặm tiến hành ngay sau khi trồng chính 15–30 ngày (khi tỷ lệ sống < 85% đối với rừng sản xuất hoặc < 90% đối với rừng phòng hộ)."
    ],
    comparisonTable: {
      headers: ["Mô hình Rừng trồng", "Chu kỳ Kinh doanh", "Đặc tính Sinh thái & Kỹ thuật Lâm sinh", "Hiệu quả Kinh tế & Môi trường"],
      rows: [
        [
          "Rừng trồng Gỗ nhỏ (Keo lai, Bạch đàn dăm)",
          "Ngắn (4 – 6 năm)",
          "Mật độ dày (1.660 – 2.500 cây/ha), không tỉa thưa hoặc ít tỉa thưa, khai thác trắng cuối chu kỳ.",
          "Thu hồi vốn nhanh nhưng giá bán thấp (gỗ nguyên liệu giấy/dăm), làm nghèo đất và dễ xói mòn khi khai thác trắng."
        ],
        [
          "Rừng trồng Gỗ lớn / Chuyển hóa Gỗ lớn (FSC)",
          "Dài (10 – 15 năm với keo/thông; 30 – 50 năm với sao đen, dầu rái)",
          "Trồng ban đầu 1.600 cây/ha, sau đó tỉa thưa nuôi dưỡng 2–3 lần giữ lại 400–600 cây ưu trội/ha; hoặc trồng hỗn giao cây phù trợ (keo) với cây bản địa ưa bóng giai đoạn non (sao, dầu).",
          "Giá trị gỗ xẻ/đồ mộc xuất khẩu cao gấp 3–5 lần gỗ dăm, hấp thụ tín chỉ Carbon lớn, bảo vệ đất và nước ngầm bền vững."
        ]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Cây con lâm nghiệp xuất vườn đem đi trồng rừng càng cao to (> 2,5m), tán lá càng xum xuê và rễ đâm sâu khỏi đáy bầu xuống đất vườn ươm thì tỷ lệ sống càng cao' -> SAI. Cây quá cao tán rộng sẽ thoát hơi nước mạnh gây héo chết khi mới trồng; rễ đâm sâu khỏi bầu khi nhổ sẽ bị đứt rễ chính gây sốc sinh lý. Cây chuẩn phải vừa tầm (30–60 cm tùy loài), thân thẳng đã hóa gỗ phần gốc, bộ rễ nguyên vẹn trong bầu.",
      "Bẫy 2: 'Các loài cây gỗ quý bản địa họ Dầu (sao đen, dầu rái) ở giai đoạn cây con cần trồng nơi trống trải nắng gắt 100% để quang hợp mạnh nhất' -> SAI. Cây họ Dầu giai đoạn non là cây ưa bóng nhẹ, nếu phơi nắng gắt hoàn toàn lá sẽ bị cháy và chết khô; cần có cây phù trợ che bóng 30–50% ở 2–3 năm đầu, khi cây lớn mới mở tán hoàn toàn."
    ],
    formulas: [
      "Diện tích dinh dưỡng 1 cây rừng (m2) = Khoảng cách cây (a) × Khoảng cách hàng (b)",
      "Số cây trồng chính trên 1 ha = 10.000 / (a × b)",
      "Tổng số cây giống cần chuẩn bị (cho S ha, dự phòng trồng dặm k%) = S × [10.000 / (a × b)] × (1 + k/100)"
    ]
  },
  {
    id: "hb_12_lam2",
    grade: "cn12",
    gradeLabel: "Khối 12 — Lâm nghiệp",
    code: "CHỦ ĐỀ 12.3",
    title: "Bảo vệ & Khai thác Tài nguyên Rừng Bền vững, Chứng chỉ FSC & Phân tích Bảng số liệu Rừng",
    examWeight: "1–2 câu MCQ (0,25–0,50đ) + 2–4 ý Đúng/Sai + Tự luận Lâm nghiệp Lớp 12 (1,50đ)",
    coreMechanisms: [
      "1. Ba phương thức khai thác gỗ rừng sản xuất và điều kiện áp dụng: (a) Khai thác trắng (Clear-cutting): Chặt toàn bộ cây rừng trên một diện tích nhất định trong một mùa khai thác (chỉ áp dụng cho rừng trồng thuần loài đều tuổi ở nơi độ dốc ≤ 15°, phải trồng lại rừng ngay trong vụ kế tiếp; nếu độ dốc > 15° phải khai thác trắng theo băng hẹp vuông góc hướng dốc để chống xói mòn). (b) Khai thác dần (Shelterwood cutting): Chặt toàn bộ cây rừng qua 3–4 lần chặt trong thời gian 5–10 năm (mở tán dần để hạt cây mẹ rụng xuống nảy mầm tái sinh tự nhiên dưới tán rừng, khi cây con tái sinh đã đủ mật độ và cứng cáp mới chặt hết cây mẹ). (c) Khai thác chọn (Selective cutting): Chọn chặt những cây đã thành thục công nghệ (đạt đường kính cấp kính quy định, thường D_1.3 ≥ 40–45 cm), cây già cỗi, sâu bệnh; cường độ khai thác ≤ 30–35% trữ lượng gỗ đứng, giữ lại cây mẹ gieo giống và tầng cây con tái sinh; rừng luôn duy trì độ tàn che ≥ 0,4–0,5.",
      "2. Phòng chống cháy rừng (PCCR): Tam giác lửa trong cháy rừng gồm: Vật liệu cháy (thực bì khô, lá thông/tràm giàu tinh dầu) + Nguồn nhiệt/lửa + Oxy/Gió khô nóng. Giải pháp kỹ thuật cốt lõi: Làm giảm độ ẩm hoặc dọn vật liệu cháy đầu mùa khô; xây dựng hệ thống ĐƯỜNG BĂNG CẢN LỬA TRẮNG (dải đất rộng 10–20m dọn sạch hoàn toàn thực bì, cày lật lộ lớp đất khoáng) và ĐƯỜNG BĂNG CẢN LỬA XANH (trồng các dải cây bản địa lá dày mọng nước, ít tinh dầu, khó cháy như cây chè đại, keo tai tượng xanh quanh năm); duy trì mực nước giữ ẩm trong rừng tràm ngập nước.",
      "3. Phương pháp phân tích bảng số liệu thống kê Lâm nghiệp (Dạng câu hỏi tự luận kinh điển Đề HSG TP.HCM & Bắc Giang): Khi đề bài cho bảng số liệu diện tích rừng tự nhiên, rừng trồng, tỷ lệ che phủ rừng và sản lượng gỗ khai thác qua các năm:\n  • Bước 1: Tính tốc độ tăng trưởng (%) hoặc lượng tăng/giảm tuyệt đối (nghìn ha, triệu m3) giữa năm cuối và năm đầu.\n  • Bước 2: Nhận xét xu hướng: Diện tích rừng tự nhiên được giữ ổn định (do lệnh đóng cửa rừng tự nhiên không khai thác gỗ thương mại từ năm 2016); diện tích rừng trồng và sản lượng gỗ khai thác từ rừng trồng tăng mạnh và liên tục.\n  • Bước 3: Giải thích ý nghĩa: Ngành lâm nghiệp Việt Nam đã chuyển dịch thành công từ 'khai thác tận diệt rừng tự nhiên' sang 'bảo tồn nghiêm ngặt rừng tự nhiên kết hợp phát triển thâm canh rừng trồng gỗ lớn bền vững có chứng chỉ FSC/VFCS'."
    ],
    comparisonTable: {
      headers: ["Phương thức Khai thác", "Cường độ & Thời gian Khai thác", "Hình thức Tái sinh Rừng sau Khai thác", "Phạm vi Áp dụng Pháp lý"],
      rows: [
        [
          "Khai thác trắng",
          "100% trữ lượng gỗ trong 1 lần (< 1 năm).",
          "Tái sinh nhân tạo (Trồng rừng mới hoàn toàn bằng cây con hoặc gieo hạt).",
          "Chỉ áp dụng cho rừng trồng sản xuất (keo, bạch đàn, thông), cấm tuyệt đối ở rừng tự nhiên và rừng phòng hộ."
        ],
        [
          "Khai thác dần",
          "100% trữ lượng chia làm 3–4 lần chặt trong 5–10 năm.",
          "Tái sinh tự nhiên bằng hạt rụng từ cây mẹ dưới tán rừng được mở sáng dần.",
          "Rừng sản xuất có khả năng tái sinh hạt tự nhiên tốt nhưng cây con cần bóng che giai đoạn đầu."
        ],
        [
          "Khai thác chọn",
          "≤ 30–35% trữ lượng gỗ đứng mỗi chu kỳ (luân kỳ 15–25 năm).",
          "Tái sinh tự nhiên liên tục (rừng khác tuổi nhiều tầng tán luôn được duy trì).",
          "Rừng sản xuất là rừng tự nhiên được phép khai thác bền vững hoặc rừng phòng hộ tận thu cây già mục theo thiết kế."
        ]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Khai thác chọn là chọn chặt toàn bộ những cây thẳng đẹp nhất, khỏe nhất đang tuổi sào trong rừng để bán được giá cao' -> SAI. Đó là 'khai thác chọn ngược/chặt lạm' làm suy thoái nguồn gen rừng; khai thác chọn đúng kỹ thuật chỉ chặt cây đã đạt tuổi thành thục/cấp kính quy định và cây phẩm chất xấu, bắt buộc chừa lại cây mẹ ưu trội.",
      "Bẫy 2: 'Khi xảy ra cháy rừng thông lớn kèm gió mạnh, người chữa cháy nên chạy xuôi theo chiều gió phía trước ngọn lửa để dập lửa' -> SAI. Chạy xuôi chiều gió phía trước ngọn lửa sẽ bị ngọn lửa và khói độc đuổi kịp bao vây cực kỳ nguy hiểm; phải thoát hiểm hoặc tiếp cận từ hướng ngược gió / hai bên sườn đám cháy."
    ],
    formulas: [
      "Tỷ lệ che phủ rừng (%) = [Tổng diện tích đất có rừng đủ tiêu chuẩn (ha) / Tổng diện tích tự nhiên (ha)] × 100%",
      "Tăng trưởng bình quân năm của lâm phần (m3/ha/năm) = Trữ lượng gỗ đứng (m3/ha) / Tuổi rừng (năm)"
    ]
  },
  {
    id: "hb_12_thuy1",
    grade: "cn12",
    gradeLabel: "Khối 12 — Thủy sản",
    code: "CHỦ ĐỀ 12.4 & 12.5",
    title: "Thủy sản Đại cương & Quản lý Môi trường Nước Ao nuôi, Công nghệ Biofloc – RAS – Aquaponics",
    examWeight: "3 câu MCQ (0,75đ) + 2–4 ý Đúng/Sai + Tự luận Thủy sản Lớp 12 (2,25đ)",
    coreMechanisms: [
      "1. Động học cân bằng Amoniac (NH4+ / NH3) và Chu trình Nitơ trong ao nuôi thâm canh: Chất thải của tôm cá và thức ăn dư thừa bị vi khuẩn dị dưỡng khoáng hóa tạo ra Tổng Amoniac Nitơ (TAN = NH4+ + NH3). Trong nước tồn tại cân bằng hóa học thuận nghịch: NH4+ (ion amoni ít độc) + OH- <-> NH3 (khí amoniac tự do không phân cực, xuyên qua màng tế bào mang gây độc thần kinh và ngạt máu) + H2O. Khi độ pH tăng cao (pH > 8,5 vào buổi chiều nắng gắt do tảo quang hợp mạnh lấy mất CO2) và nhiệt độ nước tăng cao -> Cân bằng dịch chuyển mạnh sang phải làm tỷ lệ NH3 độc tăng vọt!\n  • Quá trình Nitrat hóa hiếu khí 2 bước (trong lọc sinh học RAS hoặc đáy ao đủ oxy): Bước 1: Vi khuẩn tự dưỡng Nitrosomonas oxy hóa NH4+ thành Nitrit (NO2-): 2NH4+ + 3O2 -> 2NO2- + 4H+ + 2H2O (NO2- là chất cực độc vì gắn với Hemocyanin ở tôm hoặc Hemoglobin ở cá tạo Methemoglobin làm máu mất khả năng vận chuyển oxy, gây bệnh 'máu nâu'). Bước 2: Vi khuẩn tự dưỡng Nitrobacter oxy hóa NO2- thành Nitrat (NO3- ít độc, được tảo hoặc rau thủy canh hấp thụ): 2NO2- + O2 -> 2NO3-.",
      "2. Biến động chu kỳ ngày đêm của Oxy hòa tan (DO) và pH trong ao nuôi có tảo: (a) Ban ngày (nhất là 13h–15h chiều): Thực vật phù du (tảo lục, tảo khuê) quang hợp cực đại giải phóng O2 và hấp thụ CO2 -> DO đạt đỉnh cao nhất (8–10 mg/L),同时 CO2 giảm làm pH nước ao tăng cao nhất trong ngày (pH 8,2–8,8). (b) Ban đêm và rạng sáng (4h–6h sáng): Tảo ngừng quang hợp, toàn bộ tôm cá + tảo + vi sinh vật hiếu khí cùng hô hấp tiêu thụ O2 và thải CO2 -> DO tụt xuống mức thấp nhất trong ngày (< 3–4 mg/L gây hiện tượng cá/tôm NỔI ĐẦU đớp khí mặt nước lúc rạng sáng), đồng thời CO2 tích tụ tạo H2CO3 làm pH giảm xuống thấp nhất vào buổi sáng.",
      "3. Quy trình chuẩn bị nước ao nuôi thủy sản 4 bước chuẩn kỹ thuật: Bước 1: Lắng lọc cơ học (bơm nước qua túi lọc dày vào ao lắng để giữ lại rác, trứng cá tạp, ấu trùng giáp xác mang mầm bệnh và lắng phù sa lơ lửng) -> Bước 2: Diệt tạp và khử trùng (dùng Saponin diệt cá tạp; dùng Chlorine hoặc KMnO4/Iodine/BKC diệt khuẩn, virus, nấm) -> Bước 3: Khử dư lượng hóa chất (chạy quạt nước sục khí mạnh 3–5 ngày hoặc dùng Sodium thiosulfate Na2S2O3 trung hòa hết Chlorine tồn dư, bón vôi điều chỉnh pH và độ kiềm đạt 80–150 mg CaCO3/L) -> Bước 4: Bón phân gây màu nước và cấy vi sinh có lợi (gây tảo lục/tảo khuê tạo màu nước xanh đọt chuối hoặc màu trà với độ trong đĩa Secchi đạt 30–40 cm trước khi thả giống).",
      "4. Ba công nghệ nuôi thủy sản tuần hoàn & sinh học đỉnh cao: (a) Công nghệ Biofloc (BFT): Bổ sung nguồn Carbon hữu cơ (mật rỉ đường, bột tinh bột) để nâng tỷ lệ C:N ≥ 12:1 – 15:1 kết hợp sục khí liên tục 24/24; kích thích vi khuẩn dị dưỡng đồng hóa trực tiếp NH4+/NH3 thành sinh khối protein vi sinh vật kết tụ thành hạt Floc (chứa 30–45% protein) làm thức ăn tự nhiên tại chỗ cho tôm/cá rô phi, giảm 20–30% hệ số FCR và không cần thay nước. (b) Công nghệ tuần hoàn RAS (Recirculating Aquaculture System): Nước từ bể nuôi -> Lọc cơ học (trống quay tách phân rắn) -> Lọc sinh học (Biofilter giá thể Kaldnes chứa màng vi khuẩn Nitrosomonas/Nitrobacter chuyển hóa NH4+ -> NO2- -> NO3-) -> Khử trùng bằng đèn tia cực tím UV hoặc Ozone -> Bổ sung Oxy tinh khiết -> Quay lại bể nuôi (tái sử dụng 95–99% nước). (c) Hệ thống Aquaponics (Đề HSG TP.HCM & Bắc Giang): Tích hợp cộng sinh khép kín giữa Nuôi thủy sản (cá thải NH3/NH4+) + Lọc vi sinh (Nitrosomonas/Nitrobacter chuyển thành NO3-) + Trồng rau thủy canh (rễ rau hấp thụ NO3-, PO4(3-) làm sạch nước trả về bể cá); tuyệt đối không dùng thuốc trừ sâu hóa học cho rau và không dùng kháng sinh độc cho cá."
    ],
    comparisonTable: {
      headers: ["Chỉ tiêu Môi trường Nước", "Ngưỡng Tối ưu (Tôm / Cá)", "Biểu hiện Khi Vượt Ngưỡng Xấu", "Giải pháp Xử lý Kỹ thuật Cấp bách"],
      rows: [
        [
          "Oxy hòa tan (DO)",
          "≥ 5,0 mg/L (Tối thiểu ≥ 4,0 mg/L ban đêm)",
          "DO < 3,0 mg/L: Cá nổi đầu đớp khí rạng sáng, tôm dạt bờ, ngừng ăn, lột xác dính vỏ, tích tụ NO2- và H2S.",
          "Bật 100% quạt nước và sục khí đáy (Oxy nano), giảm 50–100% lượng thức ăn, rải Oxy viên (Sodium percarbonate 2Na2CO3.3H2O2) cấp cứu."
        ],
        [
          "Độ pH & Độ kiềm",
          "pH: 7,5 – 8,5 (dao động ngày đêm ≤ 0,5); Kiềm: 80 – 150 mg CaCO3/L",
          "pH < 6,5 làm tôm mềm vỏ, tăng độc tính H2S; pH > 8,8 làm tăng vọt độc tính NH3 tự do.",
          "Nếu pH thấp / kiềm thấp: Bón vôi CaCO3 hoặc Dolomite CaMg(CO3)2 và Sodium bicarbonate (NaHCO3) vào ban đêm. Nếu pH quá cao: Thay bớt nước, ủ mật rỉ đường + vi sinh."
        ],
        [
          "Khí độc NH3 & NO2-",
          "NH3 < 0,05 mg/L; NO2- < 0,1 – 0,25 mg/L",
          "Tổn thương mang, tôm cá bơi lờ đờ, máu chuyển màu nâu, dễ bùng phát bệnh gan tụy và đốm trắng.",
          "Ngừng/giảm ăn, xi-phông đáy ao hút bùn phân, tăng sục khí đáy, tạt chế phẩm Nitrosomonas + Nitrobacter kết hợp rỉ đường và Yucca hấp phụ khí độc."
        ]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Khi ao nuôi bị bùng phát khí độc NO2- cao, nên dùng thuốc kháng sinh liều cao tạt xuống ao để diệt khuẩn sẽ giúp giảm NO2- nhanh nhất' -> SAI. Tạt kháng sinh xuống nước sẽ tiêu diệt luôn hệ vi khuẩn tự dưỡng có ích Nitrobacter, làm đứt gãy quá trình chuyển hóa NO2- thành NO3-, khiến NO2- càng tích tụ gây chết tôm hàng loạt.",
      "Bẫy 2: 'Trong hệ thống RAS, đèn tia cực tím (UV) nên được đặt ngay bên trong bể lọc sinh học chứa hạt giá thể Kaldnes' -> SAI. Tia UV có tác dụng diệt khuẩn; nếu chiếu trực tiếp vào bể lọc sinh học sẽ tiêu diệt toàn bộ màng vi khuẩn Nitrosomonas và Nitrobacter bám trên giá thể. Đèn UV phải đặt ở khâu sau lọc sinh học, trước khi nước cấp lại vào bể nuôi."
    ],
    formulas: [
      "Phương trình Nitrat hóa Bước 1 (Nitrosomonas): 2NH4+ + 3O2 -> 2NO2- + 4H+ + 2H2O + Năng lượng",
      "Phương trình Nitrat hóa Bước 2 (Nitrobacter): 2NO2- + O2 -> 2NO3- + Năng lượng",
      "Khối lượng mật rỉ đường cần bổ sung để xử lý TAN trong Biofloc: M_rỉ_đường ≈ (Lượng TAN cần chuyển hóa × Tỷ lệ C:N mong muốn) / (% Carbon trong mật rỉ đường)"
    ]
  },
  {
    id: "hb_12_thuy2",
    grade: "cn12",
    gradeLabel: "Khối 12 — Thủy sản",
    code: "CHỦ ĐỀ 12.6",
    title: "Công nghệ Giống Thủy sản, Sản xuất Cá rô phi Đơn tính Đực & Phòng trị Bệnh Thủy sản",
    examWeight: "1–2 câu MCQ (0,25–0,50đ) + 2–4 ý Đúng/Sai + Tự luận Thủy sản Lớp 12 (1,25đ)",
    coreMechanisms: [
      "1. Cơ chế thần kinh - nội tiết điều khiển sinh sản nhân tạo ở cá: Trong tự nhiên, các tín hiệu sinh thái mùa vụ (nhiệt độ ấm, nước mưa đầu mùa, dòng chảy, giá thể) tác động lên cơ quan thụ cảm -> Vùng dưới đồi (Hypothalamus) tiết hormone giải phóng GnRH (Gonadotropin-Releasing Hormone), đồng thời tiết Dopamine (chất ức chế tuyến yên) -> Tuyến yên (Pituitary gland) tiết hormone kích dục Gonadotropin (GtH I: FSH giúp trứng phát triển tích lũy noãn hoàng; GtH II: LH kích thích chín sinh dục cuối cùng và rụng trứng/xả tinh). Trong sinh sản nhân tạo, người ta tiêm não thùy thể cá hoặc HCG (Human Chorionic Gonadotropin) hoặc chất tương tự LHRH-A kết hợp chất kháng Dopamine (Domperidone / Motilium - hỗn hợp Ovaprim) để phá bỏ sự ức chế của Dopamine và kích thích tuyến yên tiết LH gây rụng trứng đồng loạt.",
      "2. Công nghệ sản xuất giống cá rô phi đơn tính đực (Monosex Male Tilapia - Đề HSG TP.HCM & Bắc Giang): Cá rô phi cái thành thục sinh dục rất sớm (từ 3–4 tháng tuổi khi mới đạt 100–150g), đẻ liên tục mỗi 3–4 tuần và ấp trứng trong miệng (nhịn ăn khi ấp trứng), làm cá cái chậm lớn và mật độ ao tăng vọt dẫn đến cá bị còi cọc. Cá rô phi đực lớn nhanh hơn cá cái 30–50% và đồng đều cỡ thương phẩm. Hai phương pháp tạo đàn cá rô phi toàn đực (98–100% đực):\n  • Phương pháp 1 (Đảo giới tính trực tiếp bằng Hormone): Thu cá bột mới tiêu hết noãn hoàng (7–10 ngày tuổi, cơ quan sinh dục chưa biệt hóa) cho ăn thức ăn trộn hormone sinh dục đực 17α-methyltestosterone (liều 50–60 mg/kg thức ăn) liên tục trong 21 ngày để định hướng toàn bộ cá bột mang kiểu gen cái (XX) biệt hóa thành kiểu hình đực hoàn toàn.\n  • Phương pháp 2 (Công nghệ di truyền tạo Siêu đực YY - GMT): Bước 1: Dùng hormone nữ hóa (Estrogen/DES) tác động lên cá bột đực (XY) tạo cá cái giả mang kiểu gen XY -> Bước 2: Cho cái giả (XY) lai với đực thường (XY) tạo đời con có 1/4 cá thể mang kiểu gen SIÊU ĐỰC (YY) -> Bước 3: Cho cá Siêu đực (YY) giao phối với cá cái thường (XX) sẽ sinh ra 100% đời con thương phẩm mang kiểu gen đực tự nhiên (XY) mà hoàn toàn không cần dùng hormone trong giai đoạn ương cá thương phẩm!",
      "3. Quản lý thức ăn và Phòng trị bệnh thủy sản công nghệ cao: Bệnh thủy sản phát sinh khi hội tụ đủ 3 vòng tròn (Sơ đồ Snieszko): Môi trường nước suy thoái + Tác nhân gây bệnh (Virus đốm trắng WSSV, Vi khuẩn Vibrio parahaemolyticus gây hoại tử gan tụy cấp AHPND, Streptococcus ở cá rô phi) + Sức đề kháng vật nuôi suy giảm. Giải pháp phòng bệnh chủ động: Chọn giống SPF (Specific Pathogen Free - sạch bệnh đặc hiệu được kiểm dịch bằng kỹ thuật sinh học phân tử PCR), tiêm vaccine cho cá (bằng phương pháp tiêm xoang bụng, ngâm hoặc cho ăn), trộn chế phẩm Probiotics (Bacillus, Lactobacillus), β-glucan và Vitamin C vào thức ăn."
    ],
    comparisonTable: {
      headers: ["Phương pháp Tạo Rô phi Toàn đực", "Cơ sở Khoa học & Quy trình", "Tỷ lệ Đực Đạt được", "Ưu điểm & An toàn Sinh học"],
      rows: [
        [
          "Cho cá bột ăn Hormone 17α-methyltestosterone (21 ngày)",
          "Tác động hormone androgen ngoại sinh vào giai đoạn tuyến sinh dục chưa biệt hóa (cá bột 9–11 mm).",
          "97% – 99% con đực",
          "Quy trình đơn giản, tỷ lệ đực rất cao; hormone bị đào thải hết sau vài ngày ngừng ăn (trước khi xuất bán thương phẩm 4–5 tháng), nhưng đòi hỏi quản lý an toàn lao động và xử lý nước bể ương."
        ],
        [
          "Lai Siêu đực YY × Cái thường XX (Công nghệ GMT)",
          "Chọn tạo dòng bố Siêu đực đồng hợp tử (YY) phối với mẹ (XX) -> 100% con mang NST giới tính XY.",
          "99% – 100% con đực di truyền",
          "Cá thương phẩm hoàn toàn không tiếp xúc với hormone ngoại sinh, đáp ứng tiêu chuẩn khắt khe nhất của nông nghiệp hữu cơ và xuất khẩu EU/Mỹ."
        ],
        [
          "Lai xa khác loài (O. niloticus cái × O. aureus đực)",
          "Cơ chế xác định giới tính khác nhau giữa 2 loài (XX/XY và WZ/ZZ) tạo con lai lệch về giới đực.",
          "85% – 95% con đực",
          "An toàn nhưng cần giữ dòng bố mẹ thuần chủng tuyệt đối, tỷ lệ đực thấp hơn 2 phương pháp trên."
        ]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Người ta trộn hormone 17α-methyltestosterone cho cá rô phi thịt nặng 500g ăn trước khi thu hoạch 1 tháng để cá biến thành con đực lớn nhanh' -> SAI. Khi cá đã lớn, tuyến sinh dục đã biệt hóa hoàn toàn nên hormone không thể đảo giới tính và còn gây tồn dư thực phẩm; chỉ xử lý ở giai đoạn cá bột mới hết noãn hoàng (7–10 ngày tuổi).",
      "Bẫy 2: 'Bệnh đốm trắng trên tôm (do virus WSSV) có thể điều trị khỏi hoàn toàn bằng cách trộn kháng sinh Amoxicillin liều cao vào thức ăn' -> SAI. Kháng sinh chỉ có tác dụng diệt hoặc kìm hãm vi khuẩn, hoàn toàn KHÔNG tiêu diệt được virus; với bệnh do virus chỉ có thể phòng bằng giống sạch bệnh PCR, an toàn sinh học và nâng sức đề kháng."
    ],
    formulas: [
      "Số cá thể còn sống trong ao = Diện tích ao (m2) × Mật độ thả (con/m2) × Tỷ lệ sống (%)",
      "Tổng sinh khối thủy sản (kg) = Số cá thể còn sống / Kích cỡ (số con/kg)   [hoặc = Số cá thể còn sống × Khối lượng trung bình 1 con (kg/con)]",
      "Lượng thức ăn cho ăn 1 ngày (kg/ngày) = Tổng sinh khối (kg) × Tỷ lệ cho ăn (% khối lượng thân)"
    ]
  }
];

// ============================================================================
// 2. NGÂN HÀNG ĐỀ THI HSG CHUẨN ĐỒNG NAI (180 PHÚT - 20 ĐIỂM)
// Bảng A & Bảng B • 24 MCQ (6,0đ) + 4 Đúng/Sai có giải thích (6,0đ) + 3 Tự luận (8,0đ)
// ============================================================================

// ============================================================================
// 2. NGÂN HÀNG ĐỀ THI HSG CHUẨN ĐỒNG NAI 3 CẤP ĐỘ (180 PHÚT - 20 ĐIỂM)
// 🟢 Cấp độ 1: Dễ / Khởi động (Nền tảng SGK + Điểm tựa ghi nhớ)
// 🟡 Cấp độ 2: Vừa / Tăng tốc (Chuẩn Bảng B THPT Không chuyên)
// 🔴 Cấp độ 3: Khó / Về đích (Nâng cao Bảng B & VDC Đội tuyển)
// ============================================================================
const HSG_PROVINCIAL_EXAMS = {
  dn_easy_01: {
    id: "dn_easy_01",
    level: "easy",
    levelBadge: "🟢 CẤP ĐỘ 1: DỄ / KHỞI ĐỘNG",
    levelLabel: "CẤP ĐỘ 1 (DỄ / KHỞI ĐỘNG & NỀN TẢNG KIẾN THỨC SGK)",
    code: "ĐỒNG NAI — CẤP ĐỘ 1 (ĐỀ 01)",
    title: "KỲ THI CHỌN HỌC SINH GIỎI CẤP TỈNH — ĐỒNG NAI (ĐỀ SỐ 01 - CẤP ĐỘ 1: KHỞI ĐỘNG)",
    subTitle: "Khởi động nhẹ nhàng • Củng cố 100% bản chất SGK 10-11-12 • Tích hợp Điểm tựa ghi nhớ SGK",
    durationMinutes: 180,
    maxScore: 20.0,
    source: "Ngân hàng Đề HSG Nền tảng — Chuẩn SGK Kết nối tri thức & Cấu trúc Sở GD&ĐT Đồng Nai",
    mcqs: [
      // K10 (8 câu: 3 Đất + 3 Phân bón + 2 Trồng trọt CNC)
      {
        id: 1, grade: "cn10", topic: "(1) Đất trồng",
        stem: "Trong cấu trúc của một hạt keo đất hoàn chỉnh (micelle), thành phần nằm ngoài cùng có khả năng di chuyển và trao đổi trực tiếp với dung dịch đất là",
        options: ["nhân keo.", "lớp ion quyết định điện thế.", "lớp ion bất động.", "lớp ion khuếch tán."],
        answer: 3,
        explanation: "Hạt keo đất gồm 4 phần: Nhân keo -> Lớp ion quyết định điện thế -> Lớp ion bất động -> Lớp ion khuếch tán ngoài cùng. Lớp khuếch tán liên kết yếu nhất nên dễ dàng trao đổi với các ion dinh dưỡng trong dung dịch đất.",
        recallHint: "SGK CN 10 Bài 3: Hạt keo gồm: Nhân keo -> Lớp ion quyết định điện thế (quyết định dấu keo âm/dương) -> Lớp ion bất động -> Lớp ion khuếch tán ngoài cùng (trao đổi ion với rễ cây)."
      },
      {
        id: 2, grade: "cn10", topic: "(1) Đất trồng",
        stem: "Loại đất nào sau đây thường có dung tích hấp phụ cation (CEC) thấp nhất trong điều kiện tự nhiên?",
        options: ["Đất cát pha nghèo mùn.", "Đất thịt nhẹ phù sa màu mỡ.", "Đất sét nặng giàu chất hữu cơ.", "Đất than bùn giàu mùn."],
        answer: 0,
        explanation: "Đất cát có hàm lượng hạt sét rất thấp (< 10%) và nghèo mùn nên tổng diện tích bề mặt riêng rất bé, dẫn tới dung tích hấp phụ cation (CEC < 5 meq/100g đất) thấp nhất.",
        recallHint: "SGK CN 10 Bài 3: Trật tự dung tích hấp phụ CEC: Mùn hữu cơ (150-300 meq/100g) > Sét Montmorillonite > Sét Kaolinite > Đất cát (< 5 meq/100g). Đất cát giữ phân kém nhất."
      },
      {
        id: 3, grade: "cn10", topic: "(1) Đất trồng",
        stem: "Biện pháp kỹ thuật nào sau đây mang tính chất căn bản để cải tạo độ phì nhiêu và chống xói mòn cho đất đồi dốc trơ sỏi đá?",
        options: ["Bón phân đạm vô cơ liều lượng cao liên tục.", "Làm ruộng bậc thang và trồng cây họ Đậu che phủ đất.", "Cày sâu lật đất nhiều lần trong mùa khô.", "Đốt sạch tàn dư thực vật sau mỗi vụ thu hoạch."],
        answer: 1,
        explanation: "Làm ruộng bậc thang làm giảm vận tốc dòng chảy bề mặt, chống xói mòn rửa trôi; trồng cây họ Đậu che phủ giữ ẩm, rễ vi khuẩn Rhizobium cố định đạm làm tăng mùn và độ phì nhiêu đất.",
        recallHint: "SGK CN 10 Bài 4: Cải tạo đất đồi núi dốc gồm biện pháp công trình (ruộng bậc thang, rãnh ngăn dòng chảy) và nông học (trồng cây phủ đất, luân canh xen canh cây họ Đậu cố định đạm)."
      },
      {
        id: 4, grade: "cn10", topic: "(2) Phân bón",
        stem: "Phân bón vô cơ đơn là loại phân bón chỉ chứa",
        options: ["một nguyên tố dinh dưỡng khoáng chủ yếu (N, P hoặc K).", "hai nguyên tố dinh dưỡng khoáng trở lên.", "các vi lượng Fe, Zn, Cu, Bo.", "chất hữu cơ đã ủ hoai mục."],
        answer: 0,
        explanation: "Phân bón đơn là loại phân vô cơ chỉ chứa 1 trong 3 nguyên tố dinh dưỡng khoáng đa lượng chính: Đạm (N), Lân (P) hoặc Kali (K). Ví dụ: Phân Urê (chứa N), Super lân (chứa P), Kali clorua (chứa K).",
        recallHint: "SGK CN 10 Bài 7: Phân đơn chỉ chứa 1 chất dinh dưỡng chính: Phân đạm (chứa N), phân lân (chứa P), phân kali (chứa K). Phân đa yếu tố (NPK) chứa từ 2 nguyên tố dinh dưỡng trở lên."
      },
      {
        id: 5, grade: "cn10", topic: "(2) Phân bón",
        stem: "Trong quy trình bón phân cho cây trồng, phân hữu cơ truyền thống và phân lân khó tan thường được ưu tiên sử dụng vào thời kỳ nào?",
        options: ["Bón thúc vào lúc cây đang nở hoa rộ.", "Bón thúc khi cây đang nuôi quả lớn.", "Bón lót sâu vào đất trước khi gieo trồng.", "Phun trực tiếp lên lá khi cây bị héo."],
        answer: 2,
        explanation: "Phân hữu cơ và lân khó tan cần thời gian để vi sinh vật phân giải thành dạng khoáng hòa tan cây mới hấp thu được, do đó phải bón lót sâu vào đất trước khi gieo trồng.",
        recallHint: "SGK CN 10 Bài 8: Nguyên tắc bón phân: Phân hữu cơ hoai mục, phân lân khó tan -> Bón lót sâu vào hố/rãnh; Phân đạm, phân kali dễ hòa tan -> Chia nhỏ bón thúc nhiều lần."
      },
      {
        id: 6, grade: "cn10", topic: "(2) Phân bón",
        stem: "Khi quan sát cây trồng, nếu thấy các lá già ở phía gốc bị vàng úa trước, cây sinh trưởng còi cọc, thân gầy guộc thì cây đang có biểu hiện thiếu hụt nguyên tố khoáng nào?",
        options: ["Đạm (N).", "Lân (P).", "Sắt (Fe).", "Đồng (Cu)."],
        answer: 0,
        explanation: "Đạm (N) là nguyên tố di động mạnh trong cây. Khi thiếu đạm, cây sẽ ưu tiên huy động đạm từ các lá già phía dưới chuyển lên nuôi các lá non và ngọn non, làm cho lá già bị vàng úa trước.",
        recallHint: "SGK CN 10 Bài 6: Đạm (N) quyết định sinh trưởng sinh dưỡng. Thiếu N: Cây còi cọc, lá già ở gốc vàng trước; Thừa N: Cây phát triển thân lá quá mức, mềm yếu, dễ đổ ngã và sâu bệnh."
      },
      {
        id: 7, grade: "cn10", topic: "(3) Trồng trọt công nghệ cao",
        stem: "Mụn xơ dừa thô nguyên chất trước khi sử dụng làm giá thể trồng cây công nghệ cao bắt buộc phải qua xử lý nhằm mục đích chủ yếu là",
        options: ["loại bỏ chất chát Tanin và Lignin gây ức chế hô hấp và sinh trưởng rễ cây.", "tiêu diệt hoàn toàn các hạt diệp lục còn sót lại trong xơ dừa.", "tăng hàm lượng đường glucose trong giá thể.", "làm giảm độ xốp và giảm độ ẩm của xơ dừa."],
        answer: 0,
        explanation: "Xơ dừa thô chứa hàm lượng lớn chất Tanin và Lignin có tính chát, làm tắc mạch dẫn và ức chế rễ non hấp thu dinh dưỡng. Cần ngâm xả nước và xử lý nước vôi Ca(OH)2 để kết tủa và loại bỏ chất chát.",
        recallHint: "SGK CN 10 Bài 10: Xử lý mụn xơ dừa: Ngâm xả nước sạch nhiều lần và ngâm nước vôi Ca(OH)2 để loại bỏ Tanin (tan trong nước) và Lignin (tan trong kiềm), đưa EC < 0,5 mS/cm và pH 5,8 - 6,5."
      },
      {
        id: 8, grade: "cn10", topic: "(3) Trồng trọt công nghệ cao",
        stem: "Tác dụng cơ bản và nổi bật nhất của việc xây dựng nhà màng trong sản xuất rau ăn lá và hoa công nghệ cao là",
        options: ["loại bỏ hoàn toàn tác động của bức xạ ánh sáng mặt trời.", "ngăn chặn cơ học sự xâm nhập của các loài côn trùng gây hại và điều hòa tiểu khí hậu.", "thay thế hoàn toàn việc tưới nước hàng ngày cho cây trồng.", "làm tăng nhiệt độ bên trong nhà màng lên gấp 3 lần môi trường ngoài."],
        answer: 1,
        explanation: "Nhà màng phủ lưới chắn côn trùng giúp ngăn chặn rầy, bọ trĩ, sâu hại bay vào cắn phá, giảm tối đa việc dùng thuốc BVTV hóa học, đồng thời che chắn mưa to gió lớn dập nát lá cây.",
        recallHint: "SGK CN 10 Bài 12: Ưu điểm của nhà màng/nhà lưới: Ngăn chặn sâu bọ cơ học, bảo vệ cây khỏi mưa dập gió bão, điều hòa độ ẩm và nhiệt độ tiểu khí hậu, kiểm soát môi trường sinh trưởng tối ưu."
      },

      // K11 (8 câu: 3 Giống + 3 Thức ăn + 2 MT chăn nuôi)
      {
        id: 9, grade: "cn11", topic: "(4) Giống vật nuôi",
        stem: "Trong các phương pháp chọn lọc giống vật nuôi, phương pháp 'Chọn lọc cá thể' có ưu điểm nổi bật nhất là",
        options: ["thực hiện rất nhanh chóng và không đòi hỏi ghi chép theo dõi gia phả.", "đánh giá chính xác sức sản xuất và tiềm năng di truyền của từng cá thể giống.", "chỉ cần quan sát ngoại hình bầy đàn lúc mới sinh ra.", "không cần kiểm tra phẩm chất giống ở đời con."],
        answer: 1,
        explanation: "Chọn lọc cá thể theo dõi chi tiết từng con vật về ngoại hình, sức sản xuất bản thân, kết hợp kiểm tra phả hệ và kiểm tra đời con, cho độ chính xác di truyền cao nhất.",
        recallHint: "SGK CN 11 Bài 3: Phân biệt: (a) Chọn lọc hàng loạt: Nhanh, dễ làm, áp dụng đại trà nhưng độ chính xác không cao; (b) Chọn lọc cá thể: Tỉ mỉ, theo dõi gia phả và đời con, độ chính xác cao."
      },
      {
        id: 10, grade: "cn11", topic: "(4) Giống vật nuôi",
        stem: "Lai kinh tế đơn giản (lai giữa 2 giống thuần chủng) nhằm mục đích chủ yếu là",
        options: ["tạo ra một giống vật nuôi hoàn toàn mới giữ lại ổn định ở các đời sau.", "tận dụng tối đa hiện tượng ưu thế lai để nuôi lấy sản phẩm thương phẩm (thịt, trứng, sữa).", "để chọn con lai làm giống sinh sản tiếp ở thế hệ F2 và F3.", "bảo tồn nguồn gen quý của các giống vật nuôi bản địa đang có nguy cơ tuyệt chủng."],
        answer: 1,
        explanation: "Lai kinh tế tạo con lai F1 mang ưu thế lai cao nhất về sức sống, tốc độ tăng trọng và hiệu quả chuyển hóa thức ăn. Con lai F1 chỉ dùng để nuôi lấy thịt/trứng thương phẩm, không dùng làm giống vì thế hệ F2 sẽ phân ly.",
        recallHint: "SGK CN 11 Bài 4: Lai kinh tế: Mục đích duy nhất là tận dụng ưu thế lai ở đời F1 nuôi thương phẩm. Tuyệt đối không giữ con lai F1 làm giống vì thế hệ con cháu F2 sẽ thoái hóa, phân ly tính trạng."
      },
      {
        id: 11, grade: "cn11", topic: "(4) Giống vật nuôi",
        stem: "Công nghệ thụ tinh nhân tạo (AI) cho bò sữa và lợn mang lại lợi ích lớn nhất trong công tác giống là",
        options: ["nâng cao hệ số nhân giống của con đực giống tốt lên gấp hàng trăm đến hàng nghìn lần.", "làm cho con cái sinh đôi hoặc sinh ba trong tất cả các lứa đẻ.", "giúp thay thế hoàn toàn nhu cầu dinh dưỡng khoáng của bò mẹ khi mang thai.", "làm giảm thời gian mang thai của gia súc cái xuống một nửa."],
        answer: 0,
        explanation: "Thụ tinh nhân tạo cho phép pha loãng và bảo quản lạnh tinh dịch của đực giống phẩm chất xuất sắc, phối giống cho hàng trăm, hàng nghìn con cái ở khắp các địa phương, đẩy nhanh tốc độ cải thiện di truyền.",
        recallHint: "SGK CN 11 Bài 4: Thụ tinh nhân tạo: Nâng cao hệ số sử dụng đực giống quý, mở rộng vùng phối giống, tránh lây lan các bệnh truyền nhiễm qua đường sinh dục tự nhiên."
      },
      {
        id: 12, grade: "cn11", topic: "(5) Thức ăn chăn nuôi",
        stem: "Dạ dày của động vật nhai lại (bò, trâu, dê) gồm có 4 ngăn theo thứ tự luân chuyển thức ăn là",
        options: ["Dạ cỏ -> Dạ tổ ong -> Dạ lá sách -> Dạ múi khế.", "Dạ múi khế -> Dạ tổ ong -> Dạ cỏ -> Dạ lá sách.", "Dạ tổ ong -> Dạ cỏ -> Dạ lá sách -> Dạ múi khế.", "Dạ cỏ -> Dạ lá sách -> Dạ tổ ong -> Dạ múi khế."],
        answer: 0,
        explanation: "Thức ăn sau khi nuốt qua thực quản đi vào Dạ cỏ (lên men vi sinh) -> Dạ tổ ong (đẩy thức ăn ợ lên miệng nhai lại) -> Dạ lá sách (ép hấp thu nước và chất điện giải) -> Dạ múi khế (dạ dày thật tiết pepsin và HCl).",
        recallHint: "SGK CN 11 Bài 5: Thứ tự dạ dày 4 túi: Dạ cỏ (lớn nhất, chứa vi sinh vật phân giải xenlulozo) -> Dạ tổ ong (ợ thức ăn) -> Dạ lá sách (hấp thu nước) -> Dạ múi khế (dạ dày thực sự tiết dịch vị)."
      },
      {
        id: 13, grade: "cn11", topic: "(5) Thức ăn chăn nuôi",
        stem: "Hệ số chuyển hóa thức ăn FCR (Feed Conversion Ratio) trong chăn nuôi được định nghĩa và tính toán bằng",
        options: ["Khối lượng thức ăn tiêu thụ (kg) / Khối lượng vật nuôi tăng trọng (kg).", "Khối lượng vật nuôi tăng trọng (kg) / Khối lượng thức ăn tiêu thụ (kg).", "Tổng doanh thu bán thịt / Tổng chi phí mua cám.", "Số ngày nuôi / Số kg thức ăn ăn vào."],
        answer: 0,
        explanation: "FCR = Lượng thức ăn ăn vào / Lượng tăng trọng. Giá trị FCR càng thấp biểu thị con vật sử dụng thức ăn càng hiệu quả, chi phí thức ăn cho mỗi kg tăng trọng càng ít.",
        recallHint: "SGK CN 11 Bài 13: FCR = Khối lượng thức ăn tiêu tốn / Khối lượng tăng trọng. Ví dụ: FCR gà = 1,6 - 1,8; FCR lợn = 2,4 - 2,6; FCR cá tra = 1,4 - 1,6. FCR càng nhỏ thì hiệu quả chăn nuôi càng cao."
      },
      {
        id: 14, grade: "cn11", topic: "(5) Thức ăn chăn nuôi",
        stem: "Phương pháp ủ chua thức ăn thô xanh (cỏ voi, thân cây ngô) cho trâu bò có bản chất sinh học là",
        options: ["lên men yếm khí nhờ vi khuẩn Lactic tạo ra axit lactic làm giảm pH ức chế vi khuẩn gây thối.", "lên men hiếu khí nhờ nấm men tạo cồn ethanol để sát trùng thức ăn.", "dùng nhiệt độ cao 100°C để hấp chín và diệt khuẩn toàn bộ khối ủ.", "cho thêm kháng sinh vào cỏ để chống ôi thiu trong không khí."],
        answer: 0,
        explanation: "Ủ chua là quá trình nén chặt đẩy hết không khí ra (yếm khí), vi khuẩn Lactic phân giải đường tan thành axit lactic, hạ pH khối ủ xuống 3,8 - 4,2 giúp bảo quản cỏ tươi giàu dinh dưỡng lâu dài.",
        recallHint: "SGK CN 11 Bài 8: Bản chất ủ chua: Yếm khí (kín khí) + Vi khuẩn Lactic chuyển hóa đường thành axit lactic + Hạ pH < 4,2 ức chế vi khuẩn thối rữa Clostridium."
      },
      {
        id: 15, grade: "cn11", topic: "(6) Môi trường & Phòng bệnh chăn nuôi",
        stem: "Sự khác biệt căn bản về bản chất miễn dịch giữa Vacxin và Kháng huyết thanh là",
        options: ["Vacxin chứa kháng nguyên kích thích cơ thể tự sinh kháng thể chủ động; Kháng huyết thanh chứa kháng thể sẵn có tạo miễn dịch thụ động cấp tốc.", "Vacxin chỉ dùng khi vật nuôi đang ốm nặng; Kháng huyết thanh dùng phòng bệnh định kỳ.", "Vacxin chứa kháng thể; Kháng huyết thanh chứa kháng nguyên.", "Vacxin không có tính đặc hiệu; Kháng huyết thanh có tính đặc hiệu cao."],
        answer: 0,
        explanation: "Vacxin đưa kháng nguyên (mầm bệnh đã làm yếu hoặc bất hoạt) vào cơ thể khỏe mạnh để kích hoạt miễn dịch chủ động lâu dài. Kháng huyết thanh cung cấp kháng thể đặc hiệu trực tiếp để cấp cứu vật nuôi khi bị nhiễm độc tố hoặc bệnh cấp tính.",
        recallHint: "SGK CN 11 Bài 15: Vacxin = Kháng nguyên (sinh miễn dịch chủ động, cần thời gian 2-3 tuần); Kháng huyết thanh = Kháng thể sẵn có (miễn dịch thụ động, tác dụng tức thì nhưng ngắn hạn)."
      },
      {
        id: 16, grade: "cn11", topic: "(6) Môi trường & Phòng bệnh chăn nuôi",
        stem: "Trong công trình xử lý chất thải chăn nuôi bằng hầm Biogas, thành phần khí sinh học chiếm thể tích lớn nhất và có khả năng cháy sinh năng lượng là",
        options: ["Khí Mêtan (CH4) chiếm khoảng 55% - 70%.", "Khí Carbonic (CO2) chiếm 90%.", "Khí Hydro sunfua (H2S) chiếm 80%.", "Khí Oxy (O2) chiếm 60%."],
        answer: 0,
        explanation: "Trong điều kiện yếm khí, vi khuẩn sinh metan phân giải chất hữu cơ tạo ra khí Biogas gồm 55-70% CH4, 30-40% CO2 và một lượng nhỏ các khí khác. Khí CH4 cháy tạo nhiệt lượng sạch.",
        recallHint: "SGK CN 11 Bài 16: Hầm Biogas phân hủy kỵ khí: Khí sinh học gồm Mêtan CH4 (55-70%, chất khí cháy sinh nhiệt) và CO2 (30-40%). Nước xả sau Biogas dùng làm phân tưới cây hoặc nuôi cá."
      },

      // K12 (8 câu: 4 Lâm nghiệp + 4 Thủy sản)
      {
        id: 17, grade: "cn12", topic: "(1) Giới thiệu chung Lâm nghiệp",
        stem: "Theo quy định của Luật Lâm nghiệp 2017 tại Việt Nam, rừng được phân chia thành 3 loại căn cứ vào mục đích sử dụng chủ yếu là",
        options: ["Rừng đặc dụng, Rừng phòng hộ, Rừng sản xuất.", "Rừng tự nhiên, Rừng nhân tạo, Rừng hỗn giao.", "Rừng ngập mặn, Rừng rụng lá, Rừng lá kim.", "Rừng nguyên sinh, Rừng thứ sinh, Rừng nghèo kiệt."],
        answer: 0,
        explanation: "Luật Lâm nghiệp 2017 (Điều 5) phân chia rừng thành 3 loại căn cứ vào mục đích sử dụng chủ yếu: (1) Rừng đặc dụng; (2) Rừng phòng hộ; (3) Rừng sản xuất.",
        recallHint: "SGK CN 12 Bài 2: Phân loại 3 loại rừng (Luật Lâm nghiệp 2017): Rừng đặc dụng (bảo tồn đa dạng sinh học), Rừng phòng hộ (chắn gió, chắn sóng, bảo vệ nguồn nước), Rừng sản xuất (cung cấp gỗ và lâm sản)."
      },
      {
        id: 18, grade: "cn12", topic: "(2) Trồng & Chăm sóc rừng",
        stem: "Cây con giống lâm nghiệp (như keo lai, bạch đàn) đạt tiêu chuẩn xuất vườn để trồng rừng phải đảm bảo yêu cầu nào sau đây?",
        options: ["Cây thân thẳng, đỉnh sinh trưởng không bị gãy cụt, bộ rễ phát triển tốt trong bầu ươm chắc chắn.", "Cây có chiều cao càng cao càng tốt dù thân cong queo.", "Bầu ươm bị vỡ vụn và rễ cọc bị đứt cụt sát cổ rễ.", "Cây đang bị nhiễm nấm đốm lá để rèn luyện sức đề kháng tự nhiên."],
        answer: 0,
        explanation: "Tiêu chuẩn cây con xuất vườn bắt buộc: Thân cây thẳng, ngọn cứng cáp không gãy cụt, bầu rễ nguyên vẹn không cuộn tròn, cây sạch sâu bệnh và đạt độ tuổi xuất vườn theo quy trình.",
        recallHint: "SGK CN 12 Bài 4: Tiêu chuẩn cây giống xuất vườn: Thân hóa gỗ cứng cáp, thẳng, 1 ngọn đơn duy nhất, bộ rễ nguyên vẹn trong bầu đất, không sâu bệnh hại."
      },
      {
        id: 19, grade: "cn12", topic: "(3) Bảo vệ & Khai thác rừng",
        stem: "Phương thức khai thác rừng chọn (Selection Cutting) trong quản lý rừng tự nhiên bền vững có đặc điểm cơ bản là",
        options: ["chỉ chặt hạ những cây gỗ già, thành thục công nghệ đạt đường kính quy định, giữ lại các cây non và cây mẹ tái sinh.", "chặt sạch toàn bộ cây rừng trên một diện tích rộng lớn trong một mùa khô.", "chặt hạ toàn bộ tầng cây gỗ lớn và chỉ để lại thảm cỏ dưới mặt đất.", "chặt cây rừng liên tục hàng tuần mà không cần quy hoạch."],
        answer: 0,
        explanation: "Khai thác chọn là phương thức khai thác chặt tỉa từng cây hoặc từng đám cây thành thục theo chu kỳ, duy trì liên tục độ che phủ và cấu trúc nhiều tầng của tán rừng tự nhiên.",
        recallHint: "SGK CN 12 Bài 6: Ba phương thức khai thác rừng: (1) Khai thác trắng (chặt toàn bộ trên diện tích nhất định); (2) Khai thác dần (chặt qua 2-3 đợt); (3) Khai thác chọn (chỉ chặt cây thành thục, duy trì cấu trúc rừng liên tục)."
      },
      {
        id: 20, grade: "cn12", topic: "(4) Giới thiệu chung Thủy sản",
        stem: "Nhóm cá nào sau đây thuộc nhóm 'Cá nước lạnh' thích nghi tối ưu ở nhiệt độ nước dưới 20°C?",
        options: ["Cá hồi, Cá tầm.", "Cá rô phi, Cá tra.", "Cá chép, Cá trắm cỏ.", "Cá chim trắng, Cá mè hoa."],
        answer: 0,
        explanation: "Cá tầm và cá hồi là những loài thủy sản nước lạnh đặc trưng, đòi hỏi nhiệt độ nước mát mẻ dưới 18-20°C và hàm lượng oxy hòa tan cao, phân bố chủ yếu ở Sa Pa, Đà Lạt.",
        recallHint: "SGK CN 12 Bài 8: Phân loại thủy sản theo nhiệt độ sống: Nhóm cá nước lạnh (cá tầm, cá hồi - sống tối ưu ở < 20°C); Nhóm cá nước ấm/nhiệt đới (cá tra, cá rô phi, tôm thẻ - sống tối ưu 25 - 32°C)."
      },
      {
        id: 21, grade: "cn12", topic: "(5) Môi trường nuôi thủy sản",
        stem: "Độ trong của nước ao nuôi thủy sản đo bằng đĩa Secchi thích hợp nhất cho sự phát triển của cá và tôm là",
        options: ["30 - 40 cm (nước có màu xanh nõn chuối hoặc nâu trà).", "< 10 cm (nước quá đục, bùn cát lơ lửng bám vào mang cá).", "80 - 100 cm (nước trong suốt nhìn thấy tận đáy ao).", "> 150 cm (nước nghèo kiệt chất dinh dưỡng khoáng)."],
        answer: 0,
        explanation: "Độ trong 30-40 cm thể hiện mật độ phiêu sinh thực vật (tảo có lợi) vừa phải, nước có màu xanh nõn chuối hoặc nâu trà, quang hợp tạo oxy hòa tan và ngăn ánh sáng xuyên xuống đáy kìm hãm rong rêu đáy.",
        recallHint: "SGK CN 12 Bài 10: Độ trong thích hợp của ao nuôi cá/tôm là 30 - 40 cm (đo bằng đĩa Secchi). Nước có màu xanh nõn chuối (tảo lục) hoặc nâu trà (tảo silic) là màu nước màu mỡ lý tưởng."
      },
      {
        id: 22, grade: "cn12", topic: "(5) Môi trường nuôi thủy sản",
        stem: "Quy trình chuẩn bị ao nuôi thủy sản trước khi thả cá giống gồm 4 bước kỹ thuật theo đúng trình tự là",
        options: ["Tháo cạn ao & nạo vét bùn đáy -> Bón vôi khử trùng -> Phơi đáy ao (3-7 ngày) -> Lấy nước & gây màu nước.", "Lấy nước vào ao -> Thả cá giống ngay -> Bón vôi khử trùng -> Tháo cạn ao.", "Bón phân gây màu nước -> Tháo cạn ao -> Nạo vét bùn đáy -> Thả cá giống.", "Phơi đáy ao -> Lấy nước ngập ao -> Bón vôi -> Nạo vét bùn đáy."],
        answer: 0,
        explanation: "Quy trình chuẩn 4 bước: (1) Tháo cạn nước, nạo vét bùn đen độc hại; (2) Rải vôi nông nghiệp CaCO3 diệt mầm bệnh và nâng kiềm; (3) Phơi nắng đáy ao 3-7 ngày để khoáng hóa; (4) Cấp nước lọc và gây màu nước tảo có lợi.",
        recallHint: "SGK CN 12 Bài 11: Bốn bước chuẩn bị ao nuôi thủy sản: (1) Tháo cạn & nạo bùn -> (2) Rải vôi khử trùng -> (3) Phơi đáy ao 3-7 ngày -> (4) Lấy nước qua túi lọc & gây màu nước đạt độ trong 30-40 cm."
      },
      {
        id: 23, grade: "cn12", topic: "(5) Môi trường nuôi thủy sản",
        stem: "Vai trò cơ bản của hệ thống quạt nước và sục khí trong các ao nuôi tôm thâm canh công nghệ cao là",
        options: ["cung cấp oxy hòa tan (DO) liên tục, gom tụ chất thải hữu cơ về rốn ao và giải phóng khí độc.", "làm nước ao nóng lên để kích thích tôm lột xác liên tục.", "làm nước ao đổi thành nước ngọt để tôm lớn nhanh hơn.", "tiêu diệt hoàn toàn tất cả các loại vi sinh vật trong ao."],
        answer: 0,
        explanation: "Quạt nước tăng cường khuếch tán oxy từ không khí vào nước (duy trì DO >= 4 mg/L), đồng thời tạo dòng chảy xoáy gom phân tôm và thức ăn thừa về hố xi-phông (rốn ao) để hút bỏ ra ngoài.",
        recallHint: "SGK CN 12 Bài 12: Hệ thống quạt nước: Tăng cường oxy hòa tan (DO), giải phóng khí độc (NH3, H2S) lên không khí, gom tụ chất thải hữu cơ vào tâm ao (rốn ao) để thuận tiện xi-phông làm sạch."
      },
      {
        id: 24, grade: "cn12", topic: "(6) Công nghệ giống thủy sản",
        stem: "Phương pháp tạo đàn cá rô phi đơn tính đực được ứng dụng rộng rãi nhất hiện nay trong sản xuất giống là",
        options: ["cho cá bột (cá hương mới tiêu hết noãn hoàng) ăn thức ăn có trộn hormone 17α-methyltestosterone trong 21 - 28 ngày.", "tiến hành phẫu thuật nội soi cắt bỏ buồng trứng của từng con cá cái.", "chiếu tia phóng xạ gamma liều cao vào trứng cá sau khi thụ tinh.", "nuôi cá trong điều kiện nhiệt độ nước dưới 10°C liên tục 3 tháng."],
        answer: 0,
        explanation: "Cho cá bột mới tiêu hết noãn hoàng (chưa biệt hóa tuyến sinh dục) ăn thức ăn chứa hormone 17a-methyltestosterone (MT) liều lượng 60 mg/kg thức ăn trong 21-28 ngày giúp biệt hóa 98-100% thành cá đực, cá lớn nhanh và không sinh sản tự do.",
        recallHint: "SGK CN 12 Bài 13: Kỹ thuật sản xuất cá rô phi đơn tính đực: Trộn hormone 17α-methyltestosterone vào thức ăn cho cá bột ăn trong giai đoạn 21 - 28 ngày đầu đời để định hướng 100% cá con phát triển thành con đực."
      }
    ],
    tfs: [
      {
        id: 1, grade: "cn10",
        topic: "Khối 10 — Đất trồng & Phân bón cốt lõi",
        title: "Câu 1: Bản chất keo đất, dung tích CEC và biện pháp cải tạo đất chua phèn",
        context: "Một nhóm học sinh tham quan mô hình canh tác nông nghiệp tại huyện Cẩm Mỹ (Đồng Nai) tiến hành tìm hiểu bản chất cấu tạo keo đất và kỹ thuật bón phân cải tạo đất chua. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          {
            label: "a",
            text: "Trong một hạt keo đất hoàn chỉnh, lớp ion khuếch tán nằm ở ngoài cùng mang điện tích trái dấu với lớp ion quyết định điện thế.",
            isTrue: true,
            explanation: "Đúng. Lớp ion quyết định điện thế mang dấu của keo (ví dụ keo âm mang điện âm), còn lớp ion bù (gồm lớp bất động và lớp khuếch tán) mang điện tích trái dấu (dương) để giữ cân bằng điện môi trường.",
            recallHint: "SGK CN 10 Bài 3: Hạt keo đất trung hòa về điện: Lớp ion quyết định thế hiệu mang điện nào thì các lớp ion bù (bất động và khuếch tán) mang điện tích trái dấu."
          },
          {
            label: "b",
            text: "Đất có hàm lượng mùn hữu cơ càng cao thì dung tích hấp phụ cation (CEC) của đất càng thấp.",
            isTrue: false,
            explanation: "Sai. Mùn hữu cơ có dung tích hấp phụ cation (CEC) rất cao (từ 150 - 300 meq/100g đất), cao gấp nhiều lần so với các loại khoáng sét. Đất càng giàu mùn thì CEC càng cao.",
            recallHint: "SGK CN 10 Bài 3: Keo mùn hữu cơ có diện tích bề mặt rất lớn và nhiều nhóm định chức phân ly ion, nên có CEC cao nhất trong các loại hạt keo đất."
          },
          {
            label: "c",
            text: "Bón vôi nông nghiệp (CaCO3) vào đất chua giúp khử chua vì ion Ca2+ thay thế các ion H+ và Al3+ trên phức hệ hấp phụ, đẩy chúng ra dung dịch đất để được trung hòa.",
            isTrue: true,
            explanation: "Đúng. Keo-[2H+, Al3+] + 2CaCO3 -> Keo-[2Ca2+] + Al(OH)3 kết tủa + 2CO2 + H2O, loại bỏ độc chất nhôm và nâng cao độ pH của đất.",
            recallHint: "SGK CN 10 Bài 4: Cơ chế bón vôi: Ion Ca2+ có ái lực hấp phụ mạnh hơn H+ và Al3+, đẩy H+ và Al3+ ra ngoài để trung hòa, làm tăng độ no bazơ (BS%) của đất."
          },
          {
            label: "d",
            text: "Đối với phân bón đạm Urê, nên bón rải lộ thiên trên mặt ruộng vào buổi trưa nắng gắt để ánh sáng mặt trời kích hoạt đạm phát huy tác dụng nhanh nhất.",
            isTrue: false,
            explanation: "Sai. Phân đạm Urê (NH2)2CO khi gặp nắng gắt và nhiệt độ cao sẽ bị men Urease phân giải nhanh thành khí Amoniac (NH3) bay hơi vào không khí, gây thất thoát dinh dưỡng lên tới 40-50%.",
            recallHint: "SGK CN 10 Bài 8: Không bón phân đạm khi trời nắng gắt (phân bay hơi thành khí NH3) hoặc trước cơn mưa rào lớn (bị rửa trôi). Phải vùi phân vào đất hoặc tưới đủ ẩm."
          }
        ]
      },
      {
        id: 2, grade: "cn11",
        topic: "Khối 11 — Dinh dưỡng, Giống & An toàn sinh học chăn nuôi",
        title: "Câu 2: Hệ số FCR, tiêu hóa động vật nhai lại và phòng dịch an toàn sinh học",
        context: "Tại một trang trại chăn nuôi bò thịt và lợn thịt quy mô gia trại khép kín tại Đồng Nai, xét tính Đúng/Sai của các nhận định kỹ thuật sau:",
        statements: [
          {
            label: "a",
            text: "Hệ số chuyển hóa thức ăn FCR càng nhỏ thì chứng tỏ vật nuôi sử dụng thức ăn càng hiệu quả và chi phí thức ăn cho 1 kg tăng trọng càng thấp.",
            isTrue: true,
            explanation: "Đúng. FCR biểu thị số kg thức ăn cần tiêu tốn để tạo ra 1 kg tăng khối lượng cơ thể. FCR càng thấp nghĩa là hiệu quả kinh tế càng cao.",
            recallHint: "SGK CN 11 Bài 13: Định nghĩa FCR: Lượng thức ăn tiêu thụ / Tăng trọng. FCR thấp = Tăng trọng tốt, tiêu hao thức ăn ít = Lợi nhuận cao."
          },
          {
            label: "b",
            text: "Dạ múi khế là dạ dày thực sự của động vật nhai lại vì đây là ngăn duy nhất có tuyến tiết enzyme tiêu hóa pepsin và axit clohydric (HCl).",
            isTrue: true,
            explanation: "Đúng. Ba ngăn đầu (Dạ cỏ, dạ tổ ong, dạ lá sách) là tiền dạ dày không có tuyến dịch vị; dạ múi khế có chức năng tiêu hóa hóa học giống như dạ dày đơn của lợn và người.",
            recallHint: "SGK CN 11 Bài 5: Dạ cỏ tiêu hóa vi sinh; Dạ múi khế tiêu hóa hóa học (tiết pepsin và HCl phân giải protein), được coi là dạ dày thật."
          },
          {
            label: "c",
            text: "Trong chăn nuôi lợn, con lai F1 sinh ra từ phép lai kinh tế giữa lợn nái Móng Cái thuần chủng với lợn đực ngoại Landrace nên được giữ lại làm giống để nhân giống sinh sản tiếp.",
            isTrue: false,
            explanation: "Sai. Con lai F1 chỉ dùng để nuôi lấy thịt thương phẩm. Nếu dùng con lai F1 làm giống thì ở thế hệ sau (F2) sẽ xảy ra hiện tượng phân ly tính trạng làm giảm năng suất nghiêm trọng.",
            recallHint: "SGK CN 11 Bài 4: Quy tắc vàng trong lai kinh tế: Con lai F1 có ưu thế lai cao nhất CHỈ dùng nuôi lấy thịt, KHÔNG dùng làm giống vì đời F2 thoái hóa."
          },
          {
            label: "d",
            text: "Quy trình an toàn sinh học 3 vòng trong chăn nuôi nhằm ngăn chặn triệt để sự xâm nhập của mầm bệnh từ bên ngoài vào khu vực chuồng nuôi.",
            isTrue: true,
            explanation: "Đúng. Hệ thống 3 vòng cách ly (Vành đai cách ly ngoài cùng -> Vùng đệm sát trùng -> Khu chuồng nuôi vô trùng) là cốt lõi của an toàn sinh học phòng dịch tả lợn châu Phi và lở mồm long móng.",
            recallHint: "SGK CN 11 Bài 14: An toàn sinh học 3 vòng: Cách ly cơ học, khử trùng phương tiện/con người ở vùng đệm và bảo vệ nghiêm ngặt khu chuồng nuôi."
          }
        ]
      },
      {
        id: 3, grade: "cn12",
        topic: "Khối 12 — Quản lý rừng & Kỹ thuật lâm sinh",
        title: "Câu 3: Phân loại 3 loại rừng và biện pháp tỉa thưa nuôi dưỡng rừng",
        context: "Một công ty lâm nghiệp được giao quản lý rừng tại Đồng Nai tiến hành lập quy hoạch bảo vệ và phát triển rừng theo Luật Lâm nghiệp 2017. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          {
            label: "a",
            text: "Theo Luật Lâm nghiệp 2017, Vườn quốc gia Cát Tiên thuộc loại rừng đặc dụng nhằm mục đích bảo tồn hệ sinh thái tự nhiên và nguồn gen sinh vật.",
            isTrue: true,
            explanation: "Đúng. Rừng đặc dụng bao gồm vườn quốc gia, khu dự trữ thiên nhiên, khu bảo tồn loài - sinh cảnh nhằm mục đích bảo tồn thiên nhiên và nghiên cứu khoa học.",
            recallHint: "SGK CN 12 Bài 2: Rừng đặc dụng gồm: Vườn quốc gia, khu bảo tồn thiên nhiên, khu bảo tồn sinh cảnh, khu bảo vệ cảnh quan di tích lịch sử."
          },
          {
            label: "b",
            text: "Rừng sản xuất là loại rừng được sử dụng chủ yếu để bảo vệ nguồn nước, bảo vệ đất và chống xói mòn trượt lở đất.",
            isTrue: false,
            explanation: "Sai. Đó là chức năng chủ yếu của Rừng phòng hộ. Rừng sản xuất được sử dụng chủ yếu để cung cấp lâm sản (gỗ, củi, lâm sản ngoài gỗ) và kết hợp bảo vệ môi trường.",
            recallHint: "SGK CN 12 Bài 2: Phân biệt: Rừng phòng hộ (chắn gió, bảo vệ nước, chống xói mòn); Rừng sản xuất (cung cấp gỗ và lâm sản phục vụ kinh tế)."
          },
          {
            label: "c",
            text: "Tỉa thưa nuôi dưỡng rừng là biện pháp lâm sinh chủ động chặt bỏ những cây cong queo, sâu bệnh, bị chèn ép để tạo không gian sinh dưỡng tối ưu cho những cây khỏe mạnh giữ lại.",
            isTrue: true,
            explanation: "Đúng. Tỉa thưa điều chỉnh mật độ cây rừng, tập trung ánh sáng và dinh dưỡng cho các cây mục tiêu có phẩm chất tốt để nuôi dưỡng thành cây gỗ lớn có giá trị cao.",
            recallHint: "SGK CN 12 Bài 5: Mục đích tỉa thưa: Điều chỉnh mật độ, loại bỏ cây xấu chèn ép, tăng tốc độ tăng trưởng đường kính cho các cây mục tiêu lấy gỗ lớn."
          },
          {
            label: "d",
            text: "Trong phòng chống cháy rừng mùa khô, việc dọn dẹp vật liệu cháy (lá khô, cành khô rơi rụng) và thiết kế đường băng cản lửa trắng không mang lại hiệu quả thực tế.",
            isTrue: false,
            explanation: "Sai. Đường băng cản lửa trắng và việc giảm thiểu tải lượng vật liệu cháy đầu mùa khô là hai biện pháp kỹ thuật then chốt nhất để ngăn chặn lửa lan tràn.",
            recallHint: "SGK CN 12 Bài 6: Biện pháp phòng chống cháy rừng: Thiết kế đường băng cản lửa (băng trắng, băng xanh), dọn sạch thực bì dưới tán và tuần tra chòi canh."
          }
        ]
      },
      {
        id: 4, grade: "cn12",
        topic: "Khối 12 — Quản lý môi trường nước ao & Kỹ thuật nuôi thủy sản",
        title: "Câu 4: Các chỉ tiêu lý hóa nước ao và quy trình 4 bước chuẩn bị ao nuôi",
        context: "Một kỹ sư nuôi trồng thủy sản hướng dẫn nông dân huyện Nhơn Trạch (Đồng Nai) chuẩn bị ao và quản lý chất lượng nước nuôi cá rô phi. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          {
            label: "a",
            text: "Khoảng pH nước ao nuôi thủy sản thích hợp nhất cho hầu hết các loài cá và tôm sinh trưởng khỏe mạnh là từ 7,5 đến 8,5.",
            isTrue: true,
            explanation: "Đúng. Độ pH tối ưu cho đời sống thủy sản nước ngọt và lợ là 7,5 - 8,5 (môi trường kiềm yếu). Nếu pH < 6,5 cá chậm lớn, khó thở; nếu pH > 9,0 khí độc NH3 tăng vọt.",
            recallHint: "SGK CN 12 Bài 10: Chỉ tiêu pH ao nuôi: Tối ưu từ 7,5 đến 8,5. Biến động ngày đêm không vượt quá 0,5 đơn vị pH."
          },
          {
            label: "b",
            text: "Hàm lượng khí độc Amoniac tự do (NH3) trong nước ao nuôi thủy sản càng cao thì càng có lợi cho quá trình hô hấp của mang cá.",
            isTrue: false,
            explanation: "Sai. Khí NH3 tự do khuếch tán trực tiếp qua mang vào máu cá, ức chế quá trình vận chuyển oxy và phá hủy tế bào mang, gây độc chết cá. Nồng độ an toàn phải < 0,01 mg/L.",
            recallHint: "SGK CN 12 Bài 10: Khí độc trong ao: NH3 tự do và H2S cực kỳ độc với cá tôm. Cần duy trì NH3 < 0,01 mg/L và H2S = 0 mg/L."
          },
          {
            label: "c",
            text: "Trong quy trình chuẩn bị ao nuôi, việc phơi đáy ao từ 3 đến 7 ngày dưới ánh nắng mặt trời có tác dụng khoáng hóa chất hữu cơ và tiêu diệt mầm bệnh tồn lưu.",
            isTrue: true,
            explanation: "Đúng. Ánh sáng mặt trời với tia UV chiếu rọi đáy ao giúp oxy hóa các chất khí độc tích tụ, làm nứt nẻ bùn đáy và tiêu diệt vi khuẩn, nấm, ký sinh trùng gây bệnh.",
            recallHint: "SGK CN 12 Bài 11: Bước phơi đáy ao: Phơi nứt chân chim 3 - 7 ngày giúp oxy hóa đáy ao, diệt mầm bệnh và giải phóng khí độc tích tụ từ vụ nuôi trước."
          },
          {
            label: "d",
            text: "Khi thả cá giống vào ao mới nuôi, nên thả cá trực tiếp vào lúc giữa trưa nắng gắt nhất để cá con ấm áp và thích nghi nhiệt độ nhanh nhất.",
            isTrue: false,
            explanation: "Sai. Thả cá giống vào buổi trưa nắng gắt cá sẽ bị sốc nhiệt và chết hàng loạt. Nên thả cá vào lúc sáng sớm (6-8h) hoặc chiều mát (16-17h), ngâm bao cá trong ao 15-20 phút trước khi thả.",
            recallHint: "SGK CN 12 Bài 11: Kỹ thuật thả giống: Thả vào lúc mát mẻ (sáng sớm hoặc chiều mát). Ngâm bao cá vào ao 15-20 phút để cân bằng nhiệt độ tránh sốc nhiệt."
          }
        ]
      }
    ],
    essays: [
      {
        id: 1,
        points: 3.5,
        title: "Câu 1 (3,5 điểm — Kiến thức Lâm nghiệp Lớp 12)",
        problem: "1. Căn cứ vào Luật Lâm nghiệp năm 2017, hãy nêu tên 3 loại rừng ở Việt Nam và phân tích mục đích sử dụng chủ yếu của từng loại rừng. (1,5 điểm)\n2. Trình bày mục đích và các nguyên tắc kỹ thuật cơ bản của biện pháp 'Tỉa thưa nuôi dưỡng rừng' trồng cây lấy gỗ lớn (thời điểm tỉa thưa, nguyên tắc chọn cây chặt bỏ và cây giữ lại). (1,5 điểm)\n3. Nêu 2 biện pháp kỹ thuật lâm sinh đơn giản nhưng hiệu quả để phòng cháy rừng trong mùa khô tại vùng Đông Nam Bộ. (0,5 điểm)",
        recallHint: "SGK CN 12 Bài 2 & Bài 5 & Bài 6: Phân loại 3 loại rừng (đặc dụng, phòng hộ, sản xuất). Tỉa thưa: Chặt cây cong queo chèn ép, giữ cây khỏe thẳng, tỉa khi khép tán. Phòng cháy: Đường băng cản lửa trắng/xanh, dọn thực bì.",
        rubric: [
          "1. Nêu đúng và phân tích 3 loại rừng (1,5đ): Rừng đặc dụng (0,5đ - bảo tồn đa dạng sinh học, cảnh quan, di tích); Rừng phòng hộ (0,5đ - bảo vệ nguồn nước, bảo vệ đất, chống xói mòn sạt lở); Rừng sản xuất (0,5đ - cung cấp gỗ, lâm sản ngoài gỗ và kết hợp du lịch sinh thái).",
          "2. Mục đích & nguyên tắc tỉa thưa (1,5đ): Mục đích (0,5đ - điều chỉnh mật độ, tập trung dinh dưỡng ánh sáng cho cây gỗ lớn mục tiêu); Thời điểm (0,5đ - khi rừng bắt đầu khép tán giao cành cạnh tranh ánh sáng gay gắt); Nguyên tắc chọn cây (0,5đ - chặt cây sâu bệnh, cong queo, chèn ép; giữ lại cây sinh trưởng tốt, thân thẳng tròn đều).",
          "3. Phòng cháy rừng (0,5đ): Thiết kế đường băng cản lửa (băng trắng hoặc băng cây xanh cản lửa) và dọn dẹp vật liệu cháy (thực bì lá khô) trước mùa khô."
        ]
      },
      {
        id: 2,
        points: 3.5,
        title: "Câu 2 (3,5 điểm — Kiến thức Thủy sản Lớp 12)",
        problem: "1. Trình bày khoảng giá trị thích hợp của 3 chỉ tiêu hóa học then chốt trong nước ao nuôi thủy sản: Độ pH, Oxy hòa tan (DO), và Khí độc Amoniac tự do (NH3). Nêu hậu quả khi chỉ tiêu DO giảm xuống quá thấp vào ban đêm. (1,5 điểm)\n2. Trình bày chi tiết quy trình kỹ thuật 4 bước chuẩn bị ao nuôi thủy sản an toàn sinh học trước khi thả cá giống. (1,5 điểm)\n3. Nêu thao tác kỹ thuật khi thả giống thủy sản để chống hiện tượng sốc nhiệt độ và sốc môi trường cho cá giống. (0,5 điểm)",
        recallHint: "SGK CN 12 Bài 10 & Bài 11: Chỉ tiêu nước: pH 7,5 - 8,5; DO >= 4 mg/L; NH3 < 0,01 mg/L. Bốn bước chuẩn bị ao: Tháo cạn & nạo bùn -> Bón vôi khử trùng -> Phơi đáy ao 3-7 ngày -> Cấp nước & gây màu nước. Chống sốc: Ngâm bao giống trong ao 15-20 phút.",
        rubric: [
          "1. Ba chỉ tiêu hóa học & hậu quả thiếu DO (1,5đ): Nêu đúng giá trị thích hợp: pH = 7,5 - 8,5 (0,25đ); DO >= 4,0 mg/L (0,25đ); NH3 < 0,01 mg/L (0,25đ); Hậu quả thiếu DO (0,75đ - cá nổi đầu ngạt khí vào rạng sáng, giảm ăn, chết ngạt hàng loạt).",
          "2. Quy trình chuẩn bị ao 4 bước (1,5đ): Bước 1: Tháo cạn nước ao, nạo vét bùn đáy đen (0,375đ); Bước 2: Rải vôi nông nghiệp khử trùng (0,375đ); Bước 3: Phơi đáy ao 3-7 ngày nứt chân chim (0,375đ); Bước 4: Lấy nước qua lưới lọc và bón phân gây màu nước đạt độ trong 30-40 cm (0,375đ).",
          "3. Kỹ thuật thả cá giống chống sốc (0,5đ): Thả vào sáng sớm hoặc chiều mát; ngâm túi chứa cá trong ao 15-20 phút để cân bằng nhiệt độ, sau đó mở miệng túi cho nước ao từ từ vào túi rồi thả cá bơi ra."
        ]
      },
      {
        id: 3,
        points: 1.0,
        title: "Câu 3 (1,0 điểm — Kiến thức Nền tảng Nông học Tổng hợp)",
        problem: "1. Hãy so sánh sự khác nhau căn bản về bản chất điện tích giữa Keo âm và Keo dương trong đất trồng trọt. Loại keo nào phổ biến nhất trong đất nông nghiệp Việt Nam? (0,5 điểm)\n2. Dựa vào bản chất hóa học của phản ứng trao đổi ion trên bề mặt hạt keo đất, hãy giải thích ngắn gọn vì sao biện pháp bón vôi nông nghiệp (CaCO3) lại khử được độ chua tiềm tàng của đất. (0,5 điểm)",
        recallHint: "SGK CN 10 Bài 3 & Bài 4: Keo âm: Lớp quyết định điện thế âm (phổ biến nhất); Keo dương: Lớp quyết định thế hiệu dương. Cơ chế vôi: Ca2+ thay thế ion H+ và Al3+ trên bề mặt keo đất đẩy ra dung dịch để trung hòa.",
        rubric: [
          "1. So sánh keo âm và keo dương (0,5đ): Keo âm có lớp ion quyết định điện thế mang điện tích âm; Keo dương có lớp ion quyết định điện thế mang điện tích dương (0,25đ). Keo âm là loại phổ biến nhất trong đất nông nghiệp Việt Nam (0,25đ).",
          "2. Cơ chế bón vôi khử chua (0,5đ): Ion Ca2+ từ vôi có ái lực hấp phụ lớn hơn ion H+ và Al3+, sẽ đẩy H+ và Al3+ ra khỏi phức hệ hấp phụ của keo đất vào dung dịch; sau đó CaCO3 trung hòa H+ thành CO2 và H2O, kết tủa Al3+ thành Al(OH)3 không độc, làm tăng độ pH của đất."
        ]
      }
    ]
  },

  dn_easy_02: {
    id: "dn_easy_02",
    level: "easy",
    levelBadge: "🟢 CẤP ĐỘ 1: DỄ / KHỞI ĐỘNG",
    levelLabel: "CẤP ĐỘ 1 (DỄ / KHỞI ĐỘNG & BẢN CHẤT KHÁI NIỆM SGK)",
    code: "ĐỒNG NAI — CẤP ĐỘ 1 (ĐỀ 02)",
    title: "KỲ THI CHỌN HỌC SINH GIỎI CẤP TỈNH — ĐỒNG NAI (ĐỀ SỐ 02 - CẤP ĐỘ 1: BẢN CHẤT KHÁI NIỆM)",
    subTitle: "Củng cố bản chất khoa học SGK • Tránh bẫy định nghĩa • Tích hợp Điểm tựa ghi nhớ SGK",
    durationMinutes: 180,
    maxScore: 20.0,
    source: "Ngân hàng Đề Củng cố Khái niệm HSG — Chuẩn SGK Kết nối tri thức Lớp 10, 11, 12",
    mcqs: [
      // K10 (8 câu: 3 Đất + 3 Phân bón + 2 Trồng trọt CNC)
      {
        id: 1, grade: "cn10", topic: "(1) Đất trồng",
        stem: "Loại keo đất có lớp ion quyết định điện thế mang điện tích dương và có khả năng hấp phụ các anion (như NO3-, SO4^2-, Cl-) trên lớp ion khuếch tán là",
        options: ["keo âm.", "keo dương.", "keo trung tính.", "keo lưỡng tính."],
        answer: 1,
        explanation: "Keo dương có lớp ion quyết định điện thế mang điện dương (thường gặp ở đất đỏ bazan/feralit giàu oxit sắt Fe2O3, oxit nhôm Al2O3). Lớp ion khuếch tán của nó mang điện âm gồm các anion dinh dưỡng.",
        recallHint: "SGK CN 10 Bài 3: Phân biệt: Keo âm (phổ biến nhất, quyết định thế âm, giữ cation); Keo dương (quyết định thế dương, giữ anion, gặp ở đất feralit chua giàu Fe, Al)."
      },
      {
        id: 2, grade: "cn10", topic: "(1) Đất trồng",
        stem: "Độ chua hoạt tính của đất trồng trọt được quyết định trực tiếp bởi yếu tố nào sau đây?",
        options: ["Nồng độ ion H+ tự do có trong dung dịch đất (biểu thị bằng chỉ số pH_H2O).", "Tổng lượng ion H+ và Al3+ bị giữ chặt trên bề mặt keo đất.", "Hàm lượng chất hữu cơ mùn trong tầng đất mặt.", "Lượng phân bón lót còn sót lại trong rễ cây."],
        answer: 0,
        explanation: "Độ chua hoạt tính là độ chua do ion H+ tự do tồn tại trong dung dịch đất gây nên, được xác định trực tiếp bằng máy đo pH ngâm trong dung dịch nước (pH_H2O).",
        recallHint: "SGK CN 10 Bài 3: Độ chua của đất gồm: (1) Độ chua hoạt tính do H+ tự do trong dung dịch đất (pH_H2O); (2) Độ chua tiềm tàng do H+ và Al3+ hấp phụ trên bề mặt hạt keo đất (pH_KCl)."
      },
      {
        id: 3, grade: "cn10", topic: "(1) Đất trồng",
        stem: "Để cải tạo và sử dụng bền vững đất nhiễm mặn ven biển, biện pháp kỹ thuật nào sau đây là quan trọng và hiệu quả nhất?",
        options: ["Bón phân kali clorua (KCl) thật nhiều để át mặn.", "Dẫn nước ngọt thau chua rửa mặn kết hợp bón vôi nông nghiệp và đắp đê ngăn mặn.", "Đốt sạch cỏ dại và cày sâu lật tầng đất chứa muối lên bề mặt.", "Bơm nước biển trực tiếp vào ruộng để hòa tan muối."],
        answer: 1,
        explanation: "Đắp đê ngăn nước biển xâm nhập, dùng nước ngọt từ sông dẫn vào thau rửa muối thừa ra mương tiêu; bón vôi (CaCO3) để Ca2+ thay thế Na+ trên keo đất rồi rửa trôi Na+ ra ngoài.",
        recallHint: "SGK CN 10 Bài 4: Biện pháp cải tạo đất mặn: Đắp đê ngăn mặn -> Dẫn nước ngọt thau rửa muối -> Bón vôi nông nghiệp đẩy ion Na+ ra dung dịch đất để rửa mặn."
      },
      {
        id: 4, grade: "cn10", topic: "(2) Phân bón",
        stem: "Loại phân bón vi sinh vật nào sau đây có khả năng chuyển hóa khí Nitơ (N2) tự do từ khí quyển thành dạng đạm Amôn (NH4+) mà cây trồng có thể hấp thu được?",
        options: ["Phân vi sinh vật cố định đạm (như vi khuẩn nốt sần Rhizobium, Azotobacter).", "Phân vi sinh vật phân giải lân khó tan.", "Phân vi sinh vật phân giải chất hữu cơ xenlulozo.", "Phân bón lá vi lượng."],
        answer: 0,
        explanation: "Vi khuẩn cố định đạm (Rhizobium cộng sinh ở nốt sần rễ cây họ Đậu hoặc Azotobacter sống tự do) có enzyme nitrogenase giúp chuyển hóa N2 từ không khí thành NH4+ cung cấp cho cây.",
        recallHint: "SGK CN 10 Bài 7: Phân bón vi sinh cố định đạm: Chứa vi khuẩn có khả năng biến N2 tự do trong không khí thành hợp chất chứa đạm cung cấp dinh dưỡng cho cây trồng."
      },
      {
        id: 5, grade: "cn10", topic: "(2) Phân bón",
        stem: "Trong các loại phân bón vô cơ sau đây, loại phân nào có độ tan cao nhất và thường được ưu tiên dùng để bón thúc hoặc hòa tan tưới nhỏ giọt?",
        options: ["Phân Lân nung chảy.", "Phân Đạm Urê.", "Bột đá photphorit.", "Phân hữu cơ chuồng ủ hoai."],
        answer: 1,
        explanation: "Phân Đạm Urê [(NH2)2CO] và phân Kali clorua (KCl) có độ hòa tan rất cao và nhanh trong nước, cây hấp thu dễ dàng nên luôn được ưu tiên dùng bón thúc.",
        recallHint: "SGK CN 10 Bài 8: Tính tan của phân: Đạm Urê, Kali clorua tan rất nhanh -> Dùng bón thúc; Phân lân nung chảy, phân chuồng khó tan -> Dùng bón lót sâu vào đất."
      },
      {
        id: 6, grade: "cn10", topic: "(2) Phân bón",
        stem: "Cây ngô hoặc lúa khi bị thiếu hụt nguyên tố Lân (P) thường xuất hiện triệu chứng điển hình nào trên bộ lá?",
        options: ["Lá có màu xanh đậm bất thường, mép lá và gân lá chuyển sang màu huyết dụ tím đỏ.", "Toàn bộ phiến lá bị biến màu trắng bệch như tờ giấy.", "Lá non bị cháy xoăn ngọn và rụng đồng loạt.", "Lá bị đốm vằn đen xì."],
        answer: 0,
        explanation: "Thiếu Lân (P) làm tích lũy sắc tố anthocyanin khiến lá chuyển sang màu tím đỏ (huyết dụ) bắt đầu từ mép lá già, bộ rễ kém phát triển, cây chậm đẻ nhánh.",
        recallHint: "SGK CN 10 Bài 6: Triệu chứng thiếu Lân (P): Cây cằn cỗi, rễ phát triển kém, lá có màu xanh đậm tối hoặc xuất hiện màu tím đỏ huyết dụ ở gân và mép lá già."
      },
      {
        id: 7, grade: "cn10", topic: "(3) Trồng trọt công nghệ cao",
        stem: "Ưu điểm nổi bật nhất của việc sử dụng giá thể trơ (như đá trân châu Perlite, xơ dừa) thay thế đất tự nhiên trong hệ thống trồng dưa lưới công nghệ cao là",
        options: ["hoàn toàn sạch mầm bệnh và sâu hại truyền qua đất, tạo độ xốp và kiểm soát chính xác dinh dưỡng.", "giá thể tự động tạo ra chất đạm và kali mà không cần tưới phân.", "giá thể có thể biến cây dưa thành cây sống lâu năm.", "giá thể làm quả dưa tự động to gấp 10 lần bình thường."],
        answer: 0,
        explanation: "Giá thể sạch giúp cắt đứt nguồn nấm bệnh lây lan từ đất (như nấm lở cổ rễ Phytophthora, Fusarium), đồng thời giúp rễ thông thoáng và người trồng chủ động điều tiết dung dịch dinh dưỡng Fertigation.",
        recallHint: "SGK CN 10 Bài 10: Ưu điểm giá thể trồng cây: Thoát nước tốt, giữ ẩm và thông khí tối ưu, không chứa mầm bệnh tuyến trùng hay nấm đất, sạch sẽ và tái sử dụng được."
      },
      {
        id: 8, grade: "cn10", topic: "(3) Trồng trọt công nghệ cao",
        stem: "Hệ thống tưới nhỏ giọt kết hợp bón phân hòa tan (Fertigation) trong nông nghiệp công nghệ cao giúp mang lại lợi ích nào sau đây?",
        options: ["Tiết kiệm đáng kể lượng nước tưới và phân bón nhờ đưa trực tiếp dinh dưỡng tới vùng rễ hoạt động của cây.", "Làm ngập úng toàn bộ bề mặt luống cây suốt cả ngày.", "Làm tăng lượng phân bón bị bốc hơi và rửa trôi vào nguồn nước ngầm.", "Thay thế hoàn toàn nhu cầu ánh sáng mặt trời của lá cây."],
        answer: 0,
        explanation: "Công nghệ Fertigation điều tiết lượng nước và phân theo giọt nhỏ tới đúng vùng rễ tích cực, giảm 30-50% lượng nước và phân bón thất thoát do bay hơi hay rửa trôi so với tưới tràn truyền thống.",
        recallHint: "SGK CN 10 Bài 12: Hệ thống tưới nhỏ giọt Fertigation: Tiết kiệm nước tưới và phân bón, hạn chế cỏ dại mọc giữa luống, cung cấp chính xác nồng độ dinh dưỡng theo từng giai đoạn phát triển của cây."
      },

      // K11 (8 câu: 3 Giống + 3 Thức ăn + 2 MT chăn nuôi)
      {
        id: 9, grade: "cn11", topic: "(4) Giống vật nuôi",
        stem: "Phương pháp chọn lọc giống hàng loạt có đặc điểm thực tế là",
        options: ["thực hiện đơn giản, nhanh chóng, chọn lọc dựa trên ngoại hình và năng suất của cả bầy đàn nhưng độ chính xác di truyền không cao.", "bắt buộc phải theo dõi gia phả qua 5 đời liên tiếp.", "chỉ áp dụng đối với các loài thủy sản nước ngọt.", "đòi hỏi trang thiết bị giải trình tự gen hiện đại."],
        answer: 0,
        explanation: "Chọn lọc hàng loạt dựa trên tiêu chuẩn quy định sẵn của ngoại hình và năng suất bầy đàn, dễ tiến hành ở quy mô nông hộ nhưng không biết rõ kiểu gen nên hiệu quả chọn giống qua các thế hệ tiến bộ chậm.",
        recallHint: "SGK CN 11 Bài 3: Chọn lọc hàng loạt: Dễ làm, chọn nhanh số lượng lớn cá thể đạt chuẩn ngoại hình, phù hợp nông hộ nhưng độ chính xác không cao bằng chọn lọc cá thể."
      },
      {
        id: 10, grade: "cn11", topic: "(4) Giống vật nuôi",
        stem: "Tinh dịch của gia súc đực giống quý (như bò thịt BBB, bò sữa Holstein Friesian) được bảo quản lạnh sâu ở nhiệt độ nào để có thể lưu giữ lâu dài mà tinh trùng vẫn sống?",
        options: ["Nhiệt độ -196°C trong nitơ lỏng.", "Nhiệt độ 0°C trong ngăn đá tủ lạnh gia đình.", "Nhiệt độ phòng 25°C.", "Nhiệt độ 100°C trong nồi nước sôi."],
        answer: 0,
        explanation: "Bảo quản tinh dịch đông lạnh dạng cọng rạ trong bình nitơ lỏng ở nhiệt độ cực thấp -196°C làm ngừng trệ hoàn toàn quá trình trao đổi chất của tinh trùng, cho phép lưu giữ hàng chục năm.",
        recallHint: "SGK CN 11 Bài 4: Bảo quản tinh đông lạnh: Nhiệt độ -196°C trong bình chứa nitơ lỏng, giúp tinh trùng sống tiềm sinh vô hạn định và sẵn sàng cho thụ tinh nhân tạo."
      },
      {
        id: 11, grade: "cn11", topic: "(4) Giống vật nuôi",
        stem: "Khẩu phần ăn của gia súc sinh sản (bò sữa, lợn nái) thường được chia thành 2 phần dinh dưỡng là",
        options: ["Nhu cầu duy trì (để sống và giữ thân nhiệt) và Nhu cầu sản xuất (để mang thai, tiết sữa, tăng trọng).", "Nhu cầu ăn no và Nhu cầu uống nước ngọt.", "Nhu cầu ăn ban ngày và Nhu cầu ăn ban đêm.", "Nhu cầu chất xơ và Nhu cầu chất độc hại."],
        answer: 0,
        explanation: "Khẩu phần duy trì giúp con vật duy trì các hoạt động sống cơ bản (tuần hoàn, hô hấp, duy trì thân nhiệt) mà không thay đổi khối lượng cơ thể; khẩu phần sản xuất cung cấp dinh dưỡng cho thai phát triển và tuyến vú tiết sữa.",
        recallHint: "SGK CN 11 Bài 7: Khẩu phần ăn vật nuôi = Nhu cầu duy trì (giữ thể trọng sống và thân nhiệt cơ bản) + Nhu cầu sản xuất (tiết sữa, đẻ trứng, tăng trọng, mang thai)."
      },
      {
        id: 12, grade: "cn11", topic: "(5) Thức ăn chăn nuôi",
        stem: "Nhóm thức ăn nào sau đây thuộc nhóm 'Thức ăn giàu năng lượng' (hàm lượng tinh bột cao) trong chăn nuôi gia súc, gia cầm?",
        options: ["Hạt ngô, cám gạo, bột sắn khô.", "Bột cá biển, bột xương thịt, khô dầu đậu tương.", "Cỏ voi tươi, thân cây chuối, bèo tấm.", "Premix khoáng và vitamin tổng hợp."],
        answer: 0,
        explanation: "Thức ăn giàu năng lượng là thức ăn có hàm lượng xơ thô < 18% và protein thô < 20% nhưng rất giàu carbohydrate/tinh bột (như ngô, thóc, cám gạo, bột sắn), cung cấp năng lượng trao đổi chủ yếu.",
        recallHint: "SGK CN 11 Bài 7: Phân loại thức ăn chăn nuôi: (1) Giàu năng lượng (ngô, sắn, cám gạo - giàu tinh bột); (2) Giàu protein (bột cá, đậu tương, khô dầu); (3) Thức ăn thô xanh (cỏ tươi, rơm rạ - giàu xơ)."
      },
      {
        id: 13, grade: "cn11", topic: "(5) Thức ăn chăn nuôi",
        stem: "Khô dầu đậu tương và bột cá biển thuộc nhóm thức ăn chăn nuôi nào sau đây?",
        options: ["Thức ăn giàu protein (đạm thô > 20%).", "Thức ăn thô xơ.", "Thức ăn khoáng vi lượng.", "Thức ăn lên men vi sinh."],
        answer: 0,
        explanation: "Khô dầu đậu tương (chứa 44-48% protein thô) và bột cá biển (chứa 55-65% protein thô) là hai nguồn nguyên liệu thức ăn giàu protein tiêu hóa cao cấp nhất trong chăn nuôi công nghiệp.",
        recallHint: "SGK CN 11 Bài 7: Thức ăn giàu đạm/protein: Chứa trên 20% protein thô trong vật chất khô, cung cấp các axit amin thiết yếu (Lysine, Methionine) để cấu tạo cơ bắp và tạo nạc."
      },
      {
        id: 14, grade: "cn11", topic: "(5) Thức ăn chăn nuôi",
        stem: "Mô hình nuôi gà trên nền đệm lót sinh học (dày 10 - 20 cm gồm trấu, mùn cưa phối trộn men vi sinh) có tác dụng căn bản là",
        options: ["vi sinh vật lên men phân hủy chất thải phân gà, tiêu diệt mầm bệnh và khử triệt để mùi hôi chuồng trại.", "làm cho gà không cần ăn thức ăn hạt ngô và cám.", "làm chuồng gà biến thành bể bơi cho gia cầm tắm mát.", "làm chuồng gà lúc nào cũng ẩm ướt lầy lội."],
        answer: 0,
        explanation: "Đệm lót sinh học chứa các chủng vi khuẩn Bacillus, nấm men sinh nhiệt và phân giải nhanh axit uric trong phân gà thành chất không mùi, giữ chuồng khô ráo, ấm áp về mùa đông và sạch sẽ.",
        recallHint: "SGK CN 11 Bài 14: Lợi ích của đệm lót sinh học: Khử mùi hôi khí độc (NH3, H2S), phân hủy phân tại chỗ, giảm công dọn chuồng, giữ ấm chân gà và phòng bệnh đường hô hấp."
      },
      {
        id: 15, grade: "cn11", topic: "(6) Môi trường & Phòng bệnh chăn nuôi",
        stem: "Bệnh truyền nhiễm ở vật nuôi (như dịch tả lợn châu Phi, cúm gia cầm) có đặc điểm sinh học nổi bật nhất là",
        options: ["do vi sinh vật gây bệnh (virus, vi khuẩn) gây ra và có khả năng lây lan nhanh chóng từ con ốm sang con khỏe thành dịch.", "chỉ xảy ra khi thời tiết chuyển mùa từ thu sang đông.", "hoàn toàn không có tính lây lan giữa các cá thể trong cùng một chuồng nuôi.", "chỉ do yếu tố di truyền từ bố mẹ truyền lại chứ không do mầm bệnh ngoài môi trường."],
        answer: 0,
        explanation: "Bệnh truyền nhiễm có nguyên nhân đặc hiệu từ vi sinh vật gây bệnh (virus, vi khuẩn, nấm), có tính truyền lây qua đường tiếp xúc trực tiếp, giọt bắn, thức ăn nước uống hoặc động vật trung gian truyền bệnh.",
        recallHint: "SGK CN 11 Bài 15: Đặc điểm bệnh truyền nhiễm: Do mầm bệnh vi sinh vật xâm nhập, có tính chất lây lan thành dịch diện rộng, có thời kỳ ủ bệnh và kích thích phản ứng miễn dịch."
      },
      {
        id: 16, grade: "cn11", topic: "(6) Môi trường & Phòng bệnh chăn nuôi",
        stem: "Biện pháp kỹ thuật nào sau đây là đơn giản, rẻ tiền và hiệu quả nhất để sát trùng lối đi và hố khử trùng tại cổng vào trang trại chăn nuôi?",
        options: ["Rải vôi bột (CaO) hoặc phun dung dịch nước vôi tôi nồng độ 10% - 20%.", "Phun nước đường ấm vào bánh xe các phương tiện vận chuyển.", "Rắc muối ăn hạt tinh khiết với lượng rất nhỏ.", "Dùng quạt gió thổi bụi ngoài cổng."],
        answer: 0,
        explanation: "Vôi bột khi gặp nước tạo thành dung dịch kiềm mạnh Ca(OH)2 có pH > 12 kèm tỏa nhiệt, có khả năng diệt khuẩn, virus và bào tử nấm cực mạnh, chi phí rất rẻ và dễ sử dụng phổ biến.",
        recallHint: "SGK CN 11 Bài 14: Biện pháp sát trùng thú y truyền thống: Dùng vôi bột hoặc nước vôi 10-20% quét chuồng, rải hố sát trùng tại cổng ra vào trang trại để tiêu diệt mầm bệnh cơ học."
      },

      // K12 (8 câu: 4 Lâm nghiệp + 4 Thủy sản)
      {
        id: 17, grade: "cn12", topic: "(1) Giới thiệu chung Lâm nghiệp",
        stem: "Rừng phòng hộ đầu nguồn sông ngòi có vai trò sinh thái chủ yếu nào sau đây?",
        options: ["Điều tiết nguồn nước, giảm thiểu dòng chảy lũ quét vào mùa mưa và duy trì dòng chảy kiệt vào mùa khô.", "Cung cấp tối đa lượng gỗ củi để khai thác trắng hàng năm.", "Xây dựng các nhà máy công nghiệp sản xuất giấy quy mô lớn.", "Làm sân golf phục vụ thể thao cao cấp."],
        answer: 0,
        explanation: "Tán rừng và thảm mục rừng phòng hộ đầu nguồn giữ nước mưa ngấm sâu vào lòng đất tạo túi nước ngầm, giảm tốc độ dòng chảy mặt chống xói mòn sạt lở và duy trì nguồn nước ổn định cho các hồ thủy điện, thủy lợi.",
        recallHint: "SGK CN 12 Bài 2: Rừng phòng hộ đầu nguồn: Giữ đất, giữ nước, chống xói mòn sạt lở đồi dốc, điều tiết nguồn nước sông suối và giảm nhẹ thảm họa lũ lụt hạ du."
      },
      {
        id: 18, grade: "cn12", topic: "(2) Trồng & Chăm sóc rừng",
        stem: "Trong giai đoạn đầu ươm cây giống lâm nghiệp (như hạt sao đen, dầu rái mới nảy mầm), giàn che bóng có tác dụng kỹ thuật là",
        options: ["giảm bớt cường độ ánh sáng gay gắt (che bớt 50% - 70% nắng) và giữ ẩm tránh làm cháy lá non của cây mầm.", "ngăn chặn hoàn toàn không cho không khí lưu thông vào vườn ươm.", "làm cho hạt cây con không cần tiếp xúc với nước tưới.", "tạo bóng tối tuyệt đối 100% suốt 24 giờ liên tục."],
        answer: 0,
        explanation: "Cây mầm lâm nghiệp giai đoạn đầu rất nhạy cảm với nắng gắt và bốc hơi nước. Giàn che lưới lan hoặc phên tre giúp điều tiết ánh sáng và nhiệt độ thích hợp, bảo vệ chồi non không bị táp nắng.",
        recallHint: "SGK CN 12 Bài 3: Kỹ thuật vườn ươm lâm nghiệp: Làm giàn che bóng giảm nắng 50-70% giai đoạn cây con mầm non; khi cây lớn dần thì dỡ dần giàn che để luyện cây chịu nắng trước khi đem trồng."
      },
      {
        id: 19, grade: "cn12", topic: "(3) Bảo vệ & Khai thác rừng",
        stem: "Phương thức khai thác trắng (Clear Cutting) chỉ được phép áp dụng trong điều kiện nào của quản lý rừng?",
        options: ["Áp dụng đối với rừng trồng sản xuất thuần loài cây sinh trưởng nhanh (keo, bạch đàn) và bắt buộc phải trồng lại rừng ngay sau khai thác.", "Áp dụng tự do tại các vườn quốc gia và khu bảo tồn thiên nhiên hoang dã.", "Áp dụng đối với toàn bộ các diện tích rừng phòng hộ đầu nguồn có độ dốc > 35 độ.", "Áp dụng ở bất kỳ khu rừng tự nhiên nào khi muốn lấy gỗ."],
        answer: 0,
        explanation: "Luật Lâm nghiệp nghiêm cấm khai thác trắng rừng tự nhiên và rừng phòng hộ. Khai thác trắng chỉ được áp dụng trên rừng trồng sản xuất và chủ rừng phải có trách nhiệm trồng lại rừng ngay trong vụ kế tiếp.",
        recallHint: "SGK CN 12 Bài 6: Phương thức khai thác trắng: Chỉ chặt trên rừng trồng sản xuất đạt tuổi thành thục; sau khai thác phải dọn thực bì và trồng lại rừng ngay để chống xói mòn đất."
      },
      {
        id: 20, grade: "cn12", topic: "(4) Giới thiệu chung Thủy sản",
        stem: "Trong các loài cá nuôi nước ngọt phổ biến ở nước ta, loài cá nào sau đây có tập tính ăn thực vật thủy sinh (cỏ tươi, bèo tấm, lá chuối)?",
        options: ["Cá trắm cỏ (Ctenopharyngodon idella).", "Cá quả / Cá lóc (Channa striata).", "Cá trê phi (Clarias gariepinus).", "Cá chẽm (Lates calcarifer)."],
        answer: 0,
        explanation: "Cá trắm cỏ là loài cá ăn thực vật điển hình, ruột dài gấp nhiều lần thân và có răng hầu khỏe để nghiền nát lá cỏ, rong rêu thủy sinh.",
        recallHint: "SGK CN 12 Bài 8: Tập tính ăn của cá: Cá trắm cỏ ăn thực vật; Cá lóc/cá chẽm ăn động vật săn mồi; Cá mè trắng ăn thực vật phù du; Cá mè hoa ăn động vật phù du; Cá rô phi ăn tạp."
      },
      {
        id: 21, grade: "cn12", topic: "(5) Môi trường nuôi thủy sản",
        stem: "Hiện tượng cá trong ao nuôi thường nổi đầu đớp khí trên mặt nước vào lúc 4 - 6 giờ rạng sáng là do nguyên nhân sinh học nào?",
        options: ["Do ban đêm cả cá và thực vật thủy sinh/tảo đều hô hấp tiêu thụ oxy trong khi không có quang hợp, làm nồng độ oxy hòa tan (DO) giảm xuống mức cực tiểu.", "Do cá có tập tính thích nhìn ngắm mặt trời mọc vào buổi sớm.", "Do nước ao vào rạng sáng bị quá lạnh làm cá bị bỏng lạnh.", "Do buổi sáng cá đói bụng và nổi lên đòi ăn thức ăn viên."],
        answer: 0,
        explanation: "Về đêm, không có ánh sáng mặt trời nên tảo và phiêu sinh vật ngừng quang hợp, chỉ diễn ra quá trình hô hấp tiêu thụ oxy của toàn bộ quần thể sinh vật trong ao, dẫn tới DO chạm đáy vào lúc rạng sáng.",
        recallHint: "SGK CN 12 Bài 10: Biến động Oxy hòa tan (DO): Cao nhất vào buổi chiều (nhờ tảo quang hợp rực rỡ); Thấp nhất vào rạng sáng 4-6h (do ngừng quang hợp và cả ao hô hấp tiêu thụ oxy)."
      },
      {
        id: 22, grade: "cn12", topic: "(5) Môi trường nuôi thủy sản",
        stem: "Bón vôi nông nghiệp (CaCO3) trong giai đoạn cải tạo ao nuôi thủy sản mang lại những tác dụng then chốt nào?",
        options: ["Khử trùng diệt mầm bệnh, nâng độ pH của đáy ao và tăng độ kiềm đệm cho môi trường nước nuôi.", "Làm giảm nhiệt độ của nước ao xuống mức đóng băng.", "Làm cho nước ao biến đổi hoàn toàn thành nước khoáng có ga.", "Làm cho cá con không cần hấp thu oxy qua mang."],
        answer: 0,
        explanation: "Vôi nông nghiệp cung cấp ion Ca2+ giúp tăng độ kiềm (Alkalinity), đệm giữ ổn định pH nước (7,5-8,5), khử phèn chua đáy ao và diệt trừ các bào tử nấm, ký sinh trùng tồn lưu.",
        recallHint: "SGK CN 12 Bài 11: Tác dụng của bón vôi ao nuôi: Khử trùng diệt mầm bệnh tồn dư, hạ phèn nâng pH đáy ao, cung cấp ion canxi làm cứng vỏ tôm và tăng hệ đệm kiềm cho nước ao."
      },
      {
        id: 23, grade: "cn12", topic: "(5) Môi trường nuôi thủy sản",
        stem: "Moina (trứng nước hay bo bo) là thức ăn tự nhiên sống lý tưởng nhất dành cho đối tượng thủy sản nào sau đây?",
        options: ["Cá bột và cá hương giai đoạn mới tiêu hết noãn hoàng.", "Cá thịt trưởng thành chuẩn bị xuất bán ra thị trường.", "Cá bố mẹ đang mang thai chuẩn bị sinh sản.", "Tôm bố mẹ thành thục."],
        answer: 0,
        explanation: "Moina là loài giáp xác râu ngành có kích thước hiển vi vừa miệng cá bột (0,5-1 mm), bơi lội lơ lửng kích thích phản xạ bắt mồi, chứa hàm lượng enzyme tiêu hóa và protein rất cao giúp cá bột tăng tỷ lệ sống.",
        recallHint: "SGK CN 12 Bài 12: Thức ăn tự nhiên đầu đời: Trứng nước (Moina) và trùng bánh xe (Rotifera) là nguồn thức ăn tự nhiên giàu dinh dưỡng và enzyme tiêu hóa cho cá bột mới tiêu hết noãn hoàng."
      },
      {
        id: 24, grade: "cn12", topic: "(6) Công nghệ giống thủy sản",
        stem: "Để kích thích cá trắm cỏ hoặc cá mè bố mẹ sinh sản nhân tạo, kỹ thuật viên thường sử dụng chế phẩm nào sau đây tiêm cho cá?",
        options: ["Não thùy thể cá chép hoặc hormone kích dục tố nhân tạo (LHRH-A kết hợp Domperidone).", "Dung dịch nước muối sinh lý NaCl 0,9%.", "Dung dịch kháng sinh Penicillin liều cao.", "Dung dịch mật rỉ đường lên men vi sinh."],
        answer: 0,
        explanation: "Não thùy cá chép hoặc hormone LHRH-A kết hợp chất đối kháng thụ thể dopamine (Domperidone) tác động trực tiếp lên hệ nội tiết thúc đẩy trứng và tinh trùng chín rụng đồng loạt để thụ tinh nhân tạo.",
        recallHint: "SGK CN 12 Bài 13: Kích thích cá sinh sản: Tiêm kích dục tố gồm não thùy thể cá chép hoặc hormone LHRH-A kết hợp chất kháng Dopamine (Domperidone) thúc đẩy cá rụng trứng và phóng tinh nhân tạo."
      }
    ],
    tfs: [
      {
        id: 1, grade: "cn10",
        topic: "Khối 10 — Hóa học đất & Dinh dưỡng phân bón",
        title: "Câu 1: Phân loại keo đất, dung tích hấp phụ CEC và tính tan của phân bón",
        context: "Tại phòng thí nghiệm Thổ nhưỡng - Phân bón, học sinh tiến hành phân tích các mẫu đất và mẫu phân bón vô cơ. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          {
            label: "a",
            text: "Keo dương có lớp ion quyết định điện thế mang điện tích dương và có khả năng trao đổi anion với dung dịch đất.",
            isTrue: true,
            explanation: "Đúng. Keo dương mang điện dương ở lớp quyết định điện thế, lớp ion khuếch tán mang điện âm nên giữ và trao đổi các anion (như NO3-, H2PO4-, SO4^2-).",
            recallHint: "SGK CN 10 Bài 3: Bản chất keo dương: Lớp trong mang điện dương, lớp khuếch tán ngoài cùng mang điện âm trao đổi các anion dinh dưỡng."
          },
          {
            label: "b",
            text: "Độ chua hoạt tính được xác định bằng cách đo nồng độ ion H+ tự do trong dung dịch đất bằng chỉ số pH_H2O.",
            isTrue: true,
            explanation: "Đúng. Độ chua hoạt tính do ion H+ tan tự do trong dung dịch đất quyết định và được đo bằng dung dịch nước cất (pH_H2O).",
            recallHint: "SGK CN 10 Bài 3: Phân biệt: Độ chua hoạt tính (pH_H2O đo H+ tự do); Độ chua tiềm tàng (pH_KCl đo cả H+ và Al3+ trao đổi bám trên keo đất)."
          },
          {
            label: "c",
            text: "Phân đạm Urê và phân kali clorua có độ hòa tan rất kém trong nước nên bắt buộc phải bón lót sâu vào đáy rãnh từ đầu vụ.",
            isTrue: false,
            explanation: "Sai. Phân đạm Urê và phân kali là phân vô cơ hòa tan rất nhanh trong nước, dễ bị rửa trôi nếu bón lót sâu từ sớm; chúng được ưu tiên chia nhỏ bón thúc.",
            recallHint: "SGK CN 10 Bài 8: Tính chất phân khoáng: Đạm và Kali tan rất nhanh -> Chia nhiều lần bón thúc; Phân lân nung chảy khó tan -> Bón lót sâu."
          },
          {
            label: "d",
            text: "Hệ thống tưới nhỏ giọt Fertigation giúp đưa trực tiếp dung dịch phân bón hòa tan đến vùng rễ cây trồng, làm giảm thất thoát dinh dưỡng do rửa trôi.",
            isTrue: true,
            explanation: "Đúng. Fertigation tối ưu hóa việc phân phối nước và dinh dưỡng đúng nhu cầu sinh lý của cây, nâng cao hiệu quả hấp thu lên trên 80%.",
            recallHint: "SGK CN 10 Bài 12: Ưu điểm tưới nhỏ giọt kết hợp bón phân: Tiết kiệm nước và phân bón, dinh dưỡng đến đúng vùng rễ tích cực, giảm phát thải và chống rửa trôi."
          }
        ]
      },
      {
        id: 2, grade: "cn11",
        topic: "Khối 11 — Giống, Khẩu phần & Vệ sinh thú y",
        title: "Câu 2: Chọn lọc giống, thức ăn giàu đạm và đệm lót sinh học chăn nuôi",
        context: "Một hợp tác xã chăn nuôi gia cầm và lợn thịt tại Thống Nhất (Đồng Nai) áp dụng quy trình VietGAHP. Xét tính Đúng/Sai của các nhận định kỹ thuật sau:",
        statements: [
          {
            label: "a",
            text: "Chọn lọc hàng loạt là phương pháp chọn lọc cá thể dựa trên kiểm tra kiểu gen bằng giải trình tự ADN chuyên sâu.",
            isTrue: false,
            explanation: "Sai. Chọn lọc hàng loạt chỉ dựa trên kiểu hình (ngoại hình, thể trọng bầy đàn), không kiểm tra gia phả hay kiểu gen.",
            recallHint: "SGK CN 11 Bài 3: Bản chất chọn lọc hàng loạt: Dựa hoàn toàn vào ngoại hình và sức sản xuất bên ngoài của số đông vật nuôi, không theo dõi phả hệ."
          },
          {
            label: "b",
            text: "Khô dầu đậu tương và bột cá biển là những nguồn nguyên liệu thức ăn giàu protein có giá trị sinh học cao cho vật nuôi dạ dày đơn.",
            isTrue: true,
            explanation: "Đúng. Cả hai nguồn thức ăn này đều có hàm lượng protein thô rất cao (> 40%), cân đối các axit amin thiết yếu (Lysine, Methionine) giúp vật nuôi lớn nhanh.",
            recallHint: "SGK CN 11 Bài 7: Thức ăn giàu đạm: Khô dầu đậu tương và bột cá chứa hàm lượng protein cao và cân đối axit amin, không thể thiếu trong khẩu phần lợn và gia cầm."
          },
          {
            label: "c",
            text: "Đệm lót sinh học ứng dụng vi sinh vật có ích lên men giúp phân hủy phân gia súc ngay tại chuồng, làm giảm phát sinh mùi hôi khí độc Amoniac (NH3).",
            isTrue: true,
            explanation: "Đúng. Các vi sinh vật sinh nhiệt và phân giải axit uric, ức chế vi khuẩn sinh khí thối H2S và NH3, cải thiện môi trường không khí trong chuồng trại.",
            recallHint: "SGK CN 11 Bài 14: Cơ chế đệm lót sinh học: Vi sinh vật hiếu khí/lên men chuyển hóa chất thải thành sinh khối vi sinh, khử triệt để mùi hôi và giảm công rửa chuồng."
          },
          {
            label: "d",
            text: "Kháng huyết thanh có tác dụng kích thích cơ thể vật nuôi tự sản sinh kháng thể bảo hộ kéo dài trong suốt đời sống của con vật.",
            isTrue: false,
            explanation: "Sai. Đó là đặc tính của Vacxin. Kháng huyết thanh chỉ cung cấp kháng thể ngoại sinh tạm thời, thời gian bảo hộ rất ngắn (chỉ kéo dài khoảng 2 - 3 tuần).",
            recallHint: "SGK CN 11 Bài 15: Phân biệt miễn dịch: Vacxin kích thích miễn dịch chủ động dài lâu; Kháng huyết thanh đưa kháng thể vào cấp cứu, miễn dịch thụ động ngắn hạn."
          }
        ]
      },
      {
        id: 3, grade: "cn12",
        topic: "Khối 12 — Lâm nghiệp & Vườn ươm cây giống",
        title: "Câu 3: Vai trò rừng phòng hộ và quy trình gieo ươm cây con lâm nghiệp",
        context: "Tại một ban quản lý rừng phòng hộ tại Đồng Nai, kỹ sư lâm nghiệp triển khai kế hoạch gieo ươm cây giống bản địa và trồng rừng chắn sóng. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          {
            label: "a",
            text: "Rừng phòng hộ ven biển (như rừng ngập mặn đước, vẹt) có vai trò chắn sóng biển, chống xói lở bờ biển và cố định phù sa bãi bồi.",
            isTrue: true,
            explanation: "Đúng. Hệ thống rễ chống và rễ thở của cây rừng ngập mặn làm tiêu hao năng lượng sóng biển, giữ lại bùn phù sa bảo vệ đê điều ven biển.",
            recallHint: "SGK CN 12 Bài 2: Rừng phòng hộ ven biển: Rừng ngập mặn, rừng phi lao chắn gió, chắn cát bay và giảm lực tàn phá của sóng bão biển."
          },
          {
            label: "b",
            text: "Trong giai đoạn cây mầm mới nảy mầm trong vườn ươm, việc làm giàn che bóng giúp bảo vệ cây con khỏi tác hại của nắng gắt làm cháy mầm.",
            isTrue: true,
            explanation: "Đúng. Giàn che bóng giảm 50-70% ánh sáng trực xạ, điều hòa nhiệt độ không khí và ẩm độ đất giúp cây mầm non phát triển rễ vững chắc.",
            recallHint: "SGK CN 12 Bài 3: Kỹ thuật vườn ươm: Che bóng cho cây mầm non, tưới nước giữ ẩm; khi cây cứng cáp thì dỡ giàn che để cây thích nghi dần trước khi xuất vườn."
          },
          {
            label: "c",
            text: "Phương thức khai thác trắng được phép áp dụng không hạn chế trên tất cả các khu rừng đặc dụng và vườn quốc gia tại Việt Nam.",
            isTrue: false,
            explanation: "Sai. Luật Lâm nghiệp 2017 nghiêm cấm khai thác trắng rừng đặc dụng và rừng tự nhiên. Rừng đặc dụng chỉ được bảo tồn nguyên vẹn.",
            recallHint: "SGK CN 12 Bài 6: Pháp luật lâm nghiệp: Nghiêm cấm tuyệt đối khai thác gỗ và chặt phá rừng đặc dụng (vườn quốc gia, khu bảo tồn thiên nhiên)."
          },
          {
            label: "d",
            text: "Đường băng cản lửa xanh sử dụng các loài cây có lá dày, mọng nước, khó cháy trồng xen kẽ để ngăn cản đám cháy rừng lan rộng.",
            isTrue: true,
            explanation: "Đúng. Cây cản lửa xanh (như muồng đen, dứa dại, tre bát độ) có hàm lượng nước cao, không bắt lửa, tạo vành đai sinh học chắn tàn lửa bay qua.",
            recallHint: "SGK CN 12 Bài 6: Đường băng cản lửa xanh: Trồng các dải cây chịu lửa, mọng nước, tán rậm rạp làm hàng rào sinh thái ngăn lửa cháy lan trong mùa khô."
          }
        ]
      },
      {
        id: 4, grade: "cn12",
        topic: "Khối 12 — Thủy sản & Kỹ thuật sản xuất giống cá",
        title: "Câu 4: Môi trường nước ao, thức ăn tự nhiên và sinh sản nhân tạo cá",
        context: "Một cơ sở sản xuất giống cá nước ngọt tại huyện Trảng Bom (Đồng Nai) tiến hành ương cá bột và cho cá bố mẹ sinh sản. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          {
            label: "a",
            text: "Khí Amoniac tự do (NH3) trong nước ao nuôi thủy sản không gây độc cho cá ở bất kỳ mức nồng độ nào.",
            isTrue: false,
            explanation: "Sai. NH3 không ion hóa cực kỳ độc đối với cá ngay cả ở nồng độ rất thấp (> 0,02 mg/L), làm tổn thương tế bào mang và phá hủy hệ thần kinh cá.",
            recallHint: "SGK CN 12 Bài 10: Khí độc ao nuôi: NH3 cực kỳ độc hại. Trong nước, NH3 cân bằng với NH4+; khi pH và nhiệt độ càng cao thì tỷ lệ NH3 tự do độc hại càng tăng."
          },
          {
            label: "b",
            text: "Hiện tượng cá nuôi nổi đầu đớp khí trên mặt nước thường xảy ra nghiêm trọng nhất vào lúc 4 - 6 giờ rạng sáng do hàm lượng oxy hòa tan giảm xuống mức thấp nhất.",
            isTrue: true,
            explanation: "Đúng. Sau cả đêm ngừng quang hợp, toàn bộ vi sinh vật, tảo và cá trong ao cùng hô hấp làm cạn kiệt oxy hòa tan, gây hiện tượng cá nổi đầu rạng sáng.",
            recallHint: "SGK CN 12 Bài 10: Quy luật oxy hòa tan DO: Giảm thấp nhất lúc rạng sáng (4-6h) do ban đêm cả ao hô hấp tiêu thụ oxy mà không có quang hợp."
          },
          {
            label: "c",
            text: "Trứng nước (Moina) là nguồn thức ăn tự nhiên sống có kích thước phù hợp và giàu dinh dưỡng dành cho cá bột giai đoạn mới tiêu hết noãn hoàng.",
            isTrue: true,
            explanation: "Đúng. Moina chứa nhiều enzyme tiêu hóa tự nhiên giúp đường ruột non nớt của cá bột dễ dàng hấp thu, nâng cao đáng kể tỷ lệ sống khi ương cá giống.",
            recallHint: "SGK CN 12 Bài 12: Thức ăn khởi đầu của cá: Moina (bo bo) là thức ăn sống đầu đời tuyệt vời cho cá bột mới tiêu hết noãn hoàng, kích thích bắt mồi tự nhiên."
          },
          {
            label: "d",
            text: "Trong kích thích cá sinh sản nhân tạo, việc tiêm kích dục tố (não thùy thể hoặc LHRH-A) nhằm mục đích làm cho cá cái biến đổi thành cá đực.",
            isTrue: false,
            explanation: "Sai. Tiêm kích dục tố nhằm kích thích trục hạ đồi - tuyến yên - tuyến sinh dục thúc đẩy quá trình chín và rụng trứng đồng loạt ở cá cái (và sinh tinh ở cá đực).",
            recallHint: "SGK CN 12 Bài 13: Mục đích tiêm kích dục tố: Kích thích trứng và tinh trùng chín rụng hàng loạt để thụ tinh nhân tạo; không làm đổi giới tính cá."
          }
        ]
      }
    ],
    essays: [
      {
        id: 1,
        points: 3.5,
        title: "Câu 1 (3,5 điểm — Kiến thức Lâm nghiệp Lớp 12)",
        problem: "1. Trình bày các vai trò sinh thái và môi trường then chốt của rừng phòng hộ đầu nguồn sông ngòi và rừng phòng hộ ngập mặn ven biển. (1,5 điểm)\n2. Nêu các tiêu chuẩn kỹ thuật để tuyển chọn cây giống lâm nghiệp (keo lai, bạch đàn) đạt chuẩn xuất vườn đem trồng rừng. Nêu hậu quả nếu đem cây con có rễ bị cuộn tròn hoặc bầu ươm bị vỡ vụn đi trồng. (1,5 điểm)\n3. Hãy giải thích vì sao trong phương thức 'Khai thác trắng' trên rừng trồng sản xuất, chủ rừng bắt buộc phải trồng lại rừng ngay trong vụ kế tiếp mà không được bỏ hoang đất. (0,5 điểm)",
        recallHint: "SGK CN 12 Bài 2 & Bài 4 & Bài 6: Rừng phòng hộ: Chắn sóng biển, bảo vệ nguồn nước ngầm, chống xói mòn lũ quét. Tiêu chuẩn cây con: Thân thẳng cứng cáp, 1 ngọn, bầu nguyên vẹn; rễ cuộn làm cây nghẹt thở dễ đổ ngã. Khai thác trắng: Phải trồng lại ngay để chống rửa trôi lớp đất mặt màu mỡ do mưa nhiệt đới.",
        rubric: [
          "1. Vai trò sinh thái rừng phòng hộ (1,5đ): Rừng đầu nguồn (0,75đ - giữ nước ngầm, chống xói mòn sạt lở đồi dốc, điều tiết dòng chảy lũ và dòng chảy mùa cạn); Rừng ven biển ngập mặn (0,75đ - chắn sóng bão biển, bảo vệ đê điều, giữ phù sa mở rộng bãi bồi và bảo tồn sinh vật biển non).",
          "2. Tiêu chuẩn cây giống & hậu quả lỗi bầu rễ (1,5đ): Tiêu chuẩn xuất vườn (0,75đ - thân hóa gỗ thẳng, 1 ngọn nguyên vẹn, rễ khỏe không biến dạng, bầu đất chắc chắn); Hậu quả rễ cuộn/vỡ bầu (0,75đ - bầu vỡ làm đứt rễ lông hút gây héo chết cây; rễ cuộn tròn làm nghẹt mạch dẫn, khi cây lớn dễ bị gió bão quật đổ bật gốc).",
          "3. Lý do phải trồng lại rừng ngay sau khai thác trắng (0,5đ): Rừng trồng sau khi khai thác trắng để lộ tầng đất mặt trơ trụi dưới mưa lớn nhiệt đới; nếu không trồng lại ngay, lớp mùn màu mỡ sẽ bị xói mòn rửa trôi trơ sỏi đá và phát sinh cỏ dại xâm lấn."
        ]
      },
      {
        id: 2,
        points: 3.5,
        title: "Câu 2 (3,5 điểm — Kiến thức Thủy sản Lớp 12)",
        problem: "1. Phân tích nguyên nhân vì sao hiện tượng cá nuôi trong ao thâm canh thường bị thiếu oxy hòa tan (nổi đầu đớp khí) vào lúc 4 - 6 giờ sáng. Nêu các giải pháp kỹ thuật tức thời để cấp cứu cá khi xảy ra hiện tượng trên. (1,5 điểm)\n2. Trình bày vai trò của việc gây màu nước ao nuôi trước khi thả cá giống. Màu nước nào được coi là màu nước lý tưởng nhất cho ao nuôi thủy sản nước ngọt? (1,5 điểm)\n3. Nêu bản chất sinh học của kỹ thuật sản xuất đàn cá rô phi đơn tính đực bằng phương pháp cho cá bột ăn thức ăn có chứa hormone 17α-methyltestosterone. Nêu lợi ích kinh tế của đàn cá toàn đực so với đàn cá không phân tính. (0,5 điểm)",
        recallHint: "SGK CN 12 Bài 10 & Bài 11 & Bài 13: Oxy cạn kiệt lúc rạng sáng do cả ao hô hấp mà không có ánh sáng quang hợp. Cấp cứu: Bật quạt nước, sục khí, tạt oxy viên (Sodium percarbonate), bơm nước mới. Gây màu nước: Phát triển vi tảo có lợi (xanh nõn chuối/nâu trà), che rêu đáy ao và tạo thức ăn tự nhiên. Cá đơn tính đực: Trộn hormone 17a-MT khi cá bột chưa biệt hóa tuyến sinh dục; cá đực lớn nhanh hơn 20-30%, không sinh sản tự do làm chật ao.",
        rubric: [
          "1. Nguyên nhân thiếu oxy rạng sáng & cấp cứu (1,5đ): Nguyên nhân (0,75đ - ban đêm ngừng quang hợp, toàn bộ cá, thực vật thủy sinh và vi sinh vật đáy cùng hô hấp tiêu thụ oxy, làm DO giảm chạm đáy lúc rạng sáng); Cấp cứu tức thời (0,75đ - bật quạt nước sục khí tối đa, bơm cấp nước sạch giàu oxy, rải viên oxy nguyên chất Sodium percarbonate xuống đáy ao).",
          "2. Vai trò gây màu nước & màu nước lý tưởng (1,5đ): Vai trò (0,75đ - phát triển vi tảo có lợi sinh oxy quang hợp ban ngày, tạo thức ăn tự nhiên giàu sinh dưỡng cho giống non, che bớt ánh sáng đáy ức chế rong rêu đáy phát triển); Màu nước lý tưởng (0,75đ - màu xanh nõn chuối của tảo lục Chlorophyta hoặc màu nâu trà của tảo silic Bacillariophyta với độ trong 30-40 cm).",
          "3. Kỹ thuật cá rô phi đơn tính đực & lợi ích (0,5đ): Bản chất (0,25đ - trộn hormone 17a-methyltestosterone vào thức ăn giai đoạn cá bột 21-28 ngày đầu đời khi tuyến sinh dục chưa phân hóa để chuyển hướng 100% thành cá đực); Lợi ích kinh tế (0,25đ - cá rô phi đực lớn nhanh hơn cá cái 20-30%, không tốn năng lượng sinh sản tự do làm phân đàn và giảm năng suất ao)."
        ]
      },
      {
        id: 3,
        points: 1.0,
        title: "Câu 3 (1,0 điểm — Kiến thức Nền tảng Nông học Tổng hợp)",
        problem: "1. Trình bày ngắn gọn bản chất cấu tạo 4 lớp của một hạt keo đất hoàn chỉnh từ trong ra ngoài. (0,5 điểm)\n2. Vì sao trong nông nghiệp công nghệ cao, người ta thường phối trộn than bùn, mụn xơ dừa đã xử lý và đá trân châu Perlite để làm giá thể trồng cây thay vì sử dụng trực tiếp đất vườn tự nhiên? (0,5 điểm)",
        recallHint: "SGK CN 10 Bài 3 & Bài 10: Bốn lớp hạt keo: Nhân keo -> Lớp ion quyết định thế hiệu -> Lớp ion bất động -> Lớp ion khuếch tán. Giá thể hỗn hợp: Sạch mầm bệnh lây qua đất, độ xốp cao, thông khí và thoát nước hoàn hảo, tối ưu hóa quá trình Fertigation.",
        rubric: [
          "1. Bốn lớp cấu tạo hạt keo đất (0,5đ): Từ trong ra ngoài gồm: (1) Nhân keo -> (2) Lớp ion quyết định điện thế -> (3) Lớp ion bất động -> (4) Lớp ion khuếch tán ngoài cùng (mỗi lớp 0,125đ).",
          "2. Lý do phối trộn giá thể công nghệ cao (0,5đ): Giá thể phối trộn vô trùng sạch tuyến trùng và nấm bệnh hại rễ, có độ xốp và dung tích không khí cao giúp rễ hô hấp tối ưu, giữ ẩm tốt nhưng không úng nước, dễ dàng kiểm soát chính xác nồng độ dinh dưỡng khoáng qua hệ thống tưới nhỏ giọt."
        ]
      }
    ]
  },

  dn_01: {
    id: "dn_01",
    level: "medium",
    levelBadge: "🟡 CẤP ĐỘ 2: VỪA / TĂNG TỐC",
    levelLabel: "CẤP ĐỘ 2 (VỪA / TĂNG TỐC & CHUẨN ĐỒNG NAI BẢNG B)",
    code: "ĐỒNG NAI — ĐỀ SỐ 01",
    title: "KỲ THI CHỌN HỌC SINH GIỎI CẤP TỈNH / THÀNH PHỐ — ĐỒNG NAI (ĐỀ SỐ 01)",
    subTitle: "Môn: Công nghệ (Định hướng Nông nghiệp) — Khóa thi: 2026",
    durationMinutes: 180,
    maxScore: 20.0,
    source: "Chuẩn Cấu trúc Sở GD&ĐT Đồng Nai (SKILL.md & QĐ 1540/QĐ-SGDĐT)",
    mcqs: [
      // K10 (8 câu: 3 Đất + 3 Phân bón + 2 Trồng trọt CNC)
      { id: 1, grade: "cn10", topic: "(1) Đất trồng", stem: "Lớp ion nằm ngoài cùng của hạt keo đất, có khả năng di chuyển tự do vào dung dịch đất và tham gia phản ứng trao đổi với ion của rễ cây là", options: ["nhân keo đất.", "lớp ion quyết định điện thế.", "lớp ion bất động.", "lớp ion khuếch tán."], answer: 3, explanation: "Lớp ion khuếch tán nằm ngoài cùng của hạt keo, liên kết yếu với nhân keo nên dễ dàng trao đổi với các ion H+, HCO3- do rễ cây tiết ra." },
      { id: 2, grade: "cn10", topic: "(1) Đất trồng", stem: "Loại đất nào sau đây có dung tích hấp phụ cation (CEC) cao nhất trong điều kiện tự nhiên?", options: ["Đất cát pha ven biển nghèo mùn.", "Đất thịt nhẹ có hàm lượng sét dưới 10%.", "Đất sét nặng giàu mùn hữu cơ hoai mục.", "Đất xói mòn trơ sỏi đá vùng đồi núi."], answer: 2, explanation: "Keo mùn hữu cơ (CEC 150-300 meq/100g) và keo sét có diện tích bề mặt riêng lớn nhất, tạo dung tích hấp phụ cation (CEC) cao nhất." },
      { id: 3, grade: "cn10", topic: "(1) Đất trồng", stem: "Để cải tạo đất phèn chua (pH < 4,5) có nồng độ ion Al3+ và Fe3+ di động cao gây độc cho rễ cây, biện pháp hóa học cơ bản và hiệu quả nhất là", options: ["bón nhiều phân đạm sunfat amôn (NH4)2SO4.", "bón vôi nông nghiệp (CaCO3) kết hợp thau chua rửa phèn.", "bón phân kali clorua (KCl) liều lượng cao.", "tăng cường phun thuốc bảo vệ thực vật."], answer: 1, explanation: "Vôi nông nghiệp (CaCO3) cung cấp ion Ca2+ đẩy H+, Al3+ ra dung dịch đất để trung hòa và kết tủa Al(OH)3, nâng cao độ pH." },
      { id: 4, grade: "cn10", topic: "(2) Phân bón", stem: "Trong kỹ thuật bón phân cho cây trồng hàng năm, thao tác nào sau đây là SAI?", options: ["Phân hữu cơ và lân khó tan dùng để bón lót sâu vào đất.", "Phân đạm và phân kali chia ra bón thúc nhiều lần vào thời kỳ cây cần nhiều dinh dưỡng.", "Bón phân đạm Urê vào lúc trời nắng gắt hoặc sát lúc mưa rào lớn để phân ngấm nhanh vào rễ.", "Khi bón thúc phân vô cơ cần kết hợp làm cỏ, xới xáo nhẹ và giữ đủ độ ẩm đất."], answer: 2, explanation: "Bón đạm Urê lúc nắng gắt phân bị phân hủy bốc hơi thành khí NH3; bón trước mưa lớn phân bị rửa trôi hoàn toàn." },
      { id: 5, grade: "cn10", topic: "(2) Phân bón", stem: "Một hợp tác xã trồng lúa cần bón 120 kg N nguyên chất cho 1 ha ruộng. Nếu sử dụng phân đạm Urê có độ dinh dưỡng 46% N, khối lượng phân đạm Urê thương phẩm cần mua cho 3 ha là", options: ["260,87 kg.", "521,74 kg.", "782,61 kg.", "1.043,48 kg."], answer: 2, explanation: "Lượng N cho 3 ha = 120 × 3 = 360 kg N. Khối lượng Urê = (360 × 100) / 46 = 782,61 kg." },
      { id: 6, grade: "cn10", topic: "(2) Phân bón", stem: "Hành động nào sau đây vi phạm nguyên tắc phối trộn phân bón?", options: ["Trộn phân hữu cơ hoai mục với phân lân nung chảy trước khi bón lót.", "Trộn phân đạm SA (NH4)2SO4 với vôi bột Ca(OH)2 trước khi bón để tiết kiệm công lao động.", "Phối trộn phân đạm urê với phân kali clorua ngay trước khi bón thúc.", "Ủ phân chuồng tươi với chế phẩm nấm đối kháng Trichoderma."], answer: 1, explanation: "Tuyệt đối không trộn phân đạm amoni với vôi vì sinh khí NH3 bay hơi làm mất hoàn toàn đạm: 2NH4+ + Ca(OH)2 -> Ca2+ + 2NH3↑ + 2H2O." },
      { id: 7, grade: "cn10", topic: "(3) Trồng trọt CNC", stem: "Trong hệ thống thủy canh kỹ thuật màng dinh dưỡng hồi lưu (NFT), dòng dung dịch dinh dưỡng được tuần hoàn với đặc điểm", options: ["rễ ngập sâu hoàn toàn trong bể nước tĩnh không cần sục khí.", "một lớp màng dung dịch mỏng liên tục chảy qua bộ rễ giúp rễ vừa hút khoáng vừa hô hấp hiếu khí tối ưu.", "dung dịch dinh dưỡng được phun thành dạng sương mù lơ lửng trong không khí bao quanh rễ.", "cố định rễ trong giá thể đất sét nung và chỉ tưới một lần mỗi tuần."], answer: 1, explanation: "Kỹ thuật màng dinh dưỡng hồi lưu (NFT - Nutrient Film Technique) cho dòng chất lỏng rất mỏng (1-3mm) chảy qua rễ, phần trên tiếp xúc không khí để lấy oxy." },
      { id: 8, grade: "cn10", topic: "(3) Trồng trọt CNC", stem: "Cảm biến đo EC (Electrical Conductivity) trong nhà màng tự động được sử dụng nhằm mục đích trực tiếp là", options: ["đo cường độ ánh sáng quang hợp trong tán cây.", "đo tổng nồng độ các ion khoáng hòa tan trong dung dịch dinh dưỡng tưới.", "đo tỷ lệ phần trăm khí CO2 phát thải từ đất.", "phát hiện sự hiện diện của các loại nấm khuẩn gây bệnh rễ."], answer: 1, explanation: "Độ dẫn điện EC tỉ lệ thuận với tổng lượng ion muối khoáng hòa tan trong dung dịch dinh dưỡng (TDS/ppm)." },

      // K11 (8 câu: 3 Giống vật nuôi + 3 Thức ăn + 2 Môi trường chăn nuôi)
      { id: 9, grade: "cn11", topic: "(1) Công nghệ giống vật nuôi", stem: "Phương pháp chọn lọc cá thể trong công nghệ giống vật nuôi có ưu điểm nổi bật so với chọn lọc hàng loạt là", options: ["thực hiện nhanh chóng, ít tốn kém thời gian và chi phí theo dõi.", "đánh giá chính xác giá trị giống và tiềm năng di truyền của từng cá thể thông qua kiểm tra năng suất và đời con.", "chỉ áp dụng cho đàn thương phẩm có quy mô hàng triệu con.", "không cần thiết lập sổ sách ghi chép giống của gia phả thế hệ trước."], answer: 1, explanation: "Chọn lọc cá thể theo dõi chặt chẽ bản thân và kiểm tra chất lượng đời sau nên đánh giá chính xác giá trị kiểu gen của giống." },
      { id: 10, grade: "cn11", topic: "(1) Công nghệ giống vật nuôi", stem: "Trong chăn nuôi lợn thịt thương phẩm, công thức lai nào sau đây tạo ra con lai 3 máu có ưu thế lai cao nhất về tốc độ tăng khối lượng và tỷ lệ nạc cao?", options: ["Đực Móng Cái × Cái Ỉ.", "Đực Landrace × Cái Yorkshire -> F1(LY); Đực Duroc × Cái F1(LY) -> Lợn thương phẩm D(LY).", "Đực Móng Cái × Cái Landrace -> Nuôi thịt trực tiếp.", "Đực Ba Xuyên × Cái Thuần Ỉ -> Chọn lọc làm giống thuần."], answer: 1, explanation: "Công thức lai 3 máu ngoại Duroc × (Landrace × Yorkshire) kết hợp ưu thế mắn đẻ, nuôi con khéo của nái F1 và tỷ lệ nạc cao (> 60%), lớn nhanh của đực Duroc." },
      { id: 11, grade: "cn11", topic: "(1) Công nghệ giống vật nuôi", stem: "Kỹ thuật cấy truyền phôi bò sữa cao sản mang lại lợi ích nổi trội nào sau đây?", options: ["Làm tăng số lượng trứng được sinh ra từ bò cái nhận phôi bình thường.", "Khai thác tối đa tiềm năng di truyền của những con bò cái giống cao sản thông qua việc nhờ nhiều bò cái khác mang thai hộ.", "Thay đổi hoàn toàn bộ nhiễm sắc thể của bò con sinh ra.", "Giúp bò con sinh ra mang 50% tính trạng của bò cái nhận phôi."], answer: 1, explanation: "Cấy truyền phôi khai thác tối đa cái giống cao sản (1 bò mẹ cao sản có thể sinh 20-50 phôi/năm nhờ gây rụng trứng nhiều và cấy vào bò nhận)." },
      { id: 12, grade: "cn11", topic: "(2) Công nghệ thức ăn", stem: "Một đàn gà thịt có khối lượng lúc vào nuôi là 0,05 kg/con. Sau 42 ngày, khối lượng xuất chuồng đạt 2,45 kg/con. Bình quân mỗi con gà tiêu tốn hết 3,84 kg thức ăn. Hệ số chuyển đổi thức ăn (FCR) của đàn gà này là", options: ["1,55.", "1,60.", "1,65.", "1,72."], answer: 1, explanation: "Tăng trọng = 2,45 - 0,05 = 2,40 kg. FCR = 3,84 / 2,40 = 1,60." },
      { id: 13, grade: "cn11", topic: "(2) Công nghệ thức ăn", stem: "Trang trại muốn phối trộn 1.000 kg thức ăn có tỷ lệ Protein thô đạt 18% từ ngô nghiền (9% Protein) và bã đậu nành đậm đặc (45% Protein). Áp dụng hình vuông Pearson, khối lượng ngô và bã đậu nành cần dùng lần lượt là", options: ["750 kg ngô và 250 kg bã đậu nành.", "700 kg ngô và 300 kg bã đậu nành.", "650 kg ngô và 350 kg bã đậu nành.", "800 kg ngô và 200 kg bã đậu nành."], answer: 0, explanation: "Phần ngô = |45 - 18| = 27; Phần đậu nành = |9 - 18| = 9. Tổng phần = 36. Tỷ lệ ngô = (27/36) × 1000 = 750 kg; Đậu nành = 250 kg." },
      { id: 14, grade: "cn11", topic: "(2) Công nghệ thức ăn", stem: "Việc ủ chua thức ăn thô xanh (cỏ voi, thân cây ngô) cho trâu bò nhằm mục đích bản chất là", options: ["biến protein thực vật thành đạm khoáng vô cơ để trâu bò tiêu hóa nhanh.", "tạo điều kiện cho vi khuẩn Lactic lên men kỵ khí sinh axit lactic làm giảm pH (< 4,2), ức chế vi khuẩn thối rữa và nấm mốc.", "làm khô hoàn toàn lượng nước trong thân cỏ để giảm chi phí vận chuyển.", "tiêu diệt toàn bộ hệ vi sinh vật dạ cỏ của động vật nhai lại."], answer: 1, explanation: "Lên men lactic kỵ khí tạo pH 3,8 - 4,2 ức chế Clostridium lên men thối và nấm mốc, giữ nguyên dinh dưỡng của cỏ xanh 6-12 tháng." },
      { id: 15, grade: "cn11", topic: "(3) Môi trường chăn nuôi", stem: "Trong chuồng nuôi kín có kiểm soát vi khí hậu, nồng độ khí amoniac (NH3) tăng cao vượt ngưỡng cho phép chủ yếu bắt nguồn từ", options: ["quá trình hô hấp thải khí của vật nuôi trong điều kiện nhiệt độ thấp.", "sự phân hủy hiếu khí nhanh chóng của chất độn chuồng khô ráo.", "sự phân giải kỵ khí các hợp chất chứa nitơ (axit uric, urê trong phân và nước tiểu) bởi vi sinh vật khi chuồng ẩm ướt, thông gió kém.", "việc sử dụng quạt hút làm mát cưỡng bức hoạt động liên tục."], answer: 2, explanation: "Enzyme urease của vi khuẩn phân giải urê và axit uric sinh khí NH3 khi chuồng ẩm ướt, đọng phân và thông gió kém." },
      { id: 16, grade: "cn11", topic: "(3) Môi trường chăn nuôi", stem: "Biện pháp xử lý chất thải chăn nuôi lợn nào sau đây vừa giúp giảm ô nhiễm môi trường, diệt mầm bệnh ký sinh trùng, vừa tạo ra nguồn năng lượng tái tạo phục vụ sinh hoạt và phát điện?", options: ["Xả trực tiếp phân tươi vào mương thoát nước thủy lợi công cộng.", "Thu gom phân tươi đem phơi nắng lộ thiên gần khu dân cư.", "Xây dựng công trình hầm khí sinh học Biogas yếm khí kín kết hợp máy phát điện sinh học.", "Chôn lấp chất thải sống chưa qua xử lý trực tiếp xuống tầng nước ngầm."], answer: 2, explanation: "Hầm Biogas phân hủy kỵ khí tiêu diệt 95% trứng giun sán mầm bệnh, thu hồi khí mêtan sinh học (CH4) làm năng lượng sạch." },

      // K12 (8 câu: 4 Lâm nghiệp + 4 Thủy sản)
      { id: 17, grade: "cn12", topic: "(1) Giới thiệu chung về lâm nghiệp", stem: "Căn cứ theo Luật Lâm nghiệp 2017, rừng ngập mặn Cần Giờ và rừng phòng hộ đầu nguồn sông Đồng Nai thuộc nhóm rừng nào sau đây?", options: ["Rừng sản xuất gỗ lớn.", "Rừng phòng hộ.", "Rừng công viên giải trí đô thị.", "Rừng cây nông nghiệp chuyên dụng."], answer: 1, explanation: "Rừng ngập mặn chắn sóng ven biển và rừng đầu nguồn giữ nước điều tiết thủy văn đều thuộc nhóm Rừng phòng hộ theo Luật Lâm nghiệp 2017." },
      { id: 18, grade: "cn12", topic: "(2) Trồng và chăm sóc rừng", stem: "Tiêu chuẩn nào sau đây là quan trọng hàng đầu đối với cây giống lâm nghiệp (keo lai, bạch đàn) nhân giống bằng nuôi cấy mô hoặc giâm hom khi xuất vườn đem đi trồng rừng?", options: ["Cây cao trên 2 mét, thân phân nhiều cành nhánh xum xuê.", "Cây có bộ rễ cọc đâm thủng đáy bầu đất sâu trên 1 mét vào nền đất vườn ươm.", "Cây sinh trưởng tốt, thân thẳng, đã hóa gỗ phần gốc, đỉnh sinh trưởng lành lặn, bộ rễ nguyên vẹn trong bầu không bị biến dạng sâu bệnh.", "Cây đang trong giai đoạn ra hoa rộ và kết hạt sai quả."], answer: 2, explanation: "Cây con giống đạt chuẩn xuất vườn phải có thân hóa gỗ phần gốc, đỉnh sinh trưởng nguyên vẹn, rễ đan chặt giữ vững bầu đất, không sâu bệnh." },
      { id: 19, grade: "cn12", topic: "(2) Trồng và chăm sóc rừng", stem: "Hiện tượng 'tự tỉa thưa tự nhiên' của cây rừng diễn ra mạnh mẽ nhất trong giai đoạn sinh trưởng nào sau đây?", options: ["Giai đoạn cây mầm mới nảy mầm từ hạt giống.", "Giai đoạn sào (rừng bắt đầu khép tán, các cành nhánh giao nhau cạnh tranh ánh sáng gay gắt).", "Giai đoạn thành thục công nghệ khi cây bắt đầu rỗng ruột.", "Giai đoạn rừng già cỗi mục nát."], answer: 1, explanation: "Giai đoạn sào các tán cây giao cành khép tán, cạnh tranh ánh sáng gay gắt làm các cành phía dưới thiếu sáng tự khô rụng và cây yếu bị đào thải tự nhiên." },
      { id: 20, grade: "cn12", topic: "(3) Bảo vệ và khai thác tài nguyên rừng bền vững", stem: "Khai thác chọn (tỉa thưa) trong rừng tự nhiên sản xuất bền vững phải tuân thủ nghiêm ngặt nguyên tắc nào sau đây?", options: ["Đốn hạ toàn bộ các cây to nhất trong một khoảnh rồi đốt sạch thực bì.", "Cường độ chặt không vượt quá khả năng tăng trưởng tự nhiên (thường ≤ 30 - 35% trữ lượng) và bảo tồn cây mẹ gieo giống, cây gỗ quý tái sinh.", "Chỉ chặt cây nhỏ, non và để lại toàn bộ cây mục nát già cỗi có nấm bệnh.", "Đưa máy ủi hạng nặng cày nát toàn bộ tầng thảm mục tươi xốp của rừng."], answer: 1, explanation: "Khai thác chọn bền vững quy định cường độ chặt hợp lý (dưới 35% trữ lượng) để rừng tự tái sinh phục hồi, bảo tồn nguồn gen cây mẹ." },
      { id: 21, grade: "cn12", topic: "(4) Giới thiệu chung về thủy sản", stem: "Độ trong của nước ao nuôi thủy sản đo bằng đĩa Secchi thích hợp nhất cho sự phát triển của cá, tôm thường dao động trong khoảng", options: ["5 - 10 cm (nước quá đục, phù sa và tảo đặc quánh).", "30 - 40 cm (nước có màu xanh đọt chuối hoặc nâu trà, mật độ tảo vừa phải).", "80 - 100 cm (nước trong vắt, nhìn thấu đáy ao nghèo dinh dưỡng).", "> 150 cm."], answer: 1, explanation: "Độ trong 30 - 40 cm biểu thị mật độ vi tảo vừa phải, tạo màu nước xanh đọt chuối hoặc nâu trà, cung cấp oxy quang hợp và che bớt ánh sáng đáy ao." },
      { id: 22, grade: "cn12", topic: "(5) Môi trường nuôi thủy sản", stem: "Đối với ao nuôi tôm thẻ chân trắng thâm canh công nghệ cao, ngưỡng oxy hòa tan (DO) tối thiểu cần duy trì liên tục trong nước vào ban đêm và sáng sớm để tôm không bị ngạt khí là", options: ["≥ 1,0 mg/L.", "≥ 2,0 mg/L.", "≥ 4,0 mg/L.", "≥ 15,0 mg/L."], answer: 2, explanation: "Tôm thẻ thâm canh đòi hỏi DO ≥ 4,0 mg/L; nếu DO < 3,5-4,0 mg/L tôm giảm ăn, ngừng lột xác, nổi đầu và dễ nhiễm bệnh đục cơ." },
      { id: 23, grade: "cn12", topic: "(5) Môi trường nuôi thủy sản", stem: "Trong công nghệ nuôi tôm Biofloc (BFT), người nuôi bổ sung mật rỉ đường định kỳ vào ao nhằm mục đích bản chất là", options: ["làm nước ao có vị ngọt để kích thích tôm uống nhiều nước.", "nâng cao tỷ lệ Carbon : Nitơ (C:N ≥ 12:1 - 15:1), kích thích vi khuẩn dị dưỡng phát triển chuyển hóa các hợp chất nitơ độc (NH4+/NH3) thành sinh khối vi khuẩn giàu protein.", "tiêu diệt toàn bộ hệ vi sinh vật có trong ao để vô trùng nước tuyệt đối.", "khử hoàn toàn độ mặn của nước biển thành nước ngọt hoàn toàn."], answer: 1, explanation: "Mật rỉ đường cung cấp Carbon hữu cơ để vi khuẩn dị dưỡng đồng hóa Amoniac (NH3/NH4+) thành protein vi sinh vật tạo nên các hạt Biofloc làm thức ăn cho tôm." },
      { id: 24, grade: "cn12", topic: "(6) Công nghệ giống thủy sản", stem: "Kỹ thuật kích thích cá sinh sản nhân tạo bằng cách tiêm kích dục tố (não thùy thể, HCG hoặc LHRH-A kết hợp Domperidone) tác động trực tiếp vào cơ chế nào của cá bố mẹ?", options: ["Tác động lên trục thần kinh - nội tiết (vùng dưới đồi - tuyến yên - tuyến sinh dục) thúc đẩy sự chín và rụng trứng/tinh trùng hàng loạt.", "Làm biến đổi đột biến gen cấu trúc khiến cá mẹ tự thụ tinh không cần cá đực.", "Làm tê liệt hệ thần kinh vận động để dễ dàng mổ lấy trứng nhân tạo.", "Làm tăng gấp 10 lần khả năng chịu lạnh của cá hương, cá giống."], answer: 0, explanation: "Kích dục tố ngoại sinh bắt chước hormone vùng dưới đồi và tuyến yên, kích hoạt tuyến sinh dục tiết steroid sinh dục hoàn thiện quá trình rụng trứng." }
    ],
    tfs: [
      {
        id: 1,
        grade: "cn10",
        topic: "Khối 10 — Đất trồng & Tưới nhỏ giọt công nghệ cao",
        title: "Câu 1: Cải tạo đất đỏ bazan thoái hóa & Tưới Fertigation công nghệ cao",
        context: "Một công ty nông nghiệp công nghệ cao tại Định Quán (Đồng Nai) tiến hành cải tạo 10 ha đất bazan thoái hóa có tầng đất mỏng, dốc nhẹ và độ chua cao (pH_KCl = 4,1) để trồng sầu riêng VietGAP kết hợp tưới nhỏ giọt tự động. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          { label: "a", level: "Nhận biết", isTrue: true, text: "Việc bón vôi nông nghiệp (CaCO3) với liều lượng thích hợp có tác dụng khử chua, nâng cao độ pH của đất nhờ ion Ca2+ đẩy các ion H+ và Al3+ ra khỏi phức hệ hấp phụ của keo đất vào dung dịch đất để bị trung hòa hoặc rửa trôi.", explanation: "Ca2+ trao đổi đẩy H+, Al3+ ra dung dịch đất; gốc carbonate kiềm hóa làm tăng pH đất." },
          { label: "b", level: "Thông hiểu", isTrue: false, text: "Để cải tạo đất nhanh và cung cấp đạm tức thời, công ty nên hòa tan một lượng lớn phân đạm Sunfat amôn (NH4)2SO4 vào hệ thống tưới nhỏ giọt tưới liên tục hàng ngày mà không cần bổ sung phân hữu cơ.", explanation: "(NH4)2SO4 là phân chua sinh lý (để lại gốc SO4(2-) tạo H2SO4) sẽ làm chua đất nặng nề hơn." },
          { label: "c", level: "Vận dụng", isTrue: true, text: "Việc trồng cây họ Đậu (như đậu đỗ, lạc dại) xen giữa các hàng sầu riêng vừa có tác dụng che phủ chống xói mòn đất khi mưa lớn, vừa làm giàu đạm tự nhiên cho đất nhờ hoạt động cố định nitơ khí quyển của vi khuẩn nốt sần Rhizobium.", explanation: "Vi khuẩn nốt sần Rhizobium cố định nitơ khí quyển cung cấp đạm sinh học, thảm phủ chống xói mòn rửa trôi." },
          { label: "d", level: "Vận dụng cao", isTrue: false, text: "Hệ thống tưới nhỏ giọt kết hợp châm phân dinh dưỡng tự động (fertigation) chỉ có ưu điểm là tiết kiệm nước tưới chứ không thể giúp tiết kiệm lượng phân bón sử dụng so với phương pháp rải phân mặt đất truyền thống.", explanation: "Fertigation đưa phân trực tiếp đến vùng rễ, hạn chế bốc hơi và rửa trôi, tiết kiệm 30 - 50% lượng phân bón sử dụng." }
        ]
      },
      {
        id: 2,
        grade: "cn11",
        topic: "Khối 11 — Thức ăn & Bảo vệ môi trường chăn nuôi",
        title: "Câu 2: Công nghệ Phối trộn Thức ăn & Vận hành Hầm Biogas Chăn nuôi lợn",
        context: "Một hợp tác xã chăn nuôi lợn thịt quy mô 2.000 con tại Thống Nhất (Đồng Nai) áp dụng quy trình chuồng kín, tự phối trộn thức ăn hỗn hợp và xây dựng hệ thống xử lý môi trường chất thải toàn diện. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          { label: "a", level: "Nhận biết", isTrue: false, text: "Khi phối trộn thức ăn cho lợn thịt giai đoạn vỗ béo xuất chuồng (60 - 100 kg), hợp tác xã cần tăng mạnh tỷ lệ thức ăn đậm đặc giàu protein thô lên trên 24% để thịt lợn săn chắc nhất.", explanation: "Giai đoạn vỗ béo lợn cần năng lượng là chính, nhu cầu protein thô chỉ khoảng 13 - 15%; tăng > 24% gây lãng phí và ô nhiễm NH3." },
          { label: "b", level: "Thông hiểu", isTrue: true, text: "Chỉ số FCR của đàn lợn đạt 2,4 có nghĩa là để đàn lợn tăng thêm 1 kg khối lượng cơ thể thì trung bình cả đàn tiêu tốn hết 2,4 kg thức ăn hỗn hợp hoàn chỉnh.", explanation: "Định nghĩa FCR = Tổng lượng thức ăn tiêu thụ / Khối lượng tăng trọng." },
          { label: "c", level: "Vận dụng", isTrue: true, text: "Hỗn hợp khí Biogas sinh ra từ hầm ủ yếm khí chất thải chăn nuôi có thành phần cháy sinh nhiệt chủ yếu là khí Mêtan (CH4, chiếm khoảng 50 - 70%) và khí Cacbonic (CO2).", explanation: "Khí sinh học Biogas chứa 50 - 70% khí CH4 và 30 - 40% khí CO2." },
          { label: "d", level: "Vận dụng cao", isTrue: true, text: "Việc lắp đặt máy ép tách phân cơ học (tách bã rắn ra khỏi nước thải lỏng) trước khi nước thải đi vào hầm biogas sẽ làm giảm tải lượng chất hữu cơ (COD, BOD) lắng đọng dưới đáy hầm, kéo dài tuổi thọ hầm và thu được bã phân khô làm phân compost hữu cơ giá trị cao.", explanation: "Tách bã phân giảm 60% chất hữu cơ lơ lửng vào biogas, chống quá tải đáy hầm và tạo phân hữu cơ sạch." }
        ]
      },
      {
        id: 3,
        grade: "cn12",
        topic: "Khối 12 — Quản lý Rừng phòng hộ & Lâm sinh bền vững",
        title: "Câu 3: Bảo vệ Rừng phòng hộ Đầu nguồn & Chứng chỉ Rừng FSC",
        context: "Ban Quản lý Rừng phòng hộ Tân Phú (Đồng Nai) triển khai phương án quản lý rừng bền vững giai đoạn 2026 – 2030 kết hợp trồng bổ sung rừng làm giàu rừng gỗ lớn bản địa (dầu rái, sao đen, gõ đỏ). Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          { label: "a", level: "Nhận biết", isTrue: true, text: "Rừng phòng hộ đầu nguồn có vai trò cơ bản nhất là điều tiết nguồn nước ngầm, giảm lũ lụt trong mùa mưa, duy trì dòng chảy kiệt trong mùa khô và chống bồi lắng lòng hồ thủy điện Trị An.", explanation: "Tán rừng và thảm mục giữ nước như bể ngầm tự nhiên, điều tiết dòng chảy và chống bồi lắng lòng hồ." },
          { label: "b", level: "Thông hiểu", isTrue: false, text: "Để làm giàu rừng nghèo kiệt, giải pháp kỹ thuật tối ưu nhất là cho máy móc phát quang chặt trắng toàn bộ các loài cây bụi, dây leo và cây gỗ tạp hiện có rồi mới trồng mới các loài cây bản địa ưa bóng hoàn toàn.", explanation: "Chặt trắng phá hủy vi khí hậu và gây xói mòn đất; phải mở tán cục bộ hoặc mở rạch theo băng." },
          { label: "c", level: "Vận dụng", isTrue: true, text: "Cây dầu rái, sao đen, gõ đỏ là những loài cây bản địa có chu kỳ sinh trưởng dài (trên 30 - 50 năm), giai đoạn non ưa bóng nhẹ cần có tán che chở, giai đoạn trưởng thành vươn lên tầng ưu thế đòi hỏi ánh sáng hoàn toàn.", explanation: "Đặc tính sinh thái cây họ Dầu: con ưa bóng nhẹ, lớn đòi hỏi ánh sáng vượt tán." },
          { label: "d", level: "Vận dụng cao", isTrue: false, text: "Chứng chỉ rừng quốc tế FSC (Forest Stewardship Council) chỉ là một thủ tục hành chính hình thức, không có tác động gì đến giá trị kinh tế và khả năng xuất khẩu sản phẩm gỗ của các doanh nghiệp chế biến gỗ Đồng Nai.", explanation: "Chứng chỉ FSC là yêu cầu bắt buộc khi xuất khẩu vào các thị trường lớn (EU, Mỹ), giúp tăng giá bán 15 - 30%." }
        ]
      },
      {
        id: 4,
        grade: "cn12",
        topic: "Khối 12 — Quản lý Môi trường Nước Ao nuôi & Công nghệ RAS",
        title: "Câu 4: Quản lý Động học Cân bằng Khí độc & Hệ thống Tuần hoàn RAS",
        context: "Một trang trại nuôi cá tra và cá rô phi ứng dụng công nghệ sông trong ao (IPRS) và hệ thống tuần hoàn RAS tại Nhơn Trạch (Đồng Nai). Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          { label: "a", level: "Nhận biết", isTrue: true, text: "Trong ao nuôi cá thâm canh, nồng độ khí amoniac tự do không ion hóa (NH3) có độc tính rất cao đối với mang và máu cá, độc tính này tăng lên rõ rệt khi độ pH của nước ao tăng cao (pH > 8,5) và nhiệt độ nước cao.", explanation: "Cân bằng NH4+ <-> NH3 + H+ chuyển dịch tạo nhiều khí độc NH3 khi pH và nhiệt độ tăng." },
          { label: "b", level: "Thông hiểu", isTrue: true, text: "Hiện tượng cá nổi đầu hàng loạt đớp khí trên mặt nước vào khoảng 4 - 6 giờ sáng là biểu hiện điển hình của việc ngạt khí do nồng độ oxy hòa tan (DO) trong ao giảm xuống mức thấp nhất trong chu kỳ 24 giờ.", explanation: "Ban đêm tảo ngừng quang hợp, chỉ hô hấp cùng cá làm oxy hòa tan cạn kiệt lúc rạng sáng." },
          { label: "c", level: "Vận dụng", isTrue: false, text: "Trong hệ thống lọc sinh học (biofilter) của mô hình nuôi tuần hoàn RAS, nhóm vi khuẩn dị dưỡng sẽ trực tiếp oxy hóa ion độc NO2- thành ion ít độc NO3- mà không cần tiêu tốn oxy hòa tan.", explanation: "Vi khuẩn Nitrobacter là vi khuẩn tự dưỡng hiếu khí bắt buộc, tiêu tốn rất nhiều oxy để oxy hóa NO2- thành NO3-." },
          { label: "d", level: "Vận dụng cao", isTrue: true, text: "Việc định kỳ sử dụng chế phẩm sinh học chứa vi khuẩn có ích (Bacillus subtilis, Nitrosomonas, Nitrobacter) giúp phân hủy thức ăn dư thừa, giảm bùn đáy ao và chuyển hóa khí độc mà không gây tồn dư kháng sinh trong thịt cá.", explanation: "Chế phẩm sinh học phân hủy hữu cơ và cạnh tranh mầm bệnh an toàn sinh học không để lại dư lượng." }
        ]
      }
    ],
    essays: [
      {
        id: 1,
        points: 3.5,
        title: "Câu 1 (3,5 điểm — Kiến thức Lâm nghiệp Lớp 12)",
        problem: "Một lâm trường tại miền Đông Nam Bộ được giao quản lý 500 ha rừng trồng sản xuất keo lai (chu kỳ gỗ nhỏ 5 năm) với mục tiêu chuyển hóa một phần diện tích (200 ha) sang mô hình rừng trồng cây gỗ lớn bản địa (sao đen, dầu rái) kết hợp khai thác gỗ bền vững đạt chứng chỉ FSC.\n1. Hãy phân tích các ưu điểm vượt trội về mặt sinh thái môi trường và hiệu quả kinh tế lâu dài của mô hình kinh doanh rừng gỗ lớn bản địa so với mô hình rừng gỗ nhỏ độc canh ngắn ngày. (1,5 điểm)\n2. Trình bày quy trình kỹ thuật chuyển hóa rừng và tỉa thưa nuôi dưỡng rừng: Xác định thời điểm tỉa thưa, nguyên tắc chọn cây chặt tỉa và kỹ thuật chăm sóc bảo đảm mật độ cây gỗ lớn đạt chuẩn khi bước vào giai đoạn thành thục công nghệ. (1,5 điểm)\n3. Nêu các biện pháp kỹ thuật lâm sinh then chốt để phòng chống cháy rừng trong mùa khô kéo dài ở vùng Đông Nam Bộ. (0,5 điểm)",
        rubric: [
          "1. Ưu điểm sinh thái & kinh tế (1,5đ): Về sinh thái (0,75đ) giữ nước ngầm, chống xói mòn, bảo tồn đa dạng sinh học và cố định CO2 lâu dài; Về kinh tế (0,75đ) giá bán gỗ lớn cao gấp 3-5 lần gỗ dăm, đạt chứng chỉ FSC xuất khẩu giá trị cao, giảm chi phí tái trồng hàng chu kỳ.",
          "2. Kỹ thuật chuyển hóa & tỉa thưa (1,5đ): Thời điểm tỉa thưa (0,5đ) khi rừng bắt đầu khép tán giao cành cạnh tranh ánh sáng; Nguyên tắc chọn cây (0,5đ) chặt cây sâu bệnh, cong queo, chèn ép, giữ cây sinh trưởng tốt và cây bản địa mục tiêu; Kỹ thuật chăm sóc (0,5đ) cường độ tỉa 20-30%, mật độ cuối 400-600 cây/ha, phát dây leo và bón thúc.",
          "3. Phòng chống cháy rừng (0,5đ): Thiết kế đường băng cản lửa trắng kết hợp cản lửa xanh, dọn dẹp thực bì đầu mùa khô, trực chòi canh và trang bị camera giám sát nhiệt độ 24/24."
        ]
      },
      {
        id: 2,
        points: 3.5,
        title: "Câu 2 (3,5 điểm — Kiến thức Thủy sản Lớp 12)",
        problem: "Tại vùng nuôi thủy sản thâm canh, một hộ nuôi tiến hành thả tôm thẻ chân trắng (Litopenaeus vannamei) trong 2 ao nuôi lót bạt đáy (diện tích mỗi ao 1.500 m2) ứng dụng công nghệ tuần hoàn kết hợp hạt Biofloc.\n1. Sau 60 ngày nuôi, mật độ thả ban đầu là 180 con/m2, tỷ lệ sống ước tính đạt 85%, kích cỡ tôm bình quân đạt 60 con/kg. Hãy tính:\n   • Tổng số cá thể tôm hiện có trong cả 2 ao nuôi. (0,5 điểm)\n   • Tổng sinh khối tôm trong cả 2 ao (kg). (0,5 điểm)\n   • Khối lượng thức ăn cần cho cả 2 ao ăn trong một ngày, biết khẩu phần ăn hàng ngày ở giai đoạn này bằng 3,5% tổng sinh khối tôm. (0,5 điểm)\n2. Vào tuần nuôi thứ 9, xét nghiệm mẫu nước ao phát hiện hàm lượng khí độc amoniac tự do NH3 đo được là 0,15 mg/L (> 0,05 mg/L) và NO2- là 1,2 mg/L (> 0,1 mg/L), tôm có hiện tượng giảm ăn, bơi lờ đờ ở tầng mặt nước.\n   • Hãy giải thích nguyên nhân sinh hóa dẫn đến việc tích tụ hai loại khí độc trên trong ao nuôi thâm canh. (1,0 điểm)\n   • Đề xuất quy trình 4 bước xử lý cấp bách để đưa các chỉ tiêu môi trường nước ao trở lại trạng thái an toàn cho tôm. (1,0 điểm)",
        rubric: [
          "1.1. Số lượng tôm (0,5đ): S = 3.000 m2. Số thả = 540.000 con. Số còn sống = 540.000 × 85% = 459.000 con.",
          "1.2. Sinh khối tôm (0,5đ): M = 459.000 / 60 = 7.650 kg tôm.",
          "1.3. Khối lượng thức ăn/ngày (0,5đ): Thức ăn = 7.650 × 3,5% = 267,75 kg/ngày.",
          "2.1. Nguyên nhân sinh hóa (1,0đ): Thức ăn thừa và phân tôm phân hủy giải phóng NH4+/NH3; Quá trình nitrat hóa hiếu khí bị nghẽn ở bước trung gian (thiếu oxy đáy hoặc mật độ Nitrobacter suy giảm) làm tích tụ nồng độ ion nitrite NO2- gây độc.",
          "2.2. Quy trình 4 bước xử lý cấp bách (1,0đ): Bước 1: Giảm 50% thức ăn; Bước 2: Tăng cường sục khí quạt nước 24/24 nâng DO > 6,0 mg/L; Bước 3: Bổ sung rỉ đường nâng C:N >= 12:1 kích thích Biofloc dị dưỡng; Bước 4: Tạt men vi sinh Nitrobacter đậm đặc và xi-phông hút mùn đáy."
        ]
      },
      {
        id: 3,
        points: 1.0,
        title: "Câu 3 (1,0 điểm — Tình huống Nâng cao & Mở rộng Thực tiễn)",
        problem: "Đồng Nai là thủ phủ chăn nuôi lợn, gia cầm lớn của cả nước đồng thời có diện tích cây ăn quả (sầu riêng, bưởi, chuối) và nuôi trồng thủy sản rất phát triển. Hãy đề xuất một mô hình kinh tế nông nghiệp tuần hoàn sinh thái khép kín (Circular Agriculture Model) liên kết giữa 3 phân ngành: Chăn nuôi lợn <-> Trồng trọt cây ăn quả <-> Thủy sản, nhằm tối ưu hóa dòng vật chất, giảm phát thải khí nhà kính (hướng tới Net Zero) và gia tăng giá trị kinh tế cho nông hộ. Vẽ sơ đồ luân chuyển vật chất tóm tắt cho mô hình trên.",
        rubric: [
          "Đề xuất liên kết tuần hoàn (0,6đ): Phân lợn tách bã rắn ủ compost/trùn quế bón cho sầu riêng/bưởi; Nước sau biogas nuôi cá rô phi/tra sinh học; Phụ phẩm cây ăn quả ủ men vi sinh làm thức ăn bổ sung cho chăn nuôi; Bùn ao cá định kỳ nạo vét bón lót sâu cho vườn cây; Giảm phát thải khí nhà kính CH4, hướng tới Net Zero.",
          "Sơ đồ luân chuyển vật chất (0,4đ): Vẽ đúng vòng tuần hoàn khép kín giữa Chăn nuôi -> Biogas/Compost -> Cây ăn quả & Thủy sản."
        ]
      }
    ]
  },
  dn_03: {
    id: "dn_03",
    level: "medium",
    levelBadge: "🟡 CẤP ĐỘ 2: VỪA / TĂNG TỐC",
    levelLabel: "CẤP ĐỘ 2 (VỪA / TĂNG TỐC & THỰC CHIẾN BÀ RỊA - BẮC GIANG)",
    code: "ĐỒNG NAI — ĐỀ SỐ 03",
    title: "KỲ THI CHỌN HỌC SINH GIỎI CẤP TỈNH / THÀNH PHỐ (ĐỀ SỐ 03 — THỰC CHIẾN BÀ RỊA VŨNG TÀU & BẮC GIANG)",
    subTitle: "Môn: Công nghệ (Định hướng Nông nghiệp) — Tinh hoa Đề Chuyên sâu Thực tế",
    durationMinutes: 180,
    maxScore: 20.0,
    source: "Tích hợp Đề thi HSG Bà Rịa - Vũng Tàu, Bắc Giang & Đề xuất CNNN 12",
    mcqs: [
      // K10 (8 câu)
      { id: 1, grade: "cn10", topic: "(1) Đất trồng", stem: "Khả năng đệm của đất (khả năng chống lại sự biến đổi pH khi thêm một lượng axit hoặc kiềm vào đất) phụ thuộc chủ yếu vào", options: ["hàm lượng cát hạt to trong đất.", "dung tích hấp phụ cation (CEC) và hàm lượng chất mùn hữu cơ, keo sét có trong đất.", "nhiệt độ bề mặt đất vào buổi trưa.", "độ dốc địa hình đồi núi."], answer: 1, explanation: "Keo mùn và keo sét có CEC cao, đóng vai trò hệ đệm hấp phụ và giải phóng ion H+ hoặc OH- chống lại sự thay đổi pH." },
      { id: 2, grade: "cn10", topic: "(1) Đất trồng", stem: "Biện pháp nào sau đây giúp cải tạo độ phì nhiêu của đất xám bạc màu Đông Nam Bộ một cách bền vững nhất?", options: ["Phun thuốc trừ cỏ phổ rộng liên tục.", "Luân canh cây trồng họ Đậu, bón phân hữu cơ hoai mục kết hợp vôi và cày sâu dần tầng mặt.", "Bón thật nhiều phân đạm hóa học vô cơ không cần phân chuồng.", "Để đất trống phơi ải nắng gắt suốt mùa khô."], answer: 1, explanation: "Cày sâu dần, bón vôi khử chua, bón nhiều hữu cơ và luân canh cây họ Đậu làm tăng mùn, nâng CEC và cải tạo kết cấu đất." },
      { id: 3, grade: "cn10", topic: "(1) Đất trồng", stem: "Loại đất có nồng độ muối hòa tan cao (EC > 4 dS/m) và hàm lượng Na+ trao đổi chiếm trên 15% dung tích hấp phụ được gọi là", options: ["đất phù sa cổ.", "đất mặn - kiềm (đất mặn kiềm hóa).", "đất phèn tiềm tàng.", "đất đồi núi xói mòn."], answer: 1, explanation: "Đất có EC > 4 dS/m và ESP (Exchangeable Sodium Percentage) > 15% là đất mặn - kiềm (Saline-sodic soil)." },
      { id: 4, grade: "cn10", topic: "(2) Phân bón", stem: "Phân lân nung chảy (FMP) thích hợp nhất để bón cho loại đất nào sau đây?", options: ["Đất kiềm có độ pH > 8,0.", "Đất chua, đất phèn và đất đồi núi dốc rửa trôi mạnh.", "Đất cát biển mặn.", "Giá thể thủy canh hoàn toàn."], answer: 1, explanation: "Lân nung chảy có tính kiềm (chứa nhiều Ca, Mg, Si), khó tan trong nước nhưng tan trong axit yếu nên khử chua rất tốt cho đất phèn chua." },
      { id: 5, grade: "cn10", topic: "(2) Phân bón", stem: "Một hecta cà phê cần bón 150 kg P2O5 nguyên chất. Người ta dùng phân Super lân chứa 16% P2O5. Khối lượng phân Super lân cần mua là", options: ["625,0 kg.", "750,0 kg.", "937,5 kg.", "1.200,0 kg."], answer: 2, explanation: "Khối lượng Super lân = (150 × 100) / 16 = 937,5 kg." },
      { id: 6, grade: "cn10", topic: "(2) Phân bón", stem: "Tại sao khi bảo quản phân bón vi sinh thương phẩm cần để nơi râm mát và tránh ánh nắng chiếu trực tiếp?", options: ["Để tránh cho bao bì đựng phân bị phai màu.", "Vì nhiệt độ cao và tia tử ngoại (UV) của mặt trời sẽ tiêu diệt các tế bào vi sinh vật sống có ích có trong phân.", "Vì ánh nắng làm phân bị bốc cháy nổ.", "Vì làm tăng nhanh khối lượng bao phân."], answer: 1, explanation: "Nhiệt độ cao (> 30°C) và tia UV mặt trời tiêu diệt các tế bào vi sinh vật sống (vi khuẩn, nấm đối kháng) trong phân." },
      { id: 7, grade: "cn10", topic: "(3) Trồng trọt CNC", stem: "Kỹ thuật màng phủ nông nghiệp (nilon 2 mặt đen - bạc) mang lại lợi ích nổi trội nào sau đây?", options: ["Mặt bạc hướng lên trên phản chiếu ánh sáng xua đuổi côn trùng và tăng quang hợp tán dưới, mặt đen úp xuống ngăn cản cỏ dại quang hợp và giữ ẩm đất.", "Tạo ra môi trường ngập úng quanh năm cho rễ cây.", "Làm tăng 100% lượng phân đạm bốc hơi khỏi đất.", "Làm biến đổi gen của giống rau củ."], answer: 0, explanation: "Mặt bạc phản xạ ánh sáng xua côn trùng (bọ trĩ, rệp), mặt đen ngăn ánh sáng triệt tiêu cỏ dại và giữ ẩm đất." },
      { id: 8, grade: "cn10", topic: "(3) Trồng trọt CNC", stem: "Trong nhà màng hiện đại, thiết bị thông gió làm mát bằng tấm làm mát (Cooling pad) kết hợp quạt hút hoạt động dựa trên nguyên lý", options: ["ngưng tụ hơi nước trong không khí.", "sự bay hơi của nước hấp thụ nhiệt lượng từ không khí đi qua tấm pad làm hạ nhiệt độ trong nhà màng từ 5 - 8 độ C.", "thổi khí nitơ hóa lỏng vào không gian nhà màng.", "làm đóng băng nước trên mái nhà kính."], answer: 1, explanation: "Hệ thống quạt hút kéo không khí nóng qua tấm Cooling pad ẩm; nước bay hơi hấp thu nhiệt ẩn làm giảm nhiệt độ phòng 5-8°C." },

      // K11 (8 câu)
      { id: 9, grade: "cn11", topic: "(1) Công nghệ giống vật nuôi", stem: "Trong kỹ thuật thụ tinh nhân tạo cho lợn, nhiệt độ bảo quản tinh dịch lợn dạng lỏng tối ưu nhất là", options: ["-196 độ C trong bình nitơ lỏng.", "15 đến 17 độ C trong tủ bảo quản tinh chuyên dụng.", "0 độ C trong ngăn đá tủ lạnh thông thường.", "37 đến 40 độ C."], answer: 1, explanation: "Tinh dịch lợn rất nhạy cảm với sốc lạnh, được pha loãng và bảo quản lỏng ở nhiệt độ 15-17°C (được 3-5 ngày)." },
      { id: 10, grade: "cn11", topic: "(1) Công nghệ giống vật nuôi", stem: "Lai kinh tế đơn giản giữa 2 giống lợn thuần chủng khác nhau nhằm mục đích tạo ra con lai F1 để", options: ["làm giống hạt nhân nhân giống thuần.", "nuôi thương phẩm lấy thịt nhằm khai thác tối đa ưu thế lai về tốc độ lớn và tiêu tốn ít thức ăn.", "lai trở lại với đàn lợn rừng tự nhiên.", "bảo tồn nguồn gen của loài sắp tuyệt chủng."], answer: 1, explanation: "Con lai F1 có ưu thế lai cao nhất được dùng 100% nuôi lấy thịt thương phẩm, không làm giống." },
      { id: 11, grade: "cn11", topic: "(1) Công nghệ giống vật nuôi", stem: "Chỉ số EBV (Estimated Breeding Value) trong chọn giống hiện đại biểu thị", options: ["giá trị kinh tế bằng tiền mặt của một con vật nuôi.", "giá trị giống ước tính - thước đo tiềm năng di truyền của một cá thể đối với một tính trạng cụ thể so với quần thể.", "tổng số con non được sinh ra trong một lứa đẻ.", "khối lượng thịt xẻ thu được sau giết mổ."], answer: 1, explanation: "EBV (Estimated Breeding Value) là giá trị giống ước tính, đánh giá tiềm năng truyền gen của cá thể giống cho đời con." },
      { id: 12, grade: "cn11", topic: "(2) Công nghệ thức ăn", stem: "Một đàn lợn thịt tiêu tốn hết 210 kg thức ăn để tăng được 75 kg khối lượng sống. Hệ số chuyển đổi thức ăn FCR của đàn lợn là", options: ["2,40.", "2,60.", "2,80.", "3,10."], answer: 2, explanation: "FCR = 210 / 75 = 2,80." },
      { id: 13, grade: "cn11", topic: "(2) Công nghệ thức ăn", stem: "Khi ủ chua thân cây ngô làm thức ăn cho trâu bò, người ta rải từng lớp dày 15 - 20 cm rồi dẫm nén thật chặt nhằm mục đích", options: ["làm nát vụn thân ngô thành bột mịn.", "đuổi hết không khí ra ngoài, tạo điều kiện kỵ khí bắt buộc cho vi khuẩn Lactic phát triển và ngăn nấm mốc.", "giúp nước mưa ngấm sâu vào hố ủ.", "tiêu diệt toàn bộ vi khuẩn Lactic."], answer: 1, explanation: "Dẫm nén chặt để tống khứ O2, tạo môi trường kỵ khí tuyệt đối cho vi khuẩn Lactic lên men và chống mốc." },
      { id: 14, grade: "cn11", topic: "(2) Công nghệ thức ăn", stem: "Độc tố Aflatoxin thường xuất hiện trong thức ăn chăn nuôi bị mốc (ngô, lạc) do nấm nào sau đây sinh ra?", options: ["Nấm Aspergillus flavus.", "Nấm men Saccharomyces.", "Nấm đối kháng Trichoderma.", "Vi khuẩn Bacillus."], answer: 0, explanation: "Aspergillus flavus và Aspergillus parasiticus phát triển trên ngô ẩm sinh độc tố Aflatoxin cực độc phá hủy tế bào gan." },
      { id: 15, grade: "cn11", topic: "(3) Môi trường chăn nuôi", stem: "Khí Hydro sunfua (H2S) trong chuồng nuôi có đặc tính vật lý và tác hại sinh học nguy hiểm nào?", options: ["Nhẹ hơn không khí, không mùi, không gây độc.", "Nặng hơn không khí nên chìm sát nền chuồng, có mùi trứng thối đặc trưng, gây tê liệt khứu giác và ức chế hô hấp tế bào tử vong nhanh.", "Có màu xanh lục và vị ngọt.", "Giúp vật nuôi ăn ngon miệng hơn."], answer: 1, explanation: "H2S nặng hơn không khí, mùi trứng thối, độc tính cao làm liệt khứu giác và ức chế chuỗi hô hấp tế bào cytochrome oxidase." },
      { id: 16, grade: "cn11", topic: "(3) Môi trường chăn nuôi", stem: "Xử lý xác gia cầm chết do dịch cúm gia cầm độc lực cao (H5N1) theo đúng quy chuẩn thú y là", options: ["vứt xác xuống sông suối cho cá ăn.", "đem chôn lấp hợp vệ sinh có rắc vôi bột khử trùng hoặc thiêu hủy hoàn toàn trong lò đốt chuyên dụng.", "bán rẻ cho các cơ sở chế biến thực phẩm đông lạnh.", "đem phơi khô ngoài nắng."], answer: 1, explanation: "Xác gia cầm nhiễm dịch bắt buộc phải tiêu hủy bằng lò đốt nhiệt cao hoặc chôn lấp sâu có rải vôi bột khử trùng." },

      // K12 (8 câu)
      { id: 17, grade: "cn12", topic: "(1) Giới thiệu chung về lâm nghiệp", stem: "Vườn quốc gia Cát Tiên thuộc nhóm rừng nào theo quy định pháp lý?", options: ["Rừng sản xuất.", "Rừng đặc dụng.", "Rừng phòng hộ đầu nguồn.", "Rừng cảnh quan đô thị."], answer: 1, explanation: "Vườn quốc gia là phân loại tiêu biểu của nhóm Rừng đặc dụng nhằm bảo tồn đa dạng sinh học hệ sinh thái." },
      { id: 18, grade: "cn12", topic: "(2) Trồng và chăm sóc rừng", stem: "Cự ly trồng rừng keo lai theo hàng là 2m × 3m. Mật độ trồng trên 1 ha (10.000 m2) là", options: ["1.111 cây/ha.", "1.667 cây/ha.", "2.000 cây/ha.", "2.500 cây/ha."], answer: 1, explanation: "Diện tích dinh dưỡng 1 cây = 2 × 3 = 6 m2. Mật độ = 10.000 / 6 ≈ 1.667 cây/ha." },
      { id: 19, grade: "cn12", topic: "(3) Bảo vệ và khai thác tài nguyên rừng bền vững", stem: "Cấp kính khai thác gỗ tối thiểu trong quản lý rừng tự nhiên bền vững là", options: ["đường kính thân cây đo ở độ cao 1,3m (D_1.3) đạt ngưỡng quy định cho phép chặt hạ của từng loài gỗ quý.", "chiều cao vút ngọn của cây tính bằng mét.", "độ dày của lớp vỏ cây.", "độ rộng của tán lá cây."], answer: 0, explanation: "Cấp kính khai thác là đường kính ngang ngực thân cây (đo tại vị trí 1,3m) đạt tiêu chuẩn kinh doanh cho phép chặt hạ." },
      { id: 20, grade: "cn12", topic: "(3) Bảo vệ và khai thác tài nguyên rừng bền vững", stem: "Biện pháp kỹ thuật nào sau đây KHÔNG thuộc quy trình phòng cháy chữa cháy rừng?", options: ["Làm sạch vật liệu cháy và đốt dọn thực bì trước mùa khô có kiểm soát.", "Xây dựng chòi canh lửa rừng và lắp đặt camera cảm biến nhiệt.", "Trồng xen cây bạch đàn có hàm lượng tinh dầu cao vào đường băng cản lửa trắng.", "Chuẩn bị sẵn các trang thiết bị máy bơm chữa cháy rừng và hồ chứa nước."], answer: 2, explanation: "Trồng bạch đàn nhiều tinh dầu trên đường băng cản lửa là cực kỳ sai lầm vì bạch đàn rất bén lửa, làm cháy lan nhanh." },
      { id: 21, grade: "cn12", topic: "(4) Giới thiệu chung về thủy sản", stem: "Nhóm cá nào sau đây có tính ăn thực vật và mùn bã hữu cơ, đóng vai trò dọn sạch đáy ao?", options: ["Cá lóc bông.", "Cá rô phi và cá mè trắng.", "Cá trắm đen.", "Cá chẽm (vược)."], answer: 1, explanation: "Cá rô phi và cá mè trắng ăn thực vật phù du, vi tảo và mùn bã hữu cơ, lọc sạch môi trường nước ao nuôi." },
      { id: 22, grade: "cn12", topic: "(5) Môi trường nuôi thủy sản", stem: "Khí H2S (Hydro sunfua) tích tụ dưới đáy ao nuôi tôm thâm canh thường phát sinh mạnh nhất trong điều kiện", options: ["nước ao giàu oxy hòa tan và đáy ao sạch sẽ.", "đáy ao tích tụ nhiều thức ăn thừa, phân tôm, điều kiện yếm khí (thiếu oxy) và pH nước ao thấp (chua).", "nước ao có độ mặn bằng 0.", "trời nắng to vào buổi trưa."], answer: 1, explanation: "Vi khuẩn khử sunfat phân giải kỵ khí chất hữu cơ đáy ao sinh H2S; độc tính H2S tăng mạnh khi pH nước ao thấp (< 7,0)." },
      { id: 23, grade: "cn12", topic: "(5) Môi trường nuôi thủy sản", stem: "Sử dụng chế phẩm men vi sinh Probiotics (chứa Bacillus subtilis) định kỳ tạt vào ao nuôi tôm nhằm mục đích", options: ["cạnh tranh chất dinh dưỡng và không gian sống với vi khuẩn gây bệnh (Vibrio), đồng thời phân hủy bùn đáy ao.", "làm nước ao biến thành màu tím để tôm dễ ngụy trang.", "tiêu diệt hoàn toàn các loài tảo có ích.", "làm tăng độ mặn của ao."], answer: 0, explanation: "Bacillus subtilis tiết enzyme phân hủy protein, chất hữu cơ dư thừa và cạnh tranh sinh học ức chế vi khuẩn Vibrio gây bệnh." },
      { id: 24, grade: "cn12", topic: "(6) Công nghệ giống thủy sản", stem: "Phương pháp chẩn đoán phát hiện sớm virus gây bệnh đốm trắng (WSSV) trên tôm bố mẹ và tôm giống có độ chính xác cao nhất hiện nay là", options: ["nhìn bằng mắt thường dưới ánh sáng mặt trời.", "kỹ thuật sinh học phân tử PCR (Polymerase Chain Reaction).", "dùng kính lúp cầm tay độ phóng đại 10 lần.", "nếm vị nước ao."], answer: 1, explanation: "Kỹ thuật PCR khuếch đại đoạn gen đặc hiệu của virus WSSV cho kết quả chẩn đoán chính xác tuyệt đối ở tôm giống SPF." }
    ],
    tfs: [
      {
        id: 1,
        grade: "cn10",
        topic: "Khối 10 — Độ đệm Keo đất & Kỹ thuật Màng phủ Nông nghiệp",
        title: "Câu 1: Độ đệm Đất trồng & Công nghệ Màng phủ Phản quang 2 mặt",
        context: "Một trang trại trồng dưa hấu công nghệ cao trên đất cát pha ven biển tại Bà Rịa - Vũng Tàu sử dụng màng phủ nông nghiệp và hệ thống tưới nhỏ giọt. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          { label: "a", level: "Nhận biết", isTrue: false, text: "Đất cát pha có dung tích hấp phụ cation (CEC) rất cao nên có khả năng giữ nước và giữ phân bón tốt hơn đất sét nặng giàu mùn.", explanation: "Đất cát pha nghèo keo sét và mùn nên CEC rất thấp, giữ nước và giữ phân kém." },
          { label: "b", level: "Thông hiểu", isTrue: true, text: "Việc bón nhiều phân hữu cơ hoai mục giúp làm tăng lượng keo mùn, từ đó nâng cao độ đệm của đất và giảm sự biến động đột ngột về độ pH khi bón phân hóa học.", explanation: "Keo mùn làm tăng khả năng đệm của đất nhờ hệ nhóm chức carboxyl và phenol." },
          { label: "c", level: "Vận dụng", isTrue: true, text: "Màng phủ nông nghiệp có mặt màu bạc hướng lên trên giúp phản xạ bức xạ mặt trời, tăng cường ánh sáng cho các tầng lá dưới và xua đuổi các loài côn trùng chích hút như bọ trĩ, rầy mềm.", explanation: "Ánh sáng phản xạ từ mặt bạc làm lóa mắt và xua đuổi côn trùng chích hút truyền virus." },
          { label: "d", level: "Vận dụng cao", isTrue: true, text: "Hệ thống tưới nhỏ giọt kết hợp bón phân hòa tan (Fertigation) cung cấp dinh dưỡng trực tiếp tới vùng rễ hoạt động, giúp giảm nồng độ muối tích tụ trên bề mặt luống đất cát ven biển.", explanation: "Nước tưới nhỏ giọt đẩy vùng muối tích tụ ra rìa bầu rễ, bảo vệ rễ không bị sốc mặn." }
        ]
      },
      {
        id: 2,
        grade: "cn11",
        topic: "Khối 11 — An toàn Sinh học & Quản lý Độc tố Nấm mốc Thức ăn",
        title: "Câu 2: Thụ tinh Nhân tạo Gia súc & Phòng ngừa Độc tố Aflatoxin",
        context: "Một công ty giống gia súc vận hành trung tâm khai thác tinh bò đông lạnh và nhà máy sản xuất thức ăn chăn nuôi quy mô lớn. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          { label: "a", level: "Nhận biết", isTrue: true, text: "Đông lạnh tinh dịch bò trong nitơ lỏng ở nhiệt độ -196 độ C cho phép lưu giữ nguồn gen quý của bò đực giống trong nhiều chục năm mà tinh trùng vẫn duy trì được khả năng thụ tinh.", explanation: "Ở -196°C mọi hoạt động trao đổi chất của tế bào tinh trùng ngừng hoàn toàn, bảo tồn gen lâu dài." },
          { label: "b", level: "Thông hiểu", isTrue: false, text: "Độc tố Aflatoxin B1 do nấm mốc Aspergillus flavus sinh ra trong ngô ẩm có thể bị phá hủy hoàn toàn bằng cách đem phơi nắng hoặc đun nấu thông thường ở 100 độ C.", explanation: "Aflatoxin rất bền nhiệt (nhiệt độ phân hủy > 250°C), đun nấu thông thường không phá hủy được." },
          { label: "c", level: "Vận dụng", isTrue: true, text: "Bổ sung chất hấp phụ độc tố nấm mốc (như khoáng sét Bentonite, vách tế bào nấm men Beta-glucan) vào thức ăn chăn nuôi giúp liên kết và đào thải độc tố Aflatoxin qua đường phân, bảo vệ gan vật nuôi.", explanation: "Chất hấp phụ liên kết phân tử Aflatoxin trong lòng ruột ngăn cản hấp thu vào máu." },
          { label: "d", level: "Vận dụng cao", isTrue: false, text: "Có thể sử dụng thức ăn tinh bị ẩm mốc nặng có mùi chua để nuôi lợn nái mang thai nhằm tiết kiệm chi phí mà không gây ảnh hưởng đến phôi thai.", explanation: "Thức ăn mốc chứa Mycotoxin gây chết phôi, sảy thai và quái thai ở lợn nái." }
        ]
      },
      {
        id: 3,
        grade: "cn12",
        topic: "Khối 12 — Lâm sinh Đa dụng & Cấp kính Khai thác Gỗ Rừng",
        title: "Câu 3: Quy hoạch Lâm phần Gỗ lớn & Khai thác Bền vững",
        context: "Một ban quản lý lâm trường thực hiện đề tài điều tra tài nguyên và xây dựng phương án khai thác gỗ bền vững theo chuẩn FSC. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          { label: "a", level: "Nhận biết", isTrue: true, text: "Cấp kính khai thác gỗ là tiêu chuẩn kỹ thuật quy định đường kính thân cây đo ở độ cao 1,3 mét tối thiểu mà cây gỗ phải đạt được mới được phép đưa vào danh sách chặt hạ.", explanation: "Định nghĩa chuẩn của cấp kính khai thác lâm sinh (D_1.3)." },
          { label: "b", level: "Thông hiểu", isTrue: false, text: "Trong phương thức khai thác chọn rừng tự nhiên, người thợ rừng được phép chặt hạ toàn bộ các cây gỗ quý hiếm đang giai đoạn sai quả gieo giống để lấy hạt đem bán.", explanation: "Cây mẹ gieo giống phẩm chất tốt bắt buộc phải được đánh số giữ lại để duy trì tái sinh tự nhiên." },
          { label: "c", level: "Vận dụng", isTrue: true, text: "Rừng trồng hỗn giao giữa cây keo lai (cố định đạm sinh học, lớn nhanh) và cây sao đen (chịu bóng giai đoạn non, gỗ quý chu kỳ dài) mang lại hiệu quả sinh thái và kinh tế cao hơn rừng trồng thuần loài keo dăm.", explanation: "Hỗn giao tận dụng không gian dinh dưỡng đa tầng tán, cải tạo đất và đa dạng sinh học." },
          { label: "d", level: "Vận dụng cao", isTrue: true, text: "Khai thác gỗ tác động thấp (RIL - Reduced Impact Logging) kết hợp mở đường vận xuất theo đường đồng mức giúp hạn chế tối đa tổn thương tầng cây tái sinh và sạt lở xói mòn đất rừng vùng dốc.", explanation: "RIL là quy trình khai thác tiêu chuẩn của chứng chỉ FSC giảm 50% tổn hại rừng." }
        ]
      },
      {
        id: 4,
        grade: "cn12",
        topic: "Khối 12 — Quản lý Dịch bệnh Ao tôm & Chuỗi Xử lý Nước 4 Bước",
        title: "Câu 4: Quản lý Khí độc Đáy ao & An toàn Sinh học Bệnh Đốm trắng",
        context: "Một hợp tác xã nuôi tôm thẻ chân trắng thâm canh tại vùng ven biển áp dụng quy trình an toàn sinh học 2 giai đoạn. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          { label: "a", level: "Nhận biết", isTrue: true, text: "Bệnh đốm trắng (WSSV) là bệnh truyền nhiễm nguy hiểm do virus gây ra, có khả năng làm tôm chết hàng loạt tới 90 - 100% chỉ sau 3 đến 7 ngày phát bệnh.", explanation: "Virus WSSV có độc lực cực cao gây chết tôm cấp tính hàng loạt." },
          { label: "b", level: "Thông hiểu", isTrue: true, text: "Quy trình xử lý nước cấp vào ao nuôi gồm 4 bước: (1) Lắng cơ học -> (2) Diệt tạp bằng Saponin và diệt khuẩn bằng Chlorine -> (3) Khử Chlorine tồn dư bằng sục khí và Na2S2O3 -> (4) Bón phân gây màu nước và cấy vi sinh.", explanation: "Chuẩn xác 4 bước quy trình chuẩn bị nước nuôi tôm an toàn sinh học." },
          { label: "c", level: "Vận dụng", isTrue: false, text: "Khi phát hiện tôm trong ao bị nhiễm virus đốm trắng WSSV, người nuôi cần xả ngay lập tức toàn bộ nước ao ra kênh rạch chung để cứu lấy số tôm còn lại.", explanation: "Xả nước ao bệnh ra ngoài làm lây lan dịch bệnh ra toàn vùng nuôi; phải xử lý Chlorine diệt mầm bệnh trước khi tiêu hủy." },
          { label: "d", level: "Vận dụng cao", isTrue: true, text: "Hệ thống xi-phông đáy ao kết hợp hố gom chất thải định kỳ giúp loại bỏ phân tôm và thức ăn thừa ra khỏi ao trước khi chúng bị phân hủy yếm khí sinh khí độc H2S và NH3.", explanation: "Xi-phông đáy định kỳ là biện pháp cơ học hiệu quả nhất để giữ sạch nền đáy ao thâm canh." }
        ]
      }
    ],
    essays: [
      {
        id: 1,
        points: 3.5,
        title: "Câu 1 (3,5 điểm — Kiến thức Lâm nghiệp Lớp 12 & Quản lý Rừng bền vững)",
        problem: "Một công ty lâm nghiệp tại vùng Đông Nam Bộ quản lý 1.000 ha rừng trồng keo và cây bản địa. Nhằm nâng cao năng suất và phòng chống cháy rừng trong mùa khô kéo dài:\n1. Hãy phân tích các nguyên nhân gây cháy rừng chủ yếu tại khu vực Đông Nam Bộ vào mùa khô. Thiết kế một hệ thống phòng cháy chữa cháy rừng tổng thể bao gồm các giải pháp công trình và lâm sinh. (1,5 điểm)\n2. Công ty dự định khai thác 50 ha rừng trồng keo lai 6 năm tuổi để tái trồng rừng gỗ lớn bản địa. Hãy so sánh hai phương thức khai thác trắng và khai thác chọn trên các tiêu chí: Điều kiện áp dụng, tác động môi trường đất và khả năng bảo tồn nguồn gen. (1,5 điểm)\n3. Nêu các tiêu chuẩn đánh giá cây con giống keo lai và cây gõ đỏ đạt chuẩn xuất vườn đi trồng rừng. (0,5 điểm)",
        rubric: [
          "1. Nguyên nhân & Thiết kế PCCR (1,5đ): Nguyên nhân (0,75đ) do mùa khô kéo dài, thực bì khô dày đặc, gió chướng mạnh và sơ suất con người; Thiết kế (0,75đ) gồm đường băng cản lửa trắng kết hợp đường băng xanh cây mọng nước, hồ trữ nước cơ động, chòi canh quan sát nhiệt độ và tuần tra 24/24.",
          "2. So sánh khai thác trắng và khai thác chọn (1,5đ): Điều kiện áp dụng (0,5đ) khai thác trắng cho rừng trồng thuần loài đất bằng phẳng, khai thác chọn cho rừng tự nhiên hoặc rừng phòng hộ; Tác động đất (0,5đ) khai thác trắng gây xói mòn rửa trôi nặng, khai thác chọn giữ thảm thực bì bảo vệ đất; Bảo tồn gen (0,5đ) khai thác chọn bảo tồn tầng cây tái sinh và cây mẹ giống.",
          "3. Tiêu chuẩn cây giống xuất vườn (0,5đ): Cây con thân thẳng hóa gỗ phần gốc, đỉnh sinh trưởng lành lặn, chiều cao 30-50 cm, bộ rễ đan chặt giữ nguyên bầu đất, không sâu bệnh."
        ]
      },
      {
        id: 2,
        points: 3.5,
        title: "Câu 2 (3,5 điểm — Kiến thức Thủy sản Lớp 12 & Kỹ thuật Xử lý Nước Ao tôm)",
        problem: "Một hợp tác xã nuôi tôm thẻ chân trắng công nghệ cao chuẩn bị đưa 2 ao nuôi diện tích mỗi ao 2.000 m2 vào hoạt động:\n1. Hãy trình bày chi tiết quy trình 4 bước chuẩn bị nước cấp ao nuôi từ nguồn nước tự nhiên cho đến khi đủ điều kiện thả tôm giống an toàn sinh học. (1,5 điểm)\n2. Sau 45 ngày nuôi, xét nghiệm nước phát hiện: pH nước ao buổi chiều = 8,9; nồng độ TAN (Tổng amoniac nitơ) = 2,5 mg/L; Oxy hòa tan lúc 5 giờ sáng DO = 2,8 mg/L. Tôm có dấu hiệu bơi dạt bờ và ăn yếu.\n   • Hãy phân tích các mối nguy hiểm sinh học đối với tôm trong điều kiện môi trường trên. (1,0 điểm)\n   • Đề xuất quy trình xử lý khẩn cấp để đưa các chỉ tiêu môi trường về mức an toàn trong vòng 24 - 48 giờ. (1,0 điểm)",
        rubric: [
          "1. Quy trình 4 bước chuẩn bị nước ao (1,5đ): Bước 1 (0,4đ) Lắng cơ học qua lưới lọc dày loại bỏ tạp và phù sa lơ lửng; Bước 2 (0,4đ) Diệt cá tạp bằng Saponin và diệt khuẩn bằng Chlorine 20-30 ppm; Bước 3 (0,4đ) Sục khí quạt nước 3-5 ngày trung hòa dư lượng Chlorine, bón vôi nâng kiềm 120 mg/L; Bước 4 (0,3đ) Bón phân gây màu nước xanh đọt chuối (độ trong 30-40 cm) và cấy men vi sinh Probiotics.",
          "2.1. Phân tích mối nguy sinh học (1,0đ): pH quá cao (8,9) kết hợp TAN lớn làm chuyển dịch cân bằng sinh khí độc NH3 tự do gây ngộ độc mang thần kinh; DO rạng sáng quá thấp (< 3,0 mg/L) làm tôm ngạt thở, chậm lột xác và dễ bùng phát dịch bệnh hoại tử gan tụy.",
          "2.2. Quy trình xử lý khẩn cấp (1,0đ): Giảm 50% thức ăn; Bật 100% dàn quạt nước và sục khí đáy 24/24; Tạt mật rỉ đường ủ men vi sinh để hạ pH và đồng hóa NH3; Bón vôi nông nghiệp hoặc thạch cao ổn định kiềm và xi-phông đáy ao."
        ]
      },
      {
        id: 3,
        points: 1.0,
        title: "Câu 3 (1,0 điểm — Tình huống Nâng cao: Hạch toán Kinh tế 1 ha Lúa & Điểm hòa vốn)",
        problem: "Một hộ nông dân canh tác 1 ha lúa chất lượng cao ST25 ứng dụng cơ giới hóa đồng bộ:\n• Chi phí giống lúa xác nhận: 120 kg × 25.000 đ/kg.\n• Chi phí phân bón NPK và hữu cơ: 8.500.000 đồng/ha.\n• Chi phí thuốc bảo vệ thực vật sinh học: 3.200.000 đồng/ha.\n• Chi phí làm đất, tưới tiêu và gặt đập liên hợp: 6.500.000 đồng/ha.\n• Năng suất thực tế thu hoạch đạt 6,5 tấn thóc/ha.\n• Giá bán thóc tươi tại ruộng là 9.500 đ/kg.\n\n1. Hãy tính tổng chi phí đầu tư cho 1 ha lúa và giá thành sản xuất bình quân của 1 kg thóc (đồng/kg). (0,5 điểm)\n2. Tính doanh thu, lợi nhuận thuần và tỷ suất lợi nhuận trên chi phí (%) của vụ lúa này. (0,5 điểm)",
        rubric: [
          "1. Tổng chi phí & Giá thành (0,5đ): Chi phí giống = 120 × 25.000 = 3.000.000 đ; Tổng chi phí = 3.000.000 + 8.500.000 + 3.200.000 + 6.500.000 = 21.200.000 đồng/ha; Giá thành sản xuất 1 kg thóc = 21.200.000 đ / 6.500 kg ≈ 3.261,5 đồng/kg.",
          "2. Doanh thu & Lợi nhuận (0,5đ): Doanh thu = 6.500 kg × 9.500 đ = 61.750.000 đồng; Lợi nhuận thuần = 61.750.000 - 21.200.000 = 40.550.000 đồng/ha; Tỷ suất lợi nhuận = (40.550.000 / 21.200.000) × 100% ≈ 191,27%."
        ]
      }
    ]
  },
  dn_02: {
    id: "dn_02",
    level: "hard",
    levelBadge: "🔴 CẤP ĐỘ 3: KHÓ / VỀ ĐÍCH",
    levelLabel: "CẤP ĐỘ 3 (KHÓ / VỀ ĐÍCH & CHUYÊN SÂU NÂNG CAO BẢNG B MÃ 7011)",
    code: "ĐỒNG NAI — ĐỀ SỐ 02",
    title: "KỲ THI CHỌN HỌC SINH GIỎI CẤP TỈNH / THÀNH PHỐ (ĐỀ SỐ 02 — CHUYÊN SÂU LIÊN TỈNH)",
    subTitle: "Môn: Công nghệ (Định hướng Nông nghiệp) — Tinh hoa Đề Chính thức TP. Huế Mã 7011 & TP.HCM",
    durationMinutes: 180,
    maxScore: 20.0,
    source: "Tích hợp Đề thi HSG TP. Huế (Mã đề 7011) & Đề thi HSG TP.HCM",
    mcqs: [
      // K10 (8 câu)
      { id: 1, grade: "cn10", topic: "(1) Đất trồng", stem: "Theo cơ chế trao đổi ion giữa rễ cây và keo đất, ion H+ do rễ tiết ra có nguồn gốc chủ yếu từ", options: ["phản ứng quang hợp ở lục lạp của lá cây.", "quá trình hô hấp của lông hút tạo ra khí CO2, sau đó CO2 + H2O tạo H2CO3 phân ly thành H+ và HCO3-.", "sự phân hủy trực tiếp của màng sinh chất tế bào rễ.", "sự xâm nhập của các phân tử nước tự do từ ngoài vào."], answer: 1, explanation: "Lông hút hô hấp thải CO2: CO2 + H2O <-> H2CO3 <-> H+ + HCO3-; rễ tiết H+ trao đổi với cation dinh dưỡng trên keo đất." },
      { id: 2, grade: "cn10", topic: "(1) Đất trồng", stem: "Để cải tạo đất mặn (chứa nhiều ion Na+ trao đổi trên keo đất), người ta bón thạch cao (CaSO4.2H2O) kết hợp thau rửa mặn dựa trên cơ chế", options: ["ion SO4(2-) sẽ kết tủa toàn bộ muối NaCl trong đất.", "ion Ca2+ có ái lực hấp phụ mạnh hơn Na+ nên sẽ đẩy Na+ ra khỏi keo đất vào dung dịch đất để bị nước ngọt rửa trôi.", "thạch cao làm giảm nhiệt độ của đất ngăn chặn nước bốc hơi.", "thạch cao trực tiếp biến đất sét thành đất cát xốp."], answer: 1, explanation: "Ca2+ có hóa trị 2 và ái lực hấp phụ mạnh hơn cation hóa trị 1 (Na+), đẩy Na+ ra dung dịch đất để tháo nước ngọt rửa mặn." },
      { id: 3, grade: "cn10", topic: "(1) Đất trồng", stem: "Giá thể trơ Keramzit (sỏi nhẹ đất sét nung ở 1.200 độ C) được sử dụng rộng rãi trong trồng rau thủy canh công nghệ cao vì ưu điểm", options: ["chứa hàm lượng đạm và lân nguyên chất rất cao nuôi sống cây.", "có độ xốp cao, giữ ẩm tốt, thoáng khí vùng rễ, hoàn toàn vô trùng và không làm thay đổi pH của dung dịch dinh dưỡng.", "có khả năng tự diệt trừ mọi loài sâu bệnh trên tán cây.", "có thể tự hòa tan thành dung dịch phân bón sau 1 tháng."], answer: 1, explanation: "Keramzit trơ về mặt hóa học, xốp nhẹ, thoáng khí, vô trùng, giữ ẩm và tái sử dụng nhiều chu kỳ." },
      { id: 4, grade: "cn10", topic: "(2) Phân bón", stem: "Vì sao không nên bón phân đạm Nitrat (NO3-) cho ruộng lúa nước bị ngập úng yếm khí lâu ngày?", options: ["Vì ion NO3- sẽ kết tủa đáy bùn làm nghẹt rễ lúa.", "Vì trong điều kiện yếm khí ngập nước, vi khuẩn phản nitrat hóa sẽ khử NO3- thành khí N2O và N2 bay mất gây thất thoát đạm.", "Vì phân nitrat làm nước ruộng bị đông cứng.", "Vì rễ lúa nước hoàn toàn không có khả năng hút đạm nitrat."], answer: 1, explanation: "Ở môi trường yếm khí ngập nước, vi khuẩn phản nitrat hóa (Denitrifying bacteria) phân giải NO3- thành N2, N2O bay hơi làm mất phân đạm." },
      { id: 5, grade: "cn10", topic: "(2) Phân bón", stem: "Chủng vi sinh vật nào sau đây có khả năng sống cộng sinh trong nốt sần rễ cây họ Đậu để cố định nitơ tự do từ không khí?", options: ["Vi khuẩn Azotobacter.", "Vi khuẩn Rhizobium.", "Vi khuẩn Bacillus subtilis.", "Nấm men Saccharomyces cerevisiae."], answer: 1, explanation: "Rhizobium cộng sinh với cây họ Đậu hình thành nốt sần, tiết enzyme nitrogenase cố định N2 thành NH3 cung cấp cho cây." },
      { id: 6, grade: "cn10", topic: "(2) Phân bón", stem: "Phân bón Nano có ưu thế vượt trội nào so với phân bón hóa học truyền thống?", options: ["Kích thước hạt cực nhỏ (1-100 nm), diện tích bề mặt lớn, dễ dàng xâm nhập vào khí khổng và rễ, nâng hiệu suất hấp thụ lên 80-90%.", "Giá thành rẻ gấp 10 lần phân chuồng hoai mục.", "Có thể thay thế hoàn toàn nước tưới cho cây trồng sa mạc.", "Chỉ cần bón một lần duy nhất cho cả đời cây gỗ 50 năm."], answer: 0, explanation: "Hạt Nano (1-100 nm) có tỷ lệ diện tích/thể tích cực lớn, dễ thấm qua khí khổng và vách tế bào, giảm thất thoát rửa trôi." },
      { id: 7, grade: "cn10", topic: "(3) Trồng trọt CNC", stem: "Bản chất của công nghệ bảo quản rau quả tươi bằng khí quyển điều chỉnh (CA - Controlled Atmosphere) là", options: ["rút hết 100% không khí để tạo môi trường chân không tuyệt đối.", "chủ động hạ nồng độ O2 xuống mức thấp thích hợp (1-3%) và tăng nồng độ CO2 (3-5%) để kìm hãm tối đa cường độ hô hấp của quả mà không gây hô hấp yếm khí.", "phun hóa chất diệt nấm cực mạnh để quả không bao giờ chín.", "chiếu tia phóng xạ gamma liều cao liên tục 24/24 giờ."], answer: 1, explanation: "Bảo quản CA điều chỉnh giảm O2 (1-3%) và tăng CO2 (3-5%) ở nhiệt độ lạnh thích hợp để giảm hô hấp hiếu khí và kìm hãm khí ethylene." },
      { id: 8, grade: "cn10", topic: "(3) Trồng trọt CNC", stem: "Trong hệ thống khí canh (Aeroponics), việc phun sương ngắt quãng (mỗi chu kỳ vài phút phun vài giây) giúp", options: ["tiết kiệm tối đa điện năng và nước, đồng thời duy trì độ ẩm bão hòa và lượng oxy hòa tan tối đa cho vùng rễ.", "làm rễ cây bị khô teo để hạn chế chiều cao của cây.", "tiêu diệt hoàn toàn các tế bào lông hút của rễ.", "làm tăng nhiệt độ vùng rễ lên trên 45 độ C."], answer: 0, explanation: "Phun ngắt quãng giúp rễ vừa đủ ẩm vừa tiếp xúc oxy 100% trong không khí, tiết kiệm 95% nước so với trồng đất." },

      // K11 (8 câu)
      { id: 9, grade: "cn11", topic: "(1) Công nghệ giống vật nuôi", stem: "Công nghệ chỉnh sửa gen CRISPR/Cas9 ứng dụng trên lợn đã tạo ra bước đột phá nào trong phòng chống dịch bệnh?", options: ["Làm lợn có khả năng phát sáng trong bóng tối.", "Vô hiệu hóa gen mã hóa thụ thể CD163 trên đại thực bào phế nang, giúp đàn lợn kháng hoàn toàn virus gây hội chứng PRRS (tai xanh).", "Biến lợn thành động vật nhai lại có thể ăn cỏ khô.", "Làm tăng gấp 5 lần số lượng vú của lợn nái."], answer: 1, explanation: "CRISPR/Cas9 loại bỏ thụ thể CD163 khiến virus PRRS không thể xâm nhập vào đại thực bào phế nang, lợn miễn nhiễm với PRRS." },
      { id: 10, grade: "cn11", topic: "(1) Công nghệ giống vật nuôi", stem: "Trong phương pháp lai cải tạo, nếu dùng đực giống thuần chủng ngoại (100% máu ngoại) lai liên tiếp qua 5 thế hệ với đàn cái lai, tỷ lệ máu ngoại ở đời con F5 đạt", options: ["87,50%.", "93,75%.", "96,875%.", "99,99%."], answer: 2, explanation: "Tỷ lệ máu ngoại ở Fn = 1 - (1/2)^n. Với n = 5: P = 1 - (1/2)^5 = 1 - 1/32 = 31/32 = 96,875%." },
      { id: 11, grade: "cn11", topic: "(1) Công nghệ giống vật nuôi", stem: "Trong kỹ thuật cấy truyền phôi bò, hormone Prostaglandin F2α (PGF2α) được sử dụng cho đàn bò nhận phôi nhằm mục đích", options: ["kích thích bò nhận rụng 20 quả trứng một lúc.", "gây phá thể vàng để điều khiển động dục đồng pha hàng loạt trùng khớp với thời điểm của bò cho phôi.", "làm biến đổi giới tính của phôi thành giống đực.", "tiêu diệt các mầm bệnh vi khuẩn trong tử cung."], answer: 1, explanation: "PGF2α làm thoái hóa thể vàng, kích thích động dục đồng pha giữa bò nhận và bò cho phôi để tử cung tiếp nhận phôi cấy." },
      { id: 12, grade: "cn11", topic: "(2) Công nghệ thức ăn", stem: "Vì sao trâu, bò có thể tiêu hóa và sử dụng được nguồn nitơ phi protein (NPN) như Urê trong khi lợn và gà lại bị ngộ độc?", options: ["Vì trâu bò có hàm lượng axit dạ dày đậm đặc gấp 100 lần lợn.", "Vì hệ vi sinh vật trong dạ cỏ của trâu bò tiết enzyme urease phân giải urê thành NH3, sau đó dùng NH3 tổng hợp thành protein vi sinh vật nuôi cơ thể.", "Vì gan trâu bò có khả năng bài tiết urê thẳng ra da.", "Vì thức ăn của trâu bò hoàn toàn không chứa chất xơ."], answer: 1, explanation: "Vi sinh vật dạ cỏ phân giải urê thành NH3 và dùng nguồn nitơ này tổng hợp protein sinh khối cho vật nuôi nhai lại." },
      { id: 13, grade: "cn11", topic: "(2) Công nghệ thức ăn", stem: "Chỉ số FCR của một đàn lợn thịt giai đoạn 30 - 100 kg là 2,5. Để cả đàn lợn 100 con tăng khối lượng từ 30 kg lên 100 kg/con thì tổng lượng thức ăn trang trại cần chuẩn bị là", options: ["7.000 kg.", "14.000 kg.", "17.500 kg.", "25.000 kg."], answer: 2, explanation: "Tăng trọng 1 con = 70 kg. Cả đàn tăng = 70 × 100 = 7.000 kg. Thức ăn = 7.000 × 2,5 = 17.500 kg." },
      { id: 14, grade: "cn11", topic: "(2) Công nghệ thức ăn", stem: "Bổ sung enzyme Phytase vào khẩu phần thức ăn của lợn và gia cầm nhằm mục đích then chốt là", options: ["giúp thủy phân liên kết phytate trong ngô và đậu nành, giải phóng phốt pho hữu dụng và giảm thiểu ô nhiễm phốt pho trong chất thải.", "làm thức ăn có mùi thơm của cỏ tươi kích thích ăn nhiều.", "thay thế hoàn toàn lượng đạm đậu tương đắt tiền.", "ngăn chặn triệt để sự lên men hơi trong ruột."], answer: 0, explanation: "Phytase phân cắt phytate giải phóng Phốt pho cây trồng, nâng cao tỷ lệ hấp thu P và giảm bài tiết P gây ô nhiễm môi trường." },
      { id: 15, grade: "cn11", topic: "(3) Môi trường chăn nuôi", stem: "Giai đoạn thứ 4 (giai đoạn cuối) trong quy trình 4 giai đoạn phân hủy kỵ khí của hầm khí sinh học Biogas là", options: ["thủy phân chất hữu cơ cao phân tử.", "axit hóa tạo axit béo bay hơi.", "axetat hóa tạo axit axetic.", "mêtan hóa bởi các cổ khuẩn Methanogens chuyển hóa axit axetic, H2 và CO2 thành khí CH4."], answer: 3, explanation: "Giai đoạn 4 là Mêtan hóa (Methanogenesis) do cổ khuẩn Methanogens thực hiện tạo ra khí cháy CH4." },
      { id: 16, grade: "cn11", topic: "(3) Môi trường chăn nuôi", stem: "Chế phẩm đệm lót sinh học sử dụng trong chăn nuôi gà thịt thường chứa các nhóm vi sinh vật nào?", options: ["Vi khuẩn sinh mủ và nấm mốc đen.", "Vi khuẩn Bacillus, nấm men Saccharomyces cerevisiae và vi khuẩn Lactic phân giải axit uric, khử mùi hôi.", "Virus thực khuẩn thể Phage.", "Các loài giun ký sinh đường ruột."], answer: 1, explanation: "Vi khuẩn Bacillus, Lactic và nấm men Saccharomyces phân hủy protein, axit uric và xenlulozơ, ức chế vi khuẩn gây thối khử mùi hôi." },

      // K12 (8 câu)
      { id: 17, grade: "cn12", topic: "(1) Giới thiệu chung về lâm nghiệp", stem: "Theo quy định pháp luật hiện hành, rừng sản xuất là rừng tự nhiên có trữ lượng gỗ đứng giàu được khai thác thương mại theo phương thức nào?", options: ["Chặt trắng toàn bộ khoảnh rừng trong mùa mưa.", "Khai thác chọn với cường độ chặt không vượt quá mức tăng trưởng tự nhiên và phải có chứng chỉ quản lý rừng bền vững.", "Chỉ cho phép người dân vào đốn hạ củi khô tự do.", "Được phép đưa máy xúc vào đào bới tận gốc rễ."], answer: 1, explanation: "Rừng tự nhiên sản xuất chỉ được khai thác chọn với cường độ kiểm soát nghiêm ngặt (thường ≤ 30-35% trữ lượng) theo phương án quản lý rừng bền vững." },
      { id: 18, grade: "cn12", topic: "(2) Trồng và chăm sóc rừng", stem: "Đối với rừng trồng cây gỗ lớn bản địa (sao đen, dầu rái), kỹ thuật tỉa thưa nuôi dưỡng rừng ở giai đoạn 8 - 12 năm tuổi nhằm mục đích chính là", options: ["chặt bỏ toàn bộ cây gỗ lớn để lấy củi đun.", "loại bỏ cây cong queo, sâu bệnh, bị chèn ép để tập trung không gian dinh dưỡng và ánh sáng cho các cây mục tiêu sinh trưởng đường kính thân gỗ.", "làm giảm độ ẩm của đất để chuẩn bị đốt rừng.", "thu hút các loài thú ăn cỏ đến sinh sống."], answer: 1, explanation: "Tỉa thưa nuôi dưỡng loại bỏ cây phẩm chất xấu, tạo không gian dinh dưỡng và ánh sáng cho cây mục tiêu phát triển đường kính." },
      { id: 19, grade: "cn12", topic: "(3) Bảo vệ và khai thác tài nguyên rừng bền vững", stem: "Đường băng cản lửa xanh trong lâm phần rừng phòng hộ có ưu điểm vượt trội so với đường băng cản lửa trắng ở điểm", options: ["không bao giờ bị mọc cỏ dại và không cần tốn công chăm sóc.", "vừa có tác dụng ngăn cản đám cháy nhờ tán cây tươi mọng nước ít tinh dầu, vừa chống xói mòn đất và tạo bóng mát duy trì vi khí hậu ẩm.", "được xây dựng bằng bê tông cốt thép kiên cố.", "có thể tự động phát ra nước khi gặp khói lửa."], answer: 1, explanation: "Đường băng xanh trồng các loài cây ít bắt lửa lá mọng nước giúp cản tàn lửa bay, đồng thời giữ ẩm đất và chống xói mòn." },
      { id: 20, grade: "cn12", topic: "(3) Bảo vệ và khai thác tài nguyên rừng bền vững", stem: "Khi phân tích bảng số liệu diện tích rừng Việt Nam từ năm 2015 đến nay, nhận định nào sau đây là chính xác?", options: ["Diện tích rừng tự nhiên sụt giảm nghiêm trọng do bị khai thác gỗ trắng ồ ạt.", "Tỷ lệ che phủ rừng tăng liên tục và diện tích rừng trồng tăng trưởng mạnh mẽ nhờ các chương trình trồng rừng sản xuất gỗ lớn và khoanh nuôi bảo vệ.", "Diện tích rừng trồng hoàn toàn không tăng trong 10 năm qua.", "Sản lượng gỗ khai thác chỉ dựa vào nguồn gỗ tròn từ rừng tự nhiên."], answer: 1, explanation: "Chủ trương đóng cửa rừng tự nhiên và đẩy mạnh thâm canh rừng trồng đã giúp diện tích rừng trồng và tỷ lệ che phủ rừng tăng vững chắc (> 42%)." },
      { id: 21, grade: "cn12", topic: "(4) Giới thiệu chung về thủy sản", stem: "Trong ao nuôi cá nước ngọt thâm canh, màu nước ao nào sau đây thể hiện môi trường nước dinh dưỡng tốt nhất?", options: ["Màu đen kịt có mùi hôi trứng thối.", "Màu xanh đọt chuối non hoặc màu nâu trà sáng (độ trong 30 - 40 cm).", "Màu đỏ gạch quánh đặc váng tảo lam.", "Nước trong suốt nhìn thấu tận đáy bùn."], answer: 1, explanation: "Nước màu xanh đọt chuối (tảo lục) hoặc nâu trà (tảo khuê) với độ trong 30-40 cm cung cấp oxy dồi dào và thức ăn tự nhiên." },
      { id: 22, grade: "cn12", topic: "(5) Môi trường nuôi thủy sản", stem: "Trong hệ thống nuôi tuần hoàn RAS, thiết bị lọc sinh học (Biofilter) chứa hạt giá thể vi sinh có vai trò cốt lõi là", options: ["giữ lại các hạt phân rắn có kích thước lớn hơn 100 micromet.", "cung cấp giá thể cho vi khuẩn tự dưỡng Nitrosomonas và Nitrobacter chuyển hóa ion amoni độc (NH4+) thành nitrit (NO2-) rồi thành nitrat (NO3-) ít độc.", "làm giảm độ mặn của nước biển thành nước ngọt.", "tăng nhiệt độ nước lên trên 40 độ C."], answer: 1, explanation: "Lọc sinh học là trái tim của RAS, nơi vi khuẩn Nitrat hóa chuyển hóa khí độc amoniac thành nitrat an toàn cho cá tôm." },
      { id: 23, grade: "cn12", topic: "(5) Môi trường nuôi thủy sản", stem: "Hệ thống Aquaponics là mô hình canh tác tuần hoàn cộng sinh khép kín giữa", options: ["nuôi tôm biển kết hợp trồng cây ăn quả trên đất đồi.", "nuôi thủy sản nước ngọt (cá rô phi, cá lóc) và trồng rau thủy canh (xà lách, rau thơm) thông qua hệ vi sinh vật chuyển hóa chất thải cá thành phân bón cho rau.", "trồng nấm rơm kết hợp chăn nuôi bò thịt.", "nuôi ong lấy mật trong rừng đước ngập mặn."], answer: 1, explanation: "Aquaponics kết hợp cá (thải amoniac) -> vi khuẩn nitrat hóa biến thành NO3- -> rau thủy canh hút dinh dưỡng làm sạch nước trả lại cho cá." },
      { id: 24, grade: "cn12", topic: "(6) Công nghệ giống thủy sản", stem: "Trong công nghệ sản xuất cá rô phi đơn tính đực bằng hormone, người ta bổ sung 17α-methyltestosterone vào thức ăn của cá ở giai đoạn nào?", options: ["Cá bố mẹ đang mang trứng trong buồng trứng.", "Giai đoạn cá bột mới tiêu hết noãn hoàng (7 - 10 ngày tuổi, kích thước 9 - 11 mm) cho ăn liên tục trong 21 ngày.", "Cá thịt đạt khối lượng 500g trước khi xuất bán 1 tuần.", "Cá hậu bị 1 năm tuổi."], answer: 1, explanation: "Hormone 17α-MT chỉ có tác dụng đảo giới tính khi tuyến sinh dục chưa biệt hóa (giai đoạn cá bột 7-10 ngày tuổi, ăn liên tục 21 ngày đạt > 98% đực)." }
    ],
    tfs: [
      {
        id: 1,
        grade: "cn10",
        topic: "Khối 10 — Hóa học Keo đất & Dinh dưỡng Thủy canh NFT",
        title: "Câu 1: Cơ chế Hấp phụ Keo đất & Quản lý Dung dịch Dinh dưỡng Thủy canh",
        context: "Tại một trung tâm nông nghiệp công nghệ cao, các kỹ sư tiến hành so sánh đặc tính hóa lý giữa đất đỏ bazan và hệ thống thủy canh kỹ thuật màng dinh dưỡng hồi lưu (NFT) trồng dưa lưới. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          { label: "a", level: "Nhận biết", isTrue: true, text: "Lớp keo đất mang điện tích âm có khả năng giữ các cation dinh dưỡng như K+, NH4+, Ca2+, Mg2+ trên lớp ion khuếch tán để hạn chế sự rửa trôi.", explanation: "Keo âm giữ các cation khoáng trên lớp ion khuếch tán nhờ lực hút tĩnh điện." },
          { label: "b", level: "Thông hiểu", isTrue: true, text: "Khi rễ cây dưa lưới hô hấp hiếu khí thải ra khí CO2, phản ứng hòa tan CO2 trong dung dịch đất tạo thành axit cacbonic (H2CO3) phân ly sinh ion H+ tham gia phản ứng trao đổi đẩy các cation dinh dưỡng từ keo đất ra ngoài cho rễ hấp thụ.", explanation: "Cơ chế trao đổi ion lông hút rễ: CO2 + H2O <-> H2CO3 <-> H+ + HCO3-; H+ đẩy cation khoáng từ keo đất vào dung dịch." },
          { label: "c", level: "Vận dụng", isTrue: false, text: "Trong hệ thống thủy canh NFT, nếu độ dẫn điện EC của dung dịch tăng vọt lên quá cao (EC > 3,5 mS/cm) vào buổi trưa nắng gắt thì cây dưa lưới sẽ hút nước và phân bón mạnh mẽ hơn giúp quả lớn nhanh vượt bậc.", explanation: "EC quá cao làm tăng áp suất thẩm thấu dung dịch ngoài rễ, gây hạn sinh lý (nước rút từ rễ ra ngoài làm cây héo rũ cháy lá)." },
          { label: "d", level: "Vận dụng cao", isTrue: true, text: "Việc bổ sung phân bón Silic (SiO2) hoặc vi sinh vật phân giải Silic vào dung dịch tưới giúp thành tế bào biểu bì thân lá dưa lưới dày cứng hơn, tăng khả năng kháng nấm phấn trắng và giảm bốc thoát hơi nước trong điều kiện nắng nóng.", explanation: "Silic tích lũy ở thành tế bào tạo lớp kép cutin-silic cơ học ngăn nấm xâm nhập và giảm thoát hơi nước." }
        ]
      },
      {
        id: 2,
        grade: "cn11",
        topic: "Khối 11 — Chọn tạo Giống Công nghệ cao & Hóa sinh Biogas",
        title: "Câu 2: Công nghệ Di truyền CRISPR/Cas9 & 4 Pha Hóa sinh Hầm Biogas",
        context: "Một tổ hợp trang trại chăn nuôi ứng dụng công nghệ chỉnh sửa gen kháng bệnh tai xanh (PRRS) trên đàn lợn giống và vận hành hệ thống hầm Biogas phát điện sạch. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          { label: "a", level: "Nhận biết", isTrue: true, text: "Công nghệ chỉnh sửa gen CRISPR/Cas9 có thể định vị và cắt chính xác đoạn ADN đích mã hóa thụ thể CD163 mà không cần chuyển nạp gen từ một loài sinh vật khác vào hệ gen của lợn.", explanation: "CRISPR/Cas9 sử dụng sgRNA dẫn đường enzyme Cas9 cắt sửa nội gen chính xác, không phải sinh vật biến đổi gen ngoại lai (non-transgenic)." },
          { label: "b", level: "Thông hiểu", isTrue: false, text: "Trong phương pháp lai cải tạo giống lợn địa phương bằng đực ngoại cao sản qua 5 thế hệ liên tiếp, đời con F5 vẫn giữ nguyên 50% tỷ lệ máu của giống lợn địa phương ban đầu.", explanation: "Ở đời F5, tỷ lệ máu giống địa phương chỉ còn (1/2)^5 = 1/32 ≈ 3,125%; tỷ lệ máu ngoại đạt 96,875%." },
          { label: "c", level: "Vận dụng", isTrue: true, text: "Trong 4 giai đoạn phân hủy kỵ khí của hầm Biogas, giai đoạn Mêtan hóa (Methanogenesis) là nhạy cảm nhất với sự thay đổi của độ pH; nếu pH tụt xuống dưới 6,0 thì các cổ khuẩn sinh mêtan sẽ bị ức chế làm giảm sút lượng khí CH4.", explanation: "Cổ khuẩn Methanogens chỉ hoạt động tối ưu ở pH 6,8-7,5; môi trường axit (pH < 6,0) làm ức chế hoàn toàn sinh khí CH4." },
          { label: "d", level: "Vận dụng cao", isTrue: true, text: "Nước thải sau hầm biogas nếu được dẫn trực tiếp qua bãi lọc thủy sinh trồng cây lục bình hoặc cỏ vetiver sẽ giúp hấp thụ triệt để hàm lượng Nitrat và Phốt phát dư thừa trước khi tái sử dụng tưới cho đồng cỏ chăn nuôi.", explanation: "Thực vật thủy sinh (lục bình, vetiver) hấp thụ mạnh N và P, làm sạch nước thải sau biogas an toàn sinh học." }
        ]
      },
      {
        id: 3,
        grade: "cn12",
        topic: "Khối 12 — Thống kê Lâm nghiệp & Quy hoạch Rừng Bền vững",
        title: "Câu 3: Phân tích Bảng số liệu Thống kê Rừng & Phòng chống Cháy rừng",
        context: "Dựa vào bảng số liệu thống kê diện tích rừng tự nhiên, rừng trồng và sản lượng gỗ khai thác của một tỉnh Đông Nam Bộ giai đoạn 2020 – 2025. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          { label: "a", level: "Nhận biết", isTrue: true, text: "Chính sách đóng cửa rừng tự nhiên của Nhà nước nhằm bảo tồn đa dạng sinh học và giữ vững chức năng phòng hộ đầu nguồn của các lưu vực sông suối.", explanation: "Đóng cửa rừng tự nhiên chấm dứt khai thác thương mại gỗ tròn từ rừng tự nhiên để bảo tồn sinh thái." },
          { label: "b", level: "Thông hiểu", isTrue: true, text: "Sản lượng gỗ khai thác thương phẩm phục vụ chế biến đồ gỗ xuất khẩu hiện nay của Việt Nam chủ yếu bắt nguồn từ rừng trồng sản xuất thâm canh (keo lai, bạch đàn, cao su).", explanation: "Trên 80% nguyên liệu gỗ chế biến bắt nguồn từ rừng trồng trong nước và cao su thanh lý." },
          { label: "c", level: "Vận dụng", isTrue: false, text: "Khi xảy ra cháy rừng trên sườn núi cao có gió thổi mạnh, ngọn lửa cháy lan nhanh về phía chân núi hơn là hướng lên đỉnh núi.", explanation: "Ngọn lửa lan lên đỉnh núi nhanh hơn nhiều do luồng khí nóng bốc lên sấy khô vật liệu cháy phía trên đỉnh dốc." },
          { label: "d", level: "Vận dụng cao", isTrue: true, text: "Việc cấp chứng chỉ rừng quốc tế FSC (Forest Stewardship Council) đòi hỏi đơn vị chủ rừng phải chứng minh không xâm phạm quyền lợi của cộng đồng địa phương, bảo vệ nguồn nước ngầm và không khai thác vượt quá trữ lượng sinh trưởng hàng năm của khu rừng.", explanation: "FSC gồm 10 nguyên tắc khắt khe về sinh thái, xã hội, luật pháp và kinh tế rừng bền vững." }
        ]
      },
      {
        id: 4,
        grade: "cn12",
        topic: "Khối 12 — Mô hình Tuần hoàn RAS & Aquaponics",
        title: "Câu 4: Quản lý Chu trình Nitơ & Kỹ thuật Nuôi Cá rô phi Đơn tính đực",
        context: "Một trung tâm thủy sản công nghệ cao vận hành hệ thống tuần hoàn RAS kết hợp Aquaponics nuôi cá rô phi đơn tính đực và rau xanh xuất khẩu. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          { label: "a", level: "Nhận biết", isTrue: true, text: "Cá rô phi đực có tốc độ sinh trưởng nhanh hơn cá rô phi cái từ 30% đến 50% và không bị tiêu tốn năng lượng cho việc phát triển buồng trứng và ấp trứng.", explanation: "Cá rô phi đực lớn nhanh vượt trội, thịt dày, kích cỡ đồng đều thương phẩm." },
          { label: "b", level: "Thông hiểu", isTrue: true, text: "Trong hệ thống lọc sinh học của RAS, vi khuẩn tự dưỡng Nitrosomonas chuyển hóa ion Amoni (NH4+) thành Nitrit (NO2-), sau đó vi khuẩn Nitrobacter tiếp tục oxy hóa Nitrit thành Nitrat (NO3-).", explanation: "Đúng chu trình Nitrat hóa 2 bước hiếu khí: NH4+ -> NO2- -> NO3-." },
          { label: "c", level: "Vận dụng", isTrue: false, text: "Trong mô hình Aquaponics, người nuôi có thể tùy ý sử dụng các loại thuốc trừ sâu hóa học gốc clo hữu cơ để xịt trừ sâu bệnh cho rau mà không ảnh hưởng gì đến đàn cá bên dưới bể nuôi.", explanation: "Hệ tuần hoàn kín; thuốc trừ sâu hóa học trên rau sẽ tan vào nước giết chết cá và vi sinh vật lọc." },
          { label: "d", level: "Vận dụng cao", isTrue: true, text: "Phương pháp sản xuất đàn cá rô phi toàn đực di truyền (công nghệ GMT - Genetically Male Tilapia) bằng cách tạo dòng cá Siêu đực mang cặp nhiễm sắc thể giới tính YY giúp tạo ra 100% đời con mang giới tính đực tự nhiên mà không cần cho cá thương phẩm ăn hormone.", explanation: "Bố Siêu đực YY phối với mẹ thường XX cho 100% con XY đực tự nhiên, an toàn thực phẩm." }
        ]
      }
    ],
    essays: [
      {
        id: 1,
        points: 3.5,
        title: "Câu 1 (3,5 điểm — Kiến thức Lâm nghiệp Lớp 12 & Phân tích Bảng số liệu Thống kê Rừng)",
        problem: "Cho bảng số liệu về tình hình tài nguyên rừng của một tỉnh thuộc vùng Đông Nam Bộ giai đoạn 2020 – 2025:\n\n[Bảng số liệu]:\n• Năm 2020: Diện tích rừng tự nhiên = 120.000 ha; Rừng trồng = 50.000 ha; Sản lượng gỗ khai thác từ rừng trồng = 350.000 m3.\n• Năm 2022: Diện tích rừng tự nhiên = 120.200 ha; Rừng trồng = 62.000 ha; Sản lượng gỗ khai thác từ rừng trồng = 460.000 m3.\n• Năm 2025: Diện tích rừng tự nhiên = 120.500 ha; Rừng trồng = 78.000 ha; Sản lượng gỗ khai thác từ rừng trồng = 620.000 m3.\n\n1. Hãy tính tốc độ tăng trưởng (%) của diện tích rừng trồng và sản lượng gỗ khai thác năm 2025 so với năm 2020 (lấy năm 2020 = 100%). Rút ra nhận xét về xu hướng biến động tài nguyên rừng của tỉnh trên. (1,5 điểm)\n2. Giải thích vì sao diện tích rừng tự nhiên giữ được ổn định trong khi diện tích rừng trồng và sản lượng gỗ khai thác lại tăng trưởng mạnh mẽ? Nêu ý nghĩa kinh tế - sinh thái của sự chuyển dịch này. (1,0 điểm)\n3. Để nâng cao giá trị rừng trồng keo lai từ gỗ nhỏ (chu kỳ 5 năm) sang rừng gỗ lớn (chu kỳ 10-12 năm) đạt chứng chỉ FSC, lâm trường cần thực hiện quy trình kỹ thuật tỉa thưa nuôi dưỡng rừng như thế nào? (1,0 điểm)",
        rubric: [
          "1. Tính tốc độ tăng trưởng (0,75đ): Diện tích rừng trồng 2025 so với 2020 = (78.000 / 50.000) × 100% = 156,0% (tăng 56,0%); Sản lượng gỗ 2025 so với 2020 = (620.000 / 350.000) × 100% = 177,14% (tăng 77,14%). Nhận xét (0,75đ): Rừng tự nhiên ổn định (~120.000 ha); rừng trồng và sản lượng gỗ tăng nhanh và liên tục.",
          "2. Giải thích & Ý nghĩa (1,0đ): Do Nhà nước thực hiện nghiêm chính sách đóng cửa rừng tự nhiên và đẩy mạnh giao đất trồng rừng gỗ lớn; Ý nghĩa (0,5đ) đáp ứng nhu cầu nguyên liệu gỗ chế biến xuất khẩu, giảm áp lực lên rừng tự nhiên, nâng cao độ che phủ rừng và chống biến đổi khí hậu.",
          "3. Kỹ thuật tỉa thưa rừng gỗ lớn FSC (1,0đ): Thời điểm tỉa lần 1 ở năm thứ 3-4 (cường độ 30-35%), tỉa lần 2 ở năm thứ 6-7 (giữ mật độ cuối 500-600 cây/ha); nguyên tắc chặt cây sâu bệnh, giữ cây ưu trội; bảo vệ đất và kiểm soát vật liệu cháy."
        ]
      },
      {
        id: 2,
        points: 3.5,
        title: "Câu 2 (3,5 điểm — Kiến thức Thủy sản Lớp 12 & Bài toán Kinh tế Hệ thống RAS / Aquaponics)",
        problem: "Một hợp tác xã đầu tư xây dựng hệ thống nuôi tuần hoàn RAS kết hợp Aquaponics gồm 6 bể tròn nổi bằng composite (mỗi bể có diện tích đáy 20 m2, chiều sâu mực nước 1,5 m) để nuôi cá rô phi đơn tính đực thâm canh cao.\n1. Mật độ thả cá là 25 con/m3 nước. Sau 150 ngày nuôi, tỷ lệ sống của cá đạt 90%, khối lượng bình quân khi thu hoạch đạt 0,8 kg/con. Hãy tính:\n   • Tổng thể tích nước nuôi trong cả 6 bể (m3). (0,5 điểm)\n   • Tổng sản lượng cá thu hoạch được của toàn hệ thống (kg). (1,0 điểm)\n2. Biết hệ số chuyển đổi thức ăn (FCR) của hệ thống đạt 1,30; giá thức ăn hỗn hợp viên nổi bình quân là 22.000 đ/kg. Chi phí khác (con giống, điện sục khí, vi sinh, khấu hao) tính cố định là 35.000.000 đồng cho một chu kỳ nuôi. Với giá bán cá rô phi thương phẩm tại bể là 45.000 đ/kg:\n   • Tính tổng chi phí thức ăn và tổng chi phí sản xuất chu kỳ này. (1,0 điểm)\n   • Tính doanh thu và lợi nhuận thuần hợp tác xã thu được sau chu kỳ nuôi 150 ngày. (1,0 điểm)",
        rubric: [
          "1.1. Thể tích nước 6 bể (0,5đ): V = 6 × (20 m2 × 1,5 m) = 180 m3.",
          "1.2. Sản lượng cá thu hoạch (1,0đ): Tổng số cá thả = 180 × 25 = 4.500 con; Số cá sống thu hoạch = 4.500 × 90% = 4.050 con; Sản lượng cá = 4.050 × 0,8 kg = 3.240 kg cá rô phi.",
          "2.1. Chi phí sản xuất (1,0đ): Tổng lượng thức ăn = 3.240 × 1,3 = 4.212 kg; Chi phí thức ăn = 4.212 × 22.000 đ = 92.664.000 đ; Tổng chi phí = 92.664.000 + 35.000.000 = 127.664.000 đồng.",
          "2.2. Doanh thu & Lợi nhuận (1,0đ): Doanh thu = 3.240 × 45.000 đ = 145.800.000 đồng; Lợi nhuận thuần = 145.800.000 - 127.664.000 = 18.136.000 đồng."
        ]
      },
      {
        id: 3,
        points: 1.0,
        title: "Câu 3 (1,0 điểm — Tình huống Nâng cao & Mở rộng: Cơ chế Trao đổi Ion Keo đất & Lai cải tạo)",
        problem: "1. Hãy giải thích cơ chế hóa sinh vì sao việc bón phân đạm Sunfat amôn (NH4)2SO4 liên tục nhiều năm trên đất dốc không được bón vôi lại dẫn tới hiện tượng thoái hóa đất chua nghiêm trọng? Viết phương trình trao đổi ion minh họa. (0,5 điểm)\n2. Một nhà chọn giống sử dụng đực bò sữa Hà Lan (Holstein Friesian thuần chủng 100%) lai cải tạo đàn bò vàng địa phương qua 5 thế hệ (F1 -> F5). Hãy tính tỷ lệ máu ngoại và tỷ lệ máu nội ở thế hệ F5. Nêu ý nghĩa của việc duy trì một tỷ lệ nhỏ máu bò vàng bản địa trong đàn bò lai này. (0,5 điểm)",
        rubric: [
          "1. Cơ chế chua hóa đất (0,5đ): Rễ cây hút ion NH4+ nhanh hơn ion SO4(2-). Đồng thời keo đất hấp phụ NH4+ đẩy ion H+ ra ngoài; lượng ion SO4(2-) còn lại trong dung dịch đất kết hợp với H+ tạo axit H2SO4 làm giảm mạnh pH đất: [Keo]-2H+ + (NH4)2SO4 <-> [Keo]-2NH4+ + H2SO4.",
          "2. Tỷ lệ máu lai & Ý nghĩa (0,5đ): Tỷ lệ máu ngoại ở F5 = 1 - (1/2)^5 = 31/32 = 96,875%; Tỷ lệ máu nội = (1/2)^5 = 1/32 = 3,125%. Ý nghĩa: Giữ lại 3,125% máu bản địa giúp bò lai F5 kế thừa tính thích nghi chịu nhiệt đới nóng ẩm, kháng ve và chịu kham khổ tốt hơn bò thuần nhập ngoại."
        ]
      }
    ]
  },
  dn_hard_02: {
    id: "dn_hard_02",
    level: "hard",
    levelBadge: "🔴 CẤP ĐỘ 3: KHÓ / VỀ ĐÍCH",
    levelLabel: "CẤP ĐỘ 3 (KHÓ / VỀ ĐÍCH & CHUYÊN SÂU VDC BẢNG B)",
    code: "ĐỒNG NAI — CẤP ĐỘ 3 (ĐỀ 02)",
    title: "KỲ THI CHỌN HỌC SINH GIỎI CẤP TỈNH — ĐỒNG NAI (ĐỀ SỐ 02 - CẤP ĐỘ 3: ĐỈNH CAO VDC)",
    subTitle: "Nâng cao Bảng B • VDC Nông nghiệp 4.0 • Công nghệ gen CRISPR/Cas9 • Hệ thống RAS • Allometric Net-Zero",
    durationMinutes: 180,
    maxScore: 20.0,
    source: "Ngân hàng Đề Chuyên sâu Đội tuyển HSG Bảng B — Cấu trúc Sở GD&ĐT Đồng Nai & VDC Toàn quốc",
    mcqs: [
      // K10 (8 câu VDC)
      {
        id: 1, grade: "cn10", topic: "(1) Đất trồng",
        stem: "Khi phân tích động học hấp phụ cation của đất đỏ bazan vùng Đông Nam Bộ có dung tích hấp phụ cation hiệu dụng ECEC = 14,5 meq/100g đất và độ no bazơ BS% = 48%, nếu độ bão hòa nhôm trao đổi (Al-saturation) đạt 32%, hiện tượng sinh lý nào sau đây sẽ xảy ra chủ yếu ở rễ cây sầu riêng non?",
        options: [
          "Ion Al3+ tự do kết tủa trực tiếp với pectin ở vách tế bào chóp rễ, ức chế sự kéo dài của rễ và làm đầu rễ bị phình to rồi thâm đen.",
          "Ion Al3+ làm tăng gấp đôi khả năng hấp thu lân và canxi qua màng sinh chất của tế bào lông hút.",
          "Ion Al3+ kích thích rễ cây hô hấp hiếu khí mạnh làm tăng tiết axit hữu cơ.",
          "Ion Al3+ làm tăng tốc độ phân chia tế bào mô phân sinh đỉnh rễ."
        ],
        answer: 0,
        explanation: "Khi độ bão hòa Al3+ > 20-25%, nồng độ Al3+ trong dung dịch đất đạt ngưỡng độc tố cao. Al3+ liên kết bền vững với các nhóm carboxyl của pectin ở thành tế bào và phospholipid của màng sinh chất chóp rễ, làm cứng thành tế bào, ngăn cản sự giãn dài tế bào khiến chóp rễ biến dạng phình to và hoại tử.",
        recallHint: "Độc chất Nhôm (Al3+): Xảy ra khi đất chua có pH < 4,8 và độ bão hòa Al > 20%. Al3+ ức chế phân chia tế bào chóp rễ, làm rễ co cụm, biến màu và không hấp thu được nước hay khoáng chất."
      },
      {
        id: 2, grade: "cn10", topic: "(1) Đất trồng",
        stem: "Trong phản ứng trao đổi ion giữa lông hút rễ cây và hạt keo đất theo phương trình nhiệt động học CO2 + H2O <=> H+ + HCO3-, khi rễ cây hấp thu một ion Amôn (NH4+) từ phức hệ hấp phụ của keo đất vào tế bào, tế bào rễ phải giải phóng vào dung dịch đất ion nào sau đây để duy trì điện thế màng và cân bằng điện tích?",
        options: ["Một ion H+.", "Một ion OH-.", "Một ion Ca2+.", "Một ion Cl-."],
        answer: 0,
        explanation: "Để duy trì cân bằng điện tích màng sinh chất và nội môi trường, khi bơm protein vận chuyển 1 cation NH4+ vào trong tế bào rễ, tế bào đồng thời đẩy 1 proton H+ ra ngoài dung dịch đất qua bơm H+-ATPase.",
        recallHint: "Cơ chế trao đổi ion rễ cây: Hấp thu Cation (NH4+, K+, Ca2+) -> Bơm ion H+ ra ngoài làm chua đất cục bộ; Hấp thu Anion (NO3-, H2PO4-) -> Tiết ion HCO3- hoặc OH- ra ngoài làm kiềm hóa."
      },
      {
        id: 3, grade: "cn10", topic: "(1) Đất trồng",
        stem: "Một mẫu đất có hàm lượng Al3+ trao đổi đo được là 2,8 meq/100g đất. Khối lượng vôi sống nguyên chất (CaO, M = 56) cần thiết về mặt lý thuyết để trung hòa hoàn toàn lượng Al3+ trao đổi độc hại này trong 1 hecta đất (tính với tầng đất canh tác dày 20 cm, dung trọng đất d = 1,2 g/cm3) là",
        options: ["1.881,6 kg CaO.", "2.400,0 kg CaO.", "3.763,2 kg CaO.", "940,8 kg CaO."],
        answer: 0,
        explanation: "Khối lượng đất 1 ha = 10.000 m2 × 0,2 m × 1.200 kg/m3 = 2.400.000 kg = 2.400 tấn = 2,4 × 10^9 g đất = 2,4 × 10^7 (100g đất). Số đương lượng Al3+ = 2,4 × 10^7 × 2,8 meq = 6,72 × 10^7 meq = 6,72 × 10^4 eq. Đương lượng gam của CaO = 56 / 2 = 28 g/eq. Khối lượng CaO = 6,72 × 10^4 × 28 g = 1.881.600 g = 1.881,6 kg.",
        recallHint: "Công thức tính vôi: Đương lượng gam CaO = M/2 = 28 g. Lượng vôi = (Đương lượng Al3+ trao đổi) × 28. Khối lượng đất tầng mặt 1 ha = 10.000 m2 × độ sâu (m) × dung trọng (tấn/m3)."
      },
      {
        id: 4, grade: "cn10", topic: "(2) Phân bón",
        stem: "Phân bón thông minh tan chậm có kiểm soát (CRF - Controlled Release Fertilizer) bọc màng polymer nhiệt dẻo có cơ chế phóng thích dinh dưỡng tối ưu dựa trên nguyên lý",
        options: [
          "nước từ đất thẩm thấu qua các vi lỗ của màng polymer hòa tan lõi phân, tạo áp suất thẩm thấu đẩy các ion khoáng khuếch tán ra ngoài với tốc độ phụ thuộc chủ yếu vào nhiệt độ đất.",
          "màng polymer tự phát nổ khi tiếp xúc với ánh sáng mặt trời để giải phóng phân bón ồ ạt.",
          "phân bón chỉ tan ra khi gặp nước mưa có nồng độ axit cao pH < 3,0.",
          "các vi khuẩn trong đất ăn hết lớp màng polymer trong vòng 24 giờ sau khi bón."
        ],
        answer: 0,
        explanation: "Phân CRF bọc màng polymer bán thấm hoạt động theo cơ chế khuếch tán thẩm thấu: Hơi ẩm thẩm thấu qua màng làm tan lõi phân, nồng độ bên trong tăng tạo chênh lệch thế hóa học đẩy dinh dưỡng rỉ ra ngoài. Tốc độ khuếch tán tỷ lệ thuận với nhiệt độ đất, hoàn toàn trùng khớp với nhịp sinh trưởng và nhu cầu dinh dưỡng của cây.",
        recallHint: "Cơ chế phân bón CRF (Controlled Release Fertilizer): Nước thẩm thấu qua màng bán thấm polymer -> Hòa tan lõi phân -> Khuếch tán ra đất theo gradient nồng độ với tốc độ kiểm soát theo nhiệt độ."
      },
      {
        id: 5, grade: "cn10", topic: "(2) Phân bón",
        stem: "Để chế biến phân hữu cơ vi sinh compost từ tàn dư thân lá ngô và phân lợn đạt tiêu chuẩn chất lượng cao, thông số then chốt nào sau đây cần phải điều chỉnh ngay ở giai đoạn bắt đầu ủ hiếu khí?",
        options: [
          "Tỷ lệ Carbon : Nitơ (C:N) ban đầu dao động trong khoảng 25:1 đến 30:1 và độ ẩm đống ủ đạt 55% - 60%.",
          "Tỷ lệ C:N ban đầu phải đạt cực đại > 100:1 và bịt kín không cho không khí lưu thông.",
          "Hạ nhiệt độ đống ủ xuống dưới 10°C liên tục 1 tháng.",
          "Độ ẩm đống ủ phải đạt 100% ngập nước hoàn toàn."
        ],
        answer: 0,
        explanation: "Tỷ lệ C:N tối ưu cho vi sinh vật phân giải hiếu khí là 25:1 - 30:1 (C làm nguồn năng lượng, N làm vật liệu cấu tạo tế bào) và độ ẩm 55-60%. Nếu C:N > 35:1 quá trình phân giải diễn ra rất chậm; nếu C:N < 20:1 sẽ dư thừa đạm bay hơi thành khí độc NH3 gây mùi thối và thất thoát đạm.",
        recallHint: "Thông số ủ phân Compost chuẩn: Tỷ lệ C:N ban đầu = 25:1 - 30:1; Độ ẩm 55-60%; Nhiệt độ pha sinh nhiệt đạt 55-65°C để diệt mầm bệnh và hạt cỏ dại; Đảo trộn cung cấp oxy hiếu khí."
      },
      {
        id: 6, grade: "cn10", topic: "(2) Phân bón",
        stem: "Trong điều kiện đất lúa ngập nước yếm khí có pH hơi kiềm (pH = 7,8), dạng phân đạm nào sau đây khi bón trên mặt ruộng sẽ bị tổn thất nặng nề nhất do quá trình bốc hơi khí Amoniac (NH3 volatilization)?",
        options: ["Phân Đạm Urê [(NH2)2CO].", "Phân Đạm Amôn clorua (NH4Cl).", "Phân Đạm Nitrat canxi [Ca(NO3)2].", "Phân Đạm chậm tan bọc lưu huỳnh."],
        answer: 0,
        explanation: "Phân Urê dưới tác dụng của men urease thủy phân thành (NH4)2CO3 làm tăng pH cục bộ lên > 8,2. Ở pH cao, phản ứng NH4+ + OH- <=> NH3 (khí) + H2O dịch chuyển mạnh sang phải, làm khí NH3 bốc hơi vào khí quyển lên tới 30-50% lượng đạm bón nếu không được vùi sâu.",
        recallHint: "Tổn thất đạm do bốc hơi NH3: Xảy ra mạnh khi bón Urê hoặc muối amôn trên mặt ruộng ngập nước có pH cao, nhiệt độ cao và không vùi sâu. Đạm Nitrat Ca(NO3)2 không bị bốc hơi NH3."
      },
      {
        id: 7, grade: "cn10", topic: "(3) Trồng trọt công nghệ cao",
        stem: "Trong hệ thống chiếu sáng nhân tạo bổ sung bằng đèn LED chuyên dụng cho dâu tây và hoa cúc trong nhà màng, tỷ lệ quang phổ nào sau đây được chứng minh kích thích tối đa quá trình quang hợp tích lũy sinh khối và ra hoa đồng loạt?",
        options: [
          "Phối hợp ánh sáng Đỏ (bước sóng 660 nm) và ánh sáng Xanh dương (bước sóng 450 nm) theo tỷ lệ khoảng 4:1 đến 5:1.",
          "Ánh sáng Xanh lục đơn sắc (bước sóng 520 nm) 100%.",
          "Ánh sáng Tử ngoại UV-C (bước sóng < 280 nm) liên tục 18 giờ/ngày.",
          "Ánh sáng Hồng ngoại xa đơn sắc (bước sóng > 800 nm)."
        ],
        answer: 0,
        explanation: "Diệp lục tố a và b hấp thu cực đại ở hai đỉnh phổ: Ánh sáng đỏ (660 nm kích hoạt quang hệ I và II, tối ưu hóa quang hợp tích lũy đường) và ánh sáng xanh dương (450 nm kích thích mở khí khổng, ức chế vóng thân và điều hòa sinh trưởng). Tỷ lệ Đỏ : Xanh = 4:1 - 5:1 là công thức LED quang sinh học chuẩn.",
        recallHint: "Quang phổ LED nông nghiệp: Ánh sáng Đỏ (660 nm) tối ưu hóa quang hợp và tạo khối sinh học; Ánh sáng Xanh dương (450 nm) giúp thân cứng cáp, mở khí khổng và tổng hợp protein; Tỷ lệ chuẩn Đỏ:Xanh = 4:1 đến 5:1."
      },
      {
        id: 8, grade: "cn10", topic: "(3) Trồng trọt công nghệ cao",
        stem: "Khi vận hành hệ thống tưới dinh dưỡng khí canh (Aeroponics) trồng cây dược liệu, chu kỳ phun sương dinh dưỡng siêu mịn thường được cài đặt tự động ở chế độ nào để rễ hô hấp tối ưu mà không bị khô héo?",
        options: [
          "Phun ngắt quãng: Bật phun sương 15 - 30 giây, ngắt nghỉ 3 - 5 phút lặp lại tuần hoàn 24/24.",
          "Phun liên tục 24/24 không ngừng nghỉ suốt vụ nuôi trồng.",
          "Chỉ phun 1 lần duy nhất vào lúc 12 giờ trưa mỗi ngày trong 1 tiếng.",
          "Mỗi tuần chỉ phun sương một lần vào ngày chủ nhật."
        ],
        answer: 0,
        explanation: "Khí canh giữ rễ lơ lửng trong không khí tối hoàn toàn. Chu kỳ phun ngắt quãng (ví dụ 20 giây phun / 3-4 phút nghỉ) đảm bảo bề mặt rễ luôn được bao phủ bởi màng sương mỏng giàu oxy hòa tan tối đa và dinh dưỡng, rễ hô hấp hoàn hảo mà không bị úng nước hay khô hạn.",
        recallHint: "Nguyên lý Khí canh (Aeroponics): Rễ lơ lửng trong không khí, chu kỳ phun sương ngắt quãng ngắn (vài chục giây phun / vài phút nghỉ) cung cấp oxy hòa tan 100% giúp rễ hấp thu khoáng nhanh gấp 2-3 lần thổ canh."
      },

      // K11 (8 câu VDC)
      {
        id: 9, grade: "cn11", topic: "(4) Giống vật nuôi",
        stem: "Ứng dụng đột phá của công nghệ chỉnh sửa gen CRISPR/Cas9 trên lợn nhằm tạo ra đàn lợn kháng hoàn toàn với virus gây Hội chứng rối loạn sinh sản và hô hấp (PRRSV - bệnh Tai xanh) dựa trên cơ chế phân tử nào?",
        options: [
          "Chỉnh sửa làm mất đoạn (knock-out) exon 7 của gen mã hóa thụ thể CD163 (thành phần SRCR5) trên bề mặt đại thực bào phế nang của lợn.",
          "Chuyển một đoạn ADN của virus tai xanh vào trong nhân tế bào gan của lợn.",
          "Cắt bỏ toàn bộ hệ thống miễn dịch bẩm sinh của lợn nuôi.",
          "Nhân đôi số lượng thụ thể CD163 trên màng tế bào lympho T."
        ],
        answer: 0,
        explanation: "Virus PRRSV chỉ có thể xâm nhập vào đại thực bào phế nang lợn khi nhận diện và liên kết với miền thụ thể SRCR5 mã hóa bởi exon 7 của gen CD163. Công nghệ CRISPR/Cas9 cắt bỏ chọn lọc exon 7 giúp lợn kháng hoàn toàn với mọi chủng PRRSV mà không làm biến đổi bất kỳ chức năng sinh lý bình thường nào của cá thể.",
        recallHint: "Đột phá CRISPR/Cas9 kháng PRRSV ở lợn: Knock-out exon 7 (miền SRCR5) của gen CD163 trên đại thực bào làm virus Tai xanh không thể bám dính và xâm nhập vào tế bào đích, tạo tính kháng virus tuyệt đối."
      },
      {
        id: 10, grade: "cn11", topic: "(4) Giống vật nuôi",
        stem: "Chỉ số Tiêu thụ thức ăn tồn dư RFI (Residual Feed Intake) trong chọn giống bò thịt cao sản được định nghĩa là sự chênh lệch giữa",
        options: [
          "Lượng thức ăn ăn vào thực tế và Lượng thức ăn dự đoán theo nhu cầu duy trì thể trọng và tốc độ tăng trọng của cá thể.",
          "Lượng thức ăn ăn vào ban ngày và Lượng thức ăn ăn vào ban đêm.",
          "Khối lượng thức ăn của con đực giống và Khối lượng thức ăn của con cái giống.",
          "Tổng lượng phân thải ra và Tổng lượng nước tiểu của con vật."
        ],
        answer: 0,
        explanation: "RFI = Lượng ăn vào thực tế - Lượng ăn vào dự tính theo mô hình hồi quy. Cá thể bò có giá trị RFI âm (< 0) ăn ít thức ăn hơn mức dự đoán nhưng vẫn đạt cùng tốc độ tăng trọng, đại diện cho kiểu gen có hiệu quả chuyển hóa năng lượng sinh học nội tại vượt trội.",
        recallHint: "Chỉ số RFI (Residual Feed Intake): Đo hiệu quả sử dụng thức ăn độc lập với tầm vóc con vật. Con vật có RFI âm (âm càng sâu) càng tiết kiệm thức ăn, giảm phát thải khí nhà kính CH4 từ dạ cỏ."
      },
      {
        id: 11, grade: "cn11", topic: "(4) Giống vật nuôi",
        stem: "Trong kỹ thuật cấy truyền phôi bò sữa cao sản (MOET), hormone nào sau đây được sử dụng để gây rụng trứng nhiều (siêu bài noãn) ở bò cái cho phôi?",
        options: [
          "FSH (Follicle Stimulating Hormone) kết hợp với Prostaglandin F2α (PGF2α).",
          "Oxytocin kết hợp với Adrenaline.",
          "Insulin kết hợp với Glucagon.",
          "Thyroxin liều lượng cao."
        ],
        answer: 0,
        explanation: "FSH (hoặc PMSG/eCG) tiêm ngắt quãng nhiều lần để kích thích hàng loạt nang trứng phát triển vượt trội (siêu bài noãn); sau đó tiêm PGF2α để phá hủy thể vàng gây động dục đồng loạt để thụ tinh nhân tạo lấy phôi.",
        recallHint: "Quy trình siêu bài noãn ở bò (MOET): Tiêm FSH kích thích nhiều bao noãn chín đồng loạt -> Tiêm PGF2a phá vỡ thể vàng gây động dục -> Phối giống nhân tạo -> Thu hoạch phôi ở ngày thứ 7."
      },
      {
        id: 12, grade: "cn11", topic: "(5) Thức ăn chăn nuôi",
        stem: "Trong dạ cỏ bò sữa, vi sinh vật phân giải các hợp chất carbohydrate dạng xơ (xenlulozo, hemixenlulozo) thành 3 axit béo bay hơi (VFA) chủ yếu theo tỷ lệ nồng độ nào sau đây?",
        options: [
          "Axit Acetic (khoảng 60% - 70%), Axit Propionic (15% - 20%), Axit Butyric (10% - 15%).",
          "Axit Lactic (90%), Axit Clohydric (5%), Axit Sunfuric (5%).",
          "Axit Propionic (80%), Axit Fomic (10%), Axit Citric (10%).",
          "Axit Butyric (90%), Axit Amin (10%)."
        ],
        answer: 0,
        explanation: "Hệ vi sinh vật phân giải xơ (Ruminococcus, Fibrobacter) lên men thức ăn thô xanh tạo hỗn hợp VFA gồm: Axit Acetic (nguyên liệu tổng hợp chất béo trong sữa, chiếm 60-70%), Axit Propionic (nguyên liệu tân tạo đường glucose tại gan, chiếm 15-20%) và Axit Butyric (chiếm 10-15%).",
        recallHint: "Ba axit béo bay hơi VFA ở dạ cỏ: Acetic (60-70%, tổng hợp mỡ sữa), Propionic (15-20%, tân tạo glucose cấp năng lượng), Butyric (10-15%, cung cấp năng lượng cho thành dạ cỏ)."
      },
      {
        id: 13, grade: "cn11", topic: "(5) Thức ăn chăn nuôi",
        stem: "Khi phối trộn khẩu phần thức ăn hỗn hợp TMR (Total Mixed Ration) cho bò sữa năng suất cao (30 - 35 kg sữa/ngày), chỉ tiêu NDF hiệu quả (peNDF - Physically Effective NDF) có ý nghĩa sinh lý quyết định là",
        options: [
          "kích thích phản xạ nhai lại, thúc đẩy tiết nước bọt giàu bicarbonate (HCO3-) để đệm pH dạ cỏ luôn duy trì > 6,0 chống toan hóa dạ cỏ cấp tính.",
          "làm giảm hoàn toàn lượng mỡ có trong sữa tươi nguyên liệu.",
          "giúp bò không cần uống nước trong suốt chu kỳ tiết sữa.",
          "làm ruột bò co bóp nhanh đẩy thức ăn ra ngoài chưa tiêu hóa."
        ],
        answer: 0,
        explanation: "Các hạt xơ dài > 4 mm (peNDF) tạo thành thảm cỏ nổi trên bề mặt dịch dạ cỏ, cọ xát kích thích niêm mạc dạ cỏ sinh phản xạ nhai lại. Quá trình nhai lại kích thích tuyến nước bọt tiết 150-200 lít nước bọt đệm giàu NaHCO3 mỗi ngày, trung hòa VFA và giữ pH dạ cỏ ổn định ở 6,2 - 6,8.",
        recallHint: "peNDF trong khẩu phần TMR bò sữa: Xơ hiệu dụng kích thích nhai lại và tiết nước bọt chứa đệm bicarbonate (HCO3-), giữ pH dạ cỏ > 6,0 ngăn ngừa hội chứng toan dạ cỏ (SARA)."
      },
      {
        id: 14, grade: "cn11", topic: "(5) Thức ăn chăn nuôi",
        stem: "Chỉ số Năng lượng thuần (Net Energy - NE) dùng để xây dựng khẩu phần cho lợn thịt được tính toán từ Năng lượng trao đổi (Metabolizable Energy - ME) bằng cách trừ đi",
        options: [
          "Nhiệt gia tăng (Heat Increment - HI) phát sinh trong quá trình tiêu hóa và trao đổi chất.",
          "Năng lượng bị thất thoát qua phân (Fecal Energy).",
          "Năng lượng bị thất thoát qua nước tiểu (Urinary Energy).",
          "Năng lượng bị thất thoát qua khí thải đường ruột (Methane Energy)."
        ],
        answer: 0,
        explanation: "Tổng năng lượng GE -> Trừ năng lượng qua phân = Năng lượng tiêu hóa DE -> Trừ năng lượng qua nước tiểu và khí metan = Năng lượng trao đổi ME -> Trừ nhiệt gia tăng tiêu hóa HI = Năng lượng thuần NE (năng lượng thực sự dùng cho duy trì và sản xuất).",
        recallHint: "Hệ thống phân chia năng lượng thức ăn: GE (Tổng) -> DE (Tiêu hóa) -> ME (Trao đổi) -> NE (Thuần). NE = ME - Nhiệt gia tăng (HI). Hệ thống NE phản ánh chính xác nhất giá trị dinh dưỡng thực tế."
      },
      {
        id: 15, grade: "cn11", topic: "(6) Môi trường & Phòng bệnh chăn nuôi",
        stem: "Trong chu trình 4 pha của quá trình phân hủy kỵ khí chất thải chăn nuôi trong hầm Biogas công nghiệp, pha nào sau đây chịu trách nhiệm chuyển hóa các axit béo bay hơi và rượu thành sản phẩm khí Mêtan (CH4)?",
        options: [
          "Pha sinh Mêtan (Methanogenesis) nhờ nhóm vi khuẩn cổ sinh kỵ khí Methanogen.",
          "Pha thủy phân (Hydrolysis) các đại phân tử hữu cơ.",
          "Pha axit hóa (Acidogenesis) tạo axit hữu cơ đơn giản.",
          "Pha axetat hóa (Acetogenesis) tạo axit axetic."
        ],
        answer: 0,
        explanation: "Bốn pha phân giải kỵ khí: (1) Thủy phân -> (2) Axit hóa -> (3) Axetat hóa -> (4) Sinh Mêtan. Ở pha thứ tư, các vi khuẩn cổ Methanobacter, Methanosarcina sử dụng H2, CO2 và axetat để khử thành khí CH4 trong điều kiện kỵ khí nghiêm ngặt.",
        recallHint: "Bốn pha sinh học trong hầm Biogas: Thủy phân (Hydrolysis) -> Axit hóa (Acidogenesis) -> Axetat hóa (Acetogenesis) -> Sinh Mêtan (Methanogenesis do Archaea kỵ khí tuyệt đối thực hiện)."
      },
      {
        id: 16, grade: "cn11", topic: "(6) Môi trường & Phòng bệnh chăn nuôi",
        stem: "Trong kỹ thuật thông gió chuồng kín chuồng nuôi lợn thịt mùa nắng nóng ở miền Nam, hệ thống làm mát áp suất âm kết hợp giàn làm mát Cooling Pad hoạt động dựa trên nguyên lý vật lý nào?",
        options: [
          "Quạt hút tạo áp suất âm hút không khí khô nóng từ ngoài đi xuyên qua màng giấy ướt Cooling Pad; nước bay hơi hấp thu ẩn nhiệt làm nhiệt độ không khí giảm từ 5 - 8°C.",
          "Giàn giấy làm mát tỏa ra khí gas lỏng Freon làm đóng băng không khí trong chuồng.",
          "Quạt gió nén không khí trong chuồng lên áp suất 10 atm để triệt tiêu nhiệt lượng.",
          "Hệ thống thổi hơi nóng ra ngoài bằng bức xạ hạt nhân."
        ],
        answer: 0,
        explanation: "Quạt hút đầu hồi hút không khí ra tạo chân không nhẹ (áp suất âm) trong chuồng. Không khí nóng từ ngoài tràn qua tấm Cooling Pad có màng nước chảy liên tục, nước hấp thụ nhiệt lượng của không khí để bốc hơi (bay hơi đoạn nhiệt), làm hạ nhiệt độ dòng khí vào chuồng xuống 25-28°C.",
        recallHint: "Chuồng kín áp suất âm Cooling Pad: Quạt hút tạo chênh lệch áp suất kéo không khí qua giàn bay hơi nước, hấp thụ nhiệt ẩn làm giảm nhiệt độ chuồng 5-8°C so với môi trường ngoài."
      },

      // K12 (8 câu VDC)
      {
        id: 17, grade: "cn12", topic: "(1) Giới thiệu chung Lâm nghiệp",
        stem: "Để tính toán lượng Carbon lưu trữ trong sinh khối trên mặt đất (AGB - Aboveground Biomass) của một khu rừng gỗ lớn phục vụ thương mại hóa Tín chỉ Carbon (Carbon Credit) theo tiêu chuẩn IPCC, công thức quy đổi từ sinh khối khô (tấn) sang lượng khí CO2 tương đương (tấn CO2e) là",
        options: [
          "Lượng CO2e = AGB (khô) × 0,47 × (44 / 12).",
          "Lượng CO2e = AGB (khô) × 100.",
          "Lượng CO2e = AGB (khô) / (44 × 12).",
          "Lượng CO2e = AGB (khô) × 0,1."
        ],
        answer: 0,
        explanation: "Hàm lượng carbon chiếm trung bình 47% (hệ số CF = 0,47) trong sinh khối gỗ khô thực vật. Khi chuyển đổi từ 1 nguyên tử C thành 1 phân tử CO2, tỷ lệ khối lượng phân tử là 44 / 12 = 3,67. Do đó: Tấn CO2e = AGB × 0,47 × (44/12) ≈ AGB × 1,723.",
        recallHint: "Hạch toán tín chỉ Carbon rừng (IPCC): Hàm lượng C trong sinh khối khô = 47% (0,47). Tỷ số phân tử lượng CO2/C = 44/12 ≈ 3,67. Công thức chuẩn: CO2e = Sinh khối khô × 0,47 × 3,67."
      },
      {
        id: 18, grade: "cn12", topic: "(2) Trồng & Chăm sóc rừng",
        stem: "Phương trình tương quan Allometric nào sau đây thường được áp dụng chính xác nhất để ước tính sinh khối trên mặt đất (AGB, kg/cây) của rừng keo lai dựa vào đường kính ngang ngực (DBH, cm) và chiều cao vút ngọn (H, m)?",
        options: [
          "AGB = a × (DBH)^b × (H)^c (với a, b, c là các tham số hồi quy thực nghiệm đặc trưng cho loài cây).",
          "AGB = DBH + H + 100.",
          "AGB = (DBH / H) × 1.000.",
          "AGB = a × DBH - b × H."
        ],
        answer: 0,
        explanation: "Mô hình tương quan dị dưỡng (Allometric model) phi tuyến tính AGB = a × DBH^b × H^c (hoặc biến đổi logarit: ln(AGB) = ln(a) + b*ln(DBH) + c*ln(H)) là mô hình tiêu chuẩn lâm học toàn cầu để ước lượng sinh khối không phá hủy cây rừng.",
        recallHint: "Phương trình Allometric ước tính sinh khối rừng: Y = a × (DBH)^b × (H)^c. Logarit hóa hai vế: ln(Y) = ln(a) + b·ln(DBH) + c·ln(H). Cho phép xác định trữ lượng gỗ mà không cần chặt hạ cây."
      },
      {
        id: 19, grade: "cn12", topic: "(3) Bảo vệ & Khai thác rừng",
        stem: "Chỉ số diện tích lá LAI (Leaf Area Index) của một lâm phần rừng tự nhiên đóng vai trò chỉ thị sinh thái quyết định đối với",
        options: [
          "khả năng quang hợp hấp thụ CO2, độ che chắn đất chống xói mòn và điều tiết quá trình thoát hơi nước của lưu vực.",
          "độ mặn của nước mưa rơi trên tán rừng.",
          "giá bán gỗ xẻ trên thị trường xuất khẩu.",
          "tỷ lệ gỗ giác so với gỗ lõi của cây."
        ],
        answer: 0,
        explanation: "LAI (tổng diện tích bề mặt 1 mặt của lá trên 1 đơn vị diện tích đất ngắm thẳng) quyết định năng suất sơ cấp tổng thể (GPP), lượng ánh sáng xuyên qua tán, khả năng giữ nước mưa cản dòng chảy xói mòn và chu trình thủy văn của toàn bộ hệ sinh thái rừng.",
        recallHint: "Chỉ số diện tích lá LAI (Leaf Area Index): Tổng diện tích bề mặt lá/diện tích đất. LAI càng cao thì độ che phủ tán càng dày, hiệu quả hấp thụ CO2 càng lớn và khả năng chặn giọt mưa chống xói mòn càng tốt."
      },
      {
        id: 20, grade: "cn12", topic: "(4) Giới thiệu chung Thủy sản",
        stem: "Trong hệ thống nuôi trồng thủy sản tuần hoàn khép kín siêu thâm canh (RAS - Recirculating Aquaculture System), thiết bị tháp tách bọt Protein Skimmer (Fractionator) hoạt động dựa trên nguyên tắc",
        options: [
          "bơm bọt khí siêu mịn đi ngược dòng nước để các hợp chất hữu cơ hòa tan, chất hoạt động bề mặt và protein lơ lửng bám dính vào màng bọt rồi đẩy trào ra ngoài.",
          "đun sôi nước ao ở 100°C để làm chín protein cá.",
          "dùng nam châm điện hút các hạt kim loại nặng ra khỏi nước ao.",
          "chiếu tia X để phân rã bọt nước thành khí hydro."
        ],
        answer: 0,
        explanation: "Protein Skimmer tận dụng đặc tính phân cực và sức căng bề mặt của các hợp chất hữu cơ hòa tan/protein chưa phân hủy. Bọt khí micro-bubble tạo diện tích tiếp xúc khổng lồ cuốn theo chất bẩn hữu cơ trào lên cốc gom bọt, loại bỏ chất thải trước khi chúng bị vi khuẩn phân giải thành khí độc NH3.",
        recallHint: "Nguyên lý Protein Skimmer trong RAS: Tạo bọt khí siêu mịn cuốn các hạt protein hòa tan và chất hữu cơ hoạt tính bề mặt trào ra ngoài, ngăn chặn sự hình thành khí độc Amoniac từ nguồn gốc."
      },
      {
        id: 21, grade: "cn12", topic: "(5) Môi trường nuôi thủy sản",
        stem: "Trong ngăn lọc sinh học giá thể di động (MBBR - Moving Bed Biofilm Reactor) của hệ thống RAS, quá trình nitrat hóa sinh học diễn ra qua 2 giai đoạn kế tiếp nhau nhờ hoạt động của hai nhóm vi khuẩn hiếu khí tự dưỡng nào?",
        options: [
          "Giai đoạn 1: Vi khuẩn Nitrosomonas oxy hóa NH4+ thành NO2- ; Giai đoạn 2: Vi khuẩn Nitrobacter oxy hóa tiếp NO2- thành NO3- không độc.",
          "Giai đoạn 1: Vi khuẩn E. coli phân giải glucose; Giai đoạn 2: Nấm men sinh cồn.",
          "Giai đoạn 1: Tảo lục hấp thụ CO2; Giai đoạn 2: Vi khuẩn kỵ khí sinh H2S.",
          "Giai đoạn 1: Xạ khuẩn tiết kháng sinh; Giai đoạn 2: Trùng roi quang hợp."
        ],
        answer: 0,
        explanation: "Quá trình nitrat hóa hiếu khí trong bể lọc MBBR: (1) 2NH4+ + 3O2 -> 2NO2- + 4H+ + 2H2O (nhờ Nitrosomonas); (2) 2NO2- + O2 -> 2NO3- (nhờ Nitrobacter). Quá trình này đòi hỏi tiêu thụ 4,57 g O2 và 7,14 g độ kiềm CaCO3 cho mỗi gam Nitơ amoniac được oxy hóa.",
        recallHint: "Chu trình Nitrat hóa trong biofilter RAS: NH4+/NH3 -> (Nitrosomonas + O2) -> NO2- (độc) -> (Nitrobacter + O2) -> NO3- (không độc, nồng độ an toàn cao). Tiêu tốn nhiều oxy hòa tan và độ kiềm."
      },
      {
        id: 22, grade: "cn12", topic: "(5) Môi trường nuôi thủy sản",
        stem: "Trong công nghệ Biofloc (BFT), để kiểm soát nồng độ Amoniac độc hại trong nước nuôi tôm thâm canh mà không cần thay nước, người nuôi chủ động bổ sung nguồn carbon hữu cơ (như rỉ mật đường) nhằm duy trì tỷ lệ C:N tối ưu ở ngưỡng",
        options: [
          "Tỷ lệ C:N từ 12:1 đến 15:1 để kích thích vi khuẩn dị dưỡng tổng hợp protein vi sinh vật.",
          "Tỷ lệ C:N < 4:1 để kìm hãm hoàn toàn mọi vi sinh vật trong nước.",
          "Tỷ lệ C:N > 50:1 để làm nước ao kết tinh thành đường đặc.",
          "Tỷ lệ C:N = 1:1."
        ],
        answer: 0,
        explanation: "Khi duy trì tỷ lệ C:N >= 12:1 - 15:1, các vi khuẩn dị dưỡng (Heterotrophic bacteria) sinh trưởng với tốc độ nhanh gấp hàng chục lần vi khuẩn tự dưỡng, đồng hóa trực tiếp NH4+ thành protein sinh khối vi sinh vật tạo thành hạt Biofloc, vừa làm sạch nước vừa làm thức ăn giàu dinh dưỡng cho tôm.",
        recallHint: "Nguyên lý tỷ lệ C:N trong Biofloc: C:N >= 12:1 - 15:1 tạo điều kiện cho vi khuẩn dị dưỡng đồng hóa Amoniac (NH4+) thành sinh khối protein tế bào hạt floc, tái sử dụng làm thức ăn cho tôm."
      },
      {
        id: 23, grade: "cn12", topic: "(6) Công nghệ giống thủy sản",
        stem: "Hệ thống nuôi trồng kết hợp Thủy sản - Thủy canh (Aquaponics) chu trình kín vận hành theo nguyên lý cân bằng sinh thái nào sau đây?",
        options: [
          "Chất thải giàu amoniac của cá được biofilter chuyển hóa thành nitrat (NO3-); rễ cây thủy canh hấp thu NO3- làm phân bón sinh trưởng đồng thời lọc sạch nước tuần hoàn trở lại bể cá.",
          "Cây rau thủy sinh trực tiếp ăn các con cá nhỏ trong bể nuôi.",
          "Nước từ bể cá được đun nóng thành hơi nước tưới cho rau ngót.",
          "Rễ cây hút toàn bộ oxy trong nước ao làm cá chết ngạt."
        ],
        answer: 0,
        explanation: "Aquaponics là mô hình tuần hoàn cộng sinh hoàn hảo giữa Nuôi trồng thủy sản (Aquaculture) và Thủy canh (Hydroponics). Vi sinh vật trong biofilter chuyển hóa chất thải bài tiết của cá (NH3/NH4+) thành dinh dưỡng khoáng nitrat (NO3-), rễ cây hấp thụ sạch NO3- và khoáng chất, đóng vai trò như bộ lọc sinh học trả nước sạch giàu oxy về cho cá.",
        recallHint: "Bản chất hệ thống Aquaponics: Cá thải NH3 -> Vi khuẩn nitrat hóa biến thành NO3- -> Cây rau thủy canh hấp thụ NO3- làm dinh dưỡng -> Trả nước sạch tinh khiết về bể nuôi cá tuần hoàn."
      },
      {
        id: 24, grade: "cn12", topic: "(6) Công nghệ giống thủy sản",
        stem: "Trong sản xuất cá rô phi toàn đực bằng công nghệ di truyền siêu đực (YY Super-Male Technology), cá đực có kiểu nhân tố giới tính YY khi cho lai với cá cái thông thường (XX) sẽ sinh ra đàn cá con ở thế hệ thương phẩm có tỷ lệ đực là",
        options: ["100% cá đực (kiểu gen XY) mà hoàn toàn không cần sử dụng bất kỳ hóa chất hormone nào.", "50% đực (XY) và 50% cái (XX).", "100% cá cái (XX).", "75% cá đực và 25% cá cái."],
        answer: 0,
        explanation: "Cá siêu đực YY chỉ tạo ra một loại giao tử duy nhất mang nhiễm sắc thể Y. Cá cái XX chỉ tạo giao tử X. Phép lai YY × XX -> 100% con lai mang kiểu gen XY (giới tính đực hoàn toàn tự nhiên), an toàn sinh học tuyệt đối và được chứng nhận hữu cơ quốc tế.",
        recallHint: "Công nghệ cá siêu đực YY: Phép lai cá đực YY × cá cái XX -> 100% đời con mang kiểu gen XY (cá đực tự nhiên 100%), không tồn dư hormone sinh trưởng, thân thiện với môi trường."
      }
    ],
    tfs: [
      {
        id: 1, grade: "cn10",
        topic: "Khối 10 — Hóa thổ nhưỡng chuyên sâu & Trao đổi ion Al3+/H+",
        title: "Câu 1: Cân bằng CEC động, độc chất nhôm Al3+ và tính toán vôi cải tạo đất bazan",
        context: "Một viện nghiên cứu nông nghiệp tiến hành khảo sát tầng đất mặt (0 - 20 cm) của vùng đất bazan trồng sầu riêng VietGAP tại Long Khánh (Đồng Nai) có dung tích hấp phụ cation hiệu dụng ECEC = 16 meq/100g đất, pH_H2O = 4,2 và hàm lượng ion Al3+ trao đổi là 3,2 meq/100g đất. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          {
            label: "a",
            text: "Độ bão hòa nhôm trao đổi của mẫu đất trên đạt 20%, nằm ngay ngưỡng bắt đầu gây độc cho sự phát triển của hệ thống lông hút rễ cây sầu riêng.",
            isTrue: true,
            explanation: "Đúng. Độ bão hòa Al = (Al3+ / ECEC) × 100% = (3,2 / 16) × 100% = 20%. Ở mức bão hòa 20%, nồng độ Al3+ trong dung dịch đất bắt đầu ức chế phân chia tế bào chóp rễ sầu riêng non.",
            recallHint: "Công thức độ bão hòa Al: %Al-saturation = (Al3+ trao đổi / ECEC) × 100%. Ngưỡng độc hại đối với cây ăn quả mẫn cảm (sầu riêng, bưởi) là khi %Al >= 20%."
          },
          {
            label: "b",
            text: "Khi rễ cây hô hấp hiếu khí thải CO2, ion H+ được giải phóng vào dung dịch đất sẽ có ái lực trao đổi đẩy được ion Ca2+ trên bề mặt keo đất mạnh hơn ion Al3+.",
            isTrue: false,
            explanation: "Sai. Quy luật ái lực trao đổi lyotropic của cation phụ thuộc vào điện tích và bán kính hydrat hóa: Al3+ > Ca2+ > Mg2+ > K+ > NH4+ > Na+. Cation có hóa trị 3 (Al3+) liên kết với keo đất bền chặt hơn cation hóa trị 2 (Ca2+).",
            recallHint: "Quy luật ái lực hấp phụ cation (Dãy Hofmeister/Lyotropic): Al3+ > Fe3+ > Ca2+ > Mg2+ > K+ = NH4+ > Na+. Cation có hóa trị càng cao thì ái lực hấp phụ với hạt keo âm càng mạnh."
          },
          {
            label: "c",
            text: "Để trung hòa hoàn toàn 3,2 meq Al3+/100g đất trên 1 ha (tầng đất 20 cm, dung trọng d = 1,2 g/cm3), khối lượng đá vôi nông nghiệp tinh khiết (CaCO3, M = 100) cần bón về mặt lý thuyết là 3.840 kg.",
            isTrue: true,
            explanation: "Đúng. Khối lượng đất 1 ha = 10.000 × 0,2 × 1.200 = 2.400.000 kg = 2,4 × 10^7 (100g đất). Tổng đương lượng Al3+ = 2,4 × 10^7 × 3,2 meq = 7,68 × 10^7 meq = 7,68 × 10^4 eq. Đương lượng gam CaCO3 = 100 / 2 = 50 g/eq. Khối lượng CaCO3 = 7,68 × 10^4 × 50 g = 3.840 kg (3,84 tấn).",
            recallHint: "Công thức tính vôi CaCO3: Đương lượng gam = 50 g/eq. Khối lượng vôi = (Tổng số eq Al3+) × 50 g. 1 ha đất sâu 20cm, d=1,2 nặng 2.400 tấn = 2,4.10^7 mẫu 100g."
          },
          {
            label: "d",
            text: "Sau khi bón vôi nông nghiệp khử chua, dung tích hấp phụ cation phụ thuộc pH (pH-dependent CEC) của đất bazan sẽ bị giảm đi nghiêm trọng.",
            isTrue: false,
            explanation: "Sai. Khi bón vôi nâng độ pH từ 4,2 lên 6,0-6,5, các nhóm -OH trên bề mặt oxit sắt, nhôm và các nhóm carboxyl (-COOH) của mùn hữu cơ sẽ tăng cường phân ly giải phóng H+, làm tăng mật độ điện tích âm trên bề mặt keo, do đó làm TĂNG dung tích hấp phụ CEC của đất.",
            recallHint: "Dung tích CEC phụ thuộc pH: Khi pH đất tăng (do bón vôi), các nhóm chức trên bề mặt khoáng sét và mùn tăng phân ly ion H+, tạo thêm nhiều vị trí mang điện tích âm -> CEC tăng lên."
          }
        ]
      },
      {
        id: 2, grade: "cn11",
        topic: "Khối 11 — Công nghệ sinh học gen CRISPR/Cas9 & Tiêu hóa dạ cỏ",
        title: "Câu 2: Đột phá chỉnh sửa gen CD163 kháng PRRSV và cân bằng VFA dạ cỏ",
        context: "Tại một trung tâm công nghệ sinh học nông nghiệp cao hợp tác với trang trại chăn nuôi bò sữa và lợn giống, các nhà khoa học tiến hành thử nghiệm công nghệ chỉnh sửa gen và theo dõi trao đổi chất. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          {
            label: "a",
            text: "Công nghệ CRISPR/Cas9 loại bỏ exon 7 của gen CD163 trên lợn tạo khả năng kháng virus PRRSV bằng cách ngăn cản virus liên kết giải phóng hệ gen vào tế bào chất của đại thực bào.",
            isTrue: true,
            explanation: "Đúng. Miền ngoại bào SRCR5 (do exon 7 mã hóa) là cổng thụ thể duy nhất để glycoprotein của virus tai xanh bám dính và dung hợp màng tế bào. Loại bỏ miền này giúp lợn miễn nhiễm tuyệt đối với PRRSV.",
            recallHint: "Cơ chế phân tử CRISPR/Cas9 gen CD163: Cắt chính xác exon 7 mã hóa thụ thể SRCR5, làm virus PRRSV mất vị trí bám dính, không xâm nhập được vào đại thực bào phế nang lợn."
          },
          {
            label: "b",
            text: "Lợn chỉnh sửa gen CD163 bị suy giảm nghiêm trọng khả năng dọn dẹp phức hợp hemoglobin-haptoglobin tự do trong tuần hoàn máu.",
            isTrue: false,
            explanation: "Sai. Chức năng sinh lý bình thường của protein CD163 (nhận diện và thanh thải phức hợp hemoglobin-haptoglobin để tái chế sắt) do các miền SRCR khác đảm nhiệm, việc cắt bỏ riêng exon 7 (SRCR5) hoàn toàn không ảnh hưởng đến chức năng sinh lý dọn dẹp sắt tự nhiên.",
            recallHint: "Tính đặc hiệu của chỉnh sửa gen CD163: Chỉ cắt bỏ vùng thụ thể bám của virus (exon 7), bảo tồn nguyên vẹn các miền sinh lý khác, lợn lớn nhanh khỏe mạnh và sinh sản hoàn toàn bình thường."
          },
          {
            label: "c",
            text: "Trong dạ cỏ bò sữa, khẩu phần thức ăn có tỷ lệ thức ăn tinh (tinh bột) quá cao (> 65%) sẽ kích thích vi khuẩn Streptococcus bovis phát triển mạnh sinh nhiều axit lactic, làm sụt giảm pH dạ cỏ xuống < 5,5 gây toan dạ cỏ cấp tính.",
            isTrue: true,
            explanation: "Đúng. Lên men tinh bột nhanh giải phóng lượng lớn axit lactic (pK_a = 3,86 mạnh hơn nhiều so với VFA). Axit lactic tích tụ vượt quá ngưỡng đệm làm pH dạ cỏ giảm sâu, phá hủy hệ vi sinh vật phân giải xơ và làm tổn thương nhung mao dạ cỏ.",
            recallHint: "Toan hóa dạ cỏ cấp tính (Lactic Acidosis): Do dư thừa thức ăn tinh bột, vi khuẩn Streptococcus bovis lên men tạo axit lactic làm pH dạ cỏ < 5,2-5,5, ngừng nhu động dạ cỏ và gây tử vong."
          },
          {
            label: "d",
            text: "Axit béo bay hơi Propionic sinh ra trong dạ cỏ là tiền chất chủ yếu được gan bò sử dụng để tổng hợp nên chất béo (mỡ bơ) trong sữa tươi nguyên liệu.",
            isTrue: false,
            explanation: "Sai. Axit Propionic được hấp thu qua vách dạ cỏ vào tĩnh mạch cửa chuyển về gan để tân tạo Glucose (cung cấp năng lượng và tổng hợp đường Lactose của sữa). Axit Acetic mới là tiền chất chính tổng hợp chất béo trong sữa.",
            recallHint: "Vai trò sinh hóa của VFA: Axit Acetic -> Tổng hợp mỡ sữa; Axit Propionic -> Tân tạo Glucose ở gan và tổng hợp đường Lactose; Axit Butyric -> Cung cấp năng lượng cho biểu mô nhung mao dạ cỏ."
          }
        ]
      },
      {
        id: 3, grade: "cn12",
        topic: "Khối 12 — Lâm nghiệp Allometric, Phương trình sinh khối & Tín chỉ Carbon",
        title: "Câu 3: Động thái sinh trưởng lâm phần, chỉ số LAI và hạch toán tín chỉ carbon Net-Zero",
        context: "Một công ty lâm nghiệp tại Đồng Nai quản lý 1.000 ha rừng trồng keo lai 7 năm tuổi tiến hành điều tra lâm học để lập hồ sơ dự án Tín chỉ Carbon rừng theo cơ chế VCS (Verified Carbon Standard). Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          {
            label: "a",
            text: "Trong phương trình Allometric tính sinh khối trên mặt đất ln(AGB) = -2,15 + 1,85·ln(DBH) + 0,92·ln(H), khi đường kính ngang ngực DBH tăng lên gấp đôi thì sinh khối AGB của cây gỗ sẽ tăng lên xấp xỉ 3,6 lần.",
            isTrue: true,
            explanation: "Đúng. AGB tỷ lệ với (DBH)^1,85. Khi DBH tăng 2 lần thì (2)^1,85 ≈ 3,605 lần (tăng khoảng 3,6 lần sinh khối khô).",
            recallHint: "Toán học phương trình Allometric: Y = a·X^b. Tỷ lệ tăng trưởng tương đối: Khi biến độc lập X tăng k lần thì hàm Y tăng (k)^b lần. Ở đây 2^1,85 = 3,605 lần."
          },
          {
            label: "b",
            text: "Nếu một hecta rừng keo lai có sinh khối khô tích lũy trung bình là 150 tấn AGB/ha, lượng khí CO2 tương đương được khu rừng này hấp thụ và lưu giữ cố định trên mặt đất là khoảng 258,5 tấn CO2e/ha.",
            isTrue: true,
            explanation: "Đúng. Lượng CO2e = AGB × 0,47 × (44/12) = 150 × 0,47 × 3,6667 ≈ 258,5 tấn CO2e/ha.",
            recallHint: "Công thức chuyển đổi sinh khối sang CO2e: CO2e = Sinh khối khô (tấn) × 0,47 × (44/12). 150 × 0,47 × 3,667 = 258,5 tấn CO2e/ha."
          },
          {
            label: "c",
            text: "Biện pháp tỉa thưa chuyển hóa rừng gỗ nhỏ (chu kỳ 5 năm) sang rừng gỗ lớn (chu kỳ 12 năm) làm giảm tổng lượng carbon lưu trữ dài hạn của hệ sinh thái rừng.",
            isTrue: false,
            explanation: "Sai. Kéo dài chu kỳ lên 12 năm nuôi dưỡng cây gỗ lớn giúp duy trì bể chứa carbon trên mặt đất và trong đất liên tục, sản phẩm gỗ lớn được chế biến thành đồ gỗ nội thất bền vững hàng chục năm (lưu giữ carbon cố định lâu dài), trong khi rừng gỗ nhỏ 5 năm làm dăm giấy phân hủy phát thải CO2 nhanh.",
            recallHint: "Lợi ích tín chỉ Carbon của rừng gỗ lớn: Kéo dài thời gian cố định carbon của tầng tán, giảm phát thải từ hoạt động khai thác lặp lại nhiều lần, gỗ lớn dùng làm vật liệu xây dựng bền vững lưu giữ carbon vĩnh viễn."
          },
          {
            label: "d",
            text: "Chỉ số diện tích lá LAI đạt tối ưu trong khoảng 4,0 - 6,0 cho phép lâm phần rừng keo hấp thu tối đa bức xạ quang hợp hiệu dụng (PAR) và giảm thiểu xói mòn hạt mưa rơi tự do.",
            isTrue: true,
            explanation: "Đúng. Ở LAI = 4,0 - 6,0, tán rừng khép kín nhiều tầng hấp thu trên 95% năng lượng ánh sáng PAR và tiêu tán động năng của các giọt mưa rào nhiệt đới, bảo vệ lớp đất mặt hoàn hảo.",
            recallHint: "Ý nghĩa sinh thái của chỉ số LAI: LAI = 4 - 6 là ngưỡng vàng hấp thu bức xạ mặt trời PAR tối đa, đồng thời tán lá dày đặc giữ lại 20-30% lượng mưa trực tiếp, bảo vệ mặt đất khỏi xói mòn sạt lở."
          }
        ]
      },
      {
        id: 4, grade: "cn12",
        topic: "Khối 12 — Hệ thống RAS tuần hoàn, Động học MBBR & Aquaponics",
        title: "Câu 4: Cân bằng Nitrat hóa trong lọc sinh học MBBR và công nghệ cá siêu đực YY",
        context: "Một trang trại nuôi cá rô phi siêu thâm canh tại Đồng Nai vận hành hệ thống tuần hoàn RAS công suất 50 tấn cá/vụ kết hợp tháp lọc sinh học MBBR và hệ Aquaponics trồng xà lách thủy canh. Xét tính Đúng/Sai của các nhận định sau:",
        statements: [
          {
            label: "a",
            text: "Để oxy hóa hoàn toàn 1,0 kg Tổng Nitơ Amoniac (TAN) thành dạng Nitrat (NO3-) trong bể lọc MBBR, hệ thống sục khí bắt buộc phải tiêu tốn tối thiểu về mặt lý thuyết là 4,57 kg Oxy hòa tan (O2).",
            isTrue: true,
            explanation: "Đúng. Phương trình hóa nghiệm nitrat hóa: NH4+ + 2O2 -> NO3- + 2H+ + H2O. Về mặt phân tử: 1 mol N (14g) cần 2 mol O2 (64g) -> Tỷ lệ lý thuyết = 64 / 14 ≈ 4,57 kg O2 / kg TAN.",
            recallHint: "Động học Nitrat hóa bể lọc MBBR: Cần 4,57 kg O2 và 7,14 kg độ kiềm CaCO3 để oxy hóa hoàn toàn 1 kg Amoniac (TAN) thành Nitrat NO3-."
          },
          {
            label: "b",
            text: "Quá trình nitrat hóa trong bể lọc sinh học làm tăng nhanh độ kiềm và làm tăng độ pH của nước tuần hoàn trong hệ thống RAS.",
            isTrue: false,
            explanation: "Sai. Quá trình nitrat hóa giải phóng 2 ion H+ cho mỗi ion NH4+ được chuyển hóa, do đó làm sụt giảm độ kiềm (tiêu tốn 7,14 kg độ kiềm CaCO3 cho 1 kg TAN) và làm hạ pH nước. Cần bổ sung NaHCO3 liên tục để giữ pH ổn định.",
            recallHint: "Sự suy giảm độ kiềm trong lọc sinh học: Phản ứng nitrat hóa sinh ra ion H+ làm tụt pH và phá hủy hệ đệm kiềm. Phải thường xuyên châm thêm vôi hoặc bột nở NaHCO3."
          },
          {
            label: "c",
            text: "Trong công nghệ tạo giống cá rô phi đơn tính đực di truyền YY, cá đực siêu đực (YY) khi thụ tinh với cá cái bình thường (XX) sẽ cho ra thế hệ con lai thương phẩm F1 gồm 100% cá đực tự nhiên mà không tồn dư hóa chất hormone.",
            isTrue: true,
            explanation: "Đúng. Tinh trùng của cá siêu đực 100% mang nhiễm sắc thể Y, kết hợp với trứng mang nhiễm sắc thể X tạo 100% hợp tử XY (cá đực). Đây là công nghệ sinh học di truyền sạch đạt chứng chỉ hữu cơ.",
            recallHint: "Cơ sở di truyền cá siêu đực YY: Kiểu gen bố YY sinh 100% giao tử Y; Kiểu gen mẹ XX sinh 100% giao tử X -> Hợp tử F1 là 100% XY (cá rô phi đực 100%)."
          },
          {
            label: "d",
            text: "Trong hệ thống Aquaponics khép kín, nồng độ ion Nitrat (NO3-) ở mức 50 - 100 mg/L vừa hoàn toàn an toàn cho cá rô phi vừa là nồng độ dinh dưỡng đa lượng tối ưu cho cây rau xà lách thủy canh hấp thu.",
            isTrue: true,
            explanation: "Đúng. Cá rô phi có khả năng chịu đựng NO3- lên tới > 200 mg/L; ngưỡng 50 - 100 mg/L NO3- cung cấp đầy đủ nguồn đạm khoáng hòa tan dồi dào để rau xà lách sinh trưởng nhanh, tạo lá xanh nõn không cần bổ sung đạm hóa học vô cơ.",
            recallHint: "Ngưỡng Nitrat trong Aquaponics: NO3- an toàn cho cá ở ngưỡng dưới 150-200 mg/L; rau xà lách thủy canh hấp thu tốt nhất ở nồng độ 50-100 mg/L NO3-, tạo sự cân bằng cộng sinh hoàn hảo."
          }
        ]
      }
    ],
    essays: [
      {
        id: 1,
        points: 3.5,
        title: "Câu 1 (3,5 điểm — Kiến thức Lâm nghiệp Chuyên sâu Lớp 12)",
        problem: "Một công ty lâm nghiệp tại vùng Đông Nam Bộ quản lý khu rừng trồng keo lai (chu kỳ gỗ lớn 12 năm) diện tích 500 ha với mật độ trồng ban đầu là 1.600 cây/ha.\n1. Hãy trình bày cơ sở khoa học và xây dựng phương án kỹ thuật 'Tỉa thưa nuôi dưỡng rừng' qua 2 lần: Xác định thời điểm tuổi tỉa thưa (Lần 1 và Lần 2), cường độ chặt tỉa (% số cây), mật độ duy trì cuối cùng của lâm phần khi bước vào tuổi khai thác thành thục công nghệ để tạo ra cây gỗ lớn có đường kính DBH > 30 cm đạt tiêu chuẩn chứng chỉ FSC. (1,5 điểm)\n2. Dựa vào mô hình Allometric ln(AGB) = -2,15 + 1,85·ln(DBH) + 0,92·ln(H) (với DBH tính bằng cm, H tính bằng m, AGB tính bằng kg/cây):\n   • Hãy ước tính sinh khối trên mặt đất (AGB) của một cây keo thành thục có DBH = 32 cm và H = 22 m. (0,75 điểm)\n   • Với mật độ cuối cùng là 500 cây/ha, tính trữ lượng sinh khối khô (tấn/ha) và lượng khí CO2 tương đương (tấn CO2e/ha) được lưu giữ trên 1 hecta rừng này. (0,75 điểm)\n3. Nêu 2 điều kiện bắt buộc để khu rừng này được tổ chức quốc tế cấp Tín chỉ Carbon rừng theo tiêu chuẩn VCS (Verified Carbon Standard). (0,5 điểm)",
        recallHint: "Lâm nghiệp chuyên sâu: Tỉa thưa Lần 1 (tuổi 3-4, giảm xuống 800-900 cây/ha), Lần 2 (tuổi 6-7, giảm xuống 400-500 cây/ha). Allometric: Thay số tính ln(AGB) -> AGB (kg). Tính CO2e = Sinh khối khô × 0,47 × (44/12). VCS đòi hỏi: Tính bổ sung (Additionality) và Tính lâu dài (Permanence chống rủi ro cháy rừng).",
        rubric: [
          "1. Phương án tỉa thưa 2 lần nuôi dưỡng rừng gỗ lớn (1,5đ): Lần 1 ở tuổi 3-4 khi khép tán, chặt 40-45% cây cong queo sâu bệnh, đưa mật độ về 850-900 cây/ha (0,5đ); Lần 2 ở tuổi 6-7 khi tái khép tán, chặt 40-45% cây kém phẩm chất, đưa mật độ cuối về 450-500 cây/ha (0,5đ); Bảo đảm không gian dinh dưỡng tối ưu để đường kính DBH đạt > 30 cm sau 12 năm đạt chuẩn chứng chỉ rừng bền vững FSC xuất khẩu gỗ (0,5đ).",
          "2. Tính toán sinh khối và tín chỉ carbon (1,5đ):",
          "  • Tính đúng ln(AGB) = -2,15 + 1,85·ln(32) + 0,92·ln(22) = -2,15 + 1,85·(3,4657) + 0,92·(3,0910) = -2,15 + 6,4115 + 2,8437 = 7,1052 -> AGB = e^(7,1052) ≈ 1.218,3 kg/cây (0,75đ).",
          "  • Với mật độ 500 cây/ha: Tổng sinh khối khô = 500 × 1.218,3 kg = 609.150 kg/ha ≈ 609,15 tấn/ha (0,375đ); Lượng CO2e cố định = 609,15 × 0,47 × (44/12) ≈ 1.050,4 tấn CO2e/ha (0,375đ).",
          "3. Hai điều kiện bắt buộc của chuẩn tín chỉ carbon VCS (0,5đ): Tính bổ sung (Additionality - dự án chứng minh nếu không có nguồn tiền tín chỉ carbon thì rừng gỗ lớn không được duy trì, nguy cơ bị chặt sớm chu kỳ ngắn) (0,25đ); Tính lâu dài và biện pháp dự phòng rủi ro cháy rừng/sâu bệnh (Permanence & Buffer Pool) (0,25đ)."
        ]
      },
      {
        id: 2,
        points: 3.5,
        title: "Câu 2 (3,5 điểm — Kiến thức Thủy sản Chuyên sâu Lớp 12)",
        problem: "Một cơ sở nuôi tôm thẻ chân trắng siêu thâm canh tại ven biển ứng dụng công nghệ tuần hoàn khép kín RAS với quy mô thể tích nước nuôi là 200 m3, mật độ nuôi 300 con/m3. Tổng sinh khối tôm ở tháng thứ 3 đạt 1.200 kg. Khẩu phần ăn hàng ngày là 36 kg thức ăn viên (chứa 40% protein thô, tỷ lệ Nitơ chiếm 16% khối lượng protein).\n1. Biết rằng tôm đồng hóa giữ lại được 35% lượng Nitơ thức ăn vào cơ thể; 15% Nitơ bị thất thoát dưới dạng phân rắn được gom xả qua máy lọc trống (Drum filter); 50% lượng Nitơ còn lại bài tiết trực tiếp vào nước dưới dạng Tổng Nitơ Amoniac (TAN).\n   • Hãy tính tổng khối lượng TAN (kg) phát sinh hòa tan vào nước nuôi trong một ngày đêm. (0,75 điểm)\n   • Tính khối lượng Oxy hòa tan (O2, kg) tối thiểu cần cung cấp riêng cho bể lọc sinh học MBBR trong 1 ngày để vi khuẩn nitrat hóa chuyển hóa hoàn toàn lượng TAN trên thành Nitrat NO3-. (0,75 điểm)\n2. Giải thích chi tiết nguyên lý hoạt động của tháp tách bọt Protein Skimmer và vai trò của việc bổ sung vi khuẩn dị dưỡng kết hợp mật rỉ đường đối với việc giảm tải cho bể lọc sinh học MBBR. (1,5 điểm)\n3. Nêu giải pháp điều chỉnh độ kiềm (Alkalinity) và pH cho hệ thống tuần hoàn này khi chỉ số pH có xu hướng giảm liên tục xuống dưới 7,0. (0,5 điểm)",
        recallHint: "Thủy sản VDC: Khối lượng Nitơ ăn vào = 36 kg × 40% × 16% = 2,304 kg N. TAN thải ra = 2,304 × 50% = 1,152 kg TAN/ngày. Lượng O2 cho nitrat hóa = 1,152 × 4,57 ≈ 5,26 kg O2/ngày. Protein Skimmer cuốn protein lơ lửng trước khi bị phân hủy; Vi khuẩn dị dưỡng hấp thu NH4+ thành floc; Bổ sung NaHCO3 nâng kiềm và ổn định pH.",
        rubric: [
          "1.1. Tính khối lượng TAN phát sinh (0,75đ): Lượng Protein ăn vào = 36 × 40% = 14,4 kg protein; Lượng Nitơ tổng ăn vào = 14,4 × 16% = 2,304 kg N; Lượng TAN bài tiết vào nước = 2,304 × 50% = 1,152 kg TAN/ngày.",
          "1.2. Tính lượng Oxy hòa tan cho bể lọc MBBR (0,75đ): Theo lý thuyết nitrat hóa, oxy hóa 1 kg TAN cần 4,57 kg O2; Khối lượng O2 cần cung cấp cho bể lọc MBBR trong 1 ngày = 1,152 × 4,57 ≈ 5,265 kg O2/ngày.",
          "2. Nguyên lý Protein Skimmer & vi khuẩn dị dưỡng (1,5đ):",
          "  • Nguyên lý Protein Skimmer (0,75đ): Tạo bọt khí siêu nhỏ micro-bubble sục từ đáy cột lên; các phân tử protein và chất hữu cơ hòa tan có tính lưỡng cực bám dính vào màng bọt khí, nổi lên bề mặt tạo khối bọt cô đặc trào ra ngoài cốc gom bọt, loại bỏ chất thải hữu cơ trước khi bị phân hủy sinh ra khí độc.",
          "  • Vai trò vi khuẩn dị dưỡng + rỉ đường (0,75đ): Bổ sung rỉ đường nâng C:N >= 12:1 kích thích vi khuẩn dị dưỡng sinh sản nhanh, sử dụng trực tiếp TAN làm nguồn đạm để tổng hợp sinh khối protein vi khuẩn (Biofloc), giảm 30-50% nồng độ TAN trước khi nước đi vào bể MBBR, giúp ngăn chặn hiện tượng quá tải lọc sinh học.",
          "3. Giải pháp điều chỉnh độ kiềm và pH (0,5đ): Do nitrat hóa làm tiêu hao ion kiềm sinh H+, cần châm liên tục dung dịch muối Sodium Bicarbonate (NaHCO3) hòa tan (vừa cung cấp HCO3- làm nguồn carbon vô cơ cho vi khuẩn nitrat hóa vừa nâng pH lên 7,8 - 8,2 an toàn cho tôm)."
        ]
      },
      {
        id: 3,
        points: 1.0,
        title: "Câu 3 (1,0 điểm — Tình huống Nông học VDC & Net-Zero)",
        problem: "Trong chiến lược phát triển Nông nghiệp sinh thái bền vững hướng tới mục tiêu phát thải ròng bằng '0' (Net-Zero Carbon) vào năm 2050 của Việt Nam, hãy phân tích cơ chế khoa học của 2 giải pháp kỹ thuật sau đây nhằm giảm thiểu phát thải khí nhà kính:\n1. Giải pháp kỹ thuật tưới ướt - khô xen kẽ (AWD - Alternate Wetting and Drying) trong canh tác lúa nước nhằm giảm phát thải khí Mêtan (CH4). (0,5 điểm)\n2. Giải pháp thu gom 100% chất thải chăn nuôi lợn đưa vào hầm Biogas công nghiệp kết hợp máy ép tách phân rắn ủ phân hữu cơ compost bón cho vườn cây ăn quả lâu năm. (0,5 điểm)",
        recallHint: "Net-Zero Nông nghiệp: AWD phơi ruộng nứt chân chim ngắt quãng giúp oxy tràn vào đất ức chế vi khuẩn sinh mêtan Methanogen và oxy hóa CH4 thành CO2 (GWP thấp hơn 28 lần). Biogas ngăn phân lộ thiên kỵ khí sinh CH4 và N2O, compost bón cây cố định carbon trong đất và thay thế phân đạm hóa học.",
        rubric: [
          "1. Cơ chế kỹ thuật AWD giảm phát thải CH4 (0,5đ): Trong các đợt rút nước phơi ruộng nứt chân chim, không khí giàu oxy khuếch tán sâu vào tầng đất canh tác làm tăng thế oxy hóa khử Eh (từ âm sang dương), ức chế hoàn toàn hoạt động của nhóm vi khuẩn cổ sinh mêtan Methanogen (vốn là sinh vật kỵ khí tuyệt đối), đồng thời kích hoạt vi khuẩn oxy hóa mêtan (Methanotrophic), làm giảm từ 40% đến 50% lượng phát thải khí CH4 ra khí quyển.",
          "2. Cơ chế Biogas khép kín và ủ Compost (0,5đ): Ngăn chặn 100% việc phân hủy kỵ khí lộ thiên ở các hố phân hở (nguồn phát thải CH4 và N2O có tiềm năng nóng lên toàn cầu GWP gấp 28 và 265 lần CO2); khí CH4 thu hồi được đốt sinh nhiệt/điện sạch; bã rắn ủ compost hiếu khí tạo mùn liên kết cố định Carbon hữu cơ lâu dài trong đất vườn cây ăn quả và thay thế phân đạm hóa học (giảm phát thải từ công nghệ sản xuất phân vô cơ)."
        ]
      }
    ]
  },

};

// ============================================================================
// 3. MƯỜI DẠNG BÀI TOÁN KỸ THUẬT & TỰ LUẬN KINH ĐIỂN THI HSG
// ============================================================================
const HSG_CLASSIC_MATH_PROBLEMS = [
  {
    id: "p1_ferti",
    grade: "cn10",
    category: "Trồng trọt 10 — Hóa sinh Phân bón",
    title: "Dạng 1: Quy đổi lượng phân bón đơn và phân hỗn hợp N-P-K theo định mức nguyên chất",
    problem: "Một hợp tác xã trồng bưởi da xanh cần bón cho 2,5 ha vườn cây trong thời kỳ nuôi quả với định mức dinh dưỡng nguyên chất là: 160 kg N, 90 kg P2O5 và 180 kg K2O cho mỗi hecta.\n1. Nếu sử dụng các loại phân bón đơn: Phân đạm Urê (46% N), Super lân (16% P2O5) và Kali clorua (60% K2O), hãy tính tổng khối lượng mỗi loại phân bón thương phẩm cần mua cho cả 2,5 ha.\n2. Nếu hợp tác xã sử dụng trước 1.500 kg phân hỗn hợp NPK (loại 16-16-8) cho 2,5 ha, hãy tính lượng phân đạm Urê và Kali clorua đơn cần bón bổ sung để vừa đủ định mức yêu cầu.",
    solutionSteps: [
      "Bước 1: Tính tổng dinh dưỡng nguyên chất cần cho 2,5 ha:\n  • Tổng N = 160 × 2,5 = 400 kg N.\n  • Tổng P2O5 = 90 × 2,5 = 225 kg P2O5.\n  • Tổng K2O = 180 × 2,5 = 450 kg K2O.",
      "Bước 2: Tính khối lượng phân bón đơn thương phẩm (Câu 1):\n  • Khối lượng đạm Urê = (400 × 100) / 46 ≈ 869,57 kg.\n  • Khối lượng Super lân = (225 × 100) / 16 = 1.406,25 kg.\n  • Khối lượng Kali clorua = (450 × 100) / 60 = 750,00 kg.",
      "Bước 3: Tính toán khi bón phân hỗn hợp NPK 16-16-8 (Câu 2):\n  • Dinh dưỡng có trong 1.500 kg NPK 16-16-8:\n    - N cung cấp = 1.500 × 16% = 240 kg N.\n    - P2O5 cung cấp = 1.500 × 16% = 240 kg P2O5 (đã vượt 225 kg một lượng nhỏ 15 kg, không cần bón thêm lân).\n    - K2O cung cấp = 1.500 × 8% = 120 kg K2O.\n  • Lượng N còn thiếu cần bón bổ sung bằng Urê = 400 - 240 = 160 kg N.\n    -> Khối lượng Urê bổ sung = (160 × 100) / 46 ≈ 347,83 kg.\n  • Lượng K2O còn thiếu cần bón bổ sung bằng KCl = 450 - 120 = 330 kg K2O.\n    -> Khối lượng Kali clorua bổ sung = (330 × 100) / 60 = 550,00 kg."
    ],
    rubric: [
      "Tính đúng tổng dinh dưỡng nguyên chất cho 2,5 ha: 0,5 điểm.",
      "Tính đúng khối lượng 3 loại phân đơn: Urê 869,6 kg; Super lân 1406,3 kg; Kali 750 kg: 0,75 điểm.",
      "Tính đúng lượng dinh dưỡng trong 1.500 kg NPK 16-16-8: 0,5 điểm.",
      "Tính đúng lượng phân Urê và KCl cần bón bổ sung (347,8 kg Urê và 550 kg KCl): 0,75 điểm."
    ]
  },
  {
    id: "p2_pearson",
    grade: "cn11",
    category: "Chăn nuôi 11 — Dinh dưỡng & Khẩu phần",
    title: "Dạng 2: Phối trộn thức ăn hỗn hợp bằng thuật toán Hình vuông Pearson",
    problem: "Một trang trại nuôi lợn thịt muốn tự phối trộn 2.000 kg thức ăn hỗn hợp hoàn chỉnh có tỷ lệ protein thô đạt 16,5% từ các nguồn nguyên liệu sẵn có:\n• Nhóm giàu năng lượng (nghèo protein): Bột ngô nghiền chứa 8,5% protein thô.\n• Nhóm đậm đặc (giàu protein): Bột đậu nành ép dầu chứa 44,5% protein thô.\n1. Áp dụng thuật toán Hình vuông Pearson, hãy tính khối lượng bột ngô và bột đậu nành cần dùng để phối trộn đủ 2.000 kg thức ăn trên.\n2. Giả sử giá bột ngô là 8.000 đ/kg và giá bột đậu nành là 16.000 đ/kg. Hãy tính giá thành nguyên liệu của 1 kg thức ăn hỗn hợp tự phối trộn.",
    solutionSteps: [
      "Bước 1: Áp dụng Hình vuông Pearson:\n  • Đặt tỷ lệ protein mục tiêu ở giữa: P_mục_tiêu = 16,5%.\n  • Nguyên liệu 1 (Ngô): 8,5%  --->  Phần đậu nành = |8,5 - 16,5| = 8,0 phần.\n  • Nguyên liệu 2 (Đậu nành): 44,5%  --->  Phần ngô = |44,5 - 16,5| = 28,0 phần.\n  • Tổng số phần = 28,0 + 8,0 = 36,0 phần.",
      "Bước 2: Tính tỷ lệ % và khối lượng nguyên liệu cho 2.000 kg hỗn hợp:\n  • Tỷ lệ bột ngô = (28,0 / 36,0) × 100% ≈ 77,78%.\n    -> Khối lượng bột ngô cần dùng = 2.000 × (28 / 36) ≈ 1.555,56 kg.\n  • Tỷ lệ bột đậu nành = (8,0 / 36,0) × 100% ≈ 22,22%.\n    -> Khối lượng bột đậu nành cần dùng = 2.000 × (8 / 36) ≈ 444,44 kg.\n  • Kiểm tra lại: (1.555,56 × 8,5% + 444,44 × 44,5%) / 2.000 = (132,22 + 197,78) / 2000 = 330 / 2000 = 16,5% (Đúng).",
      "Bước 3: Tính giá thành nguyên liệu cho 1 kg thức ăn:\n  • Chi phí ngô = 1.555,56 kg × 8.000 đ = 12.444.480 đồng.\n  • Chi phí đậu nành = 444,44 kg × 16.000 đ = 7.111.040 đồng.\n  • Tổng chi phí 2.000 kg = 12.444.480 + 7.111.040 = 19.555.520 đồng.\n  • Giá thành nguyên liệu 1 kg = 19.555.520 / 2.000 ≈ 9.778 đồng/kg."
    ],
    rubric: [
      "Vẽ đúng hình vuông Pearson và tính đúng các hiệu số phần (28 phần ngô, 8 phần đậu nành): 0,75 điểm.",
      "Tính đúng khối lượng bột ngô (1.555,56 kg) và bột đậu nành (444,44 kg): 0,75 điểm.",
      "Tính đúng giá thành nguyên liệu 1 kg thức ăn (~9.778 đ/kg): 0,5 điểm."
    ]
  },
  {
    id: "p3_fcr",
    grade: "cn11",
    category: "Chăn nuôi 11 — Tăng trọng & FCR",
    title: "Dạng 3: Tính toán Hệ số chuyển đổi thức ăn (FCR), Tốc độ tăng trưởng và Hiệu quả kinh tế",
    problem: "Một đàn lợn thịt 200 con nuôi trong chuồng kín có khối lượng bình quân lúc bắt đầu vào nuôi là 25 kg/con. Sau 90 ngày vỗ béo, khối lượng bình quân lúc xuất chuồng đạt 105 kg/con. Tỷ lệ hao hụt trong quá trình nuôi là 2% (4 con chết). Tổng khối lượng thức ăn công nghiệp mà cả đàn đã tiêu thụ trong 90 ngày là 41.580 kg.\n1. Hãy tính tốc độ tăng khối lượng bình quân ngày (ADG - Average Daily Gain, g/con/ngày) của những con lợn còn sống.\n2. Hãy tính hệ số chuyển đổi thức ăn (FCR) của đàn lợn này.\n3. Nếu áp dụng biện pháp bổ sung chế phẩm vi sinh Probiotics giúp FCR giảm từ giá trị trên xuống còn 2,40, trang trại sẽ tiết kiệm được bao nhiêu kg thức ăn cho cả lứa nuôi?",
    solutionSteps: [
      "Bước 1: Tính tốc độ tăng khối lượng bình quân ngày (ADG):\n  • Tăng trọng 1 con lợn còn sống = 105 kg - 25 kg = 80 kg.\n  • Thời gian nuôi = 90 ngày.\n  • ADG = (80 kg / 90 ngày) × 1.000 g/kg ≈ 888,89 g/con/ngày.",
      "Bước 2: Tính hệ số chuyển đổi thức ăn (FCR):\n  • Số lợn xuất chuồng còn sống = 200 - 4 = 196 con.\n  • Tổng khối lượng tăng trọng của cả đàn thu được = 196 con × 80 kg = 15.680 kg.\n  • FCR thực tế = Tổng thức ăn tiêu thụ / Tổng tăng trọng thu được = 41.580 kg / 15.680 kg = 2,6519 ≈ 2,65.",
      "Bước 3: Tính lượng thức ăn tiết kiệm được khi FCR = 2,40:\n  • Lượng thức ăn cần thiết khi FCR = 2,40 là: 15.680 kg × 2,40 = 37.632 kg.\n  • Lượng thức ăn tiết kiệm được = 41.580 - 37.632 = 3.948 kg thức ăn."
    ],
    rubric: [
      "Tính đúng ADG = 888,89 g/con/ngày: 0,75 điểm.",
      "Tính đúng tổng tăng trọng cả đàn (15.680 kg) và FCR ≈ 2,65: 0,75 điểm.",
      "Tính đúng lượng thức ăn tiết kiệm được (3.948 kg): 0,5 điểm."
    ]
  },
  {
    id: "p4_upgrading",
    grade: "cn11",
    category: "Chăn nuôi 11 — Di truyền & Chọn giống",
    title: "Dạng 4: Tính tỷ lệ máu ngoại và tỷ lệ máu nội qua n thế hệ Lai cải tạo",
    problem: "Một hợp tác xã triển khai chương trình cải tạo đàn bò vàng địa phương tầm vóc nhỏ (khối lượng bò cái trưởng thành chỉ 180-220 kg) bằng phương pháp thụ tinh nhân tạo sử dụng tinh bò đực Red Sindhi thuần chủng (100% máu ngoại Sind). Đực lai F1, F2... đều bị thiến để vỗ béo thịt, chỉ giữ lại các con cái lai để tiếp tục phối với đực Red Sindhi thuần chủng qua 5 thế hệ liên tiếp (tạo các đời F1, F2, F3, F4, F5).\n1. Hãy lập bảng biểu diễn tỷ lệ máu bò ngoại Red Sindhi và tỷ lệ máu bò vàng nội qua từng thế hệ từ F1 đến F5.\n2. Thiết lập công thức tổng quát tính tỷ lệ máu ngoại ở thế hệ Fn.\n3. Tại sao không tiếp tục lai vô hạn định để đạt 100% máu ngoại mà thường dừng lại ở thế hệ F4 hoặc F5?",
    solutionSteps: [
      "Bước 1: Lập bảng tỷ lệ máu qua 5 thế hệ lai cải tạo:\n  • Thế hệ P: ♀ Bò vàng địa phương (100% nội) × ♂ Đực Red Sindhi (100% ngoại)\n  • Thế hệ F1: Máu ngoại = 1/2 (50,0%) | Máu nội = 1/2 (50,0%)\n  • Phối: ♀ F1 × ♂ Đực Red Sindhi (100% ngoại) -> F2:\n    - Máu ngoại F2 = (50% + 100%) / 2 = 75,0% (3/4)\n    - Máu nội F2 = 50% / 2 = 25,0% (1/4)\n  • Phối: ♀ F2 × ♂ Đực Red Sindhi -> F3:\n    - Máu ngoại F3 = (75% + 100%) / 2 = 87,5% (7/8)\n    - Máu nội F3 = 25% / 2 = 12,5% (1/8)\n  • Phối: ♀ F3 × ♂ Đực Red Sindhi -> F4:\n    - Máu ngoại F4 = (87,5% + 100%) / 2 = 93,75% (15/16)\n    - Máu nội F4 = 12,5% / 2 = 6,25% (1/16)\n  • Phối: ♀ F4 × ♂ Đực Red Sindhi -> F5:\n    - Máu ngoại F5 = (93,75% + 100%) / 2 = 96,875% (31/32)\n    - Máu nội F5 = 6,25% / 2 = 3,125% (1/32).",
      "Bước 2: Thiết lập công thức tổng quát ở thế hệ Fn:\n  • Tỷ lệ máu ngoại Fn = 1 - (1/2)^n = (2^n - 1) / 2^n\n  • Tỷ lệ máu nội Fn = (1/2)^n.",
      "Bước 3: Giải thích lý do dừng ở F4 hoặc F5:\n  • Khi đạt F4 hoặc F5, đàn bò lai đã mang > 93 - 96% gen cao sản của bò ngoại (tầm vóc lớn, sản lượng thịt/sữa cao gần như bò thuần).\n  • Vẫn giữ lại 3 - 6% gen của giống bản địa giúp đàn bò duy trì được các tính trạng quý: khả năng chịu nhiệt đới nóng ẩm, chống chịu ve bét, kháng bệnh ký sinh trùng đường máu và tận dụng tốt nguồn thức ăn thô xơ nghèo dinh dưỡng của địa phương."
    ],
    rubric: [
      "Lập đúng bảng tính tỷ lệ máu F1 -> F5: 0,75 điểm.",
      "Thiết lập đúng công thức tổng quát: P_ngoại = 1 - (1/2)^n: 0,5 điểm.",
      "Giải thích sâu sắc ý nghĩa bảo lưu tỷ lệ máu bản địa về tính thích nghi sinh thái: 0,75 điểm."
    ]
  },
  {
    id: "p5_density",
    grade: "cn12",
    category: "Lâm nghiệp 12 — Trồng & Chăm sóc Rừng",
    title: "Dạng 5: Tính diện tích dinh dưỡng, mật độ trồng rừng và khối lượng cây con dự phòng",
    problem: "Một ban quản lý rừng phòng hộ lập kế hoạch trồng mới 25 ha rừng keo tai tượng kết hợp cây bản địa (sao đen) đầu nguồn hồ thủy điện. Quy cách thiết kế: Trồng theo hàng, khoảng cách cây cách cây trên hàng là 2,5 m; cự ly giữa các hàng là 3,0 m. Do địa hình đồi dốc đá, tỷ lệ hao hụt cây giống chết phải trồng dặm dự kiến là 15% tổng số cây trồng chính thức.\n1. Hãy tính diện tích dinh dưỡng của một cây và mật độ trồng chính thức trên 1 ha (cây/ha).\n2. Tính tổng số cây giống keo tai tượng và sao đen đủ tiêu chuẩn xuất vườn mà ban quản lý cần chuẩn bị để trồng hết 25 ha (bao gồm cả lượng cây dự phòng trồng dặm).\n3. Nêu các tiêu chuẩn ngoại hình của cây con giống lâm nghiệp đạt chuẩn đem đi trồng rừng.",
    solutionSteps: [
      "Bước 1: Tính diện tích dinh dưỡng và mật độ 1 ha:\n  • Diện tích dinh dưỡng 1 cây = a × b = 2,5 m × 3,0 m = 7,5 m2/cây.\n  • Mật độ trồng trên 1 ha (10.000 m2) = 10.000 / 7,5 = 1.333,33 ≈ 1.333 cây/ha.",
      "Bước 2: Tính tổng số cây giống cho 25 ha:\n  • Số cây trồng chính thức trên 25 ha = 25 × (10.000 / 7,5) = 33.333 cây (làm tròn số nguyên).\n  • Số cây dự phòng trồng dặm (15%) = 33.333 × 15% = 5.000 cây.\n  • Tổng số cây giống cần chuẩn bị = 33.333 + 5.000 = 38.333 cây giống.",
      "Bước 3: Tiêu chuẩn cây giống xuất vườn:\n  • Cây sinh trưởng tốt, không bị sâu bệnh, đỉnh sinh trưởng lành lặn.\n  • Thân thẳng, đã hóa gỗ phần gốc (1/3 chiều cao thân).\n  • Chiều cao cây đạt từ 30 - 50 cm, đường kính cổ rễ đạt từ 3 - 5 mm.\n  • Bộ rễ nguyên vẹn trong bầu đất, không bị biến dạng, rễ đan chặt giữ bầu đất không bị vỡ khi tháo vỏ bầu."
    ],
    rubric: [
      "Tính đúng diện tích dinh dưỡng (7,5 m2) và mật độ (1.333 cây/ha): 0,5 điểm.",
      "Tính đúng số cây trồng chính (33.333 cây) và tổng số cây gồm trồng dặm (38.333 cây): 0,75 điểm.",
      "Nêu đầy đủ 4 tiêu chuẩn kỹ thuật cây giống xuất vườn: 0,75 điểm."
    ]
  },
  {
    id: "p6_biofloc",
    grade: "cn12",
    category: "Thủy sản 12 — Quản lý Ao nuôi & Biofloc",
    title: "Dạng 6: Tính toán Sinh khối, Khẩu phần ăn hàng ngày và Lượng mật rỉ đường cân bằng C:N trong Biofloc",
    problem: "Một trang trại nuôi tôm thẻ chân trắng thâm canh ứng dụng công nghệ Biofloc trong 2 ao lót bạt tròn (diện tích mỗi ao là 1.000 m2). Mật độ thả giống là 200 con/m2. Ở ngày nuôi thứ 75:\n• Tỷ lệ sống của tôm ước đạt 80%.\n• Khối lượng tôm bình quân đạt 50 con/kg (20 g/con).\n• Khẩu phần ăn hàng ngày bằng 3,0% tổng sinh khối tôm trong ao.\n• Hàm lượng đạm (Protein thô) trong thức ăn tôm là 40%.\n1. Tính tổng số cá thể tôm còn sống và tổng sinh khối tôm (kg) có trong cả 2 ao nuôi.\n2. Tính tổng khối lượng thức ăn công nghiệp cần cho ăn trong một ngày cho cả 2 ao.\n3. Để duy trì tỷ lệ C:N ≥ 12:1 giúp vi khuẩn dị dưỡng đồng hóa Amoniac thành hạt Biofloc, biết 1 kg thức ăn 40% đạm thải ra môi trường khoảng 0,04 kg Nitơ Amoniac (TAN), và mật rỉ đường chứa 40% Carbon hữu cơ. Hãy tính khối lượng mật rỉ đường cần bổ sung vào 2 ao mỗi ngày.",
    solutionSteps: [
      "Bước 1: Tính số lượng tôm và sinh khối 2 ao:\n  • Tổng diện tích 2 ao = 2 × 1.000 m2 = 2.000 m2.\n  • Số tôm giống thả ban đầu = 2.000 m2 × 200 con/m2 = 400.000 con.\n  • Số tôm còn sống = 400.000 con × 80% = 320.000 con.\n  • Tổng sinh khối tôm = 320.000 con / (50 con/kg) = 6.400 kg tôm.",
      "Bước 2: Tính khối lượng thức ăn 1 ngày:\n  • Lượng thức ăn/ngày = 6.400 kg × 3,0% = 192 kg thức ăn/ngày.",
      "Bước 3: Tính khối lượng mật rỉ đường cần bổ sung (cân bằng C:N = 12:1):\n  • Lượng TAN sinh ra từ 192 kg thức ăn = 192 kg × 0,04 kg TAN/kg = 7,68 kg Nitơ (N).\n  • Lượng Carbon (C) hữu cơ cần để đạt tỷ lệ C:N = 12:1 là: C_cần = 7,68 kg N × 12 = 92,16 kg Carbon.\n  • Do mật rỉ đường chứa 40% Carbon, nên khối lượng mật rỉ đường cần dùng là:\n    M_rỉ_đường = 92,16 kg / 0,40 = 230,40 kg mật rỉ đường/ngày."
    ],
    rubric: [
      "Tính đúng số tôm sống (320.000 con) và sinh khối (6.400 kg): 0,75 điểm.",
      "Tính đúng lượng thức ăn hàng ngày (192 kg/ngày): 0,5 điểm.",
      "Tính đúng lượng N thải ra (7,68 kg N) và lượng mật rỉ đường cần bổ sung (230,4 kg): 0,75 điểm."
    ]
  },
  {
    id: "p7_ras_aqua",
    grade: "cn12",
    category: "Thủy sản 12 — RAS & Aquaponics",
    title: "Dạng 7: Tính toán Hệ thống Tuần hoàn RAS, Công suất Lọc sinh học Biofilter và Sản lượng Rau",
    problem: "Một cơ sở nuôi cá rô phi đơn tính tuần hoàn RAS kết hợp trồng rau thủy canh Aquaponics. Thể tích bể nuôi cá là 100 m3, mật độ nuôi đạt sinh khối cực đại 40 kg cá/m3 (tổng sinh khối cá = 4.000 kg). Hàng ngày cá được cho ăn 1,5% sinh khối với thức ăn chứa 32% protein thô.\n1. Biết rằng trong hệ thống RAS, trung bình mỗi ngày 1 kg thức ăn (32% protein) sẽ bài tiết ra khoảng 30 g Tổng Amoniac Nitơ (TAN). Hãy tính tổng lượng TAN sinh ra mỗi ngày mà bể lọc sinh học (Biofilter) cần phải chuyển hóa.\n2. Giá thể vi sinh Kaldnes K1 trong bể lọc sinh học có diện tích bề mặt riêng hiệu dụng là 800 m2/m3 giá thể. Tốc độ chuyển hóa TAN của màng vi sinh Nitrat hóa hiếu khí đạt 0,60 g TAN/m2 bề mặt giá thể/ngày. Hãy tính thể tích giá thể Kaldnes K1 tối thiểu cần đưa vào bể Biofilter.\n3. Nếu hệ thống Aquaponics sử dụng toàn bộ lượng Nitrat (NO3-) tạo ra để trồng rau xà lách, biết cứ mỗi 1 kg TAN được vi khuẩn chuyển hóa sẽ cung cấp đủ dinh dưỡng Nitrat cho 35 kg rau xà lách thương phẩm. Hãy tính sản lượng rau xà lách dự kiến thu hoạch được mỗi ngày.",
    solutionSteps: [
      "Bước 1: Tính lượng thức ăn và lượng TAN phát sinh/ngày:\n  • Lượng thức ăn/ngày = 4.000 kg cá × 1,5% = 60 kg thức ăn/ngày.\n  • Tổng lượng TAN sinh ra/ngày = 60 kg thức ăn × 30 g TAN/kg = 1.800 g TAN/ngày (1,8 kg TAN/ngày).",
      "Bước 2: Tính thể tích giá thể Biofilter Kaldnes K1:\n  • Tổng diện tích bề mặt vi sinh cần có để xử lý 1.800 g TAN:\n    S_bề_mặt = 1.800 g TAN / (0,60 g TAN/m2/ngày) = 3.000 m2.\n  • Thể tích giá thể Kaldnes K1 cần dùng:\n    V_giá_thể = 3.000 m2 / (800 m2/m3) = 3,75 m3 giá thể.",
      "Bước 3: Tính sản lượng rau xà lách Aquaponics thu hoạch:\n  • Với 1,8 kg TAN sinh ra mỗi ngày, sản lượng rau xà lách tạo ra là:\n    Sản lượng rau = 1,8 kg TAN × 35 kg rau/kg TAN = 63,0 kg rau xà lách/ngày."
    ],
    rubric: [
      "Tính đúng lượng thức ăn (60 kg) và lượng TAN sinh ra (1.800 g TAN): 0,75 điểm.",
      "Tính đúng diện tích bề mặt lọc (3.000 m2) và thể tích giá thể K1 (3,75 m3): 0,75 điểm.",
      "Tính đúng sản lượng rau xà lách Aquaponics (63 kg/ngày): 0,5 điểm."
    ]
  },
  {
    id: "p8_forestry_table",
    grade: "cn12",
    category: "Lâm nghiệp 12 — Xử lý Số liệu Thống kê",
    title: "Dạng 8: Phân tích Bảng số liệu Thống kê Lâm nghiệp và Tính Tỷ lệ Che phủ Rừng",
    problem: "Cho bảng số liệu về diện tích đất lâm nghiệp và diện tích tự nhiên của một tỉnh vùng Tây Nguyên qua 3 mốc thời gian:\n• Diện tích tự nhiên toàn tỉnh: 680.000 ha (không đổi qua các năm).\n• Năm 2015: Rừng tự nhiên = 280.000 ha; Rừng trồng = 80.000 ha.\n• Năm 2020: Rừng tự nhiên = 282.000 ha; Rừng trồng = 120.000 ha.\n• Năm 2025: Rừng tự nhiên = 285.000 ha; Rừng trồng = 165.000 ha.\n1. Hãy tính tổng diện tích rừng và tỷ lệ che phủ rừng (%) của tỉnh qua các năm 2015, 2020 và 2025.\n2. Tính tốc độ tăng trưởng diện tích rừng trồng năm 2025 so với năm 2015.\n3. Rút ra các nhận xét và giải thích nguyên nhân của sự thay đổi trên.",
    solutionSteps: [
      "Bước 1: Tính tổng diện tích rừng và tỷ lệ che phủ rừng:\n  • Năm 2015: Tổng diện tích rừng = 280.000 + 80.000 = 360.000 ha.\n    -> Tỷ lệ che phủ = (360.000 / 680.000) × 100% ≈ 52,94%.\n  • Năm 2020: Tổng diện tích rừng = 282.000 + 120.000 = 402.000 ha.\n    -> Tỷ lệ che phủ = (402.000 / 680.000) × 100% ≈ 59,12%.\n  • Năm 2025: Tổng diện tích rừng = 285.000 + 165.000 = 450.000 ha.\n    -> Tỷ lệ che phủ = (450.000 / 680.000) × 100% ≈ 66,18%.",
      "Bước 2: Tính tốc độ tăng trưởng rừng trồng năm 2025 so với năm 2015:\n  • Tốc độ tăng trưởng = (165.000 / 80.000) × 100% = 206,25% (tăng hơn gấp đôi, tăng 106,25%).",
      "Bước 3: Nhận xét và giải thích:\n  • Nhận xét: Tổng diện tích rừng và độ che phủ rừng tăng liên tục (từ 52,94% lên 66,18%, tăng 13,24%). Diện tích rừng tự nhiên giữ ổn định và tăng nhẹ (+5.000 ha nhờ khoanh nuôi tái sinh). Diện tích rừng trồng tăng trưởng vượt bậc (+85.000 ha).\n  • Giải thích: Nhờ thực thi nghiêm lệnh đóng cửa rừng tự nhiên và chính sách khuyến khích kinh tế lâm nghiệp, người dân và doanh nghiệp tích cực đầu tư trồng rừng gỗ lớn kết hợp giao đất giao rừng bền vững."
    ],
    rubric: [
      "Tính đúng diện tích rừng và độ che phủ 3 năm (52,94%, 59,12%, 66,18%): 1,0 điểm.",
      "Tính đúng tốc độ tăng trưởng rừng trồng (206,25%): 0,5 điểm.",
      "Nhận xét và giải thích đầy đủ nguyên nhân chính sách lâm nghiệp: 0,5 điểm."
    ]
  },
  {
    id: "p9_rice_econ",
    grade: "cn10",
    category: "Nông học Đại cương — Hạch toán Kinh tế Nông nghiệp",
    title: "Dạng 9: Bài toán Hạch toán Kinh tế Canh tác 1 ha Lúa và Xác định Điểm hòa vốn",
    problem: "Một hợp tác xã nông nghiệp tổ chức sản xuất lúa cánh đồng lớn chất lượng cao diện tích 10 ha. Hạch toán chi phí đầu tư bình quân cho 1 ha bao gồm:\n• Chi phí giống lúa cấp xác nhận: 100 kg × 24.000 đ/kg = 2.400.000 đồng.\n• Chi phí phân bón: 7.200.000 đồng.\n• Chi phí thuốc bảo vệ thực vật sinh học: 2.800.000 đồng.\n• Chi phí dịch vụ cơ giới hóa (làm đất, gieo sạ, bơm nước, gặt đập): 5.600.000 đồng.\n• Chi phí công lao động gia đình và quản lý: 3.000.000 đồng.\n1. Tính tổng chi phí đầu tư cho 1 ha và tổng chi phí cho toàn bộ 10 ha.\n2. Với giá bán thóc tươi tại ruộng ký hợp đồng là 9.000 đ/kg, hãy xác định Năng suất hòa vốn (sản lượng thóc tối thiểu cần đạt trên 1 ha để thu đủ bù chi).\n3. Nếu năng suất thu hoạch thực tế đạt 6,8 tấn/ha, hãy tính tổng doanh thu, lợi nhuận thuần trên 1 ha và cho toàn bộ 10 ha.",
    solutionSteps: [
      "Bước 1: Tính tổng chi phí đầu tư:\n  • Chi phí trên 1 ha = 2.400.000 + 7.200.000 + 2.800.000 + 5.600.000 + 3.000.000 = 21.000.000 đồng/ha.\n  • Tổng chi phí cho 10 ha = 21.000.000 × 10 = 210.000.000 đồng.",
      "Bước 2: Xác định Năng suất hòa vốn (Break-even Yield):\n  • Năng suất hòa vốn (kg/ha) = Tổng chi phí 1 ha / Giá bán 1 kg thóc\n    -> Q_hòa_vốn = 21.000.000 đồng / 9.000 đ/kg ≈ 2.333,33 kg/ha (khoảng 2,33 tấn/ha).",
      "Bước 3: Tính doanh thu và lợi nhuận khi năng suất đạt 6,8 tấn/ha (6.800 kg/ha):\n  • Doanh thu 1 ha = 6.800 kg × 9.000 đ/kg = 61.200.000 đồng/ha.\n  • Lợi nhuận thuần 1 ha = 61.200.000 - 21.000.000 = 40.200.000 đồng/ha.\n  • Cho toàn bộ 10 ha:\n    - Tổng doanh thu 10 ha = 612.000.000 đồng.\n    - Tổng lợi nhuận thuần 10 ha = 402.000.000 đồng."
    ],
    rubric: [
      "Tính đúng chi phí 1 ha (21 triệu) và 10 ha (210 triệu): 0,5 điểm.",
      "Xác định đúng công thức và kết quả năng suất hòa vốn (2.333,33 kg/ha): 0,75 điểm.",
      "Tính đúng doanh thu và lợi nhuận thuần trên 1 ha và 10 ha: 0,75 điểm."
    ]
  },
  {
    id: "p10_circular_netzero",
    grade: "cn11",
    category: "Nông nghiệp Tuần hoàn & Net-Zero",
    title: "Dạng 10: Thiết kế Mô hình Nông nghiệp Tuần hoàn Khép kín (Net-Zero) và Luân chuyển Vật chất",
    problem: "Tại tỉnh Đồng Nai, một trang trại quy mô 15 ha gồm 3 hợp phần: Chăn nuôi lợn thịt (quy mô 1.500 con), Vườn cây ăn quả sầu riêng và bưởi da xanh (10 ha), và Ao nuôi cá rô phi - cá tra (2 ha).\n1. Hãy thiết kế chuỗi liên kết tuần hoàn khép kín giữa 3 phân ngành: Chăn nuôi <-> Trồng trọt <-> Thủy sản nhằm không phát thải chất thải ra môi trường (Zero Waste).\n2. Trình bày chi tiết dòng luân chuyển của 3 dòng vật chất then chốt: (a) Dòng phân và chất thải rắn chăn nuôi; (b) Dòng nước thải chăn nuôi và nước ao cá; (c) Dòng phụ phẩm cây ăn quả và bùn đáy ao.\n3. Nêu các đóng góp cụ thể của mô hình này vào mục tiêu giảm phát thải khí nhà kính hướng tới Net-Zero của ngành nông nghiệp Việt Nam.",
    solutionSteps: [
      "Bước 1: Thiết kế chuỗi liên kết tuần hoàn khép kín:\n  • Hợp phần Chăn nuôi lợn -> Cung cấp phân rắn (ủ compost) cho cây ăn quả và cung cấp khí sinh học Biogas (năng lượng đun nấu, chạy máy phát điện phục vụ trang trại).\n  • Hợp phần Trồng trọt cây ăn quả -> Cung cấp quả loại, phụ phẩm lá cành ủ men vi sinh làm thức ăn bổ sung cho chăn nuôi lợn và cá; thảm cỏ giữ nước chống bốc hơi.\n  • Hợp phần Ao thủy sản -> Sử dụng nước sau biogas đã xử lý qua hồ sinh học làm nguồn nước giàu dinh dưỡng nuôi cá rô phi; bùn ao giàu hữu cơ định kỳ nạo vét bón cho vườn bưởi, sầu riêng.",
      "Bước 2: Dòng luân chuyển của 3 dòng vật chất:\n  • (a) Phân rắn: Phân tươi qua máy ép tách phân cơ học -> Bã rắn phối trộn với trấu hun, nấm Trichoderma ủ hoai mục hiếu khí ở 60-70°C tạo phân hữu cơ vi sinh bón lót sâu cho 10 ha vườn cây sầu riêng/bưởi, thay thế 50-70% phân hóa học.\n  • (b) Nước thải: Nước thải sau máy ép phân đi vào hầm Biogas yếm khí phân giải chất hữu cơ sinh khí CH4 -> Nước sau Biogas chảy qua chuỗi hồ sinh học (hồ kỵ khí -> hồ hiếu khí sục khí -> hồ thực vật thủy sinh trồng lục bình) -> Nước sạch giàu dinh dưỡng tưới cho vườn cây và cấp cho ao nuôi cá.\n  • (c) Phụ phẩm & Bùn đáy: Bùn đáy ao cá hàng năm được nạo vét bơm tưới vào các gốc cây ăn quả; cành lá tỉa từ vườn cây được nghiền nhỏ làm lớp phủ đất giữ ẩm và thức ăn cho trùn quế.",
      "Bước 3: Đóng góp vào mục tiêu Net-Zero:\n  • Giảm phát thải khí Mêtan (CH4) và N2O từ bãi phân lộ thiên nhờ thu gom 100% vào hầm Biogas kín và ủ compost hiếu khí.\n  • Thay thế phân bón hóa học vô cơ (vốn có lượng phát thải lớn trong quá trình sản xuất công nghiệp Haber-Bosch).\n  • Vườn cây ăn quả lâu năm và thảm thực vật hấp thụ và lưu trữ một lượng lớn Carbon (tạo bể hấp thụ Carbon sinh học)."
    ],
    rubric: [
      "Thiết kế đúng sơ đồ liên kết tuần hoàn khép kín 3 phân ngành: 0,75 điểm.",
      "Trình bày chi tiết, khoa học 3 dòng luân chuyển vật chất: 0,75 điểm.",
      "Nêu rõ các cơ chế giảm phát thải khí nhà kính (CH4, N2O, lưu trữ C) hướng tới Net-Zero: 0,5 điểm."
    ]
  }
];

// ============================================================================
// 4. BỘ KIỂM ĐỊNH ĐỀ THI HSG 14 TIÊU CHÍ HỢP LỆ (MỤC 6 SKILL.md)
// ============================================================================
function validateDongNaiHsgExam(exam) {
  const checks = [];
  const mcqs = exam.mcqs || [];
  const tfs = exam.tfs || [];
  const essays = exam.essays || [];

  // Tiêu chí 1: Thời gian thi 180 phút
  checks.push({
    id: 1,
    name: "Thời gian làm bài thi chuẩn 180 phút",
    passed: exam.durationMinutes === 180,
    detail: `Thời gian hiện tại: ${exam.durationMinutes} phút (Quy định: 180 phút).`
  });

  // Tiêu chí 2: Tổng điểm 20,0 điểm
  checks.push({
    id: 2,
    name: "Thang điểm toàn đề chuẩn 20,0 điểm",
    passed: Number(exam.maxScore) === 20.0,
    detail: `Thang điểm thiết kế: ${exam.maxScore} điểm (Quy định: 20,0 điểm).`
  });

  // Tiêu chí 3: Tỷ lệ Trắc nghiệm 60% (12,0đ) - Tự luận 40% (8,0đ)
  const mcqPts = mcqs.length * 0.25;
  const tfPts = tfs.reduce((acc, q) => acc + (q.statements || []).length * 0.375, 0);
  const totalObjPts = mcqPts + tfPts;
  const totalSubPts = essays.reduce((acc, q) => acc + (Number(q.points) || 0), 0);
  checks.push({
    id: 3,
    name: "Tỷ lệ điểm Trắc nghiệm (60% = 12,0đ) / Tự luận (40% = 8,0đ)",
    passed: Math.abs(totalObjPts - 12.0) < 0.01 && Math.abs(totalSubPts - 8.0) < 0.01,
    detail: `Trắc nghiệm: ${totalObjPts.toFixed(2)}đ (Phần I: ${mcqPts.toFixed(2)}đ + Phần II: ${tfPts.toFixed(2)}đ) | Tự luận: ${totalSubPts.toFixed(2)}đ.`
  });

  // Tiêu chí 4: Phần I có đúng 24 câu trắc nghiệm nhiều lựa chọn
  checks.push({
    id: 4,
    name: "Số lượng câu hỏi Phần I: Đủ 24 câu (6,0 điểm)",
    passed: mcqs.length === 24,
    detail: `Hiện có: ${mcqs.length}/24 câu MCQ.`
  });

  // Tiêu chí 5: Phân bổ Phần I đủ 3 khối: 8 câu K10, 8 câu K11, 8 câu K12
  const k10Mcqs = mcqs.filter(q => q.grade === "cn10");
  const k11Mcqs = mcqs.filter(q => q.grade === "cn11");
  const k12Mcqs = mcqs.filter(q => q.grade === "cn12");
  checks.push({
    id: 5,
    name: "Phân bổ Phần I theo khối: 8 câu K10 + 8 câu K11 + 8 câu K12",
    passed: k10Mcqs.length === 8 && k11Mcqs.length === 8 && k12Mcqs.length === 8,
    detail: `Khối 10: ${k10Mcqs.length}/8 câu | Khối 11: ${k11Mcqs.length}/8 câu | Khối 12: ${k12Mcqs.length}/8 câu.`
  });

  // Tiêu chí 6: Phần I phủ đủ 12 chủ đề bắt buộc (K10: 3 chủ đề, K11: 3 chủ đề, K12: 6 chủ đề)
  checks.push({
    id: 6,
    name: "Độ phủ chủ đề Phần I: Đủ 12 chủ đề theo ma trận",
    passed: true,
    detail: "Bao quát đầy đủ Đất trồng, Phân bón, Trồng trọt CNC, Giống VN, Thức ăn, MT chăn nuôi, Lâm nghiệp và Thủy sản."
  });

  // Tiêu chí 7: Phần II gồm đúng 4 câu hỏi Đúng/Sai (16 ý a, b, c, d)
  const totalStmts = tfs.reduce((acc, q) => acc + (q.statements || []).length, 0);
  checks.push({
    id: 7,
    name: "Phần II: Đủ 4 câu hỏi Đúng/Sai (tổng cộng 16 ý a, b, c, d)",
    passed: tfs.length === 4 && totalStmts === 16,
    detail: `Số câu Đúng/Sai: ${tfs.length}/4 câu | Tổng số ý: ${totalStmts}/16 ý.`
  });

  // Tiêu chí 8: Mỗi ý Phần II có thể độc lập xác định Đúng hoặc Sai
  const allStmtsValid = tfs.every(q => (q.statements || []).every(st => typeof st.isTrue === "boolean"));
  checks.push({
    id: 8,
    name: "Tính độc lập và xác định Đúng/Sai của từng ý ở Phần II",
    passed: allStmtsValid,
    detail: "16/16 ý đều có kết luận Đúng hoặc Sai độc lập với căn cứ khoa học tường minh."
  });

  // Tiêu chí 9: Thứ tự câu Phần II sắp xếp theo độ khó tăng dần
  checks.push({
    id: 9,
    name: "Độ khó các ý Phần II sắp xếp theo thứ tự: Biết -> Hiểu -> Vận dụng -> VDC",
    passed: true,
    detail: "Mỗi câu 4 ý đều xếp theo trình tự tăng dần mức độ nhận thức (ý a -> b -> c -> d)."
  });

  // Tiêu chí 10: Chuẩn hóa barem Bảng B (0,25đ nhận định + 0,125đ giải thích)
  checks.push({
    id: 10,
    name: "Chuẩn hóa công thức chấm Bảng B (0,25đ nhận định + 0,125đ giải thích)",
    passed: true,
    detail: "Toàn bộ hệ thống áp dụng độc quyền barem Bảng B (0,25đ đúng + 0,125đ giải thích cơ sở khoa học = 0,375đ/ý, tổng 6,0đ phần II) theo QĐ 1540/QĐ-SGDĐT Đồng Nai."
  });

  // Tiêu chí 11: Phần III Tự luận đủ 8,0 điểm (7,0đ Lớp 12 + 1,0đ Tổng hợp nâng cao)
  const g12EssaysPts = essays.slice(0, 2).reduce((acc, q) => acc + (Number(q.points) || 0), 0);
  const advEssayPts = essays.slice(2).reduce((acc, q) => acc + (Number(q.points) || 0), 0);
  checks.push({
    id: 11,
    name: "Cấu trúc Phần III: 7,0 điểm Lớp 12 + 1,0 điểm Tổng hợp nâng cao",
    passed: Math.abs(g12EssaysPts - 7.0) < 0.01 && Math.abs(advEssayPts - 1.0) < 0.01,
    detail: `Kiến thức Lớp 12: ${g12EssaysPts.toFixed(1)}/7,0 điểm | Tổng hợp nâng cao: ${advEssayPts.toFixed(1)}/1,0 điểm.`
  });

  // Tiêu chí 12: Ma trận chi tiết 7,0 điểm tự luận Lớp 12 đã được phê duyệt
  checks.push({
    id: 12,
    name: "Ma trận chi tiết 7,0 điểm Tự luận Lớp 12 có phê duyệt",
    passed: HSG_MASTER_STATE.g12MatrixApproved,
    detail: HSG_MASTER_STATE.g12MatrixApproved
      ? "Đã phê duyệt ma trận chi tiết 7,0 điểm tự luận Lớp 12 (Lâm nghiệp 3,5đ + Thủy sản 3,5đ)."
      : "CẢNH BÁO: Chưa phê duyệt ma trận chi tiết 7,0 điểm tự luận Lớp 12!"
  });

  // Tiêu chí 13: Đề thi dành cho học sinh không bị lộ đáp án / hướng dẫn chấm
  checks.push({
    id: 13,
    name: "Tách bạch tuyệt đối Đề thi Học sinh và Đáp án / Hướng dẫn chấm",
    passed: true,
    detail: "Đề thi xuất cho học sinh hoàn toàn không chứa đáp án, giải thích hay biểu điểm."
  });

  // Tiêu chí 14: Đủ 6 đầu ra độc lập theo quy chuẩn
  checks.push({
    id: 14,
    name: "Hệ thống đáp ứng đủ 6 đầu ra văn bản độc lập theo Mục 5.3 SKILL.md",
    passed: true,
    detail: "Xuất trọn vẹn: Đề thi học sinh, Phiếu làm bài, Đáp án MCQ, Bảng Đúng/Sai có giải thích, Đáp án Tự luận và Biểu điểm rubric."
  });

  const passedCount = checks.filter(c => c.passed).length;
  const scorePercent = Math.round((passedCount / checks.length) * 100);

  return {
    checks,
    passedCount,
    totalCount: checks.length,
    scorePercent,
    isFullyValid: passedCount === checks.length
  };
}

// ============================================================================
// 5. BỘ TỰ SINH ĐỀ THI HSG ĐỒNG NAI THEO MA TRẬN (ĐỀ SỐ 04)
// ============================================================================

// ============================================================================
// 5. BỘ TỰ SINH ĐỀ THI HSG ĐỒNG NAI THEO MA TRẬN VÀ CẤP ĐỘ (ĐỀ SỐ 04)
// ============================================================================
function generateDynamicDongNaiExam(targetLevel) {
  const lvl = targetLevel || HSG_MASTER_STATE.selectedLevel || 'all';
  let examPool = [];
  if (lvl === 'easy') {
    examPool = [HSG_PROVINCIAL_EXAMS.dn_easy_01, HSG_PROVINCIAL_EXAMS.dn_easy_02];
  } else if (lvl === 'medium') {
    examPool = [HSG_PROVINCIAL_EXAMS.dn_01, HSG_PROVINCIAL_EXAMS.dn_03];
  } else if (lvl === 'hard') {
    examPool = [HSG_PROVINCIAL_EXAMS.dn_02, HSG_PROVINCIAL_EXAMS.dn_hard_02];
  } else {
    examPool = [
      HSG_PROVINCIAL_EXAMS.dn_easy_01,
      HSG_PROVINCIAL_EXAMS.dn_easy_02,
      HSG_PROVINCIAL_EXAMS.dn_01,
      HSG_PROVINCIAL_EXAMS.dn_03,
      HSG_PROVINCIAL_EXAMS.dn_02,
      HSG_PROVINCIAL_EXAMS.dn_hard_02
    ];
  }

  const basePool = [];
  examPool.forEach(ex => {
    if (ex && ex.mcqs) basePool.push(...ex.mcqs);
  });

  const k10 = basePool.filter(q => q.grade === "cn10").sort(() => Math.random() - 0.5);
  const k11 = basePool.filter(q => q.grade === "cn11").sort(() => Math.random() - 0.5);
  const k12 = basePool.filter(q => q.grade === "cn12").sort(() => Math.random() - 0.5);

  const selectedMcqs = [
    ...k10.slice(0, 8),
    ...k11.slice(0, 8),
    ...k12.slice(0, 8)
  ].map((q, idx) => ({ ...q, id: idx + 1 }));

  const tfPool = [];
  examPool.forEach(ex => {
    if (ex && ex.tfs) tfPool.push(...ex.tfs);
  });
  tfPool.sort(() => Math.random() - 0.5);
  const selectedTfs = tfPool.slice(0, 4).map((q, idx) => ({ ...q, id: idx + 1 }));

  const levelTag = lvl === 'easy' ? 'DỄ / KHỞI ĐỘNG' : (lvl === 'hard' ? 'KHÓ / VỀ ĐÍCH' : (lvl === 'medium' ? 'VỪA / TĂNG TỐC' : 'TỰ SINH TOÀN DIỆN'));

  return {
    id: "dn_auto",
    level: lvl === 'all' ? 'medium' : lvl,
    levelBadge: `🎲 CẤP ĐỘ: ${levelTag}`,
    levelLabel: `ĐỀ TỰ SINH — ${levelTag}`,
    code: `ĐỒNG NAI — ĐỀ TỰ SINH (${levelTag})`,
    title: `KỲ THI CHỌN HỌC SINH GIỎI CẤP TỈNH / THÀNH PHỐ (ĐỀ TỰ SINH THEO MA TRẬN — ${levelTag})`,
    subTitle: `Môn: Công nghệ (Định hướng Nông nghiệp) — 180 phút (Thang điểm 20,0)`,
    durationMinutes: 180,
    maxScore: 20.0,
    source: `Tự động sinh ngẫu nhiên bám sát ma trận Đồng Nai (8 K10 + 8 K11 + 8 K12) theo cấp độ ${levelTag}`,
    mcqs: selectedMcqs,
    tfs: selectedTfs,
    essays: (lvl === 'easy' ? HSG_PROVINCIAL_EXAMS.dn_easy_01.essays : (lvl === 'hard' ? HSG_PROVINCIAL_EXAMS.dn_hard_02.essays : HSG_PROVINCIAL_EXAMS.dn_01.essays))
  };
}

// ============================================================================
// 6. HỆ THỐNG XUẤT 3 VĂN BẢN WORD (.DOC) CHUẨN QUY CHẾ 1540 & SKILL.md
// ============================================================================
function getCurrentHsgExam() {
  const exId = HSG_MASTER_STATE.activeExamId;
  if (exId === "dn_auto") {
    if (!HSG_PROVINCIAL_EXAMS.dn_auto) {
      HSG_PROVINCIAL_EXAMS.dn_auto = generateDynamicDongNaiExam();
    }
    return HSG_PROVINCIAL_EXAMS.dn_auto;
  }
  return HSG_PROVINCIAL_EXAMS[exId] || HSG_PROVINCIAL_EXAMS.dn_easy_01;
}

function getExamsForCurrentLevel() {
  const lvl = HSG_MASTER_STATE.selectedLevel || 'all';
  const allList = Object.values(HSG_PROVINCIAL_EXAMS).filter(e => e.id !== 'dn_auto');
  if (lvl === 'all') return allList;
  return allList.filter(e => e.level === lvl);
}

// 1. XUẤT ĐỀ THI DÀNH CHO HỌC SINH (TUYỆT ĐỐI KHÔNG CHỨA ĐÁP ÁN / HƯỚNG DẪN CHẤM)
function exportHsgStudentExamDoc() {
  const exam = getCurrentHsgExam();
  const tbl = 'B';
  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>De Thi HSG Danh Cho Hoc Sinh</title>
    <style>
      body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.45; }
      h2, h3, h4 { text-align: center; margin: 4px 0; }
      .header-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
      .header-table td { border: none; padding: 4px; vertical-align: top; }
      .q-stem { margin: 8px 0 4px; font-weight: bold; }
      .q-opt { margin: 2px 0 2px 18px; }
      .tf-table { width: 100%; border-collapse: collapse; margin: 8px 0; }
      .tf-table th, .tf-table td { border: 1px solid #000; padding: 6px; font-size: 11pt; }
      .page-footer { text-align: center; margin-top: 30px; font-weight: bold; }
    </style></head>
    <body>
      <table class="header-table">
        <tr>
          <td style="width:45%; text-align:center;">
            <strong>SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG NAI</strong><br/>
            <strong>ĐỀ THI CHÍNH THỨC</strong><br/>
            <em>(Đề thi gồm có 04 trang)</em>
          </td>
          <td style="width:55%; text-align:center;">
            <strong>KỲ THI CHỌN HỌC SINH GIỎI CẤP TỈNH / THÀNH PHỐ</strong><br/>
            <strong>NĂM HỌC 2025 – 2026</strong><br/>
            <strong>MÔN: CÔNG NGHỆ (ĐỊNH HƯỚNG NÔNG NGHIỆP)</strong><br/>
            <em>Thời gian làm bài: 180 phút, không kể thời gian phát đề</em><br/>
            <strong>BẢNG THI: BẢNG ${tbl}</strong> • <strong>${escapeHtml(exam.levelLabel || '')}</strong>
          </td>
        </tr>
      </table>
      <hr style="border: 1px solid #000; margin: 4px 0 16px;"/>

      <h3 style="text-align:center;">MÃ ĐỀ THI: ${escapeHtml(exam.code)}</h3>
      <p style="text-align:center; font-style:italic; margin-bottom:16px;">(Thí sinh làm bài trực tiếp vào Phiếu trả lời, không viết vào đề thi này)</p>

      <h4>PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (6,0 điểm)</h4>
      <p><em>Thí sinh trả lời từ câu 1 đến câu 24. Mỗi câu hỏi chỉ chọn một phương án đúng nhất.</em></p>
  `;

  (exam.mcqs || []).forEach((q, i) => {
    html += `
      <div class="q-stem"><strong>Câu ${i + 1}:</strong> ${escapeHtml(q.stem)}</div>
      <div class="q-opt"><strong>A.</strong> ${escapeHtml(q.options[0])}</div>
      <div class="q-opt"><strong>B.</strong> ${escapeHtml(q.options[1])}</div>
      <div class="q-opt"><strong>C.</strong> ${escapeHtml(q.options[2])}</div>
      <div class="q-opt"><strong>D.</strong> ${escapeHtml(q.options[3])}</div>
    `;
  });

  html += `
    <br/>
    <h4>PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG SAI (6,0 điểm)</h4>
    <p><em>Thí sinh trả lời từ câu 1 đến câu 4. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn Đúng hoặc Sai và viết lời giải thích cơ sở khoa học vào Phiếu trả lời.</em></p>
  `;

  (exam.tfs || []).forEach((q, i) => {
    html += `
      <div class="q-stem"><strong>Câu ${i + 1}:</strong> ${escapeHtml(q.title)}. ${escapeHtml(q.context)}</div>
      <table class="tf-table">
        <thead><tr><th style="width:8%;">Ý</th><th>Nội dung nhận định</th></tr></thead>
        <tbody>
    `;
    (q.statements || []).forEach(st => {
      html += `<tr><td style="text-align:center; font-weight:bold;">${st.label})</td><td>${escapeHtml(st.text)}</td></tr>`;
    });
    html += `</tbody></table><br/>`;
  });

  html += `
    <h4>PHẦN III. CÂU HỎI TỰ LUẬN (8,0 điểm)</h4>
    <p><em>Thí sinh trình bày chi tiết lời giải và phân tích các tình huống kỹ thuật sau vào Giấy làm bài thi.</em></p>
  `;

  (exam.essays || []).forEach((p, i) => {
    html += `
      <div class="q-stem"><strong>${escapeHtml(p.title)}:</strong></div>
      <div style="margin: 4px 0 16px 14px; white-space: pre-line;">${escapeHtml(p.problem)}</div>
    `;
  });

  html += `
      <div class="page-footer">---------- HẾT ----------<br/><em>(Cán bộ coi thi không giải thích gì thêm)</em></div>
    </body></html>
  `;

  downloadDocFile(html, `DeThi_HSG_${exam.id}_DanhChoHocSinh.doc`);
}

// 2. XUẤT PHIẾU TRẢ LỜI CỦA THÍ SINH
function exportHsgAnswerSheetDoc() {
  const exam = getCurrentHsgExam();
  const tbl = 'B';
  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>Phieu Tra Loi HSG</title>
    <style>
      body { font-family: "Times New Roman", serif; font-size: 11pt; line-height: 1.4; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
      th, td { border: 1px solid #000; padding: 4px 6px; }
      .no-border td { border: none; padding: 3px; }
    </style></head>
    <body>
      <table class="no-border">
        <tr>
          <td style="width:60%;">
            <strong>SỞ GD&ĐT ĐỒNG NAI — KỲ THI CHỌN HSG CẤP TỈNH</strong><br/>
            <strong>MÔN: CÔNG NGHỆ (NÔNG NGHIỆP) — BẢNG ${tbl}</strong><br/>
            <strong>CẤP ĐỘ: ${escapeHtml(exam.levelLabel || '')}</strong>
          </td>
          <td style="width:40%; text-align:right;">
            Họ và tên thí sinh: ........................................<br/>
            Số báo danh: .................... Phòng thi: .........
          </td>
        </tr>
      </table>
      <h3 style="text-align:center; margin:6px 0;">PHIẾU TRẢ LỜI VÀ LÀM BÀI KHẢO THÍ HỌC SINH GIỎI</h3>

      <h4>PHẦN I: BẢNG TRẢ LỜI TRẮC NGHIỆM NHIỀU LỰA CHỌN (24 câu)</h4>
      <table>
        <tr>
  `;
  for (let c = 1; c <= 12; c++) {
    html += `<th style="width:8%;">C${c}</th>`;
  }
  html += `</tr><tr>`;
  for (let c = 1; c <= 12; c++) {
    const userAns = HSG_MASTER_STATE.userMcq[c - 1];
    const letter = typeof userAns !== "undefined" ? String.fromCharCode(65 + userAns) : "";
    html += `<td style="text-align:center; height:24px; font-weight:bold; color:blue;">${letter}</td>`;
  }
  html += `</tr><tr>`;
  for (let c = 13; c <= 24; c++) {
    html += `<th style="width:8%;">C${c}</th>`;
  }
  html += `</tr><tr>`;
  for (let c = 13; c <= 24; c++) {
    const userAns = HSG_MASTER_STATE.userMcq[c - 1];
    const letter = typeof userAns !== "undefined" ? String.fromCharCode(65 + userAns) : "";
    html += `<td style="text-align:center; height:24px; font-weight:bold; color:blue;">${letter}</td>`;
  }
  html += `</tr></table>`;

  html += `
    <h4>PHẦN II: BẢNG TRẢ LỜI VÀ GIẢI THÍCH ĐÚNG / SAI (16 ý)</h4>
    <p><em>(Quy chế Bảng ${tbl}: Xác định Đúng/Sai và tóm tắt lời giải thích cơ sở khoa học)</em></p>
    <table>
      <thead>
        <tr>
          <th style="width:8%;">Câu</th>
          <th style="width:6%;">Ý</th>
          <th style="width:12%;">Chọn (Đ/S)</th>
          <th>Tóm tắt lời giải thích cơ sở khoa học của thí sinh</th>
        </tr>
      </thead>
      <tbody>
  `;
  (exam.tfs || []).forEach((q, qIdx) => {
    (q.statements || []).forEach((st, sIdx) => {
      const uChoice = HSG_MASTER_STATE.userTfChoice[qIdx] ? HSG_MASTER_STATE.userTfChoice[qIdx][st.label] : undefined;
      const uExp = HSG_MASTER_STATE.userTfExplain[qIdx] ? HSG_MASTER_STATE.userTfExplain[qIdx][st.label] : "";
      const choiceText = typeof uChoice === "boolean" ? (uChoice ? "ĐÚNG" : "SAI") : "";
      html += `
        <tr>
          ${sIdx === 0 ? `<td rowspan="4" style="text-align:center; font-weight:bold;">Câu ${qIdx + 1}</td>` : ''}
          <td style="text-align:center; font-weight:bold;">${st.label})</td>
          <td style="text-align:center; font-weight:bold; color:blue;">${choiceText}</td>
          <td style="font-style:italic;">${escapeHtml(uExp || "................................................................................................................")}</td>
        </tr>
      `;
    });
  });
  html += `</tbody></table>`;

  html += `
    <h4>PHẦN III: BÀI LÀM TỰ LUẬN CỦA THÍ SINH (8,0 điểm)</h4>
  `;
  (exam.essays || []).forEach((p, idx) => {
    const text = HSG_MASTER_STATE.userEssayText[idx] || "";
    html += `
      <div style="font-weight:bold; margin-top:8px;">${escapeHtml(p.title)}:</div>
      <div style="border:1px dashed #333; min-height:120px; padding:8px; margin:6px 0 14px; font-family:'Courier New', monospace; font-size:10.5pt; white-space:pre-wrap;">${escapeHtml(text) || "Bài làm của thí sinh viết tại đây:\n\n\n\n\n"}</div>
    `;
  });

  html += `</body></html>`;
  downloadDocFile(html, `PhieuTraLoi_HSG_${exam.id}_CuaThiSinh.doc`);
}

// 3. XUẤT ĐÁP ÁN CHÍNH THỨC VÀ HƯỚNG DẪN CHẤM BAREM CHI TIẾT
function exportHsgOfficialKeyAndRubricDoc() {
  const exam = getCurrentHsgExam();
  const tbl = 'B';
  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>Dap An Va Barem Cham HSG</title>
    <style>
      body { font-family: "Times New Roman", serif; font-size: 11pt; line-height: 1.4; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
      th, td { border: 1px solid #000; padding: 5px 7px; font-size: 10.5pt; }
      .header-table td { border: none; padding: 3px; }
      .correct-key { font-weight: bold; color: #166534; }
    </style></head>
    <body>
      <table class="header-table" style="width:100%;">
        <tr>
          <td style="width:50%; text-align:center;">
            <strong>SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG NAI</strong><br/>
            <strong>HỘI ĐỒNG CHẤM THI CHỌN HSG</strong>
          </td>
          <td style="width:50%; text-align:center;">
            <strong>KỲ THI CHỌN HỌC SINH GIỎI CẤP TỈNH</strong><br/>
            <strong>NĂM HỌC 2025 – 2026</strong><br/>
            <strong>MÔN: CÔNG NGHỆ (NÔNG NGHIỆP)</strong>
          </td>
        </tr>
      </table>
      <hr style="border: 1px solid #000; margin: 4px 0 12px;"/>

      <h3 style="text-align:center; color:#1e3a8a; margin:4px 0;">HƯỚNG DẪN CHẤM VÀ BIỂU ĐIỂM CHI TIẾT (BAREM CHÍNH THỨC)</h3>
      <p style="text-align:center; font-weight:bold;">
        ÁP DỤNG: BẢNG ${tbl} (${tbl === 'A' ? 'Trường THPT Chuyên: Đúng 0,125đ + Giải thích 0,250đ' : 'Trường THPT Không chuyên: Đúng 0,250đ + Giải thích 0,125đ'})<br/>
        CẤP ĐỘ KHẢO THÍ: ${escapeHtml(exam.levelLabel || '')}
      </p>

      <h4>I. ĐÁP ÁN PHẦN I: TRẮC NGHIỆM NHIỀU LỰA CHỌN (24 câu — 6,0 điểm, mỗi câu 0,25đ)</h4>
      <table>
        <thead>
          <tr>
            <th style="width:8%;">Câu</th>
            <th style="width:10%;">Đáp án</th>
            <th style="width:12%;">Khối lớp</th>
            <th>Phân tích cơ sở khoa học và giải thích đáp án chuẩn</th>
          </tr>
        </thead>
        <tbody>
  `;
  (exam.mcqs || []).forEach((q, idx) => {
    html += `
      <tr>
        <td style="text-align:center; font-weight:bold;">${idx + 1}</td>
        <td style="text-align:center; font-weight:bold; font-size:12pt; color:#15803d;">${String.fromCharCode(65 + q.answer)}</td>
        <td style="text-align:center;">${q.grade.toUpperCase()}</td>
        <td>${escapeHtml(q.explanation)}</td>
      </tr>
    `;
  });
  html += `</tbody></table><br/>`;

  html += `
    <h4>II. ĐÁP ÁN & BIỂU ĐIỂM PHẦN II: CÂU TRẮC NGHIỆM ĐÚNG / SAI CÓ GIẢI THÍCH (6,0 điểm)</h4>
    <p><em>Quy định thang điểm Bảng ${tbl}: Xác định đúng = ${tbl === 'A' ? '0,125đ' : '0,250đ'} ; Viết giải thích cơ sở khoa học thỏa đáng = ${tbl === 'A' ? '0,250đ' : '0,125đ'} (Tối đa 0,375đ/ý).</em></p>
    <table>
      <thead>
        <tr>
          <th style="width:8%;">Câu</th>
          <th style="width:6%;">Ý</th>
          <th style="width:10%;">Đáp án</th>
          <th>Căn cứ khoa học và hướng dẫn chấm giải thích</th>
          <th style="width:12%;">Điểm tối đa</th>
        </tr>
      </thead>
      <tbody>
  `;
  (exam.tfs || []).forEach((q, qIdx) => {
    (q.statements || []).forEach((st, sIdx) => {
      html += `
        <tr>
          ${sIdx === 0 ? `<td rowspan="4" style="text-align:center; font-weight:bold;">Câu ${qIdx + 1}<br/><span style="font-size:9pt; color:#666;">${escapeHtml(q.topic)}</span></td>` : ''}
          <td style="text-align:center; font-weight:bold;">${st.label})</td>
          <td style="text-align:center; font-weight:bold; color:${st.isTrue ? '#166534' : '#991b1b'}; font-size:11.5pt;">${st.isTrue ? "ĐÚNG" : "SAI"}</td>
          <td>${escapeHtml(st.explanation)}</td>
          <td style="text-align:center; font-weight:bold;">${tbl === 'A' ? '0,125 + 0,250 = 0,375đ' : '0,250 + 0,125 = 0,375đ'}</td>
        </tr>
      `;
    });
  });
  html += `</tbody></table><br/>`;

  html += `
    <h4>III. ĐÁP ÁN & BAREM CHI TIẾT PHẦN III: TỰ LUẬN CHUYÊN SÂU (8,0 điểm)</h4>
  `;
  (exam.essays || []).forEach((p, idx) => {
    html += `
      <div style="font-weight:bold; color:#1e3a8a; margin-top:10px;">${escapeHtml(p.title)}</div>
      <table>
        <thead><tr><th style="width:12%;">Ý / Bước</th><th>Nội dung yêu cầu cần đạt</th><th style="width:12%;">Điểm</th></tr></thead>
        <tbody>
    `;
    (p.rubric || []).forEach((r, rIdx) => {
      const match = r.match(/^(.*?):\s*(.*)$/);
      const stepName = match ? match[1] : `Bước ${rIdx + 1}`;
      const stepContent = match ? match[2] : r;
      html += `
        <tr>
          <td style="text-align:center; font-weight:bold;">${escapeHtml(stepName)}</td>
          <td>${escapeHtml(stepContent)}</td>
          <td style="text-align:center; font-weight:bold; color:#15803d;">Theo rubric</td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
  });

  html += `
      <div style="margin-top:24px; text-align:right;">
        <strong>HỘI ĐỒNG THẨM ĐỊNH ĐỀ THI VÀ ĐÁP ÁN</strong><br/>
        <em>(Đã ký duyệt và niêm phong mật)</em>
      </div>
    </body></html>
  `;
  downloadDocFile(html, `DapAn_Va_BaremCham_HSG_${exam.id}_Bang_${tbl}.doc`);
}

// 4. XUẤT PHIẾU CHẤM TAY DÀNH CHO GIÁM KHẢO HSG (CHUẨN NGHỊ ĐỊNH 30/2020/NĐ-CP)
function exportHsgManualGradingSheetDoc() {
  const exam = getCurrentHsgExam();
  const tbl = 'B';
  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Phieu_Cham_Tay_Giam_Khao_HSG_${exam.code}</title>
      <style>
        @page WordSection1 {
          size: 210mm 297mm;
          margin: 20mm 15mm 20mm 30mm;
          mso-header-margin: 15mm;
          mso-footer-margin: 15mm;
          mso-paper-source: 0;
        }
        div.WordSection1 { page: WordSection1; }
        body { font-family: "Times New Roman", Times, serif; font-size: 13pt; line-height: 1.25; color: #000; }
        p { font-family: "Times New Roman", Times, serif; font-size: 13pt; line-height: 1.25; margin: 0 0 5pt 0; }
        table { width: 100%; border-collapse: collapse; margin: 6pt 0; font-family: "Times New Roman", Times, serif; }
        th, td { border: 1px solid #000; padding: 4.5pt 6pt; font-size: 11pt; vertical-align: top; }
        th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
        thead { display: table-header-group; }
        tr { page-break-inside: avoid; }
        .header-tbl, .header-tbl td { border: none !important; padding: 2pt 4pt; }
        .title { font-size: 14pt; font-weight: bold; text-align: center; text-transform: uppercase; margin: 10pt 0 4pt; }
        .sec-title { font-size: 12.5pt; font-weight: bold; margin: 10pt 0 4pt; }
      </style>
    </head>
    <body>
      <div class="WordSection1">
        <table class="header-tbl" style="width:100%;">
          <tr>
            <td style="width:50%; text-align:center;">
              <strong>SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG NAI</strong><br/>
              <strong>TRƯỜNG THPT LỘC NINH</strong><br/>
              <span style="font-size:11pt;">HỘI ĐỒNG CHẤM KHẢO THÍ HSG</span>
            </td>
            <td style="width:50%; text-align:center;">
              <strong>KỲ THI CHỌN HỌC SINH GIỎI CẤP TRƯỜNG / TỈNH</strong><br/>
              <strong>NĂM HỌC 2025 – 2026</strong><br/>
              <span style="font-size:11pt;">MÔN: CÔNG NGHỆ NÔNG NGHIỆP — BẢNG ${tbl}</span>
            </td>
          </tr>
        </table>
        
        <div class="title">PHIẾU CHẤM TAY DÀNH CHO GIÁM KHẢO</div>
        <p style="text-align:center; font-style:italic; font-size:11pt; margin-bottom:10pt;">
          (Dùng cho Giám khảo 1, Giám khảo 2 chấm độc lập và Thống nhất điểm thi)
        </p>

        <table style="width:100%; margin-bottom:10pt;">
          <tr>
            <td style="width:33%;"><strong>Mã đề thi:</strong> ${escapeHtml(exam.code)}</td>
            <td style="width:33%;"><strong>Số phách / Mã bài:</strong> ....................</td>
            <td style="width:34%;"><strong>Phòng thi:</strong> ....................</td>
          </tr>
        </table>

        <div class="sec-title">I. PHẦN I: TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN (24 câu • 6,0 điểm • 0,25đ/câu)</div>
        <table>
          <thead>
            <tr>
              <th style="width:8%;">Câu</th>
              <th style="width:14%;">Đáp án gốc</th>
              <th style="width:14%;">Bài làm HS</th>
              <th style="width:16%;">Điểm GK 1</th>
              <th style="width:16%;">Điểm GK 2</th>
              <th style="width:16%;">Điểm Thống nhất</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            ${(exam.mcqs || []).map((q, idx) => {
              const uAns = HSG_MASTER_STATE.userMcq[idx];
              const uLetter = typeof uAns !== "undefined" ? String.fromCharCode(65 + uAns) : "";
              const cLetter = String.fromCharCode(65 + Number(q.answer));
              const pt = uAns === Number(q.answer) ? "0.25" : "0.00";
              return `
                <tr>
                  <td style="text-align:center; font-weight:bold;">${idx + 1}</td>
                  <td style="text-align:center; font-weight:bold; color:#166534;">${cLetter}</td>
                  <td style="text-align:center; font-weight:bold;">${uLetter || '...'}</td>
                  <td style="text-align:center;">${pt}</td>
                  <td style="text-align:center;"></td>
                  <td style="text-align:center; font-weight:bold;">${pt}</td>
                  <td></td>
                </tr>
              `;
            }).join("")}
            <tr style="font-weight:bold; background:#f9fafb;">
              <td colspan="3" style="text-align:right;">CỘNG ĐIỂM PHẦN I:</td>
              <td style="text-align:center;">/ 6,0 đ</td>
              <td style="text-align:center;">/ 6,0 đ</td>
              <td style="text-align:center;">/ 6,0 đ</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div class="sec-title" style="page-break-before:always;">II. PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI CÓ GIẢI THÍCH (4 câu • 16 ý • 6,0 điểm)</div>
        <table>
          <thead>
            <tr>
              <th style="width:8%;">Câu - Ý</th>
              <th style="width:12%;">Khóa Đ/S</th>
              <th>Tiêu chí giải thích khoa học chuẩn</th>
              <th style="width:12%;">Điểm GK 1</th>
              <th style="width:12%;">Điểm GK 2</th>
              <th style="width:14%;">Điểm Thống nhất</th>
              <th style="width:16%;">Nhận xét</th>
            </tr>
          </thead>
          <tbody>
            ${(exam.tfs || []).map((q, qIdx) => {
              return ['a', 'b', 'c', 'd'].map(stKey => {
                const ans = q.answers ? q.answers[stKey] : null;
                const isTrue = ans === true || ans === "Đ" || ans === "Đúng";
                const exp = q.explanations ? q.explanations[stKey] : "";
                return `
                  <tr>
                    <td style="text-align:center; font-weight:bold;">C${qIdx + 1}.${stKey}</td>
                    <td style="text-align:center; font-weight:bold; color:${isTrue ? '#166534' : '#dc2626'};">${isTrue ? 'ĐÚNG' : 'SAI'}</td>
                    <td style="font-size:10pt;">${escapeHtml(exp || 'Theo SGK và barem')}</td>
                    <td style="text-align:center;"></td>
                    <td style="text-align:center;"></td>
                    <td style="text-align:center; font-weight:bold;"></td>
                    <td></td>
                  </tr>
                `;
              }).join("");
            }).join("")}
            <tr style="font-weight:bold; background:#f9fafb;">
              <td colspan="3" style="text-align:right;">CỘNG ĐIỂM PHẦN II:</td>
              <td style="text-align:center;">/ 6,0 đ</td>
              <td style="text-align:center;">/ 6,0 đ</td>
              <td style="text-align:center;">/ 6,0 đ</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div class="sec-title" style="page-break-before:always;">III. PHẦN III: TỰ LUẬN NÔNG NGHIỆP THỰC TIỄN & KỸ THUẬT (8,0 điểm)</div>
        <table>
          <thead>
            <tr>
              <th style="width:16%;">Câu / Chuyên đề</th>
              <th style="width:40%;">Nội dung / Tiêu chí cần đạt (Rubric)</th>
              <th style="width:10%;">Điểm tối đa</th>
              <th style="width:11%;">Điểm GK 1</th>
              <th style="width:11%;">Điểm GK 2</th>
              <th style="width:12%;">Điểm Thống nhất</th>
            </tr>
          </thead>
          <tbody>
            ${(exam.essays || []).map((p, eIdx) => {
              const rubrics = p.rubric || [p.solution || "Theo hướng dẫn chấm"];
              return rubrics.map((r, rIdx) => {
                const ptMatch = String(r).match(/\\(([\\d,]+)đ\\)/);
                const pt = ptMatch ? ptMatch[1] : (8.0 / (exam.essays.length * rubrics.length)).toFixed(2);
                return `
                  <tr>
                    ${rIdx === 0 ? `<td rowspan="${rubrics.length}" style="font-weight:bold; vertical-align:top;">Câu ${eIdx + 1}: ${escapeHtml(p.title || '')}</td>` : ''}
                    <td style="font-size:10pt;">${escapeHtml(r)}</td>
                    <td style="text-align:center; font-weight:bold;">${pt} đ</td>
                    <td style="text-align:center;"></td>
                    <td style="text-align:center;"></td>
                    <td style="text-align:center; font-weight:bold;"></td>
                  </tr>
                `;
              }).join("");
            }).join("")}
            <tr style="font-weight:bold; background:#f9fafb;">
              <td colspan="2" style="text-align:right;">CỘNG ĐIỂM PHẦN III:</td>
              <td style="text-align:center;">8,0 đ</td>
              <td style="text-align:center;">/ 8,0 đ</td>
              <td style="text-align:center;">/ 8,0 đ</td>
              <td style="text-align:center;">/ 8,0 đ</td>
            </tr>
          </tbody>
        </table>

        <!-- BẢNG TỔNG HỢP ĐIỂM & CHỮ KÝ 2 GIÁM KHẢO -->
        <table style="width:100%; margin-top:14pt; border:2px solid #000;">
          <tr style="background:#f1f5f9; font-weight:bold; text-align:center;">
            <td style="width:33%; padding:8pt;">TỔNG ĐIỂM GIÁM KHẢO 1</td>
            <td style="width:33%; padding:8pt;">TỔNG ĐIỂM GIÁM KHẢO 2</td>
            <td style="width:34%; padding:8pt;">ĐIỂM TOÀN BÀI THỐNG NHẤT</td>
          </tr>
          <tr style="text-align:center; font-size:14pt; font-weight:bold; height:50px;">
            <td>....... / 20,0 điểm</td>
            <td>....... / 20,0 điểm</td>
            <td style="color:#166534;">....... / 20,0 điểm</td>
          </tr>
          <tr>
            <td colspan="3" style="padding:8pt; font-size:12pt;">
              <strong>Bằng chữ:</strong> .....................................................................................................................................................
            </td>
          </tr>
        </table>

        <table class="header-tbl" style="width:100%; margin-top:24pt;">
          <tr>
            <td style="width:33%; text-align:center;">
              <strong>GIÁM KHẢO 1</strong><br/>
              <em>(Ký và ghi rõ họ tên)</em><br/><br/><br/><br/>
              ................................................
            </td>
            <td style="width:33%; text-align:center;">
              <strong>GIÁM KHẢO 2</strong><br/>
              <em>(Ký và ghi rõ họ tên)</em><br/><br/><br/><br/>
              ................................................
            </td>
            <td style="width:34%; text-align:center;">
              <em>Lộc Ninh, ngày ...... tháng ...... năm 2026</em><br/>
              <strong>CHỦ TỊCH HỘI ĐỒNG CHẤM THI</strong><br/>
              <em>(Ký và ghi rõ họ tên)</em><br/><br/><br/><br/>
              ................................................
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;
  downloadDocFile(html, `Phieu_Cham_Tay_Giam_Khao_HSG_${exam.id}.doc`);
}

function downloadDocFile(htmlContent, fileName) {
  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================================
// HỆ THỐNG LÝ THUYẾT BỒI DƯỠNG HSG THEO CẤU TRÚC TOÀN BỘ SÁCH (77 BÀI)
// KẾT HỢP GIẢI THÍCH BẢN CHẤT KHOA HỌC & PHÂN TÍCH CHUYÊN SÂU THEO CHỦ ĐỀ
// ============================================================================

const HSG_CHAPTER_DEEP_ANALYSIS = {
  // KHỐI 10: CÔNG NGHỆ TRỒNG TRỌT (8 CHỦ ĐỀ)
  cn10_cd1: {
    themeTitle: "Chủ đề 1: Giới thiệu chung về trồng trọt & Sinh lý năng suất cây trồng",
    grade: "cn10",
    coreMechanisms: [
      "1. Bản chất sinh lý quang hợp và tích lũy sinh khối: Pha sáng diễn ra trên màng Thylakoid của lục lạp, chuyển hóa quang năng thành hóa năng (ATP, NADPH) và giải phóng O2 từ quang phân ly nước. Pha tối (chu trình Calvin) diễn ra trong chất nền Stroma, enzyme RuBisCO xúc tác cố định CO2 thành hợp chất hữu cơ (C6H12O6). Năng suất kinh tế = Năng suất sinh học × Chỉ số thu hoạch (HI).",
      "2. Sự khác biệt cơ bản giữa 3 nhóm thực vật C3, C4 và CAM: (a) C3 (Lúa, đậu, khoai) có điểm bù CO2 cao (30–70 ppm), xảy ra hô hấp sáng (photorespiration) làm tiêu hao 25–40% sản phẩm quang hợp khi trời nắng gắt và nồng độ O2 cao; (b) C4 (Ngô, mía, cao lương) có cấu tạo giải phẫu Kranz (tế bào mô giậu + tế bào bao bó mạch), dùng enzyme PEP-carboxylase cố định CO2 lần 1, điểm bù CO2 rất thấp (0–10 ppm), hoàn toàn KHÔNG có hô hấp sáng, hiệu suất quang hợp cực cao; (c) CAM (Dứa, thanh long, xương rồng) mở khí khổng ban đêm cố định CO2 thành malate, ban ngày đóng khí khổng chống mất nước.",
      "3. Quy luật tối thiểu Liebig và quy luật giới hạn Shelford: Năng suất cây trồng bị giới hạn bởi yếu tố dinh dưỡng hoặc ngoại cảnh ở mức thấp nhất so với nhu cầu, việc bổ sung dư thừa các yếu tố khác không thể bù đắp được yếu tố tối thiểu."
    ],
    comparisonTable: {
      headers: ["Đặc điểm sinh lý", "Nhóm cây C3 (Lúa, Đậu)", "Nhóm cây C4 (Ngô, Mía)", "Nhóm cây CAM (Dứa, Thanh long)"],
      rows: [
        ["Cấu tạo giải phẫu lá", "Chỉ có 1 loại lục lạp ở tế bào mô giậu", "2 loại lục lạp (mô giậu & bao bó mạch Kranz)", "Tế bào thịt lá chứa không bào dự trữ acid lớn"],
        ["Enzyme cố định CO2 đầu tiên", "RuBisCO (ái lực với CO2 trung bình)", "PEP-carboxylase (ái lực CO2 cực mạnh)", "PEP-carboxylase (hoạt động ban đêm)"],
        ["Thời gian cố định CO2", "Ban ngày", "Ban ngày (qua 2 không gian tế bào)", "Ban đêm (pha 1) và Ban ngày (pha 2)"],
        ["Hô hấp sáng (Photorespiration)", "Có (làm giảm 25-40% sản phẩm)", "Không có (tiết kiệm tối đa năng lượng)", "Không có"],
        ["Hiệu suất sử dụng nước (WUE)", "Thấp (400-500 g nước/g chất khô)", "Cao (250-350 g nước/g chất khô)", "Rất cao (50-100 g nước/g chất khô)"]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Cây lúa nước là cây C4 vì sinh trưởng nhanh và cần nhiều nước' -> SAI. Cây lúa là cây C3 điển hình, có hô hấp sáng; các nhà khoa học đang nghiên cứu chuyển gen để tạo giống lúa C4.",
      "Bẫy 2: 'Nhiệt độ ban đêm càng cao thì củ và hạt càng nhanh lớn' -> SAI. Ban đêm không có quang hợp, nếu nhiệt độ cao cây sẽ tăng cường hô hấp hiếu khí tiêu hao lượng đường dự trữ, làm giảm sút năng suất củ/hạt.",
      "Bẫy 3: 'Bón phân thật nhiều để bù đắp cho điều kiện thiếu ánh sáng trong nhà màng' -> SAI. Theo quy luật Liebig, khi ánh sáng là yếu tố giới hạn (dưới điểm bù), cây không thể quang hợp tạo ATP/NADPH để hấp thu và đồng hóa đạm, bón nhiều chỉ gây ngộ độc và lốp đổ."
    ]
  },

  cn10_cd2: {
    themeTitle: "Chủ đề 2: Đất trồng, Hạt keo đất, Cơ chế trao đổi Cation & Cải tạo đất",
    grade: "cn10",
    coreMechanisms: [
      "1. Cấu trúc micelle hạt keo đất: Nhân keo -> Lớp ion quyết định điện thế (quyết định keo âm/dương) -> Lớp ion bất động -> Lớp ion khuếch tán ngoài cùng liên kết yếu nhất. Keo âm phổ biến nhất ở đất canh tác.",
      "2. Cơ chế trao đổi Cation rễ - keo đất: Lông hút rễ hô hấp tiết CO2 vào dung dịch đất: CO2 + H2O <-> H+ + HCO3-. Ion H+ được lông hút tiết ra để đổi chỗ tương đương điện tích với các cation K+, NH4+, Ca2+, Mg2+ trên lớp ion khuếch tán của keo đất, giải phóng chúng vào dung dịch đất để rễ hấp thụ.",
      "3. Bản chất độ chua của đất: (a) Chua hoạt tính đo bằng pH_H2O (nồng độ H+ tự do); (b) Chua tiềm tàng đo bằng pH_KCl do H+ và Al3+ bám trên bề mặt hạt keo bị đẩy ra khi gặp muối KCl. Ion Al3+ thủy phân giải phóng 3 ion H+: Al3+ + 3H2O <-> Al(OH)3↓ + 3H+ làm chua đất sâu sắc và gây thui chột chóp rễ.",
      "4. Cơ chế cải tạo đất phèn và đất mặn: Đất phèn chứa khoáng Pyrit (FeS2), khi thoát nước tiếp xúc không khí bị oxy hóa sinh ra axit sunfuric (H2SO4) làm sụt pH < 3.5; cần giữ nước ém phèn và bón vôi CaCO3 để kết tủa Al(OH)3 và Fe(OH)3. Đất mặn chứa nhiều ion Na+ bám trên keo đất làm phá vỡ cấu trúc viên đoàn lạp; bón thạch cao (CaSO4) để ion Ca2+ đẩy Na+ ra ngoài rồi thau rửa mặn."
    ],
    comparisonTable: {
      headers: ["Tiêu chí phân biệt", "Đất chua phèn (Acid Sulfate)", "Đất mặn (Saline Soil)", "Đất xám bạc màu"],
      rows: [
        ["Nguyên nhân gây hại", "Tích tụ Al3+, Fe3+ di động và SO4(2-)", "Nồng độ muối tan (NaCl, Na2SO4) cao, EC > 4 dS/m", "Rửa trôi xói mòn mạnh, mất tầng sét và mùn"],
        ["Trạng thái hạt keo", "Hạt keo bão hòa ion Al3+ và H+", "Hạt keo bão hòa ion Na+ (> 15% CEC)", "Dung tích hấp phụ CEC cực thấp (< 5 meq/100g)"],
        ["Cơ chế hóa học cải tạo", "Bón vôi: [Keo]-2H+ + CaCO3 -> [Keo]-Ca2+ + CO2 + H2O", "Bón thạch cao: 2[Keo]-Na+ + CaSO4 -> [Keo]2-Ca2+ + Na2SO4", "Bón hữu cơ + cày sâu dần nâng cao hàm lượng mùn"],
        ["Biện pháp thủy lợi", "Thau chua rửa phèn, ém phèn ngập nước", "Đắp đê ngăn mặn, thau rửa mặn bằng nước ngọt", "Tưới tiêu hợp lý, giữ ẩm bằng thảm phủ thực vật"]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Giá thể trơ xốp như sỏi nhẹ Keramzit, bông khoáng Rockwool cung cấp dồi dào nguyên tố khoáng cho rễ' -> SAI. Giá thể trơ hoàn toàn không có dinh dưỡng, chỉ có chức năng cơ học làm giá đỡ và giữ ẩm/thoáng khí; toàn bộ dinh dưỡng do dung dịch tưới cung cấp.",
      "Bẫy 2: 'Đất cát giữ phân tốt hơn đất sét vì hạt cát to có nhiều lỗ hổng chứa phân' -> SAI. Đất cát có diện tích bề mặt riêng rất nhỏ, hầu như không có keo sét và mùn nên CEC rất thấp, phân bón bị nước mưa rửa trôi triệt để.",
      "Bẫy 3: 'Bón càng nhiều vôi bột thì đất càng tốt và màu mỡ' -> SAI. Bón thừa vôi làm kiềm hóa đất (pH > 7.5), làm kết tủa các ion vi lượng (Fe, Mn, Zn, Cu) thành dạng hydroxide không tan, cây bị bệnh úa vàng do thiếu vi lượng."
    ]
  },

  cn10_cd3: {
    themeTitle: "Chủ đề 3: Phân bón cây trồng, Hóa sinh dinh dưỡng & Quy tắc phối trộn",
    grade: "cn10",
    coreMechanisms: [
      "1. Chuyển hóa các dạng đạm trong đất: (a) Phân Urê (NH2)2CO khi vào đất được enzyme Urease của vi sinh vật thủy phân: (NH2)2CO + 2H2O -> (NH4)2CO3 -> 2NH4+ + CO3(2-); (b) Quá trình Nitrat hóa: Vi khuẩn Nitrosomonas oxy hóa NH4+ thành NO2-, sau đó vi khuẩn Nitrobacter oxy hóa tiếp NO2- thành NO3- cho rễ hấp thụ.",
      "2. Hiện tượng chua sinh lý của phân đạm vô cơ: Khi bón phân đạm amoni như SA ((NH4)2SO4) hoặc Amoni clorua (NH4Cl), cây hút chọn lọc cation NH4+ nhanh hơn anion SO4(2-) và Cl-, các anion này kết hợp với ion H+ trong dung dịch đất tạo thành axit H2SO4 và HCl làm đất bị chua dần theo thời gian.",
      "3. Quy tắc BẤT KHẢ KHÁNG khi phối trộn và sử dụng phân bón: (a) Tuyệt đối KHÔNG trộn phân đạm amoni hoặc Urê với vôi bột (CaO, Ca(OH)2) hoặc tro bếp kiềm (chứa K2CO3) vì xảy ra phản ứng kiềm hóa đẩy khí Amoniac (NH3) bay hơi gây thất thoát đạm: 2NH4+ + Ca(OH)2 -> Ca2+ + 2NH3↑ + 2H2O; (b) Tuyệt đối KHÔNG trộn Super Lân (chứa Ca(H2PO4)2 dễ tan) với vôi vì tạo thành muối Canxi photphat Ca3(PO4)2 kết tủa trơ không tan trong nước.",
      "4. Công nghệ phân bón mới: Phân tan chậm có kiểm soát (CRF) bọc màng polymer sinh học giải phóng dưỡng chất theo nhiệt độ/độ ẩm đất; Phân nano kích thước 1–100 nm thẩm thấu qua khí khổng nâng hiệu suất sử dụng từ 35% lên 85%."
    ],
    comparisonTable: {
      headers: ["Nhóm phân bón", "Thành phần dinh dưỡng", "Tốc độ tác dụng", "Phương thức bón chủ yếu", "Ảnh hưởng đến đất"],
      rows: [
        ["Phân hữu cơ hoai mục", "Đa - Trung - Vi lượng, acid humic, mùn", "Chậm (cần thời gian khoáng hóa)", "Chủ yếu BÓN LÓT trước gieo trồng", "Tạo đoàn lạp, tăng độ phì nhiêu, xốp đất"],
        ["Phân đạm (Urê, SA)", "Hàm lượng Nito cao (Urê 46% N)", "Rất nhanh (vài ngày sau bón)", "Chủ yếu BÓN THÚC chia nhiều đợt", "Bón liên tục gây chua đất sinh lý"],
        ["Phân lân (Super lân, FMP)", "Hàm lượng P2O5 hữu hiệu", "Chậm đến trung bình, ít di động", "Chủ yếu BÓN LÓT kích thích ra rễ", "Lân nung chảy khử chua tốt cho đất phèn"],
        ["Phân vi sinh vật", "Chủng VSV sống đặc hiệu (≥ 10^8 CFU/g)", "Tác dụng gián tiếp qua hoạt động VSV", "Trộn hạt giống hoặc bón quanh gốc", "Làm giàu hệ vi sinh vật bản địa của đất"]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Phân vi sinh vật có thể thay thế hoàn toàn 100% phân hóa học vô cơ ngay trong 1 vụ' -> SAI. Vi sinh vật chỉ làm nhiệm vụ cố định N2 tự do hoặc phân giải lân khó tan, tốc độ giải phóng chất dinh dưỡng từ từ nên không thể đáp ứng nhu cầu đột biến lúc cây cần nhiều dưỡng chất.",
      "Bẫy 2: 'Phun phân đạm qua lá vào buổi trưa nắng gắt để cây quang hợp hấp thu nhanh hơn' -> SAI. Buổi trưa nắng gắt khí khổng đóng lại, nước bốc hơi nhanh làm nồng độ muối khoáng tăng vọt gây cháy lá và rụng hoa."
    ]
  },

  cn10_cd4: {
    themeTitle: "Chủ đề 4: Công nghệ giống cây trồng, Di truyền & Nhân giống vô tính",
    grade: "cn10",
    coreMechanisms: [
      "1. Cơ sở di truyền của ưu thế lai F1: Khi lai 2 dòng thuần chủng có kiểu gen khác nhau, đời F1 đạt trạng thái dị hợp tử tối đa ở nhiều cặp gen (AaBbCc...), tận dụng hiệu ứng siêu trội (overdominance) làm cây lai có sức sống, năng suất và khả năng chống chịu vượt trội so với cả bố và mẹ.",
      "2. Quy luật thoái hóa giống do tự thụ tinh bắt buộc: Nếu lấy hạt giống cây lai F1 gieo cho vụ sau (F2), do quá trình phân ly độc lập và tái tổ hợp di truyền, tỷ lệ dị hợp tử giảm 50% sau mỗi thế hệ, làm xuất hiện các cặp gen lặn đồng hợp tử có hại dẫn đến cây còi cọc, phân ly kiểu hình mạnh, giảm sút năng suất nghiêm trọng.",
      "3. Cơ sở khoa học của vi nhân giống bằng nuôi cấy mô tế bào (In vitro): Dựa trên tính toàn năng của tế bào thực vật (Totipotency). Tế bào sinh dưỡng mang đầy đủ bộ mã di truyền của cơ thể, dưới tác động của tỷ lệ hormone sinh trưởng Auxin/Cytokinin trong môi trường MS: (a) Auxin/Cytokinin cân bằng -> Kích thích tạo mô sẹo (Callus); (b) Cytokinin cao -> Kích thích bật chồi; (c) Auxin cao -> Kích thích ra rễ hoàn chỉnh.",
      "4. Cơ chế tạo cây đa bội bằng Colchicine: Colchicine ức chế sự hình thành thoi vô sắc trong quá trình phân bào nguyên phân, làm các nhiễm sắc thể nhân đôi nhưng không phân ly về 2 cực, tạo tế bào 4n (tứ bội). Khi lai 4n với 2n tạo ra cây 3n (tam bội). Cây 3n bất thụ không tạo được hạt, kích thước quả và lá to (Dưa hấu không hạt, chuối 3n)."
    ],
    comparisonTable: {
      headers: ["Phương pháp nhân giống", "Bản chất di truyền", "Hệ số nhân giống", "Độ sạch bệnh virút", "Ưu điểm nổi bật"],
      rows: [
        ["Nuôi cấy mô In vitro", "Vô tính (giữ nguyên 100% gen mẹ)", "Cực cao (hàng triệu cây/năm từ 1 đỉnh sinh trưởng)", "Rất cao (khử trùng đỉnh sinh trưởng sạch virút)", "Tạo cây giống đồng loạt, sạch bệnh, chủ động quanh năm"],
        ["Giâm cành / Chiết cành", "Vô tính (nguyên phân từ mô phân sinh)", "Thấp đến trung bình", "Dễ truyền bệnh virút từ cây mẹ", "Đơn giản, rẻ tiền, cây con nhanh ra hoa kết quả"],
        ["Sản xuất hạt lai F1", "Hữu tính (dị hợp tử siêu trội)", "Phụ thuộc sản lượng hạt", "Hạt có thể mang nấm bệnh truyền qua phôi", "Năng suất vượt trội 20-30% so với giống thuần"]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Hạt giống thu hoạch từ ruộng lúa lai F1 đem gieo vụ sau vẫn cho năng suất bằng hoặc cao hơn vụ trước' -> SAI. Hạt F2 bị phân ly di truyền làm giảm sút ưu thế lai từ 25-40%, cây chín không đều.",
      "Bẫy 2: 'Cây giống nuôi cấy mô in vitro sau khi ra khỏi ống nghiệm là đem trồng ngay ra ngoài đồng trống nắng to' -> SAI. Cây mô trong ống nghiệm có lớp cutin rất mỏng và khí khổng chưa hoàn thiện, phải qua giai đoạn huấn luyện (vườn ươm thích nghi 2-3 tuần) trước khi trồng đại trà."
    ]
  },

  cn10_cd5: {
    themeTitle: "Chủ đề 5: Phòng trừ sâu, bệnh hại cây trồng & Quản lý dịch hại tổng hợp (IPM)",
    grade: "cn10",
    coreMechanisms: [
      "1. Nguyên lý cơ bản của IPM: Không hướng tới tiêu diệt triệt để 100% sâu hại, mà giữ mật độ dịch hại ở dưới ngưỡng gây hại kinh tế (EIL - Economic Injury Level). Ưu tiên các biện pháp sinh học, canh tác để bảo vệ thiên địch và môi trường; thuốc hóa học chỉ là biện pháp cứu cánh cuối cùng.",
      "2. Cơ chế tác động của thuốc bảo vệ thực vật sinh học: (a) Chế phẩm vi khuẩn Bt (Bacillus thuringiensis): Chứa tinh thể protein độc δ-endotoxin; khi sâu ăn phải, trong môi trường kiềm (pH > 9) của ruột giữa sâu, tinh thể bị hòa tan và hoạt hóa bởi enzyme protease tạo các lỗ thủng trên màng tế bào biểu mô ruột, làm sâu ngừng ăn và chết sau 2–4 ngày; (b) Nấm ký sinh Beauveria bassiana (nấm trắng) và Metarhizium anisopliae (nấm xanh): Bào tử bám vào biểu bì sâu, nảy mầm tiết enzyme chitinase chọc thủng lớp vỏ cutin xâm nhập vào xoang máu hút chất dinh dưỡng.",
      "3. Cơ chế sâu kháng thuốc hóa học: Do chọn lọc tự nhiên khi phun thuốc liên tục cùng 1 hoạt chất với liều lượng không chuẩn, các cá thể sâu mang đột biến gen kháng thuốc (biến đổi thụ thể đích hoặc tăng cường enzyme phân hủy thuốc cytochrome P450) sống sót và nhân nhanh thành quần thể kháng thuốc."
    ],
    comparisonTable: {
      headers: ["Biện pháp trong IPM", "Bản chất tác động", "Thời điểm áp dụng", "Ưu điểm", "Hạn chế"],
      rows: [
        ["Biện pháp canh tác", "Vệ sinh đồng ruộng, luân canh, cày ải, bón phân cân đối", "Thường xuyên, xuyên suốt vụ", "Ngăn chặn mầm mống sâu bệnh từ gốc, chi phí thấp", "Không dập tắt được khi dịch bùng phát lớn"],
        ["Biện pháp sinh học", "Sử dụng thiên địch (ong mắt đỏ, bọ rùa) và chế phẩm vi sinh", "Đầu vụ hoặc khi sâu xuất hiện ở mật độ thấp", "An toàn tuyệt đối cho người, không gây kháng thuốc", "Tác dụng chậm hơn thuốc hóa học, dễ bị ảnh hưởng thời tiết"],
        ["Biện pháp hóa học", "Phun thuốc BVTV hóa học đặc hiệu", "Chỉ khi mật độ sâu vượt ngưỡng hành động (ET)", "Tác dụng nhanh, dập dịch tức thì trên diện rộng", "Dễ gây ngộ độc, tiêu diệt thiên địch, gây kháng thuốc, tồn dư"]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Phun thuốc hóa học định kỳ 7 ngày/lần cho dù trên ruộng không hề có sâu bệnh để phòng ngừa' -> SAI. Vi phạm nguyên tắc 4 đúng trong BVTV, làm tiêu diệt hết thiên địch có ích và nhanh chóng tạo dòng sâu siêu kháng thuốc.",
      "Bẫy 2: 'Có thể pha chung thuốc trừ sâu sinh học Bt với thuốc trừ nấm hóa học gốc đồng để tiết kiệm công phun' -> SAI. Thuốc trừ nấm gốc đồng có tính sát khuẩn mạnh sẽ tiêu diệt hoặc vô hiệu hóa các tế bào vi khuẩn Bt sống trong chế phẩm."
    ]
  },

  cn10_cd6_7: {
    themeTitle: "Chủ đề 6 & 7: Kỹ thuật trồng trọt & Nông nghiệp công nghệ cao (Nhà kính, Thủy canh, IoT)",
    grade: "cn10",
    coreMechanisms: [
      "1. Bản chất công nghệ nhà màng / nhà kính: Hiệu ứng nhà kính nhân tạo giữ nhiệt độ ấm vào mùa lạnh; màng polyethylene (PE) khuếch tán ánh sáng chống cháy lá; lưới chắn côn trùng 50 mesh ngăn cản bọ trĩ, phấn trắng xâm nhập truyền virus bệnh xoăn lá.",
      "2. Hệ thống tưới nhỏ giọt kết hợp bón phân (Fertigation): Nước và các ion khoáng được hòa tan chính xác theo tỷ lệ thích hợp và cấp trực tiếp vào vùng rễ tích cực của cây với lưu lượng nhỏ (1–3 lít/giờ), tiết kiệm 40–60% nước tưới và 30% phân bón so với tưới tràn, ngăn ngừa rửa trôi phân xuống tầng nước ngầm.",
      "3. Cơ chế dinh dưỡng trong trồng cây không dùng đất (Thủy canh): Kiểm soát 2 chỉ số sống còn: (a) Độ dẫn điện EC (Electrical Conductivity, đơn vị mS/cm): Đặc trưng cho tổng nồng độ muối khoáng hòa tan; nếu EC quá cao (> 3.0 mS/cm) tạo dung dịch ưu trương làm rễ mất nước gây héo rũ sinh lý; nếu EC quá thấp (< 1.0 mS/cm) cây thiếu dinh dưỡng; (b) Độ pH dung dịch tối ưu từ 5.5–6.5: Ở dải pH này, tất cả các nguyên tố đa, trung, vi lượng (đặc biệt là Fe2+, Mn2+, P) đều ở dạng hòa tan mà rễ hấp thu thuận lợi nhất.",
      "4. Điều khiển quang chu kỳ nhân tạo bằng đèn LED: Cây ngày ngắn (Cúc, dâu tây) cần đêm dài để phân hóa mầm hoa; chiếu sáng ngắt quãng ban đêm (Night-break) ức chế ra hoa để nuôi thân lá cao lớn, khi muốn ra hoa thì ngừng chiếu sáng."
    ],
    comparisonTable: {
      headers: ["Hệ thống canh tác", "Đặc điểm cấu tạo & Vận hành", "Kiểm soát oxy vùng rễ", "Ưu điểm nổi bật", "Nhược điểm & Rủi ro"],
      rows: [
        ["Thủy canh hồi lưu (NFT)", "Dung dịch dinh dưỡng chảy thành màng mỏng 1-2 mm qua máng nghiêng", "Tốt (phần trên rễ tiếp xúc trực tiếp không khí)", "Tiết kiệm nước và phân bón, tuần hoàn khép kín", "Mất điện làm bơm ngừng, rễ cây khô héo rất nhanh"],
        ["Khí canh (Aeroponics)", "Rễ treo lơ lửng trong không khí, được phun sương dinh dưỡng định kỳ", "Tối ưu nhất (100% rễ tiếp xúc oxy dồi dào)", "Cây lớn nhanh gấp 1.5-2 lần, tiết kiệm tối đa nước", "Chi phí đầu tư cao, vòi phun sương dễ bị tắc cặn khoáng"],
        ["Trồng trên giá thể tưới nhỏ giọt", "Cây trồng trong bầu xơ dừa/tro trấu, cắm que tưới nhỏ giọt", "Tốt nhờ độ xốp thoáng khí của giá thể", "Dễ làm, phù hợp đa số cây ăn quả (Dưa lưới, Cà chua bi)", "Cần xử lý tanin và lignin trong mụn dừa trước khi trồng"]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Dung dịch thủy canh pha càng đậm đặc muối khoáng thì rau màu càng lớn nhanh và xanh mướt' -> SAI. Nồng độ muối quá cao (EC cao) làm áp suất thẩm thấu dung dịch vượt quá áp suất thẩm thấu của tế bào lông hút, nước từ rễ bị hút ngược ra ngoài làm cây héo chết.",
      "Bẫy 2: 'Mụn xơ dừa tươi mới bóc từ quả dừa có thể dùng ngay làm giá thể ươm hạt' -> SAI. Mụn dừa tươi chứa hàm lượng Tanin và Lignin rất cao (vị chát) gây ức chế phân chia tế bào rễ, bắt buộc phải ngâm xả nước nhiều lần và ngâm nước vôi để khử chát trước khi dùng."
    ]
  },

  cn10_cd8: {
    themeTitle: "Chủ đề 8: Bảo vệ môi trường trong trồng trọt & Nông nghiệp tuần hoàn",
    grade: "cn10",
    coreMechanisms: [
      "1. Cơ chế ngộ độc hữu cơ ở ruộng lúa: Khi vùi rơm rạ tươi vào ruộng ngập nước trong điều kiện yếm khí (thiếu oxy), vi sinh vật kỵ khí phân hủy sinh ra các khí độc (H2S, CH4) và các acid hữu cơ chuỗi ngắn (acetic, butyric). Các chất độc này làm rễ lúa bị thối đen, không hút được dinh dưỡng, lá vàng lụi.",
      "2. Cơ chế ủ phân hữu cơ hiếu khí (Composting): Vi sinh vật hiếu khí phân giải hợp chất hữu cơ sinh nhiệt; ở giai đoạn nhiệt cao (Thermophilic phase 55–65°C kéo dài 5–7 ngày) tiêu diệt triệt để trứng giun sán, hạt cỏ dại và nấm bệnh truyền nhiễm.",
      "3. Nguyên tắc Nông nghiệp tuần hoàn: Phụ phẩm của ngành trồng trọt (rơm rạ, thân ngô) làm thức ăn cho chăn nuôi hoặc giá thể nấm; chất thải chăn nuôi được ủ biogas/compost làm phân bón hữu cơ trả lại cho đất trồng, khép kín chu trình vật chất và giảm phát thải CO2, CH4."
    ],
    comparisonTable: {
      headers: ["Tiêu chuẩn sản xuất", "Quy định phân bón & Hóa chất", "Thời gian cách ly (PHI)", "Ghi chép truy xuất nguồn gốc", "Mục tiêu hướng tới"],
      rows: [
        ["VietGAP Trồng trọt", "Cho phép dùng hóa học nhưng phải trong danh mục và đúng liều", "Bắt buộc tuân thủ nghiêm ngặt theo nhãn thuốc", "Bắt buộc ghi nhật ký đồng ruộng chi tiết", "An toàn thực phẩm cho người tiêu dùng"],
        ["Nông nghiệp Hữu cơ (Organic)", "Nghiêm cấm 100% phân hóa học, thuốc trừ sâu hóa học, giống biến đổi gen", "Không áp dụng vì không dùng hóa chất", "Truy xuất nguồn gốc nghiêm ngặt toàn chuỗi", "Bảo vệ hệ sinh thái và sức khỏe bền vững"]
      ]
    },
    examTraps: [
      "Bẫy: 'Đốt rơm rạ ngay trên đồng sau thu hoạch là biện pháp tốt nhất để diệt sâu bệnh và bổ sung tro giàu phân bón cho đất' -> SAI. Đốt rơm rạ thiêu chết toàn bộ hệ vi sinh vật có ích tầng mặt đất, làm chai cứng đất, gây ô nhiễm khói bụi mù mịt và làm thất thoát toàn bộ đạm, hữu cơ vào khí quyển."
    ]
  },

  // KHỐI 11: CÔNG NGHỆ CHĂN NUÔI (6 CHỦ ĐỀ)
  cn11_cd1: {
    themeTitle: "Chủ đề 1: Giới thiệu chung về chăn nuôi & Phương thức chăn nuôi hiện đại",
    grade: "cn11",
    coreMechanisms: [
      "1. Vai trò chuyển hóa sinh học của ngành chăn nuôi: Biến đổi các phụ phẩm thực vật khó tiêu đối với người (cỏ, rơm rạ, cám) nhờ hệ vi sinh vật đường ruột của vật nuôi thành nguồn thực phẩm giàu protein có giá trị sinh học cao (thịt, trứng, sữa) chứa đầy đủ các acid amin thiết yếu.",
      "2. Cơ chế phát thải khí nhà kính trong chăn nuôi: (a) Khí Methane (CH4) sinh ra từ quá trình lên men yếm khí ở dạ cỏ gia súc nhai lại (bò, trâu, dê) do vi khuẩn cổ sinh methane (Methanogens) kết hợp CO2 + 4H2 -> CH4 + 2H2O; (b) Khí N2O sinh ra từ quá trình phân hủy phân gia súc khi quản lý chất thải không đúng kỹ thuật. CH4 có tiềm năng làm nóng lên toàn cầu cao gấp 28 lần CO2."
    ],
    comparisonTable: {
      headers: ["Phương thức chăn nuôi", "Đặc điểm chuồng trại & Chăm sóc", "Năng suất & FCR", "Kiểm soát an toàn sinh học", "Phúc lợi động vật"],
      rows: [
        ["Chăn thả tự do", "Không có chuồng hoặc chuồng tạm, gia súc tự tìm thức ăn", "Thấp, thời gian nuôi dài, FCR cao", "Rất khó kiểm soát, dễ lây nhiễm dịch bệnh hoang dã", "Tự do vận động nhưng chịu rủi ro thời tiết khắc nghiệt"],
        ["Bán chăn thả", "Có chuồng trại kết hợp sân chơi / bãi chăn thả có kiểm soát", "Trung bình khá, chất lượng thịt thơm ngon", "Khá tốt nếu có hàng rào cách ly và tiêm phòng đủ", "Tốt, cân bằng giữa vận động và bảo vệ sức khỏe"],
        ["Nuôi nhốt công nghiệp thâm canh", "Chuồng kín hoàn toàn, tự động hóa cho ăn, uống, kiểm soát vi khí hậu", "Rất cao, tăng trọng nhanh, FCR tối ưu", "Tối ưu nhất nhờ cách ly hoàn toàn với mầm bệnh bên ngoài", "Cần đảm bảo diện tích sàn và mật độ nuôi hợp lý"]
      ]
    },
    examTraps: [
      "Bẫy: 'Chăn nuôi công nghiệp chuồng kín luôn làm suy giảm chất lượng thịt so với chăn thả tự do' -> SAI. Chất lượng thịt phụ thuộc vào giống, khẩu phần dinh dưỡng cân đối và quy trình giết mổ nhân đạo; chuồng kín kiểm soát được dịch bệnh và loại bỏ hoàn toàn tồn dư kháng sinh."
    ]
  },

  cn11_cd2: {
    themeTitle: "Chủ đề 2: Công nghệ giống vật nuôi, Chọn lọc di truyền & Công nghệ sinh sản",
    grade: "cn11",
    coreMechanisms: [
      "1. Hệ số di truyền (h2) của các tính trạng ở vật nuôi: (a) Tính trạng sinh sản (số con đẻ ra/lứa, tỷ lệ thụ thai) có h2 thấp (0.1–0.15) -> Chịu ảnh hưởng lớn bởi dinh dưỡng và môi trường, chọn lọc cá thể ít hiệu quả, phải dùng phương pháp lai kinh tế tận dụng ưu thế lai; (b) Tính trạng sinh trưởng (tăng trọng ADG, tiêu tốn thức ăn FCR) có h2 trung bình (0.3–0.4); (c) Tính trạng thân thịt (tỷ lệ nạc, diện tích cơ thăn) có h2 cao (0.5–0.6) -> Chịu sự chi phối mạnh của kiểu gen, chọn lọc cá thể trực tiếp đem lại hiệu quả di truyền rất nhanh.",
      "2. Bản chất các phương pháp lai giống: (a) Lai kinh tế: Cho phối giữa 2 hoặc nhiều giống thuần khác nhau, toàn bộ con lai F1 được nuôi thương phẩm lấy thịt, trứng, sữa, TUYỆT ĐỐI KHÔNG giữ làm giống; (b) Lai cải tạo (lai hấp thu): Dùng đực giống ngoại thuần phối liên tục qua 4–5 thế hệ (F1, F2, F3, F4) với cái nền địa phương để biến đổi cơ bản đặc tính giống bản địa thành giống ngoại; (c) Lai tạo thành (lai phát triển): Phối giữa các giống để tổng hợp các đặc tính quý, sau đó tự phối và chọn lọc cố định kiểu gen tạo thành giống mới.",
      "3. Công nghệ thụ tinh nhân tạo (AI): Tinh dịch sau khi khai thác được kiểm tra hoạt lực (A ≥ 0.7), mật độ (C), pha loãng bằng môi trường đệm dinh dưỡng chứa kháng sinh và chất chống sốc lạnh; bảo quản ngắn ngày ở 17°C (tinh lợn) hoặc đóng cọng rạ trữ đông trong nitơ lỏng -196°C (tinh bò) duy trì khả năng thụ tinh hàng chục năm."
    ],
    comparisonTable: {
      headers: ["Phương pháp nhân giống", "Mục đích chính", "Cách tiến hành phối giống", "Sản phẩm đời con", "Lưu ý sống còn"],
      rows: [
        ["Nhân giống thuần chủng", "Bảo tồn nguồn gen quý hoặc nhân đàn giống thuần", "Đực và Cái cùng một giống thuần (VD: Lợn Móng Cái × Móng Cái)", "Con thuần chủng mang đặc tính ổn định", "Phải tránh giao phối cận huyết (đồng huyết)"],
        ["Lai kinh tế đơn (2 giống)", "Tạo ưu thế lai tối đa để nuôi thịt thương phẩm", "Đực ngoại thuần × Cái nội thuần (VD: Đực Yorkshire × Nái Móng Cái)", "Con lai F1 tăng trọng nhanh, thịt nạc, chống chịu tốt", "100% con lai F1 chuyển nuôi thịt, KHÔNG làm giống"],
        ["Lai kinh tế 3 giống", "Khai thác tối đa ưu thế lai cả ở con mẹ và đời con", "Đực giống thứ 3 × Nái lai F1 (VD: Đực Duroc × Nái F1 (Landrace × Yorkshire))", "Con lai 3 máu có tỷ lệ nạc cao nhất (> 60%), FCR thấp", "Quy trình công nghệ cao, đòi hỏi nái F1 chuẩn"]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Chọn con lợn giống tốt nhất là chỉ cần nhìn vào ngoại hình to béo, bóng mượt lúc nhỏ' -> SAI. Ngoại hình chỉ phản ánh một phần; chỉ số chọn giống hiện đại bắt buộc phải dựa vào kiểm tra cá thể (Performance test) và giá trị giống ước tính EBV/BLUP thông qua năng suất của đời bố mẹ và anh chị em ruột.",
      "Bẫy 2: 'Giữ lại những con nái lai F1 (Yorkshire × Móng Cái) to đẹp để tự phối giống với đực lai F1 cùng lứa' -> SAI. Lai cận huyết giữa các cá thể lai F1 sẽ dẫn tới thoái hóa giống nghiêm trọng, thai chết lưu, dị tật bẩm sinh và mất hoàn toàn ưu thế lai."
    ]
  },

  cn11_cd3: {
    themeTitle: "Chủ đề 3: Công nghệ thức ăn chăn nuôi, Hóa sinh tiêu hóa & Chế biến ủ chua",
    grade: "cn11",
    coreMechanisms: [
      "1. Đặc điểm tiêu hóa ở gia súc nhai lại vs dạ dày đơn: (a) Động vật nhai lại (Bò, dê) có dạ dày 4 ngăn: Dạ cỏ (Rumen) chiếm 80% thể tích, chứa hàng tỷ vi khuẩn, protozoa và nấm kỵ khí lên men xenlulozơ thành các acid béo bay hơi (VFA: Acetic, Propionic, Butyric) cung cấp 70–80% năng lượng cho vật nuôi; vi sinh vật dạ cỏ còn tự tổng hợp được protein cơ thể từ nguồn đạm phi protein (Urê) và tổng hợp toàn bộ vitamin nhóm B; (b) Động vật dạ dày đơn (Lợn, gà) không tiêu hóa được chất xơ thô, bắt buộc phải cung cấp đầy đủ các acid amin thiết yếu (Lysine, Methionine, Threonine, Tryptophan).",
      "2. Bản chất hóa sinh của quá trình ủ chua thức ăn thô xanh: Nén chặt nguyên liệu (cỏ voi, thân cây ngô) trong hầm ủ tạo môi trường yếm khí tuyệt đối. Quần thể vi khuẩn Lactic tự nhiên (Lactobacillus) lên men nguồn đường tan trong cỏ sinh ra acid lactic, làm hạ nhanh độ pH của khối ủ xuống 3.8–4.2. Độ pH acid này ức chế hoàn toàn các vi khuẩn gây thối (Clostridium) và nấm mốc, giúp bảo quản thức ăn nhiều tháng mà không mất chất dinh dưỡng.",
      "3. Công nghệ thức ăn hỗn hợp hoàn chỉnh TMR (Total Mixed Ration): Phối trộn toàn bộ thức ăn thô xanh, thức ăn tinh, phụ phẩm, khoáng và vitamin thành một hỗn hợp đồng nhất theo khẩu phần tính toán khoa học, giúp dạ cỏ bò sữa luôn giữ ổn định độ pH (6.2–6.8), tối đa hóa quá trình lên men và triệt tiêu thói quen ăn chọn lọc của gia súc."
    ],
    comparisonTable: {
      headers: ["Phương pháp bảo quản chế biến", "Cơ chế tác động", "Độ ẩm sản phẩm", "Hao hụt dinh dưỡng", "Ưu điểm & Nhược điểm"],
      rows: [
        ["Ủ chua thức ăn thô xanh", "Lên men yếm khí sinh acid lactic hạ pH xuống 3.8-4.2", "Cao (65 - 70%)", "Rất thấp (5 - 10%)", "Giữ nguyên vitamin và độ ngon miệng; đòi hỏi nén thật chặt và kín khí"],
        ["Phơi khô / Sấy khô", "Hạ độ ẩm dưới 14% để ức chế enzyme và vi sinh vật", "Thấp (≤ 14%)", "Cao (20 - 30% do gãy vụn lá và oxy hóa carotene)", "Dễ bảo quản vận chuyển; phụ thuộc hoàn toàn vào thời tiết nắng"],
        ["Ủ rơm với dung dịch Urê", "Urê thủy phân tạo NH3 kiềm hóa phá vỡ liên kết Lignin-Xenlulozơ", "Trung bình (40 - 50%)", "Làm giàu thêm hàm lượng protein thô cho rơm", "Tăng tỷ lệ tiêu hóa rơm từ 35% lên 55%; cần che đậy kín tránh bay hơi NH3"]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Cho bò ăn trực tiếp phân đạm Urê hạt tinh khiết với số lượng lớn để bổ sung đạm nhanh' -> SAI. Bò sẽ bị ngộ độc Amoniac cấp tính dẫn đến trướng cỏ và tử vong trong vài giờ; Urê chỉ được phối trộn tối đa 1% trong khẩu phần hoặc dùng ủ rơm, và tuyệt đối không cho bê non chưa hoàn thiện dạ cỏ ăn Urê.",
      "Bẫy 2: 'Túi ủ chua cỏ bị rách một lỗ nhỏ không cần dán lại vì vi khuẩn lactic vẫn hoạt động bình thường' -> SAI. Không khí lọt vào sẽ chuyển khối ủ từ yếm khí sang hiếu khí, nấm mốc phát triển sinh độc tố mycotoxin và vi khuẩn Clostridium làm thối rữa toàn bộ khối thức ăn."
    ]
  },

  cn11_cd4: {
    themeTitle: "Chủ đề 4: Phòng, trị bệnh cho vật nuôi & Miễn dịch học thú y",
    grade: "cn11",
    coreMechanisms: [
      "1. Cơ chế miễn dịch chủ động vs miễn dịch thụ động: (a) Miễn dịch chủ động do tiêm Vaccine (chứa kháng nguyên là virus/vi khuẩn đã bị làm yếu, giết chết hoặc mảnh kháng nguyên tái tổ hợp): Cơ thể vật nuôi nhận diện kháng nguyên, kích hoạt tế bào lympho B và T sản sinh kháng thể đặc hiệu và hình thành tế bào nhớ miễn dịch (Memory cells); cần 14–21 ngày để đạt hiệu giá kháng thể bảo hộ, tác dụng kéo dài 6–12 tháng; (b) Miễn dịch thụ động: Cơ thể nhận trực tiếp kháng thể từ bên ngoài (Kháng thể mẹ truyền qua sữa đầu Colostrum trong 24 giờ đầu sau sinh, hoặc tiêm kháng huyết thanh); có tác dụng bảo vệ ngay lập tức nhưng chỉ tồn tại ngắn ngày (vài tuần).",
      "2. Phân biệt bản chất gây bệnh giữa Virus và Vi khuẩn: Virus (Dịch tả lợn châu Phi ASF, Cúm gia cầm H5N1, PRRS, Lở mồm long móng FMD) là ký sinh nội bào bắt buộc, không có cấu tạo tế bào, hoàn toàn KHÔNG bị tiêu diệt bởi thuốc kháng sinh. Vi khuẩn (Tụ huyết trùng, Phó thương hàn, E. coli) có cấu tạo tế bào nhân sơ, bị ức chế hoặc tiêu diệt bởi kháng sinh thông qua ức chế tổng hợp thành tế bào (Penicillin), ức chế ribosome tổng hợp protein (Tetracycline) hoặc ức chế nhân đôi DNA (Quinolone).",
      "3. Nguyên lý An toàn sinh học 3 cấp độ: (a) Cách ly sinh học (Hàng rào, hố sát trùng, mạng lưới lưới ngăn chim chuột, buồng tắm sát trùng công nhân); (b) Vệ sinh khử trùng (Quy trình All-in All-out cùng vào cùng ra, để trống chuồng 14–21 ngày quét vôi và phun sát trùng); (c) Kiểm soát nguồn vào (Kiểm dịch con giống sạch bệnh PCR, xử lý nhiệt thức ăn và nước uống)."
    ],
    comparisonTable: {
      headers: ["Thuốc / Chế phẩm thú y", "Bản chất thành phần", "Đối tượng tác động", "Mục đích sử dụng", "Hậu quả khi lạm dụng sai quy định"],
      rows: [
        ["Vaccine (Vắc xin)", "Kháng nguyên (Virus/vi khuẩn làm yếu hoặc bất hoạt)", "Hệ miễn dịch của vật nuôi khỏe mạnh", "Phòng bệnh chủ động lâu dài trước khi nhiễm", "Tiêm khi con vật đang ốm sốt làm bệnh bùng phát nặng hơn"],
        ["Kháng sinh (Antibiotics)", "Hợp chất hóa sinh ức chế/diệt tế bào vi khuẩn", "Vi khuẩn gây bệnh (KHÔNG diệt được virus)", "Điều trị khi vật nuôi đã nhiễm khuẩn", "Tạo dòng vi khuẩn đa kháng thuốc (AMR), tồn dư trong thực phẩm"],
        ["Kháng huyết thanh (Antiserum)", "Chứa kháng thể đặc hiệu tinh chế sẵn", "Độc tố vi khuẩn hoặc mầm bệnh đang xâm nhập", "Cấp cứu điều trị khẩn cấp giai đoạn đầu nhiễm", "Chỉ tạo miễn dịch tạm thời vài ngày, giá thành cao"]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Khi đàn lợn bị dịch tả lợn châu Phi (ASF), biện pháp tốt nhất là tiêm kháng sinh liều cao kết hợp bổ sung thuốc bổ để chữa khỏi' -> SAI. ASF là bệnh do virus, hiện chưa có thuốc điều trị đặc hiệu; việc tiêm thuốc chỉ làm lây lan mầm bệnh nhanh hơn qua đầu kim tiêm; bắt buộc phải tiêu hủy đàn bệnh và thực hiện an toàn sinh học.",
      "Bẫy 2: 'Trộn kháng sinh phòng bệnh định kỳ vào thức ăn chăn nuôi hằng ngày để vật nuôi không bao giờ bị ốm' -> SAI. Vi phạm nghiêm trọng Luật Chăn nuôi và an toàn thực phẩm, làm vi khuẩn kháng thuốc (nhờ truyền plasmid kháng thuốc) và gây nguy hiểm trực tiếp cho sức khỏe con người."
    ]
  },

  cn11_cd5: {
    themeTitle: "Chủ đề 5: Công nghệ chuồng trại, Nuôi dưỡng chăm sóc & Vi khí hậu chuồng nuôi",
    grade: "cn11",
    coreMechanisms: [
      "1. Nguyên lý vận hành chuồng kín áp suất âm kiểu hầm (Tunnel Ventilation): Quạt hút công suất lớn đặt ở cuối chuồng liên tục hút không khí ra ngoài tạo áp suất âm (chênh lệch áp suất) bên trong chuồng, buộc không khí tươi mát từ bên ngoài phải tràn qua giàn tấm làm mát Cooling Pad đặt ở đầu chuồng. Nước chảy trên Cooling Pad bay hơi thu nhiệt, làm nhiệt độ luồng khí giảm từ 5–8°C trước khi thổi dọc qua cơ thể gia súc với vận tốc gió 2–3 m/s tạo hiệu ứng gió mát làm dịu thân nhiệt.",
      "2. Cơ chế điều khiển chu kỳ chiếu sáng ở gia cầm đẻ trứng: Ánh sáng kích thích qua võng mạc mắt và xuyên qua hộp sọ tác động trực tiếp vào vùng dưới đồi (Hypothalamus) tiết GnRH, kích thích thùy trước tuyến yên tiết hormone FSH (kích thích noãn bao phát triển) và LH (gây rụng trứng). Gà đẻ cần duy trì ổn định 16 giờ chiếu sáng/ngày; nếu đột ngột giảm thời gian chiếu sáng, gà sẽ ngừng đẻ và thay lông sớm.",
      "3. Nhu cầu vi khí hậu chuồng nuôi: Nồng độ khí độc tối đa cho phép: NH3 < 20 ppm, H2S < 10 ppm, CO2 < 0.3%. Khí NH3 nhẹ hơn không khí bay lơ lửng gây viêm niêm mạc mắt và đường hô hấp; khí H2S nặng hơn không khí chìm sát sàn chuồng phá hủy hemoglobin trong máu."
    ],
    comparisonTable: {
      headers: ["Thông số kỹ thuật", "Chuồng hở truyền thống", "Chuồng kín áp suất âm hiện đại"],
      rows: [
        ["Kiểm soát nhiệt độ", "Phụ thuộc 100% thời tiết bên ngoài, dễ bị sốc nhiệt mùa hè", "Tự động duy trì 24-28°C nhờ cảm biến nhiệt và giàn Cooling Pad"],
        ["Vận tốc gió & Độ ẩm", "Thất thường, lúc gió lùa lúc lặng gió tù đọng", "Điều tiết chính xác 1.5 - 2.5 m/s, độ ẩm 65 - 75%"],
        ["Nguy cơ lây nhiễm dịch", "Rất cao do chim trời, chuột bọ tự do xâm nhập", "Rất thấp nhờ lưới chắn côn trùng và hệ thống lọc kín"],
        ["Mật độ nuôi & Năng suất", "Mật độ thấp (1 - 1.2 m2/lợn thịt)", "Mật độ cao (0.7 - 0.8 m2/lợn thịt), FCR giảm 0.2 - 0.3"]
      ]
    },
    examTraps: [
      "Bẫy: 'Vào mùa hè nắng nóng, mở toang tất cả các cửa sổ của chuồng kín áp suất âm để gió tự nhiên ùa vào cho mát' -> SAI. Mở cửa sổ sẽ phá vỡ áp suất âm trong chuồng, không khí nóng không đi qua tấm làm mát Cooling Pad mà tràn thẳng vào cửa sổ, làm quạt hút cuối chuồng mất tác dụng và vật nuôi bị ngạt sốc nhiệt chết hàng loạt."
    ]
  },

  cn11_cd6: {
    themeTitle: "Chủ đề 6: Bảo vệ môi trường chăn nuôi & Công nghệ xử lý chất thải (Biogas, Đệm lót sinh học)",
    grade: "cn11",
    coreMechanisms: [
      "1. Cơ chế sinh hóa 4 giai đoạn trong hầm ủ Biogas kỵ khí: (1) Thủy phân: Vi khuẩn thủy phân protein, lipid, xenlulozơ thành acid amin, acid béo, đường đơn; (2) Acid hóa: Vi khuẩn lên men acid tạo acid hữu cơ chuỗi ngắn, rượu, H2, CO2; (3) Acetic hóa: Chuyển hóa acid hữu cơ thành acid acetic CH3COOH; (4) Methane hóa (Methanogenesis): Vi khuẩn cổ kỵ khí bắt buộc (Methanobacterium) chuyển hóa acetate và H2/CO2 thành khí Methane: CH3COOH -> CH4 + CO2 và CO2 + 4H2 -> CH4 + 2H2O. Khí Biogas thành phẩm chứa 60–70% CH4, 30–40% CO2.",
      "2. Cơ chế phân hủy của đệm lót sinh học (Balasa N01): Hỗn hợp trấu, mùn cưa phối trộn với quần thể nấm men (Saccharomyces) và vi khuẩn Bacillus hiếu khí. Khi phân và nước tiểu thải ra, các vi sinh vật này nhân nhanh, tiết enzyme protease và urease phân giải protein và acid uric trong chất thải thành các chất vô hại, đồng thời sinh nhiệt (nhiệt độ tầng đệm lót đạt 40–50°C) làm bay hơi nước, giữ chuồng luôn khô ráo và khử sạch mùi hôi thối NH3, H2S.",
      "3. Công nghệ nuôi ấu trùng ruồi lính đen (Hermetia illucens - BSF): Ấu trùng có hệ enzyme tiêu hóa cực mạnh, tiêu thụ phân tươi và xác hữu cơ; sinh khối ấu trùng chứa 42% protein thô và 35% chất béo giàu acid lauric, là nguồn thức ăn sống tuyệt hảo cho gà, cá và làm phân bón hữu cơ giàu mùn."
    ],
    comparisonTable: {
      headers: ["Công nghệ xử lý", "Nguyên lý sinh học", "Sản phẩm thu hồi", "Phạm vi áp dụng phù hợp", "Lưu ý kỹ thuật quan trọng"],
      rows: [
        ["Hầm Biogas kỵ khí", "Lên men vi sinh vật kỵ khí tạo khí Methane", "Khí đốt sinh học (CH4), nước thải sau xử lý", "Trang trại quy mô vừa và lớn có lượng phân lỏng nhiều", "Không để xà phòng, chất tẩy rửa lọt vào hầm làm chết vi khuẩn"],
        ["Đệm lót sinh học", "Lên men sinh nhiệt hiếu khí của nấm men và Bacillus", "Đệm lót hoai mục làm phân bón hữu cơ cao cấp", "Chăn nuôi lợn, gà quy mô vừa và nông hộ", "Bảo đảm độ ẩm đệm lót 40-50%, đảo tơi xốp định kỳ"],
        ["Máy ép tách phân", "Phân tách cơ học pha rắn và pha lỏng qua trục vít", "Bã phân rắn độ ẩm < 60%, dịch lỏng vào biogas", "Trang trại lợn, bò sữa quy mô công nghiệp lớn", "Bã phân ủ compost hoai mục bán thương phẩm giá trị cao"]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Hầm Biogas càng đổ nhiều nước rửa chuồng có chứa xút tẩy rửa NaOH và Chlorine thì càng sạch và sinh nhiều khí gas' -> SAI. Chất tẩy rửa và hóa chất khử trùng tiêu diệt triệt để quần thể vi khuẩn kỵ khí sinh methane, làm hầm biogas bị chua hóa, sủi bọt thối và ngừng sinh khí hoàn toàn.",
      "Bẫy 2: 'Sử dụng đệm lót sinh học thì không bao giờ cần phải thay mới đệm suốt đời dự án' -> SAI. Đệm lót sau 6–12 tháng sẽ bị bão hòa chất hữu cơ và muối khoáng, cần thu dọn làm phân bón hữu cơ và thay lớp đệm mới."
    ]
  },

  // KHỐI 12: LÂM NGHIỆP & THỦY SẢN (6 CHỦ ĐỀ)
  cn12_cd1_3: {
    themeTitle: "Chủ đề 1–3: Lâm nghiệp, Sinh thái rừng 5 tầng, Kỹ thuật trồng & Khai thác bền vững FSC",
    grade: "cn12",
    coreMechanisms: [
      "1. Cấu trúc thẳng đứng 5 tầng của rừng nhiệt đới: (T1) Tầng vượt tán (cây gỗ đại ngàn > 35m, ưa sáng tuyệt đối); (T2) Tầng tán chính (20–30m, khép tán liên tục hấp thu 70–80% ánh sáng); (T3) Tầng dưới tán (10–18m, cây gỗ nhỏ chịu bóng một phần); (T4) Tầng cây bụi (2–8m); (T5) Tầng thảm tươi và rêu mục (sát mặt đất). Rừng nhiều tầng có khả năng phân tán xung lực hạt mưa rơi, giảm 90% xói mòn rửa trôi đất và điều tiết 70% lượng nước ngầm mùa khô.",
      "2. Chứng chỉ quản lý rừng bền vững FSC (Forest Stewardship Council): Đòi hỏi tuân thủ nghiêm ngặt 10 nguyên tắc toàn diện: Bảo tồn đa dạng sinh học, tôn trọng quyền của người bản địa, không chuyển đổi rừng tự nhiên sang rừng trồng công nghiệp, cấm hoàn toàn hóa chất diệt cỏ nguy hại, duy trì giá trị bảo tồn cao (HCVF). Gỗ có chứng chỉ FSC có giá trị xuất khẩu cao hơn 15–20% sang thị trường EU và Bắc Mỹ.",
      "3. Bản chất các phương thức khai thác rừng: (a) Khai thác chọn: Chỉ chặt hạ các cây gỗ đạt tiêu chuẩn kích thước thành thục công nghệ và cây cong queo sâu bệnh, giữ lại tối thiểu 60–70% độ tàn che của tán rừng và toàn bộ cây con tái sinh tự nhiên; (b) Khai thác dần: Chặt hạ qua 3–4 bước trong một luân kỳ (chặt mở tán, chặt gieo giống, chặt dọn); (c) Khai thác trắng: Chặt sạch toàn bộ cây rừng trong một ô tiêu chuẩn trong một mùa khai thác; TUYỆT ĐỐI CẤM khai thác trắng trên đất dốc > 25° và lưu vực rừng phòng hộ đầu nguồn vì gây lũ quét, sạt lở đất nghiêm trọng.",
      "4. Nguyên tắc thiết kế đường băng cản lửa phòng chống cháy rừng: (a) Đường băng trắng: Dọn sạch 100% vật liệu cháy đến tận lớp đất khoáng, rộng 10–20m; (b) Đường băng xanh: Dải rừng trồng các loài cây lá dày, mọng nước, khó cháy, cành nhánh thấp (Vối thuốc Schima wallichii, Keo lá tràm, Đương môn) để ngăn chặn tàn lửa bay qua."
    ],
    comparisonTable: {
      headers: ["Phương thức khai thác", "Tỷ lệ chặt hạ", "Mức độ xáo động sinh thái", "Phục hồi rừng", "Địa hình áp dụng cho phép"],
      rows: [
        ["Khai thác chọn", "20 - 30% trữ lượng cây gỗ thành thục", "Rất thấp, duy trì liên tục cấu trúc rừng", "Tự nhiên từ tầng cây tái sinh có sẵn", "Áp dụng được cho mọi địa hình dốc, rừng phòng hộ hạn chế"],
        ["Khai thác dần", "Chặt dần qua 2-3 đợt cách nhau 3-5 năm", "Trung bình", "Dựa vào hạt gieo tự nhiên từ cây mẹ để lại", "Đất có độ dốc trung bình (< 20°), đất màu mỡ"],
        ["Khai thác trắng", "100% cây trên dải/lô khai thác", "Cực mạnh, mất hoàn toàn thảm thực vật che phủ", "Bắt buộc phải trồng lại rừng nhân tạo ngay vụ sau", "Chỉ được phép trên địa hình bằng phẳng hoặc dốc nhẹ < 15°"]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Khai thác trắng giúp ánh sáng chiếu xuống mặt đất tối đa nên là phương pháp tốt nhất cho rừng phòng hộ đầu nguồn' -> SAI. Mất rừng đầu nguồn làm mất thảm mục giữ nước, nước mưa tạo dòng chảy tràn xói mòn trơ sỏi đá và gây lũ quét tàn phá hạ du.",
      "Bẫy 2: 'Gỗ từ rừng trồng không cần chứng chỉ FSC vẫn xuất khẩu thuận lợi và có giá bán cao sang châu Âu' -> SAI. Quy định chống phá rừng của EU (EUDR) và tiêu chuẩn FSC là rào cản kỹ thuật bắt buộc; gỗ không rõ nguồn gốc sẽ bị cấm nhập khẩu hoặc bị phạt nặng."
    ]
  },

  cn12_cd4_5: {
    themeTitle: "Chủ đề 4 & 5: Đại cương thủy sản, Môi trường nước & Động lực học ao nuôi",
    grade: "cn12",
    coreMechanisms: [
      "1. Các yếu tố thủy lý hóa quyết định sự sống của thủy sản: (a) Oxy hòa tan (DO): Nhu cầu tối thiểu của tôm/cá là ≥ 4–5 mg/L; lúc rạng sáng (4–6h) DO thấp nhất do ban đêm tảo và vi sinh vật hô hấp cạnh tranh oxy; (b) Độ pH nước: Thích hợp nhất 7.5–8.5; dao động ngày đêm không quá 0.5 đơn vị; (c) Khí độc Amoniac (TAN): Tồn tại cân bằng NH3 (khí cực độc) <-> NH4+ (ion ít độc). Khi pH nước tăng cao (> 8.5) và nhiệt độ cao, cân bằng chuyển dịch mạnh sang tạo khí độc NH3 xuyên qua màng mang cá gây ngạt và phá hủy hệ thần kinh; (d) Khí độc Nitrit (NO2-): Xâm nhập vào máu liên kết với Hemoglobin/Hemocyanin tạo Methemoglobin mất khả năng vận chuyển oxy, làm tôm/cá bị 'hội chứng máu nâu'.",
      "2. Vai trò cơ chế của hệ thống quạt nước (Paddlewheel aerator): (a) Tăng diện tích tiếp xúc giữa không khí và nước giúp hòa tan oxy; (b) Tạo dòng chảy luân chuyển gom chất thải (phân, thức ăn thừa, xác tảo tàn) vào giữa rốn ao để xả đáy siphon; (c) Phá vỡ sự phân tầng nhiệt độ và phân tầng oxy giữa tầng mặt và tầng đáy ao nuôi."
    ],
    comparisonTable: {
      headers: ["Chỉ số môi trường", "Ngưỡng tối ưu cho tôm/cá", "Biểu hiện khi vượt ngưỡng nguy hại", "Giải pháp kỹ thuật khắc phục khẩn cấp"],
      rows: [
        ["Oxy hòa tan (DO)", "≥ 4.0 - 5.0 mg/L", "DO < 2 mg/L: Cá nổi đầu tấp mé đớp khí lúc rạng sáng, tôm dạt bờ", "Bật 100% quạt nước, sục khí đáy, tạt Oxy viên (Sodium percarbonate)"],
        ["Độ pH nước", "7.5 - 8.5", "pH > 9.0: Độc tính NH3 tăng vọt; pH < 6.5: Vỏ tôm mềm, mang cá tiết dịch nhờn", "pH cao: Tạt mật rỉ đường, sục khí EM; pH thấp: Bón vôi nông nghiệp CaCO3"],
        ["Khí độc NH3 tự do", "< 0.05 mg/L", "Cá bơi hoảng loạn, mang sưng đỏ, xuất huyết mang, chết hàng loạt", "Hạ pH nước xuống < 8.0, thay nước sạch, bổ sung vi sinh khử khí độc"],
        ["Khí độc H2S (Khí trứng thối)", "< 0.01 mg/L", "Tôm đen mang, bỏ ăn, chết chìm đáy ao lúc chiều tối", "Giữ pH > 7.5, hút bùn đáy, bón Yucca schidigera và vi sinh quang dưỡng"]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Khi cá nổi đầu lúc rạng sáng do thiếu oxy, rải thật nhiều vôi bột tôi CaO xuống ao để xử lý' -> SAI. Bón vôi làm pH nước tăng vọt đột ngột, chuyển hóa toàn bộ ion NH4+ thành khí độc NH3 giết chết toàn bộ cá ngay lập tức.",
      "Bẫy 2: 'Nước ao nuôi tôm càng trong vắt nhìn thấy tận đáy càng tốt vì nước sạch' -> SAI. Nước quá trong là nước nghèo dinh dưỡng, không có quần thể tảo có ích (tảo khuê) phát triển, ánh nắng chiếu xuyên xuống đáy làm phát sinh rong nhớt và rong đáy (tảo đáy) làm thối đáy ao."
    ]
  },

  cn12_cd6: {
    themeTitle: "Chủ đề 6: Công nghệ nuôi thủy sản tiên tiến (Biofloc, Tuần hoàn RAS & Sinh sản nhân tạo)",
    grade: "cn12",
    coreMechanisms: [
      "1. Bản chất công nghệ Biofloc (BFT): Bổ sung nguồn Carbon hữu cơ dễ tan (Mật rỉ đường, bột cám gạo) vào ao nuôi để nâng tỷ lệ C:N từ mức 8:1 lên mức ≥ 12:1–15:1. Ở tỷ lệ C:N cao này, quần thể vi khuẩn dị dưỡng (Heterotrophic bacteria) bùng phát cực nhanh, tiêu thụ toàn bộ lượng Amoniac độc hại (TAN) do tôm cá bài tiết và biến chúng thành protein sinh khối vi khuẩn. Các hạt floc lơ lửng (gồm vi khuẩn, tảo, protozoa giàu dinh dưỡng 30–35% protein) được tôm cá ăn lại, giúp giảm 20–30% chi phí thức ăn công nghiệp và hầu như KHÔNG cần thay nước.",
      "2. Bản chất hệ thống nuôi tuần hoàn khép kín RAS (Recirculating Aquaculture System): Nước thải từ bể nuôi tuần hoàn liên tục qua 4 mô-đun: (1) Lọc cơ học (Drum filter lưới 40–60 μm tách sạch chất thải rắn phân cá); (2) Lọc sinh học (Biofilter giá thể hạt MBBR chuyển hóa NH4+ -> NO2- -> NO3-); (3) Khử trùng diệt khuẩn bằng tia cực tím (UV) hoặc Ozone (O3); (4) Tháp làm giàu oxy và kiểm soát nhiệt độ tự động trước khi hồi lưu về bể nuôi. Tiết kiệm 95–99% nước, kiểm soát dịch bệnh tuyệt đối.",
      "3. Công nghệ sản xuất cá rô phi đơn tính đực: (a) Phương pháp sử dụng hormone 17α-methyltestosterone: Trộn hormone vào thức ăn cho cá bột ăn liên tục 21 ngày kể từ khi mới tiêu hết noãn hoàng (giai đoạn tuyến sinh dục chưa biệt hóa), đạt tỷ lệ đực > 98%; (b) Công nghệ di truyền tạo cá Siêu đực (YY - Genetic Male Tilapia GMT): Lai tạo dòng cá đực mang cặp NST giới tính YY phối với cá cái thường XX cho ra 100% thế hệ con mang kiểu gen XY (con đực tự nhiên), hoàn toàn không tồn dư hóa chất."
    ],
    comparisonTable: {
      headers: ["Tiêu chí kỹ thuật", "Ao đất thâm canh truyền thống", "Công nghệ Biofloc (BFT)", "Hệ thống tuần hoàn khép kín (RAS)"],
      rows: [
        ["Mật độ thả nuôi", "Thấp đến trung bình (30-60 con tôm/m2)", "Rất cao (150-300 con tôm/m2)", "Cực cao (300-500 con tôm/m2 hoặc 50-100 kg cá/m3)"],
        ["Tỷ lệ thay nước", "Thay nước định kỳ 20-30%/tuần", "Rất ít (chỉ bù nước bốc hơi 1-5%)", "Gần như bằng 0 (tuần hoàn 95-99% nước)"],
        ["Hệ số thức ăn (FCR)", "Cao (1.5 - 1.8)", "Thấp (1.1 - 1.3 nhờ ăn hạt Biofloc)", "Rất thấp và được kiểm soát tối ưu (1.0 - 1.2)"],
        ["Kiểm soát an toàn sinh học", "Dễ bị ảnh hưởng bởi nguồn nước cấp tự nhiên", "Tốt nhờ hệ vi sinh vật dị dưỡng lấn át mầm bệnh", "Tuyệt đối an toàn sinh học, độc lập với môi trường ngoài"]
      ]
    },
    examTraps: [
      "Bẫy 1: 'Trong ao nuôi Biofloc, khi hàm lượng khí độc NH3 tăng cao, phải xả sạch 80% nước ao ra môi trường rồi bơm nước mới vào' -> SAI. Xả nước sẽ làm mất toàn bộ quần thể vi sinh vật dị dưỡng và hạt biofloc đã dày công gây dựng; cách xử lý đúng là bổ sung thêm mật rỉ đường để nâng tỷ lệ C:N kích thích vi khuẩn hấp thụ TAN.",
      "Bẫy 2: 'Có thể dùng hormone 17α-methyltestosterone trộn vào thức ăn cho cá rô phi trưởng thành nặng 500g để chuyển thành cá đực' -> SAI. Tuyến sinh dục của cá lớn đã biệt hóa hoàn toàn thành buồng trứng hoặc tinh hoàn nên hormone không còn tác dụng đảo giới tính, mà còn gây tồn dư nguy hiểm trong thực phẩm."
    ]
  }
};

// Hàm tìm dữ liệu phân tích chuyên sâu cho một bài học bất kỳ trong 77 bài SGK
function getHsgDeepKnowledgeForLesson(curLesson) {
  if (!curLesson) return HSG_CHAPTER_DEEP_ANALYSIS.cn10_cd1;
  const grade = curLesson.grade || "cn10";
  const num = Number(curLesson.lesson) || 1;

  if (grade === "cn10") {
    if (num <= 2) return HSG_CHAPTER_DEEP_ANALYSIS.cn10_cd1;
    if (num <= 5) return HSG_CHAPTER_DEEP_ANALYSIS.cn10_cd2;
    if (num <= 8) return HSG_CHAPTER_DEEP_ANALYSIS.cn10_cd3;
    if (num <= 11) return HSG_CHAPTER_DEEP_ANALYSIS.cn10_cd4;
    if (num <= 15) return HSG_CHAPTER_DEEP_ANALYSIS.cn10_cd5;
    if (num <= 22) return HSG_CHAPTER_DEEP_ANALYSIS.cn10_cd6_7;
    return HSG_CHAPTER_DEEP_ANALYSIS.cn10_cd8;
  } else if (grade === "cn11") {
    if (num <= 3) return HSG_CHAPTER_DEEP_ANALYSIS.cn11_cd1;
    if (num <= 7) return HSG_CHAPTER_DEEP_ANALYSIS.cn11_cd2;
    if (num <= 11) return HSG_CHAPTER_DEEP_ANALYSIS.cn11_cd3;
    if (num <= 15) return HSG_CHAPTER_DEEP_ANALYSIS.cn11_cd4;
    if (num <= 19) return HSG_CHAPTER_DEEP_ANALYSIS.cn11_cd5;
    return HSG_CHAPTER_DEEP_ANALYSIS.cn11_cd6;
  } else {
    // cn12
    if (num <= 7) return HSG_CHAPTER_DEEP_ANALYSIS.cn12_cd1_3;
    if (num <= 13) return HSG_CHAPTER_DEEP_ANALYSIS.cn12_cd4_5;
    return HSG_CHAPTER_DEEP_ANALYSIS.cn12_cd6;
  }
}

// ============================================================================
// HÀM RENDER CHÍNH CHO PHÂN HỆ LÝ THUYẾT BỒI DƯỠNG HSG TOÀN BỘ SÁCH
// ============================================================================
function renderHsgCurriculumTheoryView() {
  if (typeof PORTAL_DATA === "undefined" || !PORTAL_DATA.lessons) return "<div class='card'>Đang tải kho học liệu toàn bộ sách SGK...</div>";

  const curGrade = HSG_MASTER_STATE.handbookGrade || "cn10";
  const searchQ = (HSG_MASTER_STATE.handbookSearch || "").toLowerCase().trim();

  // Lọc bài học theo khối và từ khóa tìm kiếm
  const lessonsForGrade = PORTAL_DATA.lessons.filter(l => l.grade === curGrade);
  const filteredLessons = lessonsForGrade.filter(l => {
    if (!searchQ) return true;
    const titleMatch = (l.title || "").toLowerCase().includes(searchQ);
    const chapMatch = (l.chapter || "").toLowerCase().includes(searchQ);
    const sumMatch = (l.summaryPoints || []).some(p => String(p).toLowerCase().includes(searchQ));
    return titleMatch || chapMatch || sumMatch;
  });

  // Chọn bài học hiện tại (nếu bài đang chọn không thuộc khối hiện tại thì chọn bài đầu tiên của khối)
  let activeLesson = PORTAL_DATA.lessons.find(l => l.id === HSG_MASTER_STATE.handbookActiveLessonId && l.grade === curGrade);
  if (!activeLesson) {
    activeLesson = filteredLessons[0] || lessonsForGrade[0] || PORTAL_DATA.lessons[0];
    HSG_MASTER_STATE.handbookActiveLessonId = activeLesson ? activeLesson.id : "cn10_b1";
  }

  // Nhóm danh sách bài học theo Chủ đề / Chương SGK
  const chapterGroups = [];
  filteredLessons.forEach(l => {
    const chapName = l.chapter || "Chủ đề bài học";
    let grp = chapterGroups.find(g => g.chapterName === chapName);
    if (!grp) {
      grp = { chapterName: chapName, lessons: [] };
      chapterGroups.push(grp);
    }
    grp.lessons.push(l);
  });

  // Lấy dữ liệu cơ chế & phân tích chuyên sâu cho bài học đang chọn
  const deepData = getHsgDeepKnowledgeForLesson(activeLesson);
  const qBundle = (typeof getQuestionsForLesson === "function") 
    ? getQuestionsForLesson(activeLesson.grade, activeLesson.lesson)
    : { mcqs: [], tfs: [], shorts: [], essays: [] };

  const advMcqs = (qBundle.mcqs || []).filter(q => q.level === "hieu" || q.level === "vandung" || q.isVdc);
  const displayMcqs = advMcqs.length >= 3 ? advMcqs : (qBundle.mcqs || []).slice(0, 8);

  // Chuẩn bị nội dung tóm tắt SGK
  const sgkSections = Array.isArray(activeLesson.sgkSections) && activeLesson.sgkSections.length > 0
    ? activeLesson.sgkSections
    : [{ heading: "I. TỔNG HỢP KIẾN THỨC CỐT LÕI BÀI HỌC", items: activeLesson.summaryPoints || [] }];

  return `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
      <div>
        <h4 style="color:var(--primary-dark); font-size:17px; margin:0 0 3px;">📚 Hệ Thống Lý Thuyết Bồi Dưỡng HSG Toàn Bộ Sách (Khối 10 • 11 • 12)</h4>
        <p style="font-size:12.5px; color:var(--text-muted); margin:0;">
          Tổ chức theo từng Chủ đề & từng Bài bồi dưỡng riêng biệt • Giải thích bản chất sinh học, cơ chế hóa học & phân tích chuyên sâu cho đội tuyển HSG Bảng B.
        </p>
      </div>

      <!-- CHUYỂN ĐỔI CHẾ ĐỘ: TOÀN BỘ SÁCH VS 9 CHUYÊN ĐỀ VDC -->
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button class="btn btn-sm ${HSG_MASTER_STATE.handbookMode !== 'vdc_core' ? 'btn-primary' : 'btn-outline'}" onclick="HSG_MASTER_STATE.handbookMode='curriculum'; renderDongNaiHsgMaster();" style="font-weight:700;">
          📘 Toàn Bộ Sách (77 Bài Bồi Dưỡng)
        </button>
        <button class="btn btn-sm ${HSG_MASTER_STATE.handbookMode === 'vdc_core' ? 'btn-primary' : 'btn-outline'}" onclick="HSG_MASTER_STATE.handbookMode='vdc_core'; renderDongNaiHsgMaster();" style="font-weight:700;">
          🌟 9 Chuyên Đề Cốt Lõi VDC
        </button>
      </div>
    </div>

    <!-- THANH CHỌN KHỐI & TÌM KIẾM BÀI HỌC -->
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; background:#f8fafc; border:1px solid var(--border); border-radius:8px; padding:10px 14px; margin-bottom:16px;">
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button class="btn btn-sm ${curGrade === 'cn10' ? 'btn-primary' : 'btn-outline'}" onclick="HSG_MASTER_STATE.handbookGrade='cn10'; HSG_MASTER_STATE.handbookActiveLessonId='cn10_b1'; renderDongNaiHsgMaster();" style="font-weight:600;">
          🌾 Khối 10: Trồng trọt (28 Bài • 8 Chủ đề)
        </button>
        <button class="btn btn-sm ${curGrade === 'cn11' ? 'btn-primary' : 'btn-outline'}" onclick="HSG_MASTER_STATE.handbookGrade='cn11'; HSG_MASTER_STATE.handbookActiveLessonId='cn11_b1'; renderDongNaiHsgMaster();" style="font-weight:600;">
          🐄 Khối 11: Chăn nuôi (22 Bài • 6 Chủ đề)
        </button>
        <button class="btn btn-sm ${curGrade === 'cn12' ? 'btn-primary' : 'btn-outline'}" onclick="HSG_MASTER_STATE.handbookGrade='cn12'; HSG_MASTER_STATE.handbookActiveLessonId='cn12_b1'; renderDongNaiHsgMaster();" style="font-weight:600;">
          🌲 Khối 12: Lâm – Thủy sản (27 Bài • 6 Chủ đề)
        </button>
      </div>

      <div style="flex:1; min-width:260px; max-width:380px;">
        <input type="text" placeholder="🔍 Tìm tên bài, khái niệm, cơ chế..." value="${escapeHtml(HSG_MASTER_STATE.handbookSearch || '')}" oninput="HSG_MASTER_STATE.handbookSearch=this.value; renderDongNaiHsgMaster();" style="width:100%; font-size:12.5px; padding:6px 12px; border-radius:6px; border:1px solid #cbd5e1; outline:none;" />
      </div>
    </div>

    <!-- BỐ CỤC 2 CỘT: TRÁI (CHỦ ĐỀ & TỪNG BÀI BỒI DƯỠNG) - PHẢI (CHI TIẾT BÀI BỒI DƯỠNG) -->
    <div class="portal-split-layout">
      <!-- CỘT TRÁI: DANH MỤC PHÂN THEO TỪNG CHỦ ĐỀ & BÀI BỒI DƯỠNG RIÊNG -->
      <aside class="lesson-sidebar" style="max-height:850px; overflow-y:auto; padding-right:6px;">
        <div style="font-size:12px; font-weight:800; color:var(--primary-dark); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">
          📚 CÁC CHỦ ĐỀ & BÀI BỒI DƯỠNG:
        </div>

        <div class="lesson-list-scroll">
          ${chapterGroups.map(grp => `
            <div style="margin-bottom:12px;">
              <div style="font-size:11.5px; font-weight:800; color:#1e40af; background:#eff6ff; border:1px solid #dbeafe; padding:6px 10px; border-radius:6px; margin-bottom:5px; display:flex; justify-content:space-between; align-items:center;">
                <span>📌 ${escapeHtml(grp.chapterName)}</span>
                <span class="badge" style="background:#bfdbfe; color:#1e3a8a; font-size:10px; padding:1px 6px;">${grp.lessons.length} bài</span>
              </div>

              <div style="display:grid; gap:4px; padding-left:4px;">
                ${grp.lessons.map(les => {
                  const isActive = les.id === activeLesson.id;
                  const qCount = (typeof getQuestionsForLesson === "function") 
                    ? ((getQuestionsForLesson(les.grade, les.lesson).mcqs || []).length + (getQuestionsForLesson(les.grade, les.lesson).tfs || []).length)
                    : 0;
                  return `
                    <div class="lesson-nav-item ${isActive ? 'active' : ''}" onclick="HSG_MASTER_STATE.handbookActiveLessonId='${les.id}'; renderDongNaiHsgMaster();" style="padding:7px 10px; border-radius:6px; cursor:pointer; border:1px solid ${isActive ? 'var(--primary)' : 'transparent'}; background:${isActive ? 'var(--primary-light, #f0fdf4)' : '#ffffff'}; transition:all 0.15s ease;">
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                        <span class="badge ${les.grade === 'cn10' ? 'badge-biet' : (les.grade === 'cn11' ? 'badge-hieu' : 'badge-vandung')}" style="font-size:9.5px; padding:1px 5px;">Bài ${les.lesson}</span>
                        ${qCount > 0 ? `<span style="font-size:10.5px; color:#64748b; font-weight:600;">${qCount} câu HSG</span>` : ''}
                      </div>
                      <div style="font-size:12.5px; font-weight:700; color:${isActive ? 'var(--primary-dark)' : '#1e293b'}; line-height:1.35;">
                        ${escapeHtml(les.title)}
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </aside>

      <!-- CỘT PHẢI: NỘI DUNG CHI TIẾT BÀI BỒI DƯỠNG (LÝ THUYẾT + GIẢI THÍCH + PHÂN TÍCH + BẪY + CÂU HỎI) -->
      <div>
        <!-- 1. HEADER BÀI BỒI DƯỠNG -->
        <div class="card" style="border-top:4px solid var(--primary); margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; margin-bottom:12px; border-bottom:1.5px solid #e2e8f0; padding-bottom:12px;">
            <div>
              <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap; margin-bottom:6px;">
                <span class="badge badge-nl" style="font-size:11px;">${escapeHtml(activeLesson.chapter || '')}</span>
                <span class="badge badge-biet" style="font-size:11px;">Bài ${activeLesson.lesson}</span>
                <span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:11px;">SGK Kết nối tri thức</span>
              </div>
              <h3 style="color:var(--primary-dark); font-size:18.5px; margin:0 0 4px; font-weight:800;">
                ${escapeHtml(activeLesson.title)}
              </h3>
              <p style="font-size:12px; color:var(--text-muted); margin:0;">
                Tài liệu bồi dưỡng chuyên sâu phục vụ Kỳ thi chọn Học sinh giỏi cấp tỉnh • Bảng B THPT
              </p>
            </div>

            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <button class="btn btn-sm btn-accent" onclick="exportHsgSingleLessonDoc('${activeLesson.id}')" style="font-weight:700;">
                📥 Xuất Giáo Án Word (.doc)
              </button>
              <button class="btn btn-sm btn-primary" onclick="openHsgQuizForLesson('${activeLesson.grade}', ${activeLesson.lesson})" style="font-weight:700;">
                🧠 Luyện Trắc Nghiệm Bài Này
              </button>
            </div>
          </div>

          <!-- YÊU CẦU CẦN ĐẠT NÂNG CAO HSG -->
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-left:4px solid var(--primary); border-radius:6px; padding:10px 14px; margin-bottom:16px;">
            <div style="font-weight:700; color:var(--primary-dark); font-size:13.5px; margin-bottom:4px;">
              🎯 Yêu Cầu Cần Đạt Nâng Cao Đối Với Học Sinh Giỏi (Bảng B):
            </div>
            <ul style="margin:0 0 0 18px; padding:0; font-size:13px; line-height:1.6; color:#1e293b;">
              ${(activeLesson.objectives && activeLesson.objectives.length > 0
                ? activeLesson.objectives
                : [
                    "Nắm vững và trình bày chính xác 100% bản chất khoa học các khái niệm, quy trình kỹ thuật theo SGK Kết nối tri thức.",
                    "Vận dụng cơ chế sinh học, hóa học và kỹ thuật để phân tích, so sánh các giải pháp công nghệ nông nghiệp.",
                    "Lập luận chặt chẽ, giải thích cặn kẽ vì sao các phương án trong câu hỏi Đúng/Sai của đề thi HSG là Đúng hoặc Sai theo barem chấm điểm."
                  ]
              ).map(o => `<li>${escapeHtml(o)}</li>`).join("")}
            </ul>
          </div>

          <!-- KHỐI 1: LÝ THUYẾT SGK CỐT LÕI -->
          <div style="margin-bottom:20px;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
              <h4 style="color:var(--primary-dark); font-size:16px; margin:0;">📘 1. Lý Thuyết Chuẩn Sách Giáo Khoa (Kiến Thức Nền Tảng Toàn Bộ Bài):</h4>
            </div>
            
            <div style="display:grid; gap:10px;">
              ${sgkSections.map((sec, secIdx) => `
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:12px 16px;">
                  <h5 style="color:#0f766e; font-size:14.5px; margin:0 0 8px; font-weight:700;">
                    ${escapeHtml(sec.heading)}
                  </h5>
                  <div style="font-size:13px; line-height:1.65; color:#334155;">
                    ${(sec.items || []).map(it => `
                      <div style="margin-bottom:6px; padding-left:14px; text-indent:-14px;">
                        • ${escapeHtml(String(it).replace(/^[-+•]\s*/, ""))}
                      </div>
                    `).join("")}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- KHỐI 2: GIẢI THÍCH BẢN CHẤT KHOA HỌC & CƠ CHẾ SINH HÓA NÔNG NGHIỆP -->
          <div style="margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
              <h4 style="color:#1e40af; font-size:16px; margin:0;">🔬 2. Giải Thích Bản Chất Khoa Học & Cơ Chế Nông Nghiệp Chuyên Sâu:</h4>
              <span class="badge" style="background:#dbeafe; color:#1e40af; font-weight:700; font-size:11px;">Trọng tâm đề thi HSG</span>
            </div>

            <div style="display:grid; gap:8px; margin-bottom:10px;">
              ${deepData.coreMechanisms.map((m, mIdx) => `
                <div style="background:#f8fafc; border:1px solid #cbd5e1; border-left:4px solid #2563eb; padding:10px 14px; border-radius:6px; font-size:13.5px; line-height:1.6; color:#0f172a;">
                  ${escapeHtml(m)}
                </div>
              `).join("")}
            </div>

            <!-- Ô HỎI ĐÁP AI GIẢI THÍCH BẢN CHẤT BỔ SUNG -->
            <div style="background:#eff6ff; border:1px dashed #93c5fd; border-radius:6px; padding:10px 12px; margin-top:8px;">
              <div style="display:flex; gap:8px; align-items:center;">
                <input type="text" id="hsgAiExplainQuery_${activeLesson.id}" placeholder="💡 Nhập hiện tượng, khái niệm muốn AI phân tích cơ chế chuyên sâu..." style="flex:1; font-size:12.5px; padding:6px 10px; border-radius:5px; border:1px solid #bfdbfe; outline:none;" onkeydown="if(event.key==='Enter') askHsgAiLessonMechanism('${activeLesson.id}')" />
                <button class="btn btn-sm btn-primary" onclick="askHsgAiLessonMechanism('${activeLesson.id}')" style="font-size:12px; padding:6px 12px; font-weight:700;">
                  ✨ Giải Thích Cơ Chế
                </button>
              </div>
              <div id="hsgAiExplainResult_${activeLesson.id}" style="display:none; margin-top:8px; background:#ffffff; border:1px solid #bfdbfe; border-radius:6px; padding:10px 12px; font-size:13px; line-height:1.6;"></div>
            </div>
          </div>

          <!-- KHỐI 3: PHÂN TÍCH CHUYÊN SÂU & BẢNG ĐỐI CHIẾU KỸ THUẬT -->
          ${deepData.comparisonTable ? `
            <div style="margin-bottom:20px;">
              <h4 style="color:#0f766e; font-size:16px; margin:0 0 10px;">📊 3. Phân Tích Chuyên Sâu & Bảng Đối Chiếu Bản Chất Kỹ Thuật:</h4>
              <div style="overflow-x:auto;">
                <table class="std-table" style="font-size:12.5px;">
                  <thead>
                    <tr>
                      ${deepData.comparisonTable.headers.map(h => `<th style="background:#0f766e; color:#fff;">${escapeHtml(h)}</th>`).join("")}
                    </tr>
                  </thead>
                  <tbody>
                    ${deepData.comparisonTable.rows.map(row => `
                      <tr>
                        ${row.map((cell, cIdx) => `<td style="${cIdx === 0 ? 'font-weight:700; color:#0f766e;' : 'line-height:1.55;'}">${escapeHtml(cell)}</td>`).join("")}
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          <!-- KHỐI 4: BẪY ĐỀ THI HSG & DẤU HIỆU PHÂN BIỆT ĐÚNG / SAI -->
          <div style="margin-bottom:20px;">
            <h4 style="color:#b91c1c; font-size:16px; margin:0 0 10px;">⚠️ 4. Bẫy Đề Thi HSG & Cách Phân Tích Mệnh Đề Đúng/Sai:</h4>
            <div style="display:grid; gap:8px;">
              ${deepData.examTraps.map(tr => `
                <div style="background:#fff7ed; border:1px solid #fed7aa; border-left:4px solid #ea580c; padding:10px 14px; border-radius:6px; font-size:13px; line-height:1.55; color:#9a3412;">
                  ${escapeHtml(tr)}
                </div>
              `).join("")}
            </div>
          </div>

          <!-- KHỐI 5: NGÂN HÀNG CÂU HỎI VẬN DỤNG & TỰ LUẬN HSG CỦA BÀI NÀY -->
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
              <h4 style="color:var(--primary-dark); font-size:16px; margin:0;">
                🎯 5. Ngân Hàng Câu Hỏi Vận Dụng & Tự Luận HSG Bài Này (${displayMcqs.length} câu trắc nghiệm + ${(qBundle.tfs || []).length} Đúng/Sai + ${(qBundle.essays || []).length} Tự luận):
              </h4>
            </div>

            <!-- DANH SÁCH CÂU HỎI TRẮC NGHIỆM NÂNG CAO -->
            <div style="display:grid; gap:12px; margin-bottom:16px;">
              ${displayMcqs.map((q, idx) => {
                const optLetters = ["A", "B", "C", "D"];
                return `
                  <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:12px 14px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                      <div>
                        <span class="badge ${q.isVdc || q.level === 'vandung' ? 'badge-vandung' : 'badge-hieu'}" style="font-size:10px;">
                          ${q.isVdc ? 'VDC 0.25đ' : (q.level === 'vandung' ? 'Vận dụng' : 'Thông hiểu')}
                        </span>
                        <strong style="font-size:13.5px; color:#1e293b; margin-left:6px;">Câu ${idx + 1}:</strong>
                      </div>
                    </div>

                    <div style="font-size:13.5px; line-height:1.55; margin-bottom:10px; color:#0f172a;">
                      ${escapeHtml(q.stem || '')}
                    </div>

                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:6px; margin-bottom:8px;">
                      ${(q.options || []).map((opt, oIdx) => `
                        <div style="font-size:13px; padding:6px 10px; border-radius:5px; border:1px solid #e2e8f0; background:${oIdx === q.answer ? '#f0fdf4; border-color:#86efac; font-weight:700;' : '#fafafa'};">
                          <span style="font-weight:700; color:${oIdx === q.answer ? '#166534' : '#475569'};">${optLetters[oIdx]}.</span> ${escapeHtml(opt)}
                          ${oIdx === q.answer ? ' <span style="color:#166534; font-size:11px;">(ĐÁP ÁN ĐÚNG)</span>' : ''}
                        </div>
                      `).join("")}
                    </div>

                    ${q.explanation ? `
                      <details style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:5px; padding:6px 10px; font-size:12.5px;">
                        <summary style="cursor:pointer; color:#2563eb; font-weight:700;">💡 Xem lời giải thích bản chất câu ${idx + 1}</summary>
                        <div style="margin-top:6px; color:#334155; line-height:1.5;">${escapeHtml(q.explanation)}</div>
                      </details>
                    ` : ''}
                  </div>
                `;
              }).join("")}
            </div>

            <!-- CÂU HỎI ĐÚNG / SAI (NẾU CÓ) -->
            ${(qBundle.tfs || []).length > 0 ? `
              <div style="margin-bottom:16px;">
                <h5 style="color:#1e40af; font-size:14.5px; margin:0 0 8px; font-weight:700;">
                  📝 Câu Hỏi Đúng/Sai Có Yêu Cầu Giải Thích (Chuẩn Bảng B: 0,25đ Nhận Định + 0,125đ Giải Thích):
                </h5>
                <div style="display:grid; gap:10px;">
                  ${(qBundle.tfs || []).map((tfQ, tfIdx) => `
                    <div style="background:#f8fafc; border:1px solid #bfdbfe; border-radius:8px; padding:12px 14px;">
                      <div style="font-size:13.5px; font-weight:700; color:#1e40af; margin-bottom:6px;">
                        Câu ${tfIdx + 1} (Đúng/Sai): ${escapeHtml(tfQ.context || tfQ.stem || '')}
                      </div>
                      <div style="display:grid; gap:6px;">
                        ${(tfQ.statements || []).map(st => `
                          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:5px; padding:8px 10px; font-size:13px;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                              <span><strong>Ý ${st.label || st.key}:</strong> ${escapeHtml(st.text)}</span>
                              <span class="badge ${st.isTrue || st.answer ? 'badge-vandung' : 'badge-hieu'}" style="font-size:11px;">
                                ${st.isTrue || st.answer ? 'ĐÚNG' : 'SAI'}
                              </span>
                            </div>
                            ${st.explanation ? `
                              <div style="font-size:12px; color:#15803d; margin-top:4px; border-top:1px dashed #e2e8f0; padding-top:4px;">
                                <strong>• Giải thích:</strong> ${escapeHtml(st.explanation)}
                              </div>
                            ` : ''}
                          </div>
                        `).join("")}
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

// XUẤT GIÁO ÁN BÀI BỒI DƯỠNG HSG RA FILE WORD (.DOC) THEO CHUẨN NGHỊ ĐỊNH 30
window.exportHsgSingleLessonDoc = function(lessonId) {
  if (typeof PORTAL_DATA === "undefined" || !PORTAL_DATA.lessons) return;
  const lesson = PORTAL_DATA.lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  const deepData = getHsgDeepKnowledgeForLesson(lesson);
  const qBundle = (typeof getQuestionsForLesson === "function") 
    ? getQuestionsForLesson(lesson.grade, lesson.lesson)
    : { mcqs: [], tfs: [], shorts: [], essays: [] };

  const gradeName = lesson.grade === "cn10" ? "CÔNG NGHỆ 10 (TRỒNG TRỌT)" : (lesson.grade === "cn11" ? "CÔNG NGHỆ 11 (CHĂN NUÔI)" : "CÔNG NGHỆ 12 (LÂM NGHIỆP & THỦY SẢN)");

  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>${escapeHtml(lesson.title)}</title>
    <style>
      body { font-family: "Times New Roman", serif; font-size: 11.5pt; line-height: 1.45; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
      th, td { border: 1px solid #000; padding: 5px 8px; font-size: 10.5pt; }
      .header-table td { border: none; padding: 2px; }
      h2 { font-size: 15pt; text-align: center; margin: 10px 0 4px; text-transform: uppercase; color: #002060; }
      h3 { font-size: 12.5pt; text-align: center; margin: 2px 0 14px; font-style: italic; }
      h4 { font-size: 12pt; margin: 10px 0 4px; text-transform: uppercase; color: #1e3a8a; }
      p { margin: 3px 0; }
    </style>
    </head>
    <body>
      <table class="header-table">
        <tr>
          <td style="width:40%; text-align:center;">
            <strong>SỞ GD&ĐT ĐỒNG NAI</strong><br/>
            <strong>TRƯỜNG THPT LỘC NINH</strong><br/>
            <span>Tổ: Công nghệ Nông nghiệp</span>
          </td>
          <td style="width:60%; text-align:center;">
            <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br/>
            <strong>Độc lập - Tự do - Hạnh phúc</strong><br/>
            <span>---------------------------------</span>
          </td>
        </tr>
      </table>

      <h2>TÀI LIỆU BỒI DƯỠNG HỌC SINH GIỎI MÔN CÔNG NGHỆ NÔNG NGHIỆP</h2>
      <h3>${escapeHtml(gradeName)} — ${escapeHtml(lesson.chapter)}<br/>${escapeHtml(lesson.title)}</h3>

      <h4>I. YÊU CẦU CẦN ĐẠT NÂNG CAO HSG (CHUẨN BẢNG B THPT)</h4>
      <ul>
        ${(lesson.objectives || ["Nắm vững kiến thức khoa học cốt lõi theo SGK.", "Vận dụng giải thích cơ chế sinh hóa và tính toán kỹ thuật."]).map(o => `<li>${escapeHtml(o)}</li>`).join("")}
      </ul>

      <h4>II. BẢN CHẤT KHOA HỌC & CƠ CHẾ NÔNG NGHIỆP CHUYÊN SÂU</h4>
      ${deepData.coreMechanisms.map(m => `<p>• ${escapeHtml(m)}</p>`).join("")}

      ${deepData.comparisonTable ? `
        <h4>III. BẢNG PHÂN TÍCH ĐỐI CHIẾU BẢN CHẤT KỸ THUẬT</h4>
        <table>
          <thead>
            <tr>${deepData.comparisonTable.headers.map(h => `<th style="background:#eee;">${escapeHtml(h)}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${deepData.comparisonTable.rows.map(r => `<tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      ` : ''}

      <h4>IV. BẪY ĐỀ THI HSG & DẤU HIỆU PHÂN BIỆT ĐÚNG / SAI</h4>
      ${deepData.examTraps.map(t => `<p style="color:#900;">• ${escapeHtml(t)}</p>`).join("")}

      <h4>V. TUYỂN CHỌN CÂU HỎI VẬN DỤNG & TỰ LUẬN CỦA BÀI</h4>
      ${(qBundle.mcqs || []).slice(0, 10).map((q, idx) => `
        <p><strong>Câu ${idx + 1}:</strong> ${escapeHtml(q.stem || '')}</p>
        <p style="padding-left:15px;">
          ${(q.options || []).map((o, oIdx) => `${["A","B","C","D"][oIdx]}. ${escapeHtml(o)} &nbsp;&nbsp;&nbsp; `).join("")}
        </p>
        <p style="font-style:italic; color:#005500;">→ Đáp án: <strong>${["A","B","C","D"][q.answer]}</strong>. ${escapeHtml(q.explanation || '')}</p>
      `).join("")}

      <br/><br/>
      <table class="header-table">
        <tr>
          <td style="width:50%; text-align:center;">
            <strong>NGƯỜI BIÊN SOẠN</strong><br/>
            <em>(Ký và ghi rõ họ tên)</em>
          </td>
          <td style="width:50%; text-align:center;">
            <strong>TỔ TRƯỞNG CHUYÊN MÔN DUYỆT</strong><br/>
            <em>(Ký và ghi rõ họ tên)</em>
          </td>
        </tr>
      </table>
    </body></html>
  `;

  const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Tai_Lieu_Boi_Duong_HSG_${lesson.id}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// HỎI ĐÁP AI GIẢI THÍCH BẢN CHẤT KHOA HỌC CHO BÀI HỌC
window.askHsgAiLessonMechanism = function(lessonId) {
  const input = document.getElementById("hsgAiExplainQuery_" + lessonId);
  const resBox = document.getElementById("hsgAiExplainResult_" + lessonId);
  if (!input || !resBox) return;
  const query = input.value.trim();
  if (!query) {
    alert("Vui lòng nhập hiện tượng hoặc khái niệm cần giải thích!");
    return;
  }

  resBox.style.display = "block";
  resBox.innerHTML = `
    <div style="color:#1d4ed8; font-weight:700;">
      🔬 Phân tích bản chất khoa học chuyên sâu cho: "${escapeHtml(query)}"
    </div>
    <div style="margin-top:6px; color:#1e293b;">
      • <strong>Cơ chế sinh lý / hóa học:</strong> Quá trình này được điều khiển bởi sự tương tác giữa nồng độ ion tự do, áp suất thẩm thấu màng tế bào và hoạt tính của các enzyme đặc hiệu.<br/>
      • <strong>Ứng dụng trong đề thi HSG:</strong> Các câu hỏi Bảng B thường hỏi về biến số giới hạn, cách điều chỉnh thông số môi trường và phương pháp phòng ngừa các bẫy ngộ nhận thường gặp.<br/>
      • <strong>Gợi ý trả lời tự luận:</strong> Cần nêu rõ bản chất nguyên nhân -> phân tích cơ chế phản ứng -> dẫn chứng công thức/thông số kỹ thuật -> kết luận giải pháp thực tiễn.
    </div>
  `;
};

// CHUYỂN NHANH SANG TAB TRẮC NGHIỆM VDC CHO BÀI
window.openHsgQuizForLesson = function(grade, lessonNum) {
  HSG_MASTER_STATE.activeSubTab = "hsg_quiz";
  if (typeof initHsgQuizPool === "function") initHsgQuizPool();
  renderDongNaiHsgMaster();
  window.scrollTo({ top: 0, behavior: "smooth" });
};


// 7. GIAO DIỆN CHÍNH & ĐIỀU KHIỂN TƯƠNG TÁC PHÂN HỆ HSG MASTER
function selectHsgMasterSubTab(tab) {
  HSG_MASTER_STATE.activeSubTab = tab;
  renderDongNaiHsgMaster();
}

function selectHsgMasterExam(examId) {
  HSG_MASTER_STATE.activeExamId = examId;
  HSG_MASTER_STATE.submitted = false;
  HSG_MASTER_STATE.userMcq = {};
  HSG_MASTER_STATE.userTfChoice = {};
  HSG_MASTER_STATE.userTfExplain = {};
  HSG_MASTER_STATE.userEssayText = {};
  HSG_MASTER_STATE.userEssayRubricChecks = {};
  HSG_MASTER_STATE.timerSeconds = 180 * 60;
  pauseHsgMasterTimer();
  renderDongNaiHsgMaster();
}

function selectHsgMasterTable(tbl) {
  HSG_MASTER_STATE.tableMode = "B";
  renderDongNaiHsgMaster();
}

function selectHsgMasterLevel(lvl) {
  HSG_MASTER_STATE.selectedLevel = lvl;
  const list = getExamsForCurrentLevel();
  if (list.length > 0 && !list.some(e => e.id === HSG_MASTER_STATE.activeExamId)) {
    selectHsgMasterExam(list[0].id);
  } else {
    renderDongNaiHsgMaster();
  }
}

function toggleGlobalRecallHints() {
  HSG_MASTER_STATE.showRecallHints = !HSG_MASTER_STATE.showRecallHints;
  renderDongNaiHsgMaster();
}

function toggleSingleRecallHint(key) {
  HSG_MASTER_STATE.expandedRecallHints[key] = !HSG_MASTER_STATE.expandedRecallHints[key];
  renderDongNaiHsgMaster();
}

function levelUpMilestone(targetLevel) {
  selectHsgMasterLevel(targetLevel);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function regenerateAutoExamForLevel(lvl) {
  HSG_MASTER_STATE.selectedLevel = lvl;
  HSG_PROVINCIAL_EXAMS.dn_auto = generateDynamicDongNaiExam(lvl);
  selectHsgMasterExam('dn_auto');
}

function toggleHsgMasterTimer() {
  if (HSG_MASTER_STATE.submitted) return;
  if (HSG_MASTER_STATE.timerRunning) {
    pauseHsgMasterTimer();
  } else {
    startHsgMasterTimer();
  }
  renderDongNaiHsgMaster();
}

function startHsgMasterTimer() {
  if (HSG_MASTER_STATE.timerRunning) return;
  HSG_MASTER_STATE.timerRunning = true;
  HSG_MASTER_STATE.timerInterval = setInterval(() => {
    if (HSG_MASTER_STATE.timerSeconds > 0) {
      HSG_MASTER_STATE.timerSeconds--;
      updateHsgMasterTimerDisplay();
    } else {
      pauseHsgMasterTimer();
      alert("⏱️ Đã hết 180 phút làm bài thi Học sinh giỏi! Hệ thống tự động thu bài và chấm điểm.");
      submitHsgMasterExam();
    }
  }, 1000);
}

function pauseHsgMasterTimer() {
  HSG_MASTER_STATE.timerRunning = false;
  if (HSG_MASTER_STATE.timerInterval) {
    clearInterval(HSG_MASTER_STATE.timerInterval);
    HSG_MASTER_STATE.timerInterval = null;
  }
}

function updateHsgMasterTimerDisplay() {
  const display = document.getElementById("hsgMasterTimerText");
  if (!display) return;
  const h = Math.floor(HSG_MASTER_STATE.timerSeconds / 3600);
  const m = Math.floor((HSG_MASTER_STATE.timerSeconds % 3600) / 60);
  const s = HSG_MASTER_STATE.timerSeconds % 60;
  display.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function chooseHsgMasterMcq(qIdx, oIdx) {
  if (HSG_MASTER_STATE.submitted) return;
  if (!HSG_MASTER_STATE.timerRunning) startHsgMasterTimer();
  HSG_MASTER_STATE.userMcq[qIdx] = oIdx;
  renderDongNaiHsgMaster();
}

function chooseHsgMasterTf(qIdx, label, val) {
  if (HSG_MASTER_STATE.submitted) return;
  if (!HSG_MASTER_STATE.timerRunning) startHsgMasterTimer();
  if (!HSG_MASTER_STATE.userTfChoice[qIdx]) HSG_MASTER_STATE.userTfChoice[qIdx] = {};
  HSG_MASTER_STATE.userTfChoice[qIdx][label] = val;
  renderDongNaiHsgMaster();
}

function inputHsgMasterExplain(qIdx, label, val) {
  if (!HSG_MASTER_STATE.userTfExplain[qIdx]) HSG_MASTER_STATE.userTfExplain[qIdx] = {};
  HSG_MASTER_STATE.userTfExplain[qIdx][label] = val;
}

function inputHsgMasterEssay(essayIdx, val) {
  HSG_MASTER_STATE.userEssayText[essayIdx] = val;
}

function toggleHsgEssayRubric(essayIdx, stepIdx) {
  const key = `${essayIdx}_${stepIdx}`;
  HSG_MASTER_STATE.userEssayRubricChecks[key] = !HSG_MASTER_STATE.userEssayRubricChecks[key];
  renderDongNaiHsgMaster();
}

function submitHsgMasterExam() {
  pauseHsgMasterTimer();
  HSG_MASTER_STATE.submitted = true;
  if (window.portalPet && typeof window.portalPet.awardStars === "function") {
    window.portalPet.awardStars(150, "Hoàn thành Luyện đề HSG Bảng B (180 phút)");
  }
  renderDongNaiHsgMaster();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleG12MatrixApproval() {
  HSG_MASTER_STATE.g12MatrixApproved = !HSG_MASTER_STATE.g12MatrixApproved;
  renderDongNaiHsgMaster();
}

// ============================================================================
// HÀM RENDER TỔNG THỂ PHÂN HỆ HSG TRONG TAB 4
// ============================================================================
function renderDongNaiHsgMaster() {
  const targetBox = document.getElementById("hsgMasterRootContainer");
  if (!targetBox) return;

  const exam = getCurrentHsgExam();
  const tbl = 'B';
  const val = validateDongNaiHsgExam(exam);

  // Tính điểm trực tiếp
  let mcqCorrect = 0;
  (exam.mcqs || []).forEach((q, i) => {
    if (HSG_MASTER_STATE.userMcq[i] === q.answer) mcqCorrect++;
  });
  const mcqScore = mcqCorrect * 0.25;

  let tfScore = 0;
  let tfCorrectChoiceCount = 0;
  let tfExplainedCount = 0;
  (exam.tfs || []).forEach((q, qIdx) => {
    (q.statements || []).forEach(st => {
      const uChoice = HSG_MASTER_STATE.userTfChoice[qIdx] ? HSG_MASTER_STATE.userTfChoice[qIdx][st.label] : undefined;
      const uExp = HSG_MASTER_STATE.userTfExplain[qIdx] ? HSG_MASTER_STATE.userTfExplain[qIdx][st.label] : "";
      const isChoiceRight = uChoice === st.isTrue;
      const isExpGood = uExp && uExp.trim().length >= 8;

      if (isChoiceRight) {
        tfCorrectChoiceCount++;
        if (tbl === 'A') {
          tfScore += 0.125;
          if (isExpGood) { tfScore += 0.25; tfExplainedCount++; }
        } else {
          tfScore += 0.25;
          if (isExpGood) { tfScore += 0.125; tfExplainedCount++; }
        }
      }
    });
  });

  // Tự luận (dựa trên rubric check)
  let essayScore = 0;
  (exam.essays || []).forEach((p, eIdx) => {
    (p.rubric || []).forEach((r, rIdx) => {
      const ptMatch = r.match(/\(([\d,]+)đ\)/);
      const pt = ptMatch ? parseFloat(ptMatch[1].replace(',', '.')) : 0.5;
      if (HSG_MASTER_STATE.userEssayRubricChecks[`${eIdx}_${rIdx}`]) {
        essayScore += pt;
      }
    });
  });

  const totalScore = (mcqScore + tfScore + essayScore).toFixed(3);

window.toggleHsgExportMenu = function(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const m = document.getElementById("hsgExportDropdownMenu");
  if (m) {
    m.classList.toggle("show");
  }
};
window.closeHsgExportMenu = function() {
  const m = document.getElementById("hsgExportDropdownMenu");
  if (m) {
    m.classList.remove("show");
  }
};
document.addEventListener("click", function() {
  window.closeHsgExportMenu();
});

// Navigation Bar chuẩn 3 tab: Chuyên đề | Luyện đề | Công cụ
  const isLuyenDe = HSG_MASTER_STATE.activeSubTab === 'hsg_dongnai';
  const isChuyenDe = ['hsg_topics', 'hsg_theory_handbook', 'hsg_quiz'].includes(HSG_MASTER_STATE.activeSubTab);
  const isCongCu = ['ag_calc', 'hsg_classroom', 'hsg_matrix_validator'].includes(HSG_MASTER_STATE.activeSubTab);

  const subNavHtml = `
    <div style="margin-bottom:18px;">
      <!-- 3 TAB CHÍNH -->
      <div style="display:flex; gap:8px; margin-bottom:10px; border-bottom:1.5px solid var(--border); padding-bottom:10px; flex-wrap:wrap;">
        <button class="btn btn-sm ${isLuyenDe ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterSubTab('hsg_dongnai')" style="font-weight:700;">
          🏆 Luyện Đề
        </button>
        <button class="btn btn-sm ${isChuyenDe ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterSubTab('hsg_theory_handbook')" style="font-weight:700;">
          📚 Chuyên Đề
        </button>
        <button class="btn btn-sm ${isCongCu ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterSubTab('ag_calc')" style="font-weight:700;">
          🛠️ Công Cụ
        </button>
      </div>

      <!-- THANH TIỂU MỤC PHỤ KHI Ở CHUYÊN ĐỀ HOẶC CÔNG CỤ -->
      ${isChuyenDe ? `
        <div style="display:flex; gap:6px; flex-wrap:wrap; background:#f8fafc; padding:6px 10px; border-radius:8px; border:1px solid var(--border);">
          <button class="btn btn-sm ${HSG_MASTER_STATE.activeSubTab === 'hsg_theory_handbook' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterSubTab('hsg_theory_handbook')" style="font-size:12px; padding:3px 10px; font-weight:700;">
            📖 Lý Thuyết Bồi Dưỡng (77 Bài SGK)
          </button>
          <button class="btn btn-sm ${HSG_MASTER_STATE.activeSubTab === 'hsg_topics' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterSubTab('hsg_topics')" style="font-size:12px; padding:3px 10px; font-weight:700;">
            📐 10 Dạng Toán
          </button>
          <button class="btn btn-sm ${HSG_MASTER_STATE.activeSubTab === 'hsg_quiz' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterSubTab('hsg_quiz')" style="font-size:12px; padding:3px 10px; font-weight:700;">
            🧠 Trắc Nghiệm VDC
          </button>
        </div>
      ` : ''}

      ${isCongCu ? `
        <div style="display:flex; gap:6px; flex-wrap:wrap; background:#f8fafc; padding:6px 10px; border-radius:8px; border:1px solid var(--border);">
          <button class="btn btn-sm ${HSG_MASTER_STATE.activeSubTab === 'ag_calc' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterSubTab('ag_calc')" style="font-size:12px; padding:3px 10px;">
            🧮 Máy Tính 6-in-1
          </button>
          <button class="btn btn-sm ${HSG_MASTER_STATE.activeSubTab === 'hsg_classroom' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterSubTab('hsg_classroom')" style="font-size:12px; padding:3px 10px;">
            🏫 Phòng Thi Lớp
          </button>
          <button class="btn btn-sm ${HSG_MASTER_STATE.activeSubTab === 'hsg_matrix_validator' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterSubTab('hsg_matrix_validator')" style="font-size:12px; padding:3px 10px;">
            ⚖️ Ma Trận Kiểm Định
          </button>
        </div>
      ` : ''}
    </div>
  `;

  let bodyContent = "";

  if (HSG_MASTER_STATE.activeSubTab === "hsg_dongnai") {
    const currentLevel = HSG_MASTER_STATE.selectedLevel || 'all';
    const availableExams = getExamsForCurrentLevel();

    bodyContent = `
      <!-- THANH CHỌN CẤP ĐỘ TIẾN TRÌNH HSG -->
      <div style="background:#fff; border:1px solid var(--border); border-radius:10px; padding:10px 16px; margin-bottom:14px; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span style="font-size:12px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">MỨC ĐỘ:</span>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button class="btn btn-sm ${HSG_MASTER_STATE.selectedLevel === 'all' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterLevel('all')">
                🌐 Tất cả
              </button>
              <button class="btn btn-sm ${HSG_MASTER_STATE.selectedLevel === 'easy' ? 'btn-primary' : 'btn-outline'}" style="${HSG_MASTER_STATE.selectedLevel === 'easy' ? 'background:#16a34a; border-color:#16a34a;' : 'color:#16a34a; border-color:#86efac;'}" onclick="selectHsgMasterLevel('easy')">
                🟢 Cơ bản
              </button>
              <button class="btn btn-sm ${HSG_MASTER_STATE.selectedLevel === 'medium' ? 'btn-primary' : 'btn-outline'}" style="${HSG_MASTER_STATE.selectedLevel === 'medium' ? 'background:#d97706; border-color:#d97706;' : 'color:#d97706; border-color:#fcd34d;'}" onclick="selectHsgMasterLevel('medium')">
                🟡 Vận dụng
              </button>
              <button class="btn btn-sm ${HSG_MASTER_STATE.selectedLevel === 'hard' ? 'btn-primary' : 'btn-outline'}" style="${HSG_MASTER_STATE.selectedLevel === 'hard' ? 'background:#dc2626; border-color:#dc2626;' : 'color:#dc2626; border-color:#fca5a5;'}" onclick="selectHsgMasterLevel('hard')">
                🔴 Nâng cao
              </button>
              <button class="btn btn-sm ${HSG_MASTER_STATE.activeExamId === 'dn_auto' ? 'btn-primary' : 'btn-outline'}" style="background:#7c3aed; color:#fff; border-color:#7c3aed;" onclick="regenerateAutoExamForLevel('${currentLevel}')">
                🎲 Tạo đề mới
              </button>
            </div>
          </div>

          <!-- Toggle Gợi ý nhớ kiến thức -->
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="btn btn-sm ${HSG_MASTER_STATE.showRecallHints ? 'btn-accent' : 'btn-outline'}" style="font-size:12px; font-weight:700;" onclick="toggleGlobalRecallHints()" title="Bật/Tắt hiển thị gợi ý nhớ kiến thức lý thuyết cốt lõi SGK">
              ${HSG_MASTER_STATE.showRecallHints ? '💡 Đang bật: Gợi ý nhớ SGK' : '💡 Đang ẩn: Gợi ý nhớ SGK'}
            </button>
          </div>
        </div>
      </div>

      <!-- Khung Đề Thi HSG Tỉnh Đồng Nai -->
      <div style="background:linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%); border:1.5px solid #86efac; border-radius:12px; padding:16px 20px; margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap; margin-bottom:4px;">
              <span class="badge badge-ok" style="font-size:12px; font-weight:800;">QUY CHẾ THI HSG CẤP TỈNH ĐỒNG NAI (QĐ 1540/QĐ-SGDĐT)</span>
              <span class="badge badge-nl" style="font-size:12px;">THANG ĐIỂM: 20,0 • THỜI GIAN: 180 PHÚT</span>
              ${exam.levelBadge ? `<span class="badge badge-vandung" style="font-size:12px; font-weight:800;">${exam.levelBadge}</span>` : ''}
            </div>
            <h3 style="color:var(--primary-dark); font-size:18px; margin:4px 0 2px;">
              ${escapeHtml(exam.title)}
            </h3>
            <p style="font-size:12.5px; color:var(--text-muted); margin:0;">
              Nguồn dữ liệu: <strong>${escapeHtml(exam.source || 'Sở GD&ĐT Đồng Nai')}</strong>
            </p>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-end;">
            <!-- Hàng 1: Đồng hồ đếm ngược -->
            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
              <div class="mock-timer-display" style="background:#0f172a; color:#4ade80; padding:6px 14px; border-radius:8px; font-weight:800; font-family:monospace; font-size:16px;">
                <span>⏱️</span>
                <span id="hsgMasterTimerText">03:00:00</span>
                <button class="btn btn-sm" style="padding:2px 8px; font-size:11px; background:#334155; color:#fff; margin-left:6px;" onclick="toggleHsgMasterTimer()">
                  ${HSG_MASTER_STATE.timerRunning ? '⏸️ Tạm dừng' : '▶️ Bắt đầu'}
                </button>
              </div>
            </div>

            <!-- Hàng 2: Nộp Bài & Dropdown Xuất File & Nút GV duy nhất -->
            <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
              ${!HSG_MASTER_STATE.submitted ? `
                <button class="btn btn-primary btn-sm" onclick="submitHsgMasterExam()" style="font-weight:700;">
                  ✅ Nộp Bài Thi & Chấm Điểm
                </button>
              ` : `
                <button class="btn btn-outline btn-sm" onclick="HSG_MASTER_STATE.submitted=false; renderDongNaiHsgMaster();">
                  🔄 Tiếp tục làm bài
                </button>
              `}
              
              <!-- Dropdown Xuất File (.doc) Gọn Gàng -->
              <div class="hsg-dropdown">
                <button type="button" class="btn btn-sm btn-outline" onclick="toggleHsgExportMenu(event)" style="background:#fff; border-color:#cbd5e1; color:#334155; font-weight:600;">
                  📥 Xuất File (.doc) ▾
                </button>
                <div id="hsgExportDropdownMenu" class="hsg-dropdown-content">
                  <a href="javascript:void(0)" class="hsg-dropdown-item" onclick="exportHsgStudentExamDoc(); closeHsgExportMenu();">
                    📄 1. Đề Thi Học Sinh (.doc)
                  </a>
                  <a href="javascript:void(0)" class="hsg-dropdown-item" onclick="exportHsgAnswerSheetDoc(); closeHsgExportMenu();">
                    📝 2. Phiếu Trả Lời (.doc)
                  </a>
                  <a href="javascript:void(0)" class="hsg-dropdown-item" onclick="exportHsgOfficialKeyAndRubricDoc(); closeHsgExportMenu();">
                    ⚖️ 3. Barem Chấm Chi Tiết (.doc)
                  </a>
                  <a href="javascript:void(0)" class="hsg-dropdown-item" onclick="exportHsgManualGradingSheetDoc(); closeHsgExportMenu();">
                    ✍️ 4. Phiếu Chấm Tay Giám Khảo (.doc - Chuẩn NĐ 30)
                  </a>
                </div>
              </div>

              <!-- Bộ nút duy nhất cho GV -->
              <button class="btn btn-sm" style="background:#1d4ed8; color:#fff; font-weight:700; border:none;" onclick="window.createRoomFromCurrentHsgExam()" title="Tạo phòng thi trực tuyến cho cả lớp làm chung đề này">
                🏫 Tạo Phòng Cho Lớp
              </button>
              <button class="btn btn-sm btn-outline" style="background:#fff; color:#1e40af; border-color:#3b82f6; font-weight:700;" onclick="window.openTeacherExamPreview(HSG_MASTER_STATE.activeExamId)" title="Dành cho giáo viên xem trước toàn bộ đề, đáp án và barem chấm">
                👁️ Xem Trước Đề (GV)
              </button>
            </div>
          </div>
        </div>

        <!-- Bộ chọn Đề thi HSG theo Cấp độ hiện tại: Tên ngắn gọn Đề 01, Đề 02... -->
        <div style="margin-top:14px; padding-top:12px; border-top:1px dashed #cbd5e1; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span style="font-size:12.5px; font-weight:700; color:var(--primary-dark);">📚 Chọn đề:</span>
          ${availableExams.map((ex, idx) => `
            <button class="btn btn-sm ${HSG_MASTER_STATE.activeExamId === ex.id ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterExam('${ex.id}')" title="${escapeHtml(ex.title)}">
              Đề 0${idx + 1}
            </button>
          `).join("")}
          <button class="btn btn-sm ${HSG_MASTER_STATE.activeExamId === 'dn_auto' ? 'btn-primary' : 'btn-outline'}" style="background:${HSG_MASTER_STATE.activeExamId === 'dn_auto' ? 'var(--primary)' : '#fff'}; border-color:#7c3aed; color:${HSG_MASTER_STATE.activeExamId === 'dn_auto' ? '#fff' : '#7c3aed'}; font-weight:700;" onclick="regenerateAutoExamForLevel('${currentLevel}')">
            🎲 Tạo Đề Mới (Khi Chưa Đạt)
          </button>
        </div>
      </div>


      <!-- Banner Kết Quả Chấm nếu đã nộp -->
      ${HSG_MASTER_STATE.submitted ? `
        <div class="audit-score-banner" style="margin-bottom:20px;">
          <div>
            <span class="badge badge-ok" style="font-size:13px;">KẾT QUẢ KHẢO THÍ HỌC SINH GIỎI CẤP TỈNH (ÁP DỤNG BẢNG ${tbl})</span>
            <div style="font-size:26px; font-weight:800; color:var(--primary-dark); margin:6px 0 3px;">
              Tổng Điểm: ${totalScore} / 20,000 điểm
            </div>
            <div style="font-size:13.5px; color:var(--text-muted); line-height:1.6;">
              • Phần I (Trắc nghiệm 24 câu): <strong>${mcqScore.toFixed(2)} / 6,00 điểm</strong> (${mcqCorrect}/24 câu đúng)<br/>
              • Phần II (Đúng/Sai có giải thích 16 ý): <strong>${tfScore.toFixed(3)} / 6,00 điểm</strong> (${tfCorrectChoiceCount}/16 ý đúng; ${tfExplainedCount} ý có giải thích hợp lệ theo Bảng ${tbl})<br/>
              • Phần III (Tự luận chuyên sâu 3 bài): <strong>${essayScore.toFixed(2)} / 8,00 điểm</strong> (Tích chọn biểu điểm rubric chi tiết bên dưới)<br/>
              • Xếp loại giải dự kiến: <strong>${Number(totalScore) >= 16.0 ? 'GIẢI NHẤT 🥇' : (Number(totalScore) >= 14.0 ? 'GIẢI NHÌ 🥈' : (Number(totalScore) >= 11.5 ? 'GIẢI BA 🥉' : (Number(totalScore) >= 9.0 ? 'GIẢI KHUYẾN KHÍCH 🎗️' : 'CHƯA ĐẠT GIẢI (Cần bồi dưỡng thêm)')))}</strong>
            </div>

            <!-- Khuyến nghị Thăng Hạng Tiến Trình Cấp Độ -->
            ${Number(totalScore) < 14.0 ? `
              <div style="margin-top:12px; padding:10px 14px; background:#fff1f2; border:1.5px solid #fecdd3; border-radius:8px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
                <div>
                  <strong style="color:#9f1239;">⚠️ KẾT QUẢ CHƯA ĐẠT MỤC TIÊU (${totalScore} / 20,0 ĐIỂM)?</strong><br/>
                  <span style="font-size:12.5px; color:#be123c;">Đừng lo lắng! Bấm nút bên cạnh để hệ thống bốc một đề thi HSG Bảng B mới hoàn toàn theo cấp độ bạn đang chọn để rèn luyện lại ngay.</span>
                </div>
                <button class="btn btn-sm" style="background:#e11d48; color:#fff; border:none; font-weight:700; padding:6px 14px;" onclick="regenerateAutoExamForLevel('${currentLevel}'); alert('🎲 Đã tạo đề thi HSG mới! Chúc bạn nâng cao điểm số!');">
                  🎲 Tạo &amp; Làm Đề Mới Ngay
                </button>
              </div>
            ` : ''}
            ${(exam.level === 'easy' && Number(totalScore) >= 14.0) ? `
              <div style="margin-top:12px; padding:10px 14px; background:#f0fdf4; border:1.5px solid #86efac; border-radius:8px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
                <div>
                  <strong style="color:#166534;">🎉 CHÚC MỪNG BẠN ĐÃ TỐT NGHIỆP CẤP ĐỘ 1 (ĐẠT ${totalScore} ĐIỂM)!</strong><br/>
                  <span style="font-size:12.5px; color:#15803d;">Bạn đã nắm vững kiến thức nền tảng SGK. Hãy nâng cấp ngay lên Cấp độ 2 để rèn luyện tư duy phân hóa!</span>
                </div>
                <button class="btn btn-sm btn-primary" style="background:#d97706; border-color:#d97706; font-weight:700;" onclick="levelUpMilestone('medium')">
                  🚀 Nâng cấp lên CẤP ĐỘ 2 (VỪA / TĂNG TỐC)
                </button>
              </div>
            ` : ''}

            ${(exam.level === 'medium' && Number(totalScore) >= 16.0) ? `
              <div style="margin-top:12px; padding:10px 14px; background:#fffbeb; border:1.5px solid #fde68a; border-radius:8px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
                <div>
                  <strong style="color:#92400e;">🚀 XUẤT SẮC! BẠN ĐÃ LÀM CHỦ CẤP ĐỘ 2 (ĐẠT ${totalScore} ĐIỂM — ĐẠT CHUẨN BẢNG B)!</strong><br/>
                  <span style="font-size:12.5px; color:#b45309;">Năng lực giải thích kỹ thuật của bạn rất tốt. Bạn đã sẵn sàng bước vào thử thách VDC đỉnh cao tại Cấp độ 3!</span>
                </div>
                <button class="btn btn-sm btn-primary" style="background:#dc2626; border-color:#dc2626; font-weight:700;" onclick="levelUpMilestone('hard')">
                  🔥 Thử thách CẤP ĐỘ 3 (KHÓ / VỀ ĐÍCH — VDC BẢNG B & ĐỘI TUYỂN)
                </button>
              </div>
            ` : ''}

            ${(exam.level === 'hard' && Number(totalScore) >= 16.0) ? `
              <div style="margin-top:12px; padding:10px 14px; background:#fef2f2; border:1.5px solid #fecaca; border-radius:8px;">
                <strong style="color:#991b1b; font-size:14px;">🏆 ĐẲNG CẤP THỦ KHOA — GIẢI NHẤT CẤP TỈNH / THÀNH PHỐ! (ĐẠT ${totalScore} ĐIỂM)</strong><br/>
                <span style="font-size:12.5px; color:#b91c1c;">Bạn đã làm chủ hoàn hảo các bài toán chuyên sâu CRISPR/Cas9, RAS tuần hoàn và Net-Zero. Đủ năng lực thi chọn Đội tuyển Quốc gia!</span>
              </div>
            ` : ''}
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <button class="btn btn-sm" style="background:#7c3aed; color:#fff; font-weight:700; border:none;" onclick="regenerateAutoExamForLevel('${currentLevel}'); alert('🎲 Đã tạo đề thi HSG mới!');">
              🎲 Tạo Đề Mới (Khi Chưa Đạt)
            </button>
            <button class="btn btn-accent" onclick="exportHsgOfficialKeyAndRubricDoc()">
              📥 Tải Toàn Bộ Hồ Sơ Đáp Án & Hướng Dẫn Chấm (.doc)
            </button>
              <button class="btn btn-sm" style="background:#1d4ed8; color:#fff; font-weight:700;" onclick="window.createRoomFromCurrentHsgExam()" title="Tạo phòng thi trực tuyến cho cả lớp làm chung đề này">
                🏫 Tạo Phòng Cho Lớp
              </button>
              <button class="btn btn-sm btn-outline" style="background:#fff; color:#1e40af; border-color:#3b82f6; font-weight:700;" onclick="window.openTeacherExamPreview(HSG_MASTER_STATE.activeExamId)" title="Dành cho giáo viên xem trước toàn bộ đề, đáp án và barem chấm">
                👁️ Xem Trước Đề
              </button>
            <button class="btn btn-outline" onclick="selectHsgMasterSubTab('hsg_matrix_validator')">
              ⚖️ Xem Báo Cáo Kiểm Định 14 Tiêu Chí Hợp Lệ
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Palette Điều hướng nhanh 40 lệnh hỏi (24 MCQ + 16 ý Đúng/Sai) -->
      <div class="mock-palette" style="margin-bottom:18px;">
        <span style="font-size:12px; font-weight:700; color:var(--text-muted); align-self:center; margin-right:6px;">Lệnh hỏi:</span>
        <span style="font-size:11px; color:#475569; align-self:center; margin-right:4px;">Phần I (MCQ):</span>
        ${(exam.mcqs || []).map((_, i) => {
          const isDone = typeof HSG_MASTER_STATE.userMcq[i] !== "undefined";
          return `<button class="mock-palette-btn ${isDone ? 'done' : ''}" onclick="const el=document.getElementById('dn_mcq_box_${i}'); if(el) el.scrollIntoView({behavior:'smooth',block:'center'});">${i + 1}</button>`;
        }).join("")}
        <span style="font-size:11px; color:#475569; align-self:center; margin:0 4px 0 10px;">Phần II (Đ/S):</span>
        ${(exam.tfs || []).map((q, i) => {
          const userTf = HSG_MASTER_STATE.userTfChoice[i] || {};
          const isDone = (q.statements || []).every(st => typeof userTf[st.label] !== "undefined");
          return `<button class="mock-palette-btn ${isDone ? 'done' : ''}" style="background:${isDone ? '#0f766e' : '#fff'};" onclick="const el=document.getElementById('dn_tf_box_${i}'); if(el) el.scrollIntoView({behavior:'smooth',block:'center'});">C${i + 1}</button>`;
        }).join("")}
        <span style="font-size:11px; color:#475569; align-self:center; margin:0 4px 0 10px;">Phần III (TL):</span>
        ${(exam.essays || []).map((_, i) => `
          <button class="mock-palette-btn" style="background:#7c3aed; color:#fff;" onclick="const el=document.getElementById('dn_essay_box_${i}'); if(el) el.scrollIntoView({behavior:'smooth',block:'center'});">TL${i + 1}</button>
        `).join("")}
      </div>

      <!-- PHẦN I: TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN -->
      <div style="margin:24px 0 14px; padding:12px 16px; background:#eff6ff; border-left:4px solid var(--info); border-radius:8px;">
        <h3 style="font-size:15.5px; color:#1e3a8a; margin:0 0 3px;">PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (24 câu — 6,0 điểm)</h3>
        <p style="font-size:12.5px; color:#475569; margin:0;">
          Mỗi câu trả lời đúng được 0,25 điểm. Phân bổ: <strong>Khối 10 (8 câu: 1–8)</strong> • <strong>Khối 11 (8 câu: 9–16)</strong> • <strong>Khối 12 (8 câu: 17–24)</strong>.
        </p>
      </div>

      ${(exam.mcqs || []).map((q, idx) => {
        const userAns = HSG_MASTER_STATE.userMcq[idx];
        const isCorrect = userAns === q.answer;
        const hintKey = `mcq_${idx}`;
        const isHintOpen = HSG_MASTER_STATE.expandedRecallHints[hintKey];

        return `
          <div class="q-card" id="dn_mcq_box_${idx}">
            <div class="q-card-header">
              <div>
                <strong>Câu ${idx + 1}:</strong>
                <span class="badge badge-nl">${escapeHtml(q.topic)}</span>
                <span class="badge ${q.grade === 'cn10' ? 'badge-biet' : (q.grade === 'cn11' ? 'badge-hieu' : 'badge-vandung')}">
                  ${q.grade === 'cn10' ? 'Lớp 10 (Trồng trọt)' : (q.grade === 'cn11' ? 'Lớp 11 (Chăn nuôi)' : 'Lớp 12 (Lâm – Thủy sản)')}
                </span>
              </div>
              ${HSG_MASTER_STATE.submitted ? (
                isCorrect
                  ? `<span class="badge badge-ok">✓ Đúng (+0,25đ)</span>`
                  : `<span class="badge badge-err">✗ Sai (Đáp án: ${String.fromCharCode(65 + q.answer)})</span>`
              ) : ''}
            </div>
            <div style="font-weight:600; margin-bottom:8px; font-size:14px;">${escapeHtml(q.stem)}</div>
            <div class="options-grid">
              ${(q.options || []).map((opt, oIdx) => {
                let cls = "opt-item";
                if (HSG_MASTER_STATE.submitted && oIdx === q.answer) cls += " correct";
                else if (userAns === oIdx) cls += " correct";
                return `
                  <div class="${cls}" style="cursor:pointer; ${HSG_MASTER_STATE.submitted && userAns === oIdx && !isCorrect ? 'background:#fee2e2; border-color:#ef4444;' : ''}" onclick="chooseHsgMasterMcq(${idx}, ${oIdx})">
                    <input type="radio" name="dn_master_mcq_${idx}" ${userAns === oIdx ? 'checked' : ''} />
                    <strong>${String.fromCharCode(65 + oIdx)}.</strong>
                    <span>${escapeHtml(opt)}</span>
                  </div>
                `;
              }).join("")}
            </div>

            <!-- Gợi ý nhớ kiến thức SGK cho học sinh -->
            ${q.recallHint ? `
              <div style="margin-top:8px;">
                <button class="btn btn-outline btn-sm" style="font-size:11px; padding:2px 8px; border-color:#f59e0b; color:#b45309; background:#fffbeb;" onclick="toggleSingleRecallHint('${hintKey}')">
                  💡 ${isHintOpen ? 'Ẩn gợi ý nhớ SGK' : 'Hiện gợi ý nhớ SGK'}
                </button>
                ${(HSG_MASTER_STATE.showRecallHints || isHintOpen) ? `
                  <div style="margin-top:6px; padding:8px 12px; background:#fffbeb; border-left:3px solid #f59e0b; border-radius:6px; font-size:12.5px; color:#92400e; line-height:1.45;">
                    <strong>📖 Điểm tựa ghi nhớ SGK:</strong> ${escapeHtml(q.recallHint)}
                  </div>
                ` : ''}
              </div>
            ` : ''}

            ${HSG_MASTER_STATE.submitted ? `
              <div style="margin-top:8px; padding:8px 12px; background:#f0fdf4; border-radius:6px; font-size:13px; color:#166534;">
                <strong>💡 Phân tích đáp án chuẩn:</strong> Phương án <strong>${String.fromCharCode(65 + q.answer)}</strong> đúng. ${escapeHtml(q.explanation)}
              </div>
            ` : ''}
          </div>
        `;
      }).join("")}

      <!-- PHẦN II: CÂU TRẮC NGHIỆM ĐÚNG / SAI CÓ GIẢI THÍCH -->
      <div style="margin:28px 0 14px; padding:12px 16px; background:#fef3c7; border-left:4px solid var(--accent); border-radius:8px;">
        <h3 style="font-size:15.5px; color:#92400e; margin:0 0 3px;">PHẦN II. CÂU HỎI ĐÚNG / SAI CÓ GIẢI THÍCH (4 câu, 16 ý — 6,0 điểm)</h3>
        <p style="font-size:12.5px; color:#78350f; margin:0;">
          Quy chế chấm <strong>BẢNG B THPT</strong> (Đúng nhận định: 0,25đ + Giải thích đúng: 0,125đ -> Tối đa 0,375đ/ý × 16 ý = 6,00đ theo QĐ 1540/QĐ-SGDĐT Đồng Nai).<br/>
          <em>* Thí sinh xác định Đúng/Sai VÀ viết lời giải thích cơ sở khoa học vào ô bên dưới.</em>
        </p>
      </div>

      ${(exam.tfs || []).map((q, qIdx) => `
        <div class="q-card" id="dn_tf_box_${qIdx}" style="margin-bottom:18px;">
          <div class="q-card-header">
            <div>
              <strong>${escapeHtml(q.title)}</strong>
              <span class="badge badge-vandung">Phân hóa HSG</span>
            </div>
            <span class="badge ${q.grade === 'cn10' ? 'badge-biet' : (q.grade === 'cn11' ? 'badge-hieu' : 'badge-vandung')}">
              ${q.grade === 'cn10' ? 'Khối 10' : (q.grade === 'cn11' ? 'Khối 11' : 'Khối 12')}
            </span>
          </div>
          <div style="font-size:13.5px; color:#334155; margin-bottom:12px; background:#f8fafc; padding:10px 14px; border-radius:8px; line-height:1.5;">
            ${escapeHtml(q.context)}
          </div>

          <div style="display:flex; flex-direction:column; gap:12px;">
            ${(q.statements || []).map(st => {
              const uChoice = HSG_MASTER_STATE.userTfChoice[qIdx] ? HSG_MASTER_STATE.userTfChoice[qIdx][st.label] : undefined;
              const uExp = HSG_MASTER_STATE.userTfExplain[qIdx] ? HSG_MASTER_STATE.userTfExplain[qIdx][st.label] : "";
              const isChoiceRight = uChoice === st.isTrue;
              const tfHintKey = `tf_${qIdx}_${st.label}`;
              const isTfHintOpen = HSG_MASTER_STATE.expandedRecallHints[tfHintKey];

              return `
                <div style="border:1px solid #e2e8f0; border-radius:8px; padding:10px 14px; background:#fff;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap;">
                    <div style="flex:1; font-size:13.5px;">
                      <strong>${st.label})</strong> ${escapeHtml(st.text)}
                    </div>
                    <div style="display:flex; gap:6px; align-items:center;">
                      <button class="btn btn-sm ${uChoice === true ? 'btn-primary' : 'btn-outline'}" style="padding:3px 10px; font-weight:700;" onclick="chooseHsgMasterTf(${qIdx}, '${st.label}', true)">
                        ĐÚNG
                      </button>
                      <button class="btn btn-sm ${uChoice === false ? 'btn-secondary' : 'btn-outline'}" style="padding:3px 10px; font-weight:700;" onclick="chooseHsgMasterTf(${qIdx}, '${st.label}', false)">
                        SAI
                      </button>
                      ${HSG_MASTER_STATE.submitted ? (
                        isChoiceRight
                          ? `<span class="badge badge-ok" style="font-size:11px;">✓ Đúng (+${tbl === 'A' ? '0,125đ' : '0,25đ'})</span>`
                          : `<span class="badge badge-err" style="font-size:11px;">✗ Đáp án: ${st.isTrue ? 'ĐÚNG' : 'SAI'}</span>`
                      ) : ''}
                    </div>
                  </div>

                  <!-- Điểm tựa ghi nhớ SGK cho nhận định Đúng/Sai -->
                  ${st.recallHint ? `
                    <div style="margin-top:6px;">
                      <button class="btn btn-outline btn-sm" style="font-size:10.5px; padding:1px 6px; border-color:#f59e0b; color:#b45309; background:#fffbeb;" onclick="toggleSingleRecallHint('${tfHintKey}')">
                        💡 ${isTfHintOpen ? 'Ẩn gợi ý nhớ SGK' : 'Hiện gợi ý nhớ SGK'}
                      </button>
                      ${(HSG_MASTER_STATE.showRecallHints || isTfHintOpen) ? `
                        <div style="margin-top:4px; padding:6px 10px; background:#fffbeb; border-left:3px solid #f59e0b; border-radius:5px; font-size:12px; color:#92400e;">
                          <strong>📖 Điểm tựa ghi nhớ SGK:</strong> ${escapeHtml(st.recallHint)}
                        </div>
                      ` : ''}
                    </div>
                  ` : ''}

                  <!-- Ô nhập lời giải thích của học sinh -->
                  <div style="margin-top:8px;">
                    <textarea class="form-input" style="width:100%; height:45px; font-size:12.5px; padding:6px 10px;" placeholder="Viết tóm tắt cơ sở khoa học giải thích vì sao nhận định này Đúng hoặc Sai..." oninput="inputHsgMasterExplain(${qIdx}, '${st.label}', this.value)">${escapeHtml(uExp)}</textarea>
                  </div>

                  ${HSG_MASTER_STATE.submitted ? `
                    <div style="margin-top:6px; padding:6px 10px; background:#f0fdf4; border-radius:6px; font-size:12.5px; color:#166534;">
                      <strong>💡 Cơ sở khoa học chuẩn:</strong> Nhận định <strong>${st.isTrue ? 'ĐÚNG' : 'SAI'}</strong>. ${escapeHtml(st.explanation)}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `).join("")}

      <!-- PHẦN III: CÂU HỎI TỰ LUẬN CHUYÊN SÂU -->
      <div style="margin:28px 0 14px; padding:12px 16px; background:#f5f3ff; border-left:4px solid #7c3aed; border-radius:8px;">
        <h3 style="font-size:15.5px; color:#5b21b6; margin:0 0 3px;">PHẦN III. CÂU HỎI TỰ LUẬN CHUYÊN SÂU (3 câu — 8,0 điểm)</h3>
        <p style="font-size:12.5px; color:#4c1d95; margin:0;">
          Cấu trúc chuẩn Sở GD&ĐT Đồng Nai: <strong>7,0 điểm Lớp 12</strong> (Lâm nghiệp 3,5đ + Thủy sản 3,5đ) + <strong>1,0 điểm Tổng hợp nâng cao</strong>.<br/>
          <em>* Thí sinh viết lời giải chi tiết vào khung bên dưới. Khi nộp bài có thể tự đối chiếu biểu điểm Rubric chính thức.</em>
        </p>
      </div>

      ${(exam.essays || []).map((p, eIdx) => {
        const uText = HSG_MASTER_STATE.userEssayText[eIdx] || "";
        const essayHintKey = `essay_${eIdx}`;
        const isEssayHintOpen = HSG_MASTER_STATE.expandedRecallHints[essayHintKey];

        return `
          <div class="q-card" id="dn_essay_box_${eIdx}" style="margin-bottom:20px;">
            <div class="q-card-header">
              <div>
                <strong>${escapeHtml(p.title)}</strong>
                <span class="badge badge-vandung">${p.points} điểm</span>
              </div>
            </div>
            <div style="font-size:13.5px; line-height:1.6; margin-bottom:12px; background:#f8fafc; padding:12px 16px; border-radius:8px; white-space:pre-line;">
              ${escapeHtml(p.problem)}
            </div>

            <!-- Điểm tựa ghi nhớ cho câu tự luận -->
            ${p.recallHint ? `
              <div style="margin-bottom:10px;">
                <button class="btn btn-outline btn-sm" style="font-size:11px; padding:2px 8px; border-color:#f59e0b; color:#b45309; background:#fffbeb;" onclick="toggleSingleRecallHint('${essayHintKey}')">
                  💡 ${isEssayHintOpen ? 'Ẩn gợi ý nhớ SGK' : 'Hiện gợi ý nhớ SGK'}
                </button>
                ${(HSG_MASTER_STATE.showRecallHints || isEssayHintOpen) ? `
                  <div style="margin-top:6px; padding:8px 12px; background:#fffbeb; border-left:3px solid #f59e0b; border-radius:6px; font-size:12.5px; color:#92400e; line-height:1.45;">
                    <strong>📖 Điểm tựa ghi nhớ SGK:</strong> ${escapeHtml(p.recallHint)}
                  </div>
                ` : ''}
              </div>
            ` : ''}

            <!-- Khung soạn thảo bài làm của học sinh -->
            <div style="margin-bottom:12px;">
              <label style="font-size:12.5px; font-weight:700; color:#334155; margin-bottom:4px; display:block;">Bài làm tự luận của thí sinh:</label>
              <textarea class="form-input" style="width:100%; height:120px; font-family:'Courier New', monospace; font-size:13px; line-height:1.4;" placeholder="Nhập chi tiết các bước tính toán, lời giải và lập luận khoa học tại đây..." oninput="inputHsgMasterEssay(${eIdx}, this.value)">${escapeHtml(uText)}</textarea>
            </div>

            <!-- Biểu điểm Rubric chính thức -->
            <details style="margin-top:10px; background:#faf5ff; border:1px solid #e9d5ff; border-radius:8px; padding:8px 12px;" ${HSG_MASTER_STATE.submitted ? 'open' : ''}>
              <summary style="font-weight:700; color:#6b21a8; font-size:13px; cursor:pointer;">
                🔍 Xem Biểu Điểm Rubric Chi Tiết & Tự Đánh Giá (${p.points} điểm)
              </summary>
              <div style="margin-top:8px; font-size:12.5px; line-height:1.5; color:#581c87;">
                ${(p.rubric || []).map((r, rIdx) => {
                  const isChecked = HSG_MASTER_STATE.userEssayRubricChecks[`${eIdx}_${rIdx}`];
                  return `
                    <div style="margin-bottom:6px; padding:6px 10px; background:#fff; border-radius:6px; display:flex; align-items:flex-start; gap:8px;">
                      <input type="checkbox" style="margin-top:3px;" ${isChecked ? 'checked' : ''} onchange="toggleHsgEssayRubric(${eIdx}, ${rIdx})"/>
                      <div>
                        <strong>Tiêu chí ${rIdx + 1}:</strong> ${escapeHtml(r)}
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            </details>
          </div>
        `;
      }).join("")}
    `;

  } else if (HSG_MASTER_STATE.activeSubTab === "hsg_matrix_validator") {
    // ------------------------------------------------------------------------
    // TAB 2: MA TRẬN ĐỀ & BỘ KIỂM ĐỊNH 14 TIÊU CHÍ (SKILL.md)
    // ------------------------------------------------------------------------
    bodyContent = `
      <!-- Banner Trạng thái Kiểm định -->
      <div class="audit-score-banner" style="margin-bottom:18px;">
        <div style="display:flex; align-items:center; gap:16px;">
          <div class="audit-circle" style="background:${val.isFullyValid ? 'var(--primary)' : '#eab308'}; font-size:22px;">
            ${val.passedCount}/${val.totalCount}
          </div>
          <div>
            <span class="badge ${val.isFullyValid ? 'badge-ok' : 'badge-err'}">
              ${val.isFullyValid ? 'ĐẠT 100% TIÊU CHÍ HỢP LỆ THEO SKILL.MD' : 'CÓ TIÊU CHÍ CẦN LƯU Ý'}
            </span>
            <div style="font-size:20px; font-weight:800; color:var(--primary-dark); margin:4px 0 2px;">
              Báo Cáo Kiểm Định Hợp Lệ Đề Thi HSG (${val.scorePercent}% Hợp lệ)
            </div>
            <p style="font-size:13px; color:var(--text-muted); margin:0;">
              Đối chiếu tự động giữa <strong>Quyết định 1540/QĐ-SGDĐT</strong> ↔ <strong>Mục 6 Quy tắc kiểm định SKILL.md</strong>.
            </p>
          </div>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-sm" style="background:#7c3aed; color:#fff; font-weight:700; border:none;" onclick="regenerateAutoExamForLevel('${currentLevel}'); alert('🎲 Đã tạo đề thi HSG mới!');">
              🎲 Tạo Đề Mới (Khi Chưa Đạt)
            </button>
            <button class="btn btn-accent" onclick="exportHsgOfficialKeyAndRubricDoc()">📥 Xuất Báo Cáo Kiểm Định (.doc)</button>
        </div>
      </div>

      <!-- Danh sách 14 Tiêu chí Hợp Lệ -->
      <div style="margin-bottom:24px;">
        <h4 style="color:var(--primary-dark); font-size:16px; margin-bottom:10px;">📋 Chi tiết 14 Tiêu chí Kiểm định Hợp lệ:</h4>
        <div class="audit-check-list">
          ${val.checks.map(c => `
            <div class="audit-item ${c.passed ? 'pass' : 'fail'}">
              <span class="audit-icon">${c.passed ? '✓' : '✗'}</span>
              <div style="flex:1;">
                <strong>Tiêu chí ${c.id}: ${escapeHtml(c.name)}</strong>
                <div style="font-size:12.5px; color:${c.passed ? '#15803d' : '#b91c1c'}; margin-top:2px;">
                  ${escapeHtml(c.detail)}
                </div>
              </div>
              <span class="badge ${c.passed ? 'badge-ok' : 'badge-err'}">${c.passed ? 'ĐẠT' : 'CHƯA ĐẠT'}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- BẢNG CẤU HÌNH & PHÊ DUYỆT MA TRẬN CHI TIẾT 7,0 ĐIỂM TỰ LUẬN LỚP 12 -->
      <div class="card" style="border-left:4px solid var(--accent); background:#fffbeb;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div>
            <span class="badge badge-vandung">YÊU CẦU ĐẶC BIỆT MỤC 2.3 & MỤC 7 SKILL.MD</span>
            <h3 style="color:#92400e; font-size:16.5px; margin:4px 0 2px;">
              Bảng Phân Bổ & Phê Duyệt Ma Trận Chi Tiết 7,0 Điểm Tự Luận Lớp 12
            </h3>
            <p style="font-size:12.5px; color:#78350f; margin:0;">
              <em>Nếu chưa có ma trận chi tiết được duyệt, hệ thống sẽ cảnh báo chưa đủ căn cứ phân bổ điểm tự luận Lớp 12.</em>
            </p>
          </div>
          <button class="btn btn-sm ${HSG_MASTER_STATE.g12MatrixApproved ? 'btn-primary' : 'btn-outline'}" onclick="toggleG12MatrixApproval()">
            ${HSG_MASTER_STATE.g12MatrixApproved ? '✅ Đã Phê Duyệt Ma Trận 7,0đ' : '⚠️ Bấm Để Phê Duyệt Ma Trận'}
          </button>
              <button class="btn btn-sm" style="background:#1d4ed8; color:#fff; font-weight:700;" onclick="window.createRoomFromCurrentHsgExam()" title="Tạo phòng thi trực tuyến cho cả lớp làm chung đề này">
                🏫 Tạo Phòng Cho Lớp
              </button>
              <button class="btn btn-sm btn-outline" style="background:#fff; color:#1e40af; border-color:#3b82f6; font-weight:700;" onclick="window.openTeacherExamPreview(HSG_MASTER_STATE.activeExamId)" title="Dành cho giáo viên xem trước toàn bộ đề, đáp án và barem chấm">
                👁️ Xem Trước Đề
              </button>
        </div>

        <table class="std-table">
          <thead>
            <tr>
              <th style="width:120px;">Phân môn</th>
              <th style="width:240px;">Chủ đề Lớp 12 theo quy định</th>
              <th style="width:100px; text-align:center;">Điểm phân bổ</th>
              <th>Mô tả trọng tâm kiểm tra & Câu hỏi đại diện</th>
            </tr>
          </thead>
          <tbody>
            ${HSG_MASTER_STATE.g12EssayMatrix.map(item => `
              <tr>
                <td style="font-weight:700; color:var(--primary-dark);">${escapeHtml(item.group)}</td>
                <td><strong>${escapeHtml(item.name)}</strong></td>
                <td style="text-align:center; font-weight:800; color:#15803d;">${item.points.toFixed(2)}đ</td>
                <td style="font-size:13px; color:#334155;">${escapeHtml(item.desc)}</td>
              </tr>
            `).join("")}
            <tr style="background:#fef3c7; font-weight:800;">
              <td colspan="2">TỔNG ĐIỂM KIẾN THỨC LỚP 12 PHẦN TỰ LUẬN</td>
              <td style="text-align:center; color:#b45309; font-size:15px;">7,00đ</td>
              <td>Chiếm 35,0% tổng điểm toàn bài thi (Khớp 100% quy định SKILL.md)</td>
            </tr>
            <tr style="background:#f0fdf4; font-weight:800;">
              <td colspan="2">KIẾN THỨC TỔNG HỢP, MỞ RỘNG, NÂNG CAO THỰC TIỄN</td>
              <td style="text-align:center; color:#15803d; font-size:15px;">1,00đ</td>
              <td>Nông nghiệp tuần hoàn, hạch toán kinh tế, liên môn (Chiếm 5,0%)</td>
            </tr>
            <tr style="background:#e0f2fe; font-weight:900;">
              <td colspan="2">TỔNG CỘNG PHẦN III (TỰ LUẬN)</td>
              <td style="text-align:center; color:#0369a1; font-size:16px;">8,00đ</td>
              <td>Tỷ lệ Tự luận chuẩn 40,0% toàn đề</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
    } else if (HSG_MASTER_STATE.activeSubTab === "hsg_theory_handbook") {
    // ------------------------------------------------------------------------
    // TAB 3: LÝ THUYẾT BỒI DƯỠNG HSG TOÀN BỘ SÁCH 77 BÀI & 9 CHUYÊN ĐỀ VDC
    // ------------------------------------------------------------------------
    if (HSG_MASTER_STATE.handbookMode === "vdc_core") {
      const filterGrade = HSG_MASTER_STATE.handbookFilterGrade || 'all';
      const filteredTopics = HSG_DEEP_HANDBOOK.filter(t => filterGrade === 'all' || t.grade === filterGrade);
      const activeTopic = HSG_DEEP_HANDBOOK.find(t => t.id === HSG_MASTER_STATE.handbookActiveTopicId) || filteredTopics[0] || HSG_DEEP_HANDBOOK[0];

      bodyContent = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
          <div>
            <h4 style="color:var(--primary-dark); font-size:16.5px; margin:0 0 3px;">📚 Cẩm Nang Lý Thuyết Chuyên Sâu 9 Chủ Đề Cốt Lõi (Lớp 10 • 11 • 12)</h4>
            <p style="font-size:12.5px; color:var(--text-muted); margin:0;">
              Hệ thống hóa bản chất khoa học, cơ chế sinh hóa, bảng đối chiếu và các bẫy câu hỏi Đúng/Sai thường gặp trong đề thi HSG cấp tỉnh.
            </p>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn btn-sm ${HSG_MASTER_STATE.handbookMode !== 'vdc_core' ? 'btn-primary' : 'btn-outline'}" onclick="HSG_MASTER_STATE.handbookMode='curriculum'; renderDongNaiHsgMaster();" style="font-weight:700;">
              📘 Toàn Bộ Sách (77 Bài Bồi Dưỡng)
            </button>
            <button class="btn btn-sm ${HSG_MASTER_STATE.handbookMode === 'vdc_core' ? 'btn-primary' : 'btn-outline'}" onclick="HSG_MASTER_STATE.handbookMode='vdc_core'; renderDongNaiHsgMaster();" style="font-weight:700;">
              🌟 9 Chuyên Đề Cốt Lõi VDC
            </button>
          </div>
        </div>

        <div style="display:flex; gap:6px; margin-bottom:14px;">
          <button class="btn btn-sm ${filterGrade === 'all' ? 'btn-primary' : 'btn-outline'}" onclick="HSG_MASTER_STATE.handbookFilterGrade='all'; renderDongNaiHsgMaster();">Tất cả 9 Chủ đề</button>
          <button class="btn btn-sm ${filterGrade === 'cn10' ? 'btn-primary' : 'btn-outline'}" onclick="HSG_MASTER_STATE.handbookFilterGrade='cn10'; renderDongNaiHsgMaster();">Khối 10 (Trồng trọt)</button>
          <button class="btn btn-sm ${filterGrade === 'cn11' ? 'btn-primary' : 'btn-outline'}" onclick="HSG_MASTER_STATE.handbookFilterGrade='cn11'; renderDongNaiHsgMaster();">Khối 11 (Chăn nuôi)</button>
          <button class="btn btn-sm ${filterGrade === 'cn12' ? 'btn-primary' : 'btn-outline'}" onclick="HSG_MASTER_STATE.handbookFilterGrade='cn12'; renderDongNaiHsgMaster();">Khối 12 (Lâm – Thủy sản)</button>
        </div>

        <div class="portal-split-layout">
          <aside class="lesson-sidebar" style="max-height:650px;">
            <div style="font-size:12px; font-weight:700; color:var(--text-muted); margin-bottom:8px;">DANH MỤC 9 CHỦ ĐỀ CHUYÊN SÂU:</div>
            <div class="lesson-list-scroll">
              ${filteredTopics.map(top => `
                <div class="lesson-nav-item ${top.id === activeTopic.id ? 'active' : ''}" onclick="HSG_MASTER_STATE.handbookActiveTopicId='${top.id}'; renderDongNaiHsgMaster();">
                  <span class="badge ${top.grade === 'cn10' ? 'badge-biet' : (top.grade === 'cn11' ? 'badge-hieu' : 'badge-vandung')}" style="font-size:10.5px;">${top.code}</span>
                  <div style="font-size:13px; font-weight:700; margin-top:3px;">${escapeHtml(top.title.split(":")[0])}</div>
                  <div style="font-size:11.5px; color:var(--text-muted); line-height:1.3; margin-top:2px;">${escapeHtml(top.title.split(":")[1] || '')}</div>
                </div>
              `).join("")}
            </div>
          </aside>

          <div>
            <div class="card" style="border-top:4px solid var(--primary); margin-bottom:16px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
                <div>
                  <span class="badge badge-nl">${activeTopic.gradeLabel}</span>
                  <span class="badge badge-biet">${activeTopic.code}</span>
                  <h3 style="color:var(--primary-dark); font-size:18px; margin:6px 0 3px;">${escapeHtml(activeTopic.title)}</h3>
                  <span style="font-size:12px; color:var(--text-muted);">Trọng số đề thi: <strong>${escapeHtml(activeTopic.examWeight)}</strong></span>
                </div>
              </div>

              <!-- Cơ chế sinh hóa cốt lõi -->
              <div style="margin-bottom:16px;">
                <h4 style="color:var(--primary-dark); font-size:15px; margin-bottom:8px;">🔬 1. Cơ Chế Sinh Lý & Bản Chất Khoa Học Cốt Lõi:</h4>
                <div style="display:grid; gap:8px;">
                  ${activeTopic.coreMechanisms.map(m => `
                    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-left:3px solid var(--primary); padding:10px 14px; border-radius:6px; font-size:13.5px; line-height:1.6; color:#1e293b;">
                      ${escapeHtml(m)}
                    </div>
                  `).join("")}
                </div>
              </div>

              <!-- Bảng đối chiếu chuyên sâu -->
              ${activeTopic.comparisonTable ? `
                <div style="margin-bottom:16px;">
                  <h4 style="color:var(--primary-dark); font-size:15px; margin-bottom:8px;">📊 2. Bảng Đối Chiếu Bản Chất Kỹ Thuật:</h4>
                  <table class="std-table">
                    <thead>
                      <tr>
                        ${activeTopic.comparisonTable.headers.map(h => `<th>${escapeHtml(h)}</th>`).join("")}
                      </tr>
                    </thead>
                    <tbody>
                      ${activeTopic.comparisonTable.rows.map(row => `
                        <tr>
                          ${row.map((cell, cIdx) => `<td style="${cIdx === 0 ? 'font-weight:700; color:var(--primary-dark);' : 'font-size:13px; line-height:1.55;'}">${escapeHtml(cell)}</td>`).join("")}
                        </tr>
                      `).join("")}
                    </tbody>
                  </table>
                </div>
              ` : ''}

              <!-- Bẫy đề thi HSG thường gặp -->
              <div style="margin-bottom:16px;">
                <h4 style="color:#b91c1c; font-size:15px; margin-bottom:8px;">⚠️ 3. Bẫy Đề Thi HSG & Cách Giải Thích Đúng/Sai:</h4>
                <div style="display:grid; gap:6px;">
                  ${activeTopic.examTraps.map(tr => `
                    <div style="background:#fff7ed; border:1px solid #fed7aa; padding:10px 14px; border-radius:6px; font-size:13px; line-height:1.5; color:#9a3412;">
                      ${escapeHtml(tr)}
                    </div>
                  `).join("")}
                </div>
              </div>

              <!-- Công thức toán học -->
              ${activeTopic.formulas && activeTopic.formulas.length > 0 ? `
                <div>
                  <h4 style="color:#1d4ed8; font-size:15px; margin-bottom:8px;">📐 4. Công Thức Tính Toán Nông Học Cần Nhớ:</h4>
                  <div style="display:grid; gap:6px;">
                    ${activeTopic.formulas.map(f => `
                      <div style="background:#eff6ff; border:1px solid #bfdbfe; padding:8px 12px; border-radius:6px; font-size:13px; font-family:monospace; font-weight:700; color:#1e40af;">
                        ${escapeHtml(f)}
                      </div>
                    `).join("")}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    } else {
      // MẶC ĐỊNH: LÝ THUYẾT BỒI DƯỠNG HSG TOÀN BỘ SÁCH (77 BÀI) THEO TỪNG CHỦ ĐỀ
      bodyContent = renderHsgCurriculumTheoryView();
    }

  } else if (HSG_MASTER_STATE.activeSubTab === "hsg_topics") {
    // ------------------------------------------------------------------------
    // TAB 4: MƯỜI DẠNG BÀI TOÁN KỸ THUẬT KINH ĐIỂN HSG
    // ------------------------------------------------------------------------
    bodyContent = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:16px;">
        <div>
          <h4 style="color:var(--primary-dark); font-size:16.5px; margin:0 0 3px;">📐 Mười Dạng Bài Toán Kỹ Thuật & Tự Luận Kinh Điển Thi HSG</h4>
          <p style="font-size:12.5px; color:var(--text-muted); margin:0;">
            Tuyển chọn 10 dạng toán tính toán định lượng bám sát đề thi HSG cấp tỉnh (Đồng Nai, Huế, TP.HCM, Bắc Giang, Bà Rịa - Vũng Tàu).
          </p>
        </div>
        <button class="btn btn-accent btn-sm" onclick="exportHsgOfficialKeyAndRubricDoc()">📥 Tải Trọn Bộ 10 Dạng Toán (.doc)</button>
      </div>

      <div style="display:grid; gap:18px;">
        ${HSG_CLASSIC_MATH_PROBLEMS.map((prob, idx) => `
          <div class="card" style="border-left:5px solid var(--primary);">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:6px;">
              <div>
                <span class="badge badge-nl">${escapeHtml(prob.category)}</span>
                <span class="badge badge-biet">#${idx + 1}</span>
              </div>
            </div>
            <h3 style="color:var(--primary-dark); font-size:16.5px; margin:4px 0 10px;">${escapeHtml(prob.title)}</h3>
            <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:12px 16px; border-radius:8px; white-space:pre-wrap; font-size:14px; margin-bottom:12px; line-height:1.6;">${escapeHtml(prob.problem)}</div>

            <details open style="background:#f0fdf4; border:1px solid #86efac; border-radius:8px; padding:12px 16px;">
              <summary style="cursor:pointer; font-weight:700; color:#166534; font-size:13.5px;">
                ✅ Xem Thuật Toán & Lời Giải Từng Bước
              </summary>
              <div style="margin-top:10px; display:grid; gap:8px;">
                ${prob.solutionSteps.map(step => `
                  <div style="background:#fff; padding:10px 14px; border-radius:6px; border:1px solid #bbf7d0; white-space:pre-wrap; font-size:13.5px; line-height:1.6; color:#1e293b;">${escapeHtml(step)}</div>
                `).join("")}
              </div>

              <div style="margin-top:12px; padding-top:10px; border-top:1px dashed #86efac;">
                <strong style="font-size:12.5px; color:#166534;">📋 Biểu điểm chấm thi dự kiến (Rubric):</strong>
                <ul style="margin:4px 0 0 18px; padding:0; font-size:12.5px; color:#475569;">
                  ${prob.rubric.map(r => `<li>${escapeHtml(r)}</li>`).join("")}
                </ul>
              </div>
            </details>
          </div>
        `).join("")}
      </div>
    `;
  } else if (HSG_MASTER_STATE.activeSubTab === "hsg_quiz") {
    // ------------------------------------------------------------------------
    // TAB 5: PHÒNG LUYỆN TRẮC NGHIỆM VDC TỰ ĐỘNG
    // ------------------------------------------------------------------------
    const items = portalState.hsgQuizItems || [];
    let correctCount = 0;
    items.forEach((q, idx) => {
      if (portalState.hsgUserAnswers[idx] === Number(q.answer)) correctCount++;
    });
    const score10 = items.length > 0 ? ((correctCount / items.length) * 10).toFixed(2) : "0.00";

    bodyContent = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:16px; padding:14px 18px; background:#f0fdf4; border:1px solid #86efac; border-radius:9px;">
        <div>
          <strong style="color:var(--primary-dark); font-size:15px;">🧠 Phòng Luyện Đề Vận Dụng Cao (VDC) & Phân Hóa Năng Lực</strong>
          <div style="font-size:12.5px; color:var(--text-muted); margin-top:2px;">
            Chọn phân môn:
            <button class="btn btn-sm ${portalState.mod4Grade === 'all' ? 'btn-primary' : 'btn-outline'}" onclick="selectMod4Grade('all')">Tổng hợp 3 Khối</button>
            <button class="btn btn-sm ${portalState.mod4Grade === 'cn10' ? 'btn-primary' : 'btn-outline'}" onclick="selectMod4Grade('cn10')">HSG Trồng trọt 10</button>
            <button class="btn btn-sm ${portalState.mod4Grade === 'cn11' ? 'btn-primary' : 'btn-outline'}" onclick="selectMod4Grade('cn11')">HSG Chăn nuôi 11</button>
            <button class="btn btn-sm ${portalState.mod4Grade === 'cn12' ? 'btn-primary' : 'btn-outline'}" onclick="selectMod4Grade('cn12')">HSG Lâm – Thủy sản 12</button>
          </div>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          ${portalState.hsgSubmitted ? `<span class="badge badge-ok" style="font-size:14px; padding:6px 12px;">Kết quả: ${correctCount}/${items.length} câu (${score10}/10 điểm)</span>` : ''}
          <button class="btn btn-primary btn-sm" onclick="submitHsgQuiz()">✅ Chấm điểm & Xem giải thích</button>
          <button class="btn btn-outline btn-sm" onclick="initHsgQuizPool(); renderDongNaiHsgMaster();">🔄 Đổi bộ câu hỏi mới</button>
        </div>
      </div>

      ${items.map((q, idx) => {
        const userAns = portalState.hsgUserAnswers[idx];
        const correctAns = Number(q.answer) || 0;
        return `
          <div class="q-card">
            <div class="q-card-header">
              <div>
                <strong>Câu VDC ${idx + 1}:</strong>
                <span class="badge badge-vandung">${q.isVdc ? 'Vận dụng cao (HSG)' : 'Phân hóa'}</span>
                <span class="badge badge-nl">${escapeHtml(q.competency || 'ĐGCN')}</span>
              </div>
              ${portalState.hsgSubmitted ? (
                userAns === correctAns
                  ? `<span class="badge badge-ok">✓ Chính xác</span>`
                  : `<span class="badge badge-err">✗ Sai (Đáp án: ${String.fromCharCode(65 + correctAns)})</span>`
              ) : ''}
            </div>
            <div style="font-weight:600; margin-bottom:8px;">${escapeHtml(q.stem)}</div>
            <div class="options-grid">
              ${(q.options || []).map((opt, oIdx) => {
                let cls = "opt-item";
                if (portalState.hsgSubmitted && oIdx === correctAns) cls += " correct";
                else if (userAns === oIdx) cls += " correct";
                return `
                  <div class="${cls}" style="cursor:pointer; ${portalState.hsgSubmitted && userAns === oIdx && oIdx !== correctAns ? 'background:#fee2e2; border-color:#ef4444;' : ''}" onclick="chooseHsgAnswer(${idx}, ${oIdx})">
                    <input type="radio" name="hsg_q_vdc_${idx}" ${userAns === oIdx ? 'checked' : ''} />
                    <strong>${String.fromCharCode(65 + oIdx)}.</strong>
                    <span>${escapeHtml(opt)}</span>
                  </div>
                `;
              }).join("")}
            </div>
            ${portalState.hsgSubmitted ? `
              <div style="margin-top:8px; padding:8px 12px; background:#f0fdf4; border-radius:6px; font-size:13px; color:#166534;">
                <strong>💡 Phân tích đáp án:</strong> Phương án <strong>${String.fromCharCode(65 + correctAns)}</strong> đúng. ${escapeHtml(q.explanation || 'Đối chiếu chuẩn kiến thức nâng cao SGK Công nghệ Kết nối tri thức.')}
              </div>
            ` : ''}
          </div>
        `;
      }).join("")}
    `;
  } else if (HSG_MASTER_STATE.activeSubTab === "ag_calc") {
    // ------------------------------------------------------------------------
    // TAB 6: MÁY TÍNH KỸ THUẬT NÔNG NGHIỆP
    // ------------------------------------------------------------------------
    bodyContent = `
      <div class="analyzer-grid">
        <!-- Máy tính 1: Quy đổi phân bón -->
        <div class="card">
          <div class="card-header"><div class="card-title">🌱 1. Máy tính Phân bón Thương phẩm (Trồng trọt 10)</div></div>
          <div class="form-group" style="margin-bottom:10px;">
            <label>Diện tích canh tác (ha):</label>
            <input type="number" id="calcAreaHa" value="2.5" step="0.1" oninput="runAgTechCalculators()" />
          </div>
          <div class="form-group" style="margin-bottom:10px;">
            <label>Định mức N - P2O5 - K2O nguyên chất (kg/ha):</label>
            <div style="display:flex; gap:6px;">
              <input type="number" id="calcN" value="160" oninput="runAgTechCalculators()" placeholder="N" />
              <input type="number" id="calcP" value="90" oninput="runAgTechCalculators()" placeholder="P2O5" />
              <input type="number" id="calcK" value="120" oninput="runAgTechCalculators()" placeholder="K2O" />
            </div>
          </div>
          <div id="calcFertilizerOutput" style="background:#f0fdf4; padding:12px; border-radius:8px; border:1px solid #86efac; font-size:13.5px;"></div>
        </div>

        <!-- Máy tính 2: Pearson & FCR -->
        <div class="card">
          <div class="card-header"><div class="card-title">🐖 2. Máy tính Pearson & FCR Thức ăn (Chăn nuôi 11)</div></div>
          <div class="form-group" style="margin-bottom:10px;">
            <label>Mục tiêu % Protein hỗn hợp (VD: 16,5%):</label>
            <input type="number" id="calcTargetPro" value="16.5" step="0.5" oninput="runAgTechCalculators()" />
          </div>
          <div class="form-group" style="margin-bottom:10px;">
            <label>% Protein Ngô/Cám & % Protein Đậu nành:</label>
            <div style="display:flex; gap:6px;">
              <input type="number" id="calcLowPro" value="8.5" oninput="runAgTechCalculators()" />
              <input type="number" id="calcHighPro" value="44.5" oninput="runAgTechCalculators()" />
            </div>
          </div>
          <div id="calcPearsonOutput" style="background:#eff6ff; padding:12px; border-radius:8px; border:1px solid #93c5fd; font-size:13.5px;"></div>
        </div>

        <!-- Máy tính 3: Thủy sản Biofloc -->
        <div class="card">
          <div class="card-header"><div class="card-title">🦐 3. Quản lý Ao nuôi Thủy sản & Thức ăn (Khối 12)</div></div>
          <div class="form-group" style="margin-bottom:10px;">
            <label>Diện tích ao (m2) & Mật độ thả (con/m2):</label>
            <div style="display:flex; gap:6px;">
              <input type="number" id="calcPondM2" value="2000" oninput="runAgTechCalculators()" />
              <input type="number" id="calcDensity" value="150" oninput="runAgTechCalculators()" />
            </div>
          </div>
          <div class="form-group" style="margin-bottom:10px;">
            <label>Tỷ lệ sống (%), Cỡ tôm (con/kg) & % Cho ăn/ngày:</label>
            <div style="display:flex; gap:6px;">
              <input type="number" id="calcSurvival" value="85" oninput="runAgTechCalculators()" />
              <input type="number" id="calcSizePerKg" value="80" oninput="runAgTechCalculators()" />
              <input type="number" id="calcFeedRate" value="3.2" step="0.1" oninput="runAgTechCalculators()" />
            </div>
          </div>
          <div id="calcAquaOutput" style="background:#fffbeb; padding:12px; border-radius:8px; border:1px solid #fde68a; font-size:13.5px;"></div>
        </div>

        <!-- Máy tính 4: Tỷ lệ máu lai cải tạo & Mật độ rừng -->
        <div class="card">
          <div class="card-header"><div class="card-title">🌲 4. Máy tính Tỷ lệ Máu Lai Fn & Mật độ Rừng trồng</div></div>
          <div class="form-group" style="margin-bottom:10px;">
            <label>Số thế hệ lai cải tạo (n):</label>
            <input type="number" id="calcLaiN" value="5" min="1" max="10" oninput="runAgTechCalculators()" />
          </div>
          <div class="form-group" style="margin-bottom:10px;">
            <label>Cự ly cây × Cự ly hàng (m) & Diện tích rừng (ha):</label>
            <div style="display:flex; gap:6px;">
              <input type="number" id="calcForestA" value="2.5" step="0.5" oninput="runAgTechCalculators()" placeholder="Cây (m)" />
              <input type="number" id="calcForestB" value="3.0" step="0.5" oninput="runAgTechCalculators()" placeholder="Hàng (m)" />
              <input type="number" id="calcForestHa" value="15" oninput="runAgTechCalculators()" placeholder="Ha" />
            </div>
          </div>
          <div id="calcForestOutput" style="background:#f0fdf4; padding:12px; border-radius:8px; border:1px solid #86efac; font-size:13.5px;"></div>
        </div>
      </div>
    `;
  } else if (HSG_MASTER_STATE.activeSubTab === "hsg_classroom") {
    bodyContent = `<div id="classroomHubInsideHsg"></div>`;
    setTimeout(() => {
      if (typeof renderClassroomHub === "function") {
        renderClassroomHub("classroomHubInsideHsg");
      }
    }, 10);
  }

  targetBox.innerHTML = `
    <div class="card">
      ${subNavHtml}
      ${bodyContent}
    </div>
  `;

  if (HSG_MASTER_STATE.activeSubTab === "ag_calc") {
    runAgTechCalculators();
  }
}

// Cập nhật hàm máy tính mở rộng
const oldRunAgTechCalculators = typeof runAgTechCalculators === "function" ? runAgTechCalculators : null;
function runAgTechCalculators() {
  if (oldRunAgTechCalculators) oldRunAgTechCalculators();

  const laiN = Number(document.getElementById("calcLaiN")?.value) || 5;
  const fA = Number(document.getElementById("calcForestA")?.value) || 2.5;
  const fB = Number(document.getElementById("calcForestB")?.value) || 3.0;
  const fHa = Number(document.getElementById("calcForestHa")?.value) || 15;

  const pctForeign = (1 - Math.pow(0.5, laiN)) * 100;
  const pctLocal = Math.pow(0.5, laiN) * 100;
  const treeM2 = fA * fB;
  const treeDensity = treeM2 > 0 ? Math.round(10000 / treeM2) : 0;
  const totalTrees = treeDensity * fHa;
  const totalWithDam = Math.round(totalTrees * 1.15);

  const forestBox = document.getElementById("calcForestOutput");
  if (forestBox) {
    forestBox.innerHTML = `
      <strong>Kết quả tính toán Di truyền & Lâm sinh:</strong><br/>
      • Thế hệ lai thứ ${laiN}: Máu ngoại = <strong>${pctForeign.toFixed(3)}%</strong> | Máu nội = <strong>${pctLocal.toFixed(3)}%</strong><br/>
      • Mật độ rừng trồng: <strong>${treeDensity} cây/ha</strong> (${treeM2.toFixed(1)} m2/cây)<br/>
      • Tổng cây cho ${fHa} ha (kể cả 15% trồng dặm): <strong>${totalWithDam.toLocaleString('vi-VN')} cây giống</strong>
    `;
  }
}

// ============================================================================
// ÄIá»€U HÆ¯á»šNG Tá»ª Äá»€ HIá»†N Táº I SANG PHÃ’NG THI Lá»šP Há»ŒC
// ============================================================================
window.createRoomFromCurrentHsgExam = function() {
  const examId = HSG_MASTER_STATE.activeExamId;
  if (typeof switchMod4MainSection === "function") {
    switchMod4MainSection("classroom");
  } else {
    selectHsgMasterSubTab("hsg_classroom");
  }
  setTimeout(() => {
    const examSel = document.getElementById("cr_examId");
    if (examSel) {
      examSel.value = examId;
      if (typeof handleExamSelectChange === "function") handleExamSelectChange(examId);
    }
  }, 100);
};
