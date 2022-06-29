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
以上配置分三个部分：

1. 第一部分就是本地要共享出去的目录 
2. 第二部分为允许访问的主机（可以是一个 IP 也可以的是一个 IP 段），`*` 代表允许所有的网段访问
3. 第三部分小括号部分，为权限选项

**权限说明**
- rw：读写
- ro：只读
- sync：同步模式，内存中数据实时写入磁盘
- async：不同步，把内存中数据定期写入磁盘
- secure：nfs 通过 1024 以下的安全 TCP、IP 端口发送
- insecure：nfs 通过 1024 以上的端口发送
- no_root_squash：root 用户会对共享的目录拥有至高权限控制，就像对本机的目录操作一样。不安全，不建议使用。
- root_squash：和上面的选项对应，root 用户对共享目录的权限不高，只有普通用户的权限，即限制了 root
- all_squash：不管使用 nfs 的用户是谁，他的身份都会被限定成为一个指定的普通用户身份
- anonuid、anongid：要和 root_squash 或 all_squash 一起使用，用于指定使用 nfs 的用户限定的 uid 和 gid，前提是本机的 `/etc/passwd` 中存在这个 uid 和 gid
- subtree_check：如果共享 `/urs/bin` 之类的子目录时，强制 nfs 检查父目录的权限（默认）
- no_subtree_check：和上面对应，不检查父目录权限

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
