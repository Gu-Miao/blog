---
layout: '@/layouts/Post.astro'
title: type-challenges【二】普通
description: type-challenges 项目目意在于让你更好的了解 TS 的类型系统，编写你自己的类型工具，或者只是单纯的享受挑战的乐趣！它可以帮助我们更好地编写类型代码，提升自己的能力。今天，我们就继续来看看它的普通难度。
image: /images/type-changes.webp
createdAt: '2022-07-21'
updatedAt: '2022-07-21'
category: typescript
tags:
  - typescript
  - type-challenges
  - 转载
---

# type-challenges【二】普通

[type-challenges](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md)意在于让你更好的了解 TS 的类型系统，编写你自己的类型工具，或者只是单纯的享受挑战的乐趣！它可以帮助我们更好地编写类型代码，提升自己的能力。今天，我们就继续来看看它的普通难度。

## 获取函数返回类型

不使用 `ReturnType` 实现 TypeScript 的 `ReturnType<T>` 泛型。

例如：

```ts
const fn = (v: boolean) => {
  if (v) return 1
  else return 2
}

type a = MyReturnType<typeof fn> // 应推导出 "1 | 2"
```

<p><a href="https://tsch.js.org/2/play/zh-CN" target="_blank"><img width="100" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/></a></p>

<details>
<summary>展开查看答案</summary>

```ts
type MyReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any
```

</details>

## 实现 Omit

不使用 `Omit` 实现 TypeScript 的 `Omit<T, K>` 泛型。

`Omit` 会创建一个省略 `K` 中字段的 `T` 对象。

例如：

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
  completed: false,
}
```

<p><a href="https://tsch.js.org/3/play/zh-CN" target="_blank"><img width="100" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/></a></p>

<details>
<summary>展开查看答案</summary>

```ts
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

</details>

## Readonly 2

实现一个通用 `MyReadonly2<T, K>` ，它带有两种类型的参数 `T` 和 `K`。

`K` 指定应设置为 Readonly 的 `T` 的属性集。如果未提供 `K` ，则应使所有属性都变为只读，就像普通的 `Readonly<T>` 一样。

例如

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

const todo: MyReadonly2<Todo, 'title' | 'description'> = {
  title: 'Hey',
  description: 'foobar',
  completed: false,
}

todo.title = 'Hello' // Error: cannot reassign a readonly property
todo.description = 'barFoo' // Error: cannot reassign a readonly property
todo.completed = true // OK
```

<p><a href="https://tsch.js.org/8/play/zh-CN" target="_blank"><img width="100" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/></a></p>

<details>
<summary>展开查看答案</summary>

```ts
type MyReadonly2<T, K extends keyof T = keyof T> = {
  readonly [P in K]: T[P]
} & {
  [R in Exclude<keyof T, K>]: T[R]
}
```

</details>

## 深度 Readonly

实现一个通用的 `DeepReadonly<T>` ，它将对象的每个参数及其子对象递归地设为只读。

您可以假设在此挑战中我们仅处理对象。数组，函数，类等都无需考虑。但是，您仍然可以通过覆盖尽可能多的不同案例来挑战自己。

例如

```ts
type X = {
  x: {
    a: 1
    b: 'hi'
  }
  y: 'hey'
}

type Expected = {
  readonly x: {
    readonly a: 1
    readonly b: 'hi'
  }
  readonly y: 'hey'
}

type Todo = DeepReadonly<X> // should be same as `Expected`
```

<p><a href="https://tsch.js.org/9/play/zh-CN" target="_blank"><img width="100" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/></a></p>

<details>
<summary>展开查看答案</summary>

```ts
type DeepReadonly<T> = {
  readonly [key in keyof T]: keyof T[key] extends never ? T[key] : DeepReadonly<T[key]>
}
```

</details>

## 元组转合集

实现泛型 `TupleToUnion<T>`，它返回元组所有值的合集。

例如

```ts
type Arr = ['1', '2', '3']

type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'
```

<p><a href="https://tsch.js.org/10/play/zh-CN" target="_blank"><img width="100" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/></a></p>

<details>
<summary>展开查看答案</summary>

```ts
type TupleToUnion<T extends any[]> = T[number]
```

</details>

## 可串联构造器

在 JavaScript 中我们经常会使用可串联（Chainable/Pipeline）的函数构造一个对象，但在 TypeScript 中，你能合理的给它赋上类型吗？

在这个挑战中，你可以使用任意你喜欢的方式实现这个类型 - Interface, Type 或 Class 都行。你需要提供两个函数 `option(key, value)` 和 `get()`。在 `option` 中你需要使用提供的 key 和 value 扩展当前的对象类型，通过 `get` 获取最终结果。

例如

```ts
declare const config: Chainable

const result = config
  .option('foo', 123)
  .option('name', 'type-challenges')
  .option('bar', { value: 'Hello World' })
  .get()

// 期望 result 的类型是：
interface Result {
  foo: number
  name: string
  bar: {
    value: string
  }
}
```

你只需要在类型层面实现这个功能 - 不需要实现任何 TS/JS 的实际逻辑。

你可以假设 `key` 只接受字符串而 `value` 接受任何类型，你只需要暴露它传递的类型而不需要进行任何处理。同样的 `key` 只会被使用一次。

<p><a href="https://tsch.js.org/12/play/zh-CN" target="_blank"><img width="100" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/></a></p>

<details>
<summary>展开查看答案</summary>

```ts
type Chainable<T = {}> = {
  option<K extends string, V>(
    key: K extends keyof T ? (V extends T[K] ? never : K) : K,
    value: V,
  ): Chainable<Omit<T, K> & { [k in K]: V }>
  get(): T
}
```

</details>

## 最后一个元素

实现一个通用`Last<T>`，它接受一个数组`T`并返回其最后一个元素的类型。

例如

```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type tail1 = Last<arr1> // expected to be 'c'
type tail2 = Last<arr2> // expected to be 1
```

<p><a href="https://tsch.js.org/15/play/zh-CN" target="_blank"><img width="100" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/></a></p>

<details>
<summary>展开查看答案</summary>

```ts
type Last<T extends any[]> = T extends [...any, infer L] ? L : never
```

</details>

## 出堆

实现一个通用 `Pop<T>`，它接受一个数组 `T` 并返回一个没有最后一个元素的数组。

例如

```ts
type arr1 = ['a', 'b', 'c', 'd']
type arr2 = [3, 2, 1]

type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
type re2 = Pop<arr2> // expected to be [3, 2]
```

> **额外**：同样，您也可以实现 `Shift`，`Push` 和 `Unshift` 吗？

<p><a href="https://tsch.js.org/16/play/zh-CN" target="_blank"><img width="100" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/></a></p>

<details>
<summary>展开查看答案</summary>

```ts
type Pop<T extends any[]> = T extends [...infer Rest, infer L] ? Rest : []
```

</details>

## Promise.all

编写一个函数 `PromiseAll`，它接受 `PromiseLike` 对象数组，返回值应为 `Promise<T>`，其中 `T` 是解析的结果数组。

```ts
const promise1 = Promise.resolve(3)
const promise2 = 42
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, 'foo')
})

// expected to be `Promise<[number, 42, string]>`
const p = Promise.all([promise1, promise2, promise3] as const)
```

<p><a href="https://tsch.js.org/20/play/zh-CN" target="_blank"><img width="100" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/></a></p>

<details>
<summary>展开查看答案</summary>

```ts
declare function PromiseAll<T extends any[]>(
  values: readonly [...T],
): Promise<{
  [K in keyof T]: T[K] extends Promise<infer R> ? R : T[K]
}>
```

</details>

##

<p><a href="https://tsch.js.org//play/zh-CN" target="_blank"><img width="100" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/></a></p>

<details>
<summary>展开查看答案</summary>

```ts

```

</details>
