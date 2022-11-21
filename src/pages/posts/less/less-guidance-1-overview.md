---
layout: '@/layouts/Post.astro'
title: Less 教程【一】概览
abstract: Less 是一个向后兼容的 CSS 语言扩展，也称为 CSS 预处理器。既然是 CSS 相关的东西，那么肯定要求有一定的 CSS 功底。本系列旨在引领深入地学习和探讨 Less 的功能与特性。本系列的章节结构与官方文档基本一致，也可以对照官方文档一起阅读。另外本系列使用的 Less 版本为最新的 4.1.2，且不会过多涉及 Less 本身的历史包袱。
author:
  name: Gu-Miao
  link: https://github.com/Gu-Miao
image: /images/less-gudiance-1-overview.webp
createdAt: '2022-07-15 09:00'
updatedAt: '2022-07-15 09:00'
category: Less
tags:
  - CSS
  - Less
serials: Less 教程
---

## 写在前面

Less 是一个向后兼容的 CSS 语言扩展，也称为 CSS 预处理器。既然是 CSS 相关的东西，那么肯定要求有一定的 CSS 功底。本系列旨在引领深入地学习和探讨 Less 的功能与特性。本系列的章节结构与官方文档基本一致，也可以对照官方文档一起阅读。另外本系列使用的 Less 版本为最新的 4.1.2，且不会过多涉及 Less 本身的历史包袱。

## 简单环境搭建

首先**确保你的电脑上安装了 Node.js**。

1. 创建一个工作目录

```bash
mkdir learn-less
npm init -y
```

2. 安装 less 编译器和 nodemon

```bash
npm i less nodemon -D
```

3. 在根目录下创建 index.less 测试文件

4. 修改 package.json 中的 npm script

```json
{
  "scripts": {
    "start": "nodemon --watch index.less --exec lessc index.less index.css"
  }
}
```

这个命令的意思是，监听 index.less 文件的变化，每当它的内容变化，就将其编译为 index.css。

运行 `npm start` 命令后，你就可以同时打开 index.less 和 index.css，修改 Less 文件的同时也能查看 CSS 输出的情况。

## 概览

### 变量

非常简单，直接看代码：

```less
// 声明变量
@width: 10px;
// 变量声明中可以使用其他变量
@height: @width + 10px;

#header {
  // 使用变量
  width: @width;
  height: @height;
}
```

CSS 输出：

```css
#header {
  width: 10px;
  height: 20px;
}
```

参考：

- [Less 官网·概览·变量](https://lesscss.org/#variables)

### 混合(Mixin)

混合是 Less 中一种方法，什么方法呢？将**一个规则集混入到另一个规则集中的方法**。

```less
// 定义一个类选择器(规则集)
.bordered {
  border: 1px solid red;
  border-radius: 6px;
  outline: none;
}

.link {
  color: blue;
  // 将 .bordered 规则集混入
  .bordered();
}
```

CSS 输出：

```css
.bordered {
  border: 1px solid red;
  border-radius: 6px;
  outline: none;
}

.link {
  color: blue;
  border: 1px solid red;
  border-radius: 6px;
  outline: none;
}
```

这种方式对提高代码的复用性有很大的帮助。但是，`.bordered` 也被包含在输出的 CSS 中，如果你想避免这样的情况，定义混合时，在后面加一个 `()`：

```less
// .bordered 不会被编译到 CSS 中
.bordered() {
  border: 1px solid red;
  border-radius: 6px;
  outline: none;
}
```

参考：

- [Less 官网·概览·混合](https://lesscss.org/#mixins)

### 嵌套

有时在 CSS 中为了避免样式冲突，我们会使用“再套一层”的方法：

```css
.container .header {
  /* ... */
}
.container .body {
  /* ... */
}
.container .footer {
  /* ... */
}
```

而 Less 提供了可嵌套的特性，因此我们可以这样写：

```less
.container {
  .header {
    // ...
  }
  .body {
    // ...
  }
  .footer {
    // ...
  }
}
```

这样不仅更加简便，而且还能清楚地展示元素之间的结构。

有些朋友可能会问，那伪类的样式要怎么写呢？其实很简单，我们举个例子：

```less
.container {
  // .container 元素的 before 伪元素
  &::before {
    // ...
  }
  // 鼠标滑过 .container 时的样式
  &:hover {
    // ...
  }
}
```

上面示例代码中的 `&` 称为**父级选择器**，它代表当前选择器的父级，也就是 `.container`，上面的示例转换成 CSS 后会输出为：

```css
.container::before {
  /* ... */
}
.container:hover {
  /* ... */
}
```

参考：

- [Less 官网·概览·嵌套](https://lesscss.org/#nesting)

### @规则(At-rules)嵌套与冒泡

@规则，比如常见的媒体查询 `@media`，判断 CSS 特性是否支持的 `@supports` 等在 Less 中都**可以像选择器一样进行嵌套**。我们先来看个例子：

```less
.component {
  width: 300px;
  @media (min-width: 768px) {
    width: 600px;
    @media (max-width: 1000px) {
      background: red;
    }
  }
  @media (min-width: 1280px) {
    width: 800px;
  }
}
```

CSS 输出：

```css
.component {
  width: 300px;
}
@media (min-width: 768px) {
  .component {
    width: 600px;
  }
}
@media (min-width: 768px) and (max-width: 1000px) {
  .component {
    background: red;
  }
}
@media (min-width: 1280px) {
  .component {
    width: 800px;
  }
}
```

可以看到在输出后的 CSS 中，**@规则至于外层**，即 `@mdia` 规则被置于 `.component` 的外层，**并且规则集内的所有元素相对位置保持不变**，这被称为**冒泡**。

参考：

- [CSS 机制@At-rule 详解](https://blog.csdn.net/a1056244734/article/details/114581201)
- [MDN 官网 @规则 ](https://developer.mozilla.org/zh-CN/docs/Web/CSS/At-rule)
- [Less 官网·概览·@规则嵌套与冒泡](https://lesscss.org/#nesting-nested-at-rules-and-bubbling)

### 运算

Less 中的加减乘除运算可以适用于任何数字、颜色或者变量。

Less 在做加减法或比较时会考虑单位，并且在运算前先进行换算，其结果会取用**最左侧明确声明的单位**：

```less
@conversion-1: 5cm + 10mm; // 最左侧明确声明的单位是 cm，因此将 10mm 转为 1cm，结果为 6cm
@conversion-2: 2 - 3cm - 5mm; // 最左侧明确声明的单位是 cm，因此 2 转为 2cm，5mm 转为 0.5mm，结果为 -1.5cm
```

但如果部分运算的单位转换无法进行，比如像素转为厘米，那么运算将会忽略单位：

```less
@incompatible-units: 2 + 5px - 3cm; // 像素无法转换为厘米，因此直接进行数值运算，再取用最左侧明确声明的单位 px，结果为 4px
```

长度\*长度的数学意义为一块区域，但 CSS 并不支持区域相关的特性，因此**乘除法不会进行单位转换**。因而，Less 会**直接进行数值运算，单位的取用规则与加减法一致**：

```less
@base: 2cm * 5px; // 2 * 5 = 10，最左侧明确声明的单位为 cm，结果为 10 cm
```

注意，从 4.0 版本开始，如果想进行除法运算，**必须将算式写在括号中**，否则 Less 将**不会编译这**部分：

```less
.component {
  padding: 10px / 2;
}
```

CSS 输出：

```css
.component {
  padding: 10px / 2; /* 没有被编译，原封不动保留了下来 */
}
```

正确写法为：

```less
.component {
  padding: (10px / 2); // 使用括号包裹除法算式
}
```

颜色运算：

```less
@color-1: (#222222 / 2); // #111111
@color-2: #121212 + #333; // #454545
```

不过颜色运算不常用，一般会用 Less 内置的处理颜色的函数。

参考：

- [Less 官网·概览·运算](https://lesscss.org/#operations)

### `calc()` 特例

为了与 CSS 兼容，`calc()` 函数不会去计算数学表达式，但会计算嵌套其中的变量：

```less
@var: 50vh * 2;
.component {
  width: calc(@var - (20px * 2)); // calc(100vh - (20px * 2))
}
```

参考：

- [Less 官网·概览·calc 特例](https://lesscss.org/#operations-calc-exception)

### 避免编译(Escaping)

如果有些东西不想让 Less 去编译，而是原封不动的保留下来。那么我们可以使用 `~'something'` 或 `~"something"` 语法来避免编译：

```less
@min768: ~'(min-width: 768px)';
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
```

CSS 输出：

```css
@media (min-width: 768px) {
  .element {
    font-size: 1.2rem;
  }
}
```

在 3.5 以上的版本中，你可以直接这样写：

```less
@min768: (min-width: 768px);
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
```

3.5+ 的版本，之前许多依赖避免编译的情况现在都不需要再使用它了。

参考：

- [Less 官网·概览·避免编译](https://lesscss.org/#escaping)

### 命名空间(Namespace)和访问器(Accessor)

有时，出于组织代码或者提供封装的目的，你可能会想对混合进行分组。使用命名空间和访问器可以很轻松的做到这一点：

```less
// 声明命名空间
#theme {
  .light {
    color: #333;
    background: #e2e2e2;
  }
  .dark {
    color: #fff;
    background: black;
  }
}
.component {
  #namespace1.dark(); // 使用访问器
}
```

CSS 输出：

```css
#theme .light {
  color: #333;
  background: #e2e2e2;
}
#theme .dark {
  color: #fff;
  background: black;
}
.component {
  color: #fff;
  background: black;
}
```

和混合一样，如果你不希望命名空间被编译到 CSS 中，你需要在后面加上一个 `()`：

```less
// 不会被编译到 CSS 中
#theme() {
  .light {
    color: #333;
    background: #e2e2e2;
  }
  .dark {
    color: #fff;
    background: black;
  }
}
```

> ❓ 思考：以上述代码为例，如果只想让 `.light` 部分被编译到 CSS 中，应该怎样做呢？

参考：

- [Less 官网·概览·命名空间和访问器](https://lesscss.org/#namespaces-and-accessors)

### 映射(Map)

你可以使用混合和命名空间的属性作为值映射：

```less
#colors() {
  primary: blue;
  secondary: green;
}

.button {
  color: #colors[primary];
  border: 1px solid #colors[secondary];
}
```

CSS 输出：

```css
.button {
  color: blue;
  border: 1px solid green;
}
```

参考：

- [Less 官网·概览·映射](https://lesscss.org/#maps)

### 作用域

less 的作用域和 CSS 的很相似，首先在当前作用域查找变量或混合，如果找不到，在从父级去继承：

```less
@var: red;

#page {
  @var: white;
  #header {
    color: @var; // white
  }
}
```

一些变成语言要求先声明变量再使用，而 Less 则不用这样，变量或混合的声明可以后置：

```less
@var: red;

#page {
  #header {
    color: @var; // 依然是 white
  }
  @var: white; // 变量声明后置
}
```

如果同一作用域下有相同的变量，那么以最后声明的变量为准：

```less
.component {
  @var: blue;
  .element {
    color: @var; // red
  }
  @var: red;
}
```

参考：

- [Less 官网·概览·作用域](https://lesscss.org/#scope)

### 注释

行内注释和块级注释在 Less 中都可以使用，唯一的区别就是行内注释不会被编译到 CSS 中：

```less
/* One heck of a block
 * style comment! */
.component {
  color: red; // Red fonts
}
```

CSS 输出：

```css
/* One heck of a block
 * style comment! */
.component {
  color: red;
}
```

参考：

- [Less 官网·概览·注释](https://lesscss.org/#comments)

### 导入

导入功能和 CSS 基本相同，区别在于引入 `.less` 文件是可以省略后缀，而引入 `.css` 文件时需要指明后缀：

```less
@import 'library'; // library.less
@import 'typo.css';
```

参考：

- [Less 官网·概览·导入](https://lesscss.org/#importing)
