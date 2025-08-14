# Multi-stage build
# Stage 1: Build the frontend
FROM node:20-slim AS build-stage

WORKDIR /app

COPY client/package*.json ./
RUN npm install

COPY client/ ./
RUN npm run build

# Stage 2: Nginx server
FROM nginx:alpine

RUN apk add --no-cache openssl

COPY client/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

RUN mkdir -p /etc/ssl/private /etc/ssl/certs

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/nginx-key.pem \
    -out /etc/ssl/certs/nginx-cert.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
