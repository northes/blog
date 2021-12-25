---
title: "Kubernetes - 安装、集群创建"
date: 2021-12-18T14:39:22+08:00
draft: false
author : "Northes"
description: "k8s单机、集群创建"
tags: ["学习笔记","Kubernetes"]
---

## MiniKube
https://minikube.sigs.k8s.io/docs/

### docker 提示没有权限
```shell
adduser test
passwd test
sudo groupadd docker
su kube
sudo usermod -aG docker $USER
newgrp docker
```

### xxxis not in the sudoers file. This incident will be reported.
```shell
su
chmod u+w /etc/sudoers
vi /etc/sudoers
# 找到这行 root ALL=(ALL) ALL,在他下面添加xxx ALL=(ALL) ALL (这里的xxx是你的用户名)
kube ALL=(ALL) ALL
chmod u-w /etc/sudoers
```
然后重新走上面的解决 docker 报无权限的流程


### minikube start 过程中拉取镜像慢
如已经初始化了 `minikube start` 则需要先执行 `minikube delete` 删除 minikube 初始化的环境

然后再执行 `minikube start --image-mirror-country='cn'` 设置镜像代理。设置后将使用阿里云镜像代理

## sealos 离线安装
https://www.sealyun.com/instructions

## K3s
https://www.rancher.cn/k3s/