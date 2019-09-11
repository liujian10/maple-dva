import React from 'react'
import propTypes from 'prop-types'
import { Spin } from 'antd'
import { hot } from 'react-hot-loader'
import Container from '@/common/container'
import ACTION, { namespace } from '@/models/app/actions'
import { renderRoutes } from 'react-router-config'
import { getAccessRoutes } from '@/common/routers'

import styles from './View.styl'

@Container(false, namespace)
class View extends React.Component {
    state = {}

    componentDidMount() {
        this.props.dispatch(ACTION.USER).then(res => {
            console.log('user res', res)
        }).catch(err => {
            console.error('user err', err)
            this.props.history.push('/demo')
        })
    }

    render() {
        const {
            $loading: { [ACTION.USER]: loading },
            user: { privilegeList },
        } = this.props
        const routes = getAccessRoutes(privilegeList)
        return (
            <div className={styles.view}>
                {loading || loading === undefined
                    ? <Spin />
                    : renderRoutes(routes)}
            </div>
        )
    }
}

View.defaultProps = {
    app: {},
}

View.propTypes = {
    app: propTypes.object,
}

export default hot(module)(View)
