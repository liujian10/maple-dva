import { Form } from 'antd'
import { connect } from 'dva'
import { withRouter } from 'dva/router'
import { compose } from '../common/util'

export default (formOpt, ...connectOpts) => {
    const chain = [withRouter]

    if (connectOpts.length === 2 || formOpt === true) {
        chain.push(Form.create(typeof formOpt === 'object' ? formOpt : {}))
    } else {
        connectOpts = [formOpt, ...connectOpts]
    }

    const [namespace, mapDispatchToProps] = connectOpts

    let mapState = state => ({ $app: state.app, $loading: state.loading })

    if (typeof namespace === 'string') {
        mapState = state => ({
            $app: state.app,
            $loading: state.loading.effects,
            ...state[namespace],
        })
    }

    const mapDispatch = dispatch => mapDispatchToProps((type, payload) => new Promise(resolve => {
        if (typeof type === 'object') {
            const { type: t, ...pd } = type
            resolve(dispatch({ type: `${t}`, payload: pd }))
        } else {
            resolve(dispatch({ type: `${type}`, payload }))
        }
    }))

    chain.push(connect(mapState, mapDispatch))

    return compose(...chain)
}

