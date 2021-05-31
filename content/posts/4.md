---
title: "滚动条的出现导致页面闪动"
date: 2021-05-31T15:51:56+08:00
draft: false
author : "Northes"
description: "滚动条出现、消失导致页面跳动的解决办法"
tags: ["CSS","学习笔记"]
---

在滚动条出现、消失之际页面会出现晃动，观感不佳



## 基础解决方案

添加以下

```css
.wrap-outer {
    margin-left: calc(100vw - 100%);
}
```

或则

```css
.wrap-outer {
    padding-left: calc(100vw - 100%);
}
```

#### 代码解释

1.  `.wrap-outer`  指的是居中定宽主体的父级，如果没有，创建一个（使用主体也是可以实现类似效果，不过本着宽度分离原则，不推荐）

2.  `calc` 是 CSS3 中的计算方法

3. 100vw 相对于浏览器的window.innerWidth，是浏览器的内部宽度，滚动条的宽度也计算在内，而100%则是可用宽度，是不含滚动条的宽度

4. 于是，cala(100vw-100%) 就是浏览器滚动条的宽度大小（如果没有滚动条则是0），左右都有一个滚动条宽度（或都是0）被占用，主体内容就可以永远居中浏览器。



## 终极解决方案

大型项目实践已经验证相当具有可行性，放置于全局 CSS 中

```css
html {
  overflow-y: scroll;
}

:root {
  overflow-y: auto;
  overflow-x: hidden;
}

:root body {
  position: absolute;
}

body {
  width: 100vw;
  overflow: hidden;
}
```



## 效果展示

本站已应用 [最终解决方案](#终极解决方案)

可通过快速切换本博客的 Projects 页面与 About 页面感受

