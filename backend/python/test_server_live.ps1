$proc = Start-Process -FilePath "C:\Users\PRUTHWEESH\Downloads\smartpick\backend\python\.venv\Scripts\uvicorn.exe" -ArgumentList "main:app --host 127.0.0.1 --port 8000" -WorkingDirectory "C:\Users\PRUTHWEESH\Downloads\smartpick\backend\python" -PassThru
Start-Sleep -Seconds 3
try {
    $res = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/products?category=smartphones&limit=2"
    Write-Host "UVICORN_TEST_SUCCESS: Returned $($res.data.Count) items"
    Write-Host "First item: $($res.data[0].name)"
    Write-Host "First image: $($res.data[0].image_url)"
} catch {
    Write-Host "Uvicorn test failed: $_"
} finally {
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
}

