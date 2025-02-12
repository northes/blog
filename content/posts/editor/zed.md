---
title: "Zed 折腾指北"
date: 2025-02-12T10:56:13+08:00
draft: false
author: "northes"
description: "快速上手高性能编辑器 Zed 的配置与使用指南"
tags: ["编辑器", "Zed"]
---

![](../assets/zed.png)

Zed 号称是一个专为人类与 AI 高性能合作而开发的编辑器。

- 基于 Rust，高效利用 CPU 内核与 GPU
- 支持多语言的 LSP，与 Github Copilot 集成（很好的自动完成，使我原地旋转）
- 集成 LLMs，开发中随时进行对话
- Vim 友好，原生支持，相比需要安装插件支持更丝滑
- 开源，支持拓展系统，支持远程开发(beta)

## 快捷键

本人习惯使用 JetBrains 的快捷键

一些常用快捷键（小部分跟 JetBrains 不一样）


- `Shift Shift`: 打开命令面板

- `Command + Shift + F`: 搜索全局文件
- `Command + Option + L`: 格式化文件

- `Command + 7`: 大纲筛选

- `Command + J`: 打开底部面板（一般是终端）
- `Command + L`: 跳转到指定行
- `Command + P`: 按路径搜索文件
- `Command + R`: 打开对话助手面板（LLMs）
- `Command + W`: 关闭当前 Tab 页

- `Options + Enter`: 打开代码功能（如填充 Go 结构体）


### 存在问题

1. 无法使用鼠标中键跳转到实现、引用

   - 使用 `Logi Option+` 绑定快捷键后，会影响使用中间关闭 Tab 页，故放弃

2. 鼠标侧键的前进后退按键不生效，解决办法：

   - JetBrains 方案中返回上一个编辑点、前进到下一个编辑点的快捷键为 `Command ⌘ + Option ⌥ + 左方向键/右方向键`

   - 使用 `Logi Option+` 针对 Zed 设置快捷键，将侧键绑定为相应的快捷键


## 安装 cli

安装 cli 到 PATH，以实现可以使用命令行打开目录、文件的操作

**安装**

打开 命令面板，搜索 `cli: install`

**使用**

```bash
# 打开当前目录
zed .
# 打开指定文件
zed main.go
```

## Git

目前 Zed 没有独立的 Git 窗口，仍需要使用命令行进行管理，官方宣称正在推进中

> More advanced Git features—like staging and committing changes or viewing history within Zed—will be coming in the future.
>
> \- [https://zed.dev/docs/git](https://zed.dev/docs/git)

**一个替代方案**

在配置文件中新增

```json
{
  "terminal": {
    "env": {
      "EDITOR": "zed --wait"
    }
  }
}
```

如此一来，使用命令行进行 commit 的时候，会自动打开 Zed 进行编辑，并且可使用 GitHub Copilot 进行辅助填写。再配合以插件 `git-firefly`
以支持 git commit message 高亮，体验会更好。

## 美化

- 2025.2.05 的更新中，支持了图标主题
  - 相关博客 [Add some color to your life, with icon themes](https://zed.dev/blog/icon-themes)
  - 实际体验后，推荐 `Material Icon Theme`
- 支持比较多的主题，可以通过插件市场安装
  - 实际体验后，推荐 `One Dark - Darkened`
- 支持自定义字体，对于用惯了 JetBrains 家工具的我来做，`JetBrains Mono` 字体是真的看着很舒服
  - 需要单独下载并配置 [JetBrains Mono. A typeface for developers​\_](https://www.jetbrains.com/lp/mono/)

## 配置

在 命令面板 搜索 `setting` 即可打开进入配置文件

- 文档：[configuring-zed](https://zed.dev/docs/configuring-zed)

**配置文件参考**

```json
// Zed settings
//
// For information on how to configure Zed, see the Zed
// documentation: https://zed.dev/docs/configuring-zed
//
// To see all of Zed's default settings without changing your
// custom settings, run `zed: open default settings` from the
// command palette (cmd-shift-p / ctrl-shift-p)
{
  "icon_theme": "Material Icon Theme", // 图标主题
  "file_types": {
    // 文件类型指定
    "JSONC": ["json"]
  },

  // 代码补全
  "show_completions_on_input": true, // 输入时显示补全
  "show_inline_completions": true, // 内联补全
  "features": {
    "inline_completion_provider": "copilot" // 使用 Github Copilot
  },

  // 聊天助手
  "assistant": {
    "enabled": true,
    "button": true,
    "dock": "right",
    "default_model": {
      "provider": "copilot_chat",
      "model": "gpt-4o"
    },
    "version": "2"
  },

  "auto_update": true, // 自动更新
  // 界面字体
  "ui_font_size": 16,
  // 编辑器字体
  "buffer_font_family": "JetBrains Mono", // 编辑器字体，推荐 JetBrains Mono，需要手动安装 https://www.jetbrains.com/lp/mono/
  "buffer_font_size": 18,
  "buffer_font_features": {
    "calt": false // 禁用连体 如 != 不会变成 =/= 等
  },
  // 主题
  "theme": {
    "mode": "system", // system, light, dark
    "light": "One Light",
    "dark": "One Dark - Darkened"
  },
  "vim_mode": false, // 是否启用vim模式
  "base_keymap": "JetBrains", // 键盘映射
  "auto_install_extensions": {
    "fleet-themes": true,
    "material-icon-theme": true,
    "one-dark-darkened": true
  },
  "autosave": "on_focus_change", // 自动保存
  "restore_on_startup": "last_session",
  "tabs": {
    "file_icons": true,
    "git_status": true,
    "show_diagnostics": "errors"
  },
  "git": {
    "git_gutter": "tracked_files", // 文件左边显示 git gutter，修改黄色，新增绿色，删除红色等
    "inline_blame": {
      // 在聚焦行显示 git blame
      "enabled": false, // 是否显示
      "delay_ms": 2000, // 延迟显示
      "show_commit_summary": true // 显示摘要
    }
  },
  "preview_tabs": {
    "enabled": true, // 文件预览，双击正式打开
    "enable_preview_from_file_finder": true, // 代码查找器中打开
    "enable_preview_from_code_navigation": true // 代码导航时打开
  },
  "telemetry": {
    // 遥测
    "diagnostics": false, // 诊断
    "metrics": false // 指标
  },
  "terminal": {
    "env": {
      // 设置终端的环境变量
      "key": "value",
      "EDITOR": "zed --wait"
    },
    "shell": "system" // 使用系统默认的shell，通常是 /etc/passwd 文件
  },
  "project_panel": {
    "dock": "left", // 文件目录位置
    "git_status": true, // git 状态
    "indent_size": 23, // 缩进尺寸，像素为单位
    "indent_guides": {
      // 缩进线
      "show": "always"
    },
    "scrollbar": {
      "show": "auto" // 滚动条，
    }
  },
  "outline_panel": {
    // 大纲面板
    "button": true // 是否显示按钮
  },
  "collaboration_panel": {
    // 协作面板
    "button": false
  },
  "git_panel": {
    "button": true,
    "dock": "left"
  },
  "unnecessary_code_fade": 0.7, // 淡化未使用的代码
  "current_line_highlight": "all", // 当前行高亮
  "lsp_highlight_debounce": 75 // LSP 提示防抖延迟，ms
}
```

## 缺憾

> 截至 2025.02.12

1. 处理一些轻量化的任务还是很舒服的，可以作为 vscode 的一个替代。
2. 尽管支持 LSP 语言服务器和 Github Copilot, 但是大型项目的自动提示和补全还是仅仅展示提示，而没有频率、相关性推荐等优化，体验上还是有一定的差距。
2. 插件生态还不是很成熟，原生体验没有很好，相比 vscode 来说，缺少很多能拓展使用体验的插件，比如`Markdown-all-in-one`。

## 一个开发场景

需要在文件末尾新增一行代码，并提交到 Git 仓库。

**前提**

- 处于 vim 模式下
- 已配置使用 Zed 编辑 commit 信息
- 已配置 GitHub Copilot

**步骤**

1. `GG` 定位到文件末尾，`o` 新增一行
2. `Command + J` 打开终端，`git add .` 添加，`git commit` 打开 Zed 编辑提交信息
3. 编辑完后 `Shift + :` 并输入 `wq` 保存退出
4. `Command + J` 回到终端，`git push` 提交

> 以上全程只需要键盘操作，不需要鼠标，且每一个输入场景（代码、commit信息）都能配合 Github Copilot 进行代码补全

## 最后

Zed 是一个很有潜力的编辑器，很轻，驾驶感受很好，原生支持经过打磨的 vim 模式，更新速度也很快。本人正在逐步提高 Zed 的使用频率，更深入体验，并随时更新本文 😇

## 参考

- 官网：https://zed.dev/
