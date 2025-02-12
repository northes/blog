---
title: "在 uni-app 中使用 u-charts"
date: 2025-02-10T12:21:24+08:00
draft: false
author : "northes"
description: "在 uni-app 中使用 u-charts 绘制图表"
tags: ["uni-app", "前端"]
---

## 官网

- [uCharts官网 - 秋云uCharts跨平台图表库](https://www.ucharts.cn/v2/#/)
- 演示：[演示 - uCharts跨平台图表库](https://www.ucharts.cn/v2/#/demo/index)

 ## 安装

```bash
pnpm i @qiun/uni-ucharts
```

## 复制文件

1. 进入 `node_modules/@qiun/uni-ucharts`，复制 `components` 到 `src/components` 下
2. 复制 `components` 下的 `static` 到 `src/static` 下

## 使用

> 如果正确配置了使用 `components` 目录，不需要 `import` 直接使用即可

```vue
<route type="home" lang="json5">
{
  layout: "tabbar",
}
</route>

<template>
  <view>
    <nav-bar title="数据图表" />

    <view class="w-full h-1xl">
      <qiun-data-charts type="column" :chartData="chartData" />
    </view>

    <view class="w-full h-1xl">
      <qiun-data-charts type="area" :opts="opts" :chartData="chartData" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onReady } from "@dcloudio/uni-app";

const chartData = ref({});

const opts = ref({
  color: [
    "#1890FF",
    "#91CB74",
    "#FAC858",
    "#EE6666",
    "#73C0DE",
    "#3CA272",
    "#FC8452",
    "#9A60B4",
    "#ea7ccc",
  ],
  padding: [15, 10, 0, 15],
  enableScroll: false,
  legend: {},
  xAxis: {
    disableGrid: true,
  },
  yAxis: {
    gridType: "dash",
    dashLength: 2,
  },
  extra: {
    line: {
      type: "straight",
      width: 2,
      activeType: "hollow",
    },
  },
});

onReady(() => {
  getServerData();
});

const getServerData = () => {
  //模拟从服务器获取数据时的延时
  setTimeout(() => {
    let res = {
      categories: ["2016", "2017", "2018", "2019", "2020", "2021"],
      series: [
        {
          name: "目标值",
          data: [35, 36, 31, 33, 13, 34],
        },
        {
          name: "完成量",
          data: [18, 27, 21, 24, 6, 28],
        },
      ],
    };
    chartData.value = JSON.parse(JSON.stringify(res));
  }, 500);
};
</script>

<style lang="scss">
.charts-box {
  width: 100%;
  height: 1200rpx;
}
</style>
```
