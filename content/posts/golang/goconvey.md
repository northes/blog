---
title: "Goconvey 测试框架"
date: 2021-09-03T13:59:46+08:00
draft: false
author : "Northes"
description: "go测试框架，兼容go-test，带完整web页面"
tags: ["学习笔记","Golang"]
---


## 开始
#### 官网
http://goconvey.co/
#### 仓库
https://github.com/smartystreets/goconvey
#### 安装
```shell
go get github.com/smartystreets/goconvey
```

## 例子
main.go
```go
package main

import "errors"

func Add(a, b int) int {
	return a + b
}

func Subtract(a, b int) int {
	return a - b
}

func Multiply(a, b int) int {
	return a * b
}

func Division(a, b int) (int, error) {
	if b == 0 {
		return 0, errors.New("被除数不能为 0 ")
	}
	return a / b, nil
}

```

main_test.go
```go
package main

import (
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func TestAdd(t *testing.T) {
	Convey("将两数相加", t, func() {
		So(Add(1, 2), ShouldEqual, 3)
	})
}

func TestSubtract(t *testing.T) {
	Convey("将两数相减", t, func() {
		So(Subtract(1, 2), ShouldEqual, -1)
	})
}

func TestMultiply(t *testing.T) {
	Convey("将两数相乘", t, func() {
		So(Multiply(3, 2), ShouldEqual, 6)
	})
}

func TestDivision(t *testing.T) {
	Convey("将两数相除", t, func() {
		Convey("除以非0数", func() {
			num, err := Division(10, 2)
			So(err, ShouldBeNil)
			So(num, ShouldEqual, 5)
		})

		Convey("除以0", func() {
			_, err := Division(10, 0)
			So(err, ShouldNotBeNil)
		})
	})
}

```

## 运行测试
项目目录下
```shell
// go 原生命令
go test 
go test -v
// goconvey 测试框架
goconvey
```

- web端 [http://127.0.0.1:8080/](http://127.0.0.1:8080/)
- 支持简单的测试用例生成 [直达](http://127.0.0.1:8080/composer.html)
- 点击左上角包名可查看测试覆盖率 [直达](http://127.0.0.1:8080/reports/)
- 监控文件修改自动运行测试，打开 `WebUI` 后支持测试结果通知

![image-20210903141853320][Toggle notifications1]

![image-20210903141923300][Toggle notifications2]

## 常用断言
ShouldEqual 等于

ShouldNotEqual 不等于

ShouldBeNil 为空

ShouldNotBeNil 不为空

ShouldNotPanic 不Panic

> 详细文档可见：https://github.com/smartystreets/goconvey/wiki/Assertions


