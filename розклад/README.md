# Rozklad (UniSchedule)

A comprehensive scheduling system for educational institutions with support for schedule creation, change management, and notifications.

## Features

- **Multi-Role Access**: Super Admin, Admin, Teacher, Student/Parent
- **Smart Schedule Builder**: AI-assisted schedule creation with conflict detection
- **Change Management**: Handle substitutions, cancellations, and rescheduling
- **Real-time Notifications**: Push notifications for schedule changes
- **Multi-Platform**: Web and mobile (iOS/Android) applications

## Tech Stack

- **Backend**: FastAPI (Python 3.11+)
- **Frontend**: React 18 + TypeScript + Vite
- **Mobile**: React Native + TypeScript
- **Database**: PostgreSQL 14+
- **Authentication**: JWT
- **Notifications**: Firebase Cloud Messaging

## Project Structure

```
rozklad/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── models/      # Database models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   └── core/        # Config, security, etc.
│   ├── alembic/         # Database migrations
│   └── requirements.txt
├── frontend/            # React web app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   └── package.json
├── mobile/              # React Native app
│   ├── src/
│   └── package.json
└── docker-compose.yml
```

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Docker (optional)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Mobile Setup

```bash
cd mobile
npm install
npx react-native run-android  # or run-ios
```

### Docker Setup (Recommended)

#### 🚀 Швидкий запуск / Quick Start (Автоматичний скрипт)

> **💡 Для Windows користувачів:** Детальна інструкція → [WINDOWS_SETUP.md](WINDOWS_SETUP.md)

**Windows (PowerShell):**
```powershell
.\start.ps1
```

**Linux/Mac (Bash):**
```bash
chmod +x start.sh
./start.sh
```

Автоматичний скрипт виконає:
1. ✓ Перевірку наявності Docker та Docker Compose
2. ✓ Зупинку старих контейнерів
3. ✓ Збірку всіх Docker образів
4. ✓ Запуск всіх сервісів (postgres, backend, frontend)
5. ✓ Перевірку готовності кожного сервісу
6. ✓ Показ статусу та посилань на сервіси

**Інші скрипти управління / Other management scripts:**

```powershell
# Windows
.\stop.ps1      # Зупинити всі сервіси
.\restart.ps1   # Перезапустити всі сервіси
```

```bash
# Linux/Mac
./stop.sh       # Зупинити всі сервіси
./restart.sh    # Перезапустити всі сервіси
```

---

#### Запуск всіх сервісів разом / Start all services together

```bash
# Запустити всі сервіси в фоновому режимі з автозапуском
docker-compose up -d

# Переглянути логи всіх сервісів
docker-compose logs -f

# Зупинити всі сервіси
docker-compose down

# Перезапустити всі сервіси
docker-compose restart
```

#### Запуск сервісів окремо / Start services individually

```bash
# Запустити тільки базу даних
docker-compose up -d postgres

# Запустити тільки backend (автоматично запустить postgres через depends_on)
docker-compose up -d backend

# Запустити тільки frontend
docker-compose up -d frontend

# Переглянути логи конкретного сервісу
docker-compose logs -f postgres
docker-compose logs -f backend
docker-compose logs -f frontend

# Зупинити конкретний сервіс
docker-compose stop postgres
docker-compose stop backend
docker-compose stop frontend

# Перезапустити конкретний сервіс
docker-compose restart postgres
docker-compose restart backend
docker-compose restart frontend
```

#### Автоматичний перезапуск / Auto-restart

Всі сервіси налаштовані з політикою `restart: unless-stopped`, що означає:
- Контейнери автоматично перезапускаються при збоях
- Контейнери автоматично запускаються після перезавантаження системи
- Контейнери НЕ перезапускаються, якщо їх зупинили вручну командою `docker-compose stop`

All services are configured with `restart: unless-stopped` policy, which means:
- Containers automatically restart on failures
- Containers automatically start after system reboot
- Containers do NOT restart if manually stopped with `docker-compose stop`

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## User Roles

1. **Super Administrator**: Full system control, schedule finalization
2. **Administrator**: Draft schedules, daily changes
3. **Teacher**: View schedule, submit change requests
4. **Student/Parent**: View schedules, receive notifications

## License

MIT

