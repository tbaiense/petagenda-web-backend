# syntax=docker/dockerfile:1

FROM node:24.3-bookworm

EXPOSE 3000

ARG DEBIAN_FRONTEND=noninteractive

ENV API_PATH="/petagenda"
ENV BIND_ADDRESS="0.0.0.0"
ENV BIND_PORT="3000"
ENV DB_USER="petagenda"
ENV DB_HOST="petagenda-bd"
ENV DB_PASSWORD="PetAgenda_DB_w35J"
ENV MYSQL_CLIENT_PATH="/usr/bin/mysql"
ENV SQL_TMP_DIR="$API_PATH/sql/tmp/"
ENV SQL_DIR="$API_PATH/sql/"
ENV PROFILE_PIC_DIR="$API_PATH/resources/empresa/profile-pic/"
ENV SERVICO_PIC_DIR="$API_PATH/resources/empresa/servico-oferecido-pic/"
ENV HMAC_SECRET="PetAgenda_HMAC_Secret"
ENV NODE_ENV="production"

RUN apt update && apt upgrade -y
RUN apt install -y wget

WORKDIR /tmp

RUN wget https://dev.mysql.com/get/mysql-apt-config_0.8.34-1_all.deb
RUN apt install -y ./mysql-apt-config_0.8.34-1_all.deb
RUN apt update
RUN apt install -y mysql-client

RUN rm mysql-apt-config_0.8.34-1_all.deb

WORKDIR /petagenda

COPY src/ ./src
COPY resources/ ./resources
COPY sql/ ./sql
COPY package.json .

RUN apt install -y npm
RUN npm i


# RUN apt install -y tree
# CMD tree -L 2 /petagenda

ENTRYPOINT ["npm", "run", "prod"]
