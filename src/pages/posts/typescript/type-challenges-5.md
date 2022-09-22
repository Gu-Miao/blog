---
layout: '@/layouts/Post.astro'
title: type-challenges 类型挑战系列【五】
abstract: type-challenges 意在于让你更好的了解 TS 的类型系统，编写你自己的类型工具，它可以帮助我们更好地编写类型代码，提升自己的能力，或者只是单纯的享受挑战的乐趣！
author:
  name: 光舞
  link: https://github.com/Gu-Miao
image: /images/type-challenges-5.webp
createdAt: '2022-09-20 11:41'
updatedAt: '2022-09-22 12:04'
category: TypeScript
tags:
  - TypeScript
  - type-challenges
serials: type-challenges 类型挑战系列
katex: true
---

[type-challenges](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md) 意在于让你更好的了解 TS 的类型系统，编写你自己的类型工具，它可以帮助我们更好地编写类型代码，提升自己的能力，或者只是单纯的享受挑战的乐趣！

> 本篇内容全部为**中等**难度。

## Flip

实现 'just-flip-object' 的类型。例子：

```ts
Flip<{ a: 'x'; b: 'y'; c: 'z' }> // {x: 'a', y: 'b', z: 'c'}
Flip<{ a: 1; b: 2; c: 3 }> // {1: 'a', 2: 'b', 3: 'c'}
Flip<{ a: false; b: true }> // {false: 'a', true: 'b'}
```

无需支持不能作为对象键的嵌套对象和值，例如数组。

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/4179/play/zh-CN)

<details>
<summary>展开查看答案</summary>

这题需要实现 `key` 和 `value` 的交换，我们可以遍历对象对 `key` 进行追加变形。

通过在 `keyof` 描述对象时采用 `as` 追加变形。

```ts
type Flip<T> = {
  [P in keyof T as T[P]]: P
}
```

但是这样有几个测试会挂掉，由于 `key` 的位置只能是 `string` 或者 `number` 或者 `boolean` 所以挂了。

因此我们可以限定一下 `value` 的类型 `Record<string, string | number | boolean>`。

这样还是有挂掉的，是 `Flip<{ pi: 3.14; bool: true }>`，很显然 `boolean` 不能作为 `key`，需要转化成字符串，我们用模版强行转一下即可。

```ts
type Flip<T extends Record<string, string | number | boolean>> = {
  [P in keyof T as `${T[P]}`]: P
}
```

- [4179 - Flip By linjunc](https://github.com/type-challenges/type-challenges/issues/14094)

</details>

## 斐波那契序列

实现一个通用的 `Fibonacci<T>` 接受一个数字类型 `T` 并返回它对应的斐波那契序列。

数列： 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...

举个例子：

```ts
type Result1 = Fibonacci<3> // 2
type Result2 = Fibonacci<8> // 21
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/4182/play/zh-CN)

<details>
<summary>展开查看答案</summary>

又是一道跟数字有关的题目，我们还是需要使用数组递归并利用其 `length` 属性。

由斐波那契额数列的性质可知，$f(n)=f(n-2)+f(n-1)$，那么我们似乎可以倒推出结果。但实际上很困难，首先“-1”和“-2”就不是一个容易的操作（看了之前的题目，你应该已经知道），并且递归层级非常深。其次，我们使用数组元素数量来存储具体数值，加法通过 `...` 运算符即可实现，但减法则难以实现。

因而，我们使用正向推导来实现。那么就需要记录一些值，当次递归表示的数字次序，第 $n-2$ 项，第 $n-1$ 项，这些我们都使用数组来记录。

```ts
type Fibonacci<
  T extends number,
  No extends 1[] = [1, 1, 1],
  N_2 extends 1[] = [1],
  N_1 extends 1[] = [1],
> = any
```

斐波那契序列的第一项和第二项是固定的，需要特殊判断一下，我们从第三项开始递归，因此数字次序 `No` 初始值为“3”即 `[1, 1, 1]`，第 $n-2$ 项 `N_2` 初始值为第一项的“1”即 `[1]`，第 $n-1$ 项 `N_1` 为第二项的“1”即 `[1]`。

什么时候跳出递归？这个很明显就是 `No['length']` 和 `T` 相等的时候，这时需要返回 $f(n-2)+f(n-1)$，即 `[...N_2, ...N_1]['length']`。

```ts
type Fibonacci<
  T extends number,
  No extends 1[] = [1, 1, 1],
  N_2 extends 1[] = [1],
  N_1 extends 1[] = [1],
> = T extends 1 | 2 ? 1 : T extends No['length'] ? [...N_2, ...N_1]['length'] : any
```

最后再看递归的部分，从数学层面看，每次递归其实是向右移动了一位。这样的话就很好说了，我们只要看看参数如何变化就行了。`T` 不变；`No` 进行“+1”操作用来记录次序；第 $n-2$ 项变成了 $n-1$ 项，所以 `N_2` 就变成了 `N-1`；而第 $n-1$ 项要变为第 $n$ 项，而 $f(n)=f(n-2)+f(n-1)$，那么 `N_1` 变为 `[...N_2, ...N_1]`。那么最终代码为：

```ts
type Fibonacci<
  T extends number,
  No extends 1[] = [1, 1, 1],
  N_2 extends 1[] = [1],
  N_1 extends 1[] = [1],
> = T extends 1 | 2
  ? 1
  : T extends No['length']
  ? [...N_2, ...N_1]['length']
  : Fibonacci<T, [...No, 1], N_1, [...N_2, ...N_1]>
```

</details>

## AllCombinations

实现类型 `AllCombinations<S>`，它返回最多使用 `S` 中字符的所有字符串组合。

举个例子：

```ts
type AllCombinations_ABC = AllCombinations<'ABC'>
// should be '' | 'A' | 'B' | 'C' | 'AB' | 'AC' | 'BA' | 'BC' | 'CA' | 'CB' | 'ABC' | 'ACB' | 'BAC' | 'BCA' | 'CAB' | 'CBA'
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/4260/play/zh-CN)

<details>
<summary>展开查看答案</summary>

首先，看结果我们需要一个联合类型，那么我们可以通过分离联合类型并递归来实现。

先实现一个字符串转联合类型的工具类型 `StringToUnion<S>`，注意这里会返回空字符串 `''`。

```ts
type StringToUnion<S> = S extends `${infer F}${infer R}` ? F | StringToUnion<R> : S
```

我们需要在递归中保存联合类型，因此需要添加一个参数 `T`，默认值为 `StringToUnion<S>`。我们还需要将联合类型分离，因而再添加一个参数 `U`，默认值为 `T`。

递归体内，我们需要每次将用到的 `U` 从 `T` 中删去，我们可以用 `Exclude` 类型：

```ts
type AllCombinations<
  S extends string,
  T extends string = StringToUnion<S>,
  U extends string = T,
> = U extends U ? `${U}${AllCombinations<S, Exclude<T, U>>}` : never
```

现在这段代码无论传什么都会返回 `never`，因为最后联合类型 `T` 中的所有类型都被删去了，但我们的逻辑是正确的，现在就保持这样。

接下来我们考虑空字符串 `''`，我们可以将 `''`，`'A'`，`'AB'` 这样的结果视作字母与**多个空字符串**传的组合，换言之，**空字符串在排列组合中可以出现多次**。

如何做到呢？如果 `U` 为空字符串 `''`，那么就不从 `T` 中将其删去，将它保留到一下次递归即可：

```ts
type AllCombinations<
  S extends string,
  T extends string = StringToUnion<S>,
  U extends string = T,
> = U extends U ? `${U}${AllCombinations<S, U extends '' ? T : Exclude<T, U>>}` : never
```

最后，我们需要想想怎么让我们的的类型跳出递归。现在，由于空字符串不会被从 `T` 中删去，这段代码会无限递归，而且，我们也无法通过 `T` 来判断是否应当跳出递归。那么我们还能通过什么来判断呢？

我猜你已经想到了，那就是 `S` 的长度。我们可以每次递归从 `S` 中删去一个字符，再在递归前对其进行非空判断即可。

那么我们最终的代码为：

```ts
type StringToUnion<S> = S extends `${infer F}${infer R}` ? F | StringToUnion<R> : S
type AllCombinations<
  S extends string,
  T extends string = StringToUnion<S>,
  U extends string = T,
> = S extends `${infer F}${infer R}`
  ? U extends U
    ? `${U}${AllCombinations<R, U extends '' ? T : Exclude<T, U>>}`
    : never
  : ''
```

我们再来看看另外一种解决方法，来自 Github 上的回答 [4260 - AllCombinations By linjunc](https://github.com/type-challenges/type-challenges/issues/14096)。

记得之前应该也有写过一到全排列的问题，但是这个要难很多

首先我们需要把字符串 `S` 转换成联合类型，这样我们就可以遍历它，再结合上对象转联合类型时的特征实现

1. 首先我们需要实现一个字符串转 `Union` 的方法
   递归字符串即可

```ts
type StrToUnion<S> = S extends `${infer R}${infer U}` ? R | StrToUnion<U> : never
```

2. 利用对象转联合
   我们先看看一个对象转成联合类型是什么样子的

会将 `value` 通过 `|` 连接

```ts
type ObjToUnion<O> = {
  [P in keyof O]: O[P]
}[keyof O]

type B = ObjToUnion<{ a: 1; b: 2; c: 3 }> // type B = 1 | 2 | 3
```

那么我们就可以利用这个特性来处理，也就是这样，我们通过递归的方式，把 `value` 进行排列

```ts
{
  [K in U]: `${K}${AllCombinations<never, Exclude<U, K>>}`
}[U]
```

但是这样得到的是字母间的全排列，我们还需要单个字符，因此需要在递归的时候加上 '' | 即可

因为每次递归时都会经历 `''`、`'A'`、`'AB'`、`'ABC'` 这样逐渐累加字符的过程，而每次都会遇到 `''` `|` 使其自然形成了联合类型

推演：

1. 当输入 `ABC` 时，会通过 `StrToUnion` 转成 `Union` 类型
2. 判断是不是 `never` ，因为递归过程中可能会有 `never` 出现
3. `[K in U]` 取类型中的一个，如 `A`, 递归 `Exclude<U,K>`，也就是 `B`, `C`，这样就从 `ABC` 到了 `BC` 接下来又到 `C` 所有字符都会被考虑

```ts
// 答案
type AllCombinations<S extends string, U extends string = StrToUnion<S>> = [U] extends [never]
  ? ''
  :
      | ''
      | {
          [K in U]: `${K}${AllCombinations<never, Exclude<U, K>>}`
        }[U]
```

</details>

## Greater Than

在这个挑战中，你需要实现一个 `GreaterThan<T, U>` 类型，用来比较大小。比如：$T>U$。

不需要考虑负数。

例子：

```ts
type test1 = GreaterThan<2, 1> // true
type test2 = GreaterThan<1, 1> // false
type test3 = GreaterThan<10, 100> // false
type test4 = GreaterThan<111, 11> // true
```

祝你好运！

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/4425/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type GreaterThan<T extends number, U extends number, S extends 1[] = []> = S['length'] extends T
  ? false
  : S['length'] extends U
  ? true
  : GreaterThan<T, U, [...S, 1]>
```

这段代码很简单了，`S` 是一个累加器，如果 `S` 先满足了 `T`，那么说明 `T` 小于或等于 `U`，此时返回 `false`，否则返回 `true` 。

还有一种思路来自 Github 上的回答 [4425 - Greater Than By linjunc](https://github.com/type-challenges/type-challenges/issues/14098)。

先看看这两段代码：

```ts
type A = [1, 1, 1, 1]
type B = [1, 1, 1]
type IsAGreaterThanB = B extends [...A, ...any] ? false : true // true
```

```ts
type A = [1, 1, 1, 1]
type B = [1, 1, 1, 1]
type IsAGreaterThanB = B extends [...A, ...any] ? false : true // false
```

我想你已经明白了我的意思，先将数字转为数组，再通过数组进行判断即可。

先写一个数字转数组：

```ts
type NumberToArray<T extends number, U extends 1[] = []> = U['length'] extends T
  ? U
  : NumberToArray<T, [...U, 1]>
```

再将上面的 `IsAGreaterThanB` 改成一个类型函数：

```ts
type ArrayGreaterThan<T extends 1[], U extends 1[]> = U extends [...T, ...any] ? false : true
```

最终代码：

```ts
type NumberToArray<T extends number, U extends 1[] = []> = U['length'] extends T
  ? U
  : NumberToArray<T, [...U, 1]>

type ArrayGreaterThan<T extends 1[], U extends 1[]> = U extends [...T, ...any] ? false : true

type GreaterThan<T extends number, U extends number> = ArrayGreaterThan<
  NumberToArray<T>,
  NumberToArray<U>
>
```

</details>

## Zip

你需要实现一个 `Zip<T, U>` 类型，`T` 和 `U` 必须是元组类型。

```ts
type exp = Zip<[1, 2], [true, false]> // [[1, true], [2, false]]
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/4471/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Zip<T extends any[], U extends any[]> = T extends [infer TF, ...infer TR]
  ? U extends [infer UF, ...infer UR]
    ? [[TF, UF], ...Zip<TR, UR>]
    : []
  : []
```

数组递归，看了就懂。

</details>

## IsTuple

实现一个 `IsTuple` 类型，判断 `T` 是否是一个元组。

例子：

```ts
type case1 = IsTuple<[number]> // true
type case2 = IsTuple<readonly [number]> // true
type case3 = IsTuple<number[]> // false
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/4484/play/zh-CN)

<details>
<summary>展开查看答案</summary>

数组和元组的区别在于 `length`，元组会返回具体的数值，而数组返回 `number`。知道了这一点，剩下的就没什么可说的了。

```ts
type IsTuple<T> = [T] extends [never]
  ? false
  : T extends readonly any[]
  ? number extends T['length']
    ? false
    : true
  : false
```

</details>

## Chunk

你知道 `lodash` 吗？ `Chunk` 是其中一个非常有用的功能，现在我们来实现它。` Chunk<T, N>` 接受两个必需的类型参数，`T` 必须是元组，`N` 必须是整数且 $N>=1$。

```ts
type exp1 = Chunk<[1, 2, 3], 2> // [[1, 2], [3]]
type exp2 = Chunk<[1, 2, 3], 4> // [[1, 2, 3]]
type exp3 = Chunk<[1, 2, 3], 1> // [[1], [2], [3]]
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/4499/play/zh-CN)

<details>
<summary>展开查看答案</summary>

数组递归，但是比之前的要难不少。

像这种需要判断递归深度的，肯定需要一个数组参数用来比较。我们就添加一个数组类型参数 `S`，不过，这里 `S` 不单是用于比较，而且要保存当前递归产生的结果片段。另外，我们再添加一个参数 `V`，方便记录最终结果。

```ts
type Chunk<T extends any[], U extends number = 1, S extends any[] = [], V extends any[] = []> = any
```

接着，我们判断 `T` 是否为空，如果不为空直接返回 `V` 就行了。

```ts
type Chunk<
  T extends any[],
  U extends number = 1,
  S extends any[] = [],
  V extends any[] = [],
> = T extends [infer F, ...infer R] ? any : V
```

递归的部分要怎样做呢？其实很简单。每次递归，我们把 `T` 中的第一个元素拿出来，放到 `S` 中，再在每次递归前判断 `S` 的长度是否和 `U` 相等，如果相等，将 `S` 推入 `V` 中并清空，否则继续递归。

```ts
type Chunk<
  T extends any[],
  U extends number = 1,
  S extends any[] = [],
  V extends any[] = [],
> = T extends [infer F, ...infer R]
  ? S['length'] extends U
    ? Chunk<R, U, [F], [...V, S]>
    : Chunk<R, U, [...S, F], V>
  : V
```

不过现在还有问题。因为我们总是在**下一次递归时**判断 `S['length']` 是否和 `U` 相等，那么当 `T` 为空时，`S` 中就会残留未被推入 `V` 中的元素。

另外，如果 `T` 为空，并且 `S` 也为空，说明最开始传入的 `T` 就是一个空数组。

```ts
type Chunk<
  T extends any[],
  U extends number = 1,
  S extends any[] = [],
  V extends any[] = [],
> = T extends [infer F, ...infer R]
  ? S['length'] extends U
    ? Chunk<R, U, [F], [...V, S]>
    : Chunk<R, U, [...S, F], V>
  : S['length'] extends 0
  ? V
  : [...V, S]
```

至此这道题就搞定了。不过我们还有优化的空间，那就是 `V`，我们能不能把 `V` 去掉呢？

当然可以！我们稍作修改：

```ts
type Chunk<T extends any[], U extends number = 1, S extends any[] = []> = T extends [
  infer F,
  ...infer R,
]
  ? S['length'] extends U
    ? [S, ...Chunk<T, U>]
    : Chunk<R, U, [...S, F]>
  : S['length'] extends 0
  ? S
  : [S]
```

`[S, ...Chunk<T, U>]` 这部分变化很大，但它的作用与之前一样，那就是**将 `S` 推入结果，并传递参数继续递归**。如果干看不能理解，那么可以适当推演一下，很快就能明白。

</details>

## Fill

Fill，一个常见的 JavaScript 函数，现在让我们用类型来实现它。`Fill<T, N, Start?, End?>`，可以看到，`Fill` 接受四种类型的参数，其中 `T` 和 `N` 是必填参数，`Start` 和 `End` 是可选参数。这些参数的要求是：`T` 必须是一个元组，`N` 可以是任何类型的值，`Start` 和 `End` 必须是大于等于 0 的整数。

```ts
type exp = Fill<[1, 2, 3], 0> // [0, 0, 0]
```

为了模拟真实的功能，测试中可能会包含一些边界条件，希望大家喜欢:)

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/4518/play/zh-CN)

<details>
<summary>展开查看答案</summary>

为了记录长度和比较，我们添加一个数组类型参数 `U` 和一个标识符 `M`。

- `U` 每次递归会“+1”，然后去比较长度。
- `M` 表示当前的项的次序是否大于 `Start`，如果是，就是 `1`，否则为 `0`。

跳出递归的条件为 `U['length'] extends E`，这时直接返回 `T` 就行。

再看递归体，如果 `M` 已经是 `1`，那么将 `1` 一直传递下去，否则不传取默认值。

```ts
type Fill<
  T extends unknown[],
  N,
  S extends number = 0,
  E extends number = T['length'],
  U extends 1[] = [],
  M extends number = U['length'] extends S ? 1 : 0,
> = U['length'] extends E
  ? T
  : T extends [infer F, ...infer R]
  ? M extends 1
    ? [N, ...Fill<R, N, S, E, [...U, 1], 1>]
    : [F, ...Fill<R, N, S, E, [...U, 1]>]
  : T
```

</details>

## Trim Right

实现 `TrimRight<T>` ，它接收确定的字符串类型并返回一个新的字符串，其中新返回的字符串删除了原字符串结尾的空白字符串。

例如：

```ts
type Trimed = TrimRight<'  Hello World  '> // 应推导出 '  Hello World'
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/4803/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type TrimRight<S extends string> = S extends `${infer F}${' ' | '\n' | '\t'}` ? TrimRight<F> : S
```

</details>

## 去除数组指定元素

实现一个像 `Lodash.without()` 函数一样的泛型 `Without<T, U>`，它接收数组类型的 `T` 和数字或数组类型的 `U` 为参数，会返回一个去除 `U` 中元素的数组 `T`。

例如：

```ts
type Res = Without<[1, 2], 1> // [2]
type Res1 = Without<[1, 2, 4, 1, 5], [1, 2]> // [4, 5]
type Res2 = Without<[2, 3, 2, 3, 2, 3, 2, 3], [2, 3]> // []
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/5117/play/zh-CN)

<details>
<summary>展开查看答案</summary>

没什么好说的，都做到这了。转联合类型然后判断去就行了。

```ts
type ArrayToUnion<T extends any[]> = T extends [infer F, ...infer R] ? F | ArrayToUnion<R> : never
type Without<
  T extends any[],
  U extends number | any[],
  S extends number = U extends any[] ? ArrayToUnion<U> : U,
> = T extends [infer F, ...infer R] ? [...(F extends S ? [] : [F]), ...Without<R, U, S>] : []
```

</details>

## Trunc

实现 `Math.trunc` 的类型版本，它接受字符串或数字，并通过删除任何小数位返回数字的整数部分。

例如：

```ts
type A = Trunc<12.34> // 12
```

[![接受挑战||.left .no-radius 110x30](https://img.shields.io/badge/-%E6%8E%A5%E5%8F%97%E6%8C%91%E6%88%98-3178c6?logo=typescript&logoColor=white)](https://tsch.js.org/5140/play/zh-CN)

<details>
<summary>展开查看答案</summary>

```ts
type Trunc<S extends string | number> = `${S}` extends `${infer F}.${infer R}` ? F : `${S}`
```

</details>
