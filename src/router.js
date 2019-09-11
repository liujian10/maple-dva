import React from 'react'
import { routerRedux } from 'dva/router'
import View from '@/containers/View'

const { ConnectedRouter } = routerRedux

export default ({ history, ...others }) => (
    <ConnectedRouter history={history}>
        <View {...others} />
    </ConnectedRouter>
)
