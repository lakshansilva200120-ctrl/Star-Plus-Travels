# Precise Logo Image Processor for Star Plus Travels
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

Write-Host "Processing Original Logo (${w}x${h})..." -ForegroundColor Cyan

# 1. Find bounding box of non-white / content area
$minX = $w; $maxX = 0; $minY = $h; $maxY = 0

for ($y = 0; $y -lt $h; $y += 2) {
    for ($x = 0; $x -lt $w; $x += 2) {
        $c = $srcBmp.GetPixel($x, $y)
        # Check if significantly different from light grey/white background (> ~235)
        if ($c.R -lt 225 -or $c.G -lt 225 -or $c.B -lt 225) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

# Add padding
$pad = 20
$cropX = [Math]::Max(0, $minX - $pad)
$cropY = [Math]::Max(0, $minY - $pad)
$cropW = [Math]::Min($w - $cropX, ($maxX - $minX) + ($pad * 2))
$cropH = [Math]::Min($h - $cropY, ($maxY - $minY) + ($pad * 2))

Write-Host "Content bounds: X=$cropX, Y=$cropY, W=$cropW, H=$cropH" -ForegroundColor Yellow

# Crop to content
$cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$croppedBmp = $srcBmp.Clone($cropRect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# 2. Make transparent version by calculating alpha against background white
$transBmp = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $cropH; $y++) {
    for ($x = 0; $x -lt $cropW; $x++) {
        $c = $croppedBmp.GetPixel($x, $y)
        
        # Background estimation (paper texture is approx RGB: 236-245)
        $brightness = ($c.R + $c.G + $c.B) / 3.0
        
        if ($brightness -gt 240) {
            # Completely transparent
            $transBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($brightness -gt 220) {
            # Smooth anti-aliased edge alpha fade
            $alpha = [int]((240 - $brightness) / 20.0 * 255.0)
            $alpha = [Math]::Max(0, [Math]::Min(255, $alpha))
            $transBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
        } else {
            $transBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $c.R, $c.G, $c.B))
        }
    }
}

$transBmp.Save((Join-Path $assetsDir "logo_full_transparent.png"), [System.Drawing.Imaging.ImageFormat]::Png)

# 3. Create High-Contrast Version for Dark Navigation Bar (White/Gold text with vibrant emblem)
# Separate Emblem (Top portion) vs Text (Bottom portion)
$emblemH = [int]($cropH * 0.65)
$emblemRect = New-Object System.Drawing.Rectangle(0, 0, $cropW, $emblemH)
$emblemBmp = $transBmp.Clone($emblemRect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Find tight emblem bounds
$eMinX = $cropW; $eMaxX = 0; $eMinY = $emblemH; $eMaxY = 0
for ($y = 0; $y -lt $emblemH; $y++) {
    for ($x = 0; $x -lt $cropW; $x++) {
        $c = $emblemBmp.GetPixel($x, $y)
        if ($c.A -gt 30) {
            if ($x -lt $eMinX) { $eMinX = $x }
            if ($x -gt $eMaxX) { $eMaxX = $x }
            if ($y -lt $eMinY) { $eMinY = $y }
            if ($y -gt $eMaxY) { $eMaxY = $y }
        }
    }
}

$eCropRect = New-Object System.Drawing.Rectangle($eMinX, $eMinY, ($eMaxX - $eMinX + 1), ($eMaxY - $eMinY + 1))
$emblemOnly = $emblemBmp.Clone($eCropRect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$emblemOnly.Save((Join-Path $assetsDir "logo_emblem.png"), [System.Drawing.Imaging.ImageFormat]::Png)

# 4. Create Horizontal Navbar Logo Optimized for Dark Luxury Header
$navW = 540
$navH = 110
$navBmp = New-Object System.Drawing.Bitmap($navW, $navH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($navBmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::Transparent)

# Draw exact emblem on the left
$drawEmblemSize = 92
$g.DrawImage($emblemOnly, 8, 9, $drawEmblemSize, $drawEmblemSize)

# Draw "Star Plus" and "TRAVEL & TOURISM LLC" in crisp matching typography
$fontTitle = New-Object System.Drawing.Font("Arial", 28, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$fontBadge = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)

$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$brushCyan = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.RectangleF(205, 14, 180, 40)),
    [System.Drawing.Color]::FromArgb(255, 56, 189, 248),
    [System.Drawing.Color]::FromArgb(255, 2, 132, 199),
    0.0
)
$brushSub = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 160, 175, 195))
$brushOrange = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 249, 115, 22))

$g.DrawString("Star", $fontTitle, $brushWhite, 112, 14)
$g.DrawString("Plus", $fontTitle, $brushCyan, 186, 14)
$g.DrawString("TRAVEL & TOURISM LLC", $fontSub, $brushSub, 115, 58)
$g.DrawString("★ DUBAI & SRI LANKA PREMIER", $fontBadge, $brushOrange, 115, 80)

$g.Dispose()
$navBmp.Save((Join-Path $assetsDir "logo_full.png"), [System.Drawing.Imaging.ImageFormat]::Png)

# 5. Also Create Crisp Favicons from the Exact User-Uploaded Emblem
function Create-FaviconIcon([System.Drawing.Bitmap]$emblemSource, [int]$size) {
    $sq = [Math]::Max($emblemSource.Width, $emblemSource.Height)
    $sqBmp = New-Object System.Drawing.Bitmap($sq, $sq, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gSq = [System.Drawing.Graphics]::FromImage($sqBmp)
    $gSq.Clear([System.Drawing.Color]::Transparent)
    $offsetX = ($sq - $emblemSource.Width) / 2.0
    $offsetY = ($sq - $emblemSource.Height) / 2.0
    $gSq.DrawImage($emblemSource, $offsetX, $offsetY, $emblemSource.Width, $emblemSource.Height)
    $gSq.Dispose()

    $targetBmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gTar = [System.Drawing.Graphics]::FromImage($targetBmp)
    $gTar.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $gTar.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gTar.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gTar.Clear([System.Drawing.Color]::Transparent)

    $gTar.DrawImage($sqBmp, 0, 0, $size, $size)
    $gTar.Dispose()
    $sqBmp.Dispose()
    return $targetBmp
}

$fav16 = Create-FaviconIcon $emblemOnly 16
$fav16.Save((Join-Path $assetsDir "favicon-16x16.png"), [System.Drawing.Imaging.ImageFormat]::Png)

$fav32 = Create-FaviconIcon $emblemOnly 32
$fav32.Save((Join-Path $assetsDir "favicon-32x32.png"), [System.Drawing.Imaging.ImageFormat]::Png)

$fav48 = Create-FaviconIcon $emblemOnly 48
$fav64 = Create-FaviconIcon $emblemOnly 64

# Write multi-resolution .ICO file
function Export-IcoFile([string]$path, $bitmaps) {
    $fs = [System.IO.File]::Create($path)
    $bw = New-Object System.IO.BinaryWriter($fs)

    $bw.Write([uint16]0)
    $bw.Write([uint16]1)
    $bw.Write([uint16]$bitmaps.Count)

    $pngStreams = @()
    $offset = 6 + ($bitmaps.Count * 16)

    foreach ($b in $bitmaps) {
        $ms = New-Object System.IO.MemoryStream
        $b.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
        $pngBytes = $ms.ToArray()
        $pngStreams += ,$pngBytes

        $w = if ($b.Width -ge 256) { 0 } else { [byte]$b.Width }
        $h = if ($b.Height -ge 256) { 0 } else { [byte]$b.Height }

        $bw.Write([byte]$w)
        $bw.Write([byte]$h)
        $bw.Write([byte]0)
        $bw.Write([byte]0)
        $bw.Write([uint16]1)
        $bw.Write([uint16]32)
        $bw.Write([uint32]$pngBytes.Length)
        $bw.Write([uint32]$offset)
        $offset += $pngBytes.Length
        $ms.Dispose()
    }

    foreach ($bytes in $pngStreams) {
        $bw.Write($bytes)
    }

    $bw.Flush()
    $bw.Close()
    $fs.Close()
}

Export-IcoFile (Join-Path $assetsDir "favicon.ico") @($fav16, $fav32, $fav48, $fav64)

# Cleanup
$fav16.Dispose()
$fav32.Dispose()
$fav48.Dispose()
$fav64.Dispose()
$emblemOnly.Dispose()
$emblemBmp.Dispose()
$transBmp.Dispose()
$croppedBmp.Dispose()
$srcBmp.Dispose()
$navBmp.Dispose()

Write-Host "Processed authentic Star Plus logo assets and favicons successfully!" -ForegroundColor Green
