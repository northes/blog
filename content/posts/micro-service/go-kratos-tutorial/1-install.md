---
title: "Go-Kratos 手摸手 | 入门"
date: 2021-12-04T20:49:13+08:00
draft: false
author : "Northes"
description: "安装必要的运行环境，包括 protoc，kratos，make"
tags: ["学习笔记","微服务","Kratos"]
---

## 安装
### 1. protoc
前往 <a target="_blank" href="https://github.com/protocolbuffers/protobuf/releases">Protobuf releases 页</a> 下载对应版本的 protobuf 到本地，解压，将解压后的 `bin` `include`
一并复制到 `GOPATH` 目录下
### 2. kratos
```shell
go get -u github.com/go-kratos/kratos/cmd/kratos/v2@latest
```
> 注意，首次执行 kratos protoc 相关命令时，会自动下载 
> `protoc-gen-go`
> `protoc-gen-go-http`
> `protoc-gen-go-grpc`
> `protoc-gen-go-errors`
> `protoc-gen-validate`
> 等二进制文件到 `GOPATH/bin` 目录下

### 3. make （windows，选装）

*参考 <a target="_blank" href="https://stackoverflow.com/questions/32127524/how-to-install-and-use-make-in-windows"> How to install and use make in windows [stackoverflow] </a>*

推荐使用 `chocolatey` 的方式

以管理员身份运行 Powershell，运行以下命令
```shell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```
安装完成后运行以下命令
```shell
choco install make
```
使用 ``make --version`` 检查是否安装成功



> 至此，Kratos相关环境就安装好了，即可愉快玩耍