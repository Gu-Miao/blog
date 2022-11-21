---
layout: '@/layouts/Post.astro'
title: type-challenges 类型挑战系列【二】
abstract: type-challenges 意在于让你更好的了解 TS 的类型系统，编写你自己的类型工具，它可以帮助我们更好地编写类型代码，提升自己的能力，或者只是单纯的享受挑战的乐趣！
author:
  name: Gu-Miao
  link: https://github.com/Gu-Miao
image: /images/type-challenges-2/banner.webp
createdAt: '2022-07-21 09:00'
updatedAt: '2022-08-19 16:39'
category: TypeScript
tags:
  - TypeScript
  - type-challenges
serials: type-challenges 类型挑战系列
---

[type-challenges](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md) 意在于让你更好的了解 TS 的类型系统，编写你自己的类型工具，它可以帮助我们更好地编写类型代码，提升自己的能力，或者只是单纯的享受挑战的乐趣！

> 本篇内容全部为**中等**难度。

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

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/2/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type MyReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any
```

会用 `infer` 就能轻松搞定。

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

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/3/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

用 `Exclude` 确定要保留的键名集合，再用 `Pick` 就行了。

当然，如果你不想用这些之前写的类型，那也可以看看这个：[Key Remapping via `as`](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as)

然后这样写：

```ts
type MyOmit<T, K extends keyof T> = {
  [key in keyof T as key extends K ? never : key]: T[key]
}
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

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/8/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type MyReadonly2<T, K extends keyof T = keyof T> = {
  readonly [key in K]: T[key]
} & {
  [key in Exclude<keyof T, K>]: T[key]
}
```

这里用到了泛型参数默认值和[对象的交集](https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types)。

思路很简单，首先约束 `K` 的类型为 `keyof T`，再看题目中说 `K` 是可选参数，不提供 `K` 就将所有键都变为只读的，那么我们就把默认值设为 `keyof T`。接下来就是将 `T` 拆成需要加只读的和不需要加只读的两部分，然后再合并就行了。

有一点需要注意下，本题中的对象合并是对一个对象的两部分进行合并，也就是说两个对象没有相同的键名的情况。但如果用交集合并时，两个类型中有相同的键名，那么合并后该键名的类型会取它们两个的交集：

```ts
type Test1 = { name: string } & { name: number | string }
type Test1Name = Test1['name'] // string

type Test2 = { name: string } & { name: number }
type Test2Name = Test2['name'] // 没有交集，所以是 never
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

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/9/play/zh-CN)

<details>
<summary>展开查看答案</summary>

这道题的关键是如何判断是否是对象从而进行递归，这其实很简单：

```ts
type DeepReadonly<T> = T extends Object
  ? {
      readonly [key in keyof T]: DeepReadonly<T[key]>
    }
  : T
```

然而，这并不能通过测试用例，因为用例中要求我们对函数进行判断，所以我们需要改成这样：

```ts
type DeepReadonly<T> = T extends Function
  ? T
  : T extends Object
  ? {
      readonly [key in keyof T]: DeepReadonly<T[key]>
    }
  : T
```

这里我们可以再进行简化，因为 `mapped types` 会通过返回输入值来“跳过”基础类型。我们来看这个例子：

```ts
type TestMap<T> = { [key in keyof T]: T[key] }
type MappedString = TestMap<string> // 结果仍是 string
```

利用这个特性，我们最终的代码为：

```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Function ? T[K] : DeepReadonly<T[K]>
}
```

当然，你可能会在 Github 上找到像这样的答案：

```ts
type DeepReadonly<T> = {
  readonly [key in keyof T]: keyof T[key] extends never ? T[key] : DeepReadonly<T[key]>
}
```

但这并不能说是一个好的实现，建议看看这个 FAQ：[what is "extends never" used for?](https://stackoverflow.com/questions/68693054/what-is-extends-never-used-for)

</details>

## 元组转合集

实现泛型 `TupleToUnion<T>`，它返回元组所有值的合集。

例如

```ts
type Arr = ['1', '2', '3']

type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/10/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type TupleToUnion<T extends any[]> = T[number]
```

`T[number]` 用法，不必多说。

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

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/12/play/zh-CN)

<details>
<summary>展开查看答案</summary>

首先我们先添加一个参数 `T`，来确定当前这个对象的类型，默认类型为 `{}`。再给 `option()` 添加泛型参数，可以得到：

```ts
type Chainable<T = {}> = {
  option<K extends string | symbol, V>(
    key: K,
    value: V,
  ): Chainable<{
    [key in keyof T | K]: key extends K ? V : key extends keyof T ? T[key] : never
  }>
  get(): T
}
```

这里说下 `option()` 函数的返回类型就是把 `K` 字段加到 `T` 类型中，并且如果存在同名字段，就会用 `V` 类型替换之前的类型。到此，题目中要求的功能都已经实现了。

但是你会发现，用例中的 `// @ts-expect-error` 下面会有红色波浪线，它期望下一行会有错误。这其实是要求 **`option()` 函数不允许传入键名相同且键值类型也相同的参数**（不明说，放到这个小小的注释里让你慢慢体会，你品，你细品...）。所以，我们需要再限制一下 `option()` 的参数：

```ts
type Chainable<T = {}> = {
  option<K extends string | symbol, V>(
    key: K extends keyof T ? (V extends T[K] ? never : K) : K,
    value: V,
  ): Chainable<{
    [key in keyof T | K]: key extends K ? V : key extends keyof T ? T[key] : never
  }>
  get(): T
}
```

对了，这里再插一嘴，很多答案会用 `&` 结合一些类型函数去合并对象，其实我不太推荐这样，我更推荐使用 `mapped types`，因为它的语法提示是最好的：

![mapped types||800x533](/images/type-challenges-2/1.webp)

![&||1200x161](/images/type-challenges-2/2.webp)

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

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/15/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Last<T extends any[]> = T extends [...any, infer L] ? L : never
```

灵活运用 `...` 运算符和 `infer` 即可。

想看看文档？[Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)

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

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/16/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Pop<T extends any[]> = T extends [...infer Rest, infer L] ? Rest : []
```

和上面的题都差不多，没什么可说的了。

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

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/20/play/zh-CN)

<details>
<summary>展开查看答案</summary>

首先我们需要确保 `PromiseAll()` 接受一个数组类型作为参数：

```ts
declare function PromiseAll<T extends any[]>(values: T): any
```

然后将 `values` 的类型从数组转换为元组，再返回带有元组结果的 `Promise` 类型。如何将数组转为元组呢？我们需要看一下[文档](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)，原文是这样说的：

Tuples can also have rest elements, which have to be an array/tuple type.

意思是元组中可以有剩余参数，且剩余参数必须是数组/元组类型。因此可以用 `[...T]` 这种方式去做转换：

```ts
declare function PromiseAll<T extends any[]>(values: readonly [...T]): Promise<T>
```

转元组这一步似乎令人感到费解？但这是必要的。原因在于元组可以清楚地知道它有多少个元素，哪个元素在哪个位置。这和使用数组产生的结果也有很大不同：

```ts
declare function PromiseAll<T extends any[]>(values: [...T]): T
const a = PromiseAll([1, 2, Promise.resolve(3)])
type A = typeof a // Promise<[number, number, Promise<number>]>

// if not
declare function PromiseAll<T extends any[]>(values: T): T
const a = PromiseAll([1, 2, Promise.resolve(3)])
type A = typeof a // (number | Promise<number>)[]
```

最后，由于测试用例中传入的参数 `[1, 2, 3] as const` 会被推断为一个**只读元组**，所以我们需要加一个 `readonly` 前缀来匹配。然后使用 `mapped types` 再套一个 `Awatied` 解决 `Promise` 的问题即可：

```ts
declare function PromiseAll<T extends any[]>(
  values: readonly [...T],
): Promise<{
  [key in keyof T]: Awaited<T[key]>
}>
```

</details>

## Type Lookup

有时，您可能希望根据某个属性在联合类型中查找类型。

在此挑战中，我们想通过在联合类型 `Cat | Dog` 中搜索公共 `type` 字段来获取相应的类型。换句话说，在以下示例中，我们期望 `LookUp<Dog | Cat, 'dog'>` 获得 `Dog`，`LookUp<Dog | Cat, 'cat'>` 获得 `Cat`。

```ts
interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
  color: 'brown' | 'white' | 'black'
}

type MyDog = LookUp<Cat | Dog, 'dog'> // expected to be `Dog`
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/62/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type LookUp<T extends { type: string; [key: string]: any }, U extends T['type']> = T extends T
  ? U extends T['type']
    ? T
    : never
  : never

type LookUp<U extends { type: string }, T extends U['type']> = U extends { type: T } ? U : never

type LookUp<U, T> = Extract<U, { type: T }>
```

这里主要借助 TypeScript 中的[分离联合类型](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)来实现。

在 TypeScript 中，当一个联合类型进参与判断时，如：`A extends B`，`A` 和 `B` 都是联合类型，必须令 `A` 中所有的子类型都在联合类型 `B` 中存在，才能满足条件。

但是，如果 `A` 是一个泛型，那么 TypeScript 也不清楚是否满足条件，于是他就对 `A` 中的每一项进行判断，再把结果转为联合类型：

```ts
type xyz = 'x' | 'y' | 'z'
type IsX<T> = T extends 'x' ? true : T

type result = IsX<xyz> // true | 'y' | 'z'
```

对于本题，我们就可以用 `U extends { type: T }` 结合联合类型会将 `never` 剔除的特性来实现。

不过需要注意的是，不能使用 `U` 的属性，或用数组等将其包裹，这样是行不通的：

```ts
U['type'] extends T // U['type'] 是 'cat' | 'dog'，不会触发分离联合类型
```

</details>

## Trim Left

实现 `TrimLeft<T>` ，它接收确定的字符串类型并返回一个新的字符串，其中新返回的字符串删除了原字符串开头的空白字符串。

例如

```ts
type trimed = TrimLeft<'  Hello World  '> // 应推导出 'Hello World  '
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/106/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type TrimLeft<S extends string> = S extends `${' ' | '\n' | '\t'}${infer Rest}` ? TrimLeft<Rest> : S
```

[Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)

</details>

## Trim

实现 `Trim<T>`，它是一个字符串类型，并返回一个新字符串，其中两端的空白符都已被删除。

例如

```ts
type trimed = Trim<'  Hello World  '> // expected to be 'Hello World'
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/108/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Space = ' ' | '\n' | '\t'
type Trim<S extends string> = S extends `${Space}${infer Rest}` | `${infer Rest}${Space}`
  ? Trim<Rest>
  : S
```

和上面思路一样，结合条件类型判断再递归即可。

</details>

## Capitalize

实现 `Capitalize<T>` 它将字符串的第一个字母转换为大写，其余字母保持原样。

例如

```ts
type capitalized = Capitalize<'hello world'> // expected to be 'Hello world'
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/110/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type MyCapitalize<S extends string> = S extends `${infer F}${infer Rest}`
  ? `${Uppercase<F>}${Rest}`
  : S
```

</details>

## Replace

实现 `Replace<S, From, To>` 将字符串 `S` 中的第一个子字符串 `From` 替换为 `To` 。

例如

```ts
type replaced = Replace<'types are fun!', 'fun', 'awesome'> // 期望是 'types are awesome!'
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/116/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Replace<S extends string, From extends string, To extends string> = From extends ''
  ? S
  : S extends `${infer B}${From}${infer A}`
  ? `${B}${To}${A}`
  : S
```

</details>

## ReplaceAll

实现 `ReplaceAll<S, From, To>` 将一个字符串 `S` 中的所有子字符串 `From` 替换为 `To`。

例如

```ts
type replaced = ReplaceAll<'t y p e s', ' ', ''> // 期望是 'types'
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/119/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type ReplaceAll<S extends string, From extends string, To extends string> = From extends ''
  ? S
  : S extends `${infer B}${From}${infer A}`
  ? `${B}${To}${ReplaceAll<A, From, To>}`
  : S
```

**注意下递归的思路。**

</details>

## 追加参数

> 由 @antfu 翻译

实现一个泛型 `AppendArgument<Fn, A>`，对于给定的函数类型 `Fn`，以及一个任意类型 `A`，返回一个新的函数 `G`。`G` 拥有 `Fn` 的所有参数并在末尾追加类型为 `A` 的参数。

```ts
type Fn = (a: number, b: string) => number

type Result = AppendArgument<Fn, boolean>
// 期望是 (a: number, b: string, x: boolean) => number
```

> 本挑战来自于 [@maciejsikora](https://github.com/maciejsikora) 在 Dev.io 上的[文章](https://dev.to/macsikora/advanced-typescript-exercises-question-4-495c)

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/191/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type AppendArgument<Fn extends (...args: any[]) => any, A> = Fn extends (
  ...args: infer P
) => infer R
  ? (...args: [...P, A]) => R
  : never
```

`infer` 大法好~

</details>

## Permutation

实现联合类型的全排列，将联合类型转换成所有可能的全排列数组的联合类型。

```ts
type perm = Permutation<'A' | 'B' | 'C'> // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/296/play/zh-CN)

<details>
<summary>展开查看答案</summary>

STEP1: 利用 `Distributive Conditional Types` 特性,把 `Union` 转换成 `Array`，至于这里 `extends` 什么并不太重要, 只要条件为真,先用 `any` 好了
// 要注意, 这里产生分支的条件是 `extends` 表达式, 表达式中的 `U` 是联合类型的每一个分支, 相当于被 `map`。

```ts
type Uni = 'A' | 'B' | 'C'
type S1<U> = U extends any ? [U] : never
type P1 = S1<Uni> // ['A'] | ['B'] | ['C']
```

STEP2: 观察一下，只是拿到了首个字母，如果要继续拿后面的两个，很显然需要 `loop`，`Type Space` 里的 `loop` 通常通过循环调用. 或者想一下如果是函数该怎么写，然后上面的式子里 U 被 map 拆掉了,那么我们还需要一份完整的复制，用于之后继续传递，所以增加一个默认值 `C = U`，之后我们填上 `S2<Exclude<C,U>>`，看第一项等于把 `[B，C]` 传入下一次循环

```ts
type S2<U, C = U> = U extends any ? [U, S2<Exclude<C, U>>] : never
type P2 = S2<Uni> //["A", ["B", ["C", never]] | ["C", ["B", never]]] | ["B", ["A", ["C", never]] | ["C", ["A", never]]] | ["C", ["A", ["B", never]] | ["B", ["A", never]]]
```

STEP3: 观察一下结果，是拓成了 6 项，但每项的内容不对，而且里面有 `never`，试着想办法把 `never` 拿掉，怎么拿掉呢? 试着再加一级 `extends`。

注意，如果这里还是用 `Union extends xxx` 的形式就又 `Distribute` 分支了，所以这里把传入 `[U]` 整体进条件。

```ts
type S3<U, C = U> = [U] extends [never] ? [] : U extends C ? [U, ...S3<Exclude<C, U>>] : never
```

这里同样，用 `[U]/[C]` 判断无关紧要，因为这两个相等，`U extends any` 也可以改成 `U extends C`，但注意，这里的意义跟前面完全不同，`U` 已经是 `map` 后的子元素了，不可以反过来。

最终结果：

```ts
type Permutation<U, C = U> = [U] extends [never]
  ? []
  : U extends C
  ? [U, ...Permutation<Exclude<C, U>>]
  : never
```

答案来自[这里](https://github.com/type-challenges/type-challenges/issues/13383)。

</details>
