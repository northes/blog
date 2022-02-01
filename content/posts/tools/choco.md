---
title: "Windows 包管理工具 Chocolatey"
date: 2022-02-01T21:43:59+08:00
draft: false
author : "Northes"
description: "类似于Node.js的npm。可以对Windows上的包进行管理"
tags: ["学习笔记","Windows"]
---

## 简介
- https://chocolatey.org/

`Chocolatey` 是一款专为 **Windows** 系统开发的、基于 NuGet 的包管理器工具，类似于
- Node.js 的 *npm*
- MacOS 的 *brew*
- Ubuntu 的 *apt-get*
  
简称为 `choco`

`Chocolatey` 的设计目标是成为一个去中心化的框架，便于开发者按需快速安装应用程序和工具

## 安装
1. 使用管理员身份运行 powershell
2. 运行以下命令
```shell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

## 使用
```shell
# 搜索
choco search <name>
# 列出包
choco list
choco list -lo
# 安装
choco install <name>
# 固定包版本，防止包被升级
choco pin <name>
# 包升级
choco upgrade <name>
# 卸载包 
choco uninstall <name>
```

## 例子
```shell
choco install make # 安装make工具
choco install ruby # 安装ruby
```