FROM node:20-slim

RUN apt update && apt upgrade -y && apt install -y sqlite3

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production && npm install nodemon

COPY . .

CMD ["npm", "run", "dev"]
