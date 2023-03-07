#!/bin/bash
pushd /var/lib/surrealdb/data >/dev/null
openssl req -new -newkey rsa:4096 -x509 -days 365000 -nodes -out server.crt -keyout server.key -batch
chmod 600 server.key
sed -i "s/^#ssl = off/ssl = on/" surrealdb.conf
sed -i "s/^#ssl_ciphers =.*/ssl_ciphers = 'AES256+EECDH:AES256+EDH'/" surrealdb.conf
popd >/dev/null
