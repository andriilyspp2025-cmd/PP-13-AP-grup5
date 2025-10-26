# Скрипт перезапуску проекту Rozklad
# Restart script for Rozklad project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Rozklad - Перезапуск сервісів" -ForegroundColor Cyan
Write-Host "  Rozklad - Restarting Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Перезапуск контейнерів
Write-Host "Перезапуск всіх контейнерів / Restarting all containers..." -ForegroundColor Yellow
docker-compose restart

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Очікування готовності сервісів / Waiting for services..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Статус контейнерів / Container Status" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    docker-compose ps
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  ✓ Всі сервіси перезапущено!" -ForegroundColor Green
    Write-Host "  ✓ All services restarted!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Доступні сервіси / Available services:" -ForegroundColor White
    Write-Host "  • Frontend:     http://localhost:5173" -ForegroundColor Cyan
    Write-Host "  • Backend API:  http://localhost:8000/docs" -ForegroundColor Cyan
    Write-Host "  • Database:     localhost:5432" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "✗ Помилка при перезапуску сервісів" -ForegroundColor Red
    exit 1
}


