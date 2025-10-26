# Windows Setup Guide / Інструкція для Windows

[🇺🇦 Українська](#українська) | [🇬🇧 English](#english)

---

## Українська

### 🚀 Швидкий запуск

#### Крок 1: Встановіть Docker Desktop
1. Завантажте Docker Desktop: https://www.docker.com/products/docker-desktop
2. Встановіть та запустіть Docker Desktop
3. Дочекайтесь поки Docker стане активним (зелена іконка в системному треї)

#### Крок 2: Відкрийте PowerShell
- Натисніть `Win + X` → виберіть "Windows PowerShell" або "Terminal"
- Або в провіднику: правою кнопкою миші в папці проекту → "Відкрити в Terminal"

#### Крок 3: Запустіть проект
```powershell
.\start.ps1
```

Готово! 🎉 Скрипт автоматично:
- ✅ Перевірить Docker
- ✅ Зупинить старі контейнери
- ✅ Зібудує образи
- ✅ Запустить всі сервіси
- ✅ Перевірить їх готовність
- ✅ Покаже статус і посилання

### 📋 Доступні команди

```powershell
.\start.ps1      # Запуск всього проекту
.\stop.ps1       # Зупинка всього проекту
.\restart.ps1    # Перезапуск всього проекту
```

### 🔧 Виправлення помилок

#### Помилка: "running scripts is disabled"

**Швидке рішення (тільки для поточної сесії):**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\start.ps1
```

**Постійне рішення (рекомендовано):**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Після цього підтвердіть зміни (`Y`) і скрипти працюватимуть завжди.

#### Docker не запущений

1. Запустіть Docker Desktop
2. Дочекайтесь зеленої іконки в треї
3. Повторіть команду `.\start.ps1`

#### Порти зайняті

Якщо порти 5173, 8000 або 5432 зайняті іншими програмами:

```powershell
# Подивитись що використовує порт
netstat -ano | findstr :8000
netstat -ano | findstr :5173
netstat -ano | findstr :5432

# Зупинити процес (замініть PID на номер з попередньої команди)
taskkill /PID [номер] /F
```

### 🌐 Доступ до сервісів

Після запуску відкрийте в браузері:

| Сервіс | URL | Опис |
|--------|-----|------|
| Frontend | http://localhost:5173 | Веб-інтерфейс |
| Backend API | http://localhost:8000/docs | Swagger документація |
| ReDoc | http://localhost:8000/redoc | Альтернативна документація |
| Database | localhost:5432 | PostgreSQL (для клієнтів БД) |

**Дані для підключення до бази:**
- Host: `localhost`
- Port: `5432`
- Database: `rozklad`
- Username: `rozklad_user`
- Password: `rozklad_pass`

### 🛠️ Додаткові команди

```powershell
# Переглянути логи всіх сервісів
docker-compose logs -f

# Переглянути логи одного сервісу
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Статус контейнерів
docker-compose ps

# Використання ресурсів
docker stats

# Повністю очистити і почати заново
docker-compose down -v
.\start.ps1
```

---

## English

### 🚀 Quick Start

#### Step 1: Install Docker Desktop
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop
2. Install and launch Docker Desktop
3. Wait for Docker to become active (green icon in system tray)

#### Step 2: Open PowerShell
- Press `Win + X` → select "Windows PowerShell" or "Terminal"
- Or in File Explorer: right-click in project folder → "Open in Terminal"

#### Step 3: Run the project
```powershell
.\start.ps1
```

Done! 🎉 The script will automatically:
- ✅ Check Docker installation
- ✅ Stop old containers
- ✅ Build images
- ✅ Start all services
- ✅ Verify their readiness
- ✅ Show status and links

### 📋 Available Commands

```powershell
.\start.ps1      # Start entire project
.\stop.ps1       # Stop entire project
.\restart.ps1    # Restart entire project
```

### 🔧 Troubleshooting

#### Error: "running scripts is disabled"

**Quick fix (current session only):**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\start.ps1
```

**Permanent fix (recommended):**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Confirm the changes (`Y`) and scripts will work permanently.

#### Docker is not running

1. Launch Docker Desktop
2. Wait for green icon in tray
3. Run `.\start.ps1` again

#### Ports are in use

If ports 5173, 8000, or 5432 are used by other programs:

```powershell
# Check what's using the port
netstat -ano | findstr :8000
netstat -ano | findstr :5173
netstat -ano | findstr :5432

# Kill process (replace PID with number from previous command)
taskkill /PID [number] /F
```

### 🌐 Access Services

After startup, open in your browser:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | Web interface |
| Backend API | http://localhost:8000/docs | Swagger documentation |
| ReDoc | http://localhost:8000/redoc | Alternative documentation |
| Database | localhost:5432 | PostgreSQL (for DB clients) |

**Database connection details:**
- Host: `localhost`
- Port: `5432`
- Database: `rozklad`
- Username: `rozklad_user`
- Password: `rozklad_pass`

### 🛠️ Additional Commands

```powershell
# View logs of all services
docker-compose logs -f

# View logs of specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Container status
docker-compose ps

# Resource usage
docker stats

# Clean everything and start fresh
docker-compose down -v
.\start.ps1
```

---

## System Requirements / Системні вимоги

- ✅ Windows 10/11 (64-bit)
- ✅ Docker Desktop for Windows
- ✅ PowerShell 5.1+ (pre-installed)
- ✅ 4GB RAM minimum (8GB recommended)
- ✅ 10GB free disk space

---

## Support / Підтримка

If you encounter issues / Якщо виникли проблеми:

1. Check Docker Desktop is running / Перевірте що Docker Desktop запущений
2. Verify ports are free / Перевірте що порти вільні
3. Try clean restart / Спробуйте чистий перезапуск:
   ```powershell
   docker-compose down -v
   .\start.ps1
   ```
4. View logs / Перегляньте логи: `docker-compose logs -f`


