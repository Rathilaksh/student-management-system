FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN npm ci

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
