---
title: "Elasticsearch - 文档"
date: 2021-12-25T00:05:43+08:00
draft: false
author : "Northes"
description: "索引、文档字段释义，与关系型数据库对比"
tags: ["学习笔记","Elasticsearch"]
---



> 索引，文档 - 逻辑概念
>
> 节点，分片 - 物理概念



## 文档

关系型数据库中的一条记录
序列化成json保存
每一条文档都有一个uid，可以自己指定，可以es生成

```json
{
    "_index": "blogs",
    "_type": "_doc",
    "_id": "1",
    "_version": 1,
    "_seq_no": 0,
    "_primary_term": 2,
    "found": true,
    "_source": {
        "title": "11",
        "content": "22"
    }
}
```

| 字段     | 解释                            |
| -------- | ------------------------------- |
| _index   | 文档所属的索引名                |
| _type    | 文档所属的类型，7.0后只能为_doc |
| _id      | 文档唯一id                      |
| _source  | 文档的原始json数据              |
| _version | 文档版本信息                    |
| _score   | 相关性打分                      |




## 与关系型数据库

| RDBMS           | Elasticsearch |
| --------------- | ------------- |
| Table - 表      | Index(Type)   |
| Row - 记录      | Document      |
| Column - 字段   | Field         |
| Schema - 表定义 | Mapping       |
| SQL - 查询语句  | DSL           |

Elasticsearch：相关性 / 高性能全文检索 / Schemaless

EDMS：事务性 / Join