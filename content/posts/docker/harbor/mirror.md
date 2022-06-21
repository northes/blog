---
title: "Harbor 搭建镜像代理"
date: 2022-06-21T11:17:34+08:00
draft: false
author : "Northes"
description: "使用 Harbor 代理 k8s.gcr.io,gcr.io,ghcr.io,quay.io 等墙外镜像"
tags: ["学习笔记","Docker","Harbor"]
---

## 环境
- 已安装的可访问墙外的 Harbor（2.5.1）

## 仓库配置
登入管理员账号

> 默认：admin Harbor12345

系统管理 - 仓库管理 - 新建项目

|    提供者     |    目标名     |         目标 URL         | 访问 ID 与密码         |
|:----------:|:----------:|:----------------------:|:------------------|
| Docker Hub | docker.io  | https://hub.docker.com | 根据实际，一般代理公共项目留空即可 |
|    Quay    |  quay.io   |    https://quay.io     | 清空                |
|    Quay    |   gcr.io   |     https://gcr.io     | 清空                |
|    Quay    | k8s.gcr.io |   https://k8s.gcr.io   | 清空                |
|    Quay    |  ghcr.io   |    https://ghcr.io     | 清空                |

> 验证远程证书 可选可不选

## 添加项目

项目 - 新建项目

1. 项目名，与要代理的镜像仓库地址相同更方便（如：仓库为 `k8s.gcr.io` ,项目名也设置为 `k8s.gcr.io` ）
2. 打开 镜像代理
3. 选择欲代理的镜像仓库

一个仓库对应一个项目即可

## 使用

设 
- 部署的 Harbor 域名为 `harbor.god.com`
- 要拉取的镜像为 `k8s.gcr.io/kube-state-metrics/kube-state-metrics:v2.0.0-beta`
- 如果项目为私有，则需要登录后拉取
```shell
docker pull harbor.god.com/k8s.gcr.io/kube-state-metrics/kube-state-metrics:v2.0.0-beta
```


pull 到本地再重新打 tag 即可
```shell
docker tag harbor.god.com/k8s.gcr.io/kube-state-metrics/kube-state-metrics:v2.0.0-beta k8s.gcr.io/kube-state-metrics/kube-state-metrics:v2.0.0-beta
```

拉取的镜像可以设置在 Harbor 中进行缓存，可设置单仓库的可使用空间大小
