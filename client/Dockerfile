FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM caddy
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv