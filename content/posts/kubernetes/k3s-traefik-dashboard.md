---
title: "K3S 开启 Traefik Dashboard"
date: 2022-02-24T15:12:37+08:00
draft: false
author : "Northes"
description: "开启k3s自带的Ingress控制器的面板"
tags: ["学习笔记","k3s"]
---

Traefik 自带 web-ui 控制面板，但是 k3s 默认并没有开启。下面我们将手动开启它

1. 修改 ConfigMap

`traefik`

```yaml
# 在配置文件最后加入
[api]
  entryPoint = "traefik"
  dashboard = true
  debug = false
```

2. 修改 Service

`traefik`

```yaml
# 在 ports 下加入
    - name: dashboard
      protocol: TCP
      port: 8080
      targetPort: 8080
      nodePort: 30010
```

3. 删除 Pod，等控制器重建

4. 访问 node-ip:8080 ，完成！