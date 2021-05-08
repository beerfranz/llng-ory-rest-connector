FROM node:12.7-alpine

WORKDIR /home/node/app

COPY src/package.json  ./

RUN npm install

COPY src/index.js ./
COPY src/helpers ./helpers
COPY src/middlewares ./middlewares

CMD [ "node", "index.js" ]
