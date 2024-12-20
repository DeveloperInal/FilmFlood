FROM node:20-alpine

WORKDIR /

COPY package.json ./

RUN npm install 

COPY . .

RUN npm run build

EXPOSE 4200

RUN npx prisma generate

CMD [ "npm", "run", "dev" ]
