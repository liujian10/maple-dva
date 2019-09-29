import { Form } from 'antd'
import { connect } from 'dva'
import { withRouter } from 'dva/router'

import { compose } from './util'

export default (formOpt, namespace, ...connectOpts) => {
    const chain = [withRouter]

    if (formOpt) {
        chain.push(Form.create(typeof formOpt === 'object' ? formOpt : {}))
    }

    const [
        mapStateToProps = () => { },
        mapDispatchToProps = () => { },
    ] = connectOpts || []

    const mapState = state => ({
        $app: state.app,
        $loading: {
            ...state.loading,
            ...state.loading.models,
            ...state.loading.effects,
        },
        ...(typeof namespace === 'string' ? state[namespace] : {}),
        ...mapStateToProps(state),
    })

    const dispatchHandler = dispatch => (type, payload) => {
        if (typeof type === 'object') {
            const { type: t, ...pd } = type
            return dispatch({ type: `${t}`, payload: pd })
        }
        return dispatch({ type: `${type}`, payload })
    }

    const mapDispatch = dispatch => ({
        ...mapDispatchToProps(dispatchHandler(dispatch)),
        dispatch: dispatchHandler(dispatch),
    })

    chain.push(connect(mapState, mapDispatch))

    return compose(...chain)
}
