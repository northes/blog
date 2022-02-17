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
# 扩缩容
# sts为StatefulSet简写
kubec scale sts web --replicas=5
# 更新指定内容
kubectl patch sts web -p '{"spec":{"replicas":3}}'
# 非级联删除(只会删除StatefulSet，保留Pod)，此时如果再删除某一Pod，则不会重新创建一个新的以维持数量
kubectl delete statefulset web --cascade=orphan
# 级联删除（会删除所有Pod，与索引相反顺序删除），不会删除Service
kubectl delete statefulset web
# 回滚
kubectl rollout
kubectl rollout history deployment nginx
kubectl rollout history -f xxx.yaml

```

Pod
```shell
# 获取所有pod
kubectl get pods
# 获取所有匹配app:nginx的pod的信息（在命令行中，所有key-value格式的参数都是用=，而不是:）
# -l 筛选labels
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


其他
```shell
# 临时运行一个pod，并进入终端交互，退出会删除
kubectl run -i --tty --image busybox:1.28 dns-test --restart=Never --rm

```