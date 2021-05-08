#/bin/bash

docker-compose down -v

./migrate-db.sh

docker-compose run llng-ory-rest-connector npm install --dev

docker-compose up -d

sleep 10

echo "Create user i-have-no-acl@gmas.com (password: thisIsFake) without rights"
flow=$(curl -s http://kratos.local:4433/self-service/registration/api | jq -r .methods.password.config.action)

user_without_acl_id=$(curl -s -H "Content-Type: application/json" ${flow} \
  -d '{ "traits.email": "i-have-no-acl@gmas.com", "password": "thisIsFake" }' \
  | jq -r .identity.id)

echo "Create user admin@youpi.eu (password: thisIsFake) with admon on manager:manager"
flow=$(curl -s http://kratos.local:4433/self-service/registration/api | jq -r .methods.password.config.action)

admin_id=$(curl -s -H "Content-Type: application/json" ${flow} \
  -d '{ "traits.email": "admin@youpi.eu", "password": "thisIsFake" }' \
  | jq -r .identity.id)

admin_rights=$(curl -s -X PUT -H "Content-Type: application/json" http://keto.local:4467/relation-tuples \
  -d "{ \"namespace\": \"manager\", \"object\": \"manager\", \"relation\": \"admin\", \"subject\": \"${admin_id}\" }")

