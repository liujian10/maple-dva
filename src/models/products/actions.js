import { mapAction } from '../../common/util'

export const namespace = 'product'

const actions = {
    LIST: 'product/list',
    DELETE: false,
}

mapAction(actions, [namespace])

export default actions
