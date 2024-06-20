---
title: "数据库八股文背诵版 - 2"
date: 2022-01-24T14:59:32+08:00
draft: true
author : "Northes"
description: "简介简介"
tags: ["MySQL","八股文","面试"]
---

## DCL等                                                                 
DQL（Data Query Language）：数据查询语言
关键字：select
查询数据
DML（Data Manipulation Language）：数据操作语言
关键字：insert、delete、update
插入、删除、更改数据
DDL（Data Denifition Language）：数据定义语言
关键字：create、drop、alter
创建、删除、更改表结构
TCL（Trasactional Conrtol Language）：事务控制语言
关键字：commit、rollback
用来提交和回滚事务
DCL（Data Conrtol Language）：数据控制语言
关键字：grant、revoke
用来设置或更改数据库用户或角色权限



## 子查询
子查询知识点（来源：机智的豆子）：
where型子查询：指把内部查询的结果作为外层查询的比较条件。子查询：单列单值
from型子查询：把内层的查询结果当成临时表，供外层sql再次查询。子查询：多行多列
in子查询：内层查询语句仅返回一个数据列，这个数据列的值将供外层查询语句进行比较 子查询：单列多行
exists子查询：把外层的查询结果，拿到内层，看内层是否成立，简单来说后面的返回true,外层（也就是前面的语句）才会执行，否则不执行。
any子查询：只要满足内层子查询中的任意一个比较条件，就返回一个结果作为外层查询条件。
all子查询：内层子查询返回的结果需同时满足所有内层查询条件。
比较运算符子查询：子查询中可以使用的比较运算符如 “>” “<” “= ” “!=”

## 数据库查询慢

- https://golangguide.top/%E4%B8%AD%E9%97%B4%E4%BB%B6/mysql/%E6%A0%B8%E5%BF%83%E7%9F%A5%E8%AF%86%E7%82%B9/Mysql%E6%95%B0%E6%8D%AE%E5%BA%93%E6%9F%A5%E8%AF%A2%E5%A5%BD%E6%85%A2%EF%BC%8C%E9%99%A4%E4%BA%86%E7%B4%A2%E5%BC%95%EF%BC%8C%E8%BF%98%E8%83%BD%E5%9B%A0%E4%B8%BA%E4%BB%80%E4%B9%88%EF%BC%9F.html

### 1. 慢查询分析，开启慢查询日志

```sql
set profiling=ON;
show variables like 'profiling';
show profiles;
show profile for query 1;
```

### 2. 索引相关原因

使用 `explain` 命令帮忙分析

索引不符合预期可以使用 `force index` 强制走指定的索引

走了索引还是很慢？

1. 索引区分度太低。如性别、网页的全路径 URL（考虑只保存URI）
2. 索引中匹配到数据太大，关注 `explain`  中的 `rows` 字段。

### 3. 连接数过小

1. 调整 MySQL 的连接数
2. 调整客户端的连接数

```sql
set global max_connections= 500;
show variables like 'max_connections';
```

### 4. Buffer Pool 太小

我们在前面的数据库查询流程里，提到了进了 innodb 之后，会有一层内存 buffer pool，用于将磁盘数据页加载到内存页中，只要查询到 buffer pool 里有，就可以直接返回，否则就要走磁盘 IO，那就慢了。

也就是说，如果我的 buffer pool 越大，那我们能放的数据页就越多，相应的，sql 查询时就更可能命中 buffer pool，那查询速度自然就更快了。

单位是 `Byte`

```sql
show global variables like 'innodb_buffer_pool_size';
```

```sql
set global innodb_buffer_pool_size = 536870912;
```

怎么知道 buffer pool 是不是太小了？
这个我们可以看buffer pool 的缓存命中率。

```sql
show status like 'Innodb_buffer_pool_%';
```
Innodb_buffer_pool_read_requests 表示读请求的次数。

Innodb_buffer_pool_reads 表示从物理磁盘中读取数据的请求次数。

```bash
buffer pool 命中率 = 1 - (Innodb_buffer_pool_reads/Innodb_buffer_pool_read_requests) * 100%
```

一般情况下buffer pool 命中率都在99%以上，如果低于这个值，才需要考虑加大 innodb buffer pool 的大小。

### 5. Server 层加缓存

MySQL 8.0 的时候被干掉了