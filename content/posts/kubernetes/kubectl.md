---
title: "Kubernetes - Kubectl备忘单"
date: 2021-12-18T14:46:34+08:00
draft: false
author : "Northes"
description: "K8s学习笔记"
tags: ["学习笔记","Kubernetes"]
---

## 自动补全
```shell
# 设置
echo "source <(kubectl completion bash)" >> ~/.bashrc
```
> 不会像 redis-cli 一样，需要敲tab键

## 应用
```shell
# 部署应用
kubectl apply -f xxx.yaml
# 查看 deployment
kubectl get deployment
# 查看pod(wide以纯文本格式输出，包含附加信息。也可使用json|yaml等其他格式)
kubectl get pod -o wide
# 查看pod详情
kubectl describe pod <pod-name>
# 获取所有匹配app:nginx的pod的信息（在命令行中，所有key-value格式的参数都是用=，而不是:）
# -l 筛选labels
kubectl get pods -l app=nginx
# 查看log
kubectl logs <pod-name>
# 进入pod容器终端(-c 指定容器名)
kubectl exec -it <pod-name> -- bash
kubectl exec -it <pod-name> -c <container-name> -- bash
# 伸缩拓展副本
kubectl scale deployment <name> --replicas=5
# 把集群内端口映射到节点(通过访问集群ip:8090即可访问到指定pod的8080端口)
kubectl port-forward <pod-name> 8090:8080
# 查看历史
kubectl rollout history deployment <name>
# 回滚到上个版本
kubectl rollout undo deployment <name>
# 回滚到指定版本
kubectl rollout undo deployment <name> --to-version=2
# 删除部署
kubectl delete deployment <name>
```
> 资源后加 
> 
> -o 指定输出格式，如 yaml | json | wide(带附加信息的默认格式) | name(仅输出名称)
> 
> -n 指定 namespace

### 更多命令
```shell
# 查看全部
kubectl get all
# 重新部署
kubectl rollout restart deployment <name>
# 通过命令修改镜像(--record 记录到操作历史中)
kubectl set image deployment <name> <container-name>=<image:tag> --record
# 暂停运行(暂停后，对deployment的修改不会立刻生效，恢复后才应用设置)
kubectl rollout pause deployment <name>
# 恢复
kubectl rollout resume deployment <name>
# 输出到文件
kubectl get deployment <name> -o yaml >> ./xxx.yaml
# 删除全部资源
kubectl delete all --all
# 更新指定内容
kubectl patch sts web -p '{"spec":{"replicas":3}}'
# 非级联删除(只会删除StatefulSet，保留Pod)，此时如果再删除某一Pod，则不会重新创建一个新的以维持数量
kubectl delete statefulset web --cascade=orphan
# 级联删除（会删除所有Pod，与索引相反顺序删除），不会删除Service
kubectl delete statefulset web
# 使用管道输入
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: $(echo -n "s33msi4" | base64 -w0)
  username: $(echo -n "jane" | base64 -w0)
EOF
# 将文件使用管道输入
cat xxx.json | kubectl apply -f -
```

## Secret
```shell
# 创建普通的secret
kubectl create secret generic <secret-name> --from-file=./username.txt
# 创建docker认证secret
kubectl create secret docker-registry --docker-server=xxx/name  --docker-username='123'  --docker-password='123'  --docker-email='123@xx.com'
# 创建tls类型的secret
kubectl create secret tls --cert='./xx.crt' --key='./xx.key'
# 查看
kubectl get secrets
```


## 其他
```shell
# 临时运行一个pod，并进入终端交互，退出会删除
kubectl run -i --tty --image busybox:1.28 test --restart=Never --rm
# busybox不提供curl，可以使用alpine，进入后通过apk安装
# apk --update add curl
kubectl run -i --tty --image alpine test --rm
```

## 资源缩写
也可通过以下命令查看
```shell
kubectl api-resources
```
| 全称         | 缩写   |
| ------------ | ------ |
| namespaces   | ns     |
| node         | no     |
| pod          | po     |

| 全称         | 缩写   |
| ------------ | ------ |
| deployment   | deploy |
| statefulset  | sts    |
| daemonset    | ds     |
| services     | svc    |
| configmap    | cm     |
| ingress      | ing    |
| endpoints    | ep     |
| storageclass | sc     |
| replicasets  | rs     |

> 其他未出现的如 jobs，secret 等没有缩写
