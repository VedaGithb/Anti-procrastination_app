# Anti-Procrastination App

Веб-приложение для управления задачами, концентрации и борьбы с прокрастинацией. Сочетает в себе трекинг задач, таймер фокус-сессий (по технике Pomodoro), аналитику продуктивности и систему лидерборда для мотивации.

## Стек технологий

### Frontend
- **React 19** + **Vite** — клиентское SPA
- **React Router** — клиентская маршрутизация
- **Axios** — HTTP-клиент для взаимодействия с API
- **Lucide React** — иконки интерфейса
- **CSS** — модульная стилизация компонентов

### Backend
- **Node.js** + **Express 5** — REST API
- **MongoDB** + **Mongoose 9** — база данных и схемы документов
- **JWT (jsonwebtoken)** — аутентификация по токенам
- **bcrypt** — хеширование паролей
- **cors**, **dotenv** — конфигурация и безопасность

---

## Основной функционал

- **Аутентификация и профиль**: регистрация, вход с выдачей JWT-токена, сохранение сессии в `localStorage`, профиль пользователя.
- **Управление задачами (`/tasks`)**: создание, просмотр, редактирование и закрытие текущих дел.
- **Фокус-таймер (`/timer/:taskId?`)**: сессии концентрации с возможностью привязки таймера к конкретной выбранной задаче.
- **История сессий**: автоматическая фиксация завершенных интервалов работы в базе данных.
- **Дашборд продуктивности (`/dashboard`)**: просмотр метрик и статистики проведенного в фокусе времени.
- **Лидерборд (`/leaderboard`)**: рейтинг пользователей для соревновательного эффекта и поддержания привычки.

---

## Архитектура проекта

```text
Anti-procrastination_app/
├── anti-procrastination-backend/   # Серверная часть (REST API)
│   └── src/
│       ├── controllers/            # Бизнес-логика эндпоинтов
│       ├── middleware/             # Проверка JWT и валидация
│       ├── models/                 # Mongoose-модели (User, Task, Session)
│       ├── routes/                 # Маршруты (/auth, /tasks, /sessions, /user)
│       └── server.js               # Точка входа Express
└── frontend/                       # Клиентская часть (React SPA)
    └── src/
        ├── components/
        │   ├── Dashboard/          # Дашборд статистики
        │   ├── Leaderboard/        # Таблица лидеров
        │   ├── Task/               # Управление задачами
        │   ├── Timer/              # Фокус-таймер
        │   ├── Profile/            # Профиль пользователя
        │   ├── Login.jsx           # Экран входа
        │   └── Registration.jsx    # Экран регистрации
        ├── App.jsx                 # Маршрутизация и Layout
        └── main.jsx
```

---

## Установка и запуск

### 1. Клонирование репозитория
```bash
git clone https://github.com/VedaGithb/Anti-procrastination_app.git
cd Anti-procrastination_app
```

### 2. Настройка бэкенда
Перейдите в папку сервера:
```bash
cd anti-procrastination-backend
npm install
```

Создайте файл `.env` в директории `anti-procrastination-backend`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/anti-procrastination
JWT_SECRET=your_jwt_secret_key
```

Запуск сервера:
```bash
node src/server.js
```
Сервер запустится на порту `3000`.

### 3. Настройка фронтенда
В отдельном окне терминала перейдите в папку клиента:
```bash
cd frontend
npm install
npm run dev
```
Фронтенд запустится на локальном dev-сервере Vite (по умолчанию `http://localhost:5173`).
