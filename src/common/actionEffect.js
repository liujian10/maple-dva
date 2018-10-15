import { post } from './request'

function* base(action, { payload }, { put, call }) {
    try {
        // 调用 saveTodoToServer，成功后触发 `add` action 保存到 state
        const data = yield call(post, action.VAL, payload)
        yield put({ type: action.OK, payload: data })
        return [data, payload, null]
    } catch (e) {
        yield put({ type: action.NOK, message: e })
        return [null, payload, e]
    }
}

export const effectify = (v, handler = base, type = 'takeLatest') => {
    if (v.effect) {
        console.log(`${v.type}'s effect already registered!`)
    } else {
        v.effect = [
            function* (action, saga) {
                return yield handler(v, action, saga)
            }, { type },
        ]
    }
    return v.effect
}

export const mapActionToEffect = (actions, effects = {}) => {
    Object.entries(actions).forEach(([k, v]) => {
        if (typeof v === 'object') {
            mapActionToEffect(v, effects)
        } else if (v.effect) {
            effects[k] = v.effect
        } else if (v.VAL) {
            effects[k] = effectify(v)
        }
    })
    return effects
}
