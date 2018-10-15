import action from './actions'

export const initState = {
    list: [],
}
export default {
    [action.DELETE.KEY](state, { payload: { id } }) {
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
