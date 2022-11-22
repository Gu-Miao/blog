---
layout: '@/layouts/Post.astro'
title: Ant Design 5 发布会中有趣的东西
abstract: Ant Design 5 正式发布，本篇主要列出发布会上个人觉得比较有趣的东西。
author:
  name: Gu-Miao
  link: https://github.com/Gu-Miao
image: /images/antd5-briefing.webp
createdAt: '2022-11-21 17:56'
updatedAt: '2022-11-22 10:55'
category: React
tags:
  - React
  - Ant Design
  - 设计
---

## Ant Design 5 一些主要特性和改动

1. `Less` -> `CSS in JS`
2. 没有了 `Less`，就不再需要 `babel-plugin-import` 这个插件了，本身就有良好的 `ESM` 与 `tree shaking` 支持
3. 样式调整，主题色，圆角，亮暗主题算法，去线等
4. 组件变更，移除了一些组件，还有新组件 `<Tour>` 和 `<FloatButton>`
5. API 名称更名，比如 `visible` 改为 `open`
6. 放弃 IE，兼容所有现代浏览器
7. `moment` -> `day.js`
8. 文档使用 `dumi@2`
9. 更换测试库 `@enzyme` -> `@testing-lib/react`

## 录播

- [Ant Design 5.0 缘起 - 它山](https://www.bilibili.com/video/BV1R84y1k7vQ)

  - 开场，简介，设计系统

- [Ant Design MetaGuide 设计系统元规范 - 梓义](https://www.bilibili.com/video/BV1pY411o7X2)

  - 如何设计组件系统，确定组件功能与边界？物视角与行为视角
  - 10:32 如何评估组件质量

- [Ant Design 5.0，更美、更灵活 - 着希/松仙/海纳](https://www.bilibili.com/video/BV1hM411C7rR)

  - 新组件
  - 6:01 快乐工作主题，带有一些很有趣的交互动效
  - 8:16 样式调整
  - 21:14 ProComponents 包含大量预设的复杂组件集，更面向业务
  - 26:14 ProLayout, ProLayout Studio, ProTable Studio

- [Ant Design 5.0 设计工程化 - 闻冰](https://www.bilibili.com/video/BV1bR4y1f7AA)

  - 主题编辑器，Design Token，色板梯度，亮暗主题色彩表现（主要面向设计师）

- [Ant Design 5.0 技术演进之旅 - 豆酱](https://www.bilibili.com/video/BV1g841177o6)

  - Ant Design 的历史，5.0 版本技术调整

- [Ant Design 5.0 动态主题方案 - 闲夕](https://www.bilibili.com/video/BV1RP4y197wN)

  - 动态主题，`Less` 与 `CSS in JS`，主题算法，局部主题，Design Token

- [和开源社区一起走过的七年 - 偏右](https://www.bilibili.com/video/BV1b841177p4)

  - 一些总结，感想之类的
