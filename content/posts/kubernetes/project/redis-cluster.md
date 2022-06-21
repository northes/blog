---
title: "使用 K8S 部署 Redis 集群"
date: 2022-02-16T23:04:33+08:00
draft: true
author : "Northes"
description: "K8S 部署 Redis 集群实践"
tags: ["实践","Kubernetes"]
---

## 前置
首先按照键值对应的key，使用CRC16算法计算一个16bit的值；然后将此值对
16384 取模，得到 0~16383 范围内的模数

## 