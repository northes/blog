---
title: "Elasticsearch - 分词"
date: 2021-12-25T17:40:59+08:00
draft: false
author : "Northes"
description: "使用分词器进行倒排索引词典的创建"
tags: ["学习笔记","Elasticsearch"]
---


## 分词

### 直接指定 Analyzer

`GET` _analyze

#### standard

默认分词器，按词切分，大写转小写，停用词默认关闭

```json
{
    "analyzer":"standard",
    "text":"2 running Quick brown-foxes leap over lazy dogs in the summer evening"
}
```

```json
{
	"tokens": [
		{
			"token": "2",
			"start_offset": 0,
			"end_offset": 1,
			"type": "<NUM>",
			"position": 0
		},
		{
			"token": "running",
			"start_offset": 2,
			"end_offset": 9,
			"type": "<ALPHANUM>",
			"position": 1
		},
		...
		{
			"token": "evening",
			"start_offset": 62,
			"end_offset": 69,
			"type": "<ALPHANUM>",
			"position": 12
		}
	]
}
```

> 停用词是指在信息检索中，为节省存储空间和提高搜索效率，在处理自然语言数据（或文本）之前或之后会自动过滤掉某些字或词。如 in ，the 等

#### simple

按非字母切分，且非字母都被去除

小写处理

```json
{
    "analyzer":"simple",
    "text":"2 running Quick brown-foxes leap over lazy dogs in the summer evening"
}
```

```json
{
	"tokens": [
		{
			"token": "running",
			"start_offset": 2,
			"end_offset": 9,
			"type": "word",
			"position": 0
		},
		{
			"token": "quick",
			"start_offset": 10,
			"end_offset": 15,
			"type": "word",
			"position": 1
		},
		...
		{
			"token": "evening",
			"start_offset": 62,
			"end_offset": 69,
			"type": "word",
			"position": 11
		}
	]
}
```

#### stop

启用停用词的 simple

会把 the ， a ， is 等修饰性词曲去除

```json
{
    "analyzer":"stop",
    "text":"2 running Quick brown-foxes leap over lazy dogs in the summer evening"
}
```

```json
{
	"tokens": [
		{
			"token": "running",
			"start_offset": 2,
			"end_offset": 9,
			"type": "word",
			"position": 0
		},
		{
			"token": "quick",
			"start_offset": 10,
			"end_offset": 15,
			"type": "word",
			"position": 1
		},
		...
		{
			"token": "evening",
			"start_offset": 62,
			"end_offset": 69,
			"type": "word",
			"position": 11
		}
	]
}
```

> 相比 simple 分词器少了 2 , in , the 等停用词

#### whitespace

按照空格进行切分，不转换大小写，不删除 - 等连接符

```json
{
	"tokens": [
		{
			"token": "2",
			"start_offset": 0,
			"end_offset": 1,
			"type": "word",
			"position": 0
		},
		...
		{
			"token": "Quick",
			"start_offset": 10,
			"end_offset": 15,
			"type": "word",
			"position": 2
		},
		{
			"token": "brown-foxes",
			"start_offset": 16,
			"end_offset": 27,
			"type": "word",
			"position": 3
		},
		...
		{
			"token": "in",
			"start_offset": 48,
			"end_offset": 50,
			"type": "word",
			"position": 8
		},
		...
		{
			"token": "evening",
			"start_offset": 62,
			"end_offset": 69,
			"type": "word",
			"position": 11
		}
	]
}
```

#### keyword

不分词，直接将输入当一个term输出

```json
{
	"tokens": [
		{
			"token": "2 running Quick brown-foxes leap over lazy dogs in the summer evening",
			"start_offset": 0,
			"end_offset": 69,
			"type": "word",
			"position": 0
		}
	]
}
```

#### pattern

通过正则表达式进行分词

默认是 \W+ , 非字符的符号进行分隔

```json
{
	"tokens": [
		{
			"token": "2",
			"start_offset": 0,
			"end_offset": 1,
			"type": "word",
			"position": 0
		},
		...
		{
			"token": "dogs",
			"start_offset": 43,
			"end_offset": 47,
			"type": "word",
			"position": 8
		},
		{
			"token": "in",
			"start_offset": 48,
			"end_offset": 50,
			"type": "word",
			"position": 9
		},
		...
		{
			"token": "evening",
			"start_offset": 62,
			"end_offset": 69,
			"type": "word",
			"position": 12
		}
	]
}
```

#### 国家语言

```json
{
    "analyzer":"english",
    "text":"2 running Quick brown-foxes leap over lazy dogs in the summer evening"
}
```

```json
{
	"tokens": [
		{
			"token": "2",
			"start_offset": 0,
			"end_offset": 1,
			"type": "<NUM>",
			"position": 0
		},
		{
			"token": "run",
			"start_offset": 2,
			"end_offset": 9,
			"type": "<ALPHANUM>",
			"position": 1
		},
		...
		{
			"token": "brown",
			"start_offset": 16,
			"end_offset": 21,
			"type": "<ALPHANUM>",
			"position": 3
		},
		{
			"token": "fox",
			"start_offset": 22,
			"end_offset": 27,
			"type": "<ALPHANUM>",
			"position": 4
		},
		...
		{
			"token": "dog",
			"start_offset": 43,
			"end_offset": 47,
			"type": "<ALPHANUM>",
			"position": 8
		},
		...
		{
			"token": "even",
			"start_offset": 62,
			"end_offset": 69,
			"type": "<ALPHANUM>",
			"position": 12
		}
	]
}
```

> running 分词后变成了 run , foxes -> fox , enening -> even



### 指定索引字段进行测试

`POST` blogs/_analyze

```json
{
    "field":"title",
    "text":"Masteting Elasticsearch"
}
```

```json
{
	"tokens": [
		{
			"token": "masteting",
			"start_offset": 0,
			"end_offset": 9,
			"type": "<ALPHANUM>",
			"position": 0
		},
		{
			"token": "elasticsearch",
			"start_offset": 10,
			"end_offset": 23,
			"type": "<ALPHANUM>",
			"position": 1
		}
	]
}
```

### 自定义分词器

`POSt` _analyze

```json
{
    "tokenizer":"standard",
    "filter": ["lowercase"],
    "text":"Masteting Elasticsearch"
}
```

```json
{
	"tokens": [
		{
			"token": "masteting",
			"start_offset": 0,
			"end_offset": 9,
			"type": "<ALPHANUM>",
			"position": 0
		},
		{
			"token": "elasticsearch",
			"start_offset": 10,
			"end_offset": 23,
			"type": "<ALPHANUM>",
			"position": 1
		}
	]
}
```

