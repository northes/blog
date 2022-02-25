---
title: "使用 Dockerfile 构建镜像"
date: 2022-01-11T09:10:16+08:00
draft: false
author : "Northes"
description: "简介简介"
tags: ["学习笔记","Docker"]
---

## 构建
### 命令
```shell
docker build .
docker build -f xx.yaml -t name:tag .
```
### 忽略
通过 `.dockerignore` 文件指定构建时忽略的文件

### 构建过程
1. `docker build` 会将 context 中的文件打包发送给 Docker daemon。
如果 context 中有 `.dockerignore` 文件，则会从上传列表中删除满足 `.dockerignore`
规则的文件
> `.dockerignore` 文件中如果指定有 .dockerignore 和 Dockerfile ， 是不会被忽略的
2. `docker build` 命令想 Docker server 发送 HTTP 请求，请求 Docker server 构建镜像，
请求中包含了需要的 context 信息
3. Docker server 接收到构建请求后，会执行以下操作：
    - 创建一个临时目录，将 context 中的文件解压到该目录下
    - 读取并解析 Dockerfile ， 遍历其中的命令，根据命令类型分发到不同的模块去执行
    - Docker 构建引擎为每一条指令构建一个临时容器，在临时容器中执行指令，然后 commit 容器，
    生成一个新的镜像层
    - 最后，将所有构建出来的镜像层合并，形成 build 的最后结果。最后一次 commit 生成的镜像ID
    就是最终的镜像ID

> 为了提高构建效率，docker build 默认会缓存已有的镜像层。如果构建镜像时发现某个镜像层已经被缓存，就会直接
> 使用该镜像层（后面会说到如何更好地利用这一特性）。如不想使用缓存的镜像，docker build 时可以加上 `--no-cache=true`


## 指令详解
不区分大小写，但一般建议全大写

`#` 在一行的开头视为注释，其他地方出现都视为参数

### FROM


## 最佳实践
[最佳实践](../dockerfile-best-practices)

## 一个简单的栗子🌰

```dockerfile
# FROM 定义基础镜像
FROM golang:alpine
# 定义镜像维护者
MAINTAINER handsome-young-man

# 定义环境变量
ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# 指定工作目录，后面的指令都在此目录下
WORKDIR /build

# 将代码复制到容器中
COPY . .

# 将我们的代码编译成二进制可执行文件app
RUN go build -o app .

# 切换到用于存放生成的二进制文件的 /dist 目录
WORKDIR /dist

# 将二进制文件从 /build 目录复制到这里
RUN cp /build/app .

# 声明服务端口
EXPOSE 8888

# 定义容器启动时执行的命令
CMD ["/dist/app"]
ENTRYPOINT ["/dist/app"]
```

## 多阶构建

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

## 带有静态文件\配置文件

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

## Q&A
alpine 运行报standard_init_linux.go:228: exec user process caused: no such file or directory
需要改成
RUN CGO_ENABLED=0 && go build -o bin/app .