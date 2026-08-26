# Robust PowerShell Static HTTP Server for Star Plus Travels
$port = 3000
$rootPath = $PSScriptRoot
if (-not $rootPath) { $rootPath = (Get-Location).Path }
$rootPath = [System.IO.Path]::GetFullPath($rootPath)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$port/"
$listener.Prefixes.Add($prefix)

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".mp4"  = "video/mp4"
    ".webm" = "video/webm"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".txt"  = "text/plain"
    ".toml" = "text/plain"
}

try {
    $listener.Start()
    Write-Host "====================================================" -ForegroundColor Cyan
    Write-Host "Star Plus Travels Preview Server Running!" -ForegroundColor Green
    Write-Host "Homepage: $prefix" -ForegroundColor Yellow
    Write-Host "Careers:  ${prefix}careers.html (or ${prefix}careers)" -ForegroundColor Yellow
    Write-Host "Root:     $rootPath" -ForegroundColor White
    Write-Host "====================================================" -ForegroundColor Cyan

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        try {
            $urlPath = $request.Url.AbsolutePath
            $cleanPath = [System.Uri]::UnescapeDataString($urlPath.Trim('/'))
            
            if ([string]::IsNullOrWhiteSpace($cleanPath)) {
                $cleanPath = "index.html"
            }

            $candidatePath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($rootPath, $cleanPath))

            if ([System.IO.Directory]::Exists($candidatePath)) {
                $candidateIndex = [System.IO.Path]::Combine($candidatePath, "index.html")
                if ([System.IO.File]::Exists($candidateIndex)) {
                    $candidatePath = $candidateIndex
                }
            }

            if (-not [System.IO.File]::Exists($candidatePath)) {
                $htmlAttempt = "$candidatePath.html"
                if ([System.IO.File]::Exists($htmlAttempt)) {
                    $candidatePath = $htmlAttempt
                } else {
                    $trimmed = $candidatePath.TrimEnd('\', '/')
                    if ([System.IO.File]::Exists("$trimmed.html")) {
                        $candidatePath = "$trimmed.html"
                    }
                }
            }

            if ($candidatePath.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase) -and [System.IO.File]::Exists($candidatePath)) {
                $ext = [System.IO.Path]::GetExtension($candidatePath).ToLower()
                $contentType = $mimeTypes[$ext]
                if (-not $contentType) { $contentType = "application/octet-stream" }

                $response.ContentType = $contentType
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
                
                $bytes = [System.IO.File]::ReadAllBytes($candidatePath)
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200

                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $response.StatusCode = 404
                $response.ContentType = "text/html; charset=utf-8"
                $notFoundHtml = "<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style='font-family:sans-serif;text-align:center;padding:50px;'><h1>404 Not Found</h1><p>The requested path <code>$urlPath</code> was not found.</p><p><a href='/'>Return to Home</a> &bull; <a href='/careers.html'>Careers Page</a></p></body></html>"
                $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes($notFoundHtml)
                $response.ContentLength64 = $notFoundBytes.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
                }
            }
        } catch {
            Write-Warning "Error processing request: $_"
        } finally {
            try { $response.OutputStream.Close() } catch {}
        }
    }
} catch {
    Write-Error $_.Exception.Message
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
