---
title: "Elasticsearch - 文档 CRUD"
date: 2021-12-25T01:16:55+08:00
draft: false
author : "Northes"
description: "文档的增删改查，批量操作"
tags: ["学习笔记","Elasticsearch"]
---

## First
- blogs 为我定义的索引名称

## Create

`POST` blogs/_doc

`PUT` blogs/_create/1

`PUT `blogs/_doc/1?op_type=create 

> 1 为文档id

```json
{
  "title": "foo",
  "content": "bar"
}
```
- 支持自动生成文档id和指定文档id两种方式
- 通过调用 `POST /blogs/_doc` 系统会自动生成 `document ID`
- 通过调用 `PUT /blogs/_create/1` 创建时，URI中显式指定 `_create`
 ，此时如果该 id 的文档已经存在，操作失败
- *不存在的字段会自动创建*


## Get
`GET` blogs/_doc/1

> 1 为文档id

- 成功找到文档 HTTP 200
- 找不到文档返回 HTTP 404


## Index
`PUT` blogs/_doc/1

> 1 为文档id

index 和 create 不一样的地方：
- 如果文档不存在，就索引新的文档
- 否则，现有文档会被删除，新的文档被索引。同时版本信息 +1

#### example
旧的：
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
调用index后新的：
```json
{
    "_index": "blogs",
    "_type": "_doc",
    "_id": "1",
    "_version": 2,
    "result": "updated",
    "_shards": {
        "total": 2,
        "successful": 2,
        "failed": 0
    },
    "_seq_no": 1,
    "_primary_term": 2
}
```

## Update

`POST` blogs/_update/1

`PUT` blogs/_doc/1

```json
{
    "doc": {
        "title": "11",
        "33": "33333"
    }
}
```

- update 方法不会删除原来的文档，而是实现真正的数据更新
- 可用于已有字段的更新或新增字段
- Post 方法 / Payload 需要包含在 `doc` 中
- 更新成功后 `_version` 会 +1



## Bulk API

- 支持在一次API调用中，对不同的索引进行操作

- 支持四种类型操作
  - Index

  - Create

  - Update

  - Delete

- 可以在 URI 中指定 Index，也可以在请求的 Payload 中指定
- 操作中单条操作失败，不会影响到其他操作。会立即报错。
- 返回结果包括了每一条操作执行的结果
- json 中的最后一行必须空一行

### example

`POST` _bulk

```json
# 格式
# action: index create update delete
{action:{条件}}
{具体的字段，跟单独调用api一致}
```

```json
{"index":{"_index":"test","_id":"1"}}
{"field1":"value1"}
{"delete":{"_index":"test","_id":"2"}}
{"create":{"_index":"test"}}
{"field1":"create"}
{"update":{"_index":"test","_id":"1"}}
{"doc":{"field1":"value2"}}

```

```json
{
	"took": 63,
	"errors": false,
	"items": [
		{
			"index": {
				"_index": "test",
				"_type": "_doc",
				"_id": "1",
				"_version": 4,
				"result": "updated",
				"_shards": {
					"total": 2,
					"successful": 2,
					"failed": 0
				},
				"_seq_no": 6,
				"_primary_term": 1,
				"status": 200
			}
		},
		{
			"delete": {
				"_index": "test",
				"_type": "_doc",
				"_id": "2",
				"_version": 1,
				"result": "not_found",
				"_shards": {
					"total": 2,
					"successful": 2,
					"failed": 0
				},
				"_seq_no": 7,
				"_primary_term": 1,
				"status": 404
			}
		},
		{
			"create": {
				"_index": "test",
				"_type": "_doc",
				"_id": "4ynq8H0BfpRI0KbW0ChT",
				"_version": 1,
				"result": "created",
				"_shards": {
					"total": 2,
					"successful": 2,
					"failed": 0
				},
				"_seq_no": 8,
				"_primary_term": 1,
				"status": 201
			}
		},
		{
			"update": {
				"_index": "test",
				"_type": "_doc",
				"_id": "1",
				"_version": 5,
				"result": "updated",
				"_shards": {
					"total": 2,
					"successful": 2,
					"failed": 0
				},
				"_seq_no": 9,
				"_primary_term": 1,
				"status": 200
			}
		}
	]
}
```



## Mget

`POST` _mget

```json
{
    "docs": [
        {
            "_index": "test",
            "_id": "1"
        },
        {
            "_index": "test",
            "_id": "2"
        }
    ]
}
```

```json
{
	"docs": [
		{
			"_index": "test",
			"_type": "_doc",
			"_id": "1",
			"_version": 5,
			"_seq_no": 9,
			"_primary_term": 1,
			"found": true,
			"_source": {
				"field1": "value2"
			}
		},
		{
			"_index": "test",
			"_type": "_doc",
			"_id": "2",
			"found": false
		}
	]
}
```



## MSearch

`POST` blogs/_msearch

```json
{}
{"query":{"match_all":{}},"from":0,"size":10} // 从第一条开始，返回10条
{}
{"query":{"match_all":{}}} // 返回所有
{"index":"twitter"} // 切换index
{"query":{"match_all":{}}} // 返回所有

```

```json
{
	"took": 16,
	"responses": [
		{
			"took": 16,
			"timed_out": false,
			"_shards": {
				"total": 3,
				"successful": 3,
				"skipped": 0,
				"failed": 0
			},
			"hits": {
				"total": {
					"value": 5,
					"relation": "eq"
				},
				"max_score": 1,
				"hits": [
					{
						"_index": "blogs",
						"_type": "_doc",
						"_id": "Zyl97X0BfpRI0KbWBSiy",
						"_score": 1,
						"_source": {
							"33": "22",
							"title": "11"
						}
					},
					{
						"_index": "blogs",
						"_type": "_doc",
						"_id": "XSl37X0BfpRI0KbWnyje",
						"_score": 1,
						"_source": {
							"title": "11",
							"content": "22"
						}
					},
					{
						"_index": "blogs",
						"_type": "_doc",
						"_id": "2",
						"_score": 1,
						"_source": {
							"title": "11",
							"content": "22"
						}
					},
					{
						"_index": "blogs",
						"_type": "_doc",
						"_id": "3SnU8H0BfpRI0KbWeyiQ",
						"_score": 1,
						"_source": {
							"title": "ddd",
							"content": "ssss"
						}
					},
					{
						"_index": "blogs",
						"_type": "_doc",
						"_id": "1",
						"_score": 1,
						"_source": {
							"title": "ddd",
							"content": "ssss"
						}
					}
				]
			},
			"status": 200
		},
		{
			"took": 15,
			"timed_out": false,
			"_shards": {
				"total": 3,
				"successful": 3,
				"skipped": 0,
				"failed": 0
			},
			"hits": {
				"total": {
					"value": 5,
					"relation": "eq"
				},
				"max_score": 1,
				"hits": [
					{
						"_index": "blogs",
						"_type": "_doc",
						"_id": "Zyl97X0BfpRI0KbWBSiy",
						"_score": 1,
						"_source": {
							"33": "22",
							"title": "11"
						}
					},
					{
						"_index": "blogs",
						"_type": "_doc",
						"_id": "XSl37X0BfpRI0KbWnyje",
						"_score": 1,
						"_source": {
							"title": "11",
							"content": "22"
						}
					},
					{
						"_index": "blogs",
						"_type": "_doc",
						"_id": "2",
						"_score": 1,
						"_source": {
							"title": "11",
							"content": "22"
						}
					},
					{
						"_index": "blogs",
						"_type": "_doc",
						"_id": "3SnU8H0BfpRI0KbWeyiQ",
						"_score": 1,
						"_source": {
							"title": "ddd",
							"content": "ssss"
						}
					},
					{
						"_index": "blogs",
						"_type": "_doc",
						"_id": "1",
						"_score": 1,
						"_source": {
							"title": "ddd",
							"content": "ssss"
						}
					}
				]
			},
			"status": 200
		},
		{
			"took": 7,
			"timed_out": false,
			"_shards": {
				"total": 1,
				"successful": 1,
				"skipped": 0,
				"failed": 0
			},
			"hits": {
				"total": {
					"value": 100,
					"relation": "eq"
				},
				"max_score": 1,
				"hits": [
					{
						"_index": "twitter",
						"_type": "tweet",
						"_id": "dSnN8H0BfpRI0KbWwygB",
						"_score": 1,
						"_source": {
							"author_id": 69,
							"author_name": "Edgar Brush",
							"message": "Geology rocks, but Geography is where it's at!",
							"created_at": "2009-11-15T14:12:12"
						}
					},
					{
						"_index": "twitter",
						"_type": "tweet",
						"_id": "dinN8H0BfpRI0KbWwygB",
						"_score": 1,
						"_source": {
							"author_id": 43,
							"author_name": "Elvira Rain",
							"message": "I really want to buy one of those supermarket checkout dividers, but the cashier keeps putting it back.",
							"created_at": "2009-11-15T14:12:12"
						}
					},
					{
						"_index": "twitter",
						"_type": "tweet",
						"_id": "dynN8H0BfpRI0KbWwygB",
						"_score": 1,
						"_source": {
							"author_id": 71,
							"author_name": "Junie Gerard",
							"message": "Why did the girl smear peanut butter on the road? To go with the traffic jam.",
							"created_at": "2009-11-15T14:12:12"
						}
					},
					{
						"_index": "twitter",
						"_type": "tweet",
						"_id": "eCnN8H0BfpRI0KbWwygB",
						"_score": 1,
						"_source": {
							"author_id": 97,
							"author_name": "Kayla Vanguilder",
							"message": "Why was the broom late for the meeting? He overswept.",
							"created_at": "2009-11-15T14:12:12"
						}
					},
					{
						"_index": "twitter",
						"_type": "tweet",
						"_id": "eSnN8H0BfpRI0KbWwygB",
						"_score": 1,
						"_source": {
							"author_id": 43,
							"author_name": "Claud Granderson",
							"message": "I went to the doctor today and he told me I had type A blood but it was a type O.",
							"created_at": "2009-11-15T14:12:12"
						}
					},
					{
						"_index": "twitter",
						"_type": "tweet",
						"_id": "einN8H0BfpRI0KbWwygB",
						"_score": 1,
						"_source": {
							"author_id": 25,
							"author_name": "Fleta Figgins",
							"message": "Why do you never see elephants hiding in trees? Because they're so good at it.",
							"created_at": "2009-11-15T14:12:12"
						}
					},
					{
						"_index": "twitter",
						"_type": "tweet",
						"_id": "eynN8H0BfpRI0KbWwygB",
						"_score": 1,
						"_source": {
							"author_id": 64,
							"author_name": "Glenna Pizarro",
							"message": "What’s the advantage of living in Switzerland? Well, the flag is a big plus.",
							"created_at": "2009-11-15T14:12:12"
						}
					},
					{
						"_index": "twitter",
						"_type": "tweet",
						"_id": "fCnN8H0BfpRI0KbWwygB",
						"_score": 1,
						"_source": {
							"author_id": 92,
							"author_name": "Jared Mcelravy",
							"message": "A book just fell on my head. I only have my shelf to blame.",
							"created_at": "2009-11-15T14:12:12"
						}
					},
					{
						"_index": "twitter",
						"_type": "tweet",
						"_id": "fSnN8H0BfpRI0KbWwygB",
						"_score": 1,
						"_source": {
							"author_id": 38,
							"author_name": "Dong Rierson",
							"message": "I went to a Foo Fighters Concert once... It was Everlong...",
							"created_at": "2009-11-15T14:12:12"
						}
					},
					{
						"_index": "twitter",
						"_type": "tweet",
						"_id": "finN8H0BfpRI0KbWwygB",
						"_score": 1,
						"_source": {
							"author_id": 99,
							"author_name": "Jules Basch",
							"message": "Two peanuts were walking down the street. One was a salted.",
							"created_at": "2009-11-15T14:12:12"
						}
					}
				]
			},
			"status": 200
		}
	]
}
```



## 常见错误

200 请求成功

4xx 请求格式错误

429 集群过于繁忙 （重试请求或增加集群节点）

500 集群内部错误

