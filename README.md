# Test RGB Web - CRUD додаток для управління клієнтами та угодами

Цей проект є тестовим.

## Опис

- Фронтенд: Next.js + ShadCN/UI
- Бекенд: NestJS + TypeORM
- База даних: PostgreSQL

## Інструкція по запуску

1. Клонуйте репозиторій:

   ```bash
   git clone https://github.com/VitalikM95/test-rgb-web.git
   cd test-rgb-web
   ```

### 1. Підготовка бази даних (PostgreSQL)

1. Встановіть PostgreSQL.

2. Створіть нову базу:

   ```bash
   psql -U postgres
   CREATE DATABASE app;
   \q
   ```

3. Перейдіть до папки /server

   ```bash
   cd server
   ```

4. Створіть у корені папки /server файл .env з таким вмістом:

   ```bash
   PORT=3000
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=app
   DATABASE_SYNCHRONIZE=false
   FRONTEND_URL=http://localhost:3001
   ```

### 2. Запуск бекенду

Знаходячись в папці /server виконайте команди

    ```bash
    npm install
    npm run migration:run
    npm run start:dev
    ```

Бекенд буде доступний за адресою: http://localhost:3000
Swagger документація: http://localhost:3000/docs

### 3. Запуск фронтенду

Перейдіть до папки /client

    ```bash
    cd ../client
    ```

Знаходячись в папці /client виконайте команди

    ```bash
    npm install
    npm run dev
    ```

Фронтенд працює на: http://localhost:3001 - За даним посиланням буде доступний функціонал додатку

## Репозиторій

https://github.com/VitalikM95/test-rgb-web.git
