FROM node:18-alpine

WORKDIR /app/admin-frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
