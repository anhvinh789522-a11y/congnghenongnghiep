[System.Reflection.Assembly]::LoadWithPartialName("System.IO.Compression.FileSystem") | Out-Null

function GetDocxRows($path) {
    if (-not (Test-Path $path)) { return @() }
    $zip = [System.IO.Compression.ZipFile]::OpenRead($path)
    $entry = $zip.GetEntry("word/document.xml")
    $reader = New-Object System.IO.StreamReader($entry.Open())
    $xml = [xml]$reader.ReadToEnd()
    $reader.Close()
    $zip.Dispose()
    $nsmgr = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
    $nsmgr.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
    $rows = $xml.SelectNodes("//w:tr", $nsmgr)
    $res = @()
    foreach ($r in $rows) {
        $cells = $r.SelectNodes(".//w:tc", $nsmgr)
        $cTexts = @()
        foreach ($c in $cells) {
            $tNodes = $c.SelectNodes(".//w:t", $nsmgr)
            $text = ($tNodes | ForEach-Object { $_.InnerText }) -join ""
            $cTexts += $text.Trim()
        }
        if ($cTexts.Count -gt 0) { $res += ,$cTexts }
    }
    return $res
}

# 1. Parse PL1 text for YCCD K10 and K12
$pl1Lines = Get-Content -Path "D:\congnghenongnghiep\corpus\PL1_Cong_nghe_10_va_12_theo_mau_CV5512 (nộp).txt" -Encoding UTF8
$k10YccdMap = @{}
$k12YccdMap = @{}

for ($i = 56; $i -le 101; $i++) {
    $l = $pl1Lines[$i]
    if ($l -match '^\|\s*(\d+)\s*\|\s*([^|]+)\|\s*(\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)') {
        $stt = $matches[1].Trim()
        $k10YccdMap[$stt] = @{
            title = $matches[2].Trim()
            yccd = $matches[4].Trim().Replace(" ; ", "`n- ")
            nls = $matches[5].Trim()
            ai = $matches[6].Trim()
        }
    }
}

for ($i = 108; $i -le 155; $i++) {
    $l = $pl1Lines[$i]
    if ($l -match '^\|\s*(\d+)\s*\|\s*([^|]+)\|\s*(\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)') {
        $stt = $matches[1].Trim()
        $k12YccdMap[$stt] = @{
            title = $matches[2].Trim()
            yccd = $matches[4].Trim().Replace(" ; ", "`n- ")
            nls = $matches[5].Trim()
            ai = $matches[6].Trim()
        }
    }
}

# 2. Parse K11 YCCD from PL1 K11 docx
$k11Pl1Rows = GetDocxRows("D:\01_DẠY HỌC\001_TRƯỜNG\DAY HOC\GIÁO ÁN CÔNG NGHỆ\GIÁO ÁN CÔNG NGHỆ NN - K11-NLS-AI\PL1 - CÔNG NGHỆ CHĂN NUÔI 11 (KNTT) - TÍCH HỢP NLS-AI.docx")
$k11YccdMap = @{}
foreach ($r in $k11Pl1Rows) {
    if ($r.Count -ge 6 -and $r[0] -match '^\d+$') {
        $stt = $r[0].Trim()
        $k11YccdMap[$stt] = @{
            title = $r[1].Trim()
            yccd = $r[3].Trim()
            nls = $r[4].Trim()
            ai = $r[5].Trim()
        }
    }
}

# 3. Parse K10 PL3
$k10Rows = GetDocxRows("D:\01_DẠY HỌC\001_TRƯỜNG\2026 2027 phân phối gửi chi xuân\PL3_Khoi10_Trong_trot_da_chinh_theo_PL1.docx")
$k10Curriculum = @()
$curChapter = ""
foreach ($r in $k10Rows) {
    if ($r.Count -ge 2 -and $r[0] -match '^CHƯƠNG') { $curChapter = $r[0].Trim() }
    if ($r.Count -ge 6 -and $r[0] -match '^\d+$') {
        $stt = $r[0].Trim()
        $title = $r[1].Trim()
        $p = $r[2].Trim()
        $w = $r[3].Trim()
        $eq = $r[4].Trim()
        $rm = $r[5].Trim()
        $nls = if ($r.Count -ge 7) { $r[6].Trim() } else { "" }
        $ai = if ($r.Count -ge 8) { $r[7].Trim() } else { "" }
        $yccd = ""
        if ($k10YccdMap.ContainsKey($stt)) {
            $yccd = $k10YccdMap[$stt].yccd
            if (-not $nls) { $nls = $k10YccdMap[$stt].nls }
            if (-not $ai) { $ai = $k10YccdMap[$stt].ai }
        }
        $lesNum = $null
        if ($title -match 'Bài\s*(\d+)') { $lesNum = [int]$matches[1] }
        $isExam = $title -match 'Kiểm tra' -or $title -match 'Ôn tập' -or $title -match 'Trả bài'
        $isSteam = $title -match 'STEAM' -or $title -match '\(\*\)'
        
        $k10Curriculum += [PSCustomObject]@{
            stt = [int]$stt
            lessonNum = $lesNum
            title = $title
            chapter = $curChapter
            periods = if ($p -match '\d+') { [int]$matches[0] } else { 1 }
            week = $w
            equipment = $eq
            room = $rm
            yccd = $yccd
            nls = $nls
            ai = $ai
            isExam = $isExam
            isSteam = $isSteam
            term = if ([int]$stt -le 19) { "Học kì I" } else { "Học kì II" }
            driveLink = "https://drive.google.com/drive/folders/1CN10_Bai_" + $(if ($lesNum) { $lesNum } else { $stt })
        }
    }
}

# 4. Parse K11 PL3
$k11Rows = GetDocxRows("D:\01_DẠY HỌC\001_TRƯỜNG\DAY HOC\HS GIÁO ÁN UP VNEDU\26 -27 Phan phoi da chinh của Nam- Thuy\11_PL3_Cong_nghe_11_Chan_nuoi_hoan_thien.docx")
$k11Curriculum = @()
$curChapter = ""
foreach ($r in $k11Rows) {
    if ($r.Count -ge 2 -and $r[0] -match '^CHƯƠNG') { $curChapter = $r[0].Trim() }
    if ($r.Count -ge 6 -and $r[0] -match '^\d+$') {
        $stt = $r[0].Trim()
        $title = $r[1].Trim()
        $p = $r[2].Trim()
        $w = $r[3].Trim()
        $eq = $r[4].Trim()
        $rm = $r[5].Trim()
        $nls = if ($r.Count -ge 7) { $r[6].Trim() } else { "" }
        $ai = if ($r.Count -ge 8) { $r[7].Trim() } else { "" }
        $yccd = ""
        if ($k11YccdMap.ContainsKey($stt)) {
            $yccd = $k11YccdMap[$stt].yccd
            if (-not $nls) { $nls = $k11YccdMap[$stt].nls }
            if (-not $ai) { $ai = $k11YccdMap[$stt].ai }
        }
        $lesNum = $null
        if ($title -match 'Bài\s*(\d+)') { $lesNum = [int]$matches[1] }
        $isExam = $title -match 'Kiểm tra' -or $title -match 'Ôn tập' -or $title -match 'Trả bài'
        $isSteam = $title -match 'STEAM' -or $title -match '\(\*\)'

        $k11Curriculum += [PSCustomObject]@{
            stt = [int]$stt
            lessonNum = $lesNum
            title = $title
            chapter = $curChapter
            periods = if ($p -match '\d+') { [int]$matches[0] } else { 1 }
            week = $w
            equipment = $eq
            room = $rm
            yccd = $yccd
            nls = $nls
            ai = $ai
            isExam = $isExam
            isSteam = $isSteam
            term = if ([int]$stt -le 16) { "Học kì I" } else { "Học kì II" }
            driveLink = "https://drive.google.com/drive/folders/1CN11_Bai_" + $(if ($lesNum) { $lesNum } else { $stt })
        }
    }
}

# 5. Parse K12 PL3
$k12Rows = GetDocxRows("D:\01_DẠY HỌC\001_TRƯỜNG\2026 2027 phân phối gửi chi xuân\PL3_Cong_nghe_12_LN-TS_da_chinh_theo_PL1.docx")
$k12Curriculum = @()
$curChapter = ""
$k12SttCounter = 1
foreach ($r in $k12Rows) {
    if ($r.Count -ge 2 -and ($r[0] -match '^CHƯƠNG' -or $r[0] -match '^Chương')) { $curChapter = $r[0].Trim() }
    
    # either digit STT or exam/review row
    $isItem = $false
    $sttVal = ""
    $titleVal = ""
    $pVal = ""
    $wVal = ""
    $eqVal = ""
    $rmVal = ""
    $nlsVal = ""
    $aiVal = ""

    if ($r.Count -ge 6 -and $r[0] -match '^\d+$') {
        $isItem = $true
        $sttVal = $r[0].Trim()
        $titleVal = $r[1].Trim()
        $pVal = $r[2].Trim()
        $wVal = $r[3].Trim()
        $eqVal = $r[4].Trim()
        $rmVal = $r[5].Trim()
        if ($r.Count -ge 7) { $nlsVal = $r[6].Trim() }
        if ($r.Count -ge 8) { $aiVal = $r[7].Trim() }
    } elseif ($r.Count -ge 5 -and ($r[1] -match 'Ôn tập' -or $r[1] -match 'Kiểm tra' -or $r[1] -match 'Trả bài')) {
        $isItem = $true
        $sttVal = [string]$k12SttCounter
        $titleVal = $r[1].Trim()
        $pVal = $r[2].Trim()
        $wVal = if ($r.Count -ge 4) { $r[3].Trim() } else { "" }
        $eqVal = if ($r.Count -ge 5) { $r[4].Trim() } else { "" }
        $rmVal = if ($r.Count -ge 6) { $r[5].Trim() } else { "Lớp học" }
    }

    if ($isItem) {
        $k12SttCounter++
        $yccd = ""
        if ($k12YccdMap.ContainsKey($sttVal)) {
            $yccd = $k12YccdMap[$sttVal].yccd
            if (-not $nlsVal) { $nlsVal = $k12YccdMap[$sttVal].nls }
            if (-not $aiVal) { $aiVal = $k12YccdMap[$sttVal].ai }
        }
        $lesNum = $null
        if ($titleVal -match 'Bài\s*(\d+)') { $lesNum = [int]$matches[1] }
        $isExam = $titleVal -match 'Kiểm tra' -or $titleVal -match 'Ôn tập' -or $titleVal -match 'Trả bài'
        $isSteam = $titleVal -match 'STEAM' -or $titleVal -match '\(\*\)'

        $k12Curriculum += [PSCustomObject]@{
            stt = [int]$sttVal
            lessonNum = $lesNum
            title = $titleVal
            chapter = $curChapter
            periods = if ($pVal -match '\d+') { [int]$matches[0] } else { 1 }
            week = $wVal
            equipment = $eqVal
            room = $rmVal
            yccd = $yccd
            nls = $nlsVal
            ai = $aiVal
            isExam = $isExam
            isSteam = $isSteam
            term = if ([int]$sttVal -le 17) { "Học kì I" } else { "Học kì II" }
            driveLink = "https://drive.google.com/drive/folders/1CN12_Bai_" + $(if ($lesNum) { $lesNum } else { $sttVal })
        }
    }
}

# 6. Parse 13 Chuyen de K12
$cd12List = @(
    @{ stt=1; lessonNum=1; title="Bài 1. Bài mở đầu"; periods=2; week="Tuần 1-2"; yccd="Trình bày khái niệm, vai trò, thành tựu; đánh giá triển vọng CNSH trong lâm nghiệp và thủy sản; ý thức an toàn lao động và đạo đức nghề nghiệp."; nls="1.1.NC1b: Tra cứu, chọn lọc thông tin về CNSH và vai trò với lâm nghiệp, thuỷ sản."; ai="12.C2.1: Lựa chọn 1 ý tưởng dùng công cụ AI hỗ trợ học chuyên đề và nêu cách kiểm chứng kết quả bằng tài liệu."; equipment="Tài liệu chuyên đề, laptop, tivi, kết nối Internet"; room="Lớp học" },
    @{ stt=2; lessonNum=2; title="Bài 2. Công nghệ sinh học trong chọn, tạo và nhân giống cây lâm nghiệp"; periods=3; week="Tuần 3-5"; yccd="Phân tích hướng ứng dụng trong chọn, tạo giống (chỉ thị phân tử, chuyển gene, đa bội hoá); phân tích hướng ứng dụng trong nhân giống (nuôi cấy mô tế bào thực vật)."; nls="1.2.NC1b: Đối chiếu thông tin về nuôi cấy mô tế bào giữa tài liệu chuyên đề và bài trên internet."; ai="12.D2.1: Nhận biết các vai trò khi xây dựng phần mềm AI hỗ trợ chọn giống cây lâm nghiệp."; equipment="Tài liệu chuyên đề, mẫu cây mô, máy tính, tivi"; room="Lớp học / Phòng thực hành" },
    @{ stt=3; lessonNum=3; title="Bài 3. Công nghệ sinh học trong sản xuất chế phẩm vi sinh phục vụ lâm nghiệp"; periods=3; week="Tuần 6-8"; yccd="Hiểu vai trò chế phẩm phân huỷ vật liệu cháy dưới tán rừng thông; trình bày sản xuất MF1, MF2; đề xuất quy trình sử dụng phù hợp địa phương."; nls="1.1.NC1b: Tìm kiếm, chọn lọc thông tin về chế phẩm vi sinh dùng trong lâm nghiệp."; ai="12.C3.2: Nêu ví dụ đánh giá hiệu quả phần mềm AI nhận diện mẻ chế phẩm đạt hay hỏng qua ảnh."; equipment="Mẫu chế phẩm vi sinh, tài liệu, video quy trình"; room="Lớp học" },
    @{ stt=4; lessonNum=4; title="Bài 4. Ứng dụng mã vạch DNA trong lâm nghiệp"; periods=2; week="Tuần 9-10"; yccd="Phân tích ứng dụng (định danh cây, giám định sản phẩm, kiểm soát tác nhân gây hại cây rừng)."; nls="3.2.NC1a: Ghép thông tin mã vạch DNA với thông tin tra cứu về loài cây gỗ quý để tạo bảng so sánh."; ai="12.B3.1: Trình bày trách nhiệm của đơn vị xây dựng CSDL mã vạch DNA/phần mềm."; equipment="Sơ đồ mã vạch DNA, laptop, máy chiếu"; room="Lớp học" },
    @{ stt=5; lessonNum=5; title="Bài 5. Vai trò và triển vọng của công nghệ sinh học trong thủy sản"; periods=3; week="Tuần 11-13"; yccd="Trình bày khái niệm, vai trò, thành tựu; đánh giá triển vọng CNSH trong thuỷ sản."; nls="1.1.NC1b: Tìm, chọn lọc thông tin về xu hướng ứng dụng CNSH trong thuỷ sản."; ai="12.A2.1: Trình bày 2 nguyên tắc đạo đức khi đưa AI hỗ trợ CNSH nuôi thuỷ sản: an toàn và trách nhiệm."; equipment="Tài liệu chuyên đề, hình ảnh các mô hình CNSH thủy sản"; room="Lớp học" },
    @{ stt=6; lessonNum=6; title="Bài 6. Một số ứng dụng công nghệ sinh học trong chọn, tạo giống thủy sản"; periods=3; week="Tuần 14-16"; yccd="Phân tích hướng ứng dụng CNSH trong chọn, tạo giống thuỷ sản (chỉ thị phân tử, đa bội thể, chuyển gen)."; nls="1.3.NC1b: Lập bảng (kĩ thuật - cách thực hiện - ưu điểm - loài ứng dụng) trong ghi chú/bảng tính."; ai="12.D1.1: Nhận biết 2 phương án hệ thống AI chọn cá, tôm bố mẹ và chỉ ra phương án phù hợp."; equipment="Tài liệu, sơ đồ chọn tạo giống, laptop"; room="Lớp học" },
    @{ stt=7; lessonNum=7; title="Bài 7. Ứng dụng công nghệ sinh học trong sản xuất giống thủy sản"; periods=3; week="Tuần 17-19"; yccd="Phân tích hướng ứng dụng CNSH trong sản xuất giống thuỷ sản; quy trình kích thích sinh sản nhân tạo."; nls="3.1.NC1a: Tạo sản phẩm số 2 định dạng: ảnh chụp sơ đồ quy trình sản xuất giống kèm chữ chú thích."; ai="12.A1.2: Phân tích các bước quyết định trong sản xuất giống: việc của AI và việc của con người."; equipment="Tài liệu, video quy trình sản xuất giống, tivi"; room="Lớp học" },
    @{ stt=8; lessonNum=8; title="Bài 8. Ứng dụng công nghệ sinh học trong phòng, trị bệnh thủy sản"; periods=3; week="Tuần 20-22"; yccd="Trình bày ứng dụng CNSH trong chẩn đoán (kit PCR, kháng thể đơn dòng), sản xuất vaccine và chế phẩm vi sinh phòng bệnh."; nls="1.2.NC1a: Đánh giá độ tin cậy của 2 nguồn về biện pháp phòng bệnh bằng CNSH."; ai="12.B2.1: Xác định mức độ rủi ro khi tin hoàn toàn AI gợi ý vaccine/chế phẩm và việc phải làm."; equipment="Mẫu kit thử PCR mô phỏng, tài liệu thú y thủy sản"; room="Lớp học" },
    @{ stt=9; lessonNum=9; title="Bài 9. Ứng dụng công nghệ sinh học trong quản lí môi trường nước nuôi thủy sản"; periods=3; week="Tuần 23-25"; yccd="Trình bày/phân tích ứng dụng CNSH trong quản lí môi trường nước nuôi thuỷ sản (men vi sinh đáy, vi sinh xử lí khí độc NH3, NO2, H2S)."; nls="1.3.NC1a: Ghi số liệu pH, oxygen, ammonia trước và sau xử lí bằng chế phẩm sinh học vào bảng tính."; ai="12.C4.MR1: Tổ chức số liệu quan trắc thành bảng đủ ao - chỉ tiêu - trị số - thời điểm; giải thích sai số."; equipment="Bộ test kit nước, mẫu chế phẩm sinh học, bảng tính"; room="Lớp học / Phòng thực hành" },
    @{ stt=10; lessonNum=10; title="Bài 10. Giới thiệu chung về cá cảnh"; periods=2; week="Tuần 26-27"; yccd="Trình bày đặc điểm sinh học và yêu cầu ngoại cảnh một số loài cá cảnh phổ biến (cá vàng, bảy màu, đĩa, rồng, la hán)."; nls="1.1.NC1b: Tra cứu thông tin một số loài cá cảnh phổ biến; ghi tên loài, màu sắc, tập tính vào phiếu."; ai="12.C3.1: Nêu tên công cụ miễn phí dạy máy nhận dạng loài cá cảnh qua ảnh mẫu (Teachable Machine)."; equipment="Tranh ảnh phóng to, video các loài cá cảnh, tài liệu"; room="Lớp học" },
    @{ stt=11; lessonNum=11; title="Bài 11. Nuôi dưỡng và chăm sóc cá cảnh nước ngọt"; periods=3; week="Tuần 28-30"; yccd="Mô tả quy trình nuôi, chăm sóc, phòng trị bệnh cá nước ngọt; lựa chọn thức ăn phù hợp."; nls="1.3.NC1a: Ghi nhật kí chăm sóc bể cá nước ngọt (ngày - nhiệt độ - pH - thức ăn - tình trạng cá) vào bảng."; ai="12.C2.1: Lựa chọn ý tưởng công cụ AI theo dõi bể cá cảnh (theo dõi yếu tố nào, báo cho ai, báo bằng cách nào)."; equipment="Bể cá cảnh mẫu, dụng cụ đo nhiệt độ, pH, thức ăn cá"; room="Lớp học / Phòng thực hành" },
    @{ stt=12; lessonNum=12; title="Bài 12. Nuôi dưỡng và chăm sóc cá cảnh nước mặn"; periods=3; week="Tuần 31-33"; yccd="Mô tả quy trình nuôi, chăm sóc, phòng trị bệnh cá nước mặn; lựa chọn thức ăn phù hợp; hệ thống lọc nước biển nhân tạo."; nls="1.2.NC1a: Đánh giá độ tin cậy 2 nguồn về chăm sóc cá nước mặn (tác giả, số liệu, khớp tài liệu chuyên đề)."; ai="12.A1.1: Phân tích hệ thống AI giám sát bể cá nước mặn theo 3 bước; chỉ ra ai quyết định và chịu trách nhiệm."; equipment="Bể cá nước mặn (hoặc video mô hình), dụng cụ đo độ mặn refractometer, muối biển"; room="Lớp học" },
    @{ stt=13; lessonNum=13; title="Bài 13. Dự án: nuôi cá cảnh (*) Tích hợp STEAM"; periods=2; week="Tuần 34-35"; yccd="Thu thập thông tin chọn loài cá, dụng cụ thiết bị; lập kế hoạch, dự tính chi phí; thực hiện nuôi dưỡng và báo cáo sản phẩm dự án bể cá mini."; nls="3.1.NC1a: Nhóm chụp ảnh các giai đoạn thực hiện dự án bể cá, tạo infographic báo cáo."; ai="12.C2.MR1: Sử dụng công cụ AI hỗ trợ viết báo cáo dự án, lập kế hoạch chi phí và trình bày ý tưởng."; equipment="Vật liệu làm bể cá, cây thủy sinh, máy sủi khí mini, cá cảnh giống"; room="Phòng thực hành / Góc STEAM" }
)

# 7. STEAM Projects
$steamProjects = @(
    @{
        id = "steam_1"
        grade = "Khối 10"
        lesson = "Bài 6. Thực hành: Xác định độ chua và độ mặn của đất"
        week = "Tuần 6, tiết 11-12"
        product = "Bản đồ chất lượng đất vườn trường & Áp phích infographic khuyến nghị cải tạo đất"
        s = "Hiểu ý nghĩa của độ chua (pH), độ mặn (EC) đối với sinh trưởng của cây trồng và hệ vi sinh vật đất."
        t = "Dùng máy đo pH, bút đo EC điện tử; nhập và xử lí dữ liệu bằng bảng tính Google Sheets / Excel."
        e = "Xây dựng quy trình chuẩn lấy mẫu tầng đất mặt - pha loãng dung dịch - đo - ghi số liệu thống nhất giữa các nhóm."
        a = "Thiết kế áp phích trực quan (Canva/infographic) biểu diễn vùng đất chua, mặn và khuyến nghị bón vôi/hữu cơ."
        m = "Tính giá trị trung bình pH/EC, so sánh với ngưỡng thích hợp của cây trồng địa phương, vẽ biểu đồ phân bố."
    },
    @{
        id = "steam_2"
        grade = "Khối 10"
        lesson = "Bài 22. Dự án: Trồng hoa trong chậu"
        week = "Tuần 27, tiết 53-54"
        product = "Chậu hoa do nhóm tự thiết kế, phối trộn giá thể, chăm sóc và Nhật ký theo dõi sinh trưởng số"
        s = "Nhu cầu nước, ánh sáng, dinh dưỡng khoáng và đặc điểm sinh trưởng từng giai đoạn của cây hoa."
        t = "Dụng cụ làm vườn, cảm biến độ ẩm đất Arduino/IoT hoặc ứng dụng thông minh nhắc lịch tưới trên điện thoại."
        e = "Thiết kế chậu trồng từ vật liệu tái chế, bố trí lớp sỏi thoát nước chống úng rễ, phối trộn giá thể xơ dừa - trấu hun - phân trùn quế."
        a = "Bố cục tạo hình, phối màu sắc hoa và hoa văn trang trí chậu hoa thẩm mỹ."
        m = "Lập bảng dự toán chi phí giống, giá thể, phân bón; đo chiều cao cây, đếm số nụ/hoa theo tuần và vẽ biểu đồ tăng trưởng."
    },
    @{
        id = "steam_3"
        grade = "Khối 10"
        lesson = "Bài 25. Công nghệ trồng cây không dùng đất"
        week = "Tuần 30-31, tiết 59-61"
        product = "Mô hình thủy canh tĩnh / hồi lưu mini từ chai nhựa, ống PVC tái chế & Bản thuyết minh kỹ thuật"
        s = "Cơ chế hấp thụ ion khoáng hòa tan và nhu cầu oxygen ở vùng rễ của cây trồng không dùng đất."
        t = "Bút đo TDS (ppm), máy đo pH dung dịch dinh dưỡng; bơm sục khí mini hồ cá."
        e = "Thiết kế giá đỡ, khoan khoét rọ nhựa, lắp đặt đường ống dẫn dung dịch thủy canh tuần hoàn khép kín."
        a = "Tạo hình giàn thủy canh nhỏ gọn, thẩm mỹ phù hợp ban công lớp học hoặc gia đình."
        m = "Tính toán thể tích dung dịch (lít), pha chế nồng độ ppm dung dịch dinh dưỡng theo công thức Hoagland, tính giá thành rau sạch."
    },
    @{
        id = "steam_4"
        grade = "Khối 12"
        lesson = "Bài 11. Quản lí môi trường nuôi thuỷ sản"
        week = "Tuần 14-15, tiết 27-29"
        product = "Hệ thống bảng biểu và biểu đồ số theo dõi pH, DO, nhiệt độ & Quy trình cảnh báo sớm sốc môi trường"
        s = "Biến thiên chu kì ngày đêm của pH và oxygen hòa tan (DO); tác động của nhiệt độ đến chuyển hóa của cá, tôm."
        t = "Bộ test kit Sera, máy đo DO điện tử; ứng dụng Google Sheets chia sẻ dữ liệu nhóm theo thời gian thực."
        e = "Thiết kế quy trình lấy mẫu tầng nước mặt và tầng đáy; phương án sục khí cấp cứu khi DO giảm dưới 3 mg/L."
        a = "Thiết kế bảng dashboard trực quan biểu diễn ngưỡng an toàn (xanh), cảnh báo (vàng), nguy hiểm (đỏ)."
        m = "Tính tốc độ tiêu thụ oxy, phân tích tương quan nhiệt độ - pH, dự báo thời điểm nước thiếu dưỡng khí."
    },
    @{
        id = "steam_5"
        grade = "Khối 12"
        lesson = "Bài 21. Một số ứng dụng công nghệ cao trong nuôi thuỷ sản"
        week = "Tuần 27, tiết 53-54"
        product = "Mô hình hệ thống nuôi tuần hoàn nước (RAS) mini với lọc cơ học và lọc sinh học biofilter"
        s = "Chu trình nitơ trong nước (Amonia NH3 -> Nitrite NO2- -> Nitrate NO3- nhờ vi khuẩn Nitrosomonas và Nitrobacter)."
        t = "Máy bơm nước mini 12V, vật liệu lọc hạt Kaldnes/sứ lọc, đèn UV khử trùng."
        e = "Thiết kế cấu trúc 3 ngăn liên hoàn: Bể nuôi -> Ngăn lắng cặn cơ học -> Ngăn lọc sinh học sục khí đảo hạt -> Bể hồi lưu."
        a = "Bố trí đường ống ngầm thẩm mỹ, vẽ sơ đồ nguyên lý hoạt động 3D / Isometric."
        m = "Tính toán lưu lượng tuần hoàn nước Q (lít/giờ), thể tích vật liệu lọc theo mật độ thả nuôi cá giống."
    },
    @{
        id = "steam_6"
        grade = "Khối 12 (Chuyên đề)"
        lesson = "Bài 13. Dự án: Nuôi cá cảnh"
        week = "Tuần 34-35, tiết 34-35"
        product = "Bể thủy sinh cá cảnh nước ngọt mini hoàn chỉnh kèm Báo cáo tài chính & Nhật ký cân bằng sinh thái"
        s = "Cân bằng sinh thái trong hệ kín giữa cá cảnh (thải CO2, phân hữu cơ) và cây thủy sinh (quang hợp tạo O2, hấp thụ nitrate)."
        t = "Hệ thống chiếu sáng LED quang phổ đầy đủ, máy lọc thác treo, bộ đếm bọt CO2."
        e = "Kỹ thuật dán kính bể kính siêu trong, đắp layout đá lũa, trải phân nền thủy sinh công nghiệp."
        a = "Nghệ thuật sắp đặt phong cách Iwagumi hoặc rừng nhiệt đới, phối màu cá bơi đàn sống động."
        m = "Lập bảng cân đối chi phí đầu tư ban đầu, tiền điện hàng tháng, lượng thức ăn tính theo gram/ngày."
    }
)

# 8. Equipment list for PL1
$equipmentData = @{
    cn10 = @(
        @{ stt=1; name="Máy đo pH đất / dung dịch cầm tay"; qty="02"; useFor="Bài 6 (Thực hành độ chua/mặn), Bài 25 (Thủy canh)"; note="Đã trang bị" },
        @{ stt=2; name="Cân kỹ thuật điện tử 0.01g"; qty="04"; useFor="Bài 6, Bài 10 (Thực hành phân bón), Bài 21"; note="Đã có 04 cái" },
        @{ stt=3; name="Bình tam giác, ống đong, phễu thủy tinh"; qty="08 bộ"; useFor="Bài 6, Bài 10"; note="Đầy đủ" },
        @{ stt=4; name="Hóa chất: Dung dịch KCl 1N, nước cất, BaCl2, AgNO3, diphenylamine"; qty="04 bộ"; useFor="Bài 6, Bài 10"; note="Hóa chất tiêu hao hàng năm" },
        @{ stt=5; name="Dụng cụ: Đèn cồn, kẹp ống nghiệm, thìa inox, đĩa sứ"; qty="06 bộ"; useFor="Bài 10 (Nhận biết phân bón)"; note="Đầy đủ" },
        @{ stt=6; name="Dụng cụ: Kéo cắt cành chuyên dụng, dao mỏ ghép cành, băng nilon tự tiêu"; qty="10 bộ"; useFor="Bài 14 (Thực hành ghép cành cây ăn quả)"; note="Mua mới năm học 2026-2027" },
        @{ stt=7; name="Mô hình / Video công nghệ trồng nấm rơm, trồng rau thủy canh"; qty="01 bộ số"; useFor="Bài 25, Bài 28"; note="Học liệu số tích hợp Web" },
        @{ stt=8; name="Laptop kết nối Tivi thông minh 65 inch có Internet"; qty="04 phòng"; useFor="Tất cả các bài học lý thuyết & ứng dụng AI"; note="Phòng học thông minh" }
    )
    cn11 = @(
        @{ stt=1; name="Tranh ảnh màu, video clip các giống vật nuôi nội và ngoại"; qty="01 bộ số"; useFor="Bài 1, Bài 2, Bài 3, Bài 4"; note="Học liệu số trường" },
        @{ stt=2; name="Dụng cụ thực hành: Mẫu thức ăn tinh, thức ăn thô, thức ăn ủ chua"; qty="04 bộ"; useFor="Bài 8, Bài 9, Bài 10 (Chế biến, bảo quản thức ăn)"; note="Chuẩn bị tại địa phương" },
        @{ stt=3; name="Khuôn bánh, cân đồng hồ, xô chậu, chày nén, chậu nhựa ủ thức ăn"; qty="04 bộ"; useFor="Bài 10, Bài 17"; note="Đầy đủ" },
        @{ stt=4; name="Bộ mẫu vật / Hình ảnh giải phẫu triệu chứng sâu bệnh hại gia súc, gia cầm"; qty="01 bộ"; useFor="Bài 12, Bài 13, Bài 14 (Bệnh ở lợn, gia cầm, trâu bò)"; note="Đã trang bị" },
        @{ stt=5; name="Chế phẩm sinh học đệm lót sinh học (Balasa N01), men ủ vi sinh"; qty="02 gói"; useFor="Bài 21, Bài 22 (Xử lý chất thải chăn nuôi)"; note="Mua mới" },
        @{ stt=6; name="Hệ thống Tivi, máy chiếu, máy tính kết nối Internet tốc độ cao"; qty="04 phòng"; useFor="22 bài học lý thuyết và trình chiếu AI"; note="Phòng học tiêu chuẩn" }
    )
    cn12 = @(
        @{ stt=1; name="Máy đo độ mặn (khúc xạ kế / bút đo điện tử)"; qty="02"; useFor="Bài 11, Bài 12 (Quản lý môi trường thủy sản)"; note="Đã có" },
        @{ stt=2; name="Máy đo pH và oxygen hòa tan (DO) cầm tay"; qty="02"; useFor="Bài 10, Bài 11"; note="Đã có" },
        @{ stt=3; name="Dụng cụ lấy mẫu nước tầng mặt và tầng đáy ao"; qty="04 bộ"; useFor="Bài 11, Bài 13"; note="Đầy đủ" },
        @{ stt=4; name="Dụng cụ: Kéo cắt tỉa, máy sấy mini, khay phơi, gia vị chế biến chả cá"; qty="04 bộ"; useFor="Bài 17, Bài 22 (Bảo quản, chế biến sản phẩm thủy sản)"; note="Đã trang bị" },
        @{ stt=5; name="Bể cá cảnh demo, máy sủi khí, bộ lọc thác nước ngọt và mặn"; qty="02 bộ"; useFor="Bài 10, 11, 12, 13 (Chuyên đề cá cảnh & STEAM)"; note="Phòng thực hành" },
        @{ stt=6; name="Học liệu số: Bản đồ ảnh vệ tinh giám sát rừng, camera giám sát ao tôm AI"; qty="01 bộ"; useFor="Bài 2, Bài 7, Bài 20, Bài 21"; note="Tích hợp trên Web App" }
    )
}

# 9. Rooms list for PL1
$roomData = @{
    cn10 = @(
        @{ stt=1; name="Phòng học có Tivi 65 inch & Internet"; qty="04"; useFor="Dạy các bài lý thuyết, trình chiếu PPT GVG, tương tác AI, trò chơi Plickers/Kahoot"; note="Phòng tiêu chuẩn" },
        @{ stt=2; name="Phòng thực hành bộ môn Công nghệ - Sinh học"; qty="01"; useFor="Thực hành đo pH đất (Bài 6), nhận biết phân bón (Bài 10), ghép cành (Bài 14)"; note="Đạt chuẩn quốc gia" },
        @{ stt=3; name="Vườn thực nghiệm trường & Góc STEAM"; qty="01"; useFor="Thực hành dự án trồng hoa trong chậu (Bài 22), trồng nấm rơm (Bài 28)"; note="Khuôn viên trường" }
    )
    cn11 = @(
        @{ stt=1; name="Phòng học văn hóa trang bị Smart Tivi"; qty="04"; useFor="Giảng dạy 22 bài học chăn nuôi, mô phỏng trang trại thông minh 4.0"; note="Sử dụng chung" },
        @{ stt=2; name="Phòng thí nghiệm / thực hành vi sinh"; qty="01"; useFor="Ủ thức ăn gia súc (Bài 10), thử nghiệm đệm lót sinh học (Bài 22)"; note="Phòng đa năng" }
    )
    cn12 = @(
        @{ stt=1; name="Phòng học trang bị công nghệ số & AI"; qty="04"; useFor="Giảng dạy 27 bài Lâm nghiệp & Thủy sản, 13 bài Chuyên đề"; note="Phòng tiêu chuẩn" },
        @{ stt=2; name="Phòng thực hành Công nghệ Nông nghiệp"; qty="01"; useFor="Đo chỉ tiêu nước ao nuôi (Bài 11), chế biến thủy sản (Bài 22), dự án cá cảnh (CĐ 13)"; note="Đạt chuẩn" }
    )
}

# 10. Teacher Duties for PL3
$teacherDuties = @{
    school = "TRƯỜNG THPT LỘC NINH"
    department = "TỔ CÔNG NGHỆ - TIN"
    province = "ĐỒNG NAI"
    schoolYear = "2026 - 2027"
    teacherName = "Trương Khắc Nam"
    teacherSub = "Trần Thị Thúy"
    headName = "Trần Thị Xuân"
    classes = @(
        @{ grade="Khối 10"; classes="10A1, 10A2, 10A3, 10A4"; periodsPerWeek=8; totalStudents=172 },
        @{ grade="Khối 11"; classes="11A1, 11A2"; periodsPerWeek=4; totalStudents=88 },
        @{ grade="Khối 12"; classes="12A1, 12A2, 12A3, 12A4"; periodsPerWeek=12; totalStudents=165 }
    )
    otherTasks = @(
        @{ stt=1; task="Bồi dưỡng học sinh giỏi (HSG) môn Công nghệ Nông nghiệp"; time="Tháng 9/2026 - Tháng 3/2027 (Chiều thứ Năm & chiều thứ Bảy)"; expected="Đạt ít nhất 02 giải Ba cấp tỉnh trở lên"; note="Theo kế hoạch tổ" },
        @{ stt=2; task="Thực hiện kiểm tra, đánh giá thường xuyên & định kì chuẩn CV 7991"; time="Suốt năm học theo PPCT"; expected="100% học sinh hoàn thành bài kiểm tra; điểm số cập nhật kịp thời lên VnEdu"; note="Thực hiện nghiêm túc" },
        @{ stt=3; task="Sinh hoạt tổ chuyên môn & Thao giảng theo nghiên cứu bài học"; time="2 tuần / lần vào chiều thứ Sáu"; expected="Tham gia đủ các buổi SHCM; thực hiện ít nhất 02 tiết dạy chuyên đề đổi mới PPDH"; note="Tổ phân công" },
        @{ stt=4; task="Tự bồi dưỡng nâng cao năng lực số, giáo dục AI & STEAM"; time="Suốt năm học"; expected="Ứng dụng linh hoạt AI, Canva, Plickers, mô hình 3D trong 100% tiết dạy"; note="Nhiệm vụ trọng tâm" },
        @{ stt=5; task="Hướng dẫn học sinh nghiên cứu KHKT / Sáng tạo thanh thiếu niên"; time="Học kì I"; expected="Hoàn thành 01 đề tài KHKT lĩnh vực Nông nghiệp - Môi trường dự thi cấp trường/tỉnh"; note="Đã lập nhóm" }
    )
}

$fullData = [PSCustomObject]@{
    meta = @{
        school = "TRƯỜNG THPT LỘC NINH"
        department = "TỔ CÔNG NGHỆ - TIN"
        province = "ĐỒNG NAI"
        schoolYear = "2026 - 2027"
        teacherName = "Trương Khắc Nam"
        teacherSub = "Trần Thị Thúy"
        headName = "Trần Thị Xuân"
        principalName = "Ban Giám Hiệu"
    }
    curriculum = @{
        cn10 = $k10Curriculum
        cn11 = $k11Curriculum
        cn12 = $k12Curriculum
        cn12_cd = $cd12List
    }
    steamProjects = $steamProjects
    equipment = $equipmentData
    rooms = $roomData
    teacherDuties = $teacherDuties
}

$json = $fullData | ConvertTo-Json -Depth 10
"const DATA_5512 = " + $json + ";" | Out-File -FilePath "D:\congnghenongnghiep\portal_5512_data.js" -Encoding utf8
Write-Host "Successfully generated D:\congnghenongnghiep\portal_5512_data.js! Size:" (Get-Item "D:\congnghenongnghiep\portal_5512_data.js").Length
