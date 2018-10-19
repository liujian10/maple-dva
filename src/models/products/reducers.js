import action from './actions'

export const initState = {
    list: [],
    types: [],
}
export default {
    [action.LIST.OK](state, { payload: list }) {
        return {
            ...state,
            list,
        }
    },
    [action.TYPES.OK](state, { payload: types }) {
        return {
            ...state,
            types,
        }
    },
    [action.DELETE.KEY](state, { payload: { id } }) {
        return {
            ...state,
            list: state.list.filter(item => item.id !== id),
        }
    },
    [action.UPDATE.KEY](state, { payload }) {
        const { id: curId } = payload
        let newList = []
        if (curId) {
            newList = state.list.map(item => (item.id === curId ? payload : item))
        } else {
            let newId = 0
            state.list.forEach(({ id }) => {
                if (id >= newId) {
                    newId = id + 1
                }
            })
            newList = [].concat(state.list, { ...payload, id: newId })
        }
        return {
            ...state,
            list: newList,
        }
    },
}
