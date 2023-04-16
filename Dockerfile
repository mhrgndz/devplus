FROM node:latest

WORKDIR /devplus

COPY package*.json ./

RUN npm install -g @nestjs/cli@

RUN npm install

COPY . .

COPY .env .

EXPOSE 3000

CMD ["npm", "start"]