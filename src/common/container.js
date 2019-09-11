import { Form } from 'antd'
import { connect } from 'dva'
import { withRouter } from 'dva/router'
import { compose } from '../common/util'

export default (formOpt, namespace, ...connectOpts) => {
    const chain = [withRouter]

    if (formOpt) {
        chain.push(Form.create(typeof formOpt === 'object' ? formOpt : {}))
    }

    const [
        mapStateToProps = () => { },
        mapDispatchToProps = () => { },
    ] = connectOpts || []

    const mapState = state => {
        console.log('state:', state)
        return ({
            $app: state.app,
            $loading: {
                ...state.loading,
                ...state.loading.models,
                ...state.loading.effects,
            },
            ...(typeof namespace === 'string' ? state[namespace] : {}),
            ...mapStateToProps(state),
        })
    }

    const dispatchHadnler = dispatch => (type, payload) => {
        if (typeof type === 'object') {
            const { type: t, ...pd } = type
            return dispatch({ type: `${t}`, payload: pd })
        } else {
            return dispatch({ type: `${type}`, payload })
        }
    }

    const mapDispatch = dispatch => ({
        ...mapDispatchToProps(dispatchHadnler(dispatch)),
        dispatch: dispatchHadnler(dispatch),
    })

    chain.push(connect(mapState, mapDispatch))

    return compose(...chain)
}

