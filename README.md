# Task Tracker

Простое клиент-серверное приложение для управления задачами.

## Стек

- Frontend: React + TypeScript + Vite/nginx
- Backend: Python + FastAPI + SQLAlchemy 2 ORM
- Database: PostgreSQL

## Конфигурация

В проекте три примера конфигурации:

```text
.env.example              # Docker Compose
backend/.env.example      # локальный запуск backend
frontend/.env.example     # локальный запуск frontend
```

## Быстрый запуск через Docker

1. Создайте `.env` на основе `.env.example`:

Он содержит настройки PostgreSQL и внешние порты контейнеров, настройку CORS. 

Frontend в Docker не содержит адрес backend в JavaScript. Браузер обращается к `/api/...` на том же адресе, где открыт frontend, а nginx проксирует запрос во внутренней Docker-сети:

```text
Browser (http://localhost:8080/api/tasks) -> frontend / nginx (http://backend:8000/api/tasks) -> backend (DATABASE_URL (...@db:5432/...))-> PostgreSQL
```

2. 
Перед первым запуском необходимо запустить PostgreSQL и применить миграции 
Создайте `backend/.env` на основе `backend/.env.example`, затем выполните:
```bash
docker compose up -d db
cd backend
alembic upgrade head
cd ..
```
Теперь бд создана и настроена. Дальше можно пропускать этот шаг.  

3. Далее запустите приложение полностью
```bash
docker compose up --build
```

После запуска:

- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- Health check через backend: http://localhost:8000/health
- Health check через nginx: http://localhost:8080/health

## Локальный запуск backend

1. Сначала должна быть доступна PostgreSQL с необходимыми таблицами, например из Docker Compose.
2. Настройте `backend/.env`
3. Запустите
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Локальный запуск frontend

1. Настройте `frontend/.env`

2. Запустите

```bash
cd frontend
npm install
npm run dev
```

При таком запуске `VITE_API_URL=http://localhost:8000`, поэтому Vite обращается напрямую к указанному backend.

Переменные `VITE_*` подставляются Vite во время сборки frontend. Поэтому для Docker-сценария адрес backend не передаётся через `VITE_API_URL`: связь контейнеров реализована nginx reverse proxy.

## Миграции базы данных

Для управления схемой PostgreSQL используется Alembic.

После изменения SQLAlchemy-моделей необходимо создать новую миграцию:

```bash
alembic revision --autogenerate -m "описание изменения"
```

Затем применить все неприменённые миграции:
```bash
alembic upgrade head
```