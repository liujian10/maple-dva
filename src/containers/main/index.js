import React from 'react'
import { renderRoutes } from 'react-router-config'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import { URLS } from '@/common/config'
import { hasChildInArr } from '@/common/util'
import logo from '@/images/app/logo.svg'
import Menu from '@/components/common/menu'
import container from '@/common/container'
import NoAuthority from '@/components/common/NoAuthority'
import Loading from '@/components/common/loading'
import ACTION, { namespace } from '@/models/app/actions'
import { getAccessRoutes } from '@/common/routes'

import style from './index.styl'

const SIDE_UNFOLD_WIDTH = 180
const SIDE_FOLD_WIDTH = 80

const { Header, Content, Sider } = Layout

const getVisibleRoutes = routes => (Array.isArray(routes) && routes.length > 0 ? routes
    .filter(({ meta: { visible = true } = {} }) => !!visible)
    .map(route => {
        const childRoutes = getVisibleRoutes(route.routes)
        return ({
            ...route,
            routes: childRoutes.length === 1 ? [] : childRoutes,
        })
    }) : [])

class Main extends React.Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
    }

    state = { collapsed: false }

    componentDidMount() {
        const { dispatch } = this.props
        dispatch(ACTION.USER).then(({ userName }) => {
            if (!userName) {
                this.gotoLogin()
            }
        }).catch(() => {
            this.gotoLogin()
        })
    }

    onCollapse = collapsed => {
        this.setState({ collapsed })
    }

    gotoLogin = () => {
        const { history } = this.props
        history.replace(URLS.login)
    }

    render() {
        const {
            $loading: { [ACTION.USER]: loading },
            route: { routes },
            user: { userName, nickname, privilegeList },
        } = this.props
        const { collapsed } = this.state
        const accessRoutes = getAccessRoutes(privilegeList, routes)
        const visibleRoutes = getVisibleRoutes(accessRoutes)
        const hasSider = hasChildInArr(visibleRoutes)
        const marginLeft = (hasSider && (collapsed ? SIDE_FOLD_WIDTH : SIDE_UNFOLD_WIDTH)) || 0
        return (
            <Loading loading={loading}>
                <Layout>
                    <Header className={style.header}>
                        <img src={logo} alt="Demo" />
                        {!!userName && (
                            <>
                                <div style={{ flex: 1, textAlign: 'right' }}>
                                    欢迎回来，
                                    {nickname || userName}
                                    ！
                                </div>
                                <div className={style.btn_logout} onClick={this.gotoLogin}>退出</div>
                            </>
                        )}
                    </Header>
                    <Content className={style.main}>
                        {hasSider && (
                            <Sider
                                width={SIDE_UNFOLD_WIDTH}
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
            </Loading>
        )
    }
}

export default container(false, namespace)(Main)
