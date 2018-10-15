import _ from 'lodash'
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

    const mapDispatch = dispatch => mapDispatchToProps((type, payload, callback = _.noop) => {
        if (typeof type === 'object') {
            const { type: t, callback: cb = _.noop, ...pd } = type
            dispatch({ type: `${t}`, payload: pd, callback: cb })
        } else {
            dispatch({ type: `${type}`, payload, callback })
        }
    })

    chain.push(connect(mapState, mapDispatch))

    return compose(...chain)
}

