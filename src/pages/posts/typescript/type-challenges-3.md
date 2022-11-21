---
layout: '@/layouts/Post.astro'
title: type-challenges 类型挑战系列【三】
abstract: type-challenges 意在于让你更好的了解 TS 的类型系统，编写你自己的类型工具，它可以帮助我们更好地编写类型代码，提升自己的能力，或者只是单纯的享受挑战的乐趣！
author:
  name: Gu-Miao
  link: https://github.com/Gu-Miao
image: /images/type-challenges-3.webp
createdAt: '2022-08-08 09:00'
updatedAt: '2022-08-19 16:40'
category: TypeScript
tags:
  - TypeScript
  - type-challenges
serials: type-challenges 类型挑战系列
---

[type-challenges](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md) 意在于让你更好的了解 TS 的类型系统，编写你自己的类型工具，它可以帮助我们更好地编写类型代码，提升自己的能力，或者只是单纯的享受挑战的乐趣！

> 本篇内容全部为**中等**难度。

## Length of String

计算字符串的长度，类似于 `String#length` 。

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/298/play/zh-CN)

<details>
<summary>展开查看答案</summary>

在 TypeScript 中，如果 `T` 是一个字符串类型，那么 `T['length']` 为 `number` 类型；而如果 `T` 是一个数组类型，那么 `T['length']` 会是具体的数字。也就是说，我们需要将字符串转换为数组或元组，即可得到准确的长度。

最简单的办法，写一个 `StringToArray` 工具类型，将字符串转换为数组，再直接返回它的长度：

```ts
type StringToArray<T extends string> = T extends `${infer F}${infer Rest}`
  ? [F, ...StringToArray<Rest>]
  : []
type LengthOfString<S extends string> = StringToArray<S>['length']
```

或者，我们也可以再定义一个数组类型参数 `A`，当 `S` 不为空字符串时，我们将 `S` 中的第一个字符存入 `A`，进行下一次递归，当 `S` 变为空字符串时，说明字符串类型 `S` 已经完全转换成了数组类型 `A`，这时只需要返回 `A` 的长度即可：

```ts
type LengthOfString<S extends string, A extends string[] = []> = S extends `${infer F}${infer R}`
  ? LengthOfString<R, [...A, F]>
  : A['length']
```

</details>

## Flatten

在这个挑战中，你需要写一个接受数组的类型，并且返回扁平化的数组类型。

例如: Flatten

```ts
type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/459/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Flatten<T extends any[]> = T extends [infer F, ...infer Rest]
  ? F extends any[]
    ? Flatten<[...F, ...Rest]>
    : [F, ...Flatten<Rest>]
  : []
```

首先判断数组是否为空，如果为空，返回空数组；如果不为空，判断第一项是否是数组，如果是，那么就将第一项展开再递归，否则只递归数组中的其他元素。

</details>

## Append to object

实现一个为接口添加一个新字段的类型。该类型接收三个参数，返回带有新字段的接口类型。

例如:

```ts
type Test = { id: '1' }
type Result = AppendToObject<Test, 'value', 4> // expected to be { id: '1', value: 4 }
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/527/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type AppendToObject<T, U extends keyof any, V> = {
  [key in keyof T | U]: key extends keyof T ? T[key] : V
}
```

遍历 `T` 和 `U` 上的键名，再通过判断映射正确的类型即可。

```ts
type AppendToObject<T, U extends keyof any, V> = Omit<T, U> & Record<U, V>
```

使用交集的方式来组合对象，这可能是最容易想到的办法。不过要注意用交集需要将 `T` 中和 `U` 相同的字段移除再组合，因为如果存在同名字段且他们的类型没有交集，那么类型会变为 `never`：

```ts
type test = { name: string } & { name: boolean } // type test = never
```

而且使用交集和映射产生的结果对代码提示也会有影响，可以看看这个[回答](https://github.com/type-challenges/type-challenges/issues/9115#issuecomment-1109465605)。

并且，现在的 `Equal` 类型是有一定缺陷的，使用第二种方式能够生成正确的类型，但无法通过 playground 的测试用例。想进一步了解的话可以看看[这里](https://github.com/microsoft/TypeScript/issues/27024)和[这里](https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript/68963796#68963796)。

</details>

## Absolute

实现一个接收 `string`，`number` 或 `bigint` 类型参数的 `Absolute` 类型，返回一个正数字符串。

例如

```ts
type Test = -100
type Result = Absolute<Test> // expected to be "100"
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/529/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Absolute<T extends number | string | bigint> = `${T}` extends `-${infer N}` ? N : `${T}`
```

在 typescript 中很难去操作具体的数字，但是可以将数字转为字符串，再判断第一个字符是否是负号即可。

</details>

## String to Union

实现一个将接收到的 String 参数转换为一个字母 Union 的类型。

例如

```ts
type Test = '123'
type Result = StringToUnion<Test> // expected to be "1" | "2" | "3"
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/531/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type StringToUnion<T extends string> = T extends `${infer F}${infer Rest}`
  ? F | StringToUnion<Rest>
  : never
```

没什么可说的，判断字符串是否为空，摘出第一项，然后递归剩余字符。

</details>

## Merge

将两个类型合并成一个类型，第二个类型的键会覆盖第一个类型的键。

例如

```ts
type foo = {
  name: string
  age: string
}

type coo = {
  age: number
  sex: string
}

type Result = Merge<foo, coo> // expected to be {name: string, age: number, sex: string}
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/599/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Merge<F, S> = {
  [key in keyof F | keyof S]: key extends keyof S ? S[key] : key extends keyof F ? F[key] : never
}
```

嗯？似曾相识的感觉...

</details>

## KebabCase

将字符串转换为短横线隔开式：

`FooBarBaz` -> `foo-bar-baz`

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/612/play/zh-CN)

<details>
<summary>展开查看答案</summary>

第一个方法：

```ts
type UppercaseLetters =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'
type KebabCase<S, IsFirst = true> = S extends `${infer F}${infer R}`
  ? F extends UppercaseLetters
    ? `${IsFirst extends true ? '' : '-'}${Lowercase<F>}${KebabCase<R, false>}`
    : `${F}${KebabCase<R, false>}`
  : S
```

最容易想到的办法，先将所有大写字母列出来，写成一个联合类型。然后来到函数这里，先判断 `S` 是否为空串，如果是，将 `S` 直接返回；否则继续判断 `F` 是否是大写字母，如果不是就递归剩余字符，如果是，那么我们需要根据当前的 `F` 是不是整个字符串的第一个字符来判断是否需要加一个 `-`。那么我们可以再添加一个参数 `IsFirst`，将默认值设为 `true`，除第一次调用外，其他的递归过程均显式地传递 `false` 即可。

再来看[第二个方法](https://github.com/type-challenges/type-challenges/issues/13907)：

```ts
type KebabCase<S> = S extends `${infer F}${infer R}`
  ? R extends Uncapitalize<R>
    ? `${Uncapitalize<F>}${KebabCase<R>}`
    : `${Uncapitalize<F>}-${KebabCase<R>}`
  : S
```

这是一个很巧妙的方法，首先还是判断是否为空串，然后重点来了，这里让过第一个字符，将剩余字符 `R` 首字母降为小写，之后与 `R` 本身进行判等。嗯？为什么这样判断？

其实这里是为了方便加中划线 `-`，因为将字符串转化为短横线隔开式的过程中，**首字母前没有中划线**。在**第一次递归**时，无论首字母是否大写，前面都不会有中划线，那么只需要判断第二个字符是否为大写就行了。如果是大写，那就拼接一个中划线 `-`，再将剩余字符 `R` 进行递归，否则不拼接中划线直接递归 `R`。这样一来，每次递归都满足**首字母前没有中划线**，因为不论本次调用中的参数 `S` 的首字母是否大写，拼接中划线的操作已经在上一次递归中完成了。

</details>

## Diff

获取两个接口类型中的差值属性。

```ts
type Foo = {
  a: string
  b: number
}
type Bar = {
  a: string
  c: boolean
}

type Result1 = Diff<Foo, Bar> // { b: number, c: boolean }
type Result2 = Diff<Bar, Foo> // { b: number, c: boolean }
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/645/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Diff<T, U> = {
  [key in Exclude<keyof T, keyof U> | Exclude<keyof U, keyof T>]: key extends keyof T
    ? key extends keyof U
      ? never
      : T[key]
    : key extends keyof U
    ? U[key]
    : never
}
```

去掉两个类型键名中的重复项，再将它们联合起来。然后用 `key` 去遍历，再判断 `key` 属于 `T` 还是属于 `U`，最后将之正确的映射即可。

</details>

## AnyOf

在类型系统中实现类似于 Python 中 `any` 函数。类型接收一个数组，如果数组中任一个元素为真，则返回 `true`，否则返回 `false`。如果数组为空，返回 `false`。

例如：

```ts
type Sample1 = AnyOf<[1, '', false, [], {}]> // expected to be true.
type Sample2 = AnyOf<[0, '', false, [], {}]> // expected to be false.
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/949/play/zh-CN)

<details>
<summary>展开查看答案</summary>

首先我们需要确定什么是假值：

```ts
type Fasly = undefined | null | 0 | '' | false | [] | Record<string, never>
```

这里不能用 `{}`，它并不表示“空”对象，可以看看这个 FAQ：[Difference between 'object' ,{} and Object in TypeScript](https://stackoverflow.com/questions/49464634/difference-between-object-and-object-in-typescript)。

再解释下 `Record<string, never>`，一个类型的值 `Record<string, never>` 可以有任意数量的字符串键成员（包括 0 个），并且它的任何成员都必须是 `never` 类型。但是由于没有任何值是 `never` 类型的，这意味着类型的值 `Record<string, never>` 必须正好有 0 个字符串键成员。想进一步了解可以看看这些：

- [Why 1 extends {[Key: string]: never} is false](https://stackoverflow.com/questions/71799555/why-1-extends-key-string-never-is-false#)
- [Index Signatures](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures)

```ts
type AnyOf<T extends readonly any[]> = T extends Array<Fasly> ? false : true
```

好了，现在回到这个函数，我们只需要对它的每一项进行判断，**只要有一项不为假值类型**，那么就返回 `true`，否则返回 `false`。这里我们可以利用数组类型的特性，即每一项都要满足数组的类型参数，来方便我们判断。当然也可以用元组遍历的方式 `T[number] extends Falsy` 来判断。

</details>

## IsNever

实现一个 `IsNever` 类型，它接收一个参数 `T`。如果 `T` 的类型为 `never`，返回 `true`，否则返回 `false`。

几个例子：

```ts
type A = IsNever<never> // expected to be true
type B = IsNever<undefined> // expected to be false
type C = IsNever<null> // expected to be false
type D = IsNever<[]> // expected to be false
type E = IsNever<number> // expected to be false
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/1042/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type IsNever<T> = [T] extends [never] ? true : false
```

- [Generic conditional type T extends never ? 'yes' : 'no' resolves to never when T is never.](https://github.com/microsoft/TypeScript/issues/31751)
- [Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)

</details>

## IsUnion

实现一个 `IsUnion` 类型，它接收一个参数 `T`。如果 `T` 是一个联合类型，返回 `true`，否则返回 `false`。

几个例子：

```ts
type case1 = IsUnion<string> // false
type case2 = IsUnion<string | number> // true
type case3 = IsUnion<[string | number]> // false
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/1097/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type IsNever<T> = [T] extends [never] ? true : false
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false
type IsUnion<T, U = T> = IsNever<T> extends true
  ? false
  : T extends T
  ? Equal<T, U> extends true
    ? false
    : true
  : never
```

首先，我们使用[分布式条件类型](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)来分离联合类型 `T`，这里用 `(1)` 和 `(2)` 来代表不同的分支：

```ts
type IsUnion<T> = T extends T ? (1)<T> : (2)<T>
```

以 `string | number` 为例，这里展开就是：

```ts
type IsUnion<string | number> = (1)<string> | (1)<number>
```

对于 `string` 和 `number` 来说，`T extends T` 是肯定成立的，因此它们都会走 `(1)` 分支。但是我们需要考虑一个特殊情况，那就是 `never`：

```ts
type Test<T> = T extends T ? 1 : 2
type TestNever = Test<never> // TestNever 的类型为 never
```

我们需要对 `never` 进行特殊判断，这里直接用之前写的 [`IsNever`](#isnever) 类型：

```ts
type IsUnion<T> = IsNever<T> ? false : T extends T ? (1)<T> : (2)<T>
```

好的，现在把思路转回来。我们已经分离了 `T` 类型，那么，我们只需要判断**分离后的 `T` 类型是否和分离前的 `T` 类型相同**即可。因此，这里我们加一个参数 `U`，默认值设为 `T` 来保存分离前的 `T` 类型：

```ts
type IsUnion<T, U = T> = IsNever<T> extends true
  ? false
  : T extends T
  ? Equal<T, U> extends true
    ? false
    : true
  : never
```

`Equal<T, U>` 这个类型是 `type-challenges` 提供的，直接用就可以，这里也不做展开。

这里再讲一下[另一种方法](https://github.com/type-challenges/type-challenges/issues/13276)：

```ts
type IsUnion<T, U = T> = (T extends U ? (U extends T ? true : false) : never) extends true
  ? false
  : true
```

这个解答看上去简单了很多，有没有？但实际上解答的核心是一样的，它还是去判断了**分离后的 `T` 类型是否和分离前的 `T` 类型相同**。这里我们直接带入参数看一下：

```ts
// 非联合类型
type TestString = IsUnion<string>
type TestString = (
  string extends string ? (string extends string ? true : false) : never
) extends true
  ? false
  : true
type TestString = true extends true ? false : true
type TestString = false

// 联合类型
type TestStringOrNumber = IsUnion<string | number>
// 这里分配了两次，有些繁琐，可以花点时间琢磨下
type TestStringOrNumber =
  | (string extends string | number
      ? (string extends string ? true : false) | (number extends string ? true : false)
      : never)
  | (number extends string | number
      ? (string extends number ? true : false) | (string extends number ? true : false)
      : never) extends true
  ? false
  : true
type TestStringOrNumber = boolean extends true ? false : true
type TestStringOrNumber = true

// T 为 never 时
type TestNever = IsUnion<never>
type TestNever = (never extends never ? (never extends never ? true : false) : never) extends true
  ? false
  : true
type TestNever = never extends true ? false : true
type TestNever = false
```

可以看到，括号内一共有三种结果 `true`（非联合类型），`boolean`（联合类型）以及 `never`（`T` 为 `never` 时），然后与 `true` 做判断得到最后的结果。（这里再提一下 `never extends true` 是成立的）

将前半部分判断包裹起来再与 `true` 进行判断可以避免直接输出 `never`，利用这个思路，我们还可以把第一种写法简化一下：

```ts
type IsUnion<T, U = T> = (T extends T ? Equal<T, U> : never) extends true ? false : true
```

</details>

## ReplaceKeys

实现一个 `ReplaceKeys` 类型用来替换对象类型中的键，它接受三个参数：`T`，原始对象，并且它可能是联合类型；`U`，要替换的键名联合，如果 `T` 中没有这个键名，那么跳过本次替换；`Y`，用来替换 `T` 的对象，`Y` 中不一定包含 `U` 中所有的键名，没有的键名视为 `never`。

几个例子：

```ts
type NodeA = {
  type: 'A'
  name: string
  flag: number
}

type NodeB = {
  type: 'B'
  id: number
  flag: number
}

type NodeC = {
  type: 'C'
  name: string
  flag: number
}

type Nodes = NodeA | NodeB | NodeC

type ReplacedNodes = ReplaceKeys<Nodes, 'name' | 'flag', { name: number; flag: string }>
// {type: 'A', name: number, flag: string} | {type: 'B', id: number, flag: string} | {type: 'C', name: number, flag: string}
// 将 name 从 string 替换为 number，将 flag 从 number 替换为 string

type ReplacedNotExistKeys = ReplaceKeys<Nodes, 'name', { aa: number }>
// {type: 'A', name: never, flag: number} | NodeB | {type: 'C', name: never, flag: number}
// 将 name 替换为 never
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/1130/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type ReplaceKeys<
  T extends Record<string, any>,
  U extends keyof any,
  Y extends Record<string, any>,
> = {
  [key in keyof T]: key extends U ? (key extends keyof Y ? Y[key] : never) : T[key]
}
```

首先约束下参数的类型，方便后面操作。

然后，你是不是觉得我要祭出 `T extends T` 了？笑。这里不需要，可以看看[这个](https://github.com/type-challenges/type-challenges/issues/9743#issuecomment-1123241298)。

接着看生成的对象，所有的键应该都来自 `T`，因为如果 `U` 中的键在 `T` 中不存在，那么会跳过替换而非在 `T` 中新增一个键。再判断键是否需要替换，不替换就给 `T[key]`，如果需要替换，判断一下 `Y` 中有没有这个键，有就用 `Y` 里的，没有就是 `never`。

</details>

## Remove Index Signature

实现 `RemoveIndexSignature<T>` 类型。从对象类型中排除索引签名。

举个例子：

```ts
type Foo = {
  [key: string]: any
  foo(): void
}

type A = RemoveIndexSignature<Foo> // { foo(): void }
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/1367/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type RemoveIndexSignature<T> = {
  [key in keyof T as string extends key
    ? never
    : number extends key
    ? never
    : symbol extends key
    ? never
    : key]: T[key]
}
```

没什么可说的，看这个就会了：[Key Remapping via
`as`](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as)。

</details>

## Percentage Parser

实现类型 PercentageParser<T extends string>。根据规则 `/^(\+|\-)?(\d*)?(\%)?$/` 匹配类型 T。

匹配的结果由三部分组成，分别是：[`正负号`, `数字`, `单位`]，如果没有匹配，则默认是空字符串。

例如：

```ts
type PString1 = ''
type PString2 = '+85%'
type PString3 = '-85%'
type PString4 = '85%'
type PString5 = '85'

type R1 = PercentageParser<PString1> // expected ['', '', '']
type R2 = PercentageParser<PString2> // expected ["+", "85", "%"]
type R3 = PercentageParser<PString3> // expected ["-", "85", "%"]
type R4 = PercentageParser<PString4> // expected ["", "85", "%"]
type R5 = PercentageParser<PString5> // expected ["", "85", ""]
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/1978/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type PercentageParser<A extends string> = A extends `${infer F}${infer R}`
  ? F extends '+' | '-'
    ? R extends `${infer N}%`
      ? [F, N, '%']
      : [F, R, '']
    : A extends `${infer N}%`
    ? ['', N, '%']
    : ['', A, '']
  : ['', '', '']
```

逐个判断，看了就懂。

</details>

## Drop Char

从字符串中剔除指定字符。

例如：

```ts
type Butterfly = DropChar<' b u t t e r f l y ! ', ' '> // 'butterfly!'
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/2070/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type DropChar<S, C> = S extends `${infer F}${infer R}`
  ? F extends C
    ? DropChar<R, C>
    : `${F}${DropChar<R, C>}`
  : S
```

字符串拼接递归，已经出现了很多次的东西。

</details>
