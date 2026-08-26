# Branding Asset Generator for Star Plus Travel & Tourism LLC
Add-Type -AssemblyName System.Drawing

$assetsDir = Join-Path $PSScriptRoot "assets"
if (-not (Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null
}

function Create-LogoIconBitmap([int]$size) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $cx = $size / 2.0
    $cy = $size / 2.0

    # 1. Background dark rounded badge with gold glow
    $badgeRect = New-Object System.Drawing.RectangleF(1.0, 1.0, ($size - 2.0), ($size - 2.0))
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $badgeRect,
        [System.Drawing.Color]::FromArgb(255, 11, 25, 44),
        [System.Drawing.Color]::FromArgb(255, 7, 14, 23),
        45.0
    )
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 245, 158, 11), [Math]::Max(1.0, $size * 0.04))
    
    # Rounded path
    $r = $size * 0.22
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc($badgeRect.X, $badgeRect.Y, $r*2, $r*2, 180, 90)
    $path.AddArc($badgeRect.Right - $r*2, $badgeRect.Y, $r*2, $r*2, 270, 90)
    $path.AddArc($badgeRect.Right - $r*2, $badgeRect.Bottom - $r*2, $r*2, $r*2, 0, 90)
    $path.AddArc($badgeRect.X, $badgeRect.Bottom - $r*2, $r*2, $r*2, 90, 90)
    $path.CloseFigure()

    $g.FillPath($bgBrush, $path)
    $g.DrawPath($borderPen, $path)

    # 2. Outer Star / Compass Points (Orange & Gold)
    $outerR = $size * 0.38
    $innerR = $size * 0.16
    $numPoints = 8
    $starPoints = New-Object "System.Drawing.PointF[]" ($numPoints * 2)

    for ($i = 0; $i -lt ($numPoints * 2); $i++) {
        $angle = ($i * [Math]::PI / $numPoints) - ([Math]::PI / 2.0)
        $radius = if ($i % 2 -eq 0) { 
            if ($i % 4 -eq 0) { $outerR } else { $outerR * 0.72 }
        } else { 
            $innerR 
        }
        $x = $cx + ($radius * [Math]::Cos($angle))
        $y = $cy + ($radius * [Math]::Sin($angle))
        $starPoints[$i] = New-Object System.Drawing.PointF($x, $y)
    }

    $starBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.RectangleF(0, 0, $size, $size)),
        [System.Drawing.Color]::FromArgb(255, 255, 180, 0),
        [System.Drawing.Color]::FromArgb(255, 235, 90, 20),
        60.0
    )
    $g.FillPolygon($starBrush, $starPoints)

    # Inner Core Ring (Deep Blue)
    $coreR = $size * 0.12
    $coreBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 30, 62, 98))
    $corePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 255, 215, 0), [Math]::Max(1.0, $size * 0.03))
    $g.FillEllipse($coreBrush, ($cx - $coreR), ($cy - $coreR), ($coreR * 2), ($coreR * 2))
    $g.DrawEllipse($corePen, ($cx - $coreR), ($cy - $coreR), ($coreR * 2), ($coreR * 2))

    # 3. Airplane Orbit Ring & Jet Icon (White & Gold)
    $orbitPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 255, 255, 255), [Math]::Max(1.0, $size * 0.04))
    $orbitPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Solid
    $g.DrawArc($orbitPen, ($cx - $outerR * 0.95), ($cy - $outerR * 0.65), ($outerR * 1.9), ($outerR * 1.3), -30, 240)

    # Airplane Symbol at Top-Right
    $planeX = $cx + ($outerR * 0.52)
    $planeY = $cy - ($outerR * 0.50)
    $pSize = $size * 0.14
    
    $planePoints = @(
        (New-Object System.Drawing.PointF($planeX, ($planeY - $pSize*0.9))),
        (New-Object System.Drawing.PointF(($planeX + $pSize*0.8), ($planeY + $pSize*0.6))),
        (New-Object System.Drawing.PointF($planeX, ($planeY + $pSize*0.3))),
        (New-Object System.Drawing.PointF(($planeX - $pSize*0.8), ($planeY + $pSize*0.6)))
    )
    $planeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillPolygon($planeBrush, $planePoints)

    $g.Dispose()
    return $bmp
}

function Create-FullLogoBitmap() {
    $width = 560
    $height = 120
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear([System.Drawing.Color]::Transparent)

    # Draw Emblem
    $iconBmp = Create-LogoIconBitmap 96
    $g.DrawImage($iconBmp, 12, 12, 96, 96)
    $iconBmp.Dispose()

    # Draw Brand Title "STAR PLUS"
    $fontTitle = New-Object System.Drawing.Font("Arial Black", 30, [System.Drawing.FontStyle]::Bold)
    $brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $brushGold = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.RectangleF(120, 18, 300, 45)),
        [System.Drawing.Color]::FromArgb(255, 255, 215, 0),
        [System.Drawing.Color]::FromArgb(255, 245, 140, 10),
        0.0
    )
    
    $g.DrawString("STAR", $fontTitle, $brushWhite, 120, 16)
    $g.DrawString("PLUS", $fontTitle, $brushGold, 252, 16)

    # Draw Subtitle "TRAVEL & TOURISM LLC"
    $fontSub = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
    $brushSub = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 160, 175, 195))
    $g.DrawString("TRAVEL & TOURISM LLC", $fontSub, $brushSub, 124, 66)

    # Draw Tagline pill "DUBAI • SRI LANKA"
    $fontPill = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)
    $brushPill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 158, 11))
    $g.DrawString("★ DUBAI & SRI LANKA PREMIER TRAVEL", $fontPill, $brushPill, 124, 88)

    $g.Dispose()
    return $bmp
}

# Generate PNG Assets
$icon512 = Create-LogoIconBitmap 512
$icon512.Save((Join-Path $assetsDir "logo_icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$icon512.Dispose()

$fullLogo = Create-FullLogoBitmap
$fullLogo.Save((Join-Path $assetsDir "logo_full.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$fullLogo.Dispose()

$favicon32 = Create-LogoIconBitmap 32
$favicon32.Save((Join-Path $assetsDir "favicon-32x32.png"), [System.Drawing.Imaging.ImageFormat]::Png)

$favicon16 = Create-LogoIconBitmap 16
$favicon16.Save((Join-Path $assetsDir "favicon-16x16.png"), [System.Drawing.Imaging.ImageFormat]::Png)

# Generate multi-size .ICO File
function Export-IcoFile([string]$path, $bitmaps) {
    $fs = [System.IO.File]::Create($path)
    $bw = New-Object System.IO.BinaryWriter($fs)

    # ICONDIR Header: Reserved (2 bytes = 0), Type (2 bytes = 1 for icon), Count (2 bytes)
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

        $bw.Write([byte]$w)          # Width
        $bw.Write([byte]$h)          # Height
        $bw.Write([byte]0)           # Color count
        $bw.Write([byte]0)           # Reserved
        $bw.Write([uint16]1)         # Color planes
        $bw.Write([uint16]32)        # Bits per pixel
        $bw.Write([uint32]$pngBytes.Length) # Image size in bytes
        $bw.Write([uint32]$offset)   # Offset
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

$icoList = @($favicon16, $favicon32, (Create-LogoIconBitmap 48))
Export-IcoFile (Join-Path $assetsDir "favicon.ico") $icoList

$favicon16.Dispose()
$favicon32.Dispose()

Write-Host "Branding assets generated successfully in $assetsDir" -ForegroundColor Green
