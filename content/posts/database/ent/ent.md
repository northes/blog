---
title: "Ent 学习笔记"
date: 2021-09-16T09:40:03+08:00
draft: true
author : "Northes"
description: "Ent 是一个简单而又功能强大的Go语言实体框架，ent易于构建和维护应用程序与大数据模型。"
tags: ["学习笔记","数据库"]
---

## 介绍
官网：[https://entgo.io/](https://entgo.io/)

## 安装
```shell
go get entgo.io/ent/cmd/ent
```
> 使用前先 `go mod`
#### 使用
```shell
go run entgo.io/ent/cmd/ent init User
```
#### 全局安装
前往 `%GOPATh%/pkg/mod/entgo.io/ent@v0.9.1/cmd/ent` 下， `go build` 生成 `ent.exe` ,将当前目录加入 `PATH`

生成的结构体 `User` 于 /ent/schema/ 目录下


```go
// Fields of the User.
func (User) Fields() []ent.Field {
    return []ent.Field{
        field.Int("age").
            Positive(),
        field.String("name").
            Default("unknown"),
    }
}
```

### 命令
生成
```shell
go generate ./ent
```


### 错误
sqlite 报如下错误
cgo: exec gcc: exec: "gcc": executable file not found in %PATH%
