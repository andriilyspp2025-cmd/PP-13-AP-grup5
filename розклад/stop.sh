#!/bin/bash
# Скрипт зупинки проекту Rozklad
# Stop script for Rozklad project

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Rozklad - Зупинка сервісів${NC}"
echo -e "${CYAN}  Rozklad - Stopping Services${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Показ поточного статусу
echo -e "${YELLOW}Поточний статус контейнерів / Current container status:${NC}"
docker-compose -p rozklad ps
echo ""

# Зупинка контейнерів
echo -e "${YELLOW}Зупинка всіх контейнерів / Stopping all containers...${NC}"
if docker-compose -p rozklad down; then
    echo ""
    echo -e "${CYAN}========================================${NC}"
    echo -e "${GREEN}  ✓ Всі сервіси зупинено!${NC}"
    echo -e "${GREEN}  ✓ All services stopped!${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo ""
    echo -e "${GRAY}Примітка: Завдяки 'restart: unless-stopped' контейнери${NC}"
    echo -e "${GRAY}НЕ запустяться автоматично після перезавантаження,${NC}"
    echo -e "${GRAY}поки ви їх не запустите знову командою:${NC}"
    echo -e "${CYAN}  ./start.sh  або  docker-compose -p rozklad up -d${NC}"
else
    echo ""
    echo -e "${RED}✗ Помилка при зупинці сервісів${NC}"
    exit 1
fi


