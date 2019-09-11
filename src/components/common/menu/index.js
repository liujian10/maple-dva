import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { Menu } from 'antd'
import { requireAll } from '@/common/util'

import style from './index.styl'

const icons = requireAll(require.context('@/images/app', true, /^.+\.png$/))

const { Item, SubMenu } = Menu

const getIconSrcByMenu = menu => {
    const { meta: { icon } = {}, path, name } = menu
    const { location: { hash } } = window
    return (icon
        ? <img src={icons[`nav_${icon}_${hash.replace('#', '').startsWith(path) ? 0 : 1}`]} alt={name} />
        : null)
}

const getKeysByHash = () => {
    const { location: { hash } } = window
    return hash.replace('#', '').split('/').reduce((res, key) => {
        if (key) {
            res.push(`${[...res].pop() || ''}/${key}`)
        }
        return res
    }, [])
}

export default class Main extends React.Component {
    static propTypes = {
        menus: PropTypes.array.isRequired,
    }

    constructor(props) {
        super(props)
        this.state = {};
        [, ...this.defaultOpenKeys] = getKeysByHash().reverse()
    }

    renderMenuItem = menu => (Array.isArray(menu.routes) && menu.routes.length > 0 ? (
        <SubMenu
            key={menu.path}
            title={(
                <span className={style.menu}>
                    {getIconSrcByMenu(menu)}
                    <span>{menu.name}</span>
                </span>
            )}
        >
            {menu.routes.map(item => this.renderMenuItem(item))}
        </SubMenu>
    ) : (
        <Item
            className={style.menu}
            key={menu.path}
        >
            <NavLink
                title={menu.name}
                to={menu.path}
                exact={!!menu.exact}
            >
                {getIconSrcByMenu(menu)}
                <span>{menu.name}</span>
            </NavLink>
        </Item>
    ))

    render() {
        const { menus } = this.props
        const selectedKeys = getKeysByHash()
        return (
            <Menu
                theme="dark"
                mode="inline"
                className={style.main}
                selectedKeys={selectedKeys}
                defaultOpenKeys={this.defaultOpenKeys}
            >
                {menus.map(menu => this.renderMenuItem(menu))}
            </Menu>
        )
    }
}
