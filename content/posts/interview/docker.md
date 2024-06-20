---
title: "Docker 八股文"
date: 2024-06-21T00:49:11+08:00
draft: true
author : "northes"
description: "Docker 面试八股文"
tags: ["面试"]
---


## Docker 的应用场景

Web 应用的自动化打包和发布。
自动化测试和持续集成、发布。
在服务型环境中部署和调整数据库或其他的后台应用。
从头编译或者扩展现有的 OpenShift 或 Cloud Foundry 平台来搭建自己的 PaaS 环境。

## 如何退出一个容器Bash，而不终止它

`Ctrl + P` + `Ctrl + Q`

`Ctrl + P`：获取前一个进程

`Ctrl + Q`: 发送终止信号

## 如何控制容器占用系统资源(CPU，内存)的份额

### CPU

```bash
# 设置容器的CUP份额
docker run --cpu-shares 512 my-image

# 限制容易可以使用的CPU核心数
docker run --cpus 1.5 my-image

# cpu-period 控制CPU时间片的长度，cpu-quota 在一个周期内容器可以使用的CPU时间
docker run --cpu-period 100000 --cpu-quota 50000 my-image
```

### 内存

```bash
# 限制容器可使用的内存量。
docker run --memory 512m my-image

# 设置容器的内存加交换空间的总限制，允许容器使用超过其分配的内存量，但会将部分数据交换到磁盘上。
docker run --memory 512m --memory-swap 1g my-image

# 未容器预留一定数量的内存。至少有这么多内存，但不限制上限。
docker run --memory-reservation 256m my-image

# 限制可使用的内核内存量。内核内存是操作系统用于缓存和缓冲区的内存。
docker run --kernel-memory 64m my-image

```

## 参考

- https://www.cnblogs.com/crazymakercircle/p/17052047.html#autoid-h2-15-0-0
- https://www.topgoer.cn/docs/interview/interview-1e9o5pro7b33j