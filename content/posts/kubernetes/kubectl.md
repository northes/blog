---
title: "Kubernetes - Kubectl"
date: 2021-12-18T14:46:34+08:00
draft: false
author : "Northes"
description: "K8s学习笔记"
tags: ["学习笔记","Kubernetes"]
---

资源管理
```shell
# 创建、更新资源
kubectl apply -f xx.yaml
# 删除
kubectl delete -f xx.yaml
```

Pod
```shell
# 获取所有pod
kubectl get pods
# 获取所有匹配app:nginx的pod的信息（在命令行中，所有key-value格式的参数都是用=，而不是:）
kubectl get pods -l app=nginx
# 查看pod详细信息
kubectl describe pod <pod-name>
# 进入pod内部
kubectl exec -it <pod-name> -- /bin/sh
# 如果一个pod里有多个容器，可以使用 --c 指定容器名
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