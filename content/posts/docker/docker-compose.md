---
title: "Docker Compose 修炼手册"
date: 2022-02-01T22:19:00+08:00
lastmod: 1643899808024
draft: false
author : "Northes"
description: "docker-compose配置文件及常用命令"
tags: ["学习笔记","Docker"]
---

## 配置文件
```yml
version: '3.1'

services:
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_USER: gin_layout
      MYSQL_PASSWORD: gin_layout
      MYSQL_DATABASE: gin_layout
    command: --default-authentication-plugin=mysql_native_password     #解决MySQL无法连接的问题。若是mysql 8.0 的版本， 默认使用 caching_sha2_password 身份验证机制 —— 从原来的 mysql_native_password 更改为 caching_sha2_password　
    volumes:
      - ./data:/var/lib/mysql # 持久化mysql数据
    ports:
      - 3306:3306
  web:
    depends_on:
      - db # 这里并不会等到db完全启动才启动，一般是自己实现脚本监听再启动web app
    image: gin_layout:latest
    build: . # 如果找不到镜像，去哪里寻找Dockerfile
    restart: always
    ports:
      - 8080:8080 # 宿主机:容器
    volumes:
      - ./etc:/www/etc # 映射配置文件
```
> 详情可看 https://github.com/northes/gin-layout

## 常用命令
```shell
# 在后台运行
docker-compose up -d
# 停止运行
docker-compose stop
# 停止并删除所有容器
docker-compose down
# 重启所有容器，不会删除
docker-compose restart
# 重启单个服务
docker-compose restart <service-name>
# 进入容器命令行
docker-compose exec <service-name> sh
# 查看容器运行log
docker-compose logs <service-name>
# 查看安装的版本
docker-compose --version
```