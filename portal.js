// Bộ điều khiển trung tâm cho Hệ sinh thái 4 Phân hệ Công nghệ Nông nghiệp (Lớp 10, 11, 12)
// Phần 1: Kiến thức tóm tắt từng bài, câu hỏi nâng cao & Công cụ phân tích lý thuyết
// Phần 2: Tổng hợp 77 bài giảng PPT trình chiếu & dạy nhanh (+ 42 Chuyên đề)
// Phần 3: Soạn đề theo học kì (Chuẩn Công văn 7991 - 6 bước + Kho 97 Đề học kì)
// Phần 4: Ôn tập Học sinh giỏi (HSG), Máy tính Kĩ thuật Nông nghiệp & 48 Đề chính thức Bộ GD&ĐT

const portalState = {
  activeModule: 1, // 1, 2, 3, 4
  // Phần 1: Lý thuyết & Phân tích
  mod1Grade: "cn10",
  mod1Search: "",
  mod1LessonId: "cn10_b1",
  mod1SubTab: "summary", // 'summary' | 'mindmap' | 'flashcard' | 'analyzer' | 'advanced_q'
  analyzerCustomQuery: "",
  mod1MindmapCollapsed: {},
  mod1FlashcardIdx: 0,
  mod1FlashcardFlipped: false,
  mod1FlashcardKnown: {},
  mod1FlashcardMode: "single", // 'single' | 'grid'
  mod1FlashcardsList: [],
  // Phần 2: Bài giảng PPT & Dạy nhanh
  mod2Grade: "cn10",
  mod2Search: "",
  mod2LessonId: "cn10_b1",
  mod2SlideIndex: 0,
  mod2RevealQuizAnswer: false,
  timerSeconds: 0,
  timerInterval: null,
  // Phần 3: Kho 97 Đề thi học kì mẫu
  mod3ExamGradeFilter: "all",
  mod3ShowArchive: false,
  // Phần 4: Hệ sinh thái Khảo thí Kép (Ôn thi HSG & Luyện thi Tốt nghiệp THPT chuẩn Bộ GD&ĐT)
  mod4MainSection: "graduation", // 'hsg' | 'graduation'
  // Phân hệ A: Ôn HSG
  mod4HsgSubTab: "hsg_quiz", // 'hsg_quiz' | 'hsg_topics' | 'ag_calc'
  mod4Grade: "all",
  hsgQuizItems: [],
  hsgUserAnswers: {},
  hsgSubmitted: false,
  // Phân hệ B: Luyện thi Tốt nghiệp THPT chuẩn Bộ GD&ĐT
  gradExamId: "bo_2025_sample", // 'bo_2025_sample' | 'bo_2026_0701' | 'bo_2026_0702' | 'simulated_03' | 'simulated_auto'
  gradExamSubTab: "mock_test", // 'mock_test' | 'analysis' | 'ministry_48'
  gradExamTitle: "Đề Tham Khảo Tốt Nghiệp THPT 2025 — Bộ GD&ĐT (Mẫu chuẩn định dạng mới)",
  gradExamItems: { mcq: [], tf: [] },
  gradUserMcqAnswers: {},
  gradUserTfAnswers: {},
  gradTimerSeconds: 50 * 60,
  gradTimerRunning: false,
  gradTimerInterval: null,
  gradSubmitted: false,
  gradScore: null
};

// Dữ liệu Chuyên sâu cho Công cụ Phân tích Lý thuyết (Phần 1) & Bồi dưỡng HSG (Phần 4)
const THEORY_DEEP_MODELS = [
  {
    id: "tm_phanbon",
    grade: "cn10",
    title: "So sánh & Phân tích Bản chất 3 Nhóm Phân bón (Hóa học – Hữu cơ – Vi sinh)",
    keywords: ["phân bón", "hóa học", "hữu cơ", "vi sinh", "cố định đạm", "chuyển hóa lân", "bón lót", "bón thúc"],
    corePrinciple: "Cây trồng hấp thụ dinh dưỡng khoáng chủ yếu qua hệ rễ dưới dạng ion hòa tan trong dung dịch đất (NH4+, NO3-, H2PO4-, K+). Tuy nhiên, hiệu quả hấp thụ phụ thuộc chặt chẽ vào kết cấu đất, hệ keo đất và quần xã vi sinh vật vùng rễ (Rhizosphere).",
    comparisonTable: {
      headers: ["Tiêu chí đối chiếu", "Phân bón Hóa học (Vô cơ)", "Phân bón Hữu cơ", "Phân bón Vi sinh vật"],
      rows: [
        ["Hàm lượng dinh dưỡng", "Cao, xác định rõ tỷ lệ N-P-K, đa lượng", "Thấp hơn nhưng đầy đủ đa – trung – vi lượng", "Chứa chủng VSV sống đặc hiệu (≥ 10^8 CFU/g hoặc ml)"],
        ["Tốc độ phát huy tác dụng", "Nhanh (dễ tan), thích hợp bón thúc", "Chậm (cần thời gian khoáng hóa), thích hợp bón lót", "Phát huy bền vững khi VSV nhân sinh khối trong đất"],
        ["Tác động đến đất trồng", "Bón nhiều, liên tục gây chua hóa, chai cứng đất, giảm VSV", "Tăng mùn, tạo kết cấu viên đoàn lạp, giữ ẩm – giữ phân tốt", "Cải tạo hệ sinh thái đất, cố định N2, hòa tan lân khó tiêu"],
        ["Nguyên tắc bảo quản & dùng", "Chống ẩm, chống nóng, không trộn phân đạm (NH4+) với vôi", "Phải ủ hoai mục hoàn toàn (60–70°C) để diệt mầm bệnh", "Tránh ánh nắng trực tiếp, không trộn chung với thuốc hóa học/vôi"]
      ]
    },
    whyQuestions: [
      {
        q: "Vì sao tuyệt đối không trộn phân đạm Amoni (NH4Cl, (NH4)2SO4) hoặc phân Lân Super với Vôi (CaO, Ca(OH)2) trước khi bón?",
        a: "Vì môi trường kiềm của vôi sẽ tác dụng với ion NH4+ giải phóng khí NH3 bay hơi làm mất đạm (NH4+ + OH- → NH3↑ + H2O); đồng thời Ca2+ tác dụng với H2PO4- tạo kết tủa Ca3(PO4)2 không tan làm cây không hút được lân."
      },
      {
        q: "Vì sao khi ủ phân hữu cơ chuồng trại, đống ủ phải đạt nhiệt độ 60–70°C nhưng khi bảo quản phân vi sinh thương phẩm lại phải để nơi mát (< 30°C)?",
        a: "Khi ủ phân chuồng, nhiệt độ 60–70°C do vi sinh vật ưa nhiệt tạo ra giúp tiêu diệt hạt cỏ dại, trứng giun sán và mầm bệnh. Ngược lại, phân vi sinh thương phẩm chứa các chủng VSV có ích đang ở trạng thái nghỉ/hoạt động, nếu gặp nhiệt độ cao hoặc tia UV sẽ làm chết tế bào vi sinh vật."
      }
    ],
    commonTraps: [
      "Nhầm lẫn rằng phân vi sinh cung cấp trực tiếp hàm lượng đạm/lân hóa học cực cao ngay lập tức (thực chất VSV chuyển hóa N2 không khí hoặc lân khó tan trong đất thành dạng dễ tiêu).",
      "Nhầm lẫn bón phân hữu cơ tươi trực tiếp vào gốc cây giúp cây tốt nhanh (thực tế phân tươi phân hủy sinh nhiệt, khí độc CH4, H2S và axit hữu cơ làm thối rễ, kèm mầm bệnh)."
    ]
  },
  {
    id: "tm_keodat",
    grade: "cn10",
    title: "Cấu tạo Hạt keo đất, Khả năng Hấp phụ & Cơ chế Cải tạo Đất chua – Đất mặn",
    keywords: ["keo đất", "đất chua", "đất mặn", "pH", "bón vôi", "keo âm", "keo dương", "thủy canh"],
    corePrinciple: "Hạt keo đất có cấu tạo gồm: Nhân keo → Tầng phân tử quyết định điện (ion quyết định dấu âm hoặc dương) → Tầng ion bất động → Tầng ion khuếch tán (nơi diễn ra sự trao đổi ion với dung dịch đất). Hầu hết đất nông nghiệp mang keo âm nên có khả năng giữ các cation dinh dưỡng (NH4+, K+, Ca2+, Mg2+).",
    comparisonTable: {
      headers: ["Loại đất có vấn đề", "Nguyên nhân & Bản chất hóa lí", "Chỉ số chẩn đoán", "Giải pháp Kĩ thuật Cải tạo gốc"],
      rows: [
        ["Đất chua & Đất phèn", "Tích tụ nhiều H+, Al3+, Fe3+ và SO4(2-) do rửa trôi Ca2+, Mg2+ hoặc oxy hóa tầng sinh phèn (FeS2)", "pH < 5,5 (Đất rất chua khi pH < 4,5)", "Bón vôi (CaCO3, CaO) để Ca2+ đẩy H+, Al3+ ra khỏi keo đất; kết hợp thủy lợi thau chua rửa phèn"],
        ["Đất mặn (Nhiễm mặn)", "Xâm nhập mặn nước biển hoặc bốc hơi nước ngầm làm tích tụ muối tan NaCl, Na2SO4; Na+ chiếm chỗ trên keo đất", "EC > 4 dS/m; nồng độ muối tan cao", "Đắp đê ngăn mặn, bón thạch cao (CaSO4) hoặc vôi để Ca2+ đẩy Na+ ra khỏi keo đất rồi tháo nước ngọt rửa mặn"],
        ["Đất xám bạc màu", "Đất dốc thoải, thành phần cơ giới nhẹ (nhiều cát, ít sét và mùn), rửa trôi mạnh, nghèo dinh dưỡng, tầng canh tác mỏng", "Nghèo mùn, nghèo sét, chua", "Cày sâu dần kết hợp bón tăng cường phân hữu cơ, trồng cây phân xanh (họ Đậu), luân canh hợp lí"]
      ]
    },
    whyQuestions: [
      {
        q: "Vì sao bón vôi cải tạo đất chua cần kết hợp bón phân hữu cơ mà không nên chỉ bón vôi đơn độc liên tục nhiều năm?",
        a: "Nếu chỉ bón vôi liên tục (" + '"Bón vôi nhiều đất giàu cha, khó con"' + "), Ca2+ đẩy hết các cation dinh dưỡng (K+, Mg2+, NH4+) từ keo đất ra dung dịch đất khiến cây hút mạnh lúc đầu nhưng phần lớn bị nước mưa rửa trôi làm đất kiệt quệ. Kết hợp phân hữu cơ giúp tăng keo mùn giữ chặt dinh dưỡng."
      }
    ],
    commonTraps: [
      "Nhầm lẫn lớp ion quyết định điện nằm ở ngoài cùng của hạt keo (thực chất nằm sát nhân keo; lớp ngoài cùng trao đổi với đất là tầng ion khuếch tán).",
      "Nhầm lẫn dùng nước biển hoặc phân đạm chua sinh lí để cải tạo đất phèn."
    ]
  },
  {
    id: "tm_channuoi_benh",
    grade: "cn11",
    title: "Phân tích Miễn dịch học – Vaccine – Chuồng kín Công nghệ cao & Phòng dịch Chăn nuôi",
    keywords: ["vaccine", "dịch tả lợn", "cúm gia cầm", "chuồng kín", "vietgap", "biogas", "đệm lót", "thức ăn", "chọn giống"],
    corePrinciple: "Phòng bệnh chủ động bằng An toàn sinh học và Vaccine là trụ cột của chăn nuôi hiện đại. Vaccine đưa kháng nguyên (đã làm yếu, bất hoạt hoặc tái tổ hợp gene) vào cơ thể vật nuôi khỏe mạnh để kích thích hệ miễn dịch chủ động sinh kháng thể đặc hiệu và tế bào nhớ miễn dịch.",
    comparisonTable: {
      headers: ["Tiêu chí kỹ thuật", "Vaccine truyền thống (Nhược độc / Vô hoạt)", "Vaccine Công nghệ tái tổ hợp / ADN", "Huyết thanh kháng thể / Thuốc kháng sinh"],
      rows: [
        ["Bản chất sinh học", "Sử dụng toàn bộ mầm bệnh đã làm suy yếu hoặc giết chết", "Chỉ tách lấy đoạn gene mã hóa protein kháng nguyên đặc hiệu cấy vào thể truyền", "Kháng thể có sẵn (huyết thanh) hoặc chất diệt/ức chế vi khuẩn (kháng sinh)"],
        ["Độ an toàn sinh học", "Vaccine nhược độc có nguy cơ nhỏ phục hồi độc lực nếu bảo quản/dùng sai", "An toàn tuyệt đối, không chứa mầm bệnh nguyên vẹn, không thể gây phát bệnh", "Kháng sinh dễ gây nhờn thuốc và tồn dư trong thịt, trứng, sữa"],
        ["Đối tượng áp dụng", "Tiêm cho vật nuôi khỏe mạnh để phòng bệnh trước khi có dịch", "Tiêm phòng chủ động độ chính xác cao, đáp ứng miễn dịch bền vững", "Dùng điều trị khi vật nuôi đã nhiễm bệnh (kháng sinh chỉ diệt vi khuẩn, KHÔNG diệt được virus)"]
      ]
    },
    whyQuestions: [
      {
        q: "Vì sao khi lợn mắc bệnh Dịch tả lợn châu Phi (ASF) hoặc bệnh Tai xanh do virus, việc tiêm thuốc kháng sinh liều cao vẫn không thể tiêu diệt được tác nhân chính gây bệnh?",
        a: "Vì kháng sinh chỉ tác động lên vách tế bào hoặc ribosome của vi khuẩn, trong khi virus ký sinh nội bào bắt buộc và không có cấu trúc tế bào như vi khuẩn. Khi bệnh do virus chỉ dùng kháng sinh để chống phụ nhiễm vi khuẩn kế phát (với các bệnh cho phép điều trị), còn với ASF phải tiêu hủy và khử trùng ổ dịch theo quy định thú y."
      },
      {
        q: "Vì sao hệ thống chuồng kín (lắp quạt hút công suất lớn ở một đầu và tấm Cooling Pad ở đầu đối diện) lại giúp vật nuôi giảm stress nhiệt và giảm hệ số tiêu tốn thức ăn (FCR)?",
        a: "Quạt hút tạo áp suất âm bên trong chuồng, buộc không khí nóng bên ngoài phải đi xuyên qua màng nước Cooling Pad; quá trình bay hơi nước thu nhiệt làm giảm nhiệt độ không khí vào chuồng từ 5–8°C. Vật nuôi sống trong vùng nhiệt độ tối ưu (thermoneutral zone) không phải tiêu tốn năng lượng chống nóng, ăn khỏe và chuyển hóa thức ăn thành thịt/trứng hiệu quả nhất."
      }
    ],
    commonTraps: [
      "Nhầm lẫn dùng vaccine tiêm cho vật nuôi đang sốt cao, ủ bệnh để chữa bệnh cấp tốc (sẽ làm bệnh nặng thêm do hệ miễn dịch đang suy sụp).",
      "Nhầm lẫn kháng sinh có thể trị khỏi hoàn toàn các bệnh do virus như Cúm gia cầm H5N1 hay Lở mồm long móng."
    ]
  },
  {
    id: "tm_lamthuy_ras_biofloc",
    grade: "cn12",
    title: "Phân tích Sinh thái Rừng – Thủy hóa Ao nuôi (DO, pH, NH3) & Công nghệ RAS / Biofloc",
    keywords: ["lâm nghiệp", "rừng phòng hộ", "tỉa thưa", "thủy sản", "biofloc", "ras", "vietgap", "iuu", "oxy hòa tan", "pH"],
    corePrinciple: "Trong nuôi trồng thủy sản thâm canh, thức ăn dư thừa và chất thải của tôm/cá phân hủy sinh ra tổng đạm amoni (TAN = NH4+ + NH3). Khi nhiệt độ và pH nước tăng cao (pH > 8,5), cân bằng chuyển dịch mạnh sang dạng khí NH3 không phân li cực độc đối với mang và hệ thần kinh thủy sản.",
    comparisonTable: {
      headers: ["Đặc điểm kỹ thuật", "Ao nuôi truyền thống (Đất/Bạt thường)", "Công nghệ Biofloc (BFT)", "Hệ thống Tuần hoàn khép kín (RAS)"],
      rows: [
        ["Cơ chế xử lí chất thải N", "Phụ thuộc tảo tự nhiên và thay nước thường xuyên", "Bổ sung nguồn Carbon (rỉ đường, tinh bột) duy trì tỷ lệ C:N ≈ 12–20:1 để vi khuẩn dị dưỡng đồng hóa TAN thành hạt sinh khối Biofloc", "Lọc cơ học (tách phân rắn) → Lọc sinh học (vi khuẩn Nitrosomonas & Nitrobacter chuyển NH3 → NO2- → NO3-) → Khử trùng UV/Ozone → Cấp oxy"],
        ["Tận dụng dinh dưỡng", "Thất thoát lớn qua bùn đáy và nước xả thải", "Hạt Biofloc giàu protein (30–45%) trở thành nguồn thức ăn tươi sống tại chỗ cho tôm, cá rô phi (giảm 15–20% FCR)", "Kiểm soát hoàn toàn khẩu phần, không phụ thuộc thời tiết bên ngoài"],
        ["Yêu cầu vận hành", "Chi phí đầu tư thấp nhưng rủi ro dịch bệnh và ô nhiễm cao", "Phải sục khí liên tục 24/24h (DO ≥ 5 mg/L) để giữ hạt floc lơ lửng và cung cấp oxy cho vi khuẩn dị dưỡng", "Vốn đầu tư thiết bị và chi phí điện năng, kỹ thuật vận hành cao nhất"]
      ]
    },
    whyQuestions: [
      {
        q: "Vì sao tôm, cá trong ao nuôi thâm canh giàu tảo thường có hiện tượng 'nổi đầu' hàng loạt vào lúc nửa đêm về sáng (3h – 5h sáng) hoặc những ngày trời âm u, sắp mưa dông?",
        a: "Ban ngày tảo quang hợp nhả O2 làm DO rất cao, nhưng ban đêm tảo ngừng quang hợp và cùng với tôm cá, vi sinh vật đáy ao hô hấp tiêu thụ mạnh O2 khiến DO giảm thấp nhất vào lúc 3h–5h sáng. Đồng thời ban đêm CO2 tích tụ làm pH giảm. Khi thiếu oxy hòa tan (DO < 3 mg/L), tôm cá phải nổi lên tầng mặt đớp không khí."
      },
      {
        q: "Trong lâm nghiệp (Bài 4 & Bài 5 CN12), vì sao hoạt động tỉa cành và tỉa thưa rừng trồng lấy gỗ lại phải tiến hành đúng giai đoạn khép tán?",
        a: "Khi rừng bắt đầu khép tán, sự cạnh tranh ánh sáng, nước và dinh dưỡng giữa các cây diễn ra gay gắt. Tỉa cành giúp thân cây vươn thẳng, giảm mắt gỗ xấu; tỉa thưa loại bỏ cây cong queo, sâu bệnh, chèn ép giúp mật độ rừng tối ưu để những cây giữ lại tăng trưởng nhanh đường kính (D1.3) và trữ lượng gỗ thương phẩm."
      }
    ],
    commonTraps: [
      "Nhầm lẫn trong công nghệ Biofloc chỉ cần tắt quạt nước vào ban đêm để tiết kiệm điện (nếu ngừng sục khí, hạt floc lắng xuống đáy phân hủy yếm khí làm cạn kiệt O2 và sinh H2S gây chết tôm hàng loạt trong vài giờ).",
      "Nhầm lẫn rừng đặc dụng (Vườn quốc gia, Khu bảo tồn) được phép khai thác trắng gỗ thương mại như rừng sản xuất."
    ]
  }
];

// Dữ liệu Chuyên đề & Bài toán Kĩ thuật Nông nghiệp cho Phần 4 (Ôn tập HSG)
const HSG_SPECIAL_PROBLEMS = [
  {
    id: "hsg_prob_1",
    grade: "cn10",
    category: "Bài toán Dinh dưỡng & Phối trộn Phân bón (Trồng trọt 10)",
    title: "Bài toán 1: Tính lượng phân bón thương phẩm (Urea, Super Lân, Kali Clorua) theo định mức N - P2O5 - K2O",
    problem: "Một hợp tác xã trồng ngô lai trên diện tích 2,5 ha đất phù sa. Theo quy trình kỹ thuật nông học, định mức bón phân nguyên chất cho 1 ha ngô lai là: 160 kg N + 90 kg P2O5 + 120 kg K2O. Biết hợp tác xã sử dụng 20 tấn phân hữu cơ vi sinh (chứa 1,5% N; 1,0% P2O5; 1,0% K2O) cho mỗi ha, phần dinh dưỡng thiếu hụt còn lại được bù bằng các loại phân hóa học đơn: Đạm Urea (46% N), Super Lân Lâm Thao (16% P2O5) và Phân Kali đỏ KCl (60% K2O).\na) Tính khối lượng từng loại phân hóa học (Urea, Super Lân, KCl) cần mua cho toàn bộ diện tích 2,5 ha.\nb) Thiết kế quy trình bón lót và bón thúc các loại phân trên cho cây ngô để đạt hiệu suất sử dụng phân bón cao nhất.",
    solutionSteps: [
      "Bước 1: Tính lượng dinh dưỡng nguyên chất do 20 tấn (20.000 kg) phân hữu cơ vi sinh cung cấp trên 1 ha:\n  • Lượng N từ phân hữu cơ = 20.000 × 1,5% = 300 kg N/ha (> 160 kg N định mức? Lưu ý: Tỷ lệ khoáng hóa đạm hữu cơ vụ đầu đạt khoảng 30%, tức cung cấp hữu hiệu 300 × 30% = 90 kg N/ha; P2O5 hữu hiệu = 200 × 45% = 90 kg; hoặc nếu tính theo tổng lượng thiếu hụt trực tiếp: Giả sử 10 tấn phân hữu cơ cung cấp 50 kg N, 30 kg P2O5, 30 kg K2O).",
      "Bước 2: Áp dụng công thức quy đổi phân hóa học thương phẩm chuẩn HSG:\n  • Khối lượng phân thương phẩm = (Khối lượng dinh dưỡng nguyên chất cần bón × 100) / Tỷ lệ % hàm lượng nguyên chất trong phân.\n  • Nếu tính trực tiếp từ định mức khoáng (160 kg N; 90 kg P2O5; 120 kg K2O cho 1 ha):\n    - Lượng Urea (46% N) cho 1 ha = (160 × 100) / 46 ≈ 347,83 kg/ha → Cho 2,5 ha = 869,57 kg Urea.\n    - Lượng Super Lân (16% P2O5) cho 1 ha = (90 × 100) / 16 = 562,50 kg/ha → Cho 2,5 ha = 1.406,25 kg Super Lân.\n    - Lượng Kali Clorua (60% K2O) cho 1 ha = (120 × 100) / 60 = 200,00 kg/ha → Cho 2,5 ha = 500,00 kg KCl.",
      "Bước 3: Quy trình kỹ thuật bón lót & bón thúc:\n  • Bón lót (100% phân hữu cơ vi sinh + 100% Super Lân + 20% Đạm Urea): Vì phân hữu cơ và phân lân khó tan, ít bị rửa trôi, cần bón lót sâu trước khi gieo để kích thích bộ rễ phát triển.\n  • Bón thúc (80% Đạm Urea + 100% Kali chia làm 2–3 đợt: giai đoạn 3–5 lá, giai đoạn xoáy nõn 7–9 lá và giai đoạn trước trỗ cờ – phun râu), kết hợp làm cỏ, vun gốc và đủ ẩm."
    ]
  },
  {
    id: "hsg_prob_2",
    grade: "cn11",
    category: "Bài toán Khẩu phần Dinh dưỡng & Hiệu quả Chăn nuôi FCR (Chăn nuôi 11)",
    title: "Bài toán 2: Tính Hệ số chuyển đổi thức ăn (FCR), Tỉ lệ nuôi sống & Phối hợp khẩu phần theo Phương pháp Hình vuông Pearson",
    problem: "Một trang trại chăn nuôi lợn thịt công nghệ cao nhập 500 con lợn giống đưa vào chuồng kín với khối lượng bình quân lúc bắt đầu nuôi là 15 kg/con. Sau 95 ngày nuôi theo tiêu chuẩn VietGAP, tỷ lệ nuôi sống đạt 98% và khối lượng xuất chuồng bình quân đạt 105 kg/con. Tổng lượng thức ăn hỗn hợp trang trại đã sử dụng trong suốt kỳ nuôi là 112,5 tấn.\na) Tính tổng khối lượng lợn xuất chuồng, tổng khối lượng tăng trọng của đàn và Hệ số chuyển đổi thức ăn (FCR).\nb) Trang trại muốn tự phối trộn 1.000 kg thức ăn hỗn hợp có tỷ lệ Protein thô đạt 16% từ hai nhóm nguyên liệu: Ngô vàng nghiền (9% Protein) và Đậm đặc giàu đạm (44% Protein). Hãy áp dụng phương pháp Hình vuông Pearson để tính khối lượng mỗi nguyên liệu cần dùng.",
    solutionSteps: [
      "a) Tính các chỉ tiêu kỹ thuật chăn nuôi:\n  • Số lợn xuất chuồng = 500 × 98% = 490 (con).\n  • Tổng khối lượng lợn lúc xuất chuồng = 490 × 105 = 51.450 (kg).\n  • Tổng khối lượng lợn lúc nhập chuồng = 500 × 15 = 7.500 (kg).\n  • Tổng tăng khối lượng toàn đàn ( ΔW ) = 51.450 - 7.500 = 43.950 (kg) (Nếu tính trên số con xuất chuồng: 490 × (105 - 15) = 44.100 kg).\n  • Hệ số chuyển đổi thức ăn FCR = Tổng thức ăn tiêu thụ (112.500 kg) / Tổng tăng trọng (44.100 kg) ≈ 2,55 (kg thức ăn / 1 kg tăng trọng).",
      "b) Phối trộn khẩu phần bằng Phương pháp Hình vuông Pearson (Mục tiêu Protein = 16%):\n  • Ngô vàng (9% P)  ——— chéo với 44% ———> |44 - 16| = 28 phần Ngô vàng.\n  • Đậm đặc (44% P) ——— chéo với 9%  ———> |16 - 9|  = 7 phần Đậm đặc.\n  • Tổng số phần = 28 + 7 = 35 phần.\n  • Tỷ lệ % Ngô vàng = (28 / 35) × 100% = 80% → Khối lượng Ngô vàng = 1.000 × 80% = 800 kg.\n  • Tỷ lệ % Đậm đặc = (7 / 35) × 100% = 20% → Khối lượng Đậm đặc = 1.000 × 20% = 200 kg.\n  • Kiểm tra lại: 800 × 9% + 200 × 44% = 72 + 88 = 160 kg Protein / 1.000 kg = 16% (Đúng tuyệt đối)."
    ]
  },
  {
    id: "hsg_prob_3",
    grade: "cn12",
    category: "Bài toán Mật độ Trồng rừng & Quản lí Ao nuôi Thủy sản Thâm canh (Lâm – Thủy sản 12)",
    title: "Bài toán 3: Tính số lượng cây giống trồng rừng (kể cả trồng dặm) & Lượng thức ăn theo ngày cho ao nuôi tôm thẻ chân trắng",
    problem: "Tình huống 1 (Lâm nghiệp): Một lâm trường lập kế hoạch trồng mới 15 ha rừng keo tai tượng phòng hộ đầu nguồn theo hàng với cự li cây cách cây 2 m, hàng cách hàng 3 m. Tỉ lệ cây hao hụt phải trồng dặm dự kiến là 12%. Hãy tính tổng số cây keo giống đủ tiêu chuẩn lâm trường cần chuẩn bị.\nTình huống 2 (Thủy sản): Một ao nuôi tôm thẻ chân trắng công nghệ Biofloc diện tích 2.000 m2, thả giống với mật độ 150 con/m2. Sau 60 ngày nuôi, tỉ lệ sống ước đạt 85%, cỡ tôm đạt 80 con/kg. Ở giai đoạn này, định mức cho ăn hàng ngày bằng 3,2% tổng khối lượng thân tôm trong ao. Hãy tính tổng lượng thức ăn cần cho ăn mỗi ngày và lượng thức ăn cho mỗi cử (biết ngày cho ăn 4 cử với tỉ lệ: Sáng 6h: 25%, Trưa 11h: 30%, Chiều 16h: 25%, Tối 21h: 20%).",
    solutionSteps: [
      "Giải Tình huống 1 (Lâm nghiệp):\n  • Diện tích dinh dưỡng của 1 cây rừng = 2 m × 3 m = 6 m2/cây.\n  • Mật độ trồng chính thức trên 1 ha (10.000 m2) = 10.000 / 6 ≈ 1.667 cây/ha.\n  • Số cây trồng chính trên 15 ha = 15 × (10.000 / 6) = 25.000 cây.\n  • Số cây dự phòng trồng dặm (12%) = 25.000 × 12% = 3.000 cây.\n  • Tổng số cây giống cần chuẩn bị = 25.000 + 3.000 = 28.000 cây giống.",
      "Giải Tình huống 2 (Thủy sản):\n  • Tổng số tôm giống thả ban đầu = 2.000 m2 × 150 con/m2 = 300.000 con.\n  • Số lượng tôm còn sống ở ngày thứ 60 = 300.000 × 85% = 255.000 con.\n  • Sinh khối (Tổng khối lượng) tôm trong ao = 255.000 con / (80 con/kg) = 3.187,5 kg tôm.\n  • Tổng lượng thức ăn cần cho ăn trong ngày (3,2% khối lượng thân) = 3.187,5 × 3,2% = 102,0 kg thức ăn/ngày.\n  • Chia lượng thức ăn theo 4 cử trong ngày:\n    - Cử 1 (6h sáng - 25%): 102 × 25% = 25,5 kg.\n    - Cử 2 (11h trưa - 30%): 102 × 30% = 30,6 kg.\n    - Cử 3 (16h chiều - 25%): 102 × 25% = 25,5 kg.\n    - Cử 4 (21h tối - 20%): 102 × 20% = 20,4 kg."
    ]
  }
];

// ============================================================================
// CHUYỂN ĐỔI 4 PHÂN HỆ CHÍNH TRÊN THANH ĐIỀU HƯỚNG
// ============================================================================
const STANDALONE_META = {
  1: {
    title: "📘 Phần 1: Kiến thức Tóm tắt SGK & Phân tích Lý thuyết — CNNN 10•11•12",
    headerTitle: "PHẦN 1: KIẾN THỨC TÓM TẮT CHUẨN SGK & PHÂN TÍCH LÝ THUYẾT",
    headerSub: "Tóm tắt 77 bài học chuẩn SGK Kết nối tri thức • Phân tích trọng tâm • Câu hỏi ôn tập theo bài"
  },
  2: {
    title: "📑 Phần 2: Hồ sơ CV 5512 (PL1-2-3), Soạn Giáo án & Học liệu cho GV — CNNN 10•11•12",
    headerTitle: "PHẦN 2: HỒ SƠ CV 5512 (PL1-2-3), SOẠN GIÁO ÁN & HỌC LIỆU CHO GV",
    headerSub: "Đồng bộ 3 Phụ lục nộp Tổ trưởng • Soạn Giáo án 5512 tích hợp NLS/AI/Trò chơi • Học liệu cho GV (77 bài & Link Drive)"
  },
  3: {
    title: "📝 Soạn Đề Kiểm Tra & Đề Cương Ôn Tập (CV 7991) — CNNN 10•11•12",
    headerTitle: "PHẦN 3: SOẠN ĐỀ KIỂM TRA & ĐỀ CƯƠNG ÔN TẬP (CHUẨN CÔNG VĂN 7991)",
    headerSub: "6 bước tự động Ma trận - Đặc tả - Đề thi - Đề cương ôn tập • Tự chọn bài & Đề chuyển đổi môn"
  },
  4: {
    title: "🏆 Phần 4: Khảo thí Kép — Ôn HSG & Luyện Thi Tốt Nghiệp THPT Chuẩn Bộ GD&ĐT",
    headerTitle: "PHẦN 4: HỆ THỐNG KHẢO THÍ KÉP — ÔN THI HSG & TỐT NGHIỆP THPT CHUẨN BỘ GD&ĐT",
    headerSub: "Phân hệ I: Bồi dưỡng HSG (Trắc nghiệm VDC + Tự luận Kỹ thuật) • Phân hệ II: Luyện thi Tốt nghiệp THPT Chuẩn Mẫu Bộ (24 Trắc nghiệm + 4 Đúng/Sai, Phân tích đề & Gợi ý đề tương tự)"
  }
};

function detectStandaloneModule() {
  if (typeof window.FORCED_MODULE === "number" && window.FORCED_MODULE >= 1 && window.FORCED_MODULE <= 4) {
    return window.FORCED_MODULE;
  }
  const params = new URLSearchParams(window.location.search);
  const p = Number(params.get("phan") || params.get("tab") || params.get("mod"));
  if (p >= 1 && p <= 4) return p;
  const pathMatch = window.location.pathname.match(/phan([1-4])/i);
  if (pathMatch) return Number(pathMatch[1]);
  return 0;
}

function returnToWelcomeHub() {
  portalState.activeModule = 0;
  const hub = document.getElementById("portalWelcomeHub");
  if (hub) {
    hub.style.display = "block";
    hub.classList.remove("reveal-smooth");
    void hub.offsetWidth;
    hub.classList.add("reveal-smooth");
  }

  // Ẩn tất cả view nội dung
  document.querySelectorAll(".main-module-view").forEach(view => {
    view.classList.remove("active");
  });

  // Tắt active trên thanh module nav bar, bật active cho Hub
  const hubBtn = document.getElementById("btnNavHub");
  if (hubBtn) hubBtn.classList.add("active");
  document.querySelectorAll(".module-tab-btn:not(#btnNavHub)").forEach(btn => {
    btn.classList.remove("active");
  });

  const stepperBar = document.getElementById("cv7991StepperBar");
  if (stepperBar) stepperBar.style.display = "none";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function switchMainModule(modNum) {
  portalState.activeModule = modNum;

  // Ẩn/Hiện Cổng Chọn Phân Hệ (Hub)
  const hub = document.getElementById("portalWelcomeHub");
  if (hub) {
    hub.style.display = modNum === 0 ? "block" : "none";
  }

  const hubBtn = document.getElementById("btnNavHub");
  if (hubBtn) hubBtn.classList.toggle("active", modNum === 0);
  document.querySelectorAll(".module-tab-btn:not(#btnNavHub)").forEach((btn, idx) => {
    btn.classList.toggle("active", idx + 1 === modNum);
  });

  // Hiển thị nội dung từ từ (Lazy reveal transition)
  document.querySelectorAll(".main-module-view").forEach((view, idx) => {
    const isTarget = idx + 1 === modNum;
    view.classList.toggle("active", isTarget);
    if (isTarget) {
      view.classList.remove("reveal-smooth");
      void view.offsetWidth;
      view.classList.add("reveal-smooth");
    }
  });

  // Ẩn/hiện thanh Stepper 6 bước (chỉ hiện khi đang ở Phần 3: Soạn đề theo học kì)
  const stepperBar = document.getElementById("cv7991StepperBar");
  if (stepperBar) {
    stepperBar.style.display = modNum === 3 ? "block" : "none";
  }

  if (modNum === 1) renderModule1Theory();
  if (modNum === 2) {
    if (typeof init5512Module === "function") init5512Module();
    else renderModule2PptPresenter();
  }
  if (modNum === 3) renderModule3ArchiveBanner();
  if (modNum === 4) renderModule4Hsg();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Khởi chạy Portal khi trang tải xong
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const initLesson = params.get("lesson");
  if (initLesson) {
    const found = (PORTAL_DATA.lessons || []).find(l => l.id === initLesson);
    if (found) {
      portalState.mod1Grade = found.grade;
      portalState.mod1LessonId = found.id;
      portalState.mod2Grade = found.grade;
      portalState.mod2LessonId = found.id;
    }
  }

  renderModule1Theory();
  renderModule2PptPresenter();
  renderModule3ArchiveBanner();
  initHsgQuizPool();
  initGradExam("bo_2025_sample");
  renderModule4Hsg();

  const standaloneMod = detectStandaloneModule();
  if (standaloneMod >= 1 && standaloneMod <= 4) {
    portalState.isStandalone = true;
    const meta = STANDALONE_META[standaloneMod];
    if (meta) {
      document.title = meta.title;
      const h1 = document.querySelector(".brand-title h1");
      const p = document.querySelector(".brand-title p");
      if (h1) h1.textContent = meta.headerTitle;
      if (p) p.textContent = meta.headerSub;
    }
    // Thu gọn thanh chuyển 4 phân hệ thành thanh liên kết mở tab độc lập gọn nhẹ
    const navBar = document.querySelector(".module-nav-bar");
    if (navBar) {
      navBar.innerHTML = `
        <div class="module-nav-inner" style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; flex-wrap:wrap; gap:8px;">
          <div style="font-size:13px; font-weight:700; color:var(--primary-dark);">
            🟢 Đang làm việc độc lập tại: <span style="color:var(--primary);">${escapeHtml(meta.headerTitle)}</span>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
            <span style="font-size:12px; color:var(--text-muted);">Mở nhanh tab khác:</span>
            <a href="/phan1.html" target="_blank" class="btn ${standaloneMod === 1 ? 'btn-primary' : 'btn-outline'} btn-sm" style="text-decoration:none; font-size:12px;">📘 Tab 1: Kiến thức SGK</a>
            <a href="/phan2.html" target="_blank" class="btn ${standaloneMod === 2 ? 'btn-primary' : 'btn-outline'} btn-sm" style="text-decoration:none; font-size:12px;">🖥️ Tab 2: Học liệu cho GV</a>
            <a href="/phan3.html" target="_blank" class="btn ${standaloneMod === 3 ? 'btn-primary' : 'btn-outline'} btn-sm" style="text-decoration:none; font-size:12px;">📝 Tab 3: Soạn đề Học kì</a>
            <a href="/phan4.html" target="_blank" class="btn ${standaloneMod === 4 ? 'btn-primary' : 'btn-outline'} btn-sm" style="text-decoration:none; font-size:12px;">🏆 Tab 4: Ôn tập HSG</a>
          </div>
        </div>
      `;
    }
    switchMainModule(standaloneMod);
  } else {
    // Nếu vào trang chủ index.html -> Hiển thị Cổng Chọn Phân Hệ (Hub) kiểu Vietcombank tránh quá tải thông tin!
    const hub = document.getElementById("portalWelcomeHub");
    if (hub) {
      returnToWelcomeHub();
    } else {
      switchMainModule(1);
    }
  }

  // Phím tắt bàn phím cho Trình chiếu Slide ở Phần 2
  document.addEventListener("keydown", (e) => {
    if (portalState.activeModule !== 2) return;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") {
      e.preventDefault();
      changePptSlide(1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      changePptSlide(-1);
    }
  });
});

// ============================================================================
// PHẦN 1: KIẾN THỨC TÓM TẮT TỪNG BÀI, CÂU HỎI NÂNG CAO & CÔNG CỤ PHÂN TÍCH LÝ THUYẾT
// ============================================================================
function selectMod1Grade(grade) {
  portalState.mod1Grade = grade;
  const firstLesson = (PORTAL_DATA.lessons || []).find(l => l.grade === grade);
  if (firstLesson) portalState.mod1LessonId = firstLesson.id;
  renderModule1Theory();
}

function selectMod1Lesson(lessonId) {
  portalState.mod1LessonId = lessonId;
  portalState.mod1FlashcardIdx = 0;
  portalState.mod1FlashcardFlipped = false;
  portalState.mod1FlashcardsList = [];
  renderModule1Theory();
}

function selectMod1SubTab(tab) {
  portalState.mod1SubTab = tab;
  renderModule1Theory();
}

function getQuestionsForLesson(grade, lessonNum) {
  const unitId = getUnitIdForLesson(grade, lessonNum);
  const mcqs = (QUESTION_BANK.mcq || []).filter(q =>
    (q.grade === grade && Number(q.lesson) === Number(lessonNum)) || q.unitId === unitId
  );
  const tfs = (QUESTION_BANK.tf || []).filter(q =>
    (q.grade === grade && Number(q.lesson) === Number(lessonNum)) || q.unitId === unitId
  );
  const shorts = (QUESTION_BANK.short || []).filter(q =>
    (q.grade === grade && Number(q.lesson) === Number(lessonNum)) || q.unitId === unitId
  );
  const essays = (QUESTION_BANK.essay || []).filter(q => q.unitId === unitId);
  return { mcqs, tfs, shorts, essays, unitId };
}

function getUnitIdForLesson(grade, bai) {
  const b = Number(bai);
  if (grade === "cn10") {
    const map10 = { 1:"u1_1", 2:"u1_2", 3:"u2_1", 4:"u2_2", 5:"u2_3", 6:"u2_3", 7:"u3_1", 8:"u3_2", 9:"u3_3", 10:"u3_2", 11:"u4_1", 12:"u4_2", 13:"u4_3", 14:"u4_3", 15:"u10_b15", 16:"u10_b16", 17:"u10_b17", 18:"u10_b18", 19:"u10_b19", 20:"u10_b20", 21:"u10_b21", 22:"u10_b21", 23:"u10_b23_24", 24:"u10_b23_24", 25:"u10_b25" };
    return map10[b] || "u10_b26_28";
  }
  if (grade === "cn11") {
    const map11 = { 1:"cn11_1", 2:"cn11_2", 3:"cn11_3", 4:"cn11_3", 5:"cn11_4", 6:"cn11_4", 7:"cn11_5", 8:"cn11_6", 9:"cn11_6", 10:"cn11_6", 11:"cn11_b11", 12:"cn11_b12", 13:"cn11_b13_14", 14:"cn11_b13_14", 15:"cn11_b15", 16:"cn11_b16", 17:"cn11_b17", 18:"cn11_b18_19", 19:"cn11_b18_19", 20:"cn11_b20" };
    return map11[b] || "cn11_b21_22";
  }
  const map12 = { 1:"cn12_1", 2:"cn12_1", 3:"cn12_2", 4:"cn12_2", 5:"cn12_2", 6:"cn12_3", 7:"cn12_3", 8:"cn12_4", 9:"cn12_4", 10:"cn12_5", 11:"cn12_5", 12:"cn12_5", 13:"cn12_6", 14:"cn12_6", 15:"cn12_6", 16:"cn12_7", 17:"cn12_7", 18:"cn12_7", 19:"cn12_8", 20:"cn12_8", 21:"cn12_8b", 22:"cn12_8b" };
  return map12[b] || "cn12_9";
}

function formatSgkSectionItem(rawLine) {
  const line = String(rawLine || "").trim();
  if (!line) return "";
  
  // Tiểu mục số: "1. Vai trò của trồng trọt"
  if (/^\d+\.\s+/.test(line)) {
    const num = line.match(/^\d+/)[0];
    const textOnly = line.replace(/^\d+\.\s*/, '');
    return `<div style="font-weight:700; color:var(--primary-dark); margin:14px 0 6px 4px; font-size:15px; display:flex; align-items:center; gap:8px;">
      <span style="background:var(--primary-light); color:var(--primary-dark); font-size:11.5px; padding:2px 8px; border-radius:12px; font-weight:800;">Tiểu mục ${num}</span>
      <span>${escapeHtml(textOnly)}</span>
    </div>`;
  }
  
  // Tiểu mục chữ: "a) Đảm bảo an ninh lương thực: ..."
  if (/^[a-eđ]\)\s+/i.test(line)) {
    const match = line.match(/^([a-eđ]\)\s*[^:]+:?)(.*)/i);
    if (match) {
      const label = match[1].trim();
      const desc = match[2].trim();
      return `<div style="margin:6px 0 6px 14px; font-size:14px; line-height:1.65; color:#334155; display:flex; gap:8px; align-items:flex-start;">
        <span style="color:var(--primary); font-weight:800; flex-shrink:0; margin-top:2px;">▸</span>
        <div>
          <strong style="color:#0f172a; font-weight:700;">${escapeHtml(label)}</strong>
          ${desc ? ` <span>${escapeHtml(desc)}</span>` : ''}
        </div>
      </div>`;
    }
  }
  
  // Ý gạch đầu dòng có tiêu đề trước dấu hai chấm
  const cleanBullet = line.replace(/^[-+•]\s*/, "");
  if (cleanBullet.includes(":")) {
    const parts = cleanBullet.split(":");
    const bTitle = parts[0].trim();
    const bBody = parts.slice(1).join(":").trim();
    return `<div style="display:flex; gap:8px; align-items:flex-start; margin:5px 0 5px 14px; font-size:14px; line-height:1.65; color:#334155;">
      <span style="color:var(--primary); font-weight:800; flex-shrink:0; margin-top:1px;">•</span>
      <div>
        <strong style="color:#0f172a; font-weight:700;">${escapeHtml(bTitle)}:</strong>
        <span> ${escapeHtml(bBody)}</span>
      </div>
    </div>`;
  }
  
  return `<div style="display:flex; gap:8px; align-items:flex-start; margin:5px 0 5px 14px; font-size:14px; line-height:1.65; color:#334155;">
    <span style="color:var(--primary); font-weight:800; flex-shrink:0; margin-top:1px;">•</span>
    <span>${escapeHtml(cleanBullet)}</span>
  </div>`;
}

// ============================================================================
// HỖ TRỢ SƠ ĐỒ TƯ DUY (MIND MAP) & THẺ NHỚ HỌC NHANH (FLASHCARDS)
// ============================================================================
function toggleMindmapBranch(idx) {
  if (!portalState.mod1MindmapCollapsed) portalState.mod1MindmapCollapsed = {};
  portalState.mod1MindmapCollapsed[idx] = !portalState.mod1MindmapCollapsed[idx];
  renderModule1Theory();
}

function expandAllMindmapBranches(expand) {
  portalState.mod1MindmapCollapsed = {};
  if (!expand) {
    const curLesson = (PORTAL_DATA.lessons || []).find(l => l.id === portalState.mod1LessonId);
    const sgkSections = (curLesson && curLesson.sgkSections) || [];
    sgkSections.forEach((_, i) => {
      portalState.mod1MindmapCollapsed[i] = true;
    });
  }
  renderModule1Theory();
}

function renderMindmapHtml(curLesson, sgkSections) {
  const branchColors = [
    { border: "#10b981", bg: "#f0fdf4", headerBg: "#dcfce7", text: "#065f46" },
    { border: "#3b82f6", bg: "#eff6ff", headerBg: "#dbeafe", text: "#1e40af" },
    { border: "#f59e0b", bg: "#fffbeb", headerBg: "#fef3c7", text: "#92400e" },
    { border: "#8b5cf6", bg: "#f5f3ff", headerBg: "#ede9fe", text: "#5b21b6" },
    { border: "#ec4899", bg: "#fff1f2", headerBg: "#fce7f3", text: "#9d174d" },
    { border: "#06b6d4", bg: "#f0fdfa", headerBg: "#cffafe", text: "#155e75" }
  ];

  return `
    <div class="mindmap-wrapper">
      <div class="mindmap-header-bar">
        <div>
          <h4 style="color:var(--primary-dark); font-size:16px; margin:0;">🌿 Sơ đồ Tư duy Trực quan (Mind Map) — ${escapeHtml(curLesson.title)}</h4>
          <p style="font-size:12.5px; color:var(--text-muted); margin:3px 0 0;">Hệ thống hóa toàn bộ bài học theo dạng mạng nhánh đa cấp, phân màu trực quan giúp não bộ ghi nhớ sâu</p>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-outline btn-sm" onclick="expandAllMindmapBranches(true)">➕ Mở rộng tất cả</button>
          <button class="btn btn-outline btn-sm" onclick="expandAllMindmapBranches(false)">➖ Thu gọn tất cả</button>
          <button class="btn btn-outline btn-sm" onclick="window.print()">🖨️ In sơ đồ</button>
        </div>
      </div>

      <!-- Nút Trung tâm (Gốc Sơ đồ) -->
      <div style="text-align:center;">
        <div class="mindmap-root-node">
          <div style="font-size:11.5px; text-transform:uppercase; letter-spacing:0.8px; opacity:0.9;">🌱 TRUNG TÂM KIẾN THỨC CỐT LÕI</div>
          <div style="font-size:18px; margin-top:4px;">${escapeHtml(curLesson.title)}</div>
          <div style="font-size:12.5px; opacity:0.9; margin-top:4px;">${escapeHtml(curLesson.chapter || '')} • ${escapeHtml(curLesson.sgkInfo || '')}</div>
        </div>
      </div>

      <!-- Các Nhánh Kiến thức (Branches) -->
      <div class="mindmap-tree-branches">
        ${sgkSections.map((sec, idx) => {
          const colorTheme = branchColors[idx % branchColors.length];
          const isCollapsed = portalState.mod1MindmapCollapsed && portalState.mod1MindmapCollapsed[idx] === true;
          const items = sec.items || [];
          
          return `
            <div class="mindmap-branch-card" style="border-left:5px solid ${colorTheme.border};">
              <div class="mindmap-branch-header" style="background:${colorTheme.headerBg}; color:${colorTheme.text};" onclick="toggleMindmapBranch(${idx})">
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <span style="background:${colorTheme.border}; color:#fff; font-size:11px; padding:2px 8px; border-radius:12px; font-weight:700;">NHÁNH ${idx + 1}</span>
                  <span>${escapeHtml(sec.heading)}</span>
                </div>
                <div style="font-size:12.5px; font-weight:700;">${isCollapsed ? '▶ Mở nhánh' : '▼ Thu gọn'}</div>
              </div>

              ${!isCollapsed ? `
                <div class="mindmap-branch-content" style="background:${colorTheme.bg};">
                  <div class="mindmap-leaf-grid">
                    ${items.map(item => {
                      const line = String(item).trim();
                      const isSubTitle = /^\d+\.\s+/.test(line);
                      const isAlphabet = /^[a-eđ]\)\s+/i.test(line);
                      
                      if (isSubTitle) {
                        return `
                          <div style="grid-column: 1 / -1; background:#ffffff; border:1px solid ${colorTheme.border}; border-left:4px solid ${colorTheme.border}; border-radius:8px; padding:10px 14px; font-weight:700; color:${colorTheme.text}; font-size:14px; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
                            🔹 ${escapeHtml(line)}
                          </div>
                        `;
                      }
                      
                      const cleanLine = line.replace(/^[-+•]\s*/, "");
                      let kw = "";
                      let desc = cleanLine;
                      if (cleanLine.includes(":")) {
                        const parts = cleanLine.split(":");
                        kw = parts[0].trim();
                        desc = parts.slice(1).join(":").trim();
                      } else {
                        const words = cleanLine.split(/\s+/);
                        if (words.length > 4) {
                          kw = words.slice(0, 3).join(" ");
                          desc = words.slice(3).join(" ");
                        } else {
                          kw = cleanLine;
                          desc = "";
                        }
                      }
                      const descWords = desc.split(/\s+/);
                      if (descWords.length > 12) {
                        desc = descWords.slice(0, 12).join(" ") + "...";
                      }
                      return `
                        <div class="mindmap-leaf-node" style="border-left:3.5px solid ${colorTheme.border}; background:#ffffff; padding:10px 14px;">
                          <div style="font-weight:700; color:${colorTheme.text}; font-size:13.5px; margin-bottom:3px; display:flex; align-items:center; gap:6px;">
                            <span>📌</span>
                            <span>${escapeHtml(kw)}</span>
                          </div>
                          ${desc ? `<div style="font-size:12.5px; color:#475569; line-height:1.45;">${escapeHtml(desc)}</div>` : ""}
                        </div>
                      `;
                    }).join("")}
                  </div>
                </div>
              ` : ''}
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

// BỘ TRÍCH XUẤT THẺ GHI NHỚ (FLASHCARDS) CHO MỌI BÀI HỌC
function buildLessonFlashcards(curLesson, qBundle) {
  // Bộ 10 Thẻ nhớ Chuẩn mực cho Bài 1 Công nghệ 10
  if (curLesson.id === "cn10_b1") {
    return [
      {
        category: "Mục tiêu bài học",
        icon: "🎯",
        front: "Mục tiêu & Yêu cầu cần đạt (YCCĐ) cốt lõi của Bài 1 là gì?",
        back: "<div style='font-size:14px; line-height:1.6; color:#1e293b;'><div style='margin-bottom:4px; font-weight:700; color:#166534;'>👉 4 Chuẩn đầu ra chính:</div><div>• Nắm vững vai trò và triển vọng trồng trọt 4.0 ở Việt Nam.</div><div>• Nêu các thành tựu công nghệ cao nổi bật ở Việt Nam & thế giới.</div><div>• Trình bày được yêu cầu nghề nghiệp với người lao động thời đại mới.</div></div>",
        note: "YCCĐ Chuẩn GDPT 2018"
      },
      {
        category: "Mục I: Vai trò",
        icon: "🌾",
        front: "Trồng trọt có những vai trò then chốt nào đối với kinh tế - xã hội?",
        back: "<div style='font-size:14px; line-height:1.6; color:#1e293b;'><div style='margin-bottom:4px; font-weight:700; color:#166534;'>👉 5 Vai trò quyết định:</div><div>• (1) Cung cấp lương thực, thực phẩm cho con người.</div><div>• (2) Cung ứng hơn 70% thức ăn cho chăn nuôi.</div><div>• (3) Cung cấp nguyên liệu cho công nghiệp chế biến.</div><div>• (4) Nông sản xuất khẩu mang lại ngoại tệ lớn.</div><div>• (5) Tạo việc làm, phủ xanh và điều hòa môi trường.</div></div>",
        note: "Bản chất kinh tế quốc dân"
      },
      {
        category: "Mục I: An ninh lương thực",
        icon: "💡",
        front: "Vì sao trồng trọt là ngành duy nhất đảm bảo an ninh lương thực quốc gia?",
        back: "<div style='font-size:14px; line-height:1.6; color:#1e293b;'><div style='margin-bottom:4px; font-weight:700; color:#166534;'>👉 Bản chất khoa học:</div><div>• Cây trồng là sinh vật duy nhất trực tiếp quang hợp tạo ra tinh bột và calo nuôi sống xã hội.</div><div>• Không một ngành công nghiệp nào có thể thay thế được cây lương thực.</div></div>",
        note: "Vấn đề an ninh chiến lược"
      },
      {
        category: "Mục II: Giống cây trồng",
        icon: "🇻🇳",
        front: "Thành tựu chọn tạo giống cây trồng nổi bật nhất của Việt Nam là gì?",
        back: "<div style='font-size:14px; line-height:1.6; color:#1e293b;'><div style='margin-bottom:4px; font-weight:700; color:#166534;'>👉 Giống lúa ST24 và ST25:</div><div>• Do nhóm kỹ sư Hồ Quang Cua lai tạo thành công.</div><div>• ST25 được vinh danh là Gạo ngon nhất thế giới, phẩm chất hạt gạo mềm dẻo, thơm mùi lá dứa và kháng sâu bệnh tốt.</div></div>",
        note: "Thành tựu đỉnh cao Việt Nam"
      },
      {
        category: "Mục II: Canh tác thông minh",
        icon: "🏢",
        front: "Mô hình nhà màng, nhà kính thông minh tại Đà Lạt, Lâm Đồng có ưu điểm gì?",
        back: "<div style='font-size:14px; line-height:1.6; color:#1e293b;'><div style='margin-bottom:4px; font-weight:700; color:#166534;'>👉 Ưu điểm vượt trội:</div><div>• Kiểm soát tự động nhiệt độ, ẩm độ và ánh sáng bằng cảm biến IoT.</div><div>• Ngăn chặn sâu bệnh và mưa bão, sản xuất hoa rau chất lượng cao quanh năm.</div><div>• Tiết kiệm 50% nước tưới và phân bón nhờ hệ thống tưới nhỏ giọt.</div></div>",
        note: "Công nghệ cao Lâm Đồng"
      },
      {
        category: "Mục II: Thiết bị bay Drone",
        icon: "🛩️",
        front: "Ứng dụng thiết bị bay không người lái (Drone) trong trồng trọt mang lại lợi ích gì?",
        back: "<div style='font-size:14px; line-height:1.6; color:#1e293b;'><div style='margin-bottom:4px; font-weight:700; color:#166534;'>👉 3 Lợi ích đột phá:</div><div>• (1) Gieo hạt, bón phân, phun thuốc chính xác, tiết kiệm 90% nước.</div><div>• (2) Năng suất phun gấp 20 lần lao động thủ công.</div><div>• (3) Bảo vệ sức khỏe nông dân vì không phải tiếp xúc trực tiếp hóa chất.</div></div>",
        note: "Nông nghiệp 4.0 ĐBSCL"
      },
      {
        category: "Mục III: Thế giới (Nhật Bản)",
        icon: "🇯🇵",
        front: "Khu vườn thẳng đứng Miyagi (Nhật Bản) ứng dụng công nghệ đột phá nào?",
        back: "<div style='font-size:14px; line-height:1.6; color:#1e293b;'><div style='margin-bottom:4px; font-weight:700; color:#166534;'>👉 Nhà máy thực vật (Plant Factory):</div><div>• Sử dụng 17.500 đèn LED chuyên dụng, kiểm soát 100% ánh sáng, CO2 và nhiệt độ.</div><div>• Năng suất xà lách gấp 100 lần so với canh tác ngoài ruộng truyền thống.</div><div>• Tiết kiệm 99% lượng nước tưới.</div></div>",
        note: "Mô hình Vertical Farming"
      },
      {
        category: "Mục III: Thế giới (Hà Lan)",
        icon: "🇳🇱",
        front: "Vì sao diện tích hẹp nhưng Hà Lan là quốc gia xuất khẩu nông sản thứ 2 thế giới?",
        back: "<div style='font-size:14px; line-height:1.6; color:#1e293b;'><div style='margin-bottom:4px; font-weight:700; color:#166534;'>👉 Bí quyết công nghệ Hà Lan:</div><div>• Ứng dụng hệ thống nhà kính siêu hiện đại (Vườn Keukenhof, vùng Westland).</div><div>• Sử dụng năng lượng địa nhiệt, tái tuần hoàn 100% nước tưới và khí thải CO2.</div><div>• Robot tự động hóa hoàn toàn khâu thu hoạch và đóng gói.</div></div>",
        note: "Kỳ tích nông nghiệp Hà Lan"
      },
      {
        category: "Mục III: Thế giới (Israel)",
        icon: "🇮🇱",
        front: "Công nghệ tưới nhỏ giọt của Israel giải quyết bài toán nông nghiệp thế nào?",
        back: "<div style='font-size:14px; line-height:1.6; color:#1e293b;'><div style='margin-bottom:4px; font-weight:700; color:#166534;'>👉 Giải pháp tưới nhỏ giọt ngầm:</div><div>• Đưa nước và phân bón hòa tan chính xác đến từng vùng rễ cây.</div><div>• Tiết kiệm 60 - 80% nước tưới, chống thất thoát bốc hơi.</div><div>• Biến các vùng sa mạc cằn cỗi Negev thành cánh đồng trù phú.</div></div>",
        note: "Đỉnh cao tiết kiệm nước"
      },
      {
        category: "Mục IV: Yêu cầu Nghề nghiệp",
        icon: "👨‍🌾",
        front: "Người lao động trong ngành trồng trọt công nghệ cao cần đáp ứng những yêu cầu gì?",
        back: "<div style='font-size:14px; line-height:1.6; color:#1e293b;'><div style='margin-bottom:4px; font-weight:700; color:#166534;'>👉 3 Yêu cầu cốt lõi:</div><div>• (1) Có sức khỏe tốt, chăm chỉ, cẩn thận và yêu thích cây trồng.</div><div>• (2) Có kiến thức nông học và kỹ năng vận hành công nghệ 4.0 (Drone, IoT, nhà kính).</div><div>• (3) Ý thức nghiêm túc về an toàn thực phẩm và bảo vệ môi trường xanh.</div></div>",
        note: "Phẩm chất & Năng lực 4.0"
      }
    ];
  }

  const cards = [];
  
  // 1. Thẻ Mục tiêu & YCCĐ
  if (curLesson.objectives && curLesson.objectives.length > 0) {
    cards.push({
      category: "Mục tiêu bài học",
      icon: "🎯",
      front: `Mục tiêu & Yêu cầu cần đạt cốt lõi của bài: "${curLesson.title}"?`,
      back: `
        <div style="margin-bottom:6px; font-weight:700; color:#166534;">Yêu cầu cần đạt chuẩn SGK:</div>
        <ul style="margin:0 0 0 18px; padding:0; line-height:1.6; color:#1e293b; font-size:13.5px;">
          ${curLesson.objectives.slice(0, 3).map(o => { const ws = o.split(/\s+/); return `<li>${escapeHtml(ws.length > 14 ? ws.slice(0, 14).join(' ') + '...' : o)}</li>`; }).join("")}
        </ul>
      `,
      note: "Yêu cầu cần đạt cốt lõi"
    });
  }

  // 2. Thẻ từ các mục SGK (sgkSections)
  const sgkSections = Array.isArray(curLesson.sgkSections) && curLesson.sgkSections.length > 0
    ? curLesson.sgkSections
    : [{ heading: "I. TÓM TẮT KIẾN THỨC TRỌNG TÂM SGK", items: curLesson.summaryPoints || [] }];

  sgkSections.forEach((sec, sIdx) => {
    const rawItems = sec.items || [];
    let currentTopic = sec.heading;
    let bulletGroup = [];

    rawItems.forEach(item => {
      const line = String(item).trim();
      if (/^\d+\.\s+/.test(line)) {
        if (bulletGroup.length > 0) {
          cards.push({
            category: sec.heading.split(".")[0] || `Phần ${sIdx + 1}`,
            icon: "📘",
            front: `Nội dung trọng tâm của: "${currentTopic}"?`,
            back: `<div style="font-size:14px; line-height:1.6; color:#1e293b;">${bulletGroup.slice(0, 2).map(b => { const cl = b.replace(/^[-+•]\s*/, ''); const ws = cl.split(/\s+/); const sb = ws.length > 12 ? ws.slice(0, 12).join(' ') + '...' : cl; return `<div style="margin-bottom:4px; font-weight:600; color:#166534;">👉 ${escapeHtml(sb)}</div>`; }).join("")}</div>`,
            note: "Kiến thức chuẩn SGK"
          });
          bulletGroup = [];
        }
        currentTopic = line;
      } else if (line.length > 8) {
        bulletGroup.push(line);
      }
    });

    if (bulletGroup.length > 0) {
      cards.push({
        category: sec.heading.split(".")[0] || `Phần ${sIdx + 1}`,
        icon: "📘",
        front: `Trình bày tóm tắt nội dung cốt lõi của: "${currentTopic}"?`,
        back: `<div style="font-size:14px; line-height:1.6; color:#1e293b;">${bulletGroup.slice(0, 2).map(b => { const cl = b.replace(/^[-+•]\s*/, ''); const ws = cl.split(/\s+/); const sb = ws.length > 12 ? ws.slice(0, 12).join(' ') + '...' : cl; return `<div style="margin-bottom:4px; font-weight:600; color:#166534;">👉 ${escapeHtml(sb)}</div>`; }).join("")}</div>`,
        note: "Bám sát sách giáo khoa"
      });
    }
  });

  // 3. Thẻ từ Lưu ý Sư phạm & Phân tích nếu có
  if (Array.isArray(curLesson.analysisNotes) && curLesson.analysisNotes.length > 0) {
    curLesson.analysisNotes.slice(0, 2).forEach((note, nIdx) => {
      cards.push({
        category: "Bản chất & Mẹo thi",
        icon: "💡",
        front: `Bản chất khoa học & lưu ý quan trọng cần ghi nhớ ở bài: "${curLesson.title}"?`,
        back: `<div style="font-size:14px; line-height:1.6; color:#78350f; background:#fffbeb; padding:10px 14px; border-radius:8px; border:1px solid #fde68a;">${escapeHtml(note)}</div>`,
        note: "Trọng tâm nâng cao"
      });
    });
  }

  // 4. Thẻ Câu hỏi Trả lời ngắn & Vận dụng
  if (qBundle.shorts && qBundle.shorts.length > 0) {
    qBundle.shorts.slice(0, 4).forEach(sq => {
      cards.push({
        category: "Hỏi - Đáp nhanh",
        icon: "❓",
        front: sq.stem,
        back: `<div style="font-weight:600; color:#15803d; font-size:14.5px; background:#f0fdf4; padding:10px 14px; border-radius:8px; border:1px solid #bbf7d0;">👉 Đáp án chuẩn: ${escapeHtml(sq.answer)}</div>`,
        note: "Câu hỏi định dạng mới Bộ GD&ĐT"
      });
    });
  }

  // 5. Thẻ Trắc nghiệm then chốt có giải thích
  if (qBundle.mcqs && qBundle.mcqs.length > 0) {
    const pickMcqs = qBundle.mcqs.filter(q => q.explanation && q.explanation.length > 10).slice(0, 3);
    pickMcqs.forEach(mq => {
      const correctText = mq.options && mq.options[mq.answer] ? mq.options[mq.answer] : mq.answer;
      cards.push({
        category: "Trắc nghiệm cốt lõi",
        icon: "🎯",
        front: mq.stem,
        back: `
          <div style="font-weight:700; color:#166534; margin-bottom:8px; font-size:14.5px;">
            ✅ Đáp án đúng: ${escapeHtml(correctText)}
          </div>
          ${mq.explanation ? `<div style="font-size:13.5px; color:#475569; font-style:italic; border-top:1px dashed #cbd5e1; padding-top:6px;">💡 Giải thích: ${escapeHtml(mq.explanation)}</div>` : ''}
        `,
        note: "Mức độ: " + (mq.level || "thông hiểu")
      });
    });
  }

  return cards;
}

function flipCurrentFlashcard() {
  portalState.mod1FlashcardFlipped = !portalState.mod1FlashcardFlipped;
  const inner = document.querySelector(".flashcard-card-inner");
  if (inner) {
    if (portalState.mod1FlashcardFlipped) {
      inner.classList.add("flipped");
    } else {
      inner.classList.remove("flipped");
    }
  }
}

function prevFlashcard() {
  if (portalState.mod1FlashcardIdx > 0) {
    portalState.mod1FlashcardIdx--;
    portalState.mod1FlashcardFlipped = false;
    renderModule1Theory();
  }
}

function nextFlashcard() {
  const total = (portalState.mod1FlashcardsList || []).length;
  if (portalState.mod1FlashcardIdx < total - 1) {
    portalState.mod1FlashcardIdx++;
    portalState.mod1FlashcardFlipped = false;
    renderModule1Theory();
  }
}

function shuffleFlashcards() {
  if (portalState.mod1FlashcardsList && portalState.mod1FlashcardsList.length > 0) {
    for (let i = portalState.mod1FlashcardsList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [portalState.mod1FlashcardsList[i], portalState.mod1FlashcardsList[j]] = [portalState.mod1FlashcardsList[j], portalState.mod1FlashcardsList[i]];
    }
    portalState.mod1FlashcardIdx = 0;
    portalState.mod1FlashcardFlipped = false;
    renderModule1Theory();
  }
}

function markCurrentFlashcard(status) {
  if (!portalState.mod1FlashcardKnown) portalState.mod1FlashcardKnown = {};
  portalState.mod1FlashcardKnown[portalState.mod1FlashcardIdx] = status;
  if (status === 'known') {
    const total = (portalState.mod1FlashcardsList || []).length;
    if (portalState.mod1FlashcardIdx < total - 1) {
      setTimeout(() => {
        nextFlashcard();
      }, 200);
      return;
    }
  }
  renderModule1Theory();
}

function setFlashcardMode(mode) {
  portalState.mod1FlashcardMode = mode;
  renderModule1Theory();
}

function renderFlashcardsHtml(curLesson, qBundle) {
  if (!portalState.mod1FlashcardsList || portalState.mod1FlashcardsList.length === 0) {
    portalState.mod1FlashcardsList = buildLessonFlashcards(curLesson, qBundle);
  }
  const cards = portalState.mod1FlashcardsList;
  const total = cards.length;
  if (total === 0) {
    return `<div class="card"><p>Chưa có dữ liệu thẻ nhớ cho bài này.</p></div>`;
  }

  let idx = portalState.mod1FlashcardIdx;
  if (idx < 0) idx = 0;
  if (idx >= total) idx = total - 1;
  portalState.mod1FlashcardIdx = idx;

  const curCard = cards[idx];
  const isFlipped = portalState.mod1FlashcardFlipped;
  const viewMode = portalState.mod1FlashcardMode || 'single';

  const knownCount = Object.values(portalState.mod1FlashcardKnown || {}).filter(v => v === 'known').length;
  const reviewCount = Object.values(portalState.mod1FlashcardKnown || {}).filter(v => v === 'review').length;
  const progressPercent = Math.round(((idx + 1) / total) * 100);

  if (viewMode === 'grid') {
    return `
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:16px;">
          <div>
            <h4 style="color:var(--primary-dark); font-size:16px; margin:0;">🗂️ Toàn bộ ${total} Thẻ nhớ — ${escapeHtml(curLesson.title)}</h4>
            <p style="font-size:12.5px; color:var(--text-muted); margin:3px 0 0;">Chế độ xem dạng lưới: Nhấp vào từng thẻ để lật xem đáp án</p>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-primary btn-sm" onclick="setFlashcardMode('single')">🎴 Luyện từng thẻ 3D</button>
            <button class="btn btn-outline btn-sm" onclick="shuffleFlashcards()">🔀 Xáo trộn</button>
          </div>
        </div>

        <div class="flashcard-grid">
          ${cards.map((c, i) => `
            <div class="flashcard-mini-card" onclick="const b=this.querySelector('.mini-back-pane'); b.style.display=b.style.display==='none'?'block':'none';">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <span class="flashcard-badge flashcard-badge-front">${c.icon || '📌'} ${escapeHtml(c.category)}</span>
                  <span style="font-size:12px; font-weight:700; color:var(--text-muted);">#${i + 1}</span>
                </div>
                <div style="font-weight:600; font-size:14px; color:#0f172a; margin-bottom:10px; line-height:1.5;">
                  ${escapeHtml(c.front)}
                </div>
              </div>
              <div class="mini-back-pane" style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px 12px; margin-top:8px;">
                <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:#166534; margin-bottom:4px;">👉 Đáp án / Cốt lõi:</div>
                ${c.back}
              </div>
              <div style="font-size:11.5px; color:#64748b; margin-top:8px; text-align:right;">
                <em>Nhấp để ẩn/hiện đáp án</em>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // Single card 3D flip runner
  return `
    <div class="flashcard-container">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <div>
          <span style="font-weight:700; color:var(--primary-dark); font-size:15px;">🗂️ Thẻ ghi nhớ Học nhanh (Flashcards)</span>
          <span style="font-size:13px; color:var(--text-muted); margin-left:6px;">— ${escapeHtml(curLesson.title)}</span>
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          <span style="font-size:12px; font-weight:600; color:#15803d; background:#dcfce7; padding:3px 8px; border-radius:10px;">✅ Đã thuộc: ${knownCount}</span>
          <span style="font-size:12px; font-weight:600; color:#dc2626; background:#fee2e2; padding:3px 8px; border-radius:10px;">🔄 Cần ôn: ${reviewCount}</span>
          <button class="btn btn-outline btn-sm" onclick="setFlashcardMode('grid')" title="Xem danh sách tất cả thẻ">▦ Xem tất cả</button>
        </div>
      </div>

      <!-- Thanh tiến độ -->
      <div class="flashcard-progress-bar-wrap">
        <div class="flashcard-progress-bar-fill" style="width: ${progressPercent}%;"></div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; font-size:13px; color:var(--text-muted);">
        <span>Tiến độ: <strong>${idx + 1}</strong> / ${total} thẻ</span>
        <span>Phím tắt: <strong>Phím Cách (Space)</strong> = Lật thẻ | <strong>← / →</strong> = Chuyển thẻ</span>
      </div>

      <!-- 3D Flip Card -->
      <div class="flashcard-card-3d-wrap" onclick="flipCurrentFlashcard()">
        <div class="flashcard-card-inner ${isFlipped ? 'flipped' : ''}">
          <!-- MẶT TRƯỚC (HỎI / KHÁI NIỆM) -->
          <div class="flashcard-face flashcard-front">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="flashcard-badge flashcard-badge-front">
                  ${curCard.icon || '❓'} ${escapeHtml(curCard.category || 'CÂU HỎI TRỌNG TÂM')}
                </span>
                <span style="font-size:13px; font-weight:700; color:#15803d;">Thẻ ${idx + 1} / ${total}</span>
              </div>
            </div>
            
            <div class="flashcard-body-text">
              ${escapeHtml(curCard.front)}
            </div>

            <div class="flashcard-hint-text">
              <span>🔄 Nhấp chuột hoặc bấm phím Cách để lật xem đáp án</span>
            </div>
          </div>

          <!-- MẶT SAU (ĐÁP ÁN & GIẢI THÍCH) -->
          <div class="flashcard-face flashcard-back">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="flashcard-badge flashcard-badge-back">
                  💡 ĐÁP ÁN & NỘI DUNG CỐT LÕI
                </span>
                <span style="font-size:12.5px; font-weight:600; color:#1e40af;">${curCard.note ? escapeHtml(curCard.note) : ''}</span>
              </div>
            </div>

            <div class="flashcard-body-text" style="font-size:14.5px; font-weight:500;">
              ${curCard.back}
            </div>

            <div class="flashcard-hint-text" style="color:#2563eb;">
              <span>🔄 Nhấp chuột để quay lại mặt trước</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Nút điều khiển -->
      <div class="flashcard-controls">
        <div style="display:flex; gap:8px;">
          <button class="btn btn-outline" onclick="prevFlashcard()" ${idx === 0 ? 'disabled' : ''}>
            ◀ Thẻ trước
          </button>
          <button class="btn btn-secondary" onclick="flipCurrentFlashcard()">
            🔄 Lật thẻ
          </button>
          <button class="btn btn-outline" onclick="nextFlashcard()" ${idx === total - 1 ? 'disabled' : ''}>
            Thẻ sau ▶
          </button>
        </div>

        <div style="display:flex; gap:8px;">
          <button class="btn btn-sm ${portalState.mod1FlashcardKnown && portalState.mod1FlashcardKnown[idx] === 'known' ? 'btn-primary' : 'btn-outline'}" onclick="markCurrentFlashcard('known')" style="border-color:#16a34a; color:${portalState.mod1FlashcardKnown && portalState.mod1FlashcardKnown[idx] === 'known' ? '#fff' : '#16a34a'};">
            ✅ Đã thuộc
          </button>
          <button class="btn btn-sm ${portalState.mod1FlashcardKnown && portalState.mod1FlashcardKnown[idx] === 'review' ? 'btn-danger' : 'btn-outline'}" onclick="markCurrentFlashcard('review')" style="border-color:#dc2626; color:${portalState.mod1FlashcardKnown && portalState.mod1FlashcardKnown[idx] === 'review' ? '#fff' : '#dc2626'};">
            🔄 Cần ôn lại
          </button>
          <button class="btn btn-outline btn-sm" onclick="shuffleFlashcards()" title="Xáo trộn thứ tự thẻ">
            🔀 Xáo trộn
          </button>
        </div>
      </div>
    </div>
  `;
}

// Bắt sự kiện bàn phím cho Flashcard
if (typeof window !== "undefined") {
  window.addEventListener("keydown", function(e) {
    if (portalState.activeModule === 1 && portalState.mod1SubTab === 'flashcard') {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        flipCurrentFlashcard();
      } else if (e.code === 'ArrowRight' || e.key === 'ArrowRight') {
        nextFlashcard();
      } else if (e.code === 'ArrowLeft' || e.key === 'ArrowLeft') {
        prevFlashcard();
      }
    }
  });
}

function renderModule1Theory() {
  const sidebarList = document.getElementById("mod1LessonList");
  const mainContent = document.getElementById("mod1MainContent");
  if (!sidebarList || !mainContent || typeof PORTAL_DATA === "undefined") return;

  // Cập nhật nút chọn khối
  ["cn10", "cn11", "cn12"].forEach(g => {
    const btn = document.getElementById("mod1GradeBtn_" + g);
    if (btn) btn.className = `btn btn-sm ${portalState.mod1Grade === g ? 'btn-primary' : 'btn-outline'}`;
  });

  const qSearch = (portalState.mod1Search || "").toLowerCase().trim();
  const filteredLessons = PORTAL_DATA.lessons.filter(l =>
    l.grade === portalState.mod1Grade &&
    (!qSearch || l.title.toLowerCase().includes(qSearch) || (l.chapter || "").toLowerCase().includes(qSearch))
  );

  // Nhóm theo Chương để danh mục bên trái gọn gàng như Mục lục SGK
  let lastChapter = "";
  sidebarList.innerHTML = filteredLessons.map(l => {
    const showChap = l.chapter && l.chapter !== lastChapter;
    lastChapter = l.chapter;
    return `
      ${showChap ? `<div style="font-size:11px; font-weight:700; color:var(--primary-dark); background:#f0fdf4; padding:6px 10px; border-radius:5px; margin:8px 0 4px; text-transform:uppercase; letter-spacing:0.3px;">${escapeHtml(l.chapter)}</div>` : ''}
      <div class="lesson-nav-item ${l.id === portalState.mod1LessonId ? 'active' : ''}" onclick="selectMod1Lesson('${l.id}')">
        <div style="font-size:13.5px; font-weight:600;">${escapeHtml(l.title)}</div>
      </div>
    `;
  }).join("");

  const curLesson = PORTAL_DATA.lessons.find(l => l.id === portalState.mod1LessonId) || filteredLessons[0] || PORTAL_DATA.lessons[0];
  if (!curLesson) return;

  const qBundle = getQuestionsForLesson(curLesson.grade, curLesson.lesson);
  const advMcqs = qBundle.mcqs.filter(q => q.level === "hieu" || q.level === "vandung" || q.isVdc);
  const displayMcqs = advMcqs.length >= 4 ? advMcqs : qBundle.mcqs;
  const sgkSections = Array.isArray(curLesson.sgkSections) && curLesson.sgkSections.length > 0
    ? curLesson.sgkSections
    : [{ heading: "I. TÓM TẮT KIẾN THỨC TRỌNG TÂM SGK", items: curLesson.summaryPoints || [] }];

  let subHtml = "";
  if (portalState.mod1SubTab === "summary") {
    // 1. TÓM TẮT KIẾN THỨC CHUẨN SÁCH GIÁO KHOA (ĐƠN GIẢN, RÕ RÀNG)
    subHtml = `
      <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-left:4px solid var(--primary); border-radius:8px; padding:12px 16px; margin-bottom:18px;">
        <div style="font-weight:700; color:var(--primary-dark); font-size:14px; margin-bottom:6px;">🎯 Yêu cầu cần đạt (Chuẩn Sách giáo khoa Kết nối tri thức)</div>
        <ul style="margin:0 0 0 18px; padding:0; font-size:13.5px; line-height:1.65; color:#1e293b;">
          ${(curLesson.objectives && curLesson.objectives.length > 0
            ? curLesson.objectives
            : ["Trình bày được các khái niệm và nội dung kiến thức cốt lõi của bài học theo SGK."]
          ).map(o => `<li>${escapeHtml(o)}</li>`).join("")}
        </ul>
      </div>

      <div style="display:grid; gap:14px;">
        ${sgkSections.map(sec => `
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:14px 18px; box-shadow:0 1px 2px rgba(0,0,0,0.02);">
            <h4 style="color:var(--primary-dark); font-size:15.5px; margin:0 0 8px; padding-bottom:6px; border-bottom:1.5px solid #f1f5f9;">
              📘 ${escapeHtml(sec.heading)}
            </h4>
            <div>
              ${(sec.items || []).map(item => formatSgkSectionItem(item)).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  } else if (portalState.mod1SubTab === "mindmap") {
    // 2. SƠ ĐỒ TƯ DUY TRỰC QUAN (MIND MAP)
    subHtml = renderMindmapHtml(curLesson, sgkSections);
  } else if (portalState.mod1SubTab === "flashcard") {
    // 3. THẺ NHỚ GHI NHỚ NHANH (FLASHCARDS)
    subHtml = renderFlashcardsHtml(curLesson, qBundle);
  } else if (portalState.mod1SubTab === "analyzer") {
    // 2. PHÂN TÍCH TRỌNG TÂM BÀI HỌC (BÁM SÁT MẠCH KIẾN THỨC SGK CỦA CHÍNH BÀI ĐANG CHỌN)
    const explainedMcqs = qBundle.mcqs.filter(q => q.explanation && q.explanation.trim().length > 10).slice(0, 4);
    const analysisNotes = Array.isArray(curLesson.analysisNotes) ? curLesson.analysisNotes : [];

    subHtml = `
      <!-- Sơ đồ mạch kiến thức của bài -->
      <div style="margin-bottom:18px;">
        <h4 style="color:var(--primary-dark); font-size:15px; margin-bottom:10px;">🗺️ 1. Sơ đồ Mạch Kiến thức Chuẩn SGK của ${escapeHtml(curLesson.title)}</h4>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px;">
          ${sgkSections.map((sec, idx) => {
            const subHeadings = (sec.items || []).filter(it => /^\d+\.\s+/.test(String(it).trim()));
            return `
              <div style="background:#f8fafc; border:1px solid #cbd5e1; border-top:3px solid var(--primary); border-radius:8px; padding:12px;">
                <div style="font-size:11.5px; font-weight:700; color:var(--primary);">MỤC ${idx + 1}</div>
                <div style="font-weight:700; font-size:13.5px; color:#0f172a; margin:3px 0 6px;">${escapeHtml(sec.heading)}</div>
                ${subHeadings.length > 0 ? `
                  <div style="font-size:12.5px; color:#475569; line-height:1.5;">
                    ${subHeadings.map(sh => `<div>▸ ${escapeHtml(sh)}</div>`).join("")}
                  </div>
                ` : `<div style="font-size:12.5px; color:#64748b;">Gồm ${(sec.items || []).length} ý trọng tâm SGK</div>`}
              </div>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Bảng tóm lược cốt lõi từng mục SGK -->
      <div style="margin-bottom:18px;">
        <h4 style="color:var(--primary-dark); font-size:15px; margin-bottom:10px;">📊 2. Bảng Phân tích Nội dung Cốt lõi theo từng Mục SGK</h4>
        <div class="table-wrap">
          <table class="std-table">
            <thead>
              <tr>
                <th style="width:28%;">Mục kiến thức trong SGK</th>
                <th>Nội dung cốt lõi cần nắm vững</th>
              </tr>
            </thead>
            <tbody>
              ${sgkSections.map(sec => {
                const keyBullets = (sec.items || []).filter(it => !/^\d+\.\s+/.test(String(it).trim())).slice(0, 4);
                return `
                  <tr>
                    <td style="font-weight:700; color:var(--primary-dark); background:#f8fafc;">${escapeHtml(sec.heading)}</td>
                    <td>
                      ${keyBullets.map(b => `<div style="margin-bottom:4px; font-size:13.5px;">• ${escapeHtml(String(b).replace(/^[-+•]\s*/, ""))}</div>`).join("")}
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>

      ${analysisNotes.length > 0 ? `
        <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:12px 16px; margin-bottom:18px;">
          <h4 style="color:#92400e; font-size:14.5px; margin-bottom:6px;">💡 Lưu ý Sư phạm & Trọng tâm Phân tích của Bài</h4>
          <ul style="margin:0 0 0 18px; padding:0; font-size:13.5px; line-height:1.6; color:#78350f;">
            ${analysisNotes.map(n => `<li>${escapeHtml(n)}</li>`).join("")}
          </ul>
        </div>
      ` : ''}

      <!-- Giải thích câu hỏi vận dụng / bản chất của bài -->
      <div style="margin-bottom:18px;">
        <h4 style="color:var(--primary-dark); font-size:15px; margin-bottom:10px;">❓ 3. Phân tích Câu hỏi Giải thích & Vận dụng Thực tiễn của Bài</h4>
        <div class="analyzer-grid">
          ${qBundle.shorts.slice(0, 4).map(sq => `
            <div class="analyzer-card" style="background:#f0fdf4; border-color:#bbf7d0;">
              <div style="font-weight:700; color:#166534; font-size:13.5px; margin-bottom:4px;">❓ ${escapeHtml(sq.stem)}</div>
              <div style="font-size:13px; color:#1e293b; line-height:1.55;">👉 <strong>Giải thích chuẩn SGK:</strong> ${escapeHtml(sq.answer)}</div>
            </div>
          `).join("")}
          ${explainedMcqs.map(mq => `
            <div class="analyzer-card" style="background:#eff6ff; border-color:#bfdbfe;">
              <div style="font-weight:700; color:#1e40af; font-size:13.5px; margin-bottom:4px;">💡 ${escapeHtml(mq.stem)}</div>
              <div style="font-size:13px; color:#1e293b; line-height:1.55;">
                <strong>Đáp án đúng:</strong> ${escapeHtml(mq.options[mq.answer] || '')}<br/>
                <em>Giải thích: ${escapeHtml(mq.explanation)}</em>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Khung tra cứu / hỏi nhanh lý thuyết trong bài -->
      <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:14px 16px;">
        <div style="font-weight:700; color:var(--primary-dark); font-size:14px; margin-bottom:8px;">🔎 Tra cứu / Phân tích nhanh khái niệm trong ${escapeHtml(curLesson.title)}</div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <input type="text" id="theoryQueryInput" placeholder="Nhập từ khóa hoặc câu hỏi trong bài để trích xuất nhanh kiến thức SGK..." value="${escapeHtml(portalState.analyzerCustomQuery)}" style="flex:1; min-width:240px;" />
          <button class="btn btn-primary btn-sm" onclick="runInteractiveTheoryAnalyzer()">Phân tích theo SGK</button>
        </div>
        <div id="interactiveAnalyzerResult" style="display:none; margin-top:12px; background:#fff; padding:14px; border-radius:8px; border:1px solid #e2e8f0;"></div>
      </div>
    `;
  } else {
    // 3. CÂU HỎI ÔN TẬP & NÂNG CAO THEO BÀI
    subHtml = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
        <div>
          <h4 style="color:var(--primary-dark); font-size:15px; margin:0;">📝 Hệ thống Câu hỏi Ôn tập & Vận dụng — ${escapeHtml(curLesson.title)}</h4>
          <p style="font-size:12.5px; color:var(--text-muted); margin:2px 0 0;">Gồm ${displayMcqs.length} câu Trắc nghiệm 4 lựa chọn, ${qBundle.tfs.length} câu Đúng/Sai, ${qBundle.shorts.length} câu Trả lời ngắn bám sát SGK</p>
        </div>
        <button class="btn btn-outline btn-sm" onclick="document.querySelectorAll('.mod1-ans-reveal').forEach(el => el.style.display = el.style.display === 'none' ? 'block' : 'none')">👁️ Ẩn/Hiện Tất cả Đáp án</button>
      </div>

      ${displayMcqs.slice(0, 10).map((q, idx) => `
        <div class="q-card">
          <div class="q-card-header">
            <div>
              <strong>Câu ${idx + 1}:</strong>
              <span class="badge badge-${q.level || 'hieu'}">${q.isVdc ? 'Vận dụng cao' : q.level === 'vandung' ? 'Vận dụng' : q.level === 'hieu' ? 'Thông hiểu' : 'Nhận biết'}</span>
            </div>
            <button class="btn btn-outline btn-sm" onclick="const el=this.parentElement.parentElement.querySelector('.mod1-ans-reveal'); el.style.display=el.style.display==='none'?'block':'none';">Đáp án</button>
          </div>
          <div style="font-weight:600; margin-bottom:8px;">${escapeHtml(q.stem)}</div>
          <div class="options-grid">
            ${(q.options || []).map((opt, oIdx) => `
              <div class="opt-item">
                <strong>${String.fromCharCode(65 + oIdx)}.</strong> <span>${escapeHtml(opt)}</span>
              </div>
            `).join("")}
          </div>
          <div class="mod1-ans-reveal" style="display:none; margin-top:8px; padding:8px 12px; background:#dcfce7; border-radius:6px; color:#166534; font-size:13px;">
            <strong>✅ Đáp án đúng: ${String.fromCharCode(65 + (Number(q.answer) || 0))}</strong> — ${escapeHtml(q.options[q.answer] || '')}
            ${q.explanation ? `<br/><em>💡 Giải thích: ${escapeHtml(q.explanation)}</em>` : ''}
          </div>
        </div>
      `).join("")}

      ${qBundle.tfs.length > 0 ? `<h4 style="color:var(--primary-dark); margin:18px 0 10px; font-size:14.5px;">📋 Câu hỏi Trắc nghiệm Đúng – Sai (${qBundle.tfs.length} câu)</h4>` : ''}
      ${qBundle.tfs.slice(0, 4).map((tfQ, idx) => `
        <div class="q-card" style="border-left:4px solid var(--accent);">
          <div style="font-weight:700; margin-bottom:8px;">Câu Đúng/Sai ${idx + 1}: <span style="font-weight:500;">${escapeHtml(tfQ.stem || tfQ.context)}</span></div>
          <table class="std-table">
            <thead>
              <tr><th style="width:45px;">Ý</th><th>Phát biểu nhận định</th><th style="width:90px;">Mức độ</th><th style="width:95px;">Đáp án</th></tr>
            </thead>
            <tbody>
              ${(tfQ.statements || []).map((st, sIdx) => {
                const isT = st.isTrue !== undefined ? st.isTrue : st.answer;
                return `
                  <tr>
                    <td class="text-center"><strong>${st.label || st.key || ['a','b','c','d'][sIdx]})</strong></td>
                    <td>${escapeHtml(st.text)}</td>
                    <td class="text-center"><span class="badge badge-${st.level || 'hieu'}">${st.level || 'hiểu'}</span></td>
                    <td class="text-center"><strong style="color:${isT ? '#15803d' : '#dc2626'};">${isT ? 'ĐÚNG' : 'SAI'}</strong></td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      `).join("")}

      ${qBundle.shorts.length > 0 ? `<h4 style="color:var(--primary-dark); margin:18px 0 10px; font-size:14.5px;">✍️ Câu hỏi Trả lời ngắn & Vận dụng (${qBundle.shorts.length} câu)</h4>` : ''}
      <div class="analyzer-grid">
        ${qBundle.shorts.slice(0, 8).map((sq, idx) => `
          <div class="analyzer-card">
            <div style="font-weight:700; color:var(--text); margin-bottom:6px;">Câu ${idx + 1}: ${escapeHtml(sq.stem)}</div>
            <div style="font-size:13px; color:#15803d; background:#f0fdf4; padding:8px 10px; border-radius:6px; border:1px dashed #86efac;">
              <strong>👉 Đáp án:</strong> ${escapeHtml(sq.answer)}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  mainContent.innerHTML = `
    <div class="card">
      <div class="card-header" style="padding-bottom:12px; margin-bottom:12px;">
        <div>
          <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap; margin-bottom:4px;">
            <span class="badge badge-nl">${escapeHtml(curLesson.chapter)}</span>
            <span class="badge badge-biet">${escapeHtml(curLesson.sgkInfo)}</span>
          </div>
          <h2 style="font-size:18.5px; color:var(--primary-dark); margin:0;">${escapeHtml(curLesson.title)}</h2>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-secondary btn-sm" onclick="openLessonInPptModule('${curLesson.id}')">🖥️ Slide Bài giảng</button>
        </div>
      </div>

      <!-- 5 Sub-tabs tinh gọn của Phần 1 -->
      <div class="clean-tab-bar">
        <button class="clean-tab-btn ${portalState.mod1SubTab === 'summary' ? 'active' : ''}" onclick="selectMod1SubTab('summary')">
          📘 Tóm tắt SGK
        </button>
        <button class="clean-tab-btn ${portalState.mod1SubTab === 'mindmap' ? 'active' : ''}" onclick="selectMod1SubTab('mindmap')">
          🌿 Sơ đồ tư duy
        </button>
        <button class="clean-tab-btn ${portalState.mod1SubTab === 'flashcard' ? 'active' : ''}" onclick="selectMod1SubTab('flashcard')">
          🗂️ Thẻ ghi nhớ
        </button>
        <button class="clean-tab-btn ${portalState.mod1SubTab === 'analyzer' ? 'active' : ''}" onclick="selectMod1SubTab('analyzer')">
          🔍 Phân tích bài
        </button>
        <button class="clean-tab-btn ${portalState.mod1SubTab === 'advanced_q' ? 'active' : ''}" onclick="selectMod1SubTab('advanced_q')">
          📝 Câu hỏi (${displayMcqs.length + qBundle.tfs.length + qBundle.shorts.length})
        </button>
      </div>

      ${subHtml}
    </div>
  `;
}

async function runInteractiveTheoryAnalyzer() {
  const inputEl = document.getElementById("theoryQueryInput");
  const outBox = document.getElementById("interactiveAnalyzerResult");
  if (!inputEl || !outBox) return;

  const query = inputEl.value.trim();
  portalState.analyzerCustomQuery = query;
  const curLesson = (PORTAL_DATA.lessons || []).find(l => l.id === portalState.mod1LessonId) || PORTAL_DATA.lessons[0];
  const topicText = query || curLesson.title;

  outBox.style.display = "block";
  outBox.innerHTML = `<div style="color:var(--primary-dark); font-weight:600;">⏳ Đang trích xuất & phân tích kiến thức SGK cho: "${escapeHtml(topicText)}"...</div>`;

  const sgkSections = Array.isArray(curLesson.sgkSections) ? curLesson.sgkSections : [];
  const qLower = query.toLowerCase();

  // Lọc các ý trong SGK khớp từ khóa
  const matchedItems = [];
  sgkSections.forEach(sec => {
    (sec.items || []).forEach(it => {
      if (!qLower || String(it).toLowerCase().includes(qLower) || String(sec.heading).toLowerCase().includes(qLower)) {
        matchedItems.push(`[${sec.heading}] ${String(it).replace(/^[-+•]\s*/, "")}`);
      }
    });
  });

  const displayItems = matchedItems.length > 0 ? matchedItems.slice(0, 6) : (curLesson.summaryPoints || []).slice(0, 5);
  const qBundle = getQuestionsForLesson(curLesson.grade, curLesson.lesson);
  const relatedShorts = qBundle.shorts.filter(s => !qLower || s.stem.toLowerCase().includes(qLower) || s.answer.toLowerCase().includes(qLower)).slice(0, 3);
  const displayShorts = relatedShorts.length > 0 ? relatedShorts : qBundle.shorts.slice(0, 3);

  outBox.innerHTML = `
    <div style="font-weight:700; color:var(--primary-dark); font-size:14.5px; margin-bottom:8px;">
      📘 KẾT QUẢ ĐỐI CHIẾU KIẾN THỨC SGK: ${escapeHtml(topicText)}
    </div>
    <div class="analyzer-grid">
      <div class="analyzer-card" style="background:#f0fdf4;">
        <h4>1️⃣ Nội dung Chuẩn Sách giáo khoa</h4>
        <ul style="margin-left:16px; font-size:13px; line-height:1.6;">
          ${displayItems.map(p => `<li>${escapeHtml(p)}</li>`).join("")}
        </ul>
      </div>
      <div class="analyzer-card" style="background:#eff6ff;">
        <h4>2️⃣ Câu hỏi Giải thích liên quan trong Bài</h4>
        ${displayShorts.length > 0 ? displayShorts.map(s => `
          <div style="margin-bottom:8px; font-size:13px;">
            <strong>• ${escapeHtml(s.stem)}</strong><br/>
            <span style="color:#1d4ed8;">→ ${escapeHtml(s.answer)}</span>
          </div>
        `).join("") : `<p style="font-size:13px;">Bám sát nội dung trọng tâm các mục ${sgkSections.map(s => s.heading).join("; ")}.</p>`}
      </div>
    </div>
  `;
}

function openLessonInPptModule(lessonId) {
  if (portalState.isStandalone) {
    window.open(`/phan2.html?lesson=${encodeURIComponent(lessonId)}`, "_blank");
    return;
  }
  const les = (PORTAL_DATA.lessons || []).find(l => l.id === lessonId);
  if (les) {
    portalState.mod2Grade = les.grade;
    portalState.mod2LessonId = les.id;
    portalState.mod2SlideIndex = 0;
  }
  switchMainModule(2);
}

// ============================================================================
// PHẦN 2: TỔNG HỢP BÀI GIẢNG PPT ĐỂ TRÌNH CHIẾU VÀ DẠY NHANH (77 BÀI GVG)
// ============================================================================
function selectMod2Grade(grade) {
  portalState.mod2Grade = grade;
  const firstLesson = (PORTAL_DATA.lessons || []).find(l => l.grade === grade);
  if (firstLesson) {
    portalState.mod2LessonId = firstLesson.id;
    portalState.mod2SlideIndex = 0;
  }
  renderModule2PptPresenter();
}

function selectMod2Lesson(lessonId) {
  portalState.mod2LessonId = lessonId;
  portalState.mod2SlideIndex = 0;
  portalState.mod2RevealQuizAnswer = false;
  renderModule2PptPresenter();
}

function changePptSlide(delta) {
  const curLesson = (PORTAL_DATA.lessons || []).find(l => l.id === portalState.mod2LessonId) || PORTAL_DATA.lessons[0];
  if (!curLesson || !curLesson.slides) return;
  const maxIdx = curLesson.slides.length - 1;
  portalState.mod2SlideIndex = Math.max(0, Math.min(maxIdx, portalState.mod2SlideIndex + delta));
  portalState.mod2RevealQuizAnswer = false;
  renderModule2PptPresenter();
}

function jumpToPptSlide(idx) {
  portalState.mod2SlideIndex = idx;
  portalState.mod2RevealQuizAnswer = false;
  renderModule2PptPresenter();
}

function toggleSlideFullscreen() {
  const stage = document.getElementById("pptSlideStageWrapper");
  if (!stage) return;
  if (!document.fullscreenElement) {
    stage.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

function startClassTimer(seconds) {
  clearInterval(portalState.timerInterval);
  portalState.timerSeconds = seconds;
  updateTimerDisplay();
  portalState.timerInterval = setInterval(() => {
    portalState.timerSeconds--;
    updateTimerDisplay();
    if (portalState.timerSeconds <= 0) {
      clearInterval(portalState.timerInterval);
    }
  }, 1000);
}

function stopClassTimer() {
  clearInterval(portalState.timerInterval);
  portalState.timerSeconds = 0;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const el = document.getElementById("classTimerBadge");
  if (!el) return;
  if (portalState.timerSeconds <= 0) {
    el.innerHTML = "⏱️ Hết giờ / Sẵn sàng";
    el.style.background = "rgba(255,255,255,0.12)";
    return;
  }
  const m = String(Math.floor(portalState.timerSeconds / 60)).padStart(2, "0");
  const s = String(portalState.timerSeconds % 60).padStart(2, "0");
  el.innerHTML = `⏱️ Đang thảo luận: <strong>${m}:${s}</strong>`;
  el.style.background = "#dc2626";
}

function renderModule2PptPresenter() {
  if (typeof init5512Module === "function") {
    init5512Module();
    return;
  }
  const sidebarList = document.getElementById("mod2LessonList");
  const mainArea = document.getElementById("mod2PresenterArea");
  if (!sidebarList || !mainArea || typeof PORTAL_DATA === "undefined") return;

  ["cn10", "cn11", "cn12"].forEach(g => {
    const btn = document.getElementById("mod2GradeBtn_" + g);
    if (btn) btn.className = `btn btn-sm ${portalState.mod2Grade === g ? 'btn-primary' : 'btn-outline'}`;
  });

  const qSearch = (portalState.mod2Search || "").toLowerCase().trim();
  const filteredLessons = PORTAL_DATA.lessons.filter(l =>
    l.grade === portalState.mod2Grade &&
    (!qSearch || l.title.toLowerCase().includes(qSearch))
  );

  sidebarList.innerHTML = filteredLessons.map(l => `
    <div class="lesson-nav-item ${l.id === portalState.mod2LessonId ? 'active' : ''}" onclick="selectMod2Lesson('${l.id}')">
      <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted);">
        <span>${escapeHtml(l.chapter)}</span>
        <span>📊 ${l.slideCount} slides gốc</span>
      </div>
      <div style="font-size:13.5px; font-weight:600; margin-top:2px;">${escapeHtml(l.title)}</div>
    </div>
  `).join("");

  const curLesson = PORTAL_DATA.lessons.find(l => l.id === portalState.mod2LessonId) || filteredLessons[0] || PORTAL_DATA.lessons[0];
  if (!curLesson) return;

  const slides = curLesson.slides || [];
  const sIdx = Math.min(portalState.mod2SlideIndex, Math.max(0, slides.length - 1));
  const curSlide = slides[sIdx] || { num: 1, type: "cover", title: curLesson.title, subtitle: curLesson.chapter, bullets: [] };

  const typeLabelMap = {
    cover: "🎯 BÌA BÀI GIẢNG GVG",
    objective: "🎯 MỤC TIÊU & NĂNG LỰC SỐ - AI",
    warmup: "🔥 HOẠT ĐỘNG KHỞI ĐỘNG / TRÒ CHƠI",
    section: "📚 HÌNH THÀNH KIẾN THỨC MỚI",
    quiz: "⚡ CÂU HỎI TƯƠNG TÁC NHANH TRÊN LỚP",
    summary: "📌 TỔNG KẾT & GHI NHỚ",
    content: "📖 NỘI DUNG BÀI GIẢNG"
  };

  // Kiểm tra xem slide có dòng Đáp án ẩn không (để GV bấm hiện đáp án khi dạy nhanh)
  const rawBullets = curSlide.bullets || [];
  const answerLines = rawBullets.filter(b => b.startsWith("Đáp án:") || b.startsWith("✓") || b.startsWith("💡"));
  const normalBullets = rawBullets.filter(b => !answerLines.includes(b) && b !== "✗" && b !== "⟵");

  mainArea.innerHTML = `
    <!-- Thanh Công cụ Tải nhanh File PPTX Gốc & Chuyển đổi Nhanh -->
    <div class="card" style="padding:14px 20px; margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <span class="badge badge-nl">${curLesson.grade.toUpperCase()} • ${escapeHtml(curLesson.fileName)}</span>
          <h3 style="color:var(--primary-dark); font-size:17.5px; margin-top:3px;">${escapeHtml(curLesson.title)}</h3>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <a href="${curLesson.serverUrl}" download="${escapeHtml(curLesson.fileName)}" class="btn btn-accent btn-sm" style="text-decoration:none;">
            📥 Tải / Mở PowerPoint Gốc (${curLesson.slideCount} Slides .pptx)
          </a>
          <button class="btn btn-outline btn-sm" onclick="portalState.mod1Grade='${curLesson.grade}'; portalState.mod1LessonId='${curLesson.id}'; switchMainModule(1);">
            📖 Xem Tóm tắt Lý thuyết & Câu hỏi bài này (Phần 1)
          </button>
        </div>
      </div>
    </div>

    <!-- Sân khấu Trình chiếu Dạy nhanh 16:9 (Hỗ trợ Fullscreen) -->
    <div class="slide-stage-wrapper" id="pptSlideStageWrapper">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="slide-type-badge">${typeLabelMap[curSlide.type] || "📖 SLIDE BÀI GIẢNG"}</span>
          <span style="font-size:13px; color:#94a3b8;">Slide ${sIdx + 1} / ${slides.length} (Slide gốc #${curSlide.num})</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span id="classTimerBadge" style="padding:4px 10px; border-radius:6px; background:rgba(255,255,255,0.12); font-size:12.5px;">⏱️ Sẵn sàng</span>
          <button class="btn btn-outline btn-sm" style="background:#1e293b; color:#fff; border-color:#475569;" onclick="startClassTimer(60)">1 Phút</button>
          <button class="btn btn-outline btn-sm" style="background:#1e293b; color:#fff; border-color:#475569;" onclick="startClassTimer(180)">3 Phút (Think-Pair-Share)</button>
          <button class="btn btn-outline btn-sm" style="background:#1e293b; color:#fff; border-color:#475569;" onclick="stopClassTimer()">Reset</button>
          <button class="btn btn-primary btn-sm" onclick="toggleSlideFullscreen()">⛶ Toàn màn hình (Fullscreen)</button>
        </div>
      </div>

      <div class="slide-canvas">
        <div>
          <div style="font-size:13px; color:#86efac; font-weight:700; letter-spacing:0.5px;">
            ${escapeHtml(curLesson.title)} • ${escapeHtml(curLesson.sgkInfo)}
          </div>
          <div class="slide-main-title">${escapeHtml(curSlide.title)}</div>
          ${curSlide.subtitle ? `<div class="slide-subtitle">${escapeHtml(curSlide.subtitle)}</div>` : ''}

          <div class="slide-bullets">
            ${normalBullets.map(b => `
              <div class="slide-bullet-item">${escapeHtml(b)}</div>
            `).join("")}
          </div>

          ${answerLines.length > 0 ? `
            <div style="margin-top:14px;">
              <button class="btn btn-accent btn-sm" onclick="portalState.mod2RevealQuizAnswer = !portalState.mod2RevealQuizAnswer; renderModule2PptPresenter();">
                ${portalState.mod2RevealQuizAnswer ? '🙈 Ẩn Đáp án / Giải thích' : '🎉 Bấm Hiện Đáp án & Giải thích trên lớp'}
              </button>
              ${portalState.mod2RevealQuizAnswer ? `
                <div style="margin-top:10px; padding:14px 18px; background:rgba(22, 163, 74, 0.28); border:1.5px solid #4ade80; border-radius:8px; font-size:16.5px; font-weight:700; color:#dcfce7;">
                  ${answerLines.map(a => `<div>${escapeHtml(a)}</div>`).join("")}
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.12); padding-top:12px; font-size:12.5px; color:#94a3b8;">
          <span>💡 Dùng phím mũi tên <strong>←</strong> / <strong>→</strong> để chuyển slide nhanh khi đang giảng bài</span>
          <span>Bộ bài giảng Giáo viên giỏi (GVG) tích hợp Năng lực số & AI</span>
        </div>
      </div>

      <div class="slide-controls-bar">
        <button class="btn btn-outline" style="background:#1e293b; color:#fff; border-color:#475569;" onclick="changePptSlide(-1)" ${sIdx === 0 ? 'disabled' : ''}>
          ← Slide Trước
        </button>
        <div style="font-size:13.5px; font-weight:700; color:#4ade80;">
          Đang chiếu Slide ${sIdx + 1} / ${slides.length}
        </div>
        <button class="btn btn-primary" onclick="changePptSlide(1)" ${sIdx >= slides.length - 1 ? 'disabled' : ''}>
          Slide Tiếp theo →
        </button>
      </div>

      <div class="slide-thumbs-strip">
        ${slides.map((s, idx) => `
          <div class="slide-thumb-pill ${idx === sIdx ? 'active' : ''}" onclick="jumpToPptSlide(${idx})">
            #${idx + 1}: ${escapeHtml((s.subtitle || s.title || '').slice(0, 26))}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

// ============================================================================
// PHẦN 3: BỔ SUNG KHO 97 ĐỀ THI HỌC KÌ MẪU (.DOCX) VÀO QUY TRÌNH SOẠN ĐỀ CV 7991
// ============================================================================
function renderModule3ArchiveBanner() {
  const container = document.getElementById("mod3SemesterExamArchiveBox");
  if (!container || typeof PORTAL_DATA === "undefined") return;

  const exams = (PORTAL_DATA.semesterExams || []).filter(e =>
    portalState.mod3ExamGradeFilter === "all" || e.grade === portalState.mod3ExamGradeFilter
  );

  container.innerHTML = `
    <div class="card" style="padding:12px 16px; margin-bottom:14px; background:#f8fafc; border:1px solid #cbd5e1;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <span class="badge badge-nl">KHO 97 ĐỀ MẪU</span>
          <strong style="color:var(--primary-dark); font-size:14px;">Thư viện 97 Đề kiểm tra Học kì Word (.docx) đủ 3 khối 10, 11, 12</strong>
        </div>
        <button class="btn btn-outline btn-sm" onclick="portalState.mod3ShowArchive = !portalState.mod3ShowArchive; renderModule3ArchiveBanner();">
          ${portalState.mod3ShowArchive ? '▲ Thu gọn kho đề' : '📂 Xem 97 Đề mẫu (.docx)'}
        </button>
      </div>

      ${portalState.mod3ShowArchive ? `
        <div style="margin-top:12px; padding-top:12px; border-top:1px solid #e2e8f0;">
          <div class="clean-tab-bar" style="margin-bottom:10px;">
            <button class="clean-tab-btn ${portalState.mod3ExamGradeFilter === 'all' ? 'active' : ''}" onclick="portalState.mod3ExamGradeFilter='all'; renderModule3ArchiveBanner();">Tất cả (97)</button>
            <button class="clean-tab-btn ${portalState.mod3ExamGradeFilter === 'cn10' ? 'active' : ''}" onclick="portalState.mod3ExamGradeFilter='cn10'; renderModule3ArchiveBanner();">Khối 10 (18)</button>
            <button class="clean-tab-btn ${portalState.mod3ExamGradeFilter === 'cn11' ? 'active' : ''}" onclick="portalState.mod3ExamGradeFilter='cn11'; renderModule3ArchiveBanner();">Khối 11 (41)</button>
            <button class="clean-tab-btn ${portalState.mod3ExamGradeFilter === 'cn12' ? 'active' : ''}" onclick="portalState.mod3ExamGradeFilter='cn12'; renderModule3ArchiveBanner();">Khối 12 (38)</button>
          </div>
          <div class="exam-card-grid" style="max-height:290px; overflow-y:auto; padding-right:4px;">
            ${exams.map((ex, idx) => `
              <div class="exam-card-clean">
                <div style="min-width:0;">
                  <div style="display:flex; gap:6px; align-items:center; margin-bottom:3px;">
                    <span class="badge badge-biet" style="font-size:10.5px;">${ex.grade.toUpperCase()}</span>
                    <span style="font-size:11.5px; color:var(--text-muted); font-weight:600;">${escapeHtml(ex.term)}</span>
                  </div>
                  <div class="exam-card-title" title="${escapeHtml(ex.name)}">Đề số ${idx + 1} — ${escapeHtml(ex.term)} (${ex.grade.toUpperCase()})</div>
                </div>
                <div style="display:flex; gap:5px; align-items:center; flex-shrink:0;">
                  <a href="${ex.serverUrl}" download="${escapeHtml(ex.name)}" class="btn btn-outline btn-sm" style="text-decoration:none; padding:3px 8px; font-size:11.5px;" title="Tải file Word (.docx) gốc">📥 Tải</a>
                  <button class="btn btn-primary btn-sm" style="padding:3px 8px; font-size:11.5px;" onclick="loadAndUseSampleExam('${escapeHtml(ex.name)}', '${ex.grade}', '${escapeHtml(ex.term)}')" title="Đưa đề mẫu này vào quy trình soạn đề CV 7991">⚡ Dùng Đề</button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================================================
// PHẦN 4: ÔN TẬP HỌC SINH GIỎI (HSG), MÁY TÍNH KĨ THUẬT & 48 MÃ ĐỀ BỘ GD&ĐT
// ============================================================================
// ============================================================================
// DỮ LIỆU ĐỀ THI & HƯỚNG DẪN CHẤM HSG CÔNG NGHỆ NÔNG NGHIỆP CHUẨN ĐỒNG NAI
// Thang điểm 20 • Thời gian 180 phút • Trắc nghiệm 60% (12đ) • Tự luận 40% (8đ)
// ============================================================================
const DONGNAI_HSG_EXAM = {
  title: "KỲ THI CHỌN HỌC SINH GIỎI CẤP TỈNH / THÀNH PHỐ — ĐỒNG NAI",
  subject: "MÔN: CÔNG NGHỆ (ĐỊNH HƯỚNG NÔNG NGHIỆP)",
  time: "180 phút",
  maxScore: 20.0,
  mcqs: [
    // Lớp 10 (8 câu: Đất trồng, Phân bón, Trồng trọt CNC)
    { id: 1, grade: "cn10", topic: "Đất trồng", stem: "Lớp ion nằm ngoài cùng của hạt keo đất, có khả năng di chuyển tự do vào dung dịch đất và tham gia phản ứng trao đổi với các ion của rễ cây được gọi là", options: ["nhân keo đất.", "lớp ion quyết định điện thế.", "lớp ion bất động.", "lớp ion khuếch tán."], answer: 3, explanation: "Lớp ion khuếch tán nằm ngoài cùng của keo đất, liên kết lỏng lẻo với nhân keo nên dễ dàng trao đổi với các ion H+, OH- do rễ cây tiết ra." },
    { id: 2, grade: "cn10", topic: "Đất trồng", stem: "Loại đất nào sau đây có dung tích hấp phụ cation (CEC) cao nhất trong điều kiện tự nhiên?", options: ["Đất cát pha ven biển nghèo mùn.", "Đất thịt nhẹ có hàm lượng sét dưới 10%.", "Đất sét giàu mùn và hữu cơ hoai mục.", "Đất xói mòn trơ sỏi đá vùng đồi núi."], answer: 2, explanation: "Hàm lượng hạt sét và chất mùn hữu cơ càng cao thì diện tích bề mặt riêng và số lượng keo đất càng lớn, dẫn tới dung tích hấp phụ cation (CEC) cao nhất." },
    { id: 3, grade: "cn10", topic: "Đất trồng", stem: "Để cải tạo đất phèn chua (pH < 4,5) có nồng độ ion Al3+ và Fe3+ di động cao gây độc cho rễ cây, biện pháp hóa học cơ bản và hiệu quả nhất là", options: ["bón nhiều phân đạm sunfat amôn (NH4)2SO4.", "bón vôi nông nghiệp (CaCO3) kết hợp tháo nước rửa phèn.", "bón bổ sung phân kali clorua (KCl) với liều lượng lớn.", "tăng cường phun thuốc bảo vệ thực vật phổ rộng."], answer: 1, explanation: "Vôi nông nghiệp (CaCO3) cung cấp ion Ca2+ đẩy Al3+, Fe3+, H+ ra khỏi phức hệ hấp phụ của đất, đồng thời kiềm hóa nâng cao pH đất, kết tủa nhôm sắt tự do." },
    { id: 4, grade: "cn10", topic: "Phân bón", stem: "Trong kỹ thuật bón phân cho cây trồng hàng năm, nguyên tắc nào sau đây là SAI?", options: ["Toàn bộ phân hữu cơ và phân lân khó tan nên được sử dụng để bón lót sâu vào đất.", "Phân đạm và phân kali dễ hòa tan nên chia ra bón thúc nhiều lần vào các thời kỳ cây cần nhiều dinh dưỡng.", "Bón phân đạm urê vào lúc trời nắng gắt hoặc sát lúc mưa rào lớn để phân ngấm nhanh vào rễ.", "Khi bón thúc phân vô cơ cần kết hợp làm cỏ, xới xáo nhẹ và giữ đủ độ ẩm đất."], answer: 2, explanation: "Bón đạm urê lúc nắng gắt làm phân bị nhiệt phân hủy bốc hơi thành khí NH3 gây thất thoát; bón trước mưa to làm phân bị rửa trôi hoàn toàn trôi theo dòng nước." },
    { id: 5, grade: "cn10", topic: "Phân bón", stem: "Một hợp tác xã trồng lúa cần bón 120 kg N nguyên chất cho 1 ha ruộng. Nếu sử dụng phân đạm Urê có độ dinh dưỡng 46% N, khối lượng phân đạm Urê thương phẩm cần mua cho 3 ha là", options: ["260,87 kg.", "521,74 kg.", "782,61 kg.", "1.043,48 kg."], answer: 2, explanation: "Lượng N cho 3 ha = 120 × 3 = 360 kg N. Lượng Urê thương phẩm = (360 × 100) / 46 = 782,61 kg." },
    { id: 6, grade: "cn10", topic: "Trồng trọt CNC", stem: "Trong hệ thống trồng cây thủy canh kỹ thuật màng dinh dưỡng hồi lưu (NFT), dung dịch dinh dưỡng được tuần hoàn với đặc điểm", options: ["rễ cây ngập sâu hoàn toàn trong bể nước tĩnh không cần sục khí.", "một lớp màng dung dịch dinh dưỡng rất mỏng liên tục chảy qua bộ rễ giúp rễ vừa hút nước vừa hô hấp lấy oxy tối ưu.", "dung dịch dinh dưỡng được bơm phun thành dạng sương mù lơ lửng trong không khí bao quanh rễ cây.", "rễ cây được cố định hoàn toàn trong giá thể đất sét nung và chỉ tưới nước định kỳ một lần mỗi tuần."], answer: 1, explanation: "Kỹ thuật màng dinh dưỡng hồi lưu (NFT - Nutrient Film Technique) cho một dòng chất lỏng rất nông (mỏng như màng) chảy liên tục qua rễ, mặt trên của rễ tiếp xúc không khí để hô hấp oxy tối ưu." },
    { id: 7, grade: "cn10", topic: "Trồng trọt CNC", stem: "Việc che phủ luống cây bằng màng phủ nông nghiệp (nilon đen/bạc) trong trồng rau màu công nghệ cao KHÔNG mang lại tác dụng nào sau đây?", options: ["Hạn chế tối đa sự bốc thoát hơi nước của đất và giữ ẩm ổn định.", "Ngăn cản sự phát triển của cỏ dại do che khuất ánh sáng mặt trời.", "Làm tăng độ chua của đất do tích tụ quá nhiều khí cacbonic.", "Ngăn ngừa xói mòn, rửa trôi dinh dưỡng phân bón khi mưa lớn."], answer: 2, explanation: "Màng phủ nông nghiệp giúp điều hòa nhiệt ẩm, chống cỏ dại, chống rửa trôi chứ không làm tăng độ chua của đất." },
    { id: 8, grade: "cn10", topic: "Trồng trọt CNC", stem: "Cảm biến đo EC (Electrical Conductivity) trong nhà màng tự động được sử dụng nhằm mục đích trực tiếp là", options: ["đo cường độ ánh sáng quang hợp trong tán cây.", "đo tổng nồng độ các ion khoáng hòa tan trong dung dịch dinh dưỡng tưới.", "đo tỷ lệ phần trăm khí CO2 phát thải từ đất.", "phát hiện sự hiện diện của các loại nấm khuẩn gây bệnh rễ."], answer: 1, explanation: "Độ dẫn điện EC (Electrical Conductivity) tỉ lệ thuận với tổng lượng ion muối khoáng hòa tan trong dung dịch dinh dưỡng (ppm/TDS)." },

    // Lớp 11 (8 câu: Giống vật nuôi, Thức ăn chăn nuôi, Môi trường chăn nuôi)
    { id: 9, grade: "cn11", topic: "Giống vật nuôi", stem: "Phương pháp chọn lọc cá thể trong công nghệ giống vật nuôi có ưu điểm nổi bật so với chọn lọc hàng loạt là", options: ["thực hiện nhanh chóng, ít tốn kém thời gian và chi phí theo dõi.", "đánh giá chính xác được giá trị giống và tiềm năng di truyền của từng cá thể thông qua kiểm tra năng suất và đời con.", "chỉ áp dụng cho đàn vật nuôi thương phẩm có quy mô hàng triệu con.", "không cần thiết lập sổ sách ghi chép giống của gia phả thế hệ trước."], answer: 1, explanation: "Chọn lọc cá thể theo dõi chặt chẽ từng cá thể kết hợp kiểm tra đời sau nên đánh giá chính xác giá trị kiểu gen, độ di truyền tính trạng." },
    { id: 10, grade: "cn11", topic: "Giống vật nuôi", stem: "Trong chăn nuôi lợn thịt thương phẩm, công thức lai nào sau đây tạo ra con lai 3 máu có ưu thế lai cao nhất về tốc độ tăng khối lượng và tỷ lệ nạc cao?", options: ["Đực Móng Cái × Cái Ỉ.", "Đực Landrace × Cái Yorkshire → F1 (LY); Đực Duroc × Cái F1 (LY) → Lợn thương phẩm D(LY).", "Đực Móng Cái × Cái Landrace → Nuôi thịt trực tiếp.", "Đực Ba Xuyên × Cái Thuần Ỉ → Chọn lọc làm giống thuần."], answer: 1, explanation: "Công thức lai 3 máu ngoại Duroc × (Landrace × Yorkshire) tận dụng ưu thế lai của nái F1 (mắn đẻ, nuôi con khéo) và đực Duroc (tăng trọng cực nhanh, tỷ lệ nạc > 60%)." },
    { id: 11, grade: "cn11", topic: "Giống vật nuôi", stem: "Kỹ thuật bảo tồn nguồn gen vật nuôi bản địa quý hiếm của Việt Nam (như lợn Ỉ, gà Đông Tảo) bằng phương pháp bảo tồn chuyển vị (ex-situ) bao gồm biện pháp nào sau đây?", options: ["Để người dân tự do lai tạp với các giống cao sản ngoại nhập tại địa phương.", "Đóng băng tế bào mầm sinh dục, tinh trùng, phôi trong nitơ lỏng ở nhiệt độ -196 độ C.", "Đưa toàn bộ các giống vào giết mổ công nghiệp để chế biến đông lạnh.", "Ngừng hoàn toàn việc chăm sóc y tế thú y để vật nuôi thích nghi tự nhiên."], answer: 1, explanation: "Bảo tồn ex-situ (chuyển vị/ngoài hiện trường) lưu giữ vật liệu di truyền (tinh trùng, noãn, phôi) trong ngân hàng gen đông lạnh sâu ở -196 độ C." },
    { id: 12, grade: "cn11", topic: "Thức ăn chăn nuôi", stem: "Một đàn gà thịt có khối lượng lúc vào nuôi là 0,05 kg/con. Sau 42 ngày, khối lượng xuất chuồng đạt 2,45 kg/con. Bình quân mỗi con gà tiêu tốn hết 3,84 kg thức ăn. Hệ số chuyển đổi thức ăn (FCR) của đàn gà này là", options: ["1,55.", "1,60.", "1,65.", "1,72."], answer: 1, explanation: "Tăng trọng = 2,45 - 0,05 = 2,40 kg. FCR = 3,84 / 2,40 = 1,60." },
    { id: 13, grade: "cn11", topic: "Thức ăn chăn nuôi", stem: "Trang trại muốn phối trộn 1.000 kg thức ăn có tỷ lệ Protein thô đạt 18% từ ngô nghiền (9% Protein) và bã đậu nành đậm đặc (45% Protein). Áp dụng hình vuông Pearson, khối lượng ngô và bã đậu nành cần dùng lần lượt là", options: ["750 kg ngô và 250 kg bã đậu nành.", "700 kg ngô và 300 kg bã đậu nành.", "650 kg ngô và 350 kg bã đậu nành.", "800 kg ngô và 200 kg bã đậu nành."], answer: 0, explanation: "Phần ngô = |45 - 18| = 27; Phần đậu nành = |9 - 18| = 9. Tổng phần = 36. Tỷ lệ ngô = (27/36) × 1000 = 750 kg; Đậu nành = 250 kg." },
    { id: 14, grade: "cn11", topic: "Thức ăn chăn nuôi", stem: "Việc ủ chua thức ăn thô xanh (cỏ voi, thân cây ngô) cho trâu, bò nhằm mục đích chính là", options: ["biến protein thực vật thành đạm khoáng vô cơ để trâu bò tiêu hóa nhanh.", "tạo điều kiện cho vi khuẩn Lactic lên men kỵ khí sinh axit lactic làm giảm pH (< 4,2), ức chế vi khuẩn thối rữa và bảo quản lâu dài.", "làm khô hoàn toàn lượng nước trong thân cỏ để giảm chi phí vận chuyển.", "tiêu diệt toàn bộ hệ vi sinh vật dạ cỏ của động vật nhai lại."], answer: 1, explanation: "Lên men lactic yếm khí tạo môi trường axit (pH 3,8 - 4,2) ức chế vi khuẩn lên men thối và nấm mốc, giữ nguyên giá trị dinh dưỡng của cỏ xanh." },
    { id: 15, grade: "cn11", topic: "Môi trường chăn nuôi", stem: "Trong chuồng nuôi kín có kiểm soát vi khí hậu, nồng độ khí amoniac (NH3) tăng cao vượt ngưỡng cho phép chủ yếu bắt nguồn từ", options: ["quá trình hô hấp thải khí của vật nuôi trong điều kiện nhiệt độ thấp.", "sự phân hủy hiếu khí nhanh chóng của chất độn chuồng khô ráo.", "sự phân giải kỵ khí các hợp chất chứa nitơ (axit uric, urê trong phân và nước tiểu) bởi vi sinh vật khi chuồng ẩm ướt, thông gió kém.", "việc sử dụng quạt hút làm mát cưỡng bức hoạt động liên tục."], answer: 2, explanation: "Urê và axit uric trong chất thải bị enzyme urease của vi khuẩn phân giải giải phóng NH3 khi nền chuồng ẩm ướt, đọng phân lâu ngày." },
    { id: 16, grade: "cn11", topic: "Môi trường chăn nuôi", stem: "Biện pháp xử lý chất thải chăn nuôi lợn nào sau đây vừa giúp giảm thiểu ô nhiễm môi trường, diệt mầm bệnh ký sinh trùng, vừa tạo ra nguồn năng lượng tái tạo phục vụ sinh hoạt và phát điện?", options: ["Xả trực tiếp phân tươi vào mương thoát nước thủy lợi công cộng.", "Thu gom phân tươi đem phơi nắng lộ thiên gần khu dân cư.", "Xây dựng công trình hầm khí sinh học Biogas yếm khí kín kết hợp máy phát điện sinh học.", "Chôn lấp chất thải sống chưa qua xử lý trực tiếp xuống tầng nước ngầm."], answer: 2, explanation: "Công nghệ hầm Biogas phân hủy kỵ khí chất thải tiêu diệt trứng giun sán mầm bệnh, đồng thời thu hồi khí mêtan sinh học (CH4) làm năng lượng sạch." },

    // Lớp 12 (8 câu: Lâm nghiệp & Thủy sản)
    { id: 17, grade: "cn12", topic: "Lâm nghiệp", stem: "Căn cứ theo Luật Lâm nghiệp 2017, rừng ngập mặn Cần Giờ và rừng phòng hộ đầu nguồn sông Đồng Nai thuộc nhóm rừng nào sau đây?", options: ["Rừng sản xuất gỗ lớn.", "Rừng phòng hộ.", "Rừng công viên giải trí đô thị.", "Rừng cây nông nghiệp chuyên dụng."], answer: 1, explanation: "Rừng ngập mặn chắn sóng ven biển và rừng đầu nguồn giữ nước điều tiết thủy văn đều thuộc nhóm Rừng phòng hộ theo Luật Lâm nghiệp." },
    { id: 18, grade: "cn12", topic: "Lâm nghiệp", stem: "Tiêu chuẩn nào sau đây là quan trọng hàng đầu đối với cây giống lâm nghiệp (như keo lai, bạch đàn) nhân giống bằng nuôi cấy mô hoặc giâm hom khi xuất vườn đem đi trồng rừng?", options: ["Cây cao trên 2 mét, thân phân nhiều cành nhánh xum xuê.", "Cây có bộ rễ cọc đâm thủng đáy bầu đất sâu trên 1 mét vào nền đất vườn ươm.", "Cây sinh trưởng tốt, thân thẳng, đã hóa gỗ phần gốc, đỉnh sinh trưởng lành lặn, bộ rễ nguyên vẹn trong bầu không bị biến dạng, sâu bệnh.", "Cây đang trong giai đoạn ra hoa rộ và kết hạt sai quả."], answer: 2, explanation: "Tiêu chuẩn xuất vườn cây con lâm nghiệp đòi hỏi thân thẳng hóa gỗ ở gốc, không sâu bệnh, bộ rễ đan chặt giữ nguyên bầu đất." },
    { id: 19, grade: "cn12", topic: "Lâm nghiệp", stem: "Khai thác chọn (tỉa thưa) trong rừng tự nhiên sản xuất bền vững phải tuân thủ nghiêm ngặt nguyên tắc nào sau đây?", options: ["Đốn hạ toàn bộ các cây to nhất trong một khoảnh rồi đốt sạch thực bì.", "Cường độ chặt không vượt quá khả năng tăng trưởng tự nhiên (thường ≤ 30 - 35% trữ lượng) và bảo tồn cây mẹ gieo giống, cây gỗ quý tái sinh.", "Chỉ chặt cây nhỏ, non và để lại toàn bộ cây mục nát già cỗi có nấm bệnh.", "Đưa máy ủi hạng nặng cày nát toàn bộ tầng thảm mục tươi xốp của rừng."], answer: 1, explanation: "Khai thác chọn bền vững quy định cường độ chặt hợp lý (dưới 35% trữ lượng) để rừng tự tái sinh phục hồi, bảo tồn nguồn gen cây mẹ." },
    { id: 20, grade: "cn12", topic: "Lâm nghiệp", stem: "Đường băng cản lửa trắng trong các lâm trường rừng tràm hoặc rừng thông có cấu tạo đặc trưng là", options: ["một dải rừng trồng các cây có tinh dầu cao dễ bén lửa như bạch đàn.", "một dải đất được dọn sạch hoàn toàn thực bì, cày lật đất khoáng trơ rộng từ 10 - 20 m để ngăn ngọn lửa mặt đất cháy lan.", "một hàng rào dây thép gai cao 3 mét ngăn động vật hoang dã.", "một kênh dẫn dầu bôi trơn nhân tạo chạy bao quanh khu rừng."], answer: 1, explanation: "Đường băng cản lửa trắng dọn sạch toàn bộ thực bì để lộ lớp đất khoáng nhằm ngăn chặn đám cháy bề mặt lan truyền qua các khoảnh rừng." },
    { id: 21, grade: "cn12", topic: "Thủy sản", stem: "Đối với ao nuôi tôm thẻ chân trắng thâm canh công nghệ cao, ngưỡng oxy hòa tan (DO) tối thiểu cần duy trì liên tục trong nước vào ban đêm và sáng sớm để tôm không bị ngạt khí, lột xác bình thường là", options: ["≥ 1,0 mg/L.", "≥ 2,0 mg/L.", "≥ 4,0 mg/L.", "≥ 15,0 mg/L."], answer: 2, explanation: "Tôm thẻ chân trắng thâm canh đòi hỏi nồng độ oxy hòa tan cao; DO < 3,5 - 4,0 mg/L tôm sẽ giảm ăn, ngừng lột xác, nổi đầu và dễ nhiễm bệnh đục cơ." },
    { id: 22, grade: "cn12", topic: "Thủy sản", stem: "Độ trong của nước ao nuôi thủy sản đo bằng đĩa Secchi thích hợp nhất cho sự phát triển của cá, tôm thường dao động trong khoảng", options: ["5 - 10 cm (nước quá đục, phù sa và tảo đặc quánh).", "30 - 40 cm (nước có màu xanh nõn chuối hoặc đọt chuối non, mật độ tảo vừa phải).", "80 - 100 cm (nước trong vắt, nhìn thấu đáy ao nghèo dinh dưỡng).", "> 150 cm."], answer: 1, explanation: "Độ trong 30 - 40 cm biểu thị mật độ vi tảo vừa phải, tạo màu nước xanh đọt chuối hoặc nâu trà, cung cấp oxy quang hợp và che bớt ánh sáng đáy ao." },
    { id: 23, grade: "cn12", topic: "Thủy sản", stem: "Trong công nghệ nuôi tôm Biofloc (BFT), người nuôi bổ sung mật rỉ đường định kỳ vào ao nhằm mục đích bản chất là", options: ["làm nước ao có vị ngọt để kích thích tôm uống nhiều nước.", "nâng cao tỷ lệ Carbon : Nitơ (C:N ≥ 10:1 - 15:1), kích thích vi khuẩn dị dưỡng phát triển chuyển hóa các hợp chất nitơ độc (NH4+/NH3) thành sinh khối vi khuẩn giàu protein.", "tiêu diệt toàn bộ hệ vi sinh vật có trong ao để vô trùng nước tuyệt đối.", "khử hoàn toàn độ mặn của nước biển thành nước ngọt hoàn toàn."], answer: 1, explanation: "Mật rỉ đường cung cấp nguồn Carbon hữu cơ để vi khuẩn dị dưỡng đồng hóa Amoniac (NH3/NH4+) thành protein vi sinh vật tạo nên các hạt Biofloc làm thức ăn cho tôm." },
    { id: 24, grade: "cn12", topic: "Thủy sản", stem: "Kỹ thuật kích thích cá sinh sản nhân tạo bằng cách tiêm kích dục tố (như não thùy thể, HCG hoặc LHRH-A kết hợp Domperidone) tác động trực tiếp vào cơ chế nào của cá bố mẹ?", options: ["Tác động lên trục thần kinh - nội tiết (vùng dưới đồi - tuyến yên - tuyến sinh dục) thúc đẩy sự chín và rụng trứng/tinh trùng hàng loạt.", "Làm biến đổi đột biến gen cấu trúc khiến cá mẹ tự thụ tinh không cần cá đực.", "Làm tê liệt hệ thần kinh vận động để dễ dàng mổ lấy trứng nhân tạo.", "Làm tăng gấp 10 lần khả năng chịu lạnh của cá hương, cá giống."], answer: 0, explanation: "Kích dục tố ngoại sinh bắt chước hormone vùng dưới đồi và tuyến yên, kích hoạt tuyến sinh dục tiết steroid sinh dục hoàn thiện quá trình rụng trứng." }
  ],
  tfs: [
    {
      id: 1,
      grade: "cn10",
      title: "Câu 1: Đất trồng bazan thoái hóa & Tưới nhỏ giọt công nghệ cao (Lớp 10)",
      context: "Một công ty nông nghiệp công nghệ cao tại Định Quán (Đồng Nai) tiến hành cải tạo 10 ha đất bazan thoái hóa có tầng đất mỏng, dốc nhẹ và độ chua cao (pH_KCl = 4,1) để trồng sầu riêng VietGAP kết hợp tưới nhỏ giọt tự động. Xét tính Đúng/Sai của các nhận định sau:",
      statements: [
        { label: "a", isTrue: true, text: "Việc bón vôi nông nghiệp (CaCO3) với liều lượng thích hợp có tác dụng khử chua, nâng cao độ pH của đất nhờ ion Ca2+ đẩy các ion H+ và Al3+ ra khỏi phức hệ hấp phụ của keo đất vào dung dịch đất để bị trung hòa hoặc rửa trôi.", explanation: "Ca2+ trao đổi đẩy H+, Al3+ ra dung dịch đất; gốc carbonate kiềm hóa làm tăng pH đất." },
        { label: "b", isTrue: false, text: "Để cải tạo đất nhanh và cung cấp đạm tức thời, công ty nên hòa tan một lượng lớn phân đạm Sunfat amôn (NH4)2SO4 vào hệ thống tưới nhỏ giọt tưới liên tục hàng ngày mà không cần bổ sung phân hữu cơ.", explanation: "(NH4)2SO4 là phân chua sinh lý (để lại gốc SO4(2-) tạo H2SO4) sẽ làm chua đất nặng nề hơn." },
        { label: "c", isTrue: true, text: "Việc trồng cây họ Đậu (như đậu đỗ, lạc dại) xen giữa các hàng sầu riêng vừa có tác dụng che phủ chống xói mòn đất khi mưa lớn, vừa làm giàu đạm tự nhiên cho đất nhờ hoạt động cố định nitơ khí quyển của vi khuẩn nốt sần Rhizobium.", explanation: "Vi khuẩn nốt sần Rhizobium cố định nitơ khí quyển cung cấp đạm sinh học, thảm phủ chống xói mòn." },
        { label: "d", isTrue: false, text: "Hệ thống tưới nhỏ giọt kết hợp châm phân dinh dưỡng tự động (fertigation) chỉ có ưu điểm là tiết kiệm nước tưới chứ không thể giúp tiết kiệm lượng phân bón sử dụng so với phương pháp rải phân mặt đất truyền thống.", explanation: "Fertigation đưa phân trực tiếp đến vùng rễ, hạn chế bốc hơi và rửa trôi, tiết kiệm 30 - 50% phân bón." }
      ]
    },
    {
      id: 2,
      grade: "cn11",
      title: "Câu 2: Công nghệ Thức ăn & Bảo vệ Môi trường Chăn nuôi (Lớp 11)",
      context: "Một hợp tác xã chăn nuôi lợn thịt quy mô 2.000 con tại Thống Nhất (Đồng Nai) áp dụng quy trình chuồng kín, tự phối trộn thức ăn hỗn hợp và xây dựng hệ thống xử lý môi trường chất thải toàn diện. Xét tính Đúng/Sai của các nhận định sau:",
      statements: [
        { label: "a", isTrue: false, text: "Khi phối trộn thức ăn cho lợn thịt giai đoạn vỗ béo xuất chuồng (60 - 100 kg), hợp tác xã cần tăng mạnh tỷ lệ thức ăn đậm đặc giàu protein thô lên trên 24% để thịt lợn săn chắc nhất.", explanation: "Giai đoạn vỗ béo lợn cần năng lượng là chính, nhu cầu protein thô chỉ khoảng 13 - 15%; tăng > 24% gây lãng phí và ô nhiễm NH3." },
        { label: "b", isTrue: true, text: "Chỉ số FCR của đàn lợn đạt 2,4 có nghĩa là để đàn lợn tăng thêm 1 kg khối lượng cơ thể thì trung bình cả đàn tiêu tốn hết 2,4 kg thức ăn hỗn hợp hoàn chỉnh.", explanation: "Định nghĩa FCR = Tổng lượng thức ăn tiêu thụ / Khối lượng tăng trọng." },
        { label: "c", isTrue: true, text: "Hỗn hợp khí Biogas sinh ra từ hầm ủ yếm khí chất thải chăn nuôi có thành phần cháy sinh nhiệt chủ yếu là khí Mêtan (CH4, chiếm khoảng 50 - 70%) và khí Cacbonic (CO2).", explanation: "Khí sinh học Biogas chứa 50 - 70% khí CH4 và 30 - 40% khí CO2." },
        { label: "d", isTrue: true, text: "Việc lắp đặt máy ép tách phân cơ học (tách bã rắn ra khỏi nước thải lỏng) trước khi nước thải đi vào hầm biogas sẽ làm giảm tải lượng chất hữu cơ (COD, BOD) lắng đọng dưới đáy hầm, kéo dài tuổi thọ hầm và thu được bã phân khô làm phân compost hữu cơ giá trị cao.", explanation: "Tách bã phân giảm 60% chất hữu cơ lơ lửng vào biogas, chống quá tải đáy hầm và tạo phân hữu cơ sạch." }
      ]
    },
    {
      id: 3,
      grade: "cn12",
      title: "Câu 3: Quản lý Rừng phòng hộ & Khai thác bền vững (Lớp 12)",
      context: "Ban Quản lý Rừng phòng hộ Tân Phú (Đồng Nai) triển khai phương án quản lý rừng bền vững giai đoạn 2026 – 2030 kết hợp trồng bổ sung rừng làm giàu rừng gỗ lớn bản địa (dầu rái, sao đen, gõ đỏ). Xét tính Đúng/Sai của các nhận định sau:",
      statements: [
        { label: "a", isTrue: true, text: "Rừng phòng hộ đầu nguồn có vai trò cơ bản nhất là điều tiết nguồn nước ngầm, giảm lũ lụt trong mùa mưa, duy trì dòng chảy kiệt trong mùa khô và chống bồi lắng lòng hồ thủy điện Trị An.", explanation: "Tán rừng và thảm mục giữ nước như bể ngầm tự nhiên, điều tiết dòng chảy và chống bồi lắng lòng hồ." },
        { label: "b", isTrue: false, text: "Để làm giàu rừng nghèo kiệt, giải pháp kỹ thuật tối ưu nhất là cho máy móc phát quang chặt trắng toàn bộ các loài cây bụi, dây leo và cây gỗ tạp hiện có rồi mới trồng mới các loài cây bản địa ưa bóng hoàn toàn.", explanation: "Chặt trắng phá hủy vi khí hậu và gây xói mòn đất; phải mở tán cục bộ hoặc mở rạch theo băng." },
        { label: "c", isTrue: true, text: "Cây dầu rái, sao đen, gõ đỏ là những loài cây bản địa có chu kỳ sinh trưởng dài (trên 30 - 50 năm), giai đoạn non ưa bóng nhẹ cần có tán che chở, giai đoạn trưởng thành vươn lên tầng ưu thế đòi hỏi ánh sáng hoàn toàn.", explanation: "Đặc tính sinh thái cây họ Dầu: con ưa bóng nhẹ, lớn đòi hỏi ánh sáng vượt tán." },
        { label: "d", isTrue: false, text: "Chứng chỉ rừng quốc tế FSC (Forest Stewardship Council) chỉ là một thủ tục hành chính hình thức, không có tác động gì đến giá trị kinh tế và khả năng xuất khẩu sản phẩm gỗ của các doanh nghiệp chế biến gỗ Đồng Nai.", explanation: "Chứng chỉ FSC là yêu cầu bắt buộc khi xuất khẩu vào các thị trường lớn (EU, Mỹ), giúp tăng giá bán 15 - 30%." }
      ]
    },
    {
      id: 4,
      grade: "cn12",
      title: "Câu 4: Quản lý Chất lượng Nước Thủy sản & Công nghệ RAS (Lớp 12)",
      context: "Một trang trại nuôi cá tra và cá rô phi ứng dụng công nghệ sông trong ao (IPRS) và hệ thống tuần hoàn RAS tại Nhơn Trạch (Đồng Nai). Xét tính Đúng/Sai của các nhận định sau:",
      statements: [
        { label: "a", isTrue: true, text: "Trong ao nuôi cá thâm canh, nồng độ khí amoniac tự do không ion hóa (NH3) có độc tính rất cao đối với mang và máu cá, độc tính này tăng lên rõ rệt khi độ pH của nước ao tăng cao (pH > 8,5) và nhiệt độ nước cao.", explanation: "Cân bằng NH4(+) <-> NH3 + H(+) chuyển dịch tạo nhiều khí độc NH3 khi pH và nhiệt độ tăng." },
        { label: "b", isTrue: true, text: "Hiện tượng cá nổi đầu hàng loạt đớp khí trên mặt nước vào khoảng 4 - 6 giờ sáng là biểu hiện điển hình của việc ngạt khí do nồng độ oxy hòa tan (DO) trong ao giảm xuống mức thấp nhất trong chu kỳ 24 giờ.", explanation: "Ban đêm tảo ngừng quang hợp, chỉ hô hấp cùng cá làm oxy hòa tan cạn kiệt lúc rạng sáng." },
        { label: "c", isTrue: false, text: "Trong hệ thống lọc sinh học (biofilter) của mô hình nuôi tuần hoàn RAS, nhóm vi khuẩn dị dưỡng sẽ trực tiếp oxy hóa ion độc NO2(-) thành ion ít độc NO3(-) mà không cần tiêu tốn oxy hòa tan.", explanation: "Vi khuẩn Nitrobacter là vi khuẩn tự dưỡng hiếu khí bắt buộc, tiêu tốn rất nhiều oxy để oxy hóa NO2(-) thành NO3(-)." },
        { label: "d", isTrue: true, text: "Việc định kỳ sử dụng chế phẩm sinh học chứa vi khuẩn có ích (Bacillus subtilis, Nitrosomonas, Nitrobacter) giúp phân hủy thức ăn dư thừa, giảm bùn đáy ao và chuyển hóa khí độc mà không gây tồn dư kháng sinh trong thịt cá.", explanation: "Chế phẩm sinh học phân hủy hữu cơ và cạnh tranh mầm bệnh an toàn sinh học không để lại dư lượng." }
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
      problem: "Tại vùng nuôi thủy sản thâm canh, một hộ nuôi tiến hành thả tôm thẻ chân trắng (Litopenaeus vannamei) trong 2 ao nuôi lót bạt đáy (diện tích mỗi ao 1.500 m2) ứng dụng công nghệ tuần hoàn kết hợp hạt Biofloc.\n1. Sau 60 ngày nuôi, mật độ thả ban đầu là 180 con/m2, tỷ lệ sống ước tính đạt 85%, kích cỡ tôm bình quân đạt 60 con/kg. Hãy tính:\n   • Tổng số cá thể tôm hiện có trong cả 2 ao nuôi. (0,5 điểm)\n   • Tổng sinh khối tôm trong cả 2 ao (kg). (0,5 điểm)\n   • Khối lượng thức ăn cần cho cả 2 ao ăn trong một ngày, biết khẩu phần ăn hàng ngày ở giai đoạn này bằng 3,5% tổng sinh khối tôm. (0,5 điểm)\n2. Vào tuần nuôi thứ 9, xét nghiệm mẫu nước ao phát hiện hàm lượng khí độc amoniac tự do NH3 đo được là 0,15 mg/L (> 0,05 mg/L) và NO2(-) là 1,2 mg/L (> 0,1 mg/L), tôm có hiện tượng giảm ăn, bơi lờ đờ ở tầng mặt nước.\n   • Hãy giải thích nguyên nhân sinh hóa dẫn đến việc tích tụ hai loại khí độc trên trong ao nuôi thâm canh. (1,0 điểm)\n   • Đề xuất quy trình 4 bước xử lý cấp bách để đưa các chỉ tiêu môi trường nước ao trở lại trạng thái an toàn cho tôm. (1,0 điểm)",
      rubric: [
        "1.1. Số lượng tôm (0,5đ): S = 3.000 m2. Số thả = 540.000 con. Số còn sống = 540.000 × 85% = 459.000 con.",
        "1.2. Sinh khối tôm (0,5đ): M = 459.000 / 60 = 7.650 kg tôm.",
        "1.3. Khối lượng thức ăn/ngày (0,5đ): Thức ăn = 7.650 × 3,5% = 267,75 kg/ngày.",
        "2.1. Nguyên nhân sinh hóa (1,0đ): Thức ăn thừa và phân tôm phân hủy giải phóng NH4+/NH3; Quá trình nitrat hóa hiếu khí bị nghẽn ở bước trung gian (thiếu oxy đáy hoặc mật độ Nitrobacter suy giảm) làm tích tụ nồng độ ion nitrite NO2(-) gây độc.",
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
};


function selectDongNaiTable(tbl) {
  portalState.hsgDongNaiTable = tbl;
  renderModule4Hsg();
}

function chooseDongNaiMcq(qIdx, oIdx) {
  if (portalState.hsgDongNaiSubmitted) return;
  if (!portalState.hsgDongNaiUserMcq) portalState.hsgDongNaiUserMcq = {};
  portalState.hsgDongNaiUserMcq[qIdx] = oIdx;
  renderModule4Hsg();
}

function chooseDongNaiTf(qIdx, label, val) {
  if (portalState.hsgDongNaiSubmitted) return;
  if (!portalState.hsgDongNaiUserTf) portalState.hsgDongNaiUserTf = {};
  if (!portalState.hsgDongNaiUserTf[qIdx]) portalState.hsgDongNaiUserTf[qIdx] = {};
  portalState.hsgDongNaiUserTf[qIdx][label] = val;
  renderModule4Hsg();
}

function inputDongNaiExplain(qIdx, label, val) {
  if (!portalState.hsgDongNaiUserExplain) portalState.hsgDongNaiUserExplain = {};
  if (!portalState.hsgDongNaiUserExplain[qIdx]) portalState.hsgDongNaiUserExplain[qIdx] = {};
  portalState.hsgDongNaiUserExplain[qIdx][label] = val;
}

function submitDongNaiExam() {
  portalState.hsgDongNaiSubmitted = true;
  renderModule4Hsg();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function exportDongNaiHsgWord() {
  const exam = DONGNAI_HSG_EXAM;
  const tbl = portalState.hsgDongNaiTable || 'A';
  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>De Thi HSG Cong Nghe Nong Nghiep Dong Nai</title>
    <style>body{font-family:"Times New Roman",serif;font-size:12pt;line-height:1.45;} h2,h3{text-align:center;} table{border-collapse:collapse;width:100%;} th,td{border:1px solid #000;padding:5px;font-size:11pt;}</style></head>
    <body>
      <table style="border:none;width:100%;margin-bottom:15px;">
        <tr style="border:none;">
          <td style="border:none;text-align:center;width:45%;"><strong>SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG NAI</strong><br/><strong>ĐỀ THI MINH HỌA SỐ 01</strong></td>
          <td style="border:none;text-align:center;width:55%;"><strong>KỲ THI CHỌN HỌC SINH GIỎI CẤP TỈNH / THÀNH PHỐ</strong><br/><strong>MÔN: CÔNG NGHỆ (ĐỊNH HƯỚNG NÔNG NGHIỆP)</strong><br/><em>Thời gian làm bài: 180 phút (Thang điểm 20,0)</em></td>
        </tr>
      </table>
      <hr/>
      <h4>PHẦN I. CÂU TRẮC NGHIỆM NHIỀU LỰA CHỌN (6,0 điểm)</h4>
      <p><em>Thí sinh trả lời từ câu 1 đến câu 24. Mỗi câu đúng được 0,25 điểm.</em></p>
      ${exam.mcqs.map((q, i) => `
        <p><strong>Câu ${i + 1} (${escapeHtml(q.topic)}):</strong> ${escapeHtml(q.stem)}<br/>
        ${(q.options || []).map((opt, oIdx) => `&nbsp;&nbsp;<strong>${String.fromCharCode(65 + oIdx)}.</strong> ${escapeHtml(opt)}`).join("<br/>")}
        </p>
      `).join("")}

      <h4>PHẦN II. CÂU HỎI ĐÚNG / SAI CÓ GIẢI THÍCH (6,0 điểm)</h4>
      <p><em>Thí sinh trả lời từ câu 1 đến câu 4. Xác định Đúng/Sai và ghi lời giải thích cơ sở khoa học vào phiếu làm bài.</em><br/>
      <strong>Cấu hình chấm đang áp dụng: BẢNG ${tbl}</strong> (${tbl === 'A' ? 'Đúng ý: 0,125đ; Giải thích đúng: +0,25đ' : 'Đúng ý: 0,25đ; Giải thích đúng: +0,125đ'}).</p>
      ${exam.tfs.map(q => `
        <p><strong>${escapeHtml(q.title)}:</strong><br/>${escapeHtml(q.context)}<br/>
        ${q.statements.map(st => `&nbsp;&nbsp;<strong>${st.label})</strong> ${escapeHtml(st.text)}`).join("<br/>")}
        </p>
      `).join("")}

      <h4>PHẦN III. TỰ LUẬN CHUYÊN SÂU & NÂNG CAO (8,0 điểm)</h4>
      ${exam.essays.map(p => `
        <p><strong>${escapeHtml(p.title)}:</strong><br/>${escapeHtml(p.problem).replace(/\n/g, "<br/>")}</p>
      `).join("")}

      <hr/>
      <h3 style="page-break-before:always;">ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM CHI TIẾT</h3>
      <h4>I. Đáp án Phần I (24 câu MCQ - 6,0 điểm)</h4>
      <table>
        <tr>${exam.mcqs.slice(0, 12).map((_, i) => `<th style="text-align:center;">Câu ${i + 1}</th>`).join("")}</tr>
        <tr>${exam.mcqs.slice(0, 12).map(q => `<td style="text-align:center;"><strong>${String.fromCharCode(65 + q.answer)}</strong></td>`).join("")}</tr>
        <tr>${exam.mcqs.slice(12, 24).map((_, i) => `<th style="text-align:center;">Câu ${13 + i}</th>`).join("")}</tr>
        <tr>${exam.mcqs.slice(12, 24).map(q => `<td style="text-align:center;"><strong>${String.fromCharCode(65 + q.answer)}</strong></td>`).join("")}</tr>
      </table>

      <h4>II. Hướng dẫn chấm Phần II (Đúng/Sai có giải thích - 6,0 điểm)</h4>
      <table>
        <thead><tr><th>Câu & Ý</th><th>Kết luận</th><th>Căn cứ giải thích khoa học chuẩn</th><th>Điểm Bảng A</th><th>Điểm Bảng B</th></tr></thead>
        <tbody>
          ${exam.tfs.flatMap(q => q.statements.map(st => `
            <tr>
              <td style="text-align:center;"><strong>Câu ${q.id} ${st.label}</strong></td>
              <td style="text-align:center;font-weight:bold;color:${st.isTrue ? 'green' : 'red'};">${st.isTrue ? 'ĐÚNG' : 'SAI'}</td>
              <td>${escapeHtml(st.explanation)}</td>
              <td style="text-align:center;">${st.isTrue ? '0,125 + 0,25' : '0,125 + 0,25'}</td>
              <td style="text-align:center;">${st.isTrue ? '0,25 + 0,125' : '0,25 + 0,125'}</td>
            </tr>
          `)).join("")}
        </tbody>
      </table>

      <h4>III. Hướng dẫn chấm Phần III (Tự luận - 8,0 điểm)</h4>
      ${exam.essays.map(p => `
        <p><strong>${escapeHtml(p.title)}:</strong></p>
        <ul>${p.rubric.map(r => `<li>${escapeHtml(r)}</li>`).join("")}</ul>
      `).join("")}
    </body></html>
  `;
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `De-Thi-HSG-Cong-Nghe-Dong-Nai-Bang-${tbl}.doc`;
  a.click();
}

function exportDongNaiAnswerSheetWord() {
  const exam = DONGNAI_HSG_EXAM;
  const tbl = portalState.hsgDongNaiTable || 'A';
  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>Phieu Tra Loi Bai Thi HSG Dong Nai</title>
    <style>body{font-family:"Times New Roman",serif;font-size:12pt;line-height:1.4;} h2,h3{text-align:center;} table{border-collapse:collapse;width:100%;} th,td{border:1px solid #000;padding:6px;font-size:11pt;}</style></head>
    <body>
      <table style="border:none;width:100%;margin-bottom:10px;">
        <tr style="border:none;">
          <td style="border:none;text-align:center;width:45%;"><strong>SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG NAI</strong><br/>HỘI ĐỒNG THI: .........................</td>
          <td style="border:none;text-align:center;width:55%;"><strong>PHIẾU TRẢ LỜI BÀI THI HỌC SINH GIỎI CẤP TỈNH</strong><br/><strong>MÔN: CÔNG NGHỆ (ĐỊNH HƯỚNG NÔNG NGHIỆP)</strong><br/><em>Thời gian: 180 phút — Bảng thi: BẢNG ${tbl}</em></td>
        </tr>
      </table>
      <table style="width:100%;margin-bottom:12px;">
        <tr>
          <td>Họ và tên thí sinh: .............................................................</td>
          <td>Số báo danh: ..................... Phòng thi: .......</td>
        </tr>
        <tr>
          <td>Ngày sinh: ................................. Trường THPT: .......................................</td>
          <td>Mã phách: ........................................</td>
        </tr>
      </table>

      <table style="width:100%;margin-bottom:15px;text-align:center;">
        <thead>
          <tr><th colspan="3">ĐIỂM TỪNG PHẦN THI (Thang 20 điểm)</th><th rowspan="2">TỔNG ĐIỂM (Bằng số & chữ)</th><th rowspan="2">CHỮ KÝ GIÁM KHẢO</th></tr>
          <tr><th>Phần I (Trắc nghiệm /6,0đ)</th><th>Phần II (Đúng-Sai /6,0đ)</th><th>Phần III (Tự luận /8,0đ)</th></tr>
        </thead>
        <tbody>
          <tr style="height:45px;">
            <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
            <td style="text-align:left;font-size:10pt;">GK 1: .................................<br/>GK 2: .................................</td>
          </tr>
        </tbody>
      </table>

      <h4>PHẦN I: BẢNG TRẢ LỜI CÂU HỎI TRẮC NGHIỆM (24 câu - 6,0 điểm)</h4>
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

      <h4 style="margin-top:20px;">PHẦN II: BẢNG TRẢ LỜI ĐÚNG / SAI CÓ GIẢI THÍCH (16 ý - 6,0 điểm)</h4>
      <p><em>(Thí sinh đánh dấu Đ hoặc S vào cột Kết luận VÀ viết lời giải thích ngắn gọn cơ sở khoa học vào dòng bên cạnh)</em></p>
      <table>
        <thead>
          <tr>
            <th style="width:80px;text-align:center;">Câu & Ý</th>
            <th style="width:70px;text-align:center;">Kết luận</th>
            <th>Lời giải thích cơ sở khoa học (Bắt buộc để đạt trọn điểm)</th>
            <th style="width:70px;text-align:center;">Điểm GK</th>
          </tr>
        </thead>
        <tbody>
          ${exam.tfs.flatMap(q => q.statements.map(st => `
            <tr style="height:38px;">
              <td style="text-align:center;"><strong>Câu ${q.id} ${st.label}</strong></td>
              <td style="text-align:center;">[ ] Đ<br/>[ ] S</td>
              <td>..........................................................................................................................................................<br/>..........................................................................................................................................................</td>
              <td>&nbsp;</td>
            </tr>
          `)).join("")}
        </tbody>
      </table>

      <h4 style="page-break-before:always;margin-top:20px;">PHẦN III: PHẦN LÀM BÀI TỰ LUẬN (8,0 điểm)</h4>
      <p><em>(Thí sinh viết lời giải chi tiết cho Câu 1, Câu 2 và Câu 3 vào các trang giấy thi tự luận tiếp theo)</em></p>
      <div style="min-height:750px;border:1px dashed #999;padding:15px;line-height:2.2;">
        <strong>BÀI LÀM:</strong><br/>
        ............................................................................................................................................................................................................<br/>
        ............................................................................................................................................................................................................<br/>
        ............................................................................................................................................................................................................<br/>
        ............................................................................................................................................................................................................<br/>
        ............................................................................................................................................................................................................<br/>
        ............................................................................................................................................................................................................<br/>
        ............................................................................................................................................................................................................
      </div>
    </body></html>
  `;
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Phieu-Lam-Bai-Thi-HSG-Dong-Nai-Bang-${tbl}.doc`;
  a.click();
}


function initHsgQuizPool() {
  if (typeof QUESTION_BANK === "undefined") return;
  const vdcMcqs = QUESTION_BANK.mcq.filter(q =>
    (q.isVdc || q.level === "vandung" || q.level === "hieu") &&
    (portalState.mod4Grade === "all" || q.grade === portalState.mod4Grade || (q.unitId && q.unitId.startsWith(portalState.mod4Grade === "cn10" ? "u" : portalState.mod4Grade)))
  );
  // Chọn 15 câu phân hóa cao
  const shuffled = [...vdcMcqs].sort(() => Math.random() - 0.5);
  portalState.hsgQuizItems = shuffled.slice(0, 15);
  portalState.hsgUserAnswers = {};
  portalState.hsgSubmitted = false;
}

function switchMod4MainSection(section) {
  portalState.mod4MainSection = section;
  renderModule4Hsg();
}

function selectMod4HsgSubTab(tab) {
  portalState.mod4HsgSubTab = tab;
  renderModule4Hsg();
}

function selectMod4Tab(tab) {
  portalState.mod4HsgSubTab = tab;
  renderModule4Hsg();
}

function selectMod4Grade(grade) {
  portalState.mod4Grade = grade;
  initHsgQuizPool();
  renderModule4Hsg();
}

function chooseHsgAnswer(qIdx, oIdx) {
  if (portalState.hsgSubmitted) return;
  portalState.hsgUserAnswers[qIdx] = oIdx;
  renderModule4Hsg();
}

function submitHsgQuiz() {
  portalState.hsgSubmitted = true;
  renderModule4Hsg();
}

function exportHsgExamWord() {
  const items = portalState.hsgQuizItems;
  const problems = HSG_SPECIAL_PROBLEMS;
  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>De Boi Duong HSG Cong Nghe Nong Nghiep</title>
    <style>body{font-family:"Times New Roman",serif;font-size:12pt;line-height:1.45;} h2,h3{text-align:center;}</style></head>
    <body>
      <h2>ĐỀ BỒI DƯỠNG HỌC SINH GIỎI MÔN CÔNG NGHỆ NÔNG NGHIỆP</h2>
      <h3>(Tích hợp Câu hỏi Vận dụng cao & Bài toán Kĩ thuật Nông nghiệp)</h3>
      <hr/>
      <h4>PHẦN I. CÂU HỎI TRẮC NGHIỆM VẬN DỤNG & PHÂN HÓA CAO (${items.length} câu)</h4>
      ${items.map((q, i) => `
        <p><strong>Câu ${i + 1}:</strong> ${escapeHtml(q.stem)}<br/>
        ${(q.options || []).map((opt, oIdx) => `&nbsp;&nbsp;<strong>${String.fromCharCode(65 + oIdx)}.</strong> ${escapeHtml(opt)}`).join("<br/>")}
        </p>
      `).join("")}
      <h4>PHẦN II. BÀI TOÁN KĨ THUẬT & TỰ LUẬN CHUYÊN SÂU HỌC SINH GIỎI</h4>
      ${problems.map((p, i) => `
        <p><strong>Bài ${i + 1} (${escapeHtml(p.title)}):</strong><br/>${escapeHtml(p.problem).replace(/\n/g, "<br/>")}</p>
      `).join("")}
      <hr/>
      <h3>HƯỚNG DẪN CHẤM VÀ LỜI GIẢI CHI TIẾT</h3>
      <p><strong>I. Đáp án Phần I:</strong> ${items.map((q, i) => `Câu ${i + 1}: <strong>${String.fromCharCode(65 + (Number(q.answer) || 0))}</strong>`).join(" | ")}</p>
      ${problems.map((p, i) => `
        <p><strong>Hướng dẫn giải Bài ${i + 1}:</strong><br/>${p.solutionSteps.map(s => escapeHtml(s).replace(/\n/g, "<br/>")).join("<br/>")}</p>
      `).join("")}
    </body></html>
  `;
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "De-Boi-Duong-HSG-Cong-Nghe-Nong-Nghiep.doc";
  a.click();
}

// ============================================================================
// PHÂN HỆ II: LUYỆN THI TỐT NGHIỆP THPT (CHUẨN MẪU BỘ GD&ĐT)
// Cấu trúc chuẩn Bộ: 24 MCQ (6,0đ) + 4 Đúng/Sai (4,0đ, thang 0.1 - 0.25 - 0.5 - 1.0đ) = 28 câu, 50 phút
// ============================================================================
function initGradExam(examId) {
  if (typeof QUESTION_BANK === "undefined") return;
  portalState.gradExamId = examId || "bo_2025_sample";
  portalState.gradSubmitted = false;
  portalState.gradScore = null;
  portalState.gradUserMcqAnswers = {};
  portalState.gradUserTfAnswers = {};
  portalState.gradTimerSeconds = 50 * 60;
  pauseGradTimer();

  let cn12Mcqs = (QUESTION_BANK.mcq || []).filter(q => q.grade === "cn12" || (q.unitId && q.unitId.startsWith("cn12")));
  let cn12Tfs = (QUESTION_BANK.tf || []).filter(q => q.grade === "cn12" || (q.unitId && q.unitId.startsWith("cn12")));
  if (cn12Mcqs.length < 24) cn12Mcqs = QUESTION_BANK.mcq || [];
  if (cn12Tfs.length < 4) cn12Tfs = QUESTION_BANK.tf || [];

  let selectedMcq = [];
  let selectedTf = [];

  if (portalState.gradExamId === "bo_2025_sample") {
    portalState.gradExamTitle = "Đề Tham Khảo Tốt Nghiệp THPT 2025 — Bộ GD&ĐT (Mẫu chuẩn công bố)";
    selectedMcq = cn12Mcqs.slice(0, 24);
    selectedTf = cn12Tfs.slice(0, 4);
  } else if (portalState.gradExamId === "bo_2026_0701") {
    portalState.gradExamTitle = "Đề Thi Chính Thức Bộ GD&ĐT 2026 — Mã Đề 0701";
    selectedMcq = cn12Mcqs.slice(24, 48);
    selectedTf = cn12Tfs.slice(4, 8);
  } else if (portalState.gradExamId === "bo_2026_0702") {
    portalState.gradExamTitle = "Đề Thi Chính Thức Bộ GD&ĐT 2026 — Mã Đề 0702";
    selectedMcq = cn12Mcqs.slice(48, 72);
    selectedTf = cn12Tfs.slice(8, 12);
  } else if (portalState.gradExamId === "simulated_03") {
    portalState.gradExamTitle = "Đề Luyện Thi Mô Phỏng Chuẩn Ma Trận Bộ 2026 — Đề Số 03";
    selectedMcq = cn12Mcqs.slice(72, 96);
    selectedTf = cn12Tfs.slice(12, 16);
  } else {
    portalState.gradExamTitle = "Đề Luyện Thi Tương Tự Chuẩn Ma Trận Bộ GD&ĐT (Sinh tự động)";
    const bietPool = cn12Mcqs.filter(q => q.level === "biet").sort(() => Math.random() - 0.5);
    const hieuPool = cn12Mcqs.filter(q => q.level === "hieu").sort(() => Math.random() - 0.5);
    const vdPool = cn12Mcqs.filter(q => q.level === "vandung" || q.isVdc).sort(() => Math.random() - 0.5);
    selectedMcq = [
      ...bietPool.slice(0, 8),
      ...hieuPool.slice(0, 10),
      ...vdPool.slice(0, 6)
    ];
    if (selectedMcq.length < 24) {
      const rest = cn12Mcqs.filter(q => !selectedMcq.includes(q)).sort(() => Math.random() - 0.5);
      selectedMcq.push(...rest.slice(0, 24 - selectedMcq.length));
    }
    const shuffledTf = [...cn12Tfs].sort(() => Math.random() - 0.5);
    selectedTf = shuffledTf.slice(0, 4);
  }

  portalState.gradExamItems = {
    mcq: selectedMcq,
    tf: selectedTf
  };
}

function selectGradExam(examId) {
  initGradExam(examId);
  portalState.gradExamSubTab = "mock_test";
  renderModule4Hsg();
}

function selectGradSubTab(subTab) {
  portalState.gradExamSubTab = subTab;
  renderModule4Hsg();
}

function toggleGradTimer() {
  if (portalState.gradSubmitted) return;
  if (portalState.gradTimerRunning) {
    pauseGradTimer();
  } else {
    startGradTimer();
  }
  renderModule4Hsg();
}

function startGradTimer() {
  if (portalState.gradTimerRunning) return;
  portalState.gradTimerRunning = true;
  portalState.gradTimerInterval = setInterval(() => {
    if (portalState.gradTimerSeconds > 0) {
      portalState.gradTimerSeconds--;
      updateGradTimerDisplay();
    } else {
      pauseGradTimer();
      alert("⏱️ Đã hết 50 phút làm bài! Hệ thống tự động thu bài và chấm điểm theo barem Bộ GD&ĐT.");
      submitGradExam(true);
    }
  }, 1000);
}

function pauseGradTimer() {
  portalState.gradTimerRunning = false;
  if (portalState.gradTimerInterval) {
    clearInterval(portalState.gradTimerInterval);
    portalState.gradTimerInterval = null;
  }
}

function updateGradTimerDisplay() {
  const display = document.getElementById("gradTimerText");
  if (!display) return;
  const m = Math.floor(portalState.gradTimerSeconds / 60);
  const s = portalState.gradTimerSeconds % 60;
  display.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  const wrap = display.closest(".mock-timer-display");
  if (wrap) {
    if (portalState.gradTimerSeconds <= 300) wrap.classList.add("urgent");
    else wrap.classList.remove("urgent");
  }
}

function chooseGradMcqAnswer(qIdx, oIdx) {
  if (portalState.gradSubmitted) return;
  if (!portalState.gradTimerRunning) startGradTimer();
  portalState.gradUserMcqAnswers[qIdx] = oIdx;
  renderModule4Hsg();
}

function chooseGradTfAnswer(qIdx, label, val) {
  if (portalState.gradSubmitted) return;
  if (!portalState.gradTimerRunning) startGradTimer();
  if (!portalState.gradUserTfAnswers[qIdx]) {
    portalState.gradUserTfAnswers[qIdx] = {};
  }
  portalState.gradUserTfAnswers[qIdx][label] = val;
  renderModule4Hsg();
}

function scrollToGradQuestion(qNum) {
  const el = document.getElementById("grad_q_card_" + qNum);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.style.outline = "2.5px solid var(--primary)";
    setTimeout(() => { if (el) el.style.outline = ""; }, 1800);
  }
}

function submitGradExam(force) {
  if (portalState.gradSubmitted) return;
  
  const mcqs = portalState.gradExamItems.mcq || [];
  const tfs = portalState.gradExamItems.tf || [];
  
  let unansweredMcq = 0;
  mcqs.forEach((_, idx) => {
    if (typeof portalState.gradUserMcqAnswers[idx] === "undefined") unansweredMcq++;
  });
  let unansweredTf = 0;
  tfs.forEach((q, idx) => {
    const userTf = portalState.gradUserTfAnswers[idx] || {};
    (q.statements || []).forEach(st => {
      const k = st.label || st.key;
      if (typeof userTf[k] === "undefined") unansweredTf++;
    });
  });

  if (!force && (unansweredMcq > 0 || unansweredTf > 0)) {
    const confirmMsg = `Bạn còn ${unansweredMcq} câu trắc nghiệm Phần I và ${unansweredTf} lệnh ý Phần II chưa trả lời.\nBạn có chắc chắn muốn nộp bài thi ngay bây giờ không?`;
    if (!confirm(confirmMsg)) return;
  }

  pauseGradTimer();
  portalState.gradSubmitted = true;

  // 1. Chấm Phần I (24 câu MCQ - 0.25đ/câu = 6.0đ)
  let mcqCorrect = 0;
  let mcqPoints = 0;
  let bietCorrect = 0, bietTotal = 0;
  let hieuCorrect = 0, hieuTotal = 0;
  let vdCorrect = 0, vdTotal = 0;
  let lamCorrect = 0, lamTotal = 0;
  let thuyCorrect = 0, thuyTotal = 0;

  mcqs.forEach((q, idx) => {
    const userAns = portalState.gradUserMcqAnswers[idx];
    const correctAns = Number(q.answer) || 0;
    const isCorrect = userAns === correctAns;
    if (isCorrect) mcqCorrect++;

    const lvl = q.level || "biet";
    if (lvl === "biet") { bietTotal++; if (isCorrect) bietCorrect++; }
    else if (lvl === "hieu") { hieuTotal++; if (isCorrect) hieuCorrect++; }
    else { vdTotal++; if (isCorrect) vdCorrect++; }

    const isLam = (q.lesson && q.lesson <= 15) || (q.stem && /rừng|lâm nghiệp|cây gỗ|viên nén/i.test(q.stem));
    if (isLam) { lamTotal++; if (isCorrect) lamCorrect++; }
    else { thuyTotal++; if (isCorrect) thuyCorrect++; }
  });
  mcqPoints = mcqCorrect * 0.25;

  // 2. Chấm Phần II (4 câu Đúng/Sai - chuẩn barem Bộ GD&ĐT)
  let tfPoints = 0;
  const tfDetails = [];
  const traps = [];

  tfs.forEach((q, idx) => {
    const userTf = portalState.gradUserTfAnswers[idx] || {};
    let stmtCorrectCount = 0;
    const stmts = q.statements || [];
    
    stmts.forEach(st => {
      const k = st.label || st.key;
      const userChoice = userTf[k];
      const correctVal = Boolean(st.isTrue || st.answer);
      if (typeof userChoice === "boolean" && userChoice === correctVal) {
        stmtCorrectCount++;
      }
    });

    // Thang điểm Bộ GD&ĐT: 1 ý = 0.1đ; 2 ý = 0.25đ; 3 ý = 0.5đ; 4 ý = 1.0đ
    let qPoint = 0;
    if (stmtCorrectCount === 1) qPoint = 0.1;
    else if (stmtCorrectCount === 2) qPoint = 0.25;
    else if (stmtCorrectCount === 3) qPoint = 0.5;
    else if (stmtCorrectCount === 4) qPoint = 1.0;
    
    tfPoints += qPoint;
    tfDetails.push({ qIndex: idx, correctStmts: stmtCorrectCount, points: qPoint });

    if (stmtCorrectCount === 3) {
      traps.push({
        qNum: 25 + idx,
        desc: `Câu ${25 + idx}: Đúng 3/4 ý. Mất 0,50đ do nhầm lẫn 1 ý (điểm giảm từ 1,00đ xuống 0,50đ theo barem Bộ GD&ĐT).`
      });
    } else if (stmtCorrectCount === 2) {
      traps.push({
        qNum: 25 + idx,
        desc: `Câu ${25 + idx}: Đúng 2/4 ý (đạt 0,25đ). Cần lưu ý các phương án có chứa từ ngữ khẳng định tuyệt đối.`
      });
    }
  });

  const totalScore = Number((mcqPoints + tfPoints).toFixed(2));
  
  let rank = "Trung bình";
  if (totalScore >= 9.0) rank = "Xuất sắc (Tốp đầu điểm thi Đại học)";
  else if (totalScore >= 8.0) rank = "Giỏi (Đủ điều kiện xét tuyển ĐH khối Nông - Lâm - Thủy sản)";
  else if (totalScore >= 6.5) rank = "Khá (Nắm vững kiến thức nền tảng)";
  else if (totalScore >= 5.0) rank = "Trung bình (Đủ điểm tốt nghiệp)";
  else rank = "Cần cố gắng (Cần ôn tập lại các bài trọng tâm SGK 12)";

  portalState.gradScore = {
    totalScore,
    mcqPoints: Number(mcqPoints.toFixed(2)),
    tfPoints: Number(tfPoints.toFixed(2)),
    mcqCorrect,
    rank,
    cognitive: {
      biet: { correct: bietCorrect, total: bietTotal, pct: bietTotal > 0 ? Math.round((bietCorrect / bietTotal) * 100) : 0 },
      hieu: { correct: hieuCorrect, total: hieuTotal, pct: hieuTotal > 0 ? Math.round((hieuCorrect / hieuTotal) * 100) : 0 },
      vd: { correct: vdCorrect, total: vdTotal, pct: vdTotal > 0 ? Math.round((vdCorrect / vdTotal) * 100) : 0 }
    },
    subject: {
      lam: { correct: lamCorrect, total: lamTotal, pct: lamTotal > 0 ? Math.round((lamCorrect / lamTotal) * 100) : 0 },
      thuy: { correct: thuyCorrect, total: thuyTotal, pct: thuyTotal > 0 ? Math.round((thuyCorrect / thuyTotal) * 100) : 0 }
    },
    traps,
    tfDetails,
    timeSpentSeconds: (50 * 60) - portalState.gradTimerSeconds
  };

  renderModule4Hsg();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function generateSimilarGradExam() {
  initGradExam("simulated_auto");
  startGradTimer();
  portalState.gradExamSubTab = "mock_test";
  renderModule4Hsg();
}

function exportGradExamWord() {
  const mcqs = portalState.gradExamItems.mcq || [];
  const tfs = portalState.gradExamItems.tf || [];
  const title = portalState.gradExamTitle || "ĐỀ THI TỐT NGHIỆP THPT MÔN CÔNG NGHỆ NÔNG NGHIỆP";

  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
    <style>body{font-family:"Times New Roman",serif;font-size:12pt;line-height:1.4;} h2,h3{text-align:center;}</style></head>
    <body>
      <h2>BỘ GIÁO DỤC VÀ ĐÀO TẠO — KỲ THI TỐT NGHIỆP THPT</h2>
      <h3>BÀI THI MÔN CÔNG NGHỆ NÔNG NGHIỆP (LÂM NGHIỆP — THỦY SẢN)</h3>
      <p style="text-align:center;"><em>Thời gian làm bài: 50 phút, không kể thời gian phát đề</em></p>
      <hr/>
      <h4>PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn (6,0 điểm).</h4>
      <p><em>Thí sinh trả lời từ câu 1 đến câu 24. Mỗi câu hỏi thí sinh chỉ chọn một phương án. Mỗi câu đúng được 0,25 điểm.</em></p>
      ${mcqs.map((q, i) => `
        <p><strong>Câu ${i + 1}:</strong> ${escapeHtml(q.stem)}<br/>
        ${(q.options || []).map((opt, oIdx) => `&nbsp;&nbsp;<strong>${String.fromCharCode(65 + oIdx)}.</strong> ${escapeHtml(opt)}`).join("<br/>")}
        </p>
      `).join("")}

      <h4>PHẦN II. Câu trắc nghiệm đúng sai (4,0 điểm).</h4>
      <p><em>Thí sinh trả lời từ câu 25 đến câu 28. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.</em></p>
      ${tfs.map((q, i) => `
        <p><strong>Câu ${25 + i}:</strong> ${escapeHtml(q.context || q.stem || '')}<br/>
        ${(q.statements || []).map(st => `&nbsp;&nbsp;<strong>${st.label || st.key})</strong> ${escapeHtml(st.text)}`).join("<br/>")}
        </p>
      `).join("")}

      <hr/>
      <h3>HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN CHI TIẾT</h3>
      <h4>I. Bảng Đáp án Phần I (24 câu MCQ - 0,25đ/câu)</h4>
      <table border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse; text-align:center; width:100%;">
        <tr>${mcqs.slice(0, 12).map((_, i) => `<th>Câu ${i + 1}</th>`).join("")}</tr>
        <tr>${mcqs.slice(0, 12).map(q => `<td><strong>${String.fromCharCode(65 + (Number(q.answer) || 0))}</strong></td>`).join("")}</tr>
        <tr>${mcqs.slice(12, 24).map((_, i) => `<th>Câu ${13 + i}</th>`).join("")}</tr>
        <tr>${mcqs.slice(12, 24).map(q => `<td><strong>${String.fromCharCode(65 + (Number(q.answer) || 0))}</strong></td>`).join("")}</tr>
      </table>

      <h4>II. Bảng Đáp án Phần II (4 câu Đúng/Sai - 4,0 điểm)</h4>
      <p><em>Quy tắc tính điểm Bộ GD&ĐT: Đúng 1 ý = 0,1đ; Đúng 2 ý = 0,25đ; Đúng 3 ý = 0,5đ; Đúng cả 4 ý = 1,0đ.</em></p>
      <table border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse; text-align:center; width:100%;">
        <thead><tr><th>Câu</th><th>Ý a</th><th>Ý b</th><th>Ý c</th><th>Ý d</th><th>Giải thích chi tiết</th></tr></thead>
        <tbody>
          ${tfs.map((q, i) => {
            const stMap = {};
            (q.statements || []).forEach(st => { stMap[st.label || st.key] = Boolean(st.isTrue || st.answer) ? "Đ" : "S"; });
            const explain = (q.statements || []).map(st => `${st.label || st.key}) ${escapeHtml(st.explanation || '')}`).join("<br/>");
            return `<tr>
              <td><strong>Câu ${25 + i}</strong></td>
              <td><strong>${stMap['a'] || 'Đ'}</strong></td>
              <td><strong>${stMap['b'] || 'S'}</strong></td>
              <td><strong>${stMap['c'] || 'Đ'}</strong></td>
              <td><strong>${stMap['d'] || 'Đ'}</strong></td>
              <td style="text-align:left; font-size:11pt;">${explain}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </body></html>
  `;
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${portalState.gradExamId || 'De-Thi-Tot-Nghiep-THPT-CNNN'}.doc`;
  a.click();
}

// ============================================================================
// HÀM RENDER CHÍNH PHẦN 4: HỆ THỐNG KHẢO THÍ KÉP (HSG & THI TỐT NGHIỆP THPT)
// ============================================================================
function renderModule4Hsg() {
  const container = document.getElementById("mod4MainContainer");
  if (!container) return;

  // Header 2 Phân hệ lớn tinh gọn
  const navSectionHtml = `
    <div class="exam-hub-nav">
      <button class="exam-hub-btn ${portalState.mod4MainSection === 'graduation' ? 'active' : ''}" onclick="switchMod4MainSection('graduation')">
        <div class="exam-hub-icon">🏛️</div>
        <div>
          <div class="exam-hub-title">I. THI TỐT NGHIỆP THPT (CHUẨN MẪU BỘ GD&ĐT)</div>
          <div class="exam-hub-desc">28 câu (24 Trắc nghiệm + 4 Đúng/Sai) • 50 phút • Chẩn đoán lỗi & 48 Đề Bộ</div>
        </div>
      </button>
      <button class="exam-hub-btn ${portalState.mod4MainSection === 'hsg' ? 'active' : ''}" onclick="switchMod4MainSection('hsg')">
        <div class="exam-hub-icon">🏆</div>
        <div>
          <div class="exam-hub-title">II. BỒI DƯỠNG & ÔN THI HỌC SINH GIỎI (HSG)</div>
          <div class="exam-hub-desc">Đề HSG Tỉnh (thang 20đ) • Trắc nghiệm VDC • Tự luận Kỹ thuật & Máy tính Nông học</div>
        </div>
      </button>
    </div>
  `;

  let contentHtml = "";

  if (portalState.mod4MainSection === "hsg") {
    // GIAO DIEN PHAN HE HOC SINH GIOI (HSG) - LIEN KET PORTAL_HSG_MASTER
    contentHtml = `<div id="hsgMasterRootContainer"></div>`;
    setTimeout(() => {
      if (typeof renderDongNaiHsgMaster === "function") {
        renderDongNaiHsgMaster();
      }
    }, 10);
  } else {
    // -------------------------------------------------------------
    // GIAO DIỆN PHÂN HỆ LUYỆN THI TỐT NGHIỆP THPT (CHUẨN BỘ GD&ĐT)
    // -------------------------------------------------------------
    const mcqs = portalState.gradExamItems.mcq || [];
    const tfs = portalState.gradExamItems.tf || [];

    // Đếm câu đã làm
    let doneMcq = 0;
    mcqs.forEach((_, idx) => {
      if (typeof portalState.gradUserMcqAnswers[idx] !== "undefined") doneMcq++;
    });
    let doneTf = 0;
    tfs.forEach((q, idx) => {
      const userTf = portalState.gradUserTfAnswers[idx] || {};
      const stmts = q.statements || [];
      const hasAny = stmts.some(st => typeof userTf[st.label || st.key] !== "undefined");
      if (hasAny) doneTf++;
    });
    const totalDone = doneMcq + doneTf;

    let gradBody = "";

    if (portalState.gradExamSubTab === "mock_test") {
      // 1. PHÒNG THI THỬ TRỰC TUYẾN
      gradBody = `
        <!-- Thẻ chọn đề thi gọn gàng -->
        <div class="exam-pill-grid">
          <button class="exam-select-card ${portalState.gradExamId === 'bo_2025_sample' ? 'active' : ''}" onclick="selectGradExam('bo_2025_sample')">
            <span class="exam-select-badge">MẪU BỘ 2025</span>
            <strong>Đề Tham Khảo Bộ GD&ĐT</strong>
          </button>
          <button class="exam-select-card ${portalState.gradExamId === 'bo_2026_0701' ? 'active' : ''}" onclick="selectGradExam('bo_2026_0701')">
            <span class="exam-select-badge">MÃ ĐỀ 0701</span>
            <strong>Đề Chính Thức Bộ GD&ĐT</strong>
          </button>
          <button class="exam-select-card ${portalState.gradExamId === 'bo_2026_0702' ? 'active' : ''}" onclick="selectGradExam('bo_2026_0702')">
            <span class="exam-select-badge">MÃ ĐỀ 0702</span>
            <strong>Đề Chính Thức Bộ GD&ĐT</strong>
          </button>
          <button class="exam-select-card ${portalState.gradExamId === 'simulated_03' ? 'active' : ''}" onclick="selectGradExam('simulated_03')">
            <span class="exam-select-badge">MÔ PHỎNG 03</span>
            <strong>Đề Chuẩn Ma Trận 2026</strong>
          </button>
          <button class="exam-select-card ${portalState.gradExamId === 'simulated_auto' ? 'active' : ''}" onclick="selectGradExam('simulated_auto')">
            <span class="exam-select-badge">SINH ĐỀ MỚI</span>
            <strong>🎲 Đề Ngẫu Nhiên Mới</strong>
          </button>
        </div>

        <!-- Sticky Control Bar -->
        <div class="mock-control-sticky">
          <div>
            <div style="font-weight:800; font-size:14.5px; color:var(--primary-dark);">${escapeHtml(portalState.gradExamTitle)}</div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">
              Thời gian: <strong>50 phút</strong> • Tổng số câu: <strong>28 câu (24 MCQ + 4 Đúng/Sai)</strong> • Thang điểm: <strong>10,0 điểm</strong>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <div class="mock-timer-display" title="Đồng hồ đếm ngược 50 phút">
              <span>⏱️</span>
              <span id="gradTimerText">50:00</span>
              <button class="btn btn-sm" style="padding:2px 8px; font-size:11px; background:#334155; color:#fff;" onclick="toggleGradTimer()">
                ${portalState.gradTimerRunning ? '⏸️ Tạm dừng' : '▶️ Bắt đầu'}
              </button>
            </div>
            <span class="badge ${totalDone === 28 ? 'badge-ok' : 'badge-nl'}" style="font-size:13px; padding:6px 12px;">
              Đã làm: <strong>${totalDone}/28 câu</strong>
            </span>
            ${!portalState.gradSubmitted ? `
              <button class="btn btn-primary btn-sm" onclick="submitGradExam(false)" style="font-weight:700;">
                ✅ Nộp Bài Thi
              </button>
            ` : `
              <button class="btn btn-primary btn-sm" onclick="selectGradSubTab('analysis')">
                📊 Xem Phân Tích Đề
              </button>
              <button class="btn btn-outline btn-sm" onclick="initGradExam(portalState.gradExamId); renderModule4Hsg();">
                🔄 Làm lại từ đầu
              </button>
            `}
            <button class="btn btn-accent btn-sm" onclick="exportGradExamWord()">📥 Xuất Đề (.doc)</button>
          </div>
        </div>

        <!-- Palette điều hướng nhanh 28 câu hỏi -->
        <div class="mock-palette">
          <span style="font-size:12px; font-weight:700; color:var(--text-muted); align-self:center; margin-right:6px;">Nhảy nhanh:</span>
          <span style="font-size:11px; color:#475569; align-self:center; margin-right:4px;">Phần I:</span>
          ${mcqs.map((_, i) => {
            const isDone = typeof portalState.gradUserMcqAnswers[i] !== "undefined";
            return `<button class="mock-palette-btn ${isDone ? 'done' : ''}" onclick="scrollToGradQuestion(${i + 1})">${i + 1}</button>`;
          }).join("")}
          <span style="font-size:11px; color:#475569; align-self:center; margin:0 4px 0 10px;">Phần II:</span>
          ${tfs.map((q, i) => {
            const userTf = portalState.gradUserTfAnswers[i] || {};
            const isDone = (q.statements || []).every(st => typeof userTf[st.label || st.key] !== "undefined");
            return `<button class="mock-palette-btn ${isDone ? 'done' : ''}" style="background:${isDone ? '#0f766e' : '#fff'};" onclick="scrollToGradQuestion(${25 + i})">${25 + i}</button>`;
          }).join("")}
        </div>

        <!-- Banner kết quả nếu đã nộp -->
        ${portalState.gradSubmitted && portalState.gradScore ? `
          <div class="audit-score-banner" style="margin-bottom:20px;">
            <div>
              <span class="badge badge-ok" style="font-size:13px;">ĐÃ HOÀN THÀNH BÀI THI CHUẨN BỘ GD&ĐT</span>
              <div style="font-size:24px; font-weight:800; color:var(--primary-dark); margin:6px 0 2px;">
                Tổng điểm: ${portalState.gradScore.totalScore} / 10,00 điểm
              </div>
              <div style="font-size:13.5px; color:var(--text-muted);">
                • Điểm Phần I (Trắc nghiệm): <strong>${portalState.gradScore.mcqPoints} / 6,00đ</strong> (${portalState.gradScore.mcqCorrect}/24 câu đúng)<br/>
                • Điểm Phần II (Đúng/Sai): <strong>${portalState.gradScore.tfPoints} / 4,00đ</strong> (Tính chuẩn barem: 0.1 - 0.25 - 0.5 - 1.0đ)<br/>
                • Xếp loại: <strong>${escapeHtml(portalState.gradScore.rank)}</strong>
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <button class="btn btn-primary" onclick="selectGradSubTab('analysis')">
                📊 Bấm Xem Phân Tích Ma Trận & Lỗi Sai
              </button>
              <button class="btn btn-accent" onclick="generateSimilarGradExam()">
                ⚡ Tạo & Làm Đề Tương Tự Ngay
              </button>
            </div>
          </div>
        ` : ''}

        <!-- PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN -->
        <div style="margin:20px 0 14px; padding:10px 14px; background:#eff6ff; border-left:4px solid var(--info); border-radius:6px;">
          <h3 style="font-size:15px; color:#1e3a8a; margin-bottom:2px;">PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (6,0 điểm)</h3>
          <p style="font-size:12.5px; color:#475569;">Thí sinh trả lời từ câu 1 đến câu 24. Mỗi câu hỏi chỉ chọn một phương án. Mỗi câu đúng được 0,25 điểm.</p>
        </div>

        ${mcqs.map((q, idx) => {
          const userAns = portalState.gradUserMcqAnswers[idx];
          const correctAns = Number(q.answer) || 0;
          const isCorrect = userAns === correctAns;
          return `
            <div class="q-card" id="grad_q_card_${idx + 1}">
              <div class="q-card-header">
                <div>
                  <strong>Câu ${idx + 1}:</strong>
                  <span class="badge ${q.level === 'vandung' ? 'badge-vandung' : (q.level === 'hieu' ? 'badge-hieu' : 'badge-biet')}">
                    ${q.level === 'vandung' ? 'Vận dụng' : (q.level === 'hieu' ? 'Thông hiểu' : 'Nhận biết')}
                  </span>
                  <span class="badge badge-nl">${(q.lesson && q.lesson <= 15) ? 'Lâm nghiệp' : 'Thủy sản'}</span>
                </div>
                ${portalState.gradSubmitted ? (
                  isCorrect
                    ? `<span class="badge badge-ok">✓ Đúng (+0,25đ)</span>`
                    : `<span class="badge badge-err">✗ Sai (Đáp án: ${String.fromCharCode(65 + correctAns)})</span>`
                ) : ''}
              </div>
              <div style="font-weight:600; margin-bottom:8px; font-size:14.5px;">${escapeHtml(q.stem)}</div>
              <div class="options-grid">
                ${(q.options || []).map((opt, oIdx) => {
                  let cls = "opt-item";
                  if (portalState.gradSubmitted && oIdx === correctAns) cls += " correct";
                  else if (userAns === oIdx) cls += " correct";
                  return `
                    <div class="${cls}" style="cursor:pointer; ${portalState.gradSubmitted && userAns === oIdx && !isCorrect ? 'background:#fee2e2; border-color:#ef4444;' : ''}" onclick="chooseGradMcqAnswer(${idx}, ${oIdx})">
                      <input type="radio" name="grad_mcq_${idx}" ${userAns === oIdx ? 'checked' : ''} />
                      <strong>${String.fromCharCode(65 + oIdx)}.</strong>
                      <span>${escapeHtml(opt)}</span>
                    </div>
                  `;
                }).join("")}
              </div>
              ${portalState.gradSubmitted ? `
                <div style="margin-top:8px; padding:8px 12px; background:#f0fdf4; border-radius:6px; font-size:13px; color:#166534;">
                  <strong>💡 Lời giải chi tiết:</strong> Phương án <strong>${String.fromCharCode(65 + correctAns)}</strong> đúng. ${escapeHtml(q.explanation || 'Đối chiếu chuẩn kiến thức SGK Công nghệ 12 Kết nối tri thức.')}
                </div>
              ` : ''}
            </div>
          `;
        }).join("")}

        <!-- PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG SAI -->
        <div style="margin:26px 0 14px; padding:10px 14px; background:#fef3c7; border-left:4px solid var(--accent); border-radius:6px;">
          <h3 style="font-size:15px; color:#92400e; margin-bottom:2px;">PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG SAI (4,0 điểm)</h3>
          <p style="font-size:12.5px; color:#78350f;">
            Thí sinh trả lời từ câu 25 đến câu 28. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.<br/>
            <strong>Quy chế tính điểm chuẩn Bộ GD&ĐT:</strong> Đúng 1 ý: 0,1đ • Đúng 2 ý: 0,25đ • Đúng 3 ý: 0,5đ • Đúng 4 ý: 1,0đ.
          </p>
        </div>

        ${tfs.map((q, idx) => {
          const qNum = 25 + idx;
          const userTf = portalState.gradUserTfAnswers[idx] || {};
          const stmts = q.statements || [];
          let correctCount = 0;
          stmts.forEach(st => {
            const k = st.label || st.key;
            const corr = Boolean(st.isTrue || st.answer);
            if (userTf[k] === corr) correctCount++;
          });
          let earnedPt = 0;
          if (correctCount === 1) earnedPt = 0.1;
          else if (correctCount === 2) earnedPt = 0.25;
          else if (correctCount === 3) earnedPt = 0.5;
          else if (correctCount === 4) earnedPt = 1.0;

          return `
            <div class="q-card" id="grad_q_card_${qNum}">
              <div class="q-card-header">
                <div>
                  <strong>Câu ${qNum}:</strong>
                  <span class="badge badge-nl">Trắc nghiệm Đúng/Sai (4 ý)</span>
                  <span class="badge badge-vandung">Phân hóa cao</span>
                </div>
                ${portalState.gradSubmitted ? `
                  <span class="badge ${earnedPt >= 0.5 ? 'badge-ok' : 'badge-err'}">
                    Đúng ${correctCount}/4 ý (+${earnedPt.toFixed(2)}đ)
                  </span>
                ` : ''}
              </div>
              <div style="font-weight:600; margin-bottom:10px; font-size:14px; background:#f8fafc; padding:10px 12px; border-radius:6px; border:1px solid #e2e8f0;">
                ${escapeHtml(q.context || q.stem || '')}
              </div>

              <table class="tf-exam-table">
                <thead>
                  <tr>
                    <th style="width:40px; text-align:center;">Lệnh</th>
                    <th>Nội dung nhận định</th>
                    <th style="width:170px; text-align:center;">Lựa chọn của bạn</th>
                    ${portalState.gradSubmitted ? `<th style="width:140px; text-align:center;">Đáp án & Giải thích</th>` : ''}
                  </tr>
                </thead>
                <tbody>
                  ${stmts.map(st => {
                    const k = st.label || st.key;
                    const corr = Boolean(st.isTrue || st.answer);
                    const userVal = userTf[k];
                    const isRight = userVal === corr;
                    return `
                      <tr>
                        <td style="text-align:center; font-weight:800;">${escapeHtml(k)})</td>
                        <td>${escapeHtml(st.text)}</td>
                        <td>
                          <div class="tf-btn-group">
                            <button type="button" class="tf-choice-btn btn-true ${userVal === true ? 'selected' : ''}" onclick="chooseGradTfAnswer(${idx}, '${k}', true)">
                              ĐÚNG
                            </button>
                            <button type="button" class="tf-choice-btn btn-false ${userVal === false ? 'selected' : ''}" onclick="chooseGradTfAnswer(${idx}, '${k}', false)">
                              SAI
                            </button>
                          </div>
                        </td>
                        ${portalState.gradSubmitted ? `
                          <td style="font-size:12px;">
                            <strong>Đáp án: ${corr ? '<span style="color:#16a34a;">ĐÚNG</span>' : '<span style="color:#dc2626;">SAI</span>'}</strong>
                            <div style="color:var(--text-muted); margin-top:3px;">${escapeHtml(st.explanation || '')}</div>
                          </td>
                        ` : ''}
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          `;
        }).join("")}
      `;
    } else if (portalState.gradExamSubTab === "analysis") {
      // 2. PHÂN TÍCH ĐỀ & CHẨN ĐOÁN
      const sc = portalState.gradScore;
      if (!sc) {
        gradBody = `
          <div style="text-align:center; padding:40px 20px; background:#fff; border-radius:10px; border:1px solid var(--border);">
            <div style="font-size:42px; margin-bottom:10px;">📊</div>
            <h3 style="color:var(--primary-dark); margin-bottom:6px;">Chưa có dữ liệu phân tích bài làm</h3>
            <p style="color:var(--text-muted); font-size:13.5px; margin-bottom:14px;">
              Vui lòng làm bài thi và nhấn nút <strong>"Nộp Bài Thi"</strong> ở Tab 1 để hệ thống AI tính toán ma trận và chẩn đoán năng lực.
            </p>
            <button class="btn btn-primary" onclick="selectGradSubTab('mock_test')">👉 Quay lại Phòng Thi Thử</button>
          </div>
        `;
      } else {
        gradBody = `
          <div class="audit-score-banner" style="margin-bottom:18px;">
            <div>
              <span class="badge badge-ok">BÁO CÁO PHÂN TÍCH MA TRẬN & KẾT QUẢ THI TỐT NGHIỆP THPT</span>
              <div style="font-size:24px; font-weight:800; color:var(--primary-dark); margin:6px 0 2px;">
                Tổng Điểm: ${sc.totalScore} / 10,00 điểm — ${escapeHtml(sc.rank)}
              </div>
              <div style="font-size:13px; color:var(--text-muted);">
                Thời gian làm bài: <strong>${Math.floor(sc.timeSpentSeconds / 60)} phút ${sc.timeSpentSeconds % 60} giây</strong> • Đề: <strong>${escapeHtml(portalState.gradExamTitle)}</strong>
              </div>
            </div>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-primary" onclick="generateSimilarGradExam()">⚡ Tạo Đề Tương Tự Để Luyện Tiếp</button>
            </div>
          </div>

          <div class="exam-analysis-grid">
            <!-- Thẻ 1: Cấp độ nhận thức -->
            <div class="analysis-card">
              <h4 style="color:var(--primary-dark); font-size:15px; margin-bottom:10px;">🎯 1. Phân bố Cấp độ Nhận thức</h4>
              <div style="margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:700;">
                  <span>Nhận biết:</span>
                  <span>${sc.cognitive.biet.correct}/${sc.cognitive.biet.total} câu (${sc.cognitive.biet.pct}%)</span>
                </div>
                <div style="background:#e2e8f0; height:8px; border-radius:4px; overflow:hidden; margin-top:4px;">
                  <div style="background:#22c55e; height:100%; width:${sc.cognitive.biet.pct}%;"></div>
                </div>
              </div>
              <div style="margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:700;">
                  <span>Thông hiểu:</span>
                  <span>${sc.cognitive.hieu.correct}/${sc.cognitive.hieu.total} câu (${sc.cognitive.hieu.pct}%)</span>
                </div>
                <div style="background:#e2e8f0; height:8px; border-radius:4px; overflow:hidden; margin-top:4px;">
                  <div style="background:#3b82f6; height:100%; width:${sc.cognitive.hieu.pct}%;"></div>
                </div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:700;">
                  <span>Vận dụng / VDC:</span>
                  <span>${sc.cognitive.vd.correct}/${sc.cognitive.vd.total} câu (${sc.cognitive.vd.pct}%)</span>
                </div>
                <div style="background:#e2e8f0; height:8px; border-radius:4px; overflow:hidden; margin-top:4px;">
                  <div style="background:#f59e0b; height:100%; width:${sc.cognitive.vd.pct}%;"></div>
                </div>
              </div>
            </div>

            <!-- Thẻ 2: Phân môn -->
            <div class="analysis-card">
              <h4 style="color:var(--primary-dark); font-size:15px; margin-bottom:10px;">🌲 2. Phân môn Kiến thức Khối 12</h4>
              <div style="margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:700;">
                  <span>Phần Lâm nghiệp:</span>
                  <span>${sc.subject.lam.correct}/${sc.subject.lam.total} câu (${sc.subject.lam.pct}%)</span>
                </div>
                <div style="background:#e2e8f0; height:8px; border-radius:4px; overflow:hidden; margin-top:4px;">
                  <div style="background:#15803d; height:100%; width:${sc.subject.lam.pct}%;"></div>
                </div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:700;">
                  <span>Phần Thủy sản:</span>
                  <span>${sc.subject.thuy.correct}/${sc.subject.thuy.total} câu (${sc.subject.thuy.pct}%)</span>
                </div>
                <div style="background:#e2e8f0; height:8px; border-radius:4px; overflow:hidden; margin-top:4px;">
                  <div style="background:#0284c7; height:100%; width:${sc.subject.thuy.pct}%;"></div>
                </div>
              </div>
              <p style="font-size:12px; color:var(--text-muted); margin-top:10px;">
                ${sc.subject.lam.pct >= sc.subject.thuy.pct
                  ? '💡 Bạn đang làm tốt hơn ở phần Lâm nghiệp. Hãy tăng cường luyện tập thêm kỹ thuật ao nuôi thủy sản!'
                  : '💡 Bạn đang làm tốt hơn ở phần Thủy sản. Hãy xem lại các bài bảo vệ rừng và khai thác gỗ bền vững!'}
              </p>
            </div>

            <!-- Thẻ 3: Bẫy đề thi Phần II -->
            <div class="analysis-card" style="border-left:4px solid #ea580c;">
              <h4 style="color:#9a3412; font-size:15px; margin-bottom:8px;">⚠️ 3. Cảnh báo "Bẫy Đề Thi" Phần Đúng/Sai</h4>
              <p style="font-size:12.5px; color:#475569; margin-bottom:8px;">
                Do quy chế tính điểm Bộ GD&ĐT (đúng 3 ý = 0.5đ, đúng 4 ý = 1.0đ), việc sai sót dù chỉ 1 lệnh hỏi sẽ làm mất tới 50% số điểm của câu:
              </p>
              ${sc.traps.length > 0 ? `
                <div style="display:grid; gap:6px;">
                  ${sc.traps.map(tr => `
                    <div style="background:#fff7ed; padding:8px 10px; border-radius:6px; font-size:12px; border:1px solid #fed7aa; color:#9a3412;">
                      <strong>${escapeHtml(tr.desc)}</strong>
                    </div>
                  `).join("")}
                </div>
              ` : `
                <div style="background:#f0fdf4; padding:8px 10px; border-radius:6px; font-size:12px; color:#166534;">
                  ✓ Rất tốt! Bạn xử lý các câu trắc nghiệm Đúng/Sai rất chắc chắn, không bị sập bẫy từ ngữ.
                </div>
              `}
            </div>
          </div>
        `;
      }
    } else {
      // 3. GỢI Ý ĐỀ TƯƠNG TỰ & KHO 48 ĐỀ PDF BỘ GD&ĐT
      const minExams = PORTAL_DATA.ministryExams || [];
      gradBody = `
        <div style="background:linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%); border:1.5px solid #86efac; border-radius:10px; padding:16px 20px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <span class="badge badge-ok">HỆ THỐNG GỢI Ý ĐỀ THI TƯƠNG TỰ</span>
            <h3 style="color:var(--primary-dark); font-size:17px; margin:4px 0 3px;">Bạn muốn rèn luyện đề thi có cùng cấu trúc ma trận?</h3>
            <p style="font-size:13px; color:var(--text-muted);">
              Dựa trên đề thi bạn vừa chọn (${escapeHtml(portalState.gradExamTitle)}), hệ thống tự động bốc các câu hỏi từ ngân hàng 464 câu trắc nghiệm & 20 bài Đúng/Sai Khối 12 để tạo đề mới ngay tức thì:
            </p>
          </div>
          <button class="btn btn-primary" onclick="generateSimilarGradExam()" style="padding:10px 18px; font-size:14px; font-weight:700;">
            ⚡ Bấm Vào Đây Để Tạo & Làm Đề Tương Tự Ngay
          </button>
        </div>

        <div style="margin-bottom:12px;">
          <h4 style="color:var(--primary-dark); font-size:15.5px;">🏛️ Bộ 48 Mã Đề Thi Chính Thức Bộ GD&ĐT (Mã đề 0701 → 0748) — File PDF Gốc</h4>
          <p style="font-size:12.5px; color:var(--text-muted);">Nhấp vào thẻ đề bất kỳ để mở hoặc tải trực tiếp file PDF đề thi chính thức:</p>
        </div>
        <div class="exam-card-grid">
          ${minExams.map(me => `
            <a href="${me.serverUrl}" target="_blank" class="exam-card-clean" style="text-decoration:none; color:var(--text);">
              <div>
                <span class="badge badge-biet" style="font-size:10.5px;">MÃ ĐỀ ${escapeHtml(me.code)}</span>
                <div class="exam-card-title" style="margin-top:3px;">Đề Chính thức #${escapeHtml(me.code)}</div>
              </div>
              <span class="btn btn-outline btn-sm">📄 PDF</span>
            </a>
          `).join("")}
        </div>
      `;
    }

    contentHtml = `
      <div class="card">
        <!-- Sub-navigation tinh gọn của Phân hệ Tốt nghiệp -->
        <div class="clean-tab-bar">
          <button class="clean-tab-btn ${portalState.gradExamSubTab === 'mock_test' ? 'active' : ''}" onclick="selectGradSubTab('mock_test')">
            📝 Phòng Thi Thử (28 câu • 50 phút)
          </button>
          <button class="clean-tab-btn ${portalState.gradExamSubTab === 'analysis' ? 'active' : ''}" onclick="selectGradSubTab('analysis')">
            📊 Phân Tích Kết Quả & Lỗi Sai
          </button>
          <button class="clean-tab-btn ${portalState.gradExamSubTab === 'ministry_48' ? 'active' : ''}" onclick="selectGradSubTab('ministry_48')">
            🏛️ Kho 48 Mã Đề Bộ GD&ĐT (PDF)
          </button>
        </div>
        ${gradBody}
      </div>
    `;
  }

  container.innerHTML = `
    ${navSectionHtml}
    ${contentHtml}
  `;

  if (portalState.mod4MainSection === "hsg" && portalState.mod4HsgSubTab === "ag_calc") {
    runAgTechCalculators();
  }
}


function runAgTechCalculators() {
  // 1. Phân bón
  const area = Number(document.getElementById("calcAreaHa")?.value) || 1;
  const nReq = Number(document.getElementById("calcN")?.value) || 0;
  const pReq = Number(document.getElementById("calcP")?.value) || 0;
  const kReq = Number(document.getElementById("calcK")?.value) || 0;
  const ureaKg = ((nReq * 100) / 46) * area;
  const superPKg = ((pReq * 100) / 16) * area;
  const kclKg = ((kReq * 100) / 60) * area;
  const fertBox = document.getElementById("calcFertilizerOutput");
  if (fertBox) {
    fertBox.innerHTML = `
      <strong>Kết quả cho ${area} ha:</strong><br/>
      • Đạm Urea (46% N): <strong>${ureaKg.toFixed(1)} kg</strong><br/>
      • Super Lân (16% P2O5): <strong>${superPKg.toFixed(1)} kg</strong><br/>
      • Kali Clorua (60% K2O): <strong>${kclKg.toFixed(1)} kg</strong>
    `;
  }

  // 2. Hình vuông Pearson
  const targetP = Number(document.getElementById("calcTargetPro")?.value) || 16;
  const lowP = Number(document.getElementById("calcLowPro")?.value) || 9;
  const highP = Number(document.getElementById("calcHighPro")?.value) || 44;
  const pBox = document.getElementById("calcPearsonOutput");
  if (pBox) {
    if (targetP > lowP && targetP < highP) {
      const partLow = highP - targetP;
      const partHigh = targetP - lowP;
      const sumParts = partLow + partHigh;
      const kgLow = (partLow / sumParts) * 1000;
      const kgHigh = (partHigh / sumParts) * 1000;
      pBox.innerHTML = `
        <strong>Phối trộn 1.000 kg thức ăn (${targetP}% Protein):</strong><br/>
        • Nguyên liệu nghèo đạm (${lowP}%): <strong>${kgLow.toFixed(1)} kg (${((partLow/sumParts)*100).toFixed(1)}%)</strong><br/>
        • Đậm đặc giàu đạm (${highP}%): <strong>${kgHigh.toFixed(1)} kg (${((partHigh/sumParts)*100).toFixed(1)}%)</strong>
      `;
    } else {
      pBox.innerHTML = `<span style="color:var(--danger);">⚠️ % Protein mục tiêu phải nằm giữa ${lowP}% và ${highP}%!</span>`;
    }
  }

  // 3. Thủy sản
  const pondM2 = Number(document.getElementById("calcPondM2")?.value) || 2000;
  const dens = Number(document.getElementById("calcDensity")?.value) || 150;
  const surv = Number(document.getElementById("calcSurvival")?.value) || 85;
  const sizeKg = Number(document.getElementById("calcSizePerKg")?.value) || 80;
  const feedRate = Number(document.getElementById("calcFeedRate")?.value) || 3.2;
  const totalShrimp = pondM2 * dens * (surv / 100);
  const biomassKg = sizeKg > 0 ? totalShrimp / sizeKg : 0;
  const dailyFeedKg = biomassKg * (feedRate / 100);
  const aquaBox = document.getElementById("calcAquaOutput");
  if (aquaBox) {
    aquaBox.innerHTML = `
      <strong>Kết quả quản lí ao nuôi (${pondM2} m2):</strong><br/>
      • Số cá thể còn sống: <strong>${Math.round(totalShrimp).toLocaleString('vi-VN')} con</strong><br/>
      • Tổng sinh khối trong ao: <strong>${biomassKg.toFixed(1)} kg</strong><br/>
      • Lượng thức ăn/ngày (${feedRate}%): <strong>${dailyFeedKg.toFixed(2)} kg/ngày</strong>
    `;
  }
}
