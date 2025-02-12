---
title: "uni-app 上手遇到的坑，我都踩了"
date: 2025-02-10T11:42:19+08:00
draft: true
author: "northes"
description: "本文记录了在 uni-app 开发中遇到的问题，以及解决方案"
tags: ["uni-app", "前端"]
---

## 脱离 HbuilderX 开发

用惯了顺手的开发工具，突然要脱离到 HbuilderX 开发，真的是一种煎熬。好在，官方提供了 cli 创建项目的方式，让我们可以在 VsCode、WebStorm 等 IDE 中开发。

**vue3+vite+ts**

```bash
npx degit dcloudio/uni-preset-vue#vite-ts my-vue3-project
```

**vue3+vite**

```bash
npx degit dcloudio/uni-preset-vue#vite my-vue3-project
```
## 更新 uni-app 版本

```bash
npx @dcloudio/uvm@latest
```

> [官网:更新 uni-app 到最新版本](https://zh.uniapp.dcloud.io/quickstart-cli.html#cliversion)

## Uni-app 类型提示

> 使用 vscode 开发有太多的教程了，这里分享一下使用 Webstorm 开发 uni-app 的配置。

1. uni 提示

![](../assets/uni-prompt.png)

设置 - 语言与框架 - JavaScript - Libraries - Download - uni-app


## 微信小程序类型提示


[GitHub - wechat-miniprogram/minigame-api-typings: Type definitions for APIs of Wechat Mini Game in TypeScript](https://github.com/wechat-miniprogram/minigame-api-typings)

```bash
npm install minigame-api-typings
```

安装后手动导入：

```js
import 'minigame-api-typings';
```

或者在 ts 配置中指定：

在 `tsconfig.json` 中指定 `types: ["minigame-api-typings"]`

或者通过 三斜杠指令 引用：

```js
/// <reference path="node_modules/minigame-api-typings/index.d.ts" />
```

引入后直接使用

```js
 let fileInfo: WechatMiniprogram.ChooseFile = null;

 wx.chooseMessageFile({})
```

## 获取用户信息


2021 年 4 月 28 后

`wx.getUserInfo` 或 `<button open-type="getUserInfo"/>` 将不再弹出弹窗，直接返回默认信息

公告：[微信开放社区](https://developers.weixin.qq.com/community/develop/doc/000cacfa20ce88df04cb468bc52801)

![](../assets/wx-miniprogram-get-user-info-0.png)

建议使用 `wx.getUserProfile(Object object)` 接口

[开放接口 / 用户信息 / wx.getUserProfile](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserProfile.html)

---

2022年11月8日24时 后

`wx.getUserProfile` 接口将被收回

公告：[微信开放社区](https://developers.weixin.qq.com/community/develop/doc/00022c683e8a80b29bed2142b56c01)

---

建议实践

文档：[开放能力 / 用户信息 / 获取头像昵称](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/userProfile.html)

![](../assets/wx-miniprogram-get-user-info-1.png)
