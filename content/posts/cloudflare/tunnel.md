---
title: "Cloudflare Tunnel 使用笔记"
date: 2023-03-08T02:14:14Z
draft: false
author : "Northes"
description: "简单介绍如何使用Cloudflare Tunnel进行内网穿透，并使用自定义域名"
tags: ["学习笔记"]
---

## 安装

```shell
curl -L 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64' -o /usr/bin/cloudflared chmod +x /usr/bin/cloudflared
```

## 登录

```shell
cloudflared tunnel login
```

输入命令后，终端会给出一个登录地址，复制到浏览器打开，授权需要使用的网站

授权完成后，本地客户端会自动生成证书，生成失败重新执行上述步骤即可

## 创建隧道

```shell
cloudflared tunnel create <隧道名字> 
# 比如 
cloudflared tunnel create webserver-1
```

> 一般建议一台服务器建立一条隧道

创建成功后，会输出隧道UUID，记录备用

## 创建域名指向

```shell
cloudflared tunnel route dns <隧道名字> <域名> 
# 比如一级域名（和Web界面不一样，不需要输入@） 
cloudflared tunnel route dns webserver-1 abc.com 
# 又比如二级域名 
cloudflared tunnel route dns webserver-1 www.abc.com
```

此时，Cloudflare 会自动添加一条 CNAME 记录到对应的域名

对于多个其他域名，需要登录控制台，手动添加

```
<隧道UUID>.cfargotunnel.com
```

## 配置文件

**文档**
[Ingress rules · Cloudflare Zero Trust docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/local/local-management/ingress/)

`~/.cloudflared/config.yml`

```yaml
tunnel: 997809ba-c344-43fb-a349-3d4fd90f6afc
credentials-file: /root/.cloudflared/997809ba-c344-43fb-a349-3d4fd90f6afc.json

ingress:
  # Rules map traffic from a hostname to a local service:
- hostname: example.com
  service: https://localhost:8000
  # Rules can match the request's path to a regular expression:
- hostname: static.example.com
  path: \.(jpg|png|css|js)$
  service: https://localhost:8001
  # Rules can match the request's hostname to a wildcard character:
- hostname: '*.example.com'
  service: https://localhost:8002
  # Example of a request mapping to the Hello World test server:
- hostname: test.apihut.net
  service: hello_world
  # An example of a catch-all rule:
- service: https://localhost:8003
- service: http_status:404
```

## 验证配置文件

```shell
cloudflared tunnel ingress validate
# 测试是否命中
cloudflared tunnel ingress rule https://<域名1.com>
```

## 测试运行

```shell
cloudflared --loglevel debug --transport-loglevel warn --config ~/.cloudflared/config.yml tunnel run <隧道UUID>
```

我们登陆Cloudflare Zero Trust的[Web控制台](https://one.dash.cloudflare.com/)，左边选择Access-Tunnels，可以看到隧道已经跑起来了，状态是Active。

## 创建系统服务

```shell
cloudflared service install 
systemctl start cloudflared 
systemctl status cloudflared
```

## 总结

如果有多台服务器，那么可以在不同的服务器安装多个Cloudflared，配置多个Tunnel。

## 参考

- [使用Cloudflare Tunnel实现内网穿透，把服务器架在家里](https://bra.live/setup-home-server-with-cloudflare-tunnel/)
