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