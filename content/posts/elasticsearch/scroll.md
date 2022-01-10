---
title: "Elasticsearch - 游标"
date: 2021-12-29T14:36:31+08:00
draft: false
author : "Northes"
description: "游标查询，解决深度分页带来的性能问题"
tags: ["学习笔记","Elasticsearch"]
---

游标（scroll）可以用来对 Elasticsearch 进行有效的大批量文档查询，而有不用付出深度分页的性能代价

游标允许我们先做 查询初始化 ，然后再批量地拉取结果。

## 分布式系统中的深度分页
&ensp;&ensp;&ensp;&ensp;Elasticsearch 会将查询广播到每一个分片索引（主分片，副本分片），再将各分片中搜索到结果汇总处理进行返回。 

&ensp;&ensp;&ensp;&ensp;假设我们在5个主分片的索引中搜索，当我们请求结果的第一页（结果从1到10），每一个分片产生前10的结果，并返回给协调节点，协调节点对50个结果排序得到全部结果的前10个。 现在假设我们请求第1000页（结果从10001到10010）。每一个分片都产生10010个结果返回，协调节点对全部50050个结果排序，最后丢弃掉这些结果中的50040个结果。单这么一看这些数字都会觉得十分浪费资源。

&ensp;&ensp;&ensp;&ensp;在分布式系统中，对结果排序的成本随分页的深度成指数上升。这就是Web搜索引擎对任何查询都不要返回超过1000个结果的原因

&ensp;&ensp;&ensp;&ensp;以Google为例，同一搜索词每次只返回9页，每页20条。当跳转到第9页的最下面时，会提示“是否展示折叠的结果”。如果选择是，此时可以理解为将使用游标进行查询。

> 小数据量分页使用 `form` `size` 即可


## 使用
`GET` /<index>/_search?scroll=1m
```json
{
  "query": {"match_all":{}},
  "sort": ["_doc"],
  "size": 1000
}
```
> 保存游标查询窗口一分钟


查询返回的结果中会有 `_scroll_id` 的字段，使用他进行下一次请求
```json
{
  "_scroll_id": "FGluY2x1ZGVfY29udGV4dF91dWlkDXF1ZXJ5QW5kRmV0Y2gBFE1Zd01CWDRCRnRBOVVIcUZqNW1BAAAAAAAAAEcWNE5MOVNxRnJRLU9EQ3lmaUlleVdGUQ==",
  ...
}
```

返回下一批 `size` 大小的结果，`size` 在首次请求时定义

`POST` /_search/scroll
```json
{
    "scroll": "1m",
    "scroll_id": "FGluY2x1ZGVfY29udGV4dF91dWlkDXF1ZXJ5QW5kRmV0Y2gBFE1Zd01CWDRCRnRBOVVIcUZqNW1BAAAAAAAAAEcWNE5MOVNxRnJRLU9EQ3lmaUlleVdGUQ=="
}
```
> 再次将游标查询过期时间设置为一分钟（此刻往后一分钟过期），过期再使用旧 `_scroll_id` 请求会报404

当没有更多的结果返回时，代表处理完所有文档了。