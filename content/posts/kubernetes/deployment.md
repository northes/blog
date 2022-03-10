---
title: "Kubernetes - Deployment"
date: 2022-01-14T16:20:06+08:00
draft: true
author : "Northes"
description: "简介简介"
tags: ["学习笔记"]
---

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.7 # 如需修改，直接修改版本并 kubectl apply -f xxx.yaml 即可
          ports:
            - containerPort: 80
          volumeMounts: # 为这个Deployment创建一个 volume
            - mountPath: "/usr/share/nginx/html" # 定义容器内的volume目录
              name: nginx-vol # 指定绑定的volume名
      volumes:
        - name: nginx-vol # volume名
          emptyDir: {} # 不显式地指定宿主机目录，由k8s创建一个临时目录作为宿主机的Volume交给Docker
        - name: nginx-vol2 # 当然也支持显式指定宿主机目录
          hostPath:
            path: "/var/data"
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: test-k8s # 部署名字
spec:
  replicas: 2
  selector: # 用来查找关联的 Pod，所有标签都匹配才行
    matchLabels:
      app: test-k8s
  template: # 定义 Pod 相关数据
    metadata:
      labels:
        app: test-k8s
    spec:
      containers:       # 定义容器，可以多个
        - name: test-k8s # 容器名字
          image: ccr.ccs.tencentyun.com/k8s-tutorial/test-k8s:v1 # 镜像
```

通过 volumeMount.subPath 来声明我们只是挂载单个文件，而非整个目录