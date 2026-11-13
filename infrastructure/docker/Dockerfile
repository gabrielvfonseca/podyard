# syntax=docker/dockerfile:1

# Reproducible Next.js build image for podyard apps.
# Mirrors the Vercel build so any app runs in a container runtime.
#
# Build:  docker build -f infrastructure/docker/Dockerfile \
#          --build-arg APP_DIR=apps/web -t podyard-web .
# Run:    docker run -p 3001:3000 podyard-web
#
# APP_DIR (default apps/web) selects which workspace app to build & serve.

ARG APP_DIR=apps/web

# --- Install & build ------------------------------------------------------
FROM oven/bun:1 AS builder
ARG APP_DIR
WORKDIR /app

# Root install (hoists workspace deps)
COPY package.json bun.lock ./
COPY apps ./apps
COPY packages ./packages
RUN bun install

# Repo config needed by the build
COPY biome.jsonc turbo.json tsconfig.json ./

# Build the selected app (SKIP_ENV_VALIDATION keeps the build env-agnostic)
ENV SKIP_ENV_VALIDATION=true
ENV NEXT_TELEMETRY_DISABLED=1
RUN cd $APP_DIR && bun build

# --- Prune dev deps -------------------------------------------------------
FROM oven/bun:1 AS dep-pruner
ARG APP_DIR
WORKDIR /app
COPY --from=builder /app/package.json /app/bun.lock ./
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/packages ./packages
RUN bun install --production

# --- Runtime ----------------------------------------------------------------
FROM oven/bun:1-slim AS runner
ARG APP_DIR
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root user
RUN useradd --create-home --shell /bin/false podyard
USER podyard

COPY --from=dep-pruner /app ./
COPY --from=builder /app/apps/$APP_DIR/.next ./apps/$APP_DIR/.next
COPY --from=builder /app/apps/$APP_DIR/package.json ./apps/$APP_DIR/
COPY --from=builder /app/apps/$APP_DIR/next.config.ts ./apps/$APP_DIR/

EXPOSE 3000

CMD ["sh", "-c", "bun --cwd $APP_DIR --bun next start"]
