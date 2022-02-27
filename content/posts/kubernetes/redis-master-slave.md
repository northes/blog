---
title: "K8s 搭建 Redis 主从实录"
date: 2022-02-27T21:10:32+08:00
draft: false
author : "Northes"
description: "一主一从，读写分离"
tags: ["Kubernetes","Redis"]
---

## 环境
- Kubernetes 1.23
- Redis 6.2.6

## 主从复制原理
- 为避免数据混乱，从节点是默认不允许写的
- 首次连接需要同步全量 RDB ，此后执行基于长连接的命令传播
- 建议使用 主-从-从 的级联架构，减轻每一个从节点连进来主节点都要进行一次生成RDB和传输RDB的压力
- 从节点断连后，如短时间内重新连入，则只需要进行增量更新。如未同步的数据过多
  （repl_backlog_buffer中未同步的数据已被覆盖），则需要进行一次全量同步

## Configmap
*一切从简*
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: redis-config
data:
  master.conf: |
    port 6379
  slave.conf: |
    port 6379
    slaveof redis-master-0.redis-master 6379
```
## StatefulSet
### Master
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis-master
spec:
  selector:
    matchLabels:
      app: redis-master
  serviceName: redis-master
  template:
    metadata:
      labels:
        app: redis-master
    spec:
      containers:
        - name: redis
          image: redis:6.2.6
          imagePullPolicy: IfNotPresent
          command:
            - sh
          args:
            - -c
            - redis-server /usr/local/etc/redis/redis.conf
          ports:
            - containerPort: 6379
              name: masterport
              protocol: TCP
          volumeMounts:
            - mountPath: /usr/local/etc/redis
              name: conf
      volumes:
        - name: conf
          configMap:
            name: redis-config
            items:
              - key: master.conf
                path: redis.conf
```
### Slave
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis-slave
spec:
  selector:
    matchLabels:
      app: redis-slave
  serviceName: redis-slave
  template:
    metadata:
      labels:
        app: redis-slave
    spec:
      containers:
        - name: redis
          image: redis:6.2.6
          imagePullPolicy: IfNotPresent
          command:
            - sh
          args:
            - -c
            - redis-server /usr/local/etc/redis/redis.conf
          ports:
            - containerPort: 6379
              name: redis-slave
              protocol: TCP
          volumeMounts:
            - mountPath: /usr/local/etc/redis
              name: conf
      volumes:
        - name: conf
          configMap:
            name: redis-config
            items:
              - key: slave.conf
                path: redis.conf
```
## Service
### Master
```yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-master
spec:
  selector:
    app: redis-master
  clusterIP: None
  ports:
    - port: 6379
      targetPort: 6379
      name: redis
```
### Slave
```yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-slave
spec:
  ports:
    - port: 6379
      targetPort: 6379
      protocol: TCP
  selector:
    app: redis-slave
  clusterIP: None
```

## 验证
登录 主节点
```yaml
# 进入 Pod
kubectl exec -it po/redis-master-0 -- bash
# 登录 redis
redis-cli
# 查看信息
info
```
看到输出有以下信息即为主从成功连接
```shell
# Replication
role:master
connected_slaves:1 # 已连接的从节点数
slave0:ip=172.17.0.4,port=6379,state=online,offset=14,lag=1 # 从节点信息
master_replid2:0000000000000000000000000000000000000000
second_repl_offset:-1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:14
```
接下来可以起一个临时Pod验证一下
```shell
kubectl run --image alpint redis-test --rm
# 安装redis-cli
apk upgrade && apk add redis
# 登录主节点
redis-cli -h redis-master-0.redis-master
set foo bar
# 登录从节点
redis-cli -h redis-slave-0.redis-slave
get foo
```