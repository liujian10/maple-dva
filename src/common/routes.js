import React from 'react'
import _ from 'lodash'
import { Redirect } from 'dva/router'
import { requireAll } from '@/common/util'

// page
import NotFound from '@/containers/NotFound'
import NoAuthority from '@/containers/NoAuthority'
// import Developing from '@/components/common/developing' // 开发中页面

const ROUTE_CONFIG = [
    {
        path: '/main',
        routes: [
            {
                path: '/home',
                name: '首页',
                meta: {
                    icon: 'board',
                    access: 'BOARD',
                },
            },
            {
                path: '/products',
                name: '工作',
                meta: {
                    icon: 'board',
                    access: 'BOARD_PRODUCT',
                },
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            visible: false,
        },
    },
    {
        path: '/no-authority',
        component: NoAuthority,
        meta: {
            visible: false,
        },
    },
    {
        path: '/404',
        component: NotFound,
        meta: {
            visible: false,
        },
    },
    {
        path: '/',
        exact: true,
        component: () => <Redirect to="/main" />,
        meta: {
            visible: false,
        },
    },
]

const containers = requireAll(require.context('@/containers', true, /^(.(?!Main))+\.js$/))

const getComponent = ({ path = '/', component, routes: subs }) => {
    let comp = null
    if (component) {
        if (typeof component === 'function') {
            comp = component
        } else if (_.get(containers, component)) {
            comp = _.get(containers, component)
        } else {
            comp = NotFound
        }
    } else {
        const parts = path.split('/').slice(1)
        if (subs) {
            comp = _.get(containers, [...parts, 'index'], NotFound)
        } else {
            const tail = parts.pop()
            comp = _.get(containers, [...parts, tail], NotFound)
        }
    }
    return comp
}

const hasAccess = (accessList, access) => access === '*'
    || accessList.filter(ac => (Array.isArray(access) ? access : [access]).includes(ac)).length > 0

export const getAccessRoutes = (accessList = [], routeList = []) =>
    routeList
        .filter(({ meta: { access = '*' } = {} }) => hasAccess(accessList, access))
        .map(route => ({
            ...route,
            routes: getAccessRoutes(accessList, route.routes),
        }))

export const getRoutes = (routeList = ROUTE_CONFIG, parentPath = '') =>
    routeList
    .map(route => {
        const { meta: { redirectToChild = true } = {} } = route
        const path = `${parentPath}${route.path || ''}`
        const childRoutes = route.routes ? getRoutes(route.routes, path) : []
        return ({
            ...route,
            path,
            component: getComponent({ ...route, path }),
            routes: childRoutes.length > 0 ? [
                ...childRoutes,
                {
                    component: () => <Redirect to={redirectToChild ? childRoutes[0].path : parentPath} />,
                    meta: {
                        visible: false,
                    },
                },
            ] : [],
        })
    })


export default getRoutes()
