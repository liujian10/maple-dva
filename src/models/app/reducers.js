import { reducerHandler } from '@/common/util'
import action from './actions'

export const initState = {
    list: [],
    types: [],
    submitLoading: false,
}
export default reducerHandler({
    [action.USER](state, { payload: list }) {
        return {
            ...state,
            list,
        }
    },
    [action.SET_STATE](state, { payload }) {
        return {
            ...state,
            ...payload,
        }
    },
})
