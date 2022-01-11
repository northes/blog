---
title: "Elasticsearch - 索引"
date: 2021-12-29T16:08:28+08:00
draft: true
author : "Northes"
description: "简介简介"
tags: ["学习笔记"]
---

索引相当于指向一个或多个物理分片的逻辑命名空间

## 索引

每一个相似文档的集合

`Mapping` 定义文档字段类型，用于定义包含的文档的字段名和字段类型，指定字段是否进行倒排索引

`Shard` 分片。物理空间的概念，索引中的数据分散在 Shard 上

`Setting` 定义不同的数据分布。多少个分片，数据如何分布等

