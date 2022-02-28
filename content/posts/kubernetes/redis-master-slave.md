---
title: "K8s 搭建 Redis 主从实录"
date: 2022-02-27T21:10:32+08:00
draft: true
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
## 哨兵机制
- 此时只是简单的主从搭建，从节点由于是只读，在多从节点部署的情况下，从节点挂了影响可能不大。但是如果
  主节点挂了，就必须依靠一定的机制来进行选主、切换主库。这一机制就称为哨兵机制。
- 每个哨兵都会定时 PING 主从库，查看网络连接情况。当某个哨兵发现主库下线，称为“主管下线”。此时需要其他
  哨兵也判断主库下线，主库才会被标记为“客观下线”。然后进行后续的选主流程。
- 选主依靠一定的规则。先进行一轮筛选，判断从库当前是否在线以及过往的网络连接情况。然后进行打分，包括从库优先级、
  复制进度、从库ID（启动时自动生成）。最后分数高的当选为主库
- 选出主库后进行通知。通知从库执行 replicaof ，与新朱主库同步；通知客户端，与新主库连接  

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