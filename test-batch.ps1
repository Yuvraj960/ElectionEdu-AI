$serverJob = Start-Job { node C:\Users\lenovo\Desktop\prompt\ wars\ 2\server\index.js }
Start-Sleep -Seconds 5
try {
    node C:\Users\lenovo\Desktop\prompt\ wars\ 2\test-api.js
} finally {
    Remove-Job -Job $serverJob -Force
}
