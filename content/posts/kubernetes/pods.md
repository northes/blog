---
title: "Kubernetes - Pods"
date: 2021-12-18T15:17:16+08:00
draft: true
author : "Northes"
description: "简介简介"
tags: ["学习笔记","Kubernetes"]
---

> Pod，是 Kubernetes 的最小的 API 对象。如果换一个更专业的说法：Pod，是 Kubernetes 的原子调度单位

Kubernetes可以理解为操作系统，那么容器就是进程，而Pod就是进程组or虚拟机（几个进程关联在一起）。

Pod的设计之初有两个目的：
1. 为了处理容器之间的调度关系
2. 实现容器设计模式： Pod会先启动Infra容器设置网络、Volume等namespace（如果Volume要共享的话），其他容器通过加入的方式共享这些Namespace。

如果对Pod中的容器启动有顺序要求，可以使用Init Contianer。所有Init Container定义的容器，都会比spec.containers定义的用户容器按顺序优先启动。Init Container容器会按顺序逐一启动，而直到它们都启动并且退出了，用户容器才会启动。

Pod使用过程中的重要字段：
1. pod自定义/etc/hosts: spec.hostAliases
2. pod共享PID : spec.shareProcessNamespace
3. 容器启动后/销毁前的钩子： spec.container.lifecycle.postStart/preStop
4. pod的状态：spec.status.phase
5. pod特殊的volume（投射数据卷）:
    1. 密码信息获取：创建Secrete对象保存加密数据，存放到Etcd中。然后，你就可以通过在Pod的容器里挂载Volume的方式，访问到这些Secret里保存的信息
    2. 配置信息获取：创建ConfigMap对象保存加密数据，存放到Etcd中。然后，通过挂载Volume的方式，访问到ConfigMap里保存的内容
    3. 容器获取Pod中定义的静态信息：通过挂载DownwardAPI 这个特殊的Volume，访问到Pod中定义的静态信息
    4. Pod中要访问K8S的API：任何运行在Kubernetes集群上的应用，都必须使用这个ServiceAccountToken里保存的授权信息，也就是Token，才可以合法地访问API Server。因此，通过挂载Volume的方式，把对应权限的ServiceAccountToken这个特殊的Secrete挂载到Pod中即可
6. 容器是否健康： spec.container.livenessProbe。若不健康，则Pod有可能被重启（可配置策略）
7. 容器是否可用： spec.container.readinessProbe。若不健康，则service不会访问到该Pod