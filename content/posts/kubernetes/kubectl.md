---
title: "Kubernetes - Kubectl"
date: 2021-12-18T14:46:34+08:00
draft: false
author : "Northes"
description: "K8s学习笔记"
tags: ["学习笔记","Kubernetes"]
---


创建、更新资源
```shell
kubectl apply -f xx.yaml
```

获取所有pods
```shell
kubectl get pods
```

查看pod详细信息
```shell
kubectl describe <pod-name>
```

进入pod
```shell
kubectl exec -it <pod-name> -- /bin/sh
```
如果一个pod里有多个容器，可以使用 --c 指定容器名
```shell
kubectl exec -it <pod-name> -c <container-name> -- bash 
```

创建secret
```shell
kubectl create secret generic <secret-name> --from-file=./username.txt
```

查看secret
```shell
kubectl get secrets
```

查看configmaps
```shell
kubectl get configmaps <configmaps-name> -o yaml
```
> -o yaml 以yaml格式打印