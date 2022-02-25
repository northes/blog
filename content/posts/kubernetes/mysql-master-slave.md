---
title: "K8S 搭建 Mysql 主从实录"
date: 2022-02-25T14:27:26+08:00
draft: true
author : "Northes"
description: "一主一从，读写分离"
tags: ["Kubernetes","MySQL"]
---

## 前置知识
### k8s相关
- 假设已了解k8s各工作负载概念
- 已有k8s集群（单节点、多节点、minikube、k3s均可）
### MySQL相关
- 主节点需开启binlog
### 环境
- Kubernetes v1.23
- MySQL 5.7

在同一集群内搭建

## 主节点
### 主节点配置
```toml
[mysqld]
## 同一局域网内注意要唯一
server-id=1
## 开启二进制日志功能，可以随便取（关键）
log-bin=mysql-bin
```
### 创建用户
```mysql
# 创建用户
CREATE USER 'slave'@'%' IDENTIFIED BY '@#$Rfg345634523rft4fa';
# 授予用户权限
GRANT REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'slave'@'%';
# 刷新权限
flush privileges;
```
### 主节点状态
```mysql
# 查看主节点状态
show master status;
```
记录下`File`和`Position`的值，从节点要用到。
并且不进行其他操作以免引起`Position`的变化

## 从节点
### 从节点配置
```toml
[mysqld]
## 设置server_id,注意要唯一
server-id=2
## 开启二进制日志功能，以备Slave作为其它Slave的Master时使用
log-bin=mysql-slave-bin
## relay_log配置中继日志
relay_log=edu-mysql-relay-bin
## 需要复制的数据库名，如有多个，重复即可
replicate-do-db=db1
replicate-do-db=db2
```
### 设置主节点
登录从节点
```toml
# 设置欲同步的主节点信息
change master to master_host='mysql-slave-0.mysql-slave', master_user='slave', master_password='@#$Rfg345634523rft4fa', master_port=3306, master_log_file='mysql-bin.000001', master_log_pos=2830, master_connect_retry=30;
```
- master_host：主节点host（注意格式）
- master_user：用于同步的用户名，需在主库建立并授权
- master_password：用于同步的用户密码
- master_port：主节点端口
- master_log_file：主节点二进制日志名（主节点看的 `File` ）
- master_log_pos：主节点二进制日志偏移（主节点看的 `Position` ）
- master_connect_retry：同步失败多久重试(默认60)，秒

### 查看从节点同步状态
```mysql
# 查看从节点状态
show slave status;
# 开启主从同步
start slave;
```
此事再次查看从节点状态，并且确保 `Slave_IO_Running` 与 `Slave_SQL_Running` 都处于`Yes`
具体错误原因可以看 `Last_Error` 字段，解决问题后需要重新执行 `start slave`

### 同步所有库和表
从节点执行
```mysql
STOP SLAVE SQL_THREAD;
CHANGE REPLICATION FILTER REPLICATE_DO_DB = ();
start SLAVE SQL_THREAD;
```

## YAML
### Master
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql
  selector:
    matchLabels:
      app: mysql
      version: "5.7"
  template:
    metadata:
      labels:
        app: mysql
        version: "5.7"
    spec:
      containers:
        - name: mysql
          image: mysql:5.7
          imagePullPolicy: IfNotPresent
          env:
            - name: MYSQL_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  key: password
                  name: mysql-secret
          volumeMounts:
            - mountPath: /etc/mysql
              name: conf
            - mountPath: /var/lib/mysql
              name: data
      volumes:
        - name: conf
          configMap:
            name: mysql-conf
            items:
              - key: my.cnf
                path: my.cnf
        - name: data
          hostPath:
            path: /var/lib/mysql
            type: DirectoryOrCreate
---
apiVersion: v1
kind: Service
metadata:
  name: mysql
spec:
  selector:
    app: mysql
    version: "5.7"
  type: ClusterIP
  clusterIP: None
  ports:
    - port: 3306
      targetPort: 3306
      protocol: TCP
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: mysql-conf
data:
  my.cnf: |
    [mysqld]
    #设置日志三种格式：STATEMENT、ROW、MIXED 。
    binlog_format = mixed
    #设置日志路径，注意路经需要mysql用户有权限写,这里可以写绝对路径,也可以直接写mysql-bin(后者默认就是在/var/lib/mysql目录下)
    log-bin = mysql-bin
    #设置binlog清理时间
    expire_logs_days = 7
    #binlog每个日志文件大小
    max_binlog_size = 100m
    #binlog缓存大小
    binlog_cache_size = 4m
    #最大binlog缓存大小
    max_binlog_cache_size = 512m
    #配置serverid
    server-id=1
---
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
data:
  password: MTIzNDU2 # 123456
```

### Slave
```yaml
# 必须先启动master主节点
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql-slave
spec:
  selector:
    matchLabels:
      app: mysql-slave
      version: "5.7"
  serviceName: mysql-slave
  template:
    metadata:
      labels:
        app: mysql-slave
        version: "5.7"
    spec:
      containers:
        - name: mysql
          image: mysql:5.7
          imagePullPolicy: IfNotPresent
          env:
            - name: MYSQL_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  key: password
                  name: mysql-secret
          volumeMounts:
            - mountPath: /etc/mysql
              name: conf
            - mountPath: /var/lib/mysql
              name: data
      volumes:
        - name: conf
          configMap:
            name: mysql-slave-conf
            items:
              - key: my.cnf
                path: my.cnf
        - name: data
          hostPath:
            path: /var/lib/mysql-slave
            type: DirectoryOrCreate
---
apiVersion: v1
kind: Service
metadata:
  name: mysql-slave
spec:
  selector:
    app: mysql-slave
    version: "5.7"
  type: ClusterIP
  clusterIP: None
  ports:
    - port: 3306
      targetPort: 3306
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: mysql-slave-conf
data:
  my.cnf: |
    [mysqld]
    server-id=2
    log-bin=mysql-slave-bin
    relay_log=mysql-relay-bin
```
