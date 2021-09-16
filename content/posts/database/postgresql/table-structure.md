---
title: "PostgreSQL 查看表结构"
date: 2021-09-16T16:57:13+08:00
draft: false
author : "Northes"
description: "查看表结构 导出"
tags: ["学习笔记","PostgreSQL"]
---

## 查看所有表结构
```sql
SELECT C
	.relname 表名,
	CAST ( obj_description ( relfilenode, 'pg_class' ) AS VARCHAR ) 名称,
	A.attname 字段,
	concat_ws (
	'',
	T.typname,
	SUBSTRING ( format_type ( A.atttypid, A.atttypmod ) FROM '\(.*\)' )) AS 列类型,
	d.description 字段备注
FROM
	pg_class C,
	pg_attribute A,
	pg_type T,
	pg_description d
WHERE
	A.attnum > 0
	AND A.attrelid = C.oid
	AND A.atttypid = T.oid
	AND d.objoid = A.attrelid
	AND d.objsubid = A.attnum
	AND C.relname IN ( SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND POSITION ( '_2' IN tablename ) = 0 )
ORDER BY
	C.relname,
	A.attnum
```

## 查看所有表名
```sql
SELECT
	tablename 
FROM
	pg_tables 
WHERE
	schemaname = 'public' 
	AND POSITION ( '_2' IN tablename ) = 0;
SELECT
	* 
FROM
	pg_tables;
```

## 查看表名和备注
```sql
SELECT
	relname AS tabname,
	CAST ( obj_description ( relfilenode, 'pg_class' ) AS VARCHAR ) AS COMMENT 
FROM
	pg_class C 
WHERE
	relname IN ( SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND POSITION ( '_2' IN tablename ) = 0 );
SELECT
	* 
FROM
	pg_class;
```

## 查看特定表名和备注
```sql
SELECT
	relname AS tabname,
	CAST ( obj_description ( relfilenode, 'pg_class' ) AS VARCHAR ) AS COMMENT 
FROM
	pg_class C 
WHERE
	relname = '表名';
```

## 查看特定表名字段
```sql
SELECT A
	.attnum,
	A.attname,
	concat_ws (
	'',
	T.typname,
	SUBSTRING ( format_type ( A.atttypid, A.atttypmod ) FROM '\(.*\)' )) AS TYPE,
	d.description 
FROM
	pg_class C,
	pg_attribute A,
	pg_type T,
	pg_description d 
WHERE
	C.relname = '表名' 
	AND A.attnum > 0 
	AND A.attrelid = C.oid 
	AND A.atttypid = T.oid 
	AND d.objoid = A.attrelid 
	AND d.objsubid = A.attnum;
```