import { mapAction } from '../../common/util'

export const namespace = 'product'

const actions = {
    LIST: 'product/list',
    TYPES: 'product/types',
    UPDATE: false,
    DELETE: false,
}

mapAction(actions, [namespace])

export default actions
