import React from 'react'
import PropTypes from 'prop-types'
import ICON_EMPTY from '@/images/page/empty.svg'

import styles from './index.styl'

const Empty = props => (
    <div className={styles.none} style={{ height: props.height, ...props.style }}>
        <img src={ICON_EMPTY} alt="empty" />
        <div>{props.text}</div>
    </div>
)

Empty.defaultProps = {
    height: '100%',
    text: '暂无数据',
    style: {},
}

Empty.propTypes = {
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    style: PropTypes.object,
}

export default Empty
