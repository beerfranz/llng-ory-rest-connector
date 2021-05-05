#/bin/bash

./provide-test-data.sh

error=0

unknown_user=$(curl -s http://localhost:4400/auth -d "user=unknown" -d "password=thisIsFake" | jq -r .result)
if [[ "$unknown_user" != "false" ]]; then
  echo "Test bad user: Failed"
  echo "$unknown_user"
  error=1
fi

bad_password=$(curl -s http://localhost:4400/auth -d "user=i-have-no-acl@gmas.com" -d "password=thisIsBadFake" | jq -r .result)
if [[ "$bad_password" != "false" ]]; then
  echo "Test bad password: Failed"
  echo "$bad_password"
  error=1
fi

good_password=$(curl -s http://localhost:4400/auth -d "user=i-have-no-acl@gmas.com" -d "password=thisIsFake" | jq -r .result)
if [[ "$good_password" != "true" ]]; then
  echo "Test good password: Failed"
  echo "$good_password"
  error=1
fi

test_acl=$(curl -s http://localhost:4400/auth -d "user=admin@youpi.eu" -d "password=thisIsFake" | jq -r .info.acl_manager_manager)
if [[ "$test_acl" != "admin" ]]; then
  echo "Test ACL: Failed"
  echo "$test_acl"
  error=1
fi

if [ $error -eq 0 ]; then
  echo "Tests OK"
fi

exit $error
