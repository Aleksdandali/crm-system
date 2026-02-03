#!/bin/bash

# Автоматический деплой CRM на Supabase + Vercel + Render

set -e

echo "🚀 Автоматический деплой CRM системы"
echo "======================================"
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Проверка Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git не установлен. Установите: brew install git${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Шаг 1: Подготовка репозитория${NC}"
echo ""

# Инициализация Git если нужно
if [ ! -d .git ]; then
    echo "Инициализация Git репозитория..."
    git init
    git add .
    git commit -m "Initial commit: CRM System"
    echo -e "${GREEN}✅ Git репозиторий создан${NC}"
else
    echo -e "${GREEN}✅ Git уже инициализирован${NC}"
fi

echo ""
echo -e "${YELLOW}📝 ВАЖНО: Теперь нужно создать репозиторий на GitHub${NC}"
echo ""
echo "1. Откройте: https://github.com/new"
echo "2. Repository name: crm-system"
echo "3. Выберите Public или Private"
echo "4. НЕ добавляйте README, .gitignore, license"
echo "5. Нажмите 'Create repository'"
echo ""
read -p "Создали репозиторий? Введите URL (например: https://github.com/username/crm-system.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo -e "${RED}❌ URL репозитория не указан${NC}"
    exit 1
fi

echo ""
echo "Подключение к GitHub..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
git branch -M main
git push -u origin main

echo -e "${GREEN}✅ Код загружен на GitHub${NC}"
echo ""

# Supabase данные
echo -e "${BLUE}📊 Шаг 2: Настройка Supabase${NC}"
echo ""
echo "Откройте ваш проект Supabase:"
echo "https://supabase.com/dashboard/project/aspcqolpluoyrjfdbrso"
echo ""
echo "1. Перейдите в Settings → Database"
echo "2. Скопируйте Connection String (URI format)"
echo ""
read -p "Вставьте Connection String: " SUPABASE_URI

if [ -z "$SUPABASE_URI" ]; then
    echo -e "${RED}❌ Connection String не указан${NC}"
    exit 1
fi

# Парсим Connection String
DB_HOST=$(echo $SUPABASE_URI | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_USER=$(echo $SUPABASE_URI | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $SUPABASE_URI | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_PORT=$(echo $SUPABASE_URI | sed -n 's/.*:\([0-9]*\)\/postgres.*/\1/p')

echo -e "${GREEN}✅ Supabase данные получены${NC}"
echo ""

# Render деплой
echo -e "${BLUE}🔧 Шаг 3: Деплой Backend на Render${NC}"
echo ""
echo "1. Откройте: https://dashboard.render.com/select-repo?type=web"
echo "2. Подключите GitHub аккаунт если нужно"
echo "3. Выберите репозиторий: crm-system"
echo "4. Настройки:"
echo "   - Name: crm-backend"
echo "   - Root Directory: backend"
echo "   - Runtime: Node"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Instance Type: Free"
echo ""
echo "5. Environment Variables (добавьте эти):"
echo ""
cat << EOF
NODE_ENV=production
PORT=5000
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=postgres
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASS
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CORS_ORIGIN=*
REDIS_HOST=
REDIS_PORT=
EOF
echo ""
read -p "Задеплоили на Render? Введите URL бэкенда (например: https://crm-backend.onrender.com): " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo -e "${RED}❌ URL бэкенда не указан${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend задеплоен${NC}"
echo ""

# Vercel деплой
echo -e "${BLUE}🎨 Шаг 4: Деплой Frontend на Vercel${NC}"
echo ""
echo "1. Откройте: https://vercel.com/new"
echo "2. Import Git Repository → выберите ваш репозиторий"
echo "3. Настройки:"
echo "   - Framework Preset: Vite"
echo "   - Root Directory: frontend"
echo "4. Environment Variables:"
echo "   VITE_API_URL=${BACKEND_URL}/api"
echo ""
read -p "Задеплоили на Vercel? Введите URL фронтенда (например: https://crm-system.vercel.app): " FRONTEND_URL

if [ -z "$FRONTEND_URL" ]; then
    echo -e "${RED}❌ URL фронтенда не указан${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Frontend задеплоен${NC}"
echo ""
echo "======================================"
echo -e "${GREEN}🎉 ДЕПЛОЙ ЗАВЕРШЁН!${NC}"
echo "======================================"
echo ""
echo -e "${BLUE}📍 Ваши ссылки:${NC}"
echo ""
echo "🌐 Frontend:  $FRONTEND_URL"
echo "🔌 Backend:   $BACKEND_URL"
echo "🗄️  Database:  Supabase (aspcqolpluoyrjfdbrso)"
echo ""
echo -e "${YELLOW}📝 Следующие шаги:${NC}"
echo "1. Откройте фронтенд: $FRONTEND_URL"
echo "2. Нажмите 'Register' и создайте аккаунт"
echo "3. Начните работать с CRM!"
echo ""
echo -e "${GREEN}✨ Готово! Ваша CRM система онлайн!${NC}"
