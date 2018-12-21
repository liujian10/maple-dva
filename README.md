# maple-dva

## dva简介

* 数据流向

![dva](https://camo.githubusercontent.com/c826ff066ed438e2689154e81ff5961ab0b9befe/68747470733a2f2f7a6f732e616c697061796f626a656374732e636f6d2f726d73706f7274616c2f505072657245414b62496f445a59722e706e67)

* 归纳如下

1. 轻量级的应用框架，集成了redux、redux-saga、react-router-redux、react-router
2. 易学易用，仅有 6 个 [api](https://dvajs.com/api/)
3. 简化开发，将initState、saga、reducer集成到一个model里面统一管理，便于快速查找与开发
4. 插件机制，比如：[dva-loading](https://github.com/dvajs/dva/tree/master/packages/dva-loading) 可以自动处理 loading 状态【官方的好像就两】
5. roadhog，配套的开发工具，简单的配置就可以实现项目的初始化【其实不好用>.<】

## 项目实践

### Installation

```bash
$ git clone http://172.16.117.224/liujian02/maple-dva.git
$ yarn
$ yarn start
```

已经跑起来了，下面是 yarn 命令~

|`yarn <script>`    |描述|
|-------------------|-----------|
|`start`            |启动项目|
|`build`            |构建项目到 ./dist|
|`lint`             |eslint|
|`fixeslint`        |eslint + 自动 fixes|
|...|

### 目录结构

```
.
├── mock                     # mock数据
├── public                   # 公共文件
├── src                      # 源码代码
│   ├── assets               # 静态资源
│   ├── common               # 公共文件
│   │   ├── actionEffect.js  # action生成effect
│   │   ├── config.js        # 全局配置
│   │   ├── container.js     # container修饰器
│   │   ├── request.js       # 封装数据请求
│   │   ├── router.js        # 路由配置
│   │   └── util             # 工具方法
│   ├── components           # 组件
│   ├── containers           # 页面容器
│   ├── models               # model
│   │   └── products         # model/products
│   │       ├── actions.js   # 分拆model的action
│   │       ├── effects      # 分拆model的effect
│   │       ├── model        # model文件
│   │       └── reduces      # 分拆model的reduce
│   ├── styles               # 样式文件
│   │   └── global           # 全局样式
│   ├── index.js             # 项目入口文件
│   └── router               # 路由
├── .webpackrc.js            # roadhog配置
├── webpack.config.js        # webpack配置
├── build.sh                 # 项目部署文件
└── ...
```

### index.js
```javascript
import dva from 'dva'
import createLoading from 'dva-loading'
import createHistory from 'history/createHashHistory'
import { requireAll } from './common/util'
import './styles/global/cms-antd-theme.less'

// 批量引入model文件
const models = requireAll(require.context('./models', true, /model\.js$/))

// 1. Initialize
const app = dva({
    initialState: {},
    history: createHistory(),
})

// 2. Plugins 引入dva-loading
app.use(createLoading())

// 3. Model
Object.entries(models).forEach(([k, v]) => {
    app.model(v.model)
})

// 4. Router
app.router(require('./router').default)

// 5. Start
app.start('#root')
```

1. [dva](https://dvajs.com/api/#dva-api) 创建应用，返回 dva 实例
2. [dva.use](https://dvajs.com/api/#app-use-hooks) 配置 hooks 或者注册插件
3. [dva.model](https://dvajs.com/api/#app-model-model) 注册 model
4. [dva.router](https://dvajs.com/api/#app-router-history-app-routerconfig) 注册路由表
5. [dva.start](https://dvajs.com/api/#app-start-selector) 启动应用

### model

将model拆分到同一文件夹的不同文件中，既方便查找，又避免内容过多时单个model文件体量过大

#### `model.js`

```javascript
import { namespace } from './actions'
import reducers, { initState } from './reducers'
import effects from './effects'

export default {
    namespace,
    state: initState,
    reducers,
    effects,
    subscriptions: {
        setup({ history, dispatch }) {
            // 监听 history 变化，当进入 `/` 时触发 `load` action
            return history.listen(({ pathname }) => {
                console.log(pathname)
            })
        },
    },
}

```
* 分别从 `actions.js`, `reduces.js`, `effects.js` 中获取`namespace`, `reduces/initstate`, `reduces`, `effects`
* 有需要的话 `subscriptions` 也可以独立出来。

#### `actions.js`

```javascript
import { mapAction } from '../../common/util'

export const namespace = 'product'

const actions = {
    LIST: 'json|product/list',
    DELETE: false,
    ...
}

mapAction(actions, [namespace])

export default actions
```

定义 `namespace` , `actions` ，然后通过 `mapAction` 方法改造action
*  actions 如果是`同步`的，设置为 `false`, 如果是`异步`的，可以为请求地址【前缀为请求格式】
*  改造后 action 包含 `KEY`[命名], `VAL`[值], `URL`[请求的最终url], `OK`[异步操作成功action], `NOK`[异步操作失败action], `toString()`[拼接namespace及路径的action, dispatch用]

#### `effects`

通过 `mapActionToEffect` 方法生成 `异步action` 对应的 `effect`

```javascript
import actions from './actions'
import { mapActionToEffect } from '../../common/actionEffect'

// /**
//  * 重写effect
//  */
// effectify(
//     actions.LIST,
//     function* (action, { payload }, { put, call }) {
//         try {
//             // 调用 saveTodoToServer，成功后触发 `add` action 保存到 state
//             const data = yield call(post, action.VAL, { ...payload, type: 1 })
//             yield put({ type: action.OK, payload: data })
//         } catch (e) {
//             yield put({ type: action.NOK, message: e })
//             return [null, e]
//         }
//     },
// )

export default mapActionToEffect(actions)
```
* 默认会处理 `异步 action` 并触发新的 `OK/NOK` action
* 如果默认的处理方式不满足需求，可以通过 `effectify` 方法重写 `effect`

#### `reduces.js`

定义初始 `state` 值与 `reduce`

```javascript
import action from './actions'

export const initState = {
    list: [],
}
export default {
    [action.LIST.OK](state, { payload: list }) {
        return {
            ...state,
            list,
        }
    },
    [action.DELETE.KEY](state, { payload: { id } }) {
        return {
            ...state,
            list: state.list.filter(item => item.id !== id),
        }
    },
    ...
}
```
* `model 中 initState 优先级低于 index.js 中 initialState`
* `.OK/NOK` reducer 处理异步 action
* `.KEY` reducer 处理同步 action

#### `container.js`

容器修饰器，应用 `withRouter`, `Form`, `connect`, 封装 `state`, `dispatch`

```javascript
export default (formOpt, ...connectOpts) => {
    const chain = [withRouter]

    if (connectOpts.length === 2 || formOpt === true) {
        chain.push(Form.create(typeof formOpt === 'object' ? formOpt : {}))
    } else {
        connectOpts = [formOpt, ...connectOpts]
    }

    const [namespace, mapDispatchToProps] = connectOpts

    let mapState = state => ({ $app: state.app, $loading: state.loading })

    if (typeof namespace === 'string') {
        mapState = state => ({
            $app: state.app,
            $loading: state.loading.effects,
            ...state[namespace],
        })
    }

    const mapDispatch = dispatch => mapDispatchToProps((type, payload) => new Promise(resolve => {
        if (typeof type === 'object') {
            const { type: t, ...pd } = type
            resolve(dispatch({ type: `${t}`, payload: pd }))
        } else {
            resolve(dispatch({ type: `${type}`, payload }))
        }
    }))

    chain.push(connect(mapState, mapDispatch))

    return compose(...chain)
}
```
* 可在 `state` 中封装额外的信息，如全局应用信息 `$app`, 加载状态 `$loading`
* 入参简化处理，只传入2各参数默认应用 `Form.create`

#### `container`

页面容器，容器修饰器可以帮助我们快速生成页面容器

```javascript
import PRODUCT, { namespace } from '../models/products/actions'
import container from '../common/container'
...

@container(
    false,
    namespace,
    dispatch => ({
        listProduct: payload => dispatch(PRODUCT.LIST, payload),
        ...
    }),
)
export default class Products extends React.Component {
    ...
    componentDidMount() {
        this.props.listProduct().then(([res, e]) => {
            if (res) {
                message.success('列表加载完成！')
            } else {
                message.error(e.message || e)
            }
        })
    }
    ...
}
```

* `@container` 入参为2/3位，2个参数或者第一1个参数为 true 应用 `Form.create` , 第二个参数为 `namespace`, 第三个参数为 `mapDispatchToProps`
* `mapDispatchToProps` 封装的方法返回一个 `Promise` 对象，回调可以直接 .then 了~
* props 中封装的 `$loading` 包含了 effect 的加载状态，比如： $loading[`${PRODUCT.LIST}`] 就是列表信息的加载状态

## 不怎么友好的 [roadhog](https://github.com/sorrycc/roadhog/blob/master/README_zh-cn.md)

> Roadhog 是一个包含 `dev`、`build` 和 `test` 的命令行工具，他基于 [react-dev-utils](https://github.com/facebookincubator/create-react-app/tree/master/packages/react-dev-utils)，和 [create-react-app](https://github.com/facebookincubator/create-react-app) 的体验保持一致。你可以想象他为可配置版的 create-react-app。 ——官方介绍

#### `.webpackrc.js`
```javascript
export default {
    hash: true, //配置让构建产物文件名带 hash
    html: { // 配置 html-webpack-plugin 插件
        'template': './public/index.ejs',
    },
    proxy: { // 配置 webpack-dev-server 的 proxy 属性
        '/~': {
            target: 'http://localhost:3000',
            router: req => req.url.split('/')[1].replace('~', 'http://'),
            pathRewrite: path => path.replace(/^\/~[^\/]+/, ''),
        },
        '/mock': {
            target: 'http://localhost:3000',
            onProxyReq: req => {
                req.method = 'GET'
                req.setHeader('Access-Control-Allow-Origin', true)
            },
        },
        '/api': {
            target: 'http://mapleliu.com/api',
        },
    },
    copy: [ // 定义需要单纯做复制的文件列表
        {
            from: 'mock',
            to: 'mock',
        },
    ],
}
```
* 这是roadhog开放出来的配置项，具体可见官网介绍

#### `webpack.config.js`

除了官方配置，我们也可以修改 webpack.config.js

```javascript
module.exports = (webpackConfig, env) => {
    webpackConfig.module.rules.forEach(rule => {
        const { loader = '' } = rule
        if (loader.indexOf('url-loader') !== -1) {
            rule.exclude.push(/\.(yml|styl)$/i)
        }
    })

    webpackConfig.module.rules.unshift({
        test: /\.yml$/i,
        use: ['json-loader', 'yaml-loader'],
    })
    ...

    return webpackConfig
}
```
* `不好用`，比如要加入一个 rule ，需要先修改已有的 rule ，然后才能添加 rule ； 还有在这修改 `devServer` 是无效的【login-sso用不了】，还有更多的坑...
* `维护不足`，作者忙于新项目，这个项目基本没怎么维护了
* `解决方案`，手写 `webpack` 配置或者换个开发工具~

## 总结
* 拆分model到同一文件夹的不同文件中，既方便查找，又避免内容过多导致单个model文件体量多大
* 对 action, effect, reducer 做了封装/简化处理，更简单，好用，比如添加一个 test 页面最快只需要如下步骤：
    1. 在 `router.js` 中添加路由信息
    2. 复制 `model` 下 products 文件夹，并改名 test
    3. 修改 `actions.js` 中 `namespace` 为 test , 配置 `action` 信息
    4. 修改 `reduces.js` 中 `reduce` 信息
    5. 在 `container` 下创建页面容器，配置 `@container`
* 发请求可以 .then 了
* 加载状态可以直接去 $loading 中拿了

## 参考
* [dvajs.com](https://dvajs.com)
* [roadhog](https://github.com/sorrycc/roadhog/blob/master/README_zh-cn.md)
* [dva介绍](https://github.com/sorrycc/roadhog/blob/master/README_zh-cn.md)
* [知乎-如何评价前端应用框架 dva？](https://www.zhihu.com/question/51831855/answer/127746945)