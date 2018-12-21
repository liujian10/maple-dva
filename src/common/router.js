import React from 'react'
import _ from 'lodash'
import { Switch, Route, Redirect } from 'dva/router'
import { requireAll } from '../common/util'
import '../styles/global/layout.styl'

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
        path: '/products',
        label: 'Products',
        component: 'Products',
        meta: {
            group: 'Products',
            icon: 'message_list',
            access: 'listMessagesForPage',
        },
    },
    {
        path: '/demo',
        label: 'demo',
        component: 'Demo',
    },
    {
        path: '/route',
        label: 'NotFound',
    },
]

const routes = requireAll(require.context('../containers', false, /\.js$/))

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
        <div className="routes-container" {...props}>
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
