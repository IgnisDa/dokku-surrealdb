Official Surrealdb "$DOCKER_BIN" image ls does not include postgis extension (amongst others). The following example creates a new surrealdb service using `postgis/postgis:13-3.1` image, which includes the `postgis` extension.

```shell
dokku surrealdb:create postgis-database --image "postgis/postgis" --image-version "13-3.1"
```
