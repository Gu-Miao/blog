---
layout: '@/layouts/Post.astro'
title: type-challenges 类型挑战系列【一】
abstract: type-challenges 意在于让你更好的了解 TS 的类型系统，编写你自己的类型工具，它可以帮助我们更好地编写类型代码，提升自己的能力，或者只是单纯的享受挑战的乐趣！
author:
  name: 光舞
  link: https://github.com/Gu-Miao
image: /images/type-challenges-1.webp
createdAt: '2022-07-20 09:00'
updatedAt: '2022-08-18 09:41'
category: typescript
tags:
  - TypeScript
  - type-challenges
serials: type-challenges 类型挑战系列
---

[type-challenges](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md) 意在于让你更好的了解 TS 的类型系统，编写你自己的类型工具，它可以帮助我们更好地编写类型代码，提升自己的能力，或者只是单纯的享受挑战的乐趣！

> 本篇内容全部为**简单**难度。

## 实现 Pick

实现 TS 内置的 `Pick<T, K>`，但不可以使用它。

**从类型 `T` 中选择出属性 `K`，构造成一个新的类型**。

例如：

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false,
}
```

[<img class="badge" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/>](https://tsch.js.org/4/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type MyPick<T, K extends keyof T> = {
  [key in K]: T[key]
}
```

这里用 [`Mapped Type`](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)，所有的键都来自 `K`，那么遍历 `K` 再给 `T[key]` 就行了。

</details>

## 实现 Readonly

不要使用内置的 `Readonly<T>`，自己实现一个。

该 `Readonly` 会接收一个 _泛型参数_，并返回一个完全一样的类型，只是所有属性都会被 `readonly` 所修饰。

也就是不可以再对该对象的属性赋值。

例如：

```ts
interface Todo {
  title: string
  description: string
}

const todo: MyReadonly<Todo> = {
  title: 'Hey',
  description: 'foobar',
}

todo.title = 'Hello' // Error: cannot reassign a readonly property
todo.description = 'barFoo' // Error: cannot reassign a readonly property
```

[<img class="badge" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/>](https://tsch.js.org/7/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type MyReadonly<T> = {
  readonly [key in keyof T]: T[key]
}
```

看过文档就会写，没什么可说的。

</details>

## 元组转换为对象

传入一个元组类型，将这个元组类型转换为对象类型，这个对象类型的键/值都是从元组中遍历出来。

例如：

```ts
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type result = TupleToObject<typeof tuple> // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
```

[<img class="badge" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/>](https://tsch.js.org/11/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type TupleToObject<T extends readonly any[]> = {
  [key in T[number]]: key
}
```

关于 `T[number]`，看一下这里：[Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)

</details>

## 第一个元素

实现一个通用的 `First<T>`，它接受一个数组 `T` 并返回它的第一个元素的类型。

例如：

```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3
```

[<img class="badge" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/>](https://tsch.js.org/14/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type First<T extends any[]> = T extends [infer F, ...infer Rest] ? F : never
```

考察 `infer` 的，看这里：[Inferring Within Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)

</details>

## 获取元组长度

创建一个通用的 `Length`，接受一个 `readonly` 的数组，返回这个数组的长度。

例如：

```ts
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla> // expected 4
type spaceXLength = Length<spaceX> // expected 5
```

[<img class="badge" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/>](https://tsch.js.org/18/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Length<T extends readonly any[]> = T['length']
```

在 TypeScript 中，数组类型的 `length` 属性会返回**具体的数字**作为类型而非 `number`。比如：

```ts
type TestLength = [1, 2, 3, 4, 5]['length'] // 5
```

</details>

## 实现 Exclude

实现内置的 `Exclude<T, U>` 类型，但不能直接使用它本身。

从联合类型 `T` 中排除 `U` 的类型成员，来构造一个新的类型。

例如：

```ts
type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
```

[<img class="badge" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/>](https://tsch.js.org/43/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type MyExclude<T, U> = T extends U ? never : T
```

来了来了：

- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

- [Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)

</details>

## Awaited

假如我们有一个 Promise 对象，这个 Promise 对象会返回一个类型。在 TS 中，我们用 `Promise<T>` 中的 `T` 来描述这个 Promise 返回的类型。请你实现一个类型，可以获取这个类型。

例如：`Promise<ExampleType>`，请你返回 ExampleType 类型。

```ts
type ExampleType = Promise<string>

type Result = MyAwaited<ExampleType> // string
```

[<img class="badge" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/>](https://tsch.js.org/189/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type MyAwaited<T> = T extends Promise<infer K> ? MyAwaited<K> : T
```

如果你认真弄懂了上面的题目，这个题并不难。首先判断 `T` 是否为 `Promise`，如果不是，直接返回即可；如果是，那么用 `infer` 拿到 `Promise` 中的类型再递归就行了。

</details>

## If

实现一个 `IF` 类型，它接收一个条件类型 `C` ，一个判断为真时的返回类型 `T` ，以及一个判断为假时的返回类型 `F`。 `C` 只能是 `true` 或者 `false`， `T` 和 `F` 可以是任意类型。

例如：

```ts
type A = If<true, 'a', 'b'> // expected to be 'a'
type B = If<false, 'a', 'b'> // expected to be 'b'
```

[<img class="badge" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/>](https://tsch.js.org/268/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type If<C extends boolean, T, F> = C extends true ? T : F
```

很简单的一题，没什么可说的。

</details>

## Concat

在类型系统里实现 JavaScript 内置的 `Array.concat` 方法，这个类型接受两个参数，返回的新数组类型应该按照输入参数从左到右的顺序合并为一个新的数组。

例如：

```ts
type Result = Concat<[1], [2]> // expected to be [1, 2]
```

[<img class="badge" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/>](https://tsch.js.org/533/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Concat<T extends any[], U extends any[]> = [...T, ...U]
```

类型系统中也可以用 `...` 运算符哦 🤣

</details>

## Includes

在类型系统里实现 JavaScript 的 `Array.includes` 方法，这个类型接受两个参数，返回的类型要么是 `true` 要么是 `false`。

例如：

```ts
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
```

[<img class="badge" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/>](https://tsch.js.org/898/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false

type Includes<T extends readonly any[], U> = T extends [infer F, ...infer Rest]
  ? Equal<F, U> extends true
    ? true
    : Includes<Rest, U>
  : false
```

这里的 `Equal` 类型我们直接用 `@type-challenges/utils` 提供的，这里不做展开。

重点是数组的遍历，首先判空，再用 `infer` 去拿第一个元素和剩余元素，再进行递归。这种方式后面会经常出现。

</details>

## Push

在类型系统里实现通用的 `Array.push` 。

例如：

```typescript
type Result = Push<[1, 2], '3'> // [1, 2, '3']
```

[<img class="badge" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/>](https://tsch.js.org/3057/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Push<T extends any[], U> = [...T, U]
```

灵活地运用 `...` 运算符。

</details>

## Unshift

实现类型版本的 `Array.unshift`。

例如：

```typescript
type Result = Unshift<[1, 2], 0> // [0, 1, 2,]
```

[<img class="badge" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/>](https://tsch.js.org/3060/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Unshift<T extends any[], U> = [U, ...T]
```

做了上面的题，这个也是小 case。

</details>

## Parameters

实现内置的 `Parameters<T>` 类型，而不是直接使用它，可参考[TypeScript 官方文档](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype)。

例如：

```ts
const foo = (arg1: string, arg2: number): void => {}

type FunctionParamsType = MyParameters<typeof foo> // [arg1: string, arg2: number]
```

[<img class="badge" src="https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white" alt="接受挑战"/>](https://tsch.js.org/3312/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any
  ? P
  : never
```

参数也可用 `...` 运算符，剩下就靠 `infer` 大法了。

</details>
