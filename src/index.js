import dva from 'dva'
import createLoading from 'dva-loading'
import createHistory from 'history/createHashHistory'
import { requireAll } from './common/util'
import './index.css'

const models = requireAll(require.context('./models', false, /\.js$/))

// 1. Initialize
const app = dva({
    initialState: {},
    history: createHistory(),
})

// 2. Plugins
app.use(createLoading())

// 3. Model
Object.entries(models).forEach(([k, v]) => {
    app.model(v)
})

// 4. Router
app.router(require('./router').default)

// 5. Start
app.start('#root')
