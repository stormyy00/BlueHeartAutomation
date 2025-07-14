# build stage 
FROM node:18-alpine AS build

WORKDIR /server/app

COPY server/package*.json ./
RUN npm ci

COPY server/. .
RUN npm run build

# prod stage
FROM node:18-alpine

WORKDIR /server/app

COPY server/package*.json ./
RUN npm ci --only=production

COPY --from=build /server/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"] 
