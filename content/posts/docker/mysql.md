---
title: "Docker 运行 Mysql"
date: 2022-01-11T09:11:07+08:00
draft: true
author : "Northes"
description: "使用Docker运行MySQL"
tags: ["学习笔记"]
---






## MySQL

### 运行

```shell
$  docker run -itd --name mysql-test -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql
```



### 操作

进入mysql控制台后

```shell
$ mysql -u root -p
```

退出

```mysql
exit
```



> sql 语句注意以 ; 结尾

#### 数据库

##### 创建数据库

```mysql
create database 数据库名;
```



##### 查看数据库

```mysql
show databases;
```



##### 选择数据库

```mysql
use 数据库名
```



##### 删除数据库

```mysql
drop database <数据库名>;
```





#### 数据表

##### 创建数据表

```mysql
create table table_name (column_name column_type);
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



##### 查看数据表

```mysql
show tables;
```



##### 删除数据表

```mysql
drop table table_name ;
```





#### 数据

##### 插入数据

```mysql
INSERT INTO table_name ( field1, field2,...fieldN ) VALUES ( value1, value2,...valueN );
```



##### 查找数据

```mysql
select * from 数据表;
```

```mysql
select * from 数据表 where id < 5;
```



##### 更新数据

```mysql
UPDATE table_name SET field1=new-value1, field2=new-value2
[WHERE Clause]
```



##### 删除数据

```mysql
DELETE FROM table_name [WHERE Clause]
```

