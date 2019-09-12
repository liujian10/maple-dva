import React from 'react'
import { renderRoutes } from 'react-router-config'
import PropTypes from 'prop-types'
import { Layout, Spin } from 'antd'
import { URLS } from '@/common/config'
import { hasChildInArr } from '@/common/util'
import logo from '@/images/app/logo.svg'
import Menu from '@/components/common/menu'
import container from '@/common/container'
import NoAuthority from '@/containers/NoAuthority'
import ACTION, { namespace } from '@/models/app/actions'
import { getAccessRoutes } from '@/common/routes'

import style from './index.styl'

const { Header, Content, Sider } = Layout

const logout = () => {
    window.location = `${URLS.logout}?pageUrl=${window.location.href}`
}

const getVisibleRoutes = routes => (Array.isArray(routes) && routes.length > 0 ? routes
    .filter(({ meta: { visible = true } = {} }) => !!visible)
    .map(route => {
        const childRoutes = getVisibleRoutes(route.routes)
        return ({
            ...route,
            routes: childRoutes.length === 1 ? [] : childRoutes,
        })
    }) : [])

@container(false, namespace)
class Main extends React.Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
    }

    state = { collapsed: false }

    componentDidMount() {
        const { dispatch, history } = this.props
        dispatch(ACTION.USER).then(({ userName }) => {
            console.log('user userName', userName)
            if(!userName){
                history.push('/login')
            }
        }).catch(err => {
            console.error('user err', err)
            history.push('/login')
        })
    }

    onCollapse = collapsed => {
        this.setState({ collapsed })
    }

    render() {
        const {
            $loading: { [ACTION.USER] : loading },
            route: { routes },
            user: { userName, nickname, privilegeList }
        } = this.props
        const { collapsed } = this.state
        const accessRoutes = getAccessRoutes(privilegeList, routes)
        const visibleRoutes = getVisibleRoutes(accessRoutes)
        const hasSider = hasChildInArr(visibleRoutes)
        const marginLeft = hasSider ? (collapsed ? 80 : 180) : 0
        return loading ? <Spin /> : (
            <Layout>
                <Header className={style.header}>
                    <img src={logo} alt="狮平台" />
                    {!!userName && (
                        <React.Fragment>
                            <div style={{ flex: 1, textAlign: 'right' }}>欢迎回来，{nickname || userName}！</div>
                            <div className={style.btn_logout} onClick={logout}>退出</div>
                        </React.Fragment>
                    )}
                </Header>
                <Content className={style.main}>
                    {hasSider && (
                        <Sider
                            width={180}
                            className={style.aside}
                            collapsible={true}
                            collapsed={collapsed}
                            onCollapse={this.onCollapse}
                        >
                            <Menu menus={visibleRoutes} />
                        </Sider>
                    )}
                    <div className={style.content} style={{ marginLeft }}>
                        {hasSider ? renderRoutes(accessRoutes) : <NoAuthority />}
                    </div>
                </Content>
            </Layout>
        )
    }
}

export default Main
