---
title: "微服务入门扫盲"
date: 2021-07-20T21:35:53+08:00
draft: false
author : "Northes"
description: "RPC，gRPC，Protobuf等的简单介绍"
tags: ["学习笔记","Golang","微服务"]
---

## RPC

## gRPC

## Protocol Buffers
```proto
// 版本号
syntax = "proto3";

// 包名
package protobufTest;

// 消息格式
message ProductInfo{
  int64 id = 1;
  string product_name = 2;
}

message ResponseProduct{
  int64 product_id = 1;
}
// 1 是字段标识符，不是赋值
// 尽量控制在 1~15 ，超过 15 会开两个结构体存储
// 字段名一般采用下划线的方式连接
// 每个 message 的字段标识都是从1开始


// 定义的服务
service Product {
  rpc AddProduct(ProductInfo) returns (ResponseProduct);
}
```
