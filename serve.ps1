param(
    [int]$Port = 5173,
    [switch]$NoBrowser
)

$root = $PSScriptRoot
$ports = @($Port, 5174, 5175, 8080, 8081, 3000)

$listener = $null
$activePort = $null

foreach ($p in $ports) {
    try {
        $tempListener = New-Object System.Net.HttpListener
        $prefix = "http://localhost:$p/"
        $tempListener.Prefixes.Add($prefix)
        $tempListener.Start()
        $listener = $tempListener
        $activePort = $p
        break
    } catch {
        if ($tempListener) {
            try { $tempListener.Close() } catch {}
        }
    }
}

if (-not $listener) {
    Write-Host "Could not bind to any available port ($($ports -join ', '))." -ForegroundColor Red
    exit 1
}

$prefix = "http://localhost:$activePort/"

try {
    Write-Host "========================================================" -ForegroundColor Green
    Write-Host "  Portfolio Preview Server Running at $prefix" -ForegroundColor Cyan
    Write-Host "  Root directory: $root" -ForegroundColor Gray
    Write-Host "  Press Ctrl+C in this terminal to stop." -ForegroundColor Yellow
    Write-Host "========================================================" -ForegroundColor Green
    
    if (-not $NoBrowser) {
        try { Start-Process $prefix } catch {}
    }
    
    $mimeTypes = @{
        ".html" = "text/html; charset=utf-8"
        ".css"  = "text/css; charset=utf-8"
        ".js"   = "application/javascript; charset=utf-8"
        ".json" = "application/json; charset=utf-8"
        ".svg"  = "image/svg+xml"
        ".png"  = "image/png"
        ".jpg"  = "image/jpeg"
        ".jpeg" = "image/jpeg"
        ".webp" = "image/webp"
        ".ico"  = "image/x-icon"
        ".pdf"  = "application/pdf"
        ".mp4"  = "video/mp4"
        ".mp3"  = "audio/mpeg"
    }

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($urlPath)) { $urlPath = "index.html" }
        
        $filePath = Join-Path $root ($urlPath.Replace('/', '\'))
        
        # SPA routing fallback: if file doesn't exist and has no extension, serve index.html
        if (-not (Test-Path $filePath -PathType Leaf)) {
            if (-not ([System.IO.Path]::HasExtension($urlPath))) {
                $filePath = Join-Path $root "index.html"
            }
        }
        
        try {
            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                $response.ContentType = $mime
                
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $bytes.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $response.StatusCode = 404
                $err = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.ContentLength64 = $err.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($err, 0, $err.Length)
                }
            }
        } catch {}
        finally {
            try { $response.Close() } catch {}
        }
    }
} catch {
    Write-Host "Server error: $_" -ForegroundColor Red
} finally {
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
    }
    if ($listener) {
        $listener.Close()
    }
}