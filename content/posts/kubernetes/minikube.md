---
title: "Minikube 备忘"
date: 2022-02-20T21:45:33+08:00
draft: false
author : "Northes"
description: "minikube 踩坑备忘"
tags: ["学习笔记","Kubernetes"]
---


## 启动
```shell
minikube start
minikube start --nodes 2 -p <node-name>
# memory以MB为单位。如果之前已经创建集群，需要删除（不用加 --all）
minikube start --memory=8192 --cpus=4 --kubernetes-version=v1.14.2
# 删除集群
minikube delete
minikube delete --all
```

## 仪表盘
```shell
minikube dashboard
minikube dashboard --url
```

## 节点
```shell
minikube node add
minikube node list
```

## 传入镜像
```shell
# 传入本机镜像
minikube image load <image_name>
# 查看帮助
minikube image --help
```

## 访问服务
由于minikube是模拟集群，你的电脑并不是节点，节点是 minikube 模拟出来的，
所以不能直接在电脑上访问到服务。但可以通过minikube提供的方法进行访问
### 使用 Kubectl
```shell
# 暴露服务，使用负载均衡器
kubectl expose deployment k8s-demo --type=LoadBalancer --port=8080
```
### 使用 Minikube Service
service 的 type 可以是 NodePort 也可以是 LoadBalancer
```shell
# 使用 Minikube Service 转发
minikube service k8s-demo
```
### 使用隧道
service 的 type 必须是 LoadBalancer
```shell
# 使用隧道进行转发
minikube tunnel
# 强制清理
minikube tunnel --cleanup
# 查看对应的地址及端口
kubectl get svc
```
