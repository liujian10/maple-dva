import actions from './actions'
import { mapActionToEffect } from '../../common/actionEffect'

// /**
//  * 重写effect
//  */
// effectify(
//     actions.GET_TWJL_KNOWLEDGE_LIST,
//     function* (action, { payload, callback = () => {} }, { put, call }) {
//         try {
//             // 调用 saveTodoToServer，成功后触发 `add` action 保存到 state
//             const data = yield call(post, action.VAL, payload)
//             yield put({ type: action.OK, payload: data })
//             callback(null, data, payload)
//         } catch (e) {
//             callback(e, null, payload)
//             yield put({ type: action.NOK, message: e })
//         }
//     },
// )

export default mapActionToEffect(actions)
