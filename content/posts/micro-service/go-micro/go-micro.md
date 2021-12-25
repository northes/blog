---
title: "go-micro 学习笔记"
date: 2021-07-27T21:39:28+08:00
draft: true
author : "Northes"
description: "go-micro 是一个应用广泛的微服务框架。学习及踩坑记录"
tags: ["学习笔记","Golang","微服务"]
---

## 环境
go1.13~go1.14

可以通过安装多版本支持

## 下载
框架
```shell
go get github.com/micro/micro/v2
```

生成器
```shell
go get github.com/micro/micro/v2/cmd/protoc-gen-micro
```


## 新建测试项目
```shell
micro new --gopath=false hello
```

## 开发步骤
1. 编写 `Proto` 文件，生成代码
2. 开发domain，表模型（model）；使用gorm操作数据库（repository）；在repository基础上开发逻辑代码（server），这部分的代码将提供给handler使用
3. 编写handler，即对外暴露的服务，与proto进行一一对应，主要实现micro.pb下的XXXHandler接口
4. 编写main文件
    - 创建服务参数
    - 初始化服务
    - 实例化中间件（数据库等）
    - 创建repository，绑定数据库
    - 注册Handler
    - 启动服务
    
    
    

## proto文件
```shell
option go_package = "./proto;user";
```
> 1. 其中 `./proto` 是在相对于命令行参数的基础上加上的目录，一般这里设置了具体的目录，命令行只需要使用.即可。
> 2. user代表生成的文件的包名

比如命令行为
```shell
protoc --proto_path=. --micro_out=. --go_out=. ./customer.proto
```
则最终生成的文件在`./proto`目录下
命令行为
```shell
protoc --proto_path=. --micro_out=./proto/user --go_out=./proto/user ./proto/user/user.proto
```
则最终生成的文件在`./proto/proto/user`目录下



## 生成 pb

~~MODIFY=Mproto/imports/api.proto=github.com/micro/go-micro/v2/api/proto~~

~~手动代替下面的变量~~
```shell
# 旧版protoc可用
protoc --proto_path=. --micro_out=Mproto/imports/api.proto=github.com/micro/go-micro/v2/api/proto:. --go_out=Mproto/imports/api.proto=github.com/micro/go-micro/v2/api/proto:. proto/hello/hello.proto

# 新版可用(本机3.17.3)
protoc --proto_path=. --micro_out=. --go_out=. ./proto/user/user.proto
protoc --proto_path=. --micro_out=./proto/user --go_out=./proto/user ./proto/user/user.proto
```



## 错误与处理
1. rpc报500 Not Found 错误
   - 关闭防火墙或安全软件

2. 提示
```shell
Please specify either:
        • a "go_package" option in the .proto source file, or
        • a "M" argument on the command line.

```
在proto文件中加上以下行即可
```shell
option go_package = "./proto;user";
```

