# Production Build & Verification Script for Star Plus Travels
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Running Star Plus Travels Production Build & Audit... " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }

$errors = @()
$warnings = @()

# 1. Check Core HTML Files
$htmlFiles = @(
    "index.html",
    "packages.html",
    "destinations.html",
    "visa-services.html",
    "why-us.html",
    "reviews.html",
    "faq.html",
    "contact.html",
    "terms.html",
    "careers.html"
)
foreach ($file in $htmlFiles) {
    $fullPath = Join-Path $root $file
    if (-not (Test-Path $fullPath)) {
        $errors += "Missing core HTML file: $file"
    } else {
        $content = Get-Content -Raw $fullPath
        $size = (Get-Item $fullPath).Length
        Write-Host " [OK] Core File Present: $file ($([math]::Round($size/1KB, 1)) KB)" -ForegroundColor Green

        # Check Asset References (img src, link href, script src)
        $regexImg = 'src=["'']([^"'']+)["'']'
        $matches = [regex]::Matches($content, $regexImg)
        foreach ($m in $matches) {
            $src = $m.Groups[1].Value
            if (-not ($src.StartsWith("http://") -or $src.StartsWith("https://") -or $src.StartsWith("data:") -or $src.StartsWith("//"))) {
                $cleanSrc = $src.Split('?')[0].TrimStart('/')
                $assetPath = Join-Path $root $cleanSrc
                if (-not (Test-Path $assetPath)) {
                    $errors += "Broken asset in $file : src='$src'"
                }
            }
        }

        # Check internal CSS / JS links
        $regexHref = 'href=["'']([^"'']+)["'']'
        $hrefMatches = [regex]::Matches($content, $regexHref)
        foreach ($hm in $hrefMatches) {
            $href = $hm.Groups[1].Value
            if (-not ($href.StartsWith("http://") -or $href.StartsWith("https://") -or $href.StartsWith("#") -or $href.StartsWith("mailto:") -or $href.StartsWith("tel:"))) {
                $cleanHref = $href.Split('#')[0].Split('?')[0].TrimStart('/')
                if ($cleanHref -ne "") {
                    $assetPath = Join-Path $root $cleanHref
                    if (-not (Test-Path $assetPath)) {
                        $errors += "Broken link in $file : href='$href'"
                    }
                }
            }
        }
    }
}

# 2. Check Static Deployment Configs
$configs = @("vercel.json", "netlify.toml", "_redirects", "_headers", ".gitignore", "package.json")
foreach ($cfg in $configs) {
    $fullPath = Join-Path $root $cfg
    if (Test-Path $fullPath) {
        Write-Host " [OK] Deployment Config Present: $cfg" -ForegroundColor Green
    } else {
        $warnings += "Optional config missing: $cfg"
    }
}

# 3. Check Favicon Suite
$favicons = @("favicon.ico", "favicon-32x32.png", "favicon-16x16.png", "favicon.svg", "apple-touch-icon.png")
foreach ($fav in $favicons) {
    if (Test-Path (Join-Path $root $fav)) {
        Write-Host " [OK] Favicon Suite Asset: $fav" -ForegroundColor Green
    } else {
        $errors += "Missing favicon asset: $fav"
    }
}

# 4. Check Client Logos
$clientCount = (Get-ChildItem -Path (Join-Path $root "assets\clients") -Filter *.png).Count
if ($clientCount -ge 20) {
    Write-Host " [OK] Client Logos: $clientCount logo variants found" -ForegroundColor Green
} else {
    $warnings += "Found $clientCount client logos (expected 20)"
}

Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
if ($errors.Count -eq 0) {
    Write-Host " BUILD SUCCESSFUL: 0 errors detected!" -ForegroundColor Green
    Write-Host " Production bundle is 100% ready for live deployment." -ForegroundColor Green
    exit 0
} else {
    Write-Host " BUILD FAILED with $($errors.Count) errors:" -ForegroundColor Red
    foreach ($err in $errors) {
        Write-Host "  - $err" -ForegroundColor Red
    }
    exit 1
}
