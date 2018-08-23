import React from 'react'
import propTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import router from './common/router'

const { ConnectedRouter } = routerRedux

function RouterConfig({ history, app }) {
    return (
        <ConnectedRouter history={history}>
            <router.Routes app={app} />
        </ConnectedRouter>
    )
}

RouterConfig.defaultProps = {
    app: {},
}

RouterConfig.propTypes = {
    app: propTypes.object,
}

export default RouterConfig
