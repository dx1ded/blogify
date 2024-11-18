FROM node:22-alpine AS base

# Installing sharp as it's required by standalone nextjs
FROM base AS deps
WORKDIR /app

RUN npm install -g sharp@0.33.0-rc.2

FROM base AS runner

RUN apk add --no-cache libc6-compat
WORKDIR /app


# Setting other environment variables

ARG DB_URL

ENV NODE_ENV=production
ENV DB_URL=${DB_URL}
ENV NEXTAUTH_URL=https://blogify.vovados.com

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY ./public ./public
COPY ./.next/static ./.next/static

# Set the correct permission for prerender cache
RUN chown -R nextjs:nodejs ./.next

COPY --chown=nextjs:nodejs ./.next/standalone ./

# Copying installed sharp
COPY --from=deps --chown=nextjs:nodejs /usr/local/lib/node_modules/sharp /usr/local/lib/node_modules/sharp
ENV NEXT_SHARP_PATH=/usr/local/lib/node_modules/sharp

# Serving

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
