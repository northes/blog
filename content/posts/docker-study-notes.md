---
title: "Docker 学习笔记"
date: 2021-05-28T01:31:48+08:00
draft: false
author: "Northes"
description: "docker学习笔记，常用命令等，包括mysql、redis的镜像实操"
tags: ["Docker","MySQL","Redis","学习笔记"]
---

## docker run

```shell
# 后台运行
-d

# 环境变量
-e MYSQL_ROOT_PASSWORD=123456

# 端口映射 外部端口:内部端口
-p 80:80

# 阻塞运行
-it

# 文件[夹]映射  宿主路径:容器路径  绝对路径
-v /suzhu:/rongqi
```



```shell
# 链接其他容器 容器名或id:内部别名
--link mysql:mysql

# 运行结束后自动销毁
--rm

# 指定容器运行后的名字
--name

# 机器重启后是否自动运行
--restart always
```



## docker 命令

#### 登录

```shell
$ docker login
```



#### 退出登录

```shell
$ docker logout
```



#### 构建

```shell
$ docker build -t name:tag .
```

> -t  设置docker镜像的名字和标签
> 
> -f  设置Dockerfile文件的路径，如果Dockerfile文件为默认的文件名，则可省略



#### 查看所有镜像

```shell
$ docker images
```



#### 删除镜像

```shell
$ docker rmi <name or id>
```

如果删除报错，则输入 ` docker ps -a ` 查看容器是否已停止，未停止则停止，然后输入 ` docker rm <name or id> ` 删除已停止的容器，最后再 ` rmi ` 删除镜像



#### 推送镜像

```shell
# 打tag
# 如果tag省略则为latest
$ docker tag image_name:tag username/image_name:tag

# 推送
$ docker push username/image_name:tag
```





#### 查看运行的容器（运行、重启、停止、删除）

```shell
$　docker ps

# 查看所有容器(包括已停止)
$ docker ps -a

# 停止运行镜像
$ docker stop <name or id>

# 运行已停止的容器
$ docker start <name or id>

$ docker restart <name or id>

# 删除容器
$ docker rm <name or id>
```



#### 进入容器内部

```shell
# 5585fca679ac redis
$ docker exec -it redis sh
$ docker exec -it redis /bin/sh

# 退出
exit 
```







## dockerfile

#### 简单的示例

```dockerfile
FROM golang:alpine

# 为我们的镜像设置必要的环境变量
ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# 移动到工作目录：/build
WORKDIR /build

# 将代码复制到容器中
COPY . .

# 将我们的代码编译成二进制可执行文件app
RUN go build -o app .

# 移动到用于存放生成的二进制文件的 /dist 目录
WORKDIR /dist

# 将二进制文件从 /build 目录复制到这里
RUN cp /build/app .

# 声明服务端口
EXPOSE 8888

# 启动容器时运行的命令
CMD ["/dist/app"]
```



#### 分阶段构建

```dockerfile
FROM golang:alpine AS builder

# 为我们的镜像设置必要的环境变量
ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# 移动到工作目录：/build
WORKDIR /build

# 将代码复制到容器中
COPY . .

# 将我们的代码编译成二进制可执行文件 app
RUN go build -o app .

###################
# 接下来创建一个小镜像
###################
FROM scratch

# 从builder镜像中把/dist/app 拷贝到当前目录
COPY --from=builder /build/app /

# 需要运行的命令
ENTRYPOINT ["/app"]
```



#### 附带有静态文件、配置文件

```dockerfile
FROM golang:alpine AS builder

# 为我们的镜像设置必要的环境变量
ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# 移动到工作目录：/build
WORKDIR /build

# 复制项目中的 go.mod 和 go.sum文件并下载依赖信息
COPY go.mod .
COPY go.sum .
RUN go mod download

# 将代码复制到容器中
COPY . .

# 将我们的代码编译成二进制可执行文件 bubble
RUN go build -o bubble .

###################
# 接下来创建一个小镜像
###################
FROM scratch

COPY ./templates /templates
COPY ./static /static
COPY ./conf /conf

# 从builder镜像中把/dist/app 拷贝到当前目录
COPY --from=builder /build/bubble /

# 需要运行的命令
ENTRYPOINT ["/bubble", "conf/config.ini"]
```







## docker-compose

安装





示例配置文件

```yml
version: 3
services:
    web:
        image: nginx
        ports:
        - 80:80
        environments:
        - MYENV=zzzz
        volumes:
        - /h:/nginx
    php:
        image: php
        volumes:
        - /b:/c
```



运行

```shell
docker-compose up -d
```

> -d 后台运行





## Kubernetes







## Redis

### 运行

```shell
$ docker run -itd --name redis-test -p 6379:6379 redis
```



### 操作

进入redis控制台后

```shell
$ redis-cli
```

退出

```shell
$ exit
```







## MySQL

### 运行

```shell
$  docker run -itd --name mysql-test -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql
```



### 操作

进入mysql控制台后

```shell
$ mysql -u root -p
```

退出

```mysql
exit
```



> sql 语句注意以 ; 结尾

#### 数据库

##### 创建数据库

```mysql
create database 数据库名;
```



##### 查看数据库

```mysql
show databases;
```



##### 选择数据库

```mysql
use 数据库名
```



##### 删除数据库

```mysql
drop database <数据库名>;
```





#### 数据表

##### 创建数据表

```mysql
create table table_name (column_name column_type);
```

```mysql
CREATE TABLE IF NOT EXISTS `runoob_tbl`(
   `runoob_id` INT UNSIGNED AUTO_INCREMENT,
   `runoob_title` VARCHAR(100) NOT NULL,
   `runoob_author` VARCHAR(40) NOT NULL,
   `submission_date` DATE,
   PRIMARY KEY ( `runoob_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```



##### 查看数据表

```mysql
show tables;
```



##### 删除数据表

```mysql
drop table table_name ;
```





#### 数据

##### 插入数据

```mysql
INSERT INTO table_name ( field1, field2,...fieldN ) VALUES ( value1, value2,...valueN );
```



##### 查找数据

```mysql
select * from 数据表;
```

```mysql
select * from 数据表 where id < 5;
```



##### 更新数据

```mysql
UPDATE table_name SET field1=new-value1, field2=new-value2
[WHERE Clause]
```



##### 删除数据

```mysql
DELETE FROM table_name [WHERE Clause]
```

