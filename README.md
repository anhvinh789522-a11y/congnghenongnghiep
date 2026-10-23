# Hệ Thống Thiết Kế & Kiểm Định Đề Thi Môn Công Nghệ Nông Nghiệp (Chuẩn Công Văn 7991/BGDĐT-GDTrH)

Hệ thống tích hợp **Skill AI đa tầng (`soan-de-cv7991`)** và **Ứng dụng Web 6 bước** hỗ trợ giáo viên xây dựng Ma trận, Bản đặc tả, Đề kiểm tra định kỳ (Giữa kì 1, Cuối kì 1, Giữa kì 2, Cuối kì 2) và Kiểm định đề bằng AI cho môn **Công nghệ Nông nghiệp (Lớp 10 Trồng trọt, Lớp 11 Chăn nuôi, Lớp 12 Lâm nghiệp – Thủy sản)** bộ sách *Kết nối tri thức với cuộc sống* theo chuẩn **Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024 của Bộ Giáo dục và Đào tạo**.

---

## 🚀 Quy Trình 6 Bước Trên Ứng Dụng

1. **Bước 1 – Tải Phân phối Chương trình (PPCT) & Chọn bài theo Yêu cầu cần đạt (YCCĐ):**
   - Tích hợp sẵn **12 gói PPCT chính thức** (đủ 4 kỳ: *Giữa kì 1, Cuối kì 1, Giữa kì 2, Cuối kì 2* cho cả 3 khối **Lớp 10, Lớp 11, Lớp 12**).
   - Hỗ trợ tải lên file PPCT (`.json`, `.csv`, `.txt`), thêm/sửa bài học, số tiết, Yêu cầu cần đạt (*Biết – Hiểu – Vận dụng*) và Mã hóa năng lực (`NCCN`, `GTCN`, `SDCN`, `ĐGCN`, `TKKT`).
2. **Bước 2 – Bảng Phân bổ Phần, Số câu, Điểm mỗi câu, Điểm từng phần & Cấp độ tư duy:**
   - Người ra đề có toàn quyền bật/tắt và tùy chỉnh thông số cho cả **4 dạng thức câu hỏi** (*Trắc nghiệm 4 lựa chọn, Trắc nghiệm Đúng – Sai, Trắc nghiệm Trả lời ngắn, Tự luận*).
   - Tùy chỉnh điểm mỗi câu, quy tắc tính điểm Đúng – Sai (lũy tiến `0,1 - 0,25 - 0,5 - 1,0` hoặc chia đều), số câu theo từng cấp độ nhận thức (*Biết – Hiểu – Vận dụng*).
3. **Bước 3 – Tạo Ma trận đề (Mẫu Phụ lục 1 – CV 7991):**
   - Tự động phân bổ câu hỏi theo trọng số tiết học và cho phép chỉnh sửa trực tiếp từng ô trong Ma trận.
4. **Bước 4 – Tạo Bản đặc tả đề (Mẫu Phụ lục 2 – CV 7991):**
   - Tự động ánh xạ Yêu cầu cần đạt, Mã hóa năng lực đặc thù và vị trí câu hỏi tương ứng.
5. **Bước 5 – Tạo Đề kiểm tra & Hướng dẫn chấm:**
   - Sinh đề tự động từ **Ngân hàng hơn 500 câu hỏi chuẩn SGK & Sách Ôn Tập Huấn CNNN**, cho phép sửa trực tiếp từng câu, **Trộn mã đề** và **Xuất trọn bộ Hồ sơ ra file Word (`.doc`)** hoặc **In PDF**.
6. **Bước 6 – Gọi Tool AI Kiểm định Đề:**
   - Tự động chấm điểm chất lượng hồ sơ đề (thang 100), đối soát 6 tiêu chí kỹ thuật của Công văn 7991 kèm tính năng **Sửa lỗi tự động** và **Thẩm định chuyên sâu bằng Gemini AI**.

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
congnghenongnghiep/
├── index.html                        # Giao diện chính của ứng dụng (hỗ trợ chạy trực tiếp & GitHub Pages)
├── styles.css                        # Giao diện chuẩn sư phạm & định dạng in ấn A4 / Word
├── data.js                           # Khung dữ liệu PPCT & Ngân hàng câu hỏi nền tảng
├── corpus_bank.js                    # Kho ngữ liệu 50 bài Sách Giáo Viên, 12 gói PPCT & 442 câu hỏi Sách Ôn
├── app.js                            # Bộ máy xử lý 6 bước, xuất file Word (.doc) & Kiểm định AI
├── app/                              # Bản sao ứng dụng kèm local server (server.js)
├── corpus/                           # Toàn bộ ngữ liệu văn bản trích xuất từ SGV Word, PPCT PL1 & Tập huấn
├── .agents/skills/soan-de-cv7991/    # Bộ Skill AI đa tầng chuẩn Công văn 7991/BGDĐT-GDTrH
│   ├── SKILL.md
│   ├── references/
│   ├── examples/
│   └── resources/
└── de-thi-giua-ki-1-cong-nghe-10-cv7991.md
```

---

## 💻 Cách Chạy Local

```bash
node app/server.js
# Mở trình duyệt tại: http://localhost:8080
```
Hoặc mở trực tiếp tệp `index.html` trên trình duyệt.
