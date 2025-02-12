---
title: "在 uni-app 中使用 unocss"
date: 2025-02-10T12:16:11+08:00
draft: false
author: "northes"
description: "在 uni-app 中使用 unocss 与使用 unocss 支持的图标"
tags: ["uni-app", "前端"]
---

> v0.59 后版本只提供 ESM 支持了，参考 [Pure ESM package · GitHub](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)

## 第三方库

[GitHub - uni-helper/unocss-preset-uni: 专为 uni-app 打造的 UnoCSS 预设](https://github.com/uni-helper/unocss-preset-uni)

> 相关：[GitHub - unocss-applet/unocss-applet: Using UnoCSS in applet(UniApp / Taro) to be compatible with unsupported syntax. 在小程序中使用UnoCSS，兼容不支持的语法。](https://github.com/unocss-applet/unocss-applet)

```bash
yarn add unocss -D
yarn add @unocss/preset-legacy-compat -D
yarn  add @uni-helper/unocss-preset-uni -D
yarn add unocss unocss-applet -D
```

`uno.config.ts`

```ts
import { defineConfig } from "unocss";
import { presetUni } from "@uni-helper/unocss-preset-uni";

export default defineConfig({
  presets: [presetUni()],
});
```

`vite.config.ts`

```ts
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
// https://vitejs.dev/config/
export default async () => {
  const UnoCSS = (await import("unocss/vite")).default;

  return defineConfig({
    plugins: [uni(), UnoCSS()],
  });
};
```

`main.ts`

```ts
import "uno.css";
```

2025.01.22 可用版本

```json
{
  "@uni-helper/unocss-preset-uni": "^0.2.11",
  "@unocss/preset-legacy-compat": "^65.4.3",
  "unocss": "^65.4.3",
  "nocss-applet": "^0.9.0"
}
```

## 使用

使用 css 变量

```html
<text class="text-[var(--td-brand-color)]"> Text </text>
```

使用 attr

```html
<view w="250px" m="t-5 auto">
  <text>{{ title }}</text>
</view>
```

使用 tailwind css

```html
<view class="flex justify-between"> </view>
```

## 使用图标

```bash
yarn add -D @unocss/preset-icons
yarn add -D @iconify-json/[the-collection-you-want]
```

其中 `[the-collection-you-want]` 替换成想要安装的图标库名，图标库可在这里找到

![](assets/Pasted%20image%2020250122160905.png)

- [Icônes](https://icones.js.org/) 这个好用点
- [Iconify - home of open source icons](https://icon-sets.iconify.design/)

使用

```html
<view class="i-lucide-lab-candle-holder-lit text-[var(--td-brand-color)]" />
```

注意 class 需要拼接 `i-图标库名-图标名`
