import React from 'react'
import propTypes from 'prop-types'
import { Spin } from 'antd'
import Container from '@/common/container'
import router from '@/common/router'
import ACTION, { namespace } from '@/models/app/actions'

import styles from './View.styl'

@Container(false, namespace)
class View extends React.Component {
    state = {}

    componentDidMount() {
        this.props.dispatch(ACTION.USER).then(res => {
            console.log('user res', res)
        }).catch(err => {
            console.error('user err', err)
        })
    }

    render() {
        const { app, $loading } = this.props
        const loading = $loading.get(ACTION.USER)
        console.log(loading)
        return (
            <div className={styles.view}>
                {loading || loading === undefined ? <Spin /> : <router.Routes app={app} />}
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

export default View
