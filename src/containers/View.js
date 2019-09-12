import React from 'react'
import { hot } from 'react-hot-loader'
import { renderRoutes } from 'react-router-config'
import routes from '@/common/routes'

import styles from './View.styl'

const View = () => (
    <div className={styles.view}>
        {renderRoutes(routes)}
    </div>
)

export default hot(module)(View)
