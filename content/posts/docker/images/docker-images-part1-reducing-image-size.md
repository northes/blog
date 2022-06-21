---
title: "Docker镜像：减少镜像体积"
date: 2022-02-16T22:18:57+08:00
draft: true
author : "Northes"
description: "通过选择基础镜像、多阶构建的以减少镜像体积"
tags: ["翻译","Docker"]
---

*翻译整理自 [Docker Images : Part I - Reducing Image Size](https://www.ardanlabs.com/blog/2020/02/docker-images-part1-reducing-image-size.html)*

## 前言
在刚入门使用容器的时候，我们很可能会被我们所构建出来的镜像的体积所震惊。卧槽，这么大？！我整个应用也才几mb甚至几kb，本文将带大家

在第一部分，我们将介绍使用多阶构建的方式，以减少镜像体积。在业界，多阶构建是应用最广泛的减少镜像体积的方法，我们也应该从此入门。我们还会讨论静态链接要动态链接之间的区别，以及为什么需要关心他们。

在第二部分，我们将讨论几种流行的编程语言是如何减少镜像体积的。包括Go，Java，Node，Python，Ruby和Rust。我们还将为你介绍 Alpine 有哪些坑，以便更好地上手使用它。

在第三部分，我们将介绍一些适用于大多数语言的通用的模式。例如使用基础镜像、剥离二进制文件和减少静态文件的大小。我们将使用一些更高级的方法，例如 Bazel、Distroless、DockerSlim 或 UPX。这在某些情况下是有效的，但也有可能适得其反。

## 万恶之源

