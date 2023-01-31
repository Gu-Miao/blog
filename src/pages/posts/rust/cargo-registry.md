---
layout: '@/layouts/Post.astro'
title: 如何设置 cargo 镜像源
abstract: cargo 从 crates.io 上下载第三方包，但是国内下载速度很慢，本篇来看看在 Windows 下如何配置 cargo 镜像源。
author:
  name: Gu-Miao
  link: https://github.com/Gu-Miao
image: /images/cargo-registry.webp
createdAt: '2022-10-10 14:30'
updatedAt: '2023-01-31 14:39'
category: Rust
tags:
  - Rust
  - Cargo
---

首先需要找到 `CARGO_HOME` 环境变量，比如我的是 `D:\Rust\.cargo`，那么进入这个目录。

如果你的 Rust 装到了 C 盘，那么它也可能是 `C:\User\你的用户名\.cargo`，打开命令行，输入 `cd ~\.cargo` 就能切换到该目录。

然后创建 `config` 文件，这个就是 cargo 本地的全局配置。然后将下面代码粘贴进去：

```toml
[source.crates-io]
replace-with = 'tuna'

[source.tuna]
registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"
```

这段配置的意思是将镜像源替换为清华大学的，这样一来下载速度就变得飞快。当然也可用其他的源，比如中科大的：

```toml
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = "https://mirrors.ustc.edu.cn/crates.io-index"
```

还有很多其他的源，具体用哪个可以自行斟酌。

如果设置成功了，当你更新 crates 索引时，cargo 会打印出你当前用的镜像源名称。以上面清华大学的镜像源配置举例，命令行应该打印出：

```
Updating `tuna` index
```

- 特别需要注意 cargo 在下载时会检查 git 的全局代理，如果 git 配置了代理但没启用代理的话就会报错。

  `.gitconfig` 中的代理配置可以具体指向某个站点，可以这样修改以防止冲突：

  ```
  # 仅对 Github 生效
  [http "https://github.com"]
    proxy = http://127.0.0.1:19180
  ```

- 有时执行 `cargo build` 会提示：

  ```
  Block waiting for file lock on package cache
  ```

  进入 `CARGO_HOME` 目录，找到 `.package-cache` 文件，将其删除即可。
