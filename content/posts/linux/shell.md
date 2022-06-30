---
title: "Shell 实用技巧"
date: 2022-06-30T15:11:51+08:00
draft: false
author : "Northes"
description: "Shell 实用技巧备忘"
tags: ["Shell","Linux"]
---

## 判断文件\文件夹件是否存在
```shell
if [ -d app ];then
  echo true
else
  echo false
fi
```
```shell
# 简洁
[ -f hello.txt ] && echo yes || echo no
```
- -e：文件
- -d：目录
- -f：常规文件
- -L：符号链接
- -r：可读
- -w：可写
- -x：可执行
- -s：文件长度不为 0
- -h：软链接
