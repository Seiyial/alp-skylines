# Stage 0: Build the backend
FROM ubuntu:22.04 AS builder
RUN apt-get update 
RUN apt-get install -y curl gnupg zip unzip openssl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs
ENV BUN_INSTALL=$HOME/bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH=$PATH:$HOME/bun/bin

WORKDIR /app/backend
COPY bun.lock package.json ./
RUN bun install
COPY prisma ./prisma
RUN bun db
COPY . .

# Start both backend and Caddy server
CMD ["bun", "db-deploy-and-start"]