---
title: "微服务入门扫盲"
date: 2021-07-20T21:35:53+08:00
draft: false
author : "Northes"
description: "RPC，gRPC，Protobuf等的简单介绍"
tags: ["学习笔记","Golang","微服务"]
---

## RPC

(Remote Procedure Call) 远程过程调用

## gRPC

是谷歌开源的一个rpc框架，go语言项目中常用

## Protocol Buffers
```proto
// 版本号
syntax = "proto3";

// 包名
package protobufTest;

// go包名，生成后的pb包名为v1
option go_package = "apihut-server-test/api/helloworld/v1;v1";

// 定义的服务
service Product {
  rpc AddProduct(ProductInfo) returns (ResponseProduct);
}

// 枚举
enum XX {
  NORMAL = 0;
  SUCCESS = 1;
}


// 1 是字段标识符，不是赋值
// 尽量控制在 1~15 ，超过 15 会开两个结构体存储
// 字段名一般采用小写下划线的方式
// 每个 message 的字段标识都是从1开始
// 消息格式
message ProductInfo{
  int64 id = 1;
  string product_name = 2;
}

message ResponseProduct{
  int64 product_id = 1;
}

message GetIpRequest {
  string ip = 1;
}

message GetIpReply {
  // 重复的string,相当于数组
  repeated string info = 1; 
}


// 内嵌结构体
message Response{
  message Info{
    int64 id =1;
    string name =2;
    string version =3;
  }
  Info info = 1;
}
```

##### proto3字段不设置时会默认赋类型零值

如需判断字段是未赋值还是传0值，可引入 `import "google/protobuf/wrappers.proto";` 包，并将 `string` 类型替换为 `google.protobuf.StringValue`

完整写法
```protobuf
google.protobuf.StringValue str = 1;
```