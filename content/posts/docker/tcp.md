---
title: "Docker 开启 TCP 监听"
date: 2023-03-08T02:26:53Z
draft: false
author : "Northes"
description: "开启 Docker 的 TCP 监听以支持远程调用"
tags: ["学习笔记","Docker"]
---

## 修改

`/usr/lib/systemd/system/docker.service`

在后面添加监听地址与端口

```ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock -H tcp://0.0.0.0:2375
```

## 重启

```bash
systemctl daemon-reload
systemctl restart docker
```

## 验证

```bash
curl -XGET http://localhost:2375/version
```

## 使用远程Docker守护进程

```bash
docker -H tcp://192.168.31.26:2375 info
```

```bash
export DOCKER_HOST="tcp://192.168.31.26:2375"
```

