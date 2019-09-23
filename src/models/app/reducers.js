import { reducerHandler } from '@/common/util'
import action from './actions'

export const initState = {
    user: {},
}
export default reducerHandler({
    [action.USER.OK]: (state, { payload: user }) => {
        return {
            ...state,
            user,
        }
    },
    [action.LOGIN.OK]: (state, { payload: user }) => {
        return {
            ...state,
            user,
        }
    },
    [action.LOGOUT.OK]: state => {
        return {
            ...state,
            user: {},
        }
    },
    [action.SET_STATE]: (state, { payload }) => {
        return {
            ...state,
            ...payload,
        }
    },
})
