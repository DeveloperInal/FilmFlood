FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock* ./

# Устанавливаем зависимости перед копированием исходников
RUN yarn install --frozen-lockfile --production=false

COPY prisma ./prisma

# Генерируем Prisma клиент ДО сборки приложения
RUN yarn prisma generate

COPY package*.json ./

# Install the application dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN yarn build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]
