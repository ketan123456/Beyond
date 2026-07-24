FROM node:22-alpine AS base
WORKDIR /app

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS build
COPY . .
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
