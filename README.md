# dokku surrealdb

Unofficial surrealdb plugin for dokku. Currently defaults to installing [surrealdb/surrealdb nightly](https://hub.docker.com/r/surrealdb/surrealdb/).

## Requirements

- dokku 0.19.x+
- docker 1.8.x

## Installation

```shell
# on 0.19.x+
sudo dokku plugin:install https://github.com/ignisda/dokku-surrealdb.git surrealdb
```

## Commands

```
surrealdb:app-links <app>                          # list all surrealdb service links for a given app
surrealdb:backup <service> <bucket-name> [--use-iam] # create a backup of the surrealdb service to an existing s3 bucket
surrealdb:backup-auth <service> <aws-access-key-id> <aws-secret-access-key> <aws-default-region> <aws-signature-version> <endpoint-url> # set up authentication for backups on the surrealdb service
surrealdb:backup-deauth <service>                  # remove backup authentication for the surrealdb service
surrealdb:backup-schedule <service> <schedule> <bucket-name> [--use-iam] # schedule a backup of the surrealdb service
surrealdb:backup-schedule-cat <service>            # cat the contents of the configured backup cronfile for the service
surrealdb:backup-set-encryption <service> <passphrase> # set encryption for all future backups of surrealdb service
surrealdb:backup-unschedule <service>              # unschedule the backup of the surrealdb service
surrealdb:backup-unset-encryption <service>        # unset encryption for future backups of the surrealdb service
surrealdb:clone <service> <new-service> [--clone-flags...] # create container <new-name> then copy data from <name> into <new-name>
surrealdb:connect <service>                        # connect to the service via the surrealdb connection tool
surrealdb:create <service> [--create-flags...]     # create a surrealdb service
surrealdb:destroy <service> [-f|--force]           # delete the surrealdb service/data/container if there are no links left
surrealdb:exists <service>                         # check if the surrealdb service exists
surrealdb:export <service>                         # export a dump of the surrealdb service database
surrealdb:expose <service> <ports...>              # expose a surrealdb service on custom host:port if provided (random port on the 0.0.0.0 interface if otherwise unspecified)
surrealdb:import <service>                         # import a dump into the surrealdb service database
surrealdb:info <service> [--single-info-flag]      # print the service information
surrealdb:link <service> <app> [--link-flags...]   # link the surrealdb service to the app
surrealdb:linked <service> <app>                   # check if the surrealdb service is linked to an app
surrealdb:links <service>                          # list all apps linked to the surrealdb service
surrealdb:list                                     # list all surrealdb services
surrealdb:logs <service> [-t|--tail] <tail-num-optional> # print the most recent log(s) for this service
surrealdb:pause <service>                          # pause a running surrealdb service
surrealdb:promote <service> <app>                  # promote service <service> as SURREAL_URL in <app>
surrealdb:restart <service>                        # graceful shutdown and restart of the surrealdb service container
surrealdb:set <service> <key> <value>              # set or clear a property for a service
surrealdb:start <service>                          # start a previously stopped surrealdb service
surrealdb:stop <service>                           # stop a running surrealdb service
surrealdb:unexpose <service>                       # unexpose a previously exposed surrealdb service
surrealdb:unlink <service> <app>                   # unlink the surrealdb service from the app
surrealdb:upgrade <service> [--upgrade-flags...]   # upgrade service <service> to the specified versions
```

## Usage

Help for any commands can be displayed by specifying the command as an argument to surrealdb:help. Plugin help output in conjunction with any files in the `docs/` folder is used to generate the plugin documentation. Please consult the `surrealdb:help` command for any undocumented commands.

### Basic Usage

### create a surrealdb service

```shell
# usage
dokku surrealdb:create <service> [--create-flags...]
```

flags:

- `-c|--config-options "--args --go=here"`: extra arguments to pass to the container create command (default: `None`)
- `-C|--custom-env "USER=alpha;HOST=beta"`: semi-colon delimited environment variables to start the service with
- `-i|--image IMAGE`: the image name to start the service with
- `-I|--image-version IMAGE_VERSION`: the image version to start the service with
- `-m|--memory MEMORY`: container memory limit in megabytes (default: unlimited)
- `-N|--initial-network INITIAL_NETWORK`: the initial network to attach the service to
- `-p|--password PASSWORD`: override the user-level service password
- `-P|--post-create-network NETWORKS`: a comman-separated list of networks to attach the service container to after service creation
- `-r|--root-password PASSWORD`: override the root-level service password
- `-S|--post-start-network NETWORKS`: a comman-separated list of networks to attach the service container to after service start
- `-s|--shm-size SHM_SIZE`: override shared memory size for surrealdb docker container

Create a surrealdb service named lollipop:

```shell
dokku surrealdb:create lollipop
```

You can also specify the image and image version to use for the service. It *must* be compatible with the surrealdb/surrealdb image.

```shell
export SURREALDB_IMAGE="surrealdb/surrealdb"
export SURREALDB_IMAGE_VERSION="${PLUGIN_IMAGE_VERSION}"
dokku surrealdb:create lollipop
```

You can also specify custom environment variables to start the surrealdb service in semi-colon separated form.

```shell
export SURREALDB_CUSTOM_ENV="USER=alpha;HOST=beta"
dokku surrealdb:create lollipop
```

### print the service information

```shell
# usage
dokku surrealdb:info <service> [--single-info-flag]
```

flags:

- `--config-dir`: show the service configuration directory
- `--data-dir`: show the service data directory
- `--dsn`: show the service DSN
- `--exposed-ports`: show service exposed ports
- `--id`: show the service container id
- `--internal-ip`: show the service internal ip
- `--initial-network`: show the initial network being connected to
- `--links`: show the service app links
- `--post-create-network`: show the networks to attach to after service container creation
- `--post-start-network`: show the networks to attach to after service container start
- `--service-root`: show the service root directory
- `--status`: show the service running status
- `--version`: show the service image version

Get connection information as follows:

```shell
dokku surrealdb:info lollipop
```

You can also retrieve a specific piece of service info via flags:

```shell
dokku surrealdb:info lollipop --config-dir
dokku surrealdb:info lollipop --data-dir
dokku surrealdb:info lollipop --dsn
dokku surrealdb:info lollipop --exposed-ports
dokku surrealdb:info lollipop --id
dokku surrealdb:info lollipop --internal-ip
dokku surrealdb:info lollipop --initial-network
dokku surrealdb:info lollipop --links
dokku surrealdb:info lollipop --post-create-network
dokku surrealdb:info lollipop --post-start-network
dokku surrealdb:info lollipop --service-root
dokku surrealdb:info lollipop --status
dokku surrealdb:info lollipop --version
```

### list all surrealdb services

```shell
# usage
dokku surrealdb:list 
```

List all services:

```shell
dokku surrealdb:list
```

### print the most recent log(s) for this service

```shell
# usage
dokku surrealdb:logs <service> [-t|--tail] <tail-num-optional>
```

flags:

- `-t|--tail [<tail-num>]`: do not stop when end of the logs are reached and wait for additional output

You can tail logs for a particular service:

```shell
dokku surrealdb:logs lollipop
```

By default, logs will not be tailed, but you can do this with the --tail flag:

```shell
dokku surrealdb:logs lollipop --tail
```

The default tail setting is to show all logs, but an initial count can also be specified:

```shell
dokku surrealdb:logs lollipop --tail 5
```

### link the surrealdb service to the app

```shell
# usage
dokku surrealdb:link <service> <app> [--link-flags...]
```

flags:

- `-a|--alias "BLUE_DATABASE"`: an alternative alias to use for linking to an app via environment variable
- `-q|--querystring "pool=5"`: ampersand delimited querystring arguments to append to the service link
- `-n|--no-restart "false"`: whether or not to restart the app on link (default: true)

A surrealdb service can be linked to a container. This will use native docker links via the docker-options plugin. Here we link it to our `playground` app.

> NOTE: this will restart your app

```shell
dokku surrealdb:link lollipop playground
```

The following environment variables will be set automatically by docker (not on the app itself, so they won’t be listed when calling dokku config):

```
DOKKU_SURREALDB_LOLLIPOP_NAME=/lollipop/DATABASE
DOKKU_SURREALDB_LOLLIPOP_PORT=tcp://172.17.0.1:8000
DOKKU_SURREALDB_LOLLIPOP_PORT_8000_TCP=tcp://172.17.0.1:8000
DOKKU_SURREALDB_LOLLIPOP_PORT_8000_TCP_PROTO=tcp
DOKKU_SURREALDB_LOLLIPOP_PORT_8000_TCP_PORT=8000
DOKKU_SURREALDB_LOLLIPOP_PORT_8000_TCP_ADDR=172.17.0.1
```

The following will be set on the linked application by default:

```
SURREAL_URL=dokku-surrealdb-lollipop:8000
SURREAL_USER=SOME_USER
SURREAL_PASS=SOME_PASSWORD
```

> NOTE: Since surrealdb can be connected to using multiple schemes, it is not a part of the config url set. Instead you have to specify it manually while connecting to the database. You can find a sample in the [example](https://github.com/IgnisDa/dokku-surrealdb/blob/392a858abf639599718a88303edfa769aba9b194/example/src/index.ts#L23) app present in the repository.

The host exposed here only works internally in docker containers. If you want your container to be reachable from outside, you should use the `expose` subcommand. Another service can be linked to your app:

```shell
dokku surrealdb:link other_service playground
```

### unlink the surrealdb service from the app

```shell
# usage
dokku surrealdb:unlink <service> <app>
```

flags:

- `-n|--no-restart "false"`: whether or not to restart the app on unlink (default: true)

You can unlink a surrealdb service:

> NOTE: this will restart your app and unset related environment variables

```shell
dokku surrealdb:unlink lollipop playground
```

### set or clear a property for a service

```shell
# usage
dokku surrealdb:set <service> <key> <value>
```

Set the network to attach after the service container is started:

```shell
dokku surrealdb:set lollipop post-create-network custom-network
```

Set multiple networks:

```shell
dokku surrealdb:set lollipop post-create-network custom-network,other-network
```

Unset the post-create-network value:

```shell
dokku surrealdb:set lollipop post-create-network
```

### Service Lifecycle

The lifecycle of each service can be managed through the following commands:

### connect to the service via the surrealdb connection tool

```shell
# usage
dokku surrealdb:connect <service>
```

Connect to the service via the surrealdb connection tool:

> NOTE: disconnecting from ssh while running this command may leave zombie processes due to moby/moby#9098

```shell
dokku surrealdb:connect lollipop
```

### expose a surrealdb service on custom host:port if provided (random port on the 0.0.0.0 interface if otherwise unspecified)

```shell
# usage
dokku surrealdb:expose <service> <ports...>
```

Expose the service on the service's normal ports, allowing access to it from the public interface (`0.0.0.0`):

```shell
dokku surrealdb:expose lollipop 8000
```

Expose the service on the service's normal ports, with the first on a specified ip adddress (127.0.0.1):

```shell
dokku surrealdb:expose lollipop 127.0.0.1:8000
```

### unexpose a previously exposed surrealdb service

```shell
# usage
dokku surrealdb:unexpose <service>
```

Unexpose the service, removing access to it from the public interface (`0.0.0.0`):

```shell
dokku surrealdb:unexpose lollipop
```

### promote service <service> as SURREAL_URL in <app>

```shell
# usage
dokku surrealdb:promote <service> <app>
```

If you have a surrealdb service linked to an app and try to link another surrealdb service another link environment variable will be generated automatically:

```
DOKKU_SURREAL_BLUE_URL=http://other_service:ANOTHER_PASSWORD@dokku-surrealdb-other-service:8000/other_service
```

You can promote the new service to be the primary one:

> NOTE: this will restart your app

```shell
dokku surrealdb:promote other_service playground
```

This will replace `SURREAL_URL` with the url from other_service and generate another environment variable to hold the previous value if necessary. You could end up with the following for example:

```
SURREAL_URL=http://other_service:ANOTHER_PASSWORD@dokku-surrealdb-other-service:8000/other_service
DOKKU_SURREAL_BLUE_URL=http://other_service:ANOTHER_PASSWORD@dokku-surrealdb-other-service:8000/other_service
DOKKU_SURREAL_SILVER_URL=http://lollipop:SOME_PASSWORD@dokku-surrealdb-lollipop:8000/lollipop
```

### start a previously stopped surrealdb service

```shell
# usage
dokku surrealdb:start <service>
```

Start the service:

```shell
dokku surrealdb:start lollipop
```

### stop a running surrealdb service

```shell
# usage
dokku surrealdb:stop <service>
```

Stop the service and removes the running container:

```shell
dokku surrealdb:stop lollipop
```

### pause a running surrealdb service

```shell
# usage
dokku surrealdb:pause <service>
```

Pause the running container for the service:

```shell
dokku surrealdb:pause lollipop
```

### graceful shutdown and restart of the surrealdb service container

```shell
# usage
dokku surrealdb:restart <service>
```

Restart the service:

```shell
dokku surrealdb:restart lollipop
```

### upgrade service <service> to the specified versions

```shell
# usage
dokku surrealdb:upgrade <service> [--upgrade-flags...]
```

flags:

- `-c|--config-options "--args --go=here"`: extra arguments to pass to the container create command (default: `None`)
- `-C|--custom-env "USER=alpha;HOST=beta"`: semi-colon delimited environment variables to start the service with
- `-i|--image IMAGE`: the image name to start the service with
- `-I|--image-version IMAGE_VERSION`: the image version to start the service with
- `-N|--initial-network INITIAL_NETWORK`: the initial network to attach the service to
- `-P|--post-create-network NETWORKS`: a comman-separated list of networks to attach the service container to after service creation
- `-R|--restart-apps "true"`: whether or not to force an app restart (default: false)
- `-S|--post-start-network NETWORKS`: a comman-separated list of networks to attach the service container to after service start
- `-s|--shm-size SHM_SIZE`: override shared memory size for surrealdb docker container

You can upgrade an existing service to a new image or image-version:

```shell
dokku surrealdb:upgrade lollipop
```

Surrealdb does not handle upgrading data for major versions automatically (eg. 11 => 12). Upgrades should be done manually. Users are encouraged to upgrade to the latest minor release for their surrealdb version before performing a major upgrade.

While there are many ways to upgrade a surrealdb database, for safety purposes, it is recommended that an upgrade is performed by exporting the data from an existing database and importing it into a new database. This also allows testing to ensure that applications interact with the database correctly after the upgrade, and can be used in a staging environment.

The following is an example of how to upgrade a surrealdb database named `lollipop-11` from 11.13 to 12.8.

```shell
# stop any linked apps
dokku ps:stop linked-app

# export the database contents
dokku surrealdb:export lollipop-11 > /tmp/lollipop-11.export

# create a new database at the desired version
dokku surrealdb:create lollipop-12 --image-version 12.8

# import the export file
dokku surrealdb:import lollipop-12 < /tmp/lollipop-11.export

# run any sql tests against the new database to verify the import went smoothly

# unlink the old database from your apps
dokku surrealdb:unlink lollipop-11 linked-app

# link the new database to your apps
dokku surrealdb:link lollipop-12 linked-app

# start the linked apps again
dokku ps:start linked-app
```

### Service Automation

Service scripting can be executed using the following commands:

### list all surrealdb service links for a given app

```shell
# usage
dokku surrealdb:app-links <app>
```

List all surrealdb services that are linked to the `playground` app.

```shell
dokku surrealdb:app-links playground
```

### create container <new-name> then copy data from <name> into <new-name>

```shell
# usage
dokku surrealdb:clone <service> <new-service> [--clone-flags...]
```

flags:

- `-c|--config-options "--args --go=here"`: extra arguments to pass to the container create command (default: `None`)
- `-C|--custom-env "USER=alpha;HOST=beta"`: semi-colon delimited environment variables to start the service with
- `-i|--image IMAGE`: the image name to start the service with
- `-I|--image-version IMAGE_VERSION`: the image version to start the service with
- `-m|--memory MEMORY`: container memory limit in megabytes (default: unlimited)
- `-N|--initial-network INITIAL_NETWORK`: the initial network to attach the service to
- `-p|--password PASSWORD`: override the user-level service password
- `-P|--post-create-network NETWORKS`: a comman-separated list of networks to attach the service container to after service creation
- `-r|--root-password PASSWORD`: override the root-level service password
- `-S|--post-start-network NETWORKS`: a comman-separated list of networks to attach the service container to after service start
- `-s|--shm-size SHM_SIZE`: override shared memory size for surrealdb docker container

You can clone an existing service to a new one:

```shell
dokku surrealdb:clone lollipop lollipop-2
```

### check if the surrealdb service exists

```shell
# usage
dokku surrealdb:exists <service>
```

Here we check if the lollipop surrealdb service exists.

```shell
dokku surrealdb:exists lollipop
```

### check if the surrealdb service is linked to an app

```shell
# usage
dokku surrealdb:linked <service> <app>
```

Here we check if the lollipop surrealdb service is linked to the `playground` app.

```shell
dokku surrealdb:linked lollipop playground
```

### list all apps linked to the surrealdb service

```shell
# usage
dokku surrealdb:links <service>
```

List all apps linked to the `lollipop` surrealdb service.

```shell
dokku surrealdb:links lollipop
```

### Data Management

The underlying service data can be imported and exported with the following commands:

### import a dump into the surrealdb service database

```shell
# usage
dokku surrealdb:import <service>
```

Import a datastore dump:

```shell
dokku surrealdb:import lollipop < data.dump
```

### export a dump of the surrealdb service database

```shell
# usage
dokku surrealdb:export <service>
```

By default, datastore output is exported to stdout:

```shell
dokku surrealdb:export lollipop --ns myapp --db mydb
```

You can redirect this output to a file:

```shell
dokku surrealdb:export lollipop --ns myapp --db mydb > data.dump
```

Note that the export option requires additional arguments to work correctly. All arguments
are passed as it is to the service. Please take a look at the Surrealdb export
[documentation](https://surrealdb.com/docs/cli/export) to see the other available options.

### Backups

Datastore backups are supported via AWS S3 and S3 compatible services like [minio](https://github.com/minio/minio).

You may skip the `backup-auth` step if your dokku install is running within EC2 and has access to the bucket via an IAM profile. In that case, use the `--use-iam` option with the `backup` command.

Backups can be performed using the backup commands:

### set up authentication for backups on the surrealdb service

```shell
# usage
dokku surrealdb:backup-auth <service> <aws-access-key-id> <aws-secret-access-key> <aws-default-region> <aws-signature-version> <endpoint-url>
```

Setup s3 backup authentication:

```shell
dokku surrealdb:backup-auth lollipop AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY
```

Setup s3 backup authentication with different region:

```shell
dokku surrealdb:backup-auth lollipop AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_REGION
```

Setup s3 backup authentication with different signature version and endpoint:

```shell
dokku surrealdb:backup-auth lollipop AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_REGION AWS_SIGNATURE_VERSION ENDPOINT_URL
```

More specific example for minio auth:

```shell
dokku surrealdb:backup-auth lollipop MINIO_ACCESS_KEY_ID MINIO_SECRET_ACCESS_KEY us-east-1 s3v4 https://YOURMINIOSERVICE
```

### remove backup authentication for the surrealdb service

```shell
# usage
dokku surrealdb:backup-deauth <service>
```

Remove s3 authentication:

```shell
dokku surrealdb:backup-deauth lollipop
```

### create a backup of the surrealdb service to an existing s3 bucket

```shell
# usage
dokku surrealdb:backup <service> <bucket-name> [--use-iam]
```

flags:

- `-u|--use-iam`: use the IAM profile associated with the current server

Backup the `lollipop` service to the `my-s3-bucket` bucket on `AWS`:`

```shell
dokku surrealdb:backup lollipop my-s3-bucket --use-iam
```

Restore a backup file (assuming it was extracted via `tar -xf backup.tgz`):

```shell
dokku surrealdb:import lollipop < backup-folder/export
```

### set encryption for all future backups of surrealdb service

```shell
# usage
dokku surrealdb:backup-set-encryption <service> <passphrase>
```

Set the GPG-compatible passphrase for encrypting backups for backups:

```shell
dokku surrealdb:backup-set-encryption lollipop
```

### unset encryption for future backups of the surrealdb service

```shell
# usage
dokku surrealdb:backup-unset-encryption <service>
```

Unset the `GPG` encryption passphrase for backups:

```shell
dokku surrealdb:backup-unset-encryption lollipop
```

### schedule a backup of the surrealdb service

```shell
# usage
dokku surrealdb:backup-schedule <service> <schedule> <bucket-name> [--use-iam]
```

flags:

- `-u|--use-iam`: use the IAM profile associated with the current server

Schedule a backup:

> 'schedule' is a crontab expression, eg. "0 3 * * *" for each day at 3am

```shell
dokku surrealdb:backup-schedule lollipop "0 3 * * *" my-s3-bucket
```

Schedule a backup and authenticate via iam:

```shell
dokku surrealdb:backup-schedule lollipop "0 3 * * *" my-s3-bucket --use-iam
```

### cat the contents of the configured backup cronfile for the service

```shell
# usage
dokku surrealdb:backup-schedule-cat <service>
```

Cat the contents of the configured backup cronfile for the service:

```shell
dokku surrealdb:backup-schedule-cat lollipop
```

### unschedule the backup of the surrealdb service

```shell
# usage
dokku surrealdb:backup-unschedule <service>
```

Remove the scheduled backup from cron:

```shell
dokku surrealdb:backup-unschedule lollipop
```

### Disabling `docker image pull` calls

If you wish to disable the `docker image pull` calls that the plugin triggers, you may set the `SURREALDB_DISABLE_PULL` environment variable to `true`. Once disabled, you will need to pull the service image you wish to deploy as shown in the `stderr` output.

Please ensure the proper images are in place when `docker image pull` is disabled.
