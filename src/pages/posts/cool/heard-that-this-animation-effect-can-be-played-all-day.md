---
layout: '@/layouts/Post.astro'
title: 🤔听说这个动效可以玩一天？
abstract: 闲来无事左手冰棍右手抖音消磨时间，突然一条内容文案为这个丝滑的UI交互我能玩一天的一个前端动效映入眼帘。嗯？什么交互动效能玩一天，让我瞧瞧...嗷~这不就那啥嘛，先如此如此......再这般这般......不就行了？
author:
  name: Urias
  link: https://juejin.cn/user/2410576811924808
image: https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25ec67dd9bef4852b418bb83f7f101d7~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?
createdAt: '2022-08-10 15:56'
updatedAt: '2022-08-10 17:06'
category: cool
tags:
  - 花里胡哨
  - CSS
  - 动画
reprint:
  description: 掘金
  link: https://juejin.cn/post/7129788202335862791
---

> 岁华过半休惆怅，且对西风贺立秋。 ——范成大·立秋二绝

杭州的天儿是怎么个事儿啊这些天，热了一个夏天也就算了，上周天秋都立了，雨也下了，老话说的都是秋高气爽，怎么温度还上去了呢！！

🥵 看看近日温度

<p><img class="img-center" width="300" src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66e6665c170945c0945e254bd69623dc~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?" alt="温度" loading="lazy" /></p>

这种天气的周末，在下也只能躺在床上吹着空调，然后赞叹一下外卖小哥的艰辛，顺便照顾一下他们的生意了。

......

闲来无事左手冰棍右手抖音消磨时间，突然一条内容文案为 `这个丝滑的UI交互我能玩一天` 的一个前端动效映入眼帘。

嗯？什么交互动效能玩一天，让我瞧瞧 👀：

<p><img class="img-center" width="300" src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05bbd49805884ac0ac1389c589dca7e7~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?" alt="动效"  loading="lazy" /></p>

嗷~这不就那啥嘛，先如此如此......再这般这般......不就行了？

习惯性的点开评论区，果然，大家都非常的热情呢，主动给设计者料理后事......

<p><img class="img-center" width="620" src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb3446205e2647778af931cfdd619c9f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?" alt="评论"  loading="lazy" /></p>

这样一个丝滑的交互能不能玩一天，在下不知道。

但是，把他写出来，在下能写一天，而这，就叫做**工作量**，而在下最喜欢的就是**增加(凑)工作量**🤫。

## 万事开头难

这一个动效乍一看好像其实并没有觉得很复杂，但是如果往细了看（多细？）

......

好像其实也没有很复杂。

先聊聊**思路**：（_仅供参考，总所周知，黑猫白猫都是好猫，能实现就行，不拘泥与在下这一种方法_）

1. 首先看**静态**的东西，我们可以把这个动效拆成 `容器`，`按钮` 和 `滑块` 三个部分，包含各类样式；
2. **容器**在被点击时需要添加 `css透视` 和一定幅度的 `Y轴旋转`，构造成被点击下陷的感觉，仔细观察发现不同按钮点击后两侧容器旋转的偏移量还不尽相同，所以我们还需要动态修改他的 `原点`；
3. **按钮**则是包含相关内容的一个盒子，有选中和未选中的两种不同状态，再仔细点呢，盒子内的内容在切换状态时还有一定量的缩放 `scale`，缩放详细为：

   - 被选中时，先稍微多放大一些，再缩小为选中的放大状态保持；
   - 未选中时，先稍微多缩小一些，再放大为未选中的正常状态保持；

4. **滑块**就比较简单了，单纯的静态样式加上点以后滑动到对应按钮下方，稍微麻烦一点就是这个点击后的过渡效果（滑动）需要起始和结尾稍慢，中间较快的速度，可能需要用贝塞尔函数来实现，对于 `css贝塞尔函数` 已经遗忘的同学可以再去温习一遍。👉[cubic-bezier](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function#cubic-bezier_examples)👈

多说无益，在下先干为敬！

## 静态页面

首先当然是我们的静态页面了，动效再怎么动，也得先有能动的玩意儿是波。

### 容器

咱们先随便点，先画个容器，起个名儿就叫 `btnWrapper` 吧，因为滑块用绝对定位，所以容器得先相对定位，同时给定宽高：

```html
<div id="btnWrapper"></div>
```

```css
#btnWrapper {
  position: relative;
  width: 380px;
  height: 80px;
  padding: 12px 16px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #e2e6eb;
  box-shadow: -10px -10px 15px #f5f9fd, 10px 10px 15px #d8dbe5; /* 阴影（阴影可以添加多条，别告诉我你不知道！！） */
}
```

就这样一个简单的容器盒子就画好了（别问我没有设计图颜色和尺寸都是怎么来的，截图+取色吸的 🙄）

<p><img class="img-center" width="620" src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c03e1a1ffd6d450296806657326f78b2~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?" alt="容器"  loading="lazy" /></p>

### 滑块

然后就是滑块，因为滑块并没有复杂的逻辑，也不需要存放一些其他元素，所以在下选择的是用 `伪元素` 来实现，这就没有结构（html）代码了。

尺寸**图解**：

<p><img class="img-center" width="620" src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/399bae1d2e61436c84d96e038747a082~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?" alt="尺寸图解"  loading="lazy" /></p>

直接**上才艺**~

```css
#btnWrapper::before {
  content: '';
  position: absolute;
  left: 16px; /* 要考虑到父盒子的内边距 */
  top: 12px;
  width: calc(50% - 16px - 8px);
  height: calc(100% - 24px);
  border-radius: 12px;
  box-shadow: inset 8px 8px 6px #d9dce6, inset -5px -5px 15px #f5f9fd, inset -5px -5px 15px #f5f9fd,
    inset 7px 7px 6px #d9dce6;
}
```

emmm....吸色好像不太靠谱？勉勉强强吧 🙄

<p><img class="img-center" width="620" src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b67f3764e5146d5b265d547c5b9ad21~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?" alt="容器+滑块"  loading="lazy" /></p>

### 按钮

按钮呢因为他本身没有轮廓样式，所以我是直接把它理解为**均分了容器的两个透明盒子**，然后内部元素不确定，用**弹性布局**让按钮的子元素都居中就行。

但是因为按钮要跟滑块重叠，并且居于滑块之上，所以按钮也需要**浮动**起来，每个都占 50%宽度，这里在下选择让他俩都`float: left;`，如果还想继续使用绝对定位也是可以实现的，配置不同`left`即可，这里就不再赘述了。

同时按钮还有选中状态，

```html
<div id="btnWrapper">
  <div class="btn active">按钮1</div>
  <div class="btn">按钮2</div>
</div>
```

```css
.btn {
  float: left;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  padding: inherit; /* 偷懒内边距继承了父元素，也可以自己修改 */
  color: #aaa;
  cursor: pointer;
}
.active {
  color: #111;
}
```

最终的成品就是

<p><img class="img-center" width="620" src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6eba6b244706444ebf837f3669fbd16c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?" alt="静态内容"  loading="lazy" /></p>

嘿你别说，还挺有模有样呢？如果想再给按钮里添加类似抖音里那个图片，也是可以的，在下就不写了哈。

## 滑块动效

静态页面倒是写完了，但这并不是在下的目标，在下的目标是希望它动起来，如标题一样**玩一整天的丝滑**😤😤。

而效果图中在下一眼看见动幅最大的就是这个滑块了，所以决定先让滑块动起来，其实让滑块动起来非常简单，修改滑块的 `left` 值即可，再添加过渡效果让滑块更加**丝滑**~

这里动态修改样式，我选择使用 `css变量`，通过 `js` 给容器添加和修改 `css变量` 来达到动态修改样式的效果。

🎠\*\*来吧，展示！\*\*🎠

```css
#btnWrapper::before {
  content: '';
  /*  ...其他属性 */
  left: var(--groove-left);
  /*  ...其他属性 */
  transition: left 1s cubic-bezier(0.82, 0.12, 0.18, 0.88); /* 过渡效果 */
}
```

```js
// 获取容器元素
let wrapper = document.getElementById('btnWrapper')
// 先给容器设置一个 css 变量并附初始值
wrapper.style.setProperty('--groove-left', '12px')
// 获取按钮元素
let btns = document.getElementsByClassName('btn')
for (let i = 0; i < btns.length; i++) {
  // 给每个按钮添加点击事件
  btns[i].addEventListener('click', function (e) {
    // 点击后，修改 css 变量的值
    wrapper.style.setProperty('--groove-left', `calc(12px + ${i * 50}%)`)
  })
}
```

> 放心，经过在下严（随）密（便）计算，那个贝塞尔曲线应该差不太多，如有偏差还请自行调整，留言给在下，毕竟咱没有真实设计图...

这样点击后，滑块就会自己滑来滑去啦！

<p><img class="img-center" width="620" src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f632954eb7e74cbaa832f2acdd3fae5b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?" alt="滑块"  loading="lazy" /></p>

## 按钮动效

👀 那，滑块都自己动起来了，你按钮不得自己动？

👀 自己动？

👀 动？

懂了！直接在点击里修改每个按钮的类名不就行了？

没错，但是如前面[万事开头难](#万事开头难)在下提到的，按钮不单纯只是改变了颜色，还改变了字体的缩放大小，并且选中非选中状态都有一个缩放的**抖动**。

所以在下决定，写两个动画（**具体可以根据自己的感觉修改，只是在下的感觉就到这了**）。

**talk is cheap，show me the code！**（在下想起来了！）

```html
<div id="btnWrapper">
  <div class="btn active">按钮1</div>
  <div class="btn">按钮2</div>
</div>
```

```css
/*  按钮选中缩放动画 */
@keyframes txtEnterScale {
  0% {
    transform: scale(1);
  }

  80% {
    transform: scale(1.15);
  }

  100% {
    transform: scale(1.1);
  }
}
/*  按钮未选中缩放动画 */
@keyframes txtOutScale {
  0% {
    transform: scale(1.1);
  }

  80% {
    transform: scale(0.95);
  }

  100% {
    transform: scale(1);
  }
}
.btn {
  /*  ...其他属性 */
  transition: color 0.4s linear; /* 添加文字颜色过渡效果 */
  animation: txtOutScale 0.6s linear; /* 添加按钮未选中动画，注意时间 */
  /*  ...其他属性 */
}
.active {
  color: #111;
  transform: scale(1.1); /* 修改选中状态原始缩放为 1.1 */
  animation: txtEnterScale 0.4s linear; /* 添加按钮选中动画，注意时间 */
}
```

```js
let wrapper = document.getElementById('btnWrapper')
wrapper.style.setProperty('--groove-left', '12px')
let btns = document.getElementsByClassName('btn')
for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener('click', function (e) {
    wrapper.style.setProperty('--groove-left', `calc(12px + ${i * 50}%)`)
    resetBtn(btns) // 初始化所有按钮类名
    setTimeout(() => {
      btns[i].className = 'btn active' // 给被点击的按钮添加选中样式，注意不要丢了原始样式
    }, 500)
  })
}
// 初始化所有按钮类名的方法
function resetBtn(btns) {
  for (let i = 0; i < btns.length; i++) {
    setTimeout(() => {
      btns[i].className = 'btn'
    }, 100)
  }
}
```

> 先别划走！！！这里讲一下为什么需要注意时间，因为在下注意到，并不是一经点击按钮的动画就开始了，选中状态的类名，是在滑块几乎完全滑到对应按钮背后，按钮的缩放状态和颜色才开始变化，同理未选中状态也类似，只是时间稍微提早。
>
> 哼哼，一个小细节 🧐🧐。
>
> 所以在下的处理方式是在点击后给添加类名的代码添加一个定时器，有无更好的方法麻烦告知在下。

文字的缩放和在下的小细节，能看出来吗？

<p><img class="img-center" width="620" src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8814d89ca6134a95929f08aa25478e1b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?" alt="按钮.gif"  loading="lazy" /></p>

## 容器动效

又凑了这么多字了 🤪，工作量嘎嘎上去了......

哎哎哎客官别着急走哇，咱这还有个最大的容器还没动起来呢，错了错了，在下直接来。

### 整体容器

顺着在下前面的思路，首先先给他添加上 `css透视` 和 `Y轴旋转`，然后咱们先看看效果如何，为了做出近大远小的视觉效果，咱们首先要给容器的**父元素**添加透视点，为了不耽搁客官老爷们的时间，不懂概念的同学就劳烦百度一下或者直接传送门先了解一番。👉[perspective](https://developer.mozilla.org/zh-CN/docs/Web/CSS/perspective)👈

```css
body {
  perspective: 500px; /* 添加透视 */
}

#btnWrapper {
  /*  ...其他属性 */
  transform-origin: center; /* 添加转换原点 */
  transition: transform 0.4s cubic-bezier(0, 0, 0.48, 1); /* 添加过渡效果 */
}

.rotateWrap {
  transform: rotateY(var(--wraper-rotate)); /* 添加 Y 轴旋转 */
}
```

```js
let wrapper = document.getElementById('btnWrapper')
// ...其他代码
let btns = document.getElementsByClassName('btn')
for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener('click', function (e) {
    // ...其他代码
    wrapper.style.setProperty('--wraper-rotate', `${i === 0 ? -8 : 8}deg`)
    wrapper.className = 'rotateWrap'
    setTimeout(() => {
      wrapper.className = ''
    }, 550) // 注意小细节！！！
  })
}
// ...其他代码
```

> 同样，这个被点击后的动效也有亿点点小细节，就是这个时间，在下不便多说
>
> 寄几零五八，骚年！

<p><img class="img-center" width="620" src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9cc26bed56904bd99c39d578df2c51e5~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?" alt="容器.gif"  loading="lazy" /></p>

## 亿点细节

看了**目前成品图**，是不是感觉跟上面那个**玩一天丝滑**的按钮大差不差，但是总感觉哪里有点不一样呢？

没错，在下也看出来，感觉人家那个非常的灵活，而在下这个就像被钉住了一样。

没戳！！就是这个 `Y轴旋转` 量的问题，在下前面也提到了，解决方法就是需要动态修改 `css转换` 的原点。

> 当点击 `按钮1` 时，将原点设置为 `按钮2` 半侧的某个点，反之亦然

**嗦干酒干**，这里在下用到的还是 `css变量` 的方法

```css
#btnWrapper {
  /*  ...其他属性 */
  /*  transform-origin: center; */
  transform-origin: var(--wraper-origin); /* 修改为动态使用 css 变量 */
  transition: transform 0.4s cubic-bezier(0, 0, 0.48, 1);
}
```

```js
let wrapper = document.getElementById('btnWrapper')
// ...其他代码
let btns = document.getElementsByClassName('btn')
for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener('click', function (e) {
    // ...其他代码
    wrapper.style.setProperty('--wraper-origin', `${i === 0 ? '80% top' : '20% top'}`) // 动态修改原点位置
    wrapper.style.setProperty('--wraper-rotate', `${i === 0 ? -8 : 8}deg`) // 按钮 1 为-8°，按钮 2 为 8°
    wrapper.className = 'rotateWrap' // 点击添加类名
    setTimeout(() => {
      wrapper.className = '' // 清除类名
    }, 550) // 注意小细节！！！
  })
}
// ...其他代码
```

好！这样在下通过肉眼观察然后还原的**丝玩天**动效就做好啦，先喽一眼**最终成品图**：

<p><img class="img-center" width="620" src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6038be5a78ad416e80ccf50fe9ee5992~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?" alt="最终.gif"  loading="lazy" /></p>

什么？你说好像没啥区别？🤨

相信在下，一定有区别的，记住今天的关键词，**仔细 😑**。

---

## 意犹未尽

本来捏，今天的水文到这就结束了

但是，在下在玩这个动效的时候，感觉两个按钮单纯的切换来切换去，是不是太过于单调了？（主要是工作量还没混够）

于是，在下准备给这两个按钮加点功能。

直接展示，贴代码（**有点长，但是是全部的代码**）：

```html
<div id="btnWrapper">
  <div class="btn active">开灯</div>
  <div class="btn">关灯</div>
</div>
```

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background-color: #edf1f4;
  perspective: 500px;
  --c-wrap-shadow1: #f5f9fd;
  --c-wrap-shadow2: #d8dbe5;
  --c-wrap-bg: #e2e6eb;
  --c-btn-shadow1: #d9dbe6;
  --c-btn-shadow2: #f5f9fd;
  --c-txt1: #aaa;
  --c-txt2: #111;
  transition: background-color 0.4s linear;
}
.dark {
  background-color: #333;
  --c-wrap-shadow1: #292929;
  --c-wrap-shadow2: #202020;
  --c-wrap-bg: #505050;
  --c-btn-shadow1: #323232;
  --c-btn-shadow2: #444;
  --c-txt1: #888;
  --c-txt2: #fff;
}
#btnWrapper {
  position: relative;
  width: 380px;
  height: 80px;
  padding: 12px 16px;
  margin: 300px auto 0;
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--c-wrap-bg);
  box-shadow: -10px -10px 15px var(--c-wrap-shadow1), 10px 10px 15px var(--c-wrap-shadow2);
  transform-origin: var(--wraper-origin);
  transition: transform 0.4s cubic-bezier(0, 0, 0.48, 1), box-shadow 0.4s linear,
    background-color 0.4s linear;
}
.rotateWrap {
  transform: rotateY(var(--wraper-rotate));
}
#btnWrapper::before {
  content: '';
  position: absolute;
  left: var(--groove-left);
  top: 12px;
  width: calc(50% - 16px - 8px);
  height: calc(100% - 24px);
  border-radius: 12px;
  box-shadow: inset 8px 8px 6px var(--c-btn-shadow1), inset -5px -5px 15px var(--c-btn-shadow2),
    inset -5px -5px 15px var(--c-btn-shadow2), inset 7px 7px 6px var(--c-btn-shadow1);
  transition: left 1s cubic-bezier(0.82, 0.12, 0.18, 0.88), box-shadow 0.4s linear;
}
.btn {
  float: left;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  padding: inherit;
  color: var(--c-txt1);
  transition: color 0.4s linear;
  animation: txtOutScale 0.6s linear;
  cursor: pointer;
}
.active {
  color: var(--c-txt2);
  transform: scale(1.1);
  animation: txtEnterScale 0.4s linear;
}
@keyframes txtEnterScale {
  0% {
    transform: scale(1);
  }

  80% {
    transform: scale(1.15);
  }

  100% {
    transform: scale(1.1);
  }
}
@keyframes txtOutScale {
  0% {
    transform: scale(1.1);
  }

  80% {
    transform: scale(0.95);
  }

  100% {
    transform: scale(1);
  }
}
```

```js
let wrapper = document.getElementById('btnWrapper')
wrapper.style.setProperty('--groove-left', '12px')
let btns = document.getElementsByClassName('btn')
for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener('click', function (e) {
    ThemeChange(i === 1)
    resetBtn(btns)
    wrapper.style.setProperty('--groove-left', `calc(12px + ${i * 50}%)`)
    wrapper.style.setProperty('--wraper-origin', `${i === 0 ? '75% top' : '25% top'}`)
    wrapper.style.setProperty('--wraper-rotate', `${i === 0 ? -8 : 8}deg`)
    wrapper.className = 'rotateWrap'
    setTimeout(() => {
      btns[i].className = 'btn active'
    }, 500)
    setTimeout(() => {
      wrapper.className = ''
    }, 550)
  })
}
// 重置按钮类名
function resetBtn(btns) {
  for (let i = 0; i < btns.length; i++) {
    setTimeout(() => {
      btns[i].className = 'btn'
    }, 100)
  }
}
// 改变主题
function ThemeChange(bol) {
  let body = document.body
  body.className = bol ? 'dark' : ''
}
```

🎉🎉 抑扬顿挫，欲扬先抑，先看成果，再谈原理 🎉🎉：

<p><img class="img-center" width="100%" src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8fa41c2989934cc1883952164c2b6a41~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?" alt="最终最终版本.gif"  loading="lazy" /></p>

> 其实就是字面意思，混工作量。
>
> 切换主题思路：
>
> 把需要切换的颜色都提出来用 css 变量代替，并添加上过渡效果（不然看起来很突兀）
>
> 在不同主题类名里修改 css 变量
>
> 点击按钮，将类名添加到 body 上（有的也添加到 html 上，反正就是添加到你使用主题的最上层元素）
>
> 因为给 body 添加了类名权重更高，所以会覆盖 body 以元素名定义的 css 变量，经过 css 过渡以后，就实现了丝滑的换肤效果。

今天混工作量就到此为止吧，再混就不礼貌了~

<p><img class="img-center" width="400" src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6dd3ca20336e4e50ba42cc50bb1d25ab~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?" alt="image.png"  loading="lazy" /></p>

秋都立完了，劳烦秋天赶紧到来吧，我要出去玩！！！

🤨🤨🤨 你怎么还在看？

## 博主注

1. 滑块动画可以使用 `transform: translateX()` 来代替 `left` 避免回流。
2. 可以使用 `animation-delay` 代替定时器来实现按钮动画的延迟。
3. 可以通过监听 `transitionend` 代替定时器来实现容器动画结束后回复到原本样式的效果。
