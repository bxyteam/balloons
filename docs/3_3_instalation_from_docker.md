---
title: Instalation From Docker
nav_order: 3
parent: Instalation
---

# <img style="vertical-align:middle; width: 40px; height:40px;" src="https://raw.githubusercontent.com/bxyteam/balloons/refs/heads/main/docs/images/docker.png"> Instalation From Docker

##### To run this application, you must have docker and docker-Compose installed on your computer. Otherwise, visit the Docker website and follow the instructions for your operating system. Next, create a file named docker-compose.yml and another file named env without an extension. Copy the following contents into them.

###### <img style="vertical-align:middle;" src="https://raw.githubusercontent.com/bxyteam/balloons/refs/heads/main/docs/images/file-code.png">  docker-compose.yml
```yml
services:
  satellite:
    image: ghcr.io/bxyteam/balloons:1.0
    env_file:
      - env
    container_name: balloons_wspr
    hostname: balloon
    restart: unless-stopped
    ports:
      - "8091:8095"
    volumes:
      - /var/wspr/balloon:/var/balloon
    ulimits:
      nproc: 524288
      nofile: 524288
```

<br>

*Complete the env file with your credentials if necessary*

###### <img style="vertical-align:middle;" src="https://raw.githubusercontent.com/bxyteam/balloons/refs/heads/main/docs/images/file-code.png">  env
```bash
# Docker Server port

SERVER_PORT=8095

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

# configuration ID dev | qa | production
balloonConfigId=dev
```

<br>

##### Finally run the application with the following command in the terminal

```bash
docker-compose up -d
```
