---
title: "Golang 安装多版本"
date: 2021-07-27T20:16:49+08:00
draft: false
author : "Northes"
description: "Golang 安装多版本共存"
tags: ["学习笔记","Golang"]
---

> \* 本方法可能需要科学上网，请自行解决

## 下载安装
目前本地版本为 `go1.16`,由于项目需要使用`go-micro v2`,因此需要多准备一个 `go1.13`~`go1.14` 的版本

```shell
go get golang.org/dl/go1.13
```

命令行中使用 `go1.13` 指定版本来代替 `go` 关键字
如：

运行查看版本
```shell
go1.13 version
```
如果提示
```shell
go1.13: not downloaded. Run 'go1.13 download' to install to C:\Users\North\sdk\go1.13
```
则运行
```shell
go1.13 download
```

## Goland 替换默认版本
设置 - Go - GOROOT 

点击右边 + 号添加

`C:\Users\XXX\sdk\go1.13`
> XXX 为本机用户名

之后使用 Goland 的终端默认版本都会为 `go1.13` ， 可以 Goland 的终端内照常使用 `go` 关键字了
