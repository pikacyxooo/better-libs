# 屏幕强制横竖屏组件

##### 使用简单配置做强制横竖屏

##### Install 安装

```bash
npm install @better-libs/screen-adapter -S
yarn add @better-libs/screen-adapter -S
```

```js
import ScreenAdapter from '@better-libs/screen-adapter';

new ScreenAdapter({
  wrapper: '#app',
  direction: 'horizontal',
  mode: 'fill',
});
```

##### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@better-libs/screen-adapter@latest/dist/screen-adapter.js">
<!-- 或者 -->
<script src="https://cdn.jsdelivr.net/npm/@better-libs/screen-adapter@latest/dist/screen-adapter.min.js">
```

```js
new ScreenAdapter({
  wrapper: '#app',
  direction: 'horizontal',
  mode: 'fill',
});
```

### 配置

ScreenAdapter 可以在初始化时传入一个 options,比如

```js
import ScreenAdapter from '@better-libs/screen-adapter';

new ScreenAdapter({
  wrapper: '#app',
  direction: 'horizontal',
  mode: 'fill',
});
```

> tips:
> 支持移动端使用，并且在使用时需要加上 meta 标签

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

下面列举 ScreenAdapter 支持的参数

#### wrapper

- **是否必传**: true
- **类型**: string
- **说明**: wrapper 为指定强制横竖屏的容器

#### direction

- **是否必传**: false
- **类型**: string
- **默认**: vertical
- **可选值**: vertical | horizontal
- **说明**: 当指定 direction 为 vertical 时，则 wrapper 容器为强制横屏；
  当指定 direction 为 horizontal 时，则 wrapper 容器为强制竖屏。

#### mode

- **是否必传**: false
- **类型**: string
- **默认**: fill
- **可选值**: fill | width | height
- **说明**: 当不设置 width 和 height 时，该属性无效。fill 时为容器宽度和容器高度撑满屏幕宽高；width 为容器宽度撑满屏幕宽度，容器高度这自适应；height 为容器高度撑满屏幕高度，宽度自适应。

#### width

- **是否必传**: false
- **类型**: number
- **默认**: 当 direction 为 vertical 时为屏幕长边，相反则为屏幕短边
- **说明**: 设置 wrapper 容器宽度

#### height

- **是否必传**: false
- **类型**: number
- **默认**: 当 direction 为 vertical 时为屏幕短边，相反则为屏幕长边
- **说明**: 设置 wrapper 容器高度
