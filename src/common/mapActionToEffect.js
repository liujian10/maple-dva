import { post } from './request'

function* base(action, { payload, callback = () => {} }, { put, call }) {
    try {
        // 调用 saveTodoToServer，成功后触发 `add` action 保存到 state
        const data = yield call(post, action.CODE, payload)
        yield put({
            type: action.OK, payload: data,
        })
        callback(null, data, payload)
    } catch (e) {
        callback(e, null, payload)
        yield put({ type: action.NOK, message: e })
    }
}

const mapActionToEffect = (actions, effects) => {
    Object.entries(actions).forEach(([k, v]) => {
        if (typeof v === 'object') {
            mapActionToEffect(v, effects)
        } else {
            effects[k] = [
                function* (action, saga) {
                    if (v.CODE) {
                        yield base(v, action, saga)
                    } else {
                        yield saga.put({
                            type: v.OK,
                            payload: action.payload,
                        })
                    }
                }, { type: 'takeLatest' },
            ]
        }
    })
}

const getEffectByAction = action => {
    const effects = {}
    mapActionToEffect(action, effects)
    return effects
}

export default getEffectByAction
