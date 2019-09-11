import React from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { routerRedux } from 'dva/router'
import View from '@/containers/View'

const { ConnectedRouter } = routerRedux

export default ({ history, ...others }) => (
    <ConnectedRouter history={history}>
        <ConfigProvider locale={zhCN}>
            <View {...others}/>
        </ConfigProvider>
    </ConnectedRouter>
)
