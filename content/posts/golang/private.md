---
title: "Go 配置私有化仓库"
date: 2022-11-11T17:24:09+08:00
draft: false
author : "Northes"
description: "配置基于 GitLab 搭建的私有 module 仓库"
tags: ["学习笔记","Golang"]
---

## 初始化脚本
```shell
#!/bin/bash -xv
# -xv shell脚本调试之用 这个参数也可以去掉

go env -w GOPROXY='https://goproxy.io,direct' #加快 go mod 下载速度
echo '输入你私有仓库的host name eg: git.mojotv.corp.net >'

read GOPRIVATE

go env -w GOPRIVATE=$GOPRIVATE

echo '输入你的私有仓库的UserName用户名 >'

read GIT_USER
echo "访问你 https://$GOPRIVATE/profile/personal_access_tokens 创建个人访问令牌,填写gitlab-access-token >"
read GIT_TOKEN
echo '开始配置git config --global 使用access-token 验证私有仓库身份认证'
git config --global url."https://tanjieqiang:-sU3odYxjoDRZyo-Jxdg@gitlab.shouyouqianxian.com".insteadOf "https://gitlab.shouyouqianxian.com"
echo '现在你可以使用 go mod download (go run main.go) 继续开发你的项目吧'
```

## 配置流程(Gitlab)
### 配置Go
```shell
go env -w GOPRIVATE="gitlab.example.com"
go env -w GONOPROXY="gitlab.example.com"
go env -w GONOSUMDB="gitlab.example.com"
```
### 配置SSH
1. 将本地的 `~/.ssh/id_rsa.pub` 内容添加到 `GitLab` 的 `SSH Keys` 中
2. 如果本地的 ssh 密钥有密码，需要将密码取消
```shell
ssh-keygen -p
```

3. 测试能否与 GitLab 进行SSH通信
```shell
$ ssh -T git@git.example.com
```

### 配置Access Token
生成 access token

添加全局配置
```shell
git config --global url."https://${user}:${personal_access_token}@gitlab.example.com".insteadOf "https://gitlab.example.com"
git config --global url."git@gitlab.example.com".insteadOf "https://gitlab.example.com"
```

或者直接添加

`~/.gitconfig`
```yaml
[url "https://${user}:${personal_access_token}@gitlab.example.com"]
	insteadOf = https://gitlab.example.com
[url "ssh://git@gitlab.example.com"]
	insteadOf = gitlab.example.com
```

### 再次拉取
重新进入项目目录
```shell
go mod download
```