---
title: "滚动条美化"
date: 2021-05-31T16:12:35+08:00
draft: false
author : "Northes"
description: "美化默认滚动条的样式"
tags: ["CSS","学习笔记"]
---



## 基础样式

```css
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar{
    width: 7px;
    height: 7px;
    background-color: #F5F5F5;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb{
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
    background-color: #c8c8c8;
  }
```



## 本博客样式

```css
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar{
    width: 7px;
    height: 7px;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
    border-radius: 10px;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb{
    border-radius: 10px;
    background-color: #ced4da;
}
```

