---
title: "GMP 模型"
date: 2022-01-30T21:19:46+08:00
draft: true
author : "Northes"
description: "Go 中的GMP模型"
tags: ["学习笔记","Golang"]
---

GM

有一个全局锁，频繁的锁竞争，会有一定的影响

GMP

有一个全局的Global Queue
每个M对应有一个本地的Local Queue，由本地的Local Queue去全局Global Queue中获取G。
当本地的P满了的时候，会将多余的G去put到Global Queue中，当G为空的时候，会尝试去Global Queue去getG，如果
Global Queue也为空，就会去其他的p中偷G。

每个P有自己的本地队列，减少了锁竞争

当G阻塞的时候，会触发schedule，把G转移给其他的M去执行

提高了资源利用率



1. `go func(){}` 创建一个新的 `goroutine`
2. G保存在P的本地队列`local queue`，如果本地队列满了，则会put到全局队列`global queue`
3. G在M上运行，每个M绑定一个P。如果P的本地队列没有G,M会从其他P的本地队列或者全局队列中窃取G
4. 当M阻塞时，会将M从P解除。把G运行在其他空闲的M或者创建新的M。
5. 当M恢复时，会尝试获得一个空闲的P。如果没有P空闲，M会休眠，G会放到全局队列。
