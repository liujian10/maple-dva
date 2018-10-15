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
