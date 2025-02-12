---
title: "uni-app 中使用微信小程序原生组件（TDesign）"
date: 2025-02-10T12:26:55+08:00
draft: true
author : "northes"
description: "在 uni-app 中使用 TDesign 的微信小程序原生组件库"
tags: ["uni-app","t-design","TDesign", "前端"]
---

## 初始化

使用 vue3 + vite 版初始化项目

```bash
npx degit dcloudio/uni-preset-vue#vite my-vue3-project
```

> 不支持直接使用 vue 版本的组件库，因为 vue 版的用到了 isVNode，小程序不支持相关实现，可以使用小程序版的，使用小程序版的可以编译到 微信小程序、QQ 小程序、APP、H5 端

安装

```bash
npm i tdesign-miniprogram -S --production
```

在 `src` 下新建 `wxcomponents` 文件夹

复制 `node_modules/tdesign-miniprogram/miniprogram_dist` 到  `src/wxcomponents` 下，可以改名为 `tdesign`

在 `src/pages.json` 中全局使用组件

```json
{
	"globalStyle": {
		"usingComponents": {
			"t-button": "wxcomponents/tdesign/button/button"
		}
	}
}
```

在页面中直接使用

```vue
<t-button size="large" theme="danger">填充按钮new</t-button>
```

> 如遇编译到小程序后，小程序编译错误，执行 `yarn` 重新安装依赖，再次运行 `yarn dev:mp-weixin` 即可

编辑器没有提示，可以安装 `vue` 版本的，用于提示，注意：不实际使用 `vue` 版本的组件库

```bash
npm i tdesign-mobile-vue
```

注意事项

![](assets/Pasted%20image%2020250117172912.png)

## 按钮事件

![](assets/Pasted%20image%2020250120152411.png)

注意使用 `tap` 作为按钮点击事件传参，不是 `click`


## Input 数据绑定

不能使用 `v-model`，需要使用 `:value="xxxxx"` 来绑定，使用 `@change="onXxxxChange"` 来修改

```js
const onXxxxChange = (e) => {
  xxx.value = e.detail.value
}
```

## 深色模式

在 `App.vue` 文件中的 `style` 中，引入

```css
@import 'wxcomponents/tdesign/common/style/theme/_index.wxss';
```

同时，修改 `manifest.json` 以支持深色模式

```json
{
// ..
/* 小程序特有相关 */
    "mp-weixin": {
        "darkmode": true
    }
// ...
}
```
