---
title: "Hugo 学习笔记"
date: 2021-05-28T00:11:38+08:00
draft: false
author: "ethan"
description: "Hugo 的常用配置，命令等。以及部署过程中踩过的坑"
tags: ["Hugo","学习笔记"]
---

## 下载&安装

https://github.com/gohugoio/hugo

进入 releases 下载对应平台二进制文件

> 如果需要支持 scss 文件，需下载  extended 版本

添加二进制文件路径到 `PATH` 以全局使用



## 配置文件

### TOML 格式

```toml
baseURL = "https://ethan.io/"
languageCode = "zh-cn"
title = "ethan"
theme = "hugo-tania"

[params]
titleEmoji = "😃"

[menu]
header = [
    { name = "Articles", url = "/articles/", weight = 1 },
    { name = "About", url = "/about/", weight = 2 },
]


[markup.highlight]
noClasses = false
lineNos = true
```

### YAML 格式

如不习惯`TOML`格式，可改为`YAML`

```yaml
# 基础地址
baseurl: "https://example.com" 
# 语言代码
languageCode: "en-us"
# 标题
title: "Hugo Tania"
# 主题名称
theme: "hugo-tania"
# 首页展示的条数
paginate: 6


params:
  titleEmoji: '😃'
  socialOptions:
    github: https://github.com/WingLim
    email: email@example.com

# 菜单
menu:
  header:
    - name: Articles # 名称
      url: "/articles/" # 相对URL
      weight: 1 # 权重，升序
    - name: "About"
      weight: 2
      url: "/about"
    - name: "Rss"
      url: "/index.xml"
      weight: 3

markup:
  highlight:
    noClasses: false
    lineNos: true
  goldmark:
    renderer:
      unsafe: true #渲染原始html
```



## 文章前置信息
### 模板

一般为`\archetypes`目录下的`default.md`文件

```markdown
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
author : "ethan"
---
```

通过命令新建文件时会包含于文件内

```shell
$ hugo new /posts/kubectl.md
```

### 可选参数

```yaml
---
# 文章标题
title: "title"
# 副标题
subtitle: "subtitle"
# 文章创建时间
date: 2021-05-28T12:09:13+08:00
# 是否为草稿状态，为草稿状态时不加 -D 运行参数文章不可见
draft: true
# 作者
author: "ethan"
# 简介
description: "这是一篇文章"
# 上次修改时间
lastmod: 2021-05-29T12:09:13+08:00
# 发布日期，在日期之前不会显示
publishDate: 2021-05-29T12:09:13+08:00
# 过期日期，在日期之后不再显示
expiryDate: 2021-05-29T12:09:13+08:00
---
```



## 命令

创建网站
```shell
$ hugo new site SiteName
```

创建文章
```shell
$ hugo new posts/my-first-post.md
```


构建网站

```shell
$ hugo

-D 包含标记为 draft （草稿）的内容
-F 包含发布日期为未来的内容
```



运行开发服务器

```shell
$ hugo server

-p 指定端口
... 继承hugo的父命令
```

查看版本
```shell
$ hugo version
```




## 部署

目前仅尝试过部署到 `Vercel` 平台，部署时遇到的坑有

```
Error: Error building site: failed to render pages: render of "page" failed: "/vercel/path0/themes/hugo-tania/layouts/_default/single.html:14:38": execute of template failed: template: _default/single.html:14:38: executing "main" at <.GetTerms>: can't evaluate field GetTerms in type *hugolib.pageState
```

这是 `Vercel` 上版本不匹配造成的，可通过在项目根目录下新建 `vercel.json` 文件指定 Hugo 版本解决

```json
{
  "build": {
    "env": {
      "HUGO_VERSION": "0.83.1"
    }
  }
}
```

查看本机版本

```shell
$ hugo version
hugo v0.83.1-5AFE0A57 windows/amd64 BuildDate=2021-05-02T14:38:05Z VendorInfo=gohugoio
```
