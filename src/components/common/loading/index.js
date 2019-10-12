import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import styles from './index.styl'

const Loading = ({
    className, loading = true, children, ...others
}) => (loading ? (
    <div className={`${styles.loading} ${className}`} {...others}>
        <Spin size="large" />
        <div className={styles.loading_text}>Loading...</div>
    </div>
) : children)

Loading.defaultProps = {
    loading: true,
    style: {},
    className: '',
}

Loading.propTypes = {
    loading: PropTypes.bool,
    style: PropTypes.object,
    className: PropTypes.string,
}

export default Loading
