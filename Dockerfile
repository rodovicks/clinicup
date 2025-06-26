# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Variáveis de ambiente para build
ENV NEXT_TELEMETRY_DISABLED=1

# Build da aplicação
RUN pnpm build

# Etapa de produção
FROM node:20-alpine AS runner

WORKDIR /app

# Instalar dumb-init para melhor gestão de processos
RUN apk add --no-cache dumb-init

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Instalar pnpm
RUN npm install -g pnpm

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar apenas dependências de produção
RUN pnpm install --prod --frozen-lockfile && pnpm store prune

# Copiar arquivos necessários do builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./

# Copiar arquivo de ambiente (se existir)
COPY --chown=nextjs:nodejs .env* ./

# Trocar para usuário não-root
USER nextjs

EXPOSE 3000

# Usar dumb-init para melhor gestão de processos
ENTRYPOINT ["dumb-init", "--"]
CMD ["pnpm", "start"]
