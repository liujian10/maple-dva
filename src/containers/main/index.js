import React from 'react'
import { renderRoutes } from 'react-router-config'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import { URLS } from '@/common/config'
import logo from '@/images/app/logo.svg'
import Menu from '@/components/common/menu'
import container from '@/common/container'
import { namespace } from '@/models/app/actions'

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

    onCollapse = collapsed => {
        this.setState({ collapsed })
    }

    render() {
        const { route: { routes }, user: { userName, nickname } } = this.props
        const { collapsed } = this.state
        const visibleRoutes = getVisibleRoutes(routes)
        return (
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
                    {Array.isArray(visibleRoutes) && visibleRoutes.length > 0 && (
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
                    <div className={style.content} style={{ marginLeft: collapsed ? 80 : 180 }}>
                        {renderRoutes(routes)}
                    </div>
                </Content>
            </Layout>
        )
    }
}

export default Main
