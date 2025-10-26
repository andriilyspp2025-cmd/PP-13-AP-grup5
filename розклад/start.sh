#!/bin/bash
# Скрипт автоматичного запуску проекту Rozklad
# Automatic startup script for Rozklad project

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Rozklad - Автоматичний запуск${NC}"
echo -e "${CYAN}  Rozklad - Automatic Startup${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Перевірка наявності Docker
echo -e "${YELLOW}[1/6] Перевірка Docker / Checking Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker не знайдено! Встановіть Docker.${NC}"
    echo -e "${RED}✗ Docker not found! Please install Docker.${NC}"
    echo -e "${YELLOW}Завантажити з / Download from: https://www.docker.com/get-started${NC}"
    exit 1
fi

DOCKER_VERSION=$(docker --version)
echo -e "${GREEN}✓ Docker знайдено: $DOCKER_VERSION${NC}"

# Перевірка Docker Compose
echo ""
echo -e "${YELLOW}[2/6] Перевірка Docker Compose / Checking Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose не знайдено!${NC}"
    exit 1
fi

COMPOSE_VERSION=$(docker-compose --version)
echo -e "${GREEN}✓ Docker Compose знайдено: $COMPOSE_VERSION${NC}"

# Перевірка чи Docker запущений
echo ""
echo -e "${YELLOW}[3/6] Перевірка стану Docker / Checking Docker status...${NC}"
if ! docker ps &> /dev/null; then
    echo -e "${RED}✗ Docker не запущений! Запустіть Docker daemon.${NC}"
    echo -e "${RED}✗ Docker is not running! Start Docker daemon.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker запущений${NC}"

# Зупинка старих контейнерів (якщо є)
echo ""
echo -e "${YELLOW}[4/6] Зупинка старих контейнерів / Stopping old containers...${NC}"
docker-compose down
echo -e "${GREEN}✓ Завершено${NC}"

# Збірка образів
echo ""
echo -e "${YELLOW}[5/6] Збірка Docker образів / Building Docker images...${NC}"
echo -e "${CYAN}Це може зайняти кілька хвилин при першому запуску...${NC}"
echo -e "${CYAN}This may take several minutes on first run...${NC}"
if ! docker-compose build; then
    echo -e "${RED}✗ Помилка при збірці образів${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Образи зібрано успішно${NC}"

# Запуск всіх сервісів
echo ""
echo -e "${YELLOW}[6/6] Запуск всіх сервісів / Starting all services...${NC}"
if ! docker-compose up -d; then
    echo -e "${RED}✗ Помилка при запуску сервісів${NC}"
    exit 1
fi

# Очікування готовності сервісів
echo ""
echo -e "${YELLOW}Очікування готовності сервісів / Waiting for services to be ready...${NC}"
sleep 5

# Перевірка статусу контейнерів
echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Статус контейнерів / Container Status${NC}"
echo -e "${CYAN}========================================${NC}"
docker-compose ps

# Перевірка здоров'я сервісів
echo ""
echo -e "${YELLOW}Перевірка доступності сервісів / Checking service availability...${NC}"
echo ""

# Перевірка PostgreSQL
echo -e "${CYAN}База даних PostgreSQL / PostgreSQL Database:${NC}"
PG_READY=false
for i in {1..30}; do
    if docker exec rozklad_db pg_isready -U rozklad_user &> /dev/null; then
        echo -e "${GREEN}  ✓ PostgreSQL готова (порт 5432)${NC}"
        PG_READY=true
        break
    fi
    echo -e "${YELLOW}  Очікування PostgreSQL... $i/30${NC}"
    sleep 1
done

if [ "$PG_READY" = false ]; then
    echo -e "${YELLOW}  ⚠ PostgreSQL ще не готова, але запущена${NC}"
fi

# Перевірка Backend
echo ""
echo -e "${CYAN}Backend API (FastAPI):${NC}"
sleep 3
if curl -s http://localhost:8000/docs > /dev/null 2>&1; then
    echo -e "${GREEN}  ✓ Backend доступний (порт 8000)${NC}"
    echo -e "${CYAN}  → http://localhost:8000/docs${NC}"
else
    echo -e "${YELLOW}  ⚠ Backend ще запускається...${NC}"
    echo -e "${YELLOW}  Спробуйте через 10-20 секунд: http://localhost:8000/docs${NC}"
fi

# Перевірка Frontend
echo ""
echo -e "${CYAN}Frontend (React + Vite):${NC}"
sleep 2
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}  ✓ Frontend доступний (порт 5173)${NC}"
    echo -e "${CYAN}  → http://localhost:5173${NC}"
else
    echo -e "${YELLOW}  ⚠ Frontend ще запускається...${NC}"
    echo -e "${YELLOW}  Спробуйте через 10-20 секунд: http://localhost:5173${NC}"
fi

# Фінальна інформація
echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}  Запуск завершено! / Startup Complete!${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${WHITE}Доступні сервіси / Available services:${NC}"
echo -e "${CYAN}  • Frontend:     http://localhost:5173${NC}"
echo -e "${CYAN}  • Backend API:  http://localhost:8000/docs${NC}"
echo -e "${CYAN}  • Database:     localhost:5432${NC}"
echo ""
echo -e "${WHITE}Корисні команди / Useful commands:${NC}"
echo -e "${YELLOW}  • Логи всіх сервісів:        docker-compose logs -f${NC}"
echo -e "${YELLOW}  • Логи конкретного сервісу:  docker-compose logs -f [postgres|backend|frontend]${NC}"
echo -e "${YELLOW}  • Перезапуск:                docker-compose restart${NC}"
echo -e "${YELLOW}  • Зупинка:                   docker-compose down${NC}"
echo ""
echo -e "${WHITE}Показати логи? (y/n): ${NC}"
read -r choice
if [ "$choice" = "y" ] || [ "$choice" = "Y" ]; then
    echo ""
    echo -e "${CYAN}Показ логів всіх сервісів (Ctrl+C для виходу)...${NC}"
    docker-compose logs -f
fi


