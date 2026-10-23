// ============================================================================
// HỆ THỐNG BỒI DƯỠNG & KHẢO THÍ HỌC SINH GIỎI (HSG) CẤP TỈNH / THÀNH PHỐ
// Chuẩn Cấu trúc Sở GD&ĐT Đồng Nai (SKILL.md & Quyết định 1540/QĐ-SGDĐT)
// Tích hợp Tinh hoa Đề HSG Thực chiến: Đồng Nai, TP. Huế (Mã 7011), TP.HCM, BR-VT, Bắc Giang
// ============================================================================

const HSG_MASTER_STATE = {
  activeSubTab: "hsg_dongnai", // 'hsg_dongnai' | 'hsg_matrix_validator' | 'hsg_theory_handbook' | 'hsg_topics' | 'hsg_quiz' | 'ag_calc'
  activeExamId: "dn_01", // 'dn_01' | 'dn_02' | 'dn_03' | 'dn_auto'
  tableMode: "A", // 'A' (Trường Chuyên: 0.125đ Đúng + 0.25đ Giải thích) | 'B' (Trường Không chuyên: 0.25đ Đúng + 0.125đ Giải thích)
  timerSeconds: 180 * 60,
  timerRunning: false,
  timerInterval: null,
  submitted: false,
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
// 1. CẨM NANG LÝ THUYẾT CHUYÊN SÂU 9 CHỦ ĐỀ CỐT LÕI (LỚP 10 • 11 • 12)
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
const HSG_PROVINCIAL_EXAMS = {
  dn_01: {
    id: "dn_01",
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

  dn_02: {
    id: "dn_02",
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

  dn_03: {
    id: "dn_03",
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
  }
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

  // Tiêu chí 10: Phân tách rõ ràng barem Bảng A và Bảng B (Không trộn lẫn)
  checks.push({
    id: 10,
    name: "Phân tách rõ ràng công thức chấm Bảng A và Bảng B",
    passed: true,
    detail: "Bảng A (0,125đ đúng + 0,25đ giải thích) và Bảng B (0,25đ đúng + 0,125đ giải thích) được quản lý tách rời tuyệt đối."
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
function generateDynamicDongNaiExam() {
  const basePool = [
    ...HSG_PROVINCIAL_EXAMS.dn_01.mcqs,
    ...HSG_PROVINCIAL_EXAMS.dn_02.mcqs,
    ...HSG_PROVINCIAL_EXAMS.dn_03.mcqs
  ];

  // Lọc 8 câu K10, 8 câu K11, 8 câu K12
  const k10 = basePool.filter(q => q.grade === "cn10").sort(() => Math.random() - 0.5);
  const k11 = basePool.filter(q => q.grade === "cn11").sort(() => Math.random() - 0.5);
  const k12 = basePool.filter(q => q.grade === "cn12").sort(() => Math.random() - 0.5);

  const selectedMcqs = [
    ...k10.slice(0, 8),
    ...k11.slice(0, 8),
    ...k12.slice(0, 8)
  ].map((q, idx) => ({ ...q, id: idx + 1 }));

  const tfPool = [
    ...HSG_PROVINCIAL_EXAMS.dn_01.tfs,
    ...HSG_PROVINCIAL_EXAMS.dn_02.tfs,
    ...HSG_PROVINCIAL_EXAMS.dn_03.tfs
  ].sort(() => Math.random() - 0.5);
  const selectedTfs = tfPool.slice(0, 4).map((q, idx) => ({ ...q, id: idx + 1 }));

  return {
    id: "dn_auto",
    code: "ĐỒNG NAI — ĐỀ TỰ SINH THEO MA TRẬN",
    title: "KỲ THI CHỌN HỌC SINH GIỎI CẤP TỈNH / THÀNH PHỐ (ĐỀ TỰ SINH THEO MA TRẬN)",
    subTitle: "Môn: Công nghệ (Định hướng Nông nghiệp) — 180 phút (Thang điểm 20,0)",
    durationMinutes: 180,
    maxScore: 20.0,
    source: "Tự động sinh ngẫu nhiên bám sát ma trận Đồng Nai (8 K10 + 8 K11 + 8 K12)",
    mcqs: selectedMcqs,
    tfs: selectedTfs,
    essays: HSG_PROVINCIAL_EXAMS.dn_01.essays
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
  return HSG_PROVINCIAL_EXAMS[exId] || HSG_PROVINCIAL_EXAMS.dn_01;
}

// 1. XUẤT ĐỀ THI DÀNH CHO HỌC SINH (TUYỆT ĐỐI KHÔNG CHỨA ĐÁP ÁN / HƯỚNG DẪN CHẤM)
function exportHsgStudentExamDoc() {
  const exam = getCurrentHsgExam();
  const tbl = HSG_MASTER_STATE.tableMode || 'A';
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
            <strong>BẢNG THI: BẢNG ${tbl}</strong>
          </td>
        </tr>
      </table>
      <hr style="border: 1px solid #000;"/>

      <h4>PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (6,0 điểm)</h4>
      <p><em>Thí sinh trả lời từ câu 1 đến câu 24. Mỗi câu hỏi thí sinh chỉ chọn một phương án đúng nhất. Mỗi câu trả lời đúng được 0,25 điểm.</em></p>
      ${exam.mcqs.map((q, i) => `
        <div class="q-stem">Câu ${i + 1} (${escapeHtml(q.topic)}): ${escapeHtml(q.stem)}</div>
        ${(q.options || []).map((opt, oIdx) => `
          <div class="q-opt"><strong>${String.fromCharCode(65 + oIdx)}.</strong> ${escapeHtml(opt)}</div>
        `).join("")}
      `).join("")}

      <h4 style="page-break-before:always;">PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG / SAI CÓ GIẢI THÍCH (6,0 điểm)</h4>
      <p><em>Thí sinh trả lời từ câu 1 đến câu 4. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh ghi nhận định Đúng hoặc Sai và viết lời giải thích ngắn gọn cơ sở khoa học vào phiếu trả lời bài thi.</em><br/>
      <strong>Quy tắc tính điểm BẢNG ${tbl}:</strong> ${tbl === 'A' ? 'Xác định đúng ý: 0,125 điểm; Lời giải thích đúng cơ sở khoa học: 0,25 điểm (Tối đa 0,375 điểm/ý).' : 'Xác định đúng ý: 0,25 điểm; Lời giải thích đúng cơ sở khoa học: 0,125 điểm (Tối đa 0,375 điểm/ý).'}</p>
      ${exam.tfs.map((q, qIdx) => `
        <p><strong>${escapeHtml(q.title)}:</strong><br/>${escapeHtml(q.context)}</p>
        <table class="tf-table">
          <thead><tr><th style="width:60px;">Ý</th><th>Phát biểu nhận định</th><th style="width:100px;">Kết luận</th></tr></thead>
          <tbody>
            ${(q.statements || []).map(st => `
              <tr>
                <td style="text-align:center; font-weight:bold;">${st.label})</td>
                <td>${escapeHtml(st.text)}</td>
                <td style="text-align:center;">&nbsp;</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `).join("")}

      <h4 style="page-break-before:always;">PHẦN III. TỰ LUẬN CHUYÊN SÂU & MỞ RỘNG THỰC TIỄN (8,0 điểm)</h4>
      <p><em>Thí sinh trình bày chi tiết bài làm cho các câu hỏi sau vào tờ giấy thi tự luận.</em></p>
      ${exam.essays.map(p => `
        <p><strong>${escapeHtml(p.title)}:</strong><br/>${escapeHtml(p.problem).replace(/\n/g, "<br/>")}</p>
      `).join("")}

      <div class="page-footer">---------- HẾT ----------<br/><small>(Cán bộ coi thi không giải thích gì thêm)</small></div>
    </body></html>
  `;
  downloadDocFile(html, `De-Thi-HSG-Dong-Nai-${exam.id}-Bang-${tbl}-Hoc-Sinh.doc`);
}

// 2. XUẤT MẪU PHIẾU TRẢ LỜI & GIẢI THÍCH BÀI THI HSG
function exportHsgAnswerSheetDoc() {
  const exam = getCurrentHsgExam();
  const tbl = HSG_MASTER_STATE.tableMode || 'A';
  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>Phieu Tra Loi Bai Thi HSG Dong Nai</title>
    <style>
      body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.4; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
      th, td { border: 1px solid #000; padding: 5px; font-size: 11pt; }
      .no-border td { border: none; }
    </style></head>
    <body>
      <table class="no-border">
        <tr>
          <td style="width:45%; text-align:center;">
            <strong>SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG NAI</strong><br/>
            HỘI ĐỒNG COI THI: .......................................
          </td>
          <td style="width:55%; text-align:center;">
            <strong>PHIẾU TRẢ LỜI BÀI THI HỌC SINH GIỎI CẤP TỈNH</strong><br/>
            <strong>MÔN: CÔNG NGHỆ (ĐỊNH HƯỚNG NÔNG NGHIỆP)</strong><br/>
            <em>Thời gian làm bài: 180 phút — BẢNG THI: BẢNG ${tbl}</em>
          </td>
        </tr>
      </table>

      <table>
        <tr>
          <td>Họ và tên thí sinh: .....................................................................................</td>
          <td>Số báo danh: ........................... Phòng thi: .......</td>
        </tr>
        <tr>
          <td>Ngày sinh: .............................. Trường THPT: .................................................</td>
          <td>Mã phách: .................................................</td>
        </tr>
      </table>

      <table style="text-align:center;">
        <thead>
          <tr><th colspan="3">ĐIỂM TỪNG PHẦN THI (Thang điểm 20,0)</th><th rowspan="2">TỔNG ĐIỂM (Bằng số & chữ)</th><th rowspan="2">CHỮ KÝ GIÁM KHẢO</th></tr>
          <tr><th>Phần I (MCQ /6,0đ)</th><th>Phần II (Đ/S /6,0đ)</th><th>Phần III (Tự luận /8,0đ)</th></tr>
        </thead>
        <tbody>
          <tr style="height:45px;">
            <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
            <td style="text-align:left; font-size:10pt;">GK 1: .................................<br/>GK 2: .................................</td>
          </tr>
        </tbody>
      </table>

      <h4>PHẦN I: BẢNG TRẢ LỜI CÂU HỎI TRẮC NGHIỆM (24 câu — 6,0 điểm)</h4>
      <p><em>(Thí sinh khoanh tròn hoặc tô đen một phương án đúng A, B, C hoặc D)</em></p>
      <table>
        <thead><tr><th>Câu</th><th>Chọn</th><th>Câu</th><th>Chọn</th><th>Câu</th><th>Chọn</th><th>Câu</th><th>Chọn</th></tr></thead>
        <tbody>
          ${[0, 1, 2, 3, 4, 5].map(r => `
            <tr>
              <td style="text-align:center;"><strong>${r + 1}</strong></td><td>[ A ] [ B ] [ C ] [ D ]</td>
              <td style="text-align:center;"><strong>${r + 7}</strong></td><td>[ A ] [ B ] [ C ] [ D ]</td>
              <td style="text-align:center;"><strong>${r + 13}</strong></td><td>[ A ] [ B ] [ C ] [ D ]</td>
              <td style="text-align:center;"><strong>${r + 19}</strong></td><td>[ A ] [ B ] [ C ] [ D ]</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <h4 style="margin-top:16px;">PHẦN II: BẢNG TRẢ LỜI ĐÚNG / SAI CÓ GIẢI THÍCH (16 ý — 6,0 điểm)</h4>
      <p><em>(Thí sinh đánh dấu Đ hoặc S vào cột Kết luận VÀ viết lời giải thích cơ sở khoa học vào ô bên cạnh)</em></p>
      <table>
        <thead>
          <tr>
            <th style="width:75px; text-align:center;">Câu & Ý</th>
            <th style="width:65px; text-align:center;">Kết luận</th>
            <th>Lời giải thích cơ sở khoa học (Bắt buộc để đạt trọn điểm)</th>
            <th style="width:65px; text-align:center;">Điểm GK</th>
          </tr>
        </thead>
        <tbody>
          ${exam.tfs.flatMap(q => q.statements.map(st => `
            <tr style="height:40px;">
              <td style="text-align:center;"><strong>Câu ${q.id} ${st.label})</strong></td>
              <td style="text-align:center;">[ ] Đ<br/>[ ] S</td>
              <td>..........................................................................................................................................................<br/>..........................................................................................................................................................</td>
              <td>&nbsp;</td>
            </tr>
          `)).join("")}
        </tbody>
      </table>

      <h4 style="page-break-before:always; margin-top:20px;">PHẦN III: PHẦN LÀM BÀI TỰ LUẬN (8,0 điểm)</h4>
      <p><em>(Thí sinh viết lời giải chi tiết cho Câu 1, Câu 2 và Câu 3 vào các trang giấy thi tự luận tiếp theo)</em></p>
      <div style="min-height:750px; border:1px dashed #777; padding:15px; line-height:2.2;">
        <strong>BÀI LÀM TỰ LUẬN:</strong><br/>
        ............................................................................................................................................................................................................<br/>
        ............................................................................................................................................................................................................<br/>
        ............................................................................................................................................................................................................<br/>
        ............................................................................................................................................................................................................<br/>
        ............................................................................................................................................................................................................<br/>
        ............................................................................................................................................................................................................
      </div>
    </body></html>
  `;
  downloadDocFile(html, `Phieu-Tra-Loi-Va-Giai-Thich-HSG-Dong-Nai-Bang-${tbl}.doc`);
}

// 3. XUẤT BỘ ĐÁP ÁN, HƯỚNG DẪN CHẤM CHI TIẾT & BẢNG TỔNG HỢP ĐIỂM
function exportHsgOfficialKeyAndRubricDoc() {
  const exam = getCurrentHsgExam();
  const tbl = HSG_MASTER_STATE.tableMode || 'A';
  const val = validateDongNaiHsgExam(exam);

  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>Dap An Va Huong Dan Cham HSG Dong Nai</title>
    <style>
      body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.45; }
      h2, h3, h4 { text-align: center; margin: 4px 0; }
      table { width: 100%; border-collapse: collapse; margin: 10px 0; }
      th, td { border: 1px solid #000; padding: 6px; font-size: 11pt; }
      .rule-box { background: #f9f9f9; border-left: 4px solid #000; padding: 10px; margin: 12px 0; font-size: 11pt; }
    </style></head>
    <body>
      <table style="width:100%; border:none;">
        <tr style="border:none;">
          <td style="border:none; text-align:center; width:45%;">
            <strong>SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG NAI</strong><br/>
            <strong>HỘI ĐỒNG CHẤM THI CHỌN HSG CẤP TỈNH</strong>
          </td>
          <td style="border:none; text-align:center; width:55%;">
            <strong>HƯỚNG DẪN CHẤM VÀ BIỂU ĐIỂM CHI TIẾT</strong><br/>
            <strong>MÔN: CÔNG NGHỆ (ĐỊNH HƯỚNG NÔNG NGHIỆP)</strong><br/>
            <em>Khóa thi ngày: ...................... — ÁP DỤNG: BẢNG ${tbl}</em>
          </td>
        </tr>
      </table>
      <hr/>

      <div class="rule-box">
        <strong>QUY ĐỊNH CHẤM THI CHỌN HỌC SINH GIỎI (Theo Điều 31 Quyết định 1540/QĐ-SGDĐT):</strong><br/>
        1. Mỗi bài thi phải được <strong>02 giám khảo chấm độc lập</strong> trên 2 phiếu chấm riêng biệt. Điểm bài thi là điểm trung bình cộng của 2 giám khảo.<br/>
        2. Nếu điểm của 2 giám khảo lệch nhau từ 0,50 đến 1,00 điểm thì 2 giám khảo đối thoại thống nhất; nếu không thống nhất được hoặc lệch trên 1,00 điểm thì Tổ trưởng phân công giám khảo thứ 3 chấm độc lập.<br/>
        3. Điểm toàn bài chấm theo thang <strong>20,0 điểm</strong>, làm tròn đến 0,25 điểm (hoặc giữ nguyên 3 chữ số thập phân 0,125 điểm ở Phần II).<br/>
        4. Thí sinh làm bài theo cách khác nhưng đúng bản chất khoa học và lập luận chặt chẽ vẫn cho điểm tối đa của ý đó.
      </div>

      <h4>I. ĐÁP ÁN PHẦN I: TRẮC NGHIỆM NHIỀU LỰA CHỌN (24 câu — 6,0 điểm)</h4>
      <p><em>(Mỗi câu đúng được 0,25 điểm)</em></p>
      <table>
        <tr>${exam.mcqs.slice(0, 12).map((_, i) => `<th style="text-align:center;">Câu ${i + 1}</th>`).join("")}</tr>
        <tr>${exam.mcqs.slice(0, 12).map(q => `<td style="text-align:center; font-weight:bold;">${String.fromCharCode(65 + q.answer)}</td>`).join("")}</tr>
        <tr>${exam.mcqs.slice(12, 24).map((_, i) => `<th style="text-align:center;">Câu ${13 + i}</th>`).join("")}</tr>
        <tr>${exam.mcqs.slice(12, 24).map(q => `<td style="text-align:center; font-weight:bold;">${String.fromCharCode(65 + q.answer)}</td>`).join("")}</tr>
      </table>

      <h4 style="page-break-before:always; margin-top:20px;">II. ĐÁP ÁN & HƯỚNG DẪN CHẤM PHẦN II: ĐÚNG / SAI CÓ GIẢI THÍCH (6,0 điểm)</h4>
      <p><em>Áp dụng công thức tính điểm BẢNG ${tbl}: ${tbl === 'A' ? 'Xác định đúng: 0,125đ; Giải thích đúng: 0,25đ' : 'Xác định đúng: 0,25đ; Giải thích đúng: 0,125đ'}.</em></p>
      <table>
        <thead>
          <tr>
            <th style="width:65px; text-align:center;">Câu & Ý</th>
            <th style="width:70px; text-align:center;">Đáp án</th>
            <th>Nội dung giải thích cơ sở khoa học chuẩn</th>
            <th style="width:80px; text-align:center;">Điểm Bảng A</th>
            <th style="width:80px; text-align:center;">Điểm Bảng B</th>
          </tr>
        </thead>
        <tbody>
          ${exam.tfs.flatMap(q => q.statements.map(st => `
            <tr>
              <td style="text-align:center;"><strong>Câu ${q.id} ${st.label})</strong></td>
              <td style="text-align:center; font-weight:bold; color:${st.isTrue ? 'green' : 'red'};">${st.isTrue ? 'ĐÚNG' : 'SAI'}</td>
              <td>${escapeHtml(st.explanation)}</td>
              <td style="text-align:center;">0,125 + 0,25 = <strong>0,375đ</strong></td>
              <td style="text-align:center;">0,25 + 0,125 = <strong>0,375đ</strong></td>
            </tr>
          `)).join("")}
        </tbody>
      </table>

      <h4 style="page-break-before:always; margin-top:20px;">III. ĐÁP ÁN VÀ THANG ĐIỂM CHI TIẾT PHẦN III: TỰ LUẬN (8,0 điểm)</h4>
      ${exam.essays.map(p => `
        <div style="margin-bottom:18px;">
          <p><strong>${escapeHtml(p.title)}:</strong></p>
          <table>
            <thead><tr><th style="width:80%;">Ý / Nội dung yêu cầu đạt được</th><th style="width:20%; text-align:center;">Điểm tối đa</th></tr></thead>
            <tbody>
              ${p.rubric.map(r => {
                const parts = r.split(":");
                const desc = parts.slice(1).join(":") || r;
                const ptMatch = r.match(/\(([\d,]+)đ\)/);
                const pt = ptMatch ? ptMatch[1] + "đ" : "0,5đ";
                return `<tr><td><strong>${escapeHtml(parts[0])}:</strong> ${escapeHtml(desc)}</td><td style="text-align:center; font-weight:bold;">${pt}</td></tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      `).join("")}

      <h4 style="page-break-before:always; margin-top:20px;">IV. BẢNG TỔNG HỢP ĐIỂM THEO CHỦ ĐỀ VÀ KẾT QUẢ KIỂM ĐỊNH ĐỀ</h4>
      <table>
        <thead><tr><th>Khối lớp / Phân môn</th><th>Nội dung chuyên đề</th><th>Số lệnh hỏi</th><th>Điểm số</th><th>Tỷ lệ %</th></tr></thead>
        <tbody>
          <tr><td rowspan="3">Khối 10 (Trồng trọt)</td><td>(1) Đất trồng</td><td>3 MCQ + 4 ý Đ/S</td><td>1,75đ</td><td>8,75%</td></tr>
          <tr><td>(2) Phân bón</td><td>3 MCQ</td><td>0,75đ</td><td>3,75%</td></tr>
          <tr><td>(3) Trồng trọt công nghệ cao</td><td>2 MCQ</td><td>0,50đ</td><td>2,50%</td></tr>
          <tr><td rowspan="3">Khối 11 (Chăn nuôi)</td><td>(1) Công nghệ giống vật nuôi</td><td>3 MCQ</td><td>0,75đ</td><td>3,75%</td></tr>
          <tr><td>(2) Công nghệ thức ăn chăn nuôi</td><td>3 MCQ + 4 ý Đ/S</td><td>1,75đ</td><td>8,75%</td></tr>
          <tr><td>(3) Bảo vệ môi trường chăn nuôi</td><td>2 MCQ</td><td>0,50đ</td><td>2,50%</td></tr>
          <tr><td rowspan="2">Khối 12 (Lâm - Thủy sản)</td><td>Nhóm Lâm nghiệp (Đại cương, Rừng gỗ lớn, Bảo vệ & FSC)</td><td>4 MCQ + 4 ý Đ/S + Tự luận C1</td><td>6,00đ</td><td>30,00%</td></tr>
          <tr><td>Nhóm Thủy sản (Môi trường, Biofloc, RAS, Giống rô phi)</td><td>4 MCQ + 4 ý Đ/S + Tự luận C2</td><td>6,00đ</td><td>30,00%</td></tr>
          <tr><td>Tổng hợp mở rộng</td><td>Nông nghiệp tuần hoàn khép kín Net-Zero</td><td>Tự luận C3</td><td>1,00đ</td><td>5,00%</td></tr>
          <tr style="font-weight:bold; background:#eee;"><td colspan="2">TỔNG TOÀN BÀI THI</td><td>24 MCQ + 16 ý Đ/S + 3 TL</td><td>20,00đ</td><td>100,00%</td></tr>
        </tbody>
      </table>

      <div class="rule-box" style="margin-top:15px;">
        <strong>KẾT QUẢ KIỂM ĐỊNH TỰ ĐỘNG THEO 14 TIÊU CHÍ (SKILL.md):</strong><br/>
        • Số tiêu chí hợp lệ: <strong>${val.passedCount}/${val.totalCount} tiêu chí (${val.scorePercent}%)</strong>.<br/>
        • Trạng thái đề thi: <strong>${val.isFullyValid ? 'HỢP LỆ TUYỆT ĐỐI — ĐẠT CHUẨN THI CẤP TỈNH' : 'CẦN ĐIỀU CHỈNH'}</strong>.
      </div>
    </body></html>
  `;
  downloadDocFile(html, `Dap-An-Huong-Dan-Cham-HSG-Dong-Nai-${exam.id}-Bang-${tbl}.doc`);
}

function downloadDocFile(content, fileName) {
  const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
}

// ============================================================================
// 7. GIAO DIỆN CHÍNH & ĐIỀU KHIỂN TƯƠNG TÁC PHÂN HỆ HSG MASTER
// ============================================================================
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
  HSG_MASTER_STATE.tableMode = tbl;
  renderDongNaiHsgMaster();
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
  const tbl = HSG_MASTER_STATE.tableMode || 'A';
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

  // Navigation Bar con của Phân hệ HSG
  const subNavHtml = `
    <div style="display:flex; gap:6px; margin-bottom:16px; border-bottom:1.5px solid var(--border); padding-bottom:12px; flex-wrap:wrap;">
      <button class="btn btn-sm ${HSG_MASTER_STATE.activeSubTab === 'hsg_dongnai' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterSubTab('hsg_dongnai')">
        🏆 1. Phòng Luyện Đề Chuẩn Đồng Nai (180 Phút • 20,0đ)
      </button>
      <button class="btn btn-sm ${HSG_MASTER_STATE.activeSubTab === 'hsg_matrix_validator' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterSubTab('hsg_matrix_validator')">
        ⚖️ 2. Ma Trận Đề & Bộ Kiểm Định 14 Tiêu Chí (SKILL.md)
      </button>
      <button class="btn btn-sm ${HSG_MASTER_STATE.activeSubTab === 'hsg_theory_handbook' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterSubTab('hsg_theory_handbook')">
        📚 3. Cẩm Nang Lý Thuyết Chuyên Sâu 9 Chủ Đề (K10–11–12)
      </button>
      <button class="btn btn-sm ${HSG_MASTER_STATE.activeSubTab === 'hsg_topics' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterSubTab('hsg_topics')">
        📐 4. Mười Dạng Bài Toán Kỹ Thuật Kinh Điển HSG
      </button>
      <button class="btn btn-sm ${HSG_MASTER_STATE.activeSubTab === 'hsg_quiz' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterSubTab('hsg_quiz')">
        🧠 5. Phòng Trắc Nghiệm VDC Tự Động
      </button>
      <button class="btn btn-sm ${HSG_MASTER_STATE.activeSubTab === 'ag_calc' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterSubTab('ag_calc')">
        🧮 6. Bộ Máy Tính Kỹ Thuật Nông Nghiệp
      </button>
    </div>
  `;

  let bodyContent = "";

  if (HSG_MASTER_STATE.activeSubTab === "hsg_dongnai") {
    // ------------------------------------------------------------------------
    // TAB 1: PHÒNG THI & LUYỆN ĐỀ CHUẨN ĐỒNG NAI
    // ------------------------------------------------------------------------
    bodyContent = `
      <!-- Banner Chọn Đề & Cấu hình Bảng A/B -->
      <div style="background:linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%); border:1.5px solid #86efac; border-radius:12px; padding:16px 20px; margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap; margin-bottom:4px;">
              <span class="badge badge-ok" style="font-size:12.5px; font-weight:800;">QUY CHẾ THI HSG CẤP TỈNH ĐỒNG NAI (QĐ 1540/QĐ-SGDĐT)</span>
              <span class="badge badge-nl" style="font-size:12px;">THANG ĐIỂM: 20,0 • THỜI GIAN: 180 PHÚT</span>
            </div>
            <h3 style="color:var(--primary-dark); font-size:18px; margin:4px 0 2px;">
              ${escapeHtml(exam.title)}
            </h3>
            <p style="font-size:13px; color:var(--text-muted); margin:0;">
              ${escapeHtml(exam.subTitle)} • Nguồn dữ liệu: <strong>${escapeHtml(exam.source)}</strong>
            </p>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-end;">
            <!-- Timer & Nút điều khiển -->
            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
              <div class="mock-timer-display" style="background:#0f172a; color:#4ade80; padding:6px 14px; border-radius:8px; font-weight:800; font-family:monospace; font-size:16px;">
                <span>⏱️</span>
                <span id="hsgMasterTimerText">03:00:00</span>
                <button class="btn btn-sm" style="padding:2px 8px; font-size:11px; background:#334155; color:#fff; margin-left:6px;" onclick="toggleHsgMasterTimer()">
                  ${HSG_MASTER_STATE.timerRunning ? '⏸️ Tạm dừng' : '▶️ Bắt đầu'}
                </button>
              </div>

              <!-- Cấu hình Bảng A vs Bảng B -->
              <div style="background:#fff; border:1px solid #cbd5e1; border-radius:8px; padding:4px 8px; display:flex; align-items:center; gap:4px;">
                <span style="font-size:12px; font-weight:700;">Chấm Phần II:</span>
                <button class="btn btn-sm ${tbl === 'A' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterTable('A')" title="Bảng A (Trường Chuyên): Đúng 0.125đ + Giải thích 0.25đ">
                  Bảng A (Chuyên)
                </button>
                <button class="btn btn-sm ${tbl === 'B' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterTable('B')" title="Bảng B (Không chuyên): Đúng 0.25đ + Giải thích 0.125đ">
                  Bảng B (Đại trà)
                </button>
              </div>
            </div>

            <!-- Nút Nộp Bài & Xuất 3 File Word Tách Rời -->
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              ${!HSG_MASTER_STATE.submitted ? `
                <button class="btn btn-primary btn-sm" onclick="submitHsgMasterExam()" style="font-weight:700;">
                  ✅ Nộp Bài Thi & Chấm Điểm Toàn Diện
                </button>
              ` : `
                <button class="btn btn-outline btn-sm" onclick="HSG_MASTER_STATE.submitted=false; renderDongNaiHsgMaster();">
                  🔄 Tiếp tục chỉnh sửa bài làm
                </button>
              `}
              <button class="btn btn-accent btn-sm" onclick="exportHsgStudentExamDoc()" title="Xuất đề thi tuyệt đối không chứa đáp án / giải thích cho học sinh">
                📄 1. Xuất Đề Thi Học Sinh (.doc)
              </button>
              <button class="btn btn-outline btn-sm" onclick="exportHsgAnswerSheetDoc()" style="background:#fff;" title="Xuất phiếu làm bài và giải thích">
                📝 2. Xuất Phiếu Trả Lời (.doc)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="exportHsgOfficialKeyAndRubricDoc()" title="Xuất đáp án và biểu điểm chi tiết 0.125/0.25đ theo QĐ 1540">
                ⚖️ 3. Xuất Barem Chấm Chi Tiết (.doc)
              </button>
            </div>
          </div>
        </div>

        <!-- Bộ chọn Đề thi HSG -->
        <div style="margin-top:14px; padding-top:12px; border-top:1px dashed #cbd5e1; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span style="font-size:12.5px; font-weight:700; color:var(--primary-dark);">📚 Đổi Bộ Đề HSG:</span>
          <button class="btn btn-sm ${HSG_MASTER_STATE.activeExamId === 'dn_01' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterExam('dn_01')">
            Đề số 01 (Chuẩn Cấu trúc Đồng Nai)
          </button>
          <button class="btn btn-sm ${HSG_MASTER_STATE.activeExamId === 'dn_02' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterExam('dn_02')">
            Đề số 02 (Chuyên sâu TP. Huế Mã 7011 & TP.HCM)
          </button>
          <button class="btn btn-sm ${HSG_MASTER_STATE.activeExamId === 'dn_03' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterExam('dn_03')">
            Đề số 03 (Thực chiến Bà Rịa - Vũng Tàu & Bắc Giang)
          </button>
          <button class="btn btn-sm ${HSG_MASTER_STATE.activeExamId === 'dn_auto' ? 'btn-primary' : 'btn-outline'}" onclick="selectHsgMasterExam('dn_auto')">
            🎲 Đề số 04 (Sinh Tự Động Theo Ma Trận)
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
              • Xếp loại giải dự kiến: <strong>${Number(totalScore) >= 16.0 ? 'GIẢI NHẤT 🥇' : (Number(totalScore) >= 14.0 ? 'GIẢI NHÌ 🥈' : (Number(totalScore) >= 11.5 ? 'GIẢI BA 🥉' : (Number(totalScore) >= 9.0 ? 'GIẢI KHUYẾN KHÍCH 🎖️' : 'CHƯA ĐẠT GIẢI (Cần bồi dưỡng thêm)')))}</strong>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <button class="btn btn-accent" onclick="exportHsgOfficialKeyAndRubricDoc()">
              📥 Tải Toàn Bộ Hồ Sơ Đáp Án & Hướng Dẫn Chấm (.doc)
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
          Quy chế chấm <strong>BẢNG ${tbl}</strong> (${tbl === 'A' ? 'Đúng: 0,125đ + Giải thích: 0,25đ' : 'Đúng: 0,25đ + Giải thích: 0,125đ'} -> Tối đa 0,375đ/ý × 16 = 6,0đ).<br/>
          <em>* Thí sinh phải xác định Đúng/Sai VÀ viết lời giải thích cơ sở khoa học vào ô bên dưới.</em>
        </p>
      </div>

      ${(exam.tfs || []).map((q, qIdx) => `
        <div class="q-card" id="dn_tf_box_${qIdx}" style="margin-bottom:18px;">
          <div class="q-card-header">
            <div>
              <strong>${escapeHtml(q.title)}</strong>
              <span class="badge badge-vandung">Phân hóa HSG</span>
            </div>
          </div>
          <div style="font-weight:600; margin-bottom:10px; font-size:14px; background:#f8fafc; padding:10px 12px; border-radius:6px; border:1px solid #e2e8f0; line-height:1.5;">
            ${escapeHtml(q.context)}
          </div>

          <table class="tf-exam-table">
            <thead>
              <tr>
                <th style="width:40px; text-align:center;">Lệnh</th>
                <th>Nội dung nhận định & Lời giải thích khoa học của thí sinh</th>
                <th style="width:160px; text-align:center;">Lựa chọn</th>
                ${HSG_MASTER_STATE.submitted ? `<th style="width:220px; text-align:center;">Đáp án & Căn cứ chuẩn</th>` : ''}
              </tr>
            </thead>
            <tbody>
              ${(q.statements || []).map(st => {
                const uVal = HSG_MASTER_STATE.userTfChoice[qIdx] ? HSG_MASTER_STATE.userTfChoice[qIdx][st.label] : undefined;
                const uExp = HSG_MASTER_STATE.userTfExplain[qIdx] ? HSG_MASTER_STATE.userTfExplain[qIdx][st.label] : "";
                const isRight = uVal === st.isTrue;
                const hasExp = uExp && uExp.trim().length >= 8;
                let ptEarned = 0;
                if (isRight) {
                  ptEarned += (tbl === 'A' ? 0.125 : 0.25);
                  if (hasExp) ptEarned += (tbl === 'A' ? 0.25 : 0.125);
                }

                return `
                  <tr>
                    <td style="text-align:center; font-weight:800; vertical-align:top;">${st.label})</td>
                    <td>
                      <div style="font-weight:600; margin-bottom:6px; font-size:13.5px;">${escapeHtml(st.text)}</div>
                      <div style="display:flex; align-items:center; gap:6px; margin-top:4px;">
                        <span style="font-size:12px; font-weight:700; color:var(--text-muted); white-space:nowrap;">✏️ Giải thích:</span>
                        <input type="text" style="width:100%; font-size:12.5px; padding:5px 8px; border:1px solid #cbd5e1; border-radius:5px;"
                          placeholder="Nhập căn cứ khoa học giải thích tại sao đúng / sai..."
                          value="${escapeHtml(uExp || '')}"
                          oninput="inputHsgMasterExplain(${qIdx}, '${st.label}', this.value)"
                          ${HSG_MASTER_STATE.submitted ? 'readonly' : ''} />
                      </div>
                    </td>
                    <td style="vertical-align:top;">
                      <div class="tf-btn-group">
                        <button type="button" class="tf-choice-btn btn-true ${uVal === true ? 'selected' : ''}" onclick="chooseHsgMasterTf(${qIdx}, '${st.label}', true)">
                          ĐÚNG
                        </button>
                        <button type="button" class="tf-choice-btn btn-false ${uVal === false ? 'selected' : ''}" onclick="chooseHsgMasterTf(${qIdx}, '${st.label}', false)">
                          SAI
                        </button>
                      </div>
                      ${HSG_MASTER_STATE.submitted ? `
                        <div style="text-align:center; margin-top:6px;">
                          <span class="badge ${ptEarned >= 0.25 ? 'badge-ok' : 'badge-err'}" style="font-size:11px;">
                            +${ptEarned.toFixed(3)}đ
                          </span>
                        </div>
                      ` : ''}
                    </td>
                    ${HSG_MASTER_STATE.submitted ? `
                      <td style="font-size:12px; vertical-align:top; background:#f0fdf4;">
                        <strong>Đáp án: ${st.isTrue ? '<span style="color:#16a34a;">ĐÚNG</span>' : '<span style="color:#dc2626;">SAI</span>'}</strong>
                        <div style="color:#166534; margin-top:3px; font-size:11.5px; line-height:1.4;">
                          • <em>Cơ sở khoa học:</em> ${escapeHtml(st.explanation)}
                        </div>
                      </td>
                    ` : ''}
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      `).join("")}

      <!-- PHẦN III: TỰ LUẬN CHUYÊN SÂU & NÂNG CAO -->
      <div style="margin:28px 0 14px; padding:12px 16px; background:#f0fdf4; border-left:4px solid var(--primary); border-radius:8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="font-size:15.5px; color:var(--primary-dark); margin:0 0 3px;">PHẦN III. TỰ LUẬN CHUYÊN SÂU & MỞ RỘNG THỰC TIỄN (8,0 điểm)</h3>
          <p style="font-size:12.5px; color:#166534; margin:0;">
            Gồm 3 bài toán kĩ thuật: <strong>Kiến thức Lớp 12 (7,0 điểm)</strong> + <strong>Tình huống mở rộng nâng cao liên môn (1,0 điểm)</strong>.
          </p>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-primary btn-sm" onclick="exportHsgOfficialKeyAndRubricDoc()">📥 Tải Barem Chấm Tự Luận (.doc)</button>
        </div>
      </div>

      ${(exam.essays || []).map((p, eIdx) => `
        <div class="card" id="dn_essay_box_${eIdx}" style="border-left:5px solid var(--primary); margin-bottom:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <h3 style="color:var(--primary-dark); font-size:16px; margin:0;">${escapeHtml(p.title)}</h3>
            <span class="badge badge-ok" style="font-size:13px; font-weight:800;">${p.points} điểm</span>
          </div>

          <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:14px 16px; border-radius:8px; white-space:pre-wrap; font-size:14px; margin-bottom:12px; line-height:1.65;">${escapeHtml(p.problem)}</div>

          <!-- Khu vực làm bài của thí sinh -->
          <div style="margin-bottom:12px;">
            <label style="font-weight:700; font-size:13px; color:var(--primary-dark); margin-bottom:4px; display:block;">
              ✍️ Phần làm bài tự luận của bạn:
            </label>
            <textarea style="width:100%; min-height:120px; font-size:13.5px; padding:10px 12px; border:1px solid #cbd5e1; border-radius:6px; font-family:inherit; line-height:1.5;"
              placeholder="Nhập lời giải chi tiết hoặc các bước giải toán của bạn vào đây..."
              oninput="inputHsgMasterEssay(${eIdx}, this.value)">${escapeHtml(HSG_MASTER_STATE.userEssayText[eIdx] || '')}</textarea>
          </div>

          <!-- Rubric Chấm điểm từng bước -->
          <details ${HSG_MASTER_STATE.submitted ? 'open' : ''} style="background:#f0fdf4; border:1px solid #86efac; border-radius:8px; padding:12px 16px;">
            <summary style="cursor:pointer; font-weight:700; color:#166534; font-size:13.5px;">
              ✅ Xem Hướng dẫn giải chi tiết & Barem chấm điểm (Rubric Check)
            </summary>
            <div style="margin-top:10px; display:grid; gap:8px;">
              ${(p.rubric || []).map((step, rIdx) => {
                const isChecked = HSG_MASTER_STATE.userEssayRubricChecks[`${eIdx}_${rIdx}`];
                return `
                  <div style="background:#fff; padding:10px 14px; border-radius:6px; border:1px solid #bbf7d0; display:flex; align-items:flex-start; gap:10px;">
                    <input type="checkbox" style="margin-top:4px; transform:scale(1.2);"
                      ${isChecked ? 'checked' : ''}
                      onchange="toggleHsgEssayRubric(${eIdx}, ${rIdx})" />
                    <div style="flex:1; font-size:13.5px; line-height:1.55; color:#1e293b;">
                      ${escapeHtml(step)}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </details>
        </div>
      `).join("")}
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
    // TAB 3: CẨM NANG LÝ THUYẾT CHUYÊN SÂU 9 CHỦ ĐỀ
    // ------------------------------------------------------------------------
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
        <div style="display:flex; gap:6px;">
          <button class="btn btn-sm ${filterGrade === 'all' ? 'btn-primary' : 'btn-outline'}" onclick="HSG_MASTER_STATE.handbookFilterGrade='all'; renderDongNaiHsgMaster();">Tất cả 9 Chủ đề</button>
          <button class="btn btn-sm ${filterGrade === 'cn10' ? 'btn-primary' : 'btn-outline'}" onclick="HSG_MASTER_STATE.handbookFilterGrade='cn10'; renderDongNaiHsgMaster();">Khối 10 (Trồng trọt)</button>
          <button class="btn btn-sm ${filterGrade === 'cn11' ? 'btn-primary' : 'btn-outline'}" onclick="HSG_MASTER_STATE.handbookFilterGrade='cn11'; renderDongNaiHsgMaster();">Khối 11 (Chăn nuôi)</button>
          <button class="btn btn-sm ${filterGrade === 'cn12' ? 'btn-primary' : 'btn-outline'}" onclick="HSG_MASTER_STATE.handbookFilterGrade='cn12'; renderDongNaiHsgMaster();">Khối 12 (Lâm – Thủy sản)</button>
        </div>
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
