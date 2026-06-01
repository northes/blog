---
title: "Docker 学习笔记"
date: 2021-05-28T01:31:48+08:00
lastmod: 1643899808024
draft: false
author: "ethan"
description: "Docker常用命令合集"
tags: ["学习笔记","Docker"]
---

## 镜像
```shell
# 构建镜像
docker build .
# 指定Dockerfile & 指定构建的镜像名和tag
docker build -f Dockerfile -t name:tag .
# 列出所有镜像
docker images
# 列出包魂 something 的镜像
docker images | grep something
# 删除镜像（需要停止由本镜像创建的容器）
docker rmi 
# 修改镜像的名称和tag
docker tag <old:tag> <new:tag>
# 镜像详情
docker inspect
# 镜像层级历史（镜像是一层一层构建出来的，多阶构建只能查看最终镜像的层级）
docker history <name or hash>
docker image history <name or hash>
# 基于已存在的容器制作镜像
docker commit <hash> <name:tag>
# 保存镜像为文件(export 会丢失掉所有的镜像构建历史)
docker save <name or hash> | gzip > xxx-v1.0.0.tar.gz
docker export <name or hash> > xxx.tar.gz
# 从镜像文件载入镜像（import不常用）
docker load -i xxx.tar.gz
docker import - <name:tag> xxx.tar.gz
```

## 容器
```shell
# 运行容器（详见 `运行` 节）
docker run 
# 开始运行容器（容器需之前已创建）
docker start <name or hash>
# 停止运行容器
docker stop <name or hash>
# 重启容器（不会删除后重新创建）
docker restart <name or hash>
# 列出容器列表（同样可使用grep筛选）
docker ps
# 列出容器列表（包括已停止的）
docker ps -a 
# 删除容器
docker rm <name or hash>
# 进入容器（指定运行的终端）（输入exit退出）
docker exec
docker exec -it <name or hash> sh
docker exec -it <name or hash> bin/sh
docker exec -it <name or hash> bin/bash
# 重命名容器
docker rename <old_name> <new_name>
# 暂停容器运行
docker pause <name or hash>
# 清理无用的镜像、容器、数据卷
docker system prune -af --volumes 
# 清理镜像 -a 删除所有未使用的 -f 强制回收，跳过提示语句
docker image prune
```

## 运行
```shell
docker run

# 后台运行
-d
# 环境变量
-e MYSQL_ROOT_PASSWORD=123456
# 端口映射 宿主端口:容器端口
-p 80:80
# 阻塞运行
-it
# 文件[夹]映射  宿主路径:容器路径  （相对路径或绝对路径）
-v /suzhu:/rongqi
# 链接其他容器 容器名或hash:内部别名
--link mysql:mysql
# 运行结束后自动销毁
--rm
# 指定容器运行后的名字
--name
# 机器重启后是否自动运行
--restart always
```
### 一些栗子🌰
```shell
# MySQL
docker run -itd --name mysql-test -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql:5.7
# Redis
docker run -itd --name redis-test -p 6379:6379 redis
# Nginx
docker run --name nginx-test -p 8080:80 -d nginx
# MongoDB（--auth 需要密码才能访问）
docker run -itd --name mongo -p 27017:27017 mongo --auth
```

## 仓库相关
```shell
# 登录
docker login
# 登出
docker logout
# 推送
docker push
# 拉取
docker pull
```
