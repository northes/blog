---
title: "Linux 常用命令"
date: 2021-12-17T23:31:02+08:00
draft: false
author : "Northes"
description: "Linux 常用命令"
tags: ["学习笔记"]
---

## 软连接

```bash
ln
```

## 查找 cli 位置

```bash
whereis docker
```

## 查看 IP

```bash
ifconfig
ip addr
```

## 查看端口占用


```bash
lsof -i:端口号
```

```bash
lsof -i:8080：查看8080端口占用
lsof abc.txt：显示开启文件abc.txt的进程
lsof -c abc：显示abc进程现在打开的文件
lsof -c -p 1234：列出进程号为1234的进程所打开的文件
lsof -g gid：显示归属gid的进程情况
lsof +d /usr/local/：显示目录下被进程开启的文件
lsof +D /usr/local/：同上，但是会搜索目录下的目录，时间较长
lsof -d 4：显示使用fd为4的进程
lsof -i -U：显示所有打开的端口和UNIX domain文件
```

```bash
netstat -ntlp   //查看当前所有tcp端口
netstat -ntulp | grep 80   //查看所有80端口使用情况
netstat -ntulp | grep 3306   //查看所有3306端口使用情况
netstat -anlp | grep -w LISTEN
```

## 查看数据链路

```bash
traceroute <ip>
```

## 关机

```bash
# 一分钟后关机
shutdown
# 取消关机
shutdown -c
# 立即关机
shutdown now
```

## 时间/时区修改

### 查看当前系统时间

```bash
date -R
```

### 设置系统时区

```bash
timedatectl set-timezone Asia/Shanghai
```

### 互联网同步时间

```bash
# 关闭
timedatectl set-ntp 0
# 开启
timedatectl set-ntp 0
```

## 文件大小

```bash
# 查看文件夹大小
du -sh .
# 查看文件大小(Byte)
ls -ll
# 查看文件大小(KB,MB)
ls -lh
```

## 安装 cli 到指定位置

```bash
install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
```

## 查看域名DNS解析

```bash
dig xxx.com
```

## 展示当前系统中正在运行的进程的树状结构

```bash
pstree -g
```