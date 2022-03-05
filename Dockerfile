FROM node:14

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm install pm2 -g

RUN npm run build

EXPOSE 3000

CMD ["pm2-runtime","dist/index.js"]