---
title: "Linux 搭建 NFS"
date: 2022-06-21T10:58:35+08:00
draft: false
author : "Northes"
description: "在 CentOS 8 下搭建 NFS(Network File System) 分布式文件系统"
tags: ["学习笔记","Linux","NFS"]
---

## 环境
- CentOS 8 主机 *2

## 服务端
### 安装工具套件
```shell
# 安装 nfs 工具套件
yum install -y nfs-utils
# `-y` 即遇到询问通通确认

# 创建用于 nfs 的共享目录
mkdir -p /nfs/data
# 设置权限，否则 K8s 的 Pod 内会有访问问题
chmod -R 777 /nfs/data

# 编辑 export 配置文件
echo "/nfs/data/ *(insecure,rw,sync,no_root_squash)" > /etc/exports
```

### 启动服务
```shell
# 应用配置
exportfs -arv
# 启动服务
service nfs-server start
# 设置开机自启
systemctl enable nfs-server
```
`exportfs`
- -a：全部挂载/卸载 `/etc/exports` 文件内的设定
- -r：重新挂载 `/etc/exports` 的设置，此外，同步 `/etc/exports` 及 `/var/lib/nfs/xtab` 中的内容
- -u：卸载某一目录
- -v：将共享目录展示在屏幕上

### 查看
```shell
# 查看服务状态
systemctl status nfs-server
# 或
exportfs
```

```shell
# 查看本机内网 IP，找到 eth0，记下来
ifconfig
```

## 客户端
去到另一台机器上，绑定 nfs 目录

<master.ip> 替换为上面开启了 nfs 的主机 IP
```shell
# 查询 nfs 服务器的共享目录列表
showmount -e <master.ip>
# 新建目录
mkdir -p /nfs/data
# 挂载 nfs 目录到指定的本地目录
mount -t nfs <master.ip>:/nfs/data /nfs/data
```
`showmount`
- -e：输出目录列表（共享目录列表）
- -d：显示被挂载的共享目录
- -a：显示客户端信息和共享目录

## 测试
```shell
touch /nfs/data/hello
```
如在任意一台机器的 `/nfs/data` 目录下都能看到 `hello` 这个文件，即搭建成功

如果已经在目录下，可尝试退出重进
