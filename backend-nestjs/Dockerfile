FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app/backend-nestjs/

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

RUN rm -rf ./src

EXPOSE 4200

RUN yarn prisma generate

CMD ["yarn", "prod"]
