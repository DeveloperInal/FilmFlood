FROM node:20-alpine

WORKDIR /

COPY package.json yarn.lock ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

EXPOSE 4200

RUN npx prisma generate

CMD [ "npm", "run", "dev" ]
