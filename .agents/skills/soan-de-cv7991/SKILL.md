---
name: soan-de-cv7991
description: >-
  Xây dựng ma trận, bản đặc tả, đề kiểm tra định kỳ và kiểm định đề theo chuẩn
  Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024 của Bộ Giáo dục và Đào tạo cho các môn học THCS và THPT
  (đặc biệt là môn Công nghệ Nông nghiệp 10, 11, 12 bộ sách Kết nối tri thức với cuộc sống),
  cho phép tùy biến linh hoạt số câu, số điểm từng câu/từng phần, cấp độ tư duy và đối chiếu trực tiếp ngữ liệu SGK/SGV.
---

# Quy Trình 6 Bước Thiết Kế & Kiểm Định Hồ Sơ Đề Kiểm Tra Định Kỳ Chuẩn Công Văn 7991/BGDĐT-GDTrH

Skill này cung cấp quy trình chuẩn hóa và kho ngữ liệu gốc (SGK PDF, SGV Word, Kế hoạch dạy học PL1 CV 5512, Ma trận & Sách ôn tập huấn Sở GD&ĐT) để thiết kế và kiểm định **Bộ hồ sơ đề kiểm tra định kỳ 4 phần** theo **Công văn số 7991/BGDĐT-GDTrH** ngày 17/12/2024 của Bộ GD&ĐT.

---

## 1. Cấu Trúc Thư Mục Ngữ Liệu & Tài Liệu Tham Chiếu Của Skill

Khi thực hiện nhiệm vụ soạn hoặc kiểm định đề thi, Agent **bắt buộc** tra cứu các tệp ngữ liệu chuẩn dưới đây theo cơ chế *Progressive Disclosure*:

1. **Bảng Mã hóa Năng lực (`[a3.1]`–`[e3.3]`), Động từ hành động & Quy tắc viết câu hỏi/phương án nhiễu:**
   - Xem chi tiết tại: [ma-hoa-nang-luc-va-quy-tac-7991.md](./references/ma-hoa-nang-luc-va-quy-tac-7991.md)
2. **Phân phối Chương trình (PPCT) & Bản đặc tả tách mức độ (Biết – Hiểu – Vận dụng) Lớp 10, 11, 12:**
   - Xem chi tiết tại: [ppct-va-yccd-ket-noi-tri-thuc.md](./references/ppct-va-yccd-ket-noi-tri-thuc.md)
3. **Kho Ngữ liệu Sách Giáo Viên (SGV) Kết nối tri thức (Mục tiêu, Nội dung cốt lõi, Luyện tập, Vận dụng, Thông tin bổ sung):**
   - Xem chi tiết tại: [ngu-lieu-sgv-luyen-tap-van-dung.md](./references/ngu-lieu-sgv-luyen-tap-van-dung.md)
4. **Ngân hàng Câu hỏi Mẫu chuẩn (Trắc nghiệm 4 lựa chọn & Đúng/Sai từ Sách ôn Tập huấn Bộ/Sở GD&ĐT):**
   - Xem chi tiết tại: [ngan-hang-cau-hoi-chuan-cv7991.md](./examples/ngan-hang-cau-hoi-chuan-cv7991.md)
5. **JSON Schema chuẩn hóa đầu ra (kết nối trực tiếp với Web App 6 bước):**
   - Xem chi tiết tại: [exam-output-schema.json](./resources/exam-output-schema.json)
6. **Nguồn Sách Giáo Khoa PDF & Sách Giáo Viên Word gốc trên máy:**
   - SGK Công nghệ 10 (Trồng trọt): `D:\01_DẠY HỌC\001_TRƯỜNG\SÁCH GIAO KHOA 12 NĂM\PDF SGK Lớp 10 2026-2027\10-sgk-cong-nghe-10-cong-nghe-trong-trot.pdf`
   - SGK Công nghệ 11 (Chăn nuôi): `D:\01_DẠY HỌC\001_TRƯỜNG\SÁCH GIAO KHOA 12 NĂM\PDF SGK Lớp 11 2026-2027\11-sgk-cong-nghe-11-cong-nghe-chan-nuoi.pdf`
   - SGK Công nghệ 12 (Lâm nghiệp – Thủy sản): `D:\01_DẠY HỌC\001_TRƯỜNG\SÁCH GIAO KHOA 12 NĂM\PDF SGK Lớp 12 2026-2027\12-sgk-cong-nghe-12-lam-nghiep-thuy-san.pdf`
   - SGV PDF Lớp 10, 11, 12:
     - `D:\01_DẠY HỌC\001_TRƯỜNG\SÁCH GIAO KHOA 12 NĂM\PDF SGK Lớp 10 2026-2027\10-sgv-cong-nghe-10-cong-nghe-trong-trot.pdf`
     - `D:\01_DẠY HỌC\001_TRƯỜNG\SÁCH GIAO KHOA 12 NĂM\PDF SGK Lớp 11 2026-2027\11-sgv-cong-nghe-11-cong-nghe-chan-nuoi.pdf`
     - `D:\01_DẠY HỌC\001_TRƯỜNG\SÁCH GIAO KHOA 12 NĂM\PDF SGK Lớp 12 2026-2027\12-sgv-cong-nghe-12-lam-nghiep-thuy-san.pdf`
   - Thư mục SGV Word gốc: `D:\01_DẠY HỌC\001_TRƯỜNG\DAY HOC\SÁCH GV-WORD-CNNN\`
   - Thư mục 77 Bài giảng PowerPoint Giáo viên giỏi (`_GVG.pptx` đủ 3 khối 10, 11, 12): `D:\01_DẠY HỌC\001_TRƯỜNG\DAY HOC\POWERPOINT  3 KHỐI\`
   - Thư mục 42 Bài Giáo án Chuyên đề học tập 10, 11, 12 (NLS-AI): `D:\01_DẠY HỌC\001_TRƯỜNG\GA CĐCNNN\`
   - Ngân hàng câu hỏi theo bài & ôn thi:
     - Khối 12 (27 bài + Đề thi): `D:\01_DẠY HỌC\001_TRƯỜNG\DAY HOC\GIÁO ÁN CÔNG NGHỆ\GIÁO ÁN CÔNG NGHỆ NN 12\ngân hàng bài tập\`
     - Bộ câu hỏi Ôn thi Tốt nghiệp THPT CN12: `D:\01_DẠY HỌC\001_TRƯỜNG\DAY HOC\ĐỀ ÔN THI TỐT NGHIỆP CNNN\BO CAU HOI TN12 KNTT-ONTHITN.docx`
     - Bộ 48 Mã đề thi chính thức Bộ GD&ĐT (`0701.pdf` → `0748.pdf`): `D:\01_DẠY HỌC\001_TRƯỜNG\DAY HOC\ĐỀ ÔN THI TỐT NGHIỆP CNNN\000 ĐỀ THI CHÍNH THỨC BỘ 2026\`
     - Ngân hàng Trắc nghiệm Chăn nuôi 11 có đáp án: `D:\01_DẠY HỌC\001_TRƯỜNG\DAY HOC\GIÁO ÁN CÔNG NGHỆ\GIÁO ÁN 3 KHỐI CHƯA SOẠN\mua chung KNTT 11-20260817T151537Z-1-001\mua chung KNTT 11\NGÂN HANG TRẮC NGHIỆM CHĂN NUÔI KNTT CÓ ĐÁP ÁN.docx`
   - Thư mục dữ liệu đã trích xuất (JSON/Docx): `D:\congnghenongnghiep\corpus\`

---

## 1B. Kiến Trúc Web App 4 Phân Hệ Chính (`D:\congnghenongnghiep\`)

Ứng dụng Web tại `D:\congnghenongnghiep\index.html` (và `D:\congnghenongnghiep\app\index.html`) được chia thành **4 phân hệ độc lập, liên thông dữ liệu**:
1. **PHẦN 1 – Kiến thức Tóm tắt từng bài, Câu hỏi Nâng cao & Công cụ Phân tích Lý thuyết:**
   - Bao phủ toàn bộ **77 bài học SGK (28 bài CN10 + 22 bài CN11 + 27 bài CN12)** và **42 bài Chuyên đề học tập**.
   - Tóm tắt lý thuyết đơn giản, dễ nhớ kèm chỉ báo **Năng lực số & AI (QĐ 2422)**.
   - **Công cụ Phân tích Lý thuyết Chuyên sâu (Theory Analyzer):** Phân tích bản chất khoa học, bảng đối chiếu khái niệm dễ nhầm, giải thích câu hỏi *"Vì sao?"* thực tiễn và cảnh báo bẫy nhận thức.
   - Hệ thống câu hỏi nâng cao, Đúng/Sai và Trả lời ngắn gắn trực tiếp theo từng bài.
2. **PHẦN 2 – Tổng hợp Bài giảng PPT để Trình chiếu & Dạy nhanh:**
   - Tích hợp trọn bộ **77 bài giảng PowerPoint Giáo viên giỏi (`_GVG.pptx`)** của cả 3 khối 10, 11, 12.
   - **Sân khấu Trình chiếu Web 16:9 (Quick-Teach Web Slide Presenter):** Trình chiếu trực tiếp trên trình duyệt (hỗ trợ Toàn màn hình Fullscreen, chuyển slide bằng phím mũi tên `←` / `→`, nút ẩn/hiện đáp án trò chơi khởi động & câu hỏi nhanh, đồng hồ bấm giờ thảo luận nhóm *Think-Pair-Share* 1 phút / 3 phút), đồng thời cho phép tải/mở trực tiếp file `.pptx` gốc.
3. **PHẦN 3 – Soạn Đề theo Học kì (Chuẩn Công văn 7991 – 6 Bước + Kho 97 Đề mẫu):**
   - Quy trình 6 bước tự động sinh Ma trận (Phụ lục 1), Bản đặc tả (Phụ lục 2), Đề kiểm tra & Hướng dẫn chấm chuẩn Công văn 7991 cho cả 12 kỳ kiểm tra (GK1, CK1, GK2, CK2 của Khối 10, 11, 12).
   - Tích hợp **Kho 97 Đề thi Học kì mẫu (`.docx`)** của 3 khối để giáo viên tải về hoặc tham khảo nhanh.
4. **PHẦN 4 – Ôn tập Học sinh giỏi (HSG) & Luyện thi Tốt nghiệp THPT chuyên sâu:**
   - Phòng luyện đề câu hỏi Vận dụng cao (VDC) chấm điểm tự động và xuất đề bồi dưỡng HSG ra file Word (`.doc`).
   - Chuyên đề Tự luận & Bài toán Kĩ thuật Nông nghiệp (Tính lượng phân bón thương phẩm N-P-K, Phối trộn thức ăn theo Hình vuông Pearson & FCR, Tính mật độ trồng rừng & Quản lí thức ăn ao nuôi thủy sản).
   - **Bộ 3 Máy tính Kĩ thuật Nông nghiệp tương tác** và kho **48 Mã đề thi chính thức của Bộ GD&ĐT (`0701` – `0748`)**.

---

## 2. Nguyên Tắc Tùy Biến Linh Hoạt (Dynamic Configuration)

Trong tất cả các phần và dạng thức câu hỏi, **người ra đề có toàn quyền lựa chọn và cấu hình**:
* **Bật/tắt các dạng thức câu hỏi** xuất hiện trong đề:
  1. *Dạng thức 1:* Trắc nghiệm nhiều phương án lựa chọn (4 phương án A, B, C, D chọn 1).
  2. *Dạng thức 2:* Trắc nghiệm Đúng – Sai (Mỗi câu lớn gồm 1 đoạn dẫn/bối cảnh thực tiễn và 4 ý hỏi $a, b, c, d$).
  3. *Dạng thức 3:* Trắc nghiệm trả lời ngắn (Điền kết quả/thuật ngữ).
  4. *Dạng thức 4:* Tự luận (Giải quyết tình huống thực tiễn nông – lâm – ngư nghiệp).
* **Tùy chỉnh thông số định lượng cho từng phần:**
  * **Số câu hỏi** của mỗi phần ($N_i$).
  * **Số điểm của mỗi câu / mỗi ý** ($p_i$) hoặc quy tắc tính điểm lũy tiến (đối với Đúng/Sai: `0,1 - 0,25 - 0,5 - 1,0` hoặc chia đều `0,25đ/ý`).
  * **Tổng điểm của mỗi phần** ($S_i$) sao cho $\sum S_i = 10,0\text{ điểm}$.
  * **Cấp độ tư duy từng phần:** Phân bổ số câu/lệnh hỏi vào 3 mức **Nhận biết (Biết) – Thông hiểu (Hiểu) – Vận dụng (VD)** (tỉ lệ chuẩn khuyến nghị: `40% : 30% : 30%` hoặc tùy chỉnh theo đối tượng học sinh).

---

## 3. Quy Trình Thực Hiện Tuần Tự 6 Bước (Khớp 100% Dữ Liệu)

1. **Bước 1 (Tải PPCT & Chọn bài theo YCCĐ):** Đọc danh mục bài học, số tiết và Yêu cầu cần đạt từ [ppct-va-yccd-ket-noi-tri-thuc.md](./references/ppct-va-yccd-ket-noi-tri-thuc.md). Tính tỉ trọng điểm gợi ý cho mỗi bài theo công thức:
   $$\text{Trọng số bài } k = \frac{\text{Số tiết bài } k}{\text{Tổng số tiết các bài được chọn}} \times 10\text{ điểm}$$
2. **Bước 2 (Phân bổ Phần, Số câu, Số điểm & Cấp độ tư duy):** Xác lập bảng thông số từng phần, kiểm tra tổng điểm $= 10,0\text{đ}$ và tỉ lệ % Biết – Hiểu – Vận dụng.
3. **Bước 3 (Tạo Ma trận đề - Mẫu Phụ lục 1 CV 7991):** Phân bổ số câu/ý hỏi vào từng ô `(Đơn vị kiến thức × Dạng thức × Cấp độ tư duy)`. Tổng ngang và tổng dọc phải khớp tuyệt đối với Bước 2.
4. **Bước 4 (Tạo Bản đặc tả đề - Mẫu Phụ lục 2 CV 7991):** Tách rõ chỉ báo Yêu cầu cần đạt theo 3 mức **Nhận biết – Thông hiểu – Vận dụng** gắn với mã năng lực (`NCCN [a3.1–a3.3]`, `GTCN [b3.1–b3.2]`, `SDCN [c3.1–c3.4]`, `ĐGCN [d3.1–d3.2]`, `TKKT [e3.1–e3.3]`) từ [ma-hoa-nang-luc-va-quy-tac-7991.md](./references/ma-hoa-nang-luc-va-quy-tac-7991.md).
5. **Bước 5 (Biên soạn Đề kiểm tra & Hướng dẫn chấm):**
   * Bám sát ngữ liệu Sách Giáo Khoa và Sách Giáo Viên tại [ngu-lieu-sgv-luyen-tap-van-dung.md](./references/ngu-lieu-sgv-luyen-tap-van-dung.md) cùng cấu trúc câu hỏi mẫu tại [ngan-hang-cau-hoi-chuan-cv7991.md](./examples/ngan-hang-cau-hoi-chuan-cv7991.md).
   * Đáp án tự luận phải tách nhỏ từng bước chấm `0,25đ`.
6. **Bước 6 (Kiểm định Đề bằng Thuật toán & AI):**
   * Kiểm tra toán học: Khớp 100% số câu, điểm từng câu, điểm từng phần và tỉ lệ cấp độ tư duy giữa Bước 2 $\leftrightarrow$ Ma trận $\leftrightarrow$ Đặc tả $\leftrightarrow$ Đề thi $\leftrightarrow$ Hướng dẫn chấm.
   * Kiểm tra chất lượng sư phạm: Phương án nhiễu hợp lý, câu Đúng/Sai có bối cảnh thực tiễn, không trùng lặp kiến thức giữa các câu, phân bố đáp án A/B/C/D cân bằng.
