---
title: "开机自动挂载"
date: 2023-02-27T15:25:39+08:00
draft: false
author : "Northes"
description: "mount 命令在重启后会失效，想要开机自动挂载需要进行额外设置"
tags: ["学习笔记"]
---

由于直接使用 mount 命令在重启后会失效，因此需要将欲挂载的目录写入到记录文件中

## 写入

`/etc/fstab`

以 SMB 为例

```text
# <file system>          <dir>              <type> <options>                                                    <dump>  <pass>  
//SHARE_IP/share_folder  /mnt/share_folder  cifs   user=username,password=password,file_mode=0755,dir_mode=0755 0       0
```


## 测试验证

```bash
# 卸载已挂载的目录
umount /mnt/share_floder
# 使用/etc/fstab文件进行挂载
mount -a
```

查看挂载目录，成功后下次开机将会自动挂载好