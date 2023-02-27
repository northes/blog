---
title: "LXC 下使用 Tailscale"
date: 2023-02-27T15:06:15+08:00
draft: false
author : "Northes"
description: "LCX 使用 OpenVPN，Tailscale 等工具时无法启动的解决方法"
tags: ["学习笔记"]
---


默认的 LCX 容器是没有启动 TUN 模块的，因此在使用 OpenVPN，Tailscale 之类的网络工具时，会出现无法启动的情况，使用如下配置以启动容器的 TUN 模块

需进入宿主机编辑 LXC 配置文件

- 建议先将 LCX 容器关停

`vi /etc/pve/lxc/[id].conf`

```text
lxc.cgroup2.devices.allow: c 10:200 rwm
lxc.mount.entry: /dev/net dev/net none bind,create=dir
```

## 参考

- [https://pve.proxmox.com/wiki/OpenVPN_in_LXC](https://pve.proxmox.com/wiki/OpenVPN_in_LXC)