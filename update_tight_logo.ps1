# Precise Logo Image Processor with Tight Bounding Box for Star Plus Travels
Add-Type -AssemblyName System.Drawing

$assetsDir = Join-Path $PSScriptRoot "assets"
$origPath = Join-Path $assetsDir "logo_official_original.jpg"

if (-not (Test-Path $origPath)) {
    Write-Error "Source image not found: $origPath"
    exit 1
}

$srcBmp = [System.Drawing.Bitmap]::FromFile($origPath)
$w = $srcBmp.Width
$h = $srcBmp.Height

# Extract emblem only
$transBmp = [System.Drawing.Bitmap]::FromFile((Join-Path $assetsDir "logo_emblem.png"))

# Create Horizontal Navbar Logo with tight width (380 x 102)
$navW = 380
$navH = 102
$navBmp = New-Object System.Drawing.Bitmap($navW, $navH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($navBmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::Transparent)

# Draw exact emblem on the left
$drawEmblemSize = 88
$g.DrawImage($transBmp, 4, 7, $drawEmblemSize, $drawEmblemSize)

# Draw "Star Plus" and "TRAVEL & TOURISM LLC"
$fontTitle = New-Object System.Drawing.Font("Arial", 26, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$fontBadge = New-Object System.Drawing.Font("Segoe UI", 7.5, [System.Drawing.FontStyle]::Bold)

$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$brushCyan = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.RectangleF(190, 10, 160, 36)),
    [System.Drawing.Color]::FromArgb(255, 56, 189, 248),
    [System.Drawing.Color]::FromArgb(255, 2, 132, 199),
    0.0
)
$brushSub = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 160, 175, 195))
$brushOrange = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 249, 115, 22))

$g.DrawString("Star", $fontTitle, $brushWhite, 104, 10)
$g.DrawString("Plus", $fontTitle, $brushCyan, 172, 10)
$g.DrawString("TRAVEL & TOURISM LLC", $fontSub, $brushSub, 106, 52)
$g.DrawString("★ DUBAI & SRI LANKA PREMIER", $fontBadge, $brushOrange, 106, 73)

$g.Dispose()
$navBmp.Save((Join-Path $assetsDir "logo_full.png"), [System.Drawing.Imaging.ImageFormat]::Png)

$transBmp.Dispose()
$srcBmp.Dispose()
$navBmp.Dispose()

Write-Host "Updated tight logo_full.png successfully!" -ForegroundColor Green
