---
title: "Dockerfile 最佳实践"
date: 2022-02-16T13:56:00+08:00
draft: false
author : "Northes"
description: "使用过程中踩过的坑 总结的实践经历"
tags: ["学习笔记","Docker"]
---



1. 建议所有的 Dockerfile 指令大写，这样做可以很好地跟在镜像内执行的指令区分开来。
2. 在选择基础镜像时，尽量选择官方的镜像，并在满足要求的情况下，尽量选择体积小的镜像。目前，Linux 镜像大小有以下关系：busybox < debian < centos < ubuntu 。最好确保同一个项目中使用一个统一的基础镜像。如无特殊要求，可以使用 debian:jessie 或者 alpine.
3. 在构建镜像时，删除不需要的文件，只安装需要的文件，保持镜像干净、轻量
4. 使用更少的层，把相关的内容放到一个层，并使用换行符进行分割。这样可以进一步减少镜像的体积，也方便查看镜像历史。
5. 不要在 Dockerfile 中修改文件的权限。因为如果修改文件的权限，Docker 在构建时会重新复制一份，这会导致镜像体积越来越大。
6. 给镜像打上标签，标签可以帮助你理解镜像的功能，例如：`docker build -t="nginx:3.0-onbuild"`
7. FROM 指令应该包含 tag，例如使用：`FROM debian:jessie` 而不是 `FROM debian`。
8. 充分利用缓存。Docker 构建引擎会顺序执行 Dockerfile 中的指令，而且一旦缓存失效，后续指令将不能使用缓存。为了有效地利用缓存，需要尽量将所有的 Dcokerfile 文件中相同的部分都放在前面，而将不同的部分放在后面
9. 优先使用 `COPY` 而非 `ADD` 指令，和 ADD 相比， COPY 功能简单，而且也够用。ADD 可变的行为会导致该指令的行为不清晰，不利于后期维护和理解
10. 推荐将 CMD 和 ENTRYPOINT 指令结合使用，使用 execl 格式的 ENTRYPOINT 指令设置固定的默认命令和参数，然后使用 CMD 指令设置可变的参数。
11. 尽量使用 Dockerfile 共享镜像。通过共享 Dockerfile，可以使开发者明确知道 Docker 镜像的构建过程，而且可以将 Dockerfile 文件加入版本控制，追踪起来。
12. 使用 .dockerignore 忽略构建镜像时非必需的文件。忽略无用的文件，可以提高构建速度。
13. 使用多阶构建。多阶构建可以大幅减小最终镜像的体积。例如，COPY 指令中可能包含一些安装包，安装完成之后这些内容就废弃掉。