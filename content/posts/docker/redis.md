---
title: "Docker 运行 Redis"
date: 2022-01-11T09:11:02+08:00
draft: true
author : "Northes"
description: "使用Docker运行Redis"
tags: ["学习笔记"]
---

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