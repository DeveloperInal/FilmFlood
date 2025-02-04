FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app/nestjs/

COPY package.json yarn.lock ./app/nestjs/

RUN yarn install --frozen-lockfile

RUN yarn add -D @nestjs/cli

COPY . .

RUN yarn build

RUN rm -rf ./app/nestjs/src/

EXPOSE 4200

RUN yarn prisma generate

CMD ["node", "dist/main.js"]
