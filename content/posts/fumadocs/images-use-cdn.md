---
title: "Fumadocs 中使用 CDN 加载静态资源，兼容本地显示"
date: 2026-02-06T15:57:59+08:00
draft: false
author : "northes"
description: "使用 fumadocs.dev 时支持本地 Markdown 编辑器显示和构建后使用 CDN"
tags: ["学习笔记","Fumadocs","React"]
---

## 从相对目录中加载图片

默认图片必须放在 `public` 目录下，并在 `mdx` 中使用绝对目录访问，这对于 Markdown 编辑器来说十分不友好



举个例子，目录如下

```bash
├── content
│   └── docs
│       ├── index.assets
│       │   └── image-20260206.png
│       ├── index.mdx
│       └── test.mdx
```

```md
![image-20260206](./index.assets/image-20260206.png)
```

此时，Markdown 编辑器可以正常展示图片，但是 fumadocs 就没办法正常加载图片了，如果将图片放在 `public` 目录下，并修改 `index.mdx` 的引入图片为：

```md
![image-20260206](/image-20260206.png)
```

这个时候 fumadocs 可以正常加载图片，Markdown 编辑器又加载不出图片了



那么，有没有两全其美的方法呢？有的兄弟有的



我们可以使用官方提供的 MDX Plugin：Remark Image，以支持从非 public 目录下访问图片

`source.config.ts`

```ts
export default defineConfig({
  mdxOptions: {
    remarkImageOptions: {
      useImport: true, // 允许从非 public 的目录下读取图片
    },
  },
});
```

修改后，我们就可以使用相对路径，从类似 `content/docs/index.assets` 的目录下加载图片了，并且 fumadocs 也能正常渲染





## 根据环境替换图片路径



这里可以使用官方提供的图片缩放组件 `ImageZoom`，以优化体验

在传入 `src` 前，我们可以进行处理，根据环境判断是否使用 CDN 地址，并且为了避免硬编码地址，我们可以使用环境变量配置 CDN 地址



> 这里使用的是 WAKU 框架，公共变量需要以 WAKU_PUBLIC 开头，根据实际使用的框架自行修改变量名



`[...slugs].tsx`

```tsx
<MDX
          components={{
            ...defaultMdxComponents,
            img: (props) => {
              let newSrc = props.src;
              if (import.meta.env.PROD) {
                newSrc =
                  import.meta.env.WAKU_PUBLIC_ASSETS_HOST +
                  props.src +
                  '?fmt=webp';
              }
              return <ImageZoom src={newSrc} />;
            },
          }}
        />
```



## 构建时将图片放到指定目录方便上传



经过上面的配置，我们已经可以实现本地开发时从本地加载图片，构建后从 CDN 加载图片，但是由于我们的图片并不是全部放在 `public` 目录下，上传到对象存储中总归不太方便（可以写个 postbuild 脚本来自动化上传），这里提供一个解决方案



修改 `vite` 的配置，将图片放置到指定目录

`waku.config.ts`

```ts
export default defineConfig({
  vite: {
    // we do this to avoid Vite from bundling React contexts and cause duplicated contexts conflicts.
    optimizeDeps: {
      exclude: ['fumadocs-ui', 'fumadocs-core', '@fumadocs/ui'],
    },

    plugins: [tailwindcss(), mdx(MdxConfig), tsconfigPaths()],

    build: {
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (/\.(png|jpe?g|gif|svg|webp)$/.test(assetInfo.name || '')) {
              return 'upload/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
    },
  } satisfies UserConfig as Config['vite'],
});
```

这样，`build` 后的图片就会被放置到 `upload` 目录下，我们只需要将该目录下的图片都上传到对象存储桶中就完美搞定了



> 如果 vite 中配置的目录是 `upload/xxx` ，那么在对象存储桶中也需要上传到一模一样的目录下



> 部署的时候由于用不到 `upload/xxx` 目录下的文件了，可以写个脚本来自动化删除，❗上传后再删除❗ 

## 验证

可以 `build` 后查看代码或运行后通过浏览器的 Devtool - Network 验证图片是否从 CDN 中加载
