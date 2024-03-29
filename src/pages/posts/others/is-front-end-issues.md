---
layout: '@/layouts/Post.astro'
title: 前端进度不理想，线上 bug 源源不断，是否存在前端问题
abstract: 前端进度不理想，线上bug源源不断；程序代码堆成了屎山，引起了问题新花样不断。
author:
  name: 逐步前行
  link: https://juejin.cn/user/4195392104696519
image: /images/is-front-end-issues.webp
createdAt: '2022-07-06 09:00'
updatedAt: '2022-07-26 09:00'
category: 杂篇
tags:
  - 杂篇
  - 转载
reprint:
  description: 掘金
  link: https://juejin.cn/post/7117059077561122846
---

## 前言

前端进度不理想，线上 bug 源源不断；程序代码堆成了屎山，引起了问题新花样不断。

**问题的根源在哪里？**

所谓的复盘大会，能得到的答案基本就这几个：**场景太复杂**；**工作太忙碌**；**需求变化太快**。

还有一种说法，**每一座前端的屎山，都离不开身后"优秀的"产品经理。**

的确，这的确都是前端痛点，也属于前端领域不可以避免的问题：

- 如场景的复杂化

很多场景，特别是游戏行业，复杂度与难度，可以说已经超过了后端，也许一个简单的增删改查，对前端来说可能要考虑数十种动画，交互，展现，效果等场景。

- 再如忙碌的工作状态

互联网人都知道的加班加点。能到家吃个晚饭的工作，某种意义上已经很奢侈。

- 再如“话事人”的善变

前端就是这么尴尬的一个角色，需要将自己暴露在界面上，却没有话事权。这玩意随便抓个人，都能提出一点意见。设计师肯定有自己的主见；产品经理可以提一些意见；项目经理可以有一些意见；后端也可以提一点意见；行业竞争对手，也会给你一些参考；从来不参与互联网的的老板，客户也可以提一些意见...

更可怕的是，他们都是“对”的，且说话比前端有“分量”。

---

再继续下去，所谓的**复盘大会**，最终只会演化成**吐槽大会**，或是**皮球大会**。

然而，雪崩的时候，没有一片雪花是无辜。

细想，笔者还是在过往的合作，或者是他人的吐槽，或是社区中，还是 Get 到一些团队存在的一些前端问题。

他们始终觉得自己**没有任何问题**，继续保持着自己的"**做事风格**"，与"**编码习惯**"。文章以该人员的**视角**看待问题。

## (一）做事风格

### 1）团队之间的包容

团队人员之间要保持良好的友谊，应该学会包容。

- 让后端提供对应的枚举或变量，来达成项目数据源的一致。然而这需要沟通，需要等待，需要联调，同时还烦躁到对方，亏本买卖。此时，考虑到团队之间包容，直接写死在前端，更快速的完成了任务。
- 说服产品一个统一的交互的时间，比完成当前想要的交互的时间高。于是，想起了团队之间需要包容，怎么和谐怎么处理。

即保证了任务的完成，也和谐了整个团队，Nice!

### 2）打造优秀的独立人格

团队规范？技术方案？

当讨论话题的时候，保持沉默是金的精神。实现时，那才是个人独立人格的体现，随时替换上自身“最优秀”的解决方案。

- 当团队发现代码跟定义规范不一致，再跟你解释，这是某企业的标准，可比我们团队的定义的专业。
- 直接使用自己想用的方案，跟讨论的方案不一样也没关系。等你问起来，再跟你解释，新方案的多好的优势。

### 3）技术的追求与渴望

社区出现了什么技术，你关注了吗？我可是先行者。我不仅学习了，还实践到项目中。

- 先不用关注后续会不会出现兼容性等问题。都至少都能兼容 98%以上，出问题再说。如果万一真遇到不兼容，到时候让他们自己换浏览器，换手机或者电脑就行。我会告诉他们，我这边没问题。
- 无需关心团队其他人员是否能看懂。看不懂，说明他们不好学，是他们落后，我可是奔跑在前面的佼佼者。

### 4）保障自我的开发质量

分享曾经遇到的部分“优秀”员工，保障自我质量的的小技巧：

- 合并或者提交代码冲突时，保障自己的代码质量，选择自身的代码就对了，我的模块肯定没问题。
- 需要封装一些方法时，发现有存在少部分差异的公用方法。这么巧，稍微修改成自己的，无需考虑其他人员之前的使用的情况。
- 公用样式上，想让我同时修改几个页面。直接全局标签样式走起。

### 5）相信自己的直觉

相信自己的直觉，再去检查多看一遍，简直是对自己技术的一种侮辱。

- 面对系统捕获到，告知已知的错误。收到反馈后，告诉他们，不可能，绝对不可能。这是对自己基本的信任。
- 作为切图仔的我们，第一直觉，这肯定是后端问题。（虽然笔者的经常这么觉得，但还是会去验证一下，找找证据，没有肯定是他人问题的自信）

### 6）解决方案的简单化

是的，程序员的最高境界，就是用最简单的语法，把最复杂的问题给解决了。

有人正是将该原则，发挥得淋漓尽致。

- 这好像是我组件的业务代码？没关系，我写在全局更简单，代码可以简单很多，全局走起来。
- 巧用全局变量。当前业务，变量是否写在当前页面不方便呢，也许组件多了传递不方便。直接存全局 vuex，localstorage，sessionstorage 等等，不就提高了简单的途径么？
- 需要用到某个组件库的一个组件？一个一个引入多麻烦。直接全部引入，是不是效率高多了。

### 7）自我价值体现

- 自己写的代码别人看不懂？那不正是那人水平的问题，深度怀疑别人的水平。我就能看懂，不就证明自我的价值。
- 十万火急拯救世界，单骑当上救世主。问题先不用过多检查，到时候上线有问题，那不正是我单骑拯救世界的机会。这样做事，后续上线后，项目经理，产品跟测试，都要围着你这位核心开发人员的位置绕一圈。那正是想要的，最核心的位置。

### 8）性价比提升

大部分程序员的薪资结构，都是固定模式，不像销售岗等，需要根据一些业绩来评估。

既然一时半会，提高不了自己的待遇。我可以少做事情呀，方案难点都给别人来想，代码杂活推给别人来干，这样自己的性价比就提高了。

突然觉得自己真是太机智了！

### 9）打造更专业的私人工具库

一个项目大了，公用方法的确少不了，而且很多时候，如何同步给其他协助伙伴，也是个大问题。

一个优秀的想法由此而生，打造自己模块的私人工具库！

你们封装你们的，我封装我的。看淡公用工具的起起落落，也无需饱受工具的影响，不如做打造一个与世无争的私有库。

### 10）快速良好的代码封装

良好的代码封装，对程序的帮助，相信大家都有目共睹。

不知你们有没有遇过，一个项目有 10 来个公用的 upload 组件?虽然功能都差不多，但总有一点差异的嘛。

是的，快速封装原则，直接拷贝一个修改成自己想要的 upload。还不对其他产生影响，可以称为程序界一个"快准狠"的骚操作。

### 11）追求自由

代码规范？那不正是一种约束，不存在的。 公用封装？那不是也是一种限制。

我们都需要一些自由。

### 12）追求与时俱进

前端近年来，的确高速的发展状态。每时每刻都有可能发生变化。

然而，部分优秀员工，与借助了这个思路。这里就不单单赞扬前端了。产品，UI 也包含一起吧。

- 产品篇：你们在开发过程中对吧？我们的需求也一边在调整中哦。
- 设计篇：样式写好了吗？感觉这个有点美中不足，我们会出个新版哦。
- 后端篇：集成好逻辑了吗？我们的数据结构需要变化一下，逻辑也需要调整一下。
- 前端篇：快提测了吗？我们的方案好像不太对，我要换一个技术方案哦。

## (二）编码习惯

### 1）有序的命名

是的，没错，就是有序的命名。有序就是个褒义词，有顺序，说明调序清晰。

- 是否有多个不同的打开的方法？顺序走起来，`open1()`, `open2()`,...`openN()`。次序说明我们是有原则的人。
- 遇到太多标签层级分左右？这可要好好安排一番。`.left-left-left-left-left-right`，让你直观看出有第几级。

### 2）嵌套 if 美感

`if` 与 `else` 算是每个语言都会用到的基础语法，需好好重视。

多嵌套几层 `if`，算是上 `if` 的传承发扬发扬光大。

### 3）多目运算符

三目运算符，存在的意义是更精简的语法直观的表达该项的判断关系。

但后续社区发现一个判断无法满足，可能会出现 3，4 个情况，于是三目为了满足，变成了“多目”。

部分优秀的程序员，善于使用“多目”，十来目，不正是艺术的体现。

### 4）巧用调试信息

调试已经是程序员必不可少的一个环节。笔者也会加上一些调试，方便有问题的时，快速的定位。

笔者个人的习惯，是会在前面加多一个独立标识，尽量让这个标识能快速搜索到位置：`console.log('name===', name);`

而有些程序员，更加巧用打印了。

- 换个顺序，`console.log(name，'name')`。到时候觉得其他人觉得影响他的调试，简单，到时候他可以写个正则就可以匹配到。
- 直接使用，`console.log(name)`。这个没关系，其他人员需要关闭，好好跟踪你的代码，总能找到输出的地方。

### 5）底层样式 style

深入程序的小伙伴都知道，程序员的级别，不在表面的花里胡哨，而在与底层的抒写。

所以，样式上我直接用起底层的 `style`。无需 `class`，直接 `style` 撸起来更能体现自我能力上的资深。

如果 class 有问题？我手写肯定会写一个有魔法性质的 `!important`！

### 6）弘扬汉语文化

当前，业界无论变量还是方法，都统一使用了英文。

笔者也是英文烂得一坨屎，有些不常用的词汇，只能依赖“翻译”，有些也会出现拼错。

但高端的玩家，总有自己更优雅的方案，中文拼音用起来！

### 7）更加精简的变量

是否遇到拼过复杂的英文命名？是的，太复杂也许自己都记不住。所以是不是应该使用缩写？`pName`，`cValue`，是不是更精简。

### 8）优雅的注释

这里就不讨论没有注释的问题，这个有些命名，如果部门统一，我个人觉得规范范围内，可以不写。

这里只讨论优雅的注释：笔者遇到过比较优雅的注释，类似“第 1 版本”打上了正确的注释，待这里的业务更新到“第 3 版本”时，注释还是“第 1 版本”的。

然后，这些注释，会指引你走向一个作废的逻辑。

### 9）保证页面的完整

见过 2000 行以上的一个完整的 vue 页面么？没错，业务太复杂了。

但我们的原则不能变，我们要保证一个页面，一个 vue 文件的维度，不可切割。

### 10）多层传递

好的，上述赞扬了坚持“一个页面，一个 vue 文件的”人员，还有部分优秀人员，喜欢子子子子组件的人员。

父子组件多传参，尽可能多层传递。子给父，父再给子子子子，每个操作都似乎在告诉别人，不同组件之间是离不开的“一家人”。

### 11）一个函数只做一件事情

首先，这句话，笔者非常的赞同，程序中，的确一个函数，需要代表一件事情。

然后，这个“事情”的维度的，标准还是很大差异的。

你信不信我，10 行代码能分出 3 个函数？虽然他们都不会重复使用，但这样让函数做的事情，更“精确”。

### 12）一个函数处理好万事

什么“一个函数只做一件事情”, 部分一个函数就可以处理很多事情。

特别是通过命名已经直白的告诉你需要做什么的。

举个栗子，`checkPermission`，你可能觉得他只是检查权限。错了，他还同时修改了价格，你想不到吧。

---

## 结语

花了不少时间，还有其他小技巧，如使用页面级 mixin，无需模块化与复用等。想想这玩意儿写不完，有兴趣的小伙伴，自己到评论区补充吧。
