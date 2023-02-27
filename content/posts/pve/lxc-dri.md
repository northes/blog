---
title: "LXC 直通核显"
date: 2023-02-27T15:20:45+08:00
draft: false
author : "Northes"
description: "LXC 直通核显进行解码的方法"
tags: ["学习笔记","PVE","Emby","Jellyfin"]
---

在搭建家庭影视中心的时候，Emby，Jellyfin 等工具需要用到核显进行解码

## 直通

PVE 7.x

1. 宿主机中查看驱动

```bash
ls -l /dev/dri

## card0  renderD128
```

2. 创建容器，取消勾选 `无特权容器`，已创建的容器最好先关闭

3. 宿主机中编辑配置文件

```bash
vi /etc/pve/lxc/<lxc_id>.conf

# 添加
lxc.cgroup2.devices.allow: c 226:0 rwm 
lxc.cgroup2.devices.allow: c 226:128 rwm 
lxc.mount.entry: /dev/dri/card0 dev/dri/card0 none bind,optional,create=file 
lxc.mount.entry: /dev/dri/renderD128 dev/dri/renderD128 none bind,optional,create=file
```

## 查看支持的解码器

启动LXC，查看核显是否挂载成功

```bash
apt-get install vainfo

vainfo
```