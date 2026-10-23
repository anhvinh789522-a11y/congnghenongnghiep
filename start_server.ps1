$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server running at http://localhost:$port/"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".pdf"  = "application/pdf"
    ".pptx" = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ".docx" = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

$rootDir = "D:\congnghenongnghiep"
$pdfDir  = "D:\congnghenongnghiep_data\pdfs"
$pptBase = Get-ChildItem -Path "D:\99_L*p10_11_12" -Directory -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
$dayHocDir = Get-ChildItem -Path "D:\01_D*\001_*\DAY HOC" -Directory -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
$ministryDir = if ($dayHocDir) { Get-ChildItem -Path "$dayHocDir\*2025\01. M*" -Directory -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName } else { $null }

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath)
        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        }

        $filePath = $null
        if ($urlPath.StartsWith("/pdfs/")) {
            $rel = $urlPath.Substring(6).Replace("/", "\")
            $filePath = Join-Path $pdfDir $rel
        } elseif ($urlPath.StartsWith("/ppts/") -and $pptBase) {
            $rel = $urlPath.Substring(6).Replace("/", "\")
            $filePath = Join-Path $pptBase $rel
        } elseif ($urlPath.StartsWith("/exams/")) {
            $rel = $urlPath.Substring(7).Replace("/", "\")
            $filePath = Join-Path "D:\congnghenongnghiep\exams" $rel
            if (-not (Test-Path $filePath -PathType Leaf)) {
                $filePath = Join-Path "D:\congnghenongnghiep\corpus\extracted_exams" $rel
            }
            if (-not (Test-Path $filePath -PathType Leaf) -and $dayHocDir) {
                $filePath = Join-Path $dayHocDir $rel
            }
            if (-not (Test-Path $filePath -PathType Leaf)) {
                $fname = [System.IO.Path]::GetFileName($rel)
                $found = Get-ChildItem -Path "D:\congnghenongnghiep\corpus\extracted_exams" -Filter $fname -Recurse -File -ErrorAction SilentlyContinue | Select-Object -First 1
                if ($found) { $filePath = $found.FullName }
            }
        } elseif ($urlPath.StartsWith("/chuyende/")) {
            $rel = $urlPath.Substring(10).Replace("/", "\")
            $filePath = if ($dayHocDir) { Join-Path $dayHocDir $rel } else { $null }
            if (-not ($filePath -and (Test-Path $filePath -PathType Leaf))) {
                $fname = [System.IO.Path]::GetFileName($rel)
                $found = Get-ChildItem -Path "D:\" -Filter $fname -Recurse -File -ErrorAction SilentlyContinue | Select-Object -First 1
                if ($found) { $filePath = $found.FullName }
            }
        } elseif ($urlPath.StartsWith("/ministry_exams/") -and $ministryDir) {
            $rel = $urlPath.Substring(16).Replace("/", "\")
            $filePath = Join-Path $ministryDir $rel
        } else {
            $rel = $urlPath.TrimStart("/").Replace("/", "\")
            $filePath = Join-Path $rootDir $rel
        }

        if ($filePath -and (Test-Path $filePath -PathType Leaf)) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = $mimeTypes[$ext]
            if (-not $contentType) { $contentType = "application/octet-stream" }
            $response.ContentType = $contentType
            $response.Headers.Add("Access-Control-Allow-Origin", "*")

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.OutputStream.Close()
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.OutputStream.Write($msg, 0, $msg.Length)
            $response.OutputStream.Close()
        }
    } catch {
        Start-Sleep -Milliseconds 50
    }
}
