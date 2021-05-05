#/bin/bash

# sudo chown 1000:1000 ./src/node_modules
# docker-compose run -u root llng-ory-rest-connector chown node:node /home/node/app/node_modules

docker-compose run llng-ory-rest-connector npm install --dev
