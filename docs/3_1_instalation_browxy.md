---
title: Browxy Instalation
nav_order: 1
parent: Instalation
---
# <img style="vertical-align:middle; width: 40px; height:40px;" src="https://raw.githubusercontent.com/bxyteam/balloons/refs/heads/main/docs/images/terminal.png"> Browxy Instalation

### <img style="vertical-align:middle; width:30px; height:30px;" src="https://raw.githubusercontent.com/bxyteam/balloons/refs/heads/main/docs/images/network.png"> Apache2

#### Add configuration file to apache2

```bash
 sudo bash -c "cat > /etc/apache2/sites-available/browxy_balloons.conf << --EOL
  <VirtualHost *:80>
     RewriteEngine on
     ProxyPreserveHost On
     ServerName balloons.browxy.com
     Redirect permanent / https://balloons.browxy.com/
  </VirtualHost>

  <IfModule mod_ssl.c>
    <VirtualHost *:443>
       RewriteEngine on
       ProxyPreserveHost On
       ServerName balloons.browxy.com
       ProxyPass / http://127.0.0.1:8090/
       ProxyPassReverse / http://127.0.0.1:8090/
       SSLCertificateFile /srv/letsencrypt/live/browxy.com/fullchain.pem
       SSLCertificateKeyFile /srv/letsencrypt/live/browxy.com/privkey.pem
    </VirtualHost>
  </IfModule>
--EOL"
```
* Check server name,  port and SSL certificate paths

#### Link conf file

```bash
  sudo ln -sfn /etc/apache2/sites-available/browxy_balloons.conf /etc/apache2/sites-enabled/browxy_balloons.conf
```

#### Add hostname to hosts file

```bash
  sudo bash -c "printf \"127.0.0.1\tballoons.browxy.com\n\" >> /etc/hosts"
```

### <img style="vertical-align:middle; width:30px; height:30px;" src="https://raw.githubusercontent.com/bxyteam/balloons/refs/heads/main/docs/images/cuboid.png"> Build Docker Image

#### Dockerfile

```Dockerfile
FROM %%DOCKER_REGISTRY%%/browxy_compiler_base:latest

ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && \
    apt-get install -y tar gzip xz-utils openjdk-8-jdk maven locales cron git unzip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# grant sudoers privileges
RUN adduser --system --ingroup users --shell /bin/bash --home /home/balloon compiler
RUN echo "compiler ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
RUN echo "Defaults env_keep+=DOCKER_DAEMON_ARGS" >> /etc/sudoers

# create hosts file and backup
RUN cp /etc/hosts /etc/hosts.default
RUN chmod ugo+rw /etc/hosts.default
#RUN chmod ugo+rw /etc/hosts

RUN mkdir -p /home/balloon/application
RUN mkdir -p /home/balloon/.m2
# RUN mkdir -p /home/balloon/.m2/com/browxy
COPY ./target/runnable /home/balloon/application
RUN chown -R compiler:users /home/balloon/application
RUN chown -R compiler:users /home/balloon/.m2
RUN chmod ugo+x /home/balloon/application/*.sh

RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

# Set the default command
CMD ["bash", "-c", "/home/balloon/application/dockerStart.sh"]

```
##### Build Image
```bash
docker build -t browxy_balloon .
```

##### Tag Image
```bash
docker build -t docker-registry.beta.browxy.com/browxy_balloon:latest .
```
- ##### Files and folders copied to the image container:
  - dockerStart.sh (start docker application)
  - start.sh (compile and run java application)
  - stop.sh (stop docker application)
  - .env.*
  - /web (web builder folder that contains the files needed to render the HTML page.)

### <img style="vertical-align:middle; width:30px; height:30px;" src="https://raw.githubusercontent.com/bxyteam/balloons/refs/heads/main/docs/images/container.png">  Create And Run Docker Container

#### docker-compose.yml

```yaml
version: '2'

services:

  balloon:
    image: docker-registry.beta.browxy.com/browxy_balloon:1.0
    env_file:
      - env.prod
    container_name: balloon
    hostname: balloon
    networks:
      - browxy
    restart: unless-stopped
    ports:
      - "8095:8095"
    volumes:
      - /srv/balloon_data:/var/balloon
    ulimits:
      nproc: 524288
      nofile: 524288

networks:
  browxy:
    external: true

```

### Create And Fill Env File (env.prod)

#### env.prod

```bash
# Docker Server port

SERVER_PORT=8095

# Web URL

BALLOON_URL=https://balloons.browxy.com

# Docker paths

BASE_PATH=/var/balloon/data/web
MAVEN_SETTINGS_PATH=/home/balloon/.m2/settings.xml
MAVEN_REPO_PATH=/home/balloon/.m2

# Github repository configuration

# github repository name
GITHUB_REPO=balloons

# github repository owner (github username)
GITHUB_OWNER=

# github personal token
GITHUB_TOKEN=

# path to local repository
LOCAL_REPO_PATH=/var/balloon/data/github

# Inventor
BALLOON_INVENTOR=

# web configuration

# name of page builder entry point
ENTRY_POINT=wsprx

# admin token (only admin)
TOKEN=

# Cron task to update passes (optional default: 1:30)

# Hour 0-23
SCHEDULE_RUN_HOUR=1

# Minute 0-59
SCHEDULE_RUN_MINUTE=30

# Browxy conf

VIRTUAL_HOST=balloons.browxy.com

VIRTUAL_PORT=8095

INSTALL_MODE=browxy

DOCKER_REGISTRY=docker-registry.beta.browxy.com

# configuration ID dev | qa | production
balloonConfigId=production

```

##### Up Docker Container

```bash
docker-compose up -d
```
