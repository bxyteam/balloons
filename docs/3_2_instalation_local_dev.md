---
title: Local / Dev Instalation
nav_order: 2
parent: Instalation
---

# <img style="vertical-align:middle; width: 40px; height:40px;" src="https://raw.githubusercontent.com/bxyteam/satellite-test/refs/heads/main/docs/images/terminal.png"> Local / Dev Instalation

### Apache2

#### Add configuration file to apache2 to enable HTTPS in dev env, need SSL certs

```bash
 sudo bash -c "cat > /etc/apache2/sites-available/browxy_balloons.conf << --EOL
  <VirtualHost *:80>
     RewriteEngine on
     ProxyPreserveHost On
     ServerName balloons.dev.browxy.com
     Redirect permanent / https://balloons.dev.browxy.com/
  </VirtualHost>

  <IfModule mod_ssl.c>
    <VirtualHost *:443>
       RewriteEngine on
       ProxyPreserveHost On
       ServerName balloons.dev.browxy.com
       ProxyPass / http://127.0.0.1:8090/
       ProxyPassReverse / http://127.0.0.1:8090/
       SSLCertificateFile /srv/letsencrypt/live/dev.browxy.com/fullchain.pem
       SSLCertificateKeyFile /srv/letsencrypt/live/dev.browxy.com/privkey.pem
    </VirtualHost>
  </IfModule>
--EOL"
```
* Check server name, port and SSL certificate paths

#### Link conf file

```bash
  sudo ln -sfn /etc/apache2/sites-available/browxy_balloons.conf /etc/apache2/sites-enabled/browxy_balloons.conf
```

#### Add hostname to hosts file

```bash
  sudo bash -c "printf \"127.0.0.1\tballoons.dev.browxy.com\n\" >> /etc/hosts"
```

### Use project script to compile, build and run

###### Go to the root project directory

### Create And Fill Env File (env.dev or env.local)

#### Rename env.example to env.dev or env.local or create new one and fill

```bash
# Docker Server port

SERVER_PORT=8095

# Web URL

BALLOON_URL=https://balloons.dev.browxy.com

# Docker paths

BASE_PATH=/var/balloon/data/web
MAVEN_SETTINGS_PATH=/home/balloon/.m2/settings.xml
MAVEN_REPO_PATH=/home/balloon/.m2

# Github repository configuration

# github repository name
GITHUB_REPO=balloons

# github repository owner (github username)
GITHUB_OWNER=bxyteam

# github personal token
GITHUB_TOKEN=

# path to local repository
LOCAL_REPO_PATH=/var/balloon/data/github

# Inventor
BALLOON_INVENTOR=test

# web configuration

# name of page builder entry point
ENTRY_POINT=wsprx

# admin token (only admin)
TOKEN=

# Cron task to update passes (optional default: 1:30)

# Hour 0-23
SCHEDULE_RUN_HOUR=18

# Minute 0-59
SCHEDULE_RUN_MINUTE=25

# Browxy conf

VIRTUAL_HOST=balloons.dev.browxy.com

VIRTUAL_PORT=8095

INSTALL_MODE=browxy

DOCKER_REGISTRY=docker-registry.teleserver.com.ar

# configuration ID dev | qa | production
balloonConfigId=dev

```

* Add execution permissions
```bash
chmod +x *.sh
```

* Run script > Dev: install_dev.sh or Local: install_local.sh
```bash
./install_dev.sh
```

###### Open the browser and go to https://satellites.dev.browxy.com

* For local go to http://localhost:8095
