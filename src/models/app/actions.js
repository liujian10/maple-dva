import { mapAction } from '../../common/util'

export const namespace = 'app'

const actions = {
    USER: 'json|app/user',
    LOGIN: 'app/login',
    LOGOUT: 'app/logout',
    SET_STATE: false,
}

mapAction(actions, [namespace])

export default actions
