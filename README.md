# LLNG Ory REST connector

REST API to connect LemonLDAP::NG (Web SSO) auth backend with Ory Kratos (Cloud native identity infrastructure) & Ory Keto (Permission & role management).

// ICI UN SCHEMA

LemonLDAP::NG require authentication backends to authenticate users. One of the available backends is a REST API.

Ory Kratos is an identity provider. This service is able to authenticate user.

Ory Keto is a permission & role provider. This service is able to tell what an identity can do.

## Run

1. Add in your local DNS configuration the hostnames `kratos.local` & `keto.local`:

  ```
  echo "127.0.0.1   kratos.local keto.local" | sudo tee -a /etc/hosts
  ```

2. Init databases:
  ```
  ./migrate-db.sh
  ```

3. Run the stack:
  ```
  docker-compose up -d
  ```

4. Provide test datas:
  ```
  ./private-test-data.sh
  ```



## LemonLDAP::NG REST Auth Backend

A REST auth backend must provide this endpoints:

### Authentication

HTTP method: POST

Params: { "user": "$user", "password": "$password" }

Return: { "result": true/false, "info": { "lastname": string, "firstname": string, "grafana-role": string, ...} }

### User information

HTTP method: POST

Params: { "user": "$user" }

Return: { "result": true/false, "info": {} }

### Password confirmation

HTTP method: POST

Params: { "user": "$user", "password": "$password" }

Return: { "result": true/false }

### Change password

HTTP method: POST

Params: { "user": "$user", "password": "$password" }

Return: { "result": true/false }

**To update an user password in Ory Kratos, the current user password is required. This function is not available.**


## Links

* LemonLDAP:NG
  * [website](https://lemonldap-ng.org/welcome/)
  * [gitlab](https://gitlab.ow2.org/lemonldap-ng/lemonldap-ng)
* Ory Kratos
  * [github](https://github.com/ory/kratos)
  * [doc](https://www.ory.sh/kratos/docs/)
* Ory Keto
  * [github](https://github.com/ory/keto)
  * [doc](https://www.ory.sh/keto/docs/)
