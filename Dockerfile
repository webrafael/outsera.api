FROM node:22.16.0-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"] 