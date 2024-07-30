---
layout: '@/layouts/Post.astro'
title: Tauri 构建时静态资源下载失败的解决方法
abstract: Tauri 构建时需要从 Github 上下载一些静态资源，这一步往往会报错，本文提供手动下载的解决办法。
author:
  name: Gu-Miao
  link: https://github.com/Gu-Miao
image: /images/tauri-build-assets/banner.webp
createdAt: '2024-07-30 09:33'
updatedAt: '2024-07-30 09:33'
category: Rust
tags:
  - Rust
  - Tauri
---

Tauri 构建时需要 WixTools，那一步下载尽管挂了梯子页非常容易失败，不过好在控制台提供了 WixTools 的下载地址。

![构建时控制台打印](/images/tauri-build-assets/1.webp)

我们手动下载这个压缩包，将它解压到 `C:\User\你的用户名\AppData\Local\tauri\WixTools` 中即可。
