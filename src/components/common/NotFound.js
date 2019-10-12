import React from 'react'
import { Icon } from 'antd'

export default props => (
    <div style={{ color: '#333', display: 'flex', alignItems: 'flex-end' }}>
        <Icon type="bug" theme="twoTone" style={{ fontSize: 80 }} />
        <div style={{ fontSize: 30, marginLeft: 10 }}>404</div>
    </div>
)
