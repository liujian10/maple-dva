import { namespace } from './actions'
import reducers, { initState } from './reducers'
import effects from './effects'

export default {
    namespace,
    state: initState,
    reducers,
    effects,
}
