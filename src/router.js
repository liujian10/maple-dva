import React from 'react'
import { ConfigProvider } from 'antd'
import { routerRedux } from 'dva/router'
import { hot } from 'react-hot-loader'
import { renderRoutes } from 'react-router-config'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import routes from '@/common/routes'

const { ConnectedRouter } = routerRedux

const View = hot(module)(() => renderRoutes(routes))

export default ({ history, ...others }) => (
    <ConnectedRouter history={history}>
        <ConfigProvider locale={zhCN}>
            <View {...others}/>
        </ConfigProvider>
    </ConnectedRouter>
)
