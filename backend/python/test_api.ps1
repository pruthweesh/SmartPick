$base = 'http://127.0.0.1:8000'

# Register user (ignore error if exists)
$registerBody = @{email='test@example.com'; password='Password123'; full_name='Test User'}
try {
    $reg = Invoke-RestMethod -Method Post -Uri "$base/api/auth/register" -ContentType 'application/json' -Body ($registerBody | ConvertTo-Json)
    Write-Host "✅ Registered: $($reg | ConvertTo-Json -Depth 3)"
} catch {
    Write-Host "⚠️ Register failed: $($_.Exception.Response.StatusCode)"
}

# Login
$loginBody = @{email='test@example.com'; password='Password123'}
$login = Invoke-RestMethod -Method Post -Uri "$base/api/auth/login" -ContentType 'application/json' -Body ($loginBody | ConvertTo-Json)
$TOKEN = $login.token
Write-Host "✅ Logged in, token: $TOKEN"

function Invoke-Api {
    param([string]$Method, [string]$Url)
    $hdr = @{Authorization = "Bearer $TOKEN"}
    try {
        $resp = Invoke-WebRequest -Method $Method -Uri $Url -Headers $hdr -UseBasicParsing
        $status = $resp.StatusCode
        $body = $resp.Content
    } catch {
        $status = $_.Exception.Response.StatusCode.Value__
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = [System.IO.StreamReader]::new($stream)
        $body = $reader.ReadToEnd()
        $reader.Close()
    }
    Write-Host "🟢 $Method $Url -> $status"
    Write-Host $body
    Write-Host ""
}

Invoke-Api GET "$base/api/auth/me"
Invoke-Api GET "$base/api/cart"
Invoke-Api GET "$base/api/user/preferences"

