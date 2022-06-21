---
title: "Minio 学习笔记"
date: 2021-08-25T15:26:59+08:00
draft: true
author : "Northes"
description: "Minio 入门学习"
tags: ["学习笔记","存储"]
---



Minio 是一个分布式的存储对象存储系统

- 中文文档 http://docs.minio.org.cn/docs/
- 英文文档 https://docs.min.io/



## 运行

windows

```sh
http://dl.minio.org.cn/server/minio/release/windows-amd64/minio.exe
```

通过如下命令启动

```shell
 minio server 'C:\Users\North\Desktop\Workspance\Tests\Minio' --address '127.0.0.1:9002' --console-address '127.0.0.1:9001' /home/minio/data &
```

`--address` 为指定minio接口

`--console-address` 为指定minio控制台

启动后可以通过指定的控制台地址在浏览器操作minio

*默认账号密码*
RootUser: minioadmin
RootPass: minioadmin



## SDK

Golang

```
go get -u github.com/minio/minio-go
```



**一个简单的示例**

```go
```





## 完整的示例

https://github.com/minio/minio-go/blob/master/examples/s3/
