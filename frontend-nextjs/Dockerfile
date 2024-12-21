# Stage 1: Build application
FROM node:20-alpine AS build

WORKDIR /

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Stage 2: Nginx configuration
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

# Copy build output
COPY --from=build /.next . 

# Add custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
