#!/bin/bash
# Скрипт перезапуску проекту Rozklad
# Restart script for Rozklad project

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Rozklad - Перезапуск сервісів${NC}"
echo -e "${CYAN}  Rozklad - Restarting Services${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Перезапуск контейнерів
echo -e "${YELLOW}Перезапуск всіх контейнерів / Restarting all containers...${NC}"
if docker-compose -p rozklad restart; then
    echo ""
    echo -e "${YELLOW}Очікування готовності сервісів / Waiting for services...${NC}"
    sleep 5
    
    echo ""
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}  Статус контейнерів / Container Status${NC}"
    echo -e "${CYAN}========================================${NC}"
    docker-compose -p rozklad ps
    
    echo ""
    echo -e "${CYAN}========================================${NC}"
    echo -e "${GREEN}  ✓ Всі сервіси перезапущено!${NC}"
    echo -e "${GREEN}  ✓ All services restarted!${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo ""
    echo -e "${WHITE}Доступні сервіси / Available services:${NC}"
    echo -e "${CYAN}  • Frontend:     http://localhost:5173${NC}"
    echo -e "${CYAN}  • Backend API:  http://localhost:8000/docs${NC}"
    echo -e "${CYAN}  • Database:     localhost:5432${NC}"
else
    echo ""
    echo -e "${RED}✗ Помилка при перезапуску сервісів${NC}"
    exit 1
fi


