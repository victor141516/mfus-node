FROM node:lts-alpine as backend-builder
WORKDIR /app
COPY backend/package.json backend/package-lock.json /app/
RUN npm i
COPY backend /app
RUN npm run build

FROM node:lts-alpine as backend-runner
WORKDIR /app
COPY --from=backend-builder /app/dist /app/package.json /app/package-lock.json /app/
RUN npm install --only=production
ENTRYPOINT ["node", "main.js"]

FROM node:lts-alpine as frontend-builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json /app/
RUN npm i
COPY frontend /app
RUN npm run build

FROM backend-runner
ENV NODE_ENV=production
COPY --from=frontend-builder /app/dist /app/frontend