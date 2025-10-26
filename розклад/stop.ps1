# Скрипт зупинки проекту Rozklad
# Stop script for Rozklad project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Rozklad - Зупинка сервісів" -ForegroundColor Cyan
Write-Host "  Rozklad - Stopping Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Показ поточного статусу
Write-Host "Поточний статус контейнерів / Current container status:" -ForegroundColor Yellow
docker-compose ps
Write-Host ""

# Зупинка контейнерів
Write-Host "Зупинка всіх контейнерів / Stopping all containers..." -ForegroundColor Yellow
docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  ✓ Всі сервіси зупинено!" -ForegroundColor Green
    Write-Host "  ✓ All services stopped!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Примітка: Завдяки 'restart: unless-stopped' контейнери" -ForegroundColor Gray
    Write-Host "НЕ запустяться автоматично після перезавантаження," -ForegroundColor Gray
    Write-Host "поки ви їх не запустите знову командою:" -ForegroundColor Gray
    Write-Host "  .\start.ps1  або  docker-compose up -d" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "✗ Помилка при зупинці сервісів" -ForegroundColor Red
    exit 1
}


