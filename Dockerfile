FROM node:lts-alpine as backend-installer
WORKDIR /app
COPY backend/package.json backend/package-lock.json /app/
RUN npm ci
COPY backend /app

FROM backend-installer as backend-builder
RUN npm run build

FROM backend-installer as backend-dev
ENTRYPOINT [ "npm", "start" ]

FROM node:lts-alpine as backend-runner
WORKDIR /app
COPY --from=backend-builder /app/dist /app/package.json /app/package-lock.json /app/
RUN npm install --only=production
ENTRYPOINT ["node", "main.js"]

FROM node:lts-alpine as frontend-installer
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json /app/
RUN npm ci
COPY frontend /app

FROM frontend-installer as frontend-dev
# install again so that binaries are also installed
RUN npm ci
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM frontend-installer as frontend-builder
RUN npm run build

FROM backend-runner
ENV NODE_ENV=production
COPY --from=frontend-builder /app/dist /app/frontend