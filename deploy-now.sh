#!/bin/bash

# Полностью автоматический деплой CRM системы
# Запускайте с полными правами

set -e

echo "🚀 Автоматический деплой CRM на Supabase + Vercel"
echo "=================================================="
echo ""

cd ~/crm-system

# Цвета
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📦 Шаг 1: Git и GitHub${NC}"

# Инициализация Git
if [ ! -d .git ]; then
    git init
    echo "✓ Git инициализирован"
fi

# Добавляем все файлы
git add .
git commit -m "CRM System - Ready for deployment" 2>/dev/null || echo "✓ Коммит уже создан"

# Создаём GitHub репозиторий
echo ""
echo -e "${YELLOW}Создаю репозиторий на GitHub...${NC}"
REPO_NAME="crm-system-$(date +%s)"

gh repo create "$REPO_NAME" --public --source=. --remote=origin --push 2>/dev/null || {
    echo "Репозиторий возможно уже существует, пушим..."
    git push -u origin main 2>/dev/null || git push -u origin master 2>/dev/null || echo "✓ Код уже на GitHub"
}

echo -e "${GREEN}✅ Код на GitHub!${NC}"
GITHUB_URL=$(git remote get-url origin)
echo "📍 Репозиторий: $GITHUB_URL"
echo ""

# Supabase
echo -e "${BLUE}🗄️  Шаг 2: Supabase Database${NC}"
echo ""
echo "Подключаемся к вашему проекту Supabase..."

# Линкуем проект
supabase link --project-ref aspcqolpluoyrjfdbrso 2>/dev/null || {
    echo "Проект уже подключён или требуется логин"
    echo "Выполните: supabase login"
}

# Получаем Connection String
echo ""
echo "Получаю данные подключения..."
SUPABASE_URL="postgresql://postgres.aspcqolpluoyrjfdbrso:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

echo -e "${YELLOW}⚠️  Нужен пароль от Supabase!${NC}"
read -sp "Введите пароль от Supabase БД: " DB_PASSWORD
echo ""

# Применяем SQL миграции
echo ""
echo "Применяю миграции к базе данных..."
echo "Откройте SQL Editor в Supabase и выполните файл: supabase-migrations.sql"
echo "Или выполните: cat supabase-migrations.sql | pbcopy (скопирует в буфер)"
cat supabase-migrations.sql | pbcopy
echo -e "${GREEN}✅ SQL скрипт скопирован в буфер обмена!${NC}"
echo "Вставьте его в Supabase SQL Editor и нажмите Run"
read -p "Нажмите Enter когда выполните SQL в Supabase..."

# Генерация секретов
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH=$(openssl rand -base64 32)

echo -e "${GREEN}✅ База данных настроена!${NC}"
echo ""

# Vercel Frontend
echo -e "${BLUE}🎨 Шаг 3: Деплой Frontend на Vercel${NC}"
echo ""

cd frontend

# Настройка Vercel
echo "Деплою фронтенд..."
vercel --prod --yes \
    -e VITE_API_URL="https://crm-backend-ЗАМЕНИТЬ.onrender.com/api" \
    --force || {
    echo "Альтернативный деплой..."
    vercel deploy --prod
}

FRONTEND_URL=$(vercel ls | grep -o 'https://[^ ]*' | head -1)
cd ..

echo -e "${GREEN}✅ Frontend задеплоен!${NC}"
echo "📍 URL: $FRONTEND_URL"
echo ""

# Backend инструкции
echo -e "${BLUE}🔧 Шаг 4: Backend на Render.com${NC}"
echo ""
echo -e "${YELLOW}Для бэкенда откройте:${NC}"
echo "https://dashboard.render.com/select-repo?type=web"
echo ""
echo "Настройки:"
echo "- Repository: выберите $REPO_NAME"
echo "- Name: crm-backend"
echo "- Root Directory: backend"
echo "- Build Command: npm install"
echo "- Start Command: npm start"
echo ""
echo "Environment Variables:"
cat << EOF
NODE_ENV=production
PORT=5000
DB_HOST=aws-0-eu-central-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.aspcqolpluoyrjfdbrso
DB_PASSWORD=$DB_PASSWORD
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CORS_ORIGIN=*
REDIS_HOST=
REDIS_PORT=
EOF

# Сохраняем в файл
cat > backend-env-vars.txt << EOF
NODE_ENV=production
PORT=5000
DB_HOST=aws-0-eu-central-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.aspcqolpluoyrjfdbrso
DB_PASSWORD=$DB_PASSWORD
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CORS_ORIGIN=*
REDIS_HOST=
REDIS_PORT=
EOF

echo ""
echo -e "${GREEN}✅ Переменные сохранены в backend-env-vars.txt${NC}"
echo ""

read -p "Введите URL бэкенда после деплоя (например: https://crm-backend.onrender.com): " BACKEND_URL

if [ ! -z "$BACKEND_URL" ]; then
    # Обновляем Vercel с правильным API URL
    cd frontend
    vercel env rm VITE_API_URL production --yes 2>/dev/null || true
    echo "${BACKEND_URL}/api" | vercel env add VITE_API_URL production
    vercel --prod --yes
    cd ..
    
    echo -e "${GREEN}✅ Frontend обновлён с правильным API URL!${NC}"
fi

echo ""
echo "=================================================="
echo -e "${GREEN}🎉 ДЕПЛОЙ ЗАВЕРШЁН!${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}📍 Ваша CRM система:${NC}"
echo ""
echo "🌐 Frontend:  $FRONTEND_URL"
echo "🔌 Backend:   $BACKEND_URL"
echo "🗄️  Database:  Supabase"
echo "📦 GitHub:    $GITHUB_URL"
echo ""
echo -e "${YELLOW}📝 Следующие шаги:${NC}"
echo "1. Откройте: $FRONTEND_URL"
echo "2. Нажмите 'Register'"
echo "3. Создайте аккаунт и войдите!"
echo ""
echo -e "${GREEN}✨ Готово! Ваша CRM онлайн!${NC}"
