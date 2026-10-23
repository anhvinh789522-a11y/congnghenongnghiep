// Cơ sở dữ liệu Phân phối chương trình (PPCT) & Ngân hàng câu hỏi chuẩn Công văn 7991/BGDĐT-GDTrH
// Môn: Công nghệ Nông nghiệp (Lớp 10 Trồng trọt, Lớp 11 Chăn nuôi, Lớp 12 Lâm nghiệp - Thủy sản)

const CURRICULUM_PRESETS = {
  "cn10_trongtrot_gk1": {
    name: "Công nghệ 10 - Công nghệ Trồng trọt (Giữa kì 1)",
    grade: "Lớp 10",
    subject: "Công nghệ Trồng trọt",
    examTerm: "Giữa Học kì I",
    units: [
      {
        id: "u1_1",
        chapter: "Chủ đề 1: Giới thiệu chung về trồng trọt",
        lesson: "Bài 1: Vai trò, triển vọng của trồng trọt và phân loại cây trồng",
        periods: 3,
        selected: true,
        competencies: ["NCCN", "ĐGCN"],
        yccd: {
          biet: "Nêu được vai trò của trồng trọt đối với đời sống và kinh tế; phân loại được các nhóm cây trồng theo nguồn gốc, chu kỳ sống và mục đích sử dụng.",
          hieu: "Phân tích được triển vọng phát triển ngành trồng trọt Việt Nam; giải thích được cơ sở phân loại cây trồng gắn với kỹ thuật canh tác.",
          vandung: "Đánh giá được tiềm năng và đề xuất phương án chuyển đổi cơ cấu cây trồng phù hợp với điều kiện sinh thái địa phương."
        }
      },
      {
        id: "u1_2",
        chapter: "Chủ đề 1: Giới thiệu chung về trồng trọt",
        lesson: "Bài 2: Cây trồng và các yếu tố chính trong trồng trọt",
        periods: 2,
        selected: true,
        competencies: ["NCCN", "SDCN"],
        yccd: {
          biet: "Nêu được các yếu tố chính trong trồng trọt (nhiệt độ, ánh sáng, nước, dinh dưỡng, đất trồng, giống cây trồng, kỹ thuật canh tác).",
          hieu: "Giải thích được mối quan hệ tác động qua lại giữa cây trồng với các yếu tố ngoại cảnh ảnh hưởng đến quang hợp và năng suất.",
          vandung: "Vận dụng kiến thức điều chỉnh các yếu tố nhiệt độ, ánh sáng, ẩm độ trong nhà màng/nhà kính để nâng cao năng suất cây trồng."
        }
      },
      {
        id: "u2_1",
        chapter: "Chủ đề 2: Đất trồng",
        lesson: "Bài 3: Giới thiệu về đất trồng (Thành phần, keo đất và tính chất)",
        periods: 3,
        selected: true,
        competencies: ["NCCN", "SDCN"],
        yccd: {
          biet: "Trình bày được khái niệm đất trồng, các thành phần chính của đất (rắn, lỏng, khí, sinh vật); nêu được cấu tạo keo đất và chỉ số phản ứng của đất (pH).",
          hieu: "Giải thích được cơ chế hấp phụ của keo đất, vai trò của mùn hữu cơ và ảnh hưởng của độ pH đất đến khả năng hấp thụ dinh dưỡng của rễ.",
          vandung: "Phân tích chỉ số xét nghiệm mẫu đất thực tế để chẩn đoán tình trạng độ phì và độ chua của đất."
        }
      },
      {
        id: "u2_2",
        chapter: "Chủ đề 2: Đất trồng",
        lesson: "Bài 4: Sử dụng, cải tạo và bảo vệ đất trồng",
        periods: 3,
        selected: true,
        competencies: ["SDCN", "ĐGCN"],
        yccd: {
          biet: "Kể tên được các nhóm đất cần cải tạo ở Việt Nam (đất chua, đất mặn, đất phèn, đất xói mòn trơ sỏi đá).",
          hieu: "Giải thích được nguyên nhân hình thành đất chua, đất mặn, đất phèn và cơ sở khoa học của biện pháp bón vôi, thau chua rửa mặn, làm ruộng bậc thang.",
          vandung: "Xây dựng quy trình kỹ thuật cải tạo và sử dụng bền vững cho một loại đất bị suy thoái (đất dốc xói mòn hoặc đất nhiễm phèn/mặn) tại địa phương."
        }
      },
      {
        id: "u2_3",
        chapter: "Chủ đề 2: Đất trồng",
        lesson: "Bài 5: Giá thể trồng cây",
        periods: 2,
        selected: false,
        competencies: ["NCCN", "SDCN", "TKKT"],
        yccd: {
          biet: "Nêu được khái niệm, lợi ích và đặc điểm của một số loại giá thể trồng cây phổ biến (xơ dừa, trấu hun, đá perlite, than bùn).",
          hieu: "So sánh được ưu, nhược điểm của từng loại giá thể tự nhiên và giá thể trơ trong canh tác không dùng đất.",
          vandung: "Đề xuất công thức phối trộn giá thể phù hợp để ươm cây giống hoặc trồng rau ăn lá, hoa cây cảnh tại gia đình."
        }
      },
      {
        id: "u3_1",
        chapter: "Chủ đề 3: Phân bón",
        lesson: "Bài 6: Giới thiệu về phân bón (Khái niệm, vai trò, phân loại)",
        periods: 2,
        selected: true,
        competencies: ["NCCN", "SDCN"],
        yccd: {
          biet: "Nêu được khái niệm, vai trò của phân bón trong trồng trọt; phân biệt được 3 nhóm phân bón chính (phân hóa học, phân hữu cơ, phân vi sinh).",
          hieu: "Phân tích được đặc điểm tính chất (độ tan, hàm lượng dinh dưỡng, tác động đến đất) của phân hóa học, phân hữu cơ và phân vi sinh.",
          vandung: "Nhận diện các triệu chứng thiếu hoặc thừa dinh dưỡng khoáng trên cây trồng để lựa chọn loại phân bón phù hợp."
        }
      },
      {
        id: "u3_2",
        chapter: "Chủ đề 3: Phân bón",
        lesson: "Bài 7: Sử dụng và bảo quản phân bón",
        periods: 3,
        selected: true,
        competencies: ["SDCN", "ĐGCN"],
        yccd: {
          biet: "Trình bày được nguyên tắc sử dụng và bảo quản phân hóa học, phân hữu cơ, phân vi sinh.",
          hieu: "Giải thích được vì sao phân hữu cơ, phân lân thường dùng bón lót còn phân đạm, kali thường dùng bón thúc; giải thích quy tắc không trộn đạm urê với vôi.",
          vandung: "Đánh giá hệ lụy của việc lạm dụng phân bón vô cơ và đề xuất quy trình bón phân theo nguyên tắc '4 đúng' hướng tới nông nghiệp xanh, hữu cơ bền vững."
        }
      }
    ]
  },
  "cn11_channuoi_gk1": {
    name: "Công nghệ 11 - Công nghệ Chăn nuôi (Giữa kì 1)",
    grade: "Lớp 11",
    subject: "Công nghệ Chăn nuôi",
    examTerm: "Giữa Học kì I",
    units: [
      {
        id: "cn11_1",
        chapter: "Chủ đề 1: Giới thiệu chung về chăn nuôi",
        lesson: "Bài 1: Vai trò, triển vọng của chăn nuôi và xu hướng phát triển",
        periods: 3,
        selected: true,
        competencies: ["NCCN", "ĐGCN"],
        yccd: {
          biet: "Trình bày được vai trò của chăn nuôi đối với đời sống và kinh tế; nêu được các thành tựu và định hướng chăn nuôi công nghệ cao.",
          hieu: "Phân tích được ưu điểm của mô hình chăn nuôi công nghiệp công nghệ cao và chăn nuôi bền vững so với chăn nuôi nông hộ nhỏ lẻ.",
          vandung: "Đề xuất mô hình chăn nuôi tuần hoàn phù hợp với điều kiện kinh tế và môi trường tại địa phương."
        }
      },
      {
        id: "cn11_2",
        chapter: "Chủ đề 1: Giới thiệu chung về chăn nuôi",
        lesson: "Bài 2: Phân loại vật nuôi và phương thức chăn nuôi",
        periods: 2,
        selected: true,
        competencies: ["NCCN", "SDCN"],
        yccd: {
          biet: "Nhận biết được các nhóm vật nuôi phổ biến theo nguồn gốc, đặc điểm sinh học và mục đích sử dụng; kể tên các phương thức chăn nuôi chính.",
          hieu: "So sánh được ưu và nhược điểm của phương thức chăn nuôi chăn thả, bán công nghiệp và công nghiệp.",
          vandung: "Lựa chọn đối tượng vật nuôi và phương thức chăn nuôi tối ưu cho một trang trại quy mô vừa."
        }
      },
      {
        id: "cn11_3",
        chapter: "Chủ đề 2: Giống vật nuôi",
        lesson: "Bài 3: Khái niệm, vai trò của giống và chọn giống vật nuôi",
        periods: 3,
        selected: true,
        competencies: ["NCCN", "SDCN"],
        yccd: {
          biet: "Nêu được khái niệm giống vật nuôi, vai trò của giống trong chăn nuôi và các chỉ tiêu cơ bản để chọn giống (ngoại hình, thể chất, khả năng sản xuất).",
          hieu: "Phân biệt được phương pháp chọn lọc hàng loạt và chọn lọc cá thể (kiểm tra năng suất bản thân, đời sau).",
          vandung: "Vận dụng quy trình chọn lọc để tuyển chọn đàn lợn hoặc gia cầm hậu bị đạt tiêu chuẩn giống tốt."
        }
      },
      {
        id: "cn11_4",
        chapter: "Chủ đề 2: Giống vật nuôi",
        lesson: "Bài 4: Nhân giống vật nuôi và ứng dụng công nghệ sinh học",
        periods: 3,
        selected: true,
        competencies: ["SDCN", "ĐGCN"],
        yccd: {
          biet: "Nêu được khái niệm nhân giống thuần chủng, lai giống và các ứng dụng công nghệ sinh học (thụ tinh nhân tạo, cấy truyền phôi).",
          hieu: "Giải thích được mục đích của lai kinh tế, lai cải tạo và ý nghĩa của công nghệ thụ tinh nhân tạo trong nâng cao chất lượng đàn giống.",
          vandung: "Thiết kế sơ đồ lai kinh tế hoặc đề xuất quy trình ứng dụng thụ tinh nhân tạo để nâng cao năng suất chăn nuôi tại trang trại."
        }
      }
    ]
  },
  "cn12_lamthuy_gk1": {
    name: "Công nghệ 12 - Lâm nghiệp & Thủy sản (Giữa kì 1)",
    grade: "Lớp 12",
    subject: "Công nghệ Lâm nghiệp - Thủy sản",
    examTerm: "Giữa Học kì I",
    units: [
      {
        id: "cn12_1",
        chapter: "Chủ đề 1: Đại cương về Lâm nghiệp",
        lesson: "Bài 1: Vai trò, triển vọng của lâm nghiệp và phân loại rừng",
        periods: 3,
        selected: true,
        competencies: ["NCCN", "ĐGCN"],
        yccd: {
          biet: "Trình bày được vai trò của lâm nghiệp đối với kinh tế, môi trường; phân biệt được rừng đặc dụng, rừng phòng hộ và rừng sản xuất.",
          hieu: "Phân tích được nguyên nhân suy thoái tài nguyên rừng và yêu cầu cơ bản của phát triển lâm nghiệp bền vững.",
          vandung: "Liên hệ thực tiễn công tác bảo vệ và phát triển rừng gắn với thị trường tín chỉ carbon tại Việt Nam."
        }
      },
      {
        id: "cn12_2",
        chapter: "Chủ đề 2: Trồng và chăm sóc rừng",
        lesson: "Bài 2: Quy luật sinh trưởng phát triển của cây rừng & Kỹ thuật trồng rừng",
        periods: 3,
        selected: true,
        competencies: ["NCCN", "SDCN"],
        yccd: {
          biet: "Nêu được các giai đoạn sinh trưởng của cây rừng, thời vụ trồng rừng và quy trình trồng rừng bằng cây con.",
          hieu: "Giải thích được ý nghĩa của việc chuẩn bị cây giống, làm đất và chọn thời vụ trồng rừng phù hợp với từng vùng sinh thái.",
          vandung: "Đề xuất quy trình kỹ thuật trồng và chăm sóc rừng sản xuất hoặc rừng phòng hộ ven biển đạt tỉ lệ sống cao."
        }
      },
      {
        id: "cn12_3",
        chapter: "Chủ đề 3: Bảo vệ và khai thác tài nguyên rừng",
        lesson: "Bài 3: Nhiệm vụ bảo vệ rừng và các phương thức khai thác rừng bền vững",
        periods: 3,
        selected: true,
        competencies: ["SDCN", "ĐGCN"],
        yccd: {
          biet: "Trình bày được các biện pháp phòng cháy chữa cháy rừng, phòng trừ sâu bệnh hại và các phương thức khai thác trắng, khai thác dần, khai thác chọn.",
          hieu: "So sánh được điều kiện áp dụng và tác động sinh thái của khai thác trắng, khai thác dần và khai thác chọn.",
          vandung: "Xây dựng phương án khai thác và phục hồi tái sinh rừng bền vững kết hợp chứng chỉ rừng FSC."
        }
      }
    ]
  }
};

// Ngân hàng câu hỏi chuẩn hóa theo Công văn 7991/BGDĐT-GDTrH
const QUESTION_BANK = {
  // I. Trắc nghiệm nhiều phương án lựa chọn (MCQ)
  mcq: [
    // Unit u1_1
    {
      unitId: "u1_1", level: "biet", competency: "NCCN",
      stem: "Trong nền kinh tế quốc dân, vai trò nào sau đây KHÔNG phải là vai trò trực tiếp của ngành trồng trọt?",
      options: [
        "Cung cấp lương thực, thực phẩm thiết yếu cho con người.",
        "Cung cấp nguyên liệu nông sản cho công nghiệp chế biến.",
        "Trực tiếp luyện kim và chế tạo máy kéo công suất lớn.",
        "Cung cấp nguồn thức ăn thô xanh và tinh bột cho chăn nuôi."
      ],
      answer: 2
    },
    {
      unitId: "u1_1", level: "biet", competency: "NCCN",
      stem: "Căn cứ vào chu kỳ sống của cây trồng, nhóm cây nào sau đây thuộc nhóm cây hằng năm?",
      options: [
        "Cây lúa nước, cây ngô, cây đậu tương.",
        "Cây cao su, cây cà phê, cây sầu riêng.",
        "Cây bưởi, cây nhãn, cây vải thiều.",
        "Cây chè Shan tuyết, cây hồ tiêu, cây điều."
      ],
      answer: 0
    },
    {
      unitId: "u1_1", level: "biet", competency: "NCCN",
      stem: "Theo mục đích sử dụng, cây cao su, cà phê và hồ tiêu được xếp vào nhóm cây trồng nào?",
      options: [
        "Cây lương thực.",
        "Cây công nghiệp.",
        "Cây rau đậu.",
        "Cây dược liệu."
      ],
      answer: 1
    },
    {
      unitId: "u1_1", level: "hieu", competency: "ĐGCN",
      stem: "Xu hướng nào dưới đây phản ánh đúng định hướng phát triển trồng trọt ứng dụng công nghệ cao tại Việt Nam hiện nay?",
      options: [
        "Mở rộng tối đa diện tích canh tác tự nhiên bằng cách phá rừng tự nhiên.",
        "Ứng dụng nhà màng, cảm biến IoT điều khiển tưới nhỏ giọt kết hợp châm phân tự động.",
        "Tăng gấp đôi lượng phân bón hóa học và thuốc bảo vệ thực vật để ép năng suất.",
        "Chỉ sản xuất nhỏ lẻ tự cung tự cấp, không cần áp dụng tiêu chuẩn VietGAP."
      ],
      answer: 1
    },
    {
      unitId: "u1_1", level: "hieu", competency: "SDCN",
      stem: "Việc luân canh giữa cây họ Đậu với cây lúa nước mang lại lợi ích sinh học chủ yếu nào sau đây?",
      options: [
        "Làm đất bị nén chặt để giữ nước cho vụ lúa tiếp theo.",
        "Tăng cường cố định đạm tự nhiên nhờ vi khuẩn nốt sần, cải tạo đất và cắt đứt vòng đời sâu bệnh.",
        "Tiêu diệt toàn bộ hệ vi sinh vật có ích trong tầng đất mặt.",
        "Tăng độ chua của đất lên mức tối đa."
      ],
      answer: 1
    },
    {
      unitId: "u1_1", level: "vandung", competency: "ĐGCN",
      stem: "Tại các vùng đất bãi ven sông thường xuyên bị ngập úng vào mùa mưa nhưng khô hạn vào mùa khô, phương án bố trí cơ cấu cây trồng nào sau đây là hợp lý nhất?",
      options: [
        "Trồng cây ăn quả lâu năm mẫn cảm với ngập úng quanh năm.",
        "Bố trí các giống cây ngắn ngày (ngô, đậu đỗ, rau màu vụ đông xuân) để né lũ và tận dụng phù sa.",
        "Bỏ hoang hoàn toàn diện tích đất vì không thể canh tác bất kỳ loại cây nào.",
        "Chỉ độc canh một giống cây công nghiệp thân gỗ duy nhất."
      ],
      answer: 1
    },

    // Unit u1_2
    {
      unitId: "u1_2", level: "biet", competency: "NCCN",
      stem: "Yếu tố môi trường nào sau đây trực tiếp cung cấp nguồn năng lượng cho quá trình quang hợp của cây xanh?",
      options: [
        "Ánh sáng mặt trời.",
        "Độ ẩm không khí.",
        "Gió và áp suất khí quyển.",
        "Hàm lượng sỏi đá trong đất."
      ],
      answer: 0
    },
    {
      unitId: "u1_2", level: "biet", competency: "NCCN",
      stem: "Cây trồng hấp thụ nước và các ion khoáng hòa tan chủ yếu qua bộ phận nào?",
      options: [
        "Lớp vỏ bần của thân gỗ.",
        "Tế bào lông hút ở miền hút của rễ.",
        "Lớp cutin mặt trên của lá già.",
        "Cánh hoa và đài hoa."
      ],
      answer: 1
    },
    {
      unitId: "u1_2", level: "hieu", competency: "NCCN",
      stem: "Khi nhiệt độ môi trường vượt quá ngưỡng chịu đựng cao nhất của cây trồng (trên 42°C), hiện tượng sinh lý nào sẽ xảy ra?",
      options: [
        "Cường độ quang hợp tăng vọt gấp 5 lần bình thường.",
        "Khí khổng đóng lại hạn chế thoát hơi nước, quang hợp đình trệ và protein enzim bị biến tính.",
        "Rễ cây tăng tốc độ hút nước và muối khoáng cực đại.",
        "Cây ngừng hô hấp nhưng vẫn tổng hợp chất hữu cơ liên tục."
      ],
      answer: 1
    },
    {
      unitId: "u1_2", level: "vandung", competency: "SDCN",
      stem: "Tại các nhà vườn trồng hoa cúc thương phẩm ở Đà Lạt, người nông dân thường thắp đèn chiếu sáng ban đêm vào giai đoạn cây con nhằm mục đích gì?",
      options: [
        "Để sưởi ấm cho đất và tiêu diệt toàn bộ côn trùng.",
        "Kéo dài thời gian chiếu sáng (phá quang chu kỳ ngày ngắn) để ức chế ra hoa sớm, giúp cây vươn cao đạt chuẩn thương phẩm.",
        "Làm cho lá hoa cúc chuyển sang màu vàng để dễ thu hoạch.",
        "Giúp hoa cúc không cần tưới nước trong suốt vụ trồng."
      ],
      answer: 1
    },

    // Unit u2_1
    {
      unitId: "u2_1", level: "biet", competency: "NCCN",
      stem: "Thành phần cấu tạo hoàn chỉnh của đất trồng bao gồm những phần nào sau đây?",
      options: [
        "Phần rắn, phần lỏng, phần khí và hệ sinh vật đất.",
        "Chỉ gồm hạt cát, hạt sét và nước ngầm.",
        "Phần khoáng vô cơ và khí nitơ trong không khí.",
        "Chỉ gồm lớp đá mẹ và xác thực vật khô trên mặt đất."
      ],
      answer: 0
    },
    {
      unitId: "u2_1", level: "biet", competency: "NCCN",
      stem: "Thành phần nào trong đất quyết định trực tiếp khả năng hấp phụ (giữ và trao đổi các ion dinh dưỡng) của đất trồng?",
      options: [
        "Các hạt sỏi và đá cuội kích thước lớn.",
        "Hệ keo đất (keo vô cơ và keo hữu cơ mùn).",
        "Lượng khí cacbonic trong các khe hở đất.",
        "Nước tự do chảy tràn trên mặt ruộng."
      ],
      answer: 1
    },
    {
      unitId: "u2_1", level: "biet", competency: "NCCN",
      stem: "Để đánh giá phản ứng chua, kiềm hay trung tính của dung dịch đất, người ta sử dụng đại lượng nào?",
      options: [
        "Chỉ số độ xốp của đất (%).",
        "Chỉ số pH của đất.",
        "Tỉ trọng hạt khoáng của đất.",
        "Độ ẩm cực đại đồng ruộng."
      ],
      answer: 1
    },
    {
      unitId: "u2_1", level: "hieu", competency: "NCCN",
      stem: "Khi kết quả phân tích mẫu đất cho thấy giá trị pH = 4,3, mẫu đất này thuộc loại đất nào và có đặc điểm hóa học gì?",
      options: [
        "Đất kiềm mạnh; dư thừa ion canxi và magie.",
        "Đất trung tính; thuận lợi cho mọi loại cây trồng phát triển.",
        "Đất rất chua; nồng độ ion H+ và Al3+ tự do cao gây độc cho rễ và giữ chặt lân dưới dạng khó tan.",
        "Đất mặn trung tính; chứa hàm lượng muối NaCl rất cao."
      ],
      answer: 2
    },
    {
      unitId: "u2_1", level: "vandung", competency: "SDCN",
      stem: "Một trang trại dự định trồng cây bắp cải (yêu cầu pH thích hợp từ 6,0 – 6,5) trên nền đất có pH = 4,8. Biện pháp xử lý nền đất nào cần thực hiện trước khi trồng?",
      options: [
        "Bón thêm thật nhiều phân đạm amoni sunfat để làm giảm thêm pH.",
        "Tiến hành bón vôi nông nghiệp kết hợp phân hữu cơ hoai mục trước khi trồng 15-20 ngày để nâng pH đất.",
        "Dẫn nước biển mặn vào ngâm đất trong 1 tuần.",
        "Phủ kín bạt nilon và không làm đất."
      ],
      answer: 1
    },

    // Unit u2_2
    {
      unitId: "u2_2", level: "biet", competency: "NCCN",
      stem: "Biện pháp hóa học phổ biến và hiệu quả nhất để khử chua cho đất trồng là gì?",
      options: [
        "Bón vôi (CaO, CaCO3 hoặc bột đá vôi).",
        "Cày nông bừa sục liên tục.",
        "Trồng cây chắn gió xung quanh bờ ruộng.",
        "Bón phân đạm clorua (NH4Cl) liều cao."
      ],
      answer: 0
    },
    {
      unitId: "u2_2", level: "hieu", competency: "SDCN",
      stem: "Bản chất khoa học của biện pháp 'thau chua, rửa mặn' trong cải tạo đất mặn và đất phèn là gì?",
      options: [
        "Dùng nhiệt độ cao để đốt cháy lượng muối và phèn trên mặt ruộng.",
        "Đưa nước ngọt vào ruộng (kết hợp bón vôi) để đẩy Na+, H+, Fe2+, Al3+ ra khỏi keo đất vào dung dịch rồi tháo bỏ qua kênh tiêu.",
        "Lật tầng đất phèn tiềm tàng từ sâu 1 mét lên mặt ruộng để phơi nắng.",
        "Rắc muối ăn (NaCl) xuống ruộng để trung hòa axit."
      ],
      answer: 1
    },
    {
      unitId: "u2_2", level: "vandung", competency: "ĐGCN",
      stem: "Đối với vùng đất đồi dốc ở miền núi phía Bắc và Tây Nguyên thường bị xói mòn, rửa trôi chất dinh dưỡng vào mùa mưa, tổ hợp biện pháp canh tác nào sau đây là bền vững nhất?",
      options: [
        "Cày xới toàn bộ đất theo chiều dọc từ đỉnh đồi xuống chân đồi và đốt sạch thảm cỏ.",
        "Canh tác theo đường đồng mức, làm ruộng bậc thang, trồng băng cây phân xanh cố định đạm và che phủ đất.",
        "Sử dụng thuốc trừ cỏ hóa học định kỳ hàng tháng để mặt đất hoàn toàn trơ trụi.",
        "Chỉ trồng độc canh cây sắn liên tục 10 năm không bón phân hữu cơ."
      ],
      answer: 1
    },

    // Unit u3_1
    {
      unitId: "u3_1", level: "biet", competency: "NCCN",
      stem: "Các loại phân bón: Urê, Supe lân, Kali clorua, NPK thuộc nhóm phân bón nào sau đây?",
      options: [
        "Phân hữu cơ truyền thống.",
        "Phân hóa học (phân vô cơ).",
        "Phân vi sinh vật.",
        "Phân xanh tự nhiên."
      ],
      answer: 1
    },
    {
      unitId: "u3_1", level: "biet", competency: "NCCN",
      stem: "Đặc điểm nổi bật của nhóm phân bón vi sinh là gì?",
      options: [
        "Chứa một hoặc nhiều chủng vi sinh vật sống có ích (cố định đạm, phân giải lân, phân giải xenlulozơ).",
        "Có hàm lượng đạm, lân, kali nguyên chất chiếm trên 80% khối lượng.",
        "Tan hoàn toàn tức thì trong nước và làm chua đất nhanh chóng.",
        "Có thể bảo quản không giới hạn thời gian ở nhiệt độ cao trên 60°C."
      ],
      answer: 0
    },
    {
      unitId: "u3_1", level: "hieu", competency: "SDCN",
      stem: "Tại sao việc bón phân hóa học liên tục nhiều năm mà không bổ sung phân hữu cơ lại làm đất bị suy thoái, chai cứng?",
      options: [
        "Vì phân hóa học làm tăng số lượng giun đất quá mức.",
        "Vì phân hóa học không cung cấp chất mùn, làm giảm độ xốp, gây chua đất và làm suy giảm hệ vi sinh vật có lợi.",
        "Vì phân hóa học chứa quá nhiều chất xơ thực vật khó phân hủy.",
        "Vì phân hóa học ngăn cản ánh sáng mặt trời chiếu xuống mặt đất."
      ],
      answer: 1
    },

    // Unit u3_2
    {
      unitId: "u3_2", level: "biet", competency: "SDCN",
      stem: "Nguyên tắc '4 đúng' trong sử dụng phân bón bao gồm các nội dung nào sau đây?",
      options: [
        "Đúng loại phân, đúng liều lượng, đúng thời điểm (đúng lúc), đúng phương pháp (cách bón).",
        "Đúng giá tiền, đúng hãng sản xuất, đúng màu sắc, đúng bao bì.",
        "Đúng người mua, đúng kho chứa, đúng xe vận chuyển, đúng ngày mưa.",
        "Đúng giống cây, đúng thuốc trừ sâu, đúng máy cày, đúng mùa thu hoạch."
      ],
      answer: 0
    },
    {
      unitId: "u3_2", level: "hieu", competency: "SDCN",
      stem: "Vì sao phân hữu cơ ủ hoai và phân lân thường được khuyến cáo dùng để BÓN LÓT trước khi gieo trồng?",
      options: [
        "Vì chúng rất dễ bay hơi nếu rải trên mặt đất khi cây đã lớn.",
        "Vì chất dinh dưỡng trong phân hữu cơ và phân lân khó tan hoặc phân giải chậm, giúp cung cấp dinh dưỡng bền vững và kích thích bộ rễ phát triển ngay từ đầu.",
        "Vì phân hữu cơ và phân lân chỉ có tác dụng diệt cỏ dại trước khi gieo hạt.",
        "Vì nếu dùng bón thúc cây sẽ chết ngay lập tức sau 1 giờ."
      ],
      answer: 1
    },
    {
      unitId: "u3_2", level: "vandung", competency: "SDCN",
      stem: "Khi bảo quản phân đạm Urê tại kho nông hộ, biện pháp nào sau đây là ĐÚNG kỹ thuật để tránh thất thoát dinh dưỡng?",
      options: [
        "Đổ rời phân Urê trực tiếp xuống nền đất ẩm và trộn chung với vôi bột.",
        "Đựng trong bao kín chống ẩm, kê cao trên kệ gỗ nơi khô ráo, thoáng mát, tuyệt đối không trộn lẫn với vôi.",
        "Phơi bao phân Urê trực tiếp ngoài trời nắng gắt và mưa để khử trùng.",
        "Hòa tan sẵn toàn bộ phân Urê vào bể nước từ đầu năm để dùng dần cả năm."
      ],
      answer: 1
    },

    // CN11 & CN12 sample questions
    {
      unitId: "cn11_1", level: "biet", competency: "NCCN",
      stem: "Vai trò nào sau đây là vai trò cốt lõi của ngành chăn nuôi đối với đời sống con người?",
      options: [
        "Cung cấp thực phẩm giàu đạm động vật (thịt, trứng, sữa) cho con người.",
        "Cung cấp gỗ tròn và lâm sản ngoài gỗ cho ngành xây dựng.",
        "Trực tiếp sản xuất phân bón hóa học NPK.",
        "Khai thác khoáng sản dưới lòng đất."
      ],
      answer: 0
    },
    {
      unitId: "cn11_2", level: "hieu", competency: "SDCN",
      stem: "Ưu điểm nổi bật của phương thức chăn nuôi công nghiệp công nghệ cao so với chăn nuôi chăn thả tự do là gì?",
      options: [
        "Kiểm soát chặt chẽ tiểu khí hậu chuồng nuôi, an toàn sinh học cao, năng suất lớn và đồng đều.",
        "Không tốn chi phí đầu tư chuồng trại và thiết bị ban đầu.",
        "Vật nuôi tự đi kiếm ăn hoàn toàn nên không cần khẩu phần thức ăn.",
        "Hoàn toàn không phát sinh chất thải chăn nuôi."
      ],
      answer: 0
    },
    {
      unitId: "cn12_1", level: "biet", competency: "NCCN",
      stem: "Theo mục đích sử dụng chủ yếu ở Việt Nam, rừng được phân chia thành 3 loại rừng nào sau đây?",
      options: [
        "Rừng đặc dụng, rừng phòng hộ và rừng sản xuất.",
        "Rừng già, rừng non và rừng trung bình.",
        "Rừng lá rộng, rừng lá kim và rừng hỗn giao.",
        "Rừng ngập mặn, rừng tràm và rừng thông."
      ],
      answer: 0
    }
  ],

  // II. Trắc nghiệm Đúng - Sai (TF - mỗi câu gồm 4 ý a, b, c, d)
  tf: [
    {
      unitId: "u1_1",
      competency: "ĐGCN",
      stem: "Một hợp tác xã nông nghiệp tại vùng trung du đang triển khai dự án chuyển đổi từ diện tích trồng lúa năng suất thấp trên đất cao hạn sang trồng cây ăn quả có múi (cam, bưởi) theo tiêu chuẩn VietGAP kết hợp ứng dụng công nghệ cao. Xét tính đúng/sai của các nhận định sau:",
      statements: [
        {
          label: "a",
          level: "biet",
          text: "Cây cam, cây bưởi thuộc nhóm cây ăn quả lâu năm, có chu kỳ kinh doanh kéo dài nhiều năm.",
          isTrue: true,
          explanation: "Cam, bưởi là cây thân gỗ lâu năm, trồng một lần cho thu hoạch nhiều năm."
        },
        {
          label: "b",
          level: "hieu",
          text: "Việc chuyển đổi cơ cấu cây trồng phải dựa trên điều kiện khí hậu, thổ nhưỡng, nguồn nước và nhu cầu thị trường tiêu thụ.",
          isTrue: true,
          explanation: "Chuyển đổi cây trồng cần đồng bộ giữa điều kiện sinh thái tự nhiên và đầu ra kinh tế."
        },
        {
          label: "c",
          level: "vandung",
          text: "Để giữ ẩm cho vườn bưởi, hợp tác xã bắt buộc phải phun thuốc trừ cỏ hóa học định kỳ hàng tháng để diệt sạch hoàn toàn thảm cỏ tự nhiên.",
          isTrue: false,
          explanation: "Sai. Giữ thảm cỏ có kiểm soát (cắt tỉa định kỳ) giúp giữ ẩm, chống xói mòn, bảo vệ thiên địch và bổ sung hữu cơ cho đất."
        },
        {
          label: "d",
          level: "vandung",
          text: "Lắp đặt hệ thống tưới nhỏ giọt kết hợp châm phân tự động quanh gốc giúp tiết kiệm nước từ 30–50% và nâng cao hiệu suất sử dụng phân bón.",
          isTrue: true,
          explanation: "Tưới nhỏ giọt cung cấp nước và dinh dưỡng trực tiếp vào vùng rễ hoạt động, giảm thất thoát."
        }
      ]
    },
    {
      unitId: "u2_1",
      competency: "SDCN",
      stem: "Tại một vùng canh tác nông nghiệp trũng thấp, kết quả phân tích mẫu đất tầng mặt (0–20 cm) cho thấy chỉ số pH = 4,1; hàm lượng chất hữu cơ rất thấp; nồng độ các ion Fe2+ và Al3+ di động cao, làm rễ cây trồng bị thối đen, lá vàng úa và còi cọc. Xét tính đúng/sai của các nhận định sau:",
      statements: [
        {
          label: "a",
          level: "biet",
          text: "Với giá trị pH = 4,1, mẫu đất trên được xác định là đất rất chua (nhiễm phèn).",
          isTrue: true,
          explanation: "Đất có pH < 4,5 thuộc nhóm đất rất chua / đất phèn."
        },
        {
          label: "b",
          level: "hieu",
          text: "Trong môi trường đất quá chua, lân dễ tan bị kết tủa thành dạng photphat sắt và photphat nhôm khó tan khiến cây bị thiếu lân nghiêm trọng.",
          isTrue: true,
          explanation: "Ion Fe3+ và Al3+ tự do kết hợp với PO4(3-) tạo thành hợp chất không tan mà rễ cây không hút được."
        },
        {
          label: "c",
          level: "vandung",
          text: "Giải pháp kỹ thuật tối ưu là cày thật sâu (35–40 cm) để lật úp toàn bộ tầng đất phèn tiềm tàng dưới đáy lên phơi trên mặt ruộng.",
          isTrue: false,
          explanation: "Sai. Cày sâu lật tầng phèn tiềm tàng (chứa FeS2) lên mặt đất gặp oxy sẽ oxy hóa tạo axit H2SO4 làm đất chua kiệt nặng hơn."
        },
        {
          label: "d",
          level: "vandung",
          text: "Biện pháp cải tạo đúng là kết hợp bón vôi nông nghiệp, dẫn nước ngọt thau chua, bón phân lân nung chảy và tăng cường phân hữu cơ ủ hoai.",
          isTrue: true,
          explanation: "Đây là quy trình tổng hợp chuẩn để trung hòa axit, kết tủa độc tố nhôm/sắt và rửa phèn."
        }
      ]
    },
    {
      unitId: "u3_2",
      competency: "SDCN",
      stem: "Trang trại rau an toàn của bác Minh chuẩn bị bước vào vụ Đông Xuân. Bác Minh nhập về 3 loại vật tư phân bón: Phân đạm Urê (46% N), Phân vi sinh cố định đạm - phân giải lân và Phân chuồng để lập kế hoạch bón cho diện tích bắp cải và cà chua. Xét tính đúng/sai của các nhận định sau:",
      statements: [
        {
          label: "a",
          level: "biet",
          text: "Phân đạm Urê thuộc nhóm phân bón hóa học đơn, có tỷ lệ dinh dưỡng nguyên chất cao và dễ tan trong nước.",
          isTrue: true,
          explanation: "Urê CO(NH2)2 chứa 46% N nguyên chất, tan nhanh trong nước."
        },
        {
          label: "b",
          level: "hieu",
          text: "Để tiết kiệm công lao động, bác Minh nên trộn đều phân đạm Urê với vôi bột và phân vi sinh trước khi bón 3 ngày.",
          isTrue: false,
          explanation: "Sai. Vôi có tính kiềm mạnh làm mất đạm dưới dạng khí NH3 bay hơi và tiêu diệt vi sinh vật sống trong phân vi sinh."
        },
        {
          label: "c",
          level: "vandung",
          text: "Phân chuồng bắt buộc phải được ủ hoai mục hoàn toàn trước khi bón lót cho rau nhằm tiêu diệt mầm bệnh (E. coli, Salmonella), trứng giun và hạt cỏ dại.",
          isTrue: true,
          explanation: "Ủ hoai mục ở nhiệt độ cao giúp phân hủy chất hữu cơ và tiêu diệt mầm bệnh gây hại."
        },
        {
          label: "d",
          level: "vandung",
          text: "Đối với rau ăn lá, bác Minh cần ngừng bón phân đạm hóa học ít nhất 10–15 ngày trước khi thu hoạch để hạn chế tồn dư nitrat (NO3-) trong nông sản.",
          isTrue: true,
          explanation: "Ngừng bón đạm trước thu hoạch giúp cây chuyển hóa hết NO3-, đảm bảo vệ sinh an toàn thực phẩm."
        }
      ]
    },
    {
      unitId: "u2_2",
      competency: "ĐGCN",
      stem: "Một khu vực đất canh tác cà phê trên sườn đồi dốc 15 độ tại Tây Nguyên sau nhiều năm canh tác độc canh có biểu hiện: tầng đất mặt bị rửa trôi trơ sỏi đá, độ mùn giảm xuống dưới 1%, đất khô cứng vào mùa khô. Xét tính đúng/sai của các nhận định sau:",
      statements: [
        {
          label: "a",
          level: "biet",
          text: "Hiện tượng mất lớp đất mặt giàu dinh dưỡng do nước mưa chảy tràn trên địa hình dốc gọi là xói mòn đất.",
          isTrue: true,
          explanation: "Nước mưa chảy tràn cuốn trôi hạt sét, mùn và dinh dưỡng tầng mặt là hiện tượng xói mòn."
        },
        {
          label: "b",
          level: "hieu",
          text: "Nguyên nhân chính gây suy thoái đất là do địa hình dốc, mưa lớn tập trung và thiếu thảm thực vật che phủ mặt đất.",
          isTrue: true,
          explanation: "Độ dốc lớn kết hợp mặt đất trơ không có cây che phủ làm tăng tốc độ dòng chảy mặt."
        },
        {
          label: "c",
          level: "vandung",
          text: "Để cải tạo khu đất này, người dân nên đào rãnh thoát nước thẳng đứng từ đỉnh đồi xuống chân đồi để nước chảy nhanh nhất.",
          isTrue: false,
          explanation: "Sai. Đào rãnh dọc sườn dốc sẽ làm tăng tốc độ dòng chảy, gây xói mòn rãnh sâu nghiêm trọng hơn; phải thiết kế theo đường đồng mức."
        },
        {
          label: "d",
          level: "vandung",
          text: "Trồng xen cây họ Đậu che phủ đất kết hợp trồng hàng cây chắn gió, làm bồn giữ nước quanh gốc và bón phân hữu cơ là giải pháp canh tác bền vững.",
          isTrue: true,
          explanation: "Biện pháp nông lâm kết hợp và che phủ sinh học giúp giữ đất, giữ ẩm và phục hồi độ phì."
        }
      ]
    }
  ],

  // III. Trắc nghiệm trả lời ngắn (Short Answer)
  short: [
    {
      unitId: "u2_1", level: "biet", competency: "NCCN",
      stem: "Đất trồng có phản ứng trung tính khi giá trị pH của đất nằm quanh ngưỡng bằng bao nhiêu (làm tròn đến số nguyên)?",
      answer: "7",
      explanation: "Thang đo pH trung tính ở mức pH ≈ 7 (từ 6,6 đến 7,3)."
    },
    {
      unitId: "u3_1", level: "hieu", competency: "SDCN",
      stem: "Trên bao bì một loại phân bón NPK có ghi chỉ số 16-16-8. Tỉ lệ phần trăm (%) hàm lượng đạm nguyên chất (N) trong loại phân bón này là bao nhiêu?",
      answer: "16",
      explanation: "Ba chỉ số trên bao phân NPK lần lượt biểu thị % N - % P2O5 - % K2O, do đó hàm lượng N là 16%."
    },
    {
      unitId: "u3_2", level: "vandung", competency: "SDCN",
      stem: "Một ruộng ngô diện tích 1 ha cần bón thúc 92 kg đạm nguyên chất (N). Nếu sử dụng phân đạm Urê có hàm lượng N là 46% thì người nông dân cần dùng bao nhiêu kg phân Urê?",
      answer: "200",
      explanation: "Khối lượng phân Urê cần dùng = (92 / 46) × 100 = 200 kg."
    },
    {
      unitId: "u1_2", level: "hieu", competency: "NCCN",
      stem: "Trong kỹ thuật sử dụng phân bón hiệu quả và an toàn, nguyên tắc cốt lõi được đúc kết thành nguyên tắc 'Mấy đúng' (ghi bằng chữ số)?",
      answer: "4",
      explanation: "Nguyên tắc 4 đúng: Đúng loại, đúng liều, đúng lúc, đúng cách."
    }
  ],

  // IV. Tự luận (Essay)
  essay: [
    {
      unitId: "u2_2",
      level: "vandung",
      competency: "SDCN, ĐGCN",
      stem: "Một thửa đất canh tác sườn dốc của nông hộ sau nhiều năm trồng sắn độc canh có hiện tượng: tầng đất mặt bị bào mòn mỏng dần, đất trở nên chai cứng, nghèo chất mùn và khả năng giữ nước rất kém.\nEm hãy vận dụng kiến thức về đất trồng để:\na) Phân tích 02 nguyên nhân chính dẫn đến tình trạng đất bị xói mòn và chai cứng nêu trên.\nb) Đề xuất 03 biện pháp kỹ thuật canh tác bền vững giúp cải tạo và phục hồi độ phì nhiêu cho thửa đất này.",
      rubric: [
        "a) Phân tích đúng 02 nguyên nhân chính (35% số điểm câu): Do canh tác trên đất dốc không có thảm thực vật che phủ dẫn đến nước mưa rửa trôi hạt sét và chất mùn; Do độc canh lâu năm chỉ bón phân hóa học mà không trả lại chất hữu cơ làm phá vỡ cấu trúc đoàn lạp và suy giảm hệ vi sinh vật đất.",
        "b) Đề xuất 03 biện pháp cải tạo bền vững (65% số điểm câu): (1) Biện pháp công trình & canh tác: Làm ruộng bậc thang hoặc canh tác theo đường đồng mức để giảm tốc độ dòng chảy mặt; (2) Biện pháp sinh học: Luân canh, trồng xen cây họ Đậu hoặc trồng băng cỏ che phủ đất; (3) Biện pháp dinh dưỡng: Tăng cường bón phân hữu cơ ủ hoai mục, phân xanh, phân vi sinh và vôi (nếu đất chua) để tái tạo hệ keo đất."
      ]
    },
    {
      unitId: "u3_2",
      level: "vandung",
      competency: "SDCN, ĐGCN",
      stem: "Hiện nay, tại nhiều vùng chuyên canh rau màu, một bộ phận nông dân vẫn có thói quen bón thừa phân đạm hóa học (Urê) để rau nhanh tốt và xanh lá.\na) Hãy phân tích những tác hại của việc lạm dụng phân đạm hóa học đối với cây trồng, môi trường đất - nước và sức khỏe người tiêu dùng.\nb) Trình bày nguyên tắc '4 đúng' trong sử dụng phân bón và đề xuất giải pháp kết hợp phân bón hữu cơ - vi sinh nhằm hướng tới nền nông nghiệp xanh, bền vững.",
      rubric: [
        "a) Phân tích hệ lụy lạm dụng phân đạm hóa học (50% số điểm câu): Với cây trồng: Thân lá vươn lốp, mô cơ giới yếu dễ đổ ngã, mẫn cảm sâu bệnh; Với môi trường: Làm đất chua hóa, chai cứng, dư lượng NO3- rửa trôi gây ô nhiễm nước ngầm và phú dưỡng hóa nguồn nước mặt; Với sức khỏe: Tích lũy nitrat (NO3-) vượt ngưỡng trong rau, vào cơ thể chuyển hóa thành nitrit gây nguy cơ ngộ độc và ung thư.",
        "b) Nguyên tắc '4 đúng' và giải pháp nông nghiệp bền vững (50% số điểm câu): Nêu đủ 4 đúng (Đúng loại, đúng liều lượng, đúng thời điểm, đúng phương pháp); Giải pháp: Giảm dần phân vô cơ, dùng phân hữu cơ hoai mục/trùn quế bón lót kết hợp phân vi sinh, tận dụng phụ phẩm nông nghiệp ủ компост và tuân thủ thời gian cách ly phân đạm trước khi thu hoạch."
      ]
    },
    {
      unitId: "u1_1",
      level: "vandung",
      competency: "NCCN, ĐGCN",
      stem: "Biến đổi khí hậu (hạn hán, xâm nhập mặn, thời tiết cực đoan) đang ảnh hưởng trực tiếp đến sản xuất trồng trọt tại Việt Nam.\na) Hãy giải thích vì sao việc ứng dụng công nghệ cao (nhà màng, tưới tiết kiệm IoT, giống chịu hạn/mặn) là xu hướng tất yếu của ngành trồng trọt hiện đại.\nb) Liên hệ thực tế tại địa phương em: Đề xuất một mô hình trồng trọt hiệu quả giúp nâng cao giá trị kinh tế trên một đơn vị diện tích canh tác.",
      rubric: [
        "a) Giải thích xu hướng công nghệ cao (50% số điểm câu): Giúp kiểm soát chủ động các yếu tố tiểu khí hậu (nhiệt độ, ánh sáng, độ ẩm, dinh dưỡng), giảm sự phụ thuộc vào thời tiết cực đoan, tiết kiệm tài nguyên nước - phân bón, hạn chế sâu bệnh và tạo nông sản an toàn đồng đều.",
        "b) Đề xuất mô hình thực tế tại địa phương (50% số điểm câu): Nêu rõ tên mô hình phù hợp điều kiện địa phương (ví dụ: trồng dưa lưới/rau thủy canh trong nhà màng, trồng cây ăn quả VietGAP tưới nhỏ giọt...), giải thích quy trình kỹ thuật cơ bản và hiệu quả kinh tế - môi trường."
      ]
    }
  ]
};
