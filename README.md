# Skyway Web App

Полноценное веб‑приложение для поиска рейсов и управления бронированиями.

## Архитектура
- **Frontend**: React (Create React App), React Router
- **Backend**: Spring Boot (Data JPA, Security, Validation, Web MVC)
- **База данных**: PostgreSQL
- **Контейнеризация**: Docker Compose (postgres + backend + frontend)

## Требования
- JDK 17+
- Maven 3.9+
- Node.js 18+ (LTS) и npm 9+
- Docker и Docker Compose (для контейнеров)

## Быстрый старт (Docker)
Запустит PostgreSQL, backend и frontend:

```bash
# из корня репозитория
docker compose up --build
```

- Backend: http://localhost:8080
- Frontend: http://localhost:3000
- PostgreSQL: localhost:5432 (db: `skyway_db`, user: `postgres`, password: `postgres`)

Остановить:
```bash
docker compose down
```

## Локальный запуск без Docker

### 1) База данных
Создайте локальную БД PostgreSQL и пользователя, либо используйте docker‑контейнер из compose только для БД:

```bash
docker compose up -d postgres
```

Параметры по умолчанию для локального запуска backend берутся из `backend/src/main/resources/application.yaml`:
- `spring.datasource.url=jdbc:postgresql://localhost:5432/${DB_NAME:skyway_db}`
- `spring.datasource.username=${DB_USERNAME:postgres}`
- `spring.datasource.password=${DB_PASSWORD:postgres}`

Миграции выполняются Flyway автоматически при старте приложения (см. раздел «Миграции»).

Вы можете переопределить переменные окружения `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`.

### 2) Backend (Spring Boot)

```bash
# из папки backend
mvn spring-boot:run
```

Настройки по умолчанию:
- Порт: `8080`
- Контекст: `/`
- JPA: `hibernate.ddl-auto=none` (схема управляется миграциями Flyway)

### 3) Frontend (React)

```bash
# из папки frontend/skyway-app
npm install
npm start
```

Скрипты из `package.json`:
- `start` — запуск dev‑сервера (порт 3000)
- `build` — production‑сборка
- `test` — тесты CRA

## Переменные окружения

Backend (`application.yaml`):
- `DB_NAME` — имя БД (по умолчанию `skyway_db`)
- `DB_USERNAME` — пользователь БД (по умолчанию `postgres`)
- `DB_PASSWORD` — пароль БД (по умолчанию `postgres`)
- `SERVER_PORT` — порт сервера (по умолчанию `8080`)
- `app.jwt.secret` — секрет для JWT (`secret_key` может приходить из переменных окружения)
- `app.jwt.expiration` — время жизни токена в мс (по умолчанию `86400000`)

Docker Compose выставляет:
- `SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/skyway_db`
- `SPRING_DATASOURCE_USERNAME=postgres`
- `SPRING_DATASOURCE_PASSWORD=postgres`

## Миграции базы данных
Используется Flyway. Hibernate авто‑DDL отключён: `spring.jpa.hibernate.ddl-auto=none`.

- Путь к миграциям: `backend/src/main/resources/db/migration`
- Базовая миграция: `V1__init.sql` (создаёт таблицы `users`, `passengers`, `airports`, `airplanes`, `flights`, `bookings`, `bookings_passengers` и необходимые внешние ключи/уникальные ограничения).
- Flyway применяет миграции автоматически при старте backend.

Добавление новой миграции:
1. Создайте файл `backend/src/main/resources/db/migration/V2__<описание>.sql`.
2. Опишите изменения схемы SQL‑скриптом.
3. Перезапустите backend — Flyway применит миграцию.

## Полезные ссылки
- Backend: `backend/`
- Frontend: `frontend/skyway-app/`
- Docker Compose: `docker-compose.yml`

## Dockerfiles
- Backend Dockerfile: `backend/Dockerfile`
- Frontend Dockerfile: `frontend/skyway-app/Dockerfile`

Compose билдит фронтенд из `frontend/skyway-app` (см. секцию `build` в `docker-compose.yml`).

## Частые проблемы
- Порт 5432 уже занят: остановите локальный PostgreSQL или измените порт в compose.
- React dev‑сервер не открывается: проверьте, что backend запущен и CORS настроен при необходимости.

## Лицензия
Проект для внутреннего использования. Уточните условия лицензирования при публикации.
