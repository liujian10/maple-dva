import actions from '../constants/actions'
import getEffectByAction from '../common/mapActionToEffect'

const namespace = 'products'

const action = actions[namespace]

const reducers = {
    [action.DELETE.OK](state, { payload: id }) {
        return {
            ...state,
            list: state.list.filter(item => item.id !== id),
        }
    },
    [action.LIST.OK](state, { payload: list }) {
        return {
            ...state,
            list,
        }
    },
}

const effects = getEffectByAction(action)

export default {
    namespace,
    state: {
        list: [],
    },
    reducers,
    effects,
}
