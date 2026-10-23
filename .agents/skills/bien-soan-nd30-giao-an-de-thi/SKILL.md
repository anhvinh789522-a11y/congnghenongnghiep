---
name: bien-soan-nd30-giao-an-de-thi
description: >-
  Kỹ năng biên soạn, định dạng và xuất bản tài liệu giáo dục (Kế hoạch bài dạy CV 5512,
  Hồ sơ đề kiểm tra định kỳ CV 7991, Ngân hàng đề HSG) chuẩn thể thức văn bản hành chính
  theo Nghị định số 30/2020/NĐ-CP (thường gọi là TT 30/NĐ 30 về văn thư - hành chính).
  Đảm bảo căn lề A4 (20-20-30-15mm), phông Times New Roman 13-14pt, giãn dòng 1.2-1.3 lines,
  giãn đoạn 6pt, tách trang thông minh chống vỡ cấu trúc câu hỏi và bảng biểu khi in hoặc xuất Word/PDF.
---

# Kỹ Năng Biên Soạn & Trình Bày Văn Bản Hành Chính Giáo Dục Chuẩn Nghị Định 30/2020/NĐ-CP, CV 5512 & CV 7991

Skill này định nghĩa và áp dụng quy chuẩn kỹ thuật trình bày văn bản hành chính theo **Nghị định số 30/2020/NĐ-CP** ngày 05/3/2020 của Chính phủ về công tác văn thư, tích hợp đồng bộ với chuẩn văn bản của Bộ GD&ĐT:
- **Công văn số 5512/BGDĐT-GDTrH** (Kế hoạch giáo dục và Kế hoạch bài dạy - Giáo án).
- **Công văn số 7991/BGDĐT-GDTrH** (Hồ sơ đề kiểm tra định kỳ gồm Ma trận, Bản đặc tả, Đề thi và Hướng dẫn chấm).

---

## 1. Quy Chuẩn Kỹ Thuật Trình Bày Văn Bản (Nghị Định 30/2020/NĐ-CP)

### 1.1. Khổ Giấy & Căn Lề Trang In (A4 Margins)
* **Khổ giấy:** A4 tiêu chuẩn ($210\text{ mm} \times 297\text{ mm}$), định hướng đứng (*Portrait*).
* **Căn lề bắt buộc (Quy định tại Mục 1 Phụ lục I - NĐ 30/2020/NĐ-CP):**
  * **Lề trên (Top):** $20\text{ mm} - 25\text{ mm}$ (Chuẩn chọn: **$20\text{ mm}$**).
  * **Lề dưới (Bottom):** $20\text{ mm} - 25\text{ mm}$ (Chuẩn chọn: **$20\text{ mm}$**).
  * **Lề trái (Left):** $30\text{ mm} - 35\text{ mm}$ (Chuẩn chọn: **$30\text{ mm}$** để chừa gáy đóng ghim, đóng sổ hồ sơ chuyên môn).
  * **Lề phải (Right):** $15\text{ mm} - 20\text{ mm}$ (Chuẩn chọn: **$15\text{ mm}$**).

```css
@page WordSection1 {
  size: 210mm 297mm;
  margin: 20mm 15mm 20mm 30mm; /* Top Right Bottom Left */
  mso-header-margin: 15mm;
  mso-footer-margin: 15mm;
  mso-paper-source: 0;
}
div.WordSection1 {
  page: WordSection1;
}
```

### 1.2. Phông Chữ & Cỡ Chữ (Typography)
* **Phông chữ:** `Times New Roman` (bộ mã ký tự Unicode TCVN 6909:2001), màu đen `#000000`.
* **Cỡ chữ theo từng thành phần:**
  * **Nội dung văn bản thông thường:** Cỡ **$13\text{pt}$** hoặc **$14\text{pt}$** (đứng, thường).
  * **Tiêu đề mục lớn (I, II, III, PHẦN I...):** Cỡ **$13\text{pt} - 14\text{pt}$** (đứng, in hoa, đậm).
  * **Tiêu đề mục con (1, 2, a, b...):** Cỡ **$13\text{pt} - 14\text{pt}$** (đứng, đậm).
  * **Bảng biểu (Ma trận, Bản đặc tả, Phiếu học tập, Rubric):** Cỡ **$11\text{pt} - 12\text{pt}$** để trình bày gọn gàng, không bị tràn dòng.
  * **Ghi chú, nguồn, hướng dẫn coi thi:** Cỡ **$10\text{pt} - 11\text{pt}$** (nghiêng).

### 1.3. Giãn Dòng & Giãn Đoạn (Spacing)
* **Giãn dòng (*Line Spacing*):** Từ **$1.2$** đến **$1.3\text{ lines}$** (`line-height: 1.25 - 1.35`). Tuyệt đối không dùng Single quá dính hoặc 1.5 lines quá loãng.
* **Giãn đoạn (*Paragraph Spacing*):**
  * Spacing Before (cách đoạn trên): $0\text{pt} - 3\text{pt}$.
  * Spacing After (cách đoạn dưới): tối thiểu $4\text{pt} - 6\text{pt}$ để mắt đọc thoáng, rõ từng lệnh hỏi.
* **Thụt lề đầu dòng (*First Line Indent*):** $1.0\text{ cm} - 1.27\text{ cm}$ đối với các đoạn văn xuôi, phân tích, lập luận.
* **Căn lề văn bản:** Căn đều hai bên (*Justify*).

---

## 2. Quy Tắc Tách Trang & Kiểm Soát Ngắt Trang (Page-break & Pagination)

Một văn bản giáo án hoặc đề thi đạt chuẩn công chức - sư phạm **tuyệt đối không được gãy vỡ nội dung qua trang**:

### 2.1. Tách Trang Độc Lập Giữa Các Phần Lớn (`page-break-before: always`)
1. **Trong Hồ sơ Đề kiểm tra định kỳ (CV 7991):**
   * *Trang 1 trở đi:* Ma trận đề (Phụ lục 1).
   * *Sang trang mới:* Bản đặc tả đề (Phụ lục 2).
   * *Sang trang mới:* Đề kiểm tra chính thức phát cho học sinh làm bài.
   * *Sang trang mới:* Hướng dẫn chấm, Thang điểm và Lời giải chi tiết dành cho Giám khảo.
2. **Trong Kế hoạch Bài dạy (Giáo án CV 5512):**
   * Tiến trình 4 hoạt động liên tục.
   * *Sang trang mới:* Phụ lục Hồ sơ dạy học (Phiếu học tập số 1, 2, Rubric đánh giá, Bảng kiểm).

### 2.2. Chống Cắt Đôi Câu Hỏi & Bảng Biểu (`page-break-inside: avoid`)
* **Đối với Câu hỏi Trắc nghiệm nhiều lựa chọn (MCQ):** Cả phần thân câu (*stem*) và 4 phương án $A, B, C, D$ **phải nằm trọn vẹn trong một trang**, không được để thân câu ở cuối trang 1 còn đáp án rơi sang đầu trang 2.
* **Đối với Câu trắc nghiệm Đúng/Sai (TF):** Đoạn dẫn thông tin và 4 lệnh hỏi $a), b), c), d)$ phải đi liền khối.
* **Đối với Bảng biểu (*Tables*):**
  * Dòng tiêu đề bảng (`thead`) phải tự động lặp lại ở đầu trang tiếp theo: `thead { display: table-header-group; }`.
  * Từng hàng dữ liệu (`tr`) không bị cắt ngang giữa dòng chữ: `tr { page-break-inside: avoid; }`.
* **Tránh dòng mồ côi (*Widow & Orphan control*):** Tiêu đề mục không bao giờ đứng cô độc ở đáy trang (`h1, h2, h3, h4, .sec-title { page-break-after: avoid; }`).

---

## 3. Khung Thể Thức Tiêu Đề Đầu Trang (Header Format)

### 3.1. Đối Với Đề Kiểm Tra Định Kỳ (CV 7991)
Bố cục bảng 2 cột không đường viền (`border: none`):
```html
<table style="width:100%; border:none; margin-bottom:12pt;">
  <tr>
    <td style="border:none; text-align:center; width:45%; vertical-align:top; font-size:12pt;">
      <strong>SỞ GIÁO DỤC VÀ ĐÀO TẠO ...</strong><br/>
      <strong>TRƯỜNG THPT ...</strong><br/>
      <strong>TỔ: CÔNG NGHỆ</strong><br/>
      <div style="width:120px; border-bottom:1px solid #000; margin:3pt auto 6pt auto;"></div>
      <div style="border:1px solid #000; padding:4pt 6pt; text-align:left; font-size:11pt; line-height:1.5;">
        Họ và tên: ....................................................<br/>
        Lớp: ................. SBD: ................. Mã đề: <strong>...</strong>
      </div>
    </td>
    <td style="border:none; text-align:center; width:55%; vertical-align:top;">
      <strong style="font-size:13pt;">KIỂM TRA ĐỊNH KỲ HỌC KỲ I - NĂM HỌC 20... - 20...</strong><br/>
      <strong style="font-size:13pt;">BÀI KIỂM TRA MÔN: CÔNG NGHỆ ...</strong><br/>
      <em style="font-size:12pt;">Thời gian làm bài: 45 phút (không kể thời gian phát đề)</em><br/>
      <div style="width:180px; border-bottom:1px solid #000; margin:4pt auto 8pt auto;"></div>
      <table style="width:100%; border-collapse:collapse; margin-top:4pt;">
        <tr>
          <td style="border:1px solid #000; width:40%; text-align:center; font-size:11pt;"><strong>ĐIỂM</strong></td>
          <td style="border:1px solid #000; width:60%; text-align:center; font-size:11pt;"><strong>NHẬN XÉT CỦA GIÁO VIÊN</strong></td>
        </tr>
        <tr style="height:48px;">
          <td style="border:1px solid #000;">&nbsp;</td>
          <td style="border:1px solid #000;">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

### 3.2. Đối Với Kế Hoạch Bài Dạy (Giáo Án CV 5512)
Bố cục bảng 2 cột chuẩn văn bản hành chính Việt Nam:
- **Cột trái:** TÊN TRƯỜNG / TỔ CHUYÊN MÔN (In hoa, đứng, 12pt).
- **Cột phải:** QUỐC HIỆU (In hoa, đứng, đậm, 12pt) và TIÊU NGỮ (In thường, đứng, đậm, 13pt), kèm đường gạch ngang nét liền dưới tiêu ngữ có độ dài bằng tiêu ngữ.
- **Tiêu đề Giáo án:** `KẾ HOẠCH BÀI DẠY (GIÁO ÁN)` (14pt, In hoa, đậm, căn giữa) -> `TÊN BÀI HỌC` (15-16pt, In hoa, đậm) -> Thông tin lớp, số tiết, tuần dạy.
- **Cuối giáo án:** Bảng chữ ký 2 cột gồm Tổ trưởng chuyên môn phê duyệt và Giáo viên soạn bài.

---

## 4. Chuẩn Hóa Mã Nguồn & Tích Hợp Vào Hệ Thống
Khi sinh mã HTML hoặc file Word (`.doc`/`.docx`):
1. Đảm bảo nhúng cấu hình Word XML Namespace: `xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'`.
2. Định nghĩa khối `@page WordSection1` với lề $20\text{mm} \times 15\text{mm} \times 20\text{mm} \times 30\text{mm}$.
3. Toàn bộ nội dung bọc trong `<div class="WordSection1">...</div>`.
4. Mọi câu hỏi trắc nghiệm bọc trong `<div class="question-item" style="page-break-inside: avoid; break-inside: avoid; margin-bottom: 8pt;">...</div>`.
5. Nút In (`window.print()`) kích hoạt bộ lọc CSS `@media print` với chuẩn tương đương.
