---
title: "UPX 学习笔记"
date: 2021-06-02T09:45:36+08:00
draft: false
author : "Northes"
description: "UPX的使用方法，压缩二进制文件的体积"
tags: ["UPX","学习笔记"]
---

## 下载&安装

**发布页**

https://upx.github.io/

**项目地址**

https://github.com/upx/upx

**下载**

https://github.com/upx/upx/releases

**全局使用**

将解压后的二进制文件夹添加到系统 `PATH` 以便全局使用





## 常用指令
**版本：V3.96**

查看版本
```shell
upx -V
```

默认压缩
```shell
upx 程序名.exe
```

较快压缩
```shell
upx -1 程序名
```

较好压缩

```shell
upx -9 程序名
```

最优压缩

```shell
upx --best 程序名
```

还原压缩

```shell
upx -d 程序名
```

测试是否是UPX压缩

```shell
upx -t 程序名
```

保留备份文件

```shell
upx -k 程序名
```



## 全部指令

**来源互联网*

以下命令中文意思翻译的不好，请见谅

> 备注：当UPX.exe和待压缩文件在同一个目录下时可以直接使用upx -命令 程序名.exe
当UPX.exe和待压缩文件不在同一个目录下时可以直接使用upx -命令 程序完整目录+程序名.exe

```shell
默认压缩[upx 程序名.exe]
较快压缩[upx -1 程序名.exe]
较好压缩[upx -9 程序名.exe]
最优压缩[upx --best 程序名.exe]
还原压缩[upx -d 程序名.exe]
测试是否是UPX压缩[upx -t 程序名.exe]
显示UPX压缩清单[upx -l 程序名.exe]
显示UPX版本[upx -V]
显示UPX使用说明[upx -L]
UPX使用帮助[upx -h]
减少UPX压缩显示[upx -q 程序名.exe]
增加UPX压缩显示[upx -v 程序名.exe]
将UPX压缩另存为其它文件[upx -o 1.exe 程序名.exe]
强制压缩可疑文件[upx -f 程序名.exe]
保留备份文件[upx -k 程序名.exe]
不备份UPX压缩[upx --no-backup 程序名.exe]
无颜色UPX压缩[upx --no-color 程序名.exe]
UPX压缩无进度条显示[upx --no-progress 程序名.exe]
尝试所有可用的压缩方法和过滤器[慢][upx --brute 程序名.exe]
超级暴力尝试更多的压缩变体[非常慢] [upx --ultra-brute 程序名.exe]
保留额外数据[默认值][upx --overlay=copy 程序名.exe]
覆盖额外数据[upx --overlay=strip 程序名.exe]
不处理额外数据[upx --overlay=skip 程序名.exe]
压缩导出部分[upx --compress-exports=1 程序名.exe]
不压缩导出部分[upx --compress-exports=0 程序名.exe]
压缩所有图标[upx --compress-icons=3 程序名.exe]
压缩除第一个图标以外的所有图标[upx --compress-icons=1 程序名.exe]
压缩除第一个图标目录外的所有图标[默认值][upx --compress-icons=2 程序名.exe]
不压缩任何图标[upx --compress-icons=0 程序名.exe]
不压缩任何资源[upx --compress-resources=0 程序名.exe]
不压缩list指定的资源[upx --keep-resource=list 程序名.exe]
不剥离重定位[upx --strip-relocs=0 程序名.exe]
剥离重定位[upx --strip-relocs=1 程序名.exe]
```
