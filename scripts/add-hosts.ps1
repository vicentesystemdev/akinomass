$hostsPath = "C:\Windows\System32\drivers\etc\hosts"
$entry = "127.0.0.1   akinomass.net"

# Verificar si ya existe
$content = Get-Content $hostsPath -Raw
if ($content -match "akinomass\.net") {
    Write-Host "Ya existe una entrada para akinomass.net en hosts." -ForegroundColor Yellow
} else {
    Add-Content -Path $hostsPath -Value "`n$entry"
    Write-Host "Entrada agregada correctamente: $entry" -ForegroundColor Green
}
