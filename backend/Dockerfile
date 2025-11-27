FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install -g  nodemon

RUN npm install

EXPOSE 3003

CMD ["nodemon"]