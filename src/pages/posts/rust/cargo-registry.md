---
layout: '@/layouts/Post.astro'
title: 如何设置 cargo 镜像源
abstract: cargo 从 crates.io 上下载第三方包，但是国内下载速度很慢，本篇来看看在 Windows 下如何配置 cargo 镜像源。
author:
  name: Gu-Miao
  link: https://github.com/Gu-Miao
image: /images/cargo-registry.webp
createdAt: '2022-10-10 14:30'
updatedAt: '2022-10-10 14:30'
category: Rust
tags:
  - Rust
  - Cargo
---

首先找到你的 `Home Dir` 资源管理器中为 `C:\User\你的用户名`，或者打开命令行，输入 `cd ~` 也能切换到该目录。

然后创建 `.cargo/config` 文件，这个就是 cargo 本地的全局配置。然后将下面代码粘贴进去：

```toml
replace-with = 'tuna'

[source.tuna]
registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"
```

这段配置的意思是将镜像源替换为清华大学的，这样一来下载速度就变得飞快。

> 需要注意 cargo 在下载时会检查 git 的全局代理，如果 git 配置了代理但没链接就会报错。

有时执行 `cargo build` 会提示：

```
Block waiting for file lock on package cache
```

这时可以找到 cargo 的安装目录，找到 `cargo.exe`，同名目录下会有一个 `.package-cache` 文件，将其删除即可。
