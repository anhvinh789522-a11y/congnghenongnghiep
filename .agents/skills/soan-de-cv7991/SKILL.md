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
   - SGK Công nghệ 10 (Trồng trọt): `c:\Users\66666666666666666666\Downloads\10-sgk-cong-nghe-10-cong-nghe-trong-trot.pdf`
   - SGK Công nghệ 11 (Chăn nuôi): `c:\Users\66666666666666666666\Downloads\11-sgk-cong-nghe-11-cong-nghe-chan-nuoi.pdf`
   - SGK Công nghệ 12 (Lâm nghiệp – Thủy sản): `c:\Users\66666666666666666666\Downloads\12-sgk-cong-nghe-12-lam-nghiep-thuy-san.pdf`
   - Thư mục SGV Word gốc: `c:\Users\66666666666666666666\Downloads\SÁCH GV-WORD-CNNN\`
   - Thư mục văn bản đã trích xuất: `C:\Users\66666666666666666666\.gemini\antigravity\scratch\cong-nghe-nong-nghiep-cv7991\corpus\`

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
