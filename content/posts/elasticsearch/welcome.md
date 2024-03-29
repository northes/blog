---
title: "Elasticsearch - 入门"
date: 2021-12-22T23:21:09+08:00
draft: false
author : "Northes"
description: "Elasticsearch 安装,启动 Kibana,Cerebro等"
tags: ["学习笔记","Elasticsearch"]
---

## Elasticsearch

### 目录

| 目录    | 配置文件          | 描述                                           |
| ------- | ----------------- | ---------------------------------------------- |
| bin     |                   | 脚本文件，包括启动es，安装插件。运行统计数据等 |
| config  | elasticsearch.yml | 集群配置文件，user，role based 相关配置        |
| JDK     |                   | Java 运行环境                                  |
| data    | path.data         | 数据文件                                       |
| lib     |                   | Java 类库                                      |
| logs    | path.log          | 日志文件                                       |
| modules |                   | 包含所有ES模块                                 |
| plugins |                   | 包含所有已安装插件                             |



### 设置

`config/jvm.options`

java 虚拟机的配置

Xmx和Xms设置成一样的

一般Xmx不要超过机器内存50%，如果占用过多内存，可设置为

```shell
-Xms512m
-Xmx512m
```



### 插件

`bin` 目录下

```shell
# 参看安装的插件
$ elasticsearch-plugin list
# 或者  [host]/_cat/plugins

# 安装插件
$ elasticsearch-plugin install ik
```



### 节点

单机启动多节点

```shell
$	bin/elasticsearch -E node.name=node1 -E cluster.name=mycluster -E path.data=node1_data -d
$	bin/elasticsearch -E node.name=node2 -E cluster.name=mycluster -E path.data=node2_data -d
$	bin/elasticsearch -E node.name=node3 -E cluster.name=mycluster -E path.data=node3_data -d
```





## Kibana

### 启动

```shell
$ bin/kibana
```

http://localhost:5601



### Dev Tool

#### 快捷键

```shell
cmd + /
```



### 插件

```shell
$ kibana-plugin install <plugin-name>
$ kibana-plugin list
$ kibana remove <plugin-name>
```



### I18N 设置中文

config/kibana.yml

```yaml
# 将
i18n.locale: "en"
# 改成
i18n.locale: "zh-CN"
```





## Cerebro

https://github.com/lmenezes/cerebro

## 浏览器插件
1. Elasticvue
   
   Chrome商店 https://chrome.google.com/webstore/detail/elasticvue/hkedbapjpblbodpgbajblpnlpenaebaa
   
2. ElasticSearch Head
   
   Chrome商店 
   https://chrome.google.com/webstore/detail/elasticsearch-head/ffmkiejjmecolpfloofpjologoblkegm
