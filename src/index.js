import dva from 'dva'
import createLoading from 'dva-loading'
import createHistory from 'history/createHashHistory'
import { requireAll } from './common/util'

import 'noform/dist/index.css'

import './styles/global/index.less'

const models = requireAll(require.context('./models', true, /model\.js$/))

// 1. Initialize
const app = dva({
    initialState: {},
    history: createHistory(),
})

// 2. Plugins
app.use(createLoading())

// 3. Model
Object.values(models).forEach(({ model }) => app.model(model))

// 4. Router
app.router(require('./router').default)

// 5. Start
app.start('#root')
