import React from 'react'
import _ from 'lodash'
import { Switch, Route, Redirect } from 'dva/router'
import { requireAll } from '../common/util'

const routeConfig = [
    {
        path: '/index',
        label: '/index',
        component: 'IndexPage',
        meta: {
            group: 'IndexPage',
            icon: 'message_list',
            access: 'listMessagesForPage',
        },
    },
    {
        path: '/message',
        label: '消息管理',
        meta: {
            access: 'message',
        },
        subs: [
            {
                path: '/list',
                label: '消息列表',
                component: 'Route',
                meta: {
                    group: '消息设置',
                    icon: 'message_list',
                    access: 'listMessagesForPage',
                },
            }, {
                path: '/detail/:id',
                label: '消息详情',
                component: 'Route',
                meta: {
                    group: '消息设置',
                    visible: false,
                    access: 'getMessageDetails',
                },
            }, {
                path: '/create',
                label: '新建消息',
                component: 'Route',
                meta: {
                    group: '消息设置',
                    icon: 'new_message',
                    access: 'tryNewMessage',
                },
            }, {
                path: '/editor/:id',
                label: '编辑消息',
                component: 'Route',
                meta: {
                    visible: false,
                    group: '消息设置',
                    access: 'tryNewMessage',
                },
            },
        ],
    },
    {
        path: '/products',
        label: 'Products',
        component: 'Products',
        meta: {
            group: 'Products',
            icon: 'message_list',
            access: 'listMessagesForPage',
        },
    },
]

const routes = requireAll(require.context('../routes', false, /\.js$/))

const getComponent = ({ path, component, subs }) => {
    let comp = null
    if (component) {
        if (typeof component === 'function') {
            comp = component
        } else if (_.get(routes, component)) {
            comp = _.get(routes, component)
        } else {
            comp = routes.Route
        }
    } else {
        const parts = path.split('/').slice(1)
        if (subs) {
            comp = _.get(routes, [...parts, 'Route'], routes.Route)
        } else {
            const tail = parts.pop()
            comp = _.get(routes, [...parts, _.capitalize(tail)], routes.Route)
        }
    }
    return comp
}

const getBreadcrumbName = ({ label = '', meta: { group = '' } = {} }) =>
    `${group ? `${group} > ` : ''} ${label}`

const __cache = new Map()
const mapViewToRoutesAndLinks = (view, upperBreadcrumb) => {
    const { subs = [], path = '' } = view

    const breadcrumbName = `${upperBreadcrumb && upperBreadcrumb.trim() ? `${upperBreadcrumb} > ` : ''} ${getBreadcrumbName(view)}`

    if (__cache.has(path)) {
        return __cache.get(path)
    }

    const Routes = props => (
        <div {...{ className: 'routes-container', ...props }}>
            <Switch>
                {subs.map(sub => ({ ...sub, path: path + sub.path })).map(sub => {
                    const Comp = getComponent(sub)
                    return (<Route
                        key={sub.path}
                        path={sub.path}
                        render={ps => <Comp {...ps} view={mapViewToRoutesAndLinks(sub, breadcrumbName)} />}
                    />)
                })}
                {!!subs.length && <Redirect from={path} to={path + subs[0].path} />}
            </Switch>
        </div>
    )

    const routesAndLinks = { view, Routes, breadcrumbName }

    __cache.set(path, routesAndLinks)

    return routesAndLinks
}

export default mapViewToRoutesAndLinks({ subs: routeConfig })
