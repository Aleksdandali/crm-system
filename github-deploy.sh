#!/bin/bash

echo "🚀 Деплой CRM на GitHub"
echo "======================="
echo ""

cd ~/crm-system

# 1. Авторизация GitHub
echo "📝 Шаг 1: Авторизация GitHub"
echo ""
gh auth login --web
echo ""

# 2. Инициализация Git
echo "📦 Шаг 2: Инициализация Git"
echo ""
git init
git add .
git commit -m "Initial commit: CRM System ready for deployment"
echo ""

# 3. Создание репозитория
echo "🌐 Шаг 3: Создание репозитория на GitHub"
echo ""
gh repo create crm-system --public --source=. --push
echo ""

# 4. Проверка
echo "✅ Репозиторий создан!"
echo ""
REPO_URL=$(git remote get-url origin)
echo "📍 URL: $REPO_URL"
echo ""
echo "Теперь откройте:"
echo "  open ~/crm-system/DEPLOY_INSTRUCTIONS.md"
echo ""
echo "И следуйте Шагам 2, 3, 4 для Supabase, Render и Vercel!"
