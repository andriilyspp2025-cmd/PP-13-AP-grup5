# Скрипт автоматичного запуску проекту Rozklad
# Automatic startup script for Rozklad project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Rozklad - Автоматичний запуск" -ForegroundColor Cyan
Write-Host "  Rozklad - Automatic Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Перевірка наявності Docker
Write-Host "[1/6] Перевірка Docker / Checking Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker знайдено: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker не знайдено! Встановіть Docker Desktop." -ForegroundColor Red
    Write-Host "✗ Docker not found! Please install Docker Desktop." -ForegroundColor Red
    Write-Host "Завантажити з / Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Перевірка Docker Compose
Write-Host ""
Write-Host "[2/6] Перевірка Docker Compose / Checking Docker Compose..." -ForegroundColor Yellow
try {
    $composeVersion = docker-compose --version
    Write-Host "✓ Docker Compose знайдено: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker Compose не знайдено!" -ForegroundColor Red
    exit 1
}

# Перевірка чи Docker запущений
Write-Host ""
Write-Host "[3/6] Перевірка стану Docker / Checking Docker status..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✓ Docker запущений" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker не запущений! Запустіть Docker Desktop." -ForegroundColor Red
    Write-Host "✗ Docker is not running! Start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Зупинка старих контейнерів (якщо є)
Write-Host ""
Write-Host "[4/6] Зупинка старих контейнерів / Stopping old containers..." -ForegroundColor Yellow
docker-compose down
Write-Host "✓ Завершено" -ForegroundColor Green

# Збірка образів
Write-Host ""
Write-Host "[5/6] Збірка Docker образів / Building Docker images..." -ForegroundColor Yellow
Write-Host "Це може зайняти кілька хвилин при першому запуску..." -ForegroundColor Cyan
Write-Host "This may take several minutes on first run..." -ForegroundColor Cyan
docker-compose build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Помилка при збірці образів" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Образи зібрано успішно" -ForegroundColor Green

# Запуск всіх сервісів
Write-Host ""
Write-Host "[6/6] Запуск всіх сервісів / Starting all services..." -ForegroundColor Yellow
docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Помилка при запуску сервісів" -ForegroundColor Red
    exit 1
}

# Очікування готовності сервісів
Write-Host ""
Write-Host "Очікування готовності сервісів / Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Перевірка статусу контейнерів
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Статус контейнерів / Container Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
docker-compose ps

# Перевірка здоров'я сервісів
Write-Host ""
Write-Host "Перевірка доступності сервісів / Checking service availability..." -ForegroundColor Yellow
Write-Host ""

# Перевірка PostgreSQL
Write-Host "База даних PostgreSQL / PostgreSQL Database:" -ForegroundColor Cyan
$pgReady = $false
for ($i = 1; $i -le 30; $i++) {
    try {
        $result = docker exec rozklad_db pg_isready -U rozklad_user 2>&1
        if ($result -match "accepting connections") {
            Write-Host "  ✓ PostgreSQL готова (порт 5432)" -ForegroundColor Green
            $pgReady = $true
            break
        }
    } catch {}
    Write-Host "  Очікування PostgreSQL... $i/30" -ForegroundColor Yellow
    Start-Sleep -Seconds 1
}

if (-not $pgReady) {
    Write-Host "  ⚠ PostgreSQL ще не готова, але запущена" -ForegroundColor Yellow
}

# Перевірка Backend
Write-Host ""
Write-Host "Backend API (FastAPI):" -ForegroundColor Cyan
Start-Sleep -Seconds 3
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/docs" -TimeoutSec 5 -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ Backend доступний (порт 8000)" -ForegroundColor Green
        Write-Host "  → http://localhost:8000/docs" -ForegroundColor Cyan
    }
} catch {
    Write-Host "  ⚠ Backend ще запускається..." -ForegroundColor Yellow
    Write-Host "  Спробуйте через 10-20 секунд: http://localhost:8000/docs" -ForegroundColor Yellow
}

# Перевірка Frontend
Write-Host ""
Write-Host "Frontend (React + Vite):" -ForegroundColor Cyan
Start-Sleep -Seconds 2
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ Frontend доступний (порт 5173)" -ForegroundColor Green
        Write-Host "  → http://localhost:5173" -ForegroundColor Cyan
    }
} catch {
    Write-Host "  ⚠ Frontend ще запускається..." -ForegroundColor Yellow
    Write-Host "  Спробуйте через 10-20 секунд: http://localhost:5173" -ForegroundColor Yellow
}

# Фінальна інформація
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Запуск завершено! / Startup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Доступні сервіси / Available services:" -ForegroundColor White
Write-Host "  • Frontend:     http://localhost:5173" -ForegroundColor Cyan
Write-Host "  • Backend API:  http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  • Database:     localhost:5432" -ForegroundColor Cyan
Write-Host ""
Write-Host "Корисні команди / Useful commands:" -ForegroundColor White
Write-Host "  • Логи всіх сервісів:        docker-compose logs -f" -ForegroundColor Yellow
Write-Host "  • Логи конкретного сервісу:  docker-compose logs -f [postgres|backend|frontend]" -ForegroundColor Yellow
Write-Host "  • Перезапуск:                docker-compose restart" -ForegroundColor Yellow
Write-Host "  • Зупинка:                   docker-compose down" -ForegroundColor Yellow
Write-Host ""
Write-Host "Натисніть Enter для виходу або Ctrl+C для перегляду логів..." -ForegroundColor Gray
$choice = Read-Host "Показати логи? (y/n)"
if ($choice -eq "y" -or $choice -eq "Y") {
    Write-Host ""
    Write-Host "Показ логів всіх сервісів (Ctrl+C для виходу)..." -ForegroundColor Cyan
    docker-compose logs -f
}


