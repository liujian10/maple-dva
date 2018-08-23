import _ from 'lodash'
import { path2url } from '../common/util'
import actions from './url.yml'

(function mapAction(actionSet, prefix = []) {
    _.mapValues(actionSet, (v, k, obj) => {
        const action = prefix.concat(k)
        if (typeof v === 'object') {
            mapAction(v, action)
        } else {
            const fn = () => {}
            fn.toString = () => action.join('/')
            fn.CODE = v
            fn.API = action.join('/')
            fn.URL = v ? path2url(v).url : ''
            fn.OK = `${k}_OK`
            fn.NOK = `${k}_NOK`
            obj[k] = fn
        }
    })
}(actions))

export default actions
