# 🚀 Деплой за 3 шага (10 минут)

## ✅ Шаг 1: GitHub (2 минуты)

Откройте терминал и выполните:

```bash
cd ~/crm-system

# Инициализация Git
git init
git add .
git commit -m "Initial commit: CRM System"

# Создание репозитория на GitHub
gh auth login  # если попросит
gh repo create crm-system --public --source=. --push
```

**✓ Готово!** Код на GitHub!

---

## 📊 Шаг 2: Supabase SQL (1 минута)

1. Откройте: https://supabase.com/dashboard/project/aspcqolpluoyrjfdbrso
2. Нажмите **SQL Editor** (иконка `</>` слева)
3. Нажмите **New query**
4. Выполните в терминале:
   ```bash
   cat ~/crm-system/supabase-migrations.sql | pbcopy
   ```
5. Вставьте в SQL Editor (Cmd+V)
6. Нажмите **Run** (или Cmd+Enter)

**✓ Должно показать: "Success. No rows returned"**

---

## 🔧 Шаг 3: Backend на Render (3 минуты)

1. Откройте: https://dashboard.render.com/create?type=web
2. Подключите GitHub если нужно
3. Выберите репозиторий **crm-system**
4. Настройки:
   - **Name**: `crm-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. **Environment Variables** - нажмите "Add Environment Variable" и добавьте:

```
NODE_ENV=production
PORT=5000
```

**Данные Supabase** (из Settings → Database → Connection String):
```
DB_HOST=aws-0-eu-central-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.aspcqolpluoyrjfdbrso
DB_PASSWORD=[ВАШ-ПАРОЛЬ-ИЗ-SUPABASE]
```

**JWT секреты** (сгенерируйте новые):
```bash
# Выполните в терминале для генерации:
openssl rand -base64 32  # JWT_SECRET
openssl rand -base64 32  # JWT_REFRESH_SECRET
```

```
JWT_SECRET=[вставьте-сгенерированный-секрет]
JWT_REFRESH_SECRET=[вставьте-второй-секрет]
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
```

**Остальные**:
```
CORS_ORIGIN=*
REDIS_HOST=
REDIS_PORT=
```

6. Нажмите **Create Web Service**
7. Подождите 3-5 минут
8. **Скопируйте URL** вашего бэкенда (будет типа `https://crm-backend-xxx.onrender.com`)

**✓ Backend онлайн!**

---

## 🎨 Шаг 4: Frontend на Vercel (2 минуты)

1. Откройте: https://vercel.com/new
2. Импортируйте репозиторий **crm-system**
3. Настройки:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - Build/Output оставьте по умолчанию

4. **Environment Variables**:
   ```
   VITE_API_URL=[URL-ВАШЕГО-BACKEND-ИЗ-RENDER]/api
   ```
   Например: `https://crm-backend-xxx.onrender.com/api`

5. Нажмите **Deploy**
6. Подождите 2-3 минуты

**✓ Frontend онлайн!**

---

## 🎉 ГОТОВО!

Ваша CRM система задеплоена!

**Откройте ваш Vercel URL и:**
1. Нажмите **"Register"**
2. Создайте аккаунт (первый пользователь будет с ролью admin)
3. Войдите в систему!

---

## 📍 Ваши ссылки:

- 🌐 **Frontend**: https://[ваш-проект].vercel.app
- 🔌 **Backend**: https://crm-backend-xxx.onrender.com  
- 🗄️ **Database**: Supabase (aspcqolpluoyrjfdbrso)
- 📦 **GitHub**: https://github.com/[username]/crm-system

---

## 💡 Подсказки:

**Render засыпает на бесплатном плане:**
- Первый запрос после бездействия займёт ~30-60 секунд
- Для production используйте платный план ($7/мес)

**Логи и мониторинг:**
- Render: Dashboard → Logs
- Vercel: Dashboard → Deployments → View Function Logs
- Supabase: Dashboard → Database → Logs

**Обновление кода:**
```bash
cd ~/crm-system
git add .
git commit -m "Update"
git push
```
Vercel и Render автоматически передеплоят!

---

## 🆘 Проблемы?

**Backend не запускается:**
- Проверьте логи на Render
- Убедитесь что все ENV variables заполнены
- Проверьте Connection String от Supabase

**Frontend показывает ошибку подключения:**
- Проверьте VITE_API_URL в Vercel
- Убедитесь что backend запущен (откройте /health)
- Проверьте CORS_ORIGIN в настройках backend

**База данных не работает:**
- Проверьте что SQL выполнен в Supabase
- Проверьте пароль в DB_PASSWORD
- Проверьте DB_HOST и DB_USER

---

**Удачи! Ваша CRM система готова к работе! 🚀**
