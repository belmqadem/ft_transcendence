FROM node:slim

RUN apt update && apt upgrade -y && apt install -y sqlite3

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

CMD ["npm", "run", "dev"]
