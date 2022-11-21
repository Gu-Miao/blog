---
layout: '@/layouts/Post.astro'
title: type-challenges 类型挑战系列【六】
abstract: type-challenges 意在于让你更好的了解 TS 的类型系统，编写你自己的类型工具，它可以帮助我们更好地编写类型代码，提升自己的能力，或者只是单纯的享受挑战的乐趣！
author:
  name: Gu-Miao
  link: https://github.com/Gu-Miao
image: /images/type-challenges-6.webp
createdAt: '2022-09-23 09:52'
updatedAt: '2022-09-23 09:52'
category: TypeScript
tags:
  - TypeScript
  - type-challenges
serials: type-challenges 类型挑战系列
---

[type-challenges](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md) 意在于让你更好的了解 TS 的类型系统，编写你自己的类型工具，它可以帮助我们更好地编写类型代码，提升自己的能力，或者只是单纯的享受挑战的乐趣！

> 本篇内容全部为**中等**难度。

## IndexOf

实现 `Array.indexOf()` 的类型版本， `indexOf<T, U>` 接受一个数组类型参数 `T` 和一个任意类型参数 `U`，返回数组 `T` 中第一个 `U` 的索引。

```ts
type Res = IndexOf<[1, 2, 3], 2> // 1
type Res1 = IndexOf<[2, 6, 3, 8, 4, 1, 7, 3, 9], 3> // 2
type Res2 = IndexOf<[0, 0, 0], 2> // -1
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/5153/play/zh-CN)

<details>
<summary>展开查看答案</summary>

挺简单的一题，值得一提的是这里用了 `Equal` 这个类型，来自 `@type-challenges/utils`。

```ts
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false
type IndexOf<T extends any[], U, S extends 1[] = []> = T extends [infer F, ...infer R]
  ? Equal<F, U> extends true
    ? S['length']
    : IndexOf<R, U, [...S, 1]>
  : -1
```

</details>

## Join

实现一个类型版本的 `Array.join()`。

```ts
type Res = Join<['a', 'p', 'p', 'l', 'e'], '-'> // 'a-p-p-l-e'
type Res1 = Join<['Hello', 'World'], ' '> // 'Hello World'
type Res2 = Join<['2', '2', '2'], 1> // '21212'
type Res3 = Join<['o'], 'u'> // 'o'
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/5310/play/zh-CN)

<details>
<summary>展开查看答案</summary>

很简单，思考下怎么去掉多余的 `U` 就行了。

```ts
type Join<T extends string[], U extends string> = T extends [
  infer F extends string,
  ...infer R extends string[],
]
  ? R['length'] extends 0
    ? F
    : `${F}${U}${Join<R, U>}`
  : ''
```

</details>

## LastIndexOf

Implement the type version of Array.lastIndexOf, LastIndexOf<T, U> takes an Array T, any U and returns the index of the last U in Array T

实现一个类型版的 `Array.lastIndexOf()`，`LastIndexOf<T, U>` 接受一个数组类型参数 `T`，任意类型参数 `U` 并返回数组 `T` 中最后一个 `U` 的索引。

For example:

```ts
type Res1 = LastIndexOf<[1, 2, 3, 2, 1], 2> // 3
type Res2 = LastIndexOf<[0, 0, 0], 2> // -1
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/5317/play/zh-CN)

<details>
<summary>展开查看答案</summary>

`S` 用来记录当前递归的索引，`I` 用来记录最终结果。

```ts
type LastIndexOf<T extends any[], U, S extends 1[] = [], I extends number = -1> = T extends [
  infer F,
  ...infer R,
]
  ? Equal<F, U> extends true
    ? LastIndexOf<R, U, [...S, 1], S['length']>
    : LastIndexOf<R, U, [...S, 1], I>
  : I
```

不过这里还有一种非常巧妙的方法，来自 Github 的回答 [5317 - LastIndexOf](https://github.com/type-challenges/type-challenges/issues/16290)

```ts
type LastIndexOf<T extends unknown[], U> = T extends [...infer R, infer L]
  ? Equal<U, L> extends true
    ? R['length']
    : LastIndexOf<R, U>
  : -1
```

它从后向前递归，而 `R['length']` 正好就是我们需要的索引。

</details>

## Unique

实现 `Lodash.uniq()` 的类型版本，`Unique` 接受一个数组类型参数 `T`，返回没有重复值的数组 `T`。

```ts
type Res = Unique<[1, 1, 2, 2, 3, 3]> // [1, 2, 3]
type Res1 = Unique<[1, 2, 3, 4, 4, 5, 6, 7]> // [1, 2, 3, 4, 5, 6, 7]
type Res2 = Unique<[1, 'a', 2, 'b', 2, 'a']> // [1, "a", 2, "b"]
type Res3 = Unique<[string, number, 1, 'a', 1, string, 2, 'b', 2, number]> // [string, number, 1, "a", 2, "b"]
type Res4 = Unique<[unknown, unknown, any, any, never, never]> // [unknown, any, never]
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/5360/play/zh-CN)

<details>
<summary>展开查看答案</summary>

你可能会想到利用联合类型去重？但是不行，联合类型会合并，并消去 `never`，在数组中会丢失元素。

那么还是老老实实的递归就行了，最简单的方法是什么？循环 + 遍历！

先写个 `Contains` 类型：

```ts
type Contains<T extends any[], V> = T extends [infer F, ...infer R]
  ? Equal<F, V> extends true
    ? true
    : Contains<R, V>
  : false
```

然后递归，判断是否已经存在，如果存在就跳过本次递归；否则将值推入数组，继续递归。

```ts
type Unique<T extends any[], C extends any[] = []> = T extends [infer F, ...infer R]
  ? Contains<C, F> extends true
    ? Unique<R, C>
    : [F, ...Unique<R, [...C, F]>]
  : T
```

</details>

## MapTypes

实现 `MapTypes<T, R>`，它将对象 `T` 中的类型转换为类型 `R` 定义的不同类型，类型 `R` 具有以下结构：

```ts
type StringToNumber = {
  mapFrom: string // 键值为 string
  mapTo: number // 转为 number
}
```

例如：

```ts
type StringToNumber = { mapFrom: string; mapTo: number }
MapTypes<{ iWillBeANumberOneDay: string }, StringToNumber> // { iWillBeANumberOneDay: number; }
```

请注意，用户可以提供联合类型：

```ts
type StringToNumber = { mapFrom: string; mapTo: number }
type StringToDate = { mapFrom: string; mapTo: Date }
MapTypes<{ iWillBeNumberOrDate: string }, StringToDate | StringToNumber> // { iWillBeNumberOrDate: number | Date; }
```

如果我们的对象中不存在该类型，请保持原样：

```ts
type StringToNumber = { mapFrom: string; mapTo: number }
MapTypes<{ iWillBeANumberOneDay: string; iWillStayTheSame: Function }, StringToNumber> // { iWillBeANumberOneDay: number, iWillStayTheSame: Function }
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/5821/play/zh-CN)

<details>
<summary>展开查看答案</summary>

这里注意一下 `R extends { mapFrom: T[key] }`，因为 `R` 有可能是联合类型，所以需要多判断一次。

```ts
type MapTypes<T extends Record<string, any>, R extends { mapFrom: any; mapTo: any }> = {
  [key in keyof T]: T[key] extends R['mapFrom']
    ? R extends { mapFrom: T[key] }
      ? R['mapTo']
      : never
    : T[key]
}
```

</details>

## Construct Tuple

根据给定的数字创建元组。

例如：

```ts
type result = ConstructTuple<2> // [unknown, unkonwn]
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/7544/play/zh-CN)

<details>
<summary>展开查看答案</summary>

用例还很贴心的告诉我们递归无法超过 1000 次...

```ts
type ConstructTuple<L extends number, T extends unknown[] = []> = T['length'] extends L
  ? T
  : ConstructTuple<L, [...T, unknown]>
```

</details>

## Number Range

有时，我们想限制数字的范围，比如：

```ts
type result = NumberRange<2, 9> // 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/8640/play/zh-CN)

<details>
<summary>展开查看答案</summary>

`C` 用于计数，`R` 用于保存结果，`F` 判断是否在范围中。

如果 `L` 和 `H` 相等直接返回 `L`。

跳出递归的条件为 `C['length']` 和 `H` 相等。这时最后一项还没推入结果数组，所以返回 `C[number] | H`。

```ts
type NumberRange1<
  L extends number,
  H extends number,
  C extends 1[] = [],
  R extends number[] = [],
  F extends boolean = false,
> = L extends H
  ? L
  : C['length'] extends H
  ? R[number] | H
  : F extends true
  ? NumberRange<L, H, [...C, 1], [...R, C['length']], F>
  : C['length'] extends L
  ? NumberRange<L, H, [...C, 1], [...R, C['length']], true>
  : NumberRange<L, H, [...C, 1]>
```

</details>

## Combination

给定一个字符串数组，做排列组合。它对于[视频控件列表](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controlsList)等类型也很有用。

```ts
// "foo" | "bar" | "baz" | "foo bar" | "foo bar baz" | "foo baz" | "foo baz bar" | "bar foo" | "bar foo baz" | "bar baz" | "bar baz foo" | "baz foo" | "baz foo bar" | "baz bar" | "baz bar foo"
type Keys = Combination<['foo', 'bar', 'baz']>
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/8767/play/zh-CN)

<details>
<summary>展开查看答案</summary>

这个全排列比较简单了。

添加一个参数 `U` 默认值为 `T[number]` 来创建联合类型。`C` 是为了分离联合类型，默认值为 `U`。

当 `C` 为 `never` 时跳出递归。

可以稍稍推演下，就很清楚了。

```ts
type Combination<
  T extends string[],
  U extends string = T[number],
  C extends string = U,
> = C extends C ? C | `${C} ${Combination<[], Exclude<U, C>>}` : never
```

</details>

## Subsequence

给定一个唯一元素数组，返回所有可能的子序列。

子序列是可以通过删除一些元素或不删除元素而不改变剩余元素的顺序从数组派生的序列。

例如：

```ts
type A = Subsequence<[1, 2]> // [] | [1] | [2] | [1, 2]
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/8987/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Subsequence<T extends any[]> = T extends [infer F, ...infer Rest]
  ? [F, ...Subsequence<Rest>] | Subsequence<Rest>
  : T
```

</details>
