---
title: "Elasticsearch - 映射"
date: 2021-12-29T15:50:52+08:00
draft: true
author : "Northes"
description: "简介简介"
tags: ["学习笔记","Elasticsearch"]
---

为了能够将时间域视为时间，数字域视为数字，字符串域视为全文或精确值字符串，Es 需要知道每个域中数据的类型。这个数据类型的信息被记录在映射（mapping）中。

## 核心简单域类型

es 支持如下简单域类型

- 字符串 text,keyword
- 整数 byte,short,integer,long
- 浮点数 float,double
- 布尔型 boolean
- 日期 date

> 从 es 5.x 开始不在支持 string

当索引一个包含新域的文档时，Es 会使用动态映射，尝试猜测文档中的域类型

| Json Type                     | 域 Type |
| ----------------------------- | ------- |
| 布尔型 true false             | boolean |
| 整数 123                      | long    |
| 浮点数 123.45                 | double  |
| 字符串，有效的日期 2021-12-29 | date    |
| 字符串 foo bar                | string  |

> 这意味着使用引号 “123” 包裹一个数字，他会被映射为 string 类型，而不是 long 。但是，如果这个域先前已经被映射为 long ，那个 Es 会尝试将这个字符串转为数字，如果转换失败，将报错



## 查看映射

`GET` <index>/_mapping

## 自定义映射
```json

```