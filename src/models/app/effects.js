import actions from './actions'
import { mapActionToEffect } from '../../common/actionEffect'

// /**
//  * 重写effect
//  */
// effectify(
//     actions.LIST,
//     function* (action, { payload }, { put, call }) {
//         try {
//             // 调用 saveTodoToServer，成功后触发 `add` action 保存到 state
//             const data = yield call(post, action.VAL, { ...payload, type: 1 })
//             yield put({ type: action.OK, payload: data })
//         } catch (e) {
//             yield put({ type: action.NOK, message: e })
//             return [null, e]
//         }
//     },
// )

export default mapActionToEffect(actions)
