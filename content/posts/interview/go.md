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

## Struct 能否比较

可比较的类型：Integer，Floating-point，String，Boolean，Complex(复数型)，Pointer，Channel，Interface，Array

不可比较的类型：SLice，Map，Function

主要看 Struct 内部是否有不可比较的类型，如果都是可比较的类型，那么就是可比较的。

如果 Struct 内部存在不同的指针，最终的比较结果也是 false。

硬要比较，可以使用 `reflect.DeepEqual` 进行比较。

- 不同类型的值永远不会深度相等
- 当两个数组的元素对应深度相等时，两个数组深度相等
- 当两个相同结构体的所有字段对应深度相等的时候，两个结构体深度相等
- 当两个函数都为nil时，两个函数深度相等，其他情况不相等（相同函数也不相等）
- 当两个interface的真实值深度相等时，两个interface深度相等
- map的比较需要同时满足以下几个
  - 两个map都为nil或者都不为nil，并且长度要相等
  - 相同的map对象或者所有key要对应相同
  - map对应的value也要深度相等
- 指针，满足以下其一即是深度相等
  - 两个指针满足go的==操作符
  - 两个指针指向的值是深度相等的
- 切片，需要同时满足以下几点才是深度相等
  - 两个切片都为nil或者都不为nil，并且长度要相等
  - 两个切片底层数据指向的第一个位置要相同或者底层的元素要深度相等
  - 注意：空的切片跟nil切片是不深度相等的
- 其他类型的值（numbers, bools, strings, channels）如果满足go的==操作符，则是深度相等的。要注意不是所有的值都深度相等于自己，例如函数，以及嵌套包含这些值的结构体，数组等


## 两个不同的 Struct 可以比较吗？

可以比较，也不可以比较。

可以通过强制转换类型来进行对比，如果含有不可比较的成员变量，那么也不可比较。

## Struct 可以作为 Map 的 Key 吗？

Struct 必须可比较才可以作为 Map 的 Key

## 参考

- https://golangguide.top
