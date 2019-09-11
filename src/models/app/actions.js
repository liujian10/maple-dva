import { mapAction } from '../../common/util'

export const namespace = 'app'

const actions = {
    USER: 'app/user',
    SET_STATE: false,
}

mapAction(actions, [namespace])

export default actions
