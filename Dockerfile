# Stage 0: Build the backend
FROM ubuntu:22.04 AS builder
RUN apt-get update 
RUN apt-get install -y curl gnupg zip unzip openssl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs
ENV BUN_INSTALL=$HOME/bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH=$PATH:$HOME/bun/bin

WORKDIR /app/backend
COPY backend/ .
RUN bun install
RUN bun db

WORKDIR /app/frontend
COPY frontend/ .

ARG FRONTEND_PUBLIC_API_URL

RUN bun install
RUN bun run build

# Stage 3: Setup Caddy server
FROM caddy:alpine

WORKDIR /app
COPY --from=builder /app/frontend/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile

# Start both backend and Caddy server
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]