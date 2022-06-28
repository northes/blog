---
title: "K3s 备忘录"
date: 2022-06-21T10:59:30+08:00
draft: false
author : "Northes"
description: "K3s搭建与配置备忘"
tags: ["K3s"]
---

## 单节点

参考：[https://docs.rancher.cn/docs/k3s/quick-start/_index](https://docs.rancher.cn/docs/k3s/quick-start/_index)

### 安装

```shell
curl -sfL https://get.k3s.io | sh -
# 国内
curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -
# 使用 Docker
curl -sfL https://get.k3s.io | sh -s - --docker
```

## 双节点

### 安装

#### 查看 Token

默认的 `K3S_TOKEN` 会生成在 Server 端

```shell
cat /var/lib/rancher/k3s/server/token
# K1070878408e06a827960208f84ed18b65fa10f27864e71a57d9e053c4caff8504b::server:
# df54383b5659b9280aa1e73e60ef78fc 为 K3S_TOKEN ，用于从节点加入时验证
```

#### 执行安装

```shell
curl -sfL https://get.k3s.io | K3S_URL=https://<服务端地址>:6443 K3S_TOKEN=<上文中查看的K3S_TOKEN> sh -
# 国内
curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | K3S_URL=https://<服务端地址>:6443 K3S_TOKEN=<上文中查看的K3S_TOKEN> sh -
# 使用 Docker
curl -sfL https://get.k3s.io | K3S_URL=https://<服务端地址>:6443 K3S_TOKEN=<上文中查看的K3S_TOKEN> sh -s - --docker
```

## 仪表盘

### 安装

#### 简洁版

直接去 `https://github.com/kubernetes/dashboard/releases` 找到最新的版本，执行 `Installation` 目录下的安装命令即可

#### K3s官方版

参考：[https://docs.rancher.cn/docs/k3s/installation/kube-dashboard/_index](https://docs.rancher.cn/docs/k3s/installation/kube-dashboard/_index)

### 授权

创建清单文件

`dashboard.admin-user.yml`

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
```

`dashboard.admin-user-role.yml`

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: admin-user
    namespace: kubernetes-dashboard
```

部署

```shell
kubectl apply -f dashboard.admin-user.yml -f dashboard.admin-user-role.yml
```

### 获取 Token

```shell
kubectl -n kubernetes-dashboard describe secret admin-user-token | grep '^token'
```

### 服务器本地访问

```shell
kubectl proxy
```

打开下面的网址访问仪表盘：

- [http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/](http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/)
- 使用上面获取到的 Token 访问

### 本地访问服务器仪表盘

参考本博客另一文《多集群管理》


## 重启

```shell
# Server || 单节点
sudo systemctl restart k3s
# Agent
sudo systemctl restart k3s-agent
```

## 开启 Secret 加密

参考：[https://docs.rancher.cn/docs/k3s/security/secrets_encryption/_index](https://docs.rancher.cn/docs/k3s/security/secrets_encryption/_index)

在 `/etc/rancher/k3s` 目录下新建 `config.yaml` 配置文件,K3s启动会自动加载

> 只需要在 Server 端配置即可

```yaml
secrets-encryption: true
```

开启后怎么配，参考官方文档即可

## 私有仓库配置

参考：[https://docs.rancher.cn/docs/k3s/installation/private-registry/_index](https://docs.rancher.cn/docs/k3s/installation/private-registry/_index)

如何搭建镜像代理？参考本博客另一文 [《Harbor 搭建镜像代理》](/posts/docker/harbor/mirror/)

## 主要目录

| 目录                            | 解释                                           |
|-------------------------------|----------------------------------------------|
| `/usr/local/bin`              | 二进制文件与uninstall、killall脚本                    |
| `/etc/rancher/k3s`            | kube配置文件，k3s配置文件，私有镜像仓库配置文件                  |
| `/var/lib/rancher/k3s/server` | token 等                                      |
| `/etc/rancher/node`           | agent 向 server 注册用的 password，后续的请求server都会验证 |
