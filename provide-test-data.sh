#/bin/bash

docker-compose up -d

# Create user toto@gmas.com:thisIsFake
flow=$(curl -s http://kratos.local:4433/self-service/registration/api | jq -r .methods.password.config.action)

id=$(curl -s -H "Content-Type: application/json" ${flow} \
  -d '{ "traits.email": "toto@gmas.com", "password": "thisIsFake" }' \
  | jq -r .identity.id)

