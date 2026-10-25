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
        lesson: "Bài 1: Giới thiệu về trồng trọt",
        periods: 2,
        selected: true,
        competencies: ["NCCN", "ĐGCN"],
        yccd: {
          biet: "Nêu được vai trò, triển vọng của trồng trọt đối với đời sống, kinh tế và môi trường sinh thái; phân loại được các nhóm cây trồng theo nguồn gốc, chu kỳ sống và mục đích sử dụng.",
          hieu: "Phân tích được triển vọng phát triển ngành trồng trọt Việt Nam theo hướng công nghệ cao; giải thích được cơ sở khoa học của các hệ thống phân loại cây trồng.",
          vandung: "Đánh giá được tiềm năng phát triển và đề xuất phương án chuyển đổi cơ cấu cây trồng phù hợp với điều kiện sinh thái thực tiễn tại địa phương."
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
          biet: "Nêu được các yếu tố chính tác động đến cây trồng (nhiệt độ, ánh sáng, nước, dinh dưỡng, đất trồng, giống cây trồng, kỹ thuật canh tác).",
          hieu: "Giải thích được mối quan hệ tác động qua lại giữa các yếu tố ngoại cảnh với quá trình quang hợp, hô hấp và hình thành năng suất cây trồng.",
          vandung: "Vận dụng kiến thức điều khiển các yếu tố nhiệt độ, ánh sáng, ẩm độ trong mô hình nhà màng, nhà lưới để nâng cao năng suất và phẩm chất cây trồng."
        }
      },
      {
        id: "u2_1",
        chapter: "Chủ đề 2: Đất trồng",
        lesson: "Bài 3: Giới thiệu về đất trồng",
        periods: 2,
        selected: true,
        competencies: ["NCCN", "SDCN"],
        yccd: {
          biet: "Trình bày được khái niệm đất trồng, các thành phần chính của đất (rắn, lỏng, khí, sinh vật); nêu được cấu tạo hạt keo đất và chỉ số phản ứng dung dịch đất (pH).",
          hieu: "Giải thích được cơ chế hấp phụ của keo đất, vai trò của tầng mùn hữu cơ và ảnh hưởng của độ pH đất đến khả năng hấp thụ các nguyên tố khoáng của rễ cây.",
          vandung: "Phân tích kết quả xét nghiệm mẫu đất thực tế để chẩn đoán tình trạng độ phì nhiêu và độ chua của tầng đất mặt."
        }
      },
      {
        id: "u2_2",
        chapter: "Chủ đề 2: Đất trồng",
        lesson: "Bài 4: Sử dụng, cải tạo và bảo vệ đất trồng",
        periods: 2,
        selected: true,
        competencies: ["SDCN", "ĐGCN"],
        yccd: {
          biet: "Kể tên được các nhóm đất cần cải tạo phổ biến ở Việt Nam (đất chua, đất mặn, đất phèn, đất xói mòn trơ sỏi đá vùng đồi núi).",
          hieu: "Giải thích được nguyên nhân hình thành và cơ sở khoa học của các biện pháp bón vôi khử chua, thau chua rửa mặn, cày sâu không lật và làm ruộng bậc thang.",
          vandung: "Xây dựng quy trình kỹ thuật cải tạo và sử dụng bền vững cho một loại đất bị suy thoái (đất dốc xói mòn hoặc đất chua mặn) tại địa phương."
        }
      },
      {
        id: "u2_3",
        chapter: "Chủ đề 2: Đất trồng",
        lesson: "Bài 5: Giá thể trồng cây",
        periods: 2,
        selected: true,
        competencies: ["NCCN", "SDCN", "TKKT"],
        yccd: {
          biet: "Nêu được khái niệm, lợi ích và đặc điểm của một số loại giá thể trồng cây phổ biến (mụn xơ dừa xả chát, trấu hun, đá perlite, than bùn, bông khoáng).",
          hieu: "So sánh được ưu điểm và nhược điểm của từng loại giá thể hữu cơ tự nhiên và giá thể trơ nhân tạo trong canh tác không dùng đất.",
          vandung: "Đề xuất công thức phối trộn giá thể tối ưu (thông thoáng khí, giữ ẩm, giàu khoáng) để ươm cây giống hoặc trồng rau ăn quả trong chậu."
        }
      },
      {
        id: "u2_4",
        chapter: "Chủ đề 2: Đất trồng",
        lesson: "Bài 6: Thực hành: Xác định độ chua và độ mặn của đất",
        periods: 2,
        selected: true,
        competencies: ["SDCN", "TKKT"],
        yccd: {
          biet: "Nêu được nguyên tắc, các bước vận hành máy đo pH cầm tay, bút đo độ dẫn điện EC và phương pháp sử dụng giấy chỉ thị màu đo pH đất.",
          hieu: "Giải thích được vì sao cần pha huyền phù đất với nước cất theo đúng tỉ lệ khối lượng và thời gian lắng trước khi nhúng đầu điện cực.",
          vandung: "Đọc chính xác chỉ số pH và EC từ mẫu đất thực nghiệm, đối chiếu với ngưỡng sinh trưởng của cây trồng để đề xuất biện pháp xử lý đất."
        }
      },
      {
        id: "u3_1",
        chapter: "Chủ đề 3: Phân bón",
        lesson: "Bài 7: Giới thiệu về phân bón",
        periods: 2,
        selected: true,
        competencies: ["NCCN", "SDCN"],
        yccd: {
          biet: "Nêu được khái niệm, vai trò của phân bón trong trồng trọt; phân biệt được 3 nhóm phân bón chính (phân hóa học, phân hữu cơ, phân vi sinh).",
          hieu: "Phân tích được đặc điểm tính chất (độ tan, hàm lượng dinh dưỡng, tác động đến kết cấu đất) của phân hóa học, phân hữu cơ truyền thống và phân bón vi sinh.",
          vandung: "Nhận diện các triệu chứng đặc trưng khi cây trồng thiếu hoặc thừa các nguyên tố dinh dưỡng khoáng đa lượng (N, P, K) để lựa chọn loại phân bón bổ sung kịp thời."
        }
      },
      {
        id: "u3_2",
        chapter: "Chủ đề 3: Phân bón",
        lesson: "Bài 8: Sử dụng và bảo quản phân bón",
        periods: 2,
        selected: true,
        competencies: ["SDCN", "ĐGCN"],
        yccd: {
          biet: "Trình bày được nguyên tắc sử dụng và bảo quản phân hóa học, phân hữu cơ, phân bón vi sinh.",
          hieu: "Giải thích được cơ sở khoa học của việc bón lót phân hữu cơ/phân lân và bón thúc phân đạm/kali; giải thích quy tắc không trộn đạm urê với vôi bột.",
          vandung: "Đánh giá hệ lụy của việc lạm dụng phân bón vô cơ và xây dựng quy trình bón phân theo nguyên tắc '4 đúng' hướng tới nông nghiệp tuần hoàn, hữu cơ bền vững."
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
        lesson: "Bài 1: Vai trò và triển vọng của chăn nuôi",
        periods: 2,
        selected: true,
        competencies: ["NCCN", "ĐGCN"],
        yccd: {
          biet: "Trình bày được vai trò của chăn nuôi đối với đời sống con người và nền kinh tế quốc dân; nêu được các thành tựu và xu hướng phát triển chăn nuôi bền vững.",
          hieu: "Phân tích được ưu điểm của mô hình chăn nuôi trang trại công nghệ cao và chăn nuôi tuần hoàn an toàn sinh học so với chăn nuôi nông hộ truyền thống.",
          vandung: "Đề xuất định hướng phát triển mô hình kinh tế tuần hoàn trong chăn nuôi phù hợp với điều kiện sinh thái và nguồn phụ phẩm nông nghiệp tại địa phương."
        }
      },
      {
        id: "cn11_2",
        chapter: "Chủ đề 1: Giới thiệu chung về chăn nuôi",
        lesson: "Bài 2: Vật nuôi và phương thức chăn nuôi",
        periods: 2,
        selected: true,
        competencies: ["NCCN", "SDCN"],
        yccd: {
          biet: "Nhận biết được các nhóm vật nuôi phổ biến theo nguồn gốc, đặc điểm sinh học và mục đích sử dụng; nêu được đặc điểm của 3 phương thức chăn nuôi chính.",
          hieu: "So sánh được ưu điểm và hạn chế của phương thức chăn thả tự do, chăn nuôi bán công nghiệp và chăn nuôi công nghiệp quy mô lớn.",
          vandung: "Lựa chọn đối tượng vật nuôi và phương thức chăn nuôi tối ưu nhằm nâng cao hiệu quả kinh tế và kiểm soát dịch bệnh cho nông hộ hoặc gia trại."
        }
      },
      {
        id: "cn11_3",
        chapter: "Chủ đề 2: Công nghệ giống vật nuôi",
        lesson: "Bài 3: Khái niệm, vai trò của giống trong chăn nuôi",
        periods: 2,
        selected: true,
        competencies: ["NCCN", "ĐGCN"],
        yccd: {
          biet: "Nêu được khái niệm giống vật nuôi, điều kiện công nhận giống và vai trò quyết định của giống đối với năng suất, chất lượng sản phẩm chăn nuôi.",
          hieu: "Phân tích được mối quan hệ giữa yếu tố di truyền của giống với điều kiện dinh dưỡng, chăm sóc và phòng dịch trong việc phát huy tối đa tiềm năng năng suất.",
          vandung: "Khảo sát và đánh giá ưu thế của một số giống vật nuôi bản địa (lợn Móng Cái, gà Ri) hoặc giống ngoại nhập phẩm chất cao tại địa phương."
        }
      },
      {
        id: "cn11_4",
        chapter: "Chủ đề 2: Công nghệ giống vật nuôi",
        lesson: "Bài 4: Chọn giống vật nuôi",
        periods: 2,
        selected: true,
        competencies: ["NCCN", "SDCN"],
        yccd: {
          biet: "Nêu được các chỉ tiêu cơ bản để chọn giống vật nuôi (ngoại hình, thể chất, sinh trưởng, phát dục, khả năng sản xuất); kể tên các phương pháp chọn giống.",
          hieu: "So sánh được cơ sở khoa học, ưu nhược điểm và phạm vi áp dụng của phương pháp chọn lọc hàng loạt và chọn lọc cá thể (kiểm tra năng suất cá thể và đời con).",
          vandung: "Vận dụng các chỉ tiêu ngoại hình và sức tăng trọng để đánh giá, tuyển chọn đàn lợn hoặc đàn gia cầm hậu bị đạt tiêu chuẩn giống xuất sắc."
        }
      },
      {
        id: "cn11_5",
        chapter: "Chủ đề 2: Công nghệ giống vật nuôi",
        lesson: "Bài 5: Nhân giống vật nuôi",
        periods: 2,
        selected: true,
        competencies: ["SDCN", "ĐGCN"],
        yccd: {
          biet: "Nêu được khái niệm, mục đích của nhân giống thuần chủng và lai giống; phân biệt được các phương pháp lai (lai kinh tế, lai cải tiến, lai cải tạo).",
          hieu: "Giải thích được cơ sở di truyền học của hiện tượng ưu thế lai và mục đích tạo con lai thương phẩm F1 có sức sống cao, tăng trọng nhanh trong lai kinh tế.",
          vandung: "Thiết kế sơ đồ lai kinh tế 2 giống hoặc 3 giống phù hợp với quy mô chăn nuôi trang trại nhằm tối ưu hóa tỷ lệ nạc và chất lượng thịt."
        }
      },
      {
        id: "cn11_6",
        chapter: "Chủ đề 2: Công nghệ giống vật nuôi",
        lesson: "Bài 6: Ứng dụng công nghệ sinh học trong chọn và nhân giống vật nuôi",
        periods: 2,
        selected: true,
        competencies: ["SDCN", "ĐGCN"],
        yccd: {
          biet: "Nêu được các ứng dụng CNSH hiện đại trong chọn và nhân giống (thụ tinh nhân tạo, cấy truyền phôi, phân tách giới tính tinh trùng, chọn giống bằng chỉ thị phân tử).",
          hieu: "Phân tích được ý nghĩa kinh tế và kỹ thuật của công nghệ thụ tinh nhân tạo và cấy truyền phôi trong việc nhân nhanh đàn giống ưu tú phẩm chất cao.",
          vandung: "Đề xuất quy trình ứng dụng thụ tinh nhân tạo cho lợn hoặc bò tại hợp tác xã chăn nuôi nhằm nâng cao tỷ lệ thụ thai và hạn chế lây lan dịch bệnh."
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
        chapter: "Chương I: Giới thiệu chung về lâm nghiệp",
        lesson: "Bài 1: Vai trò và triển vọng của lâm nghiệp",
        periods: 2,
        selected: true,
        competencies: ["NCCN", "ĐGCN"],
        yccd: {
          biet: "Nêu được vai trò của lâm nghiệp đối với đời sống con người, kinh tế quốc dân và môi trường sinh thái; phân loại được 3 loại rừng (đặc dụng, phòng hộ, sản xuất).",
          hieu: "Phân tích được các nhân tố ảnh hưởng đến sự phát triển của lâm nghiệp; giải thích được 4 đặc trưng cơ bản của sản xuất lâm nghiệp.",
          vandung: "Liên hệ thực tiễn các giải pháp phát triển lâm nghiệp bền vững gắn liền với thị trường tín chỉ carbon rừng và bảo tồn đa dạng sinh học tại Việt Nam."
        }
      },
      {
        id: "cn12_2",
        chapter: "Chương I: Giới thiệu chung về lâm nghiệp",
        lesson: "Bài 2: Các hoạt động lâm nghiệp cơ bản và nguyên nhân chủ yếu làm suy thoái tài nguyên rừng",
        periods: 2,
        selected: true,
        competencies: ["NCCN", "ĐGCN"],
        yccd: {
          biet: "Trình bày được các hoạt động lâm nghiệp cơ bản (quản lý, bảo vệ, phát triển, sử dụng rừng, chế biến và thương mại lâm sản); kể tên các nguyên nhân gây suy thoái rừng.",
          hieu: "Phân tích được tác động tiêu cực của nạn phá rừng, cháy rừng, biến đổi khí hậu và khai thác quá mức đến cấu trúc hệ sinh thái và an ninh nguồn nước.",
          vandung: "Đánh giá thực trạng suy thoái tài nguyên rừng tại địa phương và đề xuất các biện pháp giảm thiểu áp lực xâm hại rừng tự nhiên."
        }
      },
      {
        id: "cn12_3",
        chapter: "Chương II: Trồng và chăm sóc rừng",
        lesson: "Bài 3: Vai trò, nhiệm vụ của trồng và chăm sóc rừng",
        periods: 2,
        selected: true,
        competencies: ["NCCN", "SDCN"],
        yccd: {
          biet: "Trình bày được vai trò và nhiệm vụ chiến lược của công tác trồng rừng và chăm sóc rừng trong giai đoạn hiện nay.",
          hieu: "Phân tích được ý nghĩa to lớn của việc phủ xanh đất trống đồi trọc, trồng rừng phòng hộ đầu nguồn và rừng ngập mặn chắn sóng ven biển.",
          vandung: "Xây dựng kế hoạch tuyên truyền và tham gia phong trào trồng cây gây rừng, Tết trồng cây phù hợp với điều kiện trường học và địa phương."
        }
      },
      {
        id: "cn12_4",
        chapter: "Chương II: Trồng và chăm sóc rừng",
        lesson: "Bài 4: Quy luật sinh trưởng và phát triển của cây rừng",
        periods: 2,
        selected: true,
        competencies: ["NCCN", "SDCN"],
        yccd: {
          biet: "Nêu được các giai đoạn sinh trưởng, phát triển của cây rừng từ giai đoạn hạt, cây con, cây non, cây sào, cây trung niên đến cây già cỗi.",
          hieu: "Phân tích được các quy luật sinh trưởng chiều cao, đường kính và hiện tượng tỉa cành tự nhiên do cạnh tranh ánh sáng trong quần thể rừng.",
          vandung: "Vận dụng quy luật sinh trưởng và hiện tượng tỉa thưa tự nhiên để xác định mật độ trồng và thời điểm chặt tỉa thưa rừng trồng hợp lý."
        }
      },
      {
        id: "cn12_5",
        chapter: "Chương II: Trồng và chăm sóc rừng",
        lesson: "Bài 5: Kĩ thuật trồng và chăm sóc rừng",
        periods: 2,
        selected: true,
        competencies: ["SDCN", "TKKT"],
        yccd: {
          biet: "Trình bày được thời vụ trồng, mật độ trồng và các bước trong quy trình kỹ thuật trồng rừng bằng cây con có bầu hoặc rễ trần; các công việc chăm sóc rừng trồng.",
          hieu: "Giải thích được cơ sở khoa học của việc chuẩn bị đất trồng rừng theo đường đồng mức và kỹ thuật chăm sóc cây non trong 3 năm đầu (làm cỏ, xới váng, bón thúc, tỉa dặm).",
          vandung: "Lập bản hướng dẫn kỹ thuật trồng và chăm sóc một loài cây rừng bản địa (sao đen, dầu rái, keo lai) đạt tỉ lệ sống trên 90%."
        }
      },
      {
        id: "cn12_6",
        chapter: "Chương III: Bảo vệ và khai thác tài nguyên rừng",
        lesson: "Bài 6: Ý nghĩa, nhiệm vụ, thực trạng của việc bảo vệ và khai thác rừng",
        periods: 2,
        selected: true,
        competencies: ["NCCN", "ĐGCN"],
        yccd: {
          biet: "Nêu được ý nghĩa, nhiệm vụ bảo vệ tài nguyên rừng và thực trạng bảo vệ, khai thác rừng ở nước ta hiện nay.",
          hieu: "Phân tích được mối quan hệ mật thiết giữa bảo vệ hệ sinh thái rừng với bảo tồn đa dạng sinh học, phòng chống thiên tai (lũ quét, sạt lở) và điều hòa khí hậu.",
          vandung: "Đánh giá hiệu quả của chính sách giao khoán quản lý bảo vệ rừng và cơ chế chi trả dịch vụ môi trường rừng đối với đời sống cộng đồng vùng đệm."
        }
      },
      {
        id: "cn12_7",
        chapter: "Chương III: Bảo vệ và khai thác tài nguyên rừng",
        lesson: "Bài 7: Biện pháp bảo vệ và khai thác tài nguyên rừng",
        periods: 2,
        selected: true,
        competencies: ["SDCN", "ĐGCN"],
        yccd: {
          biet: "Trình bày được các biện pháp phòng cháy chữa cháy rừng, phòng trừ sâu bệnh hại rừng; nêu được 3 phương thức khai thác rừng (khai thác trắng, khai thác dần, khai thác chọn).",
          hieu: "So sánh được ưu, nhược điểm, điều kiện áp dụng và tác động sinh thái của khai thác trắng, khai thác dần và khai thác chọn; giải thích nguyên tắc tái sinh rừng sau khai thác.",
          vandung: "Xây dựng phương án phòng chống cháy rừng trong mùa hanh khô hoặc đề xuất kế hoạch khai thác gỗ bền vững đạt chứng chỉ quản lý rừng FSC."
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
    },
    // CN12: Bài 2 đến Bài 7
    {
      unitId: "cn12_2", level: "biet", competency: "NCCN",
      stem: "Hoạt động nào sau đây thuộc nhóm các hoạt động lâm nghiệp cơ bản theo quy định của Luật Lâm nghiệp?",
      options: [
        "Quản lí, bảo vệ, phát triển, sử dụng rừng; chế biến và thương mại lâm sản.",
        "Chế biến phân bón hóa học và cơ khí nặng phục vụ nông trường.",
        "Đắp đập ngăn mặn và nuôi thả tôm sú thâm canh.",
        "Luyện cán thép và chế tạo ô tô vận tải gỗ."
      ],
      answer: 0
    },
    {
      unitId: "cn12_2", level: "hieu", competency: "ĐGCN",
      stem: "Nguyên nhân chủ yếu nào sau đây gây suy thoái diện tích và chất lượng tài nguyên rừng tự nhiên ở nước ta?",
      options: [
        "Khai thác gỗ trái phép, phá rừng làm nương rẫy, cháy rừng và chuyển đổi mục đích sử dụng đất rừng.",
        "Trồng quá nhiều cây giống bản địa quý hiếm.",
        "Ứng dụng công nghệ GIS và máy bay không người lái theo dõi rừng.",
        "Thành lập thêm các vườn quốc gia và khu bảo tồn thiên nhiên."
      ],
      answer: 0
    },
    {
      unitId: "cn12_3", level: "biet", competency: "NCCN",
      stem: "Mục đích chính của việc xây dựng và phát triển hệ thống rừng phòng hộ đầu nguồn là gì?",
      options: [
        "Điều hòa dòng chảy, chống xói mòn rửa trôi đất, hạn chế lũ lụt và giữ ổn định nguồn nước ngầm.",
        "Cung cấp gỗ củi thương phẩm khai thác hàng loạt hàng năm.",
        "Chuyên canh cây cao su xuất khẩu thu mủ cao su quy mô lớn.",
        "San lấp làm khu công nghiệp nặng và cảng biển nước sâu."
      ],
      answer: 0
    },
    {
      unitId: "cn12_3", level: "hieu", competency: "SDCN",
      stem: "Tại sao việc trồng rừng ngập mặn ven biển lại có ý nghĩa chiến lược trong ứng phó với biến đổi khí hậu?",
      options: [
        "Vì rừng ngập mặn có bộ rễ cọc bạnh giúp chắn sóng, chắn gió bão, chống xói lở bờ biển và ngăn mặn xâm nhập.",
        "Vì rừng ngập mặn cung cấp gỗ tròn xuất khẩu lớn nhất trong các loại rừng.",
        "Vì cây ngập mặn hút hết nước biển giúp nước ngọt hóa bờ biển.",
        "Vì rừng ngập mặn không bao giờ bị sâu bệnh hay thiên tai tấn công."
      ],
      answer: 0
    },
    {
      unitId: "cn12_4", level: "biet", competency: "NCCN",
      stem: "Theo quy luật sinh trưởng, thứ tự các giai đoạn phát triển của cây rừng từ lúc gieo đến khi già cỗi là:",
      options: [
        "Giai đoạn hạt → Cây mầm (con) → Cây non → Cây sào → Cây trung niên → Cây già cỗi.",
        "Cây già cỗi → Cây trung niên → Cây non → Cây sào → Giai đoạn hạt.",
        "Giai đoạn hạt → Cây sào → Cây non → Cây trung niên → Cây già cỗi.",
        "Cây non → Cây mầm → Cây sào → Cây già cỗi → Cây trung niên."
      ],
      answer: 0
    },
    {
      unitId: "cn12_4", level: "hieu", competency: "SDCN",
      stem: "Hiện tượng tỉa cành tự nhiên ở rừng cây thân gỗ xảy ra chủ yếu do cơ chế sinh học nào?",
      options: [
        "Các cành phía dưới bị tầng tán phía trên che khuất, thiếu ánh sáng quang hợp nên cành khô và rụng dần.",
        "Do sâu đục thân tấn công có chọn lọc chỉ ở các cành dưới thấp.",
        "Do gió bão làm gãy đồng loạt các cành sát gốc cây.",
        "Do người trồng rừng chủ động cưa cắt cành hàng tuần."
      ],
      answer: 0
    },
    {
      unitId: "cn12_5", level: "biet", competency: "SDCN",
      stem: "Khi thực hiện quy trình kỹ thuật trồng rừng bằng cây con có bầu nilon, thao tác nào sau đây là BẮT BUỘC?",
      options: [
        "Rạch xé bỏ vỏ bầu nilon trước khi đặt cây con vào giữa hố trồng để rễ phát triển tự nhiên.",
        "Giữ nguyên túi nilon bọc kín bầu để rễ giữ được độ ẩm trong đất lâu hơn.",
        "Bẻ gãy toàn bộ rễ cọc của cây con trước khi đặt vào hố.",
        "Chỉ lấp đất ngang cổ rễ mà không được giẫm chặt đất quanh gốc."
      ],
      answer: 0
    },
    {
      unitId: "cn12_5", level: "hieu", competency: "TKKT",
      stem: "Công tác chăm sóc rừng trồng non (làm cỏ, xới váng, bón thúc, tỉa dặm) thường được tiến hành trọng điểm trong giai đoạn nào?",
      options: [
        "Trong 3 đến 4 năm đầu sau khi trồng cho đến khi tán rừng khép hoàn toàn.",
        "Chỉ chăm sóc trong vòng 1 tháng đầu tiên sau khi trồng.",
        "Chờ đến khi cây rừng đạt tuổi 15 năm mới bắt đầu chăm sóc.",
        "Chỉ chăm sóc khi rừng đã chuẩn bị bước vào giai đoạn khai thác gỗ."
      ],
      answer: 0
    },
    {
      unitId: "cn12_6", level: "biet", competency: "NCCN",
      stem: "Hành vi nào sau đây vi phạm nghiêm trọng quy định pháp luật về quản lý và bảo vệ rừng ở Việt Nam?",
      options: [
        "Khai thác gỗ trái phép, phá rừng làm rẫy, săn bắt động vật rừng nguy cấp, quý hiếm.",
        "Trồng bổ sung cây gỗ lớn bản địa như Sao đen, Dầu rái vào rừng nghèo kiệt.",
        "Tuần tra canh gác và phát hiện sớm các đám cháy rừng vào mùa khô.",
        "Đăng ký tham gia nhận giao khoán bảo vệ rừng phòng hộ đầu nguồn."
      ],
      answer: 0
    },
    {
      unitId: "cn12_6", level: "hieu", competency: "ĐGCN",
      stem: "Chính sách chi trả dịch vụ môi trường rừng (DVMTR) đem lại ý nghĩa kinh tế - xã hội quan trọng nào sau đây?",
      options: [
        "Tạo nguồn tài chính bền vững ngoài ngân sách hỗ trợ trực tiếp cho người dân vùng đệm gắn bó với công tác giữ rừng.",
        "Buộc toàn bộ các nhà máy thủy điện phải ngừng phát điện vào mùa khô.",
        "Cho phép người dân tự do chặt trắng rừng tự nhiên để bán gỗ lấy tiền.",
        "Chỉ hỗ trợ cho các công ty khai thác khoáng sản trong vùng lõi vườn quốc gia."
      ],
      answer: 0
    },
    {
      unitId: "cn12_7", level: "biet", competency: "SDCN",
      stem: "Phương thức khai thác rừng nào chỉ chặt những cây đã đến tuổi thành thục công nghệ và đạt kích thước quy định, giữ lại cây non và tầng tán che phủ bảo vệ đất?",
      options: [
        "Khai thác chọn.",
        "Khai thác trắng.",
        "Khai thác dần theo băng.",
        "Khai thác triệt để một lần."
      ],
      answer: 0
    },
    {
      unitId: "cn12_7", level: "hieu", competency: "SDCN",
      stem: "Biện pháp phòng cháy rừng chủ động và hiệu quả nhất tại các khu rừng trồng trước khi bước vào cao điểm mùa hanh khô là gì?",
      options: [
        "Dọn sạch thực bì làm các đường băng cản lửa trắng kết hợp đường băng cản lửa xanh, tăng cường chòi canh 24/24.",
        "Phun nước ngập úng toàn bộ diện tích rừng suốt mùa mưa.",
        "Đốt toàn bộ thảm thực bì vào ban đêm khi có gió lớn để dọn cỏ nhanh.",
        "Chặt hạ toàn bộ cây lớn trong rừng để giảm vật liệu cháy."
      ],
      answer: 0
    },

    // CN11: Bài 3 đến Bài 6
    {
      unitId: "cn11_3", level: "biet", competency: "NCCN",
      stem: "Yếu tố nào sau đây đóng vai trò quyết định đến giới hạn trần năng suất tối đa của vật nuôi trong điều kiện chăn nuôi tối ưu?",
      options: [
        "Tiềm năng di truyền của giống vật nuôi.",
        "Màu sắc sơn tường của chuồng trại nuôi dưỡng.",
        "Thời điểm gieo mạ của vụ lúa liền kề.",
        "Chủng loại xe vận chuyển thức ăn gia súc."
      ],
      answer: 0
    },
    {
      unitId: "cn11_4", level: "biet", competency: "NCCN",
      stem: "Phương pháp chọn lọc cá thể (kiểm tra năng suất bản thân và đời sau) thường được ưu tiên áp dụng đối với nhóm đối tượng vật nuôi nào?",
      options: [
        "Đàn đực giống và đàn cái giống sinh sản hạt nhân ưu tú.",
        "Toàn bộ đàn gia cầm thương phẩm nuôi lấy thịt đại trà.",
        "Đàn lợn thịt nuôi xuất khẩu ngắn ngày.",
        "Đàn cá rô phi nuôi thương phẩm trong ao hồ lớn."
      ],
      answer: 0
    },
    {
      unitId: "cn11_5", level: "biet", competency: "SDCN",
      stem: "Phép lai kinh tế đơn giản (lai giữa con đực giống A với con cái giống B để lấy con lai F1 nuôi thịt) nhằm mục đích chính là gì?",
      options: [
        "Tận dụng hiện tượng ưu thế lai giúp con thương phẩm sinh trưởng nhanh, sức sống khỏe và phẩm chất thịt tốt.",
        "Tạo ra một giống vật nuôi thuần chủng hoàn toàn mới để giữ giống đời sau.",
        "Bảo tồn nguồn gen của các giống vật nuôi bản địa đang có nguy cơ tuyệt chủng.",
        "Làm tăng mức độ đồng hợp tử của các gen lặn có hại."
      ],
      answer: 0
    },
    {
      unitId: "cn11_6", level: "biet", competency: "SDCN",
      stem: "Công nghệ sinh học nào trong chăn nuôi cho phép một con đực giống ưu tú xuất sắc có thể phối giống và truyền gen cho hàng nghìn con cái?",
      options: [
        "Công nghệ thụ tinh nhân tạo (AI).",
        "Nuôi cấy mô tế bào thực vật.",
        "Khai thác trứng tự nhiên không cần bảo quản.",
        "Ghép cành và chiết cành vô tính."
      ],
      answer: 0
    },

    // CN10: Bài 6 Thực hành
    {
      unitId: "u2_4", level: "biet", competency: "SDCN",
      stem: "Trong quy trình thực hành xác định độ chua của đất bằng máy đo pH điện tử, mẫu đất thí nghiệm cần được pha với dung dịch nào theo tỉ lệ quy định?",
      options: [
        "Nước cất trung tính hoặc dung dịch KCl 1M.",
        "Dung dịch axit sunfuric đặc H2SO4.",
        "Nước đường saccarozơ 20%.",
        "Dung dịch nước xà phòng kiềm mạnh."
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
