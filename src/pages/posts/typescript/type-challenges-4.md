---
layout: '@/layouts/Post.astro'
title: type-challenges 类型挑战系列【四】
abstract: type-challenges 意在于让你更好的了解 TS 的类型系统，编写你自己的类型工具，它可以帮助我们更好地编写类型代码，提升自己的能力，或者只是单纯的享受挑战的乐趣！
author:
  name: 光舞
  link: https://github.com/Gu-Miao
image: /images/type-challenges-4.webp
createdAt: '2022-09-13 09:22'
updatedAt: '2022-09-15 10:43'
category: typescript
tags:
  - TypeScript
  - type-challenges
serials: type-challenges 类型挑战系列
katex: true
---

[type-challenges](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md) 意在于让你更好的了解 TS 的类型系统，编写你自己的类型工具，它可以帮助我们更好地编写类型代码，提升自己的能力，或者只是单纯的享受挑战的乐趣！

> 本篇内容全部为**中等**难度。

## MinusOne

给定一个正整数作为类型的参数，要求返回的类型是该数字减 1。

例如:

```ts
type Zero = MinusOne<1> // 0
type FiftyFour = MinusOne<55> // 54
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/2257/play/zh-CN)

<details>
<summary>展开查看答案</summary>

说实话，我没想到这道题会是中等难度，类型系统中不支持四则运算，没办法直接操作数字类型，基本上只能通过数组的 `length` 属性做文章。这题在 Github 上的[答案](https://github.com/type-challenges/type-challenges/issues?q=label%3A2257+label%3Aanswer)也是有很多，有兴趣可以以自己翻看。

我们先来看最优解：

```ts
type ParseInt<T extends string> = T extends `${infer Digit extends number}` ? Digit : never

type ReverseString<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${ReverseString<Rest>}${First}`
  : ''

type RemoveLeadingZeros<S extends string> = S extends '0'
  ? S
  : S extends `${'0'}${infer R}`
  ? RemoveLeadingZeros<R>
  : S

type InternalMinusOne<S extends string> = S extends `${infer Digit extends number}${infer Rest}`
  ? Digit extends 0
    ? `9${InternalMinusOne<Rest>}`
    : `${[9, 0, 1, 2, 3, 4, 5, 6, 7, 8][Digit]}${Rest}`
  : never

type MinusOne<T extends number> = ParseInt<
  RemoveLeadingZeros<ReverseString<InternalMinusOne<ReverseString<`${T}`>>>>
>
```

这里用到了 [Improved Inference for infer Types in Template String Types](https://devblogs.microsoft.com/typescript/announcing-typescript-4-8-beta/#improved-inference-for-infer-types-in-template-string-types)，这是 4.8 新出的特性，可以在字符串中推导出准确的类型：

```ts
// SomeNum 旧版本中是 number；现在是 100。
type SomeNum = '100' extends `${infer U extends number}` ? U : never

// SomeNum 旧版本中是 bigint；现在是 100n。
type SomeBigInt = '100' extends `${infer U extends bigint}` ? U : never

// SomeNum 旧版本中是 boolean；现在是 true。
type SomeBool = 'true' extends `${infer U extends boolean}` ? U : never
```

那么思路就有了，首先构建数字字符串，减一需要退位，肯定要从低位运算，所以需要将字符串反转，再进行减一并递归，之后再将字符串反转回来。又因为会有 1000 这样减一会少一位的数字存在，最后字符串开头会是 0，那么还需要将 开头的 0 去掉。最后用上面说的特性将数字类型取出来并返回即可。

思路明确了，再看代码即可，一步一步都很清晰，没什么可说的了。

那么 4.8 之前怎么办呢？我们先来看一个简单的思路：

我们可以添加一个数组类型参数 `U` 用来保存当前的递归进度，并用这个数组的 `length` 去和 `T` 作比较，如果 `[...U, 1]['length'] extends T` 成立，说明已经满足 -1 的条件了，返回 `U['length']` 即可，否则向 `U` 中添加元素并继续递归。

```ts
type MinusOne<T extends number, U extends number[] = []> = [...U, 1]['length'] extends T
  ? U['length']
  : MinusOne<T, [...U, 1]>
```

但是你会发现过不了最后一个测试用例，这是因为递归层数太多了，测试发现只能支持到 1000，不过实际上应该已经很够用了。

再来看[这个](https://github.com/type-challenges/type-challenges/issues/15663)：

```ts
type MinusOne<Num extends number> = GetFilledArray<`${Num}`> extends [number, ...infer Other]
  ? Other['length']
  : 0

type GetFilledArray<
  Str extends string,
  Data extends 1[] = [],
> = Str extends `${infer First extends keyof Dictionary}${infer Other}`
  ? GetFilledArray<Other, [...CopyDictionaryTenTimes<Data>, ...Dictionary[First]]>
  : Data

type CopyDictionaryTenTimes<Arr extends 1[]> = [
  ...Arr,
  ...Arr,
  ...Arr,
  ...Arr,
  ...Arr,
  ...Arr,
  ...Arr,
  ...Arr,
  ...Arr,
  ...Arr,
]

type Dictionary = {
  '0': []
  '1': [1]
  '2': [1, 1]
  '3': [1, 1, 1]
  '4': [1, 1, 1, 1]
  '5': [1, 1, 1, 1, 1]
  '6': [1, 1, 1, 1, 1, 1]
  '7': [1, 1, 1, 1, 1, 1, 1]
  '8': [1, 1, 1, 1, 1, 1, 1, 1]
  '9': [1, 1, 1, 1, 1, 1, 1, 1, 1]
}
```

首先看 `Dictionary`，这是一个对应关系，因为我们用数组表示长度，所以 0\~9 分别对应长度为 0\~9 的数组。然后是 `CopyDictionaryTenTimes` 这个类型函数，它的作用是将数组长度“乘 10”。明白了上面两部分我们再从头看，首先将 `Num` 转为字符串传入 `GetFilledArray` 中来构建数组。在 `GetFilledArray` 中首先用 `infer` 进行非空判断并取得首个字符 `First` 和剩余字符 `Other` 然后进行递归。`[...CopyDictionaryTenTimes<Data>, ...Dictionary[First]]` 这里的数学意义是 $Data*10+First$，递归过程如下：

以 $1527$ 为例

1. $0*10+1=1$
2. $1*10+5=15$
3. $15*10+2=152$
4. $152*10+7=1527$

这样，我们就成功地构建出了对应长度的数组，再通过和 `Num` 的判断，即可得到正确的结果。这种方法要优于上面的，实测可以支持到 9999。

</details>

## PickByType

从 `T` 中选出类型为 `U` 的属性集。

```ts
type OnlyBoolean = PickByType<
  {
    name: string
    count: number
    isReadonly: boolean
    isEnable: boolean
  },
  boolean
> // { isReadonly: boolean; isEnable: boolean; }
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/2595/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type PickByType<T, U> = {
  [key in keyof T as [T[key]] extends [U] ? key : never]: T[key]
}
```

- [Key Remapping via as](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as)

</details>

## StartsWith

实现 `StartsWith<T, U>` ，接收两个 `string` 类型参数,然后判断 `T` 是否以 `U` 开头，根据结果返回 `true` 或 `false`。

例如：

```ts
type a = StartsWith<'abc', 'ac'> // expected to be false
type b = StartsWith<'abc', 'ab'> // expected to be true
type c = StartsWith<'abc', 'abcd'> // expected to be false
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/2688/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type StartsWith<T extends string, U extends string> = T extends `${U}${infer R}` ? true : false
```

</details>

## EndsWith

实现 `EndsWith<T, U>` ，接收两个 `string` 类型参数,然后判断 `T` 是否以 `U` 结尾，根据结果返回 `true` 或 `false`。

例如：

```ts
type a = EndsWith<'abc', 'bc'> // expected to be false
type b = EndsWith<'abc', 'abc'> // expected to be true
type c = EndsWith<'abc', 'd'> // expected to be false
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/2693/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type EndsWith<T extends string, U extends string> = T extends `${infer F}${U}` ? true : false
```

</details>

## PartialByKeys

实现一个通用的 `PartialByKeys<T, K>`，它接收两个类型参数 `T` 和 `K`。

`K` 指定应设置为可选的 `T` 的属性集。当没有提供 `K` 时，它就和普通的 `Partial<T>` 一样使所有属性都是可选的。

例如:

```ts
interface User {
  name: string
  age: number
  address: string
}

type UserPartialName = PartialByKeys<User, 'name'> // { name?:string; age:number; address:string }
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/2757/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Map<T> = {
  [key in keyof T]: T[key]
}
type PartialByKeys<T, K extends PropertyKey = keyof T> = Map<
  {
    [key in keyof T as key extends K ? never : key]: T[key]
  } & {
    [key in keyof T as key extends K ? key : never]?: T[key]
  }
>
```

</details>

## RequiredByKeys

实现一个通用的 `RequiredByKeys<T, K>`，它接收两个类型参数 `T` 和 `K`。

`K` 指定应设为必选的 `T` 的属性集。当没有提供 `K` 时，它就和普通的 `Required<T>` 一样使所有的属性成为必选的。

例如：

```ts
interface User {
  name?: string
  age?: number
  address?: string
}

type UserRequiredName = RequiredByKeys<User, 'name'> // { name: string; age?: number; address?: string }
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/2759/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Map<T> = {
  [key in keyof T]: T[key]
}
type RequiredByKeys<T, K extends PropertyKey = keyof T> = Map<
  {
    [key in keyof T as key extends K ? key : never]-?: T[key]
  } & {
    [key in keyof T as key extends K ? never : key]: T[key]
  }
>
```

</details>

## Mutable

实现一个通用的类型 `Mutable<T>`，使类型 `T` 的全部属性可变（非只读）。

例如：

```typescript
interface Todo {
  readonly title: string
  readonly description: string
  readonly completed: boolean
}

type MutableTodo = Mutable<Todo> // { title: string; description: string; completed: boolean; }
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/2793/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Mutable<T extends Record<string, any>> = {
  -readonly [key in keyof T]: T[key]
}
```

</details>

## OmitByType

从 `T` 中选出类型不为 `U` 的属性集。

```ts
type OmitBoolean = OmitByType<
  {
    name: string
    count: number
    isReadonly: boolean
    isEnable: boolean
  },
  boolean
> // { name: string; count: number }
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/2852/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type OmitByType<T, U> = {
  [key in keyof T as [T[key]] extends [U] ? never : key]: T[key]
}
```

</details>

## ObjectEntries

实现一个 `Object.entries` 类型：

```ts
interface Model {
  name: string
  age: number
  locations: string[] | null
}
type modelEntries = ObjectEntries<Model> // ['name', string] | ['age', number] | ['locations', string[] | null];
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/2946/play/zh-CN)

<details>
<summary>展开查看答案</summary>

观察题目，要求返回联合类型，想到可以利用 [Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types), 那么就需要一个 `T extends T`, 我们可以添加一个参数 `S`, 默认值为 `keyof T`:

```ts
type ObjectEntries<T, S = keyof T> = S extends S ? /** ... */ : never
```

那么 `/** ... */` 这里其实很明显了，就是 `[S, T[S]]`, 不过要限制一下 `S` 为 `keyof T` 类型，否则用 `T[S]` 会报错:

```ts
type ObjectEntries<T, S extends keyof T = keyof T> = S extends S ? [S, T[S]] : never
```

然而有个用例报错了，原来是用例里涉及到了可选属性，那么我们可以用 `Required` 把它的可选去掉。不过需要注意，如果本身的是可选属性，且类型显式地设为 `undefined`, `Required` 会将它转为 `never`:

```ts
type TestUndefined = Required<{ key?: undefined }> // { key: never }
```

那么写个工具类型将 `never` 转为 `undefined` 就行了：

```ts
type NeverToUndefined<T> = [T] extends [never] ? undefined : T
```

最终代码为：

```ts
type NeverToUndefined<T> = [T] extends [never] ? undefined : T
type ObjectEntries<T, S extends keyof T = keyof T> = S extends S
  ? [S, NeverToUndefined<Required<T>[S]>]
  : never
```

</details>

## Shift

实现 `Array.shift`

```ts
type Result = Shift<[3, 2, 1]> // [2, 1]
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/3062/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Shift<T extends any[]> = T extends [infer F, ...infer R] ? R : T
```

</details>

## Tuple to Nested Object

给定一个只包含字符串的元组类型 `T` 和一个类型 `U`，递归地创建一个嵌套地对象。

```ts
type a = TupleToNestedObject<['a'], string> // {a: string}
type b = TupleToNestedObject<['a', 'b'], number> // {a: {b: number}}
type c = TupleToNestedObject<[], boolean> // boolean. if the tuple is empty, just return the U type
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/3188/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type TupleToNestedObject<T extends string[], U> = T extends [infer F extends string, ...infer R]
  ? {
      [key in F]: TupleToNestedObject<R, U>
    }
  : U
```

如果元组不为空，用第一项构建对象类型并传入元组剩余项进行递归；如果元组为空，则返回 `U` 即可。

</details>

## Reverse

实现类型版本的数组反转 Array.reverse

例如：

```ts
type a = Reverse<['a', 'b']> // ['b', 'a']
type b = Reverse<['a', 'b', 'c']> // ['c', 'b', 'a']
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/3192/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Reverse<T> = T extends [infer F, ...infer R] ? [...Reverse<R>, F] : []
```

</details>

## Flip Arguments

实现一个 `lodash` 中的 `_.flip`

`FlipArguments` 类型要求一个函数类型 `T` 作为参数，并返回一个新的函数，新函数的返回类型与 `T` 相同，但参数顺序相反。

举个例子：

```ts
type Flipped = FlipArguments<(arg0: string, arg1: number, arg2: boolean) => void>
// (arg0: boolean, arg1: number, arg2: string) => void
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/3196/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Reverse<T> = T extends [infer F, ...infer R] ? [...Reverse<R>, F] : []
type FlipArguments<T extends Function> = T extends (...args: infer A) => infer R
  ? (...args: Reverse<A>) => R
  : T
```

通过 `infer` 再配合前面写的 `Reverse`，轻松拿下。

</details>

## FlattenDepth

根据层数打平数组。

```ts
type a = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2> // [1, 2, 3, 4, [5]]. 打平 2 次
type b = FlattenDepth<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, [[5]]]. 默认打平一次
```

如果提供第二个参数打平深度，那么它应是一个正整数。

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/3243/play/zh-CN)

<details>
<summary>展开查看答案</summary>

题目要求写一个深度打平，并规定打平层数的类型。我们可以逐步简化问题，再慢慢添加条件来实现。我们先不考虑打平层数，只考虑深度打平。同样，写深度打平之前，我们先看看打平一层怎样实现：

```ts
type FlattenOnce<T extends any[]> = T extends [infer F, ...infer R]
  ? F extends any[]
    ? [...F, ...FlattenOnce<R>]
    : [F, ...FlattenOnce<R>]
  : T
```

那么深度打平，其实就是将打平的操作，进行递归。那么上面代码那里进行打平了呢？那就是 `...F`，因此我们只要递归这里就可以了：

```ts
type FlattenDepth<T extends any[]> = T extends [infer F, ...infer R]
  ? F extends any[]
    ? [...FlattenDepth<F>, ...FlattenDepth<R>]
    : [F, ...FlattenDepth<R>]
  : T
```

现在考虑下层数问题，ts 中需要比较具体的数字类型，通常都需要数组的 `length` 属性。那么我们可以增加一个数组类型参数 `U`，每次打平向它里面添加一个元素来达到 “+1” 的目的。然后每次递归时，判断层数和它的 `length` 是否一致，如果一致，说明打平层数够了，直接返回本身即可；否则继续递归。

```ts
type FlattenDepth<
  T extends any[],
  S extends number = 1,
  U extends any[] = [],
> = U['length'] extends S
  ? T
  : T extends [infer F, ...infer R]
  ? F extends any[]
    ? [...FlattenDepth<F, S, [...U, 1]>, ...FlattenDepth<R, S, U>]
    : [F, ...FlattenDepth<R, S, U>]
  : T
```

需要注意，只有 `...F` 的部分向 `U` 中添加了元素，进行了 “+1”，因为只有这部分是**真正进行打平操作的**，而剩余参数 `R` 部分的递归，**并没有进行打平**，只是继续向后传递参数，因此这部分不 “+1”。

</details>

## BEM style string

块、元素、修饰符方法 (BEM) 是 CSS 中类的流行命名约定。

例如，块组件将表示为 btn，依赖于块的元素将表示为 `btn__price`，改变块样式的修饰符将表示为 `btn--big` 或 `btn__price--warning`。

实现 `BEM<B, E, M>` 从这三个参数生成字符串联合。 其中 `B` 是字符串文字，`E` 和 `M` 是字符串数组（可以为空）。

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/3326/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type BEM<B extends string, E extends string[], M extends string[]> = `${B}${E['length'] extends 0
  ? ''
  : `__${E[number]}`}${M['length'] extends 0 ? '' : `--${M[number]}`}`
```

字符串操作 + 数组长度判断 + `T[number]` = 拿下。

</details>

## InorderTraversal

实现二叉树的中序遍历：

```ts
const tree1 = {
  val: 1,
  left: null,
  right: {
    val: 2,
    left: {
      val: 3,
      left: null,
      right: null,
    },
    right: null,
  },
} as const

type A = InorderTraversal<typeof tree1> // [1, 3, 2]
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/3376/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type InorderTraversal<T extends TreeNode | null> = [T] extends [TreeNode]
  ? [...InorderTraversal<T['left']>, T['val'], ...InorderTraversal<T['right']>]
  : []
```

中序遍历是 `左 -> 根 -> 右`，返回一个数组类型，那么用 `...` 配合递归便是不二选择。

</details>
