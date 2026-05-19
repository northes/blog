---
title: "Claude Code 代码检索选型思考"
date: 2026-05-19T14:50:39+08:00
draft: true
author: "northes"
description: "为什么 Claude Code 不使用 RAG 而是直接使用 grep"
tags: ["学习笔记", "Agent", "Claude Code"]
---

## 什么是代码检索

顾名思义，代码检索就是把想要找的代码找出来

现在的 LLM 这么强了，为什么不把整个代码库直接丢进 LLM 让他自己看：

1. LLM 的上下文有限
2. 过多的上下文会导致成本激增
3. 导致模型注意力分散
4. 需要预留上下文给系统提示、工具调用等

那这个找东西的场景不是天然就适合 RAG 的应用场景吗，我们具体问题具体分析

## RAG 的工作原理

具体的工作原理可以参考 [RAG 的工作原理](./RAG) 一文，这里不再赘述

简单来说就是，从原始的代码到可用的 RAG 系统，需要经过以下几步

1.  对代码进行分片 chunking，可以按函数、按行数等
2.  对分片后的代码片段进行 embedding 向量化
3.  建立索引 indexing
4.  召回指定的片段 retrieval

需要注意的是，召回的过程中更多的是依赖相似度计算，这在企业知识库、客服机器人等领域等领域非常好用，但在代码场景下，则会水土不服

## RAG 的水土不服

理想很丰满，现实很骨感，为什么 RAG 在代码场景下会水土不服，主要有以下几点

### 1. 代码切分的边界不好处理

与文章即使按段落切分，每一段之前也不影响阅读不同，代码有严格的格式限制和上下文关联

如果按函数切分，如果一个函数有几千行，那么召回的效果就会大打折扣

如果按行数切分，那么如果一个函数被拆分成了一个 chunk 是 `if` ，另一个 chunk 是 `else`，那么这两个 chunk 根本就不知道在说啥

更糟糕的的是，如果一个函数 A 调用了另一个函数 B，而在 B 中实现了某一部分核心功能，那么这个 A 根本不会被向量化后还能看出来包含了 B 的功能，如果调用链更深，这个成本更是成倍上涨

### 2. 向量无法精确匹配

向量召回的本质是找到“相似的”，而不是“准确的”，而代码场景要求的是准确性

如果用户提问的是“帮我找到 getUserById 调用的地方”，那么可能会召回一堆“getUserInfo”，“getUserByName”，“fetchUserInfo”，“queryUser”，只要是跟 user 相关的都被召回回来，而用户仅仅是想精确匹配到“getUserById”

### 3. 代码变化与索引

我们可以想象一下，在 RAG 的场景下，需要先针对代码库进行向量并建立索引后才能进行召回

而对代码库进行 chunking、embedding、indexing 都是需要花费时间和机器资源的

每次代码发生了变动，如果进行重建，则会需要重新完整跑一遍这个过程，特别是现在 vide coding 盛行，每天的代码变化轻轻松松破百

而不重建，代码信息落后，直接导致了 bug 的产生

另外，Claude Code 在打开一个新项目的时候，选择建立索引的话，要么在后台，用户提问的时候索引还没处理完，召回不到任何东西，要么在前台，直接卡住用户的流程使用，一根筋变成两头堵

## 返璞归真

那么，不用 RAG，如何进行代码检索呢？

Claude Code 给出的答案是，返璞归真，现用现找，直接摈弃掉 RAG，并通过提供三个工具来解决：

1.  Glob：按文件名进行查找，类似于 find
2.  Grep：按内容关键字进行查找，类似于 grep
3.  Read：按需读取文件内容，类似于 cat

本质上，还是把对工具的使用权交给模型来决定，这种土办法，真的能代替 RAG 吗？

### Grep：基于 ripgrep，但绝不是简单封转

我们可能会想，既然 Claude Code 支持直接调用 Bash 工具，为什么还需要多次一举给它提供包装好的工具呢？

#### 1. 权限统一管理

直接调用 Bash 的风险太高了，谁也说不准模型会不会脑子一抽跑一个 `rm`，虽然我们可以通过中断调用的方式向用户发起询问，但是作为一个高频的读操作来说，不对用户造成打扰才是最优解。把 grep 包装成一个工具，相当于在 Bash 之上上了一道保险

#### 2. 输出格式可控

直接跑 bash 的 grep，返回的即使一坨文本，还需要模型自己进行处理，浪费 Token 不说，还可能出现幻觉。而对 grep 进行封装后，可以结构化地输出“行号”、“上下文”、“文件组”，并且可以通过参数控制“只返回匹配的文件名”，“只返回匹配数量”，“返回匹配的文件和内容”等粒度。让模型按需选择，减少 Token 浪费

#### 3. 性能

 Grep 底层使用的是 ripgrep 而不是传统的 grep，支持多线程并行，自动尊重“.gitignore”(省去了搜索 node_modules 这类宇宙黑洞)，性能强。

 那么，Claude Code 是如何保证会调用 Grep 的呢？通过之前泄露出来的 Claude Code 的源码可以窥知，其中有一段这样的 Prompt

 ```bash
 A powerful search tool built on ripgrep
 
 - ALWAYS use Grep for search tasks. NEVER invoke `grep` or `rg` as a Bash 
   command. The Grep tool has been optimized for correct permissions and access.
 - Output modes: "content" shows matching lines, "files_with_matches" shows 
   only file paths (default), "count" shows match counts
 - Use Agent tool for open-ended searches requiring multiple rounds
 ```

 用“ALWAYS use ...”这种强硬的语气，通过 system prompt 强调模型走专用工具，而不是超 bash 的近路。

 另外，通过最后一行可以看到，“Use Agent tool for open-ended searches requiring multiple rounds”，指示模型，多轮搜索请使用 Agent 工具，这就涉及到另一个多 Agent 和上下文隔离的优势了，后面细讲

### Glob：按文件名查找，按修改时间排序

 Grep 是按内容查找，Glob 是按文件名查找

 举个例子：我想要查看某个目录下的 *.go 文件有哪些，那么用 Grep 显然不现实

Glob 还有几个设计上的小巧思：
1. 结果按修改时间倒序排序。很好理解，大部分最近修改过的文件都是跟当前任务最相关的
2. 结果有 100 文件的硬上限。超出会截断，避免上下文爆炸。如果模型还想查看更多，那么可以收紧 pattern 再搜一次

### Read：按需读取

找到文件后，怎么看？Read 就是干这个的

但他有个反直觉的点就是：默认只读 2000 行，超出会截断

如果想要读超过 2000 行的文件内容怎么办，别急，Read 工具支持传入 offset 和 limit，
