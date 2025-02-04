FROM node:20-alpine

RUN apk add --no-cache openssl python3 make g++ # Добавляем необходимые пакеты для сборки

WORKDIR /app

COPY package.json yarn.lock* ./

# Устанавливаем зависимости перед копированием исходников
RUN yarn install --frozen-lockfile --production=false # Включаем devDependencies

COPY prisma ./prisma

# Генерируем Prisma клиент ДО сборки приложения
RUN yarn prisma generate

COPY . .

RUN yarn build

# Удаляем devDependencies после сборки
RUN yarn install --production

EXPOSE 4200

CMD ["node", "dist/main.js"]
