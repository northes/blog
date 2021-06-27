---
title: "MySQL 常用命令"
date: 2021-06-27T21:55:00+08:00
draft: false
author : "Northes"
description: "MySQL的常用命令"
tags: ["学习笔记","MySQL"]
---

## 基础
### 连接
```shell
$ mysql -h 127.0.0.1 -u root -P 33061 -p
```

**-h** ：主机名，默认localhost

**-P** ：端口，默认3306

**-u** ：用户名

**-p** ：使用密码




### 退出
```mysql
exit;
```



> sql 语句注意以 ; 结尾



## 数据库

### 创建数据库

```mysql
create DATABASE <数据库名>;
```



### 查看数据库

```mysql
show databases;
```



### 选择数据库

```mysql
use <数据库名>; 
```



### 删除数据库

```mysql
drop database <数据库名>;
```





## 数据表

### 创建数据表

```mysql
CREATE table table_name (column_name column_type);
```

```mysql
CREATE TABLE IF NOT EXISTS `runoob_tbl`(
   `runoob_id` INT UNSIGNED AUTO_INCREMENT,
   `runoob_title` VARCHAR(100) NOT NULL,
   `runoob_author` VARCHAR(40) NOT NULL,
   `submission_date` DATE,
   PRIMARY KEY ( `runoob_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```



### 查看数据表

```mysql
show tables;
```



### 删除数据表

```mysql
drop table <数据表名> ;
```





## 数据

### 插入数据

```mysql
INSERT INTO table_name (field1, field2,...fieldN) VALUES (value1, value2,...valueN);
```



### 查找数据

#### 查询所有

```mysql
select * from <table_name>;
```

#### 指定查询范围

```mysql
select * from <table_name> where id < 5;
```

#### 指定查询的字段

```mysql
select <field1>,<field2> from <table_name> where id=1;
```



### 更新数据

#### 更新全部

```mysql
UPDATE table_name SET field1=new_value1,field2=new_value2;
```

#### 更新指定范围

```mysql
UPDATE table_name SET field1=new_value1 WHERE id=1;
```



### 删除数据

```mysql
DELETE FROM table_name WHERE id<5;
```


