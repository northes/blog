---
title: "Git 常用命令"
date: 2021-08-23T20:15:24+08:00
draft: false
author : "Northes"
description: "Git常用命令"
tags: ["学习笔记","Git"]
---
## 初始化
```shell
git init
```

## 提交
```shell
git commit
```


## 暂存
```shell
git add
```


## 远程
```shell
# 克隆
git cone

# 拉取
git pull

# 推送
git push
```



## 分支
```shell
# 查看所有分支
git branch  

# 新建分支
git branch <分支名>

# 切换到对应的分支  
git checkout <分支名>  

# 新建分支并切换到新分支上
git checkout -b <分支名> 
```



## 合并
```shell
# 将分支名合并到当前所在的分支
git merge <分支名> 

# 将当前分支的内容合并到分支名
git rebase <分支名>  
```




## 查看HEAD指向
```shell
cat .git/HEAD

# 将HEAD指向到指定记录(移动到指定哈希值的提交记录上)
git checkout <提交记录哈希值>  
```



### 相对引用
```shell
# 将HEAD指向他的父节点
git checkout <分支名\哈希值>^ 

# 将HEAD向上移动<数字>次
# (~后跟的数字可选，不跟数字等同^
git checkout <分支名\哈希值>~<数字>
```

### 强制切换
```shell
# 将分支强制切换到对应的记录
git branch -f <分支名> <哈希值>\<~数字>\<^> 
```


## 撤销提交
```shell
## reset
# 将分支回退提交记录，本地就像从未提交过一样(仅本地，不适用远程)
git reset HEAD^ 

## revert
# 上一个提交记录复制，并创建一个提交记录，内容与上一个相同。此时可以推送至远程与他人共享撤销
git revert HEAD 
```




## 提交记录
```shell
git log
```



## 在线模拟练习
https://learngitbranching.js.org/?locale=zh_CN
