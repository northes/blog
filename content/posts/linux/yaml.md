---
title: "Yaml 实用技巧"
date: 2022-06-30T15:11:48+08:00
draft: false
author : "Northes"
description: "Yaml 实用技巧备忘"
tags: ["Yaml"]
---

## 多行字符串配置方法
在写 K8s 的 ConfigMap 或 写 CI 配置文件的时候很有用
### 配置与显示都换行
#### 使用 `\n`
```yaml
string: "foo \n\
         bar "
```

#### 使用 `|` `|+` `|-`
```yaml
string1: |
  foo
  bar
```
- | ：文中自动换行，并且文末新增一空行
- |+ ：文中自动换行，并且文末新增两空行
- |- ：文中自动换行，并且文末不新增行

### 配置换行，显示一行
#### 直接写
```yaml
string: "Hey
        Man"   
```

#### 使用 `>` `>+` `>-`
```yaml
string:
  Hey
  Man
```
- \> ：文中不自动换行，文末新增一空行
- \>+ ：文中不自动换行，文末新增两空行
- \>- ：文中不自动换行，文末不新增空行
