#/bin/bash

echo "Start databases..."

docker-compose up -d kratos-db keto-db

sleep 5

echo "Run migrate scripts for Kratos & Keto"

docker-compose run kratos -c /etc/config/kratos/kratos.yml migrate sql -e --yes

docker-compose run keto -c /etc/config/keto/keto.yml migrate up --yes --all-namespaces

