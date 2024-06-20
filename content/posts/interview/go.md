---
title: "Golang 面试八股文"
date: 2024-06-21T01:57:14+08:00
draft: true
author : "northes"
description: "Golang 面试八股文"
tags: ["Golang","面试","八股文"]
---

## 切片取值

```go
	l := []int{1, 2, 3}
	fmt.Println(l[1:]) // 2, 3
	fmt.Println(l[:1]) // 1
```
取值范围为 \[n:m\)

## 参考

- https://golangguide.top
