---
title: "GitHub Action 入门"
date: 2022-01-09T23:18:05+08:00
draft: true
author : "Northes"
description: "简介简介"
tags: ["学习笔记","CI/CD"]
---

## GitHub Action

[GitHub Action](https://github.com/features/actions) 是 GitHub 推出的 CI/CD 服务

## CI/CD
参考文章 [什么是CI/CD](/posts/micro-service/ci-cd)

## Workflow 配置文件

GitHub Actions 的配置文件称为 `workflow` 文件，统一放在项目的 `.github/workflows` 目录下

GitHub 只要发现目录下存在 `.yml` 文件，就会自动运行该文件

>`.yml` 文件没有命名及数量限制

workflow 的配置字段非常多，详细可看[官方文档](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions)

## 示例
### 常用字段解析
`.github/workflows/test.yml`
```yaml
name: Test # workflow 名
#on: [push,pull_request] # 在哪些动作下触发本workflow
on: # 也可以写成这样
  push: # 指定触发事件
    branches: # 分支
      - main
  pull_request: null # 指定所有的拉取请求都触发

jobs: # 主体字段，表示执行的一项或多项任务
  my_first_job: # job id
    name: My first job # 任务说明
    runs-on: ubuntu-latest # 指定运行所需要的虚拟机环境，必填字段
    env: # 当前job的环境变量
      MODE: dev
    steps: # 指定每个 job 的运行步骤，可以有一个或多个
      - name: print a greeting # 步骤名称
        env: # 当前步骤的环境变量
          NAME: northes
        run: | # 运行命令
          echo Hello $NAME
  my_second_job:
    name: My second job
    needs: [ my_first_job ] # 规定当前任务的依赖关系，即运行顺序。my_second_job 需要在 my_first_job 之后运行
    runs-on: ubuntu-latest
    steps:
      - name: print
        run: |
          echo This is second job
```
### Go项目构建与测试
`.github/workflows/go.yml`
```yaml
name: Go
on:
  - push

jobs:
  build:
    name: build & test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2 # 使用官方提供actions签出仓库

      - name: Set up Go
        uses: actions/setup-go@v2 # 使用官方的actions初始化go环境
        with:
          go-version: 1.16 # 指定go版本

      - name: Build
        run: go build -v ./... # -v 打印构建出来的文件名

      - name: Test
        #        run: go test -v ./...
        run: go test -v -race -covermode=atomic -coverprofile=coverage.out ./... # 生成覆盖率测试报告，用以上传codecov

      - name: Codecov
        uses: codecov/codecov-action@v2.1.0 # 上报测试覆盖率，需在 https://about.codecov.io/ 注册账号并在GitHub设置secrets
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

## 徽章
### CI徽章
![Go](https://github.com/northes/action-test/actions/workflows/go.yml/badge.svg?branch=dev)

- 用于展示CI状态。
- 可在 `GitHub Actions` 某一 `Workflows` 的右手边点 `Create status badge` 生成

### Codecov徽章
![codecov](https://codecov.io/gh/northes/action-test/branch/main/graph/badge.svg?token=TN33IN4UGZ)

- [https://codecov.io](https://codecov.io)
- 用于展示测试覆盖率 。可在 `Codecov` 的 `Settings` 下的 `Badge` 选项处生成 

### 自定义徽章
![](https://img.shields.io/badge/license-MIT-green)

- 自定义任意勋章，如开源协议(MIT)等
- [https://shields.io/](https://shields.io/)

##### 参考
- https://about.codecov.io/
- https://about.codecov.io/blog/getting-started-with-code-coverage-for-golang/
- https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html