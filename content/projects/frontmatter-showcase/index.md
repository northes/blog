---
title: "Frontmatter 示例"
description: "展示项目详情页支持的全部 frontmatter 字段，仅供本地预览。"
role: "独立开发者"
dateStart: "2024-03"
dateEnd: "2025-12"
lead: "这是一段导语，会以大号加粗样式显示在正文之前。"
highlights:
  - "Highlights 支持字符串列表，用于展示项目要点"
  - "列表项二：可写技术栈、职责或成果"
  - "列表项三：详情页可选，无则不渲染该区块"
links:
  - text: "项目主页"
    url: "https://example.com"
  - text: "GitHub"
    url: "https://github.com/northes"
show_in_home: true
home_index: 999
index: 999
image: https://i.imgant.com/v2/NlwAVQP.jpeg
draft: true
---

这是 Markdown 正文区（`.Content`），会按文章样式渲染。

## Frontmatter 字段说明


| 字段             | 必填  | 用途                                      |
| -------------- | --- | --------------------------------------- |
| `title`        | 是   | 项目名，用于卡片标题与详情页 H1                       |
| `description`  | 否   | 列表卡片摘要                                  |
| `role`         | 否   | 身份，显示在详情页元数据行                           |
| `dateStart`    | 否   | 开始时间，如 `2024` 或 `2024-03`               |
| `dateEnd`      | 否   | 结束时间，留空表示进行中（显示为 `开始 —`）                |
| `lead`         | 否   | 导语，详情页大号加粗段落                            |
| `highlights`   | 否   | 要点列表，详情页 Highlights 区块                  |
| `links`        | 否   | 外链列表，每项含 `text` 与 `url`                 |
| `show_in_home` | 否   | 是否展示在首页 Cooking 区块，`true` / `false`     |
| `home_index`   | 否   | 首页排序，数值越小越靠前                            |
| `index`        | 否   | 项目列表页排序，数值越小越靠前                         |
| `image`        | 否   | 封面图，用于卡片与详情页头图                          |
| `media`        | 否   | `image` 的别名，二选一                         |
| `video`        | 否   | 卡片视频，支持 URL 或 bundle 内文件                |
| `draft`        | 否   | `true` 时仅本地预览（`hugo server -D`），生产构建不发布 |


`draft: true` 时，生产环境不会生成该页面，也不会出现在项目列表与首页中。