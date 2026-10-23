[System.Reflection.Assembly]::LoadWithPartialName("System.IO.Compression.FileSystem") | Out-Null

function GetDocxRows($path) {
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
        if ($cTexts.Count -gt 0) {
            $res += ,$cTexts
        }
    }
    return $res
}

# Parse K10 from PL3 docx
$k10Rows = GetDocxRows("D:\01_DẠY HỌC\001_TRƯỜNG\2026 2027 phân phối gửi chi xuân\PL3_Khoi10_Trong_trot_da_chinh_theo_PL1.docx")
# Parse K11 from PL3 docx
$k11Rows = GetDocxRows("D:\01_DẠY HỌC\001_TRƯỜNG\DAY HOC\HS GIÁO ÁN UP VNEDU\26 -27 Phan phoi da chinh của Nam- Thuy\11_PL3_Cong_nghe_11_Chan_nuoi_hoan_thien.docx")
# Parse K12 from PL3 docx
$k12Rows = GetDocxRows("D:\01_DẠY HỌC\001_TRƯỜNG\2026 2027 phân phối gửi chi xuân\PL3_Cong_nghe_12_LN-TS_da_chinh_theo_PL1.docx")

Write-Host "K10 rows:" $k10Rows.Count "K11 rows:" $k11Rows.Count "K12 rows:" $k12Rows.Count
